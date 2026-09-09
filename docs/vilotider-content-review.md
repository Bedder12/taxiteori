# Vilotider Content Review

Status: published vertical slice, verified 2026-09-09.

This topic is an internal learning/checkpoint slice for D2 Taxitrafiklagstiftning. It is not Trafikverket's official question bank.

## Authoritative Sources Used

| Source | Type | Exact Use |
| --- | --- | --- |
| Förordning (1994:1297) om vilotider vid vissa vägtransporter inom landet | Primary legal source | Scope, taxi/skolskjuts vehicle coverage, dygnsvila, split rest, non-rest time, temporary deviations, tidbok, employer records, control and penalties. |
| Lag (2005:395) om arbetstid vid visst vägtransportarbete | Primary legal source | Working-time responsibility, total working time, multiple employers, night work, breaks, registration, supervision. |
| Transportstyrelsen: Regler om vägarbetstid | Official explanatory source | Practical support for vägarbetstid concepts, registration and supervision. |

## Curriculum Requirements Covered

| Requirement | Coverage |
| --- | --- |
| D2-TAXI-032-001 | Vilotidsbestämmelser, scope, 11-hour rule, split rest and exceptions. |
| D2-TAXI-032-002 | Driver, employer and self-employed responsibilities under rest-time and working-time rules. |
| D2-TAXI-032-003 | Calculating and recording dygnsvila. |

## Created Artifacts

| File | Purpose |
| --- | --- |
| `data/content/d2-taxi-law/vilotider-facts.json` | Verified atomic fact records with exact legal references. |
| `data/content/d2-taxi-law/vilotider-lessons.json` | Six authored mobile-first lessons using only verified fact keys for legal statements. |
| `data/questions/d2-taxi-law/vilotider-questions.json` | 27 source-traceable questions and one internal 15-question checkpoint configuration. |

## Quality Notes

- Every authored legal statement in lesson blocks has `fact_keys`.
- Every question has requirement links, fact links, lesson link and source references.
- Calculation questions are limited to the dygnsvila requirement `D2-TAXI-032-003`.
- Archived questions are excluded by the checkpoint selection rules.
- Published content does not use unresolved facts.

## Human Review Items

None for this Vilotider slice.

Before building the next topic, use this structure as the template:

`requirement -> source map -> verified facts -> lesson blocks -> questions -> checkpoint -> traceability tests`
