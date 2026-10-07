alter table attempt_questions
  alter column attempt_id drop not null;

alter table answers
  alter column attempt_id drop not null,
  alter column attempt_question_id drop not null;
