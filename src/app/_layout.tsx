import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Plugga' }} />
        <Stack.Screen name="exam/[examId]" options={{ title: 'Delprov' }} />
        <Stack.Screen name="subject/[subjectId]" options={{ title: 'Amne' }} />
        <Stack.Screen name="lesson/[lessonId]" options={{ title: 'Lektion' }} />
        <Stack.Screen name="quiz/[assessmentId]" options={{ title: 'Checkpoint' }} />
        <Stack.Screen name="result/[attemptId]" options={{ title: 'Resultat' }} />
      </Stack>
    </ThemeProvider>
  );
}
