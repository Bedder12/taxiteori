import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getSubjectView, getTopicCardView } from '@/features/learn/selectors';
import { DEMO_USER_ID, getLearningSnapshot } from '@/lib/learningStore';

export default function SubjectScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [snapshot, setSnapshot] = useState(getLearningSnapshot());

  useFocusEffect(
    useCallback(() => {
      setSnapshot(getLearningSnapshot());
    }, []),
  );

  const { repository, state } = snapshot;
  const view = getSubjectView(repository, subjectId, state.facts, DEMO_USER_ID);

  if (!view.subject) {
    return <ThemedText>Amnet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <>
          <ThemedText type="title">{view.subject.title}</ThemedText>
          <ThemedText themeColor="textSecondary">
            Inlarning {view.progress.learningPercent}% · {view.progress.completedLessons}/{view.progress.totalLessons} moment · Checkpoint {view.progress.checkpointPassed ? 'klar' : 'ej klar'}
          </ThemedText>
        </>
      }>

        {view.topics.length === 0 && (
          <View style={styles.planned}>
            <ThemedText type="subtitle">Planerat innehåll</ThemedText>
            <ThemedText themeColor="textSecondary">Det här området ingår inte i den första Vilotider-slicen ännu.</ThemedText>
          </View>
        )}

        {view.topics.map((topic) => {
          const topicView = getTopicCardView(repository, topic.id, state.facts, DEMO_USER_ID);
          return (
            <Link key={topic.id} href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.topicRow, pressed && styles.pressed]}>
                <View>
                  <ThemedText type="subtitle">{topic.title}</ThemedText>
                  <ThemedText themeColor="textSecondary">
                    {topicView.progress?.completedLessons ?? 0} av {topicView.progress?.totalLessons ?? 0} moment klara
                  </ThemedText>
                </View>
                <ThemedText type="smallBold">Öppna</ThemedText>
              </Pressable>
            </Link>
          );
        })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topicRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planned: {
    backgroundColor: '#EEF3EA',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  pressed: { opacity: 0.72 },
});
