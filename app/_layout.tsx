import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormProvider } from '../context/FormContext';
import DisclaimerModal from '../components/DisclaimerModal';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const DISCLAIMER_SEEN_KEY = 'zakat_disclaimer_seen';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      checkFirstLaunch();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const checkFirstLaunch = async () => {
    try {
      const hasSeenDisclaimer = await AsyncStorage.getItem(DISCLAIMER_SEEN_KEY);
      if (!hasSeenDisclaimer) {
        setDisclaimerVisible(true);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleDisclaimerDismiss = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_SEEN_KEY, 'true');
      setDisclaimerVisible(false);
    } catch (error) {
      console.error('Error saving disclaimer state:', error);
      setDisclaimerVisible(false);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <FormProvider>
      <DisclaimerModal visible={disclaimerVisible} onDismiss={handleDisclaimerDismiss} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ title: 'Zakat Due' }} />
        <Stack.Screen
          name="reference/[id]"
          options={{ title: 'Reference' }}
        />
        <Stack.Screen name="about" options={{ title: 'About' }} />
      </Stack>
    </FormProvider>
  );
}
