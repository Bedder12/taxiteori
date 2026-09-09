import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Subject } from '../../../packages/domain/src';

type SubjectCardProps = {
  disabled?: boolean;
  learningPercent: number;
  checkpointPassed: boolean;
  subject: Subject;
};

export function SubjectCard({ checkpointPassed, disabled, learningPercent, subject }: SubjectCardProps) {
  return (
    <View style={[styles.card, disabled && styles.disabled]}>
      <View style={styles.row}>
        <ThemedText type="subtitle" style={styles.title}>
          {subject.title}
        </ThemedText>
        <ThemedText type="small">{subject.officialQuestionCount} frågor</ThemedText>
      </View>
      <ThemedText themeColor="textSecondary">
        Inlärning {learningPercent}% · Checkpoint {checkpointPassed ? 'klar' : 'ej klar'}
      </ThemedText>
      {disabled && (
        <ThemedText type="small" themeColor="textSecondary">
          Kommer senare
        </ThemedText>
      )}
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
  disabled: {
    opacity: 0.58,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
});
