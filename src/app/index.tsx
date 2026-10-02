import { Link, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ExamCard } from '@/components/learning/ExamCard';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, BottomNav, Section, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { getSubjectProgress } from '../../packages/domain/src';
import { getRuntimeMetadataRepository } from '../../packages/domain/src/runtimeRepository';

export default function HomeScreen() {
  const [snapshot, setSnapshot] = useState(() => ({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() }));

  useFocusEffect(
    useCallback(() => {
      setSnapshot({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() });
    }, []),
  );

  const { repository, state } = snapshot;
  const publishedExams = repository.exams.filter((exam) => exam.status === 'published');
  const totalSubjects = repository.subjects.filter((subject) => publishedExams.some((exam) => exam.id === subject.examId)).length;
  const completedSubjects = repository.subjects.filter((subject) => {
    const topics = repository.topics.filter((topic) => topic.subjectId === subject.id);
    const checkpointAssessment = repository.assessments.find((assessment) => assessment.subjectId === subject.id);
    const progress = getSubjectProgress({
      userId: RUNTIME_USER_ID,
      topicIds: topics.map((topic) => topic.id),
      lessons: repository.lessons,
      facts: state.facts,
      checkpointAssessment,
    });
    return progress.learningPercent === 100 && progress.checkpointPassed;
  }).length;

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Taxi theory"
          title="Plugga smartare"
          description="Korta lektioner, källstödda frågor och realistiska prov för taxiförarlegitimation."
        />
      }>
      <AppCard muted style={styles.heroStats}>
        <StatPill label="Delprov" value={String(publishedExams.length)} />
        <StatPill label="Ämnen" value={`${completedSubjects}/${totalSubjects}`} tone={completedSubjects === totalSubjects ? 'success' : 'default'} />
      </AppCard>

      <Link href={'/prov' as Href} asChild>
        <Pressable style={({ pressed }) => [styles.provLink, pressed && styles.pressed]}>
          <View style={styles.provCopy}>
            <ThemedText type="subtitle">Prov</ThemedText>
            <ThemedText themeColor="textSecondary">Fullständiga övningsprov för D1 och D2.</ThemedText>
          </View>
          <View style={styles.arrow}>
            <ThemedText type="smallBold" style={styles.arrowText}>Start</ThemedText>
          </View>
        </Pressable>
      </Link>

      <Section>
        <ThemedText type="subtitle">Teoriboken</ThemedText>
        {publishedExams.map((exam) => {
          const examSubjects = repository.subjects.filter((subject) => subject.examId === exam.id);
          const done = examSubjects.filter((subject) => {
            const topics = repository.topics.filter((topic) => topic.subjectId === subject.id);
            const checkpointAssessment = repository.assessments.find((assessment) => assessment.subjectId === subject.id);
            const progress = getSubjectProgress({
              userId: RUNTIME_USER_ID,
              topicIds: topics.map((topic) => topic.id),
              lessons: repository.lessons,
              facts: state.facts,
              checkpointAssessment,
            });
            return progress.learningPercent === 100 && progress.checkpointPassed;
          }).length;

          return (
            <Link key={exam.id} href={{ pathname: '/exam/[examId]', params: { examId: exam.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>
                <ExamCard exam={exam} subjects={examSubjects} completedSubjects={done} />
              </Pressable>
            </Link>
          );
        })}
      </Section>

      <BottomNav active="home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroStats: {
    flexDirection: 'row',
    padding: Spacing.three,
  },
  provLink: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radii.large,
    padding: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  provCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  arrow: {
    borderRadius: Radii.pill,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  arrowText: {
    color: Colors.light.primaryStrong,
  },
  pressed: {
    opacity: 0.72,
  },
});
