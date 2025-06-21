import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  leftIcon,
  rightIcon,
  multiline = false,
  style,
  inputStyle,
  ...props
}) => {
  const { colors: themeColors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  
  const focusAnimation = useSharedValue(0);
  const errorAnimation = useSharedValue(0);

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          isFocused || value ? -8 : 0,
          { duration: 200 }
        ),
      },
      {
        scale: withTiming(
          isFocused || value ? 0.85 : 1,
          { duration: 200 }
        ),
      },
    ],
    color: withTiming(
      isFocused ? themeColors.primary : themeColors.textSecondary,
      { duration: 200 }
    ),
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(
      error ? colors.error : isFocused ? themeColors.primary : themeColors.border,
      { duration: 200 }
    ),
    borderWidth: withTiming(isFocused ? 2 : 1, { duration: 200 }),
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0);
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Animated.Text style={[styles.label, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}
      
      <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: themeColors.textPrimary },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={themeColors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          multiline={multiline}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={toggleSecureEntry}
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </Animated.View>
      
      {error && (
        <Animated.Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    ...shadows.small,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default Input;