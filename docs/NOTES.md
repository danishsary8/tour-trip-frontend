## 2026-09-30 — Storefront guest flow and polish audit complete

- Guest flow verified end-to-end: hero search, tour filters, detail tabs, departures, booking redirect, customer login/register with preserved parameters, continue browsing pages, and wishlist all pass.
- Filter matching in `filters.js` now handles both hyphenated slugs (`siem-reap`) and natural names (`Siem Reap`) cleanly.
- "Recently viewed" strip is wired to `localStorage.getItem("recentlyViewed")` and renders up to 6 tours on Home below Featured Tours.
- Site-wide empty state audit passed: all 10 empty and error views have active recovery buttons or links (0 dead ends).
- All below-the-fold images across cards, galleries, destinations, and booking stubs use `loading="lazy"` and `decoding="async"`.
- Verified at 375px and 1280px with no horizontal overflow. All commits build and lint with 0 errors on `feature/storefront-reconcile`.
- Ready for Phase 7c: complete booking checkout stepper, payment simulation, and My Bookings.
