import { type Href, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { LessonBlockRenderer } from '@/components/learning/LessonBlockRenderer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
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

  return (
    <Screen
      header={
        <>
          <ThemedText type="small" themeColor="textSecondary">{view.topic.title}</ThemedText>
          <ThemedText type="title">{view.lesson.title}</ThemedText>
          {view.lesson.estimatedStudyTimeMinutes !== undefined && (
            <ThemedText themeColor="textSecondary">{view.lesson.estimatedStudyTimeMinutes} min läsning</ThemedText>
          )}
          {view.lesson.summary && <ThemedText themeColor="textSecondary">{view.lesson.summary}</ThemedText>}
          {view.lesson.prerequisiteLessonKeys?.length ? <ThemedText type="small" themeColor="textSecondary">Bygger vidare på tidigare moment</ThemedText> : null}
          {view.isCompleted && <ThemedText type="small">✓ Moment klart</ThemedText>}
        </>
      }>
      <View style={styles.content}>
        {view.lesson.blocks.map((block, index) => (
          <LessonBlockRenderer key={`${block.type}-${index}`} block={block} />
        ))}
      </View>

      <ThemedText onPress={handleContinue} style={styles.button}>
        {view.nextLesson ? 'Markera klar och fortsätt' : 'Markera klar och tillbaka'}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.three },
  button: {
    backgroundColor: '#176B49',
    color: '#FFFFFF',
    textAlign: 'center',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    overflow: 'hidden',
    fontWeight: '700',
  },
});
