import React from 'react';
import { useControlStore } from '../../store/controlStore';
import { useControlFeedback } from '../Feedback/FeedbackSystem';
import { useInteractionTracking } from '../../store/completionStore';
import { useNavigationStore } from '../../store/navigationStore';

export const CrossfaderDJ: React.FC = () => {
  const { crossfaderPosition, setCrossfaderPosition } = useControlStore();
  const { isControlUnlocked } = useControlStore();
  const { activeNodeId } = useNavigationStore();

  const feedback = useControlFeedback('crossfader');
  const tracking = useInteractionTracking(activeNodeId || '');

  const canUseCrossfader = isControlUnlocked('crossfader');

  const handleChange = (value: number) => {
    const oldValue = crossfaderPosition;
    setCrossfaderPosition(value);

    tracking.trackAction('move-crossfader', {
      oldValue,
      newValue: value,
      movement: Math.abs(value - oldValue)
    });

    const movement = Math.abs(value - oldValue);
    if (movement > 10 && canUseCrossfader) {
      if (value < 20) {
        feedback.showSuccess('Mixing to Deck A');
      } else if (value > 80) {
        feedback.showSuccess('Mixing to Deck B');
      } else {
        feedback.showSuccess('Balanced mix');
      }
    }
  };

  const leftLevel = Math.max(0, 100 - crossfaderPosition);
  const rightLevel = Math.max(0, crossfaderPosition);

  return (
    <div className="flex items-center gap-8 w-full max-w-3xl">
      {/* Left channel level */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-dim">A</div>
        <div className="w-8 h-32 bg-surface-control rounded flex flex-col justify-end overflow-hidden border border-light">
          <div
            className="w-full bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 transition-all"
            style={{ height: `${leftLevel}%` }}
          />
        </div>
        <div className="text-xs text-dim font-mono">{leftLevel.toFixed(0)}</div>
      </div>

      {/* Crossfader */}
      {canUseCrossfader ? (
        <div className="flex-1">
          <div className="crossfader">
            <div className="crossfader-track"></div>
            <div
              className="crossfader-thumb tooltip"
              style={{ left: `${crossfaderPosition}%` }}
              data-tooltip="Crossfader"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={crossfaderPosition}
              onChange={(e) => handleChange(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 h-14 bg-surface-control rounded border border-light flex items-center justify-center opacity-50">
          <div className="text-dim text-sm">🔒 Crossfader locked</div>
        </div>
      )}

      {/* Right channel level */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-dim">B</div>
        <div className="w-8 h-32 bg-surface-control rounded flex flex-col justify-end overflow-hidden border border-light">
          <div
            className="w-full bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 transition-all"
            style={{ height: `${rightLevel}%` }}
          />
        </div>
        <div className="text-xs text-dim font-mono">{rightLevel.toFixed(0)}</div>
      </div>
    </div>
  );
};
