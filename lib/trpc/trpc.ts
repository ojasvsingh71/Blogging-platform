import { initTRPC } from "@trpc/server";
import { getDb } from "@/lib/db";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

function createNoopDb() {
  const handler: ProxyHandler<any> = {
    get() {
      throw new Error(
        "Database not configured. Set DATABASE_URL in your environment to enable DB access."
      );
    },
  };
  return new Proxy({}, handler) as any;
}

export const createContext = async (_opts: FetchCreateContextFnOptions) => {
  let dbInstance: any;
  try {
    dbInstance = getDb();
  } catch (err) {
    // In dev, don't crash the import — return a noop db that throws when used.
    dbInstance = createNoopDb();
  }

  return {
    db: dbInstance,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
