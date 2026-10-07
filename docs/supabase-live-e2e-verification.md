# Supabase Live E2E Verification

Generated: 2026-10-07

## Result

Live Supabase/Auth E2E verification was resumed against the configured Supabase project after DNS and Auth were confirmed.

Forward-only migrations applied in this pass:

- `202609100003_persistence_privileges_idempotency.sql`
- `202609100004_client_key_persistence_nullability.sql`

The previous blockers are resolved:

- Authenticated `lesson_progress` access: PASS
- `attempts` client idempotency conflict target: PASS
- `attempt_questions`/`answers` client-key nullability: PASS

The production-critical live E2E flow is not beta-ready yet. It now stops at D2 runtime loading before D2 persistence can be verified:

- `Cannot read properties of undefined (reading 'startsWith')`
- Diagnosed source: D2 taxi-law `vilotider-questions.json` records do not carry `topic_id`, while `runtimeRepository.toQuestion()` expects `raw.topic_id`.

No passwords, anon keys or secrets were printed.

## Environment Used

- Workspace: `C:\taxitheory\taxiteori`
- Supabase environment file: configured
- App Supabase runtime variables expected by `src/lib/supabaseClient.ts`:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Two E2E test-user credential variable sets: configured
- Secrets/keys/passwords printed: NO
- Latest live E2E run id: `live_e2e_1791378565980_5cfbc514`

## Prerequisite Gate

| Prerequisite | Status | Evidence |
| --- | --- | --- |
| App-equivalent Supabase URL exists | PASS | `.env` contains a configured Supabase URL. |
| Anon/public key exists | PASS | `.env` contains a configured client-safe key. |
| Supabase host reachable | PASS | Supabase Auth returned real application-level responses; previous `ENOTFOUND` no longer applies. |
| User A authentication | PASS | User A authenticated with Supabase Auth. |
| User B authentication | PASS | User B authenticated with Supabase Auth. |
| Migrations applied to actual project | PASS | `supabase migration list` shows local/remote through `202609100004`. |

## Migration Verification

| Check | Status | Notes |
| --- | --- | --- |
| `202609100003` dry-run | PASS | Dry-run showed only `202609100003_persistence_privileges_idempotency.sql` before deploy. |
| `202609100003` deploy | PASS | Remote push applied successfully. |
| `202609100004` dry-run | PASS | Dry-run showed only `202609100004_client_key_persistence_nullability.sql` before deploy. |
| `202609100004` deploy | PASS | Remote push applied successfully. |
| Remote migration history | PASS | `supabase migration list` shows `202609090001` through `202609100004` in local and remote history. |
| Authenticated persistence grants | PASS | Live lesson completion no longer gets `permission denied for table lesson_progress`. |
| Attempt idempotency uniqueness | PASS | Attempt upsert uses `user_id,client_attempt_id` and no longer fails on missing conflict target. |
| Client-key child persistence | PASS | Checkpoint resume persisted and reloaded frozen questions and answers. |

## Live Verification Matrix

| Area | Status | Notes |
| --- | --- | --- |
| Auth verified | PASS | User A and User B both authenticated. |
| User A lesson persistence | PASS | Lesson completion persisted remotely and reloaded as one row. |
| User A checkpoint resume | PASS | Same attempt, frozen question order/versions, answers, result and review reloaded. |
| D1 mock resume | PASS | 70 displayed, 65 scoring, 5 non-scoring; allocation `10 / 6 / 6 / 10 / 12 / 8 / 6 / 7`; frozen state and answers reloaded. |
| D2 mock resume | FAIL | D2 repository load fails before persistence because a loaded D2 question has no `topic_id`. |
| Timeout flow | NOT_TESTED | Stopped at D2 blocker. |
| RLS: User B cannot read/mutate User A state | NOT_TESTED | Stopped at D2 blocker. |
| User B own-state access | NOT_TESTED | Stopped at D2 blocker. |
| Idempotency | NOT_TESTED | Lesson duplicate and answer retry were observed before the D2 blocker, but the full idempotency gate including finalize retry was not completed. |
| Immutability after completed/timed-out attempts | NOT_TESTED | Stopped at D2 blocker before timeout/finalized immutability checks. |
| Recoverable network/write/resume errors | NOT_TESTED | Stopped at D2 blocker. |

## Diagnosed Blockers

P0 blockers:

- D2 runtime repository loading fails on D2 taxi-law `vilotider-questions.json` records without `topic_id`. This blocks D2 mock resume and all later live gates.
- Timeout, live RLS, idempotency and immutability remain NOT_TESTED after the D2 blocker.

P1 blockers:

- None identified in this pass.

Required next action:

- Fix or guard the D2 runtime loader data issue without changing canonical exam values.
- Rerun live E2E from D2 mock resume after Auth, lesson, checkpoint and D1 remain PASS.

## Beta Readiness Impact

Beta-ready remains NO because D2 live resume is FAIL and timeout, RLS, idempotency and immutability are NOT_TESTED.
