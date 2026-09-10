import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { completedAttemptFact, createAttemptSnapshot, scoreAttempt } from '../src';
import { vilotiderRepository } from '../src/vilotiderRepository';
import {
  DEMO_USER_ID,
  getLearningSnapshot,
  resetLearningStateForTests,
  saveAttemptAnswer,
  startCheckpointAttempt,
  startMockAttempt,
  submitAttempt,
} from '../../../src/lib/learningStore';

const root = resolve(__dirname, '../../../../');

export function testP0TimedOutAttemptsAreTerminalAndReviewable() {
  const selected = vilotiderRepository.questionVersions.slice(0, 2);
  const attempt = createAttemptSnapshot({ userId: DEMO_USER_ID, assessmentId: 'timeout-check', type: 'checkpoint', selectedQuestions: selected, passThreshold: 0.8 });
  const result = scoreAttempt(attempt, vilotiderRepository.questionVersions, { [attempt.questions[0].id]: selected[0].correctChoiceId, [attempt.questions[1].id]: 'timeout' }, '2026-09-10T10:00:00.000Z', true);
  assert.equal(result.attempt.status, 'timed_out');
  assert.equal(result.attempt.timedOut, true);
  assert.ok(result.attempt.completedAt);
  assert.equal(result.answers.filter((answer) => answer.unanswered).length, 1);
  assert.doesNotThrow(() => completedAttemptFact(result.attempt));
  assert.throws(() => scoreAttempt(result.attempt, vilotiderRepository.questionVersions, {}), /immutable/);
}

export function testP0CheckpointResumeAndAnswerIdempotency() {
  resetLearningStateForTests();
  const assessment = vilotiderRepository.assessments.find((candidate) => candidate.topicId === 'topic_d2_taxi_vilotider');
  assert.ok(assessment);
  const first = startCheckpointAttempt(DEMO_USER_ID, assessment!.id);
  const answer = saveAttemptAnswer(first.id, first.questions[0].id, 'a');
  const repeatedAnswer = saveAttemptAnswer(first.id, first.questions[0].id, 'b');
  const resumed = startCheckpointAttempt(DEMO_USER_ID, assessment!.id);
  const state = getLearningSnapshot().state;
  assert.equal(resumed.id, first.id);
  assert.equal(repeatedAnswer.id, answer.id);
  assert.equal(state.answers.filter((candidate) => candidate.attemptQuestionId === first.questions[0].id).length, 1);
  assert.equal(state.answers.find((candidate) => candidate.attemptQuestionId === first.questions[0].id)?.selectedChoiceId, 'b');
}

export function testP0D1AndD2MockResumeUsesFrozenAttempts() {
  resetLearningStateForTests();
  const d1 = startMockAttempt(DEMO_USER_ID, 'blueprint_d1_realistic_full_mock_v1');
  const d2 = startMockAttempt(DEMO_USER_ID, 'blueprint_d2_realistic_full_mock_v1');
  const d1Resume = startMockAttempt(DEMO_USER_ID, 'blueprint_d1_realistic_full_mock_v1');
  const d2Resume = startMockAttempt(DEMO_USER_ID, 'blueprint_d2_realistic_full_mock_v1');
  assert.equal(d1Resume.id, d1.id);
  assert.equal(d2Resume.id, d2.id);
  assert.deepEqual(d1Resume.questions, d1.questions);
  assert.deepEqual(d2Resume.questions, d2.questions);
}

export function testP0FinalizationIsIdempotent() {
  resetLearningStateForTests();
  const attempt = startMockAttempt(DEMO_USER_ID, 'blueprint_d1_realistic_full_mock_v1');
  const first = submitAttempt(attempt.id, {}, true);
  const second = submitAttempt(attempt.id, {}, true);
  assert.equal(first.attempt.id, second.attempt.id);
  assert.equal(getLearningSnapshot().state.answers.filter((answer) => answer.attemptId === attempt.id).length, attempt.totalQuestions);
}

export function testP0SupabaseMigrationContainsSecurityAndFrozenStateFields() {
  const migration = readFileSync(resolve(root, 'supabase/migrations/202609100001_attempt_persistence.sql'), 'utf8');
  for (const field of ['blueprint_version', 'scoring_role', 'timed_out', 'client_attempt_id', 'question_snapshot', 'lesson_key']) {
    assert.ok(migration.includes(field), `${field} is missing from the persistence migration.`);
  }
  assert.match(migration, /auth\.uid\(\) = user_id/);
  assert.match(migration, /status in \('completed', 'timed_out', 'abandoned'\)/);
}