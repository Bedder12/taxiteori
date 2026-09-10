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
import { SupabaseLearningPersistence } from './supabaseLearningPersistence';
import { supabase } from './supabaseClient';

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
const backendPersistence = supabase ? new SupabaseLearningPersistence(supabase) : null;
let lastPersistenceError: Error | undefined;

export function getLastPersistenceError() {
  return lastPersistenceError;
}

function persist(task: () => Promise<void>) {
  if (!backendPersistence) return;
  void task().catch((error) => {
    lastPersistenceError = error instanceof Error ? error : new Error('Learning state persistence failed.');
  });
}

function questionSnapshots(attempt: Attempt) {
  return attempt.questions.map((attemptQuestion) => vilotiderRepository.questionVersions.find((question) => question.id === attemptQuestion.questionVersionId) ?? {});
}

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

export function getRemainingTimeSeconds(attempt: Attempt, now = Date.now()) {
  if (!attempt.timeLimitSeconds) return undefined;
  const elapsedSeconds = Math.floor((now - Date.parse(attempt.startedAt)) / 1000);
  return Math.max(attempt.timeLimitSeconds - elapsedSeconds, 0);
}

function finalizeTimedOutAttempt(attempt: Attempt) {
  const state = readState();
  const choices = Object.fromEntries(
    state.answers
      .filter((answer) => answer.attemptId === attempt.id)
      .map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId]),
  );
  const result = scoreAttempt(attempt, vilotiderRepository.questionVersions, Object.fromEntries(attempt.questions.map((question) => [question.id, choices[question.id] ?? 'timeout'])), new Date().toISOString(), true);
  writeState({
    ...state,
    attempts: state.attempts.map((candidate) => candidate.id === attempt.id ? result.attempt : candidate),
    answers: [...state.answers, ...result.answers.filter((answer) => !state.answers.some((existing) => existing.attemptQuestionId === answer.attemptQuestionId))],
    facts: [...state.facts, completedAttemptFact(result.attempt)],
  });
  persist(async () => {
    await backendPersistence!.saveAttempt(result.attempt, questionSnapshots(result.attempt));
    for (const answer of result.answers) await backendPersistence!.saveAnswer(result.attempt, answer);
  });
  return result.attempt;
}

function findActiveAttempt(userId: string, assessmentId: string) {
  const attempt = readState().attempts.find((candidate) => candidate.userId === userId && candidate.assessmentId === assessmentId && candidate.status === 'in_progress');
  if (!attempt) return undefined;
  if (getRemainingTimeSeconds(attempt) === 0) return finalizeTimedOutAttempt(attempt);
  return attempt;
}

export function getLearningSnapshot() {
  return {
    repository: vilotiderRepository,
    state: readState(),
  };
}

export async function hydrateLearningState() {
  if (!backendPersistence) return getLearningSnapshot();
  try {
    const remote = await backendPersistence.loadState();
    const attempts: Attempt[] = remote.attempts.map((row) => {
      const attemptId = String(row.client_attempt_id ?? row.id);
      const questions = ((row.attempt_questions ?? []) as Record<string, unknown>[]).map((question, index) => ({
        id: String(question.client_attempt_question_id ?? question.id),
        attemptId,
        questionVersionId: String(question.question_key ?? question.question_version_id),
        questionId: String(question.question_key ?? question.question_id),
        stableKey: String(question.stable_key),
        version: Number(question.version),
        order: Number(question.display_order ?? index + 1),
        subjectId: String(question.subject_key ?? question.subject_id ?? ''),
        scoringRole: (question.scoring_role ?? 'scored') as Attempt['questions'][number]['scoringRole'],
      }));
      return {
        id: attemptId,
        userId: DEMO_USER_ID,
        assessmentId: String(row.assessment_key ?? row.blueprint_key),
        type: row.type as Attempt['type'],
        startedAt: String(row.started_at),
        completedAt: row.completed_at ? String(row.completed_at) : undefined,
        status: row.status as Attempt['status'],
        score: row.score === null ? undefined : Number(row.score),
        totalQuestions: Number(row.total_questions),
        scoringQuestionCount: questions.filter((question) => question.scoringRole === 'scored').length,
        passThreshold: Number(row.pass_threshold),
        passingScore: row.passing_score === null ? undefined : Number(row.passing_score),
        blueprintVersion: row.blueprint_version === null ? undefined : Number(row.blueprint_version),
        timeLimitSeconds: row.time_limit_seconds === null ? undefined : Number(row.time_limit_seconds),
        timedOut: Boolean(row.timed_out),
        passed: row.passed === null ? undefined : Boolean(row.passed),
        questions,
      };
    });
    const answers: Answer[] = remote.attempts.flatMap((row) => ((row.answers ?? []) as Record<string, unknown>[]).map((answer) => ({
      id: String(answer.id ?? `${row.client_attempt_id}:${answer.client_attempt_question_id}`),
      attemptId: String(row.client_attempt_id ?? row.id),
      attemptQuestionId: String(answer.client_attempt_question_id ?? answer.attempt_question_id),
      userId: DEMO_USER_ID,
      selectedChoiceId: String(answer.selected_choice_id),
      correct: Boolean(answer.correct),
      unanswered: Boolean(answer.unanswered),
      answeredAt: String(answer.answered_at),
    })));
    const facts: UserProgressFact[] = remote.lessons.map((lesson) => ({ type: 'lesson_completed', userId: DEMO_USER_ID, lessonId: String(lesson.lesson_key), completedAt: String(lesson.completed_at) }));
    for (const attempt of attempts.filter((candidate) => ['completed', 'timed_out'].includes(candidate.status) && candidate.passed !== undefined && candidate.completedAt)) {
      facts.push(completedAttemptFact(attempt));
    }
    writeState({ facts, attempts, answers });
    return getLearningSnapshot();
  } catch (error) {
    lastPersistenceError = error instanceof Error ? error : new Error('Learning state hydration failed.');
    throw lastPersistenceError;
  }
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
  persist(() => backendPersistence!.completeLesson(lessonId, new Date().toISOString()));
  return nextState;
}

export function startCheckpointAttempt(userId: string, assessmentId: string) {
  const assessment = vilotiderRepository.assessments.find((candidate) => candidate.id === assessmentId);
  if (!assessment?.subjectId) {
    throw new Error(`Assessment ${assessmentId} is not configured for a checkpoint.`);
  }

  const activeAttempt = findActiveAttempt(userId, assessment.id);
  if (activeAttempt) return activeAttempt;

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
  persist(() => backendPersistence!.saveAttempt(attempt, questionSnapshots(attempt)));
  return attempt;
}

export function startMockAttempt(userId: string, blueprintId: string) {
  const blueprint = vilotiderRepository.examBlueprints.find((candidate) => candidate.id === blueprintId);
  if (!blueprint || blueprint.type !== 'mock_exam') {
    throw new Error(`Mock blueprint ${blueprintId} was not found.`);
  }

  const activeAttempt = findActiveAttempt(userId, blueprint.id);
  if (activeAttempt) return activeAttempt;

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
  persist(() => backendPersistence!.saveAttempt(attempt, questionSnapshots(attempt)));
  return attempt;
}

export function saveAttemptAnswer(attemptId: string, attemptQuestionId: string, selectedChoiceId: string) {
  const state = readState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  if (!attempt || attempt.status !== 'in_progress') throw new Error(`Attempt ${attemptId} is not active.`);
  const attemptQuestion = attempt.questions.find((candidate) => candidate.id === attemptQuestionId);
  const question = vilotiderRepository.questionVersions.find((candidate) => candidate.id === attemptQuestion?.questionVersionId);
  if (!attemptQuestion || !question) throw new Error(`Attempt question ${attemptQuestionId} was not found.`);
  const answer: Answer = {
    id: state.answers.find((candidate) => candidate.attemptQuestionId === attemptQuestionId)?.id ?? `answer_${attemptId}_${attemptQuestionId}`,
    attemptId,
    attemptQuestionId,
    userId: attempt.userId,
    selectedChoiceId,
    correct: selectedChoiceId === question.correctChoiceId,
    answeredAt: new Date().toISOString(),
  };
  writeState({
    ...state,
    answers: [...state.answers.filter((candidate) => candidate.attemptQuestionId !== attemptQuestionId), answer],
  });
  persist(() => backendPersistence!.saveAnswer(attempt, answer));
  return answer;
}

export function submitAttempt(attemptId: string, selectedChoicesByAttemptQuestionId: Record<string, string>, timedOut = false) {
  const state = readState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  if (!attempt) {
    throw new Error(`Attempt ${attemptId} was not found.`);
  }

  if (attempt.status !== 'in_progress') {
    return { attempt, answers: state.answers.filter((answer) => answer.attemptId === attemptId), subjectBreakdown: {} };
  }

  const persistedChoices = Object.fromEntries(
    state.answers.filter((answer) => answer.attemptId === attemptId).map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId]),
  );
  const choices = Object.fromEntries(attempt.questions.map((question) => [
    question.id,
    selectedChoicesByAttemptQuestionId[question.id] ?? persistedChoices[question.id] ?? (timedOut ? 'timeout' : undefined),
  ]));
  if (Object.values(choices).some((choice) => !choice)) throw new Error('Missing answer for active attempt.');

  const result = scoreAttempt(attempt, vilotiderRepository.questionVersions, choices as Record<string, string>, new Date().toISOString(), timedOut);
  const nextState = {
    ...state,
    attempts: state.attempts.map((candidate) => (candidate.id === attemptId ? result.attempt : candidate)),
    answers: [...state.answers.filter((answer) => !result.answers.some((nextAnswer) => nextAnswer.attemptQuestionId === answer.attemptQuestionId)), ...result.answers],
    facts: [...state.facts, completedAttemptFact(result.attempt)],
  };
  writeState(nextState);
  persist(async () => {
    await backendPersistence!.saveAttempt(result.attempt, questionSnapshots(result.attempt));
    for (const answer of result.answers) await backendPersistence!.saveAnswer(result.attempt, answer);
  });
  return result;
}
