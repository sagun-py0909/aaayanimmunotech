import fs from "fs";
import { createApp } from "./app";

// Vercel function entry. Static assets are served by Vercel's CDN; this handles every other request.
// scripts/build-vercel.mjs places template.html next to the bundled function.
const template = fs.readFileSync(new URL("./template.html", import.meta.url), "utf-8");

export default createApp({ template });
