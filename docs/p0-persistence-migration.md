# P0 Persistence Migration

## Previous State

- `src/lib/learningStore.ts` stored facts, attempts and answers in browser `localStorage`, with an in-memory fallback.
- Static curriculum and question JSON remained file-backed.
- Supabase migrations modeled the learning tables but the app had no Supabase client or state adapter.
- Attempts did not persist blueprint version, scoring role, timeout state or stable client keys.
- Active attempts were recreated instead of resumed.

## New Backend Model

Migration `202609100001_attempt_persistence.sql` extends the existing schema with:

- explicit `timed_out` and `abandoned` terminal statuses;
- blueprint version, passing/scoring/display counts, timeout and time-limit fields;
- stable client attempt and assessment/blueprint keys for current file-backed IDs;
- stable client attempt-question keys, subject/scoring role and immutable question snapshots;
- stable lesson keys for progress rows;
- idempotent answer keys and explicit `unanswered` timeout responses;
- active-attempt uniqueness per user and assessment/blueprint;
- owner-scoped RLS for progress, attempts, frozen questions and answers.

## Current Adapter

`src/lib/supabaseLearningPersistence.ts` provides authenticated persistence for:

- lesson completion;
- active and terminal attempts;
- frozen question versions/order/scoring role;
- blueprint version and timer metadata;
- answers and review history;
- backend hydration at app startup.

`src/lib/supabaseClient.ts` enables the adapter only when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are configured. With valid authenticated Supabase configuration, the backend is the canonical record and local state is the optimistic cache.

Without those environment variables or an authenticated session, development falls back to local state. This fallback is deliberate for local development and is not a production persistence mode.

## Compatibility

- Existing local progress and attempts are not silently uploaded or treated as backend history.
- Existing local state remains available in development until local storage is cleared.
- Existing file-backed content identifiers are stored in stable key columns; future seeded UUID content can populate the relational UUID columns.
- Historical attempt questions also store a JSON snapshot so current question-bank changes do not erase review context.

## Required Deployment Steps

1. Configure Supabase URL and anon key.
2. Configure Supabase Auth and require a signed-in user before starting learning or exams.
3. Apply `202609100001_attempt_persistence.sql` after the foundation migrations.
4. Seed relational content only when the static-file-to-database import is ready; static authored content remains supported.
5. Treat persistence errors as recoverable UI errors; do not start replacement attempts when hydration or resume fails.