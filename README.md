# Taxiteori

Expo/React Native foundation for a Swedish taxi theory learning app. This milestone implements a content-driven Vilotider vertical slice for Taxiforarlegitimation without presenting the demo legal content as final curriculum.

## What Is Implemented

- Course hierarchy: Course -> Exam -> Subject -> Topic -> Lesson
- Official blueprint data for Delprov 1 and Delprov 2
- Demo vertical slice: Delprov 2 -> Taxitrafiklagstiftning -> Vilotider
- Structured lesson blocks
- Versioned single-choice questions with stable keys
- Checkpoint assessment generation
- Frozen attempt question snapshots
- Deterministic scoring and pass/fail calculation
- Lesson completion facts and derived progress
- Local demo persistence for the Expo app
- Supabase/PostgreSQL migration with RLS policies
- Domain tests for blueprint allocation, selection, snapshots, scoring, and progress
- Official TSFS curriculum matrix with source-traceable requirements
- Curriculum coverage/tree documentation

## Install

```powershell
npm install
```

## Run The App

```powershell
npm run web
```

For device testing, run `npm start` and open the project in Expo Go.

## Test

```powershell
npm test
```

```powershell
npm run typecheck
```

## Supabase

Create a Supabase project, then add these environment variables when Supabase client integration is added:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Run migrations with the Supabase CLI from this project folder:

```powershell
supabase link --project-ref your-project-ref
supabase db push
```

Seed data lives in `supabase/seed`. The current SQL seed is intentionally an outline because the running app uses equivalent local TypeScript demo data in `packages/domain/src/demoData.ts` until Supabase connection work begins.

## Out Of Scope For This Milestone

- Final legal/taxi curriculum
- Payments, subscriptions, guarantee features
- Video UI and media production
- Full admin CMS
- AI tutor/explanations
- Complete question bank for every subject
- Production Supabase client integration
- Full mock exam UI for incomplete banks

## Project Structure

- `src/app`: Expo Router screens
- `src/features/learn`: learning selectors/view-model helpers
- `src/features/quiz`: quiz review helpers
- `src/lib`: local demo persistence
- `packages/domain/src`: domain types and services
- `packages/domain/tests`: domain behavior tests
- `supabase/migrations`: database schema and RLS
- `data/curriculum/requirements.json`: official requirement matrix
- `docs`: system and domain documentation
