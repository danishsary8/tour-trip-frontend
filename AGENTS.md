# TourTrip Agent Guide

## Project summary

TourTrip is a React frontend for a Cambodia tour-booking system with Guest, Customer, and Admin roles. The Admin experience is being built first. A Laravel REST API will be added later; until then, all application data must come from mock fixtures. Keep API boundaries inside `src/features/<domain>/api.js` so connecting the backend does not require rewriting components.

Before starting work, read `docs/WORKLOG.md`. After finishing, append a dated entry describing changes, decisions, commits, known issues, and next steps. The worklog is append-only.

## Technology

- React 19 and Vite 8: application runtime and build tooling.
- React Router 7: routing and protected layouts.
- Tailwind CSS 4: styling through semantic tokens in `src/styles/tokens.css`.
- Framer Motion: page, layout, and micro-interaction animation.
- TanStack Query: future server-state and request caching.
- React Hook Form, Zod, and resolvers: forms and validation.
- Axios: the shared client in `src/lib/axios.js`.
- Sonner: application toasts; mount the toaster only in app providers.
- Lucide React: the standard icon library for new code. Do not add new React Icons usage.
- Chart.js with react-chartjs-2: the one approved chart library. Use the global defaults registered in `src/lib/chart.js`.
- clsx, tailwind-merge, and class-variance-authority: component class composition and variants.

The codebase is plain JavaScript/JSX. Do not introduce TypeScript without owner approval.

## Structure

```text
src/
  app/providers/          Global providers only
  components/ui/          Reusable design-system primitives
  components/effects/     Reusable visual/motion effects
  components/layout/      Admin shell: sidebar, topbar, command palette, notifications,
                          route progress, nav config (navigation.js), shell context
  components/shared/      Page-level building blocks: PageHeader, StatCard, EmptyState,
                          Skeleton, ConfirmDialog, StatusBadge, ComingSoon
  features/dashboard/     Dashboard api/hooks, range config, widget state and components/
  features/reports/       Report data (reuses dashboard range helpers), Excel/PDF export, report components
  features/settings/      Mock settings store api/hooks/schema and the settings forms
  features/storefront/    Customer-facing site (public shell, pages and components):
    layouts/              StorefrontLayout (header, footer, transitions; light-first theme)
    pages/                Storefront route pages (Home, Tours, Destinations, Gallery, Reviews, About, Contact, FAQ, 404)
    components/           TourCard (the only tour card), Reveal, Breadcrumbs, PageIntro, hero, sections, filters
    mocks.js              Public view of the shared catalogue — never a second tour list
    api.js, hooks.js       Public catalogue + testimonials (TanStack Query)
    filters.js             URL-driven /tours filters and sorting
    content.js             Static site copy (story, FAQ, contact, trust, promo); reads settings/domain constants
    schema.js              Storefront form schemas (contact)
    motion.js              Slower, cinematic reveal presets built on motionEase
  features/<domain>/      Domain code
    components/           Domain-specific UI
    api.js                 Mock/real API switch boundary
    hooks.js               Domain hooks when needed
    schema.js              Validation schemas
  layouts/                 Route layouts
  lib/                     Shared clients and configuration
  mocks/                   Canonical home for mock fixtures
  pages/                   Route-level composition
  routes/                  Route definitions and guards
  styles/                  Global tokens and theme styles
```

Place new mock data in `src/mocks/`; do not add feature fixtures beside pages. Do not move teammate-owned legacy mock files during unrelated work. Record migrations in the worklog.

## Design system

The visual direction is “Modern Khmer”: Angkor stone, Mekong water, and golden-hour light expressed through glass, depth, restrained texture, and purposeful movement. Use semantic colors and radii from `src/styles/tokens.css`, never duplicate token hex values in feature code unless an illustration specifically requires it.

- Display: Bricolage Grotesque; UI: Inter; Khmer fallback: Kantumruy Pro.
- Admin defaults to dark and supports persistent light/dark theme through `ThemeProvider`.
- Use shared variants from `src/lib/motion.js` and primitives from `src/components/ui/`.
- Every interactive element needs clear hover, focus-visible, active, and disabled states.
- Animate primarily with transform and opacity. Typical duration is 150–350 ms with `[0.22, 1, 0.36, 1]` easing.
- Respect `prefers-reduced-motion`; meaningful functionality must never depend on animation.
- Every `/admin` page renders inside `AdminLayout`. Start pages with `PageHeader`, add new nav entries in `src/components/layout/navigation.js`, and use `ComingSoon` for routes without a page yet. Review components at `/admin/_kit` (dev only).
- For status text on tinted backgrounds use the `*-ink` colours (`text-primary-ink`, `text-accent-ink`, …) from `tokens.css`; they keep AA contrast in both themes.
- Preserve AA contrast, keyboard operation, accessible names, and inline error announcements.
- Avoid generic dashboard templates. Design should feel specific to Cambodia and TourTrip.
- Storefront (public site) is deliberately different from admin: light-first, photo-led, spacious, big display headlines, 300–500 ms reveal-on-scroll motion. It shares tokens, fonts and generic `components/ui` pieces but never AdminLayout or admin-only components. Theme preference is stored per area (`tourtrip.theme` admin, dark default; `tourtrip.theme.storefront`, light default); layouts call `useThemeScope`.
- Charts: use the single Chart.js setup in `src/lib/chart.js` (`useChartTheme`, `gradientFill`, `tooltipPreset`, `chartAnimation`, crosshair/center-text/reveal plugins). Read colours from tokens, never hard-code them, and update chart data in place instead of remounting.

## Admin flow

Login → Dashboard → Manage Masters → Manage Bookings → Manage Customers → Reports → Reviews Management → System Settings.

- Dashboard: overview, Total Tours, Total Bookings, Total Customers, Total Income, charts and graphs.
- Manage Masters: Categories, Destinations, Guides, Tours, Tour Schedules.
- Manage Bookings: view, confirm/reject, complete, cancel, update payment.
- Manage Customers: view, search, activate/deactivate.
- Reports: Monthly Income, Popular Tours, Booking Status, Destination Report, Payment Report, Export Excel/PDF.
- Reviews: view, approve, hide/delete.
- Settings: General, Payment Methods, Email, Other.

The sidebar, breadcrumbs and command palette follow this order (`src/components/layout/navigation.js`).

## Domain rules

- Booking status: `Pending`, `Confirmed`, `Completed`, `Cancelled`. "Reject" is `Cancelled` with reason `Rejected by admin`.
- Payment status: `Unpaid`, `Paid`, `Refunded`.
- Payment methods (exactly): `Cash`, `Bank Transfer`, `ABA Pay (Simulation)`, `Credit Card (Simulation)`.
- There is no standalone Payments page. Payments live in Bookings and Reports.
- Currency: USD (`formatUsd` in `src/lib/format.js`).
- Mock income is counted on the day money is received: online methods at booking time, cash on the tour day.

## Git workflow

- Fetch before branching. Branch from `origin/develop` when it exists, otherwise `origin/main`.
- Use focused feature branches such as `feature/admin-foundation-login`.
- Never push directly to `main` or `develop`.
- Never merge without the repository owner's explicit approval.
- Make small, focused commits with lowercase imperative Conventional Commit messages, for example:
  - `feat(auth): add mock otp verification`
  - `fix(routes): preserve requested admin destination`
  - `docs: record dashboard handoff`
- Do not delete or rewrite teammate work. When a move is necessary, update imports and compatibility routes. Leave a TODO and worklog note when intent is unclear.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

Copy `.env.example` to `.env` for local configuration. Mock admin credentials:

```text
Email: admin@tourtrip.com
Password: Admin@123
OTP: 123456
```
