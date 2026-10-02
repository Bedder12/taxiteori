import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors, MaxContentWidth, Radii, Spacing } from '@/constants/theme';
import { getPersistenceError } from '@/lib/persistenceStatus';

type ScreenProps = PropsWithChildren<{
  header?: React.ReactNode;
}>;

export function Screen({ children, header }: ScreenProps) {
  const persistenceError = getPersistenceError();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <SafeAreaView style={styles.container}>
        {header ? <View style={styles.header}>{header}</View> : null}
        {persistenceError ? (
          <View style={styles.error}>
            <ThemedText>Synkroniseringen misslyckades.</ThemedText>
            <ThemedText themeColor="textSecondary">Försök igen. Ditt lokala utkast finns kvar.</ThemedText>
          </View>
        ) : null}
        {children}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  error: {
    backgroundColor: '#FFF4E5',
    borderRadius: Radii.medium,
    padding: Spacing.four,
    gap: Spacing.one,
  },
});
