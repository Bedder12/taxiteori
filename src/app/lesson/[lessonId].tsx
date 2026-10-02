import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { LessonBlockRenderer } from '@/components/learning/LessonBlockRenderer';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getLessonView } from '@/features/learn/selectors';
import { RUNTIME_USER_ID, completeRuntimeLesson, getRuntimeState } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const metadataRepository = getRuntimeMetadataRepository();
  const metadataLesson = metadataRepository.lessons.find((lesson) => lesson.id === lessonId);
  const metadataTopic = metadataLesson ? metadataRepository.topics.find((topic) => topic.id === metadataLesson.topicId) : undefined;
  const [repository, setRepository] = useState(metadataRepository);
  const [state, setState] = useState(getRuntimeState());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();

  useEffect(() => {
    if (!metadataTopic) return;
    setLoading(true);
    void loadRuntimeRepository([metadataTopic.subjectId]).then((loaded) => { setRepository(loaded); setState(getRuntimeState()); }).catch(setLoadError).finally(() => setLoading(false));
  }, [metadataTopic?.subjectId]);

  const view = getLessonView(repository, lessonId, state.facts, RUNTIME_USER_ID);

  if (loadError) return <ThemedText>Lektionen kunde inte laddas. Försök igen.</ThemedText>;
  if (loading && (!view.lesson || view.lesson.blocks.length === 0)) return <ThemedText>Laddar lektion...</ThemedText>;
  if (!view.lesson || !view.topic) {
    return <ThemedText>Lektionen hittades inte.</ThemedText>;
  }

  function handleContinue() {
    completeRuntimeLesson(view.lesson!.id);
    if (view.nextLesson) {
      router.replace({ pathname: '/lesson/[lessonId]', params: { lessonId: view.nextLesson.id } } as unknown as Href);
    } else {
      router.replace({ pathname: '/topic/[topicId]', params: { topicId: view.topic!.id } } as unknown as Href);
    }
  }

  const meta = [
    view.lesson.estimatedStudyTimeMinutes !== undefined ? `${view.lesson.estimatedStudyTimeMinutes} min läsning` : undefined,
    view.lesson.prerequisiteLessonKeys?.length ? 'Bygger vidare på tidigare moment' : undefined,
  ].filter(Boolean).join(' · ');

  return (
    <Screen
      header={
        <AppHeader
          eyebrow={view.topic.title}
          title={view.lesson.title}
          description={view.lesson.summary}
          meta={meta || undefined}
        />
      }>
      {view.isCompleted ? (
        <View style={styles.completed}>
          <ThemedText type="smallBold" style={styles.completedText}>Moment klart</ThemedText>
        </View>
      ) : null}

      <AppCard style={styles.contentCard}>
        <View style={styles.content}>
          {view.lesson.blocks.map((block, index) => (
            <LessonBlockRenderer key={`${block.type}-${index}`} block={block} />
          ))}
        </View>
      </AppCard>

      <PrimaryButton onPress={handleContinue}>
        {view.nextLesson ? 'Markera klar och fortsätt' : 'Markera klar och tillbaka'}
      </PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  completed: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.primarySoft,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  completedText: {
    color: Colors.light.primaryStrong,
  },
  contentCard: {
    padding: Spacing.five,
  },
  content: {
    gap: Spacing.four,
  },
});
