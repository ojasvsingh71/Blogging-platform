import postgres from "postgres";
import { env } from "../lib/env";
import { randomUUID } from "crypto";

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const sql = postgres(env.DATABASE_URL, { ssl: "require" as any });

async function main() {
  console.log("Starting non-destructive migration to UUID primary keys...");
  try {
    // Ensure pgcrypto exists for gen_random_uuid if needed (we created earlier)
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

    // Use proper transaction API
    await sql.begin(async (sql) => {
      // Create new tables (without foreign keys initially)
      console.log("Creating new tables...");
      await sql`
      CREATE TABLE IF NOT EXISTS categories_new (
        id uuid PRIMARY KEY,
        name text NOT NULL,
        slug text NOT NULL,
        description text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `;

      await sql`
      CREATE TABLE IF NOT EXISTS posts_new (
        id uuid PRIMARY KEY,
        title text NOT NULL,
        slug text NOT NULL,
        content text NOT NULL,
        excerpt text NOT NULL DEFAULT '',
        published boolean NOT NULL DEFAULT false,
        author_name text NOT NULL DEFAULT 'Anonymous',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `;

      await sql`
      CREATE TABLE IF NOT EXISTS posts_to_categories_new (
        id uuid PRIMARY KEY,
        post_id uuid NOT NULL,
        category_id uuid NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `;

      // Copy categories
      console.log("Copying categories...");
      const categoriesRows = await sql`SELECT * FROM categories;`;
      const catMap = new Map<string, string>(); // old_id(string) -> new_id(uuid)
      for (const r of categoriesRows) {
        const oldId = String(r.id);
        const newId = randomUUID();
        catMap.set(oldId, newId);
        await sql`
        INSERT INTO categories_new (id, name, slug, description, created_at, updated_at)
        VALUES (${newId}, ${r.name}, ${r.slug}, ${r.description ?? ""}, ${
          r.created_at
        }, ${r.updated_at});
      `;
      }

      // Copy posts
      console.log("Copying posts...");
      const postsRows = await sql`SELECT * FROM posts;`;
      const postMap = new Map<string, string>();
      for (const r of postsRows) {
        const oldId = String(r.id);
        const newId = randomUUID();
        postMap.set(oldId, newId);
        await sql`
        INSERT INTO posts_new (id, title, slug, content, excerpt, published, author_name, created_at, updated_at)
        VALUES (${newId}, ${r.title}, ${r.slug}, ${r.content}, ${
          r.excerpt ?? ""
        }, ${r.published}, ${r.author_name ?? "Anonymous"}, ${r.created_at}, ${
          r.updated_at
        });
      `;
      }

      // Copy posts_to_categories
      console.log("Copying posts_to_categories...");
      const ptcRows = await sql`SELECT * FROM posts_to_categories;`;
      for (const r of ptcRows) {
        const oldPostId = String(r.post_id);
        const oldCategoryId = String(r.category_id);
        const newPostId = postMap.get(oldPostId);
        const newCategoryId = catMap.get(oldCategoryId);
        const newId = randomUUID();
        if (!newPostId || !newCategoryId) {
          console.warn(
            "Skipping mapping for posts_to_categories row with missing mapping",
            r
          );
          continue;
        }
        await sql`
        INSERT INTO posts_to_categories_new (id, post_id, category_id, created_at)
        VALUES (${newId}, ${newPostId}, ${newCategoryId}, ${r.created_at});
      `;
      }

      // Create indexes and constraints on new tables
      console.log("Creating indexes and constraints on new tables...");
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS categories_name_unique_new ON categories_new (name);`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique_new ON categories_new (slug);`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique_new ON posts_new (slug);`;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS unique_post_category_new ON posts_to_categories_new (post_id, category_id);`;

      // Add foreign key constraints
      await sql`
      ALTER TABLE posts_to_categories_new
      ADD CONSTRAINT posts_to_categories_post_id_posts_id_fk_new FOREIGN KEY (post_id) REFERENCES posts_new(id) ON DELETE CASCADE;
    `;
      await sql`
      ALTER TABLE posts_to_categories_new
      ADD CONSTRAINT posts_to_categories_category_id_categories_id_fk_new FOREIGN KEY (category_id) REFERENCES categories_new(id) ON DELETE CASCADE;
    `;

      // Backup old tables by renaming
      console.log("Renaming old tables to backups...");
      await sql`ALTER TABLE IF EXISTS posts_to_categories RENAME TO posts_to_categories_old;`;
      await sql`ALTER TABLE IF EXISTS posts RENAME TO posts_old;`;
      await sql`ALTER TABLE IF EXISTS categories RENAME TO categories_old;`;

      // Rename new tables to original names
      console.log("Renaming new tables to original names...");
      await sql`ALTER TABLE categories_new RENAME TO categories;`;
      await sql`ALTER TABLE posts_new RENAME TO posts;`;
      await sql`ALTER TABLE posts_to_categories_new RENAME TO posts_to_categories;`;

      console.log(
        "Migration complete. Old tables were renamed with _old suffix. Verify data and drop backups when ready."
      );
    }); // End of transaction block

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 0 });
  }
}

main();
