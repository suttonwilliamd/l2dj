/**
 * Enhanced UI Components with Professional Animations
 */

import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';

// Enhanced Button Component with ref support
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  band?: 'perception' | 'manipulation' | 'intent';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  band,
  isLoading = false,
  disabled,
  children,
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hardware-control";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl"
  };
  
  const variantClasses = {
    primary: band 
      ? `bg-${band}-500 text-white hover:bg-${band}-600 focus-visible:ring-${band}-500`
      : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-gray-700 text-gray-300 hover:bg-gray-600 focus-visible:ring-gray-500",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-700 focus-visible:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// Hardware-inspired Knob Component
export interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  band?: 'perception' | 'manipulation' | 'intent';
  disabled?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Knob: React.FC<KnobProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  band,
  disabled = false,
  onChange,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage * 270) - 135; // -135deg to +135deg range

  const bandColor = band ? `var(--band-${band}-500)` : '#3B82F6';

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={cn(
        "relative rounded-full border-2 shadow-lg transition-all duration-200 hardware-control",
        sizeClasses[size],
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl",
        band ? `border-${band}-500` : "border-gray-600"
      )}
           style={{
             background: `linear-gradient(145deg, #1a1a1a, #2a2a2a)`,
             borderColor: bandColor
           }}>
        {/* Knob indicator */}
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-4 bg-white rounded-full shadow-md"
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 150ms ease-out'
          }}
        />
        
        {/* Value input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
      
      {label && (
        <div className="text-center">
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-sm font-medium text-white">{value.toFixed(0)}</div>
        </div>
      )}
    </div>
  );
};

// Hardware-inspired Fader Component
export interface FaderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  band?: 'perception' | 'manipulation' | 'intent';
  disabled?: boolean;
  onChange?: (value: number) => void;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export const Fader: React.FC<FaderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  band,
  disabled = false,
  onChange,
  orientation = 'vertical',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: orientation === 'vertical' ? "w-8 h-24" : "w-24 h-8",
    md: orientation === 'vertical' ? "w-10 h-32" : "w-32 h-10",
    lg: orientation === 'vertical' ? "w-12 h-40" : "w-40 h-12"
  };

  const percentage = ((value - min) / (max - min)) * 100;
  const bandColor = band ? `var(--band-${band}-500)` : '#3B82F6';

  const faderStyle = orientation === 'vertical' 
    ? { background: `linear-gradient(to top, ${bandColor} 0%, ${bandColor} ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)` }
    : { background: `linear-gradient(to right, ${bandColor} 0%, ${bandColor} ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)` };

  return (
    <div className="flex flex-col items-center space-y-2">
      {label && orientation === 'vertical' && (
        <div className="text-center">
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-sm font-medium text-white">{value.toFixed(0)}</div>
        </div>
      )}
      
      <div className={cn(
        "relative rounded-full shadow-inner transition-all duration-200 hardware-control",
        sizeClasses[size],
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
           style={faderStyle}>
        {/* Fader thumb */}
        <div 
          className={cn(
            "absolute rounded-full shadow-lg border-2 bg-white transition-all duration-200",
            orientation === 'vertical' 
              ? "left-1/2 -translate-x-1/2 w-4 h-4" 
              : "top-1/2 -translate-y-1/2 w-4 h-4",
            disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-110"
          )}
          style={{
            [orientation === 'vertical' ? 'bottom' : 'left']: `${percentage}%`,
            transform: orientation === 'vertical' 
              ? 'translateX(-50%) translateY(50%)'
              : 'translateY(-50%) translateX(-50%)',
            borderColor: bandColor
          }}
        />
        
        {/* Value input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
          style={{
            [orientation === 'vertical' ? 'writingMode' : '']: 'vertical-lr',
            [orientation === 'vertical' ? 'direction' : '']: 'rtl'
          }}
        />
      </div>
      
      {label && orientation === 'horizontal' && (
        <div className="text-center">
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-sm font-medium text-white">{value.toFixed(0)}</div>
        </div>
      )}
    </div>
  );
};

// Waveform Display Component
export interface WaveformProps {
  audioBuffer?: AudioBuffer;
  currentTime?: number;
  isPlaying?: boolean;
  band?: 'perception' | 'manipulation' | 'intent';
  height?: number;
  showBeatMarkers?: boolean;
  className?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  audioBuffer,
  currentTime = 0,
  band,
  height = 80,
  showBeatMarkers = false,
  className
}) => {
  const bandColor = band ? `var(--band-${band}-500)` : '#3B82F6';

  const barHeights = useMemo(() => {
    if (!audioBuffer) return [];
    const seed = audioBuffer.duration;
    return Array.from({ length: 50 }, (_, i) => {
      const pseudoRandom = Math.abs(Math.sin(seed * (i + 1))) * 60 + 20;
      return pseudoRandom;
    });
  }, [audioBuffer]);

  if (!audioBuffer) {
    return (
      <div 
        className={cn("w-full bg-gray-800 rounded-lg flex items-center justify-center", className)}
        style={{ height: `${height}px` }}
      >
        <span className="text-gray-500 text-sm">No track loaded</span>
      </div>
    );
  }

  const duration = audioBuffer.duration;
  const progress = (currentTime / duration) * 100;

  return (
    <div 
      className={cn("relative w-full bg-gray-800 rounded-lg overflow-hidden", className)}
      style={{ height: `${height}px` }}
    >
      {/* Waveform visualization (simplified) */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-3/4 flex items-center justify-center">
          {/* Placeholder waveform bars */}
          <div className="w-full h-full flex items-end justify-between px-2">
            {barHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-gray-600 rounded-t"
                style={{
                  height: `${height}%`,
                  opacity: i / 50 < progress / 100 ? 1 : 0.3,
                  backgroundColor: i / 50 < progress / 100 ? bandColor : '#4B5563'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Beat markers */}
      {showBeatMarkers && (
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-full flex items-center px-2">
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className="w-px h-2 bg-blue-400 opacity-60 mx-1"
              />
            ))}
          </div>
        </div>
      )}

      {/* Playhead */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${progress}%` }}
      />

      {/* Time display */}
      <div className="absolute bottom-1 left-2 text-xs text-gray-400 font-mono">
        {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
      </div>
    </div>
  );
};

// Status Indicator Component
export interface StatusIndicatorProps {
  status: 'playing' | 'stopped' | 'loading' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  const statusColors = {
    playing: 'bg-green-500',
    stopped: 'bg-gray-500',
    loading: 'bg-yellow-500 animate-pulse',
    error: 'bg-red-500'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={cn(
        "rounded-full",
        sizeClasses[size],
        statusColors[status]
      )} />
      {label && (
        <span className="text-xs text-gray-400">{label}</span>
      )}
    </div>
  );
};