import { Link, type Href, usePathname } from 'expo-router';
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
  tone?: 'primary' | 'light';
};

export function ProgressBar({ tone = 'primary', value }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%` as DimensionValue;
  return (
    <View style={[styles.progressTrack, tone === 'light' && styles.progressTrackLight]}>
      <View style={[styles.progressFill, tone === 'light' && styles.progressFillLight, { width }]} />
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
  const pathname = usePathname();
  return (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        {bottomItems.map((item) => {
          const selected = item.key === active || (item.href !== '/' && pathname.startsWith(String(item.href)));
          return (
            <Link key={item.key} href={item.href} asChild>
              <Pressable style={({ pressed }) => [styles.navItem, selected && styles.navItemActive, pressed && styles.pressed]}>
                <NavGlyph name={item.key} active={selected} />
                <ThemedText type="smallBold" style={selected && styles.navTextActive}>{item.label}</ThemedText>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function NavGlyph({ active, name }: { active: boolean; name: BottomNavProps['active'] }) {
  const color = active ? Colors.light.primaryStrong : Colors.light.textSecondary;
  return (
    <View style={styles.glyph} accessibilityElementsHidden>
      {name === 'home' ? <View style={[styles.homeRoof, { borderColor: color }]} /> : null}
      {name === 'home' ? <View style={[styles.homeBase, { borderColor: color }]} /> : null}
      {name === 'study' ? <View style={[styles.bookLeft, { borderColor: color }]} /> : null}
      {name === 'study' ? <View style={[styles.bookRight, { borderColor: color }]} /> : null}
      {name === 'exam' ? <View style={[styles.examPage, { borderColor: color }]} /> : null}
      {name === 'exam' ? <View style={[styles.examCheck, { backgroundColor: color }]} /> : null}
      {name === 'book' ? <View style={[styles.barOne, { backgroundColor: color }]} /> : null}
      {name === 'book' ? <View style={[styles.barTwo, { backgroundColor: color }]} /> : null}
      {name === 'book' ? <View style={[styles.barThree, { backgroundColor: color }]} /> : null}
      {name === 'profile' ? <View style={[styles.profileHead, { borderColor: color }]} /> : null}
      {name === 'profile' ? <View style={[styles.profileBody, { borderColor: color }]} /> : null}
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
    padding: Spacing.four,
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
  progressTrackLight: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.pill,
    backgroundColor: palette.primary,
  },
  progressFillLight: {
    backgroundColor: '#FFFFFF',
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
    paddingTop: Spacing.four,
  },
  bottomNav: {
    backgroundColor: palette.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 6,
    flexDirection: 'row',
    gap: 2,
    ...Shadows.floating,
  },
  navItem: {
    flex: 1,
    minHeight: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  navItemActive: {
    backgroundColor: palette.primarySoft,
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
  glyph: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    width: 12,
    height: 12,
    borderLeftWidth: 1.8,
    borderTopWidth: 1.8,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 3,
  },
  homeBase: {
    width: 12,
    height: 10,
    borderWidth: 1.8,
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 3,
    borderRadius: 2,
  },
  bookLeft: {
    width: 8,
    height: 14,
    borderWidth: 1.8,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    position: 'absolute',
    left: 3,
  },
  bookRight: {
    width: 8,
    height: 14,
    borderWidth: 1.8,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    position: 'absolute',
    right: 3,
  },
  examPage: {
    width: 13,
    height: 16,
    borderWidth: 1.8,
    borderRadius: 3,
  },
  examCheck: {
    width: 6,
    height: 2,
    borderRadius: 2,
    position: 'absolute',
    top: 9,
  },
  barOne: {
    width: 2,
    height: 14,
    borderRadius: 2,
    position: 'absolute',
    left: 5,
  },
  barTwo: {
    width: 2,
    height: 11,
    borderRadius: 2,
    position: 'absolute',
    left: 10,
    top: 6,
  },
  barThree: {
    width: 2,
    height: 15,
    borderRadius: 2,
    position: 'absolute',
    left: 15,
    top: 3,
  },
  profileHead: {
    width: 7,
    height: 7,
    borderWidth: 1.8,
    borderRadius: 999,
    position: 'absolute',
    top: 3,
  },
  profileBody: {
    width: 14,
    height: 7,
    borderWidth: 1.8,
    borderRadius: 999,
    position: 'absolute',
    bottom: 3,
  },
});
