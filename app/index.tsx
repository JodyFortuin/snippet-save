import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setHasCompletedOnboarding(!!onboardingComplete);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    }

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  // Redirect to onboarding if not completed, otherwise go to tabs
  return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/onboarding"} />;
}