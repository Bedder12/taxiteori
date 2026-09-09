import assert from 'node:assert/strict';

import { demoRepository } from '../src/demoData';
import {
  createAttemptSnapshot,
  getBlueprintAllocation,
  resetIdSequenceForTests,
  scoreAttempt,
  selectCheckpointQuestions,
  selectQuestionsForBlueprint,
} from '../src';

export function testBlueprintAllocation() {
  const d1 = demoRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d1_official_mock');
  const d2 = demoRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d2_official_mock');

  assert.ok(d1);
  assert.ok(d2);
  assert.equal(getBlueprintAllocation(d1!).reduce((sum, item) => sum + item.questionCount, 0), 65);
  assert.equal(getBlueprintAllocation(d2!).reduce((sum, item) => sum + item.questionCount, 0), 46);
  assert.deepEqual(getBlueprintAllocation(d2!), [
    { subjectId: 'subject_d2_taxitrafiklagstiftning', questionCount: 23 },
    { subjectId: 'subject_d2_trafiklagstiftning', questionCount: 23 },
  ]);
}

export function testQuestionSelection() {
  const d2 = demoRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d2_official_mock');
  assert.ok(d2);

  const selected = selectQuestionsForBlueprint(d2!, demoRepository.questionVersions, { seed: 'test' });

  assert.equal(selected.length, 18);
  assert.ok(selected.every((question) => question.subjectId === 'subject_d2_taxitrafiklagstiftning'));
  assert.ok(selected.every((question) => question.status === 'published'));
  assert.ok(selected.every((question) => question.contexts.includes('assessment')));
}

export function testInvalidQuestionStatuses() {
  const withInvalidStatuses = [
    ...demoRepository.questionVersions,
    { ...demoRepository.questionVersions[0], id: 'draft_version', questionId: 'draft_question', stableKey: 'DRAFT', status: 'draft' as const },
    { ...demoRepository.questionVersions[1], id: 'archived_version', questionId: 'archived_question', stableKey: 'ARCHIVED', status: 'archived' as const },
  ];

  const selected = selectCheckpointQuestions(
    'assessment_vilotider_checkpoint',
    'subject_d2_taxitrafiklagstiftning',
    'topic_d2_taxi_vilotider',
    20,
    withInvalidStatuses,
  );

  assert.equal(selected.length, 18);
  assert.ok(selected.every((question) => question.status === 'published'));
}

export function testAttemptSnapshotVersioning() {
  resetIdSequenceForTests();
  const selected = demoRepository.questionVersions.slice(0, 2);
  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: 'assessment_vilotider_checkpoint',
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: 0.75,
    startedAt: '2026-09-09T10:00:00.000Z',
  });

  const updatedQuestionBank = demoRepository.questionVersions.map((question) =>
    question.id === selected[0].id ? { ...question, id: `${question.id}_v2`, version: 2, prompt: 'Changed later' } : question,
  );

  assert.equal(attempt.questions[0].questionVersionId, selected[0].id);
  assert.equal(attempt.questions[0].version, 1);
  assert.ok(!updatedQuestionBank.some((question) => question.id === attempt.questions[0].questionVersionId && question.version === 2));
}

export function testScoring() {
  resetIdSequenceForTests();
  const selected = demoRepository.questionVersions.slice(0, 4);
  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: 'assessment_vilotider_checkpoint',
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: 0.75,
    startedAt: '2026-09-09T10:00:00.000Z',
  });
  const choices = Object.fromEntries(
    attempt.questions.map((attemptQuestion, index) => [
      attemptQuestion.id,
      index < 3 ? selected[index].correctChoiceId : 'definitely-wrong',
    ]),
  );

  const result = scoreAttempt(attempt, demoRepository.questionVersions, choices, '2026-09-09T10:05:00.000Z');

  assert.equal(result.attempt.score, 3);
  assert.equal(result.attempt.passed, true);
  assert.equal(result.answers.filter((answer) => answer.correct).length, 3);
  assert.throws(() => scoreAttempt(result.attempt, demoRepository.questionVersions, choices), /immutable/);
}

export function testAnswerUserBoundary() {
  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: 'assessment_vilotider_checkpoint',
    type: 'checkpoint',
    selectedQuestions: demoRepository.questionVersions.slice(0, 1),
    passThreshold: 0.75,
  });
  const choices = { [attempt.questions[0].id]: demoRepository.questionVersions[0].correctChoiceId };
  const result = scoreAttempt(attempt, demoRepository.questionVersions, choices);

  assert.equal(result.answers[0].userId, 'user_1');
}
