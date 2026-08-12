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

**1. Deploy the API.** `Dockerfile` in this directory builds it. On Render, Fly,
or Railway, point the service at `kaelo-app/Dockerfile` and set:

- `CORS_ORIGINS=https://elliotlee.info` (the site origin, comma-separated for more)
- `PORT` if the platform requires a specific one

### Reference data

The API starts without any data and reports what is missing at `/api/health`.
Endpoints that need inputs return 503 with an explanation rather than failing
opaquely, so a deployment is never broken, only limited.

To enable the full planner, place these under `data/app/` and uncomment the
`COPY data` line in the Dockerfile:

| File | Enables |
| --- | --- |
| `facilities_with_warehouses.csv`, `distance_matrix_named.csv`, `duration_matrix_named.csv` | the facility network and routing |
| `census_population_2022_geocoded_final_uniform.csv`, `botswana_population_age_breakdown.csv` | population weighting |
| `district_admissions_estimates_2021.csv`, `glm/p_class.csv`, `glm/m_ak.csv` | baseline demand |
| `botswana.geojson` | district boundaries on the map |

These are generated artifacts, not stored files: in the research repo `data/app/`
is gitignored and produced by `offline/_full_offline.bash` (geocoding plus OSRM
routing). Run that first, then copy the output here.

**2. Point the site at it.** Set both variables in the Vercel project, then
redeploy:

- `VITE_API_URL=https://your-api-host` (baked into the frontend at build time)
- `PUBLIC_KAELO_API_URL=https://your-api-host` (reveals the link on `/kaelo`)

Until `PUBLIC_KAELO_API_URL` is set, `/kaelo` shows a source link instead of a
button, so the site never advertises an app that cannot answer.

The frontend is built to `public/kaelo-app/` by `npm run build:kaelo`, which the
site's `build` script runs automatically. It uses a hash router, so it needs no
SPA rewrite rules to work from a subpath.
