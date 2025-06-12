import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { DemoAuthContext } from '@/contexts/DemoAuthContext';

/**
 * Smart auth hook that automatically detects and uses the appropriate auth context
 * - Uses DemoAuthContext when in demo mode
 * - Falls back to regular AuthContext otherwise
 */
export const useSmartAuth = () => {
  // Try to get demo auth context first
  const demoAuth = useContext(DemoAuthContext);
  const regularAuth = useContext(AuthContext);

  // If demo context is available, use it (demo mode is active)
  if (demoAuth) {
    console.log('🚀 [Smart Auth] Using Demo Auth Context - Admin Access:', demoAuth.isAdmin);
    return demoAuth;
  }

  // Otherwise, use regular auth context
  console.log('🔐 [Smart Auth] Using Regular Auth Context - Admin Access:', regularAuth?.isAdmin || false);
  return regularAuth;
};
