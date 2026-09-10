import assert from 'node:assert/strict';

import {
  createAttemptSnapshot,
  isQuestionEligibleForMock,
  resetIdSequenceForTests,
  scoreAttempt,
  selectDisplayedQuestionsForBlueprint,
  selectQuestionsForBlueprint,
} from '../src';
import { d2TaxiLawRepository } from '../src/vilotiderRepository';

const blueprintId = 'blueprint_d1_realistic_full_mock_v1';
const subjectCounts: Record<string, number> = {
  subject_d1_navigation: 10,
  subject_d1_korekonomi: 6,
  subject_d1_miljo: 6,
  subject_d1_sakerhet: 10,
  subject_d1_bemotande: 12,
  subject_d1_sjukdomar: 8,
  subject_d1_arbetsmiljo: 6,
  subject_d1_fordonskannedom: 7,
};

function getBlueprint() {
  const blueprint = d2TaxiLawRepository.examBlueprints.find((candidate) => candidate.id === blueprintId);
  assert.ok(blueprint);
  return blueprint;
}

export function testD1MockBlueprintMatchesOfficialStructure() {
  const blueprint = getBlueprint();
  assert.equal(blueprint.version, 1);
  assert.equal(blueprint.status, 'published');
  assert.equal(blueprint.scoringQuestionCount, 65);
  assert.equal(blueprint.passingScore, 48);
  assert.equal(blueprint.passThreshold, 48 / 65);
  assert.equal(blueprint.nonScoringTestQuestionCount, 5);
  assert.equal(blueprint.totalDisplayedQuestionCount, 70);
  assert.equal(blueprint.timeLimitSeconds, 3000);
  assert.match(blueprint.label ?? '', /not an official Trafikverket exam/);
  assert.match(blueprint.disclaimer ?? '', /own training questions/);
  assert.deepEqual(Object.fromEntries(blueprint.subjects.map((subject) => [subject.subjectId, subject.questionCount])), subjectCounts);
  assert.equal(blueprint.subjects.reduce((sum, subject) => sum + subject.questionCount, 0), 65);
}

export function testD1MockPoolCapacityAndVisualGate() {
  const blueprint = getBlueprint();
  const eligible = d2TaxiLawRepository.questionVersions.filter((question) => isQuestionEligibleForMock(question) && question.examId === blueprint.examId);
  for (const [subjectId, required] of Object.entries(subjectCounts)) {
    const pool = eligible.filter((question) => question.subjectId === subjectId);
    assert.ok(pool.length >= required, `${subjectId} has ${pool.length} eligible questions for ${required} required.`);
    assert.ok(pool.every((question) => question.status === 'published'));
    assert.ok(pool.every((question) => question.visualMetadata?.visualCorrectnessDependsOnAsset !== true));
    assert.ok(pool.every((question) => question.requirementKeys?.length && question.factKeys?.length && question.sourceReferences?.length));
  }
}

export function testD1MockVariationAndExactAllocation() {
  const blueprint = getBlueprint();
  const seenAcrossAttempts = new Set<string>();
  for (let index = 0; index < 25; index += 1) {
    const displayed = selectDisplayedQuestionsForBlueprint(blueprint, d2TaxiLawRepository.questionVersions, { seed: `d1-retake-${index}` });
    const scored = displayed.filter((question) => question.scoringRole === 'scored');
    const nonScoring = displayed.filter((question) => question.scoringRole === 'non_scoring_simulation');
    assert.equal(displayed.length, 70);
    assert.equal(scored.length, 65);
    assert.equal(nonScoring.length, 5);
    assert.equal(new Set(displayed.map((question) => question.id)).size, 70);
    assert.equal(new Set(scored.map((question) => question.id).filter((id) => nonScoring.some((question) => question.id === id))).size, 0);
    const bySubject = new Map<string, number>();
    for (const question of scored) bySubject.set(question.subjectId, (bySubject.get(question.subjectId) ?? 0) + 1);
    assert.deepEqual(Object.fromEntries(bySubject), subjectCounts);
    for (const question of displayed) seenAcrossAttempts.add(question.id);
  }
  assert.ok(seenAcrossAttempts.size > 70, 'Retakes should provide meaningful variation when pools allow it.');
}

export function testD1MockAttemptFreezesVersionsRolesAndBlueprint() {
  resetIdSequenceForTests();
  const blueprint = getBlueprint();
  const selected = selectDisplayedQuestionsForBlueprint(blueprint, d2TaxiLawRepository.questionVersions, { seed: 'd1-freeze' });
  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: blueprint.id,
    type: 'mock_exam',
    selectedQuestions: selected,
    passThreshold: blueprint.passThreshold,
    passingScore: blueprint.passingScore,
    blueprintVersion: blueprint.version,
    timeLimitSeconds: blueprint.timeLimitSeconds,
    startedAt: '2026-09-10T10:00:00.000Z',
  });
  assert.equal(attempt.totalQuestions, 70);
  assert.equal(attempt.scoringQuestionCount, 65);
  assert.equal(attempt.passingScore, 48);
  assert.equal(attempt.blueprintVersion, 1);
  assert.equal(attempt.timeLimitSeconds, 3000);
  assert.equal(attempt.questions.filter((question) => question.scoringRole === 'scored').length, 65);
  assert.equal(attempt.questions.filter((question) => question.scoringRole === 'non_scoring_simulation').length, 5);
  const changedLater = { ...selected[0], id: `${selected[0].id}_v2`, version: 2, scoringRole: 'non_scoring_simulation' as const };
  assert.notEqual(attempt.questions[0].questionVersionId, changedLater.id);
  assert.notEqual(attempt.questions[0].scoringRole, changedLater.scoringRole);
}

export function testD1MockScoringIgnoresSimulationQuestionsAndBreaksDownSubjects() {
  resetIdSequenceForTests();
  const blueprint = getBlueprint();
  const selected = selectDisplayedQuestionsForBlueprint(blueprint, d2TaxiLawRepository.questionVersions, { seed: 'd1-score' });
  const attempt = createAttemptSnapshot({ userId: 'user_1', assessmentId: blueprint.id, type: 'mock_exam', selectedQuestions: selected, passThreshold: blueprint.passThreshold, passingScore: 48, blueprintVersion: 1 });
  let correctScoredAnswers = 0;
  const choices = Object.fromEntries(attempt.questions.map((question) => {
    const source = selected.find((candidate) => candidate.id === question.questionVersionId)!;
    const isCorrect = question.scoringRole === 'scored' && correctScoredAnswers < 48;
    if (isCorrect) correctScoredAnswers += 1;
    return [question.id, isCorrect ? source.correctChoiceId : 'wrong'];
  }));
  const result = scoreAttempt(attempt, d2TaxiLawRepository.questionVersions, choices, '2026-09-10T11:00:00.000Z');
  assert.equal(result.attempt.score, 48);
  assert.equal(result.attempt.passed, true);
  assert.equal(result.answers.length, 70);
  assert.equal(Object.values(result.subjectBreakdown).reduce((sum, subject) => sum + subject.total, 0), 65);
  assert.throws(() => scoreAttempt(result.attempt, d2TaxiLawRepository.questionVersions, choices), /immutable/);
}

export function testD1MockRetakesRemainSeparateAndTimed() {
  const blueprint = getBlueprint();
  const first = createAttemptSnapshot({ userId: 'user_1', assessmentId: blueprint.id, type: 'mock_exam', selectedQuestions: selectDisplayedQuestionsForBlueprint(blueprint, d2TaxiLawRepository.questionVersions, { seed: 'retake-a' }), passThreshold: blueprint.passThreshold, passingScore: 48, blueprintVersion: 1, timeLimitSeconds: 3000 });
  const second = createAttemptSnapshot({ userId: 'user_1', assessmentId: blueprint.id, type: 'mock_exam', selectedQuestions: selectDisplayedQuestionsForBlueprint(blueprint, d2TaxiLawRepository.questionVersions, { seed: 'retake-b' }), passThreshold: blueprint.passThreshold, passingScore: 48, blueprintVersion: 1, timeLimitSeconds: 3000 });
  assert.notEqual(first.id, second.id);
  assert.equal(first.status, 'in_progress');
  assert.equal(first.timeLimitSeconds, 3000);
  assert.equal(first.timedOut, false);
  assert.notDeepEqual(first.questions.map((question) => question.questionVersionId), second.questions.map((question) => question.questionVersionId));
}