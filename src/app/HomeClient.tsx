'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link';

const PaymentModal = dynamic(() => import('@/app/components/PaymentModal'), { ssr: false })

type SiteUpdate = {
  _id: string
  title: string
  publishedAt: string
  category: string
  pdfLinks?: string[]
}

// ─── PHOTO ROTATION CONFIG ───────────────────────────────────────────────────
// Replace these URLs with your real Sebastopol/Sonoma photos when they arrive.
// Each entry: { src, credit } — credit is optional, shown as a small caption.
const heroPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=80',
    credit: 'Sonoma County Hills',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=80',
    credit: 'Northern California Oak Woodland',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80',
    credit: 'Morning Fog, Sonoma Valley',
  },
  {
    src: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1800&q=80',
    credit: 'Golden Hills at Dusk',
  },
]

const PHOTO_HOLD_MS = 9000
const PHOTO_FADE_MS = 1800

// ─── DOCUMENT ARCHIVE ────────────────────────────────────────────────────────
const docs = [
  { icon: '⚖️', title: 'By-Laws', desc: 'Governing documents for Belmont Terrace Mutual Water Co.', href: '#' },
  { icon: '💧', title: 'Consumer Confidence Reports', desc: 'Annual water quality reports required by the state.', href: '#' },
  { icon: '💰', title: 'Financial Reports', desc: 'Annual financial statements and budgets.', href: '#' },
  { icon: '📋', title: 'Meeting Minutes', desc: 'Board and general membership meeting minutes.', href: '#' },
  { icon: '📅', title: 'Meeting Invitations', desc: 'Upcoming and archived meeting invitations.', href: '#' },
  { icon: '📰', title: 'Newsletters', desc: 'Community newsletters and announcements.', href: '#' },
]

// ─── STATS ───────────────────────────────────────────────────────────────────
const stats = [
  { num: 87, suffix: '', label: 'Member Homes' },
  { num: 2, suffix: '', label: 'Community Wells' },
  { num: 1952, suffix: '', label: 'Est.' },
  { num: 38, suffix: 'K', label: 'Gal. Capacity' },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatUpdateDate(publishedAt: string) {
  const date = new Date(publishedAt)
  return {
    month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
    full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  }
}

function isNew(publishedAt: string) {
  return (new Date().getTime() - new Date(publishedAt).getTime()) / 86400000 <= 30
}

// ─── ANIMATED STAT ───────────────────────────────────────────────────────────
function AnimatedStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 40
        const increment = num / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= num) { setCount(num); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 1500 / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [num])
  return (
    <div ref={ref} className="text-center px-6 py-4 border-r border-stone-600 last:border-r-0">
      <div className="font-black text-5xl text-stone-100 tracking-tight leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        {count}{suffix}
      </div>
      <div className="text-xs text-stone-400 uppercase tracking-[0.2em] font-medium mt-1">{label}</div>
    </div>
  )
}

// ─── HERO PHOTO ROTATOR ──────────────────────────────────────────────────────
function HeroPhotoRotator() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIdx = (current + 1) % heroPhotos.length
      setNext(nextIdx)
      setFading(true)
      setTimeout(() => {
        setCurrent(nextIdx)
        setNext(null)
        setFading(false)
      }, PHOTO_FADE_MS)
    }, PHOTO_HOLD_MS)
    return () => clearInterval(interval)
  }, [current])

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Current photo with Ken Burns */}
      <div
        key={current}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          width: '100%', height: '100%',
          backgroundImage: `url(${heroPhotos[current].src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurns 12s ease-out forwards',
        }}
      />
      {/* Next photo fading in */}
      {next !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroPhotos[next].src})`,
            opacity: fading ? 1 : 0,
            transition: `opacity ${PHOTO_FADE_MS}ms ease-in-out`,
          }}
        />
      )}
      {/* Overlay: dark gradient for text readability */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(10,12,8,0.72) 0%, rgba(10,12,8,0.55) 50%, rgba(10,12,8,0.80) 100%)'
      }} />
      {/* Subtle newsprint grain */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px',
      }} />
      {/* Photo credit */}
      <div className="absolute bottom-4 right-4 text-stone-400 text-xs tracking-widest uppercase opacity-60">
        {heroPhotos[current].credit}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function HomeClient({ updates }: { updates: SiteUpdate[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const today = new Date()
  const datelineDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const latestUpdate = updates[0]
  const featuredUpdates = updates.slice(0, 3)
  const remainingUpdates = updates.slice(3)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Playfair+Display+SC:wght@400;700&family=IM+Fell+English:ital@0;1&family=Courier+Prime:wght@400;700&display=swap');

        :root {
          --ink: #1A1A14;
          --cream: #F5F0E4;
          --cream-dark: #EDE6D6;
          --forest: #2D5016;
          --forest-light: #3D6B1E;
          --sage: #7A9E5A;
          --sage-light: #A8C285;
          --warm-gray: #8B8478;
          --rule: #C8BFA8;
          --rule-dark: #A09888;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--cream); color: var(--ink); }

        @keyframes kenBurns {
          0%   { transform: scale(1.08) translate(0%, 0%); }
          100% { transform: scale(1.0) translate(-1%, -0.5%); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.8s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.4s ease both; }
        .fade-up-4 { animation: fadeUp 0.8s 0.55s ease both; }

        .nav-link {
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--cream);
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 1; }

        .nav-scrolled .nav-link { color: var(--ink); }

        .section-rule {
          border: none;
          border-top: 3px double var(--rule-dark);
          margin: 0;
        }
        .section-rule-sm {
          border: none;
          border-top: 1px solid var(--rule);
          margin: 0;
        }

        .masthead-rule {
          height: 2px;
          background: linear-gradient(to right, transparent, var(--forest), var(--forest), transparent);
        }

        .col-rule {
          width: 1px;
          background: var(--rule);
          flex-shrink: 0;
        }

        .drop-cap::first-letter {
          float: left;
          font-family: 'Playfair Display SC', serif;
          font-size: 4.5em;
          line-height: 0.75;
          margin-right: 0.08em;
          margin-top: 0.06em;
          color: var(--forest);
        }

        .update-card:hover .update-headline {
          color: var(--forest);
          text-decoration: underline;
          text-decoration-color: var(--sage);
        }

        .doc-card {
          background: var(--cream);
          border: 1px solid var(--rule);
          transition: all 0.2s;
        }
        .doc-card:hover {
          border-color: var(--forest);
          background: #EEE8D8;
        }

        .badge-notice {
          background: var(--forest);
          color: var(--cream);
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 2px 8px;
        }

        .badge-new {
          background: #8B1A1A;
          color: #F5E8E8;
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 2px 8px;
        }

        .ticker-wrap {
          background: var(--forest);
          overflow: hidden;
        }
        .ticker-label {
          background: #1A3A0A;
          color: var(--sage-light);
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 6px 14px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        @keyframes ticker {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-inner {
          animation: ticker 30s linear infinite;
          white-space: nowrap;
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: #D4EBB8;
          padding: 6px 0;
        }

        .print-border {
          border: 1px solid var(--rule-dark);
          outline: 3px double var(--rule);
          outline-offset: 4px;
        }
      `}</style>

      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      {/* ── BREAKING NEWS TICKER ── */}
      {latestUpdate && (
        <div className="ticker-wrap flex items-center">
          <div className="ticker-label">Latest</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-inner">
              {latestUpdate.title}&nbsp;&nbsp;·&nbsp;&nbsp;{latestUpdate.title}&nbsp;&nbsp;·&nbsp;&nbsp;{latestUpdate.title}
            </div>
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}
        style={{
          background: scrolled ? 'var(--cream)' : 'transparent',
          borderBottom: scrolled ? '2px double var(--rule-dark)' : 'none',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between py-4">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Playfair Display SC', serif",
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              color: scrolled ? 'var(--ink)' : 'var(--cream)',
              opacity: 0.9,
            }}>B.T.M.W.C.</span>
          </Link>
          <ul className="hidden md:flex gap-8 items-center list-none">
            {[
              { label: 'Updates', href: '#updates' },
              { label: 'Calendar', href: '/calendar' },
              { label: 'Documents', href: '#documents' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <li key={label}><a href={href} className="nav-link" style={{ color: scrolled ? 'var(--ink)' : undefined }}>{label}</a></li>
            ))}
            <li>
              <button
                onClick={() => setPaymentOpen(true)}
                style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  background: 'var(--forest)',
                  color: 'var(--cream)',
                  border: 'none',
                  padding: '8px 18px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--forest)')}
              >
                Pay Bill
              </button>
            </li>
          </ul>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? 'var(--ink)' : 'var(--cream)' }}
            className="md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: 'var(--cream)', borderTop: '2px double var(--rule-dark)', padding: '24px' }}>
            <ul className="flex flex-col gap-4 list-none">
              {[
                { label: 'Updates', href: '#updates' },
                { label: 'Calendar', href: '/calendar' },
                { label: 'Documents', href: '#documents' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                    }}
                  >{label}</a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { setMenuOpen(false); setPaymentOpen(true) }}
                  style={{
                    width: '100%',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    background: 'var(--forest)',
                    color: 'var(--cream)',
                    border: 'none',
                    padding: '12px',
                    cursor: 'pointer',
                  }}
                >Pay Water Bill</button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <HeroPhotoRotator />
        <div className="relative max-w-7xl mx-auto px-6 md:px-16 w-full pb-16 pt-32">

          {/* Masthead */}
          <div className="fade-up-1 text-center mb-6">
            <p style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,228,0.6)',
              marginBottom: '12px',
            }}>
              Est. 1952 &nbsp;·&nbsp; Sebastopol, California &nbsp;·&nbsp; Member-Owned
            </p>
            <div style={{ borderTop: '1px solid rgba(245,240,228,0.3)', marginBottom: '12px' }} />
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 6vw, 6rem)',
              fontWeight: 900,
              color: '#F5F0E4',
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 40px rgba(0,0,0,0.5)',
            }}>
              Belmont Terrace<br />
              <em style={{ fontWeight: 400, fontSize: '0.82em', color: '#D4EBB8' }}>Mutual Water Company</em>
            </h1>
            <div style={{ borderTop: '1px solid rgba(245,240,228,0.3)', marginTop: '12px', marginBottom: '10px' }} />
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}>
              <p style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,228,0.55)',
              }}>{datelineDate}</p>
              <span style={{ color: 'rgba(245,240,228,0.3)' }}>·</span>
              <p style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,228,0.55)',
              }}>Serving 87 Member Homes</p>
            </div>
          </div>

          {/* CTA row */}
          <div className="fade-up-3 flex flex-wrap gap-4 justify-center mt-8">
            <button
              onClick={() => setPaymentOpen(true)}
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'var(--forest)',
                color: 'var(--cream)',
                border: '1px solid var(--sage)',
                padding: '14px 32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--forest)')}
            >
              Pay My Water Bill
            </button>
            <a
              href="#updates"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--cream)',
                border: '1px solid rgba(245,240,228,0.4)',
                padding: '14px 32px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,240,228,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,240,228,0.4)')}
            >
              Latest Updates
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#1A2410', borderBottom: '2px double #3D5A28' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => <AnimatedStat key={stat.label} {...stat} />)}
          </div>
        </div>
      </section>

      {/* ── NEWSPAPER FRONT PAGE ── */}
      <section style={{ background: 'var(--cream)', paddingTop: '60px' }} id="updates">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Section flag */}
          <div className="flex items-center gap-4 mb-2">
            <span style={{
              background: 'var(--forest)',
              color: 'var(--cream)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '4px 12px',
            }}>Community Bulletin</span>
            <hr className="flex-1 section-rule-sm" />
          </div>
          <div style={{ borderTop: '3px double var(--rule-dark)', marginBottom: '32px' }} />

          {/* FRONT PAGE LAYOUT: featured 2-col + sidebar */}
          <div className="flex gap-8">
            {/* Main column */}
            <div className="flex-1 min-w-0">

              {/* Lead story */}
              {featuredUpdates[0] && (() => {
                const { month, day, year, full } = formatUpdateDate(featuredUpdates[0].publishedAt)
                const fresh = isNew(featuredUpdates[0].publishedAt)
                return (
                  <article className="update-card mb-8 pb-8" style={{ borderBottom: '2px double var(--rule-dark)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      {fresh && <span className="badge-new">New</span>}
                      <span style={{
                        fontFamily: "'Courier Prime', monospace",
                        fontSize: '0.6rem',
                        letterSpacing: '0.15em',
                        color: 'var(--warm-gray)',
                        textTransform: 'uppercase',
                      }}>{full}</span>
                    </div>
                    <a href="#" style={{ textDecoration: 'none' }}>
                      <h2 className="update-headline" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: 'var(--ink)',
                        marginBottom: '16px',
                        transition: 'color 0.2s',
                      }}>{featuredUpdates[0].title}</h2>
                    </a>
                    <p className="drop-cap" style={{
                      fontFamily: "'IM Fell English', serif",
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      color: '#3A3830',
                      maxWidth: '580px',
                    }}>
                      The Board of Directors of Belmont Terrace Mutual Water Company wishes to inform all member homeowners of this important update to our water system operations. Members are encouraged to review this notice carefully and contact the board with any questions.
                    </p>
                    <a href="#" style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      fontFamily: "'Courier Prime', monospace",
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--forest)',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--sage)',
                    }}>Continue Reading →</a>
                  </article>
                )
              })()}

              {/* Secondary stories in 2 columns */}
              <div className="hidden md:flex gap-0">
                {featuredUpdates.slice(1).map((update, i) => {
                  const { full } = formatUpdateDate(update.publishedAt)
                  const fresh = isNew(update.publishedAt)
                  return (
                    <article
                      key={update._id}
                      className="update-card flex-1 px-6 first:pl-0"
                      style={{ borderRight: i === 0 ? '1px solid var(--rule)' : 'none' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {fresh && <span className="badge-new">New</span>}
                        <span style={{
                          fontFamily: "'Courier Prime', monospace",
                          fontSize: '0.58rem',
                          letterSpacing: '0.12em',
                          color: 'var(--warm-gray)',
                          textTransform: 'uppercase',
                        }}>{full}</span>
                      </div>
                      <a href="#" style={{ textDecoration: 'none' }}>
                        <h3 className="update-headline" style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: 'var(--ink)',
                          marginBottom: '10px',
                          transition: 'color 0.2s',
                        }}>{update.title}</h3>
                      </a>
                      <p style={{
                        fontFamily: "'IM Fell English', serif",
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        color: '#4A4840',
                      }}>
                        The board reports on the status of ongoing water system improvements and member notices.
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0" style={{ borderLeft: '1px solid var(--rule)', paddingLeft: '28px' }}>
              <div style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--warm-gray)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--rule)',
              }}>System Status</div>

              <div style={{
                background: '#EAF2E0',
                border: '1px solid var(--sage)',
                padding: '12px 14px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3D8A2A', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span style={{
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--forest)',
                    fontWeight: 700,
                  }}>Normal Operation</span>
                </div>
                <p style={{
                  fontFamily: "'IM Fell English', serif",
                  fontSize: '0.82rem',
                  color: '#3A4A30',
                  lineHeight: 1.5,
                  marginTop: '6px',
                }}>All systems operating within normal parameters. No conservation notices in effect.</p>
              </div>

              <div style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--warm-gray)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--rule)',
              }}>Past Notices</div>

              {remainingUpdates.slice(0, 5).map((update) => {
                const { month, day, year } = formatUpdateDate(update.publishedAt)
                return (
                  <a key={update._id} href="#" style={{ textDecoration: 'none', display: 'block', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--rule)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ textAlign: 'center', flexShrink: 0, width: '32px' }}>
                        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: '0.55rem', color: 'var(--warm-gray)', textTransform: 'uppercase' }}>{month}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{day}</div>
                        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: '0.5rem', color: 'var(--warm-gray)' }}>{year}</div>
                      </div>
                      <p style={{
                        fontFamily: "'IM Fell English', serif",
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                        color: 'var(--ink)',
                        flex: 1,
                      }}>{update.title}</p>
                    </div>
                  </a>
                )
              })}

              <a href="#" style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--forest)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--sage)',
              }}>Full Archive →</a>
            </aside>
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS ── */}
      <section id="documents" style={{ background: 'var(--cream-dark)', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-2">
            <span style={{
              background: 'var(--ink)',
              color: 'var(--cream)',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '4px 12px',
            }}>Public Records</span>
            <hr className="flex-1 section-rule-sm" />
          </div>
          <div style={{ borderTop: '3px double var(--rule-dark)', marginBottom: '10px' }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: '8px',
          }}>Documents &amp; Reports</h2>
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '1rem',
            color: 'var(--warm-gray)',
            fontStyle: 'italic',
            marginBottom: '36px',
          }}>
            All records pertaining to Belmont Terrace Mutual Water Company, available to member homeowners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--rule)', border: '1px solid var(--rule)' }}>
            {docs.map((doc) => (
              <a key={doc.title} href={doc.href} className="doc-card" style={{ padding: '24px 28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{doc.icon}</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}>{doc.title}</h3>
                <p style={{
                  fontFamily: "'IM Fell English', serif",
                  fontSize: '0.88rem',
                  color: 'var(--warm-gray)',
                  lineHeight: 1.55,
                  fontStyle: 'italic',
                  flex: 1,
                }}>{doc.desc}</p>
                <span style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--forest)',
                  marginTop: '8px',
                }}>View Archive →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ background: 'var(--forest)', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <span style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--sage-light)',
                display: 'block',
                marginBottom: '12px',
              }}>About the Company</span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                fontWeight: 700,
                color: 'var(--cream)',
                lineHeight: 1.1,
                marginBottom: '24px',
              }}>
                Your neighbors,<br />
                <em style={{ fontWeight: 400 }}>managing your water.</em>
              </h2>
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: '1.05rem',
                lineHeight: 1.75,
                color: '#C8E0A8',
                marginBottom: '20px',
              }}>
                Belmont Terrace Mutual Water Company is a nonprofit, member-owned utility serving 87 homes in Sebastopol, California. Every homeowner in the Terrace is a member and co-owner of the water system.
              </p>
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: '1.05rem',
                lineHeight: 1.75,
                color: '#A8C885',
              }}>
                Our volunteer board works alongside Weeks Plumbing, our professional third-party operator, to maintain clean, reliable water drawn from two community wells. Banking is held through Redwood Credit Union.
              </p>
              <a href="/contact" style={{
                display: 'inline-block',
                marginTop: '28px',
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
                textDecoration: 'none',
                border: '1px solid rgba(245,240,228,0.4)',
                padding: '12px 24px',
                transition: 'border-color 0.2s',
              }}>Contact the Board →</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🌊', title: 'Clean Water', desc: 'Annual testing exceeds state and federal standards.' },
                { icon: '🤝', title: 'Member-Owned', desc: 'Every homeowner is a co-owner of the system.' },
                { icon: '🔧', title: 'Maintained', desc: 'Professional third-party operator keeps things running.' },
                { icon: '📊', title: 'Transparent', desc: 'Full financial and board records available to all members.' },
              ].map((item) => (
                <div key={item.title} style={{
                  border: '1px solid rgba(245,240,228,0.15)',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.04)',
                }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--cream)',
                    marginBottom: '6px',
                  }}>{item.title}</div>
                  <div style={{
                    fontFamily: "'IM Fell English', serif",
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: 'var(--sage-light)',
                    lineHeight: 1.5,
                  }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PAY BILL CTA ── */}
      <section style={{ background: 'var(--cream)', padding: '60px 0', borderTop: '2px double var(--rule-dark)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div style={{
            display: 'inline-block',
            border: '1px solid var(--rule-dark)',
            outline: '3px double var(--rule)',
            outlineOffset: '4px',
            padding: '40px 60px',
          }}>
            <span style={{
              display: 'block',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--warm-gray)',
              marginBottom: '12px',
            }}>Online Payments</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '12px',
            }}>Pay Your Water Bill</h2>
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: '0.95rem',
              fontStyle: 'italic',
              color: 'var(--warm-gray)',
              marginBottom: '24px',
              maxWidth: '360px',
              margin: '0 auto 24px',
            }}>
              Secure ACH bank transfer or credit/debit card. Applied to your account within 1–2 business days.
            </p>
            <button
              onClick={() => setPaymentOpen(true)}
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'var(--forest)',
                color: 'var(--cream)',
                border: 'none',
                padding: '14px 40px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--forest-light)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--forest)')}
            >
              Pay My Water Bill
            </button>
            <p style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              color: 'var(--warm-gray)',
              marginTop: '14px',
              textTransform: 'uppercase',
            }}>Processed via Stripe · Banked through Redwood Credit Union</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0F1A08', borderTop: '2px double #2D5016', padding: '48px 0 24px' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10" style={{ borderBottom: '1px solid #2D5016' }}>
            <div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--cream)',
                marginBottom: '6px',
              }}>Belmont Terrace</h3>
              <p style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--sage)',
                marginBottom: '14px',
              }}>Mutual Water Company</p>
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: '0.85rem',
                fontStyle: 'italic',
                color: '#6A8A5A',
                lineHeight: 1.6,
              }}>Serving 87 homes in Sebastopol, CA since 1952. Member-owned, community-operated.</p>
            </div>
            <div>
              <h4 style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--sage)',
                marginBottom: '14px',
              }}>Public Records</h4>
              <ul style={{ listStyle: 'none' }}>
                {['Meeting Minutes', 'Consumer Confidence Reports', 'Newsletters', 'Financial Reports', 'By-Laws'].map(item => (
                  <li key={item} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{
                      fontFamily: "'IM Fell English', serif",
                      fontSize: '0.88rem',
                      color: '#6A8A5A',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--sage-light)')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6A8A5A')}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--sage)',
                marginBottom: '14px',
              }}>Quick Links</h4>
              <ul style={{ listStyle: 'none' }}>
                {[
                  { label: 'Calendar', href: '/calendar' },
                  { label: 'Pay Water Bill', href: '#' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Late Payment Policy', href: '#' },
                  { label: 'Jean@BelmontTerrace.org', href: 'mailto:Jean@BelmontTerrace.org' },
                ].map(item => (
                  <li key={item.label} style={{ marginBottom: '8px' }}>
                    <a href={item.href} style={{
                      fontFamily: "'IM Fell English', serif",
                      fontSize: '0.88rem',
                      color: '#6A8A5A',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--sage-light)')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6A8A5A')}
                    >{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '8px',
          }}>
            <span style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#3D5A28',
            }}>© 2026 Belmont Terrace Mutual Water Company · Sebastopol, CA</span>
            <span style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#3D5A28',
            }}>Operated by Weeks Plumbing · Banked through Redwood Credit Union</span>
          </div>
        </div>
      </footer>
    </>
  )
}