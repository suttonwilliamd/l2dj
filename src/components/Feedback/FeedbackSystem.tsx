import React, { createContext, useContext, useState, useCallback } from 'react';

interface FeedbackEvent {
  id: string;
  type: 'success' | 'unlock' | 'hint' | 'error' | 'progress';
  message: string;
  duration?: number;
  targetControl?: string;
  data?: any;
}

interface FeedbackContextType {
  events: FeedbackEvent[];
  addEvent: (event: Omit<FeedbackEvent, 'id'>) => void;
  clearEvents: () => void;
  removeEvent: (id: string) => void;
  showSuccess: (message: string, targetControl?: string) => void;
  showUnlock: (message: string, targetControl?: string) => void;
  showHint: (message: string, targetControl?: string) => void;
  showError: (message: string, targetControl?: string) => void;
  showProgress: (message: string, data: any) => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<FeedbackEvent[]>([]);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const addEvent = useCallback((event: Omit<FeedbackEvent, 'id'>) => {
    const newEvent: FeedbackEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      duration: event.duration || 3000,
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Auto-remove after duration
    if (newEvent.duration && newEvent.duration > 0) {
      setTimeout(() => {
        removeEvent(newEvent.id);
      }, newEvent.duration);
    }
  }, [removeEvent]);

  const showSuccess = useCallback((message: string, targetControl?: string) => {
    addEvent({ type: 'success', message, targetControl });
  }, [addEvent]);

  const showUnlock = useCallback((message: string, targetControl?: string) => {
    addEvent({ type: 'unlock', message, targetControl, duration: 5000 });
  }, [addEvent]);

  const showHint = useCallback((message: string, targetControl?: string) => {
    addEvent({ type: 'hint', message, targetControl, duration: 4000 });
  }, [addEvent]);

  const showError = useCallback((message: string, targetControl?: string) => {
    addEvent({ type: 'error', message, targetControl, duration: 6000 });
  }, [addEvent]);

  const showProgress = useCallback((message: string, data: any) => {
    addEvent({ type: 'progress', message, data, duration: 2000 });
  }, [addEvent]);

  return (
    <FeedbackContext.Provider value={{
      events,
      addEvent,
      clearEvents,
      removeEvent,
      showSuccess,
      showUnlock,
      showHint,
      showError,
      showProgress,
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Visual Feedback Component
export const FeedbackDisplay: React.FC = () => {
  const { events, removeEvent } = useFeedback();

  const getEventStyles = (type: FeedbackEvent['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500 text-white';
      case 'unlock':
        return 'bg-blue-600 border-blue-500 text-white';
      case 'hint':
        return 'bg-amber-600 border-amber-500 text-white';
      case 'error':
        return 'bg-red-600 border-red-500 text-white';
      case 'progress':
        return 'bg-purple-600 border-purple-500 text-white';
      default:
        return 'bg-gray-600 border-gray-500 text-white';
    }
  };

  const getEventIcon = (type: FeedbackEvent['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'unlock':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z" />
          </svg>
        );
      case 'hint':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'progress':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      {events.map((event) => (
        <div
          key={event.id}
          className={`
            flex items-center p-3 rounded-lg border shadow-lg pointer-events-auto
            transform transition-all duration-300 animate-in slide-in-from-right
            ${getEventStyles(event.type)}
          `}
        >
          <div className="flex-shrink-0 mr-3">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{event.message}</p>
            {event.targetControl && (
              <p className="text-xs opacity-75 mt-1">Control: {event.targetControl}</p>
            )}
          </div>
          <button
            onClick={() => removeEvent(event.id)}
            className="ml-3 flex-shrink-0 opacity-75 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

// Hook for control-specific feedback
export const useControlFeedback = (controlId: string) => {
  const { showSuccess, showUnlock, showHint, showError } = useFeedback();

  return {
    showSuccess: (message: string) => showSuccess(message, controlId),
    showUnlock: (message: string) => showUnlock(message, controlId),
    showHint: (message: string) => showHint(message, controlId),
    showError: (message: string) => showError(message, controlId),
  };
};