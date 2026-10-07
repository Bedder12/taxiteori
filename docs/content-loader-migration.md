# Content Loading and Bundle Readiness

Date: 2026-10-07

## Original Readiness Finding

The beta audit marked bundle/loading readiness FAIL without naming a size threshold or a failing build. This document recorded that route-level network loading had not been measured. The production export and route requests are now measured below.

The previous active route graph had a concrete overfetch: subject, topic, lesson, checkpoint, mock and result routes called the full subject repository loader. That loader imported facts, lessons, questions and some visual metadata even when a route needed only metadata, lesson bodies or questions. Active routes now use metadata-only, lesson-only or question-only paths as appropriate.

## A. Runtime Loading Behavior

| Caller | Previous data need | Runtime path |
| --- | --- | --- |
| App startup / Home / Plugga / D1-D2 path / Subject / Topic / Prov / Profile | shell, progress and lightweight course index | `getRuntimeMetadataRepository()` + runtime state; no authored content loader |
| Lesson / module | lesson bodies for the selected subject only | `loadRuntimeLessonRepository(subjectIds)`; no question, fact or visual-manifest bodies |
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
- Startup metadata is 126,172 bytes (~123 KiB); it contains indexes and lightweight lesson descriptors. It contains no question versions or lesson content blocks. `getRuntimeMetadataRepository()` constructs zero question objects, and the route regression test guards that invariant.
- Opening D1 returns only its 503 question versions; opening D2 returns only its 321 question versions. The loader is invoked by assessment/mock routes, not during startup or Home rendering. Subject lesson requests likewise select only that subject's lesson JSON.
- Result/review uses the question-only loader for the frozen attempt's subject IDs; it no longer calls the full-content compatibility loader.

## Compatibility

`packages/domain/src/vilotiderRepository.ts` and `src/lib/learningStore.ts` remain as compatibility adapters for domain tests and content/audit scripts. No active route imports them.

## B. Physical Production Bundle Packaging

Historical Expo web-export measurements in this repository:

- pre-migration initial JS: approximately 4.2 MB
- post-migration initial entry: approximately 2.4 MB
- authored JSON: 2.68 MiB
- question JSON: 1.51 MiB
- 49 authored JSON files

Current production export (`npx expo export --platform web`):

- initial web JS entry: 1,660,201 bytes (1.58 MiB raw; 423,794 bytes gzip), down approximately 0.74 MB raw from the previously documented ~2.4 MB entry;
- 39 additional JS chunks are emitted, including 11 subject/source-specific question chunks;
- authored question JSON: 1,701,626 bytes across 11 files; facts/lesson JSON: 796,925 bytes; curriculum JSON: 495,155 bytes;
- runtime metadata JSON: 126,172 bytes;
- production web cold-start resource trace loaded the entry only; no question, lesson, fact or visual chunk was requested on Home;
- D1 mock requested its eight D1 question chunks and no D2 question chunk;
- D2 mock requested its three source chunks (`remaining-topics`, `vilotider`, `traffic-law`) and no D1 question chunk;
- a single-subject lesson route uses the lesson-only loader; question/checkpoint/result routes use question-only loading;
- 15 static route HTML files are emitted. The root index is 52,750 bytes; Teoriboken HTML is 189,101 bytes and is generated from the lightweight index.

The current native production export (`npx expo export --platform ios --platform android`) emits one Hermes bytecode bundle per platform and no dynamic question-bank chunks:

- iOS HBC: 4,554,519 bytes (~4.56 MB);
- Android HBC: 4,874,448 bytes (~4.87 MB).

Metro includes the authored question-bank modules in those single native bundles. This is an accepted Expo/React Native production packaging characteristic, not a runtime-loading defect or beta gate by itself. These measured HBC sizes are retained as optimization baselines; there is no prior native baseline. Web output remains physically split: Home requested the entry only; D1 requested its eight question chunks, and D2 its three source question chunks without the other exam's question chunks.

> Native Expo/Hermes production builds package JavaScript into a single platform HBC. Web-style production code splitting is not treated as a beta requirement. Runtime data initialization remains scoped.

## Loading States

Lesson, checkpoint, mock and result screens retain loading/error states while their scoped content loads. Subject and topic screens use the already loaded metadata index and do not wait for content banks. App startup hydrates progress asynchronously and does not await authored content before rendering the shell.

Teoriboken search uses indexed exam, subject, topic and lesson titles. It does not load full lesson bodies or question banks.

## C. Web Hosting and Deep Links

Production-host dynamic deep-link refresh behavior is NOT_TESTED / deployment-specific because the actual hosting rewrite configuration has not been tested. A local static-server root fallback served Home HTML for a parameterized route and produced React hydration error #418; that local setup is not evidence that the production deployment is broken. No routing architecture changes are made based on that result.

## Visual Loading

The production web export emits six subject-specific visual-metadata JS chunks; they are not requested by the cold Home route or by question-only/lesson-only runtime loaders. Full-content compatibility loader entries can reference visual JSON, but active routes do not call that loader. The native package is a single HBC as described above, so physical module inclusion is not a measure of runtime initialization. The 45 authored SVG files total 81,585 source bytes; there are no base64 data URLs in active source/runtime modules. The current active UI does not yet render these authored SVG assets; the lesson media fallback remains text. SVG rendering integration and real-device visual behavior are NOT_TESTED here.

## Bundle/Loading Readiness

PASS — production exports succeed, web route requests are split and scoped, and runtime initialization stays scoped on web and native. Expo's single-HBC native packaging is accepted; its measured size remains a future optimization baseline. No full question bank is parsed or instantiated during startup or Home rendering.

P0: none identified by this audit.

P1: real-device production visual/performance QA remains NOT_TESTED and is the remaining beta-readiness phase. Production-host dynamic deep-link refresh remains NOT_TESTED / deployment-specific; it is separate from bundle/loading readiness and is not inferred to be broken from the local static-server result.