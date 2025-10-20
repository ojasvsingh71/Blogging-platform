import postgres from "postgres";
import { env } from "../lib/env";

async function main() {
  if (!env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const sql = postgres(env.DATABASE_URL, { ssl: "require" as any });
  try {
    console.log("Truncating posts table (this will delete all posts)...");
    await sql`TRUNCATE TABLE posts CASCADE;`;
    console.log("Truncate completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to truncate posts table:", err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 0 });
  }
}

main();
