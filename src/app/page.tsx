'use client'
import PaymentForm from './components/PaymentForm'

import { useEffect, useState } from 'react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [hasAlert, setHasAlert] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pages = [
    { icon: '📋', title: 'Meeting Minutes', desc: 'Board and general membership meeting minutes.' },
    { icon: '💧', title: 'Consumer Confidence Reports', desc: 'Annual water quality reports required by the state.' },
    { icon: '📰', title: 'Newsletters', desc: 'Community newsletters and announcements.' },
    { icon: '📅', title: 'Meeting Invitations', desc: 'Upcoming and archived meeting invitations.' },
    { icon: '💰', title: 'Financial Reports', desc: 'Annual financial statements and budgets.' },
    { icon: '📜', title: 'By-Laws', desc: 'Governing documents for Belmont Terrace Mutual Water Co.' },
  ]

  const updates = [
    { date: 'Jun 17, 2025', title: '2024 Consumer Confidence Report is now available', isNew: true },
    { date: 'Apr 22, 2025', title: 'Pump replacement in progress', isNew: false },
    { date: 'Apr 18, 2025', title: 'Preventive maintenance — Conserve Water 4/22–4/23', isNew: false },
    { date: 'Jul 10, 2024', title: '2023 Consumer Confidence Report is available', isNew: false },
  ]

  return (
    <main className="bg-sky-50 text-slate-800 overflow-x-hidden">

      {/* Alert Banner */}
      {hasAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white text-sm flex items-center justify-center gap-3 px-4 py-2">
          <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
          2024 Consumer Confidence Report is now available —{' '}
          <a href="#documents" className="underline text-blue-200">View Report</a>
          <button
            onClick={() => setHasAlert(false)}
            className="ml-4 text-white/60 hover:text-white text-lg leading-none bg-transparent border-none cursor-pointer"
          >×</button>
        </div>
      )}

      {/* Nav */}
      <nav
        className={`fixed left-0 right-0 z-40 flex items-center justify-between px-12 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur border-b border-slate-200 py-3' : 'py-5'
        }`}
        style={{ top: hasAlert ? '2rem' : 0 }}
      >
        <a href="#" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">BT</div>
          <div>
            <div className="text-sm font-semibold text-slate-800 leading-tight">Belmont Terrace</div>
            <div className="text-xs text-slate-400 leading-tight">Mutual Water Company</div>
          </div>
        </a>
        <ul className="flex gap-8 items-center list-none">
          <li><a href="#updates" className="text-sm text-slate-500 no-underline hover:text-slate-800 transition-colors">Updates</a></li>
          <li><a href="/calendar" className="text-sm text-slate-500 no-underline hover:text-slate-800 transition-colors">Calendar</a></li>
          <li><a href="#documents" className="text-sm text-slate-500 no-underline hover:text-slate-800 transition-colors">Documents</a></li>
          <li><a href="#contact" className="text-sm text-slate-500 no-underline hover:text-slate-800 transition-colors">Contact</a></li>
          <li>
            <a href="#payment" className="text-sm bg-blue-700 text-white px-5 py-2 rounded no-underline hover:bg-blue-600 transition-colors">
              Pay Bill
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section
        className="min-h-screen flex flex-col justify-center px-24 bg-gradient-to-br from-sky-50 via-white to-blue-50 relative overflow-hidden"
        style={{ paddingTop: hasAlert ? '8rem' : '6rem' }}
      >
        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-sky-100 rounded-full opacity-50 blur-2xl" />

        <div className="relative max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase text-blue-600 mb-6">
            <span className="w-6 h-px bg-blue-600" />
            Sebastopol, California · Est. 1952
          </div>
          <h1 className="text-6xl font-light leading-tight mb-6 text-slate-800">
            Sebastopol&apos;s<br />
            <span className="text-blue-700 font-normal">Best Water.</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-500 font-light mb-4 max-w-xl">
            Belmont Terrace Mutual Water Company serves 87 homes in Sebastopol from two community wells. Member-owned, community-operated since 1952.
          </p>
          <p className="text-sm text-slate-400 font-light mb-10">
            Managed by a volunteer board. Operated by a third-party operator. Banked through Redwood Credit Union.
          </p>
          <div className="flex gap-4 items-center">
            <a href="#updates" className="bg-blue-700 text-white px-8 py-3 rounded text-sm font-medium no-underline hover:bg-blue-600 transition-colors">
              Latest Updates
            </a>
            <a href="#payment" className="text-sm text-slate-700 no-underline border-b border-slate-400 pb-px hover:text-blue-700 hover:border-blue-700 transition-colors">
              Pay Water Bill →
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative flex gap-12 mt-16">
          {[
            { num: '87', label: 'Member Homes' },
            { num: '2', label: 'Community Wells' },
            { num: '1952', label: 'Year Founded' },
            { num: '38K', label: 'Gallon Storage Tank' },
          ].map((stat) => (
            <div key={stat.num} className="border-l-2 border-blue-200 pl-4">
              <div className="text-3xl font-light text-blue-700">{stat.num}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Updates */}
      <section id="updates" className="px-24 py-20 bg-white">
        <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-3">Well Phase II Updates</div>
        <h2 className="text-4xl font-light text-slate-800 mb-12">Latest News</h2>
        <div className="flex flex-col gap-px bg-slate-100">
          {updates.map((update, i) => (
            <a
              key={i}
              href="#"
              className="flex items-center justify-between px-8 py-5 bg-white hover:bg-sky-50 transition-colors no-underline text-slate-800 group"
            >
              <div className="flex items-center gap-6">
                <div className="text-xs text-slate-400 w-24 flex-shrink-0">{update.date}</div>
                <div className="text-sm font-normal text-slate-700 group-hover:text-blue-700 transition-colors">{update.title}</div>
              </div>
              <div className="flex items-center gap-3">
                {update.isNew && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">New</span>
                )}
                <span className="text-slate-300 group-hover:text-blue-400 transition-colors">→</span>
              </div>
            </a>
          ))}
        </div>
        <a href="#" className="inline-block mt-6 text-sm text-blue-600 no-underline hover:underline">View all updates →</a>
      </section>

      {/* Documents */}
      <section id="documents" className="px-24 py-20 bg-sky-50">
        <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-3">Member Resources</div>
        <h2 className="text-4xl font-light text-slate-800 mb-12">Documents & Reports</h2>
        <div className="grid grid-cols-3 gap-4">
          {pages.map((page) => (
            <a
              key={page.title}
              href="#"
              className="bg-white border border-slate-200 rounded p-6 no-underline text-slate-800 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-3">{page.icon}</div>
              <h3 className="text-base font-medium text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{page.title}</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">{page.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Payment */}
      <section id="payment" className="px-24 py-20 bg-white grid grid-cols-2 gap-24 items-start">
        <div>
          <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-3">Online Payments</div>
          <h2 className="text-4xl font-light text-slate-800 mb-6">Pay Your<br />Water Bill</h2>
          <p className="text-base leading-relaxed text-slate-500 font-light mb-8">
            Securely pay your quarterly water bill online. Payments are processed through Redwood Credit Union. A confirmation will be sent to your email.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6">
            <div className="text-sm font-medium text-amber-800 mb-1">⚠️ Late Payment Policy</div>
            <div className="text-xs text-amber-700 font-light">Accounts 30+ days past due are subject to a shutoff notice. See the full policy in the Documents section.</div>
          </div>
          <div className="flex flex-col gap-3">
            {['🔒 Processed through Redwood Credit Union', '✓ ACH bank transfer & credit/debit card accepted', '✓ Email receipt sent instantly'].map((item, i) => (
              <div key={i} className="text-sm text-slate-500 font-light">{item}</div>
            ))}
          </div>
        </div>
        <PaymentForm />
      </section>

      {/* Contact */}
      <section id="contact" className="px-24 py-20 bg-slate-800 text-white">
        <div className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-3">Get In Touch</div>
        <h2 className="text-4xl font-light text-white mb-12">Contact Us</h2>
        <div className="grid grid-cols-3 gap-12">
          <div>
            <div className="text-2xl mb-3">📧</div>
            <h3 className="text-base font-medium mb-2">Email</h3>
            <a href="mailto:Jean@BelmontTerrace.org" className="text-sm text-blue-300 no-underline hover:underline">Jean@BelmontTerrace.org</a>
            <p className="text-sm text-white/50 font-light mt-1">To be added to the email list, send your name and address.</p>
          </div>
          <div>
            <div className="text-2xl mb-3">📋</div>
            <h3 className="text-base font-medium mb-2">Water Board Meetings</h3>
            <p className="text-sm text-white/60 font-light">Board meetings are open to all members. Check the meetings page for upcoming dates and agendas.</p>
          </div>
          <div>
            <div className="text-2xl mb-3">🚨</div>
            <h3 className="text-base font-medium mb-2">Water Emergencies</h3>
            <p className="text-sm text-white/60 font-light">For urgent water issues such as main breaks or loss of service, contact the operator directly. Details provided to members.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/40 px-24 py-8">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="text-white/70 font-medium">Belmont Terrace Mutual Water Company</span>
            <span className="mx-2">·</span>
            Sebastopol, CA
          </div>
          <div className="flex gap-6">
            <a href="#" className="no-underline hover:text-white transition-colors">By-Laws</a>
            <a href="#" className="no-underline hover:text-white transition-colors">Late Payment Policy</a>
            <a href="#" className="no-underline hover:text-white transition-colors">Contact</a>
            <a href="mailto:Jean@BelmontTerrace.org" className="no-underline hover:text-white transition-colors">Jean@BelmontTerrace.org</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

