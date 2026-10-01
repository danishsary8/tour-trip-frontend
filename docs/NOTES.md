## 2026-10-01 — Customer and admin logins are now separate

- **What changed:** the photo slideshow sign-in now belongs to customers (`/login`, `/register`, `/forgot-password`). Login is a single step; registration is two steps. `/admin/login` is a plain, dark "admin console" page: password, then the 6-digit code. It has no way to create an account, and "Forgot password" says to contact the system administrator.
- **Try the lockout:** at `/admin/login`, enter `admin@tourtrip.com` with a wrong password 5 times. The form locks and counts down from 15:00, even after a reload. To unlock early, clear the site data in the browser.
- **Try the inactivity logout:** sign in (Admin@123, code 123456), then in DevTools run `localStorage.setItem("tourtrip.admin.idleTimeoutMs", "60000")` and leave the mouse and keyboard alone. About a minute later you're sent back to the login page with "You were logged out due to inactivity." Remove that key to go back to 30 minutes.
- **Last login:** after signing in, the welcome message and the account menu (top right) show the previous sign-in time and browser. The first sign-in in a new browser shows a made-up one.
- Customer demo: `customer@tourtrip.com` / `Customer@123`. The "Dev only" fill buttons only appear when running `npm run dev`.
- **Please decide:**
  - Merge `feature/storefront-booking` first; this branch is built on it.
  - Should the lockout also count wrong 6-digit codes, and should "Remember me" skip the inactivity logout? Right now neither happens.
