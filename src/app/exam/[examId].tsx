import { Link, type Href, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/layout/PrimaryButton';
import { Screen } from '@/components/layout/Screen';
import { SubjectCard } from '@/components/learning/SubjectCard';
import { ThemedText } from '@/components/themed-text';
import { AppHeader, BottomNav, Section } from '@/components/ui/foundation';
import { Spacing } from '@/constants/theme';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { getSubjectProgress } from '../../../packages/domain/src';
import { getRuntimeMetadataRepository } from '../../../packages/domain/src/runtimeRepository';

export default function ExamScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const repository = getRuntimeMetadataRepository();
  const state = getRuntimeState();
  const exam = repository.exams.find((candidate) => candidate.id === examId);
  const subjects = repository.subjects.filter((subject) => subject.examId === examId).sort((a, b) => a.order - b.order);

  if (!exam) {
    return <ThemedText>Delprovet hittades inte.</ThemedText>;
  }

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Plugga"
          title={exam.title}
          description="Välj ämne, läs korta moment och kontrollera kunskapen i checkpoints."
        />
      }>
      {(exam.code === 'D1' || exam.code === 'D2') ? (
        <Link href={{ pathname: '/exam/[examId]/mock', params: { examId } } as unknown as Href} asChild>
          <PrimaryButton>Starta fullständigt övningsprov</PrimaryButton>
        </Link>
      ) : null}

      <Section>
        <ThemedText type="subtitle">Ämnen</ThemedText>
        {subjects.map((subject) => {
          const topics = repository.topics.filter((topic) => topic.subjectId === subject.id);
          const checkpointAssessment = repository.assessments.find((assessment) => assessment.subjectId === subject.id);
          const progress = getSubjectProgress({
            userId: RUNTIME_USER_ID,
            topicIds: topics.map((topic) => topic.id),
            lessons: repository.lessons,
            facts: state.facts,
            checkpointAssessment,
          });
          const disabled = topics.length === 0;

          const card = (
            <SubjectCard
              disabled={disabled}
              subject={subject}
              learningPercent={progress.learningPercent}
              checkpointPassed={progress.checkpointPassed}
            />
          );

          if (disabled) {
            return <View key={subject.id}>{card}</View>;
          }

          return (
            <Link key={subject.id} href={{ pathname: '/subject/[subjectId]', params: { subjectId: subject.id } } as unknown as Href} asChild>
              <Pressable style={({ pressed }) => pressed && styles.pressed}>{card}</Pressable>
            </Link>
          );
        })}
      </Section>

      <BottomNav active="study" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.72,
  },
  gap: {
    gap: Spacing.three,
  },
});
