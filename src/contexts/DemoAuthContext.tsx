import React, { createContext, useContext, ReactNode } from 'react';

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

interface DemoAuthContextType {
  user: User;
  userProfile: UserProfile;
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

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

// Export the context for use in smart auth hook
export { DemoAuthContext };

// Demo user with full admin access for development review
const DEMO_USER: User = {
  ID: 9999,
  Name: 'Demo Administrator (Development Review)',
  Email: 'demo@dfs-portal.com',
  CreateTime: new Date().toISOString()
};

const DEMO_PROFILE: UserProfile = {
  ID: 9999,
  user_id: 9999,
  role: 'Administrator',
  station: 'ALL_STATIONS',
  employee_id: 'DEMO-DEV-001',
  phone: '+1-555-DEV-DEMO',
  hire_date: '2024-01-01',
  is_active: true
};

export const DemoAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Log demo mode for development
  React.useEffect(() => {
    console.log('🚀 DEVELOPMENT DEMO MODE ACTIVE');
    console.log('👤 Demo User:', DEMO_USER);
    console.log('🔧 Demo Profile:', DEMO_PROFILE);
    console.log('🛡️ All permissions enabled for development review');
    console.log('📝 Define role-based access controls after reviewing all features');
  }, []);

  const value: DemoAuthContextType = {
    user: DEMO_USER,
    userProfile: DEMO_PROFILE,
    isAdmin: true,
    loading: false,
    isVisualEditingEnabled: true,
    
    // Mock authentication functions with development logging
    login: async (email: string, password: string) => {
      console.log('Demo mode: Login bypassed for development review');
      return true;
    },
    
    logout: async () => {
      console.log('Demo mode: Logout bypassed for development review');
    },
    
    register: async (email: string, password: string) => {
      console.log('Demo mode: Registration bypassed for development review');
      return true;
    },
    
    // Full permissions for demo mode - ALL features accessible
    hasPermission: (feature: string, action: 'read' | 'write') => {
      console.log(`Demo: Permission granted for ${feature}.${action}`);
      return true;
    },
    canEdit: (feature?: string) => {
      console.log(`Demo: Edit permission granted for ${feature || 'all features'}`);
      return true;
    },
    canDelete: (feature?: string) => {
      console.log(`Demo: Delete permission granted for ${feature || 'all features'}`);
      return true;
    },
    canCreate: (feature?: string) => {
      console.log(`Demo: Create permission granted for ${feature || 'all features'}`);
      return true;
    },
    canViewLogs: (feature?: string) => {
      console.log(`Demo: View logs permission granted for ${feature || 'all features'}`);
      return true;
    },
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};

export default DemoAuthProvider;
