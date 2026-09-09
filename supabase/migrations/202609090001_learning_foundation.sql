create extension if not exists "pgcrypto";

create type content_status as enum ('draft', 'review', 'published', 'archived');
create type question_type as enum ('single_choice');
create type question_context as enum ('checkpoint', 'practice', 'assessment');
create type attempt_type as enum ('checkpoint', 'mock_exam', 'practice');
create type attempt_status as enum ('in_progress', 'completed');

create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table exams (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id),
  code text not null,
  title text not null,
  display_order integer not null,
  status content_status not null default 'draft',
  unique (course_id, code)
);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id),
  title text not null,
  official_question_count integer not null check (official_question_count >= 0),
  display_order integer not null,
  status content_status not null default 'draft'
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id),
  title text not null,
  display_order integer not null,
  status content_status not null default 'draft'
);

create table sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  url text,
  document_reference text,
  published_at date,
  retrieved_at timestamptz,
  status content_status not null default 'draft'
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id),
  title text not null,
  display_order integer not null,
  content_blocks jsonb not null default '[]'::jsonb,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table lesson_sources (
  lesson_id uuid not null references lessons(id) on delete cascade,
  source_id uuid not null references sources(id),
  primary key (lesson_id, source_id)
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  created_at timestamptz not null default now()
);

create table question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id),
  version integer not null check (version > 0),
  exam_id uuid not null references exams(id),
  subject_id uuid not null references subjects(id),
  topic_id uuid references topics(id),
  lesson_id uuid references lessons(id),
  type question_type not null,
  contexts question_context[] not null default '{}',
  prompt text not null,
  choices jsonb not null,
  correct_choice_id text not null,
  explanation text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (question_id, version)
);

create table question_version_sources (
  question_version_id uuid not null references question_versions(id) on delete cascade,
  source_id uuid not null references sources(id),
  primary key (question_version_id, source_id)
);

create table exam_blueprints (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id),
  name text not null,
  type attempt_type not null,
  pass_threshold numeric(5, 4) not null check (pass_threshold >= 0 and pass_threshold <= 1),
  time_limit_seconds integer,
  active boolean not null default false
);

create table exam_blueprint_subjects (
  id uuid primary key default gen_random_uuid(),
  exam_blueprint_id uuid not null references exam_blueprints(id) on delete cascade,
  subject_id uuid not null references subjects(id),
  question_count integer not null check (question_count > 0)
);

create table assessments (
  id uuid primary key default gen_random_uuid(),
  type attempt_type not null,
  title text not null,
  subject_id uuid references subjects(id),
  topic_id uuid references topics(id),
  question_count integer not null check (question_count > 0),
  pass_threshold numeric(5, 4) not null check (pass_threshold >= 0 and pass_threshold <= 1),
  time_limit_seconds integer,
  status content_status not null default 'draft'
);

create table lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid references assessments(id),
  exam_blueprint_id uuid references exam_blueprints(id),
  type attempt_type not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status attempt_status not null default 'in_progress',
  score integer,
  total_questions integer not null,
  pass_threshold numeric(5, 4) not null,
  passed boolean,
  check ((assessment_id is not null) <> (exam_blueprint_id is not null))
);

create table attempt_questions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_version_id uuid not null references question_versions(id),
  question_id uuid not null references questions(id),
  stable_key text not null,
  version integer not null,
  display_order integer not null
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  attempt_question_id uuid not null references attempt_questions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  selected_choice_id text not null,
  correct boolean not null,
  answered_at timestamptz not null default now(),
  response_time_ms integer,
  unique (attempt_question_id)
);

alter table courses enable row level security;
alter table exams enable row level security;
alter table subjects enable row level security;
alter table topics enable row level security;
alter table sources enable row level security;
alter table lessons enable row level security;
alter table lesson_sources enable row level security;
alter table questions enable row level security;
alter table question_versions enable row level security;
alter table question_version_sources enable row level security;
alter table exam_blueprints enable row level security;
alter table exam_blueprint_subjects enable row level security;
alter table assessments enable row level security;
alter table lesson_progress enable row level security;
alter table attempts enable row level security;
alter table attempt_questions enable row level security;
alter table answers enable row level security;

create policy "authenticated users can read published courses" on courses for select to authenticated using (status = 'published');
create policy "authenticated users can read published exams" on exams for select to authenticated using (status = 'published');
create policy "authenticated users can read published subjects" on subjects for select to authenticated using (status = 'published');
create policy "authenticated users can read published topics" on topics for select to authenticated using (status = 'published');
create policy "authenticated users can read published sources" on sources for select to authenticated using (status = 'published');
create policy "authenticated users can read published lessons" on lessons for select to authenticated using (status = 'published');
create policy "authenticated users can read lesson sources" on lesson_sources for select to authenticated using (true);
create policy "authenticated users can read question identities" on questions for select to authenticated using (true);
create policy "authenticated users can read published question versions" on question_versions for select to authenticated using (status = 'published');
create policy "authenticated users can read question sources" on question_version_sources for select to authenticated using (true);
create policy "authenticated users can read active blueprints" on exam_blueprints for select to authenticated using (active = true);
create policy "authenticated users can read blueprint subjects" on exam_blueprint_subjects for select to authenticated using (true);
create policy "authenticated users can read published assessments" on assessments for select to authenticated using (status = 'published');

create policy "users read own lesson progress" on lesson_progress for select to authenticated using (auth.uid() = user_id);
create policy "users insert own lesson progress" on lesson_progress for insert to authenticated with check (auth.uid() = user_id);

create policy "users read own attempts" on attempts for select to authenticated using (auth.uid() = user_id);
create policy "users create own attempts" on attempts for insert to authenticated with check (auth.uid() = user_id and status = 'in_progress' and score is null and passed is null);
create policy "users complete own in-progress attempts" on attempts for update to authenticated using (auth.uid() = user_id and status = 'in_progress') with check (auth.uid() = user_id and status = 'completed');

create policy "users read own attempt questions" on attempt_questions for select to authenticated using (
  exists (select 1 from attempts where attempts.id = attempt_questions.attempt_id and attempts.user_id = auth.uid())
);
create policy "users create own attempt questions" on attempt_questions for insert to authenticated with check (
  exists (select 1 from attempts where attempts.id = attempt_questions.attempt_id and attempts.user_id = auth.uid() and attempts.status = 'in_progress')
);

create policy "users read own answers" on answers for select to authenticated using (auth.uid() = user_id);
create policy "users create own answers" on answers for insert to authenticated with check (
  auth.uid() = user_id and
  exists (select 1 from attempts where attempts.id = answers.attempt_id and attempts.user_id = auth.uid() and attempts.status = 'in_progress')
);
