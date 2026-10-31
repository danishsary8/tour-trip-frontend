## 2026-10-01 — Storefront redesign: real photos, International Escapes, new Tour Detail

- **Photos:** every tour now has 2–4 real photos of the actual place, downloaded from Unsplash and checked by hand (credits in `src/assets/images/tours/CREDITS.md`). Nothing for you to drop in. The Home hero is unchanged as asked, but three of its images are AI renderings; swap them in `HomeHero.jsx` if you like.
- **New:** three "International Escapes" tours (Bali, Hanoi & Ha Long Bay, Kyoto) with their own band on Home, a Where filter on /tours, and a Beyond Cambodia section on Destinations. Dashboard and report numbers are unchanged.
- **Tour Detail is a different page now:** a big photo hero, then one scrolling page with a section bar (Overview, Highlights, Photos, Itinerary, What's included, Departures, Reviews). Booking works as before.
- **Try:** open `/tours/kyoto-temples-gardens`, pick a date in Departures (the booking card follows), book it as `customer@tourtrip.com` / `Customer@123`; then Gallery, Reviews and Destinations to see the new look.
- **Please decide:** one commit in the middle of this branch (`cc9c9f9`) doesn't build on its own. The final code is fine. Either squash-merge the branch, or let me force-push the repaired history I prepared.
