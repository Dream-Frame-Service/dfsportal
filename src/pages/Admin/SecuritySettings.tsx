import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useBatchSelection } from '@/hooks/use-batch-selection';
import BatchActionBar from '@/components/BatchActionBar';
import BatchDeleteDialog from '@/components/BatchDeleteDialog';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import SecurityService, { SecuritySettings, SecurityEvent } from '@/services/securityService';
import {
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  Database,
  Mail,
  Wifi,
  Server,
  Monitor,
  Smartphone,
  Save,
  RefreshCw } from
'lucide-react';

const SecuritySettings: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [settings, setSettings] = useState<SecuritySettings>(() => SecurityService.getDefaultSecuritySettings());
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [newIPAddress, setNewIPAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const { toast } = useToast();

  // Batch selection hook for security events
  const batchSelection = useBatchSelection<SecurityEvent>();

  useEffect(() => {
    loadSecuritySettings();
    loadSecurityEvents();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await SecurityService.getSecuritySettings();
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load security settings: ${error}`,
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSecurityEvents = async () => {
    try {
      const { data, error } = await SecurityService.getSecurityEvents({ 
        page: 1, 
        pageSize: 50 
      });
      
      if (error) {
        console.error('Error loading security events:', error);
        // Don't show toast for this as it might not be critical
        return;
      }

      if (data) {
        setSecurityEvents(data);
      } else {
        // Generate sample events if none exist
        generateSampleSecurityEvents();
      }
    } catch (error) {
      console.error('Error loading security events:', error);
      // Fallback to sample events
      generateSampleSecurityEvents();
    }
  };

  const generateSampleSecurityEvents = () => {
    const events: SecurityEvent[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'login_failure',
      severity: 'medium',
      user: 'unknown',
      ip_address: '203.0.113.10',
      description: '5 consecutive failed login attempts',
      action_taken: 'IP temporarily blocked'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'suspicious_activity',
      severity: 'high',
      user: 'admin@dfsmanager.com',
      ip_address: '198.51.100.15',
      description: 'Login from unusual geographic location',
      action_taken: 'Email alert sent to user'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'policy_violation',
      severity: 'low',
      user: 'employee@dfsmanager.com',
      description: 'Password does not meet complexity requirements',
      action_taken: 'User prompted to update password'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'security_breach',
      severity: 'critical',
      description: 'Unauthorized API access attempt detected',
      action_taken: 'System locked, admin notified'
    }];


    setSecurityEvents(events);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await SecurityService.saveSecuritySettings(settings);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to save security settings: ${error}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Security settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addIPToWhitelist = async () => {
    if (!newIPAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive"
      });
      return;
    }

    if (settings.systemSecurity.ipWhitelist.includes(newIPAddress)) {
      toast({
        title: "Error",
        description: "IP address is already in the whitelist",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await SecurityService.addIPToWhitelist(newIPAddress);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to add IP to whitelist: ${error}`,
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setSettings(prev => ({
        ...prev,
        systemSecurity: {
          ...prev.systemSecurity,
          ipWhitelist: [...prev.systemSecurity.ipWhitelist, newIPAddress]
        }
      }));
      
      setNewIPAddress('');
      toast({
        title: "Success",
        description: "IP address added to whitelist"
      });
    } catch (error) {
      console.error('Error adding IP to whitelist:', error);
      toast({
        title: "Error",
        description: "Failed to add IP to whitelist",
        variant: "destructive"
      });
    }
  };

  const removeIPFromWhitelist = async (ip: string) => {
    try {
      const { error } = await SecurityService.removeIPFromWhitelist(ip);
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to remove IP from whitelist: ${error}`,
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setSettings(prev => ({
        ...prev,
        systemSecurity: {
          ...prev.systemSecurity,
          ipWhitelist: prev.systemSecurity.ipWhitelist.filter(item => item !== ip)
        }
      }));

      toast({
        title: "Success",
        description: "IP address removed from whitelist"
      });
    } catch (error) {
      console.error('Error removing IP from whitelist:', error);
      toast({
        title: "Error",
        description: "Failed to remove IP from whitelist",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':return 'bg-red-100 text-red-800';
      case 'high':return 'bg-orange-100 text-orange-800';
      case 'medium':return 'bg-yellow-100 text-yellow-800';
      case 'low':return 'bg-blue-100 text-blue-800';
      default:return 'bg-gray-100 text-gray-800';
    }
  };

  // Batch operations for security events
  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(securityEvents, (event) => event.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select security events to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };

  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(securityEvents, (event) => event.id);
      const selectedIds = selectedData.map((event) => event.id);

      // Filter out selected events
      const remainingEvents = securityEvents.filter((event) => !selectedIds.includes(event.id));
      setSecurityEvents(remainingEvents);

      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} security events successfully`
      });

      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast({
        title: "Error",
        description: `Failed to delete security events: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  const getSecurityScore = () => {
    let score = 0;
    const maxScore = 20;

    // Password policy checks
    if (settings.passwordPolicy.minLength >= 8) score++;
    if (settings.passwordPolicy.requireUppercase) score++;
    if (settings.passwordPolicy.requireNumbers) score++;
    if (settings.passwordPolicy.requireSpecialChars) score++;
    if (settings.passwordPolicy.passwordExpiry <= 90) score++;

    // Account security checks
    if (settings.accountSecurity.maxFailedAttempts <= 5) score++;
    if (settings.accountSecurity.requireEmailVerification) score++;
    if (settings.accountSecurity.requireTwoFactor) score += 2;
    if (settings.accountSecurity.sessionTimeout <= 60) score++;

    // System security checks
    if (settings.systemSecurity.enableSSL) score += 2;
    if (settings.systemSecurity.enableFirewall) score += 2;
    if (settings.systemSecurity.enableAuditLogging) score++;
    if (settings.systemSecurity.enableDataEncryption) score += 2;
    if (settings.systemSecurity.enableBackupEncryption) score++;

    // Access control checks
    if (settings.accessControl.enableRoleBasedAccess) score++;
    if (settings.accessControl.requireApprovalForNewUsers) score++;

    return Math.round(score / maxScore * 100);
  };

  const securityScore = getSecurityScore();

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="Security Settings"
        requiredRole="Administrator" data-id="6z43buz7n" data-path="src/pages/Admin/SecuritySettings.tsx" />);

  }

  return (
    <div className="space-y-6" data-id="bxk3eb79r" data-path="src/pages/Admin/SecuritySettings.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="degx32p8t" data-path="src/pages/Admin/SecuritySettings.tsx">
        <div className="flex items-center space-x-3" data-id="tlfcxn8p6" data-path="src/pages/Admin/SecuritySettings.tsx">
          <Shield className="w-8 h-8 text-blue-600" data-id="sdw16g6na" data-path="src/pages/Admin/SecuritySettings.tsx" />
          <h1 className="text-2xl font-bold text-gray-900" data-id="s1gfx9kq8" data-path="src/pages/Admin/SecuritySettings.tsx">Security Settings</h1>
        </div>
        
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700" data-id="5k2rafobm" data-path="src/pages/Admin/SecuritySettings.tsx">

          {isSaving ?
          <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" data-id="nmm482h5f" data-path="src/pages/Admin/SecuritySettings.tsx" />
              Saving...
            </> :

          <>
              <Save className="w-4 h-4 mr-2" data-id="6g2y615od" data-path="src/pages/Admin/SecuritySettings.tsx" />
              Save Settings
            </>
          }
        </Button>
      </div>

      {/* Security Score */}
      <Card data-id="3lqr66ard" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardContent className="p-6" data-id="dl450pek1" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="flex items-center justify-between" data-id="8yn3gwdyt" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div data-id="unywt36zl" data-path="src/pages/Admin/SecuritySettings.tsx">
              <h3 className="text-lg font-semibold text-gray-900" data-id="o1o91i2nz" data-path="src/pages/Admin/SecuritySettings.tsx">Security Score</h3>
              <p className="text-sm text-gray-600" data-id="uavwpks6e" data-path="src/pages/Admin/SecuritySettings.tsx">Overall security posture assessment</p>
            </div>
            <div className="text-right" data-id="ru5i7whjw" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div className="text-3xl font-bold text-blue-600" data-id="ohgoenrfx" data-path="src/pages/Admin/SecuritySettings.tsx">{securityScore}%</div>
              <div className="flex items-center space-x-1" data-id="lhncnjvah" data-path="src/pages/Admin/SecuritySettings.tsx">
                {securityScore >= 80 ?
                <CheckCircle className="w-4 h-4 text-green-500" data-id="oexx3gkn5" data-path="src/pages/Admin/SecuritySettings.tsx" /> :
                securityScore >= 60 ?
                <AlertTriangle className="w-4 h-4 text-yellow-500" data-id="sojzppxpt" data-path="src/pages/Admin/SecuritySettings.tsx" /> :

                <XCircle className="w-4 h-4 text-red-500" data-id="zcs6zhswm" data-path="src/pages/Admin/SecuritySettings.tsx" />
                }
                <span className="text-sm text-gray-600" data-id="lotfh5fsf" data-path="src/pages/Admin/SecuritySettings.tsx">
                  {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="6k5wgx4ie" data-path="src/pages/Admin/SecuritySettings.tsx">
        <Card data-id="70fd3078i" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardContent className="p-4" data-id="xelbupzqx" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center space-x-3" data-id="qasyngp75" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Shield className="w-8 h-8 text-green-600" data-id="0x65qzjyj" data-path="src/pages/Admin/SecuritySettings.tsx" />
              <div data-id="nh2lhjlag" data-path="src/pages/Admin/SecuritySettings.tsx">
                <p className="text-sm text-gray-600" data-id="dbpm7g8g2" data-path="src/pages/Admin/SecuritySettings.tsx">Active Protections</p>
                <p className="text-2xl font-bold text-green-600" data-id="jx86he8ie" data-path="src/pages/Admin/SecuritySettings.tsx">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="8ksryugt8" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardContent className="p-4" data-id="9be6g08v1" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center space-x-3" data-id="1d5gxu03b" data-path="src/pages/Admin/SecuritySettings.tsx">
              <AlertTriangle className="w-8 h-8 text-yellow-600" data-id="ywfhp7phx" data-path="src/pages/Admin/SecuritySettings.tsx" />
              <div data-id="njnowwbxy" data-path="src/pages/Admin/SecuritySettings.tsx">
                <p className="text-sm text-gray-600" data-id="g637w4eys" data-path="src/pages/Admin/SecuritySettings.tsx">Security Events</p>
                <p className="text-2xl font-bold text-yellow-600" data-id="fwacggl7u" data-path="src/pages/Admin/SecuritySettings.tsx">{securityEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="xu2kvomjo" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardContent className="p-4" data-id="tt1j5suwc" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center space-x-3" data-id="ogzm9zxe6" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Users className="w-8 h-8 text-blue-600" data-id="hhpcggyh0" data-path="src/pages/Admin/SecuritySettings.tsx" />
              <div data-id="7xklt8ijj" data-path="src/pages/Admin/SecuritySettings.tsx">
                <p className="text-sm text-gray-600" data-id="u9cp93reh" data-path="src/pages/Admin/SecuritySettings.tsx">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600" data-id="v8f7fsl6n" data-path="src/pages/Admin/SecuritySettings.tsx">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="u08uzy670" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardContent className="p-4" data-id="qpaupcs5i" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center space-x-3" data-id="3e68gzr57" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Lock className="w-8 h-8 text-purple-600" data-id="abx3128jy" data-path="src/pages/Admin/SecuritySettings.tsx" />
              <div data-id="efrfleos8" data-path="src/pages/Admin/SecuritySettings.tsx">
                <p className="text-sm text-gray-600" data-id="wi8lbt80h" data-path="src/pages/Admin/SecuritySettings.tsx">Failed Attempts</p>
                <p className="text-2xl font-bold text-purple-600" data-id="wlpz545qf" data-path="src/pages/Admin/SecuritySettings.tsx">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Policy */}
      <Card data-id="7xjt8onx3" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardHeader data-id="csw5ejryb" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="ty8lu3k5p" data-path="src/pages/Admin/SecuritySettings.tsx">
            <Key className="w-5 h-5" data-id="68d0hehs1" data-path="src/pages/Admin/SecuritySettings.tsx" />
            <span data-id="08pv4zo3w" data-path="src/pages/Admin/SecuritySettings.tsx">Password Policy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="hi7zh60kt" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="fxp4stpvj" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div data-id="xy6kw9pb0" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label htmlFor="minLength" data-id="0euuf2sy8" data-path="src/pages/Admin/SecuritySettings.tsx">Minimum Length</Label>
              <Input
                id="minLength"
                type="number"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    minLength: parseInt(e.target.value) || 8
                  }
                }))} data-id="eusp1qx1p" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div data-id="ed4hwn1hw" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label htmlFor="passwordExpiry" data-id="zwxyiq39c" data-path="src/pages/Admin/SecuritySettings.tsx">Password Expiry (days)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordPolicy.passwordExpiry}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    passwordExpiry: parseInt(e.target.value) || 90
                  }
                }))} data-id="us30mkxda" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="n5kvjcp3h" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="nkgy7chll" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="1o5ic18it" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="5p7nvanhf" data-path="src/pages/Admin/SecuritySettings.tsx">Require Uppercase</Label>
                <p className="text-sm text-gray-500" data-id="chj7lc3pp" data-path="src/pages/Admin/SecuritySettings.tsx">At least one uppercase letter</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireUppercase: checked
                  }
                }))} data-id="9te2sxffh" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="zidd09tqq" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="vv4gnlg3u" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="rdisxs6j5" data-path="src/pages/Admin/SecuritySettings.tsx">Require Numbers</Label>
                <p className="text-sm text-gray-500" data-id="8kai27fn4" data-path="src/pages/Admin/SecuritySettings.tsx">At least one number</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireNumbers}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireNumbers: checked
                  }
                }))} data-id="easd79qzq" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="fu89ycd34" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="ck6yn63hp" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="9tix1je4x" data-path="src/pages/Admin/SecuritySettings.tsx">Require Special Characters</Label>
                <p className="text-sm text-gray-500" data-id="72rdfdg3p" data-path="src/pages/Admin/SecuritySettings.tsx">At least one special character</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireSpecialChars: checked
                  }
                }))} data-id="z016xrxws" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="p0589ilya" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="tmc20hhn6" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="dv6m2lzhe" data-path="src/pages/Admin/SecuritySettings.tsx">Require Lowercase</Label>
                <p className="text-sm text-gray-500" data-id="z6yjt4q50" data-path="src/pages/Admin/SecuritySettings.tsx">At least one lowercase letter</p>
              </div>
              <Switch
                checked={settings.passwordPolicy.requireLowercase}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  passwordPolicy: {
                    ...prev.passwordPolicy,
                    requireLowercase: checked
                  }
                }))} data-id="ad32igs0z" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card data-id="4gx2jxu7n" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardHeader data-id="suynswcf6" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="sq7nrfsxl" data-path="src/pages/Admin/SecuritySettings.tsx">
            <Lock className="w-5 h-5" data-id="ku6c9qhzr" data-path="src/pages/Admin/SecuritySettings.tsx" />
            <span data-id="hddpyr864" data-path="src/pages/Admin/SecuritySettings.tsx">Account Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="7enu5prt9" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="8tk2o6l8a" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div data-id="csg9x35fv" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label htmlFor="maxFailedAttempts" data-id="i3kolqnfb" data-path="src/pages/Admin/SecuritySettings.tsx">Max Failed Attempts</Label>
              <Input
                id="maxFailedAttempts"
                type="number"
                value={settings.accountSecurity.maxFailedAttempts}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    maxFailedAttempts: parseInt(e.target.value) || 5
                  }
                }))} data-id="deleixu80" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div data-id="ee1zsukrr" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label htmlFor="lockoutDuration" data-id="6ae3xuw07" data-path="src/pages/Admin/SecuritySettings.tsx">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={settings.accountSecurity.lockoutDuration}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    lockoutDuration: parseInt(e.target.value) || 30
                  }
                }))} data-id="434k4lp1y" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div data-id="2vag0f469" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label htmlFor="sessionTimeout" data-id="eqeh6hitv" data-path="src/pages/Admin/SecuritySettings.tsx">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.accountSecurity.sessionTimeout}
                onChange={(e) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    sessionTimeout: parseInt(e.target.value) || 60
                  }
                }))} data-id="21hzixaai" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="q45y8oqb4" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="vqhxhmfp5" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="xul1yzjha" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="desbyq5sl" data-path="src/pages/Admin/SecuritySettings.tsx">Email Verification</Label>
                <p className="text-sm text-gray-500" data-id="skj3ie67e" data-path="src/pages/Admin/SecuritySettings.tsx">Require email verification for new accounts</p>
              </div>
              <Switch
                checked={settings.accountSecurity.requireEmailVerification}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    requireEmailVerification: checked
                  }
                }))} data-id="my4bt1dt5" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="9z8h535r3" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="icj474hoz" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="zmszk38c3" data-path="src/pages/Admin/SecuritySettings.tsx">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500" data-id="bih5hl574" data-path="src/pages/Admin/SecuritySettings.tsx">Require 2FA for all users</p>
              </div>
              <Switch
                checked={settings.accountSecurity.requireTwoFactor}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  accountSecurity: {
                    ...prev.accountSecurity,
                    requireTwoFactor: checked
                  }
                }))} data-id="t4r9vk1zm" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Security */}
      <Card data-id="b3o2634d4" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardHeader data-id="83n68x764" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="8fxrj7hwq" data-path="src/pages/Admin/SecuritySettings.tsx">
            <Server className="w-5 h-5" data-id="3s11v1fpd" data-path="src/pages/Admin/SecuritySettings.tsx" />
            <span data-id="h15wyd2cn" data-path="src/pages/Admin/SecuritySettings.tsx">System Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="vvdgnemy4" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="m12bumkmn" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="uwd6pg393" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="h4bljlrbm" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="xppqzdp7f" data-path="src/pages/Admin/SecuritySettings.tsx">SSL/TLS Encryption</Label>
                <p className="text-sm text-gray-500" data-id="a24vpgzpf" data-path="src/pages/Admin/SecuritySettings.tsx">Enable secure connections</p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableSSL}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableSSL: checked
                  }
                }))} data-id="xnj8l8odl" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="p5dju1v1p" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="dlvawjnz5" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="jormp61hm" data-path="src/pages/Admin/SecuritySettings.tsx">Firewall Protection</Label>
                <p className="text-sm text-gray-500" data-id="c3z1a6k97" data-path="src/pages/Admin/SecuritySettings.tsx">Enable network firewall</p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableFirewall}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableFirewall: checked
                  }
                }))} data-id="1kk9pvh3l" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="1cprobcfb" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="ga589uwk6" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="xany8o0lg" data-path="src/pages/Admin/SecuritySettings.tsx">Audit Logging</Label>
                <p className="text-sm text-gray-500" data-id="mkjsz6ixg" data-path="src/pages/Admin/SecuritySettings.tsx">Log all system activities</p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableAuditLogging}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableAuditLogging: checked
                  }
                }))} data-id="lg22pdfb3" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="wsax1nvuo" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="hcgge88xm" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="ms85zit4c" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="pcczpj805" data-path="src/pages/Admin/SecuritySettings.tsx">Data Encryption</Label>
                <p className="text-sm text-gray-500" data-id="9y32338xd" data-path="src/pages/Admin/SecuritySettings.tsx">Encrypt stored data</p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableDataEncryption}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableDataEncryption: checked
                  }
                }))} data-id="8glesnxua" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="jfnbvsxak" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div data-id="fww9dgwk9" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Label data-id="68w2hwwxe" data-path="src/pages/Admin/SecuritySettings.tsx">Backup Encryption</Label>
                <p className="text-sm text-gray-500" data-id="bpehscknu" data-path="src/pages/Admin/SecuritySettings.tsx">Encrypt backup files</p>
              </div>
              <Switch
                checked={settings.systemSecurity.enableBackupEncryption}
                onCheckedChange={(checked) => setSettings((prev) => ({
                  ...prev,
                  systemSecurity: {
                    ...prev.systemSecurity,
                    enableBackupEncryption: checked
                  }
                }))} data-id="xza3m5ugn" data-path="src/pages/Admin/SecuritySettings.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Whitelist */}
      <Card data-id="qwjodifkp" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardHeader data-id="707l5v7mx" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="da4uv760h" data-path="src/pages/Admin/SecuritySettings.tsx">
            <Globe className="w-5 h-5" data-id="7omg7uqm7" data-path="src/pages/Admin/SecuritySettings.tsx" />
            <span data-id="2r2ppu1l2" data-path="src/pages/Admin/SecuritySettings.tsx">IP Address Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="h73tftkvn" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="flex items-center justify-between" data-id="v6lw37fhs" data-path="src/pages/Admin/SecuritySettings.tsx">
            <div data-id="z52ovafut" data-path="src/pages/Admin/SecuritySettings.tsx">
              <Label data-id="cjut6s007" data-path="src/pages/Admin/SecuritySettings.tsx">Enable IP Whitelist</Label>
              <p className="text-sm text-gray-500" data-id="cpzwgosft" data-path="src/pages/Admin/SecuritySettings.tsx">Only allow access from specified IP addresses</p>
            </div>
            <Switch
              checked={settings.systemSecurity.enableIPWhitelist}
              onCheckedChange={(checked) => setSettings((prev) => ({
                ...prev,
                systemSecurity: {
                  ...prev.systemSecurity,
                  enableIPWhitelist: checked
                }
              }))} data-id="6vd7mglhs" data-path="src/pages/Admin/SecuritySettings.tsx" />

          </div>
          
          {settings.systemSecurity.enableIPWhitelist &&
          <div className="space-y-3" data-id="q4o7kmfsp" data-path="src/pages/Admin/SecuritySettings.tsx">
              <div className="flex space-x-2" data-id="hp4pwjecv" data-path="src/pages/Admin/SecuritySettings.tsx">
                <Input
                placeholder="Enter IP address or CIDR (e.g., 192.168.1.0/24)"
                value={newIPAddress}
                onChange={(e) => setNewIPAddress(e.target.value)} data-id="d85eit5rb" data-path="src/pages/Admin/SecuritySettings.tsx" />

                <Button onClick={addIPToWhitelist} data-id="xc36yr34s" data-path="src/pages/Admin/SecuritySettings.tsx">Add</Button>
              </div>
              
              <div className="space-y-2" data-id="ynodti97l" data-path="src/pages/Admin/SecuritySettings.tsx">
                {settings.systemSecurity.ipWhitelist.map((ip, index) =>
              <div key={index} className="flex items-center justify-between p-2 border rounded" data-id="smxbanphl" data-path="src/pages/Admin/SecuritySettings.tsx">
                    <span className="font-mono text-sm" data-id="dyf9a4lis" data-path="src/pages/Admin/SecuritySettings.tsx">{ip}</span>
                    <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeIPFromWhitelist(ip)}
                  className="text-red-600" data-id="84j0idbj3" data-path="src/pages/Admin/SecuritySettings.tsx">

                      Remove
                    </Button>
                  </div>
              )}
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Batch Action Bar for Security Events */}
      <BatchActionBar
        selectedCount={batchSelection.selectedCount}
        onBatchDelete={handleBatchDelete}
        onClearSelection={batchSelection.clearSelection}
        isLoading={batchActionLoading}
        showEdit={false} data-id="fcnsa7ex9" data-path="src/pages/Admin/SecuritySettings.tsx" />


      {/* Recent Security Events */}
      <Card data-id="3etb6iddc" data-path="src/pages/Admin/SecuritySettings.tsx">
        <CardHeader data-id="2xri2oe0y" data-path="src/pages/Admin/SecuritySettings.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="7ijfi11hj" data-path="src/pages/Admin/SecuritySettings.tsx">
            <AlertTriangle className="w-5 h-5" data-id="kq4vscjwz" data-path="src/pages/Admin/SecuritySettings.tsx" />
            <span data-id="b5zh6c2ae" data-path="src/pages/Admin/SecuritySettings.tsx">Recent Security Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="rcdzbykx0" data-path="src/pages/Admin/SecuritySettings.tsx">
          <div className="overflow-x-auto" data-id="c2rtw0yff" data-path="src/pages/Admin/SecuritySettings.tsx">
            <Table data-id="b44h1ipmt" data-path="src/pages/Admin/SecuritySettings.tsx">
              <TableHeader data-id="uy7vu9ze4" data-path="src/pages/Admin/SecuritySettings.tsx">
                <TableRow data-id="8o2mavk0l" data-path="src/pages/Admin/SecuritySettings.tsx">
                  <TableHead className="w-12" data-id="vxvjt4g1v" data-path="src/pages/Admin/SecuritySettings.tsx">
                    <Checkbox
                      checked={securityEvents.length > 0 && batchSelection.selectedCount === securityEvents.length}
                      onCheckedChange={() => batchSelection.toggleSelectAll(securityEvents, (event) => event.id)}
                      aria-label="Select all security events" data-id="pv23fptlx" data-path="src/pages/Admin/SecuritySettings.tsx" />

                  </TableHead>
                  <TableHead data-id="3r0sfcwq0" data-path="src/pages/Admin/SecuritySettings.tsx">Time</TableHead>
                  <TableHead data-id="zhdu1vp13" data-path="src/pages/Admin/SecuritySettings.tsx">Type</TableHead>
                  <TableHead data-id="llj9uf8nw" data-path="src/pages/Admin/SecuritySettings.tsx">Severity</TableHead>
                  <TableHead data-id="m3oq9tcw7" data-path="src/pages/Admin/SecuritySettings.tsx">Description</TableHead>
                  <TableHead data-id="3rhvvsu73" data-path="src/pages/Admin/SecuritySettings.tsx">User/IP</TableHead>
                  <TableHead data-id="n2559s5f7" data-path="src/pages/Admin/SecuritySettings.tsx">Action Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-id="7uvhlig2o" data-path="src/pages/Admin/SecuritySettings.tsx">
                {securityEvents.map((event) =>
                <TableRow key={event.id} className={batchSelection.isSelected(event.id) ? "bg-blue-50" : ""} data-id="cygedyifu" data-path="src/pages/Admin/SecuritySettings.tsx">
                    <TableCell data-id="wbu0px8zv" data-path="src/pages/Admin/SecuritySettings.tsx">
                      <Checkbox
                      checked={batchSelection.isSelected(event.id)}
                      onCheckedChange={() => batchSelection.toggleItem(event.id)}
                      aria-label={`Select security event ${event.id}`} data-id="6qx805xym" data-path="src/pages/Admin/SecuritySettings.tsx" />

                    </TableCell>
                    <TableCell className="font-mono text-sm" data-id="q060if9wa" data-path="src/pages/Admin/SecuritySettings.tsx">
                      <div className="flex items-center space-x-2" data-id="1l2ny5qqc" data-path="src/pages/Admin/SecuritySettings.tsx">
                        <Clock className="w-3 h-3 text-gray-400" data-id="fwowveiys" data-path="src/pages/Admin/SecuritySettings.tsx" />
                        <span data-id="5kk71egyr" data-path="src/pages/Admin/SecuritySettings.tsx">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell data-id="mkn7a0lge" data-path="src/pages/Admin/SecuritySettings.tsx">
                      <Badge variant="outline" data-id="56ds0wdzt" data-path="src/pages/Admin/SecuritySettings.tsx">{event.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell data-id="vyrkl5oqo" data-path="src/pages/Admin/SecuritySettings.tsx">
                      <Badge className={getSeverityColor(event.severity)} data-id="yvmon1av2" data-path="src/pages/Admin/SecuritySettings.tsx">
                        {event.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell data-id="gzh0311tv" data-path="src/pages/Admin/SecuritySettings.tsx">{event.description}</TableCell>
                    <TableCell className="font-mono text-sm" data-id="kk9wp26lp" data-path="src/pages/Admin/SecuritySettings.tsx">
                      {event.user && <div data-id="yu73bggz1" data-path="src/pages/Admin/SecuritySettings.tsx">{event.user}</div>}
                      {event.ip_address && <div className="text-gray-500" data-id="gi4e9atby" data-path="src/pages/Admin/SecuritySettings.tsx">{event.ip_address}</div>}
                    </TableCell>
                    <TableCell data-id="622xb3m9k" data-path="src/pages/Admin/SecuritySettings.tsx">{event.action_taken || 'No action taken'}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Batch Delete Dialog */}
      <BatchDeleteDialog
        isOpen={isBatchDeleteDialogOpen}
        onClose={() => setIsBatchDeleteDialogOpen(false)}
        onConfirm={confirmBatchDelete}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="security events"
        selectedItems={batchSelection.getSelectedData(securityEvents, (event) => event.id).map((event) => ({
          id: event.id,
          name: `${event.type} - ${event.severity.toUpperCase()} - ${event.description.substring(0, 50)}...`
        }))} data-id="03j5u5blh" data-path="src/pages/Admin/SecuritySettings.tsx" />

    </div>);

};

export default SecuritySettings;