// Packages the Vite build and the Express server for Vercel using the Build Output API:
// https://vercel.com/docs/build-output-api/v3
//
//   .vercel/output/static/                 dist/public without index.html (served by the CDN)
//   .vercel/output/functions/server.func/  the bundled Express app plus index.html as its template
//   .vercel/output/config.json             CDN files first, everything else to the function
//
// Run after `vite build`.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "dist", "public");
const outDir = path.join(root, ".vercel", "output");
const staticDir = path.join(outDir, "static");
const funcDir = path.join(outDir, "functions", "server.func");

if (!fs.existsSync(path.join(publicDir, "index.html"))) {
  throw new Error("dist/public/index.html not found — run `vite build` first.");
}

fs.rmSync(outDir, { recursive: true, force: true });

// index.html must not be a static file, or the CDN would serve "/" without the per-route SEO head.
fs.cpSync(publicDir, staticDir, { recursive: true });
fs.rmSync(path.join(staticDir, "index.html"));

fs.mkdirSync(funcDir, { recursive: true });
fs.copyFileSync(path.join(publicDir, "index.html"), path.join(funcDir, "template.html"));

await build({
  entryPoints: [path.join(root, "server", "vercel.ts")],
  outfile: path.join(funcDir, "index.mjs"),
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  // Express is CommonJS and calls require() for Node built-ins, which an ESM bundle lacks.
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: "info",
});

fs.writeFileSync(
  path.join(funcDir, ".vc-config.json"),
  JSON.stringify({ runtime: "nodejs22.x", handler: "index.mjs", launcherType: "Nodejs" }, null, 2),
);

fs.writeFileSync(
  path.join(outDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "^/assets/(.*)$", headers: { "cache-control": "public, max-age=31536000, immutable" }, continue: true },
        { handle: "filesystem" },
        { src: "^/(.*)$", dest: "/server" },
      ],
    },
    null,
    2,
  ),
);

console.log("Vercel build output written to .vercel/output");
