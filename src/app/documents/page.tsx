// src/app/documents/page.tsx
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Document Archive | Belmont Terrace Mutual Water Company',
  description: 'Public documents, meeting minutes, water quality reports, and member resources.',
}

interface Doc {
  _id: string
  title: string
  category: string
  year: number
  description?: string
  fileUrl: string
  fileType?: string
  publishedAt: string
}

const docsQuery = groq`
  *[_type == "document"] | order(year desc, publishedAt desc) {
    _id, title, category, year, description,
    "fileUrl": file.asset->url,
    "fileType": file.asset->extension,
    publishedAt
  }
`

async function getDocs(): Promise<Doc[]> {
  return client.fetch(docsQuery)
}

const CATEGORY_ORDER = [
  'Water Quality Reports',
  'Meeting Minutes',
  'Financial Reports',
  'Rules & Regulations',
  'Forms',
  'Notices',
  'Other',
]

const CATEGORY_ICONS: Record<string, string> = {
  'Water Quality Reports': '🧪',
  'Meeting Minutes': '📋',
  'Financial Reports': '📊',
  'Rules & Regulations': '📜',
  'Forms': '📝',
  'Notices': '📢',
  'Other': '📄',
}

function FileTypeChip({ ext }: { ext?: string }) {
  const type = (ext || 'pdf').toUpperCase()
  const colors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700 border-red-200',
    DOCX: 'bg-blue-100 text-blue-700 border-blue-200',
    XLSX: 'bg-green-100 text-green-700 border-green-200',
    JPG: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }
  const c = colors[type] || 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span className={`font-['Courier_Prime',monospace] text-[10px] tracking-wider border px-1.5 py-0.5 ${c}`}>
      {type}
    </span>
  )
}

export default async function DocumentsPage() {
  const docs = await getDocs()

  // Group by category
  const byCategory: Record<string, Doc[]> = {}
  for (const doc of docs) {
    const cat = doc.category || 'Other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(doc)
  }

  // Sort categories
  const allCats = Object.keys(byCategory)
  const orderedCats = [
    ...CATEGORY_ORDER.filter((c) => allCats.includes(c)),
    ...allCats.filter((c) => !CATEGORY_ORDER.includes(c)),
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E4]" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}>

      {/* Masthead */}
      <header className="border-b-4 border-double border-[#1A1A14]">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="font-['Courier_Prime',monospace] text-xs tracking-[0.3em] uppercase text-[#1A1A14]/50 hover:text-[#2D5016] transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-bold text-[#1A1A14] mt-2">
            Document Archive
          </h1>
          <p className="font-['IM_Fell_English',serif] italic text-[#1A1A14]/60 mt-2">
            Public records, reports, and member resources
          </p>
          <div className="flex justify-center gap-6 mt-4 font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 tracking-widest uppercase">
            <span>Belmont Terrace Mutual Water Company</span>
            <span>·</span>
            <span>Sebastopol, CA</span>
          </div>
        </div>
      </header>

      {/* Category Nav */}
      <nav className="border-b border-[#1A1A14]/20 bg-[#F5F0E4]/80 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap gap-2">
          {orderedCats.map((cat) => (
            <a
              key={cat}
              href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`}
              className="font-['Courier_Prime',monospace] text-xs tracking-wider text-[#1A1A14]/60 hover:text-[#2D5016] hover:underline transition-colors"
            >
              {CATEGORY_ICONS[cat] || '📄'} {cat} ({byCategory[cat].length})
            </a>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {orderedCats.map((cat) => {
          const catDocs = byCategory[cat]
          // Group this category by year
          const byYear: Record<number, Doc[]> = {}
          for (const doc of catDocs) {
            const yr = doc.year || new Date(doc.publishedAt).getFullYear()
            if (!byYear[yr]) byYear[yr] = []
            byYear[yr].push(doc)
          }
          const years = Object.keys(byYear)
            .map(Number)
            .sort((a, b) => b - a)

          return (
            <section
              key={cat}
              id={cat.replace(/\s+/g, '-').toLowerCase()}
              className="scroll-mt-16"
            >
              {/* Section Header */}
              <div className="flex items-baseline gap-3 mb-6 border-b-2 border-[#1A1A14] pb-2">
                <span className="text-2xl">{CATEGORY_ICONS[cat] || '📄'}</span>
                <h2 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#1A1A14]">
                  {cat}
                </h2>
                <span className="font-['Courier_Prime',monospace] text-sm text-[#1A1A14]/40 ml-auto">
                  {catDocs.length} document{catDocs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {years.map((yr) => (
                <div key={yr} className="mb-8">
                  {years.length > 1 && (
                    <h3 className="font-['Courier_Prime',monospace] text-sm tracking-widest uppercase text-[#1A1A14]/50 mb-3 flex items-center gap-3">
                      <span>{yr}</span>
                      <span className="flex-1 border-t border-[#1A1A14]/10" />
                    </h3>
                  )}

                  <div className="grid grid-cols-1 gap-px bg-[#1A1A14]/10">
                    {byYear[yr].map((doc) => (
                      <a
                        key={doc._id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-4 bg-[#F5F0E4] hover:bg-[#EDE7D4] transition-colors p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileTypeChip ext={doc.fileType} />
                          </div>
                          <p className="font-['Playfair_Display',serif] font-bold text-[#1A1A14] group-hover:text-[#2D5016] transition-colors leading-snug">
                            {doc.title}
                          </p>
                          {doc.description && (
                            <p className="font-['IM_Fell_English',serif] text-sm text-[#1A1A14]/60 mt-1 leading-snug">
                              {doc.description}
                            </p>
                          )}
                          <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 mt-1">
                            {new Date(doc.publishedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className="shrink-0 mt-1 font-['Courier_Prime',monospace] text-xs text-[#2D5016] group-hover:underline whitespace-nowrap">
                          Download ↓
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )
        })}

        {docs.length === 0 && (
          <p className="font-['IM_Fell_English',serif] text-xl text-[#1A1A14]/50 text-center italic py-20">
            No documents have been published yet.
          </p>
        )}

        {/* Contact note */}
        <div className="border border-[#1A1A14]/20 p-6 bg-[#2D5016]/5 text-center">
          <p className="font-['IM_Fell_English',serif] text-lg text-[#1A1A14]/70 italic">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/#contact"
            className="mt-2 inline-block font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline"
          >
            Contact the board →
          </Link>
        </div>
      </main>

      <footer className="border-t-4 border-double border-[#1A1A14] mt-12 py-6 text-center">
        <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50 tracking-widest uppercase">
          Belmont Terrace Mutual Water Company · Sebastopol, California
        </p>
      </footer>
    </div>
  )
}
