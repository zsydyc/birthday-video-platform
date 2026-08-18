# Task Execution Status — Birthday Video Platform

> **Handoff document.** Sync this repo to the new machine, follow the "New Machine Setup" section,
> then continue from the "Next Phase" section. Keep this file up to date as phases complete.

---

## Project in One Line

A customized birthday-video platform for families (parents buying for kids/pets).
Users fill a short questionnaire → platform queues a generation task → delivers a personalised video.
Cold-start MVP: free-trial path, no real video generation yet (mocked interface only).

Full business requirements: `docs/functionalties_requirements.md`
Live project conventions: `CLAUDE.md`

---

## Phase Completion Status

| Phase | Description | Status |
|---|---|---|
| **0 — Foundation** | Next.js scaffold, design tokens, i18n, Prisma schema, design system, landing page, auth wiring | ✅ Complete |
| **1 — Auth + Landing** | Landing page live, Navbar with locale toggle, NextAuth Google + Apple providers configured | ✅ Complete (in Phase 0) |
| **2 — Order Questionnaire** | Category selection, template library, dynamic form, file upload, COPPA gate, free-trial submit | 🔲 Not started — **start here** |
| **3 — Order State Machine** | Status flow, generation task mock, My Orders page, SubjectProfile reuse | 🔲 Not started |
| **4 — Admin Dashboard** | Order list + status management, template CRUD | 🔲 Not started |
| **5 — Delivery Flow** | Video preview, confirm / request-revision, ReviewRecord stubs | 🔲 Not started |
| **6 — Stripe Scaffold + Polish** | Stripe checkout (optional path), loading/error states, mobile pass | 🔲 Not started |

---

## New Machine Setup

### 1. Prerequisites
- Node.js ≥ 18 (project uses v23 on original machine — any v18+ works)
- npm ≥ 9

### 2. Clone & install
```bash
# clone the repo (add your remote if not done yet)
git clone <repo-url> birthday-video-platform
cd birthday-video-platform
npm install
npx prisma generate        # must run before the dev server starts
```

### 3. Create `.env` (never committed — create fresh on each machine)
```env
# Supabase Postgres — get from supabase.com → project settings → database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# NextAuth — generate with: openssl rand -base64 32
AUTH_SECRET="<generated-secret>"

# Google OAuth — console.cloud.google.com
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Apple Sign-in — developer.apple.com
AUTH_APPLE_ID=""
AUTH_APPLE_SECRET=""

# Supabase — project settings → API
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Stripe — scaffold only, leave blank for free-trial MVP
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

### 4. Push the schema (first time only — skip if DB already migrated)
```bash
npx prisma migrate dev --name init
```

### 5. Start the dev server
```bash
node node_modules/next/dist/bin/next dev
# Note: `npx next dev` is broken on Node 23 — use the direct path above
```

The app runs at http://localhost:3000 and redirects to http://localhost:3000/en

---

## Architecture Decisions (already locked in)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Deployed on Vercel |
| Styling | Tailwind CSS v4 | Custom design tokens in `src/app/globals.css` |
| i18n | next-intl v4 | EN (`/en/`) + ZH (`/zh/`); strings in `src/messages/` |
| Database | PostgreSQL via Supabase | ORM: Prisma v6 |
| Auth | NextAuth.js v5 beta | Google + Apple only (no email/password) |
| File storage | Supabase Storage | Signed URLs pattern |
| Payments | Stripe | Scaffolded; free-trial path is the real MVP path |
| Routing proxy | `src/proxy.ts` | Next.js 16 renamed `middleware.ts` → `proxy.ts` |

---

## Design System — "Ocean Birthday" Palette

| Token | Hex | Use |
|---|---|---|
| `--color-coral` | `#FF6B8A` | Primary CTA, accents |
| `--color-yellow` | `#FFCF56` | Secondary, toddler category |
| `--color-mint` | `#6ECFAF` | Success, adult-fun category |
| `--color-sky` | `#60C8FF` | Magic accent, kids category |
| `--color-cream` | `#FFF8F2` | Page background |
| `--color-charcoal` | `#2D2235` | Body text |

Components live in `src/components/ui/`: `Button`, `Card`/`CardContent`, `Badge`, `Input`/`Textarea`/`Label`.
Always use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes.

---

## Data Model Summary

Key enums:
- `Category`: `toddler | kids | adult_fun | pet`
- `OrderStatus`: `pending_payment_or_trial → queued → generating → pending_review → pending_user_confirmation → delivered → completed | in_dispute | cancelled`
- `SubjectType`: `child | pet | adult`
- `DurationTier`: `short | medium`

All 12 models defined in `prisma/schema.prisma`.
Phase 2 placeholders (`Photographer`, `Booking`) are in the schema but have zero business logic.

---

## File Map (src/)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          ← root layout (NextIntlClientProvider, fonts)
│   │   └── page.tsx            ← landing page (hero, categories, how-it-works, CTA)
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts            ← NextAuth route handler
│   ├── favicon.ico
│   └── globals.css             ← Tailwind import + Ocean Birthday CSS tokens
├── components/
│   ├── layout/
│   │   └── navbar.tsx          ← sticky nav, locale toggle, sign-in button
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx           ← Input, Textarea, Label
├── i18n/
│   ├── request.ts              ← next-intl server config
│   └── routing.ts              ← locale list + defaultLocale
├── lib/
│   ├── auth.ts                 ← NextAuth config (Google + Apple + PrismaAdapter)
│   ├── prisma.ts               ← Prisma client singleton
│   └── utils.ts                ← cn() helper
├── messages/
│   ├── en.json                 ← English strings
│   └── zh.json                 ← Chinese Simplified strings
├── proxy.ts                    ← i18n routing proxy (Next.js 16 convention)
└── types/
    └── next-auth.d.ts          ← Session type augmentation (user.id)
```

---

## What to Build Next — Phase 2: Order Questionnaire

The order flow is the product's core. Design it as a **questionnaire** (not a multi-step e-commerce funnel).

### Tasks for Phase 2

**2a. Category + Template selection**
- Route: `/[locale]/order` — starts with 4 category cards (reuse landing page card design)
- Clicking a category shows templates for that category (seed 2-3 mock templates per category in a `prisma/seed.ts`)
- Template card shows: style preview image placeholder, occasion tags, price (₀ for free trial), duration tier

**2b. Dynamic questionnaire form**
- Route: `/[locale]/order/[templateId]`
- Common fields (all categories): subject name, age/birthday, occasion, blessing message, special notes
- Per-category extra fields:
  - `toddler`: favourite colour/animal, bedtime-story toggle, story theme
  - `kids`: style tag picker (hero-style / adventure-style / funny-style — no copyrighted names)
  - `adult_fun`: performance style, language, age-rating acknowledgement
  - `pet`: pet type, pet name, personality description, occasion (birthday / adoption anniversary)
- File upload: photo (required for most), voice clip (optional)
- **COPPA gate**: if `category === 'toddler' || category === 'kids'` and age < 13, show consent checkbox before submit; log `coppaConsentAt` on the Order row
- Portrait consent checkbox (always shown when photo is uploaded)

**2c. Submit + confirmation**
- On submit: create `Order` (status: `pending_payment_or_trial`, `isFreeTrial: true`) + `GenerationTask` (mock provider)
- Show order confirmation page with status tracker
- Route: `/[locale]/order/[orderId]/status`

**2d. Mock generation service**
- File: `src/lib/generation/mock.ts`
- Interface:
  ```ts
  submitGenerationTask(orderId: string, params: GenerationTaskParams): Promise<string> // returns taskId
  getTaskStatus(taskId: string): Promise<{ status: GenerationStatus; resultUrl?: string }>
  ```
- Mock: sets status to `generating`, then after 5s advances to `pending_review` (use setTimeout / background job stub)

### Key constraints to remember
- Free-trial path skips payment entirely — `isFreeTrial: true`, amount = 0
- COPPA consent must be stored as a timestamp (`coppaConsentAt`), not just a boolean
- No copyrighted character names in seed data, copy, or form labels — use style tags only
- Responsive: mobile-first, then iPad, then desktop
- All UI strings go in `src/messages/en.json` AND `src/messages/zh.json` before building the component

---

## Known Issues / Watch-outs

| Issue | Detail |
|---|---|
| `npx next` broken on Node 23 | Use `node node_modules/next/dist/bin/next dev` directly |
| `npx prisma` works fine | Prisma CLI binary resolves correctly |
| Auth credentials not set | `.env` has blank placeholders — Google/Apple OAuth won't work until filled in |
| No DB migration run yet | `npx prisma migrate dev --name init` needed on first run against a real DB |
| Stripe not wired | Placeholder only — free trial is the real MVP path |

---

*Last updated: 2026-08-13 — Phase 0 complete, Phase 2 is next.*
