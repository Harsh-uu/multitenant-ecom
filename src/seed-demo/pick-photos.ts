/**
 * Picks one Unsplash photo per demo product with the official Unsplash API,
 * records the download with Unsplash (required by their API terms), and
 * saves the choice plus photographer credit to photos.json for the seed.
 *
 * Demo-mode Unsplash keys allow 50 requests/hour; this script waits for the
 * limit to reset and carries on, so a full run can take a couple of hours.
 *
 *   UNSPLASH_ACCESS_KEY=... npx tsx src/seed-demo/pick-photos.ts
 *
 * Existing picks are kept; delete an entry from photos.json to re-pick it,
 * or append "#n" to its query to take the n-th best result instead.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { PRODUCT_PHOTO_QUERIES } from "./photo-queries";

export type PickedPhoto = {
  id: string;
  url: string; // images.unsplash.com raw URL; the seed adds size params
  downloadLocation: string; // must be called when the photo is used
  photographer: string;
  profileUrl: string;
};

type UnsplashPhoto = {
  id: string;
  likes: number;
  urls: { raw: string };
  links: { download_location: string };
  user: { name: string; links: { html: string } };
};

const key = process.env.UNSPLASH_ACCESS_KEY;
if (!key) throw new Error("Set UNSPLASH_ACCESS_KEY (free at unsplash.com/developers)");

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "photos.json");
const picks: Record<string, PickedPhoto> = fs.existsSync(out)
  ? JSON.parse(fs.readFileSync(out, "utf8"))
  : {};
const used = new Set(Object.values(picks).map((p) => p.id));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Calls the Unsplash API, pausing whenever the hourly limit runs out. */
async function api(url: string) {
  for (;;) {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    });
    const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? 1);
    if (res.status === 403 || res.status === 429) {
      console.log(`Rate limit reached; waiting 10 minutes (${new Date().toLocaleTimeString()})`);
      await sleep(10 * 60 * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`Unsplash ${url} failed: ${res.status} ${await res.text()}`);
    if (remaining <= 0) console.log("Hourly limit used up; next call will wait.");
    return res.json();
  }
}

async function search(query: string) {
  const params = new URLSearchParams({
    query,
    per_page: "20",
    orientation: "landscape",
    content_filter: "high",
  });
  const data = (await api(`https://api.unsplash.com/search/photos?${params}`)) as {
    results: UnsplashPhoto[];
  };
  return data.results;
}

const entries = Object.entries(PRODUCT_PHOTO_QUERIES).map(
  ([k, q]) => [`product:${k}`, q] as const
);

for (const [entryKey, raw] of entries) {
  if (picks[entryKey]) continue;
  const [query, nth] = raw.split("#");
  // Among the most relevant results, prefer the most-liked (a decent proxy
  // for "Pinterest-worthy"), skipping photos already used elsewhere.
  const candidates = (await search(query!))
    .slice(0, 10)
    .filter((p) => !used.has(p.id))
    .sort((a, b) => b.likes - a.likes);
  const photo = candidates[Number(nth ?? 0)] ?? candidates[0];
  if (!photo) {
    console.warn(`No photo for ${entryKey} ("${query}")`);
    continue;
  }
  picks[entryKey] = {
    id: photo.id,
    url: photo.urls.raw,
    downloadLocation: photo.links.download_location,
    photographer: photo.user.name,
    profileUrl: photo.user.links.html,
  };
  used.add(photo.id);
  // Unsplash requires tracking a "download" when a photo is put to use.
  await api(photo.links.download_location);
  fs.writeFileSync(out, JSON.stringify(picks, null, 2) + "\n");
  console.log(`${entryKey} -> ${photo.id} by ${photo.user.name}`);
}
