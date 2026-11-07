/**
 * One-off helper: searches Openverse (StockSnap, CC0 licence) for each query
 * and writes the chosen photo URLs to photos.json, which the demo seed reads.
 * Run with: npx tsx src/seed-demo/pick-photos.ts
 * Override a pick by editing photos.json, or add "query#n" to take result n.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { PRODUCT_PHOTO_QUERIES, STORE_AVATAR_QUERIES } from "./photo-queries";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "photos.json");
const existing: Record<string, string> = fs.existsSync(out)
  ? JSON.parse(fs.readFileSync(out, "utf8"))
  : {};
const used = new Set(Object.values(existing));

async function search(query: string) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&source=stocksnap&license=cc0&page_size=20`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as { results: { url: string }[] };
      return data.results.map((r) => r.url);
    }
    await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
  }
  throw new Error(`Openverse search failed for "${query}"`);
}

const entries = [
  ...Object.entries(PRODUCT_PHOTO_QUERIES).map(([k, q]) => [`product:${k}`, q] as const),
  ...Object.entries(STORE_AVATAR_QUERIES).map(([k, q]) => [`avatar:${k}`, q] as const),
];

for (const [key, raw] of entries) {
  if (existing[key]) continue;
  const [query, skip] = raw.split("#");
  const results = (await search(query!)).filter((u) => !used.has(u));
  const choice = results[Number(skip ?? 0)] ?? results[0];
  if (!choice) {
    console.warn(`No photo for ${key} (${query})`);
    continue;
  }
  existing[key] = choice;
  used.add(choice);
  fs.writeFileSync(out, JSON.stringify(existing, null, 2) + "\n");
  console.log(`${key} -> ${choice}`);
  await new Promise((r) => setTimeout(r, 1500));
}
