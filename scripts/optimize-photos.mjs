// Generates small WebP derivatives of every gallery photo.
//
// The gallery renders photos into a grid cell that is never wider than about
// 330 CSS px, so shipping the multi-megabyte originals wastes almost all of
// what it downloads. This writes 400w and 800w WebPs next to the originals
// under public/photos-opt/<slug>/, which is what PhotoGlobe actually loads.
//
// Idempotent: a derivative is rebuilt only when it is missing or older than
// its source, so re-running is cheap and CI stays fast.
//
//   node scripts/optimize-photos.mjs [--force]

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_ROOT = 'public/photos';
const OUT_ROOT = 'public/photos-opt';
const WIDTHS = [400, 800];
const QUALITY = { 400: 72, 800: 76 };
const PHOTO_EXT = /\.(jpe?g|png)$/i;
const SKIP_DIRS = new Set(['videos']);

const force = process.argv.includes('--force');

async function* walkPhotos(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walkPhotos(full);
    } else if (PHOTO_EXT.test(entry.name)) {
      yield full;
    }
  }
}

async function isStale(src, out) {
  if (force || !existsSync(out)) return true;
  const [s, o] = await Promise.all([stat(src), stat(out)]);
  return s.mtimeMs > o.mtimeMs;
}

let built = 0;
let skipped = 0;
let srcBytes = 0;
let outBytes = 0;

for await (const src of walkPhotos(SRC_ROOT)) {
  const rel = path.relative(SRC_ROOT, src);
  const dir = path.join(OUT_ROOT, path.dirname(rel));
  const base = path.basename(rel).replace(PHOTO_EXT, '');
  await mkdir(dir, { recursive: true });

  srcBytes += (await stat(src)).size;

  for (const w of WIDTHS) {
    const out = path.join(dir, `${base}-${w}.webp`);
    if (await isStale(src, out)) {
      // .rotate() with no argument applies the EXIF orientation, which
      // matters because these come straight off a phone.
      const buf = await sharp(src)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY[w] })
        .toBuffer();
      await writeFile(out, buf);
      built++;
    } else {
      skipped++;
    }
    outBytes += (await stat(out)).size;
  }
}

// Standalone images used in page markup, plus the favicon. Same idea, but
// each has one known display size rather than a responsive set.
const SINGLES = [
  { src: 'public/IMG_4086.jpg', out: 'public/img-opt/contact-avatar.webp', width: 320, square: true },
  // cropTop is deliberate: automatic salience picks the monkey and slices
  // through the face. 480 keeps both subjects whole.
  { src: 'public/facepicture.JPG', out: 'public/img-opt/about-avatar.webp', width: 360, square: true, cropTop: 480 },
  {
    src: 'public/photos/presentation/b728273a-6867-4f22-bbe6-621aac1259ef.JPG',
    out: 'public/img-opt/presentation.webp',
    width: 640,
  },
  // The favicon was a 1MB full-resolution photo on every page load.
  { src: 'public/1000004463.JPG', out: 'public/img-opt/favicon-64.png', width: 64, png: true },
  { src: 'public/1000004463.JPG', out: 'public/img-opt/favicon-180.png', width: 180, png: true },
];

for (const { src, out, width, png, square, cropTop } of SINGLES) {
  if (!existsSync(src)) {
    console.warn(`missing source, skipped: ${src}`);
    continue;
  }
  await mkdir(path.dirname(out), { recursive: true });
  srcBytes += (await stat(src)).size;
  if (await isStale(src, out)) {
    // Avatars render inside a circle with object-cover, so crop to a square
    // here rather than letting the browser centre-crop a portrait frame and
    // slice through the face. `attention` picks the most salient region.
    let pipeline = sharp(src).rotate();
    if (square && cropTop !== undefined) {
      const meta = await pipeline.metadata();
      const side = Math.min(meta.width, meta.height);
      pipeline = sharp(src).rotate().extract({
        left: Math.max(0, Math.round((meta.width - side) / 2)),
        top: Math.min(cropTop, Math.max(0, meta.height - side)),
        width: side,
        height: side,
      });
    }
    const img = square
      ? pipeline.resize(width, width, {
          fit: 'cover',
          position: sharp.strategy.attention,
          withoutEnlargement: true,
        })
      : pipeline.resize({ width, withoutEnlargement: true });
    await writeFile(out, await (png ? img.png({ compressionLevel: 9 }) : img.webp({ quality: 82 })).toBuffer());
    built++;
  } else {
    skipped++;
  }
  outBytes += (await stat(out)).size;
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`built ${built}, skipped ${skipped} (up to date)`);
console.log(`originals ${mb(srcBytes)}MB -> derivatives ${mb(outBytes)}MB`);
