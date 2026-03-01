# Belmont Terrace Mutual Water Company

> A production website built for a real client — a nonprofit, member-owned water utility serving 87 homes in Sebastopol, California since 1952.

**Live site:** [belmont-terrace.vercel.app](https://belmont-terrace.vercel.app)

---

## About the Project

Belmont Terrace Mutual Water Company needed a modern replacement for their aging WordPress site. The goals were simple but specific:

- Give the board a way to post updates without touching code
- Make documents and meeting minutes easy to find
- Let members pay their water bill online
- Look like something the community would be proud of

The result is a newspaper-inspired design — intentionally editorial, with Playfair Display headlines, a Ken Burns hero rotator, and a breaking-news ticker. It's fast, fully responsive, and the board can manage all content from a clean CMS dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| CMS | [Sanity v3](https://sanity.io) (headless, with embedded Studio at `/studio`) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + custom CSS variables |
| Payments | [Stripe](https://stripe.com) (ACH + card via Stripe Elements) |
| Hosting | [Vercel](https://vercel.com) (auto-deploy on push) |
| Fonts | Google Fonts — Playfair Display, IM Fell English, Courier Prime |

---

## Features

- **Newspaper-style homepage** with hero photo rotator (Ken Burns effect), animated stats bar, and multi-column bulletin layout
- **Sanity Studio** embedded at `/studio` — board members log in with Google to post updates, no code required
- **Document archive** — 100+ historical PDFs auto-indexed from the `/public/archive` directory, filterable by category, year, and type
- **Online bill payment** via Stripe (ACH bank transfer or credit/debit card)
- **Calendar page** for board meetings and community events
- **Contact form** routed to the board
- **Fully responsive** — mobile, tablet, desktop

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Static shell
│   ├── HomeClient.tsx        # Main homepage (client component)
│   ├── archive/page.tsx      # Document archive with filtering
│   ├── documents/page.tsx    # Sanity-powered document section
│   ├── updates/              # Update detail pages
│   ├── calendar/             # Board calendar
│   ├── contact/              # Contact form
│   ├── studio/               # Embedded Sanity Studio
│   └── api/payment/          # Stripe payment route
├── sanity/
│   ├── schemaTypes/          # Content models (updates, documents, pages)
│   └── lib/                  # Sanity client config
public/
└── archive/                  # Static PDF/image archive (year/month folders)
    └── archive-index.json    # Auto-generated index of all archive files
```

---

## Design Approach

The design was intentionally built to feel like a community newspaper rather than a generic utility website. Key decisions:

- **Playfair Display** for all headlines — authoritative, editorial
- **IM Fell English** for body copy — warm, slightly historical
- **Courier Prime** for labels, dates, metadata — typewriter feel
- **Color palette** built around Sonoma County greens and warm cream — reflects the landscape and the organization's roots
- **Double-rule borders** and newspaper column layouts throughout

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

---

## Deployment

The site deploys automatically to Vercel on every push to `main`. No build configuration required — Vercel detects Next.js automatically.

---

## What I Learned

This was my first production client project. Building it taught me:

- How to structure a **Next.js App Router** project for a real client with non-technical users
- Integrating a **headless CMS** (Sanity) so the client owns their content without needing a developer
- Building a **static file archive** with client-side filtering from a JSON index
- Implementing **Stripe payments** in a Next.js API route
- Deploying and managing a live production site on **Vercel**
- Designing for a specific **brand and audience** rather than generic aesthetics

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

Built by [Don Wheeler](https://github.com/slowheelerfam-netizen) · 2026