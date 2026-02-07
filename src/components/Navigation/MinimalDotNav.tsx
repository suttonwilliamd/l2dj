import React, { useState, useEffect, useRef } from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { BAND_VISUAL_SYSTEM } from '../../data/skillNodes';
import { useAccessibility } from '../Accessibility/AccessibilitySystem';

interface MinimalDotNavProps {
  className?: string;
  autoHide?: boolean;
  hideDelay?: number;
}

export const MinimalDotNav: React.FC<MinimalDotNavProps> = ({ 
  className = '', 
  autoHide = true,
  hideDelay = 5000 
}) => {
  const {
    currentSurface,
    setCurrentSurface,
    toggleSkillTree,
    toggleContextPanel,
    focusMode,
    toggleFocusMode
  } = useNavigationStore();

  const { announceToScreenReader, settings } = useAccessibility();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const surfaces = [
    { 
      id: 'play' as const, 
      band: 'manipulation' as const,
      label: 'Play',
      description: 'Practice DJ controls and mixing'
    },
    { 
      id: 'learn' as const, 
      band: 'perception' as const,
      label: 'Learn', 
      description: 'Explore skills and learning path'
    },
    { 
      id: 'context' as const, 
      band: 'intent' as const,
      label: 'Help',
      description: 'Get help and context information'
    }
  ];

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide || isHovered || focusMode) return;

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setIsVisible(true);
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Show on mount
    resetTimer();

    // Show on user interaction
    const handleUserActivity = () => resetTimer();
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoHide, hideDelay, isHovered, focusMode]);

  const handleSurfaceChange = (surfaceId: string, surfaceLabel: string) => {
    setCurrentSurface(surfaceId as any);
    announceToScreenReader(`Switched to ${surfaceLabel} surface`);
  };

  const getDotStyles = (surface: typeof surfaces[0]) => {
    const isActive = currentSurface === surface.id;
    const bandColors = BAND_VISUAL_SYSTEM[surface.band];
    
    return {
      backgroundColor: isActive ? bandColors.primary : '#4B5563',
      transform: isActive ? 'scale(1.5)' : 'scale(1)',
      boxShadow: isActive ? `0 0 15px ${bandColors.glow}` : 'none',
      transition: settings.reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  if (focusMode) return null; // Hide completely in focus mode

  return (
    <>
      {/* Minimal Dot Navigation */}
      <div
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-30 
          flex items-center space-x-3 
          bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-4 py-2
          transition-all duration-300 ease-out
          ${isVisible || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
        aria-label="Main navigation"
      >
        {surfaces.map((surface) => (
          <button
            key={surface.id}
            onClick={() => handleSurfaceChange(surface.id, surface.label)}
            className={`
              w-3 h-3 rounded-full cursor-pointer 
              hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-transparent
              ${currentSurface === surface.id ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''}
            `}
            style={getDotStyles(surface)}
            title={surface.description}
            aria-label={`${surface.label} surface: ${surface.description}`}
            aria-current={currentSurface === surface.id ? 'page' : undefined}
          />
        ))}
      </div>

      {/* Floating Action Controls */}
      <div
        className={`
          fixed top-4 right-4 z-30 
          flex items-center space-x-2
          bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-2 py-2
          transition-all duration-300 ease-out
          ${isVisible || isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
        `}
      >
        {/* Skill Tree Button */}
        <button
          onClick={toggleSkillTree}
          className="p-2 rounded text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          title="Open skill tree"
          aria-label="Open skill tree"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        {/* Context Panel Button */}
        <button
          onClick={toggleContextPanel}
          className="p-2 rounded text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          title="Toggle help panel"
          aria-label="Toggle help panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Focus Mode Button */}
        <button
          onClick={toggleFocusMode}
          className={`
            p-2 rounded transition-all duration-200
            ${focusMode 
              ? 'text-amber-400 bg-amber-400 bg-opacity-20' 
              : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
            }
          `}
          title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
          aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Mobile-specific bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black bg-opacity-80 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-around py-2">
          {surfaces.map((surface) => {
            const isActive = currentSurface === surface.id;
            const bandColors = BAND_VISUAL_SYSTEM[surface.band];
            
            return (
              <button
                key={surface.id}
                onClick={() => handleSurfaceChange(surface.id, surface.label)}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
                style={{
                  backgroundColor: isActive ? bandColors.primary : 'transparent',
                }}
                aria-label={`${surface.label} surface`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="w-2 h-2 rounded-full mb-1" style={{ 
                  backgroundColor: isActive ? 'white' : bandColors.primary 
                }} />
                <span className="text-xs font-medium">{surface.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>  
  );
};