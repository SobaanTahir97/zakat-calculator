/**
 * Theme constants for Zakat Calculator.
 * Warm-paper palette with high contrast and neutral surfaces.
 */

export const colors = {
  primary: {
    main: '#2B5D66',
    light: '#4A7A82',
    dark: '#1D3F46',
  },

  secondary: {
    main: '#8A6A45',
    light: '#B28E64',
    dark: '#6B4F33',
    soft: '#E8DBC9',
  },

  accent: {
    main: '#C58940',
    light: '#DAA560',
    dark: '#9F6D31',
  },

  state: {
    success: '#2E7D32',
    error: '#B54745',
    warning: '#C47F00',
    info: '#2F6FA9',
  },

  text: {
    primary: '#1F2933',
    secondary: '#4D5B66',
    tertiary: '#7B8794',
    light: '#FFFFFF',
  },

  background: {
    main: '#F4F1EA',
    elevated: '#FFFFFF',
    surface: '#F8F5EF',
    dark: '#1A1A1A',
  },

  gray: {
    50: '#F7F7F7',
    100: '#F0F1F2',
    200: '#D9DEE2',
    300: '#BEC6CC',
    400: '#9AA5AE',
    500: '#7B8794',
    600: '#616E7C',
    700: '#52606D',
    800: '#3E4C59',
    900: '#323F4B',
  },
};

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
    // React Native expects absolute lineHeight values, not multipliers.
    tight: 18,
    normal: 22,
    relaxed: 26,
  },

  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    mono: 'SpaceMono',
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
