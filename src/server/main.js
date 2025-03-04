import express from "express";
import ViteExpress from "vite-express";
import { supabase } from "./api/supabaseClient.js"; // TODO: Fix the SupabaseClient because it's redundant; it should just be implemented here 
import dotenv from "dotenv";
import path from "path";

// Configure which ENV to use
const ENV = process.env.NODE_ENV || "dev";
const envFile = {
  dev: "dev.env",
  test: "test.env",
  prod: "prod.env",
}[ENV];
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const app = express();

// Google OAuth Route
app.get("/auth/google", async (req, res) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.BASE_URL}/auth/callback`, // Set your callback URL
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.redirect(data.url);
});

// Google OAuth Callback Route
app.get("/auth/callback", (req, res) => {
  res.send("Google Login Successful!");
});

// Start app
ViteExpress.listen(app, 3000, () =>
  console.log("Server has served on http://localhost:3000!")
);

// #TODO: Fix routing because it's fucked up now _after_ configuring Google Sign-n
// #TODO: Experiment with Google Sign-In; este removing it and building it back up again 

// Basic route
app.get("/hello", (req, res) => {
  res.send("Visita!");
});
