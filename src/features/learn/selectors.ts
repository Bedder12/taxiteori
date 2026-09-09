import {
  getFirstIncompleteLesson,
  getOrderedLessonsForTopic,
  getSubjectProgress,
  getTopicLearningProgress,
  getTopicProgress,
  isLessonCompleted,
  type LearningRepository,
  type UserProgressFact,
} from '../../../packages/domain/src';

export function getExamView(repository: LearningRepository, examId: string) {
  const exam = repository.exams.find((candidate) => candidate.id === examId);
  const subjects = repository.subjects.filter((subject) => subject.examId === examId && subject.status === 'published').sort((a, b) => a.order - b.order);
  return { exam, subjects };
}

export function getSubjectView(repository: LearningRepository, subjectId: string, facts: UserProgressFact[], userId: string) {
  const subject = repository.subjects.find((candidate) => candidate.id === subjectId);
  const topics = repository.topics.filter((topic) => topic.subjectId === subjectId && topic.status === 'published').sort((a, b) => a.order - b.order);
  const lessons = repository.lessons.filter((lesson) => topics.some((topic) => topic.id === lesson.topicId)).sort((a, b) => a.order - b.order);
  const checkpointAssessment = repository.assessments.find(
    (assessment) => assessment.subjectId === subjectId && !assessment.topicId && assessment.status === 'published',
  );
  const progress = getSubjectProgress({
    userId,
    topicIds: topics.map((topic) => topic.id),
    lessons,
    facts,
    checkpointAssessment,
  });

  return { subject, topics, lessons, checkpointAssessment, progress };
}

export function getTopicCardView(repository: LearningRepository, topicId: string, facts: UserProgressFact[], userId: string) {
  const topic = repository.topics.find((candidate) => candidate.id === topicId);
  const lessons = repository.lessons.filter((lesson) => lesson.topicId === topicId).sort((a, b) => a.order - b.order);
  const progress = topic ? getTopicProgress({ userId, topic, lessons, facts }) : undefined;
  return { topic, lessons, progress };
}

export function getTopicView(repository: LearningRepository, topicId: string, facts: UserProgressFact[], userId: string) {
  const topic = repository.topics.find((candidate) => candidate.id === topicId);
  const subject = topic ? repository.subjects.find((candidate) => candidate.id === topic.subjectId) : undefined;
  const lessons = getOrderedLessonsForTopic(repository, topicId);
  const progress = getTopicLearningProgress({ repository, topicId, facts, userId });
  const firstIncompleteLesson = getFirstIncompleteLesson({ repository, topicId, facts, userId });
  const checkpointAssessment = topic
    ? repository.assessments.find((assessment) => assessment.topicId === topic.id && assessment.status === 'published')
    : undefined;

  return {
    topic,
    subject,
    lessons,
    progress,
    firstIncompleteLesson,
    checkpointAssessment,
  };
}

export function getLessonView(repository: LearningRepository, lessonId: string, facts: UserProgressFact[], userId: string) {
  const lesson = repository.lessons.find((candidate) => candidate.id === lessonId);
  const topic = lesson ? repository.topics.find((candidate) => candidate.id === lesson.topicId) : undefined;
  const topicLessons = topic ? repository.lessons.filter((candidate) => candidate.topicId === topic.id).sort((a, b) => a.order - b.order) : [];
  const currentIndex = lesson ? topicLessons.findIndex((candidate) => candidate.id === lesson.id) : -1;
  const nextLesson = currentIndex >= 0 ? topicLessons[currentIndex + 1] : undefined;
  return {
    lesson,
    topic,
    isCompleted: lesson ? isLessonCompleted(facts, userId, lesson.id) : false,
    nextLesson,
  };
}
