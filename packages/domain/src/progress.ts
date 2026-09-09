import type { Answer, Assessment, Attempt, LearningRepository, Lesson, Topic, UserProgressFact } from './types';

export function isLessonCompleted(facts: UserProgressFact[], userId: string, lessonId: string) {
  return facts.some((fact) => fact.type === 'lesson_completed' && fact.userId === userId && fact.lessonId === lessonId);
}

export function completeLessonFact(userId: string, lessonId: string, completedAt = new Date().toISOString()): UserProgressFact {
  return { type: 'lesson_completed', userId, lessonId, completedAt };
}

export function completedAttemptFact(attempt: Attempt): UserProgressFact {
  if (attempt.status !== 'completed' || attempt.passed === undefined || !attempt.completedAt) {
    throw new Error('Attempt must be completed before it can become a progress fact.');
  }

  return {
    type: 'attempt_completed',
    userId: attempt.userId,
    attemptId: attempt.id,
    assessmentId: attempt.assessmentId,
    passed: attempt.passed,
    completedAt: attempt.completedAt,
  };
}

export function getTopicProgress(input: {
  userId: string;
  topic: Topic;
  lessons: Lesson[];
  facts: UserProgressFact[];
}) {
  const lessonIds = input.lessons
    .filter((lesson) => lesson.topicId === input.topic.id && lesson.status === 'published')
    .map((lesson) => lesson.id);
  const completedLessons = lessonIds.filter((lessonId) => isLessonCompleted(input.facts, input.userId, lessonId));

  return {
    totalLessons: lessonIds.length,
    completedLessons: completedLessons.length,
    learningPercent: lessonIds.length === 0 ? 0 : Math.round((completedLessons.length / lessonIds.length) * 100),
  };
}

export function getSubjectProgress(input: {
  userId: string;
  topicIds: string[];
  lessons: Lesson[];
  facts: UserProgressFact[];
  checkpointAssessment?: Assessment;
}) {
  const lessons = input.lessons.filter((lesson) => input.topicIds.includes(lesson.topicId) && lesson.status === 'published');
  const completedLessons = lessons.filter((lesson) => isLessonCompleted(input.facts, input.userId, lesson.id));
  const checkpointPassed =
    input.checkpointAssessment === undefined
      ? false
      : input.facts.some(
          (fact) =>
            fact.type === 'attempt_completed' &&
            fact.userId === input.userId &&
            fact.assessmentId === input.checkpointAssessment?.id &&
            fact.passed,
        );

  return {
    totalLessons: lessons.length,
    completedLessons: completedLessons.length,
    learningPercent: lessons.length === 0 ? 0 : Math.round((completedLessons.length / lessons.length) * 100),
    checkpointPassed,
  };
}

export function getD2StudyState(input: {
  repository: LearningRepository;
  userId: string;
  facts: UserProgressFact[];
  attempts: Attempt[];
  answers: Answer[];
  mockBlueprintId?: string;
}) {
  const d2Exam = input.repository.exams.find((exam) => exam.code === 'D2');
  const d2Subjects = input.repository.subjects.filter((subject) => subject.examId === d2Exam?.id && subject.status === 'published');
  const d2SubjectIds = new Set(d2Subjects.map((subject) => subject.id));
  const d2Topics = input.repository.topics.filter((topic) => d2SubjectIds.has(topic.subjectId) && topic.status === 'published');
  const d2TopicIds = new Set(d2Topics.map((topic) => topic.id));
  const d2Lessons = input.repository.lessons.filter((lesson) => d2TopicIds.has(lesson.topicId) && lesson.status === 'published');
  const completedLessons = d2Lessons.filter((lesson) => isLessonCompleted(input.facts, input.userId, lesson.id));

  const topicCheckpoints = input.repository.assessments.filter(
    (assessment) => assessment.type === 'checkpoint' && assessment.topicId && d2TopicIds.has(assessment.topicId),
  );
  const passedTopicCheckpoints = topicCheckpoints.filter((assessment) =>
    input.facts.some(
      (fact) => fact.type === 'attempt_completed' && fact.userId === input.userId && fact.assessmentId === assessment.id && fact.passed,
    ),
  );

  const questionByVersionId = new Map(input.repository.questionVersions.map((question) => [question.id, question]));
  const completedAttemptIds = new Set(
    input.attempts
      .filter((attempt) => attempt.userId === input.userId && attempt.status === 'completed')
      .map((attempt) => attempt.id),
  );
  const subjectAccuracy = d2Subjects.map((subject) => {
    const answers = input.answers.filter((answer) => {
      if (answer.userId !== input.userId || !completedAttemptIds.has(answer.attemptId)) {
        return false;
      }

      const attempt = input.attempts.find((candidate) => candidate.id === answer.attemptId);
      const attemptQuestion = attempt?.questions.find((candidate) => candidate.id === answer.attemptQuestionId);
      const question = attemptQuestion ? questionByVersionId.get(attemptQuestion.questionVersionId) : undefined;
      return question?.subjectId === subject.id;
    });

    return {
      subjectId: subject.id,
      answered: answers.length,
      correct: answers.filter((answer) => answer.correct).length,
      accuracy: answers.length === 0 ? null : answers.filter((answer) => answer.correct).length / answers.length,
    };
  });

  const mockBlueprintId = input.mockBlueprintId ?? 'blueprint_d2_realistic_full_mock_v1';
  const mockExamPerformance = input.attempts
    .filter((attempt) => attempt.userId === input.userId && attempt.assessmentId === mockBlueprintId && attempt.status === 'completed')
    .map((attempt) => ({
      attemptId: attempt.id,
      score: attempt.score ?? 0,
      totalQuestions: attempt.totalQuestions,
      passed: Boolean(attempt.passed),
      completedAt: attempt.completedAt,
    }));

  return {
    completion: {
      completedLessons: completedLessons.length,
      totalLessons: d2Lessons.length,
      percent: d2Lessons.length === 0 ? 0 : Math.round((completedLessons.length / d2Lessons.length) * 100),
    },
    mastery: {
      passedTopicCheckpoints: passedTopicCheckpoints.length,
      totalTopicCheckpoints: topicCheckpoints.length,
      percent: topicCheckpoints.length === 0 ? 0 : Math.round((passedTopicCheckpoints.length / topicCheckpoints.length) * 100),
    },
    subjectAccuracy,
    mockExamPerformance,
  };
}
