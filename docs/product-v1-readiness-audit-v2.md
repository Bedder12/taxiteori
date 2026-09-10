# Product v1 Readiness Audit v2

Date: 2026-09-10

## Executive Status

**Not production-ready.** The P0 state model, local resume behavior, timeout compatibility and Prov routes are implemented and unit-tested. Real Supabase deployment and authenticated E2E behavior remain unverified because this workspace has no Supabase URL, anon key, CLI or authenticated test user.

## P0

| Area | Status | Evidence |
| --- | --- | --- |
| Persistence model | Code complete; live deployment unverified | [supabase-production-verification.md](supabase-production-verification.md) |
| Active attempt resume | Passes local/domain tests | `p0Persistence.test.ts` |
| Timeout compatibility | Passes local/domain tests | timed-out attempts are terminal and accepted by result facts |
| D1 Prov route | Implemented | `/prov` -> D1 mock |
| D2 Prov route | Implemented | `/prov` -> D2 mock |

Remaining P0 deployment blocker: real Supabase/Auth verification.

## P1

### Backend Deployment Verification

Not verified against a real configured environment. The migration and adapter exist, but RLS, round-trip snapshots, cross-user isolation and app reload hydration still need a live smoke run.

### Content Loading

Measured baseline:

- JSON files: 49
- authored JSON payload: approximately 2.68 MiB
- question JSON: approximately 1.51 MiB
- content JSON: approximately 0.70 MiB
- curriculum JSON: approximately 0.47 MiB
- Expo web export JS bundle: approximately 4.2 MB
- static routes: 11

The active app routes now use the metadata repository and subject-scoped dynamic loader. The aggregate repository remains only for tests/tools.

After migration:

- initial JS entry: approximately 2.4 MB, down from 4.2 MB;
- authored JSON remains 2.68 MiB on disk;
- question banks are emitted as separate subject chunks;
- D1 mock loads eight D1 subject banks;
- D2 mock loads two D2 subject banks;
- ordinary Plugga navigation does not import question-bank chunks in the initial entry.

See [content-loader-migration.md](content-loader-migration.md) for route mapping and limitations. Browser network timing was not measured in this workspace.

### Repository Structure

`vilotiderRepository.ts` still owns compatibility normalization, assessment registration and blueprint assembly for tests/tools. It is no longer imported by active app routes. This is retained as a compatibility adapter rather than removed.

### UX Metadata

Added to published lesson records:

- summary
- learning objectives for all lessons
- prerequisite lesson keys
- existing estimated study time retained

Added deterministic result metadata:

- weak requirement keys
- revisit reason derived from incorrect question count

Personalized reasons are not authored into static content.

### Weak Question Coverage

The prior 45 weak requirements are documented without generating new questions in [question-coverage-backlog.md](question-coverage-backlog.md). Each entry includes subject, existing count, competency, minimum target, recommended form and priority.

## E2E Status

- Authenticated user completes lesson and reloads: **not live-verified**
- Checkpoint answers and active attempt resume after reload: **not live-verified**
- D1 mock wall-clock timer resume: **not live-verified**
- D1 timeout result/review after reload: **not live-verified**
- Equivalent D2 mock smoke flow: **not live-verified**

Local/domain tests cover these contracts but are not a substitute for a real backend session.

## Tests

Passed locally:

- `npm run typecheck`
- `npm test`
- `git diff --check`
- subject-scoped loader discovery and loading
- all subjects, lessons and checkpoints reachability
- prerequisite self-cycle guard
- deterministic revisit mapping
- P0 persistence/timeout/resume contracts

## Remaining Production Blockers

1. Configure and deploy Supabase/Auth, then run the documented two-user E2E verification.
2. Run the final mobile/device smoke test for reload, resume, timeout and review.

## Recommended Next Task

Provision a staging Supabase project with two authenticated test users and execute [supabase-production-verification.md](supabase-production-verification.md). Do not generate the 45 weak-coverage question backlog until that staging persistence/content-loading gate is green.