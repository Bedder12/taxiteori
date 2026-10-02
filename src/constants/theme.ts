/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#17201B',
    background: '#FAF7F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F1EA',
    backgroundElement: '#EDF5EC',
    backgroundSelected: '#DCEEDB',
    primary: '#3C8D63',
    primaryStrong: '#236344',
    primarySoft: '#DCEEDB',
    accent: '#D78A4A',
    border: '#E5E0D5',
    borderStrong: '#C9D8C7',
    success: '#2F7D57',
    danger: '#B45142',
    warning: '#9A6A22',
    textSecondary: '#637065',
  },
  dark: {
    text: '#F6F7F3',
    background: '#121511',
    surface: '#1B211C',
    surfaceMuted: '#242920',
    backgroundElement: '#1E2821',
    backgroundSelected: '#2C3A31',
    primary: '#78C99A',
    primaryStrong: '#A1DCB6',
    primarySoft: '#254331',
    accent: '#E2A467',
    border: '#31392F',
    borderStrong: '#4B6352',
    success: '#78C99A',
    danger: '#ED8A7C',
    warning: '#E7BD71',
    textSecondary: '#BAC5BC',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const Radii = {
  small: 10,
  medium: 16,
  large: 22,
  pill: 999,
} as const;

export const Shadows = {
  card: Platform.select({
    web: {
      boxShadow: '0 12px 32px rgba(34, 48, 38, 0.08)',
    },
    default: {
      shadowColor: '#223026',
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2,
    },
  }),
  floating: Platform.select({
    web: {
      boxShadow: '0 16px 40px rgba(34, 48, 38, 0.14)',
    },
    default: {
      shadowColor: '#223026',
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 4,
    },
  }),
} as const;

export const BottomTabInset = Platform.select({ ios: 72, android: 84 }) ?? 72;
export const MaxContentWidth = 560;
