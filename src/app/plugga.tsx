import { Link, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/themed-text';
import { AppCard, BottomNav, ProgressBar, Section, StatPill } from '@/components/ui/foundation';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { RUNTIME_USER_ID, getRuntimeState } from '@/lib/runtimeLearningState';
import { buildSequentialPluggaPath, type SequentialPluggaStep } from '../../packages/domain/src';
import { getRuntimeMetadataRepository } from '../../packages/domain/src/runtimeRepository';

export default function PluggaScreen() {
  const repository = getRuntimeMetadataRepository();
  const [state, setState] = useState(getRuntimeState());

  useFocusEffect(
    useCallback(() => {
      setState(getRuntimeState());
    }, []),
  );

  const path = useMemo(
    () => buildSequentialPluggaPath({ repository, facts: state.facts, userId: RUNTIME_USER_ID }),
    [repository, state.facts],
  );
  const d1Steps = path.steps.filter((step) => step.exam.code === 'D1');
  const d2Steps = path.steps.filter((step) => step.exam.code === 'D2');

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="smallBold" themeColor="textSecondary">Din utbildningsväg</ThemedText>
        <ThemedText type="title">Plugga</ThemedText>
        <ThemedText themeColor="textSecondary">Följ stegen i ordning från första modulen i Delprov 1 till sista slutprovet i Delprov 2.</ThemedText>
      </View>

      <AppCard style={styles.progressCard}>
        <View style={styles.progressTop}>
          <ThemedText type="smallBold" style={styles.progressText}>START</ThemedText>
          <ThemedText type="smallBold" style={styles.progressText}>KLAR</ThemedText>
        </View>
        <ProgressBar value={path.progressPercent} />
        <View style={styles.stats}>
          <StatPill label="Klara steg" value={`${path.completedSteps}/${path.totalSteps}`} />
          <StatPill label="Progress" value={`${path.progressPercent}%`} />
        </View>
      </AppCard>

      <View style={styles.modeTabs}>
        <View style={[styles.modeTab, styles.modeTabActive]}>
          <ThemedText type="smallBold" style={styles.modeTabTextActive}>Steg för steg</ThemedText>
        </View>
        <View style={styles.modeTab}>
          <ThemedText type="smallBold">Frågor</ThemedText>
        </View>
        <View style={styles.modeTab}>
          <ThemedText type="smallBold">Repetera</ThemedText>
        </View>
      </View>

      <Section>
        <ExamPathSection title="Delprov 1" steps={d1Steps} activeStepId={path.activeStep?.id} />
        <ExamPathSection title="Delprov 2" steps={d2Steps} activeStepId={path.activeStep?.id} />
      </Section>

      <BottomNav active="study" />
    </Screen>
  );
}

function ExamPathSection({ activeStepId, steps, title }: { activeStepId?: string; steps: SequentialPluggaStep[]; title: string }) {
  return (
    <View style={styles.examSection}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={styles.path}>
        {steps.map((step, index) => (
          <PathStep key={step.id} isActive={step.id === activeStepId} showConnector={index > 0} step={step} />
        ))}
      </View>
    </View>
  );
}

function PathStep({ isActive, showConnector, step }: { isActive: boolean; showConnector: boolean; step: SequentialPluggaStep }) {
  const right = step.order % 2 === 0;
  const locked = step.status === 'locked';
  const completed = step.status === 'completed';
  const content = (
    <View style={[styles.step, right && styles.stepRight, locked && styles.stepLocked]}>
      {showConnector ? <Connector right={right} /> : null}
      <View style={[styles.stepCopy, right ? styles.stepCopyLeft : styles.stepCopyRight]}>
        <View style={styles.stepTitleRow}>
          <ThemedText type="smallBold" themeColor={locked ? 'textSecondary' : 'text'}>{step.order}. {step.type === 'subject' ? step.subject.title : `Slutprov ${step.exam.code}`}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {statusText(step)}
        </ThemedText>
        {step.questionCount ? (
          <ThemedText type="small" themeColor="textSecondary">{step.questionCount} frågor</ThemedText>
        ) : null}
      </View>
      <View style={[
        styles.node,
        step.type === 'mock_exam' && styles.diamondNode,
        completed && styles.nodeCompleted,
        isActive && styles.nodeActive,
        locked && styles.nodeLocked,
      ]}>
        {isActive ? <View style={styles.activeMarker}><ThemedText type="smallBold" style={styles.activeMarkerText}>Fortsätt här</ThemedText></View> : null}
        <View style={step.type === 'mock_exam' && styles.diamondContent}>
          <ThemedText style={[styles.nodeText, (completed || isActive) && styles.nodeTextActive]}>
            {completed ? '✓' : locked ? 'L' : step.type === 'mock_exam' ? 'P' : String(step.order)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  if (locked) {
    return content;
  }

  return (
    <Link href={step.href as unknown as Href} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>{content}</Pressable>
    </Link>
  );
}

function Connector({ right }: { right: boolean }) {
  return (
    <View style={[styles.connector, right ? styles.connectorRight : styles.connectorLeft]}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View key={index} style={[styles.dot, { top: index * 12, left: right ? index * 13 : 78 - index * 13 }]} />
      ))}
    </View>
  );
}

function statusText(step: SequentialPluggaStep) {
  if (step.status === 'locked') return step.lockedReason ?? 'Låst';
  if (step.status === 'completed') return 'Klar';
  if (step.status === 'checkpoint_ready') return step.type === 'mock_exam' ? 'Redo för slutprov' : 'Ämnesfrågor kvar';
  if (step.status === 'in_progress') return step.type === 'subject' ? `${step.completedLessons}/${step.totalLessons} moment klara` : 'Pågår';
  return step.type === 'subject' ? 'Utbildningsmodul' : 'Slutprov';
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  progressCard: {
    backgroundColor: Colors.light.ink,
    borderColor: Colors.light.ink,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  modeTab: {
    minHeight: 42,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modeTabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  examSection: {
    gap: Spacing.three,
  },
  path: {
    gap: Spacing.six,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  step: {
    minHeight: 118,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepRight: {
    alignItems: 'center',
  },
  stepLocked: {
    opacity: 0.72,
  },
  stepCopy: {
    position: 'absolute',
    width: 154,
    gap: Spacing.half,
  },
  stepCopyRight: {
    left: '57%',
  },
  stepCopyLeft: {
    right: '57%',
    alignItems: 'flex-end',
  },
  stepTitleRow: {
    maxWidth: 154,
  },
  node: {
    width: 72,
    height: 72,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondNode: {
    borderRadius: 16,
    transform: [{ rotate: '45deg' }],
  },
  diamondContent: {
    transform: [{ rotate: '-45deg' }],
  },
  nodeCompleted: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  nodeActive: {
    width: 82,
    height: 82,
    borderWidth: 7,
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primarySoft,
  },
  nodeLocked: {
    backgroundColor: '#D7DEE6',
  },
  nodeText: {
    color: Colors.light.ink,
    fontSize: 20,
    fontWeight: 800,
  },
  nodeTextActive: {
    color: '#FFFFFF',
  },
  activeMarker: {
    position: 'absolute',
    top: -30,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.ink,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    transform: [{ rotate: '0deg' }],
  },
  activeMarkerText: {
    color: '#FFFFFF',
  },
  connector: {
    position: 'absolute',
    top: -80,
    width: 96,
    height: 78,
  },
  connectorRight: {
    transform: [{ rotate: '19deg' }],
  },
  connectorLeft: {
    transform: [{ rotate: '-19deg' }],
  },
  dot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.borderStrong,
  },
  pressed: {
    opacity: 0.72,
  },
});
