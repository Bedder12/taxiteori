import { Link, type Href, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, BottomNav, ProgressBar, Section, StatPill } from '@/components/ui/foundation';
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
  const lessonsDone = view.progress.learningPercent === 100;
  const moduleDone = lessonsDone && view.progress.checkpointPassed;

  if (loadError) return <ThemedText>Ämnet kunde inte laddas. Försök igen.</ThemedText>;
  if (loading && !view.subject) return <ThemedText>Laddar ämne...</ThemedText>;
  if (!view.subject) {
    return <ThemedText>Ämnet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Utbildningsmodul"
          title={view.subject.title}
          description="Läs momenten i ordning, kontrollera grunderna och avsluta modulen med ämnesfrågor."
        />
      }>
      <AppCard muted>
        <ProgressBar value={moduleDone ? 100 : view.progress.learningPercent} />
        <View style={styles.stats}>
          <StatPill label="Lärmaterial" value={`${view.progress.completedLessons}/${view.progress.totalLessons}`} />
          <StatPill label="Frågor" value={view.progress.checkpointPassed ? 'Klara' : 'Kvar'} tone={view.progress.checkpointPassed ? 'success' : 'warning'} />
          <StatPill label="Modul" value={moduleDone ? 'Klar' : lessonsDone ? 'Frågor kvar' : 'Pågår'} tone={moduleDone ? 'success' : 'default'} />
        </View>
      </AppCard>

      {view.topics.length === 0 ? (
        <AppCard muted>
          <ThemedText type="subtitle">Planerat innehåll</ThemedText>
          <ThemedText themeColor="textSecondary">Det här området är markerat som kommande innehåll.</ThemedText>
        </AppCard>
      ) : null}

      <Section>
        <ThemedText type="subtitle">Lärmaterial</ThemedText>
        {view.topics.map((topic) => {
          const topicView = getTopicCardView(repository, topic.id, state.facts, RUNTIME_USER_ID);
          const percent = topicView.progress?.learningPercent ?? 0;
          return (
            <Link key={topic.id} href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.topicRow, pressed && styles.pressed]}>
                <View style={styles.topicNumber}>
                  <ThemedText type="smallBold" style={styles.topicNumberText}>{topic.order}</ThemedText>
                </View>
                <View style={styles.topicCopy}>
                  <ThemedText type="smallBold" themeColor="primary">{percent}% klart</ThemedText>
                  <ThemedText type="subtitle" style={styles.topicTitle}>{topic.title}</ThemedText>
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

      {view.checkpointAssessment ? (
        <AppCard style={styles.checkpointCard}>
          <View style={styles.checkpointTop}>
            <View style={styles.checkpointCopy}>
              <ThemedText type="smallBold" themeColor="primary">Ämnesfrågor</ThemedText>
              <ThemedText type="subtitle">{view.checkpointAssessment.title}</ThemedText>
            </View>
            <View style={styles.questionBadge}>
              <ThemedText type="smallBold" style={styles.questionBadgeText}>{view.checkpointAssessment.questionCount}</ThemedText>
              <ThemedText type="small" style={styles.questionBadgeText}>frågor</ThemedText>
            </View>
          </View>
          <ThemedText themeColor="textSecondary">
            {view.checkpointAssessment.questionCount >= 7 && view.checkpointAssessment.questionCount <= 12
              ? 'Avsluta modulen med 7-12 frågor runt lärmaterialet.'
              : 'Avsluta modulen med den befintliga ämnescheckpointen. Frågeantalet följer publicerad frågebank.'}
          </ThemedText>
          {lessonsDone ? (
            <Link href={{ pathname: '/quiz/[assessmentId]', params: { assessmentId: view.checkpointAssessment.id } } as unknown as Href} asChild>
              <PrimaryButton>{view.progress.checkpointPassed ? 'Repetera ämnesfrågor' : 'Starta ämnesfrågor'}</PrimaryButton>
            </Link>
          ) : (
            <PrimaryButton disabled>Slutför lärmaterialet först</PrimaryButton>
          )}
        </AppCard>
      ) : null}

      <BottomNav active="study" />
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
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicNumber: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicNumberText: {
    color: Colors.light.primaryStrong,
  },
  topicCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  topicTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  openBadge: {
    alignSelf: 'center',
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primarySoft,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  openText: {
    color: Colors.light.primaryStrong,
  },
  checkpointCard: {
    gap: Spacing.four,
  },
  checkpointTop: {
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checkpointCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  questionBadge: {
    width: 66,
    height: 66,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionBadgeText: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.72,
  },
});
