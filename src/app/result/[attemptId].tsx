import { Link, type Href, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { AnswerReviewCard } from '@/components/quiz/AnswerReviewCard';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getAttemptReview } from '@/features/quiz/selectors';
import { getLearningSnapshot } from '@/lib/learningStore';

export default function ResultScreen() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const { repository, state } = getLearningSnapshot();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);

  if (!attempt) {
    return <ThemedText>Resultatet hittades inte.</ThemedText>;
  }

  const review = getAttemptReview(repository, attempt, state.answers);
  const incorrect = review.filter((item) => !item.answer?.correct);
  const correctCount = review.length - incorrect.length;
  const assessment = repository.assessments.find((candidate) => candidate.id === attempt.assessmentId);
  const topicId = assessment?.topicId ?? 'topic_d2_taxi_vilotider';
  const percentage = Math.round((correctCount / Math.max(review.length, 1)) * 100);

  return (
    <Screen
      header={
        <>
          <ThemedText type="small" themeColor="textSecondary">Intern lärandecheckpoint</ThemedText>
          <ThemedText type="title">{attempt.passed ? 'Checkpoint klar' : 'Repetera och försök igen'}</ThemedText>
          <ThemedText>
            {correctCount}/{attempt.totalQuestions} rätt · {percentage}% · krav {Math.round(attempt.passThreshold * 100)}%
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Detta är en intern övningscheckpoint, inte ett officiellt Trafikverket-prov.
          </ThemedText>
        </>
      }>
      <View style={styles.summary}>
        <ThemedText type="subtitle">Resultat</ThemedText>
        <ThemedText>Rätt svar: {correctCount}</ThemedText>
        <ThemedText>Fel svar: {incorrect.length}</ThemedText>
        <ThemedText themeColor="textSecondary">Frågversionerna frystes när försöket startade.</ThemedText>
      </View>

      <View style={styles.review}>
        <ThemedText type="subtitle">Gå igenom misstag</ThemedText>
        {incorrect.length === 0 ? (
          <ThemedText themeColor="textSecondary">Inga fel att repetera den här gången.</ThemedText>
        ) : (
          incorrect.map((item) => <AnswerReviewCard key={item.attemptQuestion.id} item={item} />)
        )}
      </View>

      <Link href={{ pathname: '/topic/[topicId]', params: { topicId } } as unknown as Href} asChild>
        <PrimaryButton>Tillbaka till Vilotider</PrimaryButton>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  review: {
    gap: Spacing.two,
  },
});
