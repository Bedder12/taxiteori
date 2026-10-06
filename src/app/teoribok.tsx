import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppHeader, BottomNav, SearchField, Section } from '@/components/ui/foundation';
import { LearningIllustration } from '@/components/ui/LearningIllustration';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getRuntimeState } from '@/lib/runtimeLearningState';
import { getRuntimeMetadataRepository } from '../../packages/domain/src/runtimeRepository';

type ExamFilter = 'all' | 'D1' | 'D2';

const illustrationKinds = ['map', 'wheel', 'road', 'safety', 'car', 'book'] as const;

export default function TheoryBookScreen() {
  const repository = getRuntimeMetadataRepository();
  const state = getRuntimeState();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ExamFilter>('all');

  const chapters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return repository.topics
      .map((topic) => {
        const subject = repository.subjects.find((candidate) => candidate.id === topic.subjectId);
        const exam = subject ? repository.exams.find((candidate) => candidate.id === subject.examId) : undefined;
        const lessons = repository.lessons.filter((lesson) => lesson.topicId === topic.id);
        const completedLessons = lessons.filter((lesson) => state.facts.some((fact) => fact.type === 'lesson_completed' && fact.lessonId === lesson.id)).length;
        return { topic, subject, exam, lessons, completedLessons };
      })
      .filter(({ exam, lessons, subject, topic }) => {
        if (!exam || !subject || lessons.length === 0) return false;
        if (filter !== 'all' && exam.code !== filter) return false;
        if (!normalizedQuery) return true;
        return `${exam.title} ${subject.title} ${topic.title}`.toLowerCase().includes(normalizedQuery);
      })
      .sort((left, right) => {
        const examOrder = (left.exam?.order ?? 0) - (right.exam?.order ?? 0);
        if (examOrder !== 0) return examOrder;
        const subjectOrder = (left.subject?.order ?? 0) - (right.subject?.order ?? 0);
        if (subjectOrder !== 0) return subjectOrder;
        return left.topic.order - right.topic.order;
      });
  }, [filter, query, repository, state.facts]);

  return (
    <Screen
      header={
        <AppHeader
          eyebrow="Referensbibliotek"
          title="Teoriboken"
        />
      }>
      <SearchField placeholder="Sök i teorin" value={query} onChangeText={setQuery} />

      <View style={styles.filters}>
        {(['all', 'D1', 'D2'] as ExamFilter[]).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item }}
            onPress={() => setFilter(item)}
            style={[styles.filter, filter === item && styles.filterActive]}>
            <ThemedText type="smallBold" style={filter === item && styles.filterTextActive}>
              {item === 'all' ? 'Alla' : item === 'D1' ? 'Delprov 1' : 'Delprov 2'}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Section>
        {chapters.map(({ completedLessons, lessons, subject, topic }, index) => {
          const percent = Math.round((completedLessons / Math.max(lessons.length, 1)) * 100);
          return (
            <View key={topic.id}>
              <Link href={{ pathname: '/topic/[topicId]', params: { topicId: topic.id } } as unknown as Href} asChild>
                <Pressable style={styles.chapter}>
                  <LearningIllustration kind={illustrationKinds[index % illustrationKinds.length]} size="small" />
                  <View style={styles.chapterCopy}>
                    <ThemedText type="small" themeColor="textSecondary">Kapitel {index + 1}</ThemedText>
                    <ThemedText type="subtitle" style={styles.chapterTitle}>{topic.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>{subject?.title}</ThemedText>
                    <ThemedText type="smallBold">
                      {lessons.length} moment · {percent}% läst
                    </ThemedText>
                  </View>
                  <ThemedText type="subtitle" themeColor="textSecondary">›</ThemedText>
                </Pressable>
              </Link>
            </View>
          );
        })}
      </Section>

      <BottomNav active="book" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filter: {
    minHeight: 36,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterActive: {
    backgroundColor: Colors.light.ink,
    borderColor: Colors.light.ink,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  chapter: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.large,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chapterCopy: {
    flex: 1,
    gap: 1,
  },
  chapterTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
});
