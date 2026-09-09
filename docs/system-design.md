# System Design

The product is a modular monolith: Expo mobile client, Supabase Auth, PostgreSQL, Row Level Security, and later Supabase Storage for media. Business rules are kept in a domain layer so UI screens render state and dispatch actions instead of owning exam logic.

## Current Runtime

The app currently runs from local TypeScript demo data and browser localStorage/in-memory fallback. This keeps the vertical slice usable before a Supabase project is connected. The data model mirrors the Supabase migration so the next milestone can replace local persistence with Supabase queries and RPC/service calls.

## Main Flow

1. Plugga lists the Taxi course and both official exams.
2. Delprov screens list official subject areas and progress concepts.
3. Taxitrafiklagstiftning opens the Vilotider topic.
4. Lessons render structured content blocks from data.
5. Completing a lesson stores a lesson completion fact.
6. Starting the checkpoint selects published eligible question versions.
7. An attempt freezes selected question version ids, stable keys, and versions.
8. Submission stores answer facts, calculates score, and records pass/fail.
9. Results show correct/incorrect answers and explanations.

## Supabase Boundary

Published course content can be read by authenticated users. Personal learning data is user-owned:

- lesson progress
- attempts
- attempt questions
- answers

Users cannot write canonical course content, questions, correct answers, sources, or blueprints through client policies. Admin tooling is intentionally not built yet; future admin writes should use service-role protected flows or explicit admin policies.

## Question Versioning

Questions have stable human-readable keys. Each published version is immutable for historical purposes. Attempts store `question_version_id`, `question_id`, `stable_key`, and `version` so old attempts can be reproduced even after content revisions.

## Mock Exam Engine

Official blueprints store subject allocations separately from frontend code. The domain selection service reads a blueprint and selects published assessment-eligible question versions by subject. Because the current bank is incomplete, the UI does not offer full mock exams yet; tests prove the generic allocation behavior.

## Future Extensions

- Supabase client integration and authenticated accounts
- RPC or edge function for server-authoritative attempt creation/scoring
- Admin publishing workflow
- Taxiboken view using the same lesson content
- Practice tab using the same question bank
- Media assets for video/image blocks
- Source-backed AI explanations grounded in curated content
