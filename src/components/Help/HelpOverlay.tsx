import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';

export const HelpOverlay: React.FC = () => {
  const { isContextPanelOpen, toggleContextPanel } = useNavigationStore();

  if (!isContextPanelOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={toggleContextPanel}
    >
      <div
        className="bg-surface-control border border-light rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Help & Context</h2>
          <button
            onClick={toggleContextPanel}
            className="icon-button"
            aria-label="Close help"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Start */}
          <div className="border border-light rounded-xl p-4">
            <h3 className="font-semibold text-primary mb-3">Quick Start</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Load audio files onto Deck A and B using the upload button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Use Play/Stop button to control playback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Adjust tempo with vertical faders on each deck</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Use crossfader to mix between decks</span>
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="border border-light rounded-xl p-4">
            <h3 className="font-semibold text-primary mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Play/Stop</span>
                <span className="font-mono text-primary">Space</span>
              </div>
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Load Track</span>
                <span className="font-mono text-primary">Ctrl+L</span>
              </div>
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Cue Point</span>
                <span className="font-mono text-primary">C</span>
              </div>
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Skill Tree</span>
                <span className="font-mono text-primary">Ctrl+T</span>
              </div>
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Help</span>
                <span className="font-mono text-primary">F1</span>
              </div>
              <div className="flex justify-between p-2 bg-metal-dark rounded">
                <span className="text-dim">Focus Mode</span>
                <span className="font-mono text-primary">Ctrl+M</span>
              </div>
            </div>
          </div>

          {/* Progression */}
          <div className="border border-light rounded-xl p-4">
            <h3 className="font-semibold text-primary mb-3">Progression</h3>
            <p className="text-secondary mb-3">
              Complete skills in the Skill Tree to unlock new features:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 bg-metal-dark rounded">
                <div className="w-2 h-2 rounded-full bg-band-perception-500"></div>
                <span className="text-secondary">
                  <strong>Perception:</strong> Learn to recognize tracks, beats, and phrases
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-metal-dark rounded">
                <div className="w-2 h-2 rounded-full bg-band-manipulation-500"></div>
                <span className="text-secondary">
                  <strong>Manipulation:</strong> Control playback, tempo, and dual decks
                </span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-metal-dark rounded">
                <div className="w-2 h-2 rounded-full bg-band-intent-500"></div>
                <span className="text-secondary">
                  <strong>Intent:</strong> Master mixing, transitions, and crossfader
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
