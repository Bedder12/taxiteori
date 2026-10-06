import { Link, type Href, usePathname } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

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
  right?: ReactNode;
};

export function AppHeader({ description, eyebrow, meta, right, title }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerCopy}>
          {eyebrow ? <ThemedText type="smallBold" themeColor="textSecondary">{eyebrow}</ThemedText> : null}
          <ThemedText type="title" style={styles.headerTitle}>{title}</ThemedText>
        </View>
        {right ? <View style={styles.headerRight}>{right}</View> : null}
      </View>
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

type StatusBadgeProps = {
  label: string;
  tone?: 'primary' | 'neutral' | 'danger';
};

export function StatusBadge({ label, tone = 'primary' }: StatusBadgeProps) {
  return (
    <View style={[styles.statusBadge, tone === 'neutral' && styles.statusBadgeNeutral, tone === 'danger' && styles.statusBadgeDanger]}>
      <ThemedText type="smallBold" style={[styles.statusBadgeText, tone === 'neutral' && styles.statusBadgeTextNeutral, tone === 'danger' && styles.statusBadgeTextDanger]}>
        {label}
      </ThemedText>
    </View>
  );
}

type SearchFieldProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (value: string) => void;
};

export function SearchField({ onChangeText, placeholder = 'Sök', value }: SearchFieldProps) {
  return (
    <View style={styles.searchField}>
      <View style={styles.searchIcon} />
      <TextInput
        allowFontScaling={false}
        placeholder={placeholder}
        placeholderTextColor={palette.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
    </View>
  );
}

type IconButtonProps = PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel: string;
  tone?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
}>;

export function IconButton({ accessibilityLabel, children, onPress, style, tone = 'light' }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, tone === 'dark' && styles.iconButtonDark, pressed && styles.pressed, style]}>
      {children}
    </Pressable>
  );
}

type BottomNavProps = {
  active: 'home' | 'study' | 'exam' | 'book' | 'profile';
};

const bottomItems: { key: BottomNavProps['active']; label: string; icon: string; href: Href }[] = [
  { key: 'home', label: 'Hem', icon: 'H', href: '/' as Href },
  { key: 'study', label: 'Plugga', icon: 'P', href: '/plugga' as Href },
  { key: 'exam', label: 'Prov', icon: 'Q', href: '/prov' as Href },
  { key: 'book', label: 'Teoribok', icon: 'B', href: '/teoribok' as Href },
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
              <Pressable style={StyleSheet.flatten([styles.navItem, selected && styles.navItemActive])}>
                <NavGlyph name={item.key} active={selected} />
                <ThemedText type="smallBold" style={[styles.navText, selected && styles.navTextActive]}>{item.label}</ThemedText>
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
    borderRadius: 24,
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
    gap: Spacing.one,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.three,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  headerTitle: {
    fontWeight: 800,
  },
  headerRight: {
    paddingTop: Spacing.one,
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
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: palette.primarySoft,
  },
  statusBadgeNeutral: {
    backgroundColor: palette.surfaceMuted,
  },
  statusBadgeDanger: {
    backgroundColor: '#FDE7E2',
  },
  statusBadgeText: {
    color: palette.primaryStrong,
  },
  statusBadgeTextNeutral: {
    color: palette.textSecondary,
  },
  statusBadgeTextDanger: {
    color: palette.danger,
  },
  searchField: {
    minHeight: 54,
    borderRadius: Radii.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  searchIcon: {
    width: 15,
    height: 15,
    borderRadius: Radii.pill,
    borderWidth: 1.6,
    borderColor: palette.textSecondary,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 0,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  iconButtonDark: {
    backgroundColor: '#24262B',
    borderColor: '#3A3D45',
  },
  bottomNavWrap: {
    paddingTop: Spacing.four,
    width: '100%',
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: palette.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 6,
    flexDirection: 'row',
    gap: 2,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    ...Shadows.floating,
  },
  navItem: {
    flex: 1,
    minHeight: 44,
    borderRadius: 18,
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
  navText: {
    fontSize: 10,
    lineHeight: 12,
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
