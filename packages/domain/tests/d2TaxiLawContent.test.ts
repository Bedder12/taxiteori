import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { selectCheckpointQuestions } from '../src';
import { d2TaxiLawRepository } from '../src/vilotiderRepository';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
  }[];
};

type Fact = {
  stable_key: string;
  topic_id?: string;
  requirement_key: string;
  source_id: string;
  exact_reference: string;
  verification_status: string;
};

type FactsFile = {
  sources: {
    source_id: string;
    authority: string;
    current_validity: string;
  }[];
  facts: Fact[];
};

type LessonBlock = {
  type: string;
  text?: string;
  items?: string[];
  timeline?: string[];
  reasoning?: string;
  final_answer?: string;
  fact_keys?: string[];
};

type Lesson = {
  stable_key: string;
  topic_id?: string;
  requirement_keys: string[];
  fact_keys: string[];
  source_references: { source_id: string; exact_references: string[] }[];
  status: string;
  content_blocks: LessonBlock[];
};

type LessonsFile = {
  lessons: Lesson[];
};

type Question = {
  stable_key: string;
  topic_id?: string;
  requirement_keys: string[];
  fact_keys: string[];
  lesson_key: string;
  source_references: { source_id: string; exact_reference: string }[];
  status: string;
};

type QuestionsFile = {
  checkpoint_exam?: {
    stable_key: string;
    topic: string;
    question_count: number;
    status: string;
  };
  checkpoint_exams?: {
    stable_key: string;
    topic: string;
    question_count: number;
    status: string;
  }[];
  questions: Question[];
};

const requestedTopicIds = [
  'topic_d2_taxi_taxitrafikens_grunder',
  'topic_d2_taxi_taxiforarlegitimation',
  'topic_d2_taxi_aterkallelse',
  'topic_d2_taxi_begrepp_definitioner',
  'topic_d2_taxi_handlingar_kontroller',
  'topic_d2_taxi_taxitrafiktillstand',
  'topic_d2_taxi_taxameter_sarskild_utrustning',
  'topic_d2_taxi_prisinformation',
  'topic_d2_taxi_vilotider',
  'topic_d2_taxi_arbetstid_ansvar',
  'topic_d2_taxi_skolskjuts',
  'topic_d2_taxi_sanktioner_pafoljder',
];

function loadJson<T>(relativePath: string) {
  const path = resolve(__dirname, '../../../../', relativePath);
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as T;
}

function loadCurriculum() {
  return loadJson<Curriculum>('data/curriculum/requirements.json');
}

function allFactsFiles() {
  return [
    loadJson<FactsFile>('data/content/d2-taxi-law/remaining-topics-facts.json'),
    loadJson<FactsFile>('data/content/d2-taxi-law/vilotider-facts.json'),
  ];
}

function allLessons() {
  return [
    ...loadJson<LessonsFile>('data/content/d2-taxi-law/remaining-topics-lessons.json').lessons,
    ...loadJson<LessonsFile>('data/content/d2-taxi-law/vilotider-lessons.json').lessons.map((lesson) => ({
      ...lesson,
      topic_id: 'topic_d2_taxi_vilotider',
    })),
  ];
}

function allQuestionsFiles() {
  return [
    loadJson<QuestionsFile>('data/questions/d2-taxi-law/remaining-topics-questions.json'),
    loadJson<QuestionsFile>('data/questions/d2-taxi-law/vilotider-questions.json'),
  ];
}

function allQuestions() {
  return allQuestionsFiles().flatMap((file) =>
    file.questions.map((question) => ({
      ...question,
      topic_id: question.topic_id ?? 'topic_d2_taxi_vilotider',
    })),
  );
}

function allCheckpointExams() {
  return allQuestionsFiles().flatMap((file) => [
    ...(file.checkpoint_exams ?? []),
    ...(file.checkpoint_exam ? [{ ...file.checkpoint_exam, topic: 'topic_d2_taxi_vilotider' }] : []),
  ]);
}

function factMap() {
  return new Map(allFactsFiles().flatMap((file) => file.facts.map((fact) => [fact.stable_key, fact])));
}

function sourceIds() {
  return new Set(allFactsFiles().flatMap((file) => file.sources.map((source) => source.source_id)));
}

function requirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D2_TAXI_LAW')
      .map((requirement) => requirement.stable_key),
  );
}

export function testD2TaxiLawRepositoryPublishesRequestedTopics() {
  assert.deepEqual(
    d2TaxiLawRepository.topics
      .filter((topic) => topic.subjectId === 'subject_d2_taxitrafiklagstiftning')
      .map((topic) => topic.id),
    requestedTopicIds,
  );

  for (const topic of d2TaxiLawRepository.topics) {
    assert.equal(topic.status, 'published', `${topic.id} is not published.`);
  }
}

export function testD2TaxiLawFactsAreVerifiedAndSourced() {
  const validSources = sourceIds();
  const validRequirements = requirementKeys();

  for (const factsFile of allFactsFiles()) {
    for (const source of factsFile.sources) {
      assert.ok(source.authority.trim().length > 0, `${source.source_id} has no authority.`);
      assert.ok(source.current_validity.trim().length > 0, `${source.source_id} has no current validity note.`);
    }

    for (const fact of factsFile.facts) {
      assert.ok(validRequirements.has(fact.requirement_key), `${fact.stable_key} points to an unknown D2_TAXI_LAW requirement.`);
      assert.ok(validSources.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
      assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact legal reference.`);
      assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
    }
  }
}

export function testD2TaxiLawLessonsCoverEveryPublishedTopic() {
  const facts = factMap();
  const validRequirements = requirementKeys();
  const lessonsByTopic = new Map<string, Lesson[]>();

  for (const lesson of allLessons()) {
    assert.equal(lesson.status, 'published', `${lesson.stable_key} is not published.`);
    assert.ok(lesson.topic_id, `${lesson.stable_key} has no topic id.`);
    lessonsByTopic.set(lesson.topic_id!, [...(lessonsByTopic.get(lesson.topic_id!) ?? []), lesson]);

    for (const requirementKey of lesson.requirement_keys) {
      assert.ok(validRequirements.has(requirementKey), `${lesson.stable_key} points to unknown requirement ${requirementKey}.`);
    }

    for (const factKey of lesson.fact_keys) {
      assert.ok(facts.has(factKey), `${lesson.stable_key} points to unknown fact ${factKey}.`);
    }

    for (const source of lesson.source_references) {
      assert.ok(source.exact_references.length > 0, `${lesson.stable_key} source ${source.source_id} has no exact references.`);
    }

    for (const block of lesson.content_blocks) {
      const hasTextContent = Boolean(block.text || block.items?.length || block.timeline?.length || block.reasoning || block.final_answer);
      assert.ok(hasTextContent, `${lesson.stable_key} has an empty block.`);
      assert.ok(block.fact_keys?.length, `${lesson.stable_key} has a content block without fact links.`);
      for (const factKey of block.fact_keys ?? []) {
        assert.ok(facts.has(factKey), `${lesson.stable_key} block points to unknown fact ${factKey}.`);
      }
    }
  }

  for (const topicId of requestedTopicIds) {
    assert.ok(lessonsByTopic.get(topicId)?.length, `${topicId} has no published lesson.`);
  }
}

export function testD2TaxiLawQuestionsHaveFullTraceability() {
  const facts = factMap();
  const lessons = new Map(allLessons().map((lesson) => [lesson.stable_key, lesson]));
  const validRequirements = requirementKeys();

  for (const question of allQuestions().filter((candidate) => candidate.status === 'published')) {
    const lesson = lessons.get(question.lesson_key);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);
    assert.equal(question.topic_id, lesson!.topic_id, `${question.stable_key} topic does not match its lesson.`);

    for (const requirementKey of question.requirement_keys) {
      assert.ok(validRequirements.has(requirementKey), `${question.stable_key} points to unknown requirement ${requirementKey}.`);
      assert.ok(lesson!.requirement_keys.includes(requirementKey), `${question.stable_key} requirement ${requirementKey} is not covered by lesson.`);
    }

    for (const factKey of question.fact_keys) {
      const fact = facts.get(factKey);
      assert.ok(fact, `${question.stable_key} points to unknown fact ${factKey}.`);
      assert.equal(fact!.verification_status, 'verified', `${question.stable_key} uses unresolved fact ${factKey}.`);
      assert.ok(question.requirement_keys.includes(fact!.requirement_key), `${question.stable_key} fact ${factKey} belongs to an unlinked requirement.`);
      assert.ok(lesson!.fact_keys.includes(factKey), `${question.stable_key} fact ${factKey} is not covered by its lesson.`);
      assert.ok(
        question.source_references.some((source) => source.source_id === fact!.source_id),
        `${question.stable_key} has fact ${factKey} without source traceability.`,
      );
    }
  }
}

export function testD2TaxiLawCheckpointsUseFifteenPublishedQuestions() {
  for (const checkpoint of allCheckpointExams()) {
    assert.equal(checkpoint.status, 'published', `${checkpoint.stable_key} is not published.`);
    assert.equal(checkpoint.question_count, 15, `${checkpoint.stable_key} does not request 15 questions.`);

    const selected = selectCheckpointQuestions(
      checkpoint.stable_key,
      'subject_d2_taxitrafiklagstiftning',
      checkpoint.topic,
      checkpoint.question_count,
      d2TaxiLawRepository.questionVersions,
    );

    assert.equal(selected.length, 15, `${checkpoint.stable_key} did not select 15 questions.`);
    assert.ok(selected.every((question) => question.status === 'published'), `${checkpoint.stable_key} selected non-published questions.`);
    assert.ok(selected.every((question) => question.topicId === checkpoint.topic), `${checkpoint.stable_key} selected from another topic.`);
  }
}
