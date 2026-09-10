import { createId } from './ids';
import type {
  Answer,
  Attempt,
  AttemptQuestion,
  ExamBlueprint,
  QuestionVersion,
} from './types';

export type QuestionSelectionOptions = {
  seed?: string;
};

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function orderForSeed(question: QuestionVersion, seed: string) {
  return stableHash(`${seed}:${question.stableKey}:v${question.version}`);
}

export function getBlueprintAllocation(blueprint: ExamBlueprint) {
  return blueprint.subjects.map((subject) => ({
    subjectId: subject.subjectId,
    questionCount: subject.questionCount,
  }));
}

export function isQuestionEligibleForMock(question: QuestionVersion) {
  return question.status === 'published'
    && question.contexts.includes('assessment')
    && Boolean(question.requirementKeys?.length)
    && Boolean(question.factKeys?.length)
    && Boolean(question.sourceReferences?.length)
    && question.visualMetadata?.visualCorrectnessDependsOnAsset !== true;
}

export function selectQuestionsForBlueprint(
  blueprint: ExamBlueprint,
  questionVersions: QuestionVersion[],
  options: QuestionSelectionOptions = {},
) {
  const selected: QuestionVersion[] = [];
  const seed = options.seed ?? blueprint.id;

  for (const blueprintSubject of blueprint.subjects) {
    const eligible = questionVersions
      .filter(
        (question) =>
          isQuestionEligibleForMock(question) &&
          question.examId === blueprint.examId &&
          question.subjectId === blueprintSubject.subjectId &&
          question.contexts.includes('assessment'),
      )
      .sort((left, right) => orderForSeed(left, seed) - orderForSeed(right, seed));

    selected.push(...eligible.slice(0, blueprintSubject.questionCount));
  }

  return selected;
}

export function selectDisplayedQuestionsForBlueprint(
  blueprint: ExamBlueprint,
  questionVersions: QuestionVersion[],
  options: QuestionSelectionOptions = {},
) {
  const scoringQuestions = selectQuestionsForBlueprint(blueprint, questionVersions, options);
  const scoringIds = new Set(scoringQuestions.map((question) => question.id));
  const seed = `${options.seed ?? blueprint.id}:non-scoring`;
  const nonScoringCount = blueprint.nonScoringTestQuestionCount ?? 0;
  const nonScoringQuestions = questionVersions
    .filter(
      (question) =>
        isQuestionEligibleForMock(question) &&
        question.examId === blueprint.examId &&
        question.contexts.includes('assessment') &&
        !scoringIds.has(question.id),
    )
    .sort((left, right) => orderForSeed(left, seed) - orderForSeed(right, seed))
    .slice(0, nonScoringCount)
    .map((question) => ({ ...question, scoringRole: 'non_scoring_simulation' as const }));

  return [
    ...scoringQuestions.map((question) => ({ ...question, scoringRole: 'scored' as const })),
    ...nonScoringQuestions,
  ].sort((left, right) => orderForSeed(left, `${options.seed ?? blueprint.id}:display`) - orderForSeed(right, `${options.seed ?? blueprint.id}:display`));
}

export function selectCheckpointQuestions(
  assessmentId: string,
  subjectId: string,
  topicId: string,
  questionCount: number,
  questionVersions: QuestionVersion[],
) {
  return questionVersions
    .filter(
      (question) =>
        question.status === 'published' &&
        question.subjectId === subjectId &&
        question.topicId === topicId &&
        question.contexts.includes('checkpoint'),
    )
    .sort((left, right) => orderForSeed(left, assessmentId) - orderForSeed(right, assessmentId))
    .slice(0, questionCount);
}

export function selectSubjectCheckpointQuestions(
  assessmentId: string,
  subjectId: string,
  questionCount: number,
  questionVersions: QuestionVersion[],
) {
  const eligibleByTopic = new Map<string, QuestionVersion[]>();

  for (const question of questionVersions
    .filter(
      (candidate) =>
        candidate.status === 'published' &&
        candidate.subjectId === subjectId &&
        candidate.topicId &&
        candidate.contexts.includes('checkpoint'),
    )
    .sort((left, right) => orderForSeed(left, assessmentId) - orderForSeed(right, assessmentId))) {
    eligibleByTopic.set(question.topicId!, [...(eligibleByTopic.get(question.topicId!) ?? []), question]);
  }

  const selected: QuestionVersion[] = [];
  const topicIds = [...eligibleByTopic.keys()].sort();

  while (selected.length < questionCount && topicIds.some((topicId) => (eligibleByTopic.get(topicId)?.length ?? 0) > 0)) {
    for (const topicId of topicIds) {
      const next = eligibleByTopic.get(topicId)?.shift();
      if (next) {
        selected.push(next);
      }
      if (selected.length === questionCount) {
        break;
      }
    }
  }

  return selected;
}

export function createAttemptSnapshot(input: {
  userId: string;
  assessmentId: string;
  type: Attempt['type'];
  selectedQuestions: QuestionVersion[];
  passThreshold: number;
  passingScore?: number;
  blueprintVersion?: number;
  timeLimitSeconds?: number;
  startedAt?: string;
}) {
  const attemptId = createId('attempt');
  const questions: AttemptQuestion[] = input.selectedQuestions.map((question, index) => ({
    id: createId('attempt_question'),
    attemptId,
    questionVersionId: question.id,
    questionId: question.questionId,
    stableKey: question.stableKey,
    version: question.version,
    order: index + 1,
    subjectId: question.subjectId,
    scoringRole: question.scoringRole ?? 'scored',
  }));

  return {
    id: attemptId,
    userId: input.userId,
    assessmentId: input.assessmentId,
    type: input.type,
    startedAt: input.startedAt ?? new Date().toISOString(),
    status: 'in_progress',
    totalQuestions: questions.length,
    scoringQuestionCount: questions.filter((question) => question.scoringRole === 'scored').length,
    passThreshold: input.passThreshold,
    passingScore: input.passingScore,
    blueprintVersion: input.blueprintVersion,
    timeLimitSeconds: input.timeLimitSeconds,
    timedOut: false,
    questions,
  } satisfies Attempt;
}

export function scoreAttempt(
  attempt: Attempt,
  questionVersions: QuestionVersion[],
  selectedChoicesByAttemptQuestionId: Record<string, string>,
  now = new Date().toISOString(),
  timedOut = false,
) {
  if (attempt.status !== 'in_progress') {
    throw new Error('Completed attempts are immutable.');
  }

  const answers: Answer[] = attempt.questions.map((attemptQuestion) => {
    const question = questionVersions.find((candidate) => candidate.id === attemptQuestion.questionVersionId);
    if (!question) {
      throw new Error(`Missing frozen question version ${attemptQuestion.questionVersionId}.`);
    }

    const selectedChoiceId = selectedChoicesByAttemptQuestionId[attemptQuestion.id];
    if (!selectedChoiceId) {
      throw new Error(`Missing answer for attempt question ${attemptQuestion.id}.`);
    }

    return {
      id: createId('answer'),
      attemptId: attempt.id,
      attemptQuestionId: attemptQuestion.id,
      userId: attempt.userId,
      selectedChoiceId,
      correct: selectedChoiceId === question.correctChoiceId,
      unanswered: selectedChoiceId === 'timeout',
      answeredAt: now,
    };
  });

  const scoredQuestionIds = new Set(attempt.questions.filter((question) => question.scoringRole === 'scored').map((question) => question.id));
  const scoredAnswers = answers.filter((answer) => scoredQuestionIds.has(answer.attemptQuestionId));
  const score = scoredAnswers.filter((answer) => answer.correct).length;
  const subjectBreakdown = attempt.questions.reduce<Record<string, { correct: number; total: number }>>((breakdown, attemptQuestion) => {
    if (attemptQuestion.scoringRole !== 'scored') return breakdown;
    const subject = breakdown[attemptQuestion.subjectId] ?? { correct: 0, total: 0 };
    subject.total += 1;
    if (answers.find((answer) => answer.attemptQuestionId === attemptQuestion.id)?.correct) subject.correct += 1;
    breakdown[attemptQuestion.subjectId] = subject;
    return breakdown;
  }, {});
  const completedAttempt: Attempt = {
    ...attempt,
    status: timedOut ? 'timed_out' : 'completed',
    completedAt: now,
    score,
    passed: attempt.passingScore !== undefined
      ? score >= attempt.passingScore
      : score / Math.max(scoredAnswers.length, 1) >= attempt.passThreshold,
    timedOut,
  };

  return { attempt: completedAttempt, answers, subjectBreakdown };
}
