import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Lesson } from '../../../packages/domain/src';

type LessonRowProps = {
  completed: boolean;
  current: boolean;
  index: number;
  lesson: Lesson;
};

export function LessonRow({ completed, current, index, lesson }: LessonRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.marker}>
        <ThemedText type="smallBold">{completed ? '✓' : current ? '→' : '○'}</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText type="smallBold">Moment {index + 1}</ThemedText>
        <ThemedText style={styles.title}>{lesson.title}</ThemedText>
        {lesson.estimatedStudyTimeMinutes !== undefined && (
          <ThemedText type="small" themeColor="textSecondary">{lesson.estimatedStudyTimeMinutes} min</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  marker: {
    width: 28,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    flexShrink: 1,
  },
});
