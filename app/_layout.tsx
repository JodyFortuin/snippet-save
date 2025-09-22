import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AppProvider } from '../context/AppContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <AppProvider>
        <SubscriptionProvider>
          <StatusBar style="auto" />
          <Stack 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'white' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="new-snippet" options={{ presentation: 'card' }} />
            <Stack.Screen name="snippet/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="category/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="favorites" options={{ presentation: 'card' }} />
            <Stack.Screen name="recent" options={{ presentation: 'card' }} />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          </Stack>
        </SubscriptionProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}