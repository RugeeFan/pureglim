# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0.0] - 2026-05-03

### Added
- **Unified referral auth** — `/referral/login` now handles both new and returning users via a single `mode=upsert` OTP flow; new users are registered automatically, no separate register page needed
- **PayID payment option** — referrers can now save a PayID (mobile or email) instead of BSB/account; saving one type automatically clears the other
- **Social sharing buttons** — WhatsApp deep link, Facebook share dialog, and Instagram story QR code download on the referral share card
- **Dashboard 3-state onboarding** — no-code step card, soft payment-details nudge once code exists, earnings pending banner when commission is owed
- **Booking status stepper** (admin detail page) — visual step indicator replacing the previous arrow-button nav
- **Status tooltips** on all booking status badges (both card and table view)

### Changed
- `/referral/register` redirects to `/referral/login` — single entry point for all auth
- Admin list page booking advance uses a labeled pill button instead of arrow icons
- Admin login redirect now uses `window.location.href` (hard navigation) to ensure auth cookie is included after login

### Fixed
- Admin login stuck on login form after successful auth (router.push cached redirect race condition)
- Table-view booking status badge was missing the `title` tooltip attribute

