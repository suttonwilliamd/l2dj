import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useControlStore } from '../../store/controlStore';
import { useControlFeedback } from '../Feedback/FeedbackSystem';
import { useInteractionTracking } from '../../store/completionStore';
import { useNavigationStore } from '../../store/navigationStore';
import { ContextualHint } from '../UI/ContextualHint';

interface TempoFaderVerticalProps {
  deckId: 'left' | 'right';
}

export const TempoFaderVertical: React.FC<TempoFaderVerticalProps> = ({ deckId }) => {
  const { setPlaybackRate } = useAudioStore();
  const { isControlUnlocked } = useControlStore();
  const { activeNodeId } = useNavigationStore();

  const leftDeck = useAudioStore(state => state.leftDeck);
  const rightDeck = useAudioStore(state => state.rightDeck);
  const deckState = deckId === 'left' ? leftDeck : rightDeck;

  const feedback = useControlFeedback(`${deckId}-tempo-fader`);
  const tracking = useInteractionTracking(activeNodeId || '');

  const canControlTempo = isControlUnlocked('pitch-fader');
  const isDeckB = deckId === 'right';

  const handleTempoChange = (value: number) => {
    const newRate = value / 50; // Convert to 0.5-2.0 range
    setPlaybackRate(deckId, newRate);
    tracking.trackAction('adjust-speed', { deckId, newRate });
    
    // Provide contextual feedback
    if (newRate > 1.1) {
      feedback.showHint(`Speeding up ${isDeckB ? 'Deck B' : 'Deck A'}`);
    } else if (newRate < 0.9) {
      feedback.showHint(`Slowing down ${isDeckB ? 'Deck B' : 'Deck A'}`);
    }
  };

  if (!canControlTempo) {
    return (
      <div className="tempo-fader-area tempo-left">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-12 bg-surface-button rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-dim" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-xs text-dim font-bold">TEMPO</div>
          <div className="text-xs text-dim">Locked</div>
        </div>
      </div>
    );
  }

  const faderPosition = (deckState?.playbackRate || 1) * 50; // Convert to 25-100 range

  return (
    <div className={`tempo-fader-area tempo-${deckId}`}>
      <ContextualHint
        controlId={`${deckId}-tempo-fader`}
        message={`Slide up to speed up and match beats`}
        position="right"
      />
      <div className="flex flex-col items-center gap-3 h-full relative">
        {/* Tempo label */}
        <div className="text-xs text-dim font-bold mb-2">
          TEMPO {isDeckB ? 'B' : 'A'}
        </div>

        {/* Vertical tempo fader - tall and thin */}
        <div className="relative w-12 h-64">
          <div className="tempo-fader-vertical">
            <div className="tempo-fader-track"></div>
            <div
              className="tempo-fader-thumb tooltip"
              style={{
                bottom: `${faderPosition - 25}%` // Position from bottom
              }}
              data-tooltip={`Tempo: ${(deckState?.playbackRate || 1).toFixed(2)}x`}
            />
            <input
              type="range"
              min={25}
              max={100}
              value={faderPosition}
              onChange={(e) => handleTempoChange(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} // Rotate for vertical orientation
            />
          </div>
        </div>

        {/* Tempo percentage display */}
        <div className="text-xs text-dim font-mono bg-surface-button px-2 py-1 rounded">
          {deckState?.playbackRate ? `${(deckState.playbackRate * 100).toFixed(0)}%` : '100%'}
        </div>

        {/* Speed indicators */}
        <div className="flex flex-col gap-1 text-xs text-dim">
          <div className="text-center">↑ FASTER</div>
          <div className="text-center">↓ SLOWER</div>
        </div>
      </div>
    </div>
  );
};