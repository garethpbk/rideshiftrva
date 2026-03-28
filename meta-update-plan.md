# Update Meta Tags & Branding from Next.js Defaults

## Context
The app was scaffolded from Create Next App and still has default boilerplate assets (next.svg, vercel.svg, etc.) in `public/`, a hackathon project name in `package.json`, and minimal metadata in the layout. We need proper branding, social sharing tags, and SEO basics for "Ride Shift RVA".

## Changes

### 1. Update `package.json` name
- Change `"name": "hackathon-26"` → `"name": "rideshiftrva"`

### 2. Delete default boilerplate from `public/`
Remove unused default SVGs (confirmed unreferenced in code):
- `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg`

### 3. Expand metadata in `src/app/layout.tsx`
- Add `metadataBase` (using `NEXTAUTH_URL` env var)
- Convert `title` to template format: `{ default: "Ride Shift RVA", template: "%s | Ride Shift RVA" }`
- Add `applicationName`, `openGraph`, `twitter`, `robots` fields
- Add separate `export const viewport: Viewport` with `themeColor: "#16a34a"` (green-600 brand color) — required as separate export per Next.js 14+ API

### 4. Create `src/app/manifest.ts` (new file)
Web app manifest with app name, description, theme/background colors, display mode. Uses Next.js file convention so it auto-links.

### 5. Create `src/app/robots.ts` (new file)
Allow all crawling except `/api/` and `/auth/` routes.

### 6. Create `src/app/sitemap.ts` (new file)
Simple sitemap with just the landing page (authenticated pages shouldn't be indexed).

### 7. Create `src/app/opengraph-image.tsx` (new file)
Code-generated 1200x630 OG image with green gradient background, app name, and tagline using `ImageResponse` from `next/og`. Serves as both OpenGraph and Twitter card image.

### 8. Create `src/app/icon.tsx` and `src/app/apple-icon.tsx` (new files)
Code-generated favicon (32x32) and apple touch icon (180x180) — green circle with "RS" text. These are placeholders; can be swapped for designed assets later.

### 9. Add per-page metadata to route pages
Add `export const metadata = { title: "..." }` to:
- `src/app/auth/verify/page.tsx` → "Check Your Email"
- `src/app/checkin/confirm/page.tsx` → "Confirm Check-In"
- `src/app/goal/page.tsx` → "Set Your Goal"

Note: `src/app/auth/signin/page.tsx` is a client component (`"use client"`) so it can't export static metadata. To add a title there, extract the form into a separate client component and make the page a server component.

## Files Modified
- `package.json`
- `src/app/layout.tsx`
- `src/app/auth/verify/page.tsx`
- `src/app/checkin/confirm/page.tsx`
- `src/app/goal/page.tsx`

## Files Created
- `src/app/manifest.ts`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/opengraph-image.tsx`
- `src/app/icon.tsx`
- `src/app/apple-icon.tsx`

## Files Deleted
- `public/next.svg`
- `public/vercel.svg`
- `public/file.svg`
- `public/globe.svg`
- `public/window.svg`

## Verification
1. Run `npm run build` to ensure no type errors
2. Run `npm run dev` and check:
   - Browser tab shows "Ride Shift RVA" title and custom favicon
   - Navigate to `/auth/verify` — tab shows "Check Your Email | Ride Shift RVA"
   - View page source — OG and Twitter meta tags present
   - Visit `/manifest.webmanifest` — returns valid JSON
   - Visit `/robots.txt` — shows expected rules
   - Visit `/sitemap.xml` — shows landing page entry
   - Visit `/opengraph-image` — shows generated social image
