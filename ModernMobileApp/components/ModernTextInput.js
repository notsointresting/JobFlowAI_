import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path as needed
import { FONTS, SIZES, SPACING, COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons'; // For clear button or password visibility toggle

const ModernTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  error,
  touched,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false, // Special handling for password fields
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  const hasError = touched && error;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const currentRightIcon = isPassword ? (
    <TouchableOpacity
      onPress={togglePasswordVisibility}
      style={styles.iconContainer}
      accessibilityRole="button"
      accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
    >
      <Ionicons
        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
        size={SIZES.h3}
        color={theme.colors.textGray}
      />
    </TouchableOpacity>
  ) : rightIcon ? (
    <TouchableOpacity
      onPress={onRightIconPress}
      style={styles.iconContainer}
      disabled={!onRightIconPress}
      // Assuming rightIcon itself would have accessibility props if it's interactive
    >
      {rightIcon}
    </TouchableOpacity>
  ) : null;

  return (
    <View style={[styles.outerContainer, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textGray}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={theme.COLORS.primary}
          {...props}
        />
        {currentRightIcon}
      </View>
      {hasError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  outerContainer: {
    marginBottom: SPACING.m,
    width: '100%',
  },
  label: {
    ...FONTS.body3,
    color: theme.colors.textGray,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs, // Slight indent for the label
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.isDarkMode ? COLORS.black : COLORS.white, // Slightly different from screen background
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: SPACING.s,
    minHeight: SIZES.base * 6, // Consistent height
  },
  inputContainerFocused: {
    borderColor: theme.COLORS.primary,
    shadowColor: theme.COLORS.primary, // Adding a subtle glow on focus
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2, // For Android focus effect
  },
  inputContainerError: {
    borderColor: theme.COLORS.error,
  },
  input: {
    flex: 1,
    ...FONTS.body2,
    color: theme.colors.text,
    paddingVertical: SPACING.s, // Ensure text is vertically centered
  },
  iconContainer: {
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...FONTS.caption,
    color: theme.COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default ModernTextInput;
