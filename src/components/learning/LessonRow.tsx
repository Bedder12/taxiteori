import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppCard } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { Lesson } from '../../../packages/domain/src';

type LessonRowProps = {
  completed: boolean;
  current: boolean;
  index: number;
  lesson: Lesson;
};

export function LessonRow({ completed, current, index, lesson }: LessonRowProps) {
  return (
    <AppCard style={[styles.row, current && styles.current]}>
      <View style={[styles.marker, completed && styles.markerDone, current && styles.markerCurrent]}>
        <ThemedText type="smallBold" style={completed || current ? styles.markerTextActive : styles.markerText}>
          {completed ? 'OK' : current ? String(index + 1) : String(index + 1)}
        </ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText type="smallBold" themeColor="primary">Moment {index + 1}</ThemedText>
        <ThemedText style={styles.title}>{lesson.title}</ThemedText>
        {lesson.estimatedStudyTimeMinutes !== undefined ? (
          <ThemedText type="small" themeColor="textSecondary">{lesson.estimatedStudyTimeMinutes} min</ThemedText>
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.four,
  },
  current: {
    borderColor: Colors.light.primary,
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surfaceMuted,
    marginTop: Spacing.one,
  },
  markerCurrent: {
    backgroundColor: Colors.light.primarySoft,
  },
  markerDone: {
    backgroundColor: Colors.light.primary,
  },
  markerText: {
    color: Colors.light.textSecondary,
  },
  markerTextActive: {
    color: Colors.light.primaryStrong,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    flexShrink: 1,
  },
});
