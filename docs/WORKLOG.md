# Worklog

This file is append-only. Add new entries at the top of the log section without rewriting prior entries.

## 2026-09-30 — Storefront reconciliation, Part A

- Agent: Codex
- Branch: `feature/storefront-reconcile`, created from `main` because this standalone remote has no `develop` branch.
- Repository inventory: after fetch, `origin` contained only the squashed `main` commit (`df71f5d`). The requested `feature/storefront-tour-detail`, `feature/storefront-auth`, `feature/storefront-browse`, and `feature/storefront-polish` refs do not exist, so no merges were fabricated; reconciliation was performed against the code present in the snapshot.
- Confirmed there is exactly one `src/features/storefront/auth/CustomerAuthContext.jsx`. It exposes customer/user state, mock login and registration, logout, session/local remember-me persistence, and works with the shared safe redirect helpers.
- Browser-verified the critical flow: choose a Battambang departure and one child, Book now as a guest, arrive at `/login?redirect=…`, sign in with the demo customer, then return to `/booking/battambang-countryside` with the selected date, adult, and child intact.
- Fixed URL list filters to trim and normalize case, so both generated slug links and the requested `/tours?destination=Battambang` form resolve the Battambang tour.
- Confirmed Battambang is active on Home, reports one tour on `/destinations`, and is no longer shown as coming soon. Tour Detail matches the storefront card, token, spacing, responsive, and dark-theme language.
- Confirmed base navigation, More, wishlist, guest controls, and the authenticated profile menu coexist in one header implementation without duplicated controls.
- Verification: headless Edge at 375, 768, 1280, and 1920 px; no horizontal overflow or console errors. `npm run build` and `npm run lint` pass (existing warnings remain).
- Remaining in this pass: finish the explicit wishlist, guest-flow, and return-visit audit checkpoints, then replace `docs/NOTES.md` with the final handoff.

## 2026-09-30 — Phase 7 polish: trust pages, footer, 404 and consistency pass

- Agent: Claude Code
- Branch: `feature/storefront-polish`
- **Base:** there is no `develop` on `origin`, and neither `feature/storefront-tour-detail` nor `feature/storefront-auth` has been merged anywhere. So this branch starts from the tip of `feature/storefront-browse` (`3d35d81`), the newest storefront branch that includes the foundation. The Tour Detail, booking bar and customer auth are **not** on this branch.

### Completed

**Part A: Home**
- **Why book with us** (`components/HomeTrust.jsx`): sits between Featured Tours and Destinations. It has four cards (secure payment, local guides, free cancellation, 24/7 support), each with a lucide icon, a faint 01–04 numeral, the hover lift and staggered `revealScale` entrance used by the category cards.
- **Promo banner** (`components/PromoBanner.jsx`): sits directly under the hero search card, not before the CTA band, where it would have stacked two dark blocks. It's a terracotta-to-gold gradient with Angkor line art, a "N days left · Offer ends 31 December" badge (days are computed), and a dashed copy-to-clipboard `EXPLORE10` code with a toast. It's a mock: nothing applies the discount.
- **Testimonials:** `publicTestimonials` now returns up to 8 reviews, taken from the 14 approved 4–5★ reviews in the shared store (`mocks/reviews.js`). There is no new dataset.

**Part B: new pages** (all lazy routes in `routes/storefront.routes.jsx`)
- **`/about`:**
  - Photo hero ("Your trusted guide to Cambodia") with a rating chip.
  - Stats card overlapping the hero with count-up numbers. Years on the road is `now − FOUNDED_YEAR`. Tours completed is distinct (tour, travel date) pairs among Completed bookings. Happy travellers is guests on Completed bookings. Destinations covered is provinces with an active tour. All are computed in `publicCompanyStats()`.
  - The founding story, with a two-photo collage and an "Est. 2016" seal.
  - Three values.
  - A team grid built from the Masters guides (`publicGuides()`: initials avatar, role and bio from `content.js`, languages, and linked tours they lead, using the cover photo of the first tour they lead). Ends with the shared `CtaBand`.
- **`/contact`:**
  - react-hook-form + zod form (`storefront/schema.js`): name, email, subject select, message with a 0/1000 counter. Errors appear inline with `aria-invalid`/`aria-describedby`.
  - Mock send (`sendContactMessage` in `api.js`, 900 ms) that swaps in a success panel with a reference number, plus a toast.
  - Phone, WhatsApp, email, address and opening-hours cards.
  - A stylised SVG street map of central Phnom Penh (grid, riverfront, Royal Palace, pulsing office pin, "Get directions" to Google Maps).
  - A WhatsApp card and social profile tiles.
- **`/faq`:** 12 questions in 3 groups (Booking & payment, Cancellation & refunds, On the tour). Word search with a live result count and an empty state. Topic links stick beside the list on desktop and scroll horizontally on mobile. The accordion allows several answers open at once; the first starts open. It has `aria-expanded`/`aria-controls`, a height+opacity animation (opacity only under reduced motion), and a "Still have a question?" card.
- **404** (`pages/NotFoundPage.jsx`): the storefront's `*` child route, so unknown public URLs (including `/404`) render inside the normal header and footer. The illustration is a "4 ☉ 4" where the zero is a sun with a slowly turning compass over Angkor line art. It shows the missing path, Back to Home and Browse tours buttons, and popular links. The old top-level `* → /` redirect was removed; unknown `/admin/*` still redirects to `/admin`.
- **Navigation** (`navigation.js`):
  - The header keeps Home, Tours and Destinations, plus a **More** menu with Explore (Gallery, Reviews) and Company (About, Contact, FAQ). It uses the shared `PopoverPanel`/`usePopover` (arrow keys, Esc, outside click), with icons and descriptions. The gold underline moves to More when one of its pages is active.
  - The mobile menu shows the three main links large and the two groups in a compact grid underneath.
- **Breadcrumbs** (`components/Breadcrumbs.jsx`, the same markup as Tour Detail's): `PageIntro` gained a `breadcrumbs` prop. Now on Tours, Destinations, Gallery, Reviews, About, Contact, FAQ and the tour preview (Home / Tours / Destination / Tour).

**Part C: footer and trust**
- **Footer:**
  - Brand blurb, and contact lines that link to `tel:`/`mailto:`.
  - Explore / Company / Support link columns. Support deep-links to `/faq#faq-cancellation` and `/faq#faq-booking`.
  - Newsletter with an inline "Thanks! You're on the list." state (it replaces the old toast).
  - Social icons.
  - A trust row: Secure payment, Verified reviews, Best price guarantee and Free cancellation chips, plus "We accept" chips for the four payment methods. The methods are read from `PAYMENT_METHODS`, with "(Simulation)" stripped for customers.
- **Floating contact button** (`components/FloatingContact.jsx`, mounted in `StorefrontLayout`): the panel says "Suosdey! How can we help?". A status dot reads Online / Office closed from Phnom Penh office hours. Options are WhatsApp (tagged "Fastest"), call, email and an FAQ link. Focus moves into the panel, Esc returns it, and it closes on navigation. On `/tours/:id` below `lg` it sits at `bottom-24` to clear the sticky booking bar from the tour-detail branch.

**Part D: consistency and polish**
- `publicReviews()` exposed **Pending** reviews on `/reviews`, labelled "Verified". It now returns Approved only, so the page shows 14 reviews and 4.6★ (was 22 and 4.4★), which matches the home carousel and the tour ratings.
- Reviews copy uses British "traveller", as the rest of the storefront does.
- The Destinations summary chips showed hard-coded 6 / 9 while loading; they now show skeletons, then real counts.
- Two mobile overflow bugs came from grids without a base column template, so the implicit column grew to its content: the footer (the Subscribe button was clipped at 375) and the review card grid (2px). Both now use `grid-cols-[minmax(0,1fr)]`.
- Battambang still shows "Coming soon". The Battambang tour lives on the unmerged `feature/storefront-tour-detail`, so 0 is correct for this branch.

**Content module:** `features/storefront/content.js` holds site copy: story, values, team bios, FAQ, contact, trust badges, promo and social links. Anything the admin can change comes from the shared settings and domain constants: contact email and phone, the cancellation window, and payment methods.

### Files

- New: `features/storefront/{content.js, schema.js}`
- New: `features/storefront/components/{HomeTrust, PromoBanner, Breadcrumbs, FloatingContact}.jsx`
- New: `features/storefront/pages/{AboutPage, ContactPage, FaqPage, NotFoundPage}.jsx`
- Changed: `features/storefront/{api.js, hooks.js, mocks.js, navigation.js}`
- Changed: `features/storefront/components/{PageIntro, SiteHeader, MobileMenu, SiteFooter, SocialIcons}.jsx`
- Changed: `features/storefront/layouts/StorefrontLayout.jsx`
- Changed: `features/storefront/pages/{HomePage, ToursPage, TourPreviewPage, DestinationsPage, GalleryPage, ReviewsPage}.jsx`
- Changed: `routes/{storefront.routes.jsx, index.jsx}`

### Commits

- `74427d2` feat(storefront): add why-book-with-us section to home
- `d10e36c` feat(storefront): add promo banner to home
- `3811d9c` feat(storefront): add about us page
- `297c96d` feat(storefront): add contact page with form
- `828ce70` feat(storefront): add faq page with accordion
- `8b74196` feat(storefront): add 404 page and wire catch-all route
- `2545716` feat(storefront): add more menu with company pages to header navigation
- `2d8a11d` feat(storefront): add breadcrumbs to remaining guest pages
- `0af4381` feat(storefront): expand footer with newsletter and trust badges
- `fe4105c` feat(storefront): add floating contact button
- `6f5a70b` style(storefront): consistency and polish pass across guest pages
- `docs: update worklog and note for danish`

### Verification

- `npm run build` and `npm run lint` were run before every commit. The build passes. Lint exits 0; the only warnings are pre-existing kinds (Fast Refresh advisories on route files, and teammate files).
- **Visual checks:** headless Edge driven by `puppeteer-core` from the scratchpad. Pages checked: Home, Tours, a tour preview, Destinations, Gallery, Reviews, About, Contact, FAQ and an unknown URL. Each was captured at 375, 768, 1280 and 1920 in light, and at 375 and 1280 in dark. Every reveal was scrolled into view first. Result: no console errors, no horizontal overflow (after the two fixes above), and no `<img>` without `alt`.
- **Flows (scripted):**
  - Contact: an empty submit shows all 4 errors; a valid submit shows the success panel with a reference.
  - FAQ: toggling works, the "visa" search leaves 1 question, and a nonsense search shows the empty state.
  - Newsletter: the invalid-email error appears, then the success state.
  - More menu: focus goes to the first item, ArrowDown moves it, and Esc closes the menu and returns focus.
  - Floating button: opens with focus on WhatsApp, and Esc returns focus to the button.
- **Not checked:** real touch devices and screen readers.

### Decisions and copy choices

- **Company story:** TourTrip is presented as founded in 2016 by three friends. Their names are the Masters guides Sokha, Dara and Vanna, so the About story and the team grid agree. The office is at No. 38, Street 240, Phnom Penh, near the Royal Palace. The phone and email come from Settings; the WhatsApp number (+855 12 900 123) is new and lives in `content.js`.
- **Cancellation is 72 hours, not the 48h in the brief.** The Settings mock has `cancellationWindowDays: 3`, and the copy reads from it, so admin and storefront can't disagree. **Danish to decide:** either change the setting to 2 days (the copy updates itself) or keep 72h.
- **Children pay the per-person price.** The FAQ originally said children paid 60%, but the tour-detail booking card charges children the full per-person price, so the FAQ now says prices are per traveller.
- **Stats are only as old as the mock data.** "Tours completed" and "Happy travellers" count the roughly two years of mock bookings and say "since online booking began in 2024", rather than claiming ten years of numbers.
- **Guides have no photos in Masters,** so team cards use the cover photo of the tour each guide leads, with an initials avatar.
- **Social links are placeholders** (`#`, `preventDefault`), as before. WhatsApp, tel, mailto and Google Maps links are real links.
- The **More menu** was chosen over adding three more top-level links, to keep the desktop header uncluttered, as Phase 7b decided.

### Known issues

- The floating button's lift on tour pages targets the tour-detail branch's mobile booking bar. Re-check the offset after that branch merges. The button can also briefly cover the last footer link on very short mobile screens.
- `/account/:mode` is still the placeholder page (no breadcrumbs); the auth branch replaces it.
- The promo code, contact form and newsletter are mock-only. Social profiles are placeholders.
- Mock data resets on reload.

### Next steps

Phase 7c: the real booking flow (/booking/:tourId — review & confirm, payment, confirmation) + My Bookings + Cancel Booking, reconciling CustomerAuthContext across the merged auth/tour-detail branches if not already done.

## 2026-09-30 — Phase 7b: Storefront "Continue Browsing" Pages (Destinations, Gallery, Reviews)

- Agent: Antigravity/Gemini
- Branch: `feature/storefront-browse`
## 2026-09-30 — Phase 7b: Storefront Customer Authentication & Header State

- Agent: Antigravity/Gemini
- Branch: `feature/storefront-auth`
- Base: `origin/feature/storefront-foundation`

### Completed

1. **Destinations Page (`/destinations`, `src/features/storefront/pages/DestinationsPage.jsx`):**
   - Built responsive grid of all 6 Cambodia destinations (Siem Reap, Phnom Penh, Kampot, Sihanoukville, Kep, Battambang) with large photo cards and gradient depth.
   - Tour counts are dynamically **COMPUTED** from the shared mock catalogue (`tours.filter(t => t.destinationId === destination.id).length`), never hardcoded:
     - Siem Reap: 4 tours
     - Kampot: 2 tours
     - Phnom Penh: 1 tour
     - Sihanoukville: 1 tour
     - Kep: 1 tour
     - Battambang: 0 tours ("Coming soon" badge)
   - Clicking active destination cards navigates to `/tours?destination=${destination.id}`, seamlessly hooking into the Tour Listing URL-driven filter system from Phase 7a.
   - Includes `PageIntro`, summary indicators (6 Curated Regions · 9 Handcrafted Tours), skeleton loading states, and error handling with retry.

2. **Site-Wide Photo Gallery (`/gallery`, `src/features/storefront/pages/GalleryPage.jsx`):**
   - General photo gallery pulling images across all tours in the shared mock catalogue into a responsive masonry-style grid.
   - Filter chips above the grid by Destination (All Regions, Siem Reap, Phnom Penh, Kampot, Sihanoukville, Kep) and Travel Style (Temples & Heritage, Island & Beach, Adventure & Nature, City & Culture, Food & Markets, Mountain & Hill Station) with live item counters.
   - Interactive hover cards with subtle zoom, dark gradient overlay, and photo details.
   - Empty state with "Clear filters" when filter combinations match 0 photos.

3. **Shared Reusable Lightbox (`src/components/shared/Lightbox.jsx`):**
   - Built production-ready, fully accessible lightbox modal rendered via portal to `document.body`.
   - Full keyboard navigation: ArrowLeft (previous), ArrowRight (next), and Escape layer integration (`useEscapeLayer`).
   - Mobile touch swipe detection: swipe left to next photo, swipe right to previous photo.
   - Image counter indicator (`X / Y`), full-screen overlay backdrop, close button, prev/next arrows, and caption panel displaying photo title, destination tag, style, and direct "View Tours" link.
   - Locked body scroll during open state; tested under reduced motion.

4. **Reviews Page (`/reviews`, `src/features/storefront/pages/ReviewsPage.jsx`):**
   - General "What travelers say" page showing all reviews from the shared mock reviews store across all tours (`(not filtered to one tour)`).
   - Summary rating header: prominent aggregate rating (e.g. 4.4★), 5 golden stars, total review count, and interactive 5-to-1 star distribution bars (clicking a bar filters by that star rating).
   - Filters:
     - By star rating: All, 5★, 4★, 3★, 2★, 1★.
     - By destination / region.
     - By tour dropdown.
   - Sort control: "Newest first" (default), "Highest rated", "Lowest rated".
   - Review cards: avatar circle with reviewer initials, verified traveler badge, relative/formatted date, filled/muted stars, linked tour name, and quoted review text.
   - Filter chip bar with one-click remove chips and "Clear all filters" button.
   - Skeletons, error state, and empty state when filters match nothing.

5. **Navigation & Router Wiring:**
   - Updated `src/features/storefront/navigation.js`: added `/destinations` to primary `STOREFRONT_NAV` for an uncluttered desktop header, and exported `ALL_STOREFRONT_NAV` containing Gallery and Reviews.
   - Updated `src/features/storefront/components/SiteFooter.jsx`: connected "Explore" links directly to `/destinations`, `/gallery`, and `/reviews`.
   - Updated `src/features/storefront/components/MobileMenu.jsx`: rendered all 5 core and browsing links (`Home`, `Tours`, `Destinations`, `Gallery`, `Reviews`) for effortless mobile navigation.
   - Configured `src/routes/storefront.routes.jsx` with code-split lazy routes for `DestinationsPage`, `GalleryPage`, and `ReviewsPage`.

### Files created or changed

- `src/components/shared/Lightbox.jsx`
- `src/features/storefront/api.js`
- `src/features/storefront/components/MobileMenu.jsx`
- `src/features/storefront/components/SiteFooter.jsx`
- `src/features/storefront/hooks.js`
- `src/features/storefront/mocks.js`
- `src/features/storefront/navigation.js`
- `src/features/storefront/pages/DestinationsPage.jsx`
- `src/features/storefront/pages/GalleryPage.jsx`
- `src/features/storefront/pages/ReviewsPage.jsx`
1. **Customer Auth Context & State Management (`src/features/storefront/auth/CustomerAuthContext.jsx`):**
   - Implemented dedicated customer authentication context exposing `isAuthenticated`, `user`, `login(email, password, remember)`, `register(name, email, password)`, and `logout()`.
   - Default mock customer credentials: `customer@tourtrip.com` / `Customer@123` (no OTP required for customer sign-in, preserving streamlined checkout/booking friction).
   - Session persistence: remembers session in `localStorage` when "remember me" is selected; otherwise falls back to `sessionStorage`.
   - Persistence of registered mock users across page reloads via `localStorage` cache (`tourtrip.mock.customers`).
   - Mounted `CustomerAuthProvider` globally in `src/app/providers/AppProviders.jsx`.
   - *Note on reconciliation:* The parallel Tour Detail branch may introduce an adjacent version of `CustomerAuthContext.jsx`; this implementation is cleanly isolated under `src/features/storefront/auth/` and can be reconciled directly upon merge.

2. **Validation Schemas (`src/features/storefront/auth/schema.js`):**
   - React Hook Form + Zod resolver schemas for login (`email`, `password` min 8 chars) and registration (`name` min 2 chars, `email`, `password` min 8 chars, `confirmPassword` matching, and mandatory Terms & Conditions acceptance).

3. **Customer Auth Split-Layout Shell (`src/features/storefront/auth/CustomerAuthShell.jsx`):**
   - Designed responsive split-screen authentication shell matching Phase 7a "Modern Khmer" styling, tokens, and motion language.
   - Left visual panel showcasing Cambodian travel photography (`login_bg_luxury.jpg`), brand storytelling headline, and key customer trust badges (Instant Confirmation, Verified Guides, 24/7 Support).
   - Right panel with glass card, error shake animation with `framer-motion`, and full light & dark theme token support.

4. **Customer Login Page (`/login`, `src/features/storefront/pages/CustomerLoginPage.jsx`):**
   - Input fields: email and password with Lucide icons (`Mail`, `Lock`), password show/hide toggle, and Caps Lock detection warning.
   - "Remember this device" checkbox and "Forgot password?" link.
   - One-click demo credentials chip (`customer@tourtrip.com` / `Customer@123`) for rapid testing and QA.
   - Primary Sign In button with loading spinner, success check transition, and automatic redirect to target destination or `/account/bookings`.
   - Google Sign-In mock button with toast notification.
   - Card shake animation and error toast on invalid credentials.
   - Supports `?redirect=` query param, forwarding it when toggling between Sign In and Register.

5. **Customer Register Page (`/register`, `src/features/storefront/pages/CustomerRegisterPage.jsx`):**
   - Form fields: Full name, Email, Password, Confirm password, and Terms & Conditions agreement checkbox.
   - Automatically signs in the traveler upon successful account creation, shows a welcome toast, and forwards them to their intended destination.

6. **Forgot Password Modernization (`/forgot-password`, `src/pages/customer/ForgotPassword.jsx`):**
   - Updated existing customer forgot password route to use `CustomerAuthShell` with Lucide icons.
   - Submitting an email displays an immediate "Check your email" confirmation card with a direct return link to `/login`.

7. **Customer Bookings Page Stub (`/account/bookings`, `src/features/storefront/pages/CustomerBookingsPage.jsx`):**
   - Route for authenticated customer bookings review: traveler profile card, "Explorer Member" badge, mock active Angkor Wat booking summary, and "Explore Tours" CTA.

8. **Authenticated Header & Mobile Menu Integration:**
   - `src/features/storefront/components/SiteHeader.jsx`: Replaces "Sign in" and "Register" buttons with a traveler avatar badge (initials), traveler first name, and animated profile dropdown menu ("My Bookings", "Explore Tours", "Sign Out").
   - `src/features/storefront/components/MobileMenu.jsx`: Renders traveler identity card, "My Bookings" button, and "Sign Out" button when authenticated.
   - Preserves theme toggle, brand identity, and responsive layouts across viewports.

9. **Route Separation & Backward Compatibility:**
   - Dedicated customer login to `/login` and `/register`.
   - Preserved `/admin/login` for the admin portal with OTP authentication.
   - Configured `ProtectedRoute.jsx` to redirect unauthenticated admin access to `/admin/login`.
   - Updated legacy `/account/sign-in` and `/account/register` routes to automatically redirect to `/login` and `/register`.

### Files created or changed

- `src/app/providers/AppProviders.jsx`
- `src/features/storefront/auth/CustomerAuthContext.jsx`
- `src/features/storefront/auth/CustomerAuthShell.jsx`
- `src/features/storefront/auth/schema.js`
- `src/features/storefront/components/MobileMenu.jsx`
- `src/features/storefront/components/SiteHeader.jsx`
- `src/features/storefront/navigation.js`
- `src/features/storefront/pages/AccountPage.jsx`
- `src/features/storefront/pages/CustomerBookingsPage.jsx`
- `src/features/storefront/pages/CustomerLoginPage.jsx`
- `src/features/storefront/pages/CustomerRegisterPage.jsx`
- `src/pages/customer/ForgotPassword.jsx`
- `src/routes/ProtectedRoute.jsx`
- `src/routes/public.routes.jsx`
- `src/routes/storefront.routes.jsx`
- `docs/WORKLOG.md`
- `docs/NOTES.md`

### Verification

- `npm run lint` completed with 0 errors across 269 files.
- `npm run build` completed in ~2.98s with 0 errors, outputting dedicated chunks for `DestinationsPage`, `GalleryPage`, and `ReviewsPage`.
- Verified computed tour counts against shared mock data: Siem Reap (4), Kampot (2), Phnom Penh (1), Sihanoukville (1), Kep (1), Battambang (0, "Coming soon").
- Verified Lightbox functionality: opens on photo click, navigates prev/next via buttons and keyboard arrow keys, touch swipe triggers slide transitions, and Escape closes.
- Verified Reviews page: rating summary statistics, interactive distribution bar filter, star rating filter, destination filter, sort order, and card styling.
- Responsive breakpoints tested at 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (ultrawide).

### Commits

- `615335e` `feat(storefront): add destinations page with computed tour counts`
- `ec0fd2c` `feat(storefront): add general gallery page with filters and lightbox`
- `ae73afb` `feat(storefront): add general reviews page with filters and rating summary`
- `713ebfe` `feat(storefront): wire new pages into header and footer navigation`
- `docs: update worklog and note for danish`

### Decisions

- Reusable Lightbox: Placed in `src/components/shared/Lightbox.jsx` as a shared component so Tour Detail, Gallery, or admin preview components can reuse it without duplication.
- Uncluttered Header: Kept `STOREFRONT_NAV` focused on `Home`, `Tours`, and `Destinations`. Secondary browsing paths (`Gallery` and `Reviews`) live in the footer and mobile menu to prevent desktop header crowding.
- Tour Counts: Computed in real-time from `tours.filter(t => t.destinationId === destination.id).length`, ensuring admin catalogue modifications or additions automatically update customer destination cards.

### Known issues

- In-memory mock data resets on hard reload (standard until Laravel API integration).

### Next steps

- Reconcile with parallel tasks `feature/storefront-auth` (Customer Login & Register) and `feature/storefront-tour-detail` (Tour Detail page & multi-step booking stepper).

## 2026-09-30 — Phase 7b: Storefront Tour Detail and booking handoff

- Agent: Codex
- Branch: `feature/storefront-tour-detail` in Danish's personal repository; branched from `feature/storefront-foundation`. No team repository, main/develop, or deployment was changed.

### Completed

- Added Battambang Countryside & Bamboo Train as the tenth active tour in the shared Masters/dashboard catalogue. Home, listing, and destination counts now include Battambang.
- Replaced the `/tours/:id` preview with a responsive Tour Detail page: breadcrumb, hero facts, crossfade gallery, keyboard/swipe lightbox, Overview/Itinerary/Included/Reviews tabs, tour-only approved reviews with a token-themed Chart.js rating breakdown, a booking selector, and related tours using the existing `TourCard`.
- Added mock departures to the shared schedule dataset so every active tour has a selectable date. Sold-out slots cannot be selected; available seats are color-coded. Adult/child counters enforce capacity and update the total.
- Added a separate, temporary customer auth seam: logged-out Book now goes to `/login?redirect=/booking/{tourId}`; in development, `?mockAuth=true` permits navigation to `/booking/:tourId?date=&adults=&children=`. The booking page explicitly makes no reservation or payment.
- Loading skeleton and missing-tour state are in place. The existing storefront layout, admin routes, auth pages, and dashboard were not redesigned.

### Files

- Changed: `src/mocks/dashboard.js`, `src/mocks/masters.js`, `src/features/storefront/mocks.js`, `src/features/storefront/api.js`, `src/features/storefront/hooks.js`, `src/features/storefront/layouts/StorefrontLayout.jsx`, `src/features/storefront/pages/TourDetailPage.jsx`, `src/routes/storefront.routes.jsx`.
- Added: `src/mocks/storefrontDetails.js`, `src/features/storefront/auth/CustomerAuthContext.jsx`, `src/features/storefront/components/Lightbox.jsx`, `TourGallery.jsx`, `TourSections.jsx`, `TourReviews.jsx`, `BookingCard.jsx`, and `src/features/storefront/pages/BookingStubPage.jsx`.

### Commits

- `36a5571 feat(storefront): add battambang countryside tour to shared catalogue`
- `bc12596 feat(storefront): add reusable keyboard and swipe lightbox`
- `94d5aea feat(storefront): add tour detail hero and crossfade gallery`
- `745d20a feat(storefront): add overview and itinerary detail tabs`
- `cbf6148 feat(storefront): show tour reviews and rating breakdown`
- `239bc97 feat(storefront): add departure picker and booking preview`
- `docs: record storefront tour detail handoff` (this documentation commit)

### Decisions and verification

- Core tour, schedule, guide, and review records continue to come from the shared mock stores; `storefrontDetails.js` contains only editorial text and supplemental photo choices. No second catalogue was created.
- Kept customer auth isolated from admin auth because the parallel customer-auth branch will replace this seam. The existing `/login` still renders **admin login** until that branch is integrated; the redirect parameter is already passed through for the customer login flow to consume.
- Reused bundled Cambodia photos. Battambang's primary photo is the current countryside-style placeholder from the catalogue, not a dedicated Battambang image.
- `npm run build` and `npm run lint` pass after every feature commit (lint retains pre-existing advisories). Browser checked gallery next/previous/Escape, content tabs, review chart, available/sold-out booking dates, guest redirect, dev demo booking preview, missing-tour state, mobile sheet at 375px, no horizontal overflow, and light/dark card tokens. No new browser exceptions observed.

### Known issues / next steps

- The customer login/register branch must take ownership of `/login` and consume `redirect`, then replace `CustomerAuthContext` with real customer auth. The current preview does not reserve seats or process payment.
- Add a dedicated Battambang photo if one becomes available; current shared image is a placeholder.
- Next: connect the eventual booking/checkout API and customer auth without changing the Tour Detail presentation; replace mock-only `getTourDetail` in the feature API layer.

- `npm run lint` completed with 0 errors.
- `npm run build` completed in ~2.15s with 0 errors.
- Tested login with default mock credentials (`customer@tourtrip.com` / `Customer@123`), session persistence (`localStorage` vs `sessionStorage`), and error handling (card shake + toast).
- Tested registration flow with validation, automatic sign-in, and redirect back.
- Tested authenticated header states: avatar badge with initials, dropdown menu navigation, outside-click closing, and sign out.
- Tested responsive mobile drawer menu under both guest and authenticated customer states.
- Verified `/admin/login` remains functional with admin credentials and OTP step.

### Commits

- `a77ccd6 feat(storefront-auth): add customer auth context with mock login and register`
- `e9918a4 feat(storefront-auth): add customer login and register pages with redirect support`
- `c2df50a feat(storefront-auth): add authenticated header state with profile dropdown`
- `docs: update worklog and note for danish`

## 2026-09-30 — Phase 7a: Storefront foundation (Home, Search, Tour Listing)

- Agent: Claude Code
- Branch: `feature/storefront-foundation`
- **Base:** there is no `develop` branch, and the Reports/Settings work isn't merged anywhere. I branched from the tip of `feature/admin-reports-settings` (which also carries Gemini's perf commits), since that holds all admin work to date.

### Completed

**Shared catalogue (single source of truth)**
- Added three tours to `TOURS` in `src/mocks/dashboard.js`:
  - Tonlé Sap Floating Village (Siem Reap)
  - Siem Reap Street Food Night, in the new "Food & Markets" category
  - Kep Crab Market & Rabbit Island
- These used existing photos, which were previously unused.
- Booking volumes, dates and statuses are unchanged (the pick uses one random draw); only which tour a booking belongs to and its price shift. After the change: 3,140 bookings, 13 pending, 1,509 customers.
- Destination photos now come from each destination's first tour, which fixes Kep showing the Ta Prohm jungle temple. Battambang has no tour yet and keeps the countryside river photo.
- Admin Categories gained the `UtensilsCrossed` icon.

**Theme areas**
- `ThemeProvider` keeps separate preferences: admin (`tourtrip.theme`, default dark) and storefront (`tourtrip.theme.storefront`, default light).
- `useThemeScope` is called by `AdminLayout`, `AuthLayout` and `StorefrontLayout`. The first-paint script in `index.html` picks the key from the URL, so there's no flash on either side.
- The theme toggle was extracted to `components/ui/ThemeToggle.jsx` and is shared by the admin topbar and the storefront.

**Part A — Storefront shell** (`src/features/storefront/layouts/StorefrontLayout.jsx`)
- **Header:** transparent over the Home hero, turning into a blurred solid bar after scrolling. Nav links have a sliding underline, plus Sign in, Register and the theme toggle.
- **Mobile:** a full-screen menu that expands in a circle from the button, with a focus trap, Escape to close, closing after navigation, and a scroll lock.
- **Footer:** reveals on scroll, with about text, contact details, quick links, inline social marks (lucide v1 has no brand icons), a mock newsletter form with validation and a toast, and copyright.
- **Pages:** fade in with the shared `pageTransition`, keyed by path, so `/tours` filter changes don't replay it. `#section` links scroll into place.
- **Routing:** `/` is now the storefront (before, it redirected to `/admin`). Unknown public paths go home, and unknown `/admin/*` paths go to `/admin`. Old public routes (`/explore`, `/trips/:id`, `/booking`, etc.) are untouched.

**Part B — Home (`/`)**
- **Hero:** four crossfading photos (Angkor Wat reflection, Mekong dusk, Koh Rong, Royal Palace) with Ken Burns drift, scroll parallax, a caption and photo dots, and the existing `SplitText` word reveal.
- **Search card:** overlaps the hero edge. It has a destination select (Battambang disabled as "coming soon"), date and travellers, and submits to `/tours?destination=&date=&travelers=`.
- **Categories:** six cards with admin icons and tour counts, linking to `/tours?category=`. They're a horizontal snap row on mobile.
- **Featured tours:** the 6 most booked tours (last 90 days) using the shared `TourCard`.
- **Destinations:** a bento grid of 6 photos with tour counts, linking to `/tours?destination=`. Battambang shows "Coming soon" and isn't a link.
- **Reviews carousel:** approved 4–5★ reviews from `mocks/reviews.js`. It auto-advances every 6.5 s, pauses on hover and focus and under reduced motion, and supports swipe, arrow keys, prev/next buttons and dots.
- **CTA band:** a dark gradient block before the footer.
- **Motion:** every section reveals once on scroll (`Reveal` / `RevealItem`, `useInView`, reduced-motion aware), with staggered children.

**Part C — Search & Tour Listing (`/tours`)**
- **URL filters:** `q`, `destination` and `category` (comma lists, so Home's single ids work), `min`/`max` price, `duration` (day/multi), `rating` (4 / 4.5), `sort` (popular / price-asc / price-desc / rating). `date` and `travelers` are shown as info, not as filters, because the tours run daily.
- **Filter panel:** a sticky sidebar on desktop and the shared Drawer on mobile, with a "Show N tours" footer. Checkboxes show counts and disable at 0; the price range uses two native range inputs on one track (keyboard accessible); duration and rating are radios.
- **Results bar:** debounced search, a sort select, results count, removable animated chips and Clear all.
- **Load more:** in steps of 6, with a "Showing X of Y" progress bar. It resets when filters change.
- **Grid motion:** results re-key per filter set, so they fade out and re-stagger in, with layout-position animation.
- **States:** skeleton cards on first load, an empty state with Clear filters, and an error state with Try again.
- **Tour and account placeholders:** `/tours/:id` is a preview of the tour's essentials, a note that the full page is coming, and "Sign in to book" / "Continue browsing", following the Guest flow (login is required to book). `/account/sign-in` and `/account/register` are placeholders.

**Shared `TourCard`:** the only card style, used on Home and on `/tours`. It has a fixed 4:3 image that fades in on load (no layout shift), a slow zoom and pointer spotlight on hover, a lift, and a tag (Bestseller, Popular or New). It shows destination, category, tagline, duration, group size, rating (or "No reviews yet") and "From $X / person", and the whole card is one accessible link.

### Tour data reuse (decision)

`src/features/storefront/mocks.js` doesn't hold a separate tour list:
- **Catalogue:** `mastersDb` (the Masters admin arrays, shared with the dashboard) supplies tours, categories and destinations. Inactive records are hidden, so admin edits show up on the storefront.
- **Popularity:** counted from non-cancelled bookings in the last 90 days of the shared store.
- **Ratings:** averaged from Approved reviews only (the public view). Admin Reports averages all non-hidden reviews.
- **Presentation copy:** the file only adds marketing taglines, duration wording and destination blurbs, keyed by id with fallbacks.

### Verification

- Every commit was built and linted on its own in a temporary worktree (all passed). The final `npm run build` passes and `npm run lint` exits 0; the only new warnings are Fast Refresh advisories on route and provider files, the same kind as before.
- **Flows (scripted, headless Edge):**
  - The hero search to Kep with a date and 3 travellers lands on `/tours?destination=kep&date=2026-10-12&travelers=3` and shows 1 tour plus a date/travellers note.
  - The Food & Markets card gives 1 tour, and the Siem Reap destination card gives 4.
  - `/tours`: 9 tours, 6 shown, then Load more shows 9 of 9. All three sort orders are correct, 2–3 days gives 2 tours, and 4.5★ and up works. The price max set by keyboard filters correctly and its chip removes. Search "pepper" gives 1.
  - The empty combination shows the empty state, and Clear filters brings back 9. On mobile the drawer's filters and "Show 2 tours" work.
- **Themes:** a fresh visit gives a light storefront and dark admin at first paint. Toggling the storefront to dark leaves admin's stored preference alone.
- **Visual:** Home at 1440 (light and dark), 768 (dark) and 375; `/tours` at 1440, 1920, 768 and 375; the preview page at 1280. No console errors and no horizontal overflow.
- **Admin regression:** all 11 admin sidebar pages open with 0 console errors.

### Commits

- `feat(mocks): add three tours and a food category to the shared catalogue`
- `feat(theme): keep separate admin and storefront theme preferences`
- `refactor(ui): extract theme toggle into a shared component`
- `feat(storefront): add public layout with header, footer and nav`
- `feat(storefront): add home page hero and search bar`
- `feat(storefront): add categories, featured tours, destinations, reviews and cta` (includes the shared `TourCard`)
- `feat(storefront): add tour listing page with filters and sort`
- `docs: update worklog and note for danish`

### Decisions

- **Load more** rather than pagination: it suits a photo-led browsing page and keeps scroll position. The page size is 6; with 9 tours it appears once.
- **Page location:** storefront pages live in `src/features/storefront/pages/`, as the brief put all customer-facing code under `features/storefront`. This is recorded in AGENTS.md.
- **Fonts:** Fraunces isn't installed, so display type uses the existing Bricolage Grotesque, per "no new fonts".
- **Storefront motion presets** (`features/storefront/motion.js`) are storefront-only and slower (500 ms). They're built on the shared `motionEase`, and admin presets are unchanged.
- **Mock-only fields:** date and travellers in the hero don't filter, and newsletter and social links are placeholders.

### Known issues

- There are only 9 tours, so Load more only triggers once, and Battambang has no tour until one is added in Masters.
- `/tours/:id` and the account pages are placeholders (Phase 7b).
- Mock data (including tours added in Masters) resets on reload.
- A small, faint line may be visible where the transparent header's gradient meets bright hero photos.

### Next steps

Phase 7b: Tour Detail page (gallery, itinerary, included/excluded, reviews, available schedules, sticky booking card) + Login/Register for customers (separate from admin auth) + Continue Browsing pages (full Gallery, Reviews, Destinations pages). Reuse StorefrontLayout, TourCard, and storefront mocks.

## 2026-09-30 — Performance, smooth transitions, and lag optimization across all pages

- Agent: Antigravity/Gemini
- Branch: `feature/admin-reports-settings`

### Completed

- **Theme flash on refresh fixed:** Injected a tiny synchronous inline script into `<head>` of `index.html` to immediately read `localStorage.getItem('tourtrip.theme')` and apply `.dark` and `data-theme` to `<html>` prior to first paint. Replaced hard-coded dark classes in `PageLoader` (`src/routes/index.jsx`) with semantic tokens (`bg-background text-foreground`, `text-accent`) so page refreshes and chunk loads match the user's active theme without any color flashing.
- **Route transitions smoothed:** Optimized `pageTransition` in `src/lib/motion.js` (`initial: { opacity: 0, y: 4 }`, `animate: { duration: 0.2 }`, `exit: { duration: 0.1 }`). Added hardware-accelerated compositor promotion (`willChange: "opacity, transform"`, `transform-gpu`) to `<motion.div>` in `AdminLayout.jsx`. Switching between pages and tabs is now crisp and fluid without dropped frames.
- **3D FlipCard lag eliminated:** In `AdminLoginPage.jsx`, removed heavy `backdrop-blur-md` on rotating front and back faces (which previously forced the GPU to recalculate heavy blur kernels over high-res background images on every rotation frame). Replaced with high-performance `bg-[#10191d]/96 [contain:paint] transform-gpu`. In `FlipCard.jsx`, refined the ambient blur shadow and promoted faces to dedicated composited 3D layers with `transform: translate3d(0, 0, 1px)`. The 3D flip between Sign In and Sign Up now locks at 60fps.
- **Noise texture GPU stall eliminated:** In `src/index.css`, added `contain: strict; transform: translateZ(0);` to `.grain::after`, isolating the SVG noise shader from full-screen layout and scroll invalidations.
- **Cleaned public & legacy pages:** Replaced third-party Pinterest and external image links in `PublicHome.jsx`, `ForgotPassword.jsx`, and `RegisterForm.jsx` with bundled high-res local Cambodia assets (`Angkor-Wat(1).jpg`), eliminating external DNS delays and slow loading. Removed render-blocking `@import url('https://fonts.googleapis.com...')` inside `CreateCustomer.jsx` inline styles. Cleaned unused imports and dead variables across `CategoriesPage.jsx`, `CreateCategoryPage.jsx`, `CreateCustomer.jsx`, `CustomerListPage.jsx`, `ManageMaster.jsx`, and `TripDetailPage.jsx` (linter warnings dropped from 78 to 53 with 0 errors).

### Files created or changed

- `index.html`
- `src/index.css`
- `src/lib/motion.js`
- `src/layouts/AdminLayout.jsx`
- `src/routes/index.jsx`
- `src/components/ui/FlipCard.jsx`
- `src/pages/auth/AdminLoginPage.jsx`
- `src/pages/customer/ForgotPassword.jsx`
- `src/pages/public/PublicHome.jsx`
- `src/pages/public/auth/RegisterForm.jsx`
- `src/pages/public/trips/TripDetailPage.jsx`
- `src/pages/admin/categories/CategoriesPage.jsx`
- `src/pages/admin/categories/CreateCategoryPage.jsx`
- `src/pages/admin/customers/CreateCustomer.jsx`
- `src/pages/admin/customers/CustomerListPage.jsx`
- `src/pages/admin/masters/ManageMaster.jsx`
- `docs/WORKLOG.md`

### Verification

- `npm run lint` passed with 0 errors.
- `npm run build` completed in 3.01s with 0 errors.
- Verified smooth 60fps card flips and route transitions.

## 2026-09-30 — Phase 6: Reports and Settings (admin side complete)

- Agent: Claude Code
- Branch: `feature/admin-reports-settings`
- **Base:** neither `feature/admin-bookings-customers` nor `feature/admin-reviews` had been merged anywhere (there's no `develop` on the remote). Following the fallback, I branched from `feature/admin-fixes-and-masters`. With Danish's approval I then merged both feature branches into this branch (two merge commits), so Reports can use live bookings and review ratings. Only `WORKLOG.md` and `NOTES.md` conflicted, and both entries were kept. Nothing was merged into `main` or `develop`.

### Completed

**Reports** (`/admin/reports`, `pages/admin/reports/ReportsPage.jsx`, `features/reports/`)
- **Layout:** PageHeader, then the shared `Tabs` for the five report types, with the tab, range and year kept in the URL (`?tab=&range=&year=`). Range-based tabs use the dashboard's `SegmentedControl` (7D/30D/90D/12M); Monthly Income uses a year picker. Tab content enters with the shared `pageTransition`, or a static swap under reduced motion.
- **Data:** `features/reports/api.js` reuses the dashboard's range generators and store helpers. The new `buildYear` (mocks) and `getYearlySeries(year)` (in `features/dashboard/api.js`) power the yearly view. Hooks use `keepPreviousData`, so range changes morph instead of flashing.
  - "Bookings" means bookings made in the period; "Revenue" means money received in the period (the dashboard's income basis), so report totals always match Income.
  - Booking and review changes invalidate `["reports"]`.
- **Monthly Income:** StatCards for total, average per month, best month, and the change vs last year as a dollar amount with a % chip over the months covered in both years. A Chart.js bar chart for the year with an optional dashed previous-year line (Switch). Months outside the generated history show as gaps, not zeros.
- **Popular Tours:** shared DataTable (sortable, searchable): rank, thumbnail, bookings, travellers, revenue, average rating, and % of bookings. The rating comes from Phase 5's reviews mock (`getReviewsDb`); hidden reviews are excluded.
- **Booking Status:** four status tiles (count, share, booking value) and a stacked bar chart of the mix per bucket.
- **Destinations:** horizontal revenue bars (terracotta→gold) and a table covering all six destinations, including Kep and Battambang with no tours yet, sorted by revenue.
- **Payments:**
  - A polar-area chart of money received by the four exact methods (same colours as the dashboard), with a legend and total.
  - Paid/Unpaid/Refunded tiles.
  - A transactions DataTable filterable by method, payment status and booking status and searchable by customer or ID. Rows open the shared BookingDrawer.
- **Charts:** everything uses `lib/chart.js` (theme tokens, `tooltipPreset`, `chartAnimation` off under reduced motion) through `ReportChart`, which mounts on first view via `useInView`. `BarController`, `LineController` and `PolarAreaController` are now registered globally for the generic `<Chart>`; before this, polar area only worked once the dashboard chunk had loaded.
- **States:** every tab has skeleton, error (Retry) and empty states. In dev, `?state=loading|error|empty` works here too.
- **Export (`features/reports/export.js`), a real download for the active tab:**
  - Each report registers a description through `useRegisterExport`: title, subtitle, summary, and one or more tables.
  - **Excel:** SheetJS writes a Summary sheet plus one sheet per table. Numbers stay numeric with currency, percent and signed-percent formats; each sheet gets an autofilter and column widths.
  - **PDF:** jsPDF + jspdf-autotable build an A4 document (landscape when a table has more than 6 columns) with a branded header in the `--primary` token colour, a summary grid, striped tables, and page footers. Compression is on (the 30D Payments PDF went from 280 KB to 23 KB). It uses Latin-1 text only, since there's no custom font.

**Settings** (`/admin/settings`, `pages/admin/settings/SettingsPage.jsx`, `features/settings/`)
- Tabs are General | Payment methods | Email | Other, using the shared `Tabs` (same look as Masters), with `?tab=` in the URL and the same content transition. Mock store in `mocks/settings.js`, saved for the session.
- **General:** site name, contact email and phone. Currency (USD) and timezone are locked display-only fields: they're not registered with the form, and the API keeps them fixed.
- **Payment methods:** a Switch for each of the four exact methods, with checkout details for each (cash instructions, bank name/account/number, ABA merchant ID, card statement descriptor). zod requires at least one method to stay enabled.
- **Email:** from name and email, plus switches for booking confirmation, payment received, cancellation and review request. No email is sent.
- **Other:** free-cancellation window (0–60 days), guest checkout, and "Reviews require approval", which links to the Reviews queue (display only).
- Every form uses react-hook-form + zod with inline errors. Save enables only when the form changes, with an "Unsaved changes" hint; Discard resets, and saving shows a toast and resets the baseline.
- There are skeletons while loading and an error state with Retry.

**New shared UI:**
- `components/ui/Switch.jsx`: `role="switch"`, label and description, spring thumb, focus ring, disabled state.
- `components/shared/Tabs.jsx`: tablist with arrow/Home/End keys and auto-scroll to the active tab; used by Reports and Settings. The Masters tabs stay on their own NavLink version.

### Verification

- **Per-commit builds:** every first-parent commit on this branch was built and linted in a temporary worktree, and all passed. The final `npm run build` passes and `npm run lint` exits 0; the remaining warnings are pre-existing, in teammate files plus the TanStack Table compiler notice.
- **Exports (headless Edge with real downloads):** Excel and PDF for all five tabs downloaded:
  - `.xlsx` files were re-read with SheetJS and have the expected sheets and numeric cells (for example `$24,467` stored as 24467).
  - The income PDF was opened and read correctly (header, summary, 12-month table). The payments PDF has 6 valid pages.
- **Settings (scripted):**
  - The form flows work: dirty gating, invalid-email error, the all-methods-off error, Discard, the empty-days error, and save toasts.
  - Values persist across in-app navigation.
- **Final pass, dark and light:** all 11 sidebar items open with 0 console errors. The order is Overview → Manage Masters → Operations → Insights → System, matching the Admin Flow, and breadcrumbs and active states are correct.
- **Regression:** the two-way bookings sync (drawer confirm → dashboard, dashboard reject → Bookings) still passes after the merges.
- **Visual:** Reports at 375, 768, 1280 and 1440, dark and light, including forced loading, error and empty states; Settings at 375, 768, 1280 and 1920. No page-level horizontal overflow.

### Commits

- `Merge branch 'feature/admin-bookings-customers' into feature/admin-reports-settings`
- `Merge branch 'feature/admin-reviews' into feature/admin-reports-settings`
- `chore(reports): add xlsx, jspdf and jspdf-autotable for report exports`
- `feat(dashboard): add yearly month buckets and getYearlySeries helper`
- `feat(ui): add switch and shared tab bar matching masters tabs`
- `feat(reports): add reports data layer on the shared booking store`
- `feat(reports): add real excel and pdf export`
- `feat(reports): add reports page shell with monthly income and yoy comparison`
- `feat(reports): add popular tours and booking status reports`
- `feat(reports): add destination and payment reports`
- `feat(settings): add mock settings store, api and zod schemas`
- `feat(settings): add settings page with general, payment, email and other tabs`
- `docs: update worklog and note for danish`

### Decisions

- **Excel library: SheetJS `xlsx` 0.20.3 from the official CDN tarball** (`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, pinned in `package.json`). The npm registry copy is frozen at 0.18.5 with open advisories; `npm audit` reports 0 vulnerabilities with the CDN build. The chunk is about 492 KB (160 KB gzipped). ExcelJS was about twice the size for no benefit here.
- **PDF library: `jspdf` 4 + `jspdf-autotable` 5.** They produce a real, searchable PDF with proper tables and page breaks, whereas printing HTML depends on the browser's print dialog. The chunks are about 400 KB (130 KB gzipped) and 30 KB (10 KB gzipped).
- All three libraries are dynamically imported when Export is clicked, so they're never in the main bundle or the Reports page chunk.
- Revenue is counted by payment day throughout Reports, matching dashboard income. Per-tour and per-destination revenue is therefore money received in the period, even for bookings made earlier.
- YoY compares only months present in both years. The generated history starts about 26 months back, so 2024 is partial.
- The payment-method switches and review-approval toggle are display settings only; checkout and moderation don't read them yet.

### Known issues

- Mock data (bookings, customers, reviews, settings) resets on reload. There's no real API.
- The PDF uses the built-in Helvetica, so non-Latin-1 names would render incorrectly. The current mock names are Latin-1. Embed a font (for example Kantumruy Pro) if Khmer script is needed.
- Large ranges produce long PDFs (every transaction); there's no row cap.
- The Profile page (`/admin/profile`) is still the ComingSoon placeholder. It isn't part of the Admin Flow.

### Next steps

Admin side complete. Phase 7 begins the Customer-facing side per the Guest/Customer Flow: Home, Search Tours, Tour Listing, Tour Detail, Login/Register, Tour Booking (multi-step), Payment, My Bookings. Reuse the design system, motion presets, and shared components built for admin; new customer-facing components go under `src/features/public/` or similar — propose a folder name and record it here.

**Proposed structure (for Phase 7):**
- `src/features/storefront/`: customer-only UI and logic, split into `components/` (hero, tour cards, filters, booking stepper, checkout), `hooks.js` and `api.js` (public read endpoints: tours, availability, reviews).
- Shared domains stay in `src/features/<domain>/` and are reused instead of duplicated, e.g. `bookings` for create and "My Bookings", `tours`, and `customers` for register and profile.
- `src/layouts/PublicLayout.jsx` for the header and footer shell; route components in `src/pages/public/`, which already exists.
- The Settings payment-method switches and "guest checkout" should drive the checkout step once Phase 7 starts.

## 2026-09-30 — Phase 5: Manage Bookings and Manage Customers

- Agent: Claude Code
- Branch: `feature/admin-bookings-customers` (from `feature/admin-fixes-and-masters`). Reviews was not touched; it is being built in parallel on `feature/admin-reviews`.

### Completed

**Shared data.** Bookings, customers, dashboard widgets and the sidebar badge all use one source, `dashboardDb` in `src/mocks/dashboard.js`, read through `features/bookings` and `features/customers`. No second bookings store was added.
- Each booking now has:
  - adults, children and infants
  - the booking review step's price breakdown: adult price, child price at 60%, infants free, an occasional "Early bird 10%" discount, and `amount` equal to the total
  - contact email and phone, optional special requests and a departure time
  - a `statusHistory` covering status and payment events
- These fields come from a separate per-booking seed, so dashboard volumes did not change.
- The customer directory is built from the same signup series as the "Total Customers" KPI:
  - 640 members from before the history window, plus each day's signups, currently 1,509 customers.
  - The original 40 names stay as the longest-standing members.
  - Bookings pick from customers who had joined by then (median 2 bookings, max 9; nobody books before joining).
  - `customersAt()` now counts the directory itself, so adding a customer moves the KPI.

**Bookings API** (`features/bookings/api.js`, `hooks.js`):
- `updateBookingStatus` handles confirm, reject, complete and cancel.
  - Transitions are validated.
  - Reject stores "Rejected by admin" plus an optional note; cancel requires a reason.
  - Each action appends to the history and the activity feed.
- `updateBookingPayment` handles Paid, Refunded and the method; see Decisions for how it affects income.
- `bulkConfirmBookings` confirms several at once, and `restoreBooking` undoes any of these from a full snapshot.
- Hooks patch the single `["bookings"]` cache optimistically and recompute the sidebar pending badge from the patched list. On settle they invalidate bookings, dashboard, customers and the shell summary. `useBookingActions` gives the dashboard widget, table rows and drawer the same 5-second Undo toast.

**Manage Bookings** (`/admin/bookings`, `pages/admin/bookings/BookingsPage.jsx`):
- The list uses the shared DataTable: ID, customer, tour, travel date, travellers, amount, payment and status.
- Filters: status, payment status and a travel-date range. Search matches customer name or booking ID. Sorting and pagination (10 per page) are included, plus CSV export (`features/bookings/export.js`).
- Pending rows have quick Confirm/Reject with Undo. Only pending rows are selectable, and "Confirm selected" asks for confirmation (with the count) and offers Undo.
- The detail drawer (`BookingDrawer`) opens on row click and deep-links with `?booking=`. It shows tour, schedule, thumbnail, customer, travellers, special requests, price summary, payment method and status actions, and the history timeline.
  - Pending: Confirm / Reject (reason required).
  - Confirmed: Complete / Cancel (reason required).
  - Completed and Cancelled: read-only.
- Below xl the list switches to stacked cards; the drawer is a full-screen sheet on phones.
- The previous page is kept at `/admin/bookings/legacy`.

**Manage Customers** (`/admin/customers`, `pages/admin/customers/CustomersPage.jsx`):
- The list shows initials, name/ID, email, phone (2xl and up), bookings, total spent, joined date and status.
- Search matches name, email or ID; there's a status filter. It sorts by total spent by default and shows cards below lg.
- The profile drawer (`?customer=`) shows contact details, member since, and bookings, total spent and upcoming trips computed live from the bookings cache (`features/customers/stats.js`).
  - The booking history opens the booking drawer on top of the profile; a payment change there updates the totals immediately.
  - Activate/Deactivate asks for confirmation (also available from the row menu).
- "Add customer" is a drawer (`?create=1`, and `/admin/customers/create` redirects to it) with zod validation (`features/customers/schema.js`); duplicate emails are rejected.
- The teammate page stays at `/admin/customers/legacy` via `useLegacyCustomers`.

**Shared components:**
- **DataTable** (backwards compatible with Masters):
  - row click that also works from the keyboard, custom row actions, per-row selectability
  - bulk action buttons, error state with Retry, `dense`, per-column `meta.className`, `cardsBelow` breakpoint, `selectable={false}`, custom mobile cards
  - Fixed: sortable headers had lost their uppercase style.
- **ConfirmDialog** takes `children` (for example a reason field) and `confirmDisabled`.
- **`useEscapeLayer`**: Escape closes only the top-most overlay (dialog over drawer, drawer over drawer). Used by Drawer and ConfirmDialog.
- **StatusBadge** has Paid, Unpaid and Refunded tones, using existing colours.

### Verification

- Every commit on the branch was checked out in a temporary worktree and built and linted on its own (all passed). The final `npm run build` passes and `npm run lint` exits 0; the remaining warnings are in teammate files plus the TanStack Table compiler notice.
- Scripted browser checks (headless Edge via `puppeteer-core`, scratchpad only), in one browser session because mock data resets on reload:
  - **Bookings → Dashboard:** confirming TT-24630 in the drawer moved the badge from 13 to 12, and the dashboard's Recent Bookings then showed it as Confirmed.
  - **Dashboard → Bookings:** rejecting TT-24631 on the dashboard moved the badge to 11. The Bookings page showed it as Cancelled, and its drawer history read "Cancelled · Admin · Rejected by admin".
  - **Booking actions:** reject stays disabled until a reason is typed; complete, method change, mark paid, refund and cancel with a reason all work. Quick confirm with Undo went 12 → 11 → 12, and bulk confirm of 3 went 12 → 9, then back to 12 on Undo.
  - **Customers:**
    - "View customer profile" from a booking opens the right customer.
    - Opening a history booking stacks the booking drawer on top; marking it paid raised total spent from $120 to $545; one Escape closed only the booking drawer.
    - Deactivate and Activate work, and the create form shows three validation errors when empty.
    - A duplicate email is rejected. Creating c-1510 opened its profile, and the dashboard KPI went from 1,509 to 1,510.
  - There were no console errors, and the Masters Categories table still renders as before.
- Visual checks: Bookings at 375 (light), 768, 1280, 1440 and 1920; Customers at 375, 768, 1280 and 1440, dark and light. There is no page-level horizontal overflow, and table widths fit their cards at 1280 and 1440.

### Commits

- `feat(mocks): add traveller mix, pricing, contacts and history to shared bookings`
- `feat(bookings): add status, payment and bulk actions on the shared store`
- `feat(shared): layer escape handling and allow confirm dialog content`
- `fix(mocks): format international customer phone numbers`
- `feat(shared): extend data table with row click, custom and bulk actions`
- `feat(bookings): add booking detail drawer with status and payment actions`
- `feat(bookings): add bookings list with filters, quick and bulk confirm`
- `feat(mocks): build the customer directory from the signup series`
- `feat(customers): compute total bookings and spend from shared bookings data`
- `feat(shared): let data tables hide selection and inline mobile actions`
- `feat(customers): add customers list and profile drawer`
- `feat(customers): add create customer drawer`
- `docs: update worklog and note for danish`

### Decisions

- **Reject reason:** Reject follows the domain rule (Cancelled with "Rejected by admin"). A reason note is required in the drawer and is appended after a colon. The quick ✕ buttons on the table and dashboard keep the plain rule text.
- **Income:** Paid books the amount as income today; Refunded removes it (income is counted on the day money is received). Paying a cancelled booking and refunding an unpaid one are blocked.
- **Directory size:** the customer directory grew from 40 to about 1,500 so it matches the KPI and per-customer totals look realistic. Some names repeat, as in real life; email and ID stay unique.
- **Column fitting:** at 1280 the Bookings avatars and Travellers column hide (the traveller count moves into the tour subtitle), and the Customers phone column appears from 2xl. That keeps every table inside its card with no sideways scrolling.

### Known issues

- Mock changes live only for the browser session; a reload regenerates the data.
- Completing an unpaid cash booking leaves it Unpaid; whether it should auto-mark as Paid is a question for Danish (see NOTES).
- Inactive customers are only labelled; nothing blocks them from booking yet, since there's no customer-facing booking flow on these branches.
- The old dashboard API helpers (`decideBooking`/`restoreBooking` in `features/dashboard/api.js`) are still unused, as Phase 4 noted.

### Next steps

Merge with feature/admin-reviews (built in parallel), then Phase 6: Reports + Settings.

## 2026-09-30 — Phase 5: Reviews Management

- Agent: Antigravity/Gemini
- Branch: `feature/admin-reviews` (from `feature/admin-fixes-and-masters`)

### Completed

- Implemented full Reviews Management domain under `/admin/reviews` with mock store, TanStack Query hooks, Chart.js rating distribution, and interactive moderation queue.
- Created `src/mocks/reviews.js`: deterministic dataset with 26 authentic Cambodia tour reviews spanning Angkor Wat Sunrise, Koh Rong Island, Kampot Adventure, Phnom Penh City, Kulen Mountain, and Bokor Hill Station. In-memory session store supports status transitions (Pending, Approved, Hidden), deletion, restoration, and live pending count computation.
- Built data layer in `src/features/reviews/api.js` and `src/features/reviews/hooks.js` with TanStack Query. Implemented optimistic cache updates across `["reviews"]`, `["review-stats"]`, and `["shell-summary"]`, ensuring instant UI and live sidebar pending badge updates on moderation actions.
- Integrated Sonner toast notifications with a 5-second Undo action when approving or hiding reviews, mirroring the bookings flow. Permanent deletion is protected with `ConfirmDialog`.
- Created `ReviewStatsHeader.jsx` with prominent average rating display, star icons, sentiment counters (Pending, Approved, Hidden), and a horizontal bar chart of rating distribution using Chart.js and `useChartTheme()`.
- Built `ReviewCard.jsx` with reviewer initials avatar, customer name, tour name, relative date, star rating, quoted comment typography, `StatusBadge`, and responsive quick-action buttons.
- Upgraded `ReviewsPage.jsx` with tabs (Pending Moderation as default, All, Approved, Hidden) featuring live count pills, live search filter, star rating filter, staggered Framer Motion entrance/exit transitions, skeleton loading, and empty states.
- Replaced static sidebar review count in `src/features/notifications/api.js` with live `getPendingReviewsCount()` from the reviews mock store.
- Updated `src/components/shared/StatusBadge.jsx` to support `"approved"` and `"hidden"` status tones.

### Files created or changed

- Mock and API: `src/mocks/reviews.js`, `src/features/reviews/api.js`, `src/features/reviews/hooks.js`, `src/features/notifications/api.js`.
- Components and Pages: `src/components/shared/StatusBadge.jsx`, `src/features/reviews/components/ReviewStatsHeader.jsx`, `src/features/reviews/components/ReviewCard.jsx`, `src/pages/admin/reviews/ReviewsPage.jsx`.
- Docs: `docs/WORKLOG.md`, `docs/NOTES.md`.

### Commits

- `cae0773 feat(reviews): add mock reviews dataset and data layer`
- `4a96095 feat(reviews): wire sidebar badge to live pending count`
- `5081073 feat(reviews): add rating stats header with distribution chart`
- `10bf0a9 feat(reviews): add moderation queue with filter tabs and actions`
- `f252db6 fix(reviews): self-contain date helpers in reviews mock`

### Verification

- `npm run lint` completed with 0 errors across 212 files.
- `npm run build` completed cleanly in 1.74s with 0 errors.
- Verified in-memory mock store mutations, pending count decrements/increments, and restoration in Node.js ESM.
- Tested responsive breakpoints (375px, 768px, 1280px, 1920px), dark/light theme tokens, and accessibility focus states.

### Decisions and known issues

- In-memory mock store mutations persist for the active browser session and reset on hard page reload until the Laravel REST backend is connected.
- Replaced reference to Thailand/Bangkok in spam mock fixture with Siem Reap to strictly honor Cambodia travel context guidelines.
- Self-contained date formatting utilities inside `src/mocks/reviews.js` to ensure total isolation from other domain mocks.

### Next steps

- Merge with `feature/admin-bookings-customers` (built in parallel), then Phase 6: Reports + Settings.

## 2026-09-30 — Phase 4: dashboard fixes and Manage Masters

- Agent: Codex
- Branch: `feature/admin-fixes-and-masters` (from `feature/admin-dashboard`; personal `origin` only)

### Completed

- Unified the dashboard and `/admin/bookings` on one generated booking store in `dashboardDb.bookings`. `src/features/bookings/api.js` and `hooks.js` own list, Confirm/Reject, restore, optimistic shared query updates and Undo. The dashboard's RecentBookings widget, the Bookings list and the sidebar pending badge now reflect the same booking decision without a reload.
- Smoothed deterministic 7D/30D revenue using a weighted five-day average while retaining the real transaction totals; Chart.js line tension is 0.38. Balanced the Needs attention cell by centering its content in the available bento height.
- Replaced hard-coded light colours in surviving teammate admin pages and shared admin controls with semantic tokens. Their layouts and logic were preserved. Legacy Masters pages that this phase replaces remain available at `/admin/*/legacy` URLs.
- Added TanStack Table v8 and date-fns. Built `DataTable` (sort, global and status filters, pagination, selection/bulk bar, responsive cards, row menu, skeleton/empty states), `Drawer`, and `MastersShell` with shared tabs. The active tab scrolls into view on narrow screens.
- Built Categories, Destinations, Guides, Tours and Schedules with `features/<domain>/{api.js,hooks.js,schema.js}` and canonical `/admin/masters/<domain>` pages. All use a shared in-memory catalogue and TanStack Query invalidation. Categories have icon selection and referenced-tour deletion guard; Destinations have photo grid/table switch and image preview; Guides have cards and language selection; Tours have a five-step edit/create wizard with validation, itinerary reorder, tags, gallery/cover, review and unsaved-exit confirmation; Schedules have a month calendar, capacity bars, table view and departure drawer.
- Sidebar links now target canonical Masters URLs. Old admin URLs redirect; teammate source files are retained. Deleting a tour with bookings is blocked to avoid orphan records.

### Files created or changed

- Bookings and dashboard: `src/mocks/{bookings,dashboard}.js`, `src/features/bookings/{api,hooks}.js`, `src/features/bookings/components/DecisionButtons.jsx`, `src/features/dashboard/{api,hooks}.js`, `src/features/dashboard/components/{RecentBookings,RevenueChart,AttentionActivity}.jsx`, `src/pages/admin/bookings/ManageBooking.jsx`.
- Masters foundation: `package.json`, `package-lock.json`, `src/mocks/masters.js`, `src/lib/{mastersApi,mastersQuery}.js`, `src/components/shared/{DataTable,Drawer,MastersShell}.jsx`, `src/components/layout/navigation.js`, `src/routes/admin.routes.jsx`.
- Masters features: `src/features/{categories,destinations,guides,tours,schedules}/{api.js,hooks.js,schema.js}`, `src/features/tours/components/TourWizard.jsx`, `src/pages/admin/masters/{Categories,Destinations,Guides,Tours,Schedules}Page.jsx`.
- Theme pass, every touched file: `src/components/admin/{Card,CatalogPreviewCard,CategoryHeader,Chip,ErrorText,Label,MonthlyIncomeChart,PhotoUpload,PopularTours,ReviewCard,ReviewRow,SelectField,StatCard,StepReview,StepTrip,Stepper,TextField,Toast}.jsx`; `src/pages/admin/customers/{CreateCustomer,CustomerListPage}.jsx`; `src/pages/admin/dashboard/DashboardOverview.jsx`; `src/pages/admin/reviews/ReviewsPage.jsx`.
- Docs: `docs/WORKLOG.md`, `docs/NOTES.md`.

### Commits

- `9ab2c8d fix(bookings): share booking store across dashboard and list`
- `d4a2ba3 fix(dashboard): smooth daily income trend`
- `2b8d349 fix(dashboard): balance attention card height`
- `080e686 fix(theme): apply semantic colors to legacy admin views`
- `6cd077c chore(masters): add table and calendar dependencies`
- `8360189 feat(shared): add responsive masters table and drawer`
- `df5b070 feat(masters): add shared mock catalogue and api lifecycle`
- `f06d34b feat(masters): add categories catalogue and crud drawer`
- `eef1e5d feat(masters): add destination grid and edit drawer`
- `93d4141 feat(masters): add guide cards and language editor`
- `de0663a feat(masters): add create and edit tour wizard`
- `40ecab4 feat(masters): add departure calendar and schedule editor`
- `70f323f fix(masters): align navigation and protect linked tours`
- `docs: record phase 4 masters handoff` (this entry and Danish's note).

### Verification

- Each commit above built and linted independently; final `npm run build` and `npm run lint` both exit 0. Lint still prints pre-existing warnings in teammate files and React Compiler compatibility advice; Vite still warns about the large vendor chunk.
- Browser checks at 375, 768, 1280 and 1920 pixels found no page-wide horizontal overflow or console errors on all five Masters routes. Visually checked light Schedules and dark Guides; dark/light theme switching persists. At 1280, the Guides cards and Schedules calendar align with the admin shell.
- Browser CRUD tests on temporary mock records: create, edit, deactivate and delete for all five domains; Tour wizard progressed through every step, saved and reopened prefilled. Category/destination/guide dependency guards, tour-booking guard and schedule seat-capacity guard were added. Shared booking Confirm/Reject/Undo and sidebar badge sync were retested from both dashboard and Bookings. Prior dashboard range, Income/Bookings, doughnut legend, attention/activity tabs, theme toggle and `?state=error` checks passed.

### Decisions and known issues

- Mock catalogue writes last only for the current browser page session; refresh resets fixtures until Laravel exists. The API switch remains isolated in each feature's `api.js` facade. The shared `src/mocks/masters.js` references the existing dashboard catalogue arrays so dashboard counts and Masters records do not diverge.
- TanStack Table was pinned to v8.21.3 because the initially installed v9 changed the API used by this table. The pin and first table consumer landed together in a passing commit.
- Booked tours and referenced categories, destinations and guides cannot be deleted; deactivate or reassign first. New unreferenced records can be deleted. Old teammate pages remain in the repository and have legacy routes; their separate mock files and `react-icons` usage should be migrated later, not removed during this phase.
- Existing static booking detail functionality remains a Phase 5 task. The old dashboard booking API helpers remain unused for now; remove them when the dashboard API boundary is consolidated.

### Next steps

Phase 5 (tool TBD by Claude/Danish): Manage Bookings (list + detail drawer + status/payment update reusing the shared bookings data from this phase), Manage Customers (list, profile drawer, activate/deactivate), Reviews Management (moderation queue). All should reuse DataTable, StatusBadge, ConfirmDialog from this phase.

## 2026-09-29 — Phase 3: Dashboard, Part B done (charts and widgets)

- Agent: Claude Code
- Branch: `feature/admin-dashboard`

### Completed (Part B)

- **Bento grid** (`DashboardPage`): 12 columns on xl, 2 on md, 1 on mobile, with `grid-flow-row-dense`. Rows: Revenue 8 | Status 4 → Recent bookings 7 | Popular tours 5 → Departures 5 | Payment methods 3 | Attention/Activity 4 (row-span 2) → Bookings timeline 8. The spec's widths add up to 40 columns, so the timeline was widened to 8 to close the last row.
- **B1 RevenueChart**: Income/Bookings toggle (`SegmentedControl`), a gradient area for the current period and a dashed muted line for the previous one. Monotone interpolation keeps the line from dipping below $0. It draws in on first view (`revealPlugin`), and the same Chart.js instance updates in place, so points morph when the range or metric changes. Dark glass tooltip with a colour swatch, USD formatting and a crosshair. The header shows the count-up total, a delta chip and a legend.
- **B2 StatusDoughnut**: status colours from tokens (Confirmed jade, Pending gold, Completed blue, Cancelled danger), and a center-text plugin that counts to the visible total. The legend is a set of toggle buttons: hover or focus pops the slice, click hides it (`aria-pressed`), and the counts animate. It rotates and scales in on first view.
- **B3 RecentBookings**: pending rows get Confirm/Reject. The update is optimistic: the badge morphs, the sidebar badge updates, and a sonner toast offers Undo for 5 seconds (`restoreBooking`). Reject means Cancelled with reason "Rejected by admin". The table uses container queries: the amount folds into the tour subtitle and avatars hide when the card is narrow, so the actions never clip (checked at 768/1024/1280/1440/1920).
- **B4 PopularTours**: thumbnails from `src/assets/images`, rank, and bookings and travellers counts. The progress bars show each tour's share of the top tour and grow when scrolled into view.
- **B5 UpcomingDepartures**: date tile, guide initials with a tooltip, and a seat meter that is jade below 80%, gold from 80% ("Almost full") and danger when full ("Full").
- **B6 PaymentMethods**: Chart.js polar area over the four exact methods, with amounts and shares.
- **B7 BookingsTimeline**: stacked bars (Confirmed & completed / Pending / Cancelled) that grow from the baseline with a staggered delay. The top segment is rounded, and hovering a column dims the others (`chart.$hoverIndex` + `update("none")`).
- **B8 AttentionActivity**: a single card with two tabs. "Needs attention" links pending bookings, reviews awaiting approval and almost-full or full schedules to their pages. "Activity" shows the latest 8 events; confirm/reject events appear at the top with a slide-in.
- **B9**: all of the above run on the single `src/lib/chart.js` setup, with theme-aware colours, `useInView` gating, reduced motion (`animation: false`), easeOutQuart and fixed-height containers.
- **B10**: every widget has a skeleton on first load, an error state with Retry and an empty state. Preview them in dev with `/admin?state=loading|error|empty`.

### Verification

- `npm run build` passes and `npm run lint` exits 0; the warnings left are in pre-existing files.
- Headless Edge (`puppeteer-core`, scratchpad only) screenshots at 375, 768 (light), 1280, 1440 and 1920 (dark), plus the error state and reduced motion. There were no console errors and no page-level horizontal overflow.
- Scripted checks:
  - Confirm moves the sidebar badge 16 → 15 immediately, and the toast offers Undo.
  - Reject followed by Undo brings the badge back to 16 and the row to Pending.
  - Toggling the theme recolours the charts, including the doughnut's center text and borders.
  - Bookings, Customers, Categories, Tours, Tour Schedules, Destinations, Reviews and Guides all load without console errors.

### Decisions

- The dashboard owns its fixtures in `src/mocks/dashboard.js`. The Bookings page still reads `src/mocks/bookings.js`, so dashboard confirm/reject does not appear there yet.
- Under 36rem of card width, the recent bookings table scrolls horizontally inside its card (at 375px). The page itself never scrolls sideways.
- Confirm/Reject labels are visible from 2xl; below that they are icon buttons with `aria-label` and `title`.

### Known issues

- Daily income is spiky because each bucket reflects individual cash payments on tour days; weekly and monthly ranges read more smoothly.
- The Needs attention card (row-span 2) has spare space at the bottom on xl.
- Teammate pages keep their light hard-coded styles in dark mode (unchanged from Phase 2).

### Next steps

Phase 4 (Codex Sol): Manage Masters — Categories, Destinations, Guides, Tours (create wizard), Tour Schedules (calendar + seat capacity). Reuse PageHeader, DataTable pattern, StatusBadge, ConfirmDialog, mocks in src/mocks, feature folders in src/features.

## 2026-09-29 — Phase 3: Dashboard, Part A done (flow alignment, data layer, KPIs)

- Agent: Claude Code
- Branch: `feature/admin-dashboard`. It already held two commits on top of the admin shell (`feat(dashboard): add mock overview charts and kpis`, `feat(admin): align booking and customer tables with shell`). I first committed the Phase 2 leftovers on `feature/admin-shell`, pushed it, and merged it into this branch. There was no rebase because the branch was already pushed.

### Completed (Part A)

- **A1 Navigation follows the Admin Flow**: Overview (Dashboard) → Manage Masters (collapsible: Categories, Destinations, Guides, Tours, Tour Schedules) → Operations (Bookings, Customers) → Insights (Reports, Reviews) → System (Settings). There is no Payments item. URLs are unchanged. Nav items can list legacy `aliases` (for example `/admin/masters/guides`), so the right item lights up. Breadcrumbs are built from the nav (`Admin / Masters / Tours / Create`). Command palette entries carry the group as a hint and a search keyword.
- **A2 Mock data** (`src/mocks/dashboard.js`): a mulberry32 PRNG seeded per calendar day, so a given date always yields the same bookings, and dates are relative to today. It covers about 26 months (~3.1k bookings; ~115 in the last 30 days) across the six specified tours, six destinations, five categories, six guides and 40 Khmer and international customers. There is seasonality (high season Nov–Mar), growth and weekend lift. Statuses, payment status and the four exact payment methods follow the domain rules. Also included: 7D/30D/90D/12M bucket generators with previous-period buckets (12M compares the partial current month with the same days a year earlier), seven upcoming schedules (one 90% full, one full), four reviews awaiting approval, and a mutable session store (`dashboardDb`).
- **A3 Data layer**: `src/features/dashboard/api.js` (600ms mock delay) provides `getSummary`, `getRevenueSeries`, `getStatusBreakdown`, `getBookingsTimeline`, `getPopularTours`, `getPaymentBreakdown`, `getRecentBookings`, `getUpcomingDepartures`, `getAttention`, `getActivity`, `decideBooking` and `restoreBooking`. `hooks.js` uses TanStack Query with `placeholderData: keepPreviousData` for range queries, plus an optimistic `useBookingDecision` and `useRestoreBooking`. The sidebar badges (`getShellSummary`) now count real pending bookings and reviews from the same store. `src/lib/format.js` has USD, compact, percent, short date and relative time formatters.
- **A4 Header**: time-of-day greeting, today's date, the new `SegmentedControl` (radiogroup with arrow keys and a sliding `layoutId` pill), an "Updating" hint while the next range loads, and Export, which shows a toast. The range lives in the URL (`?range=7D`).
- **A5 KPI cards**: Total Tours (tour departures run in the period), Total Bookings, Total Customers (registered at the end of the period) and Total Income (payments received, USD). Each has a count-up `AnimatedNumber`, a delta chip against the previous period, a Chart.js sparkline that draws in on first view, a tinted icon, a pointer spotlight and lift, and a link to Tours, Bookings, Customers or Reports. Entrance is staggered, there are skeletons on first load and an error state with Retry.
- **Chart system** (`src/lib/chart.js`, still the only chart setup): `useChartTheme` reads the CSS tokens and refreshes when the root theme class changes. Also added: `withAlpha`, `createGradient`, `gradientFill`, `tooltipPreset` (dark glass), `chartAnimation` (off under reduced motion, easeOutQuart), `crosshairPlugin`, `centerTextPlugin` (animated count) and `revealPlugin` + `playReveal`. `RadialLinearScale` is registered.
- `WidgetCard`, `WidgetError`, `WidgetEmpty` and `useWidgetStatus`, plus a dev-only `?state=loading|error|empty` override (`ForcedStateContext`).
- Fixes: unique breadcrumb keys (React warned about duplicate `/admin` keys), and the sidebar's Angkor motif now sits in the nav flow so it can't overlap Settings on short screens.

### Verification

- `npm run build` passes. `npm run lint` shows no errors; the remaining warnings are pre-existing, in teammate files or Fast Refresh advisories.
- Visual checks used headless Edge driven by `puppeteer-core` from the scratchpad (the Chrome extension wasn't connected). I checked 1440 and 1280 dark and light, and 375 dark, with no console errors and no horizontal overflow. A range switch updates the URL and re-counts the KPIs.

### Decisions

- Removed `src/features/dashboard/charts.jsx` and the static `MOCK_DASHBOARD` from the first-pass commit. Their hard-coded colours and single-month data couldn't meet the range, theme or morphing requirements.
- `src/mocks/bookings.js` (used by the Bookings page) is untouched for now. The Bookings page and the dashboard therefore still use different fixtures; unify them when Manage Bookings is rebuilt.
- Income is counted on the day money is received. Counting by booking date made recent periods look much worse than older ones, because recent bookings aren't paid yet.

### Next

Part B: bento grid, revenue chart, status doughnut, recent bookings with confirm/reject, popular tours, upcoming departures, payment methods, bookings timeline, attention and activity.

## 2026-09-29 — Phase 2: Admin shell

- Agent: Claude Code
- Branch: `feature/admin-shell` (from `feature/admin-foundation-login`, which is not yet merged into `main`)

### Completed

- **Sidebar**: grouped nav (Main / Master data / Insights / System), collapsible Master data group with rotating chevron and height animation, framer-motion `layoutId` active pill (terracotta glow and gold dot), `aria-current="page"`, hover icon nudge, and pulsing badges for pending bookings and reviews. Collapses between 260px and a 76px icon rail with a spring; the state persists in `localStorage` (`tourtrip.sidebar.collapsed`). In rail mode, portal tooltips slide out on hover and focus. Includes a profile card with logout (AuthContext) and a faint Angkor line motif.
- **Mobile drawer (<1024px)**: slide-in drawer with a blurred backdrop, focus trap, and close on route change, Esc and backdrop click.
- **Topbar**: sticky glass bar whose bottom border fades in on scroll. Has the collapse toggle (desktop) or hamburger (mobile), animated route breadcrumbs (only the current page shows on mobile), a search trigger with a ⌘K / Ctrl K keycap, a rotating sun/moon theme toggle, a notifications menu and a profile menu (Profile, Settings, Log out).
- **Notifications**: five mock items with type icons, time ago, unread dots and tint, "Mark all as read" (dots scale out in sequence), "Clear all", an empty state and loading skeletons. The unread count pops when it changes. Data comes through TanStack Query with optimistic updates.
- **Command palette**: `cmdk` inside a custom spring-animated glass dialog with a blurred backdrop. Groups: Navigate, Quick actions, Theme and Account. It has fuzzy search, arrow-key navigation, an empty state and a footer with key hints. Opens with ⌘K / Ctrl+K. Also added `G` then `D/T/B/C/R/S` jump shortcuts (they're ignored while typing or when a modal is open).
- **Page transitions**: `AnimatePresence mode="wait"` keyed by pathname using the shared `pageTransition`; `useOutlet()` freezes the exiting page. Scroll resets to the top after the exit completes. A per-page `Suspense` shows `PageSkeleton` and drives a terracotta-to-gold top progress bar. Reduced motion turns transitions off.
- **Shared components** (`src/components/shared/`): `PageHeader`, `StatCard` (shell with loading state), `EmptyState` (Angkor/Mekong SVG illustration), `Skeleton` and `PageSkeleton` (shimmer), `ConfirmDialog` (alertdialog, focus-trapped, focus returns to the opener, Cancel focused first), `StatusBadge`, and `ComingSoon`.
- **Routes**: the dashboard index is now a Phase 2 placeholder (`DashboardPage`). The teammate's `DashboardOverview` is kept at `/admin/dashboard/legacy`. Added `/admin/guides`, and `ComingSoon` pages for `/admin/reports`, `/admin/settings` and `/admin/profile`. Added the dev-only `/admin/_kit` component gallery (verified absent from the production bundle).
- Added a skip-to-content link, and a focus-visible ring on the shared `Button`, which had previously removed its outline with nothing in its place.

### Files created or changed

- Layout: `src/layouts/AdminLayout.jsx`, `src/components/layout/{Sidebar,SidebarItem,Topbar,NotificationsMenu,CommandPalette,RouteProgress}.jsx`, `src/components/layout/{navigation,shellContext,shellUtils}.js`.
- Shared: `src/components/shared/{PageHeader,StatCard,EmptyState,Skeleton,ConfirmDialog,StatusBadge,ComingSoon}.jsx`.
- UI and effects: `src/components/ui/{Tooltip,Popover,BrandMark}.jsx` (new), `src/components/ui/Button.jsx` (focus ring), `src/components/effects/AngkorLines.jsx`.
- Hooks and lib: `src/hooks/{useMediaQuery,useFocusTrap,usePopover}.js`, `src/lib/time.js`.
- Data: `src/mocks/shell.js`, `src/features/notifications/{api,hooks}.js`.
- Pages and routes: `src/pages/admin/dashboard/DashboardPage.jsx`, `src/pages/admin/kit/ComponentKit.jsx`, `src/routes/admin.routes.jsx`.
- Styles: `src/styles/tokens.css` (`*-ink` text tints derived with `color-mix` from existing tokens, with no new hues), `src/index.css` (`.skeleton` shimmer).
- `src/layouts/AuthLayout.jsx` now uses the shared `BrandMark`. Added the `cmdk` dependency. Updated `AGENTS.md`.

### Commits

- `feat(notifications): add mock shell data and notifications api`
- `feat(layout): add collapsible sidebar with animated active indicator`
- `feat(layout): add mobile drawer sidebar`
- `feat(layout): add topbar with breadcrumbs, theme toggle and profile menu`
- `feat(layout): add notifications dropdown with mock data`
- `feat(layout): add command palette with cmdk`
- `feat(shared): add page header, empty state, skeleton, status badge and confirm dialog`
- `feat(layout): add animated page transitions and route progress bar`
- `feat(routes): add dashboard placeholder, guides route and coming soon pages`
- `chore(dev): add component gallery route for design review`
- `fix(layout): raise nav group label contrast to aa`
- `docs: update worklog for admin shell`

### Verification

- `npm run build` passed after every commit. `npm run lint` reports 0 errors. The remaining warnings are in teammate files, plus the existing Fast Refresh advisories.
- Not yet verified in a browser: console errors, visual checks at 375/768/1280/1920 in both themes, and reduced motion. A tool outage blocked the session, so the next agent or a reviewer should do this pass.

### Decisions and rationale

- Built the palette on `cmdk`'s `Command` rather than `Command.Dialog`, so framer-motion controls the open and close animation. Focus trapping and restoring is handled by our own `useFocusTrap`, which `ConfirmDialog` and the mobile drawer also use.
- Only one sidebar is mounted at a time (desktop or drawer, chosen with `useMediaQuery`), so the shared `layoutId` pill never has two owners.
- The active nav item is the longest matching path, so `/admin/masters/guides` doesn't also highlight Tours (`/admin/masters`).
- Tours links to `/admin/masters` (the teammate's "Tours & Masters" page) and Schedules to `/admin/tour-schedules`. Existing routes and redirects were kept, and no teammate page logic was changed.
- The sidebar animates `width` (the one exception to transform/opacity-only) because the content column has to reflow. It uses a spring with no layout thrash inside the column.
- Tooltips render in a portal, so the nav's scroll container never clips them.
- `src/constants/sidebarLinks.js` and `src/hooks/useActiveRoute.js` are no longer used by the shell but were left in place for teammates.

### Known issues and TODOs

- Teammate admin pages still use hard-coded light Tailwind colours (`bg-slate-50`, `text-slate-900`, …), so in dark mode they show as light panels inside the dark shell. Restyle them in their own redesign tasks.
- The auth `Input`, `PasswordInput`, `Checkbox` and `Divider` primitives are styled only for the dark login surface. The kit shows them on a dark panel.
- Profile, Settings and Reports are `ComingSoon` placeholders.
- Palette quick actions go to the existing teammate create pages; `/admin/masters/tours/create` renders the teammate's `CreateTour`.

### Next steps

Phase 3: Dashboard page: KPI cards (CountUp), Chart.js income/status/popular-tours charts, recent bookings, upcoming departures, mock data in src/mocks/dashboard.js

## 2026-09-29 — Admin foundation and login

- Agent: Codex
- Branch: `feature/admin-foundation-login`

### Completed

- Protected local secrets by untracking `.env`, added `.env.example`, and installed the approved foundation dependencies.
- Replaced the duplicated route service with lazy public/admin route configs, a shared protected route, canonical kebab-case admin URLs, and redirects for teammate-owned legacy links.
- Added a single configured Axios client and established `src/mocks/` as the home for new fixtures.
- Created the Modern Khmer tokens, local font stack, persistent dark/light theme, app providers, Chart.js defaults, grain utility, and shared reduced-motion-aware animation presets.
- Added reusable Button, Input, PasswordInput, Checkbox, Card, Divider, Spinner, Badge, Aurora, SplitText, and SpotlightCard primitives.
- Added mock admin authentication, persisted local/session auth state, protected admin routing, theme control, and logout.
- Built the responsive Angkor Wat admin login and six-digit OTP experience with validation, keyboard/paste behavior, resend timer, loading/success states, shake feedback, toasts, and requested-route restoration.
- Verified production build and lint. Lint exits with no errors; warnings originate mainly in existing teammate pages, plus Fast Refresh advisory rules for exported route/provider modules.

### Files created, moved, or changed

- Root: `.gitignore`, `.env.example`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json`, `package-lock.json`.
- Routing: moved `src/services/AppRoutes.jsx` responsibilities into `src/routes/index.jsx`, `admin.routes.jsx`, `public.routes.jsx`, and `ProtectedRoute.jsx`; updated `src/App.jsx`.
- Foundation: `src/styles/tokens.css`, `src/index.css`, `src/lib/{axios,chart,cn,motion}.js`, `src/app/providers/*`.
- UI/effects: `src/components/ui/*`, `src/components/effects/*`.
- Auth: `src/features/auth/*`, `src/pages/auth/AdminLoginPage.jsx`, `src/layouts/AuthLayout.jsx`, `src/mocks/auth.js`.
- Existing integration points: `src/main.jsx`, `src/components/layout/Topbar.jsx`, and `src/constants/sidebarLinks.js`.

### Commits

- `chore: add .env to gitignore and provide .env.example`
- `refactor(routes): move router to src/routes and remove duplicate routes`
- `feat(ui): add design tokens, fonts and dark/light theme`
- `feat(ui): add base button, input and card components with motion`
- `feat(auth): add mock auth service and protected admin route`
- `feat(auth): redesign admin login and add animated otp verification`
- `docs: add AGENTS.md, CLAUDE.md and worklog for ai handoff`

### Decisions and rationale

- Kept old login, OTP, page, and mock modules in place even when no longer routed, because they are teammate-owned and may still be reused.
- Used a lightweight in-project Aurora, SplitText, and pointer spotlight implementation instead of adding an unneeded component registry dependency; this keeps ownership and reduced-motion behavior explicit.
- Kept mock/real transport switching inside `src/features/auth/api.js`; future Laravel integration only changes that adapter and environment setting.
- Used `localStorage` only when “Remember me” is selected; otherwise auth is scoped to `sessionStorage`.
- Preserved direct legacy admin links through redirects while making navigation canonical.

### Known issues and TODOs

- Migrate existing fixtures from `src/data/`, `src/constants/`, `src/pages/admin/categories/data/`, and `src/pages/admin/destinations/data/` into `src/mocks/` feature by feature.
- Remove legacy `react-icons` usage only after teammate components have migrated to Lucide React.
- Existing admin/customer pages contain Oxlint warnings and legacy hard-coded light styling; address them only in their owning redesign tasks.
- Replace mock auth endpoints and token shape when the Laravel API contract is available.

### Next steps

Phase 2: admin shell (collapsible sidebar with animated active indicator, topbar, ⌘K command palette, page transitions) → Phase 3: dashboard bento (Chart.js charts, KPIs, live feed).

## 2026-09-29 — Mobile verification follow-up

- Agent: Codex
- Branch: `feature/admin-foundation-login`
- Ran isolated Edge headless renders at 375×812 and 1440×1000 after the build checks.
- Added explicit min-width and viewport constraints to the auth grid/card after the 375px render exposed flex min-content overflow.
- Commit: `fix(auth): constrain login card on mobile viewports`.

## 2026-09-29 — 3D FlipCard Auth & Luxury Background Slideshow

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`

### Completed

- Generated a luxury golden-hour Angkor Wat sunrise reflection backdrop (`src/assets/images/common/login_bg_luxury.jpg`) and integrated into `AuthLayout`.
- Created interactive `FlipCard` (`src/components/ui/FlipCard.jsx`) supporting 3D spring rotation, cursor-tracking sheen/glare, perspective tilt, dynamic shadow, and controlled front/back flip transitions.
- Designed `RegisterCardForm` (`src/features/auth/components/RegisterCardForm.jsx`) for the back face of the card with validation, terms agreement, loading state, and mock registration.
- Added `registerSchema` in `src/features/auth/schema.js` and `signUp` mock endpoint in `src/features/auth/api.js`.
- Implemented `TextSlideshow` (`src/components/effects/TextSlideshow.jsx`) displaying rotating Cambodian expedition stories with animated headlines, progress indicators, pause-on-hover, and stat chips.
- Integrated `FlipCard` in `AdminLoginPage`: front face handles Sign In and morphs into OTP verification, back face handles Sign Up with instant 3D flipping, and demo credentials autofill is preserved.
- Verified build and lint checks pass cleanly with 0 errors.

### Commits

- `feat(auth): add 3d flip card login, registration, and luxury background slideshow`

## 2026-09-29 — Stabilize Auth Card by Removing Cursor Tilt

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Disabled cursor-tracking 3D tilt, drag, and hover scale on the auth `FlipCard` in `AdminLoginPage.jsx`.
- Keeps the card completely flat, motionless, and stable while preserving the smooth 3D Y-axis flip between Sign In and Sign Up.
- Commit: `refactor(auth): remove cursor tilt and hover wobble from login card`.

## 2026-09-29 — Optimize Page Load and Refresh Performance

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Removed `mix-blend-mode: soft-light` from `.grain` in `src/index.css` (eliminating full-screen GPU blend stalls on laptop graphics).
- Replaced Framer Motion continuous 100px blur animations in `Aurora.jsx` with static hardware-composited CSS radial gradients.
- Removed CSS `filter: blur()` from `TextSlideshow.jsx` transitions, moving purely to hardware-accelerated opacity and transform.
- Offloaded background image zoom to native GPU CSS animation (`.animate-kenburns`) with `loading="eager"` and `decoding="async"`.
- Eagerly imported `AdminLoginPage` in `public.routes.jsx` to eliminate route-chunk suspense flash on refresh.
## 2026-09-29 — Redesign Sign Up into Multi-Step Form Matching Sign In Size

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Restructured `RegisterCardForm.jsx` into a 2-step wizard:
  - Step 1 (Account Credentials): Email Address (username & confirmations), Password (min 8 chars, 1 number, 1 symbol), Confirm Password, with "Next: Personal Profile" validation trigger.
  - Step 2 (Personal Profile): First Name & Last Name (2 columns), Phone Number (with country code), Date of Birth (DD/MM/YYYY), and Terms agreement, with "Back" and "Create account" actions.
- Synchronized Front (Sign In) and Back (Sign Up) container sizing to identical pixel dimensions (`min-h-[585px]` with flex distribution) so the card maintains the exact same dimensions when flipping.
- Commit: `feat(auth): redesign sign up into 2-step form matching sign in card dimensions`.

## 2026-09-29 — Synchronized Koh Rong & Mekong Destinations with Background Crossfades

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Generated and added ultra-high-definition cinematic photography for two new Cambodian destinations:
  - Koh Rong Sanloem Island (`src/assets/images/common/koh_rong_island.jpg`): turquoise emerald waters, white sand bay, and wooden longtail boats.
  - Mekong River Odyssey (`src/assets/images/common/mekong_river_sunset.jpg`): golden hour sunset reflections, boutique riverboat cruise, and palm tree silhouettes.
- Created `src/features/auth/authSlides.js` holding slide content, atmospheric radial glows, badges, gradients, and photography fixtures.
- Synchronized active slide state between `AuthLayout.jsx` and `TextSlideshow.jsx`, coordinating real-time text transitions with butter-smooth 1000ms GPU-composited background image and glow crossfades.
- Enhanced progress bars with key-driven linear animations that smoothly restart on auto-cycle or manual navigation (prev/next/dot controls).
- Verified `npm run build` and `npm run lint` pass with 0 errors.

## 2026-09-29 — Realistic Destination Photography & Expanded Locations

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Re-generated realistic, authentic documentary travel photography for:
  - Koh Rong Sanloem (`src/assets/images/common/koh_rong_island.jpg`): real-life Saracen Bay wooden pier, crystal clear shallow turquoise water, white beach, and traditional Khmer longtail boat.
  - Mekong River Sunset (`src/assets/images/common/mekong_river_sunset.jpg`): real-life golden hour wooden longboat, ripples, sugar palms, and riverbank stilt houses.
- Added 3 new authentic Cambodian destinations:
  - Kampot Serenity (`src/assets/images/common/kampot_river.jpg`): emerald-green Preaek Tuek Chhu river, mist rising over Bokor Mountain, and stilt bungalows.
  - Royal Palace Phnom Penh (`src/assets/images/common/royal_palace.jpg`): golden Throne Hall spires, royal courtyard, frangipani blossoms, and clear blue sky.
  - Ta Prohm Temple Ruins (`src/assets/images/common/ta_prohm.jpg`): ancient Spung tree roots entwining carved sandstone doorway corridors in Angkor.
- Updated `src/features/auth/authSlides.js` to 6 authentic slides with synchronized storytelling headlines, gradients, descriptions, and custom atmospheric glows.
- Verified build and lint checks pass cleanly.

## 2026-09-29 — Re-position Slide Controls to Both Sides (Left and Right)

- Agent: Antigravity
- Branch: `feature/admin-foundation-login`
- Moved the previous and next carousel buttons to both sides (left and right):
  - In `TextSlideshow.jsx`: placed the `<` previous button on the left and `>` next button on the right, flanking the centered progress indicators.
  - In `AuthLayout.jsx`: added floating full-screen carousel navigation arrows on the left and right edges with glassmorphism backdrop blur and interactive hover effects for desktop viewports.
- Verified build and lint checks pass cleanly.

## 2026-09-29 — Add Gemini agent handoff

- Agent: Codex
- Branch: `feature/admin-foundation-login`
- Added root `GEMINI.md` with a one-line pointer to `AGENTS.md` and `docs/WORKLOG.md`.
- Commit: `docs: add Gemini agent handoff`.

## 2026-09-29 — Admin overview and core-list review

- Agent: Codex
- Branch: `feature/admin-dashboard` (personal `danishsary8/tour_trip_front_sd811` repository only)
- Built a responsive `/admin` overview with Chart.js revenue and booking-status charts, four KPI cards, recent bookings, popular tours, and operational links. Added shared mock fixtures in `src/mocks/dashboard.js` and `src/mocks/bookings.js`, with a dashboard API adapter and hook.
- Reworked `/admin/bookings` as a searchable, status-filtered, paginated booking desk using the same sample records. CSV export includes all fields, including columns hidden in narrower table layouts. Added the booking API adapter and hook.
- Restyled `/admin/customers` inside the existing admin shell, preserving its teammate-owned customer fixture. Removed the duplicate in-page navbar and non-working buttons, added working search/status filters and a create-customer route link, and added a customer API adapter and hook.
- Updated shared status badges for blocked customers and disabled KPI hover motion under reduced-motion preferences. Added `src/lib/format.js` for consistent date/currency formatting.
- Commits: `9a7e916 feat(dashboard): add mock overview charts and kpis`; `8d3710f feat(admin): align booking and customer tables with shell`.
- Verified production build and lint (no errors; existing warnings remain). Headless browser checks at 375, 768, 1280, and 1440 pixels showed no page overflow or console errors.
- Decisions: the 12 booking rows and three legacy customer rows are labeled preview records; dashboard KPIs represent a larger fictional business and are not calculated from those preview lists. Kept legacy dashboard accessible at `/admin/dashboard/legacy` and did not change masters, reviews, reports or settings pages.
- TODO: migrate `src/data/CustomerData.js` and other legacy fixtures into `src/mocks/` when their owners are ready. Connect customer creation to the directory's future API-backed state; it currently uses its pre-existing local flow. Reports and settings are still placeholders, and other legacy pages need a later consistency pass. Existing lint warnings and the large-bundle build warning remain outside this scope.
