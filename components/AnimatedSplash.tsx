import { useEffect } from 'react';
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
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { width } = useWindowDimensions();
  const logoSize = width * 0.35;

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(-90);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo fades and scales in with rotation
    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.cubic) }),
    );
    logoRotation.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) });

    // After logo settles, fade out the whole splash
    containerOpacity.value = withDelay(
      1200,
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
