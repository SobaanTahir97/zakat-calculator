/**
 * Theme constants for Zakat Calculator
 * Islamic-appropriate color palette with professional, trustworthy aesthetics
 */

// Color Palette
export const colors = {
  // Primary - Islamic blue, deep and trustworthy
  primary: {
    main: '#1B5FA0',
    light: '#2E7ABF',
    dark: '#0F3B5C',
  },

  // Secondary - Sea green, represents growth and prosperity
  secondary: {
    main: '#2BA084',
    light: '#4ECDC4',
    dark: '#1A7A68',
  },

  // Accent - Warm taupe, authentic and grounded
  accent: {
    main: '#B8956A',
    light: '#D4B8A0',
    dark: '#8B6D47',
  },

  // Sage green - Calming secondary
  sage: {
    main: '#A8C5A5',
    light: '#C4DBC0',
    dark: '#7FA378',
  },

  // State colors
  state: {
    success: '#27AE60',
    error: '#E07856',
    warning: '#F39C12',
    info: '#3498DB',
  },

  // Text colors
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    tertiary: '#BDC3C7',
    light: '#ECF0F1',
  },

  // Background colors
  background: {
    main: '#FFFFFF',
    elevated: '#F8F7F2',
    surface: '#ECF0F1',
    dark: '#1A1A1A',
  },

  // Neutral grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Spacing scale (8px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

// Typography
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    '2xl': 32,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    mono: 'SpaceMono',
  },
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Complete theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

// Theme type for TypeScript
export type Theme = typeof theme;
