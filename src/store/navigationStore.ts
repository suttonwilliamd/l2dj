import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAvailableNodes, getNodeById } from '../data/skillNodes';
import type { SkillNode } from '../data/skillNodes';

interface NavigationState {
  currentSurface: 'learn' | 'play' | 'context';
  isSkillTreeOpen: boolean;
  isContextPanelOpen: boolean;
  activeNodeId: string | null;
  focusMode: boolean;
  
  // Actions
  setCurrentSurface: (surface: 'learn' | 'play' | 'context') => void;
  toggleSkillTree: () => void;
  toggleContextPanel: () => void;
  setActiveNode: (nodeId: string | null) => void;
  toggleFocusMode: () => void;
  startNodeExercise: (nodeId: string) => void;
}

interface SkillProgressState {
  completedNodes: Set<string>;
  availableNodes: SkillNode[];
  currentExercise: string | null;
  exerciseProgress: Record<string, any>;
  
  // Actions
  completeNode: (nodeId: string) => void;
  isNodeCompleted: (nodeId: string) => boolean;
  isNodeAvailable: (nodeId: string) => boolean;
  updateExerciseProgress: (nodeId: string, progress: any) => void;
  getExerciseProgress: (nodeId: string) => any;
  refreshAvailableNodes: () => void;
}

interface CompletionState {
  checkCompletion: (nodeId: string, interactionData: any) => boolean;
  getCompletionCriteria: (nodeId: string) => any;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      currentSurface: 'play',
      isSkillTreeOpen: false,
      isContextPanelOpen: false,
      activeNodeId: null,
      focusMode: false,

      setCurrentSurface: (surface) => set({ currentSurface: surface }),
      
      toggleSkillTree: () => set((state) => ({ 
        isSkillTreeOpen: !state.isSkillTreeOpen,
        isContextPanelOpen: state.isSkillTreeOpen ? false : state.isContextPanelOpen
      })),
      
      toggleContextPanel: () => set((state) => ({ 
        isContextPanelOpen: !state.isContextPanelOpen,
        isSkillTreeOpen: state.isContextPanelOpen ? false : state.isSkillTreeOpen
      })),
      
      setActiveNode: (nodeId) => set({ activeNodeId: nodeId }),
      
      toggleFocusMode: () => set((state) => ({ 
        focusMode: !state.focusMode,
        isSkillTreeOpen: false,
        isContextPanelOpen: false
      })),
      
      startNodeExercise: (nodeId) => {
        const node = getNodeById(nodeId);
        if (node) {
          set({
            activeNodeId: nodeId,
            currentSurface: 'play',
            isSkillTreeOpen: false,
            isContextPanelOpen: true,
          });
        }
      },
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        currentSurface: state.currentSurface,
        focusMode: state.focusMode,
      }),
    }
  )
);

export const useSkillProgressStore = create<SkillProgressState & CompletionState>()(
  persist(
    (set, get) => ({
      completedNodes: new Set(),
      availableNodes: [],
      currentExercise: null,
      exerciseProgress: {},

      completeNode: (nodeId: string) => {
        const { completedNodes } = get();
        if (completedNodes.has(nodeId)) return;

        const newCompletedNodes = new Set(completedNodes).add(nodeId);
        set({ completedNodes: newCompletedNodes });
        
        // Refresh available nodes
        get().refreshAvailableNodes();
      },

      isNodeCompleted: (nodeId: string) => {
        return get().completedNodes.has(nodeId);
      },

      isNodeAvailable: (nodeId: string) => {
        const { completedNodes } = get();
        const node = getNodeById(nodeId);
        if (!node) return false;
        
        return node.prerequisites.every(prereq => completedNodes.has(prereq));
      },

      updateExerciseProgress: (nodeId: string, progress: any) => {
        set((state) => ({
          exerciseProgress: {
            ...state.exerciseProgress,
            [nodeId]: progress,
          },
        }));
      },

      getExerciseProgress: (nodeId: string) => {
        return get().exerciseProgress[nodeId];
      },

      refreshAvailableNodes: () => {
        const { completedNodes } = get();
        const available = getAvailableNodes(completedNodes);
        set({ availableNodes: available });
      },

      checkCompletion: (nodeId: string, interactionData: any) => {
        const node = getNodeById(nodeId);
        if (!node) return false;

        const criteria = node.completionCriteria;
        const currentProgress = get().getExerciseProgress(nodeId) || {};

        switch (criteria.type) {
          case 'interaction':
            return checkInteractionCompletion(criteria, interactionData, currentProgress);
          
          case 'time':
            return checkTimeCompletion(criteria, interactionData, currentProgress);
          
          case 'detection':
            return checkDetectionCompletion(criteria, interactionData, currentProgress);
          
          default:
            return false;
        }
      },

      getCompletionCriteria: (nodeId: string) => {
        const node = getNodeById(nodeId);
        return node?.completionCriteria || null;
      },
    }),
    {
      name: 'skill-progress-storage',
      partialize: (state) => ({
        completedNodes: Array.from(state.completedNodes),
        exerciseProgress: state.exerciseProgress,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.completedNodes = new Set(state.completedNodes);
          state.refreshAvailableNodes();
        }
      },
    }
  )
);

// Completion checking functions
function checkInteractionCompletion(criteria: any, _interactionData: any, currentProgress: any): boolean {
  const { conditions } = criteria;
  
  switch (conditions.action) {
    case 'load-track':
      return (currentProgress.loadCount || 0) >= conditions.count;
    
    case 'play-pause':
      return (currentProgress.playPauseCount || 0) >= conditions.count;
    
    case 'seek':
      return (currentProgress.seekCount || 0) >= conditions.count;
    
    case 'adjust-speed':
      return (currentProgress.speedRange || 0) >= conditions.range;
    
    case 'move-crossfader':
      return (currentProgress.crossfaderRange || 0) >= conditions.range;
    
    case 'control-both-decks':
      return (currentProgress.bothDeckControlTime || 0) >= conditions.duration;
    
    case 'identify-phrases':
      return (currentProgress.phrasesIdentified || 0) >= conditions.count;
    
    default:
      return false;
  }
}

function checkTimeCompletion(criteria: any, _interactionData: any, currentProgress: any): boolean {
  const { conditions } = criteria;
  
  switch (conditions.action) {
    case 'listen-to-beats':
      return (currentProgress.listeningTime || 0) >= conditions.duration;
    
    default:
      return false;
  }
}

function checkDetectionCompletion(criteria: any, _interactionData: any, currentProgress: any): boolean {
  const { conditions } = criteria;
  
  switch (conditions.type) {
    case 'tempo-aligned':
      return currentProgress.tempoDifference <= conditions.threshold && 
             currentProgress.alignedTime >= conditions.duration;
    
    case 'beats-aligned':
      return currentProgress.beatOffset <= conditions.threshold && 
             currentProgress.alignedTime >= conditions.duration;
    
    case 'successful-transition':
      return currentProgress.transitionTime >= conditions.duration;
    
    default:
      return false;
  }
}

// Initialize available nodes on store creation
useSkillProgressStore.getState().refreshAvailableNodes();