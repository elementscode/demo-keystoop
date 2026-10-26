![Home listings with saved search alerts, built by Claude Code on Elements: search results filtered by price and beds, with home photos, prices, beds and baths, open house times and saved hearts.](https://elements.dev/demos/01a0f42e-a3a9-75b9-a8af-ca4b01c13918/poster?v=e678ef09f626)

# Home listings with saved search alerts, built by Claude Code on Elements

> Keystoop is a full-stack app built with Claude Code on Elements.

Search homes by price, beds, baths, type and neighborhood, request showings, save homes and searches with email alerts, and give agents a listings desk and inbox.

[Run this app on your machine](https://elements.dev/demos/01a0f42e-a3a9-75b9-a8af-ca4b01c13918). Use this demo as inspiration, or as the starting point for your own app. Your agent creates a new app with this one as the scaffold, and you prompt it to add whatever features you want.

## How it's built

Keystoop needed search results that change as agents work, inquiries that reach an agent's inbox and email, saved searches that send alerts, and a listings desk with photo uploads. Each of those is a part of Elements, so the agent spent its 34 minutes on the brokerage site itself.

- **Live search.** Listings are a LiveTable, so a new listing or a move from active to pending shows up in every open search page at once, and the price, beds, baths, type and neighborhood filters run in the page over that live list.

- **A live inbox.** Inquiries are a LiveTable split by agent, so a question or showing request sent from a listing page lands in that agent's open inbox the moment it is sent.

- **Server calls as function calls.** Inquiries, favorites, saved searches, listing status and photo uploads all go to the server through `@rpc` functions called straight from the page. Uploaded photos are served at addresses browsers keep for a year.

- **Jobs and email.** Each inquiry queues an email to the agent in the same transaction. When a listing goes active, a job emails everyone whose saved search it matches, and each search hears about each listing once.

- **Data from SQL files.** Migrations define the site and seed three agents, thirty listings across eight neighborhoods with photo galleries and open houses, inquiries in each inbox, and a buyer with two saved searches.

- **Sessions and roles.** Agent pages and server calls share one guard on the agent role.

## Why Elements

Elements is an integrated full-stack app framework and a project server. The project server checks the agent's work as it builds: it type-checks the server and browser code, analyzes the program, applies migrations and runs the tests, then reports the results to the agent. A security mistake, such as calling a server-only function from the browser, is a compile error. The agent reads the report and fixes its own mistakes before it tells you a feature is done. The same checks run on every feature you ask for next.
