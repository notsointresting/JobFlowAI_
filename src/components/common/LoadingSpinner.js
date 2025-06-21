import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../constants/theme';

const LoadingSpinner = ({ size = 40, color = colors.primary }) => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={[color, color + '40', 'transparent']}
          style={[styles.spinner, { width: size, height: size }]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  spinner: {
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
  },
});

export default LoadingSpinner;