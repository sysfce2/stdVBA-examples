import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import esbuild from "esbuild";

const rootDir = process.cwd();
const distDir = resolve(rootDir, "dist");
const watch = process.argv.includes("--watch");

await mkdir(distDir, { recursive: true });

const buildOptions = {
  entryPoints: [resolve(rootDir, "src/main.ts")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  legalComments: "none",
  charset: "utf8",
  outfile: resolve(distDir, "augment.js"),
  logLevel: "info"
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching Frontend/src -> Frontend/dist/augment.js");
} else {
  await esbuild.build(buildOptions);
}
