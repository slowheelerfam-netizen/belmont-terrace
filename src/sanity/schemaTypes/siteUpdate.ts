import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteUpdate',
  title: 'Site Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Update', value: 'update' },
          { title: 'Maintenance', value: 'maintenance' },
          { title: 'Alert', value: 'alert' },
          { title: 'Report', value: 'report' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'rawHtml',
      title: 'Raw HTML (from WordPress)',
      type: 'text',
      hidden: true,
      description: 'Original HTML content imported from WordPress',
    }),
    defineField({
      name: 'pdfLinks',
      title: 'PDF Links',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'PDF links extracted from original WordPress post',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New–Old',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
