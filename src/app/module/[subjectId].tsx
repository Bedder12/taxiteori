import { Link, type Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getSubjectView } from '@/features/learn/selectors';
import { RUNTIME_USER_ID, completeRuntimeLesson, getRuntimeState } from '@/lib/runtimeLearningState';
import type { ContentBlock, Lesson } from '../../../packages/domain/src';
import { isLessonCompleted } from '../../../packages/domain/src';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

type ModuleStep =
  | { type: 'lesson'; lesson: Lesson; index: number }
  | { type: 'checkpoint'; index: number };

export default function SubjectModuleScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [snapshot, setSnapshot] = useState(() => ({ repository: getRuntimeMetadataRepository(), state: getRuntimeState() }));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();
  const [manualIndex, setManualIndex] = useState<number>();

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
  const topicIds = new Set(view.topics.map((topic) => topic.id));
  const topicAssessments = repository.assessments.filter((assessment) => assessment.subjectId === subjectId && assessment.topicId && topicIds.has(assessment.topicId) && assessment.status === 'published');
  const firstIncompleteTopicAssessment = topicAssessments.find((assessment) => !state.facts.some((fact) => fact.type === 'attempt_completed' && fact.userId === RUNTIME_USER_ID && fact.assessmentId === assessment.id && fact.passed));
  const finalAssessment = view.checkpointAssessment ?? firstIncompleteTopicAssessment ?? topicAssessments[0];
  const steps = useMemo<ModuleStep[]>(() => [
    ...view.lessons.map((lesson, index) => ({ type: 'lesson' as const, lesson, index })),
    { type: 'checkpoint' as const, index: view.lessons.length },
  ], [view.lessons]);
  const firstIncompleteIndex = Math.max(0, view.lessons.findIndex((lesson) => !isLessonCompleted(state.facts, RUNTIME_USER_ID, lesson.id)));
  const lessonsDone = view.progress.learningPercent === 100;
  const currentIndex = manualIndex ?? (lessonsDone ? steps.length - 1 : firstIncompleteIndex < 0 ? 0 : firstIncompleteIndex);
  const currentStep = steps[currentIndex];

  if (loadError) return <FullscreenMessage text="Modulen kunde inte laddas. Försök igen." />;
  if (loading && !view.subject) return <FullscreenMessage text="Laddar modul..." />;
  if (!view.subject || !currentStep) return <FullscreenMessage text="Modulen hittades inte." />;

  function handleContinue() {
    if (currentStep.type === 'checkpoint') return;
    completeRuntimeLesson(currentStep.lesson.id);
    setSnapshot((current) => ({ ...current, state: getRuntimeState() }));
    setManualIndex(Math.min(currentIndex + 1, steps.length - 1));
  }

  const progressLabel = `${Math.min(currentIndex + 1, steps.length)} av ${steps.length}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Stäng modul" onPress={() => router.replace('/plugga' as Href)} style={styles.closeButton}>
          <ThemedText style={styles.closeText}>×</ThemedText>
        </Pressable>
        <View style={styles.dots}>
          {steps.map((step, index) => (
            <View key={`${step.type}-${index}`} style={[styles.dot, index <= currentIndex && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.stepCounter}>
          <ThemedText type="smallBold" style={styles.stepCounterText}>{progressLabel}</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {currentStep.type === 'lesson' ? (
          <LessonStep lesson={currentStep.lesson} subjectTitle={view.subject.title} />
        ) : (
          <CheckpointStep assessmentId={finalAssessment?.id} passed={Boolean(finalAssessment && state.facts.some((fact) => fact.type === 'attempt_completed' && fact.userId === RUNTIME_USER_ID && fact.assessmentId === finalAssessment.id && fact.passed))} questionCount={finalAssessment?.questionCount} subjectTitle={view.subject.title} />
        )}
      </ScrollView>

      <View style={styles.bottomAction}>
        {currentStep.type === 'lesson' ? (
          <DarkOutlineButton onPress={handleContinue}>{currentIndex === steps.length - 2 ? 'Till ämnesfrågor' : 'Fortsätt'}</DarkOutlineButton>
        ) : finalAssessment ? (
          <Link href={{ pathname: '/quiz/[assessmentId]', params: { assessmentId: finalAssessment.id } } as unknown as Href} asChild>
            <PrimaryButton>{state.facts.some((fact) => fact.type === 'attempt_completed' && fact.userId === RUNTIME_USER_ID && fact.assessmentId === finalAssessment.id && fact.passed) ? 'Repetera frågor' : 'Starta frågor'}</PrimaryButton>
          </Link>
        ) : (
          <PrimaryButton disabled>Frågor saknas</PrimaryButton>
        )}
      </View>
    </SafeAreaView>
  );
}

function DarkOutlineButton({ children, onPress }: { children: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.darkOutlineButton, pressed && styles.pressed]}>
      <ThemedText style={styles.darkOutlineText}>{children}</ThemedText>
    </Pressable>
  );
}

function LessonStep({ lesson, subjectTitle }: { lesson: Lesson; subjectTitle: string }) {
  const heroBlock = lesson.blocks.find((block) => block.type === 'image');
  return (
    <View style={styles.slide}>
      <View style={styles.hero}>
        {heroBlock?.type === 'image' ? (
          <View style={styles.visualPlaceholder}>
            <ThemedText type="smallBold" style={styles.visualText}>{heroBlock.alt || 'Visuellt exempel'}</ThemedText>
          </View>
        ) : (
          <View style={styles.heroFallback}>
            <ThemedText type="smallBold" style={styles.heroFallbackText}>{subjectTitle}</ThemedText>
          </View>
        )}
      </View>

      <ThemedText type="smallBold" style={styles.eyebrow}>{subjectTitle}</ThemedText>
      <ThemedText style={styles.title}>{lesson.title}</ThemedText>
      {lesson.summary ? <ThemedText style={styles.summary}>{lesson.summary}</ThemedText> : null}

      <View style={styles.blocks}>
        {lesson.blocks.filter((block) => block.type !== 'image' && block.type !== 'checkpoint_ref').map((block, index) => (
          <DarkBlock key={`${block.type}-${index}`} block={block} />
        ))}
      </View>
    </View>
  );
}

function CheckpointStep({ assessmentId, passed, questionCount, subjectTitle }: { assessmentId?: string; passed: boolean; questionCount?: number; subjectTitle: string }) {
  return (
    <View style={styles.slide}>
      <View style={styles.quizHero}>
        <ThemedText style={styles.quizHeroText}>?</ThemedText>
      </View>
      <ThemedText type="smallBold" style={styles.eyebrow}>{subjectTitle}</ThemedText>
      <ThemedText style={styles.title}>Ämnesfrågor</ThemedText>
      <ThemedText style={styles.summary}>
        {assessmentId
          ? `Nu testar du lärmaterialet med ${questionCount ?? 'publicerade'} frågor. Resultatet avgör om nästa steg i Plugga-banan låses upp.`
          : 'Det finns ännu ingen publicerad ämnescheckpoint för den här modulen.'}
      </ThemedText>
      <View style={styles.callout}>
        <ThemedText type="smallBold" style={styles.calloutLabel}>{passed ? 'Redan klar' : 'Så funkar det'}</ThemedText>
        <ThemedText style={styles.bodyText}>
          {passed ? 'Du har redan klarat frågedelen. Du kan repetera den när du vill.' : 'Frågorna kommer från samma källspårade frågebank som resten av appen och sparas i samma attempt/result-flöde.'}
        </ThemedText>
      </View>
    </View>
  );
}

function DarkBlock({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') return <ThemedText style={styles.heading}>{block.text}</ThemedText>;
  if (block.type === 'paragraph') return <ThemedText style={styles.bodyText}>{block.text}</ThemedText>;
  if (block.type === 'bullet_list') {
    return (
      <View style={styles.list}>
        {block.items.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bullet} />
            <ThemedText style={[styles.bodyText, styles.bulletText]}>{item}</ThemedText>
          </View>
        ))}
      </View>
    );
  }
  if (block.type === 'info' || block.type === 'warning' || block.type === 'example' || block.type === 'checkpoint') {
    const label = block.type === 'warning' ? 'Viktigt' : block.type === 'example' ? 'Exempel' : block.type === 'checkpoint' ? 'Testa dig själv' : 'Kom ihåg';
    return (
      <View style={styles.callout}>
        <ThemedText type="smallBold" style={styles.calloutLabel}>{label}</ThemedText>
        <ThemedText style={styles.bodyText}>{block.text}</ThemedText>
      </View>
    );
  }
  if (block.type === 'worked_example') {
    return (
      <View style={styles.callout}>
        <ThemedText type="smallBold" style={styles.calloutLabel}>{block.title}</ThemedText>
        {block.timeline.map((item) => <ThemedText key={item} style={styles.bodyText}>• {item}</ThemedText>)}
        <ThemedText style={styles.bodyText}>{block.reasoning}</ThemedText>
        <ThemedText style={styles.bodyText}>{block.finalAnswer}</ThemedText>
      </View>
    );
  }
  return null;
}

function FullscreenMessage({ text }: { text: string }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.message}>
        <ThemedText style={styles.bodyText}>{text}</ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111315',
  },
  topBar: {
    minHeight: 78,
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: Radii.pill,
    backgroundColor: '#24262B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3D45',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: 700,
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radii.pill,
    backgroundColor: '#464A52',
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
  },
  stepCounter: {
    minWidth: 56,
    alignItems: 'flex-end',
  },
  stepCounterText: {
    color: '#AEB4BF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 120,
    gap: Spacing.five,
  },
  slide: {
    gap: Spacing.five,
  },
  hero: {
    marginHorizontal: -Spacing.four,
  },
  heroFallback: {
    minHeight: 250,
    backgroundColor: Colors.light.primary,
    borderRadius: Radii.large,
    justifyContent: 'flex-end',
    padding: Spacing.five,
    marginHorizontal: Spacing.four,
  },
  heroFallbackText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 38,
  },
  visualPlaceholder: {
    minHeight: 250,
    backgroundColor: '#30343B',
    borderRadius: Radii.large,
    justifyContent: 'center',
    padding: Spacing.five,
    marginHorizontal: Spacing.four,
  },
  visualText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
  },
  quizHero: {
    width: 132,
    height: 132,
    borderRadius: Radii.pill,
    backgroundColor: '#D7DEE6',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.five,
  },
  quizHeroText: {
    color: Colors.light.ink,
    fontSize: 64,
    lineHeight: 72,
    fontWeight: 800,
  },
  eyebrow: {
    color: Colors.light.primary,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: 800,
  },
  summary: {
    color: '#E5E7EB',
    fontSize: 20,
    lineHeight: 31,
  },
  blocks: {
    gap: Spacing.four,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 800,
  },
  bodyText: {
    color: '#F3F4F6',
    fontSize: 19,
    lineHeight: 30,
  },
  list: {
    gap: Spacing.three,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    marginTop: 13,
  },
  bulletText: {
    flex: 1,
  },
  callout: {
    backgroundColor: '#1A1D22',
    borderRadius: Radii.large,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: '#292D34',
  },
  calloutLabel: {
    color: Colors.light.primary,
  },
  bottomAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    backgroundColor: 'rgba(17,19,21,0.96)',
  },
  darkOutlineButton: {
    minHeight: 58,
    borderRadius: Radii.pill,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  darkOutlineText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 800,
  },
  pressed: {
    opacity: 0.72,
  },
  message: {
    flex: 1,
    padding: Spacing.five,
    justifyContent: 'center',
  },
});
