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
    // Hosted images (e.g. Unsplash, whose API terms require hotlinking)
    // have no uploaded file; serve their external URL instead.
    afterRead: [
      ({ doc }) =>
        !doc.filename && doc.externalUrl ? { ...doc, url: doc.externalUrl } : doc,
    ],
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
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Use a hosted image instead of uploading a file',
      },
    },
    {
      name: 'credit',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'name', type: 'text', admin: { description: 'Photographer' } },
        { name: 'url', type: 'text', admin: { description: 'Photographer profile link' } },
        { name: 'source', type: 'text', admin: { description: 'e.g. Unsplash' } },
        { name: 'sourceUrl', type: 'text' },
      ],
    },
  ],
  upload: {
    filesRequiredOnCreate: false,
  },
}
