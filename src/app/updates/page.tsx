// src/app/updates/page.tsx
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Member Notices & Updates | Belmont Terrace Mutual Water Company',
  description: 'News, notices, and announcements for BTMWC members.',
}

interface Update {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  category: string
  excerpt: string
}

const allUpdatesQuery = groq`
  *[_type == "update"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, category, excerpt
  }
`

async function getUpdates(): Promise<Update[]> {
  return client.fetch(allUpdatesQuery)
}

const CATEGORY_COLORS: Record<string, string> = {
  'Water Quality': 'bg-[#2D5016] text-[#F5F0E4]',
  'Board Meeting': 'bg-[#1A1A14] text-[#F5F0E4]',
  'Infrastructure': 'bg-[#7A9E5A] text-[#1A1A14]',
  'Billing': 'bg-[#F5F0E4] text-[#1A1A14] border border-[#1A1A14]/30',
  'Emergency': 'bg-red-800 text-white',
}

export default async function UpdatesPage() {
  const updates = await getUpdates()

  // Group by year
  const byYear: Record<string, Update[]> = {}
  for (const update of updates) {
    const year = new Date(update.publishedAt).getFullYear().toString()
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(update)
  }
  const years = Object.keys(byYear).sort((a, b) => +b - +a)

  return (
    <div className="min-h-screen bg-[#F5F0E4]" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}>

      {/* Masthead */}
      <header className="border-b-4 border-double border-[#1A1A14]">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="font-['Courier_Prime',monospace] text-xs tracking-[0.3em] uppercase text-[#1A1A14]/50 hover:text-[#2D5016] transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-bold text-[#1A1A14] mt-2">
            Member Notices
          </h1>
          <p className="font-['IM_Fell_English',serif] italic text-[#1A1A14]/60 mt-2">
            Announcements, alerts, and updates from the board
          </p>
          <div className="flex justify-center gap-6 mt-4 font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 tracking-widest uppercase">
            <span>Belmont Terrace Mutual Water Company</span>
            <span>·</span>
            <span>Sebastopol, CA</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {updates.length === 0 ? (
          <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/50 text-center italic py-20">
            No notices published yet.
          </p>
        ) : (
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year}>
                {/* Year divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 border-t-2 border-[#1A1A14]/20" />
                  <span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14]/40">
                    {year}
                  </span>
                  <div className="flex-1 border-t-2 border-[#1A1A14]/20" />
                </div>

                {/* 3-column newspaper grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A14]/10">
                  {byYear[year].map((update, i) => {
                    const isLead = i === 0 && year === years[0]
                    const catColor = CATEGORY_COLORS[update.category] || 'bg-[#7A9E5A]/30 text-[#1A1A14]'
                    const pubDate = new Date(update.publishedAt)

                    return (
                      <article
                        key={update._id}
                        className={`bg-[#F5F0E4] p-5 hover:bg-[#EDE7D4] transition-colors group ${isLead ? 'md:col-span-2 lg:col-span-3' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`font-['Courier_Prime',monospace] text-[10px] tracking-widest uppercase px-2 py-0.5 ${catColor}`}>
                            {update.category || 'Notice'}
                          </span>
                          <time
                            dateTime={update.publishedAt}
                            className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50 shrink-0"
                          >
                            {pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </time>
                        </div>

                        <Link href={`/updates/${update.slug.current}`}>
                          <h2 className={`font-['Playfair_Display',serif] font-bold text-[#1A1A14] group-hover:text-[#2D5016] transition-colors leading-snug mb-2 ${isLead ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                            {update.title}
                          </h2>
                        </Link>

                        {update.excerpt && (
                          <p className="font-['IM_Fell_English',serif] text-sm text-[#1A1A14]/70 leading-relaxed line-clamp-3">
                            {update.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/updates/${update.slug.current}`}
                          className="mt-3 inline-block font-['Courier_Prime',monospace] text-xs text-[#2D5016] hover:underline"
                        >
                          Read full notice →
                        </Link>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t-4 border-double border-[#1A1A14] mt-12 py-6 text-center">
        <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50 tracking-widest uppercase">
          Belmont Terrace Mutual Water Company · Sebastopol, California
        </p>
      </footer>
    </div>
  )
}
