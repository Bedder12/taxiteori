# Beta Readiness Audit

Generated: 2026-10-07

## Status

- Curriculum completeness: PASS
- Question coverage: PASS
- Visual completeness: PASS
- Mock readiness: PASS
- UI real-data audit: PASS
- Bundle/loading readiness: FAIL
- Supabase environment variables: PASS
- Supabase project reachability: PASS
- Supabase live Auth: PASS
- Supabase live persistence: PASS
- Supabase live checkpoint resume: PASS
- Supabase live D1 resume: PASS
- Question bank topic/subject structural audit: PASS
- D2 taxi-law runtime loading: PASS
- D2 traffic-law runtime loading: PASS
- Vilotider lesson loading: PASS
- Vilotider checkpoint question selection: PASS
- Taxi-law authored topic checkpoint assessments: PASS
- D2 taxi-law subject checkpoint requirement: PASS
- D2 mock local runtime construction: PASS
- Supabase live D2 resume: PASS
- Supabase live timeout: PASS
- Supabase live RLS: PASS
- Supabase live idempotency: PASS
- Supabase live immutability: PASS

## D2 Blocker Verification

- All 824 questions now have valid topic IDs; no invalid topic IDs, wrong-subject topic mappings or duplicate stable-key/version pairs were found.
- The 27 Vilotider questions and all 6 Vilotider lessons use `topic_d2_taxi_vilotider`.
- Question text, answers, explanations, scoring and source references changed: 0.
- The D2 mock builds locally as 50 displayed / 46 scoring / 4 non-scoring, with a 23/23 scoring allocation and no duplicate, invalid version/relation or visual-required blockers.
- Canonical Taxi-law content defines 12 topic checkpoint assessments and no subject checkpoint. No existing product/domain contract requires a Taxi-law subject checkpoint; absence is valid and is not replaced with generated content.
- Traffic-law retains 15 topic checkpoints and its authored subject checkpoint. Subject-checkpoint rendering is data-driven and omits the optional CTA when none exists.
- D2 live resume passed with the same attempt ID, restored answers/timer/order/versions/roles, a 50/46/4 mock, 23/23 allocation, persisted result and review.
- Live timeout, RLS isolation, idempotency and post-finalization immutability passed.
- Persistence fixes use explicit in-progress finalization and handle absent optional passing-score metadata without producing `NaN`.

## Remaining Work

Remaining P0:

- None identified by the completed D2 content and live persistence gates.

Remaining P1:

- Native Expo output is one 4.56 MB iOS / 4.87 MB Android Hermes bundle containing the D1 and D2 question-bank modules; native Metro export does not emit lazy question-bank chunks. Web startup and route-level question isolation pass, but the requested native initial-bundle split is not met.
- Verify production visual rendering in a real device build before public launch.

Remaining P2:

- Optional visual refinements for enrichment-only Service, Health/Disabilities and Work Environment/Risk scenes.

## Decision

Bundle/loading evidence:

- Production web export: PASS; initial entry is 1,661,767 bytes raw / 425,024 bytes gzip, with 39 additional JS chunks.
- Cold web Home requests the entry only. D1 mock requests only D1 question chunks; D2 mock requests only D2 question chunks.
- Native iOS/Android export: FAIL for the requested split; each platform emits one HBC bundle containing all authored question-bank modules.
- Route regression tests verify metadata-only screens, question-only routes, lesson-only routes, and D1/D2 subject isolation.

Beta-ready: NO

Reason: D2 source-authored assessments and all requested D2 live gates are PASS. Beta remains blocked by native bundle/loading readiness (FAIL) and real-device visual rendering (NOT_TESTED).
