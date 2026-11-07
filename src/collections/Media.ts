import { revalidateCatalog } from "@/lib/cache";
import { isSuperAdmin } from '@/lib/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    delete: ({req}) => isSuperAdmin(req.user),
  },
  hooks: {
    afterChange: [revalidateCatalog],
    afterDelete: [revalidateCatalog],
  },
  admin: {
    hidden: ({user}) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
