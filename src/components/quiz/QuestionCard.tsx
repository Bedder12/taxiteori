import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { AttemptQuestion, QuestionVersion } from '../../../packages/domain/src';

type QuestionCardProps = {
  attemptQuestion: AttemptQuestion;
  question: QuestionVersion;
  totalQuestions?: number;
  selectedChoiceId?: string;
  onSelectChoice: (choiceId: string) => void;
};

export function QuestionCard({ attemptQuestion, onSelectChoice, question, selectedChoiceId, totalQuestions }: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="smallBold">
        Fråga {attemptQuestion.order}{totalQuestions ? ` av ${totalQuestions}` : ''} · {question.type}
      </ThemedText>
      <ThemedText>{question.prompt}</ThemedText>
      <View style={styles.choices}>
        {question.choices.map((choice) => {
          const selected = selectedChoiceId === choice.id;
          return (
            <Pressable
              key={choice.id}
              onPress={() => onSelectChoice(choice.id)}
              style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && styles.pressed]}>
              <View style={styles.choiceContent}>
                <ThemedText type="smallBold">{choice.id}</ThemedText>
                <ThemedText style={styles.choiceText}>{choice.text}</ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF3EA',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  choices: {
    gap: Spacing.two,
  },
  choice: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#D7E1D2',
  },
  choiceContent: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  choiceText: {
    flex: 1,
  },
  selected: {
    borderColor: '#176B49',
    backgroundColor: '#DDE8D8',
  },
  pressed: {
    opacity: 0.72,
  },
});
