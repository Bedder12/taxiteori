# Content Loading and Bundle Readiness

Date: 2026-10-07

## Original Readiness Finding

The beta audit marked bundle/loading readiness FAIL without naming a size threshold or a failing build. This document recorded that route-level network loading had not been measured. The production export and route requests are now measured below.

The active route graph had an additional, concrete overfetch: subject, topic, lesson, checkpoint, mock and result routes all called the full subject repository loader. That loader imported facts, lessons, questions and some visual metadata even when the route needed only metadata, lesson bodies or questions.

## Active Runtime Loading

| Caller | Previous data need | Runtime path |
| --- | --- | --- |
| App startup / Home / Plugga / D1-D2 path / Subject / Topic / Prov / Profile | shell, progress and lightweight course index | `getRuntimeMetadataRepository()` + runtime state; no authored content loader |
| Lesson / module | lesson bodies for the selected subject | `loadRuntimeLessonRepository(subjectIds)` |
| Topic or subject checkpoint | questions for the assessment's subject | `loadRuntimeQuestionRepository([subjectId])` |
| D1 mock | D1 question banks only | `loadRuntimeQuestionRepository(D1 subject ids)` |
| D2 mock | D2 question banks only | `loadRuntimeQuestionRepository(D2 subject ids)` |
| Result/review | question versions for subjects in the frozen attempt plus indexed lesson metadata | `loadRuntimeQuestionRepository(attempt subject ids)` |
| Teoriboken and search | runtime topic/subject/lesson-title index | `getRuntimeMetadataRepository()`; no lesson bodies or question banks |

## New Runtime API

- `getRuntimeMetadataRepository()` returns compact course/exam/subject/topic/lesson/assessment/blueprint metadata.
- `loadRuntimeQuestionRepository(subjectIds)` dynamically loads only question data for the requested subjects.
- `loadRuntimeLessonRepository(subjectIds)` dynamically loads lesson bodies for the requested subjects, without question, fact or visual-manifest data.
- `loadRuntimeRepository(subjectIds)` remains a full-content compatibility loader for audit/test tooling; active routes do not call it.
- `contentLoader.ts` owns all JSON dynamic imports; UI screens do not import JSON directly.
- `runtimeLearningState.ts` owns active app state, resume, answer persistence and attempt finalization without importing the aggregate repository.

## Compatibility

`packages/domain/src/vilotiderRepository.ts` and `src/lib/learningStore.ts` remain as compatibility adapters for domain tests and content/audit scripts. No active route imports them.

## Production Bundle Measurement

Historical Expo web-export measurements in this repository:

- pre-migration initial JS: approximately 4.2 MB
- post-migration initial entry: approximately 2.4 MB
- authored JSON: 2.68 MiB
- question JSON: 1.51 MiB
- 49 authored JSON files

Current production export (`npx expo export --platform web`):

- initial web JS entry: 1,661,767 bytes (1.58 MiB raw; 425,024 bytes gzip), down approximately 0.74 MB raw from the previously documented ~2.4 MB entry;
- 39 additional JS chunks are emitted, including 11 subject/source-specific question chunks;
- authored question JSON: 1,701,626 bytes across 11 files; facts/lesson JSON: 796,925 bytes; curriculum JSON: 495,155 bytes;
- runtime metadata JSON: 126,172 bytes;
- production web cold-start resource trace loaded the entry only; no question, lesson, fact or visual chunk was requested on Home;
- D1 mock requested its eight D1 question chunks and no D2 question chunk;
- D2 mock requested its three source chunks (`remaining-topics`, `vilotider`, `traffic-law`) and no D1 question chunk;
- a single-subject lesson route uses the lesson-only loader; question/checkpoint/result routes use question-only loading;
- 15 static route HTML files are emitted. The root index is 52,750 bytes; Teoriboken HTML is 189,101 bytes and is generated from the lightweight index.

The current native production export (`npx expo export --platform ios --platform android`) emits one Hermes bytecode bundle per platform and no dynamic question-bank chunks:

- iOS HBC: 4,558,636 bytes;
- Android HBC: 4,874,214 bytes.

Metro includes the authored question-bank modules in those single native bundles. Runtime calls still select only the requested subject IDs, but native startup/package delivery does not physically split D1 and D2 question payloads. This is the remaining P1 loading blocker; the current Expo native export path provides no route-level native chunks. No prior native bundle baseline is documented.

## Loading States

Lesson, checkpoint, mock and result screens retain loading/error states while their scoped content loads. Subject and topic screens use the already loaded metadata index and do not wait for content banks. App startup hydrates progress asynchronously and does not await authored content before rendering the shell.

Teoriboken search uses indexed exam, subject, topic and lesson titles. It does not load full lesson bodies or question banks.

## Visual Loading

The 45 SVG files (81,585 source bytes) and visual manifest are not imported by active routes and are not present in the production web or native exports. There are no base64 data URLs in active source/runtime modules. Question and lesson scoped loaders do not include visual metadata files. The current active UI does not yet render these authored SVG assets; the lesson media fallback remains text. SVG rendering integration and real-device visual behavior are NOT_TESTED here.

## Bundle Readiness

P0: none identified by this audit.

P1: native iOS/Android output remains a single 4.56/4.87 MB HBC bundle containing all question-bank modules, so native D1/D2 bank payloads are not separate from the initial JS bundle. Resolving this requires a native-compatible raw content asset or remote-content delivery approach; no schema change is required for a packaged asset approach, but it is a separate architecture decision.

Informational: web output is production-split and route-request tested; the old FAIL entry had no recorded numeric threshold, and the older web baseline is approximate. The local static-server smoke used a root fallback for concrete dynamic URLs; this produced React hydration error #418 because the fallback served the Home HTML. No production host rewrite configuration exists here, so dynamic deep-link refresh behavior remains NOT_TESTED against the actual host.