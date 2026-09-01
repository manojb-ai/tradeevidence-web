# GitHub Repository Controls

- **Status:** Active
- **Version:** 1.1
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [Vertical-Slice-01-Delivery-Foundation.md](Vertical-Slice-01-Delivery-Foundation.md), [Testing-Strategy.md](Testing-Strategy.md), [Security-and-Privacy-Baseline.md](Security-and-Privacy-Baseline.md), [Deployment-Architecture.md](Deployment-Architecture.md)

## Purpose

Define the repository settings that turn the version-controlled CI workflow
into an enforced change-control boundary. The workflow contains no deployment
authority, environment secrets, production data, or production release action.

## Version-Controlled Controls

The `Quality` workflow runs for pull requests into `main`, pushes to `main`, and
manual diagnostic runs. It uses one read-only job on a GitHub-hosted Ubuntu
runner with:

- explicit `contents: read` token permission;
- immutable full-SHA references to official GitHub actions;
- checkout credentials disabled after source retrieval;
- declared Node 24 and Python 3.14 toolchains;
- npm and Next.js build caches keyed by reviewed inputs;
- `npm ci --ignore-scripts` from the committed lockfile;
- a high-severity npm dependency audit;
- formatting, lint, strict TypeScript, web, analytics, secret-pattern,
  documentation-link, and production-build validation; and
- concurrency cancellation for obsolete runs on the same branch.

The pull-request template records product outcome, authority, AI-DLC level,
scope, acceptance, risk, data/contracts, operations, validation evidence,
documentation, rollback, and human gates. CI success does not authorize merge,
staging, production deployment, feature enablement, or release.

## Active `main` Ruleset

The founder approved and activated the `TradeEvidence main protection` ruleset
on 2026-09-01 after `Quality` run 1 completed successfully for commit `cd037d1`.
The ruleset applies to `main` and:

1. Require changes through pull requests for normal development.
2. Require the `Validate repository` status check.
3. Require the branch to be current before merge.
4. Require all review conversations to be resolved.
5. Block force pushes and branch deletion.
6. Require linear history where compatible with the chosen merge method.
7. Limits bypass to repository administrators for emergency use; every bypass
   reason must be recorded in the related change record.

For the current founder-led team, a mandatory second-person approval is deferred
until another authorized reviewer is consistently available. Founder merge is
the human acceptance action; Level 3 domain approvals remain recorded in the
pull request or authoritative decision documents.

The active ruleset allows squash and rebase merges and disallows merge commits.
Normal development now uses a branch and pull request. The administrator bypass
is a recovery control, not the routine delivery path.

## Repository Security Settings

Enable where available:

- dependency graph and Dependabot alerts;
- automated security updates after review capacity is established;
- GitHub secret scanning and push protection;
- Actions policy restricted to GitHub-authored actions and explicitly reviewed,
  full-SHA-pinned external actions; and
- default workflow token permission set to read-only.

GitHub dependency review may be added when the repository's visibility and Code
Security entitlement support it. The initial universal gate uses `npm audit`
because it works independently of that entitlement.

## Baseline Secret Check

The repository checker rejects tracked environment/credential/key filenames and
common private-key, AWS, GitHub-token, and OpenAI-style secret patterns without
printing matched values. It is an early local and CI guard, not a replacement
for GitHub push protection, provider-side secret detection, rotation, or human
review.

## Review and Maintenance

- Update action pins only through reviewed pull requests that identify the old
  and new signed upstream releases.
- Investigate required-check failures; do not normalize bypass or blind retry.
- Review permissions whenever a workflow gains a new job or integration.
- Deployment workflows, OIDC, environments, and secrets require separate
  staging-provider approval and are outside this checkpoint.
