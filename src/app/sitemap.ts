import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

import { generateTenantURL, getAppUrl } from "@/lib/utils";

// Rebuilt at most hourly.
export const revalidate = 3600;

const absolute = (url: string) => (url.startsWith("http") ? url : `${getAppUrl()}${url}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getPayload({ config });
  const [tenants, products, categories] = await Promise.all([
    db.find({ collection: "tenants", pagination: false, depth: 0, select: { slug: true, updatedAt: true } }),
    db.find({
      collection: "products",
      pagination: false,
      depth: 1,
      select: { tenant: true, updatedAt: true },
      populate: { tenants: { slug: true } },
      where: { and: [{ isArchived: { not_equals: true } }, { isPrivate: { not_equals: true } }] },
    }),
    db.find({ collection: "categories", pagination: false, depth: 0, select: { slug: true, parent: true } }),
  ]);

  const categorySlug = new Map(categories.docs.map((c) => [c.id, c.slug]));

  return [
    { url: absolute("/"), changeFrequency: "daily", priority: 1 },
    ...categories.docs.map((c) => ({
      url: absolute(
        c.parent ? `/${categorySlug.get(c.parent as string)}/${c.slug}` : `/${c.slug}`
      ),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tenants.docs.map((t) => ({
      url: absolute(generateTenantURL(t.slug)),
      lastModified: t.updatedAt,
      priority: 0.7,
    })),
    ...products.docs.flatMap((p) => {
      const slug = typeof p.tenant === "object" ? p.tenant?.slug : undefined;
      return slug
        ? [{ url: absolute(`${generateTenantURL(slug)}/products/${p.id}`), lastModified: p.updatedAt, priority: 0.8 }]
        : [];
    }),
  ];
}
