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

- **Live search.** Listings are a LiveTable, so a new listing or a move from active to pending shows up in every open search page at once, and the price, beds, baths, type and neighborhood filters run in the page over that live list.

- **A live inbox.** Inquiries are a LiveTable split by agent, so a question or showing request sent from a listing page lands in that agent's open inbox the moment it is sent.

- **Server calls as function calls.** Inquiries, favorites, saved searches, listing status and photo uploads all go to the server through `@rpc` functions called straight from the page. Uploaded photos are served at addresses browsers keep for a year.

- **Jobs and email.** Each inquiry queues an email to the agent in the same transaction. When a listing goes active, a job emails everyone whose saved search it matches, and each search hears about each listing once.

- **Data from SQL files.** Migrations define the site and seed three agents, thirty listings across eight neighborhoods with photo galleries and open houses, inquiries in each inbox, and a buyer with two saved searches.

- **Sessions and roles.** Agent pages and server calls share one guard on the agent role.

### What the project server gave the agent

The project server runs alongside the agent and answers as soon as a file is saved: it type-checks the templates, TypeScript and SQL, applies migrations and reruns the tests, so every question came back right away and the agent kept building.

### What shipped

The app type-checks with zero errors and all 68 tests pass. Every page works on desktop and phone.

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
