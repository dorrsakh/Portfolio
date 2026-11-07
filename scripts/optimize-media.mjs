import sharp from "sharp";
import { readdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
const media = resolve("public/media");
for (const file of await readdir(media)) {
  if (!file.endsWith(".jpg")) continue;
  const input = resolve(media, file),
    meta = await sharp(input).metadata();
  const top =
    file.includes("picker") || file.includes("studio-mobile")
      ? 0
      : meta.width > 600
        ? 64
        : 56;
  await sharp(input)
    .extract({ left: 0, top, width: meta.width, height: meta.height - top })
    .webp({ quality: 85 })
    .toFile(input.replace(".jpg", ".webp"));
  await unlink(input);
}
console.log("Media optimized as WebP.");
