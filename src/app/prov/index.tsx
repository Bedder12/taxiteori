import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppHeader, BottomNav, Section } from '@/components/ui/foundation';
import { LearningIllustration } from '@/components/ui/LearningIllustration';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getRuntimeMetadataRepository } from '../../../packages/domain/src/runtimeRepository';

const subjectIllustrations = ['safety', 'map', 'person', 'car', 'wheel', 'book'] as const;

export default function ProvScreen() {
  const repository = getRuntimeMetadataRepository();
  const exams = repository.exams.filter((exam) => exam.status === 'published').sort((left, right) => left.order - right.order);
  const practiceSubjects = repository.subjects
    .filter((subject) => repository.topics.some((topic) => topic.subjectId === subject.id))
    .sort((left, right) => left.order - right.order)
    .slice(0, 4);

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Testa dina kunskaper"
          title="Prov"
        />
      }>
      <Section>
        {exams.map((exam, index) => {
          const blueprint = repository.examBlueprints.find((candidate) => candidate.examId === exam.id && candidate.type === 'mock_exam' && candidate.active);
          if (!blueprint) return null;
          const dark = index === 0;
          return (
            <Link key={exam.id} href={{ pathname: '/exam/[examId]/mock', params: { examId: exam.id } } as unknown as Href} asChild>
              <Pressable style={StyleSheet.flatten([styles.examCard, dark && styles.examCardDark])}>
                <ThemedText type="smallBold" style={dark && styles.darkMuted}>{exam.code === 'D1' ? 'Delprov 1' : 'Delprov 2'}</ThemedText>
                <ThemedText type="subtitle" style={dark && styles.darkText}>{exam.title}</ThemedText>
                <View style={styles.examMeta}>
                  <ThemedText type="small" style={dark ? styles.darkMuted : styles.metaText}>{blueprint.totalDisplayedQuestionCount} frågor</ThemedText>
                  <ThemedText type="small" style={dark ? styles.darkMuted : styles.metaText}>50 min</ThemedText>
                </View>
                <View style={[styles.startButton, dark && styles.startButtonDark]}>
                  <ThemedText type="smallBold" style={styles.startButtonText}>Starta fullständigt prov</ThemedText>
                </View>
              </Pressable>
            </Link>
          );
        })}
      </Section>

      <Section>
        <ThemedText type="subtitle">Övningsprov</ThemedText>
        <View style={styles.practiceGrid}>
          {practiceSubjects.map((subject, index) => {
            const topic = repository.topics.find((candidate) => candidate.subjectId === subject.id);
            if (!topic) return null;
            return (
              <Link key={subject.id} href={{ pathname: '/subject/[subjectId]', params: { subjectId: subject.id } } as unknown as Href} asChild>
                <Pressable style={styles.practiceCard}>
                  <LearningIllustration kind={subjectIllustrations[index % subjectIllustrations.length]} />
                  <ThemedText type="smallBold">{subject.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{Math.max(15, subject.officialQuestionCount)} frågor</ThemedText>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </Section>

      <BottomNav active="exam" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  examCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  examCardDark: {
    backgroundColor: Colors.light.ink,
    borderColor: Colors.light.ink,
  },
  examMeta: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  metaText: {
    color: Colors.light.textSecondary,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkMuted: {
    color: '#B7C7BC',
  },
  startButton: {
    minHeight: 52,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  startButtonDark: {
    backgroundColor: Colors.light.primary,
  },
  startButtonText: {
    color: '#FFFFFF',
  },
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  practiceCard: {
    width: '47.5%',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
