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
  tone?: 'light' | 'dark';
};

export function QuestionCard({ attemptQuestion, onSelectChoice, question, selectedChoiceId, tone = 'light', totalQuestions }: QuestionCardProps) {
  const progress = totalQuestions ? (attemptQuestion.order / totalQuestions) * 100 : 0;
  const dark = tone === 'dark';
  return (
    <AppCard style={[styles.card, dark && styles.darkCard]}>
      {totalQuestions ? <ProgressBar tone={dark ? 'light' : 'primary'} value={progress} /> : null}
      <View style={styles.questionMeta}>
        <ThemedText type="smallBold" themeColor={dark ? undefined : 'primary'} style={dark && styles.darkMeta}>
          Fråga {attemptQuestion.order}{totalQuestions ? ` av ${totalQuestions}` : ''}
        </ThemedText>
        <ThemedText type="small" themeColor={dark ? undefined : 'textSecondary'} style={dark && styles.darkSecondary}>
          {question.difficulty}
        </ThemedText>
      </View>
      <ThemedText style={[styles.prompt, dark && styles.darkPrompt]}>{question.prompt}</ThemedText>
      <View style={styles.choices}>
        {question.choices.map((choice, index) => {
          const selected = selectedChoiceId === choice.id;
          return (
            <Pressable
              key={choice.id}
              onPress={() => onSelectChoice(choice.id)}
              style={({ pressed }) => [
                styles.choice,
                dark && styles.darkChoice,
                selected && styles.selected,
                dark && selected && styles.darkSelected,
                pressed && styles.pressed,
              ]}>
              <View style={[styles.choiceBadge, dark && styles.darkChoiceBadge, selected && styles.choiceBadgeSelected]}>
                <ThemedText type="smallBold" style={[styles.choiceBadgeText, dark && styles.darkChoiceBadgeText, selected && styles.choiceBadgeTextSelected]}>
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>
              <ThemedText style={[styles.choiceText, dark && styles.darkChoiceText]}>{choice.text}</ThemedText>
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
  darkCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    padding: 0,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  prompt: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 800,
  },
  darkPrompt: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
  },
  choices: {
    gap: Spacing.three,
  },
  choice: {
    backgroundColor: Colors.light.surface,
    borderRadius: 18,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
    minHeight: 68,
  },
  darkChoice: {
    backgroundColor: '#3C4658',
    borderColor: '#3C4658',
    paddingVertical: Spacing.three,
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
  darkChoiceBadge: {
    backgroundColor: '#2B3442',
  },
  choiceBadgeText: {
    color: Colors.light.textSecondary,
  },
  darkChoiceBadgeText: {
    color: '#DDE3EC',
  },
  choiceBadgeTextSelected: {
    color: '#FFFFFF',
  },
  choiceText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 600,
  },
  darkChoiceText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 31,
  },
  selected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySoft,
  },
  darkSelected: {
    backgroundColor: '#4C5B70',
    borderColor: Colors.light.primary,
  },
  darkMeta: {
    color: Colors.light.primary,
  },
  darkSecondary: {
    color: '#9CA3AF',
  },
  pressed: {
    opacity: 0.72,
  },
});
