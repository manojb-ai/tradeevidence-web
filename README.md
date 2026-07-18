# TradeEvidence

TradeEvidence is decision preparation software for traders. The product emphasizes earned confidence through evidence, risk framing, and reflective learning rather than prediction or autonomous advice.

## Repository Areas

- `app/` — Next.js application source.
- `docs/` — Product Handbook and engineering governance documentation.
- `public/` — static assets.

## Product Handbook Quick Navigation

- [docs/README.md](docs/README.md) — full documentation map.
- [docs/00-PRD.md](docs/00-PRD.md) — product requirements baseline.
- [docs/01-Product-Vision.md](docs/01-Product-Vision.md) — product vision and intent.
- [docs/Product-Decision-Log.md](docs/Product-Decision-Log.md) — authoritative product decision record.
- [docs/Source-of-Truth.md](docs/Source-of-Truth.md) — authority map for product and engineering documentation.

## Engineering Governance Navigation

- [docs/governance/AI-DLC-Adoption-Policy.md](docs/governance/AI-DLC-Adoption-Policy.md)
- [docs/governance/Human-AI-Responsibility-Matrix.md](docs/governance/Human-AI-Responsibility-Matrix.md)
- [docs/governance/decisions/ADR-001-Adopt-AI-DLC.md](docs/governance/decisions/ADR-001-Adopt-AI-DLC.md)
- [docs/governance/decisions/ADR-003-Market-Data-Evolution.md](docs/governance/decisions/ADR-003-Market-Data-Evolution.md)
- [docs/engineering/TradeEvidence-Engineering-Lifecycle.md](docs/engineering/TradeEvidence-Engineering-Lifecycle.md)
- [docs/engineering/AI-DLC-Phase-Gates.md](docs/engineering/AI-DLC-Phase-Gates.md)
- [docs/engineering/Engineering-Specification-Index.md](docs/engineering/Engineering-Specification-Index.md)
- [docs/engineering/Market-Data-Strategy.md](docs/engineering/Market-Data-Strategy.md)
- [docs/workshops/Architecture-Workshop-Plan.md](docs/workshops/Architecture-Workshop-Plan.md)

## Product AI and Development AI Boundary

- Product AI behavior is governed by [docs/08-AI-Strategy.md](docs/08-AI-Strategy.md).
- Development AI usage for building TradeEvidence is governed by the AI-DLC and engineering governance documents above.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to run the application locally.
