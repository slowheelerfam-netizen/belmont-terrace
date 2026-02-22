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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//Belmont Terrace//Water Company//EN',
    'BEGIN:VEVENT',
    `UID:event-${event.id}@belmontterrace.org`,
    `DTSTART:${dateStr}`, `DTEND:${dateStr}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT', 'END:VCALENDAR',
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
  const blob = new Blob([makeICSContent(event)], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/\s+/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function MonthView({ onSelectEvent, selectedEvent }: {
  onSelectEvent: (event: typeof EVENTS[0] | null) => void
  selectedEvent: typeof EVENTS[0] | null
}) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const eventsThisMonth = EVENTS.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  const getEventsForDay = (day: number) =>
    eventsThisMonth.filter(e => new Date(e.date + 'T12:00:00').getDate() === day)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors border-none bg-transparent text-white cursor-pointer text-lg">‹</button>
        <h2 className="text-lg font-bold">{MONTHS[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors border-none bg-transparent text-white cursor-pointer text-lg">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {DAYS.map(d => (
          <div key={d} className="text-center py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayEvents = day ? getEventsForDay(day) : []
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
          return (
            <div
              key={i}
              className={`min-h-[100px] p-2 border-b border-r border-slate-100 ${day ? 'bg-white' : 'bg-slate-50'}`}
            >
              {day && (
                <>
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}>
                    {day}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.map(event => {
                      const cat = CATEGORY_STYLES[event.category]
                      const isSelected = selectedEvent?.id === event.id
                      return (
                        <button
                          key={event.id}
                          onClick={() => onSelectEvent(isSelected ? null : event)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-xs font-medium truncate cursor-pointer border-none transition-all ${cat.bg} ${cat.text} ${
                            isSelected ? 'ring-2 ring-blue-400' : 'hover:opacity-80'
                          }`}
                        >
                          {event.title}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-6 py-3 bg-slate-50 border-t border-slate-200">
        {Object.entries(CATEGORY_STYLES).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`w-2 h-2 rounded-full ${val.dot}`} />
            {val.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<'list' | 'month'>('list')

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter)

  return (
    <main className="min-h-screen bg-white text-slate-800">

      {/* Nav */}
      <nav className="bg-slate-900 px-6 md:px-12 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">BT</div>
          <div>
            <div className="text-base font-semibold text-white leading-tight">Belmont Terrace</div>
            <div className="text-xs text-blue-300 leading-tight">Mutual Water Company</div>
          </div>
        </a>
        <a href="/" className="text-sm text-slate-300 no-underline hover:text-white transition-colors">← Back to Home</a>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59,130,246,0.4) 0%, transparent 50%)`
        }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">Member Resources</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Events & Calendar</h1>
          <p className="text-blue-200 font-light max-w-xl">Board meetings, maintenance windows, and compliance deadlines for Belmont Terrace members.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'board', label: 'Board' },
              { key: 'membership', label: 'Membership' },
              { key: 'maintenance', label: 'Maintenance' },
              { key: 'compliance', label: 'Compliance' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer font-medium ${
                  filter === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 self-start md:self-auto">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none ${
                view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none ${
                view === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📅 Month
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MonthView onSelectEvent={setSelectedEvent} selectedEvent={selectedEvent} />
            </div>
            {/* Detail panel */}
            <div className="lg:sticky lg:top-8 self-start">
              {selectedEvent ? (
                <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
              ) : (
                <EmptyDetail />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    className={`w-full text-left bg-white border rounded-xl p-5 flex gap-4 items-start transition-all cursor-pointer ${
                      isSelected ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                    } ${isPast ? 'opacity-50' : ''}`}
                  >
                    <div className="flex-shrink-0 w-14 text-center bg-slate-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-blue-600 tracking-widest">{d.month}</div>
                      <div className="text-3xl font-bold text-slate-800 leading-none">{d.day}</div>
                      <div className="text-xs text-slate-400 mt-1">{d.weekday}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${cat.bg} ${cat.text}`}>
                        {cat.label}
                      </span>
                      {isPast && <span className="inline-block text-xs text-slate-400 ml-2">Past</span>}
                      <div className="text-base font-semibold text-slate-800 mb-1">{event.title}</div>
                      <div className="text-xs text-slate-400">🕐 {event.time} · 📍 {event.location}</div>
                    </div>
                    <div className={`text-slate-300 transition-transform flex-shrink-0 ${isSelected ? 'rotate-90 text-blue-500' : ''}`}>›</div>
                  </button>
                )
              })}
            </div>
            {/* Detail panel */}
            <div className="lg:sticky lg:top-8 self-start">
              {selectedEvent ? (
                <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
              ) : (
                <EmptyDetail />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© 2026 Belmont Terrace Mutual Water Company · Sebastopol, CA</span>
          <a href="mailto:Jean@BelmontTerrace.org" className="no-underline hover:text-white transition-colors">Jean@BelmontTerrace.org</a>
        </div>
      </footer>
    </main>
  )
}

function EventDetail({ event, onClose }: { event: typeof EVENTS[0]; onClose: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_STYLES[event.category].bg} ${CATEGORY_STYLES[event.category].text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLES[event.category].dot}`} />
          {CATEGORY_STYLES[event.category].label}
        </span>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 border-none cursor-pointer text-slate-500">×</button>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h2>
      <div className="text-sm text-blue-600 font-semibold mb-6">{formatDate(event.date)}</div>
      <div className="flex flex-col gap-4 mb-8">
        {[
          { icon: '🕐', label: 'Time', value: event.time },
          { icon: '📍', label: 'Location', value: event.location },
          { icon: '📝', label: 'Details', value: event.description },
        ].map(item => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</div>
              <div className="text-sm text-slate-700 font-medium leading-relaxed">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Add to Calendar</div>
        <div className="flex flex-col gap-2">
          <a
            href={makeGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 no-underline hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
          >
            <span>📅</span> Add to Google Calendar
          </a>
          <button
            onClick={() => downloadICS(event)}
            className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-transparent cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all text-left font-medium"
          >
            <span>🍎</span> Add to Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyDetail() {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center">
      <div className="text-5xl mb-4">📅</div>
      <div className="text-slate-500 font-medium mb-1">Select an event</div>
      <div className="text-slate-400 text-sm font-light">View details and add it to your calendar</div>
    </div>
  )
}
