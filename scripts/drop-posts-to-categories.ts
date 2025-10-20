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
      "Dropping table posts_to_categories (this will delete related mappings)..."
    );
    await sql`DROP TABLE IF EXISTS posts_to_categories CASCADE;`;
    console.log("Dropped posts_to_categories successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to drop posts_to_categories table:", err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 0 });
  }
}

main();
