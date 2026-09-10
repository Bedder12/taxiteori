# D1 Arbetsmiljö, omdöme och riskmedvetenhet

## Scope

- Subject: `D1_WORK_ENVIRONMENT_RISK`
- Official authority: TSFS 2021:119, 3 kap. 19-22 §§
- Active requirements: 12
- Status: published after automated quality gates
- No full D1 mock exam, AI tutor, payments, videos, translations, readiness scoring or admin redesign added

## Requirement Coverage

All 12 active requirements are mapped in `data/curriculum/d1-work-environment-risk-sources.json`:

- 3 kap. 19 §: work risks
- 3 kap. 20 § 1-3: load injuries, lifting/help aids and driving posture
- 3 kap. 21 § 1-7: medicines, alcohol/drugs, fatigue, physical condition, psychological balance, diet and work/rest cycle
- 3 kap. 22 §: mobile phone, communication equipment, taximeter and navigation during driving

The source map preserves the official requirement keys, paragraph references, competency granularity and binding curriculum status.

## Content Inventory

- 6 pedagogical topics; these are internal groupings, not official Transportstyrelsen headings
- 29 verified facts/principles
- 6 mobile-first lessons
- 29 published scenario questions
- 6 topic checkpoints
- 1 subject checkpoint with 24 questions and broad topic sampling
- 6 visual metadata entries; no published question depends on a placeholder asset

Topics:

1. Arbetsrisker i taxiarbetet
2. Belastning, lyft och hjälpmedel
3. Körställning och variation
4. Påverkan och körförmåga
5. Trötthet, stress och arbetscykel
6. Utrustning och riskmedvetenhet under färd

## Authority Status

Facts distinguish:

- `binding_rule`: curriculum or legal requirement
- `official_guidance`: Transportstyrelsen/Trafikverket guidance
- `occupational_safety_guidance`: Arbetsmiljöverket guidance
- `authoritative_health_guidance`: 1177 guidance used only for impairment effects

Fatigue, stress, alcohol, drugs, medicines, illness and diet are taught as risk and judgement issues. No unsupported equivalent-alcohol, reaction-time or other numeric fatigue claims were added.

## Cross-Subject Boundaries

Legitimate overlaps are documented through the competency angle:

- D1 Säkerhet covers traffic consequences; this subject covers the driver's decision to stop, recover or change the work method.
- D1 Bemötande covers communication with passengers; this subject covers work pressure, conflict risk and the driver's safety decision.
- D1 Sjukdomar och funktionsnedsättningar covers passenger transport awareness; this subject covers the driver's own fitness to perform work safely.
- D1 Körekonomi and Miljö cover driving style and vehicle impact; this subject covers fatigue, time pressure and equipment distraction as work risks.
- D1 Fordonskännedom covers vehicle function; this subject covers safe use of taximeter, navigation and communication equipment during work.

The cross-subject quality gate found no exact duplicate prompts and rejects moralizing or absolute wording in this question bank.

## Review Notes

- Visuals remain metadata placeholders and are non-blocking.
- No unresolved source mappings remain.
- Questions are source-traceable through question -> lesson -> fact -> requirement -> source.
- Occupational-health content is limited to taxi-relevant risks and practical decisions.

## Tests

Passed:

- `npm run typecheck`
- `npm test`
- Requirement source coverage
- Fact, lesson and question traceability
- Duplicate stable keys, prompts and answer sets
- Scenario-only question quality gate
- Topic and subject checkpoint validity and breadth
- Plugga exposure of all eight D1 subjects
- Cross-subject duplicate gate
- Existing D1/D2 regression suite