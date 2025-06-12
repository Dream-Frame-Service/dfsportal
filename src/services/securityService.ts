import { supabase } from '@/lib/supabase';
import { SupabaseService } from './supabaseService';

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
    preventReuse: number;
  };
  accountSecurity: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    requireEmailVerification: boolean;
    requireTwoFactor: boolean;
    sessionTimeout: number;
    allowMultipleSessions: boolean;
  };
  systemSecurity: {
    enableSSL: boolean;
    enableFirewall: boolean;
    enableIPWhitelist: boolean;
    ipWhitelist: string[];
    enableAuditLogging: boolean;
    enableDataEncryption: boolean;
    enableBackupEncryption: boolean;
  };
  accessControl: {
    enableRoleBasedAccess: boolean;
    requireApprovalForNewUsers: boolean;
    defaultUserRole: string;
    enableGuestAccess: boolean;
    maxConcurrentUsers: number;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_failure' | 'suspicious_activity' | 'security_breach' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user?: string;
  ip_address?: string;
  description: string;
  action_taken?: string;
}

export interface SecurityAuditLog {
  id?: number;
  event_type: string;
  user_id?: string;
  username?: string;
  ip_address?: string;
  user_agent?: string;
  event_timestamp: string;
  event_status: 'success' | 'failure';
  resource_accessed?: string;
  action_performed: string;
  failure_reason?: string;
  session_id?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  additional_data?: string;
  station?: string;
  geo_location?: string;
}

export class SecurityService {
  // Security Settings Management
  static async getSecuritySettings(): Promise<{ data: SecuritySettings | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching security settings:', error);
        return { data: null, error: error.message };
      }

      // Return default settings if none exist
      if (!data) {
        return { data: this.getDefaultSecuritySettings(), error: null };
      }

      return { data: data.settings as SecuritySettings, error: null };
    } catch (err) {
      console.error('Error in getSecuritySettings:', err);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  static async saveSecuritySettings(settings: SecuritySettings): Promise<{ error: string | null }> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        return { error: 'User not authenticated' };
      }

      const settingsRecord = {
        settings: settings,
        updated_by: currentUser.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('security_settings')
        .upsert(settingsRecord, { onConflict: 'id' });

      if (error) {
        console.error('Error saving security settings:', error);
        return { error: error.message };
      }

      // Log the security settings change
      await this.logSecurityEvent({
        event_type: 'security_settings_updated',
        user_id: currentUser.user.id,
        username: currentUser.user.email || 'unknown',
        ip_address: await this.getClientIP(),
        event_timestamp: new Date().toISOString(),
        event_status: 'success',
        action_performed: 'Updated security settings',
        risk_level: 'medium',
        additional_data: JSON.stringify({ settingsUpdated: Object.keys(settings) })
      });

      return { error: null };
    } catch (err) {
      console.error('Error in saveSecuritySettings:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // IP Whitelist Management
  static async addIPToWhitelist(ipAddress: string): Promise<{ error: string | null }> {
    try {
      const { data: settings, error: getError } = await this.getSecuritySettings();
      if (getError || !settings) {
        return { error: getError || 'Failed to get current settings' };
      }

      if (!settings.systemSecurity.ipWhitelist.includes(ipAddress)) {
        settings.systemSecurity.ipWhitelist.push(ipAddress);
        const { error } = await this.saveSecuritySettings(settings);
        
        if (!error) {
          await this.logSecurityEvent({
            event_type: 'ip_whitelist_updated',
            user_id: (await supabase.auth.getUser()).data.user?.id,
            username: (await supabase.auth.getUser()).data.user?.email || 'unknown',
            ip_address: await this.getClientIP(),
            event_timestamp: new Date().toISOString(),
            event_status: 'success',
            action_performed: `Added IP ${ipAddress} to whitelist`,
            risk_level: 'low',
            additional_data: JSON.stringify({ addedIP: ipAddress })
          });
        }
        
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Error adding IP to whitelist:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  static async removeIPFromWhitelist(ipAddress: string): Promise<{ error: string | null }> {
    try {
      const { data: settings, error: getError } = await this.getSecuritySettings();
      if (getError || !settings) {
        return { error: getError || 'Failed to get current settings' };
      }

      settings.systemSecurity.ipWhitelist = settings.systemSecurity.ipWhitelist.filter(ip => ip !== ipAddress);
      const { error } = await this.saveSecuritySettings(settings);
      
      if (!error) {
        await this.logSecurityEvent({
          event_type: 'ip_whitelist_updated',
          user_id: (await supabase.auth.getUser()).data.user?.id,
          username: (await supabase.auth.getUser()).data.user?.email || 'unknown',
          ip_address: await this.getClientIP(),
          event_timestamp: new Date().toISOString(),
          event_status: 'success',
          action_performed: `Removed IP ${ipAddress} from whitelist`,
          risk_level: 'medium',
          additional_data: JSON.stringify({ removedIP: ipAddress })
        });
      }
      
      return { error };
    } catch (err) {
      console.error('Error removing IP from whitelist:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // Security Events Management
  static async getSecurityEvents(options: {
    page?: number;
    pageSize?: number;
    severity?: string;
    type?: string;
  } = {}): Promise<{ data: SecurityEvent[] | null; count: number | null; error: string | null }> {
    try {
      const { page = 1, pageSize = 50, severity, type } = options;

      let query = supabase
        .from('security_events')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false });

      if (severity) {
        query = query.eq('severity', severity);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching security events:', error);
        return { data: null, count: null, error: error.message };
      }

      return { data: data as SecurityEvent[], count, error: null };
    } catch (err) {
      console.error('Error in getSecurityEvents:', err);
      return { data: null, count: null, error: 'An unexpected error occurred' };
    }
  }

  static async deleteSecurityEvents(eventIds: string[]): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('security_events')
        .delete()
        .in('id', eventIds);

      if (error) {
        console.error('Error deleting security events:', error);
        return { error: error.message };
      }

      // Log the deletion
      await this.logSecurityEvent({
        event_type: 'security_events_deleted',
        user_id: (await supabase.auth.getUser()).data.user?.id,
        username: (await supabase.auth.getUser()).data.user?.email || 'unknown',
        ip_address: await this.getClientIP(),
        event_timestamp: new Date().toISOString(),
        event_status: 'success',
        action_performed: `Deleted ${eventIds.length} security events`,
        risk_level: 'low',
        additional_data: JSON.stringify({ deletedEventIds: eventIds })
      });

      return { error: null };
    } catch (err) {
      console.error('Error in deleteSecurityEvents:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // Security Audit Logging
  static async logSecurityEvent(auditLog: Omit<SecurityAuditLog, 'id'>): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          ...auditLog,
          user_agent: navigator.userAgent || 'unknown'
        });

      if (error) {
        console.error('Error logging security event:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      console.error('Error in logSecurityEvent:', err);
      return { error: 'An unexpected error occurred' };
    }
  }

  // Session Management
  static async validateSession(): Promise<{ valid: boolean; user: any | null; error: string | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { valid: false, user: null, error: error.message };
      }

      if (!user) {
        return { valid: false, user: null, error: 'No user session found' };
      }

      // Check if session has expired based on security settings
      const { data: settings } = await this.getSecuritySettings();
      if (settings) {
        const sessionTimeout = settings.accountSecurity.sessionTimeout * 60 * 1000; // Convert to milliseconds
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
          if (timeSinceLastActivity > sessionTimeout) {
            await supabase.auth.signOut();
            return { valid: false, user: null, error: 'Session expired due to inactivity' };
          }
        }
      }

      // Update last activity
      localStorage.setItem('lastActivity', Date.now().toString());

      return { valid: true, user, error: null };
    } catch (err) {
      console.error('Error validating session:', err);
      return { valid: false, user: null, error: 'An unexpected error occurred' };
    }
  }

  // Failed Login Tracking
  static async trackFailedLogin(email: string, ipAddress: string): Promise<{ shouldLockout: boolean; error: string | null }> {
    try {
      const { data: settings } = await this.getSecuritySettings();
      if (!settings) {
        return { shouldLockout: false, error: 'Failed to get security settings' };
      }

      // Get recent failed attempts
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentAttempts, error } = await supabase
        .from('failed_login_attempts')
        .select('*')
        .eq('email', email)
        .gte('attempted_at', oneHourAgo)
        .order('attempted_at', { ascending: false });

      if (error) {
        console.error('Error checking failed attempts:', error);
        return { shouldLockout: false, error: error.message };
      }

      // Record this failed attempt
      await supabase
        .from('failed_login_attempts')
        .insert({
          email,
          ip_address: ipAddress,
          attempted_at: new Date().toISOString()
        });

      const attemptCount = (recentAttempts?.length || 0) + 1;
      const shouldLockout = attemptCount >= settings.accountSecurity.maxFailedAttempts;

      if (shouldLockout) {
        // Log security event for lockout
        await this.logSecurityEvent({
          event_type: 'account_lockout',
          username: email,
          ip_address: ipAddress,
          event_timestamp: new Date().toISOString(),
          event_status: 'success',
          action_performed: `Account locked due to ${attemptCount} failed login attempts`,
          risk_level: 'high',
          additional_data: JSON.stringify({ 
            failedAttempts: attemptCount, 
            lockoutDuration: settings.accountSecurity.lockoutDuration 
          })
        });
      }

      return { shouldLockout, error: null };
    } catch (err) {
      console.error('Error tracking failed login:', err);
      return { shouldLockout: false, error: 'An unexpected error occurred' };
    }
  }

  // Utility Methods
  static async getClientIP(): Promise<string> {
    try {
      // In a real implementation, you might use a service to get the real IP
      // For now, we'll return a placeholder
      return 'client-ip-placeholder';
    } catch {
      return 'unknown';
    }
  }

  static getDefaultSecuritySettings(): SecuritySettings {
    return {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiry: 90,
        preventReuse: 12
      },
      accountSecurity: {
        maxFailedAttempts: 5,
        lockoutDuration: 30,
        requireEmailVerification: true,
        requireTwoFactor: false,
        sessionTimeout: 60,
        allowMultipleSessions: false
      },
      systemSecurity: {
        enableSSL: true,
        enableFirewall: true,
        enableIPWhitelist: false,
        ipWhitelist: ['192.168.1.0/24'],
        enableAuditLogging: true,
        enableDataEncryption: true,
        enableBackupEncryption: true
      },
      accessControl: {
        enableRoleBasedAccess: true,
        requireApprovalForNewUsers: true,
        defaultUserRole: 'Employee',
        enableGuestAccess: false,
        maxConcurrentUsers: 50
      }
    };
  }

  // Security Score Calculation
  static calculateSecurityScore(settings: SecuritySettings): number {
    let score = 0;
    const maxScore = 20;

    // Password policy checks (5 points)
    if (settings.passwordPolicy.minLength >= 8) score++;
    if (settings.passwordPolicy.requireUppercase) score++;
    if (settings.passwordPolicy.requireNumbers) score++;
    if (settings.passwordPolicy.requireSpecialChars) score++;
    if (settings.passwordPolicy.passwordExpiry <= 90) score++;

    // Account security checks (5 points)
    if (settings.accountSecurity.maxFailedAttempts <= 5) score++;
    if (settings.accountSecurity.lockoutDuration >= 15) score++;
    if (settings.accountSecurity.requireEmailVerification) score++;
    if (settings.accountSecurity.requireTwoFactor) score += 2;
    if (settings.accountSecurity.sessionTimeout <= 60) score++;

    // System security checks (7 points)
    if (settings.systemSecurity.enableSSL) score += 2;
    if (settings.systemSecurity.enableFirewall) score += 2;
    if (settings.systemSecurity.enableAuditLogging) score++;
    if (settings.systemSecurity.enableDataEncryption) score += 2;
    if (settings.systemSecurity.enableBackupEncryption) score++;

    // Access control checks (3 points)
    if (settings.accessControl.enableRoleBasedAccess) score++;
    if (settings.accessControl.requireApprovalForNewUsers) score++;
    if (!settings.accessControl.enableGuestAccess) score++;

    return Math.round((score / maxScore) * 100);
  }
}

export default SecurityService;
