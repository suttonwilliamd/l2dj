import React, { useState, useEffect, useCallback } from 'react';

// Enhanced accessibility utilities for navigation and context

interface AccessibilityEnhancementProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancement: React.FC<AccessibilityEnhancementProps> = ({ children }) => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.setAttribute('data-keyboard-nav', 'true');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.removeAttribute('data-keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Focus management utilities
  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      containerElement.removeEventListener('keydown', handleFocusTrap);
    };
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Enhanced keyboard navigation for skill nodes
  const enhanceKeyboardNavigation = useCallback(() => {
    const skillNodes = document.querySelectorAll('[data-skill-node]') as NodeListOf<HTMLElement>;
    
    skillNodes.forEach((node, index) => {
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', `Skill node ${index + 1}`);
      
      // Add keyboard event listeners
      node.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            node.click();
            announceToScreenReader(`Skill node ${index + 1} activated`);
            break;
            
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            const nextNode = skillNodes[index + 1];
            if (nextNode) {
              nextNode.focus();
            }
            break;
            
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            const prevNode = skillNodes[index - 1];
            if (prevNode) {
              prevNode.focus();
            }
            break;
        }
      });
    });
  }, [announceToScreenReader]);

  // Skip links for keyboard users
  const SkipLinks = () => (
    <div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded">
      <a href="#main-content" className="block mb-2">Skip to main content</a>
      <a href="#navigation" className="block mb-2">Skip to navigation</a>
      <a href="#skill-tree" className="block">Skip to skill tree</a>
    </div>
  );

  // Focus indicators for keyboard users
  const FocusIndicators = () => (
    <style>{`
      /* Show focus indicators only for keyboard users */
      body:not([data-keyboard-nav]) *:focus {
        outline: none;
      }

      body[data-keyboard-nav] *:focus {
        outline: 2px solid #3B82F6;
        outline-offset: 2px;
        border-radius: 4px;
      }

      /* Enhanced focus for interactive elements */
      body[data-keyboard-nav] button:focus,
      body[data-keyboard-nav] [role="button"]:focus,
      body[data-keyboard-nav] [tabindex="0"]:focus {
        outline: 3px solid #3B82F6;
        outline-offset: 2px;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        body[data-keyboard-nav] *:focus {
          outline: 3px solid #FFFFFF;
          outline-offset: 2px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        body[data-keyboard-nav] *:focus {
          transition: none;
        }
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .sr-only:focus,
      .focus:not-sr-only {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: inherit;
      }
    `}</style>
  );

  // ARIA live regions for dynamic content
  const LiveRegions = () => (
    <div>
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="polite-announcements" />
      <div aria-live="assertive" aria-atomic="true" className="sr-only" id="assertive-announcements" />
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="status-announcements" />
    </div>
  );

  // Usability enhancements
  const enhanceUsability = useCallback(() => {
    // Add tooltips for better discoverability
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach((element) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = element.getAttribute('data-tooltip') || '';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.style.display = 'none';
      
      document.body.appendChild(tooltip);
      
      element.addEventListener('mouseenter', (e) => {
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        
        tooltip.style.display = 'block';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
      });
      
      element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });

    // Add error prevention for destructive actions
    const destructiveButtons = document.querySelectorAll('[data-destructive]');
    
    destructiveButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const confirmed = confirm('Are you sure you want to perform this action?');
        if (!confirmed) {
          e.preventDefault();
        }
      });
    });
  }, []);

  // Initialize enhancements
  useEffect(() => {
    enhanceKeyboardNavigation();
    enhanceUsability();
  }, [enhanceKeyboardNavigation, enhanceUsability]);

  // Export utilities for other components
  const accessibilityUtils = {
    announceToScreenReader,
    trapFocus,
    isKeyboardUser,

  };

  return (
    <>
      <SkipLinks />
      <FocusIndicators />
      <LiveRegions />
      
      {/* Main content with accessibility enhancements */}
      <div 
        role="application" 
        aria-label="L2DJ Learning Application"
        id="main-content"
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              accessibilityUtils,
              isKeyboardUser,
            } as any);
          }
          return child;
        })}
      </div>
    </>
  );
};

// Custom hook for accessibility features
export const useAccessibilityEnhancements = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check user preferences
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    setReducedMotion(motionQuery.matches);
    setHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.setAttribute('data-keyboard-nav', 'true');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.removeAttribute('data-keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, []);

  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      containerElement.removeEventListener('keydown', handleFocusTrap);
    };
  }, []);

  return {
    isKeyboardUser,
    reducedMotion,
    highContrast,
    announceToScreenReader,
    trapFocus,
  };
};