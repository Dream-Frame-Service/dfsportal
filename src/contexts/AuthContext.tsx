import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import AuditLoggerService from '@/services/auditLogger';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/supabaseService';

interface User {
  ID: number;
  Name: string;
  Email: string;
  CreateTime: string;
}

interface UserProfile {
  ID: number;
  user_id: number;
  role: 'Administrator' | 'Management' | 'Employee';
  station: string;
  employee_id: string;
  phone: string;
  hire_date: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  hasPermission: (feature: string, action: 'read' | 'write') => boolean;
  canEdit: (feature?: string) => boolean;
  canDelete: (feature?: string) => boolean;
  canCreate: (feature?: string) => boolean;
  canViewLogs: (feature?: string) => boolean;
  isVisualEditingEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the context for use in smart auth hook
export { AuthContext };

// Access matrix with monitoring restrictions
const ACCESS_MATRIX = {
  Employee: {
    dashboard: ['read', 'write'],
    products: ['read', 'write'],
    employees: ['read', 'write'],
    sales: ['read', 'write'],
    vendors: ['read', 'write'],
    orders: ['read', 'write'],
    licenses: ['read', 'write'],
    monitoring: [] // No monitoring access
  },
  Management: {
    dashboard: ['read', 'write'],
    products: ['read', 'write'],
    employees: ['read', 'write'],
    sales: ['read', 'write'],
    vendors: ['read', 'write'],
    orders: ['read', 'write'],
    licenses: ['read', 'write'],
    monitoring: [] // No monitoring access
  },
  Administrator: {
    dashboard: ['read', 'write'],
    products: ['read', 'write'],
    employees: ['read', 'write'],
    sales: ['read', 'write'],
    vendors: ['read', 'write'],
    orders: ['read', 'write'],
    licenses: ['read', 'write'],
    monitoring: ['read', 'write'] // Full monitoring access
  }
};

export const AuthProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const { data, error } = await AuthService.getCurrentUser();
      if (error) {
        console.log('No active session');
        setLoading(false);
        return;
      }

      if (data) {
        // Map Supabase user to legacy User interface
        const legacyUser: User = {
          ID: parseInt(data.id) || 0,
          Name: data.email?.split('@')[0] || '',
          Email: data.email || '',
          CreateTime: data.created_at || new Date().toISOString()
        };
        setUser(legacyUser);
        await fetchUserProfile(legacyUser.ID);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Create default profile for new users with full access
        const defaultProfile = {
          user_id: userId,
          role: 'Administrator' as const,
          station: 'ALL',
          employee_id: `EMP${userId.toString().padStart(4, '0')}`,
          phone: '',
          hire_date: new Date().toISOString(),
          is_active: true
        };

        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (createError) throw createError;

        if (newProfile) {
          setUserProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const auditLogger = AuditLoggerService.getInstance();

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log failed login attempt
        await auditLogger.logLogin(email, false, undefined, error.message);

        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      // Get user info after successful login
      const { data: userData, error: userError } = await AuthService.getCurrentUser();
      if (userError) {
        await auditLogger.logLogin(email, false, undefined, 'Failed to get user information');

        toast({
          title: "Error",
          description: "Failed to get user information",
          variant: "destructive"
        });
        return false;
      }

      // Map Supabase user to legacy User interface
      const legacyUser: User = {
        ID: parseInt(userData.id) || 0,
        Name: userData.email?.split('@')[0] || '',
        Email: userData.email || '',
        CreateTime: userData.created_at || new Date().toISOString()
      };
      
      setUser(legacyUser);
      await fetchUserProfile(legacyUser.ID);

      // Log successful login
      await auditLogger.logLogin(email, true, legacyUser.ID);

      toast({
        title: "Success",
        description: "Login successful!"
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      await auditLogger.logLogin(email, false, undefined, 'Unexpected error during login');

      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const auditLogger = AuditLoggerService.getInstance();

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        // Log failed registration attempt
        await auditLogger.logRegistration(email, false, error.message);

        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      // Log successful registration
      await auditLogger.logRegistration(email, true);

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account."
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      await auditLogger.logRegistration(email, false, 'Unexpected error during registration');

      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const auditLogger = AuditLoggerService.getInstance();

    try {
      // Log logout before clearing user state
      if (user) {
        await auditLogger.logLogout(user.Email, user.ID);
      }

      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (feature: string, action: 'read' | 'write'): boolean => {
    if (!userProfile) return false;

    // Special handling for monitoring features
    if (feature === 'monitoring') {
      return userProfile.role === 'Administrator';
    }

    // Full access for all other features
    return true;
  };

  const canEdit = (feature?: string): boolean => {
    if (!userProfile) return false;

    // Monitoring features restricted to Administrators
    if (feature === 'monitoring') {
      return userProfile.role === 'Administrator';
    }

    // Full visual editing access for all users and other features
    return true;
  };

  const canDelete = (feature?: string): boolean => {
    if (!userProfile) return false;

    // Monitoring features restricted to Administrators
    if (feature === 'monitoring') {
      return userProfile.role === 'Administrator';
    }

    // Full delete access for all users and other features
    return true;
  };

  const canCreate = (feature?: string): boolean => {
    if (!userProfile) return false;

    // Monitoring features restricted to Administrators
    if (feature === 'monitoring') {
      return userProfile.role === 'Administrator';
    }

    // Full create access for all users and other features
    return true;
  };

  const canViewLogs = (feature?: string): boolean => {
    if (!userProfile) return false;

    // Monitoring features restricted to Administrators
    if (feature === 'monitoring') {
      return userProfile.role === 'Administrator';
    }

    // Full log viewing access for all users and other features
    return true;
  };

  const isVisualEditingEnabled = true;
  const isAdmin = userProfile?.role === 'Administrator';

  const value = {
    user,
    userProfile,
    isAdmin,
    login,
    logout,
    register,
    loading,
    hasPermission,
    canEdit,
    canDelete,
    canCreate,
    canViewLogs,
    isVisualEditingEnabled
  };

  return (
    <AuthContext.Provider value={value} data-id="8nhyy6fc8" data-path="src/contexts/AuthContext.tsx">
      {children}
    </AuthContext.Provider>);

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};