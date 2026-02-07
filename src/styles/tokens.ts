/**
 * Design System Tokens for L2DJ - Professional DJ Controller Aesthetic
 * Inspired by Pioneer DDJ and Numark Mixtrack hardware
 */

// DJ Hardware Colors - Professional equipment palette
export const DJ_COLORS = {
  // Dark metal finishes
  metalDark: '#0A0A0F',
  metalMedium: '#14141A',
  metalLight: '#1E1E28',
  
  // Active control colors
  deckALight: '#00D4FF', // Cyan for Deck A
  deckALightDim: '#0088AA',
  deckBActive: '#FF4D4D', // Red for Deck B
  deckBActiveDim: '#AA3333',
  
  // Progress indicators
  progressGreen: '#00FF88',
  progressYellow: '#FFD700',
  progressRed: '#FF4444',
  
  // Status lights
  statusOn: '#00FF00',
  statusOff: '#333333',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#888899',
  textDim: '#444455',
  
  // Borders and accents
  borderLight: '#2A2A35',
  borderGlow: '#3A3A4A',
  
  // Surfaces
  surfaceDeck: '#0F0F18',
  surfaceControl: '#12121B',
  surfaceButton: '#1A1A25',
} as const;

// Band Colors - Subtle accent colors for skill tiers
export const BAND_COLORS = {
  perception: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#1890FF', // Primary blue
    600: '#096DD9',
    700: '#0050B3',
    800: '#003A8C',
    900: '#002766',
  },
  manipulation: {
    50: '#F6FFED',
    100: '#D9F7BE',
    200: '#B7EB8F',
    300: '#95DE64',
    400: '#73D13D',
    500: '#52C41A', // Primary green
    600: '#389E0D',
    700: '#237804',
    800: '#135200',
    900: '#092B00',
  },
  intent: {
    50: '#FFF7E6',
    100: '#FFE7BA',
    200: '#FFD591',
    300: '#FFC069',
    400: '#FFA940',
    500: '#FA8C16', // Primary orange
    600: '#D46B08',
    700: '#AD4E00',
    800: '#873800',
    900: '#612500',
  },
} as const;

// Semantic Colors
export const SEMANTIC_COLORS = {
  success: {
    bg: '#0A3320',
    border: '#00FF88',
    text: '#00FF88',
    light: '#E6FFF0',
  },
  error: {
    bg: '#331010',
    border: '#FF4444',
    text: '#FF6666',
    light: '#FFE6E6',
  },
  warning: {
    bg: '#332210',
    border: '#FFD700',
    text: '#FFD700',
    light: '#FFF8E6',
  },
  info: {
    bg: '#102040',
    border: '#00D4FF',
    text: '#00D4FF',
    light: '#E6F7FF',
  },
} as const;

// Neutral Colors
export const NEUTRAL_COLORS = {
  white: '#FFFFFF',
  50: '#F5F5F8',
  100: '#E8E8EC',
  200: '#D0D0D8',
  300: '#A0A0B0',
  400: '#707080',
  500: '#505060',
  600: '#404050',
  700: '#303040',
  800: '#202028',
  900: '#101018',
  950: '#050508',
} as const;

// Typography Scale - Optimized for readability
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
    condensed: ['Inter Tight', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1.2rem' }], // 12px
    sm: ['0.875rem', { lineHeight: '1.4rem' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem' }], // 16px
    lg: ['1.125rem', { lineHeight: '1.6rem' }], // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

// Spacing Scale
export const SPACING = {
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const;

// Border Radius
export const BORDER_RADIUS = {
  none: '0',
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadows - Hardware-inspired
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  glowCyan: '0 0 20px rgba(0, 212, 255, 0.4)',
  glowRed: '0 0 20px rgba(255, 77, 77, 0.4)',
  glowGreen: '0 0 20px rgba(0, 255, 136, 0.4)',
} as const;

// Transitions
export const TRANSITIONS = {
  instant: '50ms ease-out',
  fast: '150ms ease-out',
  base: '200ms ease-out',
  slow: '300ms ease-out',
  smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  bouncy: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Z-Index Scale
export const Z_INDEX = {
  base: 0,
  docked: 10,
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  overlay: 2000,
  toast: 3000,
} as const;

// Component-specific tokens for DJ hardware layout
export const DJ_COMPONENT_TOKENS = {
  // Deck dimensions (40% width each side)
  deck: {
    width: '40vw',
    gap: '20vw', // Space between decks
  },
  
  // Control dimensions
  jogWheel: {
    size: '160px', // Large touch-friendly size
    touchSize: '180px', // Touch target
  },
  
  playButton: {
    size: '72px', // Large circular button
    iconSize: '32px',
  },
  
  verticalFader: {
    width: '24px',
    height: '180px',
    trackWidth: '4px',
    thumbWidth: '32px',
    thumbHeight: '48px',
  },
  
  crossfader: {
    width: '60vw', // Spans between decks
    height: '180px',
    trackHeight: '6px',
    thumbWidth: '48px',
    thumbHeight: '56px',
  },
  
  // Navigation
  navItem: {
    size: '56px',
    iconSize: '24px',
  },
  
  // Buttons
  controlButton: {
    size: '48px',
    iconSize: '20px',
  },
  
  smallButton: {
    size: '36px',
    iconSize: '16px',
  },
} as const;

// Helper functions
export const getDJColor = (color: keyof typeof DJ_COLORS) => {
  return DJ_COLORS[color];
};

export const getBandColor = (band: keyof typeof BAND_COLORS, shade: '500' = '500') => {
  return BAND_COLORS[band][shade];
};

// CSS Custom Properties for theming
export const CSS_CUSTOM_PROPERTIES = `
  :root {
    /* DJ Hardware Colors */
    --metal-dark: ${DJ_COLORS.metalDark};
    --metal-medium: ${DJ_COLORS.metalMedium};
    --metal-light: ${DJ_COLORS.metalLight};
    
    --deck-a-light: ${DJ_COLORS.deckALight};
    --deck-a-dim: ${DJ_COLORS.deckALightDim};
    --deck-b-active: ${DJ_COLORS.deckBActive};
    --deck-b-dim: ${DJ_COLORS.deckBActiveDim};
    
    --progress-green: ${DJ_COLORS.progressGreen};
    --progress-yellow: ${DJ_COLORS.progressYellow};
    --progress-red: ${DJ_COLORS.progressRed};
    
    --status-on: ${DJ_COLORS.statusOn};
    --status-off: ${DJ_COLORS.statusOff};
    
    --text-primary: ${DJ_COLORS.textPrimary};
    --text-secondary: ${DJ_COLORS.textSecondary};
    --text-dim: ${DJ_COLORS.textDim};
    
    --border-light: ${DJ_COLORS.borderLight};
    --border-glow: ${DJ_COLORS.borderGlow};
    
    --surface-deck: ${DJ_COLORS.surfaceDeck};
    --surface-control: ${DJ_COLORS.surfaceControl};
    --surface-button: ${DJ_COLORS.surfaceButton};
    
    /* Band Colors */
    --band-perception-500: ${BAND_COLORS.perception[500]};
    --band-manipulation-500: ${BAND_COLORS.manipulation[500]};
    --band-intent-500: ${BAND_COLORS.intent[500]};
    
    /* Typography */
    --font-sans: ${TYPOGRAPHY.fontFamily.sans.join(', ')};
    --font-mono: ${TYPOGRAPHY.fontFamily.mono.join(', ')};
    --font-condensed: ${TYPOGRAPHY.fontFamily.condensed.join(', ')};
    
    /* Spacing */
    --spacing-4: ${SPACING[4]};
    --spacing-8: ${SPACING[8]};
    
    /* Transitions */
    --transition-instant: ${TRANSITIONS.instant};
    --transition-fast: ${TRANSITIONS.fast};
    --transition-base: ${TRANSITIONS.base};
    --transition-slow: ${TRANSITIONS.slow};
    --transition-smooth: ${TRANSITIONS.smooth};
    
    /* Component dimensions */
    --jog-wheel-size: ${DJ_COMPONENT_TOKENS.jogWheel.size};
    --play-button-size: ${DJ_COMPONENT_TOKENS.playButton.size};
    --vertical-fader-width: ${DJ_COMPONENT_TOKENS.verticalFader.width};
    --vertical-fader-height: ${DJ_COMPONENT_TOKENS.verticalFader.height};
  }
`;
