create type curriculum_content_status as enum ('planned', 'sourcing', 'authored', 'reviewed', 'verified', 'published', 'archived');
create type legal_status as enum ('binding_rule', 'general_advice', 'informational');
create type competency_type as enum ('KNOW', 'UNDERSTAND', 'EXPLAIN', 'APPLY', 'ASSESS', 'CALCULATE', 'USE', 'PERFORM');

alter table courses add column if not exists stable_key text unique;
alter table courses add column if not exists official_name text;
alter table courses add column if not exists display_name text;
alter table courses add column if not exists active boolean not null default true;

alter table exams add column if not exists stable_key text unique;
alter table exams add column if not exists official_name text;
alter table exams add column if not exists display_name text;
alter table exams add column if not exists scoring_question_count integer check (scoring_question_count >= 0);
alter table exams add column if not exists passing_score integer check (passing_score >= 0);
alter table exams add column if not exists non_scoring_test_question_count integer check (non_scoring_test_question_count >= 0);
alter table exams add column if not exists total_displayed_question_count integer check (total_displayed_question_count >= 0);
alter table exams add column if not exists may_be_taken_in_any_order boolean not null default true;
alter table exams add column if not exists combined_validity_months integer check (combined_validity_months > 0);
alter table exams add column if not exists source_reference text;
alter table exams add column if not exists active boolean not null default true;

alter table subjects add column if not exists stable_key text unique;
alter table subjects add column if not exists official_name text;
alter table subjects add column if not exists display_name text;
alter table subjects add column if not exists source_reference text;
alter table subjects add column if not exists active boolean not null default true;

alter table topics add column if not exists stable_key text unique;
alter table topics add column if not exists content_status curriculum_content_status not null default 'planned';
alter table topics add column if not exists source_reference text;
alter table topics add column if not exists active boolean not null default true;

alter table lessons add column if not exists stable_key text unique;
alter table lessons add column if not exists content_status curriculum_content_status not null default 'planned';
alter table lessons add column if not exists active boolean not null default true;

alter table sources add column if not exists stable_key text unique;
alter table sources add column if not exists source_type text;
alter table sources add column if not exists publication_date date;
alter table sources add column if not exists active boolean not null default true;

create table curriculum_requirements (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  subject_id uuid not null references subjects(id),
  source_id uuid not null references sources(id),
  regulation text not null,
  chapter integer not null,
  section text not null,
  subsection text,
  official_reference text not null,
  source_text_summary text not null,
  normalized_requirement text not null,
  original_competency_wording text not null,
  competency_type competency_type not null,
  legal_status legal_status not null,
  recommended_question_type text,
  requires_scenario boolean not null default false,
  requires_calculation boolean not null default false,
  requires_image boolean not null default false,
  requires_map boolean not null default false,
  practical_application boolean not null default false,
  sort_order integer not null,
  content_status curriculum_content_status not null default 'planned',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table topic_requirements (
  topic_id uuid not null references topics(id) on delete cascade,
  curriculum_requirement_id uuid not null references curriculum_requirements(id) on delete cascade,
  primary key (topic_id, curriculum_requirement_id)
);

create table lesson_requirements (
  lesson_id uuid not null references lessons(id) on delete cascade,
  curriculum_requirement_id uuid not null references curriculum_requirements(id) on delete cascade,
  primary key (lesson_id, curriculum_requirement_id)
);

create table question_version_requirements (
  question_version_id uuid not null references question_versions(id) on delete cascade,
  curriculum_requirement_id uuid not null references curriculum_requirements(id) on delete cascade,
  primary key (question_version_id, curriculum_requirement_id)
);

alter table curriculum_requirements enable row level security;
alter table topic_requirements enable row level security;
alter table lesson_requirements enable row level security;
alter table question_version_requirements enable row level security;

create policy "authenticated users can read active curriculum requirements" on curriculum_requirements
  for select to authenticated using (active = true);

create policy "authenticated users can read topic requirement mappings" on topic_requirements
  for select to authenticated using (true);

create policy "authenticated users can read lesson requirement mappings" on lesson_requirements
  for select to authenticated using (true);

create policy "authenticated users can read question requirement mappings" on question_version_requirements
  for select to authenticated using (true);
