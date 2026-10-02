import { Link, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ExamCard } from '@/components/learning/ExamCard';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, BottomNav, ProgressBar, Section, StatPill } from '@/components/ui/foundation';
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
  const publishedExams = repository.exams.filter((exam) => exam.status === 'published').sort((left, right) => left.order - right.order);
  const examProgress = publishedExams.map((exam) => {
    const subjects = repository.subjects.filter((subject) => subject.examId === exam.id);
    const completedSubjects = subjects.filter((subject) => {
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
    const percent = subjects.length ? Math.round((completedSubjects / subjects.length) * 100) : 0;
    return { exam, subjects, completedSubjects, percent };
  });

  const currentLesson = repository.lessons
    .map((lesson) => {
      const topic = repository.topics.find((candidate) => candidate.id === lesson.topicId);
      const subject = topic ? repository.subjects.find((candidate) => candidate.id === topic.subjectId) : undefined;
      const completed = state.facts.some((fact) => fact.type === 'lesson_completed' && fact.lessonId === lesson.id);
      return { lesson, topic, subject, completed };
    })
    .filter((item) => item.topic && item.subject && !item.completed)
    .sort((left, right) => {
      const subjectOrder = (left.subject?.order ?? 0) - (right.subject?.order ?? 0);
      if (subjectOrder !== 0) return subjectOrder;
      const topicOrder = (left.topic?.order ?? 0) - (right.topic?.order ?? 0);
      if (topicOrder !== 0) return topicOrder;
      return left.lesson.order - right.lesson.order;
    })[0];
  const continuePercent = examProgress[0]?.percent ?? 0;

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Fredag 2 oktober"
          title="Hej igen"
          description="Fortsätt där du slutade och välj nästa steg när du är redo."
        />
      }>
      {currentLesson ? (
        <Link href={{ pathname: '/lesson/[lessonId]', params: { lessonId: currentLesson.lesson.id } } as unknown as Href} asChild>
          <Pressable style={({ pressed }) => [styles.continueHero, pressed && styles.pressed]}>
            <View style={styles.continueTop}>
              <View style={styles.continueCopy}>
                <ThemedText type="smallBold" style={styles.continueEyebrow}>Fortsätt plugga</ThemedText>
                <ThemedText type="subtitle" style={styles.continueTitle}>{currentLesson.subject?.title}</ThemedText>
                <ThemedText style={styles.continueMeta}>{currentLesson.lesson.title}</ThemedText>
              </View>
              <ThemedText style={styles.continuePercent}>{continuePercent}%</ThemedText>
            </View>
            <ProgressBar value={continuePercent} tone="light" />
            <View style={styles.continueButton}>
              <ThemedText type="smallBold" style={styles.continueButtonText}>Fortsätt</ThemedText>
            </View>
          </Pressable>
        </Link>
      ) : (
        <AppCard muted style={styles.heroStats}>
          <StatPill label="Delprov" value={String(publishedExams.length)} />
          <StatPill label="Ämnen" value={`${examProgress.reduce((sum, item) => sum + item.completedSubjects, 0)}/${examProgress.reduce((sum, item) => sum + item.subjects.length, 0)}`} />
        </AppCard>
      )}

      <View style={styles.quickActions}>
        {publishedExams[0] ? (
          <Link href={{ pathname: '/exam/[examId]', params: { examId: publishedExams[0].id } } as unknown as Href} asChild>
            <Pressable style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
              <MiniIllustration kind="book" />
              <ThemedText type="subtitle">Plugga</ThemedText>
              <ThemedText themeColor="textSecondary">Lärostig</ThemedText>
            </Pressable>
          </Link>
        ) : null}
        <Link href={'/prov' as Href} asChild>
          <Pressable style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
            <MiniIllustration kind="exam" />
            <ThemedText type="subtitle">Prov</ThemedText>
            <ThemedText themeColor="textSecondary">Testa dig</ThemedText>
          </Pressable>
        </Link>
      </View>

      <Section>
        <ThemedText type="subtitle">Din progress</ThemedText>
        <AppCard>
          {examProgress.map(({ completedSubjects, exam, percent, subjects }) => (
            <View key={exam.id} style={styles.progressRow}>
              <ProgressRing value={percent} />
              <View style={styles.progressCopy}>
                <ThemedText type="smallBold">{exam.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{completedSubjects} av {subjects.length} ämnen klara</ThemedText>
              </View>
            </View>
          ))}
        </AppCard>
      </Section>

      <Section>
        <View style={styles.sectionHeading}>
          <ThemedText type="subtitle">Rekommenderat för dig</ThemedText>
          <Link href={'/teoribok' as Href} asChild>
            <Pressable><ThemedText type="smallBold" themeColor="primary">Visa alla</ThemedText></Pressable>
          </Link>
        </View>
        <View style={styles.recommendations}>
          {repository.topics.slice(0, 2).map((topic, index) => (
            <Link key={topic.id} href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => [styles.recommendationCard, pressed && styles.pressed]}>
                <MiniIllustration kind={index === 0 ? 'map' : 'wheel'} />
                <ThemedText type="smallBold">{topic.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Öppna kapitlet i teoriboken.</ThemedText>
              </Pressable>
            </Link>
          ))}
        </View>
      </Section>

      <BottomNav active="home" />
    </Screen>
  );
}

function ProgressRing({ value }: { value: number }) {
  const rotation = `${Math.max(0, Math.min(100, value)) * 3.6}deg`;
  return (
    <View style={styles.ringOuter}>
      <View style={[styles.ringFill, { transform: [{ rotate: rotation }] }]} />
      <View style={styles.ringInner}>
        <ThemedText type="smallBold">{value}%</ThemedText>
      </View>
    </View>
  );
}

function MiniIllustration({ kind }: { kind: 'book' | 'exam' | 'map' | 'wheel' }) {
  return (
    <View style={styles.illustrationTile}>
      {kind === 'book' || kind === 'map' ? (
        <>
          <View style={kind === 'map' ? styles.mapFold : styles.bookPage} />
          <View style={kind === 'map' ? styles.mapRoute : styles.bookCover} />
        </>
      ) : null}
      {kind === 'exam' ? (
        <>
          <View style={styles.clip} />
          <View style={styles.examSheet}>
            <View style={styles.examLine} />
            <View style={styles.examLine} />
            <View style={styles.examLine} />
          </View>
        </>
      ) : null}
      {kind === 'wheel' ? (
        <View style={styles.wheel}>
          <View style={styles.wheelHub} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeOne]} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeTwo]} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeThree]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heroStats: {
    flexDirection: 'row',
    padding: Spacing.three,
  },
  continueHero: {
    backgroundColor: Colors.light.ink,
    borderRadius: Radii.large,
    padding: Spacing.five,
    gap: Spacing.four,
    minHeight: 152,
  },
  continueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  continueCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  continueEyebrow: {
    color: '#89A092',
  },
  continueTitle: {
    color: '#FFFFFF',
  },
  continueMeta: {
    color: '#9FB1A6',
  },
  continuePercent: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 800,
  },
  continueButton: {
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  continueButtonText: {
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  quickAction: {
    flex: 1,
    minHeight: 140,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  illustrationTile: {
    height: 80,
    borderRadius: Radii.large,
    backgroundColor: Colors.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bookPage: {
    width: 36,
    height: 42,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 16,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: '25%',
    transform: [{ rotate: '-3deg' }],
  },
  bookCover: {
    width: 38,
    height: 44,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    right: '25%',
    transform: [{ rotate: '3deg' }],
  },
  clip: {
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.ink,
    position: 'absolute',
    top: 17,
    zIndex: 2,
  },
  examSheet: {
    width: 44,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  examLine: {
    width: 20,
    height: 5,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
  },
  mapFold: {
    width: 58,
    height: 44,
    backgroundColor: '#FFFFFF',
    transform: [{ skewX: '-10deg' }],
  },
  mapRoute: {
    width: 42,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
  },
  wheel: {
    width: 58,
    height: 58,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: Colors.light.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelHub: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
  wheelSpoke: {
    width: 6,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.light.ink,
    position: 'absolute',
  },
  wheelSpokeOne: { transform: [{ rotate: '0deg' }], top: 13 },
  wheelSpokeTwo: { transform: [{ rotate: '120deg' }], top: 24, left: 17 },
  wheelSpokeThree: { transform: [{ rotate: '240deg' }], top: 24, right: 17 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progressCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  ringOuter: {
    width: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 999,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderColor: Colors.light.primary,
  },
  ringInner: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  recommendations: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  recommendationCard: {
    flex: 1,
    borderRadius: Radii.large,
    backgroundColor: Colors.light.surface,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pressed: {
    opacity: 0.72,
  },
});
