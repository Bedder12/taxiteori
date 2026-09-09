import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createAttemptSnapshot, selectCheckpointQuestions } from '../src';
import type { QuestionVersion } from '../src/types';

type Curriculum = {
  requirements: {
    stable_key: string;
    subject: string;
    active: boolean;
    competency_type?: string;
  }[];
};

type Fact = {
  stable_key: string;
  requirement_key: string;
  source_id: string;
  exact_reference: string;
  legal_status: string;
  verification_status: string;
};

type FactsFile = {
  sources: {
    source_id: string;
    source_type: string;
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
  title: string;
  learning_objectives: string[];
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
  version: number;
  requirement_keys: string[];
  fact_keys: string[];
  lesson_key: string;
  question_type: string;
  competencies: string[];
  prompt: string;
  answer_choices: { id: string; text: string }[];
  correct_answer_id: string;
  explanation: string;
  source_references: { source_id: string; exact_reference: string }[];
  status: string;
};

type QuestionsFile = {
  checkpoint_exam: {
    stable_key: string;
    question_count: number;
    pass_threshold: number;
    eligible_status: string;
    freeze_question_versions_on_attempt_start: boolean;
    status: string;
  };
  questions: Question[];
};

function loadJson<T>(relativePath: string) {
  const path = resolve(__dirname, '../../../../', relativePath);
  return JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, '')) as T;
}

function loadCurriculum() {
  return loadJson<Curriculum>('data/curriculum/requirements.json');
}

function loadFacts() {
  return loadJson<FactsFile>('data/content/d2-taxi-law/vilotider-facts.json');
}

function loadLessons() {
  return loadJson<LessonsFile>('data/content/d2-taxi-law/vilotider-lessons.json');
}

function loadQuestions() {
  return loadJson<QuestionsFile>('data/questions/d2-taxi-law/vilotider-questions.json');
}

function factMap() {
  return new Map(loadFacts().facts.map((fact) => [fact.stable_key, fact]));
}

function lessonMap() {
  return new Map(loadLessons().lessons.map((lesson) => [lesson.stable_key, lesson]));
}

function curriculumRequirementKeys() {
  return new Set(
    loadCurriculum()
      .requirements.filter((requirement) => requirement.active && requirement.subject === 'D2_TAXI_LAW')
      .map((requirement) => requirement.stable_key),
  );
}

function toQuestionVersion(question: Question): QuestionVersion {
  return {
    id: `${question.stable_key.toLowerCase()}_v${question.version}`,
    questionId: question.stable_key.toLowerCase(),
    stableKey: question.stable_key,
    version: question.version,
    examId: 'exam_d2_lagstiftning',
    subjectId: 'subject_d2_taxitrafiklagstiftning',
    topicId: 'topic_d2_taxi_vilotider',
    lessonId: question.lesson_key,
    type: 'single_choice',
    contexts: ['checkpoint', 'practice'],
    prompt: question.prompt,
    choices: question.answer_choices.map((choice) => ({ id: choice.id, text: choice.text })),
    correctChoiceId: question.correct_answer_id,
    explanation: question.explanation,
    difficulty: 'medium',
    sourceIds: question.source_references.map((source) => source.source_id),
    status: question.status as QuestionVersion['status'],
    createdAt: '2026-09-09T00:00:00.000Z',
    reviewedAt: '2026-09-09T00:00:00.000Z',
  };
}

export function testVilotiderFactsAreVerifiedAndSourced() {
  const facts = loadFacts();
  const sourceIds = new Set(facts.sources.map((source) => source.source_id));
  const requirementKeys = curriculumRequirementKeys();

  for (const source of facts.sources) {
    assert.ok(source.authority.trim().length > 0, `${source.source_id} has no authority.`);
    assert.ok(source.current_validity.trim().length > 0, `${source.source_id} has no current validity note.`);
  }

  for (const fact of facts.facts) {
    assert.ok(requirementKeys.has(fact.requirement_key), `${fact.stable_key} points to an unknown D2_TAXI_LAW requirement.`);
    assert.ok(sourceIds.has(fact.source_id), `${fact.stable_key} points to an unknown source.`);
    assert.ok(fact.exact_reference.trim().length > 0, `${fact.stable_key} has no exact legal reference.`);
    assert.equal(fact.verification_status, 'verified', `${fact.stable_key} is not verified.`);
  }
}

export function testVilotiderLessonsHaveRequirementAndFactLinks() {
  const facts = factMap();
  const requirementKeys = curriculumRequirementKeys();

  for (const lesson of loadLessons().lessons) {
    assert.ok(lesson.requirement_keys.length > 0, `${lesson.stable_key} has no requirement links.`);
    assert.ok(lesson.fact_keys.length > 0, `${lesson.stable_key} has no fact links.`);
    assert.ok(lesson.source_references.length > 0, `${lesson.stable_key} has no source references.`);

    for (const requirementKey of lesson.requirement_keys) {
      assert.ok(requirementKeys.has(requirementKey), `${lesson.stable_key} points to an unknown requirement ${requirementKey}.`);
    }

    for (const factKey of lesson.fact_keys) {
      assert.ok(facts.has(factKey), `${lesson.stable_key} points to an unknown fact ${factKey}.`);
    }

    for (const block of lesson.content_blocks) {
      const hasTextContent = Boolean(block.text || block.items?.length || block.timeline?.length || block.reasoning || block.final_answer);
      assert.ok(hasTextContent, `${lesson.stable_key} has an empty block.`);
      assert.ok(block.fact_keys?.length, `${lesson.stable_key} has a legal content block without fact links.`);
      for (const factKey of block.fact_keys ?? []) {
        assert.ok(facts.has(factKey), `${lesson.stable_key} block points to unknown fact ${factKey}.`);
      }
    }
  }
}

export function testVilotiderQuestionsHaveFullTraceability() {
  const facts = factMap();
  const lessons = lessonMap();
  const requirementKeys = curriculumRequirementKeys();

  for (const question of loadQuestions().questions.filter((candidate) => candidate.status === 'published')) {
    assert.ok(question.requirement_keys.length > 0, `${question.stable_key} has no requirement links.`);
    assert.ok(question.fact_keys.length > 0, `${question.stable_key} has no fact links.`);
    assert.ok(question.source_references.length > 0, `${question.stable_key} has no source references.`);
    assert.ok(question.explanation.includes('Rätt:'), `${question.stable_key} explanation does not explain why correct.`);
    assert.match(question.explanation, /Repetera lektion/, `${question.stable_key} explanation does not point back to a lesson.`);

    const lesson = lessons.get(question.lesson_key);
    assert.ok(lesson, `${question.stable_key} points to unknown lesson ${question.lesson_key}.`);

    for (const requirementKey of question.requirement_keys) {
      assert.ok(requirementKeys.has(requirementKey), `${question.stable_key} points to unknown requirement ${requirementKey}.`);
      assert.ok(lesson!.requirement_keys.includes(requirementKey), `${question.stable_key} requirement ${requirementKey} is not covered by its lesson.`);
    }

    for (const factKey of question.fact_keys) {
      const fact = facts.get(factKey);
      assert.ok(fact, `${question.stable_key} points to unknown fact ${factKey}.`);
      assert.equal(fact!.verification_status, 'verified', `${question.stable_key} uses unresolved fact ${factKey}.`);
      assert.ok(question.requirement_keys.includes(fact!.requirement_key), `${question.stable_key} fact ${factKey} belongs to an unlinked requirement.`);
      assert.ok(
        question.source_references.some((source) => source.source_id === fact!.source_id),
        `${question.stable_key} has fact ${factKey} without source traceability.`,
      );
    }

    for (const source of question.source_references) {
      assert.ok(source.exact_reference.trim().length > 0, `${question.stable_key} has a source without exact reference.`);
    }
  }
}

export function testVilotiderCalculationQuestionsUseCalculationRequirement() {
  for (const question of loadQuestions().questions) {
    if (question.question_type === 'calculation') {
      assert.ok(
        question.requirement_keys.includes('D2-TAXI-032-003'),
        `${question.stable_key} is a calculation question outside the dygnsvila calculation requirement.`,
      );
    }
  }
}

export function testVilotiderCheckpointSelectionAndVersionFreeze() {
  const questionsFile = loadQuestions();
  const questionVersions = questionsFile.questions.map(toQuestionVersion);
  const withArchived = [
    ...questionVersions,
    {
      ...questionVersions[0],
      id: 'archived_vilotider_question_v1',
      questionId: 'archived_vilotider_question',
      stableKey: 'D2-TAXI-VILOTIDER-ARCHIVED',
      status: 'archived' as const,
    },
  ];

  const selected = selectCheckpointQuestions(
    questionsFile.checkpoint_exam.stable_key,
    'subject_d2_taxitrafiklagstiftning',
    'topic_d2_taxi_vilotider',
    questionsFile.checkpoint_exam.question_count,
    withArchived,
  );

  assert.equal(selected.length, 15);
  assert.ok(selected.every((question) => question.status === 'published'));
  assert.ok(!selected.some((question) => question.stableKey === 'D2-TAXI-VILOTIDER-ARCHIVED'));

  const attempt = createAttemptSnapshot({
    userId: 'user_1',
    assessmentId: questionsFile.checkpoint_exam.stable_key,
    type: 'checkpoint',
    selectedQuestions: selected,
    passThreshold: questionsFile.checkpoint_exam.pass_threshold,
    startedAt: '2026-09-09T10:00:00.000Z',
  });
  const updatedAfterAttemptStart = selected.map((question, index) =>
    index === 0 ? { ...question, id: `${question.id}_v2`, version: 2, prompt: 'Updated after attempt started' } : question,
  );

  assert.equal(attempt.questions.length, 15);
  assert.equal(attempt.questions[0].version, selected[0].version);
  assert.equal(attempt.questions[0].questionVersionId, selected[0].id);
  assert.ok(!updatedAfterAttemptStart.some((question) => question.id === attempt.questions[0].questionVersionId && question.version === 2));
}
