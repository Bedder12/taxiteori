import { getTopicProgress, isLessonCompleted } from './progress';
import type { LearningRepository, UserProgressFact } from './types';

export function getOrderedLessonsForTopic(repository: LearningRepository, topicId: string) {
  return repository.lessons
    .filter((lesson) => lesson.topicId === topicId && lesson.status === 'published')
    .sort((left, right) => left.order - right.order);
}

export function getFirstIncompleteLesson(input: {
  repository: LearningRepository;
  topicId: string;
  facts: UserProgressFact[];
  userId: string;
}) {
  const orderedLessons = getOrderedLessonsForTopic(input.repository, input.topicId);
  return orderedLessons.find((lesson) => !isLessonCompleted(input.facts, input.userId, lesson.id)) ?? orderedLessons[0];
}

export function getTopicLearningProgress(input: {
  repository: LearningRepository;
  topicId: string;
  facts: UserProgressFact[];
  userId: string;
}) {
  const topic = input.repository.topics.find((candidate) => candidate.id === input.topicId);
  if (!topic) {
    return undefined;
  }

  return getTopicProgress({
    userId: input.userId,
    topic,
    lessons: getOrderedLessonsForTopic(input.repository, input.topicId),
    facts: input.facts,
  });
}
