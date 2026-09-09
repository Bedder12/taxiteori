import assert from 'node:assert/strict';

import { demoRepository } from '../src/demoData';
import { completeLessonFact, getSubjectProgress, getTopicProgress } from '../src';

export function testTopicProgress() {
  const userId = 'user_1';
  const topic = demoRepository.topics[0];
  const facts = [
    completeLessonFact(userId, 'lesson_vilotider_intro', '2026-09-09T10:00:00.000Z'),
    completeLessonFact(userId, 'lesson_vilotider_ansvar', '2026-09-09T10:02:00.000Z'),
  ];

  const progress = getTopicProgress({
    userId,
    topic,
    lessons: demoRepository.lessons,
    facts,
  });

  assert.equal(progress.totalLessons, 5);
  assert.equal(progress.completedLessons, 2);
  assert.equal(progress.learningPercent, 40);
}

export function testSubjectProgressSemantics() {
  const userId = 'user_1';
  const topic = demoRepository.topics[0];
  const facts = demoRepository.lessons.map((lesson) => completeLessonFact(userId, lesson.id));
  const checkpointAssessment = demoRepository.assessments[0];

  const progress = getSubjectProgress({
    userId,
    topicIds: [topic.id],
    lessons: demoRepository.lessons,
    facts,
    checkpointAssessment,
  });

  assert.equal(progress.learningPercent, 100);
  assert.equal(progress.checkpointPassed, false);
}
