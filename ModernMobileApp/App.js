import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import appTheme, { COLORS } from './constants/theme'; // Removed unused SIZES, FONTS, SPACING
import AppNavigator from './navigation/AppNavigator';

// Simple Theme Context
export const ThemeContext = React.createContext();

export default function App() {
  const colorScheme = useColorScheme(); // 'light', 'dark', or null
  const isDarkMode = colorScheme === 'dark';

  const theme = {
    ...appTheme,
    isDarkMode,
    colors: {
      ...appTheme.COLORS,
      background: isDarkMode ? COLORS.darkGray : COLORS.lightGray,
      text: isDarkMode ? COLORS.white : COLORS.black,
      card: isDarkMode ? COLORS.black : COLORS.white, // Used by CustomHeader
      border: isDarkMode ? COLORS.mediumGray : COLORS.borderGray, // Used by CustomHeader
      primary: appTheme.COLORS.primary, // Ensure primary is passed through
      notification: isDarkMode ? COLORS.darkGray : COLORS.lightGray, // for NavigationContainer theme
    },
  };

  // React Navigation theme
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

// No more global styles here as App.js is now mostly for setup.
// Screen-specific styles are in their respective files.
// Component-specific styles (like CustomHeader) are in their files.
