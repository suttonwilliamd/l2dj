import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';

export const SkillTreeOverlay: React.FC = () => {
  const { isSkillTreeOpen, toggleSkillTree } = useNavigationStore();

  if (!isSkillTreeOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={toggleSkillTree}
    >
      <div
        className="bg-surface-control border border-light rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Skill Tree</h2>
          <button
            onClick={toggleSkillTree}
            className="icon-button"
            aria-label="Close skill tree"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Perception Band */}
          <div className="border border-light rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-band-perception-500"></div>
              <h3 className="font-semibold text-primary">Perception</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg">
                <span className="text-secondary">Track Recognition</span>
                <div className="status-led on"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-60">
                <span className="text-dim">Beat Detection</span>
                <div className="status-led"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-40">
                <span className="text-dim">Phrase Identification</span>
                <div className="status-led"></div>
              </div>
            </div>
          </div>

          {/* Manipulation Band */}
          <div className="border border-light rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-band-manipulation-500"></div>
              <h3 className="font-semibold text-primary">Manipulation</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg">
                <span className="text-secondary">Play/Pause</span>
                <div className="status-led on"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-60">
                <span className="text-dim">Speed Adjustment</span>
                <div className="status-led"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-40">
                <span className="text-dim">Dual Deck Control</span>
                <div className="status-led"></div>
              </div>
            </div>
          </div>

          {/* Intent Band */}
          <div className="border border-light rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-band-intent-500"></div>
              <h3 className="font-semibold text-primary">Intent</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-40">
                <span className="text-dim">Basic Mixing</span>
                <div className="status-led"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-30">
                <span className="text-dim">Crossfader Control</span>
                <div className="status-led"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-metal-dark rounded-lg opacity-20">
                <span className="text-dim">Advanced Transitions</span>
                <div className="status-led"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
