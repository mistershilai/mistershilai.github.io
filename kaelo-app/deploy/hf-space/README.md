---
title: Kaelo API
emoji: 💊
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Kaelo API

Optimization backend for the Kaelo antimicrobial supply chain planner.
Multi-echelon flow over a routed network, with nominal, static robust, and
affine decision rule strategies under a Γ uncertainty budget.

Ships with no demand, price, or procurement data. Every number comes from the
caller.

- Health check: `/api/health`
- Interactive docs: `/docs`

Set `CORS_ORIGINS` under **Settings → Variables** to the site origin, e.g.
`https://elliotlee.info`.
