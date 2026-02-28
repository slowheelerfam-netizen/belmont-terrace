'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ArchiveEntry {
  type: 'photo' | 'document'
  filename: string
  url: string
  year: string
  month: string
  category?: string
}

const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December']

function parseDocumentYear(entry: ArchiveEntry): string {
  const name = entry.filename.replace(/\.[^.]+$/, '')
  const m1 = name.match(/-(\d{1,2})-(\d{1,2})-(\d{2})$/)
  if (m1) return String(parseInt(m1[3]) + 2000)
  const m2 = name.match(/[-_](January|February|March|April|May|June|July|August|September|October|November|December)[-_](\d{4})/i)
  if (m2) return m2[2]
  const m3 = name.match(/(?:^|[-_])(20\d{2})(?:[-_]|$)/)
  if (m3) return m3[1]
  const m4 = name.match(/^(20\d{2})\d{4}_/)
  if (m4) return m4[1]
  return entry.year
}

function parseDocumentDate(entry: ArchiveEntry): string {
  const name = entry.filename.replace(/\.[^.]+$/, '')
  const m1 = name.match(/-(\d{1,2})-(\d{1,2})-(\d{2})$/)
  if (m1) {
    const mo = parseInt(m1[1]), day = parseInt(m1[2]), yr = parseInt(m1[3]) + 2000
    if (mo >= 1 && mo <= 12 && day >= 1 && day <= 31)
      return `${MONTHS[mo]} ${day}, ${yr}`
  }
  const m2 = name.match(/[-_](January|February|March|April|May|June|July|August|September|October|November|December)[-_](\d{4})/i)
  if (m2) return `${m2[1]} ${m2[2]}`
  const m3 = name.match(/(?:^|[-_])(20\d{2})(?:[-_]|$)/)
  if (m3) return m3[1]
  const m4 = name.match(/^(\d{4})(\d{2})(\d{2})_/)
  if (m4) return `${MONTHS[parseInt(m4[2])]} ${parseInt(m4[3])}, ${m4[1]}`
  const mo = parseInt(entry.month)
  return `${MONTHS[mo] || ''} ${entry.year}`.trim()
}

function formatTitle(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+\d$/, '')
}

const CATEGORY_STYLES: Record<string, string> = {
  Minutes:    'bg-[#2D5016]/10 text-[#2D5016] border-[#2D5016]/25',
  CCR:        'bg-blue-900/10 text-blue-800 border-blue-800/25',
  Financial:  'bg-amber-800/10 text-amber-800 border-amber-800/25',
  Newsletter: 'bg-purple-800/10 text-purple-800 border-purple-800/25',
  Policy:     'bg-red-800/10 text-red-800 border-red-800/25',
  History:    'bg-stone-600/10 text-stone-700 border-stone-600/25',
  Bylaws:     'bg-indigo-800/10 text-indigo-800 border-indigo-800/25',
  Document:   'bg-[#1A1A14]/8 text-[#1A1A14]/55 border-[#1A1A14]/15',
}

function CategoryPill({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] || 'bg-[#1A1A14]/8 text-[#1A1A14]/50 border-[#1A1A14]/15'
  return (
    <span className={`inline-block font-['Courier_Prime',monospace] text-[10px] tracking-[0.15em] uppercase border px-2 py-0.5 ${style}`}>
      {category}
    </span>
  )
}

const ALL_CATEGORIES = ['Minutes', 'CCR', 'Financial', 'Newsletter', 'Policy', 'History', 'Bylaws']

// ── Inner component that uses useSearchParams ──────────────────────────────
function ArchiveContent() {
  const searchParams = useSearchParams()
  const [entries, setEntries] = useState<ArchiveEntry[]>([])
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const cat = searchParams.get('category')
    if (!cat) return 'all'
    const normalized = cat.toLowerCase()
    const match = [...ALL_CATEGORIES, 'Photos'].find(c => c.toLowerCase() === normalized)
    return match ?? 'all'
  })
  const [selectedType, setSelectedType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/archive-index.json')
      .then(r => r.json())
      .then((data: ArchiveEntry[]) => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const enriched = useMemo(() =>
    entries.map(e => ({ ...e, docYear: parseDocumentYear(e), docDate: parseDocumentDate(e) })),
    [entries]
  )

  const years = useMemo(() =>
    [...new Set(enriched.map(e => e.docYear))].sort((a, b) => b.localeCompare(a)),
    [enriched]
  )

  const filtered = useMemo(() => enriched.filter(e => {
    if (selectedYear !== 'all' && e.docYear !== selectedYear) return false
    if (selectedType !== 'all' && e.type !== selectedType) return false
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'Photos' && e.type !== 'photo') return false
      if (selectedCategory !== 'Photos' && e.category !== selectedCategory) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!e.filename.toLowerCase().includes(q) && !formatTitle(e.filename).toLowerCase().includes(q)) return false
    }
    return true
  }), [enriched, search, selectedYear, selectedCategory, selectedType])

  const byYear = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const e of filtered) {
      if (!groups[e.docYear]) groups[e.docYear] = []
      groups[e.docYear].push(e)
    }
    return groups
  }, [filtered])

  const sortedYears = Object.keys(byYear).sort((a, b) => b.localeCompare(a))

  return (
    <>
      {/* Filter bar */}
      <div className="border-b border-[#1A1A14]/15 bg-[#F5F0E4]/95 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] bg-white border border-[#1A1A14]/20 px-3 py-1.5 font-['Courier_Prime',monospace] text-sm text-[#1A1A14] placeholder-[#1A1A14]/30 focus:outline-none focus:border-[#2D5016]"
          />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-white border border-[#1A1A14]/20 px-3 py-1.5 font-['Courier_Prime',monospace] text-sm text-[#1A1A14] focus:outline-none focus:border-[#2D5016]"
          >
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-white border border-[#1A1A14]/20 px-3 py-1.5 font-['Courier_Prime',monospace] text-sm text-[#1A1A14] focus:outline-none focus:border-[#2D5016]"
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="photo">Photos</option>
          </select>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#1A1A14]/20 px-3 py-1.5 font-['Courier_Prime',monospace] text-sm text-[#1A1A14] focus:outline-none focus:border-[#2D5016]"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Photos">Photos</option>
          </select>
          <span className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/35 tracking-wider ml-auto whitespace-nowrap">
            {filtered.length} of {entries.length} files
          </span>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">

        {loading && (
          <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/40 text-center italic py-20">
            Loading archive...
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/40 text-center italic py-20">
            No documents match your search.
          </p>
        )}

        {sortedYears.map(year => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-5">
              <span className="inline-block bg-[#2D5016] text-[#F5F0E4] font-['Courier_Prime',monospace] text-[11px] tracking-[0.2em] uppercase px-2.5 py-1">
                {year}
              </span>
              <div className="flex-1 h-px bg-[#1A1A14]/15" />
              <span className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/30 tracking-wider">
                {byYear[year].length} file{byYear[year].length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="divide-y divide-[#1A1A14]/10 border border-[#1A1A14]/10">
              {byYear[year].map((entry, i) => (
                <a
                  key={i}
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-[#F5F0E4] hover:bg-[#EDE7D4] transition-colors px-4 py-3.5"
                >
                  <span className="text-lg shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
                    {entry.type === 'photo' ? '🖼️' : '📄'}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-['Playfair_Display',serif] font-semibold text-[#1A1A14] group-hover:text-[#2D5016] transition-colors leading-snug truncate">
                      {formatTitle(entry.filename)}
                    </p>
                    <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/35 mt-0.5">
                      {entry.docDate}
                    </p>
                  </div>

                  {entry.category && (
                    <div className="shrink-0 hidden sm:block">
                      <CategoryPill category={entry.category} />
                    </div>
                  )}

                  <span className="shrink-0 font-['Courier_Prime',monospace] text-xs text-[#2D5016] group-hover:underline whitespace-nowrap">
                    {entry.type === 'photo' ? 'View ↗' : 'Download ↓'}
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}

        {!loading && entries.length > 0 && (
          <div className="border border-[#1A1A14]/15 p-6 bg-[#2D5016]/5 text-center">
            <p className="font-['IM_Fell_English',serif] text-lg text-[#1A1A14]/60 italic">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Link href="/#contact" className="mt-2 inline-block font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline tracking-wide">
              Contact the board →
            </Link>
          </div>
        )}
      </main>
    </>
  )
}

// ── Outer component — wraps inner in Suspense (required for useSearchParams) ─
export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-[#F5F0E4]">

      {/* Masthead */}
      <header className="border-b-4 border-double border-[#1A1A14]">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <Link href="/" className="font-['Courier_Prime',monospace] text-xs tracking-[0.3em] uppercase text-[#1A1A14]/40 hover:text-[#2D5016] transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-bold text-[#1A1A14] mt-3">
            The Archive
          </h1>
          <p className="font-['IM_Fell_English',serif] italic text-[#1A1A14]/55 mt-2 text-lg">
            Historical records, minutes, reports &amp; documents
          </p>
          <div className="flex justify-center gap-4 mt-4 font-['Courier_Prime',monospace] text-[11px] text-[#1A1A14]/35 tracking-widest uppercase">
            <span>Belmont Terrace Mutual Water Company</span>
            <span>·</span>
            <span>Sebastopol, CA</span>
          </div>
        </div>
      </header>

      <Suspense fallback={
        <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/40 text-center italic py-20">
          Loading archive...
        </p>
      }>
        <ArchiveContent />
      </Suspense>

      <footer className="border-t-4 border-double border-[#1A1A14] mt-12 py-6 text-center">
        <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 tracking-widest uppercase">
          Belmont Terrace Mutual Water Company · Sebastopol, California
        </p>
      </footer>
    </div>
  )
}