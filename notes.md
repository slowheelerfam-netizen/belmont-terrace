Project: Belmont Terrace Mutual Water Company

Next.js + TypeScript + Tailwind + Sanity CMS
Newspaper aesthetic: cream #F5F0E4, ink black #1A1A14, forest green #2D5016, sage #7A9E5A
Fonts: Playfair Display, IM Fell English, Courier Prime

What's done:

NavBar.tsx ✅
sanity-content-seed.ts ✅
Files copied to public/archive/ ✅
archive-index.json generated ✅ (or run the Node script first if not done yet)

Next step:
Build the /archive browse/search page that reads archive-index.json and lets members filter by year and search by filename with download links.

For the archive files themselves, best options are:
Option A — Cloudflare R2 (recommended, free up to 10GB)

S3-compatible storage
Files served via CDN, fast
Free egress (unlike AWS S3)

Option B — Vercel Blob

If you're deploying on Vercel, this is the easiest
Built right into your stack

Option C — Keep files local only

Archive only accessible when running locally
Fine if this is an internal members-only tool