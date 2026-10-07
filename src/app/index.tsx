import { Link, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { BottomNav, ProgressBar } from '@/components/ui/foundation';
import { LearningIllustration } from '@/components/ui/LearningIllustration';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { getSubjectProgress } from '../../packages/domain/src';
import { getRuntimeMetadataRepository } from '../../packages/domain/src/runtimeRepository';

const recommendationIllustrations = ['map', 'wheel', 'road', 'safety', 'car', 'person', 'book', 'exam'] as const;

export default function HomeScreen() {
  const [snapshot, setSnapshot] = useState(() => ({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() }));

  useFocusEffect(
    useCallback(() => {
      setSnapshot({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() });
    }, []),
  );

  const { repository, state } = snapshot;
  const displayName = displayNameFromUserId(RUNTIME_USER_ID);
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
      const examOrder = examOrderForSubject(repository, left.subject?.id) - examOrderForSubject(repository, right.subject?.id);
      if (examOrder !== 0) return examOrder;
      const subjectOrder = (left.subject?.order ?? 0) - (right.subject?.order ?? 0);
      if (subjectOrder !== 0) return subjectOrder;
      const topicOrder = (left.topic?.order ?? 0) - (right.topic?.order ?? 0);
      if (topicOrder !== 0) return topicOrder;
      return left.lesson.order - right.lesson.order;
    })[0];

  const continuePercent = useMemo(() => {
    if (!currentLesson?.subject) return examProgress[0]?.percent ?? 0;
    const topics = repository.topics.filter((topic) => topic.subjectId === currentLesson.subject?.id);
    const checkpointAssessment = repository.assessments.find((assessment) => assessment.subjectId === currentLesson.subject?.id);
    return getSubjectProgress({
      userId: RUNTIME_USER_ID,
      topicIds: topics.map((topic) => topic.id),
      lessons: repository.lessons,
      facts: state.facts,
      checkpointAssessment,
    }).learningPercent;
  }, [currentLesson?.subject?.id, examProgress, repository, state.facts]);

  const recommendedTopics = repository.topics
    .slice()
    .sort((left, right) => left.order - right.order)
    .slice(0, 8);

  return (
    <Screen>
      <View style={styles.homeHeader}>
        <View style={styles.headerCopy}>
          <ThemedText type="small" style={styles.dateText}>{formatSwedishDate(new Date())}</ThemedText>
          <ThemedText style={styles.greeting}>{formatGreeting(greetingForHour(new Date().getHours()), displayName)}</ThemedText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Öppna notiser" style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}>
          <NotificationBell />
        </Pressable>
      </View>

      {currentLesson ? (
        <Link href={{ pathname: '/lesson/[lessonId]', params: { lessonId: currentLesson.lesson.id } } as unknown as Href} asChild>
          <Pressable style={styles.continueHero}>
            <View style={styles.continueTop}>
              <View style={styles.continueCopy}>
                <ThemedText type="smallBold" style={styles.continueEyebrow}>Fortsätt plugga</ThemedText>
                <ThemedText style={styles.continueTitle}>{currentLesson.subject?.title}</ThemedText>
                <ThemedText style={styles.continueMeta} numberOfLines={1}>{currentLesson.lesson.title}</ThemedText>
              </View>
              <ThemedText style={styles.continuePercent}>{continuePercent}%</ThemedText>
            </View>
            <ProgressBar value={continuePercent} tone="light" />
            <View style={styles.continueButton}>
              <ThemedText type="smallBold" style={styles.continueButtonText}>Fortsätt</ThemedText>
              <ThemedText style={styles.arrowText}>→</ThemedText>
            </View>
          </Pressable>
        </Link>
      ) : (
        <View style={styles.continueHero}>
          <View style={styles.continueTop}>
            <View style={styles.continueCopy}>
              <ThemedText type="smallBold" style={styles.continueEyebrow}>Allt klart just nu</ThemedText>
              <ThemedText style={styles.continueTitle}>Bra jobbat</ThemedText>
              <ThemedText style={styles.continueMeta}>Gå vidare till repetition eller prov.</ThemedText>
            </View>
            <ThemedText style={styles.continuePercent}>100%</ThemedText>
          </View>
          <ProgressBar value={100} tone="light" />
        </View>
      )}

      <View style={styles.quickActions}>
        <Link href={'/plugga' as Href} asChild>
          <Pressable style={styles.quickAction}>
            <LearningIllustration kind="book" size="feature" />
            <View>
              <ThemedText style={styles.quickTitle}>Plugga</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Lärostig</ThemedText>
            </View>
          </Pressable>
        </Link>
        <Link href={'/prov' as Href} asChild>
          <Pressable style={styles.quickAction}>
            <LearningIllustration kind="exam" size="feature" />
            <View>
              <ThemedText style={styles.quickTitle}>Prov</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Testa dig</ThemedText>
            </View>
          </Pressable>
        </Link>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Din progress</ThemedText>
        <View style={styles.progressCard}>
          {examProgress.map(({ exam, percent }, index) => (
            <View key={exam.id} style={styles.progressRow}>
              <ProgressRing value={percent} />
              <View style={styles.progressCopy}>
                <ThemedText style={styles.progressTitle}>{exam.code === 'D1' ? 'Delprov 1' : 'Delprov 2'}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{exam.code === 'D1' ? 'Säkerhet och beteende' : 'Lagstiftning'}</ThemedText>
              </View>
              {index < examProgress.length - 1 ? <View style={styles.progressSpacer} /> : null}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <ThemedText style={styles.sectionTitle}>Rekommenderat för dig</ThemedText>
          <Link href={'/teoribok' as Href} asChild>
            <Pressable><ThemedText type="smallBold" themeColor="primary">Visa alla</ThemedText></Pressable>
          </Link>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationScroll}>
          {recommendedTopics.map((topic, index) => (
            <Link key={topic.id} href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
              <Pressable style={styles.recommendationCard}>
                <LearningIllustration kind={recommendationIllustrations[index % recommendationIllustrations.length]} size="feature" />
                <ThemedText style={styles.recommendationTitle} numberOfLines={1}>{topic.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>{recommendationSubtitle(repository, topic.subjectId)}</ThemedText>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>

      <BottomNav active="home" />
    </Screen>
  );
}

function examOrderForSubject(repository: ReturnType<typeof getRuntimeMetadataRepository>, subjectId?: string) {
  const subject = repository.subjects.find((candidate) => candidate.id === subjectId);
  const exam = subject ? repository.exams.find((candidate) => candidate.id === subject.examId) : undefined;
  return exam?.order ?? 0;
}

function displayNameFromUserId(userId: string) {
  if (userId === 'local-demo-user') return undefined;
  const readable = userId.split('@')[0]?.split('-')[0];
  return readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : undefined;
}

function formatGreeting(greeting: string, displayName?: string) {
  return displayName ? `${greeting}, ${displayName}` : greeting;
}

function greetingForHour(hour: number) {
  if (hour < 10) return 'God morgon';
  if (hour < 17) return 'Hej igen';
  return 'God kväll';
}

function formatSwedishDate(date: Date) {
  const formatted = date.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function recommendationSubtitle(repository: ReturnType<typeof getRuntimeMetadataRepository>, subjectId: string) {
  const subject = repository.subjects.find((candidate) => candidate.id === subjectId);
  if (!subject) return 'Fortsätt med nästa moment i teorin.';
  if (subject.title === 'Navigering') return 'Kartläsning, GPS och att hitta rätt i staden.';
  if (subject.title === 'Körekonomi') return 'Bränsle, slitage och ekonomisk körning.';
  return subject.title;
}

function NotificationBell() {
  return (
    <View style={styles.bell}>
      <View style={styles.bellDome} />
      <View style={styles.bellClapper} />
    </View>
  );
}

function ProgressRing({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const rotation = `${clamped * 3.6}deg`;
  return (
    <View style={styles.ringOuter}>
      <View style={[styles.ringFill, { transform: [{ rotate: rotation }] }]} />
      <View style={styles.ringInner}>
        <ThemedText type="smallBold" style={styles.ringText}>{clamped}%</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerCopy: {
    flex: 1,
  },
  dateText: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  greeting: {
    color: Colors.light.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 800,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDome: {
    width: 11,
    height: 12,
    borderWidth: 1.6,
    borderColor: Colors.light.ink,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1.6,
  },
  bellClapper: {
    width: 5,
    height: 2,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.ink,
    marginTop: 1,
  },
  continueHero: {
    backgroundColor: Colors.light.ink,
    borderRadius: Radii.large,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.five,
    gap: Spacing.three,
    minHeight: 190,
    justifyContent: 'space-between',
  },
  continueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  continueCopy: {
    flex: 1,
    gap: 2,
  },
  continueEyebrow: {
    color: '#B7C7BC',
    fontSize: 11,
    lineHeight: 16,
  },
  continueTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 800,
  },
  continueMeta: {
    color: '#B7C7BC',
    fontSize: 15,
    lineHeight: 22,
  },
  continuePercent: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 800,
  },
  continueButton: {
    alignSelf: 'flex-start',
    borderRadius: Radii.medium,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  continueButtonText: {
    color: '#FFFFFF',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 800,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickAction: {
    flex: 1,
    minHeight: 196,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.three,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  quickTitle: {
    color: Colors.light.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 800,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 800,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  progressCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progressCopy: {
    flex: 1,
    gap: 1,
  },
  progressTitle: {
    color: Colors.light.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 800,
  },
  progressSpacer: {
    height: 0,
  },
  ringOuter: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 999,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderColor: Colors.light.primary,
  },
  ringInner: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    fontSize: 11,
    lineHeight: 15,
  },
  recommendationScroll: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  recommendationCard: {
    width: 220,
    minHeight: 230,
    borderRadius: Radii.large,
    backgroundColor: Colors.light.surface,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  recommendationTitle: {
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 800,
  },
  pressed: {
    opacity: 0.72,
  },
});
