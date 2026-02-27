// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#F5F0E4] flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: 'repeat' }}
    >
      {/* Ornamental rule */}
      <div className="font-['IM_Fell_English',serif] text-4xl text-[#1A1A14]/20 mb-8 tracking-widest">
        ❦ ❦ ❦
      </div>

      <div className="border-4 border-double border-[#1A1A14] p-12 max-w-lg w-full">
        <p className="font-['Courier_Prime',monospace] text-sm tracking-[0.4em] uppercase text-[#1A1A14]/50 mb-4">
          Vol. MMXXIV · Page Not Found
        </p>

        <h1 className="font-['Playfair_Display',serif] text-8xl font-bold text-[#1A1A14] leading-none mb-2">
          404
        </h1>

        <div className="border-t-2 border-b-2 border-[#1A1A14] py-3 my-4">
          <p className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A1A14]">
            Page Could Not Be Located
          </p>
        </div>

        <p className="font-['IM_Fell_English',serif] text-lg text-[#1A1A14]/70 italic leading-relaxed mb-8">
          The document you seek has either been removed, re-filed under a different heading,
          or never existed in our archive. We regret any inconvenience.
        </p>

        <Link
          href="/"
          className="inline-block font-['Courier_Prime',monospace] text-sm tracking-wider uppercase bg-[#2D5016] text-[#F5F0E4] px-6 py-3 hover:bg-[#1A1A14] transition-colors"
        >
          Return to Front Page
        </Link>
      </div>

      <div className="font-['IM_Fell_English',serif] text-4xl text-[#1A1A14]/20 mt-8 tracking-widest">
        ❦ ❦ ❦
      </div>
    </div>
  )
}
