import assert from 'node:assert/strict';

import { buildSequentialPluggaPath, type UserProgressFact } from '../src';
import { vilotiderRepository } from '../src/vilotiderRepository';

const userId = 'plugga-path-user';

function completeSubject(subjectId: string, facts: UserProgressFact[] = []) {
  const topics = vilotiderRepository.topics.filter((topic) => topic.subjectId === subjectId);
  const topicIds = new Set(topics.map((topic) => topic.id));
  const lessons = vilotiderRepository.lessons.filter((lesson) => topicIds.has(lesson.topicId));
  const assessments = vilotiderRepository.assessments.filter((candidate) => candidate.subjectId === subjectId);

  return [
    ...facts,
    ...lessons.map((lesson, index) => ({
      type: 'lesson_completed' as const,
      userId,
      lessonId: lesson.id,
      completedAt: `2026-10-02T10:${String(index).padStart(2, '0')}:00.000Z`,
    })),
    ...assessments.map((assessment) => (
      {
          type: 'attempt_completed' as const,
          userId,
          attemptId: `attempt_${assessment.id}`,
          assessmentId: assessment.id,
          passed: true,
          completedAt: '2026-10-02T11:00:00.000Z',
      }
    )),
  ];
}

function completeExamSubjects(examCode: 'D1' | 'D2', facts: UserProgressFact[] = []) {
  const exam = vilotiderRepository.exams.find((candidate) => candidate.code === examCode);
  assert.ok(exam);
  return vilotiderRepository.subjects
    .filter((subject) => subject.examId === exam.id)
    .sort((left, right) => left.order - right.order)
    .reduce((nextFacts, subject) => completeSubject(subject.id, nextFacts), facts);
}

function passMock(blueprintId: string, facts: UserProgressFact[]) {
  return [
    ...facts,
    {
      type: 'attempt_completed' as const,
      userId,
      attemptId: `attempt_${blueprintId}`,
      assessmentId: blueprintId,
      passed: true,
      completedAt: '2026-10-02T12:00:00.000Z',
    },
  ];
}

export function testPluggaPathStartsAtFirstD1Subject() {
  const path = buildSequentialPluggaPath({ repository: vilotiderRepository, facts: [], userId });

  assert.equal(path.steps[0].type, 'subject');
  assert.equal(path.steps[0].id, 'subject_d1_navigation');
  assert.equal(path.steps[0].status, 'not_started');
  assert.equal(path.activeStep?.id, 'subject_d1_navigation');
  assert.equal(path.steps[1].status, 'locked');
}

export function testPluggaPathUnlocksNextSubjectAfterCompletion() {
  const facts = completeSubject('subject_d1_navigation');
  const path = buildSequentialPluggaPath({ repository: vilotiderRepository, facts, userId });

  assert.equal(path.steps[0].status, 'completed');
  assert.equal(path.steps[1].id, 'subject_d1_korekonomi');
  assert.equal(path.steps[1].status, 'not_started');
  assert.equal(path.activeStep?.id, 'subject_d1_korekonomi');
}

export function testPluggaPathLocksD2UntilD1MockPassed() {
  const d1Facts = completeExamSubjects('D1');
  const pathBeforeMock = buildSequentialPluggaPath({ repository: vilotiderRepository, facts: d1Facts, userId });
  const d1Mock = pathBeforeMock.steps.find((step) => step.type === 'mock_exam' && step.exam.code === 'D1');
  const firstD2 = pathBeforeMock.steps.find((step) => step.type === 'subject' && step.exam.code === 'D2');

  assert.equal(d1Mock?.status, 'checkpoint_ready');
  assert.equal(firstD2?.status, 'locked');

  const pathAfterMock = buildSequentialPluggaPath({ repository: vilotiderRepository, facts: passMock('blueprint_d1_realistic_full_mock_v1', d1Facts), userId });
  const unlockedD2 = pathAfterMock.steps.find((step) => step.type === 'subject' && step.exam.code === 'D2');

  assert.equal(unlockedD2?.id, 'subject_d2_taxitrafiklagstiftning');
  assert.equal(unlockedD2?.status, 'not_started');
}

export function testPluggaPathUnlocksD2MockAfterAllD2Subjects() {
  const facts = completeExamSubjects('D2', passMock('blueprint_d1_realistic_full_mock_v1', completeExamSubjects('D1')));
  const path = buildSequentialPluggaPath({ repository: vilotiderRepository, facts, userId });
  const d2Mock = path.steps.find((step) => step.type === 'mock_exam' && step.exam.code === 'D2');

  assert.equal(d2Mock?.id, 'blueprint_d2_realistic_full_mock_v1');
  assert.equal(d2Mock?.status, 'checkpoint_ready');
  assert.equal(path.activeStep?.id, d2Mock?.id);
}
