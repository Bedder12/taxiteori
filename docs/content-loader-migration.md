# Content Loader Migration

Date: 2026-09-10

## Previous Active Path

All app screens imported `src/lib/learningStore.ts`, which statically imported `packages/domain/src/vilotiderRepository.ts`. That repository imported all D1/D2 facts, lessons and questions at module evaluation time.

## Runtime Target

| Caller | Previous data need | Runtime path |
| --- | --- | --- |
| Plugga overview | exams, subjects, progress metadata | `getRuntimeMetadataRepository()` + runtime state |
| Exam overview | exam, subjects, topic metadata | `getRuntimeMetadataRepository()` |
| Prov overview | active blueprints and exams | `getRuntimeMetadataRepository()` |
| Subject | one subject topics, lesson metadata, questions only when needed | `loadRuntimeRepository([subjectId])` |
| Topic | owning subject lesson/question content | `loadRuntimeRepository([subjectId])` |
| Lesson | owning subject lesson blocks | `loadRuntimeRepository([subjectId])` |
| Topic checkpoint | owning subject question pool | `loadRuntimeRepository([subjectId])` |
| Subject checkpoint | owning subject question pool | `loadRuntimeRepository([subjectId])` |
| D1 mock | eight D1 subject banks only | `loadRuntimeRepository(D1 subject ids)` |
| D2 mock | taxi-law and traffic-law banks only | `loadRuntimeRepository(D2 subject ids)` |
| Result/review | subjects referenced by frozen attempt questions | `loadRuntimeRepository(attempt subject ids)` |

## New Runtime API

- `getRuntimeMetadataRepository()` returns compact course/exam/subject/topic/lesson/assessment/blueprint metadata.
- `loadRuntimeRepository(subjectIds)` dynamically loads only the requested subject content and adapts it to the existing domain types.
- `contentLoader.ts` owns all JSON dynamic imports; UI screens do not import JSON directly.
- `runtimeLearningState.ts` owns active app state, resume, answer persistence and attempt finalization without importing the aggregate repository.

## Compatibility

`packages/domain/src/vilotiderRepository.ts` and `src/lib/learningStore.ts` remain as compatibility adapters for domain tests and content/audit scripts. No active route imports them.

## Bundle Measurement

Previous baseline from the same Expo web export method:

- initial JS: 4.2 MB
- authored JSON: 2.68 MiB
- question JSON: 1.51 MiB
- 49 JSON files

After migration:

- initial `entry` JS: approximately 2.4 MB
- subject content emitted as separate dynamic chunks
- 36 web JS/CSS bundles emitted, including separate D1/D2 facts, lessons and questions
- authored static JSON remains 2.68 MiB on disk; it is no longer in the initial entry chunk

The initial bundle reduction is approximately 1.8 MB. Route-level network loading was not measured with a browser network trace in this workspace; chunk emission and initial bundle composition were verified from the Expo export output.

## Loading States

Subject, topic, lesson, checkpoint, mock and result screens now expose loading and recoverable failure states while scoped content is loading. Metadata-first screens do not show false empty-content states during the request.