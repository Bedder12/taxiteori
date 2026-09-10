import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1WorkEnvironmentRiskFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

type Json = any;

function loadJson(relativePath: string): Json {
  return JSON.parse(readFileSync(resolve(__dirname, '../../../../', relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function assertNoDuplicates(values: string[], label: string) {
  const seen = new Set<string>();
  for (const value of values) {
    const key = normalize(value);
    assert.ok(!seen.has(key), `${label} duplicated: ${value}`);
    seen.add(key);
  }
}

const curriculum = loadJson('data/curriculum/requirements.json');
const sourceMap = loadJson('data/curriculum/d1-work-environment-risk-sources.json');
const factsFile = loadJson('data/content/d1-work-environment-risk/work-environment-risk-facts.json');
const lessonsFile = loadJson('data/content/d1-work-environment-risk/work-environment-risk-lessons.json');
const visualsFile = loadJson('data/content/d1-work-environment-risk/work-environment-risk-visuals.json');
const questionsFile = loadJson('data/questions/d1-work-environment-risk/work-environment-risk-questions.json');

function requirementKeys() {
  return new Set(curriculum.requirements.filter((requirement: Json) => requirement.active && requirement.subject === 'D1_WORK_ENVIRONMENT_RISK').map((requirement: Json) => requirement.stable_key));
}

export function testD1WorkEnvironmentRiskRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  assert.equal(requirements.size, 12);
  assert.equal(sourceMap.metadata.active_requirement_count, requirements.size);
  assert.deepEqual(new Set(sourceMap.requirement_source_map.map((mapping: Json) => mapping.requirement_key)), requirements);
  for (const mapping of sourceMap.requirement_source_map) {
    assert.equal(mapping.overall_status, 'FULLY_SOURCED');
    assert.ok(mapping.sources.length >= 2);
    assert.ok(mapping.sources.some((source: Json) => source.source_type === 'primary_legal_source'));
    for (const source of mapping.sources) assert.equal(source.source_status, 'VERIFIED');
  }
}

export function testD1WorkEnvironmentRiskFactsAreVerifiedAndAuthorityTagged() {
  const requirements = requirementKeys();
  const sources = new Set(factsFile.sources.map((source: Json) => source.source_id));
  const allowed = new Set(['binding_rule', 'official_guidance', 'occupational_safety_guidance', 'authoritative_health_guidance']);
  assertNoDuplicates(factsFile.facts.map((fact: Json) => fact.stable_key), 'work fact stable key');
  assert.equal(d1WorkEnvironmentRiskFactRecords.length, factsFile.facts.length);
  for (const fact of factsFile.facts) {
    assert.ok(requirements.has(fact.requirement_key));
    assert.ok(sources.has(fact.source_id));
    assert.ok(fact.fact_text.length > 0 && fact.exact_reference.length > 0);
    assert.equal(fact.verification_status, 'verified');
    assert.ok(allowed.has(fact.authority_status));
  }
}

export function testD1WorkEnvironmentRiskLessonsAndQuestionsAreTraceable() {
  const requirements = requirementKeys();
  const facts = new Map<string, Json>(factsFile.facts.map((fact: Json) => [fact.stable_key, fact] as [string, Json]));
  const lessons = new Map<string, Json>(lessonsFile.lessons.map((lesson: Json) => [lesson.stable_key, lesson] as [string, Json]));
  const sourceIds = new Set(sourceMap.source_catalog.map((source: Json) => source.source_key));
  const visualIds = new Set(visualsFile.visuals.map((visual: Json) => visual.visual_id));
  assert.equal(lessonsFile.lessons.length, 6);
  for (const lesson of lessonsFile.lessons) {
    assert.equal(lesson.status, 'published');
    assert.ok(lesson.requirement_keys.every((key: string) => requirements.has(key)));
    assert.ok(lesson.fact_keys.every((key: string) => facts.has(key)));
    assert.ok(lesson.source_references.every((source: Json) => sourceIds.has(source.source_id) && source.exact_references.length > 0));
    assert.ok(lesson.visual_metadata.visual_asset_id && visualIds.has(lesson.visual_metadata.visual_asset_id));
    assert.ok(lesson.content_blocks.every((block: Json) => (block.text || block.items?.length) && block.fact_keys?.length));
  }
  assertNoDuplicates(questionsFile.questions.map((question: Json) => question.stable_key), 'work question stable key');
  assertNoDuplicates(questionsFile.questions.map((question: Json) => question.prompt), 'work question prompt');
  assertNoDuplicates(questionsFile.questions.map((question: Json) => question.answer_choices.map((choice: Json) => normalize(choice.text)).sort().join('|')), 'work answer set');
  assert.ok(questionsFile.questions.every((question: Json) => question.question_type === 'scenario'));
  for (const question of questionsFile.questions) {
    const lesson = lessons.get(question.lesson_key);
    const fact = facts.get(question.fact_keys[0]);
    assert.equal(question.status, 'published');
    assert.ok(lesson && fact);
    assert.equal(question.topic_id, lesson.topic_id);
    assert.ok(question.requirement_keys.includes(fact.requirement_key));
    assert.ok(lesson.fact_keys.includes(fact.stable_key));
    assert.equal(question.answer_choices.filter((choice: Json) => choice.id === question.correct_answer_id).length, 1);
    assert.ok(question.explanation.includes('Rätt:'));
    assert.ok(question.source_references.some((source: Json) => source.source_id === fact.source_id && source.exact_reference.length > 0));
  }
}

export function testD1WorkEnvironmentRiskCheckpointsAndPluggaIntegration() {
  const subjectId = 'subject_d1_arbetsmiljo';
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === subjectId);
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === subjectId);
  assert.equal(subject?.status, 'published');
  assert.equal(topics.length, 6);
  assert.equal(getOrderedLessonsForTopic(d2TaxiLawRepository, topics[0].id).length, 1);
  for (const checkpoint of questionsFile.topic_checkpoints) {
    const selected = selectCheckpointQuestions(checkpoint.stable_key, subjectId, checkpoint.topic, checkpoint.question_count, d2TaxiLawRepository.questionVersions);
    assert.equal(selected.length, checkpoint.question_count);
    assert.ok(selected.every((question) => question.topicId === checkpoint.topic));
  }
  const subjectSelected = selectSubjectCheckpointQuestions(questionsFile.subject_checkpoint.stable_key, subjectId, questionsFile.subject_checkpoint.question_count, d2TaxiLawRepository.questionVersions);
  assert.equal(subjectSelected.length, questionsFile.subject_checkpoint.question_count);
  assert.ok(new Set(subjectSelected.map((question) => question.topicId)).size >= 5);
  const publishedD1Subjects = d2TaxiLawRepository.subjects.filter((candidate) => candidate.examId === 'exam_d1_sakerhet_beteende' && candidate.status === 'published');
  assert.equal(publishedD1Subjects.length, 8);
  assert.ok(publishedD1Subjects.some((candidate) => candidate.id === subjectId));
}

export function testD1WorkEnvironmentRiskCrossSubjectDuplicateGate() {
  const existingQuestions = ['data/questions/d1-safety/safety-questions.json', 'data/questions/d1-service/service-questions.json', 'data/questions/d1-health-disabilities/health-disabilities-questions.json', 'data/questions/d1-eco-driving/eco-driving-questions.json', 'data/questions/d1-environment/environment-questions.json'].flatMap((path) => loadJson(path).questions);
  const existingPrompts = new Set(existingQuestions.map((question: Json) => normalize(question.prompt)));
  for (const question of questionsFile.questions) {
    assert.ok(!existingPrompts.has(normalize(question.prompt)), `${question.stable_key} duplicates an existing D1 prompt.`);
    assert.ok(!/lat kunden|moral|alltid|aldrig/i.test(question.prompt));
  }
}