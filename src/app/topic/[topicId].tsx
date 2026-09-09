import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { LessonRow } from '@/components/learning/LessonRow';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getTopicView } from '@/features/learn/selectors';
import { DEMO_USER_ID, getLearningSnapshot } from '@/lib/learningStore';

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const [snapshot, setSnapshot] = useState(getLearningSnapshot());

  useFocusEffect(
    useCallback(() => {
      setSnapshot(getLearningSnapshot());
    }, []),
  );

  const { repository, state } = snapshot;
  const view = getTopicView(repository, topicId, state.facts, DEMO_USER_ID);

  if (!view.topic) {
    return <ThemedText>Momentet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <>
          <ThemedText type="small" themeColor="textSecondary">{view.subject?.title}</ThemedText>
          <ThemedText type="title">{view.topic.title}</ThemedText>
          <ThemedText themeColor="textSecondary">
            {view.progress?.completedLessons ?? 0} av {view.progress?.totalLessons ?? 0} moment klara
          </ThemedText>
        </>
      }>
      {view.firstIncompleteLesson && (
        <Link
          href={{ pathname: '/lesson/[lessonId]', params: { lessonId: view.firstIncompleteLesson.id } } as unknown as Href}
          asChild>
          <PrimaryButton>Fortsätt</PrimaryButton>
        </Link>
      )}

      <View style={styles.lessonList}>
        {view.lessons.map((lesson, index) => {
          const completed = state.facts.some((fact) => fact.type === 'lesson_completed' && fact.lessonId === lesson.id);
          return (
            <Link key={lesson.id} href={{ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.lessonRow, pressed && styles.pressed]}>
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

      {view.checkpointAssessment && (
        <View style={styles.checkpoint}>
          <ThemedText type="subtitle">Checkpoint</ThemedText>
          <ThemedText themeColor="textSecondary">Intern kontroll med 15 frågor från publicerade Vilotider-frågor.</ThemedText>
          <Link
            href={{ pathname: '/quiz/[assessmentId]', params: { assessmentId: view.checkpointAssessment.id } } as unknown as Href}
            asChild>
            <PrimaryButton>Starta checkpoint</PrimaryButton>
          </Link>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lessonList: {
    gap: Spacing.two,
  },
  lessonRow: {
    borderRadius: Spacing.two,
  },
  checkpoint: {
    borderTopWidth: 1,
    borderColor: '#DDE6D8',
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  pressed: { opacity: 0.72 },
});
