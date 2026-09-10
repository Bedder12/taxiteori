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
  type LearningRepository,
  type UserProgressFact,
} from '../../packages/domain/src';
import { SupabaseLearningPersistence } from './supabaseLearningPersistence';
import { supabase } from './supabaseClient';
import { setPersistenceError } from './persistenceStatus';

export const RUNTIME_USER_ID = 'local-demo-user';
const STORAGE_KEY = 'taxiteori.learning-state.v1';
type RuntimeState = { facts: UserProgressFact[]; attempts: Attempt[]; answers: Answer[] };
const emptyState: RuntimeState = { facts: [], attempts: [], answers: [] };
let memoryState = emptyState;
const backend = supabase ? new SupabaseLearningPersistence(supabase) : null;
let persistenceError: Error | undefined;

export function getRuntimePersistenceError() { return persistenceError; }

function readState(): RuntimeState {
  if (typeof globalThis.localStorage === 'undefined') return memoryState;
  const raw = globalThis.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState;
  try { return JSON.parse(raw) as RuntimeState; } catch { return emptyState; }
}

function writeState(state: RuntimeState) {
  memoryState = state;
  if (typeof globalThis.localStorage !== 'undefined') globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function persist(task: () => Promise<void>) {
  if (!backend) return;
  void task().catch((error) => { persistenceError = error instanceof Error ? error : new Error('Learning state persistence failed.'); setPersistenceError(error); });
}

function snapshots(repository: LearningRepository, attempt: Attempt) {
  return attempt.questions.map((attemptQuestion) => repository.questionVersions.find((question) => question.id === attemptQuestion.questionVersionId) ?? {});
}

export function getRuntimeState() { return readState(); }

export async function hydrateRuntimeState() {
  if (!backend) return readState();
  try {
    const remote = await backend.loadState();
    const attempts: Attempt[] = remote.attempts.map((row) => {
      const id = String(row.client_attempt_id ?? row.id);
      const questions = ((row.attempt_questions ?? []) as Record<string, unknown>[]).map((question, index) => ({ id: String(question.client_attempt_question_id ?? question.id), attemptId: id, questionVersionId: String(question.question_key ?? question.question_version_id), questionId: String(question.question_key ?? question.question_id), stableKey: String(question.stable_key), version: Number(question.version), order: Number(question.display_order ?? index + 1), subjectId: String(question.subject_key ?? question.subject_id ?? ''), scoringRole: (question.scoring_role ?? 'scored') as Attempt['questions'][number]['scoringRole'] }));
      return { id, userId: RUNTIME_USER_ID, assessmentId: String(row.assessment_key ?? row.blueprint_key), type: row.type as Attempt['type'], startedAt: String(row.started_at), completedAt: row.completed_at ? String(row.completed_at) : undefined, status: row.status as Attempt['status'], score: row.score === null ? undefined : Number(row.score), totalQuestions: Number(row.total_questions), scoringQuestionCount: questions.filter((question) => question.scoringRole === 'scored').length, passThreshold: Number(row.pass_threshold), passingScore: row.passing_score === null ? undefined : Number(row.passing_score), blueprintVersion: row.blueprint_version === null ? undefined : Number(row.blueprint_version), timeLimitSeconds: row.time_limit_seconds === null ? undefined : Number(row.time_limit_seconds), timedOut: Boolean(row.timed_out), passed: row.passed === null ? undefined : Boolean(row.passed), questions };
    });
    const answers: Answer[] = remote.attempts.flatMap((row) => ((row.answers ?? []) as Record<string, unknown>[]).map((answer) => ({ id: String(answer.id), attemptId: String(row.client_attempt_id ?? row.id), attemptQuestionId: String(answer.client_attempt_question_id ?? answer.attempt_question_id), userId: RUNTIME_USER_ID, selectedChoiceId: String(answer.selected_choice_id), correct: Boolean(answer.correct), unanswered: Boolean(answer.unanswered), answeredAt: String(answer.answered_at) })));
    const facts: UserProgressFact[] = remote.lessons.map((lesson) => ({ type: 'lesson_completed', userId: RUNTIME_USER_ID, lessonId: String(lesson.lesson_key), completedAt: String(lesson.completed_at) }));
    for (const attempt of attempts.filter((candidate) => ['completed', 'timed_out'].includes(candidate.status) && candidate.passed !== undefined && candidate.completedAt)) facts.push(completedAttemptFact(attempt));
    writeState({ facts, attempts, answers });
  } catch (error) { persistenceError = error instanceof Error ? error : new Error('Learning state hydration failed.'); setPersistenceError(error); }
  return readState();
}

export function completeRuntimeLesson(lessonId: string) {
  const state = readState();
  if (state.facts.some((fact) => fact.type === 'lesson_completed' && fact.userId === RUNTIME_USER_ID && fact.lessonId === lessonId)) return state;
  const next = { ...state, facts: [...state.facts, completeLessonFact(RUNTIME_USER_ID, lessonId)] };
  writeState(next);
  persist(() => backend!.completeLesson(lessonId, new Date().toISOString()));
  return next;
}

export function getRemainingRuntimeSeconds(attempt: Attempt, now = Date.now()) {
  if (!attempt.timeLimitSeconds) return undefined;
  return Math.max(attempt.timeLimitSeconds - Math.floor((now - Date.parse(attempt.startedAt)) / 1000), 0);
}

export function startRuntimeCheckpoint(repository: LearningRepository, assessmentId: string) {
  const assessment = repository.assessments.find((candidate) => candidate.id === assessmentId);
  if (!assessment?.subjectId) throw new Error(`Assessment ${assessmentId} is not configured.`);
  const state = readState();
  const active = state.attempts.find((attempt) => attempt.id === assessmentId || (attempt.userId === RUNTIME_USER_ID && attempt.assessmentId === assessmentId && attempt.status === 'in_progress'));
  if (active) return active;
  const selected = assessment.topicId ? selectCheckpointQuestions(assessment.id, assessment.subjectId, assessment.topicId, assessment.questionCount, repository.questionVersions) : selectSubjectCheckpointQuestions(assessment.id, assessment.subjectId, assessment.questionCount, repository.questionVersions);
  const attempt = createAttemptSnapshot({ userId: RUNTIME_USER_ID, assessmentId, type: assessment.type, selectedQuestions: selected, passThreshold: assessment.passThreshold });
  writeState({ ...state, attempts: [...state.attempts, attempt] });
  persist(() => backend!.saveAttempt(attempt, snapshots(repository, attempt)));
  return attempt;
}

export function startRuntimeMock(repository: LearningRepository, blueprintId: string) {
  const blueprint = repository.examBlueprints.find((candidate) => candidate.id === blueprintId);
  if (!blueprint) throw new Error(`Mock blueprint ${blueprintId} was not found.`);
  const state = readState();
  const active = state.attempts.find((attempt) => attempt.userId === RUNTIME_USER_ID && attempt.assessmentId === blueprintId && attempt.status === 'in_progress');
  if (active) return active;
  const selected = selectDisplayedQuestionsForBlueprint(blueprint, repository.questionVersions, { seed: `${blueprint.id}:${Date.now()}` });
  const attempt = createAttemptSnapshot({ userId: RUNTIME_USER_ID, assessmentId: blueprintId, type: 'mock_exam', selectedQuestions: selected, passThreshold: blueprint.passThreshold, passingScore: blueprint.passingScore, blueprintVersion: blueprint.version, timeLimitSeconds: blueprint.timeLimitSeconds });
  writeState({ ...state, attempts: [...state.attempts, attempt] });
  persist(() => backend!.saveAttempt(attempt, snapshots(repository, attempt)));
  return attempt;
}

export function saveRuntimeAnswer(repository: LearningRepository, attemptId: string, attemptQuestionId: string, selectedChoiceId: string) {
  const state = readState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  const attemptQuestion = attempt?.questions.find((question) => question.id === attemptQuestionId);
  const question = repository.questionVersions.find((candidate) => candidate.id === attemptQuestion?.questionVersionId);
  if (!attempt || !attemptQuestion || !question || attempt.status !== 'in_progress') throw new Error('Attempt question is not active.');
  const answer: Answer = { id: state.answers.find((candidate) => candidate.attemptQuestionId === attemptQuestionId)?.id ?? `answer_${attemptQuestionId}`, attemptId, attemptQuestionId, userId: RUNTIME_USER_ID, selectedChoiceId, correct: selectedChoiceId === question.correctChoiceId, answeredAt: new Date().toISOString() };
  writeState({ ...state, answers: [...state.answers.filter((candidate) => candidate.attemptQuestionId !== attemptQuestionId), answer] });
  persist(() => backend!.saveAnswer(attempt, answer));
  return answer;
}

export function submitRuntimeAttempt(repository: LearningRepository, attemptId: string, choices: Record<string, string>, timedOut = false) {
  const state = readState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  if (!attempt) throw new Error(`Attempt ${attemptId} was not found.`);
  if (attempt.status !== 'in_progress') return { attempt, answers: state.answers.filter((answer) => answer.attemptId === attemptId), subjectBreakdown: {} };
  const persisted = Object.fromEntries(state.answers.filter((answer) => answer.attemptId === attemptId).map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId]));
  const completeChoices = Object.fromEntries(attempt.questions.map((question) => [question.id, choices[question.id] ?? persisted[question.id] ?? (timedOut ? 'timeout' : undefined)]));
  if (Object.values(completeChoices).some((choice) => !choice)) throw new Error('Missing answer for active attempt.');
  const result = scoreAttempt(attempt, repository.questionVersions, completeChoices as Record<string, string>, new Date().toISOString(), timedOut);
  writeState({ ...state, attempts: state.attempts.map((candidate) => candidate.id === attemptId ? result.attempt : candidate), answers: [...state.answers.filter((answer) => !result.answers.some((next) => next.attemptQuestionId === answer.attemptQuestionId)), ...result.answers], facts: [...state.facts, completedAttemptFact(result.attempt)] });
  persist(async () => { await backend!.saveAttempt(result.attempt, snapshots(repository, result.attempt)); for (const answer of result.answers) await backend!.saveAnswer(result.attempt, answer); });
  return result;
}