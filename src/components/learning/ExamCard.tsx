import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppCard, ProgressBar } from '@/components/ui/foundation';
import { Spacing } from '@/constants/theme';
import type { Exam, Subject } from '../../../packages/domain/src';

type ExamCardProps = {
  exam: Exam;
  subjects: Subject[];
  completedSubjects: number;
};

export function ExamCard({ completedSubjects, exam, subjects }: ExamCardProps) {
  const progress = subjects.length ? Math.round((completedSubjects / subjects.length) * 100) : 0;
  return (
    <AppCard>
      <View style={styles.heading}>
        <ThemedText type="subtitle">{exam.title}</ThemedText>
        <ThemedText type="smallBold" themeColor="primary">{completedSubjects}/{subjects.length}</ThemedText>
      </View>
      <ProgressBar value={progress} />
      <ThemedText themeColor="textSecondary">{completedSubjects} av {subjects.length} ämnen klara</ThemedText>
      <View style={styles.preview}>
        {subjects.slice(0, 3).map((subject) => (
          <ThemedText key={subject.id} type="small" themeColor="textSecondary">
            {subject.title}
          </ThemedText>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  preview: {
    gap: Spacing.one,
  },
});
