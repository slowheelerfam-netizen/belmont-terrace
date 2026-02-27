'use client'

import { useState } from 'react'
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', address: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>

      {/* Nav */}
      <nav className="bg-slate-900 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">BT</div>
          <div>
            <div className="text-base font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Belmont Terrace</div>
            <div className="text-xs text-blue-300">Mutual Water Company</div>
          </div>
        </Link>
        <Link href="/" className="text-sm text-slate-300 no-underline hover:text-white transition-colors">← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">Get In Touch</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Us</h1>
          <p className="text-blue-200 mt-3 font-light max-w-xl">Have a question about your water service, billing, or board meetings? We&apos;re here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Ways to Reach Us</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                icon: '📧',
                title: 'Email',
                content: 'Jean@BelmontTerrace.org',
                href: 'mailto:Jean@BelmontTerrace.org',
                note: 'To be added to the email notification list, include your name and property address.',
              },
              {
                icon: '📋',
                title: 'Water Board Meetings',
                content: 'Open to all members',
                href: '/calendar',
                note: 'Board meetings are held regularly and are open to all homeowners. Check the calendar for upcoming dates.',
              },
              {
                icon: '🚨',
                title: 'Water Emergencies',
                content: 'Contact the operator directly',
                href: null,
                note: 'For urgent issues such as main breaks or loss of service, contact the operator. Emergency details are provided to members via email.',
              },
              {
                icon: '💰',
                title: 'Billing Questions',
                content: 'Jean@BelmontTerrace.org',
                href: 'mailto:Jean@BelmontTerrace.org',
                note: 'For questions about your water bill or payment history, email Jean and include your property address.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-blue-600 no-underline hover:underline font-medium">{item.content}</a>
                  ) : (
                    <span className="text-sm text-blue-600 font-medium">{item.content}</span>
                  )}
                  <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Send a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-sm text-green-700 font-light">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Property Address *</label>
                <input
                  name="address"
                  type="text"
                  placeholder="123 Belmont Ave, Sebastopol CA"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Message *</label>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-sm font-semibold hover:bg-blue-500 transition-colors border-none cursor-pointer"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center text-xs text-slate-500">
          <span>© 2026 Belmont Terrace Mutual Water Company · Sebastopol, CA</span>
          <a href="mailto:Jean@BelmontTerrace.org" className="no-underline hover:text-white transition-colors">Jean@BelmontTerrace.org</a>
        </div>
      </footer>
    </>
  )
}
