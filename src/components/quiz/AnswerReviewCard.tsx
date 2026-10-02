import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppCard } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { getAttemptReview } from '@/features/quiz/selectors';

type ReviewItem = ReturnType<typeof getAttemptReview>[number];

export function AnswerReviewCard({ item }: { item: ReviewItem }) {
  const correct = Boolean(item.answer?.correct);
  return (
    <AppCard muted style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.badge, correct ? styles.badgeCorrect : styles.badgeWrong]}>
          <ThemedText type="smallBold" style={styles.badgeText}>{correct ? 'OK' : 'Fel'}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {item.attemptQuestion.stableKey} v{item.attemptQuestion.version}
        </ThemedText>
      </View>
      <ThemedText>{item.question?.prompt}</ThemedText>
      <ThemedText themeColor="textSecondary">Ditt svar: {item.selectedChoice?.text ?? 'Inget svar'}</ThemedText>
      {!correct ? <ThemedText>Rätt svar: {item.correctChoice?.text}</ThemedText> : null}
      <ThemedText>{item.question?.explanation}</ThemedText>
      {item.lesson ? <ThemedText type="small" themeColor="textSecondary">Repetera: {item.lesson.title}</ThemedText> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    alignItems: 'center',
  },
  badge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  badgeCorrect: {
    backgroundColor: Colors.light.primary,
  },
  badgeWrong: {
    backgroundColor: Colors.light.danger,
  },
  badgeText: {
    color: '#FFFFFF',
  },
});
