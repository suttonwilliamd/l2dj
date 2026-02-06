import React from 'react';
import { useAudioStore } from '../../store/audioStore';
import { useSkillStore } from '../../store/skillStore';

interface DeckProps {
  deckId: 'left' | 'right';
}

export const Deck: React.FC<DeckProps> = ({ deckId }) => {
  const { loadTrack, playDeck, stopDeck, setPlaybackRate, isLoading, error } = useAudioStore();
  const { isControlUnlocked } = useSkillStore();
  const deckState = deckId === 'left' 
    ? useAudioStore(state => state.leftDeck)
    : useAudioStore(state => state.rightDeck);

  // Feature gating
  const canLoadFiles = isControlUnlocked('file-input');
  const canPlayPause = isControlUnlocked('play-pause');
  const canControlSpeed = isControlUnlocked('speed-slider');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadTrack(deckId, file);
    }
  };

  const handlePlayPause = () => {
    if (deckState?.isPlaying) {
      stopDeck(deckId);
    } else {
      playDeck(deckId);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackRate(deckId, parseFloat(event.target.value));
  };

  return (
    <div className={`deck deck-${deckId} bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-80 shadow-xl`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 capitalize flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          {deckId} Deck
        </h2>
        
        {/* Track Loading */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Load Track {canLoadFiles ? '' : '(🔒 Complete "Track Basics" to unlock)'}
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isLoading || !canLoadFiles}
            className={`w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold ${
              canLoadFiles 
                ? 'file:bg-blue-600 file:text-white hover:file:bg-blue-700' 
                : 'file:bg-gray-600 file:text-gray-400 cursor-not-allowed'
            } disabled:opacity-50`}
          />
        </div>

        {/* Track Info */}
        {deckState?.audioBuffer && (
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <p className="text-sm text-gray-300">
              Loaded: {deckState.audioBuffer.duration.toFixed(1)}s
            </p>
          </div>
        )}

        {/* Playback Controls */}
        <div className="mb-4">
          <button
            onClick={handlePlayPause}
            disabled={!deckState?.audioBuffer || isLoading || !canPlayPause}
            className={`w-full py-2 px-4 text-white rounded font-medium disabled:cursor-not-allowed ${
              canPlayPause 
                ? 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {deckState?.isPlaying ? 'Stop' : 'Play'} {!canPlayPause && '(🔒)'}
          </button>
        </div>

        {/* Speed Control */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Speed: {deckState?.playbackRate.toFixed(2)}x {!canControlSpeed && '(🔒)'}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.01"
            value={deckState?.playbackRate || 1.0}
            onChange={handleSpeedChange}
            disabled={!canControlSpeed}
            className={`vertical-slider ${
              canControlSpeed ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          />
          {!canControlSpeed && (
            <p className="text-xs text-gray-500 mt-2">
              Complete "Speed Control" to unlock
            </p>
          )}
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className={`inline-block w-3 h-3 rounded-full ${
            deckState?.isPlaying ? 'bg-green-500' : 'bg-gray-500'
          }`} />
          <p className="text-xs text-gray-400 mt-1">
            {deckState?.isPlaying ? 'Playing' : 'Stopped'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};