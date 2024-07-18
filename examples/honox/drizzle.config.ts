import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

// Load env vars for Drizzle Studio - which allow us to view remote database
const envSchema = z.object({
  CF_ACCOUNT_ID: z.string(),
  CF_DATABASE_ID: z.string(),
  CF_TOKEN: z.string(),
});
const env = envSchema.parse(process.env);

export default defineConfig({
  dialect: "sqlite",
  schema: "./app/schema.ts",
  out: "./drizzle",
  verbose: true,
  strict: true,
  driver: "d1-http",
  dbCredentials: {
    accountId: env.CF_ACCOUNT_ID,
    databaseId: env.CF_DATABASE_ID,
    token: env.CF_TOKEN,
  },
});
