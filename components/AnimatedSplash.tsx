import { useCallback, useEffect, useRef } from 'react';
import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { borderRadius } from '../constants/theme';

interface AnimatedSplashProps {
  onFinish: () => void;
  onReady?: () => void;
}

export default function AnimatedSplash({ onFinish, onReady }: AnimatedSplashProps) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.35, 240);
  const readyFired = useRef(false);

  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(1);
  const logoRotation = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  const handleBackgroundLoad = useCallback(() => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  }, [onReady]);

  useEffect(() => {
    // Logo starts at full size (matching native splash), does a subtle pulse
    logoScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.08, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 250, easing: Easing.inOut(Easing.cubic) }),
      ),
    );

    // After pulse settles, fade out the whole splash
    containerOpacity.value = withDelay(
      1000,
      withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount; shared values and onFinish are stable refs
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Image
        source={require('../assets/images/splash-icon.png')}
        style={styles.background}
        resizeMode="cover"
        onLoad={handleBackgroundLoad}
      />
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('../assets/images/icon.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    borderRadius: borderRadius.full,
  },
});
