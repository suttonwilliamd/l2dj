import { create } from 'zustand';
import { AudioEngine } from '../engine/AudioEngine';
import type { DeckState } from '../engine/AudioEngine';

interface AudioStore {
  audioEngine: AudioEngine | null;
  leftDeck: DeckState | null;
  rightDeck: DeckState | null;
  crossfaderPosition: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAudio: () => void;
  resumeAudio: () => void;
  loadTrack: (deckId: 'left' | 'right', file: File) => Promise<void>;
  playDeck: (deckId: 'left' | 'right') => void;
  stopDeck: (deckId: 'left' | 'right') => void;
  setPlaybackRate: (deckId: 'left' | 'right', rate: number) => void;
  setCrossfader: (position: number) => void;
  updateDeckStates: () => void;
  setError: (error: string | null) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  audioEngine: null,
  leftDeck: null,
  rightDeck: null,
  crossfaderPosition: 0,
  isLoading: false,
  error: null,

  initializeAudio: () => {
    try {
      const engine = new AudioEngine();
      // Note: AudioContext will be resumed on first user interaction
      
      set({
        audioEngine: engine,
        leftDeck: engine.getDeckState('left'),
        rightDeck: engine.getDeckState('right'),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to initialize audio' });
    }
  },

  resumeAudio: () => {
    const { audioEngine } = get();
    if (audioEngine) {
      audioEngine.resumeContext();
    }
  },

  loadTrack: async (deckId: 'left' | 'right', file: File) => {
    const { audioEngine, setError, resumeAudio } = get();
    if (!audioEngine) {
      setError('Audio engine not initialized');
      return;
    }

    // Resume audio context on first user interaction
    resumeAudio();

    set({ isLoading: true, error: null });
    
    try {
      await audioEngine.loadAudioFile(deckId, file);
      get().updateDeckStates();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load track');
    } finally {
      set({ isLoading: false });
    }
  },

  playDeck: (deckId: 'left' | 'right') => {
    const { audioEngine, setError, resumeAudio } = get();
    if (!audioEngine) {
      setError('Audio engine not initialized');
      return;
    }

    // Resume audio context on first user interaction
    resumeAudio();

    try {
      audioEngine.play(deckId);
      get().updateDeckStates();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to play deck');
    }
  },

  stopDeck: (deckId: 'left' | 'right') => {
    const { audioEngine } = get();
    if (!audioEngine) return;

    audioEngine.stop(deckId);
    get().updateDeckStates();
  },

  setPlaybackRate: (deckId: 'left' | 'right', rate: number) => {
    const { audioEngine } = get();
    if (!audioEngine) return;

    audioEngine.setPlaybackRate(deckId, rate);
    get().updateDeckStates();
  },

  setCrossfader: (position: number) => {
    const { audioEngine } = get();
    if (!audioEngine) return;

    audioEngine.setCrossfader(position);
    set({ crossfaderPosition: position });
  },

  updateDeckStates: () => {
    const { audioEngine } = get();
    if (!audioEngine) return;

    set({
      leftDeck: audioEngine.getDeckState('left'),
      rightDeck: audioEngine.getDeckState('right'),
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));