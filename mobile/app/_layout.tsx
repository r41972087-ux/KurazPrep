import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/core/store/authStore';
import { OfflineBanner } from '../src/components/OfflineBanner';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { syncQuizAttempts } from '../src/core/network/sync';

export default function RootLayout() {
  const loadTokens = useAuthStore((state) => state.loadTokens);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const init = async () => {
      await loadTokens();
      // Attempt to sync any offline quiz results to the backend
      syncQuizAttempts();
    };
    init();
  }, []);

  if (isLoading) {
    return null; // Or a splash screen
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <OfflineBanner />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="subject/[id]" options={{ title: 'Subject' }} />
          <Stack.Screen name="note/[id]" options={{ title: 'Note' }} />
          <Stack.Screen name="quiz/active" options={{ title: 'Quiz', presentation: 'fullScreenModal' }} />
          <Stack.Screen name="auth/login" options={{ title: 'Login', presentation: 'modal' }} />
          <Stack.Screen name="auth/register" options={{ title: 'Register', presentation: 'modal' }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
