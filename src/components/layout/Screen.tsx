import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getLastPersistenceError } from '@/lib/learningStore';
import { ThemedText } from '@/components/themed-text';

type ScreenProps = PropsWithChildren<{
  header?: React.ReactNode;
}>;

export function Screen({ children, header }: ScreenProps) {
  const persistenceError = getLastPersistenceError();
  return (
    <ScrollView style={styles.screen}>
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
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  error: {
    backgroundColor: '#FFF4E5',
    borderRadius: 8,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
