import postgres from "postgres";
import { env } from "../lib/env";

async function main() {
  if (!env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const sql = postgres(env.DATABASE_URL, { ssl: "require" as any });
  try {
    console.log("Creating extension pgcrypto (if not exists)...");
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
    console.log("Extension created or already exists.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create extension:", err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 0 });
  }
}

main();
