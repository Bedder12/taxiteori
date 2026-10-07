grant usage on schema public to authenticated;

grant select, insert, update on table lesson_progress to authenticated;
grant select, insert, update on table attempts to authenticated;
grant select, insert, update on table attempt_questions to authenticated;
grant select, insert, update on table answers to authenticated;

alter table attempt_questions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

update attempt_questions
set user_id = attempts.user_id
from attempts
where attempt_questions.user_id is null
  and (
    attempt_questions.attempt_id = attempts.id
    or (
      attempt_questions.client_attempt_id is not null
      and attempt_questions.client_attempt_id = attempts.client_attempt_id
    )
  );

do $$
begin
  if exists (
    select 1
    from attempt_questions
    where user_id is null
  ) then
    raise exception 'attempt_questions contains rows without deterministic user ownership';
  end if;

  if exists (
    select 1
    from (
      select user_id, client_attempt_id
      from attempts
      where client_attempt_id is not null
      group by user_id, client_attempt_id
      having count(*) > 1
    ) duplicates
  ) then
    raise exception 'attempts contains duplicate user_id/client_attempt_id rows';
  end if;

  if exists (
    select 1
    from (
      select user_id, client_attempt_id, display_order
      from attempt_questions
      where client_attempt_id is not null
      group by user_id, client_attempt_id, display_order
      having count(*) > 1
    ) duplicates
  ) then
    raise exception 'attempt_questions contains duplicate user_id/client_attempt_id/display_order rows';
  end if;

  if exists (
    select 1
    from (
      select user_id, client_attempt_id, client_attempt_question_id
      from answers
      where client_attempt_id is not null
        and client_attempt_question_id is not null
      group by user_id, client_attempt_id, client_attempt_question_id
      having count(*) > 1
    ) duplicates
  ) then
    raise exception 'answers contains duplicate user_id/client_attempt_id/client_attempt_question_id rows';
  end if;
end $$;

alter table attempt_questions
  alter column user_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'attempts_user_client_attempt_id_key'
      and conrelid = 'attempts'::regclass
  ) then
    alter table attempts
      add constraint attempts_user_client_attempt_id_key unique (user_id, client_attempt_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'attempt_questions_user_client_order_key'
      and conrelid = 'attempt_questions'::regclass
  ) then
    alter table attempt_questions
      add constraint attempt_questions_user_client_order_key unique (user_id, client_attempt_id, display_order);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'answers_user_client_question_key'
      and conrelid = 'answers'::regclass
  ) then
    alter table answers
      add constraint answers_user_client_question_key unique (user_id, client_attempt_id, client_attempt_question_id);
  end if;
end $$;

drop policy if exists "users read own attempt questions" on attempt_questions;
create policy "users read own attempt questions" on attempt_questions
  for select to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from attempts
      where attempts.user_id = auth.uid()
        and (
          attempts.id = attempt_questions.attempt_id
          or attempts.client_attempt_id = attempt_questions.client_attempt_id
        )
    )
  );

drop policy if exists "users create own attempt questions" on attempt_questions;
create policy "users create own attempt questions" on attempt_questions
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from attempts
      where attempts.user_id = auth.uid()
        and attempts.status = 'in_progress'
        and (
          attempts.id = attempt_questions.attempt_id
          or attempts.client_attempt_id = attempt_questions.client_attempt_id
        )
    )
  );

drop policy if exists "users update own attempt questions" on attempt_questions;
create policy "users update own attempt questions" on attempt_questions
  for update to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from attempts
      where attempts.user_id = auth.uid()
        and attempts.status = 'in_progress'
        and attempts.client_attempt_id = attempt_questions.client_attempt_id
    )
  )
  with check (auth.uid() = user_id);
