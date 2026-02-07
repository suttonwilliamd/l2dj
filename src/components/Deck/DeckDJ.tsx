import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useControlStore } from '../../store/controlStore';
import { useNavigationStore } from '../../store/navigationStore';
import { useControlFeedback } from '../Feedback/FeedbackSystem';
import { useInteractionTracking } from '../../store/completionStore';
import { WaveformSimple } from '../UI/WaveformSimple';

interface DeckDJProps {
  deckId: 'left' | 'right';
}

export const DeckDJ: React.FC<DeckDJProps> = ({ deckId }) => {
  const { loadTrack, playDeck, stopDeck, isLoading } = useAudioStore();
  const { isControlUnlocked } = useControlStore();
  const { activeNodeId } = useNavigationStore();

  const leftDeck = useAudioStore(state => state.leftDeck);
  const rightDeck = useAudioStore(state => state.rightDeck);
  const deckState = deckId === 'left' ? leftDeck : rightDeck;

  const feedback = useControlFeedback(`${deckId}-deck`);
  const tracking = useInteractionTracking(activeNodeId || '');

  const isDeckB = deckId === 'right';
  const canUseDeckB = !isDeckB || isControlUnlocked('deck-b');
  const canLoadFiles = isControlUnlocked('file-input');
  const canPlayPause = isControlUnlocked('play-pause');

  const deckColor = isDeckB ? 'deck-b-active' : 'deck-a-light';
  const deckClass = isDeckB ? 'deck-b' : 'deck-a';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadTrack(deckId, file);
      tracking.trackAction('load-track', { deckId, fileName: file.name });
      feedback.showSuccess('Track loaded');
    }
  };

  const handlePlayPause = () => {
    if (deckState?.isPlaying) {
      stopDeck(deckId);
      tracking.trackAction('play-pause', { deckId, action: 'stop' });
    } else {
      playDeck(deckId);
      tracking.trackAction('play-pause', { deckId, action: 'play' });
    }
  };



  if (isDeckB && !canUseDeckB) {
    return (
      <div className="deck-area flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-surface-button rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-dim" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-secondary mb-1">DECK B</div>
          <div className="text-sm text-dim">Locked</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Deck header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`status-led ${deckClass}`}></div>
          <span className="text-sm font-bold text-primary">
            {isDeckB ? 'B' : 'A'}
          </span>
        </div>
        <div className="text-xs text-dim font-mono">
          {deckState?.playbackRate ? `${(deckState.playbackRate * 100).toFixed(0)}%` : '100%'}
        </div>
      </div>

      {/* Jog Wheel / Waveform */}
      <div className={`jog-wheel ${deckClass}`}>
        <div className="w-full h-full rounded-full overflow-hidden">
          {deckState?.audioBuffer ? (
            <WaveformSimple
              audioBuffer={deckState.audioBuffer}
              currentTime={deckState.currentTime}
              isPlaying={deckState.isPlaying}
              deckColor={deckColor}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-dim text-sm">No track</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-4">
        {/* Load track button */}
        {canLoadFiles && (
          <label className="tooltip control-button" data-tooltip="Load Track">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </label>
        )}

        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          disabled={!deckState?.audioBuffer || isLoading || !canPlayPause}
          className={`play-button ${deckState?.isPlaying ? 'playing' : ''} tooltip`}
          data-tooltip={deckState?.isPlaying ? 'Stop' : 'Play'}
        >
          {deckState?.isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4l12 6-12 6V4z" />
            </svg>
          )}
        </button>

        {/* Cue button */}
        {canLoadFiles && (
          <button className="tooltip control-button" data-tooltip="Cue">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Track info */}
      {deckState?.audioBuffer && (
        <div className="text-center">
          <div className="text-xs text-dim mb-1">
            {deckState.audioBuffer.duration.toFixed(1)}s
          </div>
          <div className="text-xs text-dim">
            {deckState.currentTime.toFixed(1)}s / {deckState.audioBuffer.duration.toFixed(1)}s
          </div>
        </div>
      )}


    </div>
  );
};
