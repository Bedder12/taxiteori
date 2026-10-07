import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createAttemptSnapshot, selectCheckpointQuestions, selectDisplayedQuestionsForBlueprint, selectSubjectCheckpointQuestions } from '../src';
import { loadRuntimeRepository } from '../src/runtimeRepository';
import { d2TaxiLawRepository } from '../src/vilotiderRepository';
import { getSubjectView } from '../../../src/features/learn/selectors';
import { getRuntimeState, restoreAttemptQuestions, RUNTIME_USER_ID, saveRuntimeAnswer, startRuntimeCheckpoint, submitRuntimeAttempt } from '../../../src/lib/runtimeLearningState';
import { getRevisitRecommendations } from '../../../src/features/quiz/selectors';

type Json = any;

type RuntimeMetadata = {
  topics: { id: string; subjectId: string; title: string }[];
  subjects: { id: string; examId: string }[];
  exams: { id: string; code: string }[];
  assessments: { id: string; subjectId?: string; topicId?: string; questionCount: number; status: string }[];
};

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

function runtimeMetadata() {
  return loadJson('data/runtime-learning-metadata.json') as RuntimeMetadata;
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

export function testQuestionCoverageV2RuntimeQuestionTopicsResolve() {
  const metadata = runtimeMetadata();
  const topics = new Map(metadata.topics.map((topic) => [topic.id, topic]));
  const subjects = new Map(metadata.subjects.map((subject) => [subject.id, subject]));
  const exams = new Map(metadata.exams.map((exam) => [exam.id, exam]));
  const lessons = new Map(allLessons().map((lesson: Json) => [lesson.stable_key, lesson] as [string, Json]));

  assertNoDuplicates(metadata.topics.map((topic) => topic.id), 'runtime topic ID');
  assert.equal(metadata.topics.filter((topic) => topic.id === 'topic_d2_taxi_vilotider').length, 1);
  const vilotiderTopic = topics.get('topic_d2_taxi_vilotider');
  assert.equal(vilotiderTopic?.title, 'Vilotider');
  assert.equal(vilotiderTopic?.subjectId, 'subject_d2_taxitrafiklagstiftning');
  assert.equal(exams.get(subjects.get(vilotiderTopic!.subjectId)!.examId)?.code, 'D2');

  const vilotiderLessons = allLessons().filter((lesson: Json) => lesson.stable_key.startsWith('D2-TAXI-VILOTIDER-'));
  assert.ok(vilotiderLessons.length > 0);
  for (const lesson of vilotiderLessons) {
    assert.equal(lesson.topic_id, 'topic_d2_taxi_vilotider', `${lesson.stable_key} does not resolve to the canonical topic.`);
  }

  const questions = allQuestions();
  assertNoDuplicates(questions.map((question) => `${question.stable_key}::${question.version}`), 'question stable_key/version');
  for (const question of questions) {
    assert.ok(question.topic_id, `${question.stable_key} has no topic_id.`);
    const topic = topics.get(question.topic_id);
    assert.ok(topic, `${question.stable_key} points to unknown topic ${question.topic_id}.`);
    const lesson = lessons.get(question.lesson_key);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson.topic_id, `${question.stable_key} topic does not match lesson.`);
    const subject = subjects.get(topic!.subjectId);
    assert.ok(subject, `${question.stable_key} topic ${question.topic_id} points to unknown subject.`);
    const exam = exams.get(subject!.examId);
    assert.ok(exam, `${question.stable_key} subject ${subject!.id} points to unknown exam.`);
    const expectedExamCode = question.stable_key.startsWith('D1-') ? 'D1' : 'D2';
    assert.equal(exam.code, expectedExamCode, `${question.stable_key} topic resolves to the wrong exam.`);
  }

  const vilotiderQuestions = questions.filter((question) => question.stable_key.startsWith('D2-TAXI-VILOTIDER-'));
  assert.equal(vilotiderQuestions.length, 27);
  assert.ok(vilotiderQuestions.every((question) => question.topic_id === 'topic_d2_taxi_vilotider'));
}

export async function testQuestionCoverageV2D2RuntimeAndMockLoad() {
  const taxiSubjectId = 'subject_d2_taxitrafiklagstiftning';
  const trafficSubjectId = 'subject_d2_trafiklagstiftning';
  const repository = await loadRuntimeRepository([taxiSubjectId, trafficSubjectId]);
  const taxiQuestions = repository.questionVersions.filter((question) => question.subjectId === taxiSubjectId);
  const trafficQuestions = repository.questionVersions.filter((question) => question.subjectId === trafficSubjectId);
  const vilotiderLessons = repository.lessons.filter((lesson) => lesson.topicId === 'topic_d2_taxi_vilotider');
  const vilotiderQuestions = taxiQuestions.filter((question) => question.topicId === 'topic_d2_taxi_vilotider');

  assert.equal(taxiQuestions.length, 192);
  assert.equal(trafficQuestions.length, 129);
  assert.equal(vilotiderLessons.length, 6);
  assert.equal(vilotiderQuestions.length, 27);
  assert.equal(repository.topics.filter((topic) => topic.id === 'topic_d2_taxi_vilotider').length, 1);
  assert.ok(repository.questionVersions.every((question) => question.topicId && Number.isInteger(question.version) && question.version > 0));
  const frozenSample = taxiQuestions.slice(0, 2);
  const restoredSample = restoreAttemptQuestions(
    'resume-test',
    [...frozenSample].reverse().map((question, index) => ({
      client_attempt_question_id: `attempt-question-${index}`,
      question_key: question.questionId,
      stable_key: question.stableKey,
      version: question.version,
      display_order: index === 0 ? 2 : 1,
      subject_key: question.subjectId,
      scoring_role: 'scored',
      question_snapshot: { id: question.id },
    })),
  );
  assert.deepEqual(restoredSample.map((question) => question.questionVersionId), frozenSample.map((question) => question.id));
  assert.deepEqual(restoredSample.map((question) => question.order), [1, 2]);

  const taxiQuestionDocs = [
    loadJson('data/questions/d2-taxi-law/remaining-topics-questions.json'),
    loadJson('data/questions/d2-taxi-law/vilotider-questions.json'),
  ];
  const authoredTaxiCheckpoints = taxiQuestionDocs.flatMap((document) => [
    ...(document.topic_checkpoints ?? []),
    ...(document.checkpoint_exams ?? []),
    ...(document.checkpoint_exam ? [document.checkpoint_exam] : []),
  ]);
  const runtimeTaxiAssessments = repository.assessments.filter((assessment) => assessment.subjectId === taxiSubjectId);
  assert.equal(authoredTaxiCheckpoints.length, 12);
  assert.deepEqual(runtimeTaxiAssessments.map((assessment) => assessment.id), authoredTaxiCheckpoints.map((assessment) => assessment.stable_key));
  assert.ok(runtimeTaxiAssessments.every((assessment) => assessment.topicId));
  assert.equal(runtimeTaxiAssessments.some((assessment) => !assessment.topicId), false);

  const trafficQuestionDoc = loadJson('data/questions/d2-traffic-law/traffic-law-questions.json');
  const authoredTrafficAssessmentIds = [
    ...trafficQuestionDoc.topic_checkpoints.map((assessment: Json) => assessment.stable_key),
    trafficQuestionDoc.subject_checkpoint.stable_key,
  ];
  const runtimeTrafficAssessments = repository.assessments.filter((assessment) => assessment.subjectId === trafficSubjectId);
  assert.deepEqual(runtimeTrafficAssessments.map((assessment) => assessment.id), authoredTrafficAssessmentIds);
  assert.ok(runtimeTrafficAssessments.some((assessment) => !assessment.topicId));
  const trafficSubjectCheckpoint = repository.assessments.find(
    (assessment) => assessment.id === 'D2-TRAFFIC-SUBJECT-CHECKPOINT-001',
  );
  assert.ok(trafficSubjectCheckpoint);
  const trafficCheckpointQuestions = selectSubjectCheckpointQuestions(
    trafficSubjectCheckpoint!.id,
    trafficSubjectId,
    trafficSubjectCheckpoint!.questionCount,
    repository.questionVersions,
  );
  assert.equal(trafficCheckpointQuestions.length, trafficSubjectCheckpoint!.questionCount);

  const taxiView = getSubjectView(repository, taxiSubjectId, [], RUNTIME_USER_ID);
  assert.equal(taxiView.checkpointAssessment, undefined);
  assert.equal(taxiView.progress.checkpointPassed, false);
  assert.equal(getSubjectView(repository, trafficSubjectId, [], RUNTIME_USER_ID).checkpointAssessment?.id, trafficSubjectCheckpoint!.id);

  const allTaxiCheckpointFacts = runtimeTaxiAssessments.map((assessment) => ({
    type: 'attempt_completed' as const,
    userId: RUNTIME_USER_ID,
    attemptId: `passed-${assessment.id}`,
    assessmentId: assessment.id,
    passed: true,
    completedAt: '2026-10-07T00:00:00.000Z',
  }));
  assert.equal(getSubjectView(repository, taxiSubjectId, allTaxiCheckpointFacts, RUNTIME_USER_ID).progress.checkpointPassed, true);

  const reloadedRepository = await loadRuntimeRepository([taxiSubjectId, trafficSubjectId]);
  for (const assessment of runtimeTaxiAssessments) {
    const selected = selectCheckpointQuestions(
      assessment.id,
      assessment.subjectId!,
      assessment.topicId!,
      assessment.questionCount,
      repository.questionVersions,
    );
    assert.equal(selected.length, assessment.questionCount, `${assessment.id} cannot select its authored question count.`);

    const started = startRuntimeCheckpoint(repository, assessment.id);
    assert.equal(started.questions.length, assessment.questionCount);
    assert.ok(started.questions.every((question, index) => question.order === index + 1 && question.version > 0));
    const wrongQuestion = started.questions[0];
    const wrongSource = selected.find((question) => question.id === wrongQuestion.questionVersionId)!;

    for (const attemptQuestion of started.questions) {
      const sourceQuestion = selected.find((question) => question.id === attemptQuestion.questionVersionId)!;
      const choice = attemptQuestion.id === wrongQuestion.id
        ? sourceQuestion.choices.find((candidate) => candidate.id !== sourceQuestion.correctChoiceId)!.id
        : sourceQuestion.correctChoiceId;
      saveRuntimeAnswer(repository, started.id, attemptQuestion.id, choice);
    }

    const resumed = startRuntimeCheckpoint(reloadedRepository, assessment.id);
    assert.equal(resumed.id, started.id, `${assessment.id} did not resume its active attempt.`);
    assert.deepEqual(resumed.questions, started.questions, `${assessment.id} changed frozen question order or versions.`);
    assert.equal(getRuntimeState().answers.filter((answer) => answer.attemptId === started.id).length, assessment.questionCount);

    const result = submitRuntimeAttempt(reloadedRepository, started.id, {});
    assert.equal(result.attempt.id, started.id);
    assert.equal(result.attempt.status, 'completed');
    assert.equal(result.answers.length, assessment.questionCount);
    assert.equal(result.answers.find((answer) => answer.attemptQuestionId === wrongQuestion.id)?.correct, false);
    assert.equal(result.attempt.passed, true);
    const review = getRevisitRecommendations(reloadedRepository, result.attempt, result.answers);
    assert.ok(review.some((recommendation) => recommendation.lessonId === wrongSource.lessonId));
  }

  const blueprint = repository.examBlueprints.find((candidate) => candidate.id === 'blueprint_d2_realistic_full_mock_v1');
  assert.ok(blueprint);
  const displayed = selectDisplayedQuestionsForBlueprint(blueprint!, repository.questionVersions, { seed: 'd2-runtime-regression' });
  assert.equal(displayed.length, 50);
  assert.equal(displayed.filter((question) => question.scoringRole === 'scored').length, 46);
  assert.equal(displayed.filter((question) => question.scoringRole === 'non_scoring_simulation').length, 4);
  assert.equal(displayed.filter((question) => question.scoringRole === 'scored' && question.subjectId === taxiSubjectId).length, 23);
  assert.equal(displayed.filter((question) => question.scoringRole === 'scored' && question.subjectId === trafficSubjectId).length, 23);
  assert.equal(new Set(displayed.map((question) => question.id)).size, 50);
  assert.ok(displayed.every((question) => repository.topics.some((topic) => topic.id === question.topicId && topic.subjectId === question.subjectId)));
  assert.ok(displayed.every((question) => repository.subjects.some((subject) => subject.id === question.subjectId && subject.examId === question.examId)));
  assert.equal(displayed.filter((question) => question.visualMetadata?.requiresImage || question.visualMetadata?.requiresDiagram || question.visualMetadata?.requiresRoadScene || question.visualMetadata?.requiresMap).length, 0);

  const attempt = createAttemptSnapshot({
    userId: 'd2-runtime-regression',
    assessmentId: blueprint!.id,
    type: 'mock_exam',
    selectedQuestions: displayed,
    passThreshold: blueprint!.passThreshold,
    passingScore: blueprint!.passingScore,
    blueprintVersion: blueprint!.version,
    timeLimitSeconds: blueprint!.timeLimitSeconds,
    startedAt: '2026-10-07T00:00:00.000Z',
  });
  assert.equal(attempt.questions.length, 50);
  assert.equal(attempt.blueprintVersion, blueprint!.version);
  assert.deepEqual(
    attempt.questions.map((question) => [question.stableKey, question.version, question.order, question.scoringRole]),
    displayed.map((question, index) => [question.stableKey, question.version, index + 1, question.scoringRole]),
  );
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
