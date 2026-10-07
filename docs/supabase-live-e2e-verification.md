# Supabase Live E2E Verification

Generated: 2026-10-07

## Result

The D2 taxi-law runtime now exposes all source-authored topic checkpoints. Canonical content has 12 Taxi-law topic assessments and no Taxi-law subject checkpoint; this absence is valid because no product/domain contract requires one. The D2 traffic-law subject checkpoint remains registered. The subject UI only renders a subject-checkpoint CTA when an authored assessment exists.

The live D2 mock resumed and finalized through the app runtime. The same attempt ID, frozen order/version/roles, saved answer and wall-clock timer survived reload. It completed with 50 displayed, 46 scored, 4 non-scoring, a 23/23 subject split, score 46/46, and a persisted review. Live timeout, RLS isolation, idempotency and terminal immutability also passed.

Two runtime persistence defects were fixed without a database schema change: terminal attempt writes now use an owner- and in-progress-constrained update instead of upsert; absent optional `passing_score` values now hydrate as `undefined` rather than `NaN`. No passwords, anon keys or secrets were printed.

## Normalization and Local Runtime Verification

| Check | Status | Result |
| --- | --- | --- |
| Question bank structural audit | PASS | 824 questions; 0 missing/invalid topic IDs, 0 wrong-subject mappings, 0 duplicate stable-key/version pairs. |
| Vilotider topic identity | PASS | One runtime topic row: `topic_d2_taxi_vilotider`, subject `subject_d2_taxitrafiklagstiftning`, exam D2. |
| Vilotider lessons | PASS | All 6 lessons resolve to the canonical topic. |
| Vilotider questions | PASS | All 27 questions resolve to the canonical topic. |
| Question semantics changed | PASS | 0 question text, answer, explanation, scoring, or source-reference changes. |
| D2 taxi-law runtime loading | PASS | 192 questions load; no missing topic ID reaches `runtimeRepository.toQuestion()`. |
| D2 traffic-law runtime loading | PASS | 129 questions load. |
| Vilotider lesson loading | PASS | 6 lessons load. |
| Vilotider checkpoint selection | PASS | 15 published questions select from the loaded canonical Vilotider pool. |
| Taxi-law source-authored topic assessments | PASS | Exactly 12 source-defined Taxi-law topic checkpoint assessments load through runtime; no assessment content was synthesized. |
| Traffic-law authored checkpoints | PASS | 15 topic checkpoints and the existing subject checkpoint remain registered. |
| Taxi-law subject checkpoint | PASS | No canonical subject checkpoint exists or is explicitly required; runtime and UI treat it as optional. |
| Taxi checkpoint lifecycle regression | PASS | Source/runtime parity and checkpoint start, freeze, resume, result and review are covered by tests. |
| D2 mock construction | PASS | 50 displayed, 46 scored, 4 non-scoring; 23 scored per subject; no duplicate/invalid/frozen-relation/visual blockers. |

## Environment Used

- Workspace: `C:\taxitheory\taxiteori`
- Supabase environment file: configured
- App Supabase runtime variables expected by `src/lib/supabaseClient.ts`:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Two E2E test-user credential variable sets: configured
- Secrets/keys/passwords printed: NO

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
| Auth verified | PASS | Previously verified; retained as requested, not rerun in this pass. |
| User A lesson persistence | PASS | Previously verified; retained as requested, not rerun in this pass. |
| User A checkpoint resume | PASS | Previously verified; retained as requested, not rerun in this pass. |
| D1 mock resume | PASS | Previously verified; retained as requested, not rerun in this pass. |
| D2 mock resume | PASS | Same attempt, 50 frozen questions, 46/4 scoring roles, 23/23 allocation, 50 restored answers, stable order/version/role/blueprint version, resumed timer, completed result and 50-item review. |
| Timeout flow | PASS | App runtime finalized a mock as `timed_out`; 50 question and answer rows persisted. |
| RLS: User B cannot read/mutate User A state | PASS | User B could not read or update User A's attempt, frozen questions or answers. |
| User B own-state access | PASS | User B wrote and read its own lesson progress; User A's active test attempt remained unchanged by User B probes. |
| Idempotency | PASS | Repeated answer save kept one row; repeated finalize returned the same attempt/status without duplicating answers. |
| Immutability after completed/timed-out attempts | PASS | Attempts, answers and frozen question snapshots rejected post-finalization updates. |
| Recoverable network/write/resume errors | NOT_TESTED | No deliberate network interruption or recovery scenario was run. |

## Diagnosed Blockers

P0 blockers: none identified by these checks.

P1 blockers:

- Native Expo loading is still FAIL for the requested D1/D2 split: Metro emits one Hermes bundle per native platform containing all question-bank modules. Production web loading is isolated and verified.
- Production visual rendering in a real device build remains NOT_TESTED.

## Beta Readiness Impact

Beta-ready remains NO because native bundle/loading readiness is FAIL and production visual rendering is NOT_TESTED. D2 live resume, timeout, RLS, idempotency and immutability are PASS.
