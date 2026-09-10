# D1 Miljö Quality Audit

Generated: 2026-09-10

## Scope

- Subject: D1_ENVIRONMENT
- Official curriculum: TSFS 2021:119, 3 kap. 6-9 §§
- Pipeline: official requirement -> authoritative source expansion -> verified facts -> pedagogical topics -> mobile lessons -> source-backed questions -> checkpoints -> Plugga integration -> tests -> quality audit
- Exclusions respected: no Säkerhet, Bemötande, Fordonskännedom, Arbetsmiljö/risk, Sjukdomar/funktionsnedsättningar, AI, payments, videos, translations, pass guarantee, readiness scoring or admin redesign.

## Summary

- Requirements reviewed: 8
- Sources reviewed: 14
- Verified facts reviewed: 39
- Published lessons reviewed: 7
- Published questions reviewed: 56
- Scenario questions: 40
- Calculation questions: 0
- Topic checkpoints: 7
- Subject checkpoints: 1
- Visual-dependent items: 63
- Content held for review: 0

## Source Completeness

All D1_ENVIRONMENT requirements have the primary legal curriculum source and at least one official explanatory/statistical source where factual detail is taught.

- Missing source mappings: none
- Unresolved source mappings: none

Primary and official sources used:

- TSFS_2021_119_CONSOLIDATED: Transportstyrelsen, primary_legal_source, VERIFIED
- TS_AVGASER: Transportstyrelsen, official_explanatory_source, VERIFIED
- TS_BULLER: Transportstyrelsen, official_explanatory_source, VERIFIED
- TS_DACK_PERSONBIL: Transportstyrelsen, official_explanatory_source, VERIFIED
- EM_DACK_ENERGIMARKNING: Energimyndigheten, official_explanatory_source, VERIFIED
- NV_LUFTFORORENINGAR_EFFEKTER: Naturvårdsverket, official_explanatory_source, VERIFIED
- NV_TRANSPORTER_KLIMAT: Naturvårdsverket, official_explanatory_source, VERIFIED
- NV_TRANSPORTER_UTSLAPP: Naturvårdsverket, official_statistics_source, VERIFIED
- EM_DRIVMEDEL: Energimyndigheten, official_statistics_source, VERIFIED
- TS_SPARSAM_KORNING: Transportstyrelsen, official_explanatory_source, VERIFIED
- TRV_HASTIGHET_HALLBARHET: Trafikverket, official_explanatory_source, VERIFIED
- KV_HALLBART_BILAGANDE: Konsumentverket, official_explanatory_source, VERIFIED
- NV_BILSKROTNING: Naturvårdsverket, official_explanatory_source, VERIFIED
- NV_SPILLOLJA: Naturvårdsverket, official_explanatory_source, VERIFIED

## Requirement Coverage

| Requirement | Competency | Facts | Lessons | Questions | Scenario | Calculation |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| D1-ENV-006-001 | UNDERSTAND | 5 | 1 | 8 | 4 | 0 |
| D1-ENV-007-001 | KNOW | 5 | 1 | 8 | 4 | 0 |
| D1-ENV-007-002 | KNOW | 5 | 1 | 8 | 4 | 0 |
| D1-ENV-007-003 | EXPLAIN | 6 | 1 | 8 | 4 | 0 |
| D1-ENV-008-001 | EXPLAIN | 3 | 1 | 4 | 4 | 0 |
| D1-ENV-008-002 | EXPLAIN | 3 | 1 | 4 | 4 | 0 |
| D1-ENV-009-001 | ASSESS | 6 | 1 | 8 | 8 | 0 |
| D1-ENV-009-002 | ASSESS | 6 | 1 | 8 | 8 | 0 |

Undercovered requirements: none

Overcovered requirements: none

## Topic Balance

| Topic | Facts | Lessons | Questions | Scenario | Calculation | Checkpoint questions | Visual metadata |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Fordonets miljöpåverkan | 5 | 1 | 8 | 4 | 0 | 5 | diagram, comparison |
| Motorer, bränslen och fordonsvätskor | 5 | 1 | 8 | 4 | 0 | 6 | image, comparison |
| Avgaser och reningssystem | 5 | 1 | 8 | 4 | 0 | 6 | diagram, comparison |
| Däck och miljö | 6 | 1 | 8 | 4 | 0 | 6 | image, comparison |
| Miljöanpassad fordonsskötsel | 6 | 1 | 8 | 8 | 0 | 7 | image |
| Start, tomgång och buller | 6 | 1 | 8 | 8 | 0 | 7 | diagram |
| Körsätt och vägval | 6 | 1 | 8 | 8 | 0 | 7 | diagram |

The topic order is internal and pedagogical: overall vehicle impact first, then technology/fuels, exhaust treatment, tyres, vehicle care/waste, start/idling/noise, and finally driving style/route choice.

## Duplication And Cross-Subject Overlap

- Duplicate fact texts within Miljö: none
- Exact duplicate Miljö prompts: none
- Exact duplicate Miljö answer sets: none
- Exact prompt duplicates vs Körekonomi: none
- Shared correct-answer wording vs Körekonomi: none
- Invalid cross-subject fact links: none

Known overlap with Körekonomi is intentionally framed differently: Körekonomi asks what improves fuel economy; Miljö asks what the environmental, health, noise or waste effect is.

## Question Quality

- Ambiguous questions: none detected
- Weak explanations: none detected
- One correct answer: verified by automated tests.
- Difficulty: easy/medium/hard spread is retained, with no unsupported calculations.
- Competency alignment: KNOW/UNDERSTAND/EXPLAIN requirements use recognition, concept or scenario questions; § 9 assessment requirements use environmental scenarios.

## Traceability

Traceability chain required: question -> lesson -> fact -> requirement -> source.

- Traceability issues: none
- Every lesson has requirement keys, fact keys and source references.
- Every question has lesson key, fact keys, requirement keys and exact source references.

## Language And Terminology

Swedish wording was reviewed for mobile readability, taxi relevance and environmental precision. Terminology is kept consistent around "miljöpåverkan", "utsläpp", "luftföroreningar", "avgasrening", "däck", "tomgång", "buller", "restprodukter" and "vägval".

No intentional trick phrasing, mixed UI labels or unsupported legal simplifications were found.

## Visual Dependency

- Visual-dependent lessons/questions marked for future image/diagram/comparison support: 63
- Visual-blocked questions: none

Visual metadata was added for exhaust treatment systems, tyre comparison, vehicle fluids/rest products, noise/start effects and driving-style diagrams. No question requires a missing visual to answer.

## Checkpoints

- Topic checkpoint selection: proportional to available pools, not forced to the same size for every topic.
- Subject checkpoint selection: broad sample across all seven Miljö topics.
- Frozen versions: uses the existing attempt/result flow and checkpoint engine.

## Automated Tests Added

- Every D1_ENVIRONMENT requirement is sourced.
- Every published fact has source traceability.
- Every lesson maps to requirements/facts and has visual metadata.
- Every question has full traceability.
- Topic checkpoint selection works.
- Subject checkpoint selection works.
- No duplicate stable keys in Miljö content.
- No exact duplicate prompts.
- No exact duplicate answer sets.
- Cross-subject duplicate audit against D1_ECO_DRIVING.
- Plugga flow exposes Miljö correctly.

## Result

Status: PASS

Published:

- Fordonets miljöpåverkan
- Motorer, bränslen och fordonsvätskor
- Avgaser och reningssystem
- Däck och miljö
- Miljöanpassad fordonsskötsel
- Start, tomgång och buller
- Körsätt och vägval

Held for review: none
