import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { useAccessibility } from '../Accessibility/AccessibilitySystem';

interface TopNavigationProps {
  className?: string;
  id?: string;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ className = '', id }) => {
  const { 
    currentSurface, 
    setCurrentSurface, 
    toggleSkillTree, 
    toggleContextPanel,
    toggleFocusMode,
    focusMode 
  } = useNavigationStore();
  
  const { announceToScreenReader } = useAccessibility();

  const navItems = [
    { id: 'learn', label: 'Learn', icon: '📚' },
    { id: 'play', label: 'Play', icon: '🎧' },
    { id: 'context', label: 'Context', icon: '💡' },
  ] as const;

  return (
    <header id={id} className={`bg-gray-800 border-b border-gray-700 ${className}`}>
      <div className="container max-w-container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎵</div>
            <h1 className="text-xl font-bold text-white">L2DJ</h1>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSurface(item.id);
                  announceToScreenReader(`Switched to ${item.label} surface`);
                }}
                aria-label={`Switch to ${item.label} surface`}
                aria-current={currentSurface === item.id ? 'page' : undefined}
                className={`
                  px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors focus-visible
                  ${currentSurface === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center space-x-2">
            {/* Skill Tree Toggle */}
            <button
              onClick={toggleSkillTree}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title="Toggle Skill Tree"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>

            {/* Context Panel Toggle */}
            <button
              onClick={toggleContextPanel}
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title="Toggle Context Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Focus Mode Toggle */}
            <button
              onClick={toggleFocusMode}
              className={`
                p-2 rounded-lg transition-colors
                ${focusMode 
                  ? 'bg-amber-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
              title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Profile/Progress */}
            <button
              className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title="Progress & Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};