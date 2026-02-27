// src/app/updates/[slug]/page.tsx
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Update {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  excerpt: string
  body: any[]
  mainImage?: any
  author?: string
  tags?: string[]
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

const updateQuery = groq`
  *[_type == "update" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt,
    body,
    mainImage,
    author,
    tags
  }
`

const relatedQuery = groq`
  *[_type == "update" && slug.current != $slug] | order(publishedAt desc) [0..2] {
    _id,
    title,
    slug,
    publishedAt,
    category,
    excerpt
  }
`

async function getUpdate(slug: string): Promise<Update | null> {
  return client.fetch(updateQuery, { slug })
}

async function getRelated(slug: string): Promise<Update[]> {
  return client.fetch(relatedQuery, { slug })
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const update = await getUpdate(params.slug)
  if (!update) return { title: 'Not Found' }
  return {
    title: `${update.title} | Belmont Terrace Mutual Water Company`,
    description: update.excerpt,
  }
}

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    groq`*[_type == "update"]{ "slug": slug.current }`
  )
  return slugs.map((s) => ({ slug: s.slug }))
}

// ─── Portable Text Components ────────────────────────────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-['IM_Fell_English',serif] text-[#1A1A14] text-lg leading-relaxed mb-6 first-letter:text-5xl first-letter:font-['Playfair_Display',serif] first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-[#2D5016] [&:not(:first-of-type)]:first-letter:text-lg [&:not(:first-of-type)]:first-letter:font-normal [&:not(:first-of-type)]:first-letter:float-none [&:not(:first-of-type)]:first-letter:mr-0 [&:not(:first-of-type)]:first-letter:text-[#1A1A14]">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14] mt-10 mb-4 border-b border-[#1A1A14]/20 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A1A14] mt-8 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#2D5016] pl-6 my-8 italic font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="font-['IM_Fell_English',serif] text-lg list-disc list-inside mb-6 space-y-2 text-[#1A1A14]">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="font-['IM_Fell_English',serif] text-lg list-decimal list-inside mb-6 space-y-2 text-[#1A1A14]">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value.href}
        className="text-[#2D5016] underline underline-offset-2 hover:text-[#7A9E5A] transition-colors"
        target={value.href.startsWith('http') ? '_blank' : undefined}
        rel={value.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <figure className="my-10">
        <div className="relative w-full aspect-video border-2 border-[#1A1A14]/20 overflow-hidden">
          <Image
            src={urlFor(value).width(900).url()}
            alt={value.alt || ''}
            fill
            className="object-cover grayscale-[20%]"
          />
        </div>
        {value.caption && (
          <figcaption className="font-['Courier_Prime',monospace] text-sm text-[#1A1A14]/60 mt-2 text-center italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UpdatePage({
  params,
}: {
  params: { slug: string }
}) {
  const [update, related] = await Promise.all([
    getUpdate(params.slug),
    getRelated(params.slug),
  ])

  if (!update) notFound()

  const pubDate = new Date(update.publishedAt)
  const formattedDate = pubDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#F5F0E4]" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}>
      
      {/* ── Masthead ── */}
      <header className="border-b-4 border-double border-[#1A1A14] bg-[#F5F0E4]">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <Link
            href="/"
            className="font-['Playfair_Display',serif] text-sm tracking-[0.3em] uppercase text-[#1A1A14]/60 hover:text-[#2D5016] transition-colors"
          >
            ← Belmont Terrace Mutual Water Company
          </Link>
          <div className="flex items-center justify-between mt-2 font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50">
            <span>EST. 1952 · SEBASTOPOL, CA</span>
            <span>{formattedDate}</span>
            <span>MEMBER NOTICE</span>
          </div>
        </div>
      </header>

      {/* ── Article ── */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          
          {/* Main Column */}
          <article>
            {/* Category Badge */}
            <div className="mb-4">
              <span className="font-['Courier_Prime',monospace] text-xs tracking-widest uppercase bg-[#2D5016] text-[#F5F0E4] px-3 py-1">
                {update.category || 'General Notice'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-bold text-[#1A1A14] leading-tight mb-4">
              {update.title}
            </h1>

            {/* Deck / Excerpt */}
            {update.excerpt && (
              <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/70 italic mb-6 leading-relaxed border-b border-[#1A1A14]/20 pb-6">
                {update.excerpt}
              </p>
            )}

            {/* Byline */}
            <div className="flex items-center gap-4 font-['Courier_Prime',monospace] text-sm text-[#1A1A14]/60 mb-8">
              <span>By {update.author || 'BTMWC Staff'}</span>
              <span>·</span>
              <time dateTime={update.publishedAt}>{formattedDate}</time>
            </div>

            {/* Hero Image */}
            {update.mainImage && (
              <div className="relative w-full aspect-video mb-10 border-2 border-[#1A1A14]/20 overflow-hidden">
                <Image
                  src={urlFor(update.mainImage).width(900).url()}
                  alt={update.mainImage.alt || update.title}
                  fill
                  priority
                  className="object-cover grayscale-[15%]"
                />
              </div>
            )}

            {/* Body */}
            <div className="max-w-[65ch]">
              {update.body ? (
                <PortableText value={update.body} components={ptComponents} />
              ) : (
                <p className="font-['IM_Fell_English',serif] text-lg text-[#1A1A14]/60 italic">
                  Full article content not yet available.
                </p>
              )}
            </div>

            {/* Tags */}
            {update.tags && update.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#1A1A14]/20 flex flex-wrap gap-2">
                {update.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-['Courier_Prime',monospace] text-xs tracking-wider border border-[#1A1A14]/30 px-3 py-1 text-[#1A1A14]/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Related Articles */}
            {related.length > 0 && (
              <div className="border border-[#1A1A14]/20 p-4">
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1A1A14] border-b border-[#1A1A14] pb-2 mb-4">
                  Recent Notices
                </h3>
                <div className="space-y-4">
                  {related.map((item) => (
                    <div key={item._id} className="border-b border-[#1A1A14]/10 pb-4 last:border-0 last:pb-0">
                      <Link
                        href={`/updates/${item.slug.current}`}
                        className="group"
                      >
                        <p className="font-['Courier_Prime',monospace] text-xs text-[#2D5016] mb-1">
                          {new Date(item.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <h4 className="font-['Playfair_Display',serif] text-base font-bold text-[#1A1A14] group-hover:text-[#2D5016] transition-colors leading-snug">
                          {item.title}
                        </h4>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  href="/updates"
                  className="mt-4 block font-['Courier_Prime',monospace] text-xs text-[#2D5016] hover:underline"
                >
                  View all notices →
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="border border-[#1A1A14]/20 p-4 bg-[#2D5016]/5">
              <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1A1A14] border-b border-[#1A1A14] pb-2 mb-4">
                Member Resources
              </h3>
              <ul className="space-y-2">
                {[
                  { label: 'Pay Your Bill', href: '/#pay-bill' },
                  { label: 'Document Archive', href: '/documents' },
                  { label: 'Water Quality Reports', href: '/documents#quality' },
                  { label: 'Contact the Board', href: '/#contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-['Courier_Prime',monospace] text-sm text-[#1A1A14]/70 hover:text-[#2D5016] transition-colors flex items-center gap-2"
                    >
                      <span className="text-[#2D5016]">▸</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ornament */}
            <div className="text-center font-['IM_Fell_English',serif] text-2xl text-[#1A1A14]/20 tracking-widest">
              ❧ ❧ ❧
            </div>
          </aside>
        </div>
      </main>

      {/* ── Footer Rule ── */}
      <footer className="border-t-4 border-double border-[#1A1A14] mt-12 py-6 text-center">
        <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50 tracking-widest uppercase">
          Belmont Terrace Mutual Water Company · Sebastopol, California
        </p>
      </footer>
    </div>
  )
}
