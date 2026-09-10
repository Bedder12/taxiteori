import { Link, type Href, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { AnswerReviewCard } from '@/components/quiz/AnswerReviewCard';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
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
        <>
          <ThemedText type="small" themeColor="textSecondary">{isMock ? 'Internt realistiskt övningsprov' : 'Intern lärandecheckpoint'}</ThemedText>
          <ThemedText type="title">{attempt.passed ? 'Godkänt' : 'Inte godkänt'}</ThemedText>
          <ThemedText>
            {correctCount}/{scoredReview.length} rätt · {percentage}% · krav {attempt.passingScore ?? `${Math.round(attempt.passThreshold * 100)}%`}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {isMock ? 'Detta är ett internt övningsprov med egna frågor, inte Trafikverkets prov eller frågebank.' : 'Detta är en intern övningscheckpoint, inte ett officiellt Trafikverket-prov.'}
          </ThemedText>
        </>
      }>
      <View style={styles.summary}>
        <ThemedText type="subtitle">Resultat</ThemedText>
        <ThemedText>Rätt svar: {correctCount} av {scoredReview.length}</ThemedText>
        <ThemedText>Fel svar: {incorrect.length}</ThemedText>
        {isMock && <ThemedText themeColor="textSecondary">Provet innehåller även 5 simulerade utprövningsfrågor som inte påverkar resultatet.</ThemedText>}
        <ThemedText themeColor="textSecondary">Frågversionerna frystes när försöket startade.</ThemedText>
      </View>

      {isMock && (
        <View style={styles.breakdown}>
          <ThemedText type="subtitle">Ämnesfördelning</ThemedText>
          {subjectBreakdown.map((subject) => <ThemedText key={subject.title}>{subject.title}: {subject.correct}/{subject.total}</ThemedText>)}
        </View>
      )}

      {revisitRecommendations.length > 0 && (
        <View style={styles.breakdown}>
          <ThemedText type="subtitle">Rekommenderad repetition</ThemedText>
          {revisitRecommendations.map((recommendation) => (
            <ThemedText key={recommendation.lessonId}>
              {recommendation.title}: {recommendation.revisitReason}
            </ThemedText>
          ))}
        </View>
      )}

      <View style={styles.review}>
        <ThemedText type="subtitle">Gå igenom misstag</ThemedText>
        {incorrect.length === 0 ? (
          <ThemedText themeColor="textSecondary">Inga fel att repetera den här gången.</ThemedText>
        ) : (
          incorrect.map((item) => <AnswerReviewCard key={item.attemptQuestion.id} item={item} />)
        )}
      </View>

      <Link href={resultDestination as unknown as Href} asChild>
        <PrimaryButton>{isMock ? 'Tillbaka till Prov' : assessment?.topicId ? 'Tillbaka till ämnet' : 'Tillbaka till delprovet'}</PrimaryButton>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  review: {
    gap: Spacing.two,
  },
  breakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
