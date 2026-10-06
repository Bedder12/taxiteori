import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getRuntimeState, saveRuntimeAnswer, startRuntimeCheckpoint, submitRuntimeAttempt } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

export default function QuizScreen() {
  const { assessmentId } = useLocalSearchParams<{ assessmentId: string }>();
  const [repository, setRepository] = useState(getRuntimeMetadataRepository());
  const [state, setState] = useState(getRuntimeState());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();
  const assessment = repository.assessments.find((candidate) => candidate.id === assessmentId);
  const subjectId = assessment?.subjectId;

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    void loadRuntimeRepository([subjectId]).then((loaded) => { setRepository(loaded); setState(getRuntimeState()); }).catch(setLoadError).finally(() => setLoading(false));
  }, [subjectId]);

  const attempt = useMemo(() => (!loading ? startRuntimeCheckpoint(repository, assessmentId) : undefined), [loading, assessmentId, repository]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!attempt) return;
    const firstUnanswered = attempt.questions.findIndex((question) => !state.answers.some((answer) => answer.attemptQuestionId === question.id));
    setCurrentIndex(firstUnanswered < 0 ? 0 : firstUnanswered);
    setSelectedChoices(Object.fromEntries(state.answers.filter((answer) => answer.attemptId === attempt.id).map((answer) => [answer.attemptQuestionId, answer.selectedChoiceId])));
  }, [attempt?.id]);

  if (loadError) return <FullscreenMessage text="Checkpointen kunde inte laddas. Försök igen." />;
  if (loading || !attempt) return <FullscreenMessage text="Laddar checkpoint..." />;
  if (!assessment) return <FullscreenMessage text="Checkpointen hittades inte." />;

  const attemptQuestion = attempt.questions[currentIndex];
  const question = repository.questionVersions.find((candidate) => candidate.id === attemptQuestion?.questionVersionId);
  const answeredCount = Object.keys(selectedChoices).length;
  const selectedChoiceId = attemptQuestion ? selectedChoices[attemptQuestion.id] : undefined;
  const isLastQuestion = currentIndex === attempt.questions.length - 1;
  const progress = ((currentIndex + 1) / attempt.questions.length) * 100;

  function handleNext() {
    if (!attempt || !attemptQuestion || !selectedChoiceId) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const result = submitRuntimeAttempt(repository, attempt.id, selectedChoices);
    router.replace({ pathname: '/result/[attemptId]', params: { attemptId: result.attempt.id } } as unknown as Href);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Stäng frågor" onPress={() => router.back()} style={styles.closeButton}>
          <ThemedText style={styles.closeText}>×</ThemedText>
        </Pressable>
        <View style={styles.topCenter}>
          <View style={styles.dots}>
            {attempt.questions.slice(0, 12).map((item, index) => (
              <View key={item.id} style={[styles.dot, index <= currentIndex && styles.dotActive]} />
            ))}
          </View>
          <ThemedText type="smallBold" style={styles.topMeta}>
            {answeredCount}/{attempt.questions.length} besvarade
          </ThemedText>
        </View>
        <View style={styles.counterPill}>
          <ThemedText type="smallBold" style={styles.counterText}>{currentIndex + 1}/{attempt.questions.length}</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.progressShell}>
          <View style={styles.progressLabels}>
            <ThemedText type="smallBold" style={styles.progressLabel}>START</ThemedText>
            <ThemedText type="smallBold" style={styles.progressLabel}>KLAR</ThemedText>
          </View>
          <ProgressBar tone="light" value={progress} />
        </View>

        <View style={styles.quizHeader}>
          <ThemedText type="smallBold" style={styles.eyebrow}>Intern lärandecheckpoint</ThemedText>
          <ThemedText style={styles.title}>{assessment.title}</ThemedText>
        </View>

        {question && attemptQuestion ? (
          <QuestionCard
            tone="dark"
            attemptQuestion={attemptQuestion}
            question={question}
            selectedChoiceId={selectedChoiceId}
            onSelectChoice={(choiceId) => {
              saveRuntimeAnswer(repository, attempt.id, attemptQuestion.id, choiceId);
              setSelectedChoices((current) => ({ ...current, [attemptQuestion.id]: choiceId }));
            }}
          />
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        <PrimaryButton disabled={!selectedChoiceId} onPress={handleNext}>
          {isLastQuestion ? 'Lämna in' : 'Nästa fråga'}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

function FullscreenMessage({ text }: { text: string }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.message}>
        <ThemedText style={styles.darkBody}>{text}</ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101113',
  },
  topBar: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: Radii.pill,
    backgroundColor: '#24262B',
    borderWidth: 1,
    borderColor: '#3A3D45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: 800,
  },
  topCenter: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radii.pill,
    backgroundColor: '#444852',
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
  },
  topMeta: {
    color: '#9CA3AF',
  },
  counterPill: {
    minWidth: 56,
    minHeight: 36,
    borderRadius: Radii.pill,
    backgroundColor: '#24262B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  counterText: {
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 128,
    gap: Spacing.five,
  },
  progressShell: {
    backgroundColor: '#090A0B',
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#FFFFFF',
  },
  quizHeader: {
    gap: Spacing.one,
  },
  eyebrow: {
    color: Colors.light.primary,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 800,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    backgroundColor: 'rgba(16,17,19,0.96)',
  },
  message: {
    flex: 1,
    padding: Spacing.five,
    justifyContent: 'center',
  },
  darkBody: {
    color: '#FFFFFF',
  },
});
