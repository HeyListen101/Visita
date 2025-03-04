import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const ENV = process.env.NODE_ENV || "dev";
const envFile = {
  dev: "dev.env",
  test: "test.env",
  prod: "prod.env",
}[ENV];
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Initialize Supabase Client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
