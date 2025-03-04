import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV || 'dev';

const envFile = {
  dev: "dev.env",
  test: "test.env",
  prod: "prod.env",
}[ENV];

dotenv.config({ path: path.resolve(process.cwd(), envFile)})

const app = express();

app.get("/hello", (req, res) => {
  res.send("Visita!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server has served on port 3000!"),
);
