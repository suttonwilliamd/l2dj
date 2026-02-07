export interface SkillNode {
  id: string;
  displayName: string;
  band: 'perception' | 'manipulation' | 'intent';
  prerequisites: string[];
  vocabulary: string;
  objective: string;
  unlocks: {
    controls: string[];
    interactions: string[];
  };
  lesson: {
    description: string;
    task: string;
    duration: number; // in seconds
  };
  completionCriteria: {
    type: 'interaction' | 'time' | 'detection';
    conditions: Record<string, any>;
  };
}

export const SKILL_NODES: SkillNode[] = [
  // Perception Band
  {
    id: 'track_recognition',
    displayName: 'Track Recognition',
    band: 'perception',
    prerequisites: [],
    vocabulary: 'A track is a complete audio recording that can be loaded and played.',
    objective: 'Identify and understand what a track is in the DJ interface.',
    unlocks: {
      controls: ['file-input'],
      interactions: ['load-track'],
    },
    lesson: {
      description: 'Learn to recognize tracks in the interface.',
      task: 'Load your first track onto a deck.',
      duration: 30,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'load-track', count: 1 },
    },
  },
  {
    id: 'audio_perception',
    displayName: 'Audio Perception',
    band: 'perception',
    prerequisites: ['track_recognition'],
    vocabulary: 'Audio perception is the ability to hear and distinguish different elements in music.',
    objective: 'Recognize when audio is playing and identify basic sound characteristics.',
    unlocks: {
      controls: ['play-pause'],
      interactions: ['start-playback'],
    },
    lesson: {
      description: 'Learn to start and stop audio playback.',
      task: 'Press play to hear the track, then pause to stop it.',
      duration: 45,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'play-pause', count: 2 },
    },
  },
  {
    id: 'beat_awareness',
    displayName: 'Beat Awareness',
    band: 'perception',
    prerequisites: ['audio_perception'],
    vocabulary: 'Beats are the regular pulse that gives music its rhythmic structure.',
    objective: 'Identify and follow the beat of a playing track.',
    unlocks: {
      controls: ['beat-markers'],
      interactions: ['visualize-beats'],
    },
    lesson: {
      description: 'Learn to see and follow the beat in the waveform.',
      task: 'Watch the beat markers as the track plays.',
      duration: 60,
    },
    completionCriteria: {
      type: 'time',
      conditions: { action: 'listen-to-beats', duration: 30 },
    },
  },

  // Manipulation Band
  {
    id: 'deck_manipulation',
    displayName: 'Deck Manipulation',
    band: 'manipulation',
    prerequisites: ['audio_perception'],
    vocabulary: 'A deck is a playback system that allows you to control track playback.',
    objective: 'Control basic playback functions on a deck.',
    unlocks: {
      controls: ['transport'],
      interactions: ['seek-position'],
    },
    lesson: {
      description: 'Learn to control where the track plays from.',
      task: 'Use the seek control to jump to different parts of the track.',
      duration: 45,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'seek', count: 3 },
    },
  },
  {
    id: 'speed_adjustment',
    displayName: 'Speed Adjustment',
    band: 'manipulation',
    prerequisites: ['beat_awareness'],
    vocabulary: 'Speed control adjusts the playback tempo, measured in BPM (beats per minute).',
    objective: 'Adjust track speed to match different tempos.',
    unlocks: {
      controls: ['pitch-fader'],
      interactions: ['adjust-tempo'],
    },
    lesson: {
      description: 'Learn to speed up and slow down tracks.',
      task: 'Move the pitch fader to change the track speed.',
      duration: 60,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'adjust-speed', range: 0.2 },
    },
  },
  {
    id: 'crossfader_control',
    displayName: 'Crossfader Control',
    band: 'manipulation',
    prerequisites: ['deck_manipulation'],
    vocabulary: 'The crossfader blends audio between decks, controlling the mix.',
    objective: 'Control audio mixing between two decks.',
    unlocks: {
      controls: ['crossfader'],
      interactions: ['blend-audio'],
    },
    lesson: {
      description: 'Learn to blend audio between two decks.',
      task: 'Move the crossfader left and right to mix between decks.',
      duration: 60,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'move-crossfader', range: 0.8 },
    },
  },
  {
    id: 'dual_deck_control',
    displayName: 'Dual Deck Control',
    band: 'manipulation',
    prerequisites: ['crossfader_control'],
    vocabulary: 'Dual deck control allows you to operate two playback systems simultaneously.',
    objective: 'Control two decks independently.',
    unlocks: {
      controls: ['deck-b'],
      interactions: ['simultaneous-control'],
    },
    lesson: {
      description: 'Learn to control both decks at the same time.',
      task: 'Start playback on both decks and control them independently.',
      duration: 90,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'control-both-decks', duration: 30 },
    },
  },

  // Intent Band
  {
    id: 'tempo_matching',
    displayName: 'Tempo Matching',
    band: 'intent',
    prerequisites: ['speed_adjustment', 'dual_deck_control'],
    vocabulary: 'Tempo matching is aligning the speeds of two tracks for smooth transitions.',
    objective: 'Match tempos between two different tracks.',
    unlocks: {
      controls: ['bpm-display'],
      interactions: ['sync-tempos'],
    },
    lesson: {
      description: 'Learn to match speeds between two tracks.',
      task: 'Adjust the speed of one track to match the other.',
      duration: 120,
    },
    completionCriteria: {
      type: 'detection',
      conditions: { type: 'tempo-aligned', threshold: 0.05, duration: 8 },
    },
  },
  {
    id: 'beatmatching_manual',
    displayName: 'Manual Beatmatching',
    band: 'intent',
    prerequisites: ['tempo_matching'],
    vocabulary: 'Beatmatching is aligning the rhythmic elements of two tracks by ear.',
    objective: 'Align beats between two tracks without visual aids.',
    unlocks: {
      controls: ['waveform-detailed'],
      interactions: ['manual-align'],
    },
    lesson: {
      description: 'Learn to align beats by listening and adjusting.',
      task: 'Use tempo and position controls to align the beats of both tracks.',
      duration: 180,
    },
    completionCriteria: {
      type: 'detection',
      conditions: { type: 'beats-aligned', threshold: 0.1, duration: 16 },
    },
  },
  {
    id: 'basic_transition',
    displayName: 'Basic Transition',
    band: 'intent',
    prerequisites: ['beatmatching_manual'],
    vocabulary: 'A transition is the movement from one track to another while maintaining the flow.',
    objective: 'Execute a smooth transition between two tracks.',
    unlocks: {
      controls: ['eq-basic'],
      interactions: ['mix-transition'],
    },
    lesson: {
      description: 'Learn to create your first DJ transition.',
      task: 'Start the next track, match tempos, and blend using the crossfader.',
      duration: 240,
    },
    completionCriteria: {
      type: 'detection',
      conditions: { type: 'successful-transition', duration: 32 },
    },
  },
  {
    id: 'phrase_awareness',
    displayName: 'Phrase Awareness',
    band: 'intent',
    prerequisites: ['basic_transition'],
    vocabulary: 'Musical phrases are sections of music that form complete ideas, typically 8-32 bars.',
    objective: 'Understand and use musical structure for better transitions.',
    unlocks: {
      controls: ['phrase-markers'],
      interactions: ['phrase-planning'],
    },
    lesson: {
      description: 'Learn to identify musical phrases and structure.',
      task: 'Identify where musical phrases begin and end in your tracks.',
      duration: 180,
    },
    completionCriteria: {
      type: 'interaction',
      conditions: { action: 'identify-phrases', count: 4 },
    },
  },
];

// Enhanced band color system with visual hierarchy
export const BAND_VISUAL_SYSTEM = {
  perception: {
    primary: '#3B82F6',    // Main accent
    light: '#93C5FD',     // Available nodes
    dark: '#1E40AF',      // Completed nodes
    glow: 'rgba(59, 130, 246, 0.5)', // Animation effects
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
  },
  manipulation: {
    primary: '#10B981',
    light: '#4ADE80',
    dark: '#065F46',
    glow: 'rgba(16, 185, 129, 0.5)',
    gradient: 'linear-gradient(135deg, #10B981, #065F46)'
  },
  intent: {
    primary: '#F59E0B',
    light: '#FBBF24',
    dark: '#92400E',
    glow: 'rgba(245, 158, 11, 0.5)',
    gradient: 'linear-gradient(135deg, #F59E0B, #92400E)'
  }
};

export const BAND_COLORS = {
  perception: '#3B82F6', // blue
  manipulation: '#10B981', // green
  intent: '#F59E0B', // amber
};

export const getNodesByBand = (band: SkillNode['band']) => {
  return SKILL_NODES.filter(node => node.band === band);
};

export const getNodeById = (id: string): SkillNode | undefined => {
  return SKILL_NODES.find(node => node.id === id);
};

export const getAvailableNodes = (unlockedNodes: Set<string>): SkillNode[] => {
  return SKILL_NODES.filter(node => 
    !unlockedNodes.has(node.id) && 
    node.prerequisites.every(prereq => unlockedNodes.has(prereq))
  );
};

export const getCompletedNodes = (unlockedNodes: Set<string>): SkillNode[] => {
  return SKILL_NODES.filter(node => unlockedNodes.has(node.id));
};