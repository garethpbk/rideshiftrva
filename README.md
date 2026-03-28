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
