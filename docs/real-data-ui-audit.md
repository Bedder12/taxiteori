# Real-Data UI Audit

Generated: 2026-10-07

## Summary

The active UI was audited against runtime/domain data usage after UI v1 freeze. Active product routes now avoid prototype names, prototype progress percentages, legacy aggregate repository imports and mock-data modules.

Regression coverage was added in `packages/domain/tests/realDataUiAudit.test.ts`.

## Screen Matrix

| Screen | Status | Actual data source |
| --- | --- | --- |
| Home | REAL | `getRuntimeMetadataRepository()`, `getRuntimeState()`, domain `getSubjectProgress()` |
| Plugga | REAL | Sequential Plugga path from runtime metadata and real progress facts |
| D1 learning path | REAL | Published D1 subjects from runtime metadata in canonical order |
| D2 learning path | REAL | Published D2 subjects from runtime metadata |
| Subject | REAL | Subject-scoped runtime repository, real topics/checkpoints/progress |
| Topic | REAL | Subject-scoped runtime repository, real lessons and topic checkpoint |
| Lesson | REAL | Authored lesson `ContentBlock` data through subject-scoped loader |
| Topic checkpoint | REAL | Real assessment definition and subject-scoped question bank |
| Subject checkpoint | REAL | Real assessment definition and subject-scoped question bank |
| Prov | REAL | Domain mock blueprints from `repository.examBlueprints` |
| D1 mock | REAL | D1 blueprint and D1 subject banks only |
| D2 mock | REAL | D2 blueprint and D2 subject banks only |
| Question | REAL | Frozen attempt question state from runtime/application layer |
| Result | REAL | Finalized attempt, real answers, real subject breakdown |
| Review | REAL | Actual frozen questions resolved through `getAttemptReview()` |
| Teoriboken | REAL | Canonical runtime topics/lessons; no separate chapter copy |
| Profile | REAL | Actual progress facts, completed attempts and Supabase configuration state |

Totals:

- UI screens audited: 17
- REAL: 17
- MIXED: 0
- MOCK: 0

## Fixes Made

- Removed placeholder learner identity from active Home/Profile rendering.
- Removed unbacked Profile rows for saved items and subscription/account copy.
- Changed Prov duration display to read from canonical `timeLimitSeconds`.
- Aligned runtime D1 subject order with the audit-required progression.
- Aligned the D1 work-environment subject title with the audit-required wording.

Active mock/prototype artifacts removed: 3.

## Canonical Flow Checks

| Area | Result | Evidence |
| --- | --- | --- |
| D1 learning path real | yes | Test asserts exact published D1 subject list/order from runtime metadata. |
| D2 learning path real | yes | Test asserts exact published D2 subject list from runtime metadata. |
| Lessons canonical | yes | Lesson route uses `loadRuntimeRepository()` and authored content blocks. |
| Teoriboken canonical | yes | Teoriboken derives chapters from runtime topics and lessons. |
| D1 mock canonical | yes | Mock route uses active domain blueprint and subject-scoped D1 banks. |
| D2 mock canonical | yes | Mock route uses active domain blueprint and subject-scoped D2 banks. |
| Results real | yes | Result route reads the finalized attempt and persisted answers from runtime state. |
| Revisit recommendations real | yes | Recommendations derive from incorrect question traceability to lessons. |
| Content-loading gates | yes | Active routes do not import `learningStore` or `vilotiderRepository`. |

## Remaining Notes

- `src/lib/learningStore.ts` and `packages/domain/src/vilotiderRepository.ts` remain compatibility/test adapters. They are not imported by active app routes.
- `RUNTIME_USER_ID = 'local-demo-user'` remains an internal local runtime owner for offline state. It is no longer displayed as a fake user name in active UI.
- Live Supabase verification is documented separately in `docs/supabase-live-e2e-verification.md`.
