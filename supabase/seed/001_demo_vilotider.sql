-- Demo seed outline for the Vilotider vertical slice and official curriculum foundation.
-- The machine-readable curriculum source is data/curriculum/requirements.json.
-- Import scripts can read that JSON and populate these tables once Supabase is connected.

insert into courses (id, title, status)
values ('00000000-0000-4000-8000-000000000001', 'Taxiforarlegitimation', 'published')
on conflict do nothing;

-- In production, continue seeding:
-- exams: Delprov 1 - Sakerhet och beteende, Delprov 2 - Lagstiftning
-- subjects: all official blueprint subjects with fixed question counts and stable keys
-- curriculum_requirements: active TSFS 2021:119 chapter 3 sections 2-35 requirements
-- topic_requirements/lesson_requirements: traceability mappings
-- topic: Taxitrafiklagstiftning / Vilotider
-- lessons: 4-5 placeholder lessons with content_blocks JSONB
-- questions/question_versions: TAXI-D2-LAW-REST-001..018 v1
-- assessments: Checkpoint: Vilotider
-- exam_blueprints/exam_blueprint_subjects: official D1 and D2 mock exam allocations
