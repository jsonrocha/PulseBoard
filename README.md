# PulseBoard
 
A unified dashboard of Monday.com boards for engineering, marketing, and ops leads with a natural-language assistant accessible both in-app and via WhatsApp.
 
**Live app:** https://my-pulseboard.base44.app
**Test version:** https://share--my-pulseboard.base44.app
**Built on:** [Base44](https://base44.com)
 
---
 
## What it does
 
PulseBoard aggregates real-time data from three Monday.com boards — Bug Tracker, Engineering Sprint, and Marketing Campaigns — into a single dashboard with KPI cards, charts, and item tables. An AI assistant grounds answers in the cached board data, answering questions like "how many critical bugs are open?" or "what items is John Smith working on?" The same assistant is also accessible through WhatsApp, so on-call leads can check status from their phone without opening a laptop.
 
---
 
## Architecture
 
### Data flow
 
```
Monday.com ←─── queryMonday (backend fn) ←─── In-app chat
            ←─── syncMondayBoards (direct) ←─── Dashboard cache (BoardSnapshot)
                                                ↑
                                            Daily Automation @ 03:00 UTC
                                                ↑
                                            Admin "Refresh" (on-demand)
```
 
The dashboard reads from a `BoardSnapshot` entity that acts as a cache, never hitting Monday.com on page load. The cache is refreshed two ways:
- **Manual:** Admin clicks "Refresh" in the Admin panel → `syncMondayBoards` runs
- **Scheduled:** Base44 Automation fires daily at 03:00 UTC → same function runs
The in-app chat agent uses `queryMonday`, a backend function that proxies GraphQL queries with an auth gate, for on-demand context fetching.
 
### Key entities
 
| Entity | Purpose | Access control |
|---|---|---|
| `BoardSnapshot` | Cached monday board data (items, columns, timestamps) | Read: any authenticated user. Write: admin only. |
| `ChatQuery` | Audit log of every user's AI conversation | Read: creator only, with admin override. Create: any user. Update/Delete: admin only. |
| `User` (built-in) | Extended with `role` and `display_name` fields | Managed by Base44 |
 
### Why these patterns
 
**Backend functions over OpenAPI workspace integrations for Monday.** Monday's API is GraphQL-native, and OpenAPI maps awkwardly to GraphQL. Backend functions give full control over the request structure.
 
**Two AI agent patterns side-by-side.** The in-app chat is a *workflow* agent: pre-fetched context, single LLM call, deterministic answer. The WhatsApp-connected Superagent is an *autonomous* agent: it calls tools, reasons, and chains queries. Different products for different contexts — interactive web vs. async mobile.
 
**Cache-and-refresh, not live polling.** Hitting Monday on every page load would burn API credits and rate-limit risk. The cache makes the dashboard fast and the integration credit-conservative. The daily automation keeps it fresh without over-polling.
 
**SSO and authorization deliberately separated.** Okta handles authentication; Base44 user-role layer handles authorization. New SSO users are provisioned with a default `user` role; admin elevation is a deliberate, manual step in the user management UI. An Okta directory admin can grant *access* but not silently grant *admin*.
 
**Production vs. test environments via the entity layer.** Base44 Test Data toggle creates a parallel database. The dashboard and the chat both read from `BoardSnapshot`, so flipping the toggle changes the visible data without any code changes. Test mode is seeded with a fictional "Rocha LLC" dataset (5 bugs, 4 sprint items, 3 campaigns) via an admin-only "Seed Test Data" button.
 
---
 
## Stack
 
- **Platform:** Base44 (Elite plan, SSO-enabled)
- **Frontend:** React, Tailwind, shadcn/ui, Recharts
- **Backend:** Base44 backend functions (TypeScript on Deno)
- **Data:** Base44 entities (MongoDB-compatible NoSQL)
- **AI:** InvokeLLM (Claude Sonnet 4) for in-app chat; Base44 Superagent for WhatsApp
- **Auth:** Okta OIDC SSO + email/password
- **Integrations:** Monday.com REST/GraphQL API
- **Source control:** GitHub two-way sync
---
 
## A few things I caught and fixed during the build
 
These ended up being interesting design moments worth flagging:
 
- **Hallucination in the Superagent.** Initial WhatsApp answers fabricated item names like "Authentication token expiry not handled" that didn't exist on the boards. Traced to skill output truncation at ~10k chars — the LLM was filling in plausible-sounding gaps. Fixed by switching to cursor-paginated GraphQL queries so the agent always sees the full dataset before counting.
- **Count drift in the dashboard chat.** Initial implementation passed deeply nested column data; counts of items per user drifted across repeated questions. Fixed by flattening items into named-field objects, lowering temperature to 0.2, and adding explicit chain-of-thought counting instructions in the system prompt.
- **Auth-context mismatch with the scheduled automation.** The `syncMondayBoards` function originally called `queryMonday`, which is auth-gated for user-initiated chat queries. When the automation ran (no user session), `queryMonday` 403'd. Fixed by giving `syncMondayBoards` direct monday API access, keeping `queryMonday` user-auth-gated. Tiny duplication, cleaner architecture.
- **Flash of unauthorized content on the Admin page.** Non-admins briefly saw admin content during the auth-state load before the access-denied screen rendered. Caused by check ordering: the access check evaluated to false while `user` was still loading. Fixed by gating on loading state first, then authorization.
---
 
## Local development
 
```bash
git clone https://github.com/jsonrocha/PulseBoard
cd PulseBoard
npm install
cp .env.example .env.local  # fill in VITE_BASE44_APP_ID and VITE_BASE44_APP_BASE_URL
npm run dev
``` 
---
 
