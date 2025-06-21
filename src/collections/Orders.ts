import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read: ({ req }) => {
      // Superadmins can read all orders
      if (isSuperAdmin(req.user)) return true;
      
      // Regular users can only read their own orders
      if (req.user) {
        return {
          user: {
            equals: req.user.id,
          },
        };
      }
      
      return false;
    },
    create: ({ req }) => {
      // Allow webhook creation (no user in webhook context)
      if (!req.user) return true;
      // Allow superadmins to create orders manually
      return isSuperAdmin(req.user);
    },
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      admin: {
        description: "Stripe checkout session associated with the order"
      }
    },
    {
      name: "stripeAccountId",
      type: "text",
      admin: {
        description: "Stripe account associated with the order"
      }
    },
  ],
};
