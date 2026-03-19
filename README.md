# BollyFit Dance Studio

Modern Next.js studio site with a polished public marketing experience, class inquiry forms, and a role-aware dashboard.

## Current behavior

- Public pages:
  - `/`
  - `/classes`
  - `/schedule`
  - `/instructors`
  - `/events`
  - `/gallery`
  - `/about`
  - `/booking`
  - `/contact`
- Account pages:
  - `/login`
  - `/logout`
- Admin page:
  - `/admin`

The app now supports two modes:

1. Firebase mode
   - Real email/password sign in and account creation
   - Firestore-backed content, leads, and uploaded images
   - Admin access based on an approved Firestore record
2. Preview fallback mode
   - Used automatically when Firebase env vars are missing
   - Keeps the old browser-only preview working for local design/testing

## Firebase architecture

This implementation uses Firebase through the REST APIs instead of the Firebase JS SDK. That keeps the code deployable in the current repo without adding packages.

Collections and documents:

- `siteContent/default`
  - Main editable studio content object
- `assets/{assetId}`
  - Uploaded image payloads stored as compressed data URLs
- `registrations/{registrationId}`
  - Booking form submissions
- `contactMessages/{messageId}`
  - Contact form submissions
- `users/{uid}`
  - Basic account profile and last login tracking
- `adminEmails/{email}`
  - Admin allowlist. If the signed-in email has a document here, the UI unlocks admin tools

## Setup

1. Create a Firebase project.
2. Enable Email/Password under Firebase Authentication.
3. Create a Firestore database in production mode.
4. Apply the rules from [firebase/firestore.rules](/Users/johan_ps/Documents/Automation/bds/firebase/firestore.rules).
5. Copy [.env.example](/Users/johan_ps/Documents/Automation/bds/.env.example) to `.env.local`.
6. Fill in:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
7. Start the app and open `/login`.
8. Create the first account from the login page or from Firebase Auth.
9. In Firestore, add a document in `adminEmails` using the exact email address as the document ID.
10. Put `{ "active": true }` in that document.

Once that document exists, the next sign-in for that email will unlock `/admin`.

## Preview fallback

If Firebase is not configured, the app falls back to the old local preview mode.

Preview admin credentials:

- Email: `admin@bollyfitstudio.com`
- Password: `bollyfit-preview`

In preview mode, content edits, uploads, registrations, and messages are stored only in the current browser.

## Notes

- Uploaded images are compressed in the browser before being written to Firestore.
- Sample dance imagery is still used throughout the seed content.
- There is a legacy SQL schema under `db/` that is not connected to this site flow.
- Because this shell still has no `node` or package manager binaries available, build verification was not possible here.
