export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

// Only enforce DATABASE_URL in production builds.
// In development, allow it to be undefined so the dev server and pages that
// don't use the DB can still run. If a DB call is made while DATABASE_URL is
// missing, the error will surface there with a clearer stack.
if (!env.DATABASE_URL && env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL is required in production");
}
