import assert from 'node:assert/strict';

import { selectDisplayedQuestionsForBlueprint } from '../src';
import { d2TaxiLawRepository, d2TaxiLawFactRecords, d2TrafficLawFactRecords } from '../src/vilotiderRepository';

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function d2PublishedQuestions() {
  return d2TaxiLawRepository.questionVersions.filter(
    (question) => question.examId === 'exam_d2_lagstiftning' && question.status === 'published',
  );
}

export function testD2QualityGateHasNoDuplicateStableKeys() {
  const stableKeys = [
    ...d2TaxiLawRepository.topics.map((item) => item.id),
    ...d2TaxiLawRepository.lessons.map((item) => item.id),
    ...d2PublishedQuestions().map((item) => item.stableKey),
    ...d2TaxiLawFactRecords.map((item) => item.stable_key),
    ...d2TrafficLawFactRecords.map((item) => item.stable_key),
  ];

  assert.equal(new Set(stableKeys).size, stableKeys.length);
}

export function testD2QualityGateHasNoDuplicateQuestionText() {
  const prompts = d2PublishedQuestions().map((question) => normalize(question.prompt));
  assert.equal(new Set(prompts).size, prompts.length);
}

export function testD2QualityGateHasNoDuplicateAnswerSets() {
  const answerSets = d2PublishedQuestions().map((question) =>
    question.choices.map((choice) => normalize(choice.text)).join('|'),
  );

  assert.equal(new Set(answerSets).size, answerSets.length);
}

export function testD2QualityGatePublishedVisualQuestionsRequireAssets() {
  const visualAssetDependentQuestions = d2PublishedQuestions().filter(
    (question) =>
      question.visualMetadata?.requiresImage &&
      /bilden|vägmärket på bilden|vilket vägmärke visas/i.test(question.prompt),
  );

  assert.equal(visualAssetDependentQuestions.length, 0);
}

export function testD2QualityGatePublishedQuestionsHaveExplanations() {
  for (const question of d2PublishedQuestions()) {
    assert.ok(question.explanation.trim().length > 0, `${question.stableKey} has no explanation.`);
    assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId), `${question.stableKey} has no correct choice.`);
  }
}

export function testD2QualityGatePublishedQuestionsHaveTraceability() {
  const factKeys = new Set([...d2TaxiLawFactRecords, ...d2TrafficLawFactRecords].map((fact) => fact.stable_key));
  const lessonById = new Map(d2TaxiLawRepository.lessons.map((lesson) => [lesson.id, lesson]));

  for (const question of d2PublishedQuestions()) {
    assert.ok(question.requirementKeys?.length, `${question.stableKey} has no requirement traceability.`);
    assert.ok(question.factKeys?.length, `${question.stableKey} has no fact traceability.`);
    assert.ok(question.sourceReferences?.length, `${question.stableKey} has no source traceability.`);
    assert.ok(question.lessonId, `${question.stableKey} has no lesson.`);

    const lesson = lessonById.get(question.lessonId!);
    assert.ok(lesson, `${question.stableKey} points to an unknown lesson.`);

    for (const factKey of question.factKeys ?? []) {
      assert.ok(factKeys.has(factKey), `${question.stableKey} points to unknown fact ${factKey}.`);
      assert.ok(lesson!.factKeys?.includes(factKey), `${question.stableKey} uses fact ${factKey} outside its lesson.`);
    }
  }
}

export function testD2QualityGateMockAttemptHasNoDuplicateQuestions() {
  const blueprint = d2TaxiLawRepository.examBlueprints.find((candidate) => candidate.id === 'blueprint_d2_realistic_full_mock_v1');
  assert.ok(blueprint);

  for (const seed of ['quality-a', 'quality-b', 'quality-c']) {
    const displayed = selectDisplayedQuestionsForBlueprint(blueprint!, d2TaxiLawRepository.questionVersions, { seed });
    assert.equal(displayed.length, 50);
    assert.equal(displayed.filter((question) => question.scoringRole === 'scored').length, 46);
    assert.equal(displayed.filter((question) => question.scoringRole === 'non_scoring_simulation').length, 4);
    assert.equal(new Set(displayed.map((question) => question.id)).size, displayed.length);
  }
}
