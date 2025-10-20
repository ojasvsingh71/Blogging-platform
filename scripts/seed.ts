import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/lib/env";
import { categories, posts, postsToCategories } from "@/lib/db/schema";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Initialize the database connection
const sql = postgres(env.DATABASE_URL, { ssl: "require" });
const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");

  try {
    // Insert sample categories
    const sampleCategories = [
      {
        name: "Technology",
        slug: "technology",
        description: "Tech-related posts",
      },
      { name: "Travel", slug: "travel", description: "Travel experiences" },
      { name: "Food", slug: "food", description: "Food and recipes" },
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(sampleCategories)
      .returning();

    // Insert sample posts
    const samplePosts = [
      {
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        content: "Next.js is a powerful React framework...",
        excerpt: "Learn the basics of Next.js",
        published: true,
        authorName: "John Doe",
      },
      {
        title: "Exploring Japan",
        slug: "exploring-japan",
        content: "Japan is a fascinating country...",
        excerpt: "A journey through Japan",
        published: true,
        authorName: "Jane Smith",
      },
    ];

    const insertedPosts = await db
      .insert(posts)
      .values(samplePosts)
      .returning();

    // Create relationships between posts and categories
    const relationships = [
      { postId: insertedPosts[0].id, categoryId: insertedCategories[0].id },
      { postId: insertedPosts[1].id, categoryId: insertedCategories[1].id },
    ];

    await db.insert(postsToCategories).values(relationships);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
