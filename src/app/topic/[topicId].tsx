import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { LessonRow } from '@/components/learning/LessonRow';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, ProgressBar, Section } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getTopicView } from '@/features/learn/selectors';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const metadataRepository = getRuntimeMetadataRepository();
  const metadataTopic = metadataRepository.topics.find((topic) => topic.id === topicId);
  const [snapshot, setSnapshot] = useState(() => ({ repository: metadataRepository, state: getRuntimeState() }));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();

  useFocusEffect(
    useCallback(() => {
      setSnapshot((current) => ({ ...current, state: getRuntimeState() }));
    }, []),
  );

  useEffect(() => {
    if (!metadataTopic) return;
    setLoading(true);
    void loadRuntimeRepository([metadataTopic.subjectId]).then((repository) => setSnapshot({ repository, state: getRuntimeState() })).catch(setLoadError).finally(() => setLoading(false));
  }, [metadataTopic?.subjectId]);

  const { repository, state } = snapshot;
  const view = getTopicView(repository, topicId, state.facts, RUNTIME_USER_ID);
  const learningPercent = view.progress?.learningPercent ?? 0;

  if (loadError) return <ThemedText>Momentet kunde inte laddas. Försök igen.</ThemedText>;
  if (loading && !view.topic) return <ThemedText>Laddar moment...</ThemedText>;
  if (!view.topic) {
    return <ThemedText>Momentet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow={view.subject?.title}
          title={view.topic.title}
          meta={`${view.progress?.completedLessons ?? 0} av ${view.progress?.totalLessons ?? 0} moment klara`}
        />
      }>
      <AppCard muted>
        <ProgressBar value={learningPercent} />
        <ThemedText themeColor="textSecondary">{learningPercent}% av momentet är klart.</ThemedText>
      </AppCard>

      {view.firstIncompleteLesson ? (
        <Link href={{ pathname: '/lesson/[lessonId]', params: { lessonId: view.firstIncompleteLesson.id } } as unknown as Href} asChild>
          <PrimaryButton>Fortsätt</PrimaryButton>
        </Link>
      ) : null}

      <Section>
        <ThemedText type="subtitle">Lektioner</ThemedText>
        <View style={styles.lessonList}>
          {view.lessons.map((lesson, index) => {
            const completed = state.facts.some((fact) => fact.type === 'lesson_completed' && fact.lessonId === lesson.id);
            return (
              <Link key={lesson.id} href={{ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } } as unknown as Href} asChild>
                <Pressable style={styles.lessonRow}>
                  <LessonRow
                    completed={completed}
                    current={!completed && index === (view.progress?.completedLessons ?? 0)}
                    index={index}
                    lesson={lesson}
                  />
                </Pressable>
              </Link>
            );
          })}
        </View>
      </Section>

      {view.checkpointAssessment ? (
        <AppCard style={styles.checkpoint}>
          <View style={styles.checkpointBadge}>
            <ThemedText type="smallBold" style={styles.checkpointBadgeText}>Checkpoint</ThemedText>
          </View>
          <ThemedText type="subtitle">{view.checkpointAssessment.title}</ThemedText>
          <ThemedText themeColor="textSecondary">Intern kontroll med frågor från publicerat innehåll i detta moment.</ThemedText>
          <Link href={{ pathname: '/quiz/[assessmentId]', params: { assessmentId: view.checkpointAssessment.id } } as unknown as Href} asChild>
            <PrimaryButton>Starta checkpoint</PrimaryButton>
          </Link>
        </AppCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lessonList: {
    gap: Spacing.three,
  },
  lessonRow: {
    borderRadius: Radii.large,
  },
  checkpoint: {
    gap: Spacing.three,
  },
  checkpointBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primarySoft,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  checkpointBadgeText: {
    color: Colors.light.primaryStrong,
  },
});
