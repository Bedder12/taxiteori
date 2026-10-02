import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { ContentBlock } from '../../../packages/domain/src';

type LessonBlockRendererProps = {
  block: ContentBlock;
};

export function LessonBlockRenderer({ block }: LessonBlockRendererProps) {
  if (block.type === 'heading') {
    return <ThemedText type="subtitle">{block.text}</ThemedText>;
  }

  if (block.type === 'paragraph') {
    return <ThemedText>{block.text}</ThemedText>;
  }

  if (block.type === 'bullet_list') {
    return (
      <View style={styles.list}>
        {block.items.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <ThemedText style={styles.bulletText}>{item}</ThemedText>
          </View>
        ))}
      </View>
    );
  }

  if (block.type === 'info' || block.type === 'warning' || block.type === 'example' || block.type === 'checkpoint') {
    const label = block.type === 'info' ? 'Kom ihåg' : block.type === 'warning' ? 'Viktigt' : block.type === 'example' ? 'Exempel' : 'Testa dig själv';
    return (
      <View style={[styles.callout, block.type === 'warning' && styles.warning, block.type === 'checkpoint' && styles.checkpoint]}>
        <ThemedText type="smallBold" themeColor={block.type === 'warning' ? 'warning' : 'primary'}>{label}</ThemedText>
        <ThemedText>{block.text}</ThemedText>
      </View>
    );
  }

  if (block.type === 'worked_example') {
    return (
      <View style={styles.workedExample}>
        <ThemedText type="smallBold" themeColor="primary">{block.title}</ThemedText>
        <View style={styles.timeline}>
          {block.timeline.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <ThemedText style={styles.bulletText} themeColor="textSecondary">{item}</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText>{block.reasoning}</ThemedText>
        <View style={styles.answer}>
          <ThemedText type="smallBold">Svar</ThemedText>
          <ThemedText>{block.finalAnswer}</ThemedText>
        </View>
      </View>
    );
  }

  if (block.type === 'checkpoint_ref') {
    return <ThemedText themeColor="textSecondary">Checkpoint finns efter sista momentet.</ThemedText>;
  }

  return <ThemedText themeColor="textSecondary">Media visas här i en senare version.</ThemedText>;
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    marginTop: 9,
  },
  bulletText: {
    flex: 1,
  },
  callout: {
    backgroundColor: Colors.light.primarySoft,
    borderRadius: Radii.large,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  warning: {
    backgroundColor: '#FFF2DF',
  },
  checkpoint: {
    backgroundColor: Colors.light.surfaceMuted,
  },
  workedExample: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timeline: {
    gap: Spacing.two,
  },
  answer: {
    backgroundColor: Colors.light.primarySoft,
    borderRadius: Radii.medium,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
