# LocalLoop

LocalLoop is a Next.js app for neighbourhood shops. An owner can sign up, fill in a profile, and list products or services. A visitor can look at the public version of that shop. Signup and listings stay in the browser for now, so a refresh clears them. You do not need Supabase keys to build, test, or click through the app.

**Communication channel:** https://discord.gg/PJrHRZRQz

**Shared Google folder:** https://drive.google.com/drive/u/0/folders/17E4nJSDre1vpC-BMe_WVjNl36kV6EfT5

**Project members:**
- Sayuj Mali
- Josh Nacionales
- Steven On
- Seila Kennedy
- Daniel Anzola

## Setup

Node.js 20 or newer, and npm.

```bash
npm install
```

## Run

```bash
npm run dev
```

Open http://localhost:3000.

## Test

```bash
npm test
```

Jest runs once and exits.

## Build

```bash
npm run build
npm start
```

`npm start` serves the production build at http://localhost:3000. Stop the dev server first if that port is already in use.

## What works

- Home page, and the link into business signup
- Creating a business: account, location, description, categories, photos, and hours. Submit goes to the publishing screen, then the profile
- Editing that profile, and a public preview of the same shop
- Adding, editing, and removing products and services, including photos. Listings shows them. Opening one from the preview shows the full description
- The account page shows the shop from signup. If nothing has been entered, it shows a sample shop instead

## Not done yet

- Login is blank
- Explore and shopper signup are only a heading
- Nothing is stored for good. `.env.example` is there for a later Supabase hookup, and you can skip it
