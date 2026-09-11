alter type attempt_status add value if not exists 'timed_out';
alter type attempt_status add value if not exists 'abandoned';

alter table exam_blueprints
  add column if not exists version integer not null default 1,
  add column if not exists non_scoring_test_question_count integer not null default 0,
  add column if not exists scoring_question_count integer,
  add column if not exists total_displayed_question_count integer,
  add column if not exists passing_score integer,
  add column if not exists disclaimer text;

alter table attempts
  add column if not exists blueprint_version integer,
  add column if not exists time_limit_seconds integer,
  add column if not exists timed_out boolean not null default false,
  add column if not exists client_attempt_id text,
  add column if not exists assessment_key text,
  add column if not exists blueprint_key text;

create unique index if not exists attempts_client_attempt_id_uidx
  on attempts (client_attempt_id)
  where client_attempt_id is not null;

alter table attempt_questions
  alter column question_version_id drop not null,
  alter column question_id drop not null,
  add column if not exists scoring_role text not null default 'scored'
    check (scoring_role in ('scored', 'non_scoring_simulation')),
  add column if not exists subject_id uuid references subjects(id),
  add column if not exists question_key text,
  add column if not exists question_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists client_attempt_id text,
  add column if not exists client_attempt_question_id text,
  add column if not exists subject_key text;

alter table lesson_progress
  add column if not exists lesson_key text;

update lesson_progress
set lesson_key = coalesce(lessons.stable_key, lesson_progress.lesson_id::text)
from lessons
where lesson_progress.lesson_id = lessons.id
  and lesson_progress.lesson_key is null;

update lesson_progress
set lesson_key = lesson_id::text
where lesson_key is null
  and lesson_id is not null;

do $$
begin
  if exists (
    select 1
    from lesson_progress
    where lesson_key is null or btrim(lesson_key) = ''
  ) then
    raise exception 'lesson_progress contains rows without a deterministic lesson_key';
  end if;

  if exists (
    select 1
    from (
      select user_id, lesson_key
      from lesson_progress
      group by user_id, lesson_key
      having count(*) > 1
    ) duplicates
  ) then
    raise exception 'lesson_progress contains duplicate user_id/lesson_key rows';
  end if;
end $$;

alter table lesson_progress alter column lesson_key set not null;
alter table lesson_progress drop constraint if exists lesson_progress_pkey;
alter table lesson_progress drop constraint if exists lesson_progress_key_pkey;
alter table lesson_progress add constraint lesson_progress_key_pkey primary key (user_id, lesson_key);
alter table lesson_progress alter column lesson_id drop not null;
alter table lesson_progress drop constraint if exists lesson_progress_lesson_key_not_blank;
alter table lesson_progress add constraint lesson_progress_lesson_key_not_blank check (btrim(lesson_key) <> '');

alter table answers
  alter column attempt_id drop not null,
  add column if not exists client_attempt_id text,
  add column if not exists client_attempt_question_id text,
  add column if not exists unanswered boolean not null default false;

create unique index if not exists attempt_questions_client_order_uidx
  on attempt_questions (client_attempt_id, display_order)
  where client_attempt_id is not null;
create unique index if not exists attempt_questions_client_id_uidx
  on attempt_questions (client_attempt_question_id)
  where client_attempt_question_id is not null;
create unique index if not exists answers_client_question_uidx
  on answers (client_attempt_id, client_attempt_question_id)
  where client_attempt_id is not null and client_attempt_question_id is not null;

create unique index if not exists attempts_one_active_per_user_assessment
  on attempts (user_id, coalesce(assessment_id::text, exam_blueprint_id::text, assessment_key, blueprint_key))
  where status = 'in_progress';

alter table attempts drop constraint if exists attempts_check;
alter table attempts add constraint attempts_reference_check check (
  (assessment_id is not null) <> (exam_blueprint_id is not null)
  or (assessment_key is not null) <> (blueprint_key is not null)
);

drop policy if exists "users insert own lesson progress" on lesson_progress;
drop policy if exists "users upsert own lesson progress" on lesson_progress;
create policy "users upsert own lesson progress" on lesson_progress
  for insert to authenticated
  with check (auth.uid() = user_id);
drop policy if exists "users update own lesson progress" on lesson_progress;
create policy "users update own lesson progress" on lesson_progress
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users read own attempt questions" on attempt_questions;
create policy "users read own attempt questions" on attempt_questions for select to authenticated using (
  exists (
    select 1 from attempts
    where attempts.user_id = auth.uid()
      and (attempts.id = attempt_questions.attempt_id or attempts.client_attempt_id = attempt_questions.client_attempt_id)
  )
);

drop policy if exists "users create own attempt questions" on attempt_questions;
create policy "users create own attempt questions" on attempt_questions for insert to authenticated with check (
  exists (
    select 1 from attempts
    where attempts.user_id = auth.uid()
      and attempts.status = 'in_progress'
      and (attempts.id = attempt_questions.attempt_id or attempts.client_attempt_id = attempt_questions.client_attempt_id)
  )
);
drop policy if exists "users update own attempt questions" on attempt_questions;
create policy "users update own attempt questions" on attempt_questions for update to authenticated using (
  exists (
    select 1 from attempts
    where attempts.user_id = auth.uid()
      and attempts.status = 'in_progress'
      and attempts.client_attempt_id = attempt_questions.client_attempt_id
  )
) with check (true);

drop policy if exists "users create own answers" on answers;
create policy "users create own answers" on answers
  for insert to authenticated
  with check (
    auth.uid() = user_id and
    exists (
      select 1
      from attempts
      where (attempts.id = answers.attempt_id or attempts.client_attempt_id = answers.client_attempt_id)
        and attempts.user_id = auth.uid()
        and attempts.status = 'in_progress'
    )
  );

drop policy if exists "users update own answers" on answers;
create policy "users update own answers" on answers
  for update to authenticated
  using (
    auth.uid() = user_id and exists (
      select 1 from attempts
      where attempts.user_id = auth.uid()
        and attempts.status = 'in_progress'
        and attempts.client_attempt_id = answers.client_attempt_id
    )
  )
  with check (auth.uid() = user_id);

create index if not exists attempts_user_status_idx on attempts (user_id, status);
create index if not exists attempt_questions_attempt_order_idx on attempt_questions (attempt_id, display_order);
create index if not exists answers_attempt_idx on answers (attempt_id);
