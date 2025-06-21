import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path as needed
import { FONTS, SIZES, SPACING, COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  gradientProps, // Allow passing custom gradient props e.g. { colors: ['#FF0000', '#00FF00'], start: {x: 0, y: 0}, end: {x: 1, y: 1} }
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const computedStyles = getStyles(theme, variant, size, disabled);

  const content = isLoading ? (
    <ActivityIndicator size="small" color={computedStyles.text.color} />
  ) : (
    <>
      {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
      <Text style={[computedStyles.text, textStyle]}>{title}</Text>
      {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
    </>
  );

  const ButtonComponent = (
    <TouchableOpacity
      style={[computedStyles.button, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

const getStyles = (theme, variant, size, disabled) => {
  let backgroundColor = theme.COLORS.primary;
  let textColor = theme.COLORS.white;
  let borderColor = 'transparent';
  let borderWidth = 0;

  switch (variant) {
    case 'secondary':
      backgroundColor = theme.COLORS.secondary;
      textColor = theme.COLORS.white;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = theme.isDarkMode ? theme.COLORS.white : theme.COLORS.primary;
      borderColor = theme.isDarkMode ? theme.COLORS.white : theme.COLORS.primary;
      borderWidth = 1;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = theme.isDarkMode ? theme.COLORS.lightGray : theme.COLORS.textGray;
      break;
    case 'danger':
      backgroundColor = theme.COLORS.error;
      textColor = theme.COLORS.white;
      break;
  }

  let paddingVertical = SPACING.s;
  let paddingHorizontal = SPACING.m;
  let fontSize = SIZES.body2;

  switch (size) {
    case 'small':
      paddingVertical = SPACING.xs;
      paddingHorizontal = SPACING.s;
      fontSize = SIZES.body3;
      break;
    case 'large':
      paddingVertical = SPACING.m;
      paddingHorizontal = SPACING.l;
      fontSize = SIZES.body1;
      break;
  }

  return StyleSheet.create({
    button: {
      backgroundColor: backgroundColor,
      paddingVertical: paddingVertical,
      paddingHorizontal: paddingHorizontal,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.5 : 1,
      borderWidth: borderWidth,
      borderColor: borderColor,
      minHeight: SIZES.base * 5.5, // Consistent height based on base
    },
    text: {
      ...FONTS.h4, // Using a slightly bolder font for buttons
      fontSize: fontSize,
      color: textColor,
      fontWeight: 'bold',
      marginHorizontal: leftIcon || rightIcon ? SPACING.xs : 0,
    },
  });
};

export default CustomButton;
