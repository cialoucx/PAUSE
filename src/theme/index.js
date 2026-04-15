export const colors = {
  background: '#000000',
  backgroundElevated: '#050608',
  surface: 'rgba(18, 22, 28, 0.74)',
  surfaceStrong: 'rgba(25, 29, 36, 0.9)',
  surfaceSoft: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  textPrimary: '#F5F7FB',
  textSecondary: 'rgba(245, 247, 251, 0.72)',
  textTertiary: 'rgba(245, 247, 251, 0.46)',
  accent: '#66E0C2',
  accentStrong: '#44C9AA',
  accentSoft: 'rgba(102, 224, 194, 0.16)',
  danger: '#FF625A',
  warning: '#FFB864',
  success: '#72D78C',
  chartTrack: 'rgba(255, 255, 255, 0.06)',
  shadow: '#000000',
  tabInactive: 'rgba(245, 247, 251, 0.38)',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const radii = {
  sm: 16,
  md: 20,
  lg: 22,
  full: 999,
};

export const typography = {
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  largeTitle: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  headline: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  metric: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  timer: {
    fontSize: 54,
    lineHeight: 60,
    fontWeight: '700',
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 10,
  },
  dangerGlow: {
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
    elevation: 9,
  },
};

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};
