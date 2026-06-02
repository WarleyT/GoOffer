import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const demo = join(root, "docs", "ui-demo");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const files = ["index.html", "styles.css", "app.js"];

for (const file of files) {
  const target = join(dist, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(demo, file), target);
}

console.log("Built GoOffer demo UI to dist/");
