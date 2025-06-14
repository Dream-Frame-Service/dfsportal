import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SessionTimeoutConfig {
  timeoutMinutes?: number;
  warningMinutes?: number;
  checkIntervalSeconds?: number;
  onTimeout?: () => void;
  onWarning?: (remainingMinutes: number) => void;
  resetOnActivity?: boolean;
}

interface SessionTimeoutState {
  isActive: boolean;
  remainingTime: number;
  isWarningShown: boolean;
  lastActivity: Date;
}

export const useSessionTimeout = (config: SessionTimeoutConfig = {}) => {
  const {
    timeoutMinutes = 30,
    warningMinutes = 5,
    checkIntervalSeconds = 60,
    onTimeout,
    onWarning,
    resetOnActivity = true
  } = config;

  const [state, setState] = useState<SessionTimeoutState>({
    isActive: true,
    remainingTime: timeoutMinutes,
    isWarningShown: false,
    lastActivity: new Date()
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset session timer
  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      remainingTime: timeoutMinutes,
      isWarningShown: false,
      lastActivity: new Date()
    }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout for session expiry
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isActive: false }));
      onTimeout?.();
      toast.error('Session expired due to inactivity');
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, onTimeout]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (resetOnActivity) {
      resetTimer();
    }
  }, [resetOnActivity, resetTimer]);

  // Check session status
  const checkSession = useCallback(() => {
    setState(prev => {
      const now = new Date();
      const timeSinceActivity = (now.getTime() - prev.lastActivity.getTime()) / (1000 * 60);
      const remaining = Math.max(0, timeoutMinutes - timeSinceActivity);

      // Show warning if approaching timeout
      if (remaining <= warningMinutes && !prev.isWarningShown && remaining > 0) {
        onWarning?.(Math.ceil(remaining));
        toast.warning(`Session will expire in ${Math.ceil(remaining)} minutes`);
        return { ...prev, remainingTime: remaining, isWarningShown: true };
      }

      // Session expired
      if (remaining <= 0 && prev.isActive) {
        onTimeout?.();
        toast.error('Session expired due to inactivity');
        return { ...prev, isActive: false, remainingTime: 0 };
      }

      return { ...prev, remainingTime: remaining };
    });
  }, [timeoutMinutes, warningMinutes, onTimeout, onWarning]);

  // Initialize session timeout
  useEffect(() => {
    resetTimer();

    // Set up periodic session check
    intervalRef.current = setInterval(checkSession, checkIntervalSeconds * 1000);

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, checkSession, handleActivity, checkIntervalSeconds]);

  // Extend session manually
  const extendSession = useCallback((additionalMinutes: number = timeoutMinutes) => {
    setState(prev => ({
      ...prev,
      remainingTime: prev.remainingTime + additionalMinutes,
      isWarningShown: false,
      lastActivity: new Date()
    }));
    
    toast.success(`Session extended by ${additionalMinutes} minutes`);
  }, [timeoutMinutes]);

  // End session manually
  const endSession = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false, remainingTime: 0 }));
    onTimeout?.();
  }, [onTimeout]);

  return {
    isActive: state.isActive,
    remainingTime: Math.ceil(state.remainingTime),
    isWarningShown: state.isWarningShown,
    lastActivity: state.lastActivity,
    resetTimer,
    extendSession,
    endSession
  };
};

export default useSessionTimeout;