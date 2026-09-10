# D1 Körekonomi Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_ECO_DRIVING
- Official curriculum: TSFS 2021:119, 3 kap. 4-5 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Miljö, Säkerhet, Bemötande, Fordonskännedom, AI, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: 4
- Sources reviewed: 5
- Verified facts reviewed: 21
- Published lessons reviewed: 4
- Published questions reviewed: 34
- Scenario questions: 26
- Calculation questions: 0
- Topic checkpoints: 4
- Subject checkpoints: 1
- Content held for review: 0

## Source Completeness

All D1_ECO_DRIVING requirements have a primary legal source from Transportstyrelsen and official explanatory sources where the taught fact requires operational detail.

- Missing source mappings: none
- Unresolved source mappings: none

Primary and official sources used:

- TSFS_2021_119_CONSOLIDATED: Transportstyrelsen, primary_legal_source, VERIFIED
- TS_SPARSAM_KORNING: Transportstyrelsen, official_explanatory_source, VERIFIED
- TRV_HASTIGHET_HALLBARHET: Trafikverket, official_explanatory_source, VERIFIED
- TS_DACK_PERSONBIL: Transportstyrelsen, official_explanatory_source, VERIFIED
- ENERGIMYNDIGHETEN_TRANSPORT_ATGARDER: Energimyndigheten, official_explanatory_source, VERIFIED

## Requirement Coverage

| Requirement | Competency | Facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| D1-ECO-004-001 | UNDERSTAND | 2 | 1 | 4 | 2 | 0 |
| D1-ECO-005-001 | EXPLAIN | 8 | 2 | 12 | 10 | 0 |
| D1-ECO-005-002 | EXPLAIN | 5 | 1 | 8 | 4 | 0 |
| D1-ECO-005-003 | ASSESS | 6 | 1 | 10 | 10 | 0 |

Undercovered requirements: D1-ECO-004-001

Overcovered requirements: none

## Topic Balance

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Ekonomisk körning | 5 | 1 | 8 | 4 | 0 | 6 |
| Bränsleförbrukning | 5 | 1 | 8 | 4 | 0 | 6 |
| Planering och körsätt | 5 | 1 | 8 | 8 | 0 | 6 |
| Fordonsunderhåll och körekonomi | 6 | 1 | 10 | 10 | 0 | 8 |

The topic order is pedagogical, not an official Transportstyrelsen category structure: definition and goal first, then fuel-use factors, then planning/driving style, then maintenance.

## Duplication

- Duplicate fact texts: none
- Exact duplicate question prompts: none
- Exact duplicate answer sets: none
- Near-duplicate review: question prompts intentionally reuse topic labels for traceability, but each tested prompt and answer set is unique.

## Question Quality

- Ambiguous questions: none detected
- Explanation quality: every published question includes a supporting explanation beginning with "Rätt:" and points back to a source-backed fact.
- One correct answer: verified by automated tests.
- Distractors: reviewed for natural Swedish and to avoid plausible-but-conflicting alternatives.
- Difficulty: easy/medium distribution is appropriate for a compact D1 subject; no unsupported hard/calculation questions were added.
- Competency alignment: UNDERSTAND and EXPLAIN requirements use recall, conceptual or practical scenario questions. Maintenance/judgment content uses scenarios without unsupported calculations.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: none
- Every lesson has requirement keys, fact keys and source references.
- Every question has lesson key, fact keys, requirement keys and exact source references.

## Language Quality

Swedish wording was reviewed for mobile readability and taxi-driver relevance. Terminology is kept consistent around "körekonomi", "sparsam körning", "bränsleförbrukning", "framförhållning", "ruttplanering" and "förebyggande fordonsunderhåll".

No mixed UI labels, unsupported legal simplifications or intentionally tricky phrasing were found.

## Visual And Calculation Dependency

- Visual/map-dependent items: 0
- Visual-blocked questions: none
- Calculation questions: 0

Körekonomi does not require copyrighted map assets. No question depends on a missing visual.

## Checkpoints

- Topic checkpoint selection: proportional to available pools, not forced to 15 questions.
- Subject checkpoint selection: broad sample across all four Körekonomi topics.
- Frozen versions: uses the existing attempt/result flow and checkpoint engine.

## Automated Tests Added

- Every D1_ECO_DRIVING requirement is sourced.
- Every published lesson maps to requirements and facts.
- Every published question has full traceability.
- Topic checkpoint selection works.
- Subject checkpoint selection works.
- No duplicate stable keys in Körekonomi content.
- No exact duplicate prompts.
- No exact duplicate answer sets.
- Plugga flow exposes Körekonomi correctly.
- D1 scope guard confirms only Navigering and Körekonomi are published D1 subjects.

## Result

Status: PASS

Published:

- Ekonomisk körning
- Bränsleförbrukning
- Planering och körsätt
- Fordonsunderhåll och körekonomi

Held for review: none
