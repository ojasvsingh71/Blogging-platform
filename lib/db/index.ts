import { drizzle, type DrizzleClient } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";

// Lazy client initialization (optional)
let _db: DrizzleClient<typeof schema> | null = null;

export const getDb = (): DrizzleClient<typeof schema> => {
  if (!_db) {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured.");
    }
    const client = postgres(env.DATABASE_URL);
    _db = drizzle(client, { schema });
  }
  return _db;
};

// Directly export typed db and schema
export const db = getDb();
export const dbSchema = schema;