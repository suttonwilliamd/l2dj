import { create } from 'zustand';
import { useCallback } from 'react';
import { useSkillProgressStore } from './navigationStore';
import { getNodeById } from '../data/skillNodes';

interface InteractionTracker {
  interactionCounts: Map<string, number>;
  interactionData: Map<string, any>;
  trackInteraction: (action: string, data?: any) => void;
  getInteractionCount: (action: string) => number;
  getInteractionData: (action: string) => any;
  resetInteractions: () => void;
}

interface CompletionDetector {
  trackingSessions: Map<string, { startTime: number; data: any }>;
  detectCompletion: (nodeId: string) => boolean;
  startTracking: (nodeId: string) => void;
  stopTracking: (nodeId: string) => void;
  getProgress: (nodeId: string) => any;
}

export const useInteractionTracker = create<InteractionTracker>((set, get) => ({
  interactionCounts: new Map<string, number>(),
  interactionData: new Map<string, any>(),

  trackInteraction: (action: string, data?: any) => {
    const { interactionCounts, interactionData } = get();
    
    // Update count
    const newCount = (interactionCounts.get(action) || 0) + 1;
    const newCounts = new Map(interactionCounts);
    newCounts.set(action, newCount);
    
    // Update data
    const newData = new Map(interactionData);
    if (data) {
      const existingData = newData.get(action) || {};
      newData.set(action, { ...existingData, ...data, lastUpdate: Date.now() });
    }
    
    set({
      interactionCounts: newCounts,
      interactionData: newData,
    });
  },

  getInteractionCount: (action: string) => {
    return get().interactionCounts.get(action) || 0;
  },

  getInteractionData: (action: string) => {
    return get().interactionData.get(action);
  },

  resetInteractions: () => {
    set({
      interactionCounts: new Map(),
      interactionData: new Map(),
    });
  },
}));

export const useCompletionDetector = create<CompletionDetector>((set, get) => ({
  trackingSessions: new Map<string, { startTime: number; data: any }>(),

  startTracking: (nodeId: string) => {
    const { trackingSessions } = get();
    const newSessions = new Map(trackingSessions);
    newSessions.set(nodeId, {
      startTime: Date.now(),
      data: {},
    });
    set({ trackingSessions: newSessions });
  },

  stopTracking: (nodeId: string) => {
    const { trackingSessions } = get();
    const newSessions = new Map(trackingSessions);
    newSessions.delete(nodeId);
    set({ trackingSessions: newSessions });
  },

  getProgress: (nodeId: string) => {
    const session = get().trackingSessions.get(nodeId);
    if (!session) return null;

    const node = getNodeById(nodeId);
    if (!node) return null;

    const tracker = useInteractionTracker.getState();
    const criteria = node.completionCriteria;

    switch (criteria.type) {
      case 'interaction':
        return getInteractionProgress(criteria, tracker);
      
      case 'time':
        return getTimeProgress(criteria, session);
      
      case 'detection':
        return getDetectionProgress(criteria, session.data);
      
      default:
        return null;
    }
  },

  detectCompletion: (nodeId: string) => {
    const node = getNodeById(nodeId);
    if (!node) return false;

    const { completedNodes } = useSkillProgressStore.getState();
    if (completedNodes.has(nodeId)) return true;

    const progress = get().getProgress(nodeId);
    if (!progress) return false;

    const criteria = node.completionCriteria;
    
    switch (criteria.type) {
      case 'interaction':
        return checkInteractionCompletion(criteria, progress);
      
      case 'time':
        return checkTimeCompletion(criteria, progress);
      
      case 'detection':
        return checkDetectionCompletion(criteria, progress);
      
      default:
        return false;
    }
  },
}));

// Progress calculation functions
function getInteractionProgress(criteria: any, tracker: any) {
  const { conditions } = criteria;
  
  switch (conditions.action) {
    case 'load-track':
      return {
        count: tracker.getInteractionCount('load-track'),
        required: conditions.count,
        completed: tracker.getInteractionCount('load-track') >= conditions.count,
      };
    
    case 'play-pause':
      return {
        count: tracker.getInteractionCount('play-pause'),
        required: conditions.count,
        completed: tracker.getInteractionCount('play-pause') >= conditions.count,
      };
    
    case 'seek':
      return {
        count: tracker.getInteractionCount('seek'),
        required: conditions.count,
        completed: tracker.getInteractionCount('seek') >= conditions.count,
      };
    
    case 'adjust-speed': {
      const speedData = tracker.getInteractionData('adjust-speed');
      const speedRange = speedData ? Math.abs(speedData.max - speedData.min) : 0;
      return {
        range: speedRange,
        required: conditions.range,
        completed: speedRange >= conditions.range,
      };
    }
    
    case 'move-crossfader': {
      const crossfaderData = tracker.getInteractionData('move-crossfader');
      const crossfaderRange = crossfaderData ? Math.abs(crossfaderData.max - crossfaderData.min) : 0;
      return {
        range: crossfaderRange,
        required: conditions.range,
        completed: crossfaderRange >= conditions.range,
      };
    }
    
    case 'control-both-decks': {
      const bothDeckData = tracker.getInteractionData('control-both-decks');
      const controlTime = bothDeckData?.simultaneousTime || 0;
      return {
        time: controlTime,
        required: conditions.duration,
        completed: controlTime >= conditions.duration,
      };
    }
    
    case 'identify-phrases':
      return {
        count: tracker.getInteractionCount('identify-phrases'),
        required: conditions.count,
        completed: tracker.getInteractionCount('identify-phrases') >= conditions.count,
      };
    
    default:
      return null;
  }
}

function getTimeProgress(criteria: any, session: any) {
  const { conditions } = criteria;
  const elapsedTime = (Date.now() - session.startTime) / 1000; // Convert to seconds
  
  switch (conditions.action) {
    case 'listen-to-beats':
      return {
        time: elapsedTime,
        required: conditions.duration,
        completed: elapsedTime >= conditions.duration,
      };
    
    default:
      return null;
  }
}

function getDetectionProgress(_data: any, _sessionData: any) {
  // This would be implemented with actual audio analysis
  // For now, return placeholder progress
  return {
    detected: false,
    confidence: 0,
    threshold: 0.8,
  };
}

// Completion checking functions
function checkInteractionCompletion(_criteria: any, progress: any): boolean {
  if (!progress) return false;
  return progress.completed;
}

function checkTimeCompletion(_criteria: any, progress: any): boolean {
  if (!progress) return false;
  return progress.completed;
}

function checkDetectionCompletion(_criteria: any, progress: any): boolean {
  if (!progress) return false;
  return progress.detected && progress.confidence >= progress.threshold;
}

// Hook for components to track interactions
export const useInteractionTracking = (nodeId: string) => {
  const tracker = useInteractionTracker();
  const detector = useCompletionDetector();
  const { completeNode } = useSkillProgressStore();

  const trackAction = useCallback((action: string, data?: any) => {
    tracker.trackInteraction(action, data);
    
    // Check if this completes the current node
    if (detector.detectCompletion(nodeId)) {
      completeNode(nodeId);
    }
  }, [tracker, detector, completeNode, nodeId]);

  const startTracking = useCallback(() => {
    detector.startTracking(nodeId);
  }, [detector, nodeId]);

  const stopTracking = useCallback(() => {
    detector.stopTracking(nodeId);
  }, [detector, nodeId]);

  const getProgress = useCallback(() => {
    return detector.getProgress(nodeId);
  }, [detector, nodeId]);

  return {
    trackAction,
    startTracking,
    stopTracking,
    getProgress,
  };
};