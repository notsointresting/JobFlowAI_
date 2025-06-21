import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const AnimatedView = Animated.createAnimatedComponent(View);

const Card = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
  ...props
}) => {
  const { colors: themeColors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  const getCardStyle = () => {
    const baseStyle = [
      styles.card,
      styles[padding],
      { backgroundColor: themeColors.surface },
    ];

    switch (variant) {
      case 'elevated':
        return [...baseStyle, shadows.large];
      case 'outlined':
        return [...baseStyle, styles.outlined, { borderColor: themeColors.border }];
      case 'filled':
        return [...baseStyle, { backgroundColor: themeColors.primary + '10' }];
      default:
        return [...baseStyle, shadows.medium];
    }
  };

  if (onPress) {
    return (
      <AnimatedView
        style={[animatedStyle, getCardStyle(), style]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        {...props}
      >
        {children}
      </AnimatedView>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  outlined: {
    borderWidth: 1,
  },
  
  // Padding variants
  none: {
    padding: 0,
  },
  small: {
    padding: spacing.sm,
  },
  medium: {
    padding: spacing.md,
  },
  large: {
    padding: spacing.lg,
  },
});

export default Card;