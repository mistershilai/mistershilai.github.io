// Derives a date for each place from the EXIF timestamps of its photos, so
// the globe can replay travels chronologically. Without this there is no time
// data anywhere: the Place type has a `year` field but nothing sets it.
//
// Writes src/data/place-dates.json, which is committed. Re-run after adding
// photos:  node scripts/extract-photo-dates.mjs

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC_ROOT = 'public/photos';
const OUT = 'src/data/place-dates.json';
const PHOTO_EXT = /\.(jpe?g)$/i;
const SKIP_DIRS = new Set(['videos', 'presentation', 'graduation']);

// EXIF stores DateTimeOriginal as "YYYY:MM:DD HH:MM:SS" in the header, so we
// scan the leading bytes rather than pulling in a full EXIF parser.
const DATE_RE = /(\d{4}):(\d{2}):(\d{2}) \d{2}:\d{2}:\d{2}/;
const HEAD_BYTES = 200_000;

async function dateOf(file) {
  const buf = await readFile(file);
  const m = buf.subarray(0, HEAD_BYTES).toString('latin1').match(DATE_RE);
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = `${y}-${mo}-${d}`;
  // Guard against obviously bogus camera clocks.
  const t = Date.parse(iso);
  if (Number.isNaN(t) || +y < 1990 || t > Date.now() + 86400000) return null;
  return iso;
}

const out = {};
let noDate = 0;

for (const entry of await readdir(SRC_ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
  const slug = entry.name;
  const files = (await readdir(path.join(SRC_ROOT, slug))).filter((f) => PHOTO_EXT.test(f));
  const dates = [];
  for (const f of files) {
    const d = await dateOf(path.join(SRC_ROOT, slug, f));
    if (d) dates.push(d);
  }
  if (!dates.length) {
    noDate++;
    console.warn(`no EXIF date: ${slug} (${files.length} photos)`);
    continue;
  }
  dates.sort();
  out[slug] = { first: dates[0], last: dates[dates.length - 1], dated: dates.length, photos: files.length };
}

const sorted = Object.fromEntries(
  Object.entries(out).sort((a, b) => a[1].first.localeCompare(b[1].first))
);

await writeFile(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(`dated ${Object.keys(sorted).length} places, ${noDate} without EXIF -> ${OUT}`);
