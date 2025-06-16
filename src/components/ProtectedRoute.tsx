import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SecurityService } from '@/services/securityService';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import AccessDenied from '@/components/AccessDenied';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Administrator' | 'Management' | 'Employee';
  requiredPermissions?: string[];
  requireEmailVerification?: boolean;
}

interface UserProfile {
  user_id: string;
  role: 'Administrator' | 'Management' | 'Employee';
  station: string;
  employee_id: string;
  phone: string;
  hire_date: string;
  is_active: boolean;
  email_verified?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermissions = [],
  requireEmailVerification = false
}) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState<{ denied: boolean; reason: string }>({ denied: false, reason: '' });
  
  const location = useLocation();
  const { toast } = useToast();

  // Initialize session timeout
  useSessionTimeout({
    enabled: authenticated,
    timeoutMinutes: securitySettings?.accountSecurity?.sessionTimeout || 60,
    warningMinutes: 5,
    onTimeout: async () => {
      toast({
        title: 'Session Expired',
        description: 'Your session has expired due to inactivity.',
        variant: 'destructive'
      });
      await supabase.auth.signOut();
    }
  });

  const checkPermissions = (userRole: string, userPermissions: string[] = []): boolean => {
    // Admin has access to everything
    if (userRole === 'Administrator') return true;

    // Check role-based access
    if (requiredRole) {
      const roleHierarchy = ['Employee', 'Management', 'Administrator'];
      const userRoleIndex = roleHierarchy.indexOf(userRole);
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
      
      if (userRoleIndex < requiredRoleIndex) {
        return false;
      }
    }

    // Check specific permissions
    if (requiredPermissions.length > 0) {
      return requiredPermissions.every(permission => userPermissions.includes(permission));
    }

    return true;
  };

  const validateIPWhitelist = async (userIP: string): Promise<boolean> => {
    if (!securitySettings?.systemSecurity?.enableIPWhitelist) {
      return true;
    }

    const whitelist = securitySettings.systemSecurity.ipWhitelist || [];
    if (whitelist.length === 0) return true;

    // Simple IP matching (in production, use proper CIDR matching)
    return whitelist.some((allowedIP: string) => {
      if (allowedIP.includes('/')) {
        // CIDR notation - simplified check
        const [network] = allowedIP.split('/');
        return userIP.startsWith(network.substring(0, network.lastIndexOf('.')));
      }
      return userIP === allowedIP;
    });
  };

  const logSecurityEvent = async (eventType: string, details: any) => {
    try {
      await SecurityService.logSecurityEvent({
        event_type: eventType,
        user_id: user?.id,
        username: user?.email || 'unknown',
        ip_address: await SecurityService.getClientIP(),
        event_timestamp: new Date().toISOString(),
        event_status: 'success',
        action_performed: `Route access: ${location.pathname}`,
        risk_level: 'low',
        additional_data: JSON.stringify(details)
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // Get security settings first
        const { data: settings } = await SecurityService.getSecuritySettings();
        setSecuritySettings(settings);

        // Validate session
        const { valid, user: sessionUser, error } = await SecurityService.validateSession();
        
        if (!valid || !sessionUser) {
          console.log('Session validation failed:', error);
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setUser(sessionUser);
        setAuthenticated(true);

        // Get user profile with role information
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', sessionUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setAccessDenied({ denied: true, reason: 'Failed to load user profile' });
          setLoading(false);
          return;
        }

        if (!profile) {
          setAccessDenied({ denied: true, reason: 'User profile not found' });
          setLoading(false);
          return;
        }

        setUserProfile(profile);

        // Check if user account is active
        if (!profile.is_active) {
          setAccessDenied({ denied: true, reason: 'Account is deactivated' });
          await logSecurityEvent('access_denied', { reason: 'inactive_account' });
          setLoading(false);
          return;
        }

        // Check email verification if required
        if (requireEmailVerification && !sessionUser.email_confirmed_at) {
          setAccessDenied({ denied: true, reason: 'Email verification required' });
          await logSecurityEvent('access_denied', { reason: 'email_not_verified' });
          setLoading(false);
          return;
        }

        // Check role and permissions
        if (!checkPermissions(profile.role, [])) {
          setAccessDenied({ 
            denied: true, 
            reason: `Insufficient permissions. Required role: ${requiredRole || 'Not specified'}` 
          });
          await logSecurityEvent('access_denied', { 
            reason: 'insufficient_permissions',
            userRole: profile.role,
            requiredRole: requiredRole 
          });
          setLoading(false);
          return;
        }

        // Check IP whitelist if enabled
        const userIP = await SecurityService.getClientIP();
        if (!(await validateIPWhitelist(userIP))) {
          setAccessDenied({ denied: true, reason: 'IP address not in whitelist' });
          await logSecurityEvent('access_denied', { 
            reason: 'ip_not_whitelisted',
            userIP: userIP 
          });
          setLoading(false);
          return;
        }

        // Check concurrent session limits if enabled
        if (settings?.accessControl?.maxConcurrentUsers) {
          // This would require tracking active sessions in the database
          // For now, we'll skip this check
        }

        // Log successful access
        await logSecurityEvent('route_access_granted', {
          route: location.pathname,
          userRole: profile.role,
          requiredRole: requiredRole
        });

      } catch (error) {
        console.error('Auth check error:', error);
        setAuthenticated(false);
        setAccessDenied({ denied: true, reason: 'Authentication error occurred' });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_OUT' || !session) {
          setAuthenticated(false);
          setUser(null);
          setUserProfile(null);
          setAccessDenied({ denied: false, reason: '' });
        } else if (event === 'SIGNED_IN' && session) {
          // Re-check authentication when user signs in
          checkAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [location.pathname, requiredRole, requireEmailVerification]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Access denied - show error
  if (accessDenied.denied) {
    return (
      <AccessDenied
        feature={`Route: ${location.pathname}`}
        requiredRole={requiredRole}
        currentRole={userProfile?.role}
        reason={accessDenied.reason}
      />
    );
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default ProtectedRoute;
