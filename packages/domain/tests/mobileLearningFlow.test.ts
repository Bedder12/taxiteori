import assert from 'node:assert/strict';

import {
  completeLessonFact,
  createAttemptSnapshot,
  getFirstIncompleteLesson,
  getOrderedLessonsForTopic,
  getTopicLearningProgress,
  scoreAttempt,
  selectCheckpointQuestions,
} from '../src';
import { vilotiderRepository } from '../src/vilotiderRepository';
import { completeLesson, DEMO_USER_ID, getLearningSnapshot, resetLearningStateForTests } from '../../../src/lib/learningStore';

const topicId = 'topic_d2_taxi_vilotider';
const assessmentId = 'D2-TAXI-VILOTIDER-CHECKPOINT-001';

export function testMobileFlowLessonOrdering() {
  const lessons = getOrderedLessonsForTopic(vilotiderRepository, topicId);

  assert.deepEqual(
    lessons.map((lesson) => lesson.title),
    [
      'Varför finns vilotidsregler?',
      'Vilotidsbestämmelser',
      'Arbetstid, förare och arbetsgivare',
      'Beräkna dygnsvila',
      'Anteckna dygnsvila',
      'Scenarioövningar',
    ],
  );
}

export function testMobileFlowFirstIncompleteLesson() {
  const lessons = getOrderedLessonsForTopic(vilotiderRepository, topicId);
  const facts = [completeLessonFact(DEMO_USER_ID, lessons[0].id, '2026-09-09T10:00:00.000Z')];

  assert.equal(
    getFirstIncompleteLesson({ repository: vilotiderRepository, topicId, facts: [], userId: DEMO_USER_ID })?.id,
    lessons[0].id,
  );
  assert.equal(
    getFirstIncompleteLesson({ repository: vilotiderRepository, topicId, facts, userId: DEMO_USER_ID })?.id,
    lessons[1].id,
  );
}

export function testMobileFlowLessonCompletionPersistence() {
  resetLearningStateForTests();
  const lesson = getOrderedLessonsForTopic(vilotiderRepository, topicId)[0];

  completeLesson(DEMO_USER_ID, lesson.id);

  const snapshot = getLearningSnapshot();
  assert.ok(
    snapshot.state.facts.some((fact) => fact.type === 'lesson_completed' && fact.userId === DEMO_USER_ID && fact.lessonId === lesson.id),
  );
}

export function testMobileFlowTopicProgressDerivation() {
  const lessons = getOrderedLessonsForTopic(vilotiderRepository, topicId);
  const facts = lessons.slice(0, 3).map((lesson, index) => completeLessonFact(DEMO_USER_ID, lesson.id, `2026-09-09T10:0${index}:00.000Z`));

  const progress = getTopicLearningProgress({ repository: vilotiderRepository, topicId, facts, userId: DEMO_USER_ID });

  assert.equal(progress?.totalLessons, 6);
  assert.equal(progress?.completedLessons, 3);
  assert.equal(progress?.learningPercent, 50);
}

export function testMobileFlowCheckpointUsesFifteenQuestions() {
  const assessment = vilotiderRepository.assessments.find((candidate) => candidate.id === assessmentId);
  assert.ok(assessment);

  const selected = selectCheckpointQuestions(
    assessment!.id,
    assessment!.subjectId!,
    assessment!.topicId!,
    assessment!.questionCount,
    vilotiderRepository.questionVersions,
  );

  assert.equal(selected.length, 15);
  assert.ok(selected.every((question) => question.status === 'published'));
}

export function testMobileFlowQuestionVersionsRemainFrozen() {
  const selected = selectCheckpointQuestions(
    assessmentId,
    'subject_d2_taxitrafiklagstiftning',
    topicId,
    15,
    vilotiderRepository.questionVersions,
  );
  const attempt = createAttemptSnapshot({
    userId: DEMO_USER_ID,
    assessmentId,
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: 0.8,
    startedAt: '2026-09-09T10:00:00.000Z',
  });
  const changedLater = { ...selected[0], id: `${selected[0].id}_v2`, version: 2, prompt: 'Changed after attempt start' };

  assert.equal(attempt.questions[0].questionVersionId, selected[0].id);
  assert.equal(attempt.questions[0].version, 1);
  assert.notEqual(attempt.questions[0].questionVersionId, changedLater.id);
}

export function testMobileFlowCompletedAttemptCannotBeAltered() {
  const selected = vilotiderRepository.questionVersions.slice(0, 2);
  const attempt = createAttemptSnapshot({
    userId: DEMO_USER_ID,
    assessmentId,
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: 0.8,
  });
  const choices = Object.fromEntries(attempt.questions.map((attemptQuestion, index) => [attemptQuestion.id, selected[index].correctChoiceId]));
  const result = scoreAttempt(attempt, vilotiderRepository.questionVersions, choices, '2026-09-09T10:05:00.000Z');

  assert.throws(() => scoreAttempt(result.attempt, vilotiderRepository.questionVersions, choices), /immutable/);
}

export function testMobileFlowResultsAreDeterministic() {
  const selected = vilotiderRepository.questionVersions.slice(0, 4);
  const attemptA = createAttemptSnapshot({
    userId: DEMO_USER_ID,
    assessmentId,
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: 0.8,
    startedAt: '2026-09-09T10:00:00.000Z',
  });
  const attemptB = { ...attemptA, id: 'attempt_copy', questions: attemptA.questions.map((question) => ({ ...question, attemptId: 'attempt_copy' })) };
  const choices = Object.fromEntries(
    attemptA.questions.map((attemptQuestion, index) => [
      attemptQuestion.id,
      index < 3 ? selected[index].correctChoiceId : 'wrong',
    ]),
  );
  const copiedChoices = Object.fromEntries(attemptB.questions.map((attemptQuestion, index) => [attemptQuestion.id, Object.values(choices)[index]]));

  const resultA = scoreAttempt(attemptA, vilotiderRepository.questionVersions, choices, '2026-09-09T10:05:00.000Z');
  const resultB = scoreAttempt(attemptB, vilotiderRepository.questionVersions, copiedChoices, '2026-09-09T10:05:00.000Z');

  assert.equal(resultA.attempt.score, resultB.attempt.score);
  assert.equal(resultA.attempt.passed, resultB.attempt.passed);
}
