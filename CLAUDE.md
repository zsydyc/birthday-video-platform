@AGENTS.md

# Birthday Video Platform — Project Context

> Full business design doc lives at `docs/functionalties_requirements.md` — read it for background,
> but this file is the source of truth for what to actually build right now.

## Project

A custom video platform. Users fill out a simple questionnaire describing a
person (or pet) and an occasion, and receive a short custom video (birthday
greetings, bedtime stories, etc.). Content generation itself is out of scope
for now — treat it as a pluggable black-box service behind a task queue.

## Current Phase: MVP / Cold Start

This is a pre-launch MVP meant to be tested with friends and a local parenting
group before any real marketing. Bias toward the simplest thing that works.

**In scope for MVP:**
- Social login only (Google, Apple — no email/password, no phone/WeChat yet)
- One unified "order questionnaire" flow (not a multi-step e-commerce funnel)
- Four categories: `toddler` (0-4yo), `kids` (4-12yo), `adult_fun`, `pet`
- Order state machine (see below)
- A mocked/stubbed generation task interface — no real video generation yet
- Basic admin view to see incoming orders

**Explicitly OUT of scope for MVP:**
- Photographer booking module (Module C) — data model reserves fields, no UI/logic
- YouTube content management backend — content will be manually uploaded for now
- Real payment processing — cold-start users get a "free trial" path;
  Stripe integration scaffolded but not required functional day one
- WeChat Pay / Alipay — Phase 2
- WeChat login — Phase 2

## Architecture (confirmed)

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 with Ocean Birthday design tokens
- **i18n**: next-intl — English (`en`) + Chinese Simplified (`zh`), route prefix `/en/` `/zh/`
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma (schema at `prisma/schema.prisma`)
- **Auth**: NextAuth.js v5 — Google + Apple providers (`src/lib/auth.ts`)
- **File Storage**: Supabase Storage (signed URLs)
- **Payments**: Stripe — scaffolded, free-trial path is the default
- **Hosting**: Vercel
- **i18n proxy file**: `src/proxy.ts` (Next.js 16 renamed middleware → proxy)

## Design System — "Ocean Birthday" Palette

| Role | Hex |
|---|---|
| Primary (Coral Rose) | `#FF6B8A` |
| Secondary (Sunny Yellow) | `#FFCF56` |
| Accent (Soft Mint) | `#6ECFAF` |
| Magic (Sky Blue) | `#60C8FF` |
| Background (Warm Cream) | `#FFF8F2` |
| Text (Warm Charcoal) | `#2D2235` |

Rounded-pill buttons (`rounded-full`). Cards use `rounded-2xl`. Warm, cute, ocean-birthday feel.

## Responsive targets
- Mobile-first (parents on phones is primary use case)
- iPad / tablet
- Desktop

## Target Market
- Overseas Chinese in North America (primary)
- Mainland China users (secondary)

## Data Model — Order Status Flow
`pending_payment_or_trial → queued → generating → pending_review →
pending_user_confirmation → delivered → completed | in_dispute | cancelled`

## Key Conventions
- All page routes live under `src/app/[locale]/` — never add pages to `src/app/` root directly
- Locale messages at `src/messages/en.json` and `src/messages/zh.json`
- Design system components at `src/components/ui/`
- Use `cn()` from `src/lib/utils.ts` for conditional class names
- Run `npx prisma generate` after any schema changes
- Run the dev server via: `node node_modules/next/dist/bin/next dev`
- COPPA: any flow collecting data on a child < 13 **must** have a consent checkbox + logged timestamp (`coppaConsentAt` on Order)
- IP/character usage: original stylized characters only — never reference named copyrighted characters

## Generation Service Interface (mock only for MVP)
```ts
submitGenerationTask(order: Order): Promise<{ taskId: string }>
getTaskStatus(taskId: string): Promise<{ status: GenerationStatus; resultUrl?: string }>
```
Implement mock in `src/lib/generation/mock.ts`. Real provider swaps in without touching calling code.
