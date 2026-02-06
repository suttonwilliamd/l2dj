export interface DeckState {
  id: 'left' | 'right';
  isPlaying: boolean;
  playbackRate: number;
  audioBuffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
  volume: number;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private decks: Map<'left' | 'right', DeckState>;
  private crossfaderPosition: number = 0; // -1 (left) to 1 (right)

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    
    this.decks = new Map();
    this.initializeDecks();
  }

  private initializeDecks(): void {
    ['left', 'right'].forEach((deckId) => {
      const deck: DeckState = {
        id: deckId as 'left' | 'right',
        isPlaying: false,
        playbackRate: 1.0,
        audioBuffer: null,
        source: null,
        gainNode: this.audioContext.createGain(),
        volume: 1.0,
      };
      
      deck.gainNode.connect(this.masterGain);
      this.decks.set(deckId as 'left' | 'right', deck);
    });
  }

  async loadAudioFile(deckId: 'left' | 'right', file: File): Promise<void> {
    const deck = this.decks.get(deckId);
    if (!deck) throw new Error(`Deck ${deckId} not found`);

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    // Stop current playback if running
    this.stop(deckId);
    
    deck.audioBuffer = audioBuffer;
  }

  play(deckId: 'left' | 'right'): void {
    const deck = this.decks.get(deckId);
    if (!deck || !deck.audioBuffer) throw new Error(`No audio loaded on deck ${deckId}`);

    // Stop current playback if running
    this.stop(deckId);

    // Create new source
    const source = this.audioContext.createBufferSource();
    source.buffer = deck.audioBuffer;
    source.playbackRate.value = deck.playbackRate;
    source.connect(deck.gainNode!);
    source.start();

    deck.source = source;
    deck.isPlaying = true;

    // Handle playback end
    source.onended = () => {
      deck.isPlaying = false;
      deck.source = null;
    };
  }

  stop(deckId: 'left' | 'right'): void {
    const deck = this.decks.get(deckId);
    if (!deck) return;

    if (deck.source) {
      deck.source.stop();
      deck.source = null;
    }
    deck.isPlaying = false;
  }

  setPlaybackRate(deckId: 'left' | 'right', rate: number): void {
    const deck = this.decks.get(deckId);
    if (!deck) return;

    deck.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    
    if (deck.source) {
      deck.source.playbackRate.value = deck.playbackRate;
    }
  }

  setCrossfader(position: number): void {
    this.crossfaderPosition = Math.max(-1, Math.min(1, position));
    this.updateDeckVolumes();
  }

  private updateDeckVolumes(): void {
    const leftDeck = this.decks.get('left');
    const rightDeck = this.decks.get('right');
    
    if (!leftDeck || !rightDeck) return;

    // Calculate crossfader gains
    // When crossfader is at -1 (full left), left deck is 1.0, right deck is 0.0
    // When crossfader is at 1 (full right), left deck is 0.0, right deck is 1.0
    const leftGain = this.crossfaderPosition <= 0 ? 1.0 : 1.0 - this.crossfaderPosition;
    const rightGain = this.crossfaderPosition >= 0 ? 1.0 : 1.0 + this.crossfaderPosition;

    leftDeck.gainNode!.gain.value = leftGain * leftDeck.volume;
    rightDeck.gainNode!.gain.value = rightGain * rightDeck.volume;
  }

  setDeckVolume(deckId: 'left' | 'right', volume: number): void {
    const deck = this.decks.get(deckId);
    if (!deck) return;

    deck.volume = Math.max(0, Math.min(1, volume));
    this.updateDeckVolumes();
  }

  getDeckState(deckId: 'left' | 'right'): DeckState | undefined {
    return this.decks.get(deckId);
  }

  getCrossfaderPosition(): number {
    return this.crossfaderPosition;
  }

  resumeContext(): void {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}