import { getDb } from "../lib/db";
import { posts } from "../lib/db/schema";

async function main() {
  try {
    const db = getDb();
    const result = await db.select().from(posts).limit(1);
    console.log("DB connection successful! Sample result:", result);
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

main();
