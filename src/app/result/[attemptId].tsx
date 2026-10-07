import { Link, type Href, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { AnswerReviewCard } from '@/components/quiz/AnswerReviewCard';
import { ThemedText } from '@/components/themed-text';
import { AppCard, AppHeader, ProgressBar, Section, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getAttemptReview, getRevisitRecommendations } from '@/features/quiz/selectors';
import { getRuntimeState } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository, loadRuntimeRepository } from '../../../packages/domain/src/runtimeRepository';

export default function ResultScreen() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const state = getRuntimeState();
  const attempt = state.attempts.find((candidate) => candidate.id === attemptId);
  const subjectIds = [...new Set(attempt?.questions.map((question) => question.subjectId) ?? [])];
  const [repository, setRepository] = useState(getRuntimeMetadataRepository());
  const [loading, setLoading] = useState(Boolean(attempt));
  const [loadError, setLoadError] = useState<Error>();

  useEffect(() => {
    if (!subjectIds.length) return;
    void loadRuntimeRepository(subjectIds).then(setRepository).catch(setLoadError).finally(() => setLoading(false));
  }, [attemptId]);

  if (!attempt) {
    return <ThemedText>Resultatet hittades inte.</ThemedText>;
  }
  if (loadError) return <ThemedText>Resultatet kunde inte laddas. Försök igen.</ThemedText>;
  if (loading) return <ThemedText>Laddar resultat...</ThemedText>;

  const review = getAttemptReview(repository, attempt, state.answers);
  const revisitRecommendations = getRevisitRecommendations(repository, attempt, state.answers);
  const scoredReview = review.filter((item) => item.attemptQuestion.scoringRole === 'scored');
  const incorrect = scoredReview.filter((item) => !item.answer?.correct);
  const correctCount = scoredReview.length - incorrect.length;
  const isMock = attempt.type === 'mock_exam';
  const assessment = repository.assessments.find((candidate) => candidate.id === attempt.assessmentId);
  const percentage = Math.round((correctCount / Math.max(scoredReview.length, 1)) * 100);
  const subjectBreakdown = repository.subjects
    .filter((subject) => attempt.questions.some((question) => question.subjectId === subject.id && question.scoringRole === 'scored'))
    .map((subject) => {
      const subjectQuestions = attempt.questions.filter((question) => question.subjectId === subject.id && question.scoringRole === 'scored');
      const correct = subjectQuestions.filter((question) => state.answers.some((answer) => answer.attemptQuestionId === question.id && answer.correct)).length;
      return { title: subject.title, correct, total: subjectQuestions.length };
    });
  const resultDestination = isMock
    ? { pathname: '/prov' }
    : assessment?.topicId
      ? { pathname: '/topic/[topicId]', params: { topicId: assessment.topicId } }
      : assessment?.subjectId
        ? { pathname: '/subject/[subjectId]', params: { subjectId: assessment.subjectId } }
        : { pathname: '/prov' };

  return (
    <Screen
      header={
        <AppHeader
          eyebrow={isMock ? 'Internt realistiskt övningsprov' : 'Intern lärandecheckpoint'}
          title={attempt.passed ? 'Godkänt' : 'Inte godkänt'}
          description={isMock ? 'Detta är ett internt övningsprov med egna frågor, inte Trafikverkets prov eller frågebank.' : 'Detta är en intern övningscheckpoint, inte ett officiellt Trafikverket-prov.'}
        />
      }>
      <AppCard>
        <View style={styles.scoreTop}>
          <View>
            <ThemedText type="smallBold" themeColor="primary">Resultat</ThemedText>
            <ThemedText style={styles.score}>{percentage}%</ThemedText>
          </View>
          <View style={[styles.resultBadge, attempt.passed ? styles.passBadge : styles.failBadge]}>
            <ThemedText type="smallBold" style={styles.resultBadgeText}>{attempt.passed ? 'Klar' : 'Repetera'}</ThemedText>
          </View>
        </View>
        <ProgressBar value={percentage} />
        <View style={styles.stats}>
          <StatPill label="Rätt" value={`${correctCount}/${scoredReview.length}`} tone={attempt.passed ? 'success' : 'default'} />
          <StatPill label="Fel" value={String(incorrect.length)} tone={incorrect.length ? 'warning' : 'success'} />
          <StatPill label="Krav" value={String(attempt.passingScore ?? `${Math.round(attempt.passThreshold * 100)}%`)} />
        </View>
        {isMock ? <ThemedText themeColor="textSecondary">Simulerade utprövningsfrågor påverkar inte resultatet.</ThemedText> : null}
        <ThemedText themeColor="textSecondary">Frågversionerna frystes när försöket startade.</ThemedText>
      </AppCard>

      {isMock ? (
        <Section>
          <ThemedText type="subtitle">Ämnesfördelning</ThemedText>
          {subjectBreakdown.map((subject) => (
            <AppCard key={subject.title} muted style={styles.breakdownRow}>
              <ThemedText>{subject.title}</ThemedText>
              <ThemedText type="smallBold" themeColor="primary">{subject.correct}/{subject.total}</ThemedText>
            </AppCard>
          ))}
        </Section>
      ) : null}

      {revisitRecommendations.length > 0 ? (
        <Section>
          <ThemedText type="subtitle">Rekommenderad repetition</ThemedText>
          {revisitRecommendations.map((recommendation) => (
            <AppCard key={recommendation.lessonId} muted>
              <ThemedText>{recommendation.title}</ThemedText>
              <ThemedText themeColor="textSecondary">{recommendation.revisitReason}</ThemedText>
            </AppCard>
          ))}
        </Section>
      ) : null}

      <Section>
        <ThemedText type="subtitle">Gå igenom misstag</ThemedText>
        {incorrect.length === 0 ? (
          <AppCard muted>
            <ThemedText themeColor="textSecondary">Inga fel att repetera den här gången.</ThemedText>
          </AppCard>
        ) : (
          incorrect.map((item) => <AnswerReviewCard key={item.attemptQuestion.id} item={item} />)
        )}
      </Section>

      <Link href={resultDestination as unknown as Href} asChild>
        <PrimaryButton>{isMock ? 'Tillbaka till Prov' : assessment?.topicId ? 'Tillbaka till ämnet' : 'Tillbaka till delprovet'}</PrimaryButton>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scoreTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  score: {
    fontSize: 46,
    lineHeight: 52,
    fontWeight: 800,
  },
  resultBadge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  passBadge: {
    backgroundColor: Colors.light.primary,
  },
  failBadge: {
    backgroundColor: Colors.light.danger,
  },
  resultBadgeText: {
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
