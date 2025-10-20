import postgres from "postgres";
import { env } from "../lib/env";

async function main() {
  if (!env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const sql = postgres(env.DATABASE_URL, { ssl: "require" as any });
  try {
    console.log(
      "Running ALTER ... USING to convert columns to uuid where necessary..."
    );

    const statements = [
      `ALTER TABLE posts_to_categories ALTER COLUMN post_id SET DATA TYPE uuid USING post_id::uuid;`,
      `ALTER TABLE posts_to_categories ALTER COLUMN category_id SET DATA TYPE uuid USING category_id::uuid;`,
      `ALTER TABLE categories ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;`,
      `ALTER TABLE categories ALTER COLUMN id SET DEFAULT gen_random_uuid();`,
      `ALTER TABLE posts ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;`,
      `ALTER TABLE posts ALTER COLUMN id SET DEFAULT gen_random_uuid();`,
    ];

    for (const stmt of statements) {
      try {
        console.log("Executing:", stmt);
        await sql.unsafe(stmt);
      } catch (err) {
        const e: any = err;
        console.warn(
          "Statement failed (continuing):",
          stmt,
          "\nError:",
          e.message ?? e
        );
      }
    }

    console.log("Done applying explicit UUID conversions.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to run conversions:", err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 0 });
  }
}

main();
