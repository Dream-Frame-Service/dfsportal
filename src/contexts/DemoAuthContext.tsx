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

// Demo user with full admin access
const DEMO_USER: User = {
  ID: 9999,
  Name: 'Demo Administrator',
  Email: 'demo@dfs-portal.com',
  CreateTime: new Date().toISOString()
};

const DEMO_PROFILE: UserProfile = {
  ID: 9999,
  user_id: 9999,
  role: 'Administrator',
  station: 'ALL',
  employee_id: 'DEMO001',
  phone: '+1-555-DEMO',
  hire_date: '2024-01-01',
  is_active: true
};

export const DemoAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: DemoAuthContextType = {
    user: DEMO_USER,
    userProfile: DEMO_PROFILE,
    isAdmin: true,
    loading: false,
    isVisualEditingEnabled: true,
    
    // Mock authentication functions
    login: async (email: string, password: string) => {
      console.log('Demo mode: Login bypassed');
      return true;
    },
    
    logout: async () => {
      console.log('Demo mode: Logout bypassed');
    },
    
    register: async (email: string, password: string) => {
      console.log('Demo mode: Registration bypassed');
      return true;
    },
    
    // Full permissions for demo mode
    hasPermission: (feature: string, action: 'read' | 'write') => true,
    canEdit: (feature?: string) => true,
    canDelete: (feature?: string) => true,
    canCreate: (feature?: string) => true,
    canViewLogs: (feature?: string) => true,
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
