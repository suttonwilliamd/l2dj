export interface DeckState {
  id: 'left' | 'right';
  isPlaying: boolean;
  playbackRate: number;
  audioBuffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
  volume: number;
}