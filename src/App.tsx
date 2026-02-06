import React, { useEffect } from 'react';
import { Deck } from './components/Deck/Deck';
import { Crossfader } from './components/Crossfader/Crossfader';
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

        {/* Instructions */}
        <div className="mt-12 text-center text-gray-400 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
          <ol className="text-sm space-y-2 text-left">
            <li>1. Load audio files onto both decks using the file inputs</li>
            <li>2. Press Play on the deck you want to start with</li>
            <li>3. Use the speed controls to match the tempo</li>
            <li>4. Use the crossfader to blend between decks</li>
          </ol>
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
