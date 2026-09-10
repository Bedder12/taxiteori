import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getSubjectView, getTopicCardView } from '@/features/learn/selectors';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

export default function SubjectScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [snapshot, setSnapshot] = useState(() => ({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() }));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();

  useFocusEffect(
    useCallback(() => {
      setSnapshot((current) => ({ ...current, state: getRuntimeState() }));
    }, []),
  );

  useEffect(() => {
    setLoading(true);
    void loadRuntimeRepository([subjectId]).then((repository) => setSnapshot({ repository, state: getRuntimeState() })).catch(setLoadError).finally(() => setLoading(false));
  }, [subjectId]);

  const { repository, state } = snapshot;
  const view = getSubjectView(repository, subjectId, state.facts, RUNTIME_USER_ID);

  if (loadError) return <ThemedText>Ämnet kunde inte laddas. Försök igen.</ThemedText>;
  if (loading && !view.subject) return <ThemedText>Laddar ämne...</ThemedText>;
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
          const topicView = getTopicCardView(repository, topic.id, state.facts, RUNTIME_USER_ID);
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
