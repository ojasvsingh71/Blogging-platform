import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";
import { env } from "../env";

let _db: any = null;

function createDb(): any {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set DATABASE_URL in your environment to use the database."
    );
  }

  const client = postgres(env.DATABASE_URL);
  return drizzle(client, { schema });
}

// Lazy getter so importing `db` doesn't immediately attempt to connect.
export const getDb = (): any => {
  if (!_db) {
    _db = createDb();
  }
  return _db;
};

// Backwards-compatible export: `db` will call getDb() and may throw if no URL.
export const db = new Proxy(
  {},
  {
    get: (_target, prop) => {
      const real = getDb();
      // @ts-ignore delegate to the real db
      return (real as any)[prop];
    },
  }
);
