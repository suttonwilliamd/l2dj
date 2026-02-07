/**
 * Animation System for L2DJ
 * Professional causal animations and feedback
 */

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface CausalAnimation {
  trigger: string;
  target: string;
  animation: string;
  config: AnimationConfig;
}

// Professional animation presets
export const ANIMATION_PRESETS = {
  // Hardware-inspired interactions
  faderMove: {
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  knobRotate: {
    duration: 200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  buttonPress: {
    duration: 100,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  successGlow: {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  unlockReveal: {
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  crossfaderBlend: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  beatPulse: {
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  levelMeter: {
    duration: 100,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

// Causal animation mappings
export const CAUSAL_ANIMATIONS: CausalAnimation[] = [
  // Crossfader movements cause channel level changes
  {
    trigger: 'crossfader-move',
    target: 'channel-levels',
    animation: 'level-change',
    config: ANIMATION_PRESETS.crossfaderBlend
  },
  
  // Tempo changes cause beat rate changes
  {
    trigger: 'tempo-change',
    target: 'beat-markers',
    animation: 'beat-rate-change',
    config: ANIMATION_PRESETS.faderMove
  },
  
  // Play/pause causes waveform animation
  {
    trigger: 'playback-toggle',
    target: 'waveform',
    animation: 'playback-state',
    config: ANIMATION_PRESETS.buttonPress
  },
  
  // Skill unlock causes control reveal
  {
    trigger: 'skill-unlock',
    target: 'new-control',
    animation: 'unlock-reveal',
    config: ANIMATION_PRESETS.unlockReveal
  },
  
  // Successful interaction causes success feedback
  {
    trigger: 'interaction-success',
    target: 'control-feedback',
    animation: 'success-glow',
    config: ANIMATION_PRESETS.successGlow
  }
];

// Animation utilities
export class AnimationController {
  private static activeAnimations = new Map<string, number>();
  
  /**
   * Apply causal animation between elements
   */
  static applyCausalAnimation(
    triggerElement: HTMLElement,
    targetElement: HTMLElement,
    animationType: string
  ): void {
    const animation = CAUSAL_ANIMATIONS.find(
      ca => ca.trigger === animationType || ca.animation === animationType
    );
    
    if (!animation) return;
    
    // Add trigger effect
    this.addTriggerEffect(triggerElement, animation.config);
    
    // Delay target animation based on distance
    const delay = this.calculateDelay(triggerElement, targetElement);
    
    setTimeout(() => {
      this.addTargetEffect(targetElement, animation);
    }, delay);
  }
  
  /**
   * Add visual effect to trigger element
   */
  private static addTriggerEffect(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `transform ${config.duration}ms ${config.easing}`;
    element.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, config.duration);
  }
  
  /**
   * Add visual effect to target element
   */
  private static addTargetEffect(
    element: HTMLElement,
    animation: CausalAnimation
  ): void {
    const { animation: animationType, config } = animation;
    
    switch (animationType) {
      case 'level-change':
        this.animateLevelChange(element, config);
        break;
      case 'beat-rate-change':
        this.animateBeatRateChange(element, config);
        break;
      case 'playback-state':
        this.animatePlaybackState(element, config);
        break;
      case 'unlock-reveal':
        this.animateUnlockReveal(element, config);
        break;
      case 'success-glow':
        this.animateSuccessGlow(element, config);
        break;
    }
  }
  
  /**
   * Animate level meter changes
   */
  private static animateLevelChange(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `all ${config.duration}ms ${config.easing}`;
    element.classList.add('level-changing');
    
    setTimeout(() => {
      element.classList.remove('level-changing');
    }, config.duration);
  }
  
  /**
   * Animate beat rate changes
   */
  private static animateBeatRateChange(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `animation-duration ${config.duration}ms ${config.easing}`;
    
    const currentDuration = parseFloat(element.style.animationDuration || '1s');
    const newDuration = currentDuration * 0.8; // Speed up animation
    
    element.style.animationDuration = `${newDuration}s`;
  }
  
  /**
   * Animate playback state changes
   */
  private static animatePlaybackState(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `opacity ${config.duration}ms ${config.easing}`;
    element.classList.add('playback-animating');
    
    setTimeout(() => {
      element.classList.remove('playback-animating');
    }, config.duration);
  }
  
  /**
   * Animate unlock reveal
   */
  private static animateUnlockReveal(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `all ${config.duration}ms ${config.easing}`;
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';

    // Trigger reflow
    void element.offsetHeight;

    element.style.transform = 'scale(1)';
    element.style.opacity = '1';
    element.classList.add('newly-unlocked');
    
    setTimeout(() => {
      element.classList.remove('newly-unlocked');
    }, config.duration + 1000);
  }
  
  /**
   * Animate success glow
   */
  private static animateSuccessGlow(
    element: HTMLElement,
    config: AnimationConfig
  ): void {
    element.style.transition = `box-shadow ${config.duration}ms ${config.easing}`;
    element.classList.add('success-feedback');
    
    setTimeout(() => {
      element.classList.remove('success-feedback');
    }, config.duration);
  }
  
  /**
   * Calculate delay based on element distance
   */
  private static calculateDelay(
    trigger: HTMLElement,
    target: HTMLElement
  ): number {
    const triggerRect = trigger.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const distance = Math.sqrt(
      Math.pow(targetRect.left - triggerRect.left, 2) +
      Math.pow(targetRect.top - triggerRect.top, 2)
    );
    
    // Scale delay based on distance (max 300ms)
    return Math.min(distance * 0.5, 300);
  }
  
  /**
   * Create beat pulse animation
   */
  static createBeatPulse(element: HTMLElement, bpm: number): void {
    const interval = 60000 / bpm; // Convert BPM to milliseconds
    
    const pulse = () => {
      element.style.transition = 'transform 100ms ease-out';
      element.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 100);
    };
    
    // Start pulse interval
    const pulseInterval = setInterval(pulse, interval);
    
    // Store interval for cleanup
    this.activeAnimations.set(`beat-pulse-${element.id}`, pulseInterval as any);
  }
  
  /**
   * Stop beat pulse animation
   */
  static stopBeatPulse(element: HTMLElement): void {
    const interval = this.activeAnimations.get(`beat-pulse-${element.id}`);
    if (interval) {
      clearInterval(interval);
      this.activeAnimations.delete(`beat-pulse-${element.id}`);
    }
  }
  
  /**
   * Cleanup all animations
   */
  static cleanup(): void {
    this.activeAnimations.forEach(interval => {
      clearInterval(interval);
    });
    this.activeAnimations.clear();
  }
}