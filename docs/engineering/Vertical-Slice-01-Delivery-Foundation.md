# Vertical Slice 01 - Delivery Foundation

- **Status:** Approved for Construction
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-29
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [Definition-of-Done.md](Definition-of-Done.md), [Testing-Strategy.md](Testing-Strategy.md), [Security-and-Privacy-Baseline.md](Security-and-Privacy-Baseline.md), [Observability-and-Operations.md](Observability-and-Operations.md), [Deployment-Architecture.md](Deployment-Architecture.md), [AI-DLC-Phase-Gates.md](AI-DLC-Phase-Gates.md), [../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md](../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md)

## 1. User and Team Outcome

Create one reproducible, reviewable path from a clean checkout to a validated
TradeEvidence artifact and a protected staging deployment. A developer must be
able to run the same essential checks locally that CI runs, while the founder
retains production and vendor approval.

This slice builds delivery capability; it does not add trading functionality.

## 2. Repository Audit - 2026-08-29

### Existing strengths

- `main` is synchronized with `origin/main` at the start of the slice.
- Next.js 16.2.10, React 19.2.4, strict TypeScript, ESLint 9, and the App Router
  are already installed.
- ESLint uses the Next.js Core Web Vitals and TypeScript configurations.
- `package-lock.json` provides a deterministic npm dependency graph.
- The analytics producer has no runtime third-party dependencies and supports
  Python 3.10 or later.
- Twenty-three legacy-protection, direction-aware, adapter, runner, output, and
  determinism tests pass.
- Root and analytics `.gitignore` rules exclude dependencies, build output,
  environment files, local CSV exports, generated reports, and Python caches.

### Gaps and defects

- No `.github` workflows or pull-request template exist.
- The web application has no unit, component, contract, or browser test runner.
- `package.json` has no explicit type-check, test, format, aggregate validation,
  or toolchain-version contract.
- No environment schema, sanitized example, liveness/readiness endpoint,
  correlation identifier, release identity, structured logging, feature flag,
  or kill-switch foundation exists.
- No persistent staging deployment or tested promotion/rollback path exists.
- The production build currently fails in a network-restricted environment
  because `app/layout.tsx` fetches Geist and Geist Mono from Google Fonts at
  build time. Delivery must not depend on an unapproved third-party download.
- The web metadata and landing page remain create-next-app placeholders in
  places. Product UI revision is outside this slice except where a safe build or
  operational identity requires a minimal correction.
- The analytics README still contains historical Workshop #2 language and must
  be synchronized without changing engine behavior.

### Baseline evidence

Run on Windows with Node 24.18.0, npm 11.16.0, and Python 3.14.6:

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `py -m unittest discover -s analytics-engine/tests -v` | Pass, 23 tests |
| `npm run build` | Fail only on build-time Google Font fetch |

## 3. Installed Next.js 16 Constraints

The repository-bundled Next.js documentation is authoritative for this version:

- `.env*` files are loaded from the repository root; secrets remain server-only
  unless deliberately prefixed `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_` values are embedded at build time and therefore cannot carry
  secrets or mutable runtime configuration across one promoted artifact.
- `.env.local` is not loaded in the test environment, supporting reproducible
  tests.
- Next.js 16 removed `next lint`; the ESLint CLI is the correct interface.
- CI should cache `.next/cache` as well as package-manager dependencies.
- Unit tests cannot fully exercise asynchronous Server Components; browser tests
  cover those completed user journeys.
- Production validation uses `next build` and the production server behavior.

## 4. Scope

### Included

1. Pin and document supported Node and Python toolchains.
2. Add deterministic format, lint, type, unit/component, analytics, documentation,
   and production-build commands plus one aggregate validation entry point.
3. Remove unapproved build-time network dependence, beginning with remote fonts.
4. Add a small web test foundation using sanitized, deterministic fixtures.
5. Add GitHub pull-request validation and a risk-aware pull-request template.
6. Define and validate environment variables with strict server/public separation
   and a secret-free example file.
7. Add safe liveness, readiness, correlation, structured-log, and release-version
   foundations.
8. Add server-owned configuration for initially disabled high-risk capabilities.
9. Establish a persistent protected staging deployment after separate founder
   approval of the required vendor commitment.
10. Prove staging health, HTTPS, environment isolation, release identity, and
    rollback; synchronize documentation and obtain founder acceptance.

### Excluded

- Production deployment or public launch
- Authentication provider selection or user/account implementation
- PostgreSQL schema, ORM, migrations, backups, or restore implementation
- Analytics ingestion/publication implementation
- Candidate 2 production approval or scoring changes
- Ask TradeEvidence provider selection or implementation
- Market-data, payment, email, queue, cache, or object-storage selection
- Product dashboard, Workspace, watchlist, or visual redesign
- A claim of staffed 24/7 operations

## 5. Proposed Technical Baseline

- **Runtime:** declare Node 24 for web development/CI and retain Python `>=3.10`
  compatibility, testing the analytics baseline on a supported CI Python.
- **Package install:** `npm ci` in automation; dependency changes update and
  review `package-lock.json`.
- **Web unit/component tests:** Vitest plus React Testing Library, following the
  installed Next.js guidance. Playwright is added when a production-mode browser
  journey materially exists, no later than the first public-evidence slice.
- **CI:** GitHub Actions because GitHub is the current repository authority. CI
  validates pull requests and `main`; it does not deploy production.
- **Formatting:** Prettier as a check, separate from ESLint's correctness rules.
- **Health:** operational endpoints remain outside product `/api/v1`, expose no
  dependency details or secrets, and distinguish process liveness from ability
  to serve traffic.
- **Configuration:** a typed/validated server module owns environment access.
  Client code never reads arbitrary `process.env` or server-only values.
- **Staging:** vendor selection is deferred to a founder-reviewed comparison.

These choices were approved by the founder on 2026-08-29. Staging vendor
selection and the other human gates in Section 9 remain separate approvals.

## 6. Acceptance Criteria

### AC-01 - Clean checkout

On the declared toolchain, a clean checkout can install with `npm ci` and run the
documented validation commands without relying on uncommitted local files.

### AC-02 - Reproducible production build

`npm run build` succeeds in a network-restricted environment after dependencies
are installed. No font, stylesheet, script, or other build input is fetched from
an unapproved remote service.

### AC-03 - Unified validation

One documented command fails if formatting, lint, TypeScript, web tests,
analytics tests, documentation links, or production build fails. Individual
commands remain available for focused development.

### AC-04 - Web test foundation

At least one meaningful deterministic test verifies application-owned behavior;
the test framework, environment, cleanup, and coverage boundaries are documented.
Tests do not use production data or credentials.

### AC-05 - Analytics baseline protection

All 23 existing analytics tests run in the unified local and CI validation path.
No analytics source, classification, weight, ruleset, or protected fingerprint
changes in this slice.

### AC-06 - Pull-request evidence

Every pull request runs required install, format, lint, type, web-test,
analytics-test, documentation, secret/dependency, and build checks appropriate
to the implemented tooling. The template records outcome, AI-DLC level,
acceptance criteria, security/data impact, migrations, observability, rollback,
test evidence, documentation, and human gates.

### AC-07 - Environment and secret boundary

A committed example names configuration without values or credentials. Startup
or readiness fails safely when required server configuration is invalid.
Server-only variables cannot enter browser bundles. Environment files, tokens,
keys, local CSVs, and generated reports remain excluded from Git.

### AC-08 - Operational identity

Liveness reports only that the application process can respond. Readiness
reports a safe ready/not-ready result based on currently implemented required
checks. Responses include no infrastructure or secret detail. Logs and responses
can be correlated safely, and the deployed artifact exposes a non-sensitive
release identifier.

### AC-09 - Safe feature controls

Experimental analytics publication and Ask TradeEvidence are disabled by
default through server-owned configuration. Ordinary browser input cannot enable
them. Each control has an owner, purpose, and removal/review condition.

### AC-10 - Staging isolation and promotion

After founder vendor approval, staging uses distinct configuration and secrets,
contains no production user data, serves HTTPS, deploys a traceable immutable
artifact, and passes health and smoke validation. Merging alone cannot deploy or
enable production.

### AC-11 - Rollback evidence

A staging exercise demonstrates restoration of the previous approved application
artifact or documents and tests the selected platform's equivalent rollback.
The exercise records version, trigger, steps, result, and limitations.

### AC-12 - Closure

Implementation, tests, CI, operational guidance, known limitations, and source-
of-truth documentation agree. No critical finding remains, the founder reviews
the staging evidence, and explicit acceptance closes the slice.

## 7. Failure and Empty States

- Invalid required configuration prevents readiness and produces a safe log.
- Optional provider configuration does not block deterministic readiness while
  its capability is disabled.
- Liveness does not claim that unavailable dependencies are healthy.
- Readiness and CI failures return non-secret diagnostic categories.
- Missing release metadata uses an explicit local/unknown development identity,
  never a fabricated production version.
- Staging deployment failure leaves the previous artifact available or invokes
  the documented rollback path.

## 8. Construction Sessions

1. **Local quality foundation:** toolchains, scripts, offline build, formatting,
   web tests, documentation check, and aggregate validation.
2. **GitHub change controls:** CI, caching, pull-request evidence, dependency and
   secret checks.
3. **Runtime operations:** environment validation, health, correlation, logging,
   release identity, and disabled feature controls.
4. **Staging decision and deployment:** founder-reviewed vendor choice,
   protected configuration, deployment, smoke test, and rollback exercise.
5. **Closure:** full evidence review, documentation synchronization, human
   acceptance, commit, and push.

Each session should end with a clean, documented commit when its acceptance
subset passes. Production release remains out of scope.

## 9. Human Approval Gates

Founder approval is required for:

- this scope and its proposed technical baseline;
- any paid dependency or material vendor commitment;
- the staging/hosting provider and access model;
- any security exception;
- any change that reaches scoring, authentication, sensitive data, production
  architecture, AI behavior, or financial language; and
- final Vertical Slice 1 acceptance.

## 10. Open Questions and Owned Follow-Up

| Question | Owner | Resolution Point |
| --- | --- | --- |
| Which managed platform hosts persistent staging? | Founder and Architect | Before staging implementation |
| Which repository settings enforce required checks and review? | Founder and Architect | GitHub controls session |
| Which observability provider, if any, is needed for this slice? | Founder and Architect | Runtime/staging comparison |
| When should Playwright enter CI? | Architect, founder approves material cost | No later than public-evidence slice |
| What release identifier does the chosen platform provide? | Architect | Staging implementation |

## 11. Initial Risks

- Tooling dependencies can add supply-chain and maintenance cost; keep the set
  small and lock versions.
- CI success can be mistaken for production approval; repository language and
  permissions must preserve the distinction.
- Build-time public environment variables conflict with one-artifact promotion;
  avoid them for mutable environment identity.
- A health endpoint can leak internals or report false readiness; keep output
  minimal and expand checks only with implemented dependencies.
- Staging can drift from production intent if configured manually; capture
  configuration and procedures in version-controlled guidance where practical.
