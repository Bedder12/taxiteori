import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppCard, BottomNav, StatusBadge } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { getSubjectProgress } from '../../packages/domain/src';
import { getRuntimeMetadataRepository } from '../../packages/domain/src/runtimeRepository';
import { isBackendPersistenceConfigured } from '@/lib/supabaseClient';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';

export default function ProfileScreen() {
  const repository = getRuntimeMetadataRepository();
  const state = getRuntimeState();
  const examRows = repository.exams
    .filter((exam) => exam.status === 'published')
    .map((exam) => {
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
      return { exam, completedSubjects, percent, totalSubjects: subjects.length };
    });
  const completedAttempts = state.attempts.filter((attempt) => attempt.status !== 'in_progress').slice(-2).reverse();

  return (
    <Screen>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>BM</ThemedText>
        </View>
        <ThemedText type="subtitle">Bedder M.</ThemedText>
        <StatusBadge label={`${state.facts.filter((fact) => fact.type === 'lesson_completed').length} moment klara`} />
      </View>

      <ThemedText type="subtitle">Progress</ThemedText>
      <View style={styles.progressGrid}>
        {examRows.map(({ exam, percent }) => (
          <AppCard key={exam.id} style={styles.progressCard}>
            <ProgressRing value={percent} />
            <ThemedText type="smallBold">{exam.code === 'D1' ? 'Delprov 1' : 'Delprov 2'}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.progressSubtitle}>
              {exam.code === 'D1' ? 'Säkerhet och beteende' : 'Lagstiftning'}
            </ThemedText>
          </AppCard>
        ))}
      </View>

      <ThemedText type="subtitle">Provhistorik</ThemedText>
      <AppCard>
        {completedAttempts.length === 0 ? (
          <ThemedText themeColor="textSecondary">Inga avslutade prov än.</ThemedText>
        ) : (
          completedAttempts.map((attempt, index) => (
            <View key={attempt.id} style={[styles.historyRow, index > 0 && styles.divider]}>
              <View>
                <ThemedText type="smallBold">{attempt.assessmentId?.includes('d2') ? 'Delprov 2' : 'Delprov 1'}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }) : 'Avslutat försök'}</ThemedText>
              </View>
              <View style={styles.historyRight}>
                <ThemedText type="smallBold">{attempt.score ?? 0} / {attempt.totalQuestions}</ThemedText>
                <View style={[styles.resultBadge, attempt.passed ? styles.resultPass : styles.resultFail]}>
                  <ThemedText type="smallBold" style={[styles.resultBadgeText, !attempt.passed && styles.resultFailText]}>{attempt.passed ? 'Godkänt' : 'Ej godkänt'}</ThemedText>
                </View>
              </View>
            </View>
          ))
        )}
      </AppCard>

      <AppCard>
        <ProfileRow icon="bookmark" title="Sparat" subtitle="Sparade moment visas här när funktionen finns" />
        <ProfileRow icon="settings" title="Synk" subtitle={isBackendPersistenceConfigured() ? 'Supabase är konfigurerat' : 'Endast lokal state är aktiv'} />
        <ProfileRow icon="profile" title="Konto" subtitle="E-post och prenumeration" last />
      </AppCard>

      <BottomNav active="profile" />
    </Screen>
  );
}

function ProfileRow({ icon, last, subtitle, title }: { icon: 'bookmark' | 'settings' | 'profile'; last?: boolean; subtitle: string; title: string }) {
  return (
    <View style={[styles.profileRow, !last && styles.divider]}>
      <View style={styles.rowIcon}>
        <ProfileGlyph name={icon} />
      </View>
      <View style={styles.profileRowCopy}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{subtitle}</ThemedText>
      </View>
      <ThemedText themeColor="textSecondary">›</ThemedText>
    </View>
  );
}

function ProfileGlyph({ name }: { name: 'bookmark' | 'settings' | 'profile' }) {
  return (
    <View style={styles.glyph}>
      {name === 'bookmark' ? (
        <>
          <View style={styles.bookmarkBody} />
          <View style={styles.bookmarkCut} />
        </>
      ) : null}
      {name === 'settings' ? (
        <>
          <View style={styles.settingsOuter} />
          <View style={styles.settingsInner} />
        </>
      ) : null}
      {name === 'profile' ? (
        <>
          <View style={styles.profileHead} />
          <View style={styles.profileBody} />
        </>
      ) : null}
    </View>
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

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: Colors.light.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 800,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  progressCard: {
    flex: 1,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
  },
  progressSubtitle: {
    textAlign: 'center',
  },
  ringOuter: {
    width: 58,
    height: 58,
    borderRadius: 999,
    borderWidth: 5,
    borderColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    width: 58,
    height: 58,
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
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  resultBadge: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  resultPass: {
    backgroundColor: Colors.light.primarySoft,
  },
  resultFail: {
    backgroundColor: '#FCE4DF',
  },
  resultBadgeText: {
    color: Colors.light.primaryStrong,
  },
  resultFailText: {
    color: Colors.light.danger,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primarySoft,
  },
  profileRowCopy: {
    flex: 1,
  },
  glyph: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBody: {
    width: 11,
    height: 15,
    borderWidth: 1.8,
    borderColor: Colors.light.primaryStrong,
    borderRadius: 3,
  },
  bookmarkCut: {
    position: 'absolute',
    bottom: 1,
    width: 7,
    height: 7,
    backgroundColor: Colors.light.primarySoft,
    transform: [{ rotate: '45deg' }],
  },
  settingsOuter: {
    width: 15,
    height: 15,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: Colors.light.primaryStrong,
  },
  settingsInner: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.light.primaryStrong,
  },
  profileHead: {
    width: 7,
    height: 7,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: Colors.light.primaryStrong,
    position: 'absolute',
    top: 1,
  },
  profileBody: {
    width: 14,
    height: 8,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: Colors.light.primaryStrong,
    position: 'absolute',
    bottom: 1,
  },
});
