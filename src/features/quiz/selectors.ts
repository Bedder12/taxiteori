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
