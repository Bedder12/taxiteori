import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, ProgressBar, Section, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
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
    return <ThemedText>Ämnet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Ämne"
          title={view.subject.title}
          description="Följ ämnets moment i ordning och använd checkpointen när grunderna sitter."
        />
      }>
      <AppCard muted>
        <ProgressBar value={view.progress.learningPercent} />
        <View style={styles.stats}>
          <StatPill label="Inlärning" value={`${view.progress.learningPercent}%`} />
          <StatPill label="Moment" value={`${view.progress.completedLessons}/${view.progress.totalLessons}`} />
          <StatPill label="Checkpoint" value={view.progress.checkpointPassed ? 'Klar' : 'Ej klar'} tone={view.progress.checkpointPassed ? 'success' : 'warning'} />
        </View>
      </AppCard>

      {view.topics.length === 0 ? (
        <AppCard muted>
          <ThemedText type="subtitle">Planerat innehåll</ThemedText>
          <ThemedText themeColor="textSecondary">Det här området är markerat som kommande innehåll.</ThemedText>
        </AppCard>
      ) : null}

      <Section>
        <ThemedText type="subtitle">Moment</ThemedText>
        {view.topics.map((topic) => {
          const topicView = getTopicCardView(repository, topic.id, state.facts, RUNTIME_USER_ID);
          const percent = topicView.progress?.learningPercent ?? 0;
          return (
            <Link key={topic.id} href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.topicRow, pressed && styles.pressed]}>
                <View style={styles.topicCopy}>
                  <ThemedText type="smallBold" themeColor="primary">{percent}% klart</ThemedText>
                  <ThemedText type="subtitle">{topic.title}</ThemedText>
                  <ThemedText themeColor="textSecondary">
                    {topicView.progress?.completedLessons ?? 0} av {topicView.progress?.totalLessons ?? 0} moment klara
                  </ThemedText>
                </View>
                <View style={styles.openBadge}>
                  <ThemedText type="smallBold" style={styles.openText}>Öppna</ThemedText>
                </View>
              </Pressable>
            </Link>
          );
        })}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  topicRow: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  topicCopy: {
    gap: Spacing.one,
  },
  openBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primarySoft,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  openText: {
    color: Colors.light.primaryStrong,
  },
  pressed: {
    opacity: 0.72,
  },
});
