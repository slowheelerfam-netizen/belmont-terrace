// src/app/contact/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Belmont Terrace Mutual Water Company',
  description: 'Contact information for the Belmont Terrace Mutual Water Company board members and water operators.',
}

export default function ContactPage() {
  const operators = [
    { name: 'Bruce Petersilge', phone: '(707) 820-7787' },
    { name: 'Debby Turner',     phone: '(707) 820-7633' },
    { name: 'David Vigil',      phone: '' },
  ]

  const boardMembers = [
    { name: 'Jean Tillinghast', role: 'President',  phone: '(707) 823-3447' },
    { name: 'Sandy Pete',       role: 'Secretary',  phone: '(707) 799-4798' },
    { name: 'Andy Lennox',      role: 'Treasurer',  phone: '(707) 823-4632' },
    { name: 'Laura Hormel',     role: '',           phone: '(707) 829-2360' },
    { name: 'Dee Kosten',       role: '',           phone: '(707) 829-1084' },
    { name: 'Suzanne Llamado',  role: '',           phone: '(707) 829-3812' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E4]" style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}>

      {/* Masthead */}
      <header className="border-b-4 border-double border-[#1A1A14]">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="font-['Courier_Prime',monospace] text-xs tracking-[0.3em] uppercase text-[#1A1A14]/50 hover:text-[#2D5016] transition-colors">
            ← Back to Home
          </Link>
          <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-bold text-[#1A1A14] mt-2">
            Contact Us
          </h1>
          <p className="font-['IM_Fell_English',serif] italic text-[#1A1A14]/60 mt-2">
            Reach the board or water operators
          </p>
          <div className="flex justify-center gap-6 mt-4 font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 tracking-widest uppercase">
            <span>Belmont Terrace Mutual Water Company</span>
            <span>·</span>
            <span>Sebastopol, CA</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-16">

        {/* Top two cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Billing */}
          <section className="border border-[#1A1A14]/20 p-8 text-center">
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14] mb-1">
              Billing Questions
            </h2>
            <div className="w-12 border-b-2 border-[#1A1A14] mx-auto mb-5" />
            <a href="mailto:WaterBills@BelmontTerrace.org"
               className="font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline break-all">
              WaterBills@BelmontTerrace.org
            </a>
            <div className="mt-6 pt-6 border-t border-[#1A1A14]/15">
              <p className="font-['Courier_Prime',monospace] text-[10px] tracking-widest uppercase text-[#1A1A14]/40 mb-3">
                Mailing Address
              </p>
              <address className="font-['IM_Fell_English',serif] text-base text-[#1A1A14]/80 not-italic leading-7">
                Belmont Terrace Mutual Water Company<br />
                708 Gravenstein Hwy North, PMB #184<br />
                Sebastopol, CA 95472
              </address>
            </div>
          </section>

          {/* General Info */}
          <section className="border border-[#1A1A14]/20 p-8 text-center">
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14] mb-1">
              General Information
            </h2>
            <div className="w-12 border-b-2 border-[#1A1A14] mx-auto mb-5" />
            <p className="font-['IM_Fell_English',serif] text-base italic text-[#1A1A14]/60 mb-4">
              Please contact the board
            </p>
            <a href="mailto:Board@BelmontTerrace.org"
               className="font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline">
              Board@BelmontTerrace.org
            </a>
          </section>
        </div>

        {/* Water Operators */}
        <section className="border-2 border-[#1A1A14] p-8 text-center bg-[#2D5016]/5">
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14] uppercase tracking-widest mb-1">
            For Water Problems Call
          </h2>
          <div className="w-12 border-b-2 border-[#1A1A14] mx-auto mb-5" />
          <a href="mailto:Operator@BelmontTerrace.org"
             className="font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline">
            Operator@BelmontTerrace.org
          </a>

          <div className="mt-8 mx-auto divide-y divide-[#1A1A14]/10" style={{paddingLeft:'225px',paddingRight:'225px'}}>
            {operators.map((p) => (
              <div key={p.name} className="py-4 flex justify-between items-center">
                <span className="font-['Playfair_Display',serif] font-bold text-[#1A1A14]">{p.name}</span>
                {p.phone
                  ? <a href={`tel:${p.phone.replace(/\D/g,'')}`} className="font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline">{p.phone}</a>
                  : <span className="font-['Courier_Prime',monospace] text-sm text-[#1A1A14]/30">—</span>
                }
              </div>
            ))}
          </div>

          <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/40 mt-6 tracking-wider">
            FAX: (707) 861-3375
          </p>
        </section>

        {/* Board Members */}
        <section className="border border-[#1A1A14]/20 p-8 text-center">
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14] mb-1">
            Board Members
          </h2>
          <div className="w-12 border-b-2 border-[#1A1A14] mx-auto mb-8" />

          <div className="mx-auto divide-y divide-[#1A1A14]/10" style={{paddingLeft:'225px',paddingRight:'225px'}}>
            {boardMembers.map((m) => (
              <div key={m.name} className="py-4 flex justify-between items-center">
                <div className="text-left">
                  <p className="font-['Playfair_Display',serif] font-bold text-[#1A1A14]">{m.name}</p>
                  {m.role && (
                    <p className="font-['Courier_Prime',monospace] text-[10px] tracking-widest uppercase text-[#1A1A14]/40 mt-0.5">{m.role}</p>
                  )}
                </div>
                <a href={`tel:${m.phone.replace(/\D/g,'')}`}
                   className="font-['Courier_Prime',monospace] text-sm text-[#2D5016] hover:underline ml-6 shrink-0">
                  {m.phone}
                </a>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t-4 border-double border-[#1A1A14] mt-12 py-6 text-center">
        <p className="font-['Courier_Prime',monospace] text-xs text-[#1A1A14]/50 tracking-widest uppercase">
          Belmont Terrace Mutual Water Company · Sebastopol, California
        </p>
      </footer>
    </div>
  )
}