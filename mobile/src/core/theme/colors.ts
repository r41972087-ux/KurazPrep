export const colors = {
  primary: '#0D7377',       // Deep Teal
  primaryLight: '#14A098',
  secondary: '#F0A500',     // Warm Amber
  secondaryDark: '#CF8D00',
  background: '#F7F9FC',    // Off-white/slate for soft contrast
  surface: '#FFFFFF',       // Card background
  text: '#2D3748',          // Slate Gray (softer than pure black)
  textMuted: '#718096',     // Light Gray
  border: '#E2E8F0',
  error: '#E53E3E',
  success: '#38A169',
  warning: '#DD6B20',
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0D7377', // Colored shadow for premium feel
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  }
};
