# Kaelo (demo build)

A public, data-free build of the Kaelo antimicrobial supply chain application.
The optimization model is intact: multi-echelon flow over a routed network, with
`nominal`, `static_robust`, and `adr` (affine decision rule) strategies, a Γ
uncertainty budget, and negative-binomial demand.

**You supply the numbers.** This build ships with no demand, price, or
procurement data of any kind.

## What was removed from the internal build

| Removed | Why |
| --- | --- |
| CMS procurement workbook (`antimicrobials.xlsx`) and every loader that read it | Contains unit prices, current stock, monthly consumption, quantities on order, and procurement comments |
| "Use CMS data" import path (`use_cms_data`, `build_cms_region_instance`) | Autofilled demand from the procurement records |
| Unit-price editor and add/remove-drug forms | Prefilled and wrote back real product prices |
| CMS product codes and descriptions | Identify real procurement line items |
| `/api/cms/*` endpoints and stored scenario records | Served and persisted the above |
| Authentication (JWT, bcrypt, user database, login page) | Unnecessary without protected data; every route is now open |

Demand still enters through the demand editor and `custom_demand`, which is
per-request user input and never persisted.

## Running it

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000   # from the kaelo-app directory
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The backend expects public reference data (facility list with coordinates,
district boundaries, population) under `data/app/` relative to the repository
root. Those files are public but are not vendored here; point `DATA_APP` at your
own copy.

## Hosting

The frontend ships with the site; the solver does not. The site is a static
Astro build, and the optimizer needs Python (`cvxpy`, `highspy`), so the API has
to run somewhere that executes containers.

**1. Deploy the API.** `render.yaml` at the repository root defines the service.
In Render: New > Blueprint, connect this repo, apply. It builds
`kaelo-app/Dockerfile` on the free plan and sets `CORS_ORIGINS`.

Measured at ~122MB resident with no data loaded, so it fits the free plan's
512MB. Free services spin down when idle, so the first request after a pause is
slow.

Any container host works; the image reads `PORT` and `CORS_ORIGINS` from the
environment. Note that Hugging Face Spaces is **not** an option on the free
tier: Docker Spaces require a PRO subscription, and only static Spaces are free.
`deploy/hf-space/` is kept for anyone who does have PRO.

### Reference data

The API starts without any data and reports what is missing at `/api/health`.
Endpoints that need inputs return 503 with an explanation rather than failing
opaquely, so a deployment is never broken, only limited.

All reference data is vendored under `data/app/`, so the planner runs end to
end with no further setup.

One modeling note: the prescribing data covers hospital tiers only
(`District`, `Primary`, `Specialist`, `Tertiary`). Clinics and health posts,
which are 569 of the 619 facilities, take **district-hospital** rates, since
district hospitals are what serves primary care in this network. That mapping
lives in `build_region_instance`.


**2. Point the site at it.** Set both variables in the Vercel project, then
redeploy:

- `VITE_API_URL=https://your-api-host` (baked into the frontend at build time)
- `PUBLIC_KAELO_API_URL=https://your-api-host` (reveals the link on `/kaelo`)

Until `PUBLIC_KAELO_API_URL` is set, `/kaelo` shows a source link instead of a
button, so the site never advertises an app that cannot answer.

The frontend is built to `public/kaelo-app/` by `npm run build:kaelo`, which the
site's `build` script runs automatically. It uses a hash router, so it needs no
SPA rewrite rules to work from a subpath.
