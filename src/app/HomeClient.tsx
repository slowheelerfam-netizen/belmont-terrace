'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const PaymentModal = dynamic(() => import('@/app/components/PaymentModal'), { ssr: false })

type SiteUpdate = {
  _id: string
  title: string
  publishedAt: string
  category: string
  pdfLinks?: string[]
}

const docs = [
  { icon: '📋', title: 'Meeting Minutes', desc: 'Board and general membership meeting minutes.', href: '#' },
  { icon: '💧', title: 'Consumer Confidence Reports', desc: 'Annual water quality reports required by the state.', href: '#' },
  { icon: '📰', title: 'Newsletters', desc: 'Community newsletters and announcements.', href: '#' },
  { icon: '📅', title: 'Meeting Invitations', desc: 'Upcoming and archived meeting invitations.', href: '#' },
  { icon: '💰', title: 'Financial Reports', desc: 'Annual financial statements and budgets.', href: '#' },
  { icon: '📜', title: 'By-Laws', desc: 'Governing documents for Belmont Terrace Mutual Water Co.', href: '#' },
]

const stats = [
  { num: 87, suffix: '', label: 'Member Homes' },
  { num: 2, suffix: '', label: 'Community Wells' },
  { num: 1952, suffix: '', label: 'Year Founded' },
  { num: 38, suffix: 'K', label: 'Gallon Tank' },
]

function formatUpdateDate(publishedAt: string) {
  const date = new Date(publishedAt)
  return {
    month: date.toLocaleString('en-US', { month: 'short' }),
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  }
}

function isNew(publishedAt: string) {
  const date = new Date(publishedAt)
  const now = new Date()
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 30
}

function capitalizeCategory(cat: string) {
  if (!cat) return ''
  return cat.charAt(0).toUpperCase() + cat.slice(1)
}

function AnimatedStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1500
        const steps = 40
        const increment = num / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= num) { setCount(num); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [num])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-1">{count}{suffix}</div>
      <div className="text-sm text-blue-200 uppercase tracking-widest">{label}</div>
    </div>
  )
}

export default function HomeClient({ updates }: { updates: SiteUpdate[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const latestUpdate = updates[0]

  return (
    <>
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />

      {latestUpdate && (
        <div className="bg-blue-700 text-white text-center py-2 px-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
            {latestUpdate.title} &mdash;{' '}
            <a href="#updates" className="underline font-semibold text-blue-100 hover:text-white">View Update</a>
          </span>
        </div>
      )}

      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-slate-900 shadow-xl' : 'bg-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:bg-blue-500 transition-colors">BT</div>
            <div>
              <div className="text-base font-semibold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Belmont Terrace</div>
              <div className="text-xs text-blue-300 leading-tight tracking-wide">Mutual Water Company</div>
            </div>
          </a>
          <ul className="hidden md:flex gap-8 items-center list-none">
            <li><a href="#updates" className="text-sm text-slate-300 no-underline hover:text-white transition-colors font-medium">Updates</a></li>
            <li><a href="/calendar" className="text-sm text-slate-300 no-underline hover:text-white transition-colors font-medium">Calendar</a></li>
            <li><a href="#documents" className="text-sm text-slate-300 no-underline hover:text-white transition-colors font-medium">Documents</a></li>
            <li><a href="/contact" className="text-sm text-slate-300 no-underline hover:text-white transition-colors font-medium">Contact</a></li>
            <li>
              <button onClick={() => setPaymentOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors border-none cursor-pointer shadow-md">
                Pay My Bill
              </button>
            </li>
          </ul>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-300 hover:text-white bg-transparent border-none cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-slate-800 px-6 py-6 border-t border-slate-700">
            <ul className="flex flex-col gap-4 list-none">
              {['Updates', 'Calendar', 'Documents', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={item === 'Calendar' ? '/calendar' : item === 'Contact' ? '/contact' : '#' + item.toLowerCase()} onClick={() => setMenuOpen(false)} className="text-base text-slate-300 no-underline hover:text-white transition-colors font-medium">{item}</a>
                </li>
              ))}
              <li>
                <button onClick={() => { setMenuOpen(false); setPaymentOpen(true) }} className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-blue-500 transition-colors border-none cursor-pointer">
                  Pay My Bill
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,197,253,0.2) 0%, transparent 40%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-xs font-medium tracking-widest uppercase">System Status: Normal Operation</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sebastopol&apos;s<br />
              <span className="text-blue-400">Finest Water.</span>
            </h1>
            <p className="text-xl text-blue-100 font-light mb-4 max-w-2xl leading-relaxed">
              Belmont Terrace Mutual Water Company has proudly served our Sebastopol neighborhood since 1952 — clean, reliable water from two community wells, managed by your neighbors.
            </p>
            <p className="text-sm text-slate-400 mb-10">87 member homes · Volunteer board · Third-party operated · Banked through Redwood Credit Union</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setPaymentOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-500 transition-all border-none cursor-pointer shadow-lg hover:-translate-y-0.5">
                Pay My Water Bill
              </button>
              <a href="#updates" className="bg-white/10 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/20 transition-all no-underline border border-white/20">Latest Updates</a>
            </div>
          </div>
        </div>
        <div className="wave-bottom">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '80px' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="bg-blue-700 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat) => (<AnimatedStat key={stat.label} {...stat} />))}
          </div>
        </div>
      </section>

      <section id="updates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">Well Phase II Updates</div>
              <h2 className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>Latest News</h2>
            </div>
            <a href="#" className="text-sm text-blue-600 no-underline hover:underline font-medium hidden md:block">View all updates</a>
          </div>
          <div className="flex flex-col gap-3">
            {updates.length === 0 && <p className="text-slate-400 text-sm">No updates yet.</p>}
            {updates.map((update) => {
              const { month, day, year } = formatUpdateDate(update.publishedAt)
              const fresh = isNew(update.publishedAt)
              const category = capitalizeCategory(update.category)
              return (
                <a key={update._id} href="#" className="flex items-center gap-6 p-5 bg-white border border-slate-100 rounded-xl no-underline text-slate-800 hover:border-blue-200 hover:shadow-md transition-all group card-hover">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase">{month}</div>
                    <div className="text-2xl font-bold text-slate-700">{day}</div>
                    <div className="text-xs text-slate-400">{year}</div>
                  </div>
                  <div className="w-px h-12 bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className={'inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 category-' + update.category}>{category}</span>
                    <div className="text-base font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{update.title}</div>
                  </div>
                  {fresh && <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">New</span>}
                </a>
              )
            })}
          </div>
          <a href="#" className="inline-block mt-6 text-sm text-blue-600 no-underline hover:underline font-medium md:hidden">View all updates</a>
        </div>
      </section>

      <section id="documents" className="py-20 bg-slate-50 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">Member Resources</div>
            <h2 className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>Documents &amp; Reports</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Everything you need to stay informed about your water system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {docs.map((doc) => (
              <a key={doc.title} href={doc.href} className="bg-white border border-slate-200 rounded-xl p-6 no-underline text-slate-800 hover:border-blue-400 hover:shadow-lg transition-all group card-hover flex flex-col">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">{doc.icon}</div>
                <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>{doc.title}</h3>
                <p className="text-sm text-slate-400 font-light leading-relaxed flex-1">{doc.desc}</p>
                <div className="mt-4 text-xs font-semibold text-blue-600 group-hover:text-blue-700">View documents</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xs font-semibold tracking-widest uppercase text-blue-300 mb-3">About Us</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Your neighbors,<br />managing your water.</h2>
                <p className="text-blue-100 leading-relaxed mb-6 font-light">Belmont Terrace Mutual Water Company is a nonprofit, member-owned utility. Every homeowner in the Terrace is a member and co-owner of the water system. Our volunteer board works with a professional third-party operator to keep your water clean and flowing.</p>
                <a href="/contact" className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl text-sm font-semibold no-underline hover:bg-blue-50 transition-colors">Contact the Board</a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🌊', title: 'Clean Water', desc: 'Annual testing exceeds state and federal standards.' },
                  { icon: '🤝', title: 'Member-Owned', desc: 'Every homeowner is a co-owner of the system.' },
                  { icon: '🔧', title: 'Maintained', desc: 'Professional third-party operator keeps systems running.' },
                  { icon: '📊', title: 'Transparent', desc: 'Full financial and board meeting records available.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-blue-200 text-xs font-light">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">Online Payments</div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ready to pay your water bill?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto font-light">Secure ACH bank transfer or credit/debit card. Your payment is applied to your account within 1-2 business days.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setPaymentOpen(true)} className="bg-blue-600 text-white px-10 py-4 rounded-xl text-base font-semibold hover:bg-blue-500 transition-all border-none cursor-pointer shadow-lg hover:-translate-y-0.5">Pay My Water Bill</button>
            <a href="/pay" className="bg-white text-slate-700 px-10 py-4 rounded-xl text-base font-semibold hover:bg-slate-50 transition-all no-underline border border-slate-200 shadow-sm">View Payment Page</a>
          </div>
          <p className="text-xs text-slate-400 mt-4">Processed securely via Stripe · Banked through Redwood Credit Union</p>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 pb-10 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">BT</div>
                <div>
                  <div className="text-white font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Belmont Terrace</div>
                  <div className="text-xs text-blue-400">Mutual Water Company</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-light leading-relaxed">Serving 87 homes in Sebastopol, CA since 1952. Member-owned, community-operated.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Resources</h4>
              <ul className="list-none space-y-2">
                {['Meeting Minutes', 'Consumer Confidence Reports', 'Newsletters', 'Financial Reports', 'By-Laws'].map((item) => (
                  <li key={item}><a href="#" className="text-sm text-slate-500 no-underline hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Quick Links</h4>
              <ul className="list-none space-y-2">
                {[
                  { label: 'Calendar', href: '/calendar' },
                  { label: 'Pay Water Bill', href: '#' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Late Payment Policy', href: '#' },
                  { label: 'Jean@BelmontTerrace.org', href: 'mailto:Jean@BelmontTerrace.org' },
                ].map((item) => (
                  <li key={item.label}><a href={item.href} className="text-sm text-slate-500 no-underline hover:text-white transition-colors">{item.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <span>2026 Belmont Terrace Mutual Water Company · Sebastopol, CA</span>
            <span>Managed by a volunteer board · Operated by Weeks Plumbing · Banked through Redwood Credit Union</span>
          </div>
        </div>
      </footer>
    </>
  )
}
