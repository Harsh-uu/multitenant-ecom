/**
 * Fills the store with demo sellers, products, buyers, orders and reviews.
 * Run with: npm run db:seed-demo  (needs DATABASE_URI, PAYLOAD_SECRET,
 * BLOB_READ_WRITE_TOKEN and STRIPE_SECRET_KEY)
 *
 * Re-runnable: it first removes only its own demo records (demo store slugs,
 * @example.com accounts and their products/orders/reviews/media), never real
 * users' data.
 */
import { getPayload, type Payload, type Where } from "payload";
import config from "@payload-config";

import { stripe } from "../lib/stripe";
import sharp from "sharp";

import { avatar } from "./art";
import photos from "./photos.json";
import {
  BUYERS,
  DEMO_EMAIL_DOMAIN,
  DEMO_PASSWORD,
  REVIEWS,
  STORES,
  TAGS,
} from "./data";

// Small seeded PRNG so every run produces the same catalogue.
let state = 42;
const rand = () => {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
};
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)]!;
const shuffle = <T>(arr: T[]) =>
  [...arr].map((v) => [rand(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

const text = (t: string) => ({
  type: "text", text: t, format: 0, style: "", mode: "normal", detail: 0, version: 1,
});
const block = (type: string, children: unknown[], extra: object = {}) => ({
  type, children, format: "", indent: 0, version: 1, direction: "ltr", ...extra,
});
const paragraph = (t: string) => block("paragraph", [text(t)], { textFormat: 0, textStyle: "" });
const heading = (t: string) => block("heading", [text(t)], { tag: "h3" });
const bullets = (items: string[]) =>
  block(
    "list",
    items.map((item, i) => block("listitem", [text(item)], { value: i + 1 })),
    { listType: "bullet", tag: "ul", start: 1 }
  );
const richText = (...children: unknown[]) =>
  ({ root: block("root", children) }) as never;

async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>) {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  }
  return out;
}

async function uploadImage(payload: Payload, data: Buffer, name: string, alt: string, tenant: string) {
  return payload.create({
    collection: "media",
    data: { alt, tenant } as never,
    file: { data, mimetype: "image/webp", name: `${name}.webp`, size: data.length },
  });
}

async function createStripeAccount() {
  const account = await stripe.accounts.create({});
  return account.id;
}

// CC0 photos from StockSnap (chosen with pick-photos.ts), re-encoded as WebP.
async function photo(key: string, square = false) {
  const url = (photos as Record<string, string>)[key];
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const image = sharp(Buffer.from(await res.arrayBuffer()));
  return (square
    ? image.resize(256, 256, { fit: "cover", position: sharp.strategy.attention })
    : image
  ).webp({ quality: 80 }).toBuffer();
}

async function createAccount(payload: Payload, opts: {
  username: string; displayName: string; color: string; initials: string;
}) {
  const stripeAccountID = await createStripeAccount();
  const tenant = await payload.create({
    collection: "tenants",
    data: { name: opts.displayName, slug: opts.username, stripeAccountID },
  });
  const image = await uploadImage(
    payload,
    (await photo(`avatar:${opts.username}`, true)) ??
      (await avatar({ initials: opts.initials, color: opts.color })),
    `avatar-${opts.username}`,
    `${opts.displayName} avatar`,
    tenant.id
  );
  await payload.update({ collection: "tenants", id: tenant.id, data: { image: image.id } });
  const user = await payload.create({
    collection: "users",
    data: {
      email: `${opts.username}@${DEMO_EMAIL_DOMAIN}`,
      username: opts.username,
      password: DEMO_PASSWORD,
      tenants: [{ tenant: tenant.id }],
    },
  });
  return { tenant, user };
}

async function cleanup(payload: Payload) {
  const slugs = [...STORES.map((s) => s.slug), ...BUYERS.map((b) => b.username)];
  const tenants = await payload.find({
    collection: "tenants", pagination: false, depth: 0,
    where: { slug: { in: slugs } },
  });
  const users = await payload.find({
    collection: "users", pagination: false, depth: 0,
    where: { email: { like: `@${DEMO_EMAIL_DOMAIN}` } },
  });
  const tenantIds = tenants.docs.map((t) => t.id);
  const userIds = users.docs.map((u) => u.id);
  const products = await payload.find({
    collection: "products", pagination: false, depth: 0, select: {},
    where: { tenant: { in: tenantIds } },
  });
  const productIds = products.docs.map((p) => p.id);

  const touching: Where = { or: [{ user: { in: userIds } }, { product: { in: productIds } }] };
  await payload.delete({ collection: "reviews", where: touching });
  await payload.delete({ collection: "orders", where: touching });
  await payload.delete({ collection: "products", where: { id: { in: productIds } } });
  await payload.delete({ collection: "media", where: { tenant: { in: tenantIds } } });
  await payload.delete({ collection: "users", where: { id: { in: userIds } } });
  await payload.delete({ collection: "tenants", where: { id: { in: tenantIds } } });
  await Promise.all(
    tenants.docs.map((t) => stripe.accounts.del(t.stripeAccountID).catch(() => {}))
  );
  console.log(`Removed previous demo data: ${tenantIds.length} stores, ${userIds.length} users, ${productIds.length} products`);
}

async function seedDemo() {
  const payload = await getPayload({ config });

  // The base seed may have used a placeholder before Stripe was configured.
  const admin = await payload.find({
    collection: "tenants", limit: 1, depth: 0, where: { slug: { equals: "admin" } },
  });
  if (admin.docs[0]?.stripeAccountID?.startsWith("acct_placeholder")) {
    await payload.update({
      collection: "tenants", id: admin.docs[0].id,
      data: { stripeAccountID: await createStripeAccount() },
    });
    console.log("Gave the admin store a real Stripe test account");
  }

  await cleanup(payload);

  const categories = await payload.find({
    collection: "categories", pagination: false, depth: 0, select: { slug: true },
  });
  const categoryId = new Map(categories.docs.map((c) => [c.slug, c.id]));
  if (categoryId.size === 0) throw new Error("Run the base seed (npm run db:seed) first");

  const tagId = new Map<string, string>();
  for (const name of TAGS) {
    const existing = await payload.find({
      collection: "tags", limit: 1, depth: 0, where: { name: { equals: name } },
    });
    const tag = existing.docs[0] ?? (await payload.create({ collection: "tags", data: { name } }));
    tagId.set(name, tag.id);
  }

  // Sellers and their stores.
  const sellers = await inBatches(STORES, 3, async (store) => {
    const { tenant, user } = await createAccount(payload, {
      username: store.slug,
      displayName: store.name,
      color: store.color,
      initials: `${store.owner.first[0]}${store.owner.last[0]}`,
    });
    // Sellers on a real deployment finish Stripe onboarding themselves; demo
    // stores are marked verified so their products can be listed and bought
    // by the super-admin (regular buyers need a fully onboarded account).
    await payload.update({
      collection: "tenants", id: tenant.id, data: { stripeDetailsSubmitted: true },
    });
    return { store, tenant, slug: store.slug, user };
  });

  // Upload every product photo up front (in parallel)...
  const listings = sellers.flatMap((s) => s.store.products.map((p) => ({ ...s, p })));
  const coverIds = new Map<string, string>();
  await inBatches(listings, 6, async ({ store, tenant, p }) => {
    const data = await photo(`product:${p.name}`);
    if (!data) throw new Error(`No photo picked for ${p.name}`);
    const cover = await uploadImage(
      payload,
      data,
      `${store.slug}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      p.name,
      tenant.id
    );
    coverIds.set(p.name, cover.id);
  });

  // ...then create products one store at a time, round-robin, so the
  // newest-first feed mixes stores instead of showing six from one shop.
  const products: { id: string; name: string; storeSlug: string }[] = [];
  const rounds = Math.max(...STORES.map((s) => s.products.length));
  for (let round = 0; round < rounds; round++) {
    for (const { store, tenant } of shuffle(sellers)) {
      const p = store.products[round];
      if (!p) continue;
      const category = categoryId.get(p.category);
      if (!category) throw new Error(`Unknown category ${p.category}`);
      const doc = await payload.create({
        collection: "products",
        data: {
          name: p.name,
          price: p.price,
          category,
          tags: p.tags.map((t) => tagId.get(t)!),
          image: coverIds.get(p.name)!,
          refundPolicy: p.refundPolicy ?? pick(["30-day", "14-day", "7-day"] as const),
          isPrivate: p.isPrivate ?? false,
          tenant: tenant.id,
          description: richText(
            paragraph(p.blurb),
            heading("What's included"),
            bullets(p.includes),
            paragraph(`Made with care by ${store.owner.first} at ${store.name}. Questions? Reach out any time and I'll get back to you within a day.`)
          ),
          content: richText(
            heading(`Thanks for buying ${p.name}!`),
            paragraph("Everything you need is below. This is demo content, so the links are placeholders."),
            bullets(p.includes.map((i) => `${i}: download link`)),
            heading("Getting started"),
            paragraph("Start with the quick-start section, then work through the rest at your own pace. Updates are free forever."),
          ),
        } as never,
      });
      if (!p.isPrivate) products.push({ id: doc.id, name: p.name, storeSlug: store.slug });
    }
  }
  console.log(`  ✓ ${sellers.length} stores, ${listings.length} products`);

  // Buyers (every account gets a store, like real sign-ups).
  const buyers = await inBatches(BUYERS, 3, async (b) => {
    const { user } = await createAccount(payload, {
      username: b.username,
      displayName: `${b.first}'s store`,
      color: "#F4F4F0",
      initials: `${b.first[0]}${b.last[0]}`,
    });
    return { slug: b.username, user };
  });

  // Purchases and reviews: buyers buy plenty, sellers buy from other stores.
  let orderCount = 0;
  let reviewCount = 0;
  const shoppers = [
    ...buyers.map((b) => ({ ...b, count: 8 + Math.floor(rand() * 7) })),
    ...sellers.map((s) => ({ ...s, count: 2 + Math.floor(rand() * 4) })),
  ];
  for (const shopper of shoppers) {
    const basket = shuffle(products.filter((p) => p.storeSlug !== shopper.slug)).slice(0, shopper.count);
    await inBatches(basket, 5, async (product) => {
      await payload.create({
        collection: "orders",
        data: {
          name: product.name,
          user: shopper.user.id,
          product: product.id,
          stripeCheckoutSessionId: `cs_demo_${shopper.slug}_${product.id}`,
        },
      });
      orderCount++;
      if (rand() < 0.75) {
        const r = rand();
        const rating = r < 0.55 ? 5 : r < 0.85 ? 4 : r < 0.96 ? 3 : 2;
        await payload.create({
          collection: "reviews",
          data: {
            user: shopper.user.id,
            product: product.id,
            rating,
            description: pick(REVIEWS[rating]!),
          },
        });
        reviewCount++;
      }
    });
  }
  console.log(`Created ${sellers.length} stores, ${products.length} public products, ${buyers.length} buyers, ${orderCount} orders, ${reviewCount} reviews`);
  console.log(`All demo accounts use the password "${DEMO_PASSWORD}"`);
}

try {
  await seedDemo();
  process.exit(0);
} catch (error) {
  console.error("Demo seed failed:", error);
  process.exit(1);
}
