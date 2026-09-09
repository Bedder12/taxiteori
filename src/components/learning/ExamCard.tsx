import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Exam, Subject } from '../../../packages/domain/src';

type ExamCardProps = {
  exam: Exam;
  subjects: Subject[];
  completedSubjects: number;
};

export function ExamCard({ completedSubjects, exam, subjects }: ExamCardProps) {
  return (
    <View style={styles.card}>
      <ThemedText type="subtitle">{exam.title}</ThemedText>
      <ThemedText themeColor="textSecondary">
        {completedSubjects}/{subjects.length} ämnen klara
      </ThemedText>
      <View style={styles.preview}>
        {subjects.slice(0, 3).map((subject) => (
          <ThemedText key={subject.id} type="small" themeColor="textSecondary">
            {subject.title}
          </ThemedText>
        ))}
      </View>
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
  preview: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
});
