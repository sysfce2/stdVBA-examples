import esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");

const options = {
  entryPoints: {
    app: "src/main.ts",
    monaco: "src/monacoStyles.ts",
    "editor.worker": "node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
  },
  bundle: true,
  format: "esm",
  splitting: true,
  outdir: "dist",
  entryNames: "[name]",
  chunkNames: "[name]-[hash]",
  assetNames: "[name]-[hash]",
  loader: {
    ".ttf": "file",
    ".woff": "file",
    ".woff2": "file"
  },
  target: "es2020",
  logLevel: "info"
};

if (isWatch) {
  const context = await esbuild.context(options);
  await context.watch();
} else {
  await esbuild.build(options);
}
