import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1ServiceFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: { stable_key: string; subject: string; active: boolean; competency_type?: string; requires_calculation?: boolean }[];
};

type VisualMetadata = {
  requires_image?: boolean;
  requires_diagram?: boolean;
  requires_road_scene?: boolean;
  visual_asset_id?: string;
  visual_correctness_depends_on_asset?: boolean;
};

type SourceMap = {
  source_catalog: { source_key: string; source_type: string; authority: string; source_status: string }[];
  requirement_source_map: {
    requirement_key: string;
    sources: { source_key: string; source_type: string; source_status: string }[];
    overall_status: string;
  }[];
  pedagogical_topics: { topic_id: string; visual_asset_ids: string[]; status: string; competency_tags: string[] }[];
};

type FactsFile = {
  sources: { source_id: string; authority: string; current_validity: string }[];
  facts: {
    stable_key: string;
    topic_id: string;
    requirement_key: string;
    text: string;
    source_id: string;
    exact_reference: string;
    verification_status: string;
    authority_status: string;
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
    content_blocks: { text?: string; items?: string[]; fact_keys?: string[] }[];
  }[];
};

type QuestionsFile = {
  topic_checkpoints: { stable_key: string; topic: string; question_count: number; status: string }[];
  subject_checkpoint: { stable_key: string; question_count: number; status: string };
  questions: {
    stable_key: string;
    topic_id: string;
    requirement_keys: string[];
    fact_keys: string[];
    lesson_key: string;
    question_type: string;
    competency_tags: string[];
    prompt: string;
    answer_choices: { id: string; text: string }[];
    correct_answer_id: string;
    explanation: string;
    source_references: { source_id: string; exact_reference: string }[];
    visual_metadata?: VisualMetadata;
    visual_asset_id?: string;
    visual_correctness_depends_on_asset?: boolean;
    calculation_metadata?: { teaching_status: string; inputs: string[]; method: string; worked_example: string; answer: string };
    status: string;
  }[];
};

type VisualsFile = {
  visuals: {
    visual_id: string;
    status: string;
    purpose: string;
    elements_must_be_shown: string[];
    labels_required: string[];
    requirement_keys: string[];
    fact_keys: string[];
    correctness_depends_on_visual: boolean;
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
  return loadJson<SourceMap>('data/curriculum/d1-service-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d1-service/service-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d1-service/service-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-service/service-questions.json');
}

function loadVisuals() {
  return loadJson<VisualsFile>('data/content/d1-service/service-visuals.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_SERVICE')
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

export function testD1ServiceRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  const sourceMap = loadSourceMap();
  const sourceIds = new Set(sourceMap.source_catalog.map((source) => source.source_key));
  const mappedKeys = new Set(sourceMap.requirement_source_map.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 14);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no service source mapping.`);
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

export function testD1ServiceFactsAreVerifiedAndAuthorityTagged() {
  const requirements = requirementKeys();
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));
  const allowed = new Set(['binding_rule', 'official_guidance', 'curriculum_principle', 'pedagogical_application', 'official_consumer_guidance']);

  assertNoDuplicates(loadFacts().facts.map((fact) => fact.stable_key), 'service fact stable key');

  for (const fact of loadFacts().facts) {
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.text.trim().length > 0, `${fact.stable_key} has no text.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact source reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(allowed.has(fact.authority_status), `${fact.stable_key} has unsupported authority status ${fact.authority_status}.`);
  }
}

export function testD1ServiceLessonsHaveTraceability() {
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

export function testD1ServiceVisualsAreLimitedAndNonBlocking() {
  const questions = loadQuestions().questions;
  const visualIds = new Set(loadVisuals().visuals.map((visual) => visual.visual_id));
  const visualQuestions = questions.filter((question) => question.visual_metadata?.requires_image || question.visual_metadata?.requires_road_scene);

  assert.ok(visualQuestions.length > 0);
  assert.ok(visualQuestions.length < questions.length, 'Bemötande should not mark every question visual-dependent.');

  for (const visual of loadVisuals().visuals) {
    assert.ok(visual.purpose.trim().length > 0, `${visual.visual_id} has no purpose.`);
    assert.ok(visual.elements_must_be_shown.length > 0, `${visual.visual_id} has no required elements.`);
    assert.equal(visual.correctness_depends_on_visual, false, `${visual.visual_id} should not be required for published question correctness.`);
  }

  for (const question of visualQuestions) {
    assert.ok(question.visual_asset_id && visualIds.has(question.visual_asset_id), `${question.stable_key} has no visual asset reference.`);
    assert.equal(question.visual_correctness_depends_on_asset, false, `${question.stable_key} depends on a placeholder visual.`);
  }
}

export function testD1ServiceQuestionsHaveFullTraceability() {
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

export function testD1ServiceQuestionBankHasNoDuplicates() {
  const questions = loadQuestions().questions;
  assertNoDuplicates(questions.map((question) => question.stable_key), 'service question stable key');
  assertNoDuplicates(questions.map((question) => question.prompt), 'service prompt');
  assertNoDuplicates(
    questions.map((question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ')),
    'service answer set',
  );
}

export function testD1ServiceQuestionsHaveCompetencyTags() {
  const allowed = new Set(['communication', 'service', 'adaptation', 'conflict_handling', 'passenger_assistance']);
  for (const question of loadQuestions().questions) {
    assert.ok(question.competency_tags.length > 0, `${question.stable_key} has no competency tags.`);
    for (const tag of question.competency_tags) {
      assert.ok(allowed.has(tag), `${question.stable_key} has unsupported competency tag ${tag}.`);
    }
  }
}

export function testD1ServiceQuestionTypesMatchCompetencies() {
  const requirementByKey = new Map(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.subject === 'D1_SERVICE')
      .map((requirement) => [requirement.stable_key, requirement]),
  );

  for (const question of loadQuestions().questions) {
    for (const requirementKey of question.requirement_keys) {
      const requirement = requirementByKey.get(requirementKey);
      if (requirement?.requires_calculation) {
        assert.ok(['calculation', 'scenario'].includes(question.question_type), `${question.stable_key} should be price calculation or scenario.`);
      } else if (requirement?.competency_type === 'PERFORM') {
        assert.equal(question.question_type, 'scenario', `${question.stable_key} should be practical/scenario based.`);
      }
    }
  }
}

export function testD1ServiceCalculationQuestionsHaveSupportedMetadata() {
  const calculationQuestions = loadQuestions().questions.filter((question) => question.question_type === 'calculation');
  assert.ok(calculationQuestions.length > 0, 'Expected price calculation questions.');
  for (const question of calculationQuestions) {
    assert.ok(question.requirement_keys.includes('D1-SERV-017-008'), `${question.stable_key} calculation is not tied to price requirement.`);
    assert.equal(question.calculation_metadata?.teaching_status, 'source_backed_price_estimate', `${question.stable_key} has no supported calculation metadata.`);
    assert.ok(question.calculation_metadata.inputs.length > 0, `${question.stable_key} has no calculation inputs.`);
    assert.ok(question.calculation_metadata.method.length > 0, `${question.stable_key} has no calculation method.`);
  }
}

export function testD1ServiceCrossSubjectBoundary() {
  const serviceQuestions = loadQuestions().questions;
  const otherSubjects = [
    'data/questions/d1-safety/safety-questions.json',
    'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
  ].flatMap((path) => loadJson<QuestionsFile>(path).questions);
  const otherPrompts = new Set(otherSubjects.map((question) => normalize(question.prompt)));

  for (const question of serviceQuestions) {
    assert.ok(!otherPrompts.has(normalize(question.prompt)), `${question.stable_key} duplicates another D1 prompt.`);
    assert.ok(!/symtom|diagnos|sjukdomens effekt/i.test(question.prompt), `${question.stable_key} drifts into future health/disability content.`);
  }
}

export function testD1ServiceTopicAndSubjectCheckpointsSelectEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d1_bemotande',
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
    'subject_d1_bemotande',
    questions.subject_checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );

  assert.equal(subjectSelected.length, questions.subject_checkpoint.question_count);
  assert.equal(new Set(subjectSelected.map((question) => question.stableKey)).size, subjectSelected.length);
  assert.ok(new Set(subjectSelected.map((question) => question.topicId)).size >= 6);
}

export function testD1ServicePluggaIntegrationAndScope() {
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === 'subject_d1_bemotande');
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === 'subject_d1_bemotande');
  const firstTopicLessons = getOrderedLessonsForTopic(d2TaxiLawRepository, topics[0].id);
  const publishedD1Subjects = d2TaxiLawRepository.subjects
    .filter((candidate) => candidate.examId === 'exam_d1_sakerhet_beteende' && candidate.status === 'published')
    .map((candidate) => candidate.id)
    .sort();

  assert.equal(subject?.status, 'published');
  assert.deepEqual(publishedD1Subjects, [
    'subject_d1_arbetsmiljo',
    'subject_d1_bemotande',
    'subject_d1_fordonskannedom',
    'subject_d1_korekonomi',
    'subject_d1_miljo',
    'subject_d1_navigation',
    'subject_d1_sakerhet',
    'subject_d1_sjukdomar',
  ]);
  assert.equal(topics.length, 8);
  assert.equal(firstTopicLessons.length, 1);
  assert.equal(d1ServiceFactRecords.length, 46);
  assert.ok(d2TaxiLawRepository.assessments.some((assessment) => assessment.id === 'D1-SERV-SUBJECT-CHECKPOINT-001'));
}
