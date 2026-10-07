# Beta Readiness Audit

Generated: 2026-10-07

## Status

- Curriculum completeness: PASS
- Question coverage: PASS
- Visual completeness: PASS
- Mock readiness: PASS
- UI real-data audit: PASS
- Bundle/loading readiness: PASS
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

## Bundle/Loading Readiness

- Runtime startup reads compact metadata (126,172 bytes, about 123 KiB) and persisted progress; it does not deserialize or instantiate the 824-question bank.
- Home uses metadata and progress only. D1 and D2 assessment routes invoke subject-scoped question loaders; regression coverage verifies the returned D1/D2 banks do not include the other exam's questions.
- Lesson/module routes load lesson JSON for the selected subject only. Teoriboken search uses the indexed lesson-title metadata without loading lesson bodies.
- Production web, iOS and Android exports: PASS. Web entry: 1,660,201 bytes raw / 423,794 bytes gzip; iOS HBC: 4,554,519 bytes (~4.56 MB); Android HBC: 4,874,448 bytes (~4.87 MB).
- Native Expo/Hermes production builds package JavaScript into a single platform HBC. Web-style production code splitting is not treated as a beta requirement. Runtime data initialization remains scoped.
- Production-host dynamic deep-link refresh: NOT_TESTED / deployment-specific. The local static-server fallback result is not evidence of a production routing defect and is separate from bundle/loading readiness.

## Remaining Work

Remaining P0:

- None identified by the completed D2 content, persistence and bundle/loading gates.

Remaining P1:

- Verify production visual rendering and real-device performance in a real device build before public launch (NOT_TESTED).

Remaining P2:

- Optional visual refinements for enrichment-only Service, Health/Disabilities and Work Environment/Risk scenes.

## Decision

Beta-ready: NO

Reason: D2 source-authored assessments and all requested D2 live gates are PASS. Bundle/loading readiness is PASS. Real-device visual rendering and performance QA remain NOT_TESTED and are the next/final beta-readiness phase. Production-host dynamic deep-link refresh is also NOT_TESTED / deployment-specific and must be verified against the actual host, independently of bundle/loading readiness.
