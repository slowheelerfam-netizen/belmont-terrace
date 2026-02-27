/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'communityDocument',
  title: 'Documents',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Water Quality Reports',
          'Meeting Minutes',
          'Financial Reports',
          'Rules & Regulations',
          'Forms',
          'Notices',
          'Other',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.required().min(1950).max(2099),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published / Filed Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: { accept: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png' },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', year: 'year' },
    prepare({ title, subtitle, year }: any) {
      return { title, subtitle: `${subtitle} · ${year}` }
    },
  },
})