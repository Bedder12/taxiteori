import { type Href, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { LessonBlockRenderer } from '@/components/learning/LessonBlockRenderer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getLessonView } from '@/features/learn/selectors';
import { DEMO_USER_ID, completeLesson, getLearningSnapshot } from '@/lib/learningStore';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { repository, state } = getLearningSnapshot();
  const view = getLessonView(repository, lessonId, state.facts, DEMO_USER_ID);

  if (!view.lesson || !view.topic) {
    return <ThemedText>Lektionen hittades inte.</ThemedText>;
  }

  function handleContinue() {
    completeLesson(DEMO_USER_ID, view.lesson!.id);
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
