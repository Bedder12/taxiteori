# Domain Model

## Hierarchy

```text
Course
Exam
Subject
Topic
Lesson
```

Subjects are official exam blueprint concepts. Topics are internal pedagogical groupings and can evolve without changing the official subject structure.

## Content

Lessons store structured content blocks, not hardcoded React content. Supported block types include heading, paragraph, bullet list, info, warning, example, image, video reference, and checkpoint reference.

The same canonical lesson content can later power Plugga, Taxiboken, question explanations, source review, and AI grounding.

## Questions

Question versions contain:

- UUID identity
- stable key such as `TAXI-D2-LAW-REST-014`
- version number
- exam, subject, topic, and optional lesson links
- type and eligible contexts
- prompt, choices, correct choice, explanation
- difficulty
- source references
- content status

Only published question versions are eligible for learner-facing selection.

## Assessments And Attempts

Assessment configs describe internal checkpoints and future practice sessions. Exam blueprints describe official-style mock exam allocations.

When an attempt begins, selected question versions are frozen into attempt questions. Scoring reads the frozen versions, not the latest editable question key.

## Progress

The model keeps separate facts for:

- lesson completion
- assessment completion/pass
- raw answer history

Percentages are derived from facts. Lesson completion is not treated as mastery, checkpoint pass, or exam readiness.

## Current Demo Slice

```text
Taxiforarlegitimation
Delprov 2 - Lagstiftning
Taxitrafiklagstiftning
Vilotider
5 demo lessons
18 demo questions
1 checkpoint assessment
```

All lesson and question content in this slice is placeholder content for software validation and must be replaced with reviewed source-backed curriculum before public release.
