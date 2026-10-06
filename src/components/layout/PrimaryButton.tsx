import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing } from '@/constants/theme';

type PrimaryButtonProps = PropsWithChildren<{
  disabled?: boolean;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}>;

export function PrimaryButton({ children, disabled, onPress, variant = 'primary' }: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={StyleSheet.flatten([styles.button, variant === 'secondary' && styles.secondary, disabled && styles.disabled])}>
      <ThemedText type="smallBold" style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  text: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: Colors.light.primarySoft,
  },
  secondaryText: {
    color: Colors.light.primaryStrong,
  },
  disabled: {
    opacity: 0.45,
  },
});
