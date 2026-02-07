import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  showTooltips: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  announceToScreenReader: (message: string) => void;
  focusElement: (selector: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    showTooltips: true,
    colorBlindMode: 'none',
  });

  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  // Apply CSS classes based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all accessibility classes first
    root.classList.remove('reduced-motion', 'high-contrast', 'large-text', 'screen-reader-mode');
    
    // Add classes based on settings
    if (settings.reducedMotion) root.classList.add('reduced-motion');
    if (settings.highContrast) root.classList.add('high-contrast');
    if (settings.largeText) root.classList.add('large-text');
    if (settings.screenReader) root.classList.add('screen-reader-mode');
    
    // Apply color blind mode
    root.setAttribute('data-color-blind', settings.colorBlindMode);
  }, [settings]);

  // Detect system preferences
  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
    };

    const updateSettingFromSystem = (key: keyof AccessibilitySettings, mq: MediaQueryList) => {
      if (mq.matches) {
        setSettings(prev => ({ ...prev, [key]: true }));
      }
    };

    // Check initial values
    Object.entries(mediaQueries).forEach(([key, mq]) => {
      updateSettingFromSystem(key as keyof AccessibilitySettings, mq);
    });

    // Listen for changes
    const listeners = Object.entries(mediaQueries).map(([key, mq]) => {
      const handler = () => updateSettingFromSystem(key as keyof AccessibilitySettings, mq);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    });

    return () => listeners.forEach(cleanup => cleanup());
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const announceToScreenReader = useCallback((message: string) => {
    setScreenReaderAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setScreenReaderAnnouncement(''), 100);
  }, []);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      announceToScreenReader(`Focused on ${element.textContent || element.tagName}`);
    }
  }, [announceToScreenReader]);

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      toggleSetting,
      announceToScreenReader,
      focusElement,
    }}>
      {children}
      
      {/* Screen reader announcements */}
      {settings.screenReader && (
        <div 
          className="sr-only" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {screenReaderAnnouncement}
        </div>
      )}
    </AccessibilityContext.Provider>
  );
};

// Focus Mode Hook
export const useFocusMode = () => {
  const { updateSetting } = useAccessibility();
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = useCallback(() => {
    const newFocusMode = !isFocusMode;
    setIsFocusMode(newFocusMode);
    
    if (newFocusMode) {
      // Enable focus mode settings
      updateSetting('reducedMotion', true);
      updateSetting('showTooltips', false);
      document.body.classList.add('focus-mode');
    } else {
      // Restore user preferences
      document.body.classList.remove('focus-mode');
    }
  }, [isFocusMode, updateSetting]);

  return {
    isFocusMode,
    toggleFocusMode,
  };
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = () => {
  const { settings, announceToScreenReader } = useAccessibility();

  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle global keyboard shortcuts
      switch (event.key) {
        case 'Escape':
          // Return to main surface
          announceToScreenReader('Returned to main surface');
          break;
        
        case 'Tab': {
          // Let default tab behavior work, but announce focus changes
          setTimeout(() => {
            const focused = document.activeElement;
            if (focused) {
              announceToScreenReader(`Focused on ${focused.textContent || focused.tagName}`);
            }
          }, 100);
          break;
        }
        
        case 'F6': {
          // Cycle between main areas
          event.preventDefault();
          const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);
          const nextIndex = (currentIndex + 1) % focusableElements.length;
          (focusableElements[nextIndex] as HTMLElement)?.focus();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, announceToScreenReader]);
};

// Accessibility Panel Component
export const AccessibilityPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { settings, updateSetting, toggleSetting } = useAccessibility();

  const settingDescriptions = {
    reducedMotion: 'Reduce animations and motion effects',
    highContrast: 'Increase color contrast for better visibility',
    largeText: 'Use larger text sizes',
    screenReader: 'Enable screen reader optimizations',
    keyboardNavigation: 'Enhance keyboard navigation',
    showTooltips: 'Show helpful tooltips and hints',
  };

  return (
    <div className={`accessibility-panel p-4 bg-gray-800 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Accessibility Settings</h3>
      
      <div className="space-y-3">
        {Object.entries(settingDescriptions).map(([key, description]) => {
          const settingKey = key as keyof AccessibilitySettings;
          const isEnabled = settings[settingKey];
          
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 cursor-pointer">
                  {description}
                </label>
              </div>
              <button
                onClick={() => toggleSetting(settingKey)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          );
        })}
        
        {/* Color blind mode selector */}
        <div className="pt-3 border-t border-gray-700">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Color Blind Mode
          </label>
          <select
            value={settings.colorBlindMode}
            onChange={(e) => updateSetting('colorBlindMode', e.target.value as AccessibilitySettings['colorBlindMode'])}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (red-blind)</option>
            <option value="deuteranopia">Deuteranopia (green-blind)</option>
            <option value="tritanopia">Tritanopia (blue-blind)</option>
          </select>
        </div>
      </div>
    </div>
  );
};