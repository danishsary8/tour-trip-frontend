## 2026-10-01 — Customers can now book, pay, cancel and review

- **New:** real checkout at `/booking/:tourId` (details → review & confirm → payment → confirmation with a PDF invoice), and **My Bookings** at `/my-bookings` (filters, details, invoice, cancel with refund, reviews for completed trips). Everything writes to the same data the admin pages read.
- **Test the Cash path:** sign in as `customer@tourtrip.com` / `Customer@123`, open any tour, pick a date, Book now, confirm, choose **Cash**, tick the policy box, Confirm order. In `/admin/bookings` (admin@tourtrip.com / Admin@123 / OTP 123456) it shows **Pending / Unpaid**.
- **Test the card path:** in admin Settings → Payment methods, switch on **Credit Card (Simulation)** and save (it's off by default). Book again, choose Credit Card, Pay now. In admin it shows **Confirmed / Paid**. Turn a method off and it disappears from checkout.
- **Test My Bookings:** cancel the Koh Rong trip (paid, so you see the refund message and it becomes Refunded), cancel the Kulen trip (unpaid, no refund), and review the Angkor trip; it shows as Pending in admin Reviews.
- Admin and storefront can be in different tabs: bookings, reviews and settings made on this branch are saved in the browser. To reset the demo, clear the site data.
- **Please decide before the backend starts:**
  - **Children's price:** checkout charges children the full price, as Tour Detail and the FAQ say, but the old admin sample data uses 60%.
  - **Late cancellations:** inside the 72-hour window, a paid booking can't be cancelled online. Keep that, or allow it with no refund?
  - **EXPLORE10:** should checkout accept promo codes?
- I removed the "Google sign-in coming soon" buttons; add them back once real Google login exists. The social media links still need real addresses.
