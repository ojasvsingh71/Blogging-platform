import { drizzle, type DrizzleClient } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";

let _db: DrizzleClient<typeof schema> | null = null;

function createDb(): DrizzleClient<typeof schema> {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set DATABASE_URL in your environment to use the database."
    );
  }

  const client = postgres(env.DATABASE_URL);
  return drizzle(client, { schema });
}

// Lazy getter to avoid connecting immediately
export const getDb = (): DrizzleClient<typeof schema> => {
  if (!_db) {
    _db = createDb();
  }
  return _db;
};

// Export db with Proxy for backward compatibility
export const db = new Proxy(
  { schema }, // attach schema explicitly so you can do db.schema.posts
  {
    get: (_target, prop) => {
      const real = getDb();
      // @ts-ignore delegate to real db or fallback to schema
      return (real as any)[prop] ?? (_target as any)[prop];
    },
  }
);
