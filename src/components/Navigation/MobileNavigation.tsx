import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { BAND_VISUAL_SYSTEM } from '../../data/skillNodes';
import { useAccessibility } from '../Accessibility/AccessibilitySystem';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const {
    currentSurface,
    setCurrentSurface,
    toggleSkillTree,
    toggleContextPanel,
    focusMode,
    toggleFocusMode
  } = useNavigationStore();

  const { announceToScreenReader } = useAccessibility();
  const [isSwipeMenuOpen, setIsSwipeMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const surfaces = [
    { 
      id: 'play' as const, 
      band: 'manipulation' as const,
      label: 'Play',
      icon: '🎧',
      description: 'Practice DJ controls'
    },
    { 
      id: 'learn' as const, 
      band: 'perception' as const,
      label: 'Learn', 
      icon: '📚',
      description: 'Explore skills'
    },
    { 
      id: 'context' as const, 
      band: 'intent' as const,
      label: 'Help',
      icon: '💡',
      description: 'Get help and context'
    }
  ];

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isSignificantSwipe = Math.abs(deltaX) > 50;

    if (isHorizontalSwipe && isSignificantSwipe) {
      const currentSurfaceIndex = surfaces.findIndex(s => s.id === currentSurface);
      
      if (deltaX > 0) {
        // Swipe right - go to previous surface
        const prevIndex = currentSurfaceIndex > 0 ? currentSurfaceIndex - 1 : surfaces.length - 1;
        handleSurfaceChange(surfaces[prevIndex]);
      } else {
        // Swipe left - go to next surface
        const nextIndex = (currentSurfaceIndex + 1) % surfaces.length;
        handleSurfaceChange(surfaces[nextIndex]);
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  const handleSurfaceChange = (surface: typeof surfaces[0]) => {
    setCurrentSurface(surface.id);
    announceToScreenReader(`Switched to ${surface.label} surface`);
    setIsSwipeMenuOpen(false);
  };

  // Floating action button component
  const FloatingActionMenu = () => (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Action buttons that slide out when menu is open */}
      <div className={`flex flex-col items-end space-y-2 transition-all duration-300 ${
        isSwipeMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}>
        {/* Skill Tree Button */}
        <button
          onClick={toggleSkillTree}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title="Open skill tree"
          aria-label="Open skill tree"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        {/* Context Panel Button */}
        <button
          onClick={toggleContextPanel}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title="Toggle help panel"
          aria-label="Toggle help panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Focus Mode Button */}
        <button
          onClick={toggleFocusMode}
          className={`${focusMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'} text-white p-3 rounded-full shadow-lg transition-all duration-200`}
          title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
          aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsSwipeMenuOpen(!isSwipeMenuOpen)}
        className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 ${
          isSwipeMenuOpen ? 'rotate-45' : ''
        }`}
        title="Toggle menu"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );

  return (
    <div 
      className={`mobile-navigation ${className} md:hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-black bg-opacity-90 backdrop-blur-lg border-t border-gray-700">
        <div className="flex items-center justify-around py-2">
          {surfaces.map((surface) => {
            const isActive = currentSurface === surface.id;
            const bandColors = BAND_VISUAL_SYSTEM[surface.band];
            
            return (
              <button
                key={surface.id}
                onClick={() => handleSurfaceChange(surface)}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
                style={{
                  backgroundColor: isActive ? bandColors.primary : 'transparent',
                }}
                aria-label={`${surface.label} surface: ${surface.description}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="text-xl mb-1">{surface.icon}</div>
                <span className="text-xs font-medium">{surface.label}</span>
                {isActive && (
                  <div 
                    className="w-1 h-1 rounded-full mt-1"
                    style={{ backgroundColor: 'white' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipe Indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 bg-black bg-opacity-60 backdrop-blur-sm rounded-full px-3 py-1">
        <p className="text-xs text-gray-300">Swipe between surfaces</p>
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu />

      {/* Swipe Menu Overlay */}
      {isSwipeMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSwipeMenuOpen(false)}
        />
      )}

        <style>{`
        .mobile-navigation {
          touch-action: pan-y;
        }

        @media (min-width: 768px) {
          .mobile-navigation {
            display: none;
          }
        }

        /* Ensure bottom tab bar doesn't interfere with content */
        body {
          padding-bottom: 60px;
        }

        @media (min-width: 768px) {
          body {
            padding-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Responsive Navigation Wrapper
interface ResponsiveNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({ 
  children, 
  className = '' 
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`responsive-navigation ${className}`}>
      {children}
      
      {/* Mobile-specific navigation */}
      {isMobile && <MobileNavigation />}
      
        <style>{`
        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .responsive-navigation {
            position: relative;
            min-height: 100vh;
            padding-bottom: 60px; /* Space for bottom navigation */
          }
        }

        /* Ensure touch interactions work properly */
        @media (max-width: 767px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Improve scrolling on mobile */
        @media (max-width: 767px) {
          .responsive-navigation {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
};