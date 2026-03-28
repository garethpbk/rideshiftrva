# RideShift RVA

**Move green, save green.** A web app that rewards Richmond residents for car-free commuting. Set a weekly goal (bike, bus, carpool, or walk), confirm you met it via a Sunday email check-in, and unlock coupons from local businesses.

Built for the 2026 Richmond Hackathon.

## Tech stack

- **Next.js 16** (App Router) — framework
- **HeroUI v3** — UI components
- **Auth.js v5** — magic link authentication (no passwords)
- **Prisma 6 + MongoDB** — database
- **Nodemailer** — SMTP email (magic links + weekly check-ins)
- **Vercel Cron** — scheduled weekly check-in emails

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB database (free tier on [MongoDB Atlas](https://www.mongodb.com/atlas) works great)
- SMTP credentials for sending email (we use AWS SES, but any SMTP provider works)

### 1. Clone and install

```bash
git clone <repo-url>
cd hackathon-26
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values. Ask Joe for the shared credentials if you don't have them.

You also need a `.env` file for Prisma CLI commands (it doesn't read `.env.local`):

```bash
echo 'DATABASE_URL="<your-mongodb-url>"' > .env
```

### 3. Push the database schema

```bash
npx prisma generate
npx prisma db push
```

This creates all the collections and indexes in MongoDB.

### 4. Seed sample rewards

```bash
npx prisma db seed
```

This loads 5 placeholder rewards from Richmond businesses (Lamplighter, Carytown Bikes, etc.) valid for the current and next month.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

1. **Sign in** — enter your email, click the magic link
2. **Set a goal** — pick a commute mode (bike/bus/carpool/walk) and days per week
3. **Sunday check-in** — a cron job emails everyone: "Did you meet your goal?" with a confirm link
4. **Confirm** — click "Yes, I did it!" to unlock that week's reward coupons
5. **Claim rewards** — view coupon codes from local businesses

### Testing the check-in flow locally

The cron job normally fires on Sundays via Vercel Cron, but you can trigger it manually:

```bash
curl -H "Authorization: Bearer <your-CRON_SECRET>" http://localhost:3000/api/cron/weekly-checkin
```

This sends check-in emails to all users who have a goal set.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page / dashboard
│   ├── auth/signin/                # Magic link sign-in
│   ├── auth/verify/                # "Check your email" page
│   ├── goal/                       # Set/edit weekly goal
│   ├── checkin/confirm/            # Token-based check-in confirmation
│   └── api/
│       ├── auth/[...nextauth]/     # Auth.js route handler
│       └── cron/weekly-checkin/    # Vercel Cron endpoint
├── components/
│   ├── GoalForm.tsx                # Goal mode + days picker
│   ├── RewardCard.tsx              # Reward display (locked/unlocked/claimed)
│   ├── RewardGrid.tsx              # Grid of reward cards
│   └── CheckInHistory.tsx          # Past check-in list
├── lib/
│   ├── auth.ts / auth.config.ts    # Auth.js configuration
│   ├── prisma.ts                   # Database client
│   ├── email.ts                    # SMTP transport
│   ├── weeks.ts                    # ISO week helpers
│   └── actions/                    # Server actions (goal, rewards)
└── types/
    └── next-auth.d.ts              # Session type extensions
```

## Reward management

Rewards are managed through the platform's database layer. Each reward includes a title, description, business name, coupon code, validity dates, and optional redemption limits. The current rewards are configured via the seed data and can be browsed and edited with `npx prisma studio`. An admin dashboard for self-service reward management by business partners is planned.

## Launch partners

RideShift launches with confirmed local business partners:

- **West Broad Studios** — recording studio offering discounted sessions
- **Rushing Blooms** — florist offering purchase discounts
- **Moulton Hot Natives** — hot sauce maker offering purchase discounts

Additional businesses can be onboarded by adding reward records via Prisma Studio or the seed file.

## No city involvement required

RideShift operates independently. It requires no city systems integration, no city budget, and no city staff time. The platform connects residents directly with local businesses — the City of Richmond benefits from reduced VMT and emissions without any operational burden.

## Trust-based design

RideShift uses a trust-based honor system rather than GPS tracking, photo verification, or transit card integration. This is a deliberate design decision:

- **Lower barriers**: No app permissions, no location sharing, no special hardware
- **Broader access**: Works for users without smartphones, with limited data plans, or with privacy concerns
- **Civic trust**: Richmond trusts its residents — invasive verification creates friction that disproportionately excludes the communities transit programs aim to serve
- **Higher participation**: The dramatically higher participation rate from frictionless check-ins outweighs any marginal gaming of the system

The weekly email check-in (confirm with one click) keeps the commitment lightweight and sustainable.

## Check-in preview mode

The `/checkin/preview` route provides a development and demo tool for previewing the check-in confirmation experience without a real check-in token:

- `?response=yes` — preview the success confirmation page
- `?response=no` — preview the "not this week" page with feedback form

This exists for rapid UI iteration during development and for demo presentations where you want to show the check-in flow without triggering real emails or database writes.

## Accessibility

RideShift has been audited for accessibility:

- Skip-to-content link for keyboard navigation
- Explicit form labels on all inputs (including screen-reader-only labels for visual controls)
- ARIA labels on navigation and interactive elements
- `aria-live` regions for dynamic content updates (feedback submission, form states)
- Status indicators use text labels alongside color (not color-only)
- Semantic heading hierarchy across all pages
- Responsive design tested for mobile viewports

## Useful commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Push schema changes | `npx prisma db push` |
| Seed rewards | `npx prisma db seed` |
| Browse database | `npx prisma studio` |
| Trigger check-in (local) | `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/weekly-checkin` |
| Test check-in email | `npx tsx scripts/send-checkin.ts you@example.com` |
| Preview check-in email | `npx tsx scripts/send-checkin.ts you@example.com --dry-run` |
