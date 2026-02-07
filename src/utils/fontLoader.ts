/**
 * Font Loading Utilities
 * Ensures smooth font loading experience
 */

export class FontLoader {

  /**
   * Check if fonts are loaded and ready
   */
  static areFontsReady(): boolean {
    return document.fonts.status === 'loaded';
  }

  /**
   * Wait for fonts to be ready
   */
  static async waitForFonts(): Promise<void> {
    if (this.areFontsReady()) return;
    
    return new Promise((resolve) => {
      if (document.fonts.status === 'loaded') {
        resolve();
        return;
      }

      document.fonts.ready.then(() => {
        resolve();
      });
    });
  }

  /**
   * Add font loading class to body
   */
  static initializeFontLoading(): void {
    // Add loading class immediately
    document.body.classList.add('fonts-loading');
    
    // Remove loading class when fonts are ready
    this.waitForFonts().then(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-loaded');
    });
  }

  /**
   * Get current font loading status
   */
  static getFontStatus(): 'loading' | 'loaded' | 'error' {
    if (document.body.classList.contains('fonts-loaded')) return 'loaded';
    if (document.body.classList.contains('fonts-loading')) return 'loading';
    return 'error';
  }
}