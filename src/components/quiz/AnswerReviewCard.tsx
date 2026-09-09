import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { getAttemptReview } from '@/features/quiz/selectors';

type ReviewItem = ReturnType<typeof getAttemptReview>[number];

export function AnswerReviewCard({ item }: { item: ReviewItem }) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold">
        {item.answer?.correct ? '✓ Rätt' : '× Fel'} · {item.attemptQuestion.stableKey} v{item.attemptQuestion.version}
      </ThemedText>
      <ThemedText>{item.question?.prompt}</ThemedText>
      <ThemedText themeColor="textSecondary">Ditt svar: {item.selectedChoice?.text ?? 'Inget svar'}</ThemedText>
      {!item.answer?.correct && <ThemedText>Rätt svar: {item.correctChoice?.text}</ThemedText>}
      <ThemedText>{item.question?.explanation}</ThemedText>
      {item.lesson && <ThemedText type="small" themeColor="textSecondary">Repetera: {item.lesson.title}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF3EA',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
