import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1EcoDrivingFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
    competency_type?: string;
  }[];
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
  }[];
};

type LessonsFile = {
  lessons: {
    stable_key: string;
    topic_id: string;
    requirement_keys: string[];
    fact_keys: string[];
    source_references: { source_id: string; exact_references: string[] }[];
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
  return loadJson<SourceMap>('data/curriculum/d1-eco-driving-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d1-eco-driving/eco-driving-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d1-eco-driving/eco-driving-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-eco-driving/eco-driving-questions.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_ECO_DRIVING')
      .map((requirement) => requirement.stable_key),
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function testD1EcoDrivingRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  const sourceMap = loadSourceMap();
  const sourceIds = new Set(sourceMap.source_catalog.map((source) => source.source_key));
  const mappedKeys = new Set(sourceMap.requirement_source_map.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 4);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no eco-driving source mapping.`);
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

export function testD1EcoDrivingFactsAreVerifiedAndSourced() {
  const requirements = requirementKeys();
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));
  const keys = new Set<string>();

  for (const fact of loadFacts().facts) {
    assert.ok(!keys.has(fact.stable_key), `${fact.stable_key} is duplicated.`);
    keys.add(fact.stable_key);
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact source reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(fact.legal_or_guidance_status.length > 0, `${fact.stable_key} has no legal/guidance status.`);
  }
}

export function testD1EcoDrivingLessonsHaveTraceability() {
  const facts = new Set(loadFacts().facts.map((fact) => fact.stable_key));
  const requirements = requirementKeys();

  for (const lesson of loadLessons().lessons) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirements.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no facts.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no sources.`);

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

export function testD1EcoDrivingQuestionsHaveFullTraceability() {
  const facts = new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
  const lessons = new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));

  for (const question of loadQuestions().questions) {
    const lesson = lessons.get(question.lesson_key);
    assert.equal(question.status, 'published', `${question.stable_key} is not published.`);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match lesson.`);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not support the answer.`);
    assert.equal(question.answer_choices.filter((choice) => choice.id === question.correct_answer_id).length, 1, `${question.stable_key} has no single correct answer.`);

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

export function testD1EcoDrivingQuestionBankHasNoDuplicates() {
  const questions = loadQuestions().questions;
  const stableKeys = new Set<string>();
  const prompts = new Set<string>();
  const answerSets = new Set<string>();

  for (const question of questions) {
    assert.ok(!stableKeys.has(question.stable_key), `${question.stable_key} is duplicated.`);
    stableKeys.add(question.stable_key);

    const prompt = normalize(question.prompt);
    assert.ok(!prompts.has(prompt), `${question.stable_key} duplicates a prompt.`);
    prompts.add(prompt);

    const answerSet = question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ');
    assert.ok(!answerSets.has(answerSet), `${question.stable_key} duplicates an answer set.`);
    answerSets.add(answerSet);
  }
}

export function testD1EcoDrivingQuestionTypesMatchCompetencies() {
  const requirementByKey = new Map(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.subject === 'D1_ECO_DRIVING')
      .map((requirement) => [requirement.stable_key, requirement]),
  );

  for (const question of loadQuestions().questions) {
    assert.notEqual(question.question_type, 'calculation', `${question.stable_key} should not be a calculation question.`);

    for (const requirementKey of question.requirement_keys) {
      const competency = requirementByKey.get(requirementKey)?.competency_type;
      if (competency === 'UNDERSTAND' || competency === 'EXPLAIN') {
        assert.ok(
          question.question_type === 'single_choice' || question.question_type === 'scenario',
          `${question.stable_key} should be recall, concept or scenario based.`,
        );
      }
    }
  }
}

export function testD1EcoDrivingTopicAndSubjectCheckpointsSelectEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d1_korekonomi',
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
    'subject_d1_korekonomi',
    questions.subject_checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );

  assert.equal(subjectSelected.length, questions.subject_checkpoint.question_count);
  assert.equal(new Set(subjectSelected.map((question) => question.stableKey)).size, subjectSelected.length);
  assert.equal(new Set(subjectSelected.map((question) => question.topicId)).size, 4);
}

export function testD1EcoDrivingPluggaIntegrationAndScope() {
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === 'subject_d1_korekonomi');
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === 'subject_d1_korekonomi');
  const firstTopicLessons = getOrderedLessonsForTopic(d2TaxiLawRepository, topics[0].id);
  const publishedD1Subjects = d2TaxiLawRepository.subjects
    .filter((candidate) => candidate.examId === 'exam_d1_sakerhet_beteende' && candidate.status === 'published')
    .map((candidate) => candidate.id)
    .sort();

  assert.equal(subject?.status, 'published');
  assert.deepEqual(publishedD1Subjects, ['subject_d1_fordonskannedom', 'subject_d1_korekonomi', 'subject_d1_miljo', 'subject_d1_navigation']);
  assert.equal(topics.length, 4);
  assert.equal(firstTopicLessons.length, 1);
  assert.equal(d1EcoDrivingFactRecords.length, 21);
  assert.ok(d2TaxiLawRepository.assessments.some((assessment) => assessment.id === 'D1-ECO-SUBJECT-CHECKPOINT-001'));
}
