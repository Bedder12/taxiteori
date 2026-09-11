drop policy if exists "users complete own in-progress attempts" on attempts;
drop policy if exists "users finalize own active attempts" on attempts;

create policy "users finalize own active attempts" on attempts
  for update to authenticated
  using (auth.uid() = user_id and status = 'in_progress')
  with check (auth.uid() = user_id and status in ('completed', 'timed_out', 'abandoned'));
