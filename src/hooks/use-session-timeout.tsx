import { useEffect, useRef, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SecurityService } from '@/services/securityService';

interface SessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  checkIntervalSeconds?: number;
  onTimeout?: () => void;
  onWarning?: (minutesRemaining: number) => void;
  enabled?: boolean;
}

export const useSessionTimeout = (options: SessionTimeoutOptions = {}) => {
  const {
    timeoutMinutes = 60,
    warningMinutes = 5,
    checkIntervalSeconds = 30,
    onTimeout,
    onWarning,
    enabled = true
  } = options;

  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const checkIntervalRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  // Update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    localStorage.setItem('lastActivity', lastActivityRef.current.toString());
  }, []);

  // Check session validity
  const checkSession = useCallback(async () => {
    if (!enabled) return;

    try {
      const { valid, error } = await SecurityService.validateSession();
      
      if (!valid) {
        console.log('Session invalid:', error);
        if (onTimeout) {
          onTimeout();
        } else {
          await supabase.auth.signOut();
          toast({
            title: 'Session Expired',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive'
          });
        }
        return;
      }

      // Check for timeout warning
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      const warningMs = warningMinutes * 60 * 1000;
      const timeRemaining = timeoutMs - timeSinceLastActivity;

      if (timeRemaining <= warningMs && !warningShownRef.current) {
        warningShownRef.current = true;
        const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000));
        
        if (onWarning) {
          onWarning(minutesRemaining);
        } else {
          toast({
            title: 'Session Warning',
            description: `Your session will expire in ${minutesRemaining} minute(s). Click anywhere to extend.`,
            variant: 'default'
          });
        }
      }

      if (timeRemaining <= 0) {
        console.log('Session timed out due to inactivity');
        if (onTimeout) {
          onTimeout();
        } else {
          await supabase.auth.signOut();
          toast({
            title: 'Session Expired',
            description: 'Your session has expired due to inactivity.',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, [enabled, timeoutMinutes, warningMinutes, onTimeout, onWarning, toast]);

  // Activity event handlers
  const handleActivity = useCallback((event: Event) => {
    // Only update activity for meaningful user interactions
    if (event.type === 'mousemove' || event.type === 'scroll') {
      // Throttle mouse move and scroll events
      const now = Date.now();
      if (now - lastActivityRef.current < 5000) return; // Only update every 5 seconds
    }
    updateActivity();
  }, [updateActivity]);

  // Setup and cleanup
  useEffect(() => {
    if (!enabled) return;

    // Initialize last activity
    const storedActivity = localStorage.getItem('lastActivity');
    if (storedActivity) {
      lastActivityRef.current = parseInt(storedActivity);
    } else {
      updateActivity();
    }

    // Set up activity listeners
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up session checking interval
    checkIntervalRef.current = setInterval(checkSession, checkIntervalSeconds * 1000);

    // Initial session check
    checkSession();

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, checkIntervalSeconds, handleActivity, checkSession]);

  // Manual session extension
  const extendSession = useCallback(() => {
    updateActivity();
    toast({
      title: 'Session Extended',
      description: 'Your session has been extended.',
      variant: 'default'
    });
  }, [updateActivity, toast]);

  // Get remaining session time
  const getRemainingTime = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const remainingMs = timeoutMs - timeSinceLastActivity;
    return Math.max(0, remainingMs);
  }, [timeoutMinutes]);

  return {
    extendSession,
    getRemainingTime,
    updateActivity
  };
};

// Session timeout provider component
import React from 'react';

interface SessionTimeoutContextType {
  extendSession: () => void;
  getRemainingTime: () => number;
  updateActivity: () => void;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | null>(null);

interface SessionTimeoutProviderProps {
  children: ReactNode;
  options?: SessionTimeoutOptions;
}

export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const sessionTimeout = useSessionTimeout(options);

  return (
    <SessionTimeoutContext.Provider value={sessionTimeout}>
      {children}
    </SessionTimeoutContext.Provider>
  );
};

export const useSessionTimeoutContext = () => {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error('useSessionTimeoutContext must be used within a SessionTimeoutProvider');
  }
  return context;
};

// Session timeout warning component
interface SessionTimeoutWarningProps {
  isOpen: boolean;
  minutesRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isOpen,
  minutesRemaining,
  onExtend,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Session Expiring Soon</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your session will expire in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''} due to inactivity. 
          Would you like to extend your session?
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onExtend}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Extend Session
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default useSessionTimeout;