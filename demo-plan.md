# RideShift RVA — Demo Recording Plan

## Setup

The app uses magic link auth. Without SMTP credentials, the magic link URL is logged to the terminal console. To capture auth state for the recording:

1. Start the dev server: `npm run dev`
2. Watch the terminal for the magic link log
3. The auth capture script will open a browser to `/auth/signin`
4. Enter your email — the sign-in link appears in the console
5. Paste the link into the browser to complete sign-in
6. Auth state is saved automatically for future recordings

## Demo Script

### Act 1: Landing Page (unauthenticated)

1. Navigate to the home page
2. Pause on the hero: "Move Richmond. Get Rewarded."
3. Scroll slowly through the full page:
   - The Problem (Richmond commuter stats)
   - The Solution
   - How It Works (Move → Confirm → Save)
   - For Every Richmonder / For Local Businesses
   - Participating Businesses
4. Scroll back to top and click "Get Started"

### Act 2: Sign In

5. Land on the sign-in page
6. Type an email address
7. Click "Send Magic Link"
8. Land on the "Check your email" page (brief pause)

### Act 3: Set Goals (authenticated)

9. Navigate to `/goal` (first-time user sees the goal form)
10. Select "Bike" mode — set to 2 days
11. Click "+ Add another mode"
12. Select "Bus" — set to 3 days
13. Click "Set Goals"
14. Land on the dashboard showing the multi-mode goal

### Act 4: Dashboard

15. Pause on the goal card showing "Bike 2x/week, Bus 3x/week"
16. Scroll down to show "This Week's Rewards" (locked state — "Check-in arrives Sunday")
17. Scroll to show the check-in history (empty — "No check-ins yet")

### Act 5: Check-In Response (via preview)

18. Navigate to `/checkin/preview?response=yes`
19. Pause on the "Great work!" confirmation page
20. Navigate to `/checkin/preview?response=no`
21. Pause on the "You're still on the right path" page
22. Show the feedback textarea

### Act 6: Transit Resources

23. Navigate to `/info`
24. Scroll through the resource categories (GRTC, Biking, Scooters, Carpooling, Walking)
25. Pause on a resource link

### Closing

26. Navigate back to home page
27. Pause on hero for 3 seconds

## Notes

- Total runtime target: ~60–90 seconds
- Pace: 1.5s between actions, 2.5s for "look at this" pauses
- The check-in email flow (cron → email → click yes/no → coupon email) can't be shown live in the recording, so we use the preview pages for Acts 5
- The dashboard's locked reward state is the normal state before a Sunday check-in — this is expected for the demo
