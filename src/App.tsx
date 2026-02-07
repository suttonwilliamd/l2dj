import { useEffect } from 'react';
import { DeckDJ } from './components/Deck/DeckDJ';
import { TempoFaderVertical } from './components/Deck/TempoFaderVertical';
import { CrossfaderDJ } from './components/Crossfader/CrossfaderDJ';
import { NavigationMinimal } from './components/Navigation/NavigationMinimal';
import { FeedbackProvider, FeedbackDisplay } from './components/Feedback/FeedbackSystem';
import { AccessibilityProvider } from './components/Accessibility/AccessibilitySystem';
import { SkillTreeOverlay } from './components/SkillTree/SkillTreeOverlay';
import { HelpOverlay } from './components/Help/HelpOverlay';
import { useAudioStore } from './store/audioStore';
import { useNavigationStore } from './store/navigationStore';

function AppContent() {
  const { initializeAudio, error } = useAudioStore();
  const { currentSurface } = useNavigationStore();

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  if (currentSurface === 'play') {
    return (
      <div className="min-h-screen bg-metal-dark">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-metal-dark via-metal-medium to-metal-dark opacity-50"></div>
        
        {/* Main content container */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Page Navigation */}
          <div className="relative z-50 p-4">
            <NavigationMinimal />
          </div>

          {/* Skip Links */}
          <a href="#decks" className="skip-links">Skip to decks</a>
          <a href="#crossfader" className="skip-links" style={{ left: 100 }}>Skip to crossfader</a>

          {/* Error Display */}
          {error && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-red-900 border border-red-700 rounded-lg text-red-300 text-center max-w-md">
              {error}
            </div>
          )}

          {/* DJ Controller Container */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="dj-controller max-w-7xl w-full max-h-[80vh] rounded-xl shadow-2xl overflow-hidden border border-border-glow">
              {/* Left Tempo Fader Area */}
              <TempoFaderVertical deckId="left" />

              {/* Left Deck Area */}
              <div id="decks" className="deck-area deck-left">
                <DeckDJ deckId="left" />
              </div>

              {/* Center Mixer Area */}
              <div className="mixer-area">
                <div className="flex flex-col items-center justify-center gap-8">
                  {/* Logo */}
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎵</div>
                    <div className="text-sm font-bold text-secondary">L2DJ</div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="status-led cyan"></div>
                    <span className="text-xs text-dim">A</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="status-led red"></div>
                    <span className="text-xs text-dim">B</span>
                  </div>
                </div>
              </div>

              {/* Right Deck Area */}
              <div className="deck-area deck-right">
                <DeckDJ deckId="right" />
              </div>

              {/* Right Tempo Fader Area */}
              <TempoFaderVertical deckId="right" />

              {/* Bottom Crossfader Area */}
              <div id="crossfader" className="crossfader-area">
                <CrossfaderDJ />
              </div>

              {/* Overlays */}
              <SkillTreeOverlay />
              <HelpOverlay />
              <FeedbackDisplay />
            </div>
          </div>
      </div>
    </div>
    );
  }

  // Learn surface - simplified, progressive reveal
  if (currentSurface === 'learn') {
    return (
      <div className="min-h-screen bg-metal-dark text-white flex flex-col">
        <NavigationMinimal />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-secondary">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Learning Surface</h2>
            <p className="mb-6">Use the skill tree button to access learning content</p>
          </div>
        </main>
        <SkillTreeOverlay />
        <FeedbackDisplay />
      </div>
    );
  }

  // Context is now a help overlay, not a main surface
  return (
    <div className="min-h-screen bg-metal-dark text-white flex flex-col">
      <NavigationMinimal />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-secondary">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Help</h2>
          <p className="mb-6">Use the help button (?) for guidance</p>
        </div>
      </main>
      <HelpOverlay />
      <FeedbackDisplay />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <FeedbackProvider>
        <AppContent />
      </FeedbackProvider>
    </AccessibilityProvider>
  );
}

export default App;
