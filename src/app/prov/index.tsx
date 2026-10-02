import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, BottomNav, Section, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getRuntimeMetadataRepository } from '../../../packages/domain/src/runtimeRepository';

export default function ProvScreen() {
  const repository = getRuntimeMetadataRepository();
  const exams = repository.exams.filter((exam) => exam.status === 'published').sort((left, right) => left.order - right.order);

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Prov"
          title="Övningsprov"
          description="Starta realistiska interna prov med frysta frågor och separat resultatuppföljning."
        />
      }>
      <Section>
        {exams.map((exam) => {
          const blueprint = repository.examBlueprints.find((candidate) => candidate.examId === exam.id && candidate.type === 'mock_exam' && candidate.active);
          if (!blueprint) return null;
          return (
            <Link key={exam.id} href={{ pathname: '/exam/[examId]/mock', params: { examId: exam.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
                <View style={styles.cardTop}>
                  <ThemedText type="subtitle">{exam.title}</ThemedText>
                  <View style={styles.startBadge}>
                    <ThemedText type="smallBold" style={styles.startText}>Starta</ThemedText>
                  </View>
                </View>
                <View style={styles.stats}>
                  <StatPill label="Frågor" value={String(blueprint.totalDisplayedQuestionCount)} />
                  <StatPill label="Tid" value="50 min" />
                </View>
                <ThemedText themeColor="textSecondary">Fullständigt övningsprov med samma sparade försök- och resultatflöde som checkpoints.</ThemedText>
              </Pressable>
            </Link>
          );
        })}
      </Section>

      <AppCard muted>
        <ThemedText themeColor="textSecondary">Provresultat och ämnesfördelning sparas separat från lektionsprogress och checkpoints.</ThemedText>
      </AppCard>

      <BottomNav active="exam" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  startBadge: {
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primarySoft,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  startText: {
    color: Colors.light.primaryStrong,
  },
  pressed: {
    opacity: 0.72,
  },
});
