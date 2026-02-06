import { useEffect } from 'react';
import { Deck } from './components/Deck/Deck';
import { Crossfader } from './components/Crossfader/Crossfader';
import { SkillTree } from './components/SkillTree/SkillTree';
import { useAudioStore } from './store/audioStore';
import './App.css';

function App() {
  const { initializeAudio, error } = useAudioStore();

  useEffect(() => {
    // Initialize audio engine on mount
    initializeAudio();
  }, [initializeAudio]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-center">L2DJ - Interactive DJ Learning Platform</h1>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 p-4 m-4 rounded">
          <p className="text-center">{error}</p>
        </div>
      )}

      {/* Main DJ Interface with Spatial Layout */}
      <main className="container mx-auto p-8">
        <div className="dj-interface flex items-center justify-center space-x-8">
          {/* Left Deck */}
          <div className="deck-left">
            <Deck deckId="left" />
          </div>

          {/* Center Mixer Section */}
          <div className="mixer-section flex flex-col items-center space-y-6">
            {/* Visual Separator */}
            <div className="h-px bg-gray-600 w-64"></div>
            
            {/* Crossfader */}
            <Crossfader />
            
            {/* Visual Separator */}
            <div className="h-px bg-gray-600 w-64"></div>
          </div>

          {/* Right Deck */}
          <div className="deck-right">
            <Deck deckId="right" />
          </div>
        </div>

        {/* Skill Tree & Instructions Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Skill Tree */}
          <div className="flex justify-center">
            <SkillTree />
          </div>
          
          {/* Instructions */}
          <div className="text-gray-400">
            <h2 className="text-lg font-semibold mb-4 text-white">Getting Started</h2>
            <ol className="text-sm space-y-2">
              <li>1. Start with the skill tree - unlock "Track Basics" to load your first track</li>
              <li>2. Progress through skills to unlock controls gradually</li>
              <li>3. Load audio files onto both decks when file input is unlocked</li>
              <li>4. Use play/pause controls when they become available</li>
              <li>5. Adjust speed controls to match tempos</li>
              <li>6. Use the crossfader to blend between decks</li>
            </ol>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-300">
                <strong>Learning Philosophy:</strong> Each control is locked until you understand the concept behind it. 
                This builds real DJ skills that transfer to actual hardware.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-12">
        <p className="text-center text-gray-400 text-sm">
          L2DJ - Learn DJ fundamentals through interactive practice
        </p>
      </footer>
    </div>
  );
}

export default App;
