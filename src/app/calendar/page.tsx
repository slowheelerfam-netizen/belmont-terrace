'use client'

import { useState } from 'react'

const EVENTS = [
  {
    id: 1,
    title: 'Water Board Meeting',
    date: '2026-03-10',
    time: '7:00 PM',
    location: 'Sebastopol Community Center',
    description: 'Monthly board meeting open to all members. Agenda posted one week prior.',
    category: 'board',
  },
  {
    id: 2,
    title: 'General Membership Meeting',
    date: '2026-03-25',
    time: '6:30 PM',
    location: 'Sebastopol Community Center',
    description: 'Annual general membership meeting. All homeowners encouraged to attend.',
    category: 'membership',
  },
  {
    id: 3,
    title: 'Scheduled Water Flush',
    date: '2026-04-06',
    time: '9:00 AM',
    location: 'Throughout Belmont Terrace',
    description: 'Annual system flush. Expect brief discoloration. Avoid laundry during this time.',
    category: 'maintenance',
  },
  {
    id: 4,
    title: 'Water Board Meeting',
    date: '2026-04-14',
    time: '7:00 PM',
    location: 'Sebastopol Community Center',
    description: 'Monthly board meeting open to all members.',
    category: 'board',
  },
  {
    id: 5,
    title: 'Preventive Maintenance Window',
    date: '2026-04-22',
    time: '3:00 AM',
    location: 'Well #1 & Well #2',
    description: 'Conservation required. No outside watering or laundry. See notice for details.',
    category: 'maintenance',
  },
  {
    id: 6,
    title: 'Water Board Meeting',
    date: '2026-05-12',
    time: '7:00 PM',
    location: 'Sebastopol Community Center',
    description: 'Monthly board meeting open to all members.',
    category: 'board',
  },
  {
    id: 7,
    title: 'Consumer Confidence Report Deadline',
    date: '2026-07-01',
    time: 'All Day',
    location: 'N/A',
    description: 'State-required annual water quality report must be distributed to all members by July 1.',
    category: 'compliance',
  },
]

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  board:       { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Board Meeting' },
  membership:  { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Membership' },
  maintenance: { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'Maintenance' },
  compliance:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Compliance' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

function makeGoogleCalendarUrl(event: typeof EVENTS[0]) {
  const start = event.date.replace(/-/g, '') + (event.time === 'All Day' ? '' : 'T' + toTime24(event.time) + '00')
  const details = encodeURIComponent(event.description)
  const location = encodeURIComponent(event.location)
  const title = encodeURIComponent(event.title)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${start}&details=${details}&location=${location}`
}

function makeICSContent(event: typeof EVENTS[0]) {
  const dateStr = event.date.replace(/-/g, '')
  const uid = `event-${event.id}@belmontterrace.org`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Belmont Terrace//Water Company//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${dateStr}`,
    `DTEND:${dateStr}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function toTime24(time: string) {
  if (time === 'All Day') return '000000'
  const [timePart, meridiem] = time.split(' ')
  const [h, m] = timePart.split(':').map(Number)
  const hour = meridiem === 'PM' && h !== 12 ? h + 12 : meridiem === 'AM' && h === 12 ? 0 : h
  return `${String(hour).padStart(2, '0')}${String(m).padStart(2, '0')}00`
}

function downloadICS(event: typeof EVENTS[0]) {
  const content = makeICSContent(event)
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/\s+/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter)

  return (
    <main className="min-h-screen bg-sky-50 text-slate-800">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-12 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">BT</div>
          <div>
            <div className="text-sm font-semibold text-slate-800 leading-tight">Belmont Terrace</div>
            <div className="text-xs text-slate-400 leading-tight">Mutual Water Company</div>
          </div>
        </a>
        <a href="/" className="text-sm text-blue-600 no-underline hover:underline">← Back to Home</a>
      </nav>

      <div className="px-24 py-16">
        <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-3">Member Resources</div>
        <h1 className="text-5xl font-light text-slate-800 mb-2">Events & Calendar</h1>
        <p className="text-base text-slate-500 font-light mb-10">Board meetings, maintenance windows, and compliance deadlines for Belmont Terrace members.</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {[
            { key: 'all', label: 'All Events' },
            { key: 'board', label: 'Board Meetings' },
            { key: 'membership', label: 'Membership' },
            { key: 'maintenance', label: 'Maintenance' },
            { key: 'compliance', label: 'Compliance' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                filter === key
                  ? 'bg-blue-700 text-white border-blue-700 font-medium'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Event list */}
          <div className="flex flex-col gap-3">
            {filtered.map((event) => {
              const d = formatShortDate(event.date)
              const cat = CATEGORY_STYLES[event.category]
              const isSelected = selectedEvent?.id === event.id
              const isPast = new Date(event.date) < new Date()
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(isSelected ? null : event)}
                  className={`w-full text-left bg-white border rounded-lg p-5 flex gap-4 items-start transition-all cursor-pointer ${
                    isSelected ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:border-blue-200 hover:shadow-sm'
                  } ${isPast ? 'opacity-60' : ''}`}
                >
                  {/* Date block */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-xs font-bold text-blue-600 tracking-widest">{d.month}</div>
                    <div className="text-3xl font-light text-slate-800 leading-none">{d.day}</div>
                    <div className="text-xs text-slate-400 mt-1">{d.weekday}</div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>{cat.label}</span>
                      {isPast && <span className="text-xs text-slate-400">Past</span>}
                    </div>
                    <div className="text-base font-medium text-slate-800 mb-1">{event.title}</div>
                    <div className="text-xs text-slate-400">🕐 {event.time} · 📍 {event.location}</div>
                  </div>
                  <div className={`text-slate-300 transition-transform ${isSelected ? 'rotate-90' : ''}`}>›</div>
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          <div className="sticky top-8 self-start">
            {selectedEvent ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-4 ${CATEGORY_STYLES[selectedEvent.category].bg} ${CATEGORY_STYLES[selectedEvent.category].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLES[selectedEvent.category].dot}`} />
                  {CATEGORY_STYLES[selectedEvent.category].label}
                </div>
                <h2 className="text-2xl font-light text-slate-800 mb-2">{selectedEvent.title}</h2>
                <div className="text-sm text-blue-600 font-medium mb-6">{formatDate(selectedEvent.date)}</div>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-base">🕐</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-base">📍</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-base">📝</span>
                    <span>{selectedEvent.description}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-3">Add to Calendar</div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={makeGoogleCalendarUrl(selectedEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 no-underline hover:bg-sky-50 hover:border-blue-300 transition-all"
                    >
                      <span className="text-lg">📅</span>
                      Add to Google Calendar
                    </a>
                    <button
                      onClick={() => downloadICS(selectedEvent)}
                      className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-transparent cursor-pointer hover:bg-sky-50 hover:border-blue-300 transition-all text-left"
                    >
                      <span className="text-lg">🍎</span>
                      Add to Apple / Outlook Calendar (.ics)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <div className="text-slate-400 text-sm">Select an event to view details and add it to your calendar</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-white/40 px-24 py-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Belmont Terrace Mutual Water Company · Sebastopol, CA</span>
          <a href="mailto:Jean@BelmontTerrace.org" className="no-underline hover:text-white transition-colors">Jean@BelmontTerrace.org</a>
        </div>
      </footer>
    </main>
  )
}
