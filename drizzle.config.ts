// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Load .env.local

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use the connection string Vercel provides
    url: process.env.POSTGRES_URL!,
  },
  // Needed for Vercel Postgres
  strict: true,
} satisfies Config;
