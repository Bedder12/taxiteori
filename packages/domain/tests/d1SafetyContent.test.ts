import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getOrderedLessonsForTopic, selectCheckpointQuestions, selectSubjectCheckpointQuestions } from '../src';
import { d1SafetyFactRecords, d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
    competency_type?: string;
    requires_calculation?: boolean;
  }[];
};

type VisualMetadata = {
  requires_image?: boolean;
  requires_diagram?: boolean;
  requires_road_scene?: boolean;
  requires_comparison_visual?: boolean;
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
  pedagogical_topics: { topic_id: string; visual_asset_ids: string[]; visual_metadata: VisualMetadata; status: string }[];
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
    visual_metadata: VisualMetadata;
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
    prompt: string;
    answer_choices: { id: string; text: string }[];
    correct_answer_id: string;
    explanation: string;
    source_references: { source_id: string; exact_reference: string }[];
    visual_metadata?: VisualMetadata;
    visual_asset_id?: string;
    visual_correctness_depends_on_asset?: boolean;
    calculation_metadata?: {
      teaching_status: string;
      inputs: string[];
      method: string;
      worked_example: string;
      answer: string;
    };
    status: string;
  }[];
};

type VisualsFile = {
  visuals: {
    visual_id: string;
    status: string;
    purpose: string;
    elements_must_be_shown: string[];
    required_road_configuration: string;
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
  return loadJson<SourceMap>('data/curriculum/d1-safety-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d1-safety/safety-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d1-safety/safety-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d1-safety/safety-questions.json');
}

function loadVisuals() {
  return loadJson<VisualsFile>('data/content/d1-safety/safety-visuals.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D1_SAFETY')
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

export function testD1SafetyRequirementsHaveSourceMappings() {
  const requirements = requirementKeys();
  const sourceMap = loadSourceMap();
  const sourceIds = new Set(sourceMap.source_catalog.map((source) => source.source_key));
  const mappedKeys = new Set(sourceMap.requirement_source_map.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 19);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no safety source mapping.`);
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

export function testD1SafetyFactsAreVerifiedAndSourced() {
  const requirements = requirementKeys();
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));

  assertNoDuplicates(loadFacts().facts.map((fact) => fact.stable_key), 'safety fact stable key');

  for (const fact of loadFacts().facts) {
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact source reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(fact.legal_or_guidance_status.length > 0, `${fact.stable_key} has no legal/guidance status.`);
  }
}

export function testD1SafetyLessonsHaveTraceabilityAndVisualAssets() {
  const facts = new Set(loadFacts().facts.map((fact) => fact.stable_key));
  const requirements = requirementKeys();
  const visualIds = new Set(loadVisuals().visuals.map((visual) => visual.visual_id));

  for (const lesson of loadLessons().lessons) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirements.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no facts.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no sources.`);
    assert.ok(lesson.visual_metadata.visual_asset_id && visualIds.has(lesson.visual_metadata.visual_asset_id), `${lesson.stable_key} has no visual manifest link.`);

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

export function testD1SafetyVisualManifestIsStructured() {
  const requirements = requirementKeys();
  const facts = new Set(loadFacts().facts.map((fact) => fact.stable_key));

  for (const visual of loadVisuals().visuals) {
    assert.ok(visual.purpose.trim().length > 0, `${visual.visual_id} has no purpose.`);
    assert.ok(visual.elements_must_be_shown.length > 0, `${visual.visual_id} has no required elements.`);
    assert.ok(visual.required_road_configuration.trim().length > 0, `${visual.visual_id} has no road/diagram configuration.`);
    assert.ok(visual.labels_required.length > 0, `${visual.visual_id} has no labels.`);
    assert.equal(visual.correctness_depends_on_visual, false, `${visual.visual_id} should not be required for published question correctness yet.`);
    for (const requirementKey of visual.requirement_keys) {
      assert.ok(requirements.has(requirementKey), `${visual.visual_id} points to unknown requirement ${requirementKey}.`);
    }
    for (const factKey of visual.fact_keys) {
      assert.ok(facts.has(factKey), `${visual.visual_id} points to unknown fact ${factKey}.`);
    }
  }
}

export function testD1SafetyQuestionsHaveFullTraceabilityAndVisualAssets() {
  const facts = new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
  const lessons = new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));
  const visualIds = new Set(loadVisuals().visuals.map((visual) => visual.visual_id));

  for (const question of loadQuestions().questions) {
    const lesson = lessons.get(question.lesson_key);
    assert.equal(question.status, 'published', `${question.stable_key} is not published.`);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match lesson.`);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not support the answer.`);
    assert.equal(question.answer_choices.filter((choice) => choice.id === question.correct_answer_id).length, 1, `${question.stable_key} has no single correct answer.`);

    if (question.visual_metadata?.requires_image || question.visual_metadata?.requires_diagram || question.visual_metadata?.requires_road_scene) {
      assert.ok(question.visual_asset_id && visualIds.has(question.visual_asset_id), `${question.stable_key} has no visual asset reference.`);
      assert.equal(question.visual_correctness_depends_on_asset, false, `${question.stable_key} depends on a placeholder visual.`);
    }

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

export function testD1SafetyQuestionBankHasNoDuplicates() {
  const questions = loadQuestions().questions;
  assertNoDuplicates(questions.map((question) => question.stable_key), 'safety question stable key');
  assertNoDuplicates(questions.map((question) => question.prompt), 'safety prompt');
  assertNoDuplicates(
    questions.map((question) => question.answer_choices.map((choice) => normalize(choice.text)).sort().join(' | ')),
    'safety answer set',
  );
}

export function testD1SafetyQuestionTypesMatchCompetencies() {
  const requirementByKey = new Map(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.subject === 'D1_SAFETY')
      .map((requirement) => [requirement.stable_key, requirement]),
  );

  for (const question of loadQuestions().questions) {
    for (const requirementKey of question.requirement_keys) {
      const requirement = requirementByKey.get(requirementKey);
      if (requirement?.requires_calculation) {
        assert.ok(['calculation', 'scenario'].includes(question.question_type), `${question.stable_key} should assess speed relationship practically.`);
      }
      if (requirement?.competency_type === 'USE' || requirement?.competency_type === 'PERFORM' || requirement?.competency_type === 'APPLY') {
        assert.equal(question.question_type, 'scenario', `${question.stable_key} should be practical/scenario based.`);
      }
    }
  }
}

export function testD1SafetyScenarioQuestionsIncludeSufficientContext() {
  for (const question of loadQuestions().questions.filter((candidate) => candidate.question_type === 'scenario')) {
    assert.match(question.prompt, /taxi|taxiförarens|passagerare|olycka|väg|trafik|barn|kör/i, `${question.stable_key} lacks scenario context.`);
    assert.ok(question.prompt.length > 90, `${question.stable_key} scenario is too thin.`);
  }
}

export function testD1SafetyCalculationQuestionsHaveSupportedMetadata() {
  const calculationQuestions = loadQuestions().questions.filter((question) => question.question_type === 'calculation');
  assert.ok(calculationQuestions.length > 0, 'Expected at least one speed relationship calculation/estimation question.');
  for (const question of calculationQuestions) {
    assert.ok(question.requirement_keys.includes('D1-SAFE-014-001'), `${question.stable_key} calculation is not tied to the speed/injury requirement.`);
    assert.equal(question.calculation_metadata?.teaching_status, 'pedagogical_estimate', `${question.stable_key} has no teaching-status guard.`);
    assert.ok(question.calculation_metadata.inputs.length > 0, `${question.stable_key} has no calculation inputs.`);
    assert.ok(question.calculation_metadata.method.length > 0, `${question.stable_key} has no calculation method.`);
  }
}

export function testD1SafetyCrossSubjectDuplicateGate() {
  const safetyQuestions = loadQuestions().questions;
  const otherSubjects = [
    'data/questions/d1-navigation/navigation-questions.json',
    'data/questions/d1-eco-driving/eco-driving-questions.json',
    'data/questions/d1-environment/environment-questions.json',
    'data/questions/d1-vehicle-knowledge/vehicle-questions.json',
  ].flatMap((path) => loadJson<QuestionsFile>(path).questions);
  const otherPrompts = new Set(otherSubjects.map((question) => normalize(question.prompt)));
  const otherAnswers = new Set(otherSubjects.map((question) => normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '')));

  for (const question of safetyQuestions) {
    assert.ok(!otherPrompts.has(normalize(question.prompt)), `${question.stable_key} duplicates another D1 prompt.`);
    const correctAnswer = normalize(question.answer_choices.find((choice) => choice.id === question.correct_answer_id)?.text ?? '');
    if (otherAnswers.has(correctAnswer)) {
      assert.ok(
        question.prompt.toLowerCase().includes('säker') || question.explanation.toLowerCase().includes('säker'),
        `${question.stable_key} repeats another D1 rule without a safety angle.`,
      );
    }
  }
}

export function testD1SafetyTopicAndSubjectCheckpointsSelectEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d1_sakerhet',
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
    'subject_d1_sakerhet',
    questions.subject_checkpoint.question_count,
    d2TaxiLawRepository.questionVersions,
  );

  assert.equal(subjectSelected.length, questions.subject_checkpoint.question_count);
  assert.equal(new Set(subjectSelected.map((question) => question.stableKey)).size, subjectSelected.length);
  assert.ok(new Set(subjectSelected.map((question) => question.topicId)).size >= 6);
  assert.ok(new Set(subjectSelected.map((question) => question.type)).size >= 2);
}

export function testD1SafetyPluggaIntegrationAndScope() {
  const subject = d2TaxiLawRepository.subjects.find((candidate) => candidate.id === 'subject_d1_sakerhet');
  const topics = d2TaxiLawRepository.topics.filter((topic) => topic.subjectId === 'subject_d1_sakerhet');
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
  assert.equal(d1SafetyFactRecords.length, 59);
  assert.ok(d2TaxiLawRepository.assessments.some((assessment) => assessment.id === 'D1-SAFE-SUBJECT-CHECKPOINT-001'));
}
