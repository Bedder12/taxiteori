import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { getRuntimeMetadataRepository } from '../../../packages/domain/src/runtimeRepository';

export default function ProvScreen() {
  const repository = getRuntimeMetadataRepository();
  const exams = repository.exams.filter((exam) => exam.status === 'published').sort((left, right) => left.order - right.order);

  return (
    <Screen
      header={
        <>
          <ThemedText type="title">Prov</ThemedText>
          <ThemedText themeColor="textSecondary">Fullständiga interna övningsprov för båda delproven.</ThemedText>
        </>
      }>
      {exams.map((exam) => {
        const blueprint = repository.examBlueprints.find((candidate) => candidate.examId === exam.id && candidate.type === 'mock_exam' && candidate.active);
        if (!blueprint) return null;
        return (
          <Link key={exam.id} href={{ pathname: '/exam/[examId]/mock', params: { examId: exam.id } } as unknown as Href} asChild>
            <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
              <ThemedText type="subtitle">{exam.title}</ThemedText>
              <ThemedText themeColor="textSecondary">Fullständigt övningsprov · {blueprint.totalDisplayedQuestionCount} frågor · 50 minuter</ThemedText>
              <ThemedText type="smallBold">Starta prov</ThemedText>
            </Pressable>
          </Link>
        );
      })}
      <View style={styles.note}>
        <ThemedText themeColor="textSecondary">Provresultat och ämnesfördelning sparas separat från lektionsprogress och checkpoints.</ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, gap: 8 },
  note: { paddingTop: 8 },
  pressed: { opacity: 0.72 },
});