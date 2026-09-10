import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { d2TaxiLawRepository } from '../src/vilotiderRepository';

type Json = any;

const questionFiles = [
  'data/questions/d1-eco-driving/eco-driving-questions.json',
  'data/questions/d1-environment/environment-questions.json',
  'data/questions/d1-health-disabilities/health-disabilities-questions.json',
  'data/questions/d1-navigation/navigation-questions.json',
  'data/questions/d1-safety/safety-questions.json',
  'data/questions/d1-service/service-questions.json',
  'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
  'data/questions/d1-work-environment-risk/work-environment-risk-questions.json',
  'data/questions/d2-taxi-law/remaining-topics-questions.json',
  'data/questions/d2-taxi-law/vilotider-questions.json',
  'data/questions/d2-traffic-law/traffic-law-questions.json',
];

const factFiles = [
  'data/content/d1-eco-driving/eco-driving-facts.json',
  'data/content/d1-environment/environment-facts.json',
  'data/content/d1-health-disabilities/health-disabilities-facts.json',
  'data/content/d1-navigation/navigation-facts.json',
  'data/content/d1-safety/safety-facts.json',
  'data/content/d1-service/service-facts.json',
  'data/content/d1-vehicle-knowledge/vehicle-facts.json',
  'data/content/d1-work-environment-risk/work-environment-risk-facts.json',
  'data/content/d2-taxi-law/remaining-topics-facts.json',
  'data/content/d2-taxi-law/vilotider-facts.json',
  'data/content/d2-traffic-law/traffic-law-facts.json',
];

const lessonFiles = [
  'data/content/d1-eco-driving/eco-driving-lessons.json',
  'data/content/d1-environment/environment-lessons.json',
  'data/content/d1-health-disabilities/health-disabilities-lessons.json',
  'data/content/d1-navigation/navigation-lessons.json',
  'data/content/d1-safety/safety-lessons.json',
  'data/content/d1-service/service-lessons.json',
  'data/content/d1-vehicle-knowledge/vehicle-lessons.json',
  'data/content/d1-work-environment-risk/work-environment-risk-lessons.json',
  'data/content/d2-taxi-law/remaining-topics-lessons.json',
  'data/content/d2-taxi-law/vilotider-lessons.json',
  'data/content/d2-traffic-law/traffic-law-lessons.json',
];

function loadJson(relativePath: string): Json {
  return JSON.parse(readFileSync(resolve(__dirname, '../../../../', relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function allQuestions() {
  return questionFiles.flatMap((path) => loadJson(path).questions);
}

function allFacts() {
  return factFiles.flatMap((path) => loadJson(path).facts);
}

function allLessons() {
  return lessonFiles.flatMap((path) => loadJson(path).lessons);
}

function assertNoDuplicates(values: string[], label: string) {
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalize(value);
    assert.ok(!seen.has(normalized), `${label} duplicated: ${value}`);
    seen.add(normalized);
  }
}

export function testQuestionCoverageV2BacklogRowsAreSufficient() {
  const actions = loadJson('data/quality/question-coverage-backlog-v2-actions.json').actions;
  const questions = allQuestions();

  assert.equal(actions.length, 45);

  for (const action of actions) {
    const count = questions.filter((question) => question.status === 'published' && question.requirement_keys?.includes(action.requirementKey)).length;
    assert.ok(count >= 3, `${action.requirementKey} still has weak question coverage.`);
    assert.equal(action.classification, 'GENUINELY_UNDERCOVERED');
  }
}

export function testQuestionCoverageV2NewQuestionsHaveTraceability() {
  const facts = new Map(allFacts().map((fact: Json) => [fact.stable_key, fact] as [string, Json]));
  const lessons = new Map(allLessons().map((lesson: Json) => [lesson.stable_key, lesson] as [string, Json]));
  const newQuestions = allQuestions().filter((question) => question.stable_key.includes('-COVERAGE-'));

  assert.equal(newQuestions.length, 55);

  for (const question of newQuestions) {
    const lesson = lessons.get(question.lesson_key);
    assert.equal(question.status, 'published');
    assert.ok(lesson, `${question.stable_key} points to unknown lesson.`);
    assert.ok(question.requirement_keys.length > 0, `${question.stable_key} has no requirement.`);
    assert.ok(question.fact_keys.length > 0, `${question.stable_key} has no facts.`);
    assert.ok(question.source_references.length > 0, `${question.stable_key} has no sources.`);
    assert.ok(question.competencies?.length || question.competency_tags?.length, `${question.stable_key} has no competency metadata.`);
    assert.equal(question.answer_choices.filter((choice: Json) => choice.id === question.correct_answer_id).length, 1);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not support answer.`);
    for (const factKey of question.fact_keys) {
      const fact = facts.get(factKey);
      assert.ok(fact, `${question.stable_key} points to unknown fact ${factKey}.`);
      assert.ok(question.requirement_keys.includes(fact.requirement_key), `${question.stable_key} fact requirement is not linked.`);
      assert.ok(lesson.fact_keys.includes(factKey), `${question.stable_key} fact is not taught in linked lesson.`);
      assert.ok(question.source_references.some((source: Json) => source.source_id === fact.source_id && source.exact_reference.length > 0));
    }
  }
}

export function testQuestionCoverageV2HasNoExactDuplicates() {
  const questions = allQuestions();
  assertNoDuplicates(questions.map((question) => question.stable_key), 'question stable key');
  assertNoDuplicates(questions.map((question) => question.prompt), 'question prompt');
  assertNoDuplicates(questions.map((question) => question.answer_choices.map((choice: Json) => normalize(choice.text)).sort().join('|')), 'question answer set');
}

export function testQuestionCoverageV2CalculationAndVisualGates() {
  const newQuestions = allQuestions().filter((question) => question.stable_key.includes('-COVERAGE-'));

  for (const question of newQuestions) {
    if (question.question_type === 'calculation') {
      assert.ok(question.calculation_metadata, `${question.stable_key} calculation lacks metadata.`);
      assert.ok(question.calculation_metadata.inputs.length > 0);
      assert.ok(question.calculation_metadata.method.length > 0);
      assert.ok(question.calculation_metadata.worked_example.length > 0);
    }

    const visual = question.visual_metadata ?? question.navigation_metadata;
    if (question.status === 'published' && (visual?.requires_image || visual?.requires_diagram || visual?.requires_road_scene || visual?.requires_map)) {
      assert.notEqual(question.visual_correctness_depends_on_asset, true, `${question.stable_key} depends on a missing visual asset.`);
    }
  }
}

export function testQuestionCoverageV2MockBlueprintsAreUnchanged() {
  const d1 = d2TaxiLawRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d1_realistic_full_mock_v1');
  const d2 = d2TaxiLawRepository.examBlueprints.find((blueprint) => blueprint.id === 'blueprint_d2_realistic_full_mock_v1');

  assert.equal(d1?.scoringQuestionCount, 65);
  assert.equal(d1?.nonScoringTestQuestionCount, 5);
  assert.equal(d1?.totalDisplayedQuestionCount, 70);
  assert.equal(d2?.scoringQuestionCount, 46);
  assert.equal(d2?.nonScoringTestQuestionCount, 4);
  assert.equal(d2?.totalDisplayedQuestionCount, 50);
}

export function testQuestionCoverageV2AllActiveRequirementsRecalculated() {
  const curriculum = loadJson('data/curriculum/requirements.json');
  const activeRequirements = curriculum.requirements.filter((requirement: Json) => requirement.active);
  const questions = allQuestions();

  assert.equal(activeRequirements.length, 136);

  for (const requirement of activeRequirements) {
    const count = questions.filter((question) => question.status === 'published' && question.requirement_keys?.includes(requirement.stable_key)).length;
    assert.ok(count > 0, `${requirement.stable_key} has no published questions.`);
  }
}
