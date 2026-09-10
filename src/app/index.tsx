import { Link, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ExamCard } from '@/components/learning/ExamCard';
import { ThemedText } from '@/components/themed-text';
import { getSubjectProgress } from '../../packages/domain/src';
import { DEMO_USER_ID, getLearningSnapshot } from '@/lib/learningStore';

export default function HomeScreen() {
  const [snapshot, setSnapshot] = useState(getLearningSnapshot());

  useFocusEffect(
    useCallback(() => {
      setSnapshot(getLearningSnapshot());
    }, []),
  );

  const { repository, state } = snapshot;

  return (
    <Screen
      header={
        <>
          <ThemedText type="title">Plugga</ThemedText>
          <ThemedText themeColor="textSecondary">Välj delprov och fortsätt in i källstödda lagstiftningsmoment.</ThemedText>
        </>
      }>
      <Link href={'/prov' as Href} asChild>
        <Pressable style={({ pressed }) => [styles.provLink, pressed && styles.pressed]}>
          <ThemedText type="subtitle">Prov</ThemedText>
          <ThemedText themeColor="textSecondary">Fullständiga övningsprov för D1 och D2</ThemedText>
        </Pressable>
      </Link>
      {repository.exams.map((exam) => {
        const examSubjects = repository.subjects.filter((subject) => subject.examId === exam.id);
        const completedSubjects = examSubjects.filter((subject) => {
          const topics = repository.topics.filter((topic) => topic.subjectId === subject.id);
          const checkpointAssessment = repository.assessments.find((assessment) => assessment.subjectId === subject.id);
          const progress = getSubjectProgress({
            userId: DEMO_USER_ID,
            topicIds: topics.map((topic) => topic.id),
            lessons: repository.lessons,
            facts: state.facts,
            checkpointAssessment,
          });
          return progress.learningPercent === 100 && progress.checkpointPassed;
        }).length;

        const card = <ExamCard exam={exam} subjects={examSubjects} completedSubjects={completedSubjects} />;

        return (
          <Link key={exam.id} href={{ pathname: '/exam/[examId]', params: { examId: exam.id } } as unknown as Href} asChild>
            <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>{card}</Pressable>
          </Link>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.72,
  },
  provLink: {
    borderWidth: 1,
    borderColor: '#176B49',
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
});
