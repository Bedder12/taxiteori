import { Link, type Href } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

type AppCardProps = PropsWithChildren<{
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, muted, style }: AppCardProps) {
  return <View style={[styles.card, muted && styles.mutedCard, style]}>{children}</View>;
}

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
};

export function AppHeader({ description, eyebrow, meta, title }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {eyebrow ? <ThemedText type="smallBold" themeColor="primary">{eyebrow}</ThemedText> : null}
      <ThemedText type="title">{title}</ThemedText>
      {description ? <ThemedText themeColor="textSecondary">{description}</ThemedText> : null}
      {meta ? <ThemedText type="small" themeColor="textSecondary">{meta}</ThemedText> : null}
    </View>
  );
}

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%` as DimensionValue;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width }]} />
    </View>
  );
}

type StatPillProps = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'warning';
};

export function StatPill({ label, tone = 'default', value }: StatPillProps) {
  return (
    <View style={[styles.statPill, tone === 'success' && styles.successPill, tone === 'warning' && styles.warningPill]}>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

type BottomNavProps = {
  active: 'home' | 'study' | 'exam' | 'book' | 'profile';
};

const bottomItems: { key: BottomNavProps['active']; label: string; icon: string; href: Href }[] = [
  { key: 'home', label: 'Hem', icon: 'H', href: '/' as Href },
  { key: 'study', label: 'Plugga', icon: 'P', href: '/' as Href },
  { key: 'exam', label: 'Prov', icon: 'Q', href: '/prov' as Href },
  { key: 'book', label: 'Boken', icon: 'B', href: '/teoribok' as Href },
  { key: 'profile', label: 'Profil', icon: 'M', href: '/profil' as Href },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        {bottomItems.map((item) => {
          const selected = item.key === active;
          return (
            <Link key={item.key} href={item.href} asChild>
              <Pressable style={({ pressed }) => [styles.navItem, selected && styles.navItemActive, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={[styles.navIcon, selected && styles.navTextActive]}>{item.icon}</ThemedText>
                <ThemedText type="smallBold" style={selected && styles.navTextActive}>{item.label}</ThemedText>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

export function Section({ children }: PropsWithChildren) {
  return <View style={styles.section}>{children}</View>;
}

const palette = Colors.light;

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: Radii.large,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: palette.border,
    ...Shadows.card,
  },
  mutedCard: {
    backgroundColor: palette.surfaceMuted,
  },
  header: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radii.pill,
    overflow: 'hidden',
    backgroundColor: palette.backgroundElement,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.pill,
    backgroundColor: palette.primary,
  },
  statPill: {
    minWidth: 96,
    flex: 1,
    borderRadius: Radii.medium,
    padding: Spacing.three,
    backgroundColor: palette.surfaceMuted,
    gap: Spacing.one,
  },
  successPill: {
    backgroundColor: palette.primarySoft,
  },
  warningPill: {
    backgroundColor: '#FFF2DF',
  },
  bottomNavWrap: {
    paddingTop: Spacing.three,
  },
  bottomNav: {
    backgroundColor: palette.surface,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: palette.border,
    padding: Spacing.one,
    flexDirection: 'row',
    gap: Spacing.one,
    ...Shadows.floating,
  },
  navItem: {
    flex: 1,
    minHeight: 56,
    borderRadius: Radii.medium,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  navItemActive: {
    backgroundColor: palette.primarySoft,
  },
  navIcon: {
    lineHeight: 18,
  },
  navTextActive: {
    color: palette.primaryStrong,
  },
  pressed: {
    opacity: 0.72,
  },
  section: {
    gap: Spacing.three,
  },
});
