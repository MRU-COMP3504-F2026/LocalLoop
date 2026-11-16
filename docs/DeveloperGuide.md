# Developer Guide

## How to obtain the source code.
Local loop lives in a single repository, everything is in one place.

Make sure you have the newest version of git installed on your device, then in your browser, navigate to LocalLoop’s GitHub repo page and copy the repo link 

Then run the following in your terminal :

```bash
git clone <repo-url> 
```

After, follow the *Prerequisite and Build section* to install dependencies and set up environmental variables

## The layout of your directory structure. 
```text
localloop/
- .github/workflows/            - GitHub Actions CI configuration
- .next/                        - Build output needed to serve/render the app (generated)
- docs/                         - Project documentation
- excelfiles/                   - Files required for Supabase
- node_modules/                 - Dependencies for the Node.js project (generated)
- public/                       - Static files served as-is
    - icons/                    - Icon files
    - images/                   - Logos and photos
- src/                          - All application code for the project
    - app/                      - Code for pages and backend routes
    - components/               - Reusable React components
    - context/                  - React context providers for shared data
    - hooks/                    - Custom React hooks
    - lib/                      - Non-UI logic
    - tests/                    - Test cases
```

## Prerequisites and build. 
Once you have the repo on your device, in order to build the software, you must have Node.js 22 or later downloaded, as well as a modern browser to run the application. VS Code is also very much recommended but not required. As well, the repository does not include `.env.local`, so you must create it yourself. 

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

## How to test the software. 
To quickly run the inbuilt tests, run the following command:

```bash
npm test
```
For a more detailed test run/results, use the following command instead:

```bash
npm run test:configuration 
```

For user tests, run the software as instructed above in Prerequisites and Build.

As of writing, the following test suites have been built:
- Home (partially built)
- Business owner account
- Business dashboard 

## How to add new tests. 
To add a new test, please follow the conventions outlined within the Living Document under the subsection of “How to Add a New Test to the Code Base” in the “Test Plan & Bugs.” 

Link to Living Document: https://docs.google.com/document/d/14raTqii5k--X5kpMFcQpR-gfzxXWcpOyZ3CnWMT6Dbk/edit?usp=sharing 

## How to build a release of the software. 

1. Choose the version number. The scheme is [major.minor.patch], for example 1.0.0.
2. Update the version everywhere it appears:
    - package.json and package-lock.json: npm version 1.0.0 --no-git-tag-version
    - README.md (release tag link) and the user guide if they mention a version
3. Make the changes through a PR. Branch as release/v1.0.0, open the PR, get a review, and merge.
4. Create the GitHub Release: Releases > Draft a new release, choose the tag, paste the changelog notes, and publish.

## Sanity checks after the release

Do these on the live deployed URL, not localhost:
- The site loads without console errors
- Sign up with a new test account works
- Log in and log out work, and a refresh keeps you logged in
- A protected page redirects you to login when logged out
- Create a business profile, add an offering, and publish. The data appears in the Supabase table editor
- Image upload works and the image displays
- The README tag link opens the correct GitHub release
