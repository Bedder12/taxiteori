import {
  completeLessonFact,
  completedAttemptFact,
  createAttemptSnapshot,
  scoreAttempt,
  selectCheckpointQuestions,
  selectDisplayedQuestionsForBlueprint,
  selectSubjectCheckpointQuestions,
  type Answer,
  type Attempt,
  type UserProgressFact,
} from '../../packages/domain/src';
import { vilotiderRepository } from '../../packages/domain/src/vilotiderRepository';

const STORAGE_KEY = 'taxiteori.learning-state.v1';
export const DEMO_USER_ID = 'local-demo-user';

type LearningState = {
  facts: UserProgressFact[];
  attempts: Attempt[];
  answers: Answer[];
};

const initialState: LearningState = {
  facts: [],
  attempts: [],
  answers: [],
};

let memoryState: LearningState = initialState;

function canUseLocalStorage() {
  return typeof globalThis.localStorage !== 'undefined';
}

function readState(): LearningState {
  if (!canUseLocalStorage()) {
    return memoryState;
  }

  const raw = globalThis.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    return JSON.parse(raw) as LearningState;
  } catch {
    return initialState;
  }
}

function writeState(state: LearningState) {
  memoryState = state;
  if (canUseLocalStorage()) {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function getLearningSnapshot() {
  return {
    repository: vilotiderRepository,
    state: readState(),
  };
}

export function resetLearningStateForTests() {
  writeState(initialState);
}

export function completeLesson(userId: string, lessonId: string) {
  const state = readState();
  const alreadyCompleted = state.facts.some((fact) => fact.type === 'lesson_completed' && fact.userId === userId && fact.lessonId === lessonId);

  if (alreadyCompleted) {
    return state;
  }

  const nextState = {
    ...state,
    facts: [...state.facts, completeLessonFact(userId, lessonId)],
  };
  writeState(nextState);
  return nextState;
}

export function startCheckpointAttempt(userId: string, assessmentId: string) {
  const assessment = vilotiderRepository.assessments.find((candidate) => candidate.id === assessmentId);
  if (!assessment?.subjectId) {
    throw new Error(`Assessment ${assessmentId} is not configured for a checkpoint.`);
  }

  const selectedQuestions = assessment.topicId
    ? selectCheckpointQuestions(
        assessment.id,
        assessment.subjectId,
        assessment.topicId,
        assessment.questionCount,
        vilotiderRepository.questionVersions,
      )
    : selectSubjectCheckpointQuestions(
        assessment.id,
        assessment.subjectId,
        assessment.questionCount,
        vilotiderRepository.questionVersions,
      );
  const attempt = createAttemptSnapshot({
    userId,
    assessmentId: assessment.id,
    type: assessment.type,
    selectedQuestions,
    passThreshold: assessment.passThreshold,
  });
  const state = readState();
  const nextState = {
    ...state,
    attempts: [...state.attempts, attempt],
  };
  writeState(nextState);
  return attempt;
}

export function startMockAttempt(userId: string, blueprintId: string) {
  const blueprint = vilotiderRepository.examBlueprints.find((candidate) => candidate.id === blueprintId);
  if (!blueprint || blueprint.type !== 'mock_exam') {
    throw new Error(`Mock blueprint ${blueprintId} was not found.`);
  }

  const selectedQuestions = selectDisplayedQuestionsForBlueprint(blueprint, vilotiderRepository.questionVersions, {
    seed: `${blueprint.id}:${Date.now()}`,
  });
  if (selectedQuestions.length !== blueprint.totalDisplayedQuestionCount) {
    throw new Error(`Mock blueprint ${blueprintId} could not select its full question set.`);
  }

  const attempt = createAttemptSnapshot({
    userId,
    assessmentId: blueprint.id,
    type: 'mock_exam',
    selectedQuestions,
    passThreshold: blueprint.passThreshold,
    passingScore: blueprint.passingScore,
    blueprintVersion: blueprint.version,
    timeLimitSeconds: blueprint.timeLimitSeconds,
  });
  const state = readState();
  writeState({ ...state, attempts: [...state.attempts, attempt] });
  return attempt;
}

export function submitAttempt(attemptId: string, selectedChoicesByAttemptQuestionId: Record<string, string>, timedOut = false) {
  const state = readState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  if (!attempt) {
    throw new Error(`Attempt ${attemptId} was not found.`);
  }

  const result = scoreAttempt(attempt, vilotiderRepository.questionVersions, selectedChoicesByAttemptQuestionId, new Date().toISOString(), timedOut);
  const nextState = {
    ...state,
    attempts: state.attempts.map((candidate) => (candidate.id === attemptId ? result.attempt : candidate)),
    answers: [...state.answers, ...result.answers],
    facts: [...state.facts, completedAttemptFact(result.attempt)],
  };
  writeState(nextState);
  return result;
}
