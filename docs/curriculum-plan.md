# Curriculum Plan

## Existing Repository Snapshot

The repository already had an Expo/React Native app with a working demo learning slice. The current domain layer lives in `packages/domain/src` and includes types for course, exam, subject, topic, lesson, question versions, attempts, answers, progress facts, and a blueprint engine. The UI lives under `src/app` and renders the local demo data through `src/lib/learningStore.ts`.

The existing database foundation is in `supabase/migrations/202609090001_learning_foundation.sql`. It already models courses, exams, subjects, topics, lessons, sources, questions, question versions, blueprints, assessments, attempts, attempt questions, answers, and RLS for learner-owned data.

## Architecture Conflicts Found

- `subjects` did not yet preserve stable keys, exact official names, source references, or active flags.
- `exams` did not yet store official pass scores, non-scoring test question counts, displayed question totals, time limits, or the six-month combined validity rule.
- `sources` did not yet include stable keys or source type.
- There was no `curriculum_requirements` model for official TSFS knowledge requirements.
- There were no join tables for requirement -> topic, requirement -> lesson, or question version -> requirement traceability.
- The existing lesson/topic status enum was product-content oriented (`draft`, `review`, `published`, `archived`) and did not support the requested curriculum workflow (`planned`, `sourcing`, `authored`, `reviewed`, `verified`, `published`, `archived`).
- The demo Vilotider content in `packages/domain/src/demoData.ts` remains placeholder content and is not final official theory copy.

These were addressed by adding `data/curriculum/requirements.json`, curriculum domain types, validation tests, and a second Supabase migration for the official curriculum foundation.

## Source Inspection

Primary source inspected:

- `TSFS 2021_119k.pdf`: consolidated TSFS 2021:119 with amendments through TSFS 2024:3. This contributes chapter 2 exam configuration and chapter 3 knowledge requirements for written theory exams.

Amendment source inspected:

- `TSFS 2024_3.pdf`: amendment text that changes areas including application/renewal, identification/prov barriers, licence format/placement, and reporting.

Based on the inspected amendment text, TSFS 2024:3 changes 1 kap. 1 §, 7 kap. 1 §, and 8 kap. It does not directly amend chapter 3 §§ 2-35 in the inspected PDF. Therefore, for this milestone it affects general taxiförarlegitimation information, but not the written exam curriculum mapping extracted from chapter 3. This should be reviewed again whenever a new consolidated regulation is imported.

## Implemented Curriculum Foundation

- Official exam configuration for Delprov 1 and Delprov 2 is stored in machine-readable data.
- All ten official subject areas are represented with stable keys and official Swedish names.
- TSFS 2021:119 chapter 3 §§ 2-35 is represented by active curriculum requirements.
- Binding provisions and allmänna råd are distinguished through `legal_status`.
- Proposed topics are pedagogical containers, not official Transportstyrelsen categories.
- The Vilotider vertical slice is represented as planned lesson containers mapped to 3 kap. 32 §.

## Next Changes

1. Add a JSON import/seed script that loads `data/curriculum/requirements.json` into Supabase.
2. Replace old placeholder demo topics/lessons with requirement-linked curriculum containers.
3. Add a source review workflow before writing final lesson explanations.
4. Connect Supabase and move learner progress from local demo storage to authenticated database rows.
