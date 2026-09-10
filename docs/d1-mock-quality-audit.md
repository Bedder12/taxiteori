# D1 Full Mock Quality Audit

## Blueprint

- Status: publishable by automated quality gates
- Blueprint: `blueprint_d1_realistic_full_mock_v1`
- Version: 1
- Scoring questions: 65
- Non-scoring simulation questions: 5
- Displayed questions: 70
- Passing score: 48/65
- Time limit: 3000 seconds
- Structure: matches the requested official allocation, while questions remain internal training questions
- Disclaimer: the mock is not Trafikverket's question bank and the five simulation items are not claimed to correspond to actual trial questions

## Pool Capacity

| Subject | Required per attempt | Eligible pool | Pool / requirement |
| --- | ---: | ---: | ---: |
| Navigering | 10 | 42 | 4.20x |
| Körekonomi | 6 | 34 | 5.67x |
| Miljö | 6 | 56 | 9.33x |
| Säkerhet | 10 | 80 | 8.00x |
| Bemötande | 12 | 69 | 5.75x |
| Sjukdomar och funktionsnedsättningar | 8 | 42 | 5.25x |
| Arbetsmiljö, omdöme och riskmedvetenhet | 6 | 29 | 4.83x |
| Fordonskännedom | 7 | 107 | 15.29x |

Eligibility requires published status, assessment context, requirement/fact/source traceability and no blocked visual-required asset. Every subject has sufficient capacity for the official allocation; the smallest retake pool is Arbetsmiljö at 4.83x.

## Simulation Audit

- Simulated attempts: 25
- Allocation failures: 0
- Duplicate-within-attempt failures: 0
- Scoring-count failures: 0
- Non-scoring-count failures: 0
- Displayed-count failures: 0
- Draft/archived eligibility failures: 0
- Blocked visual-required questions selected: 0
- Frozen-version failures: 0
- Frozen scoringRole failures: 0
- Subject-breakdown failures: 0
- Retake identity failures: 0
- Repetition across retakes: allowed and observed; no zero-repetition requirement is imposed

## Scoring and Attempt Semantics

The engine scores only frozen questions with `scoringRole: scored`. Simulation items remain in the frozen attempt and answer review but have zero effect on score, pass/fail or subject denominator. Attempts preserve selected question version, subject, scoring role, order, blueprint version, timer limit and timeout state. Retakes create separate attempts.

## Visual Gate

The combined visual audit found 0 visual-required exclusions across Navigering, Miljö, Fordonskännedom, Säkerhet, Bemötande, Sjukdomar/funktionsnedsättningar and Arbetsmiljö/risk. Visual metadata remains enrichment-only for the current mock pool.

## Unresolved Issues

- The UI timer records timeout state and submits unanswered items as incorrect; background persistence beyond the existing local learning store is outside this task.
- Subject breakdown is shown after completion and remains separate from lesson progress, topic mastery and readiness.

## Tests

Passed:

- `npm run typecheck`
- `npm test`
- Exact 10/6/6/10/12/8/6/7 allocation
- 65 scored, 5 simulation and 70 displayed questions
- 48 passing score and 3000-second timer metadata
- Eligibility and visual gate
- 25-attempt variation audit
- Frozen question versions and scoring roles
- Scoring ignores simulation items
- Subject breakdown sums to 65
- Separate immutable retakes

## Publishability

**Yes, as an internal realistic D1 mock exam.** It must not be presented as Trafikverket's real question bank or as a reproduction of actual trial questions.