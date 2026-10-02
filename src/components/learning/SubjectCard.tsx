import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppCard, ProgressBar, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { Subject } from '../../../packages/domain/src';

type SubjectCardProps = {
  disabled?: boolean;
  learningPercent: number;
  checkpointPassed: boolean;
  subject: Subject;
};

export function SubjectCard({ checkpointPassed, disabled, learningPercent, subject }: SubjectCardProps) {
  return (
    <AppCard style={disabled && styles.disabled}>
      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <ThemedText type="subtitle">{subject.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{subject.officialQuestionCount} frågor i provviktningen</ThemedText>
        </View>
        <View style={[styles.statusDot, checkpointPassed && styles.statusDone]} />
      </View>
      <ProgressBar value={learningPercent} />
      <View style={styles.stats}>
        <StatPill label="Inlärning" value={`${learningPercent}%`} tone={learningPercent === 100 ? 'success' : 'default'} />
        <StatPill label="Checkpoint" value={checkpointPassed ? 'Klar' : 'Ej klar'} tone={checkpointPassed ? 'success' : 'warning'} />
      </View>
      {disabled ? (
        <ThemedText type="small" themeColor="textSecondary">
          Kommer senare
        </ThemedText>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.58,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  titleWrap: {
    flex: 1,
    gap: Spacing.one,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.borderStrong,
    marginTop: Spacing.two,
  },
  statusDone: {
    backgroundColor: Colors.light.success,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
