import React, { useMemo, useEffect, useState } from 'react';

interface WaveformSimpleProps {
  audioBuffer: AudioBuffer;
  currentTime: number;
  isPlaying: boolean;
  deckColor: 'deck-a-light' | 'deck-b-active';
}

export const WaveformSimple: React.FC<WaveformSimpleProps> = ({
  audioBuffer,
  currentTime,
  isPlaying,
  deckColor
}) => {
  const [beatPulse, setBeatPulse] = useState(0);

  // Simulate beat detection with periodic pulse
  useEffect(() => {
    if (!isPlaying) return;
    
    // Estimate BPM ~120, pulse every 500ms
    const interval = setInterval(() => {
      setBeatPulse(prev => (prev + 1) % 2);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const barHeights = useMemo(() => {
    const seed = audioBuffer.duration;
    const bars = Array.from({ length: 60 }, (_, i) => {
      const pseudoRandom = Math.abs(Math.sin(seed * (i + 1) * 1.5)) * 40 + 20;
      // Add beat emphasis every 8th bar (simulating beat patterns)
      const beatEmphasis = i % 8 === 0 ? 1.2 : 1;
      return pseudoRandom * beatEmphasis;
    });
    return bars;
  }, [audioBuffer.duration]);

  const progress = (currentTime / audioBuffer.duration) * 100;

  const getColor = () => {
    return deckColor === 'deck-a-light' ? 'var(--deck-a-light)' : 'var(--deck-b-active)';
  };

  const getGlowColor = () => {
    return deckColor === 'deck-a-light' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)';
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-full">
      {/* Subtle glow effect around platter edge when track is loaded */}
      {audioBuffer && (
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, transparent 85%, ${getGlowColor()} 100%)`,
            opacity: isPlaying ? 0.8 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Circular waveform bars */}
      {barHeights.map((height, i) => {
        const angle = (i / barHeights.length) * 360;
        const isActive = (i / barHeights.length) * 100 < progress;
        const colorVar = getColor();
        
        // Create radial bars that point inward from the edge
        const barLength = height * 0.8; // Scale to fit within circle
        const isBeatBar = i % 8 === 0;
        
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: '3px',
              height: `${barLength}px`,
              backgroundColor: isActive ? colorVar : 'var(--metal-light)',
              opacity: isActive ? 1 : 0.3,
              borderRadius: '1px',
              transform: `
                translate(-50%, -50%) 
                rotate(${angle}deg) 
                translateY(-${90 - barLength/2}px)
                ${isActive && isBeatBar && isPlaying && beatPulse ? 'scale(1.2)' : 'scale(1)'}
              `,
              transformOrigin: 'center bottom',
              boxShadow: isActive && isPlaying ? `0 0 ${isBeatBar ? 12 : 6}px ${colorVar}` : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        );
      })}

      {/* Center circle with deck info */}
      <div className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full bg-metal-dark border-2 border-metal-medium flex items-center justify-center"
           style={{ transform: 'translate(-50%, -50%)' }}>
        <div className="text-center">
          <div className={`text-xs font-bold ${isPlaying ? 'text-primary' : 'text-dim'}`}>
            {isPlaying ? 'PLAY' : 'READY'}
          </div>
          <div className="text-xs text-dim font-mono">
            {Math.floor(currentTime)}s
          </div>
        </div>
      </div>

      {/* Rotating playhead indicator */}
      {isPlaying && (
        <div
          className="absolute left-1/2 top-1/2 w-0.5 h-6 bg-white origin-bottom"
          style={{
            transform: `
              translate(-50%, -50%) 
              rotate(${progress * 3.6}deg) 
              translateY(-40px)
            `,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
          }}
        />
      )}
    </div>
  );
};
