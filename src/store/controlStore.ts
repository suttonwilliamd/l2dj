import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSkillProgressStore } from './navigationStore';

interface ControlState {
  // Map of control IDs to their unlocked state
  unlockedControls: Set<string>;
  
  // Crossfader state
  crossfaderPosition: number;
  
  // Actions
  isControlUnlocked: (controlId: string) => boolean;
  getUnlockedControls: () => string[];
  refreshControls: () => void;
  setCrossfaderPosition: (position: number) => void;
}

export const useControlStore = create<ControlState>()(
  persist(
     (_set, get) => ({
      unlockedControls: new Set(),
      crossfaderPosition: 50, // Start at center

      isControlUnlocked: (controlId: string) => {
        // Check if control is unlocked via skill progression
        const { completedNodes } = useSkillProgressStore.getState();
        
        // Define control requirements based on completed skills
        const controlRequirements: Record<string, string[]> = {
          // Basic controls
          'file-input': ['track_recognition'],
          'play-pause': ['audio_perception'],
          'beat-markers': ['beat_awareness'],
          
          // Deck controls
          'transport': ['deck_manipulation'],
          'seek': ['deck_manipulation'],
          
          // Speed controls
          'pitch-fader': ['speed_adjustment'],
          'bpm-display': ['tempo_matching'],
          
          // Mixer controls
          'crossfader': ['crossfader_control'],
          'volume-fader': ['crossfader_control'],
          
          // Dual deck
          'deck-b': ['dual_deck_control'],
          
          // Advanced controls
          'waveform-detailed': ['beatmatching_manual'],
          'eq-basic': ['basic_transition'],
          'phrase-markers': ['phrase_awareness'],
        };

        const requiredSkills = controlRequirements[controlId] || [];
        return requiredSkills.every(skill => completedNodes.has(skill));
      },

      getUnlockedControls: () => {
        return Array.from(get().unlockedControls);
      },

      refreshControls: () => {
        // This would be called when skill progress changes
        // For now, controls are checked dynamically in isControlUnlocked
      },

      setCrossfaderPosition: (position: number) => {
        _set({ crossfaderPosition: Math.max(0, Math.min(100, position)) });
      },
    }),
    {
      name: 'control-storage',
      partialize: (state) => ({
        unlockedControls: Array.from(state.unlockedControls),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.unlockedControls = new Set(state.unlockedControls);
        }
      },
    }
  )
);