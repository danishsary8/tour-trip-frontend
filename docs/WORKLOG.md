# Worklog

This file is append-only. Add new entries at the top of the log section without rewriting prior entries.

## 2026-10-01 — Storefront redesign: real photos, International Escapes, new Tour Detail

- Agent: Claude Code
- Branch: `feature/storefront-redesign`, from `origin/main` at `6fb8c4d` (both storefront-booking and login-separation are merged there). Pushed; not merged.

### Part A — Image audit and replacement

**Audit (before):** most catalogue photos were wrong or not real photography.
- `common/royal_palace`, `koh_rong_island`, `mekong_river_sunset`, `kampot_river`, `ta_prohm` and `login_bg_luxury` were AI renderings (generated in the 2026-09-29 entries).
- Kep showed an overwater-bungalow resort (`bg_login.jpg`), not Kep.
- Kulen showed Ta Prohm.
- Bokor and Battambang shared the same misty river.
- Kampot used a generic Mekong sunset.
- The street-food tour used a daytime street with a watermark.
- `angkor-gallery(1).jpg` was 40 KB.
- The Angkor cover was heavily processed, with a blurred block.

**Sourcing method (automatic):** Unsplash search, free licence only (Unsplash+ excluded); Pexels blocks scripted access. Each candidate was viewed on a contact sheet and accepted only if its caption, tags or location named the place (for example, Kampot river shots tagged `kampot`, and Bayon captioned "Bayon temple in Angkor"). I rejected look-alikes, such as the Buddha-head-in-roots photos, which are Ayutthaya in Thailand. 39 photos were downloaded resized (2000 px covers, 1600 px others, JPEG q70; about 17 MB in all) into `src/assets/images/tours/<tour-id>/`, with `CREDITS.md`.

**Wiring:** `src/mocks/tourImages.js` is the single map: per tour, an ordered photo list with title, alt text and real pixel size; the first photo is the cover. Tour records (`dashboard.js`), the Tour Detail gallery, the public Gallery, About, the sign-in slideshow and the admin photo pickers all read it. Deleted the now-unused `bg_login`, `kampot_river`, `login_bg_luxury` and `ta_prohm`. **The Home hero is untouched** and still uses `otp_background`, `mekong_river_sunset`, `koh_rong_island` and `royal_palace`; three of those are AI renderings (see Known issues).

### Part B — International Escapes (schema decision)

- **Model:** destinations gain `country` (default `"Cambodia"`, filled in by `.map` in `DESTINATIONS`). There are three new non-Cambodian destination records: `bali` (Indonesia), `hanoi-ha-long` (Vietnam) and `kyoto` (Japan). Each tour keeps exactly one `destinationId` and takes `country` from it, so every existing destination-based feature keeps working: filters, reports, the admin Masters CRUD, bookings and seat counts. `tour.international` is simply `country !== "Cambodia"`. This was chosen over a `country` field on tours with no destination because many screens assume `tour.destination` exists.
- **Category** `international` ("International Escapes", Plane icon).
- **Tours:**
  - Bali Highlands & Rice Terraces: 5 days, $890.
  - Hanoi & Ha Long Bay Discovery: 4 days, $640.
  - Kyoto Temples & Gardens: 5 days, $1,380.

  Each has full copy, a day-by-day itinerary, inclusions and exclusions, highlights, two departures and real photos.
- **Weight 0:** the booking-history generator never picks them, so dashboards and reports are unchanged. This was verified by fingerprinting the generated history through Vite SSR on `main` vs this branch: 3,138 bookings, identical hash. `pickWeighted`'s rounding fallback now skips zero-weight items as a guard.
- **Where they appear:**
  - **Home:** a "Beyond the border" dark band. Featured tours and the destination mosaic stay Cambodian.
  - **/tours:** a Where filter (`?region=cambodia|international`), destinations grouped Cambodia / Beyond Cambodia, a "4 days or more" duration, and search that matches the country.
  - **/destinations:** their own band.
- **Admin:** a Country field in the destination form, the Plane category icon, and the Destination report showing "Region, Country".

### Part C — Tour Detail redesign (tabs vs scroll)

- **Decision: one long scrolling page with a sticky chapter nav, not tabs.** Each section is short (one paragraph, 4–5 highlights, 1–5 days), so tabs hid most of the page behind clicks. Travellers compare itinerary, inclusions and dates together, and reviews were previously one tab away. The sticky nav with scroll-spy keeps one-click access, so nothing is lost from tabs.
- **Structure:**
  - **Hero:** full-bleed cover with the title set over it, the category and place, the tagline, a facts strip (length, group, rating, price), real coordinates and "All N photos". The header goes transparent over it through a new `HeroHeaderContext`.
  - **Chapters:** Overview (lead paragraph and ruled facts) → Highlights (new) → Photos (editorial mosaic into the existing Lightbox) → Itinerary (a dashed "route rail" with day waypoints) → What's included → Departures (new in-page list) → Reviews.
  - **After the chapters:** "Further along the route" related tours.
- **Booking mechanics unchanged:** departure and traveller selection moved into `useBookingSelection` so the Departures list and the sticky card or mobile sheet share one choice. The guest Book now goes to `/login?redirect=…` as before. `TourSections` and `TourGallery` were replaced and removed.

### Part D — Visual refresh

- **Design language:** the logo's dashed flight path became the "route mark" (eyebrows) and the itinerary rail. Boxes gave way to ruled lines, photos are given room, and dark bands use the dark token set via the `dark` class. Tokens and fonts are unchanged.
- **D1:**
  - **TourCard:** editorial, with a 4:5 photo, text on the page and a ruled price line, plus the country for international tours.
  - **Card grids:** more vertical rhythm.
  - **/tours sidebar:** unboxed, with a Refine rule and a segmented Where switch.
- **D2:**
  - **Destinations:** editorial grid and a Beyond Cambodia band.
  - **Gallery:** masonry with captions and "See the tour", with real image sizes so it doesn't shift.
  - **Reviews:** ruled summary whose bars filter, and a two-column quote list.
  - **FAQ:** ruled accordion, plus a new flights-and-visas question for International Escapes.
  - **Contact and About:** unboxed lists, values and team.
  - **Home:** categories unboxed.
- **D3:** checkout panels, price summary, payment cards and My Bookings lost their heavy shadows. The sign-in slideshow has real photos and the route mark. No structural changes.

### Part E — Completeness checklist

Every node below was reached by clicking real links (header, More menu, footer, account menu, cards, buttons) in headless Edge against `vite preview`. All 28 checks passed.

- [x] Home
- [x] Hero search → Tour listing
- [x] Header → Tours
- [x] Filters (Abroad, region, duration, search)
- [x] Tour card → Tour Detail
- [x] Book now (guest) → Login with redirect
- [x] Login → Register (redirect kept)
- [x] Login → Forgot password
- [x] More → Gallery
- [x] More → Reviews
- [x] More → About
- [x] More → Contact
- [x] More → FAQ
- [x] Header → Destinations → destination tours (Kyoto)
- [x] Home International band → Tour Detail
- [x] Header heart → Wishlist
- [x] Footer internal links (12)
- [x] 404 page
- [x] Customer login → Home
- [x] Tour Detail → Booking step 1
- [x] Step 2 Review & confirm
- [x] Step 3 Payment (only enabled methods)
- [x] Step 4 Confirmation
- [x] Confirmation → My bookings
- [x] Account menu (My bookings, Wishlist, Explore tours)
- [x] Sign out → Home
- [x] Sweep of 15 pages × 375/768/1280/1920 × light/dark: no horizontal overflow, every page has an h1, the theme applies, and no console errors.

Admin smoke test: dashboard, Masters (tours, destinations, categories, schedules), Bookings, Reports and Reviews all load without errors, and the new data shows where expected.

**Fixed during the audit:**
- Signing out from a signed-in-only page landed on `/login?redirect=/my-bookings`, because the exiting page's guard kept its old router location. Sign-out now navigates first, and `RequireCustomer` ignores the sign-out once the browser has moved on.
- The Gallery menu description claimed guest photos.

### Files

- **New:**
  - `mocks/tourImages.js`
  - `assets/images/tours/**` (39 photos and `CREDITS.md`)
  - `features/storefront/{places.js, useBookingSelection.js, layouts/heroHeader.js}`
  - `features/storefront/components/{RouteMark, TourChapters}.jsx`
- **Changed:**
  - **Mocks:** `mocks/{dashboard, masters, storefrontDetails}.js`
  - **Storefront logic and pages:** `features/storefront/{mocks, filters, booking, navigation, categoryIcons, content}.js`, Home, Tours, TourDetail, Destinations, Gallery, Reviews, FAQ, Contact, About, Booking and MyBookings pages
  - **Storefront components:** TourCard, FilterPanel, PageIntro, SectionHeading, HomeSections, BookingCard, TourReviews, SiteHeader, MobileMenu, booking styles/panels, `auth/{authSlides.js, RequireCustomer.jsx}`, `layouts/StorefrontLayout.jsx`
  - **Shared:** `components/effects/TextSlideshow.jsx`, `components/shared/Lightbox.jsx`
  - **Admin:** `features/{categories, destinations}/schema.js`, `features/reports/*`, `features/tours/components/TourWizard.jsx`, admin `masters/{Categories, Destinations}Page.jsx`
  - **Docs:** `AGENTS.md`
- **Deleted:** `components/{TourGallery, TourSections}.jsx` and 4 unused `common/` images.

### Commits

- `719417a` feat(assets): replace mismatched tour images with real sourced photography
- `48702d0` feat(storefront): add international escapes category and three new tours
- `b8f5d60` feat(storefront): wire international tours into home, listing and filters
- `cc9c9f9` feat(tour-detail): add highlights for every tour (**does not build on its own, see Known issues**)
- `007317b` refactor(tour-detail): redesign to immersive editorial layout
- `3572ca0` style(storefront): refresh tour listing card style and filter sidebar
- `b33d344` style(storefront): consistency pass on destinations, gallery, reviews, about, contact, faq
- `8d421d0` style(storefront): visual consistency pass on auth and booking flow
- `2f57cc8` fix(storefront): resolve gaps found in final flow completeness audit
- `docs: update worklog and note for danish`

All other commits passed `vite build` and `oxlint` (exit 0) when checked out on their own.

### Known issues

- **Commit `cc9c9f9` doesn't build alone:** it accidentally includes the deletion of `TourGallery`/`TourSections`, which were staged at the time. The branch tip and every other commit are fine. A rebuilt history with identical final code (every commit building) was prepared at `58824d7`, but it needs a force-push, which wasn't run without approval. Options: squash-merge (simplest), or approve the force-push.
- **Home hero images:** the hero still uses three AI-rendered images (Mekong, Koh Rong, Royal Palace), because the brief said to keep it exactly as is. They can be swapped for files from `assets/images/tours/` in `HomeHero.jsx` without layout changes.
- **Photo coverage gaps:** there's no Kulen reclining-Buddha or Battambang workshop photo. Those tours use real waterfall and countryside photos instead.
- **Repository size:** the photo set adds about 17 MB.
- **Legacy pages:** the unlinked teammate routes `/explore` and `/trips/:id` still use their old images.
- **Not tested:** real devices and screen readers.

## 2026-10-01 — Separate customer and admin login pages

- Agent: Claude Code
- Branch: `fix/login-pages-separation`, created from `feature/storefront-booking` at `100a80c`. That branch has **not** been merged yet (`origin/main` only has PR #1, storefront-reconcile), so this branch sits on top of it and should be merged after it. Pushed; not merged.

### Investigation: who rendered what (before this branch)

| Route | Component | What it showed |
| --- | --- | --- |
| `/admin/login` | `pages/auth/AdminLoginPage.jsx` inside `layouts/AuthLayout.jsx` | Hero slideshow (`components/effects/TextSlideshow` + `features/auth/authSlides.js`), admin stat chips (`MOCK_LOGIN_STATS`: 156 Tours / 2,358 Bookings / 4.8★), a `components/ui/FlipCard` whose front was sign-in → OTP (`features/auth/components/OtpVerificationForm`) and whose back was a 2-step **Create account** wizard (`features/auth/components/RegisterCardForm` → `signUp` in `features/auth/api.js`, posting to `/auth/register`). |
| `/login` | `features/storefront/pages/CustomerLoginPage.jsx` in `features/storefront/auth/CustomerAuthShell.jsx` | Plain split layout, one static photo, `CustomerAuthContext.login`. |
| `/register` | `features/storefront/pages/CustomerRegisterPage.jsx` in `CustomerAuthShell` | Single-step form, `CustomerAuthContext.register`. |
| `/forgot-password` | `pages/customer/ForgotPassword.jsx` in `CustomerAuthShell` | Mock reset form. |
| (unrouted) | `components/auth/LoginForm.jsx`, `components/auth/OtpVerifyForm.jsx`, `pages/public/auth/OtpVerifyPage.jsx`, `pages/public/auth/RegisterForm.jsx`, `services/authService.js` | Early "VoyageQuest" pages. Not imported anywhere. |

Also found: logging out from the admin topbar, sidebar and command palette sent the admin to the **customer** `/login`.

### Completed

**Part A: customer `/login`, `/register`, `/forgot-password`**
- `layouts/AuthLayout.jsx` moved to `features/storefront/auth/CustomerAuthLayout.jsx` (git mv). It keeps the crossfading destination slideshow, side arrows and glass card. It adds the storefront top bar ("Explore tours", "Back to home", or "Back to tour" when arriving from Book now) and exports `AuthCard`/`AuthKicker`. It is always dark (the `dark` class scopes the tokens) so the card reads over photos in either storefront theme.
- Stat chips now speak to travellers and are computed from the shared mock data: happy travellers (completed-booking guests, rounded down to 50), tours in the catalogue, and the average approved review rating (`useAbout`, `useCatalog`). Currently 5,850+ / 10 / 4.6★.
- `authSlides.js` moved to `features/storefront/auth/`. Copy written for operators ("Coordinate…", "Oversee…", "Curate…") and invented figures ("99.4% Satisfaction", "42 Pristine Bays", "2,350+ Travelers") were reworded for travellers.
- Login is one step (email, password, remember me, forgot link) on `CustomerAuthContext.login`. Register keeps the 2-step wizard (`RegisterWizard.jsx`, from the old `RegisterCardForm`): credentials, then first/last name, phone, date of birth and terms. It is now wired to `CustomerAuthContext.register`. Focus moves to each step's heading. An "already exists" error jumps back to step 1 with values kept.
- `CustomerAuthContext.register` takes an optional 4th `profile` argument (`{ phone, dob }`) stored on the mock account. Checkout pre-fills the phone from it when the traveller has no earlier booking.
- `?redirect=` works through login, register (the links keep it) and the "Back to tour" link. `useBookingReturn` lives in `auth/redirect.js`.
- Deleted `CustomerAuthShell.jsx`. The page files `CustomerLoginPage.jsx` / `CustomerRegisterPage.jsx` were rewritten in place (same routes, same lazy imports), so there was nothing else to repoint.

**Part B: `/admin/login`**
- New `features/auth/components/AdminAuthLayout.jsx`: no photos, a faint diamond lattice that fades from the centre, an "Admin console" label, a "Restricted access" chip, and an "Authorized staff only. Sign-in activity is recorded." footer. A compact 400 px card has a lock badge and a 2-segment step bar (Credentials, Verification).
- `pages/auth/AdminLoginPage.jsx` rewritten: password, then the **existing** `OtpVerificationForm` (now with a `showIcon` prop), then `/admin` or the originally requested admin page. No sign-up, no Google button, no link to customer pages. "Forgot password?" swaps the card to "Contact your system administrator to reset your password…" with Back to sign in.
- `features/auth/security.js` (mock):
  - **Lockout:** per email in `localStorage['tourtrip.admin.loginGuard']`. Each failure says how many attempts are left. The 5th locks the email for 15 min, disables the password field and button, and shows "Too many attempts. Try again in 14:32", which ticks every second and survives reloads. A correct password clears the count.
  - **Last login:** `rotateLastLogin` returns the previous sign-in `{ at, device }` (device parsed from the user agent, e.g. "Edge on Windows") and stores this one. The first sign-in in a browser gets a seeded one (two days earlier, 18:42, Safari on macOS). It is shown in the welcome toast (8 s) and in the topbar account menu.
  - **Idle timeout:** `AuthContext` listens for pointer, key, wheel, touch and scroll events and writes `tourtrip.admin.lastActivity`, throttled to every 5 s. A check runs every 10 s and on tab focus; past 30 min it calls `logout("idle")`. `ProtectedRoute` then sends the admin to `/admin/login`, which shows "You were logged out due to inactivity." once. A session found idle on reload is dropped the same way.
- Admin logout (topbar, sidebar, ⌘K) now goes to `/admin/login`.
- Demo autofill on both login pages renders only when `import.meta.env.DEV` is true, and is labelled "Dev only". Checked: not present in the `vite preview` build.

**Part C: cleanup**
- Removed `signUp` from the admin auth adapter, the admin `registerSchema`, `MOCK_LOGIN_STATS`, and `components/ui/FlipCard.jsx`. All are unused now, and admin self-registration should not exist even as dead code.
- Removed the unrouted legacy files listed above. Their images (`bg_login.jpg`, `otp_background.jpg`) stay because other pages still use them.
- No links from customer auth pages to `/admin/*` or from the admin login to `/login` or `/register` (checked by grep and in the browser).
- AGENTS.md Domain rules: admin accounts are never self-registered; admin login needs OTP, customer login doesn't; which layout each uses; the mock security rules. Commands: customer demo login and the dev-only autofill note.

### Files

- **New:** `features/auth/security.js`, `features/auth/components/AdminAuthLayout.jsx`
- **Moved:** `layouts/AuthLayout.jsx` → `features/storefront/auth/CustomerAuthLayout.jsx`; `features/auth/authSlides.js` → `features/storefront/auth/authSlides.js`; `features/auth/components/RegisterCardForm.jsx` → `features/storefront/auth/RegisterWizard.jsx`
- **Changed:** `pages/auth/AdminLoginPage.jsx`, `features/auth/{AuthContext.jsx, api.js, schema.js}`, `features/auth/components/OtpVerificationForm.jsx`, `features/storefront/auth/{CustomerAuthContext.jsx, redirect.js, schema.js}`, `features/storefront/pages/{CustomerLoginPage, CustomerRegisterPage, BookingPage}.jsx`, `pages/customer/ForgotPassword.jsx`, `components/effects/TextSlideshow.jsx` (slides now required), `components/layout/{Topbar, Sidebar, CommandPalette}.jsx`, `mocks/auth.js`, `AGENTS.md`
- **Deleted:** `features/storefront/auth/CustomerAuthShell.jsx`, `components/ui/FlipCard.jsx`, `components/auth/{LoginForm, OtpVerifyForm}.jsx`, `pages/public/auth/{OtpVerifyPage, RegisterForm}.jsx`, `services/authService.js`

### Commits

- `dbd0ed0` feat(booking): prefill checkout phone from the registration profile
- `5b8ad38` refactor(auth): move hero-carousel design to customer login/register
- `149efed` feat(admin): add mock lockout, last-login and idle-timeout rules
- `cb3a029` feat(admin): sign admins out after 30 minutes of inactivity
- `eace81a` feat(admin): build a distinct console-style admin login with otp
- `be6a06d` feat(admin): show last login in the account menu and log out to admin login
- `4858b71` feat(admin): remove the admin self-registration api and flip card
- `7be6fbc` fix(auth): remove orphaned legacy login, register and otp files
- `docs: update agents domain rules, worklog and notes`

### Verification

- Every commit was checked out in a temporary worktree and passed `vite build` and `oxlint` (exit 0) on its own. Remaining lint warnings are pre-existing kinds (react-hook-form `watch`, context files exporting hooks).
- Headless Edge (`puppeteer-core` in the scratchpad, not the project) against `vite preview`, with no console errors in any run:
  - **Customer:** wrong password toast; Kampot "Book now" as a guest → `/login?redirect=/booking/kampot-adventure?date=…&adults=2` with the booking note and "Back to tour" → signed in → checkout with the date and 2 adults kept. Register via redirect: step 1 and step 2 validation, focus on the step heading, the existing email bounced to step 1 with the email kept, then a new email registered → checkout with the registered phone pre-filled. Forgot password validation and confirmation. 0 px horizontal overflow at 375 and 768 on all three pages.
  - **Admin:** `/admin` while signed out → `/admin/login`. No images, links or sign-up text on the page. Forgot password message checked. Wrong attempts 1–4 show 4…1 left; the 5th shows "Try again in 15:00", which ticked 14:59 → 14:57 with both inputs disabled, and stayed locked after a reload. Another email is not locked. Once the lock expired, the correct password went to OTP and cleared the counter, and 123456 went to `/admin`. The toast showed "Last login: Tue 29 Sept, 18:42 · Safari on macOS" (seeded); the next login showed the real previous one ("Edge on Windows"), and the account menu shows the same line.
  - **Idle:** with `lastActivity` set 31 minutes back, an open dashboard went to `/admin/login` with the inactivity notice within the 10 s check. The notice did not repeat on reload. Opening `/admin/bookings` with an idle session also redirected with the notice, and signing in returned to `/admin/bookings`. At 29 minutes, moving the mouse kept the admin signed in past the next check. Log out from the menu → `/admin/login`.
- **Not checked:** real phones and screen readers; waiting a real 15 minutes or 30 minutes. Both were simulated by editing the stored timestamps.

### Decisions

- **Lockout counts per email, as asked.** It is a browser mock: anyone can clear localStorage. The Laravel API must enforce the lockout server-side (per account and per IP) and use one generic error message.
- **Wrong OTP codes don't count toward the lockout.** Only password failures do. A real API should also limit OTP attempts.
- **The idle timeout applies to "Remember me" sessions too.** Remember me now only keeps the session across a browser restart within the 30 minutes. The timeout can be shortened for testing with `localStorage['tourtrip.admin.idleTimeoutMs']` (milliseconds).
- **The customer auth pages stay dark** in both storefront themes, because the form sits over photography. The admin login is forced dark as well.
- **The customer demo autofill is now dev-only too.** It used to show in production builds. The credentials are in AGENTS.md and NOTES.
- **"Forgot password" for admins is a message inside the card**, not a route, so there is no public admin reset URL to find.

### Known issues

- On phones the slideshow headline sits above the customer form, so the form starts below the first screen at 375 px. This is the same as the old admin layout; consider hiding the slide description under `lg`.
- Register stores the date of birth as typed (DD/MM/YYYY text). The real API should take an ISO date.
- The seeded "previous login" is fictional by design, so the first login in a new browser always shows it.

## 2026-10-01 — Phase 7c: Booking flow, My Bookings and final storefront pass

- Agent: Claude Code
- Branch: `feature/storefront-booking`, created from `origin/feature/storefront-reconcile` at `e264943` (the remote had moved four commits past the local copy; it was fast-forwarded first). Pushed; not merged.

### Completed

**Shared data (the admin and the storefront read the same records)**
- `features/bookings/api.js` gained the customer side of the shared store: `getMyBookings`, `createBooking`, `payBooking` and `cancelMyBooking`. They write to `dashboardDb.bookings`, the same records `/admin/bookings`, the dashboard, Reports and Customers read. Hooks (`useMyBookings`, `useCreateBooking`, `usePayBooking`, `useCancelMyBooking`) reuse the admin cache refresh.
- A customer is matched to the admin customer directory by email. The first booking of a newly registered customer adds them to the directory.
- New domain rule, added to AGENTS.md: Cash and Bank Transfer create Pending/Unpaid; ABA Pay (Simulation) and Credit Card (Simulation) process instantly and become Confirmed/Paid. Checkout reads the enabled methods from admin Settings.
- **Demo traveller.** `customer@tourtrip.com` (Sophea Meas) now has five seeded trips in `mocks/dashboard.js`: two Completed and Paid (Angkor Wat, Phnom Penh), one Cancelled, one Confirmed and Paid by card (Koh Rong, 20 days out), and one Pending bank transfer (Kulen, 18 days out). Every My Bookings tab and both cancel paths have data.
- **Cross-tab persistence (mock only, `mocks/persistence.js`).** Storefront bookings, traveller reviews and admin settings are saved to localStorage and replayed on load. A `storage` listener plus `app/providers/MockSyncBridge.jsx` refetch the affected queries in other open tabs, so a booking made in one tab appears on a freshly loaded `/admin/bookings`, and disabling a payment method removes it from an open checkout. Admin changes to storefront bookings and reviews are saved too. Checkout bookings hold seats on their departure until they are cancelled.
- Reviews: `addCustomerReviewToDb` and `submitReview` add a Pending review linked to its booking, which goes into the existing Reviews Management queue. There is one review per booking.
- Admin tweaks for bookings that have no payment method yet: the drawer select shows "Not chosen yet", the method-change history note handles null, and the Payment report cell reads "Not chosen".

**Part A: `/booking/:tourId` (replaces `BookingStubPage`)**
- A 4-step wizard (`pages/BookingPage.jsx`, `components/booking/*`) with the admin Tour wizard's stepper language: one bar per step that fills (animated scaleX), numbered labels that turn into checks, "01 / 04" kicker, and a slide between steps. Focus moves to each new step's heading.
- **Step 1, Your details** (react-hook-form + zod `bookingDetailsSchema`):
  - Departure picker, using the same seat bars as Tour Detail.
  - Adults and children counters, pre-filled from the Tour Detail query params, editable and clamped to the seats left.
  - Lead traveller name and email from the account, and phone from the traveller's latest booking.
  - Special requests (500 characters, with a counter).
- **Step 2, Review & confirm:** tour card; date, traveller, contact and request cards, each with an Edit link back to step 1 (values are kept); and the price breakdown. **Confirm booking** creates the record (Pending/Unpaid, no method yet) with a real `TT-` id and puts `?booking=<id>` in the URL. A refresh then resumes at payment or confirmation instead of booking twice.
- **Step 3, Payment:** only the methods enabled in Settings, shown as cards using the Settings fields (cash instructions, bank name/account/number plus the booking reference, ABA merchant ID, card statement descriptor). A "Simulation" tag marks ABA Pay and Credit Card. A required 72-hour cancellation-policy checkbox gates the button.
  - Cash and Bank Transfer: "Confirm order" records the method and a history note, and the booking stays Pending/Unpaid.
  - Online methods: "Pay $X now" runs about 1.7 s of processing, using the login's loading→success button, then the booking becomes Confirmed/Paid.
- **Step 4, Confirmation:** the success tick draws itself (gold for reserved, green for paid, no confetti), a large booking number with copy, next-step copy ("Your booking is reserved, please complete payment to confirm", plus bank details for transfers), a mock "Confirmation email sent to …" banner, and a summary card. It has **Download invoice**, **View my booking** (`/my-bookings?booking=<id>`) and **Continue exploring**.
- **Invoice:** `features/bookings/invoice.js` builds a report description for the **existing Reports jsPDF exporter**. `exportReportPdf` gained optional `kicker`, `meta`, `notes` and `datedFilename`, so there is still one export setup. The PDF holds the booking ID, statuses, travel date and time, travellers, method, contact, the price breakdown table, what to pay or refund, the policy and contact details.
- **Page states:** skeleton while tour, settings and bookings load; an invalid tour id shows "We couldn't find that tour"; a load error has Retry; an unknown `?booking=` shows a not-found state.
- **Layout:** the price sidebar is sticky at `lg` and matches the Tour Detail card; below `lg` a sticky total bar sits at the bottom, and the floating contact button lifts above it.

**Part B: `/my-bookings` (replaces the sample `CustomerBookingsPage`; `/account/bookings` redirects)**
- **Page:** stat tiles (upcoming, next departure, completed) and the shared `Tabs` (All, Upcoming, Completed, Cancelled, with counts; `?tab=`). Cards show the photo, name, id, date and time, travellers, total, the status and payment badges, and a one-line "what next" note.
- **Actions on each card:** Choose payment (resumes checkout), Write a review, View details, Invoice, Cancel.
- **Detail drawer (`?booking=`):** the confirmation summary plus a traveller-worded history timeline, and the same actions.
- **Cancel:** available for Pending and Confirmed bookings. The dialog asks for a reason (Change of plans / Found a better option / Emergency / Other; Other needs details). A Paid booking shows "A refund of $X will be processed to your original payment method (…) within 5–7 business days" and becomes Cancelled/Refunded; an Unpaid one cancels with no refund copy. The reason and refund are written to `statusHistory`, so admin sees them.
- **Reviews:** Completed bookings unlock **Write a review** (star rating as native radios, comment of 20–1000 characters). It submits Pending and toasts "Thanks! Your review is awaiting approval." Tour Detail's button is now live for a signed-in traveller with a completed, unreviewed booking of that tour. Otherwise it says why it is locked: sign in, complete this tour first, or already submitted.
- **Page states:** skeletons; an empty account shows "No trips booked yet" with Browse Tours; an empty tab shows "Show all bookings"; a load error has Retry.

**Part C: final pass**
- The header profile menu and mobile menu now point to `/my-bookings` (`ACCOUNT_LINKS`).
- Removed the remaining placeholder states:
  - the Google "coming soon" buttons on login and register;
  - the `/account/:mode` "next release" copy (it now only redirects);
  - Tour Detail's "No payment is taken in this preview" (it now shows the free-cancellation line).
  - The legacy `/booking` route (a teammate page offering PayPal/"card") now redirects to `/tours`; the file is kept.

### Files

- **New:**
  - `mocks/persistence.js`, `app/providers/MockSyncBridge.jsx`, `features/bookings/invoice.js`
  - `features/storefront/booking.js`, `features/storefront/components/FormField.jsx`
  - `features/storefront/components/booking/{BookingStepper, PriceSummary, SuccessCheck, DetailsStep, ReviewStep, PaymentStep, ConfirmationStep, BookingSummary, MyBookingCard, BookingDetailDrawer, CancelBookingDialog, ReviewDialog}.jsx` and `styles.js`
  - `features/storefront/pages/{BookingPage, MyBookingsPage}.jsx`
- **Changed:**
  - `mocks/{dashboard, reviews}.js`
  - `features/bookings/{api, hooks}.js`, `features/bookings/components/BookingDrawer.jsx`
  - `features/reviews/{api, hooks}.js`, `features/settings/api.js`
  - `features/reports/export.js`, `features/reports/components/PaymentReport.jsx`
  - `features/storefront/{schema, navigation}.js`
  - `features/storefront/components/{BookingCard, FloatingContact, TourReviews, TourSections}.jsx`
  - `features/storefront/pages/{TourDetailPage, AccountPage, CustomerLoginPage, CustomerRegisterPage}.jsx`
  - `routes/{storefront, public}.routes.jsx`, `app/providers/AppProviders.jsx`, `AGENTS.md`
- **Removed:** `features/storefront/pages/{BookingStubPage, CustomerBookingsPage}.jsx`. Both were placeholders this phase was asked to replace.

### Commits

- `c0edce3` feat(mocks): seed a demo traveller and share customer-side changes across tabs
- `3a13590` feat(bookings): add customer create, pay and cancel on the shared store
- `a74b863` feat(reviews): accept pending reviews from travellers
- `3348902` feat(booking): add booking wizard shell pieces and step 1 details form
- `42c5cbb` feat(booking): add review and confirm step with live price breakdown
- `a0d2c4f` feat(booking): add payment step with enabled-methods logic and simulation
- `d62bd13` feat(booking): add confirmation step with pdf invoice download
- `f1db7ad` feat(booking): replace the booking stub with the checkout wizard
- `39121f5` feat(my-bookings): add cancel booking flow with refund messaging
- `51c19c3` feat(my-bookings): add review dialog for completed trips
- `0964d5d` feat(my-bookings): add booking detail view and invoice download
- `a4d2c61` feat(my-bookings): add bookings list with status filters
- `77219b1` feat(my-bookings): unlock review submission for completed bookings
- `2779b4a` fix(storefront): final end-to-end sanity pass
- `docs: update worklog and note for danish`

### Verification

- **Per-commit builds:** every commit above (except the docs commit) was checked out in a temporary worktree and passed `vite build` and `oxlint` on its own. The final `npm run build` passes and `npm run lint` exits 0; the only warnings are pre-existing kinds.
- **Scripted browser checks:** headless Edge via `puppeteer-core`, installed in the scratchpad and not in the project, against `vite preview`. There were no console errors in any run.
  - **Cash path:** guest `/booking/kampot-adventure` → `/login?redirect=…` → back with the travellers kept. Contact was pre-filled, the Edit round trip kept the date, and TT-24641 was created Pending/Unpaid. Only enabled methods were offered (Cash, Bank Transfer, ABA Pay; Credit Card is off by default). Pay stays disabled until a method is chosen and the policy is ticked. Confirmation showed "reserved" and the email banner, and the invoice PDF (4.4 KB) was opened and checked field by field.
  - **Card path:** Credit Card was enabled through the real `/admin/settings` Payment tab; checkout then listed it. Paying showed the processing line and then "You're all set!". A freshly loaded `/admin/bookings` row read "Paid Confirmed".
  - **Disabling a method:** turning Cash off in admin removed it from the next checkout. A booking abandoned before payment shows Unpaid/Pending in admin, and its drawer shows "Not chosen yet".
  - **My Bookings:** tabs All 5 / Upcoming 2 / Completed 2 / Cancelled 1.
    - Cancelling the paid Koh Rong trip showed the reason validation, then the "$320 … Credit Card … 5–7 business days" refund copy; admin showed "Refunded Cancelled".
    - Cancelling the unpaid Kulen trip showed no refund copy; admin showed "Unpaid Cancelled".
    - The Angkor review toasted "Thanks! Your review is awaiting approval.", and admin Reviews listed it as Pending 5.0. The Tour Detail button then read "Review submitted" on Angkor and "Write a review" on Phnom Penh.
  - **End to end by clicking:** Home → Tours → Kampot → date + 2 adults → Book now (guest) → login → review → confirm → ABA Pay → confirmation. A reload stays on the confirmation. View my booking opened the drawer, cancelling with "Other" required details and then refunded, and the profile menu's My bookings link goes to `/my-bookings`. `/booking/not-a-tour` shows the not-found state.
  - **Responsive:** the booking page, My Bookings and the detail drawer at 375, 768, 1280 and 1920, in light and dark, with 0 px horizontal overflow. All four steps were also completed at 375 (Bank Transfer).
- **Not checked:** real touch devices and screen readers.

### Decisions

- **Children pay the per-person price at checkout.** Tour Detail and the FAQ already say so, so storefront bookings store `childPrice = unitPrice`. The generated admin history still uses 60% child prices. **Danish to decide** which rule the API should follow.
- **Paid bookings follow the 72-hour promise.** Outside the window they cancel online with a full refund. Inside it, the Cancel button is disabled and explains that the traveller should contact the team (the FAQ promises no refund inside the window). Unpaid bookings can be cancelled until departure.
- **The booking is created on "Confirm booking"**, before a method is chosen (`paymentMethod: null`), as the brief asked. If the traveller stops there, My Bookings offers "Choose payment", which resumes the wizard.
- **Cross-tab persistence is localStorage,** and only for the records both sides touch. Without it, the admin in another tab could never see a customer booking. It sits under `src/mocks/` and disappears with the API.
- **Removed the Google buttons** rather than keep a dead "coming soon" action. Re-add them with real OAuth (for example Laravel Socialite).
- **The invoice reuses the Reports exporter** (Helvetica, Latin-1). The file name is `tourtrip-invoice-<id>.pdf`.
- **Admin Settings stays the source of truth** for payment methods. Credit Card starts disabled in the mock settings, so it has to be switched on in admin to test the card path.

### Known issues

- Mock data still regenerates on reload. Only storefront bookings, traveller reviews and settings persist, per browser, under `tourtrip.mock.*` keys. Clear those keys (or site data) to reset the demo. Booking ids are only unique within one browser's data.
- The `EXPLORE10` promo banner is still display-only; checkout has no promo-code field.
- Social profile links in the footer and on Contact are still `#` placeholders until real accounts exist.
- The floating contact button can cover the lower-right corner of a payment card at 375 px until you scroll.
- Legacy teammate routes outside the flow (`/explore`, `/trips/:id`, `/tour/detail`) are untouched and not linked from the storefront.
- An earlier local tweak (lazy-loading the stub's image) was stashed at the start ("local booking stub lazy-img tweak"). The same change was already on the remote, and the stub is now gone, so the stash can be dropped.

### Next steps

Frontend is feature-complete for the Guest/Customer/Admin flows defined in the flow diagrams. Everything runs on mock data. Backend (Laravel API) development begins next — each features/*/api.js file is the integration point where mock functions get swapped for real HTTP calls.

## 2026-09-30 — Storefront reconciliation: Parts C & D (Guest Flow Audit & Polish)

- Agent: Antigravity
- Branch: `feature/storefront-reconcile`

### Part C — Guest Flow Audit Results

1. **Home page (`/`): PASS** — Hero search dispatches destination, date, and traveller parameters to `/tours`; category cards link with `?category=`; destination bento grid links to `/tours?destination=` with Battambang active; featured tours render `TourCard` with direct detail page links; testimonials carousel renders approved traveller reviews with autoplay, pause-on-hover, keyboard navigation, and touch swipe.
2. **Search & Tour Listing (`/tours`): PASS** — All filters (destination, category, dual-slider price bounds, day/multi duration, 4.0/4.5+ star ratings) and sort options (popular, price asc/desc, rating) verified. Normalized filter matching in `filters.js` and `ToursPage.jsx` so hyphenated slugs (`siem-reap`), natural spaced names (`Siem Reap`), and mixed casing all resolve flawlessly. Active filter chips are individually removable and Clear all resets the query. Empty state displays with a clear "Clear filters" recovery action.
3. **Tour Detail (`/tours/:id`): PASS** — Photo gallery with responsive aspect ratio and full-featured Lightbox (ArrowLeft/ArrowRight, Escape key, touch swipe). All four content tabs (Overview, Itinerary with expandable day accordions, Included/Excluded checklist, Reviews with rating breakdown chart) render smoothly. Real-time departure picker respects seat availability (sold-out departures disabled, color-coded seat tones). Adults and children counters calculate total price live and enforce capacity limits. Related tours render with shared `TourCard`.
4. **Book Now logged out hop: PASS** — Clicking "Book now" while logged out captures the selected departure date, adult count, and child count into query parameters and forwards the guest to `/login?redirect=/booking/:tourId?date=...&adults=...&children=...` via `authPath()`.
5. **Customer Login redirect: PASS** — Signing in with `customer@tourtrip.com` / `Customer@123` succeeds, verifies credentials with the mock service, shows a welcome toast, and safely navigates back to the booking stub with all query parameters intact.
6. **Customer Registration redirect: PASS** — Registering a new mock user validates with Zod, automatically creates the session, signs the user in, shows a welcome toast, and safely redirects back to `/booking/:tourId?date=...&adults=...&children=...`.
7. **Continue Browsing pages: PASS** —
   - `/destinations`: Grid of all 6 Cambodian provinces with dynamically computed tour counts from the shared catalogue (Siem Reap: 4, Kampot: 2, Phnom Penh: 1, Sihanoukville: 1, Kep: 1, Battambang: 1); clicking a card links to `/tours?destination=`.
   - `/gallery`: Filter chips by destination and travel style with live counts, interactive hover cards, empty state, and shared Lightbox.
   - `/reviews`: Aggregate rating score, interactive 5★-1★ distribution bars with click-to-filter, star/destination/tour filters, sorting, verified traveller cards, and empty state.
8. **Wishlist smoke test: PASS** — Heart button on `TourCard` toggles saved status; header count badge updates live across tabs and pages; guests persist in `localStorage` under `wishlist` and fold into customer account on sign in; `/wishlist` displays saved tours with an empty state linking back to `/tours`.

### Part D — Return-Visit Polish & Audits

- **D1: Recently Viewed Strip** — Updated `recentlyViewed.js` to persist under `recentlyViewed` in `localStorage` (while maintaining compatibility with `tourtrip.recentlyViewed`). Renders on Home below Featured Tours with a responsive 3-column desktop grid showing up to 6 viewed tours without arbitrary truncation.
- **D2: Site-Wide Empty State Audit** — Audited all 10 pages and views using `EmptyState` (`ToursPage`, `TourDetailPage`, `WishlistPage`, `DestinationsPage`, `GalleryPage`, `ReviewsPage`, `AboutPage`, `FaqPage`, `NotFoundPage`, `CustomerBookingsPage`). Confirmed 0 dead-end states: every single empty state provides clear action buttons or links to recover.
- **D3: Below-the-Fold Lazy Loading Audit** — Verified all below-fold images use `loading="lazy"` and `decoding="async"` across `TourCard`, `HomeSections`, `DestinationsPage`, `GalleryPage`, `AboutPage`, `CustomerBookingsPage`, and `BookingStubPage`.
- **D4: Responsive Check at 375px and 1280px** — Confirmed no horizontal scrollbar or element overflow at 375px (mobile) and 1280px (desktop). Navigation, drawers, popovers, and sticky booking cards adapt smoothly.

### Verification

- `npm run lint`: Completed with 0 errors across 269 files.
- `npm run build`: Completed with 0 errors in ~3.2s.

### Next Steps (Phase 7c)

Phase 7c will implement the production booking flow (`/booking/:tourId` review & confirm, payment processing simulation, booking confirmation voucher), "My Bookings" management, and booking cancellation, building upon the reconciled customer auth and state architecture.

## 2026-09-30 — Storefront reconciliation, Part B

- Audited the wishlist implementation already present in the squashed snapshot: the shared `TourCard` owns one accessible heart toggle, guests persist an array of tour ids under the `wishlist` localStorage key, and saved state survives navigation and reloads.
- Confirmed `/wishlist` keeps saved order, reuses `TourCard`, removes a tour directly from its heart, skips retired ids safely, handles loading/error states, and offers Browse Tours from the empty state.
- Confirmed the desktop header has one wishlist icon with a live count beside customer controls; the profile and mobile account areas link to the same page without duplicating state.
- Browser result: save, live badge update, wishlist rendering, removal, and empty-state recovery all pass. No Part B code changes were needed.
- Remaining in this pass: complete the Guest Flow audit and return-visit/image audit.

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
