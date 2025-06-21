import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path
import { SPACING, FONTS } from '../constants/theme';

const SettingsScreen = ({ route }) => { // Added route prop
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For animation

  // Access passed parameters
  const params = route.params || {};
  const { source, time } = params;

  useEffect(() => {
    // Simple fade-in animation for the parameter text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>

      {source && time && (
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <Text style={styles.paramText}>
            Navigated from: {source} at {time}
          </Text>
        </Animated.View>
      )}

      <Text style={styles.settingItem}>Dark Mode: {theme.isDarkMode ? 'On' : 'Off'}</Text>
      <Text style={styles.settingItem}>Primary Color: {theme.COLORS.primary}</Text>
      <Text style={styles.settingItem}>Device Width: {theme.SIZES.width.toFixed(0)}px</Text>
      <Text style={styles.settingItem}>Current Font Scale: System Default</Text>
      {/* Add more settings options here */}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background,
    padding: SPACING.m,
  },
  title: {
    ...FONTS.h1,
    color: theme.colors.text,
    marginBottom: SPACING.l,
  },
  paramText: {
    ...FONTS.body3,
    color: theme.colors.textGray,
    marginBottom: SPACING.l,
    padding: SPACING.s,
    backgroundColor: theme.isDarkMode ? theme.COLORS.black : theme.COLORS.white,
    borderRadius: theme.SIZES.radius / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    textAlign: 'center',
    width: '100%',
  },
  settingItem: {
    ...FONTS.body1,
    color: theme.colors.text,
    marginBottom: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: StyleSheet.hairlineWidth, // Thinner border
    borderBottomColor: theme.colors.border,
    width: '100%'
  }
});

export default SettingsScreen;
