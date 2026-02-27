// src/sanity/schemaTypes/update.ts
import { defineField, defineType } from 'sanity'

export const update = defineType({
  name: 'update',
  title: 'Updates / Notices',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Water Quality',
          'Board Meeting',
          'Infrastructure',
          'Billing',
          'Emergency',
          'General Notice',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author / By',
      type: 'string',
      initialValue: 'BTMWC Staff',
    }),
    defineField({
      name: 'excerpt',
      title: 'Deck / Excerpt',
      description: 'One-sentence summary shown in listings and under the headline.',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'mainImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'Draft',
        media,
      }
    },
  },
  orderings: [{ title: 'Newest First', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
})
