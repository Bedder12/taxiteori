import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { hydrateRuntimeState } from '@/lib/runtimeLearningState';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  useEffect(() => {
    void hydrateRuntimeState();
  }, []);

  const appTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      card: Colors.light.background,
      text: Colors.light.text,
      border: Colors.light.border,
      primary: Colors.light.primary,
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Plugga' }} />
        <Stack.Screen name="prov" options={{ title: 'Prov' }} />
        <Stack.Screen name="teoribok" options={{ title: 'Teoriboken' }} />
        <Stack.Screen name="profil" options={{ title: 'Profil' }} />
        <Stack.Screen name="exam/[examId]" options={{ title: 'Delprov' }} />
        <Stack.Screen name="subject/[subjectId]" options={{ title: 'Ämne' }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lektion' }} />
        <Stack.Screen name="quiz/[assessmentId]" options={{ title: 'Checkpoint' }} />
        <Stack.Screen name="result/[attemptId]" options={{ title: 'Resultat' }} />
      </Stack>
    </ThemeProvider>
  );
}
