# Supabase Production Verification

Date: 2026-09-10

## Environment Check

The current workspace has no configured `EXPO_PUBLIC_SUPABASE_URL`, no configured `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and no Supabase CLI installation. No real project reference or authenticated test user was available.

Therefore this audit **does not claim that Supabase deployment or authenticated E2E persistence has been verified**.

## Code-Level Verification

Verified locally:

- migration contains `blueprint_version`, `scoring_role`, `timed_out`, stable client keys and question snapshots;
- RLS policies scope progress, attempts, attempt questions and answers to `auth.uid()`;
- one-active-attempt uniqueness is represented in the migration;
- local store resumes active checkpoint and D1/D2 mock attempts;
- timeout finalization is terminal and reviewable;
- persistence adapter maps lesson progress, attempts, frozen questions, answers and hydration state.

## Unverified Live Checks

The following require a configured Supabase project and authenticated users:

- migrations apply cleanly to the target project;
- authenticated user can insert/read own lesson progress;
- authenticated user can create, resume and finalize own checkpoint/mock attempts;
- second user cannot read or mutate the first user's rows;
- blueprint version, scoring role, timed-out status and question snapshots round-trip;
- app reload resumes from backend state rather than local cache;
- timeout result and review survive reload;
- D1 and D2 mock smoke flows work on a real device/browser session.

## Deployment Procedure

1. Configure Supabase URL and anon key in the Expo environment.
2. Configure Supabase Auth and create two test users.
3. Apply foundation migrations followed by `202609100001_attempt_persistence.sql`.
4. Run the authenticated progress/attempt smoke script against both users.
5. Reload between lesson completion, answer persistence, mock resume and timeout.
6. Record SQL/RLS results and device/browser observations in this document.

## Status

- Real Supabase verification: **No**
- Authenticated E2E persistence verification: **No**
- Active-attempt resume outside unit tests: **No**
- Timeout outside unit tests: **No**
- Remaining blocker: deployment credentials, project and authenticated test session are unavailable in this workspace.