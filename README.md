![Keystoop, a real estate listings app built with Elements: search results filtered by price and beds, with home photos, prices, beds and baths, open house times and saved hearts.](POSTER_URL)

# Keystoop

> A demo app built with [Elements](https://elements.dev).

Search homes by price, beds, baths, type and neighborhood, request showings, save homes and searches with email alerts, and give agents a listings desk and inbox.

**Demo:** [Keystoop](DEMO_URL)

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
