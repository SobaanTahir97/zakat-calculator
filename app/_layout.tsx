import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormProvider } from '../context/FormContext';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import DisclaimerModal from '../components/DisclaimerModal';
import AnimatedSplash from '../components/AnimatedSplash';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const DISCLAIMER_SEEN_KEY = 'zakat_disclaimer_seen';

function AppStack() {
  const { t } = useLanguage();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ title: t('nav.zakatDue') }} />
      <Stack.Screen name="reference/[id]" options={{ title: t('nav.reference') }} />
      <Stack.Screen name="about" options={{ title: t('nav.about') }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const checkFirstLaunch = async () => {
    try {
      const hasSeenDisclaimer = await AsyncStorage.getItem(DISCLAIMER_SEEN_KEY);
      if (!hasSeenDisclaimer) {
        setDisclaimerVisible(true);
      }
    } catch (e) {
      console.error('Error checking first launch:', e);
    }
  };

  const handleDisclaimerDismiss = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_SEEN_KEY, 'true');
      setDisclaimerVisible(false);
    } catch (e) {
      console.error('Error saving disclaimer state:', e);
      setDisclaimerVisible(false);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <LayoutInner
        disclaimerVisible={disclaimerVisible}
        onDisclaimerDismiss={handleDisclaimerDismiss}
        onReady={() => checkFirstLaunch()}
      />
    </LanguageProvider>
  );
}

function LayoutInner({
  disclaimerVisible,
  onDisclaimerDismiss,
  onReady,
}: {
  disclaimerVisible: boolean;
  onDisclaimerDismiss: () => void;
  onReady: () => void;
}) {
  const { languageLoaded } = useLanguage();
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(false);

  useEffect(() => {
    if (languageLoaded) {
      onReady();
      // Mount animated splash, then hide native splash on next frame
      // so the animated overlay is visible before the native one disappears
      setShowAnimatedSplash(true);
      requestAnimationFrame(() => SplashScreen.hideAsync());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- onReady is stable from parent, including it would cause infinite re-fire
  }, [languageLoaded]);

  const handleAnimatedSplashFinish = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  return (
    <FormProvider>
      <DisclaimerModal visible={disclaimerVisible} onDismiss={onDisclaimerDismiss} />
      <AppStack />
      {showAnimatedSplash && <AnimatedSplash onFinish={handleAnimatedSplashFinish} />}
    </FormProvider>
  );
}
