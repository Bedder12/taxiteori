# D2 Quality Audit

Audit date: 2026-09-10

Scope: D2_TAXI_LAW, D2_TRAFFIC_LAW, all published lessons, questions, topic checkpoints, subject checkpoints and the full D2 mock exam.

## Executive Result

The D2 study domain passes the automated quality gate after one documented mock-exam fix: the full mock now has a displayed-question selector that returns 46 scored questions plus 4 non-scoring simulation questions without duplicates.

No content was held for review. No question currently depends on a missing visual asset for its correct answer.

## Totals Reviewed

| Item | Count |
| --- | ---: |
| Published D2 topics | 27 |
| Published lessons | 32 |
| Published questions | 310 |
| Verified facts | 153 |
| Topic checkpoints | 27 |
| Subject checkpoints | 1 |
| Full D2 mock blueprints | 1 |

## Content Duplication

| Check | Result |
| --- | ---: |
| Exact duplicate question prompts | 0 |
| Exact duplicate answer sets | 0 |
| Near-duplicate question pairs within same topic | 89 |
| Substantially similar cross-topic lessons | 1 |

Audit judgment: the largest repetition pattern is deliberate source-recall reinforcement in generated checkpoint questions. Exact duplicates were not found. Near-duplicates should be monitored as the question bank becomes more scenario-rich.

## Question Quality

| Check | Result |
| --- | ---: |
| Questions with one clearly addressable correct answer issue | 0 |
| Questions with weak explanation support | 0 |
| Mixed English/Swedish wording found in prompts/explanations | 0 |
| Visual-blocked published questions | 0 |

Manual review notes:
- Explanations consistently start by explaining the correct answer and point back to a lesson.
- Current traffic-law generated questions are clear but often recognition-heavy. This is acceptable for the first quality gate, but APPLY and ASSESS requirements should get more bespoke scenario variants before production launch.
- No trick phrasing was identified as necessary.

## Coverage Balance

| Requirement | Subject | Competency | Facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| D2-TAXI-030-001 | D2_TAXI_LAW | UNDERSTAND | 5 | 2 | 18 | 6 | 0 |
| D2-TAXI-031-001 | D2_TAXI_LAW | APPLY | 5 | 1 | 15 | 5 | 0 |
| D2-TAXI-031-002 | D2_TAXI_LAW | KNOW | 6 | 2 | 17 | 6 | 0 |
| D2-TAXI-031-003 | D2_TAXI_LAW | KNOW | 5 | 1 | 15 | 5 | 0 |
| D2-TAXI-031-004A | D2_TAXI_LAW | EXPLAIN | 1 | 1 | 3 | 1 | 0 |
| D2-TAXI-031-004B | D2_TAXI_LAW | ASSESS | 4 | 1 | 12 | 4 | 0 |
| D2-TAXI-031-005 | D2_TAXI_LAW | KNOW | 5 | 1 | 15 | 5 | 0 |
| D2-TAXI-031-006 | D2_TAXI_LAW | APPLY | 1 | 1 | 3 | 1 | 0 |
| D2-TAXI-031-007 | D2_TAXI_LAW | KNOW | 6 | 1 | 12 | 4 | 0 |
| D2-TAXI-031-008 | D2_TAXI_LAW | APPLY | 8 | 1 | 15 | 5 | 0 |
| D2-TAXI-032-001 | D2_TAXI_LAW | EXPLAIN | 7 | 4 | 11 | 2 | 5 |
| D2-TAXI-032-002 | D2_TAXI_LAW | UNKNOWN | 20 | 4 | 28 | 11 | 0 |
| D2-TAXI-032-003 | D2_TAXI_LAW | CALCULATE | 5 | 3 | 10 | 2 | 5 |
| D2-TAXI-033-001 | D2_TAXI_LAW | EXPLAIN | 10 | 2 | 23 | 8 | 0 |
| D2-TRAFFIC-034-001 | D2_TRAFFIC_LAW | UNDERSTAND | 4 | 1 | 6 | 3 | 0 |
| D2-TRAFFIC-034-002 | D2_TRAFFIC_LAW | UNDERSTAND | 5 | 4 | 10 | 5 | 0 |
| D2-TRAFFIC-035-001 | D2_TRAFFIC_LAW | APPLY | 14 | 4 | 22 | 11 | 0 |
| D2-TRAFFIC-035-002 | D2_TRAFFIC_LAW | APPLY | 33 | 9 | 64 | 32 | 0 |
| D2-TRAFFIC-035-003A1 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003A2 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003A3 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003B1 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 1 | 0 | 1 |
| D2-TRAFFIC-035-003B2 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 1 | 0 | 1 |
| D2-TRAFFIC-035-003C1 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003C2 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003C3 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |
| D2-TRAFFIC-035-003C4 | D2_TRAFFIC_LAW | EXPLAIN | 1 | 1 | 2 | 0 | 2 |

Undercovered requirements: D2-TAXI-031-004A, D2-TAXI-031-006, D2-TRAFFIC-035-003A1, D2-TRAFFIC-035-003A2, D2-TRAFFIC-035-003A3, D2-TRAFFIC-035-003B1, D2-TRAFFIC-035-003B2, D2-TRAFFIC-035-003C1, D2-TRAFFIC-035-003C2, D2-TRAFFIC-035-003C3, D2-TRAFFIC-035-003C4.

Overcovered requirements: D2-TAXI-032-002, D2-TAXI-033-001, D2-TRAFFIC-035-001, D2-TRAFFIC-035-002.

Competency alignment issues requiring follow-up: D2-TAXI-031-001, D2-TAXI-031-004B, D2-TAXI-031-006, D2-TAXI-031-008.

## Mock Exam Quality

| Seed | Scoring | Displayed | Taxi scoring | Traffic scoring | Non-scoring | Duplicate questions | Topic spread | Deterministic scoring | Frozen versions |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| audit-a | 46 | 50 | 23 | 23 | 4 | 0 | 20 | yes | yes |
| audit-b | 46 | 50 | 23 | 23 | 4 | 0 | 23 | yes | yes |
| audit-c | 46 | 50 | 23 | 23 | 4 | 0 | 22 | yes | yes |
| audit-d | 46 | 50 | 23 | 23 | 4 | 0 | 23 | yes | yes |
| audit-e | 46 | 50 | 23 | 23 | 4 | 0 | 23 | yes | yes |

Mock exam status: passes the D2 blueprint gate. It is a realistic internal mock exam, not an official Trafikverket exam.

## Pedagogical Flow

D2_TAXI_LAW order is sound: foundations, driver legitimacy, revocation, definitions, documents, permits, equipment, price, rest, working time, school transport and sanctions.

D2_TRAFFIC_LAW order is sound with one watch item: definitions and weight concepts are currently placed at the end, which works for exam review, but if learners struggle with terms in earlier road-rule lessons they may benefit from a short prerequisite definition primer later. No reorder is required for this gate.

## Source Consistency

No direct contradiction was found between lessons and questions. Rules are consistently traced to source IDs and exact references.

Primary source currency spot-check:
- Trafikförordningen (1998:1276): Riksdagen shows ändrad t.o.m. SFS 2026:1052.
- Vägmärkesförordningen (2007:90): Riksdagen source map verified.
- Lag (2001:559) om vägtrafikdefinitioner: Riksdagen source map verified.
- Taxitrafiklagen and connected taxi-law sources remain mapped through the D2 taxi-law source map.

## Visual Dependency

The following topics need future custom/generated visuals or diagrams. Current published questions do not require a missing image to answer.

| Topic | Needed visual |
| --- | --- |
| Grundläggande trafikregler | genererade vägscener för scenarioövning |
| Väjningsregler | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Hastighet | genererade vägscener för scenarioövning |
| Placering och körfält | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Korsningar | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Cirkulationsplatser | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Omkörning | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Stannande och parkering | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Gående och cyklister | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Buss, spårväg och järnväg | enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Vägmärken | egna vägmärkes-/vägmarkeringsbilder, genererade vägscener för scenarioövning |
| Vägmarkeringar | egna vägmärkes-/vägmarkeringsbilder, enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Trafiksignaler och andra anordningar | egna vägmärkes-/vägmarkeringsbilder, enkla regel- eller körfältsdiagram, genererade vägscener för scenarioövning |
| Viktbegrepp | enkla regel- eller körfältsdiagram |

## Changes Made From Audit

Questions changed: generated D2 taxi-law remainder and D2 traffic-law questions were regenerated with topic/case-specific prompts and distractors after the duplicate prompt gate found repeated generated review cases.

Lessons changed: 0.

Engine/model changes: added displayed mock-question selection with scoring roles for 46 scored + 4 non-scoring simulation questions.

Content held for review: 0.

## Automated Quality Rules Added

- Duplicate stable key detection.
- Duplicate question prompt detection.
- Duplicate answer-set detection.
- Published visual questions require a concrete asset if their answer depends on an image.
- Published questions require explanations.
- Published questions require valid question -> lesson -> fact -> requirement -> source traceability.
- Mock displayed attempts contain no duplicate questions and preserve the 46 + 4 structure.
