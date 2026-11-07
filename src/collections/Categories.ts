import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

const revalidateCategories = () => {
  try {
    revalidateTag("categories", { expire: 0 });
  } catch {
    // Not running inside Next.js (e.g. the seed script); nothing to revalidate.
  }
};

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  hooks: {
    afterChange: [revalidateCategories],
    afterDelete: [revalidateCategories],
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      index: true,
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};
