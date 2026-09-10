import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1EnvironmentFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
    competency_type?: string;
  }[];
};

type VisualMetadata = {
  requires_image?: boolean;
  requires_diagram?: boolean;
  requires_comparison_visual?: boolean;
};

type SourceMap = {
  source_catalog: {
    source_key: string;
    source_type: string;
    authority: string;
    source_status: string;
  }[];
  requirement_source_map: {
    requirement_key: string;
    sources: { source_key: string; source_type: string; source_status: string }[];
    overall_status: string;
  }[];
  pedagogical_topics: {
    topic_id: string;
    visual_metadata?: VisualMetadata;
    status: string;
  }[];
};

type FactsFile = {
  sources: { source_id: string; authority: string; current_validity: string }[];
  facts: {
    stable_key: string;
    topic_id: string;
    requirement_key: string;
    source_id: string;
    exact_reference: string;
    verification_status: string;
    legal_or_guidance_status: string;
    cross_subject_fact_links?: string[];
  }[];
};

type LessonsFile = {
  lessons: {
    stable_key: string;
    topic_id: string;
    requirement_keys: string[];
    fact_keys: string[];
    source_references: { source_id: string; exact_references: string[] }[];
    visual_metadata?: VisualMetadata;
    status: string;
    content_blocks: {
      text?: string;
      items?: string[];
      fact_keys?: string[];
    }[];
  }[];
};

type QuestionsFile = {
  topic_checkpoints: {
    stable_key: string;
    topic: string;
    question_count: number;
    status: string;
  }[];
  subject_checkpoint: {
    stable_key: string;
    question_count: number;
    status: string;
  };
  questions: {
    stable_key: string;
    topic_id: string;
    requirement_keys: string[];
    fact_keys: string[];
    lesson_key: string;
    question_type: string;
    prompt: string;
    answer_choices: { id: string; text: string }[];
    correct_answer_id: string;
    explanation: string;
    source_references: { source_id: string; exact_reference: string }[];
    visual_metadata?: VisualMetadata;
    status: string;
  }[];
};

function loadJson<T>(relativePath: string) {
  const path = resolve(__dirname, '../../../../', relativePath);
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as T;
}

function loadCurriculum() {
  return loadJson<Curriculum>('data/curriculum/requirements.json');
}

function loadSourceMap() {
  return loadJson<SourceMap>('data/curriculum/d1-environment-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d1-environment/environment-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d1-environment/environment-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-environment/environment-questions.json');
}

function loadEcoQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-eco-driving/eco-driving-questions.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_ENVIRONMENT')
      .map((requirement) => requirement.stable_key),
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function assertNoDuplicates(values: string[], label: string) {
  const seen = new Set<string>();
  for (const value of values) {
    const normalized = normalize(value);
    assert.ok(!seen.has(normalized), `${label} duplicated: ${value}`);
    seen.add(normalized);
  }
}

export function testD1EnvironmentRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  const sourceMap = loadSourceMap();
  const sourceIds = new Set(sourceMap.source_catalog.map((source) => source.source_key));
  const mappedKeys = new Set(sourceMap.requirement_source_map.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 8);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no environment source mapping.`);
  }

  for (const mapping of sourceMap.requirement_source_map) {
    assert.equal(mapping.overall_status, 'FULLY_SOURCED', `${mapping.requirement_key} is not fully sourced.`);
    assert.ok(mapping.sources.some((source) => source.source_type === 'primary_legal_source'), `${mapping.requirement_key} has no primary source.`);
    for (const source of mapping.sources) {
      assert.ok(sourceIds.has(source.source_key), `${mapping.requirement_key} points to unknown source ${source.source_key}.`);
      assert.equal(source.source_status, 'VERIFIED', `${source.source_key} is not verified.`);
    }
  }
}

export function testD1EnvironmentFactsAreVerifiedAndSourced() {
  const requirements = requirementKeys();
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));
  const stableKeys = new Set<string>();

  for (const fact of loadFacts().facts) {
    assert.ok(!stableKeys.has(fact.stable_key), `${fact.stable_key} is duplicated.`);
    stableKeys.add(fact.stable_key);
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact source reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(fact.legal_or_guidance_status.length > 0, `${fact.stable_key} has no legal/guidance status.`);
  }
}

export function testD1EnvironmentLessonsHaveTraceabilityAndVisualMetadata() {
  const facts = new Set(loadFacts().facts.map((fact) => fact.stable_key));
  const requirements = requirementKeys();

  for (const lesson of loadLessons().lessons) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirements.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no facts.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no sources.`);
    assert.ok(lesson.visual_metadata?.requires_image || lesson.visual_metadata?.requires_diagram, `${lesson.stable_key} should carry visual metadata.`);

    for (const key of lesson.requirement_keys) {
      assert.ok(requirements.has(key), `${lesson.stable_key} points to unknown requirement ${key}.`);
    }

    for (const key of lesson.fact_keys) {
      assert.ok(facts.has(key), `${lesson.stable_key} points to unknown fact ${key}.`);
    }

    for (const block of lesson.content_blocks) {
      assert.ok(block.text || block.items?.length, `${lesson.stable_key} has an empty block.`);
      assert.ok(block.fact_keys?.length, `${lesson.stable_key} has a block without fact links.`);
    }
  }
}

export function testD1EnvironmentQuestionsHaveFullTraceability() {
  const facts = new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
  const lessons = new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));

  for (const question of loadQuestions().questions) {
    const lesson = lessons.get(question.lesson_key);
    assert.equal(question.status, 'published', `${question.stable_key} is not published.`);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match lesson.`);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not support the answer.`);
    assert.equal(question.answer_choices.filter((choice) => choice.id === question.correct_answer_id).length, 1, `${question.stable_key} has no single correct answer.`);
    assert.ok(!/kartan|bilden|diagrammet/i.test(question.prompt), `${question.stable_key} depends on a missing visual.`);

    for (const factKey of question.fact_keys) {
      const fact = facts.get(factKey);
      assert.ok(fact, `${question.stable_key} points to unknown fact ${factKey}.`);
      assert.ok(question.requirement_keys.includes(fact!.requirement_key), `${question.stable_key} fact belongs to an unlinked requirement.`);
      assert.ok(lesson!.fact_keys.includes(factKey), `${question.stable_key} fact is not covered by lesson.`);
      assert.ok(
        question.source_references.some((source) => source.source_id === fact!.source_id && source.exact_reference.trim().length > 0),
        `${question.stable_key} lacks source traceability.`,
      );
    }
  }
}

export function testD1EnvironmentQuestionBankHasNoDuplicates() {
  const questions = loadQuestions().questions;

  assertNoDuplicates(questions.map((question) => question.stable_key), 'stable key');
  assertNoDuplicates(questions.map((question) => question.prompt), 'prompt');
  assertNoDuplicates(
    questions.map((question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ')),
    'answer set',
  );
}

export function testD1EnvironmentQuestionTypesMatchCompetencies() {
  const requirementByKey = new Map(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.subject === 'D1_ENVIRONMENT')
      .map((requirement) => [requirement.stable_key, requirement]),
  );

  for (const question of loadQuestions().questions) {
    assert.notEqual(question.question_type, 'calculation', `${question.stable_key} should not be a calculation question.`);

    for (const requirementKey of question.requirement_keys) {
      const competency = requirementByKey.get(requirementKey)?.competency_type;
      if (competency === 'KNOW' || competency === 'UNDERSTAND' || competency === 'EXPLAIN') {
        assert.ok(
          question.question_type === 'single_choice' || question.question_type === 'scenario',
          `${question.stable_key} should be recall, concept or scenario based.`,
        );
      }
    }
  }
}

export function testD1EnvironmentCrossSubjectQuestionsDifferFromEcoDriving() {
  const environmentQuestions = loadQuestions().questions;
  const ecoQuestions = loadEcoQuestions().questions;
  const ecoPrompts = new Set(ecoQuestions.map((question) => normalize(question.prompt)));
  const ecoAnswers = new Set(ecoQuestions.map((question) => normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')));

  for (const question of environmentQuestions) {
    assert.ok(!ecoPrompts.has(normalize(question.prompt)), `${question.stable_key} duplicates an eco-driving prompt.`);

    const correctAnswer = normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '');
    if (ecoAnswers.has(correctAnswer)) {
      assert.ok(
        question.prompt.toLowerCase().includes('miljö') || question.explanation.toLowerCase().includes('miljöeffekt'),
        `${question.stable_key} repeats an eco-driving rule without an environmental angle.`,
      );
    }
  }
}

export function testD1EnvironmentTopicAndSubjectCheckpointsSelectEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d1_miljo',
      checkpoint.topic,
      checkpoint.question_count,
      d2TaxiLawRepository.questionVersions,
    );

    assert.equal(selected.length, checkpoint.question_count, `${checkpoint.stable_key} selected wrong count.`);
    assert.ok(selected.every((question) => question.topicId === checkpoint.topic), `${checkpoint.stable_key} selected another topic.`);
    assert.equal(new Set(selected.map((question) => question.stableKey)).size, selected.length, `${checkpoint.stable_key} selected duplicates.`);
  }

  const subjectSelected = selectSubjectCheckpointQuestions(
    questions.subject_checkpoint.stable_key,
    'subject_d1_miljo',
    questions.subject_checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );

  assert.equal(subjectSelected.length, questions.subject_checkpoint.question_count);
  assert.equal(new Set(subjectSelected.map((question) => question.stableKey)).size, subjectSelected.length);
  assert.equal(new Set(subjectSelected.map((question) => question.topicId)).size, 7);
}

export function testD1EnvironmentPluggaIntegrationAndScope() {
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === 'subject_d1_miljo');
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === 'subject_d1_miljo');
  const firstTopicLessons = getOrderedLessonsForTopic(d2TaxiLawRepository, topics[0].id);
  const publishedD1Subjects = d2TaxiLawRepository.subjects
    .filter((candidate) => candidate.examId === 'exam_d1_sakerhet_beteende' && candidate.status === 'published')
    .map((candidate) => candidate.id)
    .sort();

  assert.equal(subject?.status, 'published');
  assert.deepEqual(publishedD1Subjects, ['subject_d1_fordonskannedom', 'subject_d1_korekonomi', 'subject_d1_miljo', 'subject_d1_navigation']);
  assert.equal(topics.length, 7);
  assert.equal(firstTopicLessons.length, 1);
  assert.equal(d1EnvironmentFactRecords.length, 39);
  assert.ok(d2TaxiLawRepository.assessments.some((assessment) => assessment.id === 'D1-ENV-SUBJECT-CHECKPOINT-001'));
}
