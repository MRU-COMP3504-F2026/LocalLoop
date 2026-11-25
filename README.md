# LocalLoop

LocalLoop is a Next.js app for neighbourhood shops. An owner can sign up, fill in a profile, and list products or services. A shopper can sign up and look through the public shop pages. Accounts, shops, and listings are stored in Supabase. The site is not hosted, so you run it locally. The repo is private.

**Release:** [v0.1.0-beta](https://github.com/MRU-COMP3504-F2026/LocalLoop/releases/tag/v0.1.0-beta)

**Communication channel:** https://discord.gg/PJrHRZRQz

**Shared Google folder:** https://drive.google.com/drive/u/0/folders/17E4nJSDre1vpC-BMe_WVjNl36kV6EfT5

**Project members:**
- Sayuj Mali
- Josh Nacionales
- Steven On
- Seila Kennedy
- Daniel Anzola

Guides: [docs/UserManual.md](docs/UserManual.md) and [docs/DeveloperGuide.md](docs/DeveloperGuide.md).

## Setup

Node.js 20 or newer, and npm.

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the shared Supabase URL and publishable (or anon) key. Ask a teammate for the values. Don't commit `.env.local`. Automated tests still run without those keys.

## Run

```bash
npm run dev
```

Open http://localhost:3000.

## Test

```bash
npm test
```

Jest runs once and exits. `npm run test:coverage` prints a coverage report.

## Build

```bash
npm run build
npm start
```

`npm start` serves the production build at http://localhost:3000. Stop the dev server first if that port is already in use.

## What works

With a filled-in `.env.local`, accounts, shops, products, services, and photos are saved in Supabase. A refresh does not clear them.

- Home page, business signup, and shopper signup
- Sign in and sign out. A refresh keeps the session
- Creating a business: account, location, description, categories, photos, hours, and an online store link. Submit goes to the publishing screen, then the profile
- Editing that profile, and a public preview of the same shop
- Adding, editing, and removing products and services, including photos. Listings shows them. Opening one from the preview shows the full description
- Explore lists the businesses saved in the database
- The account page, including the Show email switch. That choice is saved with the shop. The other switches stay in this browser

## Not done yet

Saving still needs `.env.local`. Without those keys, signup and listings cannot be stored.

- The location button does not read your location, and explore is not filtered by neighbourhood
- Search
- Buying a product or service, and processing an order
- Changing the login password after signup
