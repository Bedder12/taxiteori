import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ThemedText } from '@/components/themed-text';
import { AppHeader, StatPill } from '@/components/ui/foundation';
import { Spacing } from '@/constants/theme';
import { getRemainingRuntimeSeconds, getRuntimeState, saveRuntimeAnswer, startRuntimeMock, submitRuntimeAttempt } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../../packages/domain/src/runtimeRepository';

export default function MockExamScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const [repository, setRepository] = useState(getRuntimeMetadataRepository());
  const [state, setState] = useState(getRuntimeState());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();
  const exam = repository.exams.find((candidate) => candidate.id === examId);
  const subjectIds = repository.subjects.filter((subject) => subject.examId === examId).map((subject) => subject.id);
  const blueprint = repository.examBlueprints.find((candidate) => candidate.examId === examId && candidate.type === 'mock_exam' && candidate.active);

  useEffect(() => {
    setLoading(true);
    void loadRuntimeRepository(subjectIds).then((loaded) => { setRepository(loaded); setState(getRuntimeState()); }).catch(setLoadError).finally(() => setLoading(false));
  }, [examId]);

  const attempt = useMemo(() => (!loading && blueprint ? startRuntimeMock(repository, blueprint.id) : undefined), [loading, blueprint?.id, repository]);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstUnanswered = attempt?.questions.findIndex((question) => !state.answers.some((answer) => answer.attemptQuestionId === question.id)) ?? 0;
    return firstUnanswered < 0 ? 0 : firstUnanswered;
  });
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() => Object.fromEntries(
    state.answers.filter((answer) => answer.attemptId === attempt?.id).map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId]),
  ));
  const [remainingSeconds, setRemainingSeconds] = useState(() => attempt ? getRemainingRuntimeSeconds(attempt) ?? 0 : 0);

  useEffect(() => {
    if (!attempt) return;
    const firstUnanswered = attempt.questions.findIndex((question) => !state.answers.some((answer) => answer.attemptQuestionId === question.id));
    setCurrentIndex(firstUnanswered < 0 ? 0 : firstUnanswered);
    setSelectedChoices(Object.fromEntries(state.answers.filter((answer) => answer.attemptId === attempt.id).map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId])));
    setRemainingSeconds(getRemainingRuntimeSeconds(attempt) ?? 0);
  }, [attempt?.id]);

  useEffect(() => {
    if (!attempt || !blueprint) return undefined;
    const timer = setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt, blueprint]);

  useEffect(() => {
    if (!attempt || remainingSeconds !== 0) return;
    const timeoutChoices = Object.fromEntries(attempt.questions.map((question) => [question.id, selectedChoices[question.id] ?? 'timeout']));
    submitRuntimeAttempt(repository, attempt.id, timeoutChoices, true);
    router.replace({ pathname: '/result/[attemptId]', params: { attemptId: attempt.id } } as unknown as Href);
  }, [attempt, remainingSeconds, selectedChoices]);

  if (loadError) return <ThemedText>Provet kunde inte laddas. Försök igen.</ThemedText>;
  if (loading) return <ThemedText>Laddar prov...</ThemedText>;
  if (!exam || !blueprint || !attempt) {
    return <ThemedText>Övningsprovet hittades inte.</ThemedText>;
  }

  const attemptQuestion = attempt.questions[currentIndex];
  const question = repository.questionVersions.find((candidate) => candidate.id === attemptQuestion?.questionVersionId);
  const selectedChoiceId = attemptQuestion ? selectedChoices[attemptQuestion.id] : undefined;
  const isLastQuestion = currentIndex === attempt.questions.length - 1;
  const answeredCount = Object.keys(selectedChoices).length;
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

  function finish() {
    if (!attempt) return;
    const result = submitRuntimeAttempt(repository, attempt.id, selectedChoices);
    router.replace({ pathname: '/result/[attemptId]', params: { attemptId: result.attempt.id } } as unknown as Href);
  }

  function handleNext() {
    if (!attemptQuestion || !selectedChoiceId) return;
    if (isLastQuestion) {
      finish();
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Internt realistiskt övningsprov"
          title={exam.title}
          meta={`Fråga ${currentIndex + 1} av ${attempt.questions.length}`}
        />
      }>
      <View style={styles.stats}>
        <StatPill label="Tid kvar" value={`${minutes}:${seconds}`} tone={remainingSeconds < 300 ? 'warning' : 'default'} />
        <StatPill label="Besvarade" value={`${answeredCount}/${attempt.questions.length}`} />
      </View>

      {question && attemptQuestion ? (
        <QuestionCard
          attemptQuestion={attemptQuestion}
          question={question}
          totalQuestions={attempt.questions.length}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={(choiceId) => {
            saveRuntimeAnswer(repository, attempt.id, attemptQuestion.id, choiceId);
            setSelectedChoices((current) => ({ ...current, [attemptQuestion.id]: choiceId }));
          }}
        />
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton disabled={!selectedChoiceId} onPress={handleNext}>
          {isLastQuestion ? 'Lämna in provet' : 'Nästa fråga'}
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
});
