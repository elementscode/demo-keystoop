![Keystoop, a real estate listings app built with Elements: search results filtered by price and beds, with home photos, prices, beds and baths, open house times and saved hearts.](https://elements.dev/demos/01a0f42e-a3a9-75b9-a8af-ca4b01c13918/poster?v=e678ef09f626)

# Keystoop

> A demo app built with [Elements](https://elements.dev).

Search homes by price, beds, baths, type and neighborhood, request showings, save homes and searches with email alerts, and give agents a listings desk and inbox.

**Demo:** [Keystoop](https://elements.dev/demos/01a0f42e-a3a9-75b9-a8af-ca4b01c13918)

## Agent specs

What one run of the prompt below took, from an empty Elements project to this
app.

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 34 min
- **Cost:** $9.85 at API rates, September 2026

## Get started

```bash
elements create keystoop -scaffold=elementscode/demo-keystoop
```

## How it's built

Keystoop needed search results that change as agents work, inquiries that reach an agent's inbox and email, saved searches that send alerts, and a listings desk with photo uploads. Each of those is a part of Elements, so the agent spent its 34 minutes on the brokerage site itself.

### What Elements gave the app

- **Live search.** `listings` is a LiveTable in `app/shared/services/listings.ts`, with a trigger in the schema migration that broadcasts each change. A new listing or a move from active to pending shows up in every open search page at once, and the price, beds, baths, type and neighborhood filters run in the page over that live view.
- **A live inbox.** `inquiries` in `app/shared/services/inquiries.ts` is a LiveTable partitioned by agent, so a question sent from a listing page lands in that agent's open inbox the moment it is saved.
- **Server calls as function calls.** Pages call `@rpc` functions such as `sendInquiry`, `toggleFavorite`, `saveSearch`, `setListingStatus` and `addPhotos` straight from the template. `addPhotos` takes the uploaded files as an argument, and `app/routes/photos.ts` serves them at hashed urls that browsers cache for a year.
- **Background email.** `sendInquiry` queues `SendInquiryJob` in the same transaction as the inquiry. When a listing goes active, `NotifySavedSearchesJob` emails each matching saved search, and `claimMatches` in `app/shared/services/alerts.ts` records the match so each search hears about each listing once.
- **Data from SQL files.** Two migrations define the site and seed three agents, thirty listings across eight neighborhoods with photo galleries and open houses, inquiries in each inbox, and a buyer with two saved searches.
- **Sessions and roles.** Agent pages and rpcs share one guard, `requireAgent` in `app/shared/services/auth.ts`.

### What the project server gave the agent

The project server runs alongside the agent and answers as soon as a file is saved: it type-checks the templates, TypeScript and SQL, applies migrations and reruns the tests, so every question came back right away and the agent kept building.

### What shipped

The app type-checks with zero errors and all 68 tests pass. Every page was checked on desktop and phone before publishing. The repo was installed fresh from GitHub and run before the demo went live.

Start in `app/shared/services/agent.ts`.

## Seed data and demo accounts

The seed creates three agents and thirty listings across eight neighborhoods
(22 active, 5 pending, 3 sold), with photo galleries, open houses and a few
inquiries in each agent's inbox. It also creates a buyer with saved homes and
two saved searches. Every account's password is `keystoop`, and the sign-in
page lists them.

| Email                  | Role                     |
| ---------------------- | ------------------------ |
| nora@keystoop.test     | agent (Principal Broker) |
| marcus@keystoop.test   | agent (Associate Broker) |
| maya@keystoop.test     | agent (Sales Agent)      |
| sam.rivera@example.com | buyer                    |

In development, inquiry and saved-search emails are written to the server log.
To send them, set `EMAIL_LIVE` and the SMTP settings in
`config/env/production.env`.

Listing photos are public domain (CC0 and Public Domain Mark) images from
Openverse, and the agent portraits are drawn SVGs. The brokerage, agents and
addresses are made up.

## The prompt

```text
Build a real estate listings site named keystoop for a local brokerage.

PUBLIC
- Search homes for sale by price range, beds, baths, property type and
  neighborhood, sorted by newest or price.
- Listing page: photo gallery, price, details, description, open house times,
  and the listing agent.
- Send an inquiry or request a showing; the agent gets an email.
- Save favorites and saved searches (with an account); get an email when new
  listings match.

AGENT (accounts)
- Create and edit listings with photos. Status: active, pending, sold.
- Inquiries inbox.

Seed three agents and thirty listings with photos across neighborhoods and
statuses. Show the agent logins on the sign-in page.

New listings and status changes appear in search results in real time.
```

## License

MIT. See [LICENSE](LICENSE).
