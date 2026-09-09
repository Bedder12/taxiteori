import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { DEMO_USER_ID, getLearningSnapshot, startCheckpointAttempt, submitAttempt } from '@/lib/learningStore';

export default function QuizScreen() {
  const { assessmentId } = useLocalSearchParams<{ assessmentId: string }>();
  const { repository } = getLearningSnapshot();
  const assessment = repository.assessments.find((candidate) => candidate.id === assessmentId);
  const attempt = useMemo(() => startCheckpointAttempt(DEMO_USER_ID, assessmentId), [assessmentId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  if (!assessment) {
    return <ThemedText>Checkpointen hittades inte.</ThemedText>;
  }

  const attemptQuestion = attempt.questions[currentIndex];
  const question = repository.questionVersions.find((candidate) => candidate.id === attemptQuestion?.questionVersionId);
  const answeredCount = Object.keys(selectedChoices).length;
  const selectedChoiceId = attemptQuestion ? selectedChoices[attemptQuestion.id] : undefined;
  const isLastQuestion = currentIndex === attempt.questions.length - 1;

  function handleNext() {
    if (!attemptQuestion || !selectedChoiceId) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const result = submitAttempt(attempt.id, selectedChoices);
    router.replace({ pathname: '/result/[attemptId]', params: { attemptId: result.attempt.id } } as unknown as Href);
  }

  return (
    <Screen
      header={
        <>
          <ThemedText type="small" themeColor="textSecondary">Intern lärandecheckpoint</ThemedText>
          <ThemedText type="title">{assessment.title}</ThemedText>
          <ThemedText themeColor="textSecondary">
            Fråga {currentIndex + 1} av {attempt.questions.length} · {answeredCount} besvarade
          </ThemedText>
        </>
      }>
      {question && attemptQuestion && (
        <QuestionCard
          attemptQuestion={attemptQuestion}
          question={question}
          totalQuestions={attempt.questions.length}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={(choiceId) =>
            setSelectedChoices((current) => ({
              ...current,
              [attemptQuestion.id]: choiceId,
            }))
          }
        />
      )}

      <View style={styles.actions}>
        <PrimaryButton disabled={!selectedChoiceId} onPress={handleNext}>
          {isLastQuestion ? 'Lämna in' : 'Nästa fråga'}
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
  },
});
