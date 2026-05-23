# bus-app

Intercity bus ticketing & route-management platform for the Burgas region.

- `backend/` — Node.js + Express + MongoDB API
- `bus-app/` — Angular 21 SPA (the frontend)

## Running locally

All three processes run at the same time, each in its own terminal. MongoDB must
already be listening locally before you start the backend.

### 1. Backend — http://localhost:3000

```powershell
cd backend
npm start            # node index.js
```

Requires a `backend/.env` with: `PORT`, `JWT_SECRET`, `AUTH_COOKIE_NAME`,
`SESSION_SECRET`, `DB_URL`, `DB_NAME`, `FRONTEND_URL`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`.

There is no auto-reload — after changing backend code, stop (`Ctrl+C`) and
`npm start` again.

### 2. Frontend — http://localhost:4200

```powershell
cd bus-app
npm start            # ng serve
```

### 3. Stripe webhook listener

Forwards Stripe test events (checkout completion for bookings and subscription
purchases/renewals) to the backend's `/webhook` endpoint.

```powershell
stripe listen --forward-to localhost:3000/webhook
```

First-time setup (once per machine):

```powershell
winget install Stripe.StripeCLI   # restart the shell afterwards so `stripe` is on PATH
stripe login                       # opens the browser to pair the CLI with your account
```

On startup the listener prints a signing secret (`whsec_...`). It **must** match
`STRIPE_WEBHOOK_SECRET` in `backend/.env`, otherwise the backend rejects every
event with a 400 signature error. If it differs, copy the printed value into
`.env` and restart the backend.
