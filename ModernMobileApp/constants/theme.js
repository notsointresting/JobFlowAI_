import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#0A7AFF', // Vibrant Blue
  secondary: '#34C759', // Fresh Green

  // Grays
  black: '#171717',
  white: '#FFFFFF',
  lightGray: '#F2F2F7', // Light mode background
  darkGray: '#1C1C1E',  // Dark mode background
  mediumGray: '#8E8E93',
  textGray: '#6E6E73',
  borderGray: '#D1D1D6',

  // Accents & Status
  error: '#FF3B30',
  warning: '#FFCC00',
  success: '#34C759', // Same as secondary for consistency here
  info: '#007AFF', // Similar to primary
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 16,
  padding2: 24,

  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 16,
  body1: 18,
  body2: 16,
  body3: 14,
  body4: 12,
  caption: 12,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium', fontSize: SIZES.h3, lineHeight: 26 },
  h4: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium', fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', fontSize: SIZES.body1, lineHeight: 24 },
  body2: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif', fontSize: SIZES.body2, lineHeight: 22 },
  body3: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light', fontSize: SIZES.body3, lineHeight: 20 },
  body4: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light', fontSize: SIZES.body4, lineHeight: 18 },
  caption: { fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light', fontSize: SIZES.caption, lineHeight: 16 },
};

export const SPACING = {
  xs: SIZES.base * 0.5, // 4
  s: SIZES.base,      // 8
  m: SIZES.base * 2,  // 16
  l: SIZES.base * 3,  // 24
  xl: SIZES.base * 4, // 32
  xxl: SIZES.base * 6, // 48
};

const appTheme = { COLORS, SIZES, FONTS, SPACING };

export default appTheme;
