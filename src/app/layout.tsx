import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  weight: ['300', '400', '500', '600'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="font-sans bg-slate-900">
        <div className="max-w-[1440px] mx-auto shadow-2xl overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Belmont Terrace Mutual Water Company',
  description: 'Serving 87 homes in Sebastopol, CA since 1952.',
}

