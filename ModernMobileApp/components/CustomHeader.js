import React, { useContext } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path as needed
import { SIZES, FONTS, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Assuming you'll use Expo's vector icons

const CustomHeader = ({ title, navigation, canGoBack }) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`Header: ${title}`}
    >
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen"
        >
          <Ionicons
            name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
            size={SIZES.h2}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {/* Placeholder for right-side actions if needed */}
      <View style={styles.rightPlaceholder} />
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 100 : 60, // Taller for iOS to account for notch area
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // Padding for status bar / notch
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card, // Use card color for header background
    paddingHorizontal: SPACING.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    // Shadow for Android (iOS shadow is usually handled by navigation library or custom)
    elevation: Platform.OS === 'android' ? 4 : 0,
    // For iOS shadow, you might need a shadow view wrapper or different styling
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0, // Subtle shadow for iOS
    shadowRadius: Platform.OS === 'ios' ? 3 : 0,
  },
  title: {
    ...FONTS.h3,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  backButton: {
    paddingRight: SPACING.s, // Ensure enough tap area
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.h1, // Make it a square for easier tapping
    height: '100%',
  },
  rightPlaceholder: {
    width: SIZES.h1, // To balance the back button if present, or for future icons
  }
});

export default CustomHeader;
