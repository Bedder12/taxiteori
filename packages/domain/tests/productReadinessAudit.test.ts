import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectDisplayedQuestionsForBlueprint, selectSubjectCheckpointQuestions } from '../src';
import { isQuestionEligibleForMock } from '../src/examEngine';
import { vilotiderRepository } from '../src/vilotiderRepository';

type Json = any;
const root = resolve(__dirname, '../../../../');

function readJson(relativePath: string): Json {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8').replace(/^\uFEFF/, ''));
}

function contentFiles(directory: string, suffix: string) {
  const result: string[] = [];
  function visit(relativeDirectory: string) {
    for (const entry of readdirSync(resolve(root, relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) visit(relativePath);
      else if (entry.name.endsWith(suffix)) result.push(relativePath);
    }
  }
  visit(directory);
  return result;
}

export function testProductReadinessCurriculumAndPublishedReachability() {
  const d1 = vilotiderRepository.subjects.filter((subject) => subject.examId === 'exam_d1_sakerhet_beteende' && subject.status === 'published');
  const d2 = vilotiderRepository.subjects.filter((subject) => subject.examId === 'exam_d2_lagstiftning' && subject.status === 'published');
  assert.equal(d1.length, 8);
  assert.equal(d2.length, 2);
  assert.equal(vilotiderRepository.subjects.length, 10);

  const topicIds = new Set(vilotiderRepository.topics.filter((topic) => topic.status === 'published').map((topic) => topic.id));
  const lessonIds = new Set(vilotiderRepository.lessons.filter((lesson) => lesson.status === 'published').map((lesson) => lesson.id));
  for (const topic of vilotiderRepository.topics.filter((candidate) => candidate.status === 'published')) {
    assert.ok(vilotiderRepository.subjects.some((subject) => subject.id === topic.subjectId && subject.status === 'published'));
    assert.ok(getOrderedLessonsForTopic(vilotiderRepository, topic.id).length > 0, `${topic.id} has no reachable lesson.`);
  }
  for (const lesson of vilotiderRepository.lessons.filter((candidate) => candidate.status === 'published')) {
    assert.ok(topicIds.has(lesson.topicId), `${lesson.id} points to an unpublished or missing topic.`);
  }
  for (const question of vilotiderRepository.questionVersions.filter((candidate) => candidate.status === 'published')) {
    assert.ok(vilotiderRepository.subjects.some((subject) => subject.id === question.subjectId && subject.status === 'published'), `${question.stableKey} has no published subject.`);
    assert.ok(!question.topicId || topicIds.has(question.topicId), `${question.stableKey} has no published topic.`);
    assert.ok(!question.lessonId || lessonIds.has(question.lessonId), `${question.stableKey} has no published lesson.`);
  }
}

export function testProductReadinessEveryCheckpointAndMockIsReachable() {
  for (const assessment of vilotiderRepository.assessments.filter((candidate) => candidate.status === 'published')) {
    assert.ok(assessment.subjectId);
    const selected = assessment.topicId
      ? selectCheckpointQuestions(assessment.id, assessment.subjectId!, assessment.topicId, assessment.questionCount, vilotiderRepository.questionVersions)
      : selectSubjectCheckpointQuestions(assessment.id, assessment.subjectId!, assessment.questionCount, vilotiderRepository.questionVersions);
    assert.equal(selected.length, assessment.questionCount, `${assessment.id} cannot select its published question count.`);
  }

  for (const blueprint of vilotiderRepository.examBlueprints.filter((candidate) => candidate.active)) {
    const displayed = selectDisplayedQuestionsForBlueprint(blueprint, vilotiderRepository.questionVersions, { seed: `readiness:${blueprint.id}` });
    assert.equal(displayed.length, blueprint.totalDisplayedQuestionCount ?? blueprint.scoringQuestionCount);
    assert.ok(displayed.every((question) => isQuestionEligibleForMock(question)));
  }
  assert.ok(existsSync(resolve(root, 'src/app/exam/[examId]/mock.tsx')), 'Full mock route is missing.');
  assert.ok(existsSync(resolve(root, 'src/app/result/[attemptId].tsx')), 'Result route is missing.');
}

export function testProductReadinessNoOrphanFactsOrPublishedBanks() {
  const factFiles = contentFiles('data/content', '-facts.json');
  const lessonFiles = contentFiles('data/content', '-lessons.json');
  const questionFiles = contentFiles('data/questions', '-questions.json');
  const factKeys = new Set<string>();
  const referencedFactKeys = new Set<string>();
  for (const file of factFiles) {
    for (const fact of readJson(file).facts ?? []) factKeys.add(fact.stable_key);
  }
  for (const file of lessonFiles) {
    for (const lesson of readJson(file).lessons ?? []) for (const key of lesson.fact_keys ?? []) referencedFactKeys.add(key);
  }
  for (const file of questionFiles) {
    for (const question of readJson(file).questions ?? []) for (const key of question.fact_keys ?? []) referencedFactKeys.add(key);
  }
  for (const key of factKeys) assert.ok(referencedFactKeys.has(key), `${key} is an orphan fact.`);
  assert.ok(vilotiderRepository.lessons.every((lesson) => lesson.status !== 'published' || lesson.blocks.length > 0));
  assert.ok(vilotiderRepository.questionVersions.every((question) => question.status !== 'published' || question.prompt.trim().length > 0));
}