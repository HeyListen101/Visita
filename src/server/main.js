import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import path from "path";
import createAuthRouter from "./api/authentication.js";

{ /* Configure which ENV to use */ } 
const ENV = process.env.NODE_ENV || "dev";
const envFile = {
  dev: "dev.env",
  test: "test.env",
  prod: "prod.env",
}[ENV];
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

{ /* Create the express server */ }
const app = express();

{ /* Let the express server use JSON (Primarily for debugging) */ } 
app.use(express.json());


{ /* Create an AuthRouter (The method I found to pass env vars 
  inside the authentication router instead of re-implementing
  env var checking) */ } 
const authRoutes = createAuthRouter(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  process.env.VITE_BASE_URL,
);

{ /* Bridge to get to /auth/login-method */ }
app.use("/auth", authRoutes);

{ /* Create an endpoint for the front end to call to retrieve env vars */ } 
app.get('/api/env', (req, res) => {
  res.json({
    SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID,
    VITE_GOOGLE_CLIENT_SECRET: process.env.VITE_GOOGLE_CLIENT_SECRET,
    VITE_BASE_URL: process.env.VITE_BASE_URL
  })
});

{ /* Listen at port 3000 for the server */ }
ViteExpress.listen(app, 3000, () =>
  console.log("Server has served on http://localhost:3000!")
);