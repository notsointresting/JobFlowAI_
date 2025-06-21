import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeContext } from '../App'; // Adjust path as needed
import { SPACING } from '../constants/theme';

const AnimatedLoadingIndicator = ({ size = 'large', style }) => {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={theme.isDarkMode ? theme.COLORS.white : theme.COLORS.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
  },
});

export default AnimatedLoadingIndicator;
