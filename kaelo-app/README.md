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

## Note on hosting

This is a Python service plus a React SPA, so it does not run on the static
Astro site in the parent directory. It needs its own deployment, or a port of
the solver to WebAssembly to run entirely in the browser.
