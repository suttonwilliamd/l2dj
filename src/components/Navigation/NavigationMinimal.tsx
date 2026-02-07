import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';

export const NavigationMinimal: React.FC = () => {
  const {
    toggleSkillTree,
    toggleContextPanel,
    focusMode,
    toggleFocusMode
  } = useNavigationStore();



  return (
    <div className="bg-surface-control border border-light rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg">


      {/* Utility buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSkillTree}
          className="icon-button"
          data-tooltip="Skill Tree"
          aria-label="Open skill tree"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>

        <button
          onClick={toggleContextPanel}
          className="icon-button"
          data-tooltip="Help"
          aria-label="Open help"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <button
          onClick={toggleFocusMode}
          className={`icon-button ${focusMode ? 'active' : ''}`}
          data-tooltip={focusMode ? 'Exit Focus' : 'Focus Mode'}
          aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
