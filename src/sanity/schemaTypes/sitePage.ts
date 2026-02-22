import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sitePage',
  title: 'Site Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
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
      description: 'PDF links extracted from original WordPress page',
    }),
  ],
})