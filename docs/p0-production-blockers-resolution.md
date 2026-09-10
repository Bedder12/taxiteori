# P0 Production Blockers Resolution

Date: 2026-09-10

## Backend Persistence

- Previous state: progress, attempts, answers and review history were localStorage/in-memory only.
- Fix: added Supabase client configuration, authenticated persistence adapter and migration `202609100001_attempt_persistence.sql`.
- Persisted semantics: lesson keys, attempt lifecycle, timestamps, timeout, score, pass/fail, blueprint version, frozen question versions/order/scoring roles, answers and immutable snapshots.
- Status: **implemented for configured authenticated Supabase environments**.

## Active Attempt Resume

- Previous state: checkpoint and mock starts generated a new attempt on every entry.
- Fix: active-attempt lookup, stable attempt/question IDs, answer persistence, first-unanswered restoration and wall-clock timer restoration.
- D1 and D2 mocks and topic/subject checkpoints use the same resume logic.
- Status: **fixed in the local store and backend hydration path**.

## Timeout Compatibility

- Previous state: `timed_out` attempts were rejected by completed-result progress logic.
- Fix: timed-out attempts are terminal, scored through the normal engine, retain unanswered markers, produce reviewable results and are accepted by `completedAttemptFact`.
- Status: **fixed**.

## Dedicated Prov Flow

- Previous state: no dedicated Prov surface.
- Fix: added `/prov`, home entry point, D1/D2 full mock cards and shared mock route.
- Status: **fixed**.

## D2 Mock CTA

- Previous state: D2 blueprint existed but the exam screen did not expose a mock start action.
- Fix: both D1 and D2 exam pages expose the shared full-mock route; Prov exposes both directly.
- Status: **fixed**.

## Result Navigation

- Previous state: every result linked back to Vilotider.
- Fix: mock results return to Prov; topic checkpoints return to their topic; subject checkpoints return to their subject.
- Status: **fixed**.

## Idempotency and Security

- Same lesson completion is deduplicated.
- Same answer updates one answer row rather than duplicating it.
- Finalizing a terminal attempt returns the existing result and does not create a second result.
- Supabase rows are scoped by `auth.uid()` and active-attempt uniqueness prevents duplicate active attempts.
- Status: **implemented**.

## Verification

Passed:

- `npm run typecheck`
- `npm test`
- `git diff --check`

Added P0 tests for timeout terminal results, checkpoint resume, D1/D2 mock resume, answer idempotency, finalization idempotency and migration security/frozen-state fields.

## Explicit Answers

- Is backend authoritative for progress? **Yes when Supabase/Auth is configured; local fallback remains development-only.**
- Are active attempts resumable? **Yes, from the persisted active attempt and answers.**
- Are timed-out attempts valid terminal attempts? **Yes.**
- Is D1 mock reachable from Prov? **Yes.**
- Is D2 mock reachable from Prov? **Yes.**
- Remaining P0 blockers: **Supabase project migration, environment variables and authenticated session setup must be completed in deployment.** The codebase now fails over to local development state when those production prerequisites are absent rather than claiming backend sync.