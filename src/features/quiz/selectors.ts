import type { Answer, Attempt, LearningRepository } from '../../../packages/domain/src';

export function getAttemptReview(repository: LearningRepository, attempt: Attempt, answers: Answer[]) {
  const attemptAnswers = answers.filter((answer) => answer.attemptId === attempt.id);

  return attempt.questions.map((attemptQuestion) => {
    const question = repository.questionVersions.find((candidate) => candidate.id === attemptQuestion.questionVersionId);
    const answer = attemptAnswers.find((candidate) => candidate.attemptQuestionId === attemptQuestion.id);
    const selectedChoice = question?.choices.find((choice) => choice.id === answer?.selectedChoiceId);
    const correctChoice = question?.choices.find((choice) => choice.id === question.correctChoiceId);
    const lesson = question?.lessonId ? repository.lessons.find((candidate) => candidate.id === question.lessonId) : undefined;

    return {
      attemptQuestion,
      question,
      answer,
      selectedChoice,
      correctChoice,
      lesson,
    };
  });
}

export function getRevisitRecommendations(repository: LearningRepository, attempt: Attempt, answers: Answer[]) {
  const incorrect = getAttemptReview(repository, attempt, answers).filter((item) => item.attemptQuestion.scoringRole === 'scored' && !item.answer?.correct);
  const byLesson = new Map<string, { count: number; requirementKeys: Set<string> }>();

  for (const item of incorrect) {
    if (!item.question?.lessonId) continue;
    const current = byLesson.get(item.question.lessonId) ?? { count: 0, requirementKeys: new Set<string>() };
    current.count += 1;
    for (const key of item.question.requirementKeys ?? []) current.requirementKeys.add(key);
    byLesson.set(item.question.lessonId, current);
  }

  return [...byLesson.entries()]
    .map(([lessonId, details]) => {
      const lesson = repository.lessons.find((candidate) => candidate.id === lessonId);
      return {
        lessonId,
        title: lesson?.title ?? lessonId,
        weakRequirementKeys: [...details.requirementKeys],
        revisitReason: `Repetera detta moment eftersom ${details.count} av dina fel i provet var kopplade hit.`,
      };
    })
    .sort((left, right) => right.weakRequirementKeys.length - left.weakRequirementKeys.length || left.title.localeCompare(right.title));
}
