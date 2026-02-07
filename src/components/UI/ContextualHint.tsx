import React, { useState, useEffect } from 'react';
import { useControlStore } from '../../store/controlStore';
import { useSkillStore } from '../../store/skillStore';

interface ContextualHintProps {
  controlId: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  targetElement?: HTMLElement | null;

  autoDismiss?: boolean;
  dismissDelay?: number;
}

interface HintRecord {
  controlId: string;
  dismissedAt: number;
}

export const ContextualHint: React.FC<ContextualHintProps> = ({
  controlId,
  message,
  position,
  targetElement,
  autoDismiss = true,
  dismissDelay = 8000
}) => {
  const { isControlUnlocked } = useControlStore();
  const { unlockedSkills } = useSkillStore();
  const [isVisible, setIsVisible] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Check if this hint has been dismissed before
  const isHintDismissed = () => {
    const dismissedHints = JSON.parse(localStorage.getItem('dismissedHints') || '{}');
    const hint = dismissedHints[controlId] as HintRecord;
    if (!hint) return false;
    
    // Show hint again after 24 hours if it was dismissed
    const hoursSinceDismissal = (Date.now() - hint.dismissedAt) / (1000 * 60 * 60);
    return hoursSinceDismissal < 24;
  };

  // Check if control was just unlocked (in this session)
  useEffect(() => {
    const wasUnlocked = isControlUnlocked(controlId);
    if (wasUnlocked && !isHintDismissed() && !hasBeenShown) {
      setJustUnlocked(true);
      setIsVisible(true);
      setHasBeenShown(true);
    }
  }, [isControlUnlocked, controlId, unlockedSkills, hasBeenShown]);

  // Auto-dismiss functionality
  useEffect(() => {
    if (isVisible && autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, dismissDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismiss, dismissDelay]);

  // Handle manual dismiss
  const dismissHint = () => {
    setIsVisible(false);
    const dismissedHints = JSON.parse(localStorage.getItem('dismissedHints') || '{}');
    dismissedHints[controlId] = {
      controlId,
      dismissedAt: Date.now()
    };
    localStorage.setItem('dismissedHints', JSON.stringify(dismissedHints));
  };

  // Calculate position relative to target element
  const getPositionStyle = () => {
    if (!targetElement) {
      // Fallback positioning if no target element
      const positions = {
        top: { top: '-60px', left: '50%', transform: 'translateX(-50%)' },
        bottom: { bottom: '-60px', left: '50%', transform: 'translateX(-50%)' },
        left: { left: '-150px', top: '50%', transform: 'translateY(-50%)' },
        right: { right: '-150px', top: '50%', transform: 'translateY(-50%)' }
      };
      return positions[position];
    }

    const rect = targetElement.getBoundingClientRect();
    const positions = {
      top: {
        top: rect.top - 60,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)'
      },
      bottom: {
        top: rect.bottom + 20,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)'
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - 150,
        transform: 'translateY(-50%)'
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
        transform: 'translateY(-50%)'
      }
    };

    return positions[position];
  };

  if (!isVisible) return null;

  return (
    <div
      className="contextual-hint fixed z-50 pointer-events-none"
      style={getPositionStyle()}
    >
      <div className="relative pointer-events-auto">
        {/* Hint bubble */}
        <div className="bg-surface-control border border-border-light rounded-lg px-3 py-2 shadow-lg max-w-xs">
          <div className="flex items-start gap-2">
            <div className="text-accent-primary flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary font-medium">
                {message}
              </p>
              {justUnlocked && (
                <p className="text-xs text-accent-primary mt-1 font-semibold">
                  🎯 New control unlocked!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={dismissHint}
          className="absolute -top-2 -right-2 w-5 h-5 bg-surface-button rounded-full border border-border-light flex items-center justify-center hover:bg-surface-control transition-colors"
          aria-label="Dismiss hint"
        >
          <svg className="w-3 h-3 text-dim" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>

        {/* Arrow pointing to target */}
        <div 
          className="absolute w-2 h-2 bg-surface-control border border-border-light transform rotate-45"
          style={{
            [position]: '-5px',
            left: position === 'left' ? 'auto' : position === 'right' ? 'auto' : '50%',
            right: position === 'right' ? '-5px' : 'auto',
            top: position === 'top' ? 'auto' : position === 'bottom' ? 'auto' : '50%',
            bottom: position === 'bottom' ? '-5px' : 'auto',
            transform: position === 'left' || position === 'right' 
              ? 'translateY(-50%) rotate(45deg)' 
              : position === 'top'
              ? 'translateX(-50%) rotate(45deg)'
              : 'translateX(-50%) rotate(45deg)',
            marginLeft: position === 'left' || position === 'right' ? '0' : '-4px',
            marginTop: position === 'top' || position === 'bottom' ? '0' : '-4px'
          }}
        />
      </div>


    </div>
  );
};

// Hook to create contextual hints for components
export const useContextualHint = (controlId: string, message: string, position: ContextualHintProps['position']) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const HintComponent = () => (
    <ContextualHint
      controlId={controlId}
      message={message}
      position={position}
      targetElement={element}
    />
  );

  const ref = (node: HTMLElement | null) => {
    setElement(node);
  };

  return { HintComponent, ref };
};