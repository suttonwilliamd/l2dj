export interface Skill {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  unlocks: {
    vocabulary: string[];
    controls: string[];
  };
  lesson: string;
}

export const SKILLS: Skill[] = [
  {
    id: 'track-basics',
    name: 'Track Basics',
    description: 'Understand what a track is and how to load it',
    prerequisites: [],
    unlocks: {
      vocabulary: ['track'],
      controls: ['file-input'],
    },
    lesson: 'A track is a complete audio recording. Load tracks onto decks to prepare them for playback.',
  },
  {
    id: 'deck-control',
    name: 'Deck Control',
    description: 'Learn to start and stop playback',
    prerequisites: ['track-basics'],
    unlocks: {
      vocabulary: ['deck', 'playback'],
      controls: ['play-pause'],
    },
    lesson: 'A deck is a playback system. Use play/pause to control when a track is audible.',
  },
  {
    id: 'speed-control',
    name: 'Speed Control',
    description: 'Adjust playback speed to match tempos',
    prerequisites: ['deck-control'],
    unlocks: {
      vocabulary: ['tempo', 'speed', 'bpm'],
      controls: ['speed-slider'],
    },
    lesson: 'Speed control adjusts how fast a track plays. Match speeds between tracks for smooth transitions.',
  },
  {
    id: 'crossfader-basics',
    name: 'Crossfader Basics',
    description: 'Blend audio between two decks',
    prerequisites: ['deck-control'],
    unlocks: {
      vocabulary: ['crossfader', 'mixing'],
      controls: ['crossfader'],
    },
    lesson: 'The crossfader blends audio between decks. Move left for deck A, right for deck B.',
  },
  {
    id: 'beatmatching',
    name: 'Beatmatching',
    description: 'Sync rhythms between two tracks',
    prerequisites: ['speed-control', 'crossfader-basics'],
    unlocks: {
      vocabulary: ['beatmatching', 'sync', 'rhythm'],
      controls: [],
    },
    lesson: 'Beatmatching is aligning the rhythmic elements of two tracks. Use speed controls to match tempos, then blend with the crossfader.',
  },
  {
    id: 'transition',
    name: 'Basic Transitions',
    description: 'Move smoothly between tracks',
    prerequisites: ['beatmatching'],
    unlocks: {
      vocabulary: ['transition', 'mix'],
      controls: [],
    },
    lesson: 'A transition is the movement from one track to another. Start the next track, match speeds, then use the crossfader to blend.',
  },
];