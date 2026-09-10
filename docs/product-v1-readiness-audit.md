# Product v1 Readiness Audit

Date: 2026-09-10

## Overall Readiness

**Not ready for production UX work without resolving the P0 findings below.** The content and domain test suites are strong, but the running app is still a local demo slice and several navigation/resume semantics are not production-safe.

## P0 Production Blockers

| Finding | Evidence | Impact |
| --- | --- | --- |
| Learner state is local only | `src/lib/learningStore.ts` uses localStorage with an in-memory fallback; no Supabase client is connected | Progress, attempts, answers and review history are device-local and cannot support authenticated multi-device production use |
| Active attempts are not resumed | `startCheckpointAttempt` and `startMockAttempt` always create a new attempt | Leaving and reopening a lesson/checkpoint/mock can create duplicate attempts and lose the active exam session |
| D1 mock can submit timeout through an incompatible progress fact | `completedAttemptFact` only accepts `status === completed`, while timeout scoring creates `timed_out` | A timed-out mock can fail during state persistence instead of reaching a stable result |
| Full Prov flow is absent | Home exposes exams under Plugga; there is no separate Prov route or D2 mock CTA | The requested product flow cannot be presented as a complete exam area |

## Curriculum Completeness

- D1: 8/8 published subjects
- D2: 2/2 published subjects
- Active requirements: 136
- Requirements with no lesson coverage: 0
- Requirements with no question coverage: 0
- Published lessons: 88
- Published questions: 769
- Orphan fact records: 0

Requirements with weak question coverage, defined here as fewer than three mapped questions:

`D1-NAV-003-001`, `D1-NAV-003-004`, `D1-NAV-003-005`, `D1-NAV-003-007`, `D1-SAFE-012-001`, `D1-SAFE-013-003`, `D1-SAFE-013-004`, `D1-SAFE-014-002`, `D1-SAFE-015-001`, `D1-SAFE-015-002`, `D1-VEH-024-002`, `D1-VEH-025-001`, `D1-VEH-025-003`, `D1-VEH-026-001`, `D1-VEH-026-002`, `D1-VEH-026-003`, `D1-VEH-026-004`, `D1-VEH-026-005`, `D1-VEH-027-001`, `D1-VEH-027-002`, `D1-VEH-027-003`, `D1-VEH-027-004A`, `D1-VEH-027-004B`, `D1-VEH-027-004C`, `D1-VEH-028-001`, `D1-VEH-028-002`, `D1-VEH-028-004`, `D1-VEH-029-007B`, `D1-VEH-029-007E`, `D1-WORK-020-001`, `D1-WORK-021-001`, `D1-WORK-021-002`, `D1-WORK-021-004`, `D1-WORK-021-005`, `D1-WORK-021-006`, `D1-WORK-021-007`, `D2-TRAFFIC-035-003A1`, `D2-TRAFFIC-035-003A2`, `D2-TRAFFIC-035-003A3`, `D2-TRAFFIC-035-003B1`, `D2-TRAFFIC-035-003B2`, `D2-TRAFFIC-035-003C1`, `D2-TRAFFIC-035-003C2`, `D2-TRAFFIC-035-003C3`, `D2-TRAFFIC-035-003C4`.

This is a P1 content-quality risk for retakes and balanced learning, not an immediate traceability failure.

## Navigation And Resume

### Working

- Plugga home -> exam -> subject -> topic -> lesson is wired for published content.
- Topic resume uses `getFirstIncompleteLesson`.
- Lesson completion returns to the next lesson or topic.
- Topic and subject checkpoints are registered as published assessments.
- D1 and D2 mock blueprints select exact allocations and have a shared mock route file.

### Findings

- **P0:** There is no dedicated Prov navigation surface. The D1 mock is a button on the exam page and D2 has no equivalent button.
- **P1:** The generic mock screen starts a new attempt during render and has no active-attempt lookup. It cannot resume an interrupted mock.
- **P1:** Checkpoint start also always creates a new attempt; incomplete checkpoints are not resumed.
- **P1:** The result screen always links back to `topic_d2_taxi_vilotider`, even for D1 results or other D2 topics.
- **P2:** Back navigation relies on the platform/router stack; there are no explicit product-level breadcrumbs or recovery links.

## Progress Semantics

The domain separates lesson completion, topic progress, subject progress and mock performance conceptually. Subject checkpoint status is derived from `attempt_completed` facts, while mock performance is derived from attempts. However:

- mock performance is only explicitly modeled by the D2 study-state helper;
- the app-level store has no dedicated resume/progress selector for active attempts;
- timeout attempts are not accepted by `completedAttemptFact`;
- production synchronization of these separate metrics does not exist yet.

Classification: P1 backend/domain hardening.

## Attempt Immutability

The in-memory engine freezes question version id, version, order, subject and scoring role in `AttemptQuestion`, and stores blueprint version on mock attempts. Completed attempts reject re-scoring. Retakes receive separate ids.

Remaining risk:

- **P1:** the local store resolves answer scoring against the current in-memory question bank rather than a persisted question-version snapshot;
- **P1:** Supabase `attempt_questions` does not persist `subject_id`, `scoring_role` or blueprint version directly;
- **P1:** Supabase has no `timed_out` attempt status and no migration for the new mock metadata.

## Visual Dependency Audit

Across all D1 and D2 banks:

- 769 questions total
- 416 questions with visual metadata
- 0 questions marked visual-required
- 0 questions blocked from mock eligibility by a required final asset

Current classification treats the visual references as enrichment. Placeholder metadata is not treated as a final asset.

### Production Visual Backlog

| Group | Backlog |
| --- | --- |
| Navigation/maps | map and route visual assets for enrichment metadata |
| Vehicle diagrams | vehicle-system, steering, brake, wheel and tyre diagrams |
| Road scenes | navigation, environment and vulnerable-road-user scenes |
| Safety | emergency, passenger restraint and hazard scenes |
| Environment | emissions, driving-style and environmental comparison visuals |
| Service/accessibility | passenger assistance and communication scenes |

No question is currently blocked by this backlog, but lesson presentation is degraded where metadata expects an asset.

## Question-Bank Health

| Subject | Total | Mock eligible | Scenario | Calculation | Visual-required | Allocation ratio |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Navigering | 42 | 42 | 30 | 12 | 0 | 4.20x |
| Körekonomi | 34 | 34 | 26 | 0 | 0 | 5.67x |
| Miljö | 56 | 56 | 40 | 0 | 0 | 9.33x |
| Säkerhet | 80 | 80 | 76 | 2 | 0 | 8.00x |
| Bemötande | 69 | 69 | 64 | 5 | 0 | 5.75x |
| Sjukdomar/funktionsnedsättningar | 42 | 42 | 36 | 0 | 0 | 5.25x |
| Arbetsmiljö/risk | 29 | 29 | 29 | 0 | 0 | 4.83x |
| Fordonskännedom | 107 | 107 | 95 | 0 | 0 | 15.29x |
| Taxitrafiklagstiftning | 165 | 165 | 55 | 0 | 0 | 7.17x |
| Vilotider | 27 | 27 | 10 | 5 | 0 | 1.17x* |
| Trafiklagstiftning | 118 | 118 | 51 | 16 | 0 | 5.13x |

`*` Vilotider is part of the larger D2 taxi-law pool; the D2 mock allocation is measured against the full subject bank, not this topic slice alone.

Exact normalized prompt duplicates: 0 in every audited bank. The smallest meaningful D1 retake pool is Arbetsmiljö/risk; all 25 simulated D1 attempts produced exact allocation and unique questions within an attempt.

## Mobile UX Data Requirements

Present for all 88 lessons: title, objectives except 6 lessons, estimated study time, blocks, source/fact links and topic link.

Missing or incomplete for production UX:

- **P1:** lesson summary missing on all 88 lessons;
- **P1:** prerequisite/revisit reason missing on all 88 lessons;
- **P1:** 6 lessons lack explicit learning objectives;
- **P1:** 32 lessons lack visual metadata;
- **P2:** no normalized icon/category field for subjects/topics;
- **P2:** difficulty exists on questions but not lesson/topic level;
- **P2:** progress labels are derived in UI rather than stored as a stable presentation contract.

## Backend And Persistence

| Data | Current persistence | Production gap |
| --- | --- | --- |
| Lesson completion | localStorage/in-memory | move to Supabase `lesson_progress` |
| Topic/subject progress | derived in memory from local facts | derive from synchronized facts/attempts |
| Checkpoint attempts | localStorage/in-memory | persist attempts, frozen questions and answers |
| Mock attempts | localStorage/in-memory | persist blueprint version, scoring roles and timeout state |
| Results | localStorage/in-memory | backend-owned historical records |
| Review history | localStorage/in-memory answers | backend persistence and immutable version lookup |

Supabase migrations provide a foundation, but there is no client integration, seed import pipeline for the current JSON banks, auth wiring, or schema support for `timed_out`, blueprint version and scoringRole metadata.

## Performance / Data Loading

All D1 and D2 JSON content is imported transitively by `packages/domain/src/vilotiderRepository.ts`, which is imported by the client learning store. The full 769-question bank, lessons, facts and source metadata therefore enters the client bundle eagerly. There is no lazy subject/route loading or backend query boundary.

Classification: **P1 before public beta**, because the current data size is manageable for a prototype but will increase startup cost and memory pressure as media and more versions are added.

## Tests Added And Run

Added product readiness regression checks for:

- D1/D2 subject completeness
- published topic and lesson reachability
- checkpoint and mock selection availability
- mock route/result route presence
- orphan facts and invalid published banks

Existing suites also cover lesson resume ordering, completion persistence, checkpoint selection, attempt immutability, D1/D2 mock allocation, scoring and visual eligibility.

Passed:

- `npm run typecheck`
- `npm test`
- `git diff --check`

## Priority Summary

### P0

- Connect authenticated backend persistence before production UX.
- Add active-attempt resume and prevent duplicate starts.
- Fix timeout persistence/status compatibility.
- Add a real Prov entry point and D2 mock CTA.

### P1

- Fix result back-navigation and generic review routing.
- Add Supabase fields/migrations for blueprint version, scoringRole and timeout.
- Resolve weak requirement question coverage before public beta.
- Introduce lazy content loading.
- Add lesson summaries, prerequisites and revisit reasons.

### P2

- Add normalized visual/category/icon metadata.
- Improve enrichment visuals and explicit breadcrumb/back affordances.
- Expand retake diversity for the smallest subject pools.

## Final Assessment

Content integrity and domain-level exam selection are in good shape for continued engineering. The product is **not production-ready** until P0 persistence, resume, timeout and Prov-flow issues are resolved. No new theory content or UI redesign was created in this audit.