# User Manual

## High Level Description

LocalLoop is a system designed to allow consumers to find and connect with local businesses. By taking the location of consumers and businesses alike, customers can freely explore and search for local businesses to support. In turn, businesses can better connect with local customers and with a platform to market their products and/or services.

The site isn't hosted, so you run it on your own computer. Location filtering and search are still work in progress. Accounts and shops are stored in the shared Supabase project.

## Getting Started

Starting the system is simple. Some requirements need to be met to run our application:

- Git
- Node.js 20 or later, and npm
- Access to the private course repo

Mobile Requirements:
- IOS 16.4 or Later
- Android 7.0 or Later

There isn't a separate phone app. Those versions are for opening the site in a phone browser once someone is already running it on a computer.

Browser Requirements:
- Google Chrome - Version 111+
- Microsoft Edge - Version 111+
- Mozilla Firefox - Version 111+
- Apple Safari - Version 16.4+

Sign in to GitHub with a GitHub account that can see the repo, then:

```bash
git clone https://github.com/MRU-COMP3504-F2026/LocalLoop.git
cd LocalLoop
npm install
```

The repo does not include `.env.local`. Copy `.env.example` to `.env.local` and ask a teammate for the shared values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Don't commit `.env.local`. If you want the folder layout, tests, or release steps, those are in the developer guide.

## How to run the application:

The experience is the same whether you are a customer or a business owner. From the project folder, run:

```bash
npm run dev
```

Open http://localhost:3000 and create an profile/profile. Leave that terminal open while you use the site.

The home page has a “Use my location” button, but it doesn't ask for your location yet. It just opens explore. Choosing a neighbourhood is work in progress. There also isn't any ad tracking.

One email can have one shopper and business profile, but not two of the same type. If you try to register a second one, it tells you the shopper  or business profile already exists and to sign in. Passwords need at least 6 characters. If you get a confirmation email, open that link before signing in.

Once an profile has been created, you will be able to explore the businesses that have signed up, or run your business.

## User Guide

As of its current iteration, LocalLoop is a web platform which can facilitate the following features:
- Profile creation: the opening screen will prompt users to “join the loop” to create either a new business or shopper profile. Upon choosing to create a business profile, users may provide information regarding their business’s name, email, categories, images, a brief description, hours, location, and an online store link before publicizing the profile.
- Edit profile: the edit profile page allows users to edit details regarding their business profile with the exception of the profile password.
- Populate product/service listing: a tab which enables users to access their current listing and add a product or service. From here, users may add the product/service name, type, description, images, price, and quantity. You can edit or remove one later.
- Preview business profile: upon accessing the tab, business users can preview the profile and how shoppers will see their profile from their inputted details to listings. The page is ordered as follows: 
    - Profile description 
    - Gallery
    - Products and services 
    - Hours
    - Visit (if the profile includes an online store) 
    - Email (if “Publicize email” is turned on)
- Edit profile settings: as of writing, the settings page only has a one functional section called the contact section. The contact section contains a “Publicize email” switch which controls whether other users can see the business email. The other switches are placeholders and don't change the public page yet. The sign out button is also located on the page. 

The following features are still in development/WIP as of writing:
- Location and neighbourhood filtering
- Searching for a specific product, service, or business
- Complete explore page functionality
- Purchase items/services (consumer)
- Process purchases (business)
- Changing the profile password after signup
- The setting switches other than “Show email”

## How to Report a Bug
To report a bug, please create a new issue on GitHub Issues and assign both the label and type as “Bug”

The repo is private, so you need access before the link will work.

Title the issue as “Bug Report: <Bugged Feature>”

In the description, please add the following:
- Describe the overall bug,
- What you expected to happen,
- Prediction and explanation of the severity of the bug,
- And the steps to reproduce the bug.
- Your browser, and whether you were a shopper or a business

Link to GitHub Issues Page: https://github.com/MRU-COMP3504-F2026/LocalLoop/issues

If you want a longer example of a good report: https://marker.io/blog/how-to-write-a-bug-report

## Known Bugs

As of writing, no bugs or limitations have been reported within GitHub Issues or other means.

The WIP list above is unfinished work, not a list of filed bugs. If something that should work doesn't, report it with the steps above.
