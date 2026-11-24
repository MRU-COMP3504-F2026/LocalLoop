# Developer Guide

## How to obtain the source code.
Local loop lives in a single repository, everything is in one place. The repo is private, so you need a GitHub account that already has access, and the site isn't hosted. You run it on your own machine.

Make sure you have git installed on your device, then in your browser, navigate to LocalLoop’s GitHub repo page and copy the repo link

https://github.com/MRU-COMP3504-F2026/LocalLoop

Then run the following in your terminal :

```bash
git clone <repo-url>
cd LocalLoop
```

After, follow the *Prerequisite and Build section* to install dependencies and set up environmental variables

## The layout of your directory structure.
`.next` and `node_modules` show up after you build and install. They aren't part of the clone.

localloop/
- .github\workflows		- GitHub Actions CI Configuration
- docs				- Project Documentation
- excelfiles			- Holds files required for supabase
- public				- Holds static files
- icons				- Icon files
- images			- Logos and photos
- src				- Contains all application code for the project
- app				- Holds code for pages and backend routes
- components 			- Holds reusable React components
- context			- React context providers for shared data
- hooks				- Custom React Hooks
- lib				- Non-UI logic
- supabase			- Server Supabase client
- __tests__			- Contains test cases

## Prerequisites and build.
Once you have the repo on your device, in order to build the software, you must have Node.js 20 or later downloaded, as well as a modern browser to run the application. VS Code is also very much recommended but not required. As well, the repository does not include `.env.local`, so you must create it yourself. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Ask a teammate for the shared values, and don't commit that file. Photos also need the public bucket named `business-photos`. That bucket is already on the shared project.

**To build the software:**

Assuming you have the repo cloned, make sure you are in the folder by running this command:
*If you do not have the repo cloned, refer back to the How to Obtain the Source Code section

```bash
cd <repo-folder>
```

Then, in your terminal, run the following commands to install dependencies required for the application to work

```bash
npm install
```

To run the application, run the following command:

```bash
npm run dev
```

Open http://localhost:3000.

To run a production build instead, stop the dev server if it is using port 3000, then:

```bash
npm run build
npm start
```

## How to test the software.
To quickly run the inbuilt tests, run the following command:

```bash
npm test
```
For a coverage report, use the following command instead:

```bash
npm run test:coverage
```

For user tests, run the software as instructed above in Prerequisites and Build. Signup, listings, and photos need a real `.env.local`. The automated tests do not.

As of writing, the following test suites have been built:
- Home (partially built), `src/__tests__/home.test.tsx`
- Business owner profile, `src/__tests__/ownerBusiness.test.ts`
- Business dashboard, `src/__tests__/dashboard.test.tsx`

`src/__tests__/samples/sample.test.tsx` is just a dummy test. It isn't part of the app.

## How to add new tests.
Add the file under `src/__tests__` and name it `something.test.ts` or `something.test.tsx`. Jest picks those up on its own. Use Jest and React Testing Library, same as the tests that are already there.

For the rest of the conventions, follow the Living Document under the subsection of “How to Add a New Test to the Code Base” in the “Test Plan & Bugs.”

Link to Living Document: https://docs.google.com/document/d/14raTqii5k--X5kpMFcQpR-gfzxXWcpOyZ3CnWMT6Dbk/edit?usp=sharing

## How to build a release of the software.

This is a GitHub tag on the private repo, not a hosted site.

1. Choose the version number. The scheme is [major.minor.patch], for example 1.0.0.
2. Update the version everywhere it appears:
    - package.json and package-lock.json: npm version 1.0.0 --no-git-tag-version
    - README.md (release tag link) and the user guide if they mention a version
3. Make the changes through a PR. Branch as release/v1.0.0, open the PR, get a review, and merge.
4. Create the GitHub Release: Releases > Draft a new release, choose the tag, paste the changelog notes, and publish.

## Sanity checks after the release

Do these on a local production build (`npm run build`, then `npm start`), not the dev server:
- The site loads without console errors
- Sign up with a new test account/profile works
- Log in and log out work, and a refresh keeps you logged in
- Signing up again with the same email and the same account/profile type tells you to sign in instead
- Create a business profile, add an offering, and publish. The data appears in the Supabase table editor
- Image upload works and the image displays
- The README tag link opens the correct GitHub release
