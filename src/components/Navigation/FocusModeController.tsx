import React, { useEffect } from 'react';
import { create } from 'zustand';
import { useAccessibility } from '../Accessibility/AccessibilitySystem';

interface FocusModeState {
  level: 0 | 1 | 2 | 3; // 0 = normal, 3 = immersive
  isActive: boolean;
  autoActivate: boolean;
  persistentSettings: boolean;
  quickExit: boolean;
  enterLevel: (level: number) => void;
  exitLevel: () => void;
  incrementLevel: () => void;
  decrementLevel: () => void;
  toggleAutoActivate: () => void;
  togglePersistentSettings: () => void;
  toggleQuickExit: () => void;
}

export const useFocusModeStore = create<FocusModeState>((set, get) => ({
  level: 0,
  isActive: false,
  autoActivate: true,
  persistentSettings: true,
  quickExit: true,

  enterLevel: (level: number) => {
    const validLevel = Math.max(0, Math.min(3, level)) as 0 | 1 | 2 | 3;
    set({ 
      level: validLevel, 
      isActive: validLevel > 0 
    });
    
    // Apply CSS classes for styling
    document.body.classList.remove('focus-level-1', 'focus-level-2', 'focus-level-3');
    if (validLevel > 0) {
      document.body.classList.add(`focus-level-${validLevel}`);
    }
  },

  exitLevel: () => {
    set({ level: 0, isActive: false });
    document.body.classList.remove('focus-level-1', 'focus-level-2', 'focus-level-3');
  },

  incrementLevel: () => {
    const currentLevel = get().level;
    const nextLevel = Math.min(3, currentLevel + 1) as 0 | 1 | 2 | 3;
    get().enterLevel(nextLevel);
  },

  decrementLevel: () => {
    const currentLevel = get().level;
    const prevLevel = Math.max(0, currentLevel - 1) as 0 | 1 | 2 | 3;
    get().enterLevel(prevLevel);
  },

  toggleAutoActivate: () => set((state) => ({ autoActivate: !state.autoActivate })),
  togglePersistentSettings: () => set((state) => ({ persistentSettings: !state.persistentSettings })),
  toggleQuickExit: () => set((state) => ({ quickExit: !state.quickExit })),
}));

// Focus Mode Controller Component
interface FocusModeControllerProps {
  children: React.ReactNode;
}

export const FocusModeController: React.FC<FocusModeControllerProps> = ({ children }) => {
  const { 
    level, 
    isActive, 
    enterLevel, 
    exitLevel 
  } = useFocusModeStore();
  
  const { announceToScreenReader } = useAccessibility();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick exit with Escape
      if (e.key === 'Escape' && isActive) {
        e.preventDefault();
        exitLevel();
        announceToScreenReader('Exited focus mode');
        return;
      }

      // Focus mode activation with Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.shiftKey) {
        e.preventDefault();
        if (isActive) {
          exitLevel();
          announceToScreenReader('Exited focus mode');
        } else {
          enterLevel(1);
          announceToScreenReader('Entered focus mode level 1');
        }
        return;
      }

      // Cycle through focus levels with Ctrl/Cmd + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (level >= 3) {
          exitLevel();
          announceToScreenReader('Exited focus mode');
        } else {
          const nextLevel = level + 1 as 1 | 2 | 3;
          enterLevel(nextLevel);
          announceToScreenReader(`Entered focus mode level ${nextLevel}`);
        }
        return;
      }

      // Increment/decrement with arrow keys when in focus mode
      if (isActive) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          incrementLevel();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          decrementLevel();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, level, enterLevel, exitLevel, announceToScreenReader]);

  const incrementLevel = () => {
    const store = useFocusModeStore.getState();
    store.incrementLevel();
    announceToScreenReader(`Focus mode level ${store.level}`);
  };

  const decrementLevel = () => {
    const store = useFocusModeStore.getState();
    store.decrementLevel();
    announceToScreenReader(`Focus mode level ${store.level}`);
  };

  return <>{children}</>;
};

// Focus Mode Indicator Component
export const FocusModeIndicator: React.FC = () => {
  const { level, isActive } = useFocusModeStore();

  if (!isActive) return null;

  const getLevelDescription = () => {
    switch (level) {
      case 1: return 'Basic Focus';
      case 2: return 'Deep Focus';
      case 3: return 'Immersive Focus';
      default: return 'Focus Mode';
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-purple-500';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
      <div className={`
        ${getLevelColor()} text-white px-3 py-1 rounded-full text-sm font-medium
        flex items-center space-x-2 shadow-lg
      `}>
        <div className="flex space-x-1">
          {[1, 2, 3].map((l) => (
            <div
              key={l}
              className={`w-2 h-2 rounded-full ${
                l <= level ? 'bg-white' : 'bg-white bg-opacity-30'
              }`}
            />
          ))}
        </div>
        <span>{getLevelDescription()}</span>
        <span className="text-xs opacity-75">(ESC to exit)</span>
      </div>
    </div>
  );
};

// Focus Mode Settings Component
export const FocusModeSettings: React.FC = () => {
  const {
    autoActivate,
    persistentSettings,
    quickExit,
    toggleAutoActivate,
    togglePersistentSettings,
    toggleQuickExit
  } = useFocusModeStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Focus Mode Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
          <div>
            <div className="font-medium text-white">Auto-activate</div>
            <div className="text-sm text-gray-400">Automatically enter focus mode during exercises</div>
          </div>
          <input
            type="checkbox"
            checked={autoActivate}
            onChange={toggleAutoActivate}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
          <div>
            <div className="font-medium text-white">Persistent settings</div>
            <div className="text-sm text-gray-400">Remember focus mode preferences</div>
          </div>
          <input
            type="checkbox"
            checked={persistentSettings}
            onChange={togglePersistentSettings}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
          <div>
            <div className="font-medium text-white">Quick exit</div>
            <div className="text-sm text-gray-400">Exit focus mode with single key press</div>
          </div>
          <input
            type="checkbox"
            checked={quickExit}
            onChange={toggleQuickExit}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <h4 className="font-medium text-white mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-1 text-sm text-gray-400">
          <div>Ctrl/Cmd + F - Toggle focus mode</div>
          <div>Ctrl/Cmd + Shift + F - Cycle focus levels</div>
          <div>↑/↓ - Adjust focus level (when active)</div>
          <div>ESC - Exit focus mode</div>
        </div>
      </div>
    </div>
  );
};

// CSS for focus mode levels
export const FocusModeStyles: React.FC = () => (
  <style>{`
    /* Focus Level 1: Basic Focus */
    body.focus-level-1 .minimal-dot-nav {
      opacity: 0.3;
      transform: translateY(-10px);
    }
    
    body.focus-level-1 .context-panel,
    body.focus-level-1 .skill-tree-panel {
      opacity: 0.7;
      transform: translateX(20px);
    }
    
    body.focus-level-1 .top-navigation {
      opacity: 0.5;
      transform: translateY(-20px);
    }
    
    /* Focus Level 2: Deep Focus */
    body.focus-level-2 .minimal-dot-nav,
    body.focus-level-2 .context-panel,
    body.focus-level-2 .skill-tree-panel,
    body.focus-level-2 .top-navigation {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-20px);
    }
    
    body.focus-level-2 .hardware-controls {
      box-shadow: 0 0 50px rgba(0,0,0,0.5);
    }
    
    /* Focus Level 3: Immersive Focus */
    body.focus-level-3 *:not(.hardware-controls):not(.focus-mode-indicator):not(:has(.hardware-controls)) {
      opacity: 0;
      pointer-events: none;
    }
    
    body.focus-level-3 .hardware-controls {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
    }
    
    body.focus-level-3 .focus-mode-indicator {
      opacity: 1;
    }
    
    /* Smooth transitions for all focus changes */
    body {
      transition: all 0.3s ease-out;
    }
    
    body * {
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
  `}</style>
);