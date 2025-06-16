import { useSmartAuth } from '@/hooks/use-smart-auth';

export interface AdminAccessResult {
  isAdmin: boolean;
  hasAdminAccess: boolean;
  hasMonitoringAccess: boolean;
  checkAdminAccess: () => boolean;
  requireAdminAccess: () => void;
}

export const useAdminAccess = (): AdminAccessResult => {
  const authContext = useSmartAuth();
  const { userProfile, isAdmin } = authContext || {};

  // In demo mode, isAdmin is directly available; otherwise derive from role
  const adminStatus = isAdmin !== undefined ? isAdmin : (userProfile?.role === 'Administrator');
  const hasMonitoringAccess = adminStatus;

  const checkAdminAccess = (): boolean => {
    console.log('🔐 [Admin Access Check] Admin Status:', adminStatus, 'Context Type:', authContext ? 'Available' : 'Missing');
    return adminStatus;
  };

  const requireAdminAccess = (): void => {
    if (!adminStatus) {
      throw new Error('Administrator access required for this feature');
    }
  };

  return {
    isAdmin: adminStatus,
    hasAdminAccess: adminStatus,
    hasMonitoringAccess,
    checkAdminAccess,
    requireAdminAccess
  };
};

export default useAdminAccess;
