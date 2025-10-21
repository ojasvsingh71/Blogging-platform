import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazily initialize Supabase client to avoid build-time failures when
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set
// (e.g., during static build or in environments without Supabase).
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the environment to use Supabase features."
    );
  }

  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

const connectionString = process.env.DATABASE_URL;

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDb = () => {
  if (!_db) {
    if (!connectionString) {
      console.warn(
        "DATABASE_URL not configured - database operations will fail"
      );
      throw new Error("DATABASE_URL is not configured.");
    }
    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
};

export const db = getDb();
export const dbSchema = schema;

// import { drizzle, type DrizzleClient } from "drizzle-orm/postgres-js";	import { createClient } from "@supabase/supabase-js";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import postgres from "postgres";
// import * as schema from "./schema";	import * as schema from "./schema";
// import { env } from "../env";

// // Lazy client initialization (optional)	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// let _db: DrizzleClient<typeof schema> | null = null;	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// export const getDb = (): DrizzleClient<typeof schema> => {	export const supabase = createClient(supabaseUrl, supabaseKey);

// const connectionString = process.env.DATABASE_URL;

// let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

// export const getDb = () => {
//   if (!_db) {	  if (!_db) {
//     if (!env.DATABASE_URL) {	    if (!connectionString) {
//       console.warn("DATABASE_URL not configured - database operations will fail");
//       throw new Error("DATABASE_URL is not configured.");	      throw new Error("DATABASE_URL is not configured.");
//     }	    }
//     const client = postgres(env.DATABASE_URL);	    const client = postgres(connectionString, {
//       max: 1,
//       idle_timeout: 20,
//       connect_timeout: 10,
//     });
//     _db = drizzle(client, { schema });	    _db = drizzle(client, { schema });
//   }	  }
//   return _db;	  return _db;
// };	};

// // Directly export typed db and schema
// export const db = getDb();	export const db = getDb();
// export const dbSchema = schema;
