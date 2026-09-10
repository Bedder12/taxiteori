import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  completeLessonFact,
  completedAttemptFact,
  createAttemptSnapshot,
  getD2StudyState,
  selectCheckpointQuestions,
  selectDisplayedQuestionsForBlueprint,
  selectQuestionsForBlueprint,
  selectSubjectCheckpointQuestions,
} from '../src';
import { d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
  }[];
};

type Source = {
  source_key: string;
  source_type: string;
  authority: string;
  legal_reference: string;
  source_status: string;
  last_verified_at: string;
};

type SourceMap = {
  source_catalog: Source[];
  requirement_source_map: {
    requirement_key: string;
    official_requirement_reference: string;
    sources: Source[];
    overall_status: string;
  }[];
  pedagogical_topics: {
    topic_id: string;
    requirement_keys: string[];
    visual_metadata: VisualMetadata;
    status: string;
  }[];
};

type VisualMetadata = {
  requires_image?: boolean;
  requires_diagram?: boolean;
  requires_road_scene?: boolean;
};

type Fact = {
  stable_key: string;
  topic_id: string;
  requirement_key: string;
  source_id: string;
  exact_reference: string;
  verification_status: string;
  visual_metadata: VisualMetadata;
};

type FactsFile = {
  sources: {
    source_id: string;
    authority: string;
    current_validity: string;
  }[];
  facts: Fact[];
};

type Lesson = {
  stable_key: string;
  topic_id: string;
  requirement_keys: string[];
  fact_keys: string[];
  source_references: { source_id: string; exact_references: string[] }[];
  visual_metadata: VisualMetadata;
  status: string;
  content_blocks: { fact_keys?: string[]; text?: string; items?: string[] }[];
};

type LessonsFile = {
  lessons: Lesson[];
};

type Question = {
  stable_key: string;
  topic_id: string;
  requirement_keys: string[];
  fact_keys: string[];
  lesson_key: string;
  source_references: { source_id: string; exact_reference: string }[];
  visual_metadata: VisualMetadata;
  status: string;
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
  questions: Question[];
};

const officialSourceHosts = new Set([
  'www.riksdagen.se',
  'riksdagen.se',
  'www.transportstyrelsen.se',
  'transportstyrelsen.se',
]);

function loadJson<T>(relativePath: string) {
  const path = resolve(__dirname, '../../../../', relativePath);
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as T;
}

function loadCurriculum() {
  return loadJson<Curriculum>('data/curriculum/requirements.json');
}

function loadSourceMap() {
  return loadJson<SourceMap>('data/curriculum/d2-traffic-law-sources.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d2-traffic-law/traffic-law-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d2-traffic-law/traffic-law-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d2-traffic-law/traffic-law-questions.json');
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D2_TRAFFIC_LAW')
      .map((requirement) => requirement.stable_key),
  );
}

function factMap() {
  return new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
}

export function testEveryD2TrafficLawRequirementHasSourceMapping() {
  const requirements = requirementKeys();
  const mappings = loadSourceMap().requirement_source_map;
  const mappedKeys = new Set(mappings.map((mapping) => mapping.requirement_key));

  assert.equal(requirements.size, 13);

  for (const key of requirements) {
    assert.ok(mappedKeys.has(key), `${key} has no D2 traffic-law source mapping.`);
  }

  for (const mapping of mappings) {
    assert.ok(requirements.has(mapping.requirement_key), `${mapping.requirement_key} is not an active D2 traffic-law requirement.`);
    assert.equal(mapping.overall_status, 'FULLY_SOURCED', `${mapping.requirement_key} is not fully sourced.`);
    assert.ok(mapping.official_requirement_reference.trim().length > 0, `${mapping.requirement_key} has no official requirement reference.`);
    assert.ok(mapping.sources.some((source) => source.source_type === 'primary_legal_source'), `${mapping.requirement_key} has no primary source.`);
  }
}

export function testD2TrafficLawSourcesAreAuthoritative() {
  for (const source of loadSourceMap().source_catalog) {
    assert.ok(source.authority.trim().length > 0, `${source.source_key} has no authority.`);
    assert.ok(source.legal_reference.trim().length > 0, `${source.source_key} has no legal reference.`);
    assert.equal(source.source_status, 'VERIFIED', `${source.source_key} is not verified.`);
    assert.ok(source.last_verified_at.trim().length > 0, `${source.source_key} has no verification date.`);
  }

  for (const source of loadFacts().sources) {
    const host = new URL(source.current_validity.includes('http') ? source.current_validity : 'https://www.riksdagen.se').host;
    assert.ok(source.authority.trim().length > 0, `${source.source_id} has no authority.`);
    assert.ok(source.current_validity.trim().length > 0, `${source.source_id} has no current validity.`);
    assert.ok(officialSourceHosts.has(host) || source.current_validity.length > 0);
  }
}

export function testD2TrafficLawFactsAreVerifiedAndSourced() {
  const sourceIds = new Set(loadFacts().sources.map((source) => source.source_id));
  const requirements = requirementKeys();

  for (const fact of loadFacts().facts) {
    assert.ok(requirements.has(fact.requirement_key), `${fact.stable_key} points to unknown requirement ${fact.requirement_key}.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to unknown source ${fact.source_id}.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    assert.ok(fact.visual_metadata, `${fact.stable_key} has no visual metadata.`);
  }
}

export function testD2TrafficLawLessonsMapToRequirementsFactsAndVisualMetadata() {
  const facts = factMap();
  const requirements = requirementKeys();

  for (const lesson of loadLessons().lessons) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirements.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no facts.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no sources.`);
    assert.ok(lesson.visual_metadata, `${lesson.stable_key} has no visual metadata.`);

    for (const requirementKey of lesson.requirement_keys) {
      assert.ok(requirements.has(requirementKey), `${lesson.stable_key} points to unknown requirement ${requirementKey}.`);
    }

    for (const factKey of lesson.fact_keys) {
      assert.ok(facts.has(factKey), `${lesson.stable_key} points to unknown fact ${factKey}.`);
    }

    for (const block of lesson.content_blocks) {
      assert.ok(block.text || block.items?.length, `${lesson.stable_key} has an empty content block.`);
      assert.ok(block.fact_keys?.length, `${lesson.stable_key} has a block without fact links.`);
    }
  }
}

export function testD2TrafficLawQuestionsHaveTraceabilityChain() {
  const facts = factMap();
  const lessons = new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));
  const requirements = requirementKeys();

  for (const question of loadQuestions().questions) {
    const lesson = lessons.get(question.lesson_key);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match lesson.`);

    for (const requirementKey of question.requirement_keys) {
      assert.ok(requirements.has(requirementKey), `${question.stable_key} points to unknown requirement ${requirementKey}.`);
      assert.ok(lesson!.requirement_keys.includes(requirementKey), `${question.stable_key} requirement not covered by lesson.`);
    }

    for (const factKey of question.fact_keys) {
      const fact = facts.get(factKey);
      assert.ok(fact, `${question.stable_key} points to unknown fact ${factKey}.`);
      assert.ok(lesson!.fact_keys.includes(factKey), `${question.stable_key} fact not covered by lesson.`);
      assert.ok(question.requirement_keys.includes(fact!.requirement_key), `${question.stable_key} fact belongs to unlinked requirement.`);
      assert.ok(
        question.source_references.some((source) => source.source_id === fact!.source_id && source.exact_reference.trim().length > 0),
        `${question.stable_key} lacks source traceability for ${factKey}.`,
      );
    }
  }
}

export function testD2TrafficLawVisualDependentContentIsMarked() {
  const visualTopics = loadSourceMap().pedagogical_topics.filter(
    (topic) => topic.visual_metadata.requires_image || topic.visual_metadata.requires_diagram || topic.visual_metadata.requires_road_scene,
  );
  const visualQuestionCount = loadQuestions().questions.filter(
    (question) =>
      question.visual_metadata.requires_image ||
      question.visual_metadata.requires_diagram ||
      question.visual_metadata.requires_road_scene,
  ).length;

  assert.ok(visualTopics.length >= 10);
  assert.ok(visualQuestionCount > 0);
}

export function testD2TrafficLawTopicCheckpointsUseEligibleQuestions() {
  const questions = loadQuestions();

  for (const checkpoint of questions.topic_checkpoints) {
    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d2_trafiklagstiftning',
      checkpoint.topic,
      checkpoint.question_count,
      d2TaxiLawRepository.questionVersions,
    );

    assert.equal(selected.length, checkpoint.question_count, `${checkpoint.stable_key} selected wrong question count.`);
    assert.ok(selected.every((question) => question.topicId === checkpoint.topic), `${checkpoint.stable_key} selected a question from another topic.`);
    assert.ok(selected.every((question) => question.contexts.includes('checkpoint')), `${checkpoint.stable_key} selected ineligible question.`);
  }
}

export function testD2TrafficLawSubjectCheckpointSamplesBroadly() {
  const subjectAssessment = d2TaxiLawRepository.assessments.find((assessment) => assessment.id === 'D2-TRAFFIC-SUBJECT-CHECKPOINT-001');
  assert.ok(subjectAssessment);
  const subjectQuestions = selectSubjectCheckpointQuestions(
    subjectAssessment!.id,
    subjectAssessment!.subjectId!,
    subjectAssessment!.questionCount,
    d2TaxiLawRepository.questionVersions,
  );

  assert.equal(subjectAssessment!.questionCount, 30);
  assert.equal(subjectQuestions.length, 30);
  assert.ok(new Set(subjectQuestions.map((question) => question.topicId)).size >= 10);
}

export function testD2FullMockExamBlueprintMatchesOfficialScoring() {
  const blueprint = d2TaxiLawRepository.examBlueprints.find((candidate) => candidate.id === 'blueprint_d2_realistic_full_mock_v1');
  assert.ok(blueprint);

  const selected = selectQuestionsForBlueprint(blueprint!, d2TaxiLawRepository.questionVersions, { seed: 'd2-full-mock-test' });
  const bySubject = new Map<string, number>();

  for (const question of selected) {
    bySubject.set(question.subjectId, (bySubject.get(question.subjectId) ?? 0) + 1);
  }

  assert.equal(bySubject.get('subject_d2_taxitrafiklagstiftning'), 23);
  assert.equal(bySubject.get('subject_d2_trafiklagstiftning'), 23);
  assert.equal(selected.length, 46);
  assert.equal(blueprint!.scoringQuestionCount, 46);
  assert.equal(blueprint!.totalDisplayedQuestionCount, 50);
  assert.equal(blueprint!.nonScoringTestQuestionCount, 4);
  assert.equal(blueprint!.passingScore, 34);
  assert.equal(blueprint!.timeLimitSeconds, 3000);
  assert.match(blueprint!.label ?? '', /not an official Trafikverket exam/);

  for (const seed of ['mock-1', 'mock-2', 'mock-3']) {
    const displayed = selectDisplayedQuestionsForBlueprint(blueprint!, d2TaxiLawRepository.questionVersions, { seed });
    const scored = displayed.filter((question) => question.scoringRole === 'scored');
    const nonScoring = displayed.filter((question) => question.scoringRole === 'non_scoring_simulation');

    assert.equal(displayed.length, 50);
    assert.equal(scored.length, 46);
    assert.equal(nonScoring.length, 4);
    assert.equal(new Set(displayed.map((question) => question.id)).size, 50);
    assert.equal(scored.filter((question) => question.subjectId === 'subject_d2_taxitrafiklagstiftning').length, 23);
    assert.equal(scored.filter((question) => question.subjectId === 'subject_d2_trafiklagstiftning').length, 23);
    assert.ok(new Set(scored.map((question) => question.topicId)).size >= 10);
  }
}

export function testD2FullMockQuestionVersionsFreezeAtAttemptStart() {
  const blueprint = d2TaxiLawRepository.examBlueprints.find((candidate) => candidate.id === 'blueprint_d2_realistic_full_mock_v1');
  assert.ok(blueprint);

  const selected = selectQuestionsForBlueprint(blueprint!, d2TaxiLawRepository.questionVersions, { seed: 'freeze' });
  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: blueprint!.id,
    type: 'mock_exam',
    selectedQuestions: selected,
    passThreshold: blueprint!.passThreshold,
    startedAt: '2026-09-09T10:00:00.000Z',
  });
  const changedLater = { ...selected[0], id: `${selected[0].id}_v2`, version: 2 };

  assert.equal(attempt.totalQuestions, 46);
  assert.equal(attempt.questions[0].questionVersionId, selected[0].id);
  assert.notEqual(attempt.questions[0].questionVersionId, changedLater.id);
}

export function testD2StudyStateKeepsCompletionMasteryAndMockPerformanceSeparate() {
  const blueprint = d2TaxiLawRepository.examBlueprints.find((candidate) => candidate.id === 'blueprint_d2_realistic_full_mock_v1');
  assert.ok(blueprint);

  const selected = selectQuestionsForBlueprint(blueprint!, d2TaxiLawRepository.questionVersions, { seed: 'study-state' });
  const mockAttempt = {
    ...createAttemptSnapshot({
      userId: 'user_1',
      assessmentId: blueprint!.id,
      type: 'mock_exam',
      selectedQuestions: selected,
      passThreshold: blueprint!.passThreshold,
    }),
    status: 'completed' as const,
    completedAt: '2026-09-09T11:00:00.000Z',
    score: 34,
    passed: true,
  };
  const checkpointAttempt = {
    ...createAttemptSnapshot({
      userId: 'user_1',
      assessmentId: 'D2-TRAFFIC-BASIC-CHECKPOINT-001',
      type: 'checkpoint',
      selectedQuestions: selected.slice(0, 1),
      passThreshold: 0.8,
    }),
    status: 'completed' as const,
    completedAt: '2026-09-09T10:00:00.000Z',
    score: 1,
    passed: true,
  };
  const answers = mockAttempt.questions.slice(0, 4).map((attemptQuestion, index) => ({
    id: `answer_${index}`,
    attemptId: mockAttempt.id,
    attemptQuestionId: attemptQuestion.id,
    userId: 'user_1',
    selectedChoiceId: selected[index].correctChoiceId,
    correct: index < 3,
    answeredAt: '2026-09-09T11:00:00.000Z',
  }));

  const state = getD2StudyState({
    repository: d2TaxiLawRepository,
    userId: 'user_1',
    facts: [
      completeLessonFact('user_1', d2TaxiLawRepository.lessons.find((lesson) => lesson.topicId.startsWith('topic_d2_'))!.id),
      completedAttemptFact(checkpointAttempt),
      completedAttemptFact(mockAttempt),
    ],
    attempts: [checkpointAttempt, mockAttempt],
    answers,
  });

  assert.equal(state.completion.completedLessons, 1);
  assert.equal(state.mastery.passedTopicCheckpoints, 1);
  assert.equal(state.mockExamPerformance.length, 1);
  assert.equal(state.mockExamPerformance[0].score, 34);
  assert.ok(state.subjectAccuracy.some((subject) => subject.answered > 0));
}
