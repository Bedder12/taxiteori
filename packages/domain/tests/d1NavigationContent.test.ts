import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1NavigationFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

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
    legal_reference: string;
    source_status: string;
  }[];
  requirement_source_map: {
    requirement_key: string;
    official_requirement_reference: string;
    sources: { source_type: string; source_status: string }[];
    overall_status: string;
  }[];
  pedagogical_topics: {
    topic_id: string;
    navigation_metadata: NavigationMetadata;
    status: string;
  }[];
};

type NavigationMetadata = {
  requires_map?: boolean;
  requires_route_scenario?: boolean;
  requires_oral_route_description?: boolean;
  requires_distance_estimation?: boolean;
  requires_travel_time_calculation?: boolean;
  requires_arrival_time_calculation?: boolean;
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
    navigation_metadata: NavigationMetadata;
  }[];
};

type LessonsFile = {
  lessons: {
    stable_key: string;
    topic_id: string;
    requirement_keys: string[];
    fact_keys: string[];
    source_references: { source_id: string; exact_references: string[] }[];
    navigation_metadata: NavigationMetadata;
    status: string;
    content_blocks: {
      text?: string;
      items?: string[];
      timeline?: string[];
      reasoning?: string;
      final_answer?: string;
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
    navigation_metadata: NavigationMetadata;
    map_metadata?: unknown;
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
  return loadJson<SourceMap>('data/curriculum/d1-navigation-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d1-navigation/navigation-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d1-navigation/navigation-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-navigation/navigation-questions.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_NAVIGATION')
      .map((requirement) => requirement.stable_key),
  );
}

export function testD1NavigationRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  const mappings = loadSourceMap().requirement_source_map;
  const mappedKeys = new Set(mappings.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 12);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no navigation source mapping.`);
  }

  for (const mapping of mappings) {
    assert.equal(mapping.overall_status, 'FULLY_SOURCED', `${mapping.requirement_key} is not fully sourced.`);
    assert.ok(mapping.sources.some((source) => source.source_type === 'primary_legal_source'), `${mapping.requirement_key} has no primary source.`);
  }
}

export function testD1NavigationFactsAreVerifiedAndSourced() {
  const requirements = requirementKeys();
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));

  for (const fact of loadFacts().facts) {
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact source reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(fact.navigation_metadata, `${fact.stable_key} has no navigation metadata.`);
  }
}

export function testD1NavigationLessonsHaveTraceabilityAndMapMetadata() {
  const facts = new Set(loadFacts().facts.map((fact) => fact.stable_key));
  const requirements = requirementKeys();

  for (const lesson of loadLessons().lessons) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirements.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no facts.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no sources.`);
    assert.ok(lesson.navigation_metadata.requires_map, `${lesson.stable_key} should carry map metadata.`);

    for (const key of lesson.requirement_keys) {
      assert.ok(requirements.has(key), `${lesson.stable_key} points to unknown requirement ${key}.`);
    }

    for (const key of lesson.fact_keys) {
      assert.ok(facts.has(key), `${lesson.stable_key} points to unknown fact ${key}.`);
    }

    for (const block of lesson.content_blocks) {
      assert.ok(
        block.text || block.items?.length || block.timeline?.length || block.reasoning || block.final_answer,
        `${lesson.stable_key} has an empty block.`,
      );
      assert.ok(block.fact_keys?.length, `${lesson.stable_key} has a block without fact links.`);
    }
  }
}

export function testD1NavigationQuestionsHaveFullTraceability() {
  const facts = new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
  const lessons = new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));

  for (const question of loadQuestions().questions) {
    const lesson = lessons.get(question.lesson_key);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match lesson.`);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not support the answer.`);
    assert.ok(question.answer_choices.some((choice) => choice.id === question.correct_answer_id), `${question.stable_key} has no correct answer.`);

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

export function testD1NavigationMapDependentQuestionsCarryMapMetadata() {
  for (const question of loadQuestions().questions) {
    if (question.navigation_metadata.requires_map) {
      assert.ok(question.map_metadata, `${question.stable_key} requires map support but has no map metadata placeholder.`);
    }

    assert.ok(!/kartan|bilden/i.test(question.prompt) || question.map_metadata, `${question.stable_key} depends on a missing map visual.`);
  }
}

export function testD1NavigationQuestionCompetenciesMatchRequirements() {
  const requirementByKey = new Map(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.subject === 'D1_NAVIGATION')
      .map((requirement) => [requirement.stable_key, requirement]),
  );

  for (const question of loadQuestions().questions) {
    for (const requirementKey of question.requirement_keys) {
      const requirement = requirementByKey.get(requirementKey);
      if (requirement?.competency_type === 'CALCULATE') {
        assert.equal(question.question_type, 'calculation', `${question.stable_key} should be a calculation question.`);
      }

      if (requirement?.competency_type === 'USE' || requirement?.competency_type === 'PERFORM' || requirement?.competency_type === 'APPLY') {
        assert.ok(question.question_type === 'scenario' || question.question_type === 'calculation', `${question.stable_key} should be practical.`);
      }
    }
  }
}

export function testD1NavigationTopicAndSubjectCheckpointsSelectEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d1_navigation',
      checkpoint.topic,
      checkpoint.question_count,
      d2TaxiLawRepository.questionVersions,
    );

    assert.equal(selected.length, checkpoint.question_count, `${checkpoint.stable_key} selected wrong count.`);
    assert.ok(selected.every((question) => question.topicId === checkpoint.topic), `${checkpoint.stable_key} selected another topic.`);
  }

  const subjectSelected = selectSubjectCheckpointQuestions(
    questions.subject_checkpoint.stable_key,
    'subject_d1_navigation',
    questions.subject_checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );
  assert.equal(subjectSelected.length, questions.subject_checkpoint.question_count);
  assert.equal(new Set(subjectSelected.map((question) => question.topicId)).size, 4);
}

export function testD1NavigationPluggaIntegrationAndMobileFlow() {
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === 'subject_d1_navigation');
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === 'subject_d1_navigation');
  const firstTopicLessons = getOrderedLessonsForTopic(d2TaxiLawRepository, topics[0].id);

  assert.equal(subject?.status, 'published');
  assert.equal(topics.length, 4);
  assert.equal(firstTopicLessons.length, 1);
  assert.ok(d1NavigationFactRecords.length > 0);
  assert.ok(d2TaxiLawRepository.assessments.some((assessment) => assessment.id === 'D1-NAV-SUBJECT-CHECKPOINT-001'));
}
