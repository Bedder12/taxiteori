import { getSubjectProgress, getTopicProgress, isLessonCompleted } from './progress';
import type { Assessment, Exam, ExamBlueprint, LearningRepository, Subject, UserProgressFact } from './types';

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

export type SequentialPluggaStepStatus =
  | 'locked'
  | 'not_started'
  | 'in_progress'
  | 'lessons_done'
  | 'checkpoint_ready'
  | 'completed';

export type SequentialPluggaStep =
  | {
      id: string;
      type: 'subject';
      order: number;
      exam: Exam;
      subject: Subject;
      assessment?: Assessment;
      status: SequentialPluggaStepStatus;
      progressPercent: number;
      completedLessons: number;
      totalLessons: number;
      questionCount?: number;
      href: { pathname: '/subject/[subjectId]'; params: { subjectId: string } };
      lockedReason?: string;
      activeLabel?: string;
    }
  | {
      id: string;
      type: 'mock_exam';
      order: number;
      exam: Exam;
      blueprint: ExamBlueprint;
      status: SequentialPluggaStepStatus;
      progressPercent: number;
      questionCount?: number;
      href: { pathname: '/exam/[examId]/mock'; params: { examId: string } };
      lockedReason?: string;
      activeLabel?: string;
    };

export type SequentialPluggaPath = {
  steps: SequentialPluggaStep[];
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  activeStep?: SequentialPluggaStep;
};

function hasPassedAssessment(facts: UserProgressFact[], userId: string, assessmentId: string) {
  return facts.some((fact) => fact.type === 'attempt_completed' && fact.userId === userId && fact.assessmentId === assessmentId && fact.passed);
}

function subjectStatus(input: {
  repository: LearningRepository;
  subject: Subject;
  assessment?: Assessment;
  facts: UserProgressFact[];
  userId: string;
  unlocked: boolean;
}): SequentialPluggaStepStatus {
  if (!input.unlocked) return 'locked';

  const topics = input.repository.topics.filter((topic) => topic.subjectId === input.subject.id && topic.status === 'published');
  const topicIds = topics.map((topic) => topic.id);
  const progress = getSubjectProgress({
    userId: input.userId,
    topicIds,
    lessons: input.repository.lessons,
    facts: input.facts,
    checkpointAssessment: input.assessment,
  });
  const topicAssessments = input.repository.assessments.filter((assessment) => assessment.subjectId === input.subject.id && assessment.topicId && topicIds.includes(assessment.topicId) && assessment.status === 'published');
  const allTopicCheckpointsPassed = topicAssessments.length > 0 && topicAssessments.every((assessment) => hasPassedAssessment(input.facts, input.userId, assessment.id));
  const checkpointPassed = input.assessment ? progress.checkpointPassed : allTopicCheckpointsPassed;

  if (progress.learningPercent === 100 && checkpointPassed) return 'completed';
  if (progress.learningPercent === 100 && (input.assessment || topicAssessments.length > 0)) return 'checkpoint_ready';
  if (progress.completedLessons > 0 || checkpointPassed) return 'in_progress';
  return 'not_started';
}

export function buildSequentialPluggaPath(input: {
  repository: LearningRepository;
  facts: UserProgressFact[];
  userId: string;
}) {
  const exams = input.repository.exams.filter((exam) => exam.status === 'published').sort((left, right) => left.order - right.order);
  const steps: SequentialPluggaStep[] = [];
  let previousCompleted = true;

  for (const exam of exams) {
    const subjects = input.repository.subjects
      .filter((subject) => subject.examId === exam.id && subject.status === 'published')
      .sort((left, right) => left.order - right.order);

    for (const subject of subjects) {
      const topics = input.repository.topics.filter((topic) => topic.subjectId === subject.id && topic.status === 'published');
      const assessment = input.repository.assessments.find((candidate) => candidate.subjectId === subject.id && !candidate.topicId && candidate.status === 'published');
      const progress = getSubjectProgress({
        userId: input.userId,
        topicIds: topics.map((topic) => topic.id),
        lessons: input.repository.lessons,
        facts: input.facts,
        checkpointAssessment: assessment,
      });
      const topicAssessments = input.repository.assessments.filter((candidate) => candidate.subjectId === subject.id && candidate.topicId && candidate.status === 'published');
      const topicCheckpointsPassed = topicAssessments.length > 0 && topicAssessments.every((candidate) => hasPassedAssessment(input.facts, input.userId, candidate.id));
      const status = subjectStatus({ repository: input.repository, subject, assessment, facts: input.facts, userId: input.userId, unlocked: previousCompleted });
      const step: SequentialPluggaStep = {
        id: subject.id,
        type: 'subject',
        order: steps.length + 1,
        exam,
        subject,
        assessment,
        status,
        progressPercent: progress.checkpointPassed || (!assessment && topicCheckpointsPassed) ? 100 : progress.learningPercent,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        questionCount: assessment?.questionCount ?? (topicAssessments.length ? topicAssessments.reduce((sum, candidate) => sum + candidate.questionCount, 0) : undefined),
        href: { pathname: '/subject/[subjectId]', params: { subjectId: subject.id } },
        lockedReason: previousCompleted ? undefined : 'Slutför föregående steg först.',
      };
      step.activeLabel = status === 'checkpoint_ready' ? 'Frågor kvar' : ['not_started', 'in_progress', 'lessons_done'].includes(status) ? 'Fortsätt här' : undefined;
      steps.push(step);
      previousCompleted = status === 'completed';
    }

    const blueprint = input.repository.examBlueprints.find((candidate) => candidate.examId === exam.id && candidate.type === 'mock_exam' && candidate.active);
    if (blueprint) {
      const passed = hasPassedAssessment(input.facts, input.userId, blueprint.id);
      const status: SequentialPluggaStepStatus = !previousCompleted ? 'locked' : passed ? 'completed' : 'checkpoint_ready';
      const step: SequentialPluggaStep = {
        id: blueprint.id,
        type: 'mock_exam',
        order: steps.length + 1,
        exam,
        blueprint,
        status,
        progressPercent: passed ? 100 : 0,
        questionCount: blueprint.totalDisplayedQuestionCount,
        href: { pathname: '/exam/[examId]/mock', params: { examId: exam.id } },
        lockedReason: previousCompleted ? undefined : `Slutför alla ämnen i ${exam.code} först.`,
        activeLabel: status === 'checkpoint_ready' ? `Slutprov ${exam.code}` : undefined,
      };
      steps.push(step);
      previousCompleted = status === 'completed';
    }
  }

  const completedSteps = steps.filter((step) => step.status === 'completed').length;
  const activeStep = steps.find((step) => step.status !== 'completed' && step.status !== 'locked');

  return {
    steps,
    completedSteps,
    totalSteps: steps.length,
    progressPercent: steps.length === 0 ? 0 : Math.round((completedSteps / steps.length) * 100),
    activeStep,
  } satisfies SequentialPluggaPath;
}
