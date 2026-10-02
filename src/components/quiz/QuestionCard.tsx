import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppCard, ProgressBar } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { AttemptQuestion, QuestionVersion } from '../../../packages/domain/src';

type QuestionCardProps = {
  attemptQuestion: AttemptQuestion;
  question: QuestionVersion;
  totalQuestions?: number;
  selectedChoiceId?: string;
  onSelectChoice: (choiceId: string) => void;
};

export function QuestionCard({ attemptQuestion, onSelectChoice, question, selectedChoiceId, totalQuestions }: QuestionCardProps) {
  const progress = totalQuestions ? (attemptQuestion.order / totalQuestions) * 100 : 0;
  return (
    <AppCard style={styles.card}>
      {totalQuestions ? <ProgressBar value={progress} /> : null}
      <View style={styles.questionMeta}>
        <ThemedText type="smallBold" themeColor="primary">
          Fråga {attemptQuestion.order}{totalQuestions ? ` av ${totalQuestions}` : ''}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{question.difficulty}</ThemedText>
      </View>
      <ThemedText style={styles.prompt}>{question.prompt}</ThemedText>
      <View style={styles.choices}>
        {question.choices.map((choice, index) => {
          const selected = selectedChoiceId === choice.id;
          return (
            <Pressable
              key={choice.id}
              onPress={() => onSelectChoice(choice.id)}
              style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && styles.pressed]}>
              <View style={[styles.choiceBadge, selected && styles.choiceBadgeSelected]}>
                <ThemedText type="smallBold" style={[styles.choiceBadgeText, selected && styles.choiceBadgeTextSelected]}>
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>
              <ThemedText style={styles.choiceText}>{choice.text}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.four,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  prompt: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: 700,
  },
  choices: {
    gap: Spacing.three,
  },
  choice: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.medium,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  choiceBadge: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surfaceMuted,
  },
  choiceBadgeSelected: {
    backgroundColor: Colors.light.primary,
  },
  choiceBadgeText: {
    color: Colors.light.textSecondary,
  },
  choiceBadgeTextSelected: {
    color: '#FFFFFF',
  },
  choiceText: {
    flex: 1,
  },
  selected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySoft,
  },
  pressed: {
    opacity: 0.72,
  },
});
