import type { SupabaseClient } from '@supabase/supabase-js';

import type { Answer, Attempt, AttemptQuestion } from '../../packages/domain/src';

type PersistenceRow = Record<string, unknown>;

export type LearningPersistenceClient = SupabaseClient<any>;

export class LearningPersistenceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'LearningPersistenceError';
  }
}

export class SupabaseLearningPersistence {
  constructor(private readonly client: LearningPersistenceClient) {}

  private async userId() {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) throw new LearningPersistenceError('An authenticated user is required to persist learning state.', error);
    return data.user.id;
  }

  async completeLesson(lessonKey: string, completedAt: string) {
    const userId = await this.userId();
    const { error } = await this.client.from('lesson_progress').upsert({ user_id: userId, lesson_key: lessonKey, completed_at: completedAt }, { onConflict: 'user_id,lesson_key' });
    if (error) throw new LearningPersistenceError('Could not save lesson completion.', error);
  }

  async completedLessonKeys() {
    const userId = await this.userId();
    const { data, error } = await this.client.from('lesson_progress').select('lesson_key,completed_at').eq('user_id', userId);
    if (error) throw new LearningPersistenceError('Could not load lesson progress.', error);
    return (data ?? []) as { lesson_key: string; completed_at: string }[];
  }

  async saveAttempt(attempt: Attempt, questionSnapshots: PersistenceRow[]) {
    const userId = await this.userId();
    const isMock = attempt.type === 'mock_exam';
    const { error: attemptError } = await this.client.from('attempts').upsert({
      client_attempt_id: attempt.id,
      user_id: userId,
      assessment_key: isMock ? null : attempt.assessmentId,
      blueprint_key: isMock ? attempt.assessmentId : null,
      type: attempt.type,
      blueprint_version: attempt.blueprintVersion ?? null,
      status: attempt.status,
      started_at: attempt.startedAt,
      completed_at: attempt.completedAt ?? null,
      timed_out: attempt.timedOut ?? false,
      time_limit_seconds: attempt.timeLimitSeconds ?? null,
      score: attempt.score ?? null,
      total_questions: attempt.totalQuestions,
      pass_threshold: attempt.passThreshold,
      passed: attempt.passed ?? null,
    }, { onConflict: 'client_attempt_id' });
    if (attemptError) throw new LearningPersistenceError('Could not save attempt.', attemptError);

    const { error: questionError } = await this.client.from('attempt_questions').upsert(
      attempt.questions.map((question, index) => ({
        attempt_id: null,
        client_attempt_id: attempt.id,
        client_attempt_question_id: question.id,
        question_key: question.questionId,
        stable_key: question.stableKey,
        version: question.version,
        display_order: question.order ?? index + 1,
        scoring_role: question.scoringRole,
        subject_key: question.subjectId,
        question_snapshot: questionSnapshots[index] ?? {},
      })),
      { onConflict: 'client_attempt_id,display_order' },
    );
    if (questionError) throw new LearningPersistenceError('Could not save frozen attempt questions.', questionError);
  }

  async saveAnswer(attempt: Attempt, answer: Answer) {
    const userId = await this.userId();
    const { error } = await this.client.from('answers').upsert({
      client_attempt_id: attempt.id,
      client_attempt_question_id: answer.attemptQuestionId,
      user_id: userId,
      selected_choice_id: answer.selectedChoiceId,
      correct: answer.correct,
      answered_at: answer.answeredAt,
      unanswered: answer.unanswered ?? false,
    }, { onConflict: 'client_attempt_id,client_attempt_question_id' });
    if (error) throw new LearningPersistenceError('Could not save answer.', error);
  }

  async activeAttempt(clientAssessmentKey: string) {
    const userId = await this.userId();
    const { data, error } = await this.client.from('attempts').select('*,attempt_questions(*),answers(*)').eq('user_id', userId).eq('status', 'in_progress').or(`assessment_key.eq.${clientAssessmentKey},blueprint_key.eq.${clientAssessmentKey}`).maybeSingle();
    if (error) throw new LearningPersistenceError('Could not load active attempt.', error);
    return data as PersistenceRow | null;
  }

  async loadState() {
    const userId = await this.userId();
    const [lessons, attempts] = await Promise.all([
      this.client.from('lesson_progress').select('lesson_key,completed_at').eq('user_id', userId),
      this.client.from('attempts').select('*,attempt_questions(*),answers(*)').eq('user_id', userId),
    ]);
    if (lessons.error) throw new LearningPersistenceError('Could not load lesson progress.', lessons.error);
    if (attempts.error) throw new LearningPersistenceError('Could not load attempts and review history.', attempts.error);
    return { lessons: (lessons.data ?? []) as PersistenceRow[], attempts: (attempts.data ?? []) as PersistenceRow[] };
  }
}