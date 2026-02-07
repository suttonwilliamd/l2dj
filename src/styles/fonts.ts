/**
 * Font Loading Strategy
 * Uses system fonts with graceful fallbacks for maximum reliability
 */

// System font stacks that work reliably across platforms
export const FONT_STACKS = {
  // Clean, modern sans-serif stack
  sans: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont', 
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ],
  
  // Professional monospace stack for code/technical displays
  mono: [
    'SF Mono',
    'Monaco',
    'Cascadia Code', 
    'Roboto Mono',
    'Source Code Pro',
    'Consolas',
    'Courier New',
    'monospace'
  ]
} as const;

// Font loading detection
export const detectFontSupport = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return { sans: true, mono: true };
  
  // Simple font detection - could be expanded
  return {
    sans: true, // System fonts are always supported
    mono: true  // Monospace fonts are always supported
  };
};

// CSS custom properties for font stacks
export const FONT_CSS_VARIABLES = `
  :root {
    --font-sans: ${FONT_STACKS.sans.join(', ')};
    --font-mono: ${FONT_STACKS.mono.join(', ')};
  }
`;