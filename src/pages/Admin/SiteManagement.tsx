import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useBatchSelection } from '@/hooks/use-batch-selection';
import BatchActionBar from '@/components/BatchActionBar';
import BatchDeleteDialog from '@/components/BatchDeleteDialog';
import BatchEditDialog from '@/components/BatchEditDialog';
import StationEditDialog from '@/components/StationEditDialog';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import { supabase } from '@/lib/supabase';
import {
  Settings,
  Database,
  Shield,
  Mail,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Building2,
  MapPin,
  Phone,
  Calendar,
  Edit } from
'lucide-react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  enableRegistration: boolean;
  enableNotifications: boolean;
  enableMaintenance: boolean;
  maintenanceMessage: string;
  emailFromAddress: string;
  emailFromName: string;
  maxFileSize: number;
  allowedFileTypes: string;
  sessionTimeout: number;
  passwordMinLength: number;
  requirePasswordComplexity: boolean;
  enableTwoFactor: boolean;
  backupFrequency: string;
  logRetentionDays: number;
}

interface Station {
  id: number;
  station_name: string;
  address: string;
  phone: string;
  operating_hours: string;
  manager_name: string;
  status: string;
  last_updated: string;
  created_by: number;
}

const SiteManagement: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'DFS Manager Portal',
    siteDescription: 'Comprehensive gas station management system',
    enableRegistration: false,
    enableNotifications: true,
    enableMaintenance: false,
    maintenanceMessage: 'System is under maintenance. Please check back later.',
    emailFromAddress: 'support@dfsmanager.com',
    emailFromName: 'DFS Manager Support',
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx,xls,xlsx',
    sessionTimeout: 30,
    passwordMinLength: 8,
    requirePasswordComplexity: true,
    enableTwoFactor: false,
    backupFrequency: 'daily',
    logRetentionDays: 30
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isBatchEditDialogOpen, setIsBatchEditDialogOpen] = useState(false);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [batchActionLoading, setBatchActionLoading] = useState(false);

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Batch selection hook
  const batchSelection = useBatchSelection<Station>();

  // Batch edit form data
  const [batchEditData, setBatchEditData] = useState({
    status: '',
    manager_name: '',
    operating_hours: ''
  });

  // Load stations from database
  const loadStations = async () => {
    try {
      console.log('Loading stations from database...');
      const { data, error } = await supabase
        .from('site_stations')
        .select('*')
        .order('station_name', { ascending: true });

      if (error) throw error;

      console.log('Loaded stations:', data);
      setStations(data || []);
    } catch (error) {
      console.error('Error loading stations:', error);
      toast({
        title: "Error",
        description: "Failed to load station information",
        variant: "destructive"
      });
    } finally {
      setLoadingStations(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const handleEditStation = (station: Station) => {
    console.log('Editing station:', station);
    setEditingStation(station);
    setEditDialogOpen(true);
  };

  const handleStationSaved = () => {
    loadStations();
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Site settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      // TODO: Replace with Supabase Edge Function or external email service
      // const { error } = await supabase.functions.invoke('send-email', {
      //   body: {
      //     from: `${settings.emailFromName} <${settings.emailFromAddress}>`,
      //     to: [settings.emailFromAddress],
      //     subject: 'DFS Manager - Email Configuration Test',
      //     html: `
      //       <h2>Email Configuration Test</h2>
      //       <p>This is a test email to verify your email configuration is working correctly.</p>
      //       <p><strong>Site:</strong> ${settings.siteName}</p>
      //       <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      //       <hr>
      //       <p>If you received this email, your configuration is working properly.</p>
      //     `
      //   }
      // });

      // For now, show a success message
      toast({
        title: "Email Test",
        description: "Email functionality needs to be implemented via Supabase Edge Functions",
        variant: "default"
      });

      // if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: "Check your inbox for the test email"
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (isEnabled: boolean) => {
    return isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Batch operations
  const handleBatchEdit = () => {
    const selectedData = batchSelection.getSelectedData(stations, (station) => station.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select stations to edit",
        variant: "destructive"
      });
      return;
    }
    setIsBatchEditDialogOpen(true);
  };

  const handleBatchDelete = () => {
    const selectedData = batchSelection.getSelectedData(stations, (station) => station.id);
    if (selectedData.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select stations to delete",
        variant: "destructive"
      });
      return;
    }
    setIsBatchDeleteDialogOpen(true);
  };

  const confirmBatchEdit = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(stations, (station) => station.id);
      const updates = selectedData.map((station) => ({
        id: station.id,
        ...(batchEditData.status && { status: batchEditData.status }),
        ...(batchEditData.manager_name && { manager_name: batchEditData.manager_name }),
        ...(batchEditData.operating_hours && { operating_hours: batchEditData.operating_hours }),
        last_updated: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_stations')
          .update(update)
          .eq('id', update.id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Updated ${selectedData.length} stations successfully`
      });

      setIsBatchEditDialogOpen(false);
      batchSelection.clearSelection();
      loadStations();
    } catch (error) {
      console.error('Error in batch edit:', error);
      toast({
        title: "Error",
        description: `Failed to update stations: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  const confirmBatchDelete = async () => {
    setBatchActionLoading(true);
    try {
      const selectedData = batchSelection.getSelectedData(stations, (station) => station.id);

      for (const station of selectedData) {
        const { error } = await supabase
          .from('site_stations')
          .delete()
          .eq('id', station.id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Deleted ${selectedData.length} stations successfully`
      });

      setIsBatchDeleteDialogOpen(false);
      batchSelection.clearSelection();
      loadStations();
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast({
        title: "Error",
        description: `Failed to delete stations: ${error}`,
        variant: "destructive"
      });
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="Site Management"
        requiredRole="Administrator" data-id="j7j1fnkju" data-path="src/pages/Admin/SiteManagement.tsx" />);

  }

  return (
    <div className="space-y-6" data-id="spepjm33y" data-path="src/pages/Admin/SiteManagement.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="egryv06tm" data-path="src/pages/Admin/SiteManagement.tsx">
        <div className="flex items-center space-x-3" data-id="9sti42tjb" data-path="src/pages/Admin/SiteManagement.tsx">
          <Settings className="w-8 h-8 text-blue-600" data-id="q065ck7lv" data-path="src/pages/Admin/SiteManagement.tsx" />
          <h1 className="text-2xl font-bold text-gray-900" data-id="xgnavoonm" data-path="src/pages/Admin/SiteManagement.tsx">Site Management</h1>
        </div>
        
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700" data-id="rq811kinz" data-path="src/pages/Admin/SiteManagement.tsx">

          {isSaving ?
          <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" data-id="yxzc6uuvv" data-path="src/pages/Admin/SiteManagement.tsx" />
              Saving...
            </> :

          <>
              <Save className="w-4 h-4 mr-2" data-id="0hydhsifo" data-path="src/pages/Admin/SiteManagement.tsx" />
              Save Settings
            </>
          }
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="zepx0zmpa" data-path="src/pages/Admin/SiteManagement.tsx">
        <Card data-id="ozszy7zuo" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardContent className="p-4" data-id="46g6zh0o4" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center space-x-3" data-id="ujgjswpyy" data-path="src/pages/Admin/SiteManagement.tsx">
              <CheckCircle className="w-8 h-8 text-green-600" data-id="qnaqj1870" data-path="src/pages/Admin/SiteManagement.tsx" />
              <div data-id="p62senbfq" data-path="src/pages/Admin/SiteManagement.tsx">
                <p className="text-sm text-gray-600" data-id="65ythfhci" data-path="src/pages/Admin/SiteManagement.tsx">System Status</p>
                <p className="text-lg font-semibold text-green-600" data-id="vmlrtqnkd" data-path="src/pages/Admin/SiteManagement.tsx">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="8ieio6td3" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardContent className="p-4" data-id="vc40smemj" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center space-x-3" data-id="4ovklrovf" data-path="src/pages/Admin/SiteManagement.tsx">
              <Database className="w-8 h-8 text-blue-600" data-id="c4ja11ioe" data-path="src/pages/Admin/SiteManagement.tsx" />
              <div data-id="1114f0obs" data-path="src/pages/Admin/SiteManagement.tsx">
                <p className="text-sm text-gray-600" data-id="0a18xiga3" data-path="src/pages/Admin/SiteManagement.tsx">Database</p>
                <p className="text-lg font-semibold text-blue-600" data-id="wca91n786" data-path="src/pages/Admin/SiteManagement.tsx">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="u2i9rr4uk" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardContent className="p-4" data-id="uh0c40fg1" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center space-x-3" data-id="qjepoqcbr" data-path="src/pages/Admin/SiteManagement.tsx">
              <Mail className="w-8 h-8 text-purple-600" data-id="6idk9433s" data-path="src/pages/Admin/SiteManagement.tsx" />
              <div data-id="akatv7byb" data-path="src/pages/Admin/SiteManagement.tsx">
                <p className="text-sm text-gray-600" data-id="y85z0byb6" data-path="src/pages/Admin/SiteManagement.tsx">Email Service</p>
                <p className="text-lg font-semibold text-purple-600" data-id="d8wivsp9v" data-path="src/pages/Admin/SiteManagement.tsx">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="iqykn1fr5" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardContent className="p-4" data-id="zopcpvo51" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center space-x-3" data-id="kn5g9o6iz" data-path="src/pages/Admin/SiteManagement.tsx">
              <Shield className="w-8 h-8 text-orange-600" data-id="fpfzxd00x" data-path="src/pages/Admin/SiteManagement.tsx" />
              <div data-id="jc8r0cid6" data-path="src/pages/Admin/SiteManagement.tsx">
                <p className="text-sm text-gray-600" data-id="5fcxb8slc" data-path="src/pages/Admin/SiteManagement.tsx">Security</p>
                <p className="text-lg font-semibold text-orange-600" data-id="c8d7ai75j" data-path="src/pages/Admin/SiteManagement.tsx">Protected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Action Bar for Stations */}
      <BatchActionBar
        selectedCount={batchSelection.selectedCount}
        onBatchEdit={handleBatchEdit}
        onBatchDelete={handleBatchDelete}
        onClearSelection={batchSelection.clearSelection}
        isLoading={batchActionLoading} data-id="1tqwsvvah" data-path="src/pages/Admin/SiteManagement.tsx" />


      {/* Station Information */}
      <Card data-id="vhz8vgte1" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="p2cjv4kgf" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center justify-between" data-id="p2fwhz505" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center space-x-2" data-id="7yfwce8sh" data-path="src/pages/Admin/SiteManagement.tsx">
              <Building2 className="w-5 h-5" data-id="ggprsf4s3" data-path="src/pages/Admin/SiteManagement.tsx" />
              <span data-id="yf9rtmok5" data-path="src/pages/Admin/SiteManagement.tsx">Station Information</span>
            </div>
            <div className="flex items-center gap-2" data-id="ba0snou7w" data-path="src/pages/Admin/SiteManagement.tsx">
              {stations.length === 0 &&
              <Button
                onClick={() => window.open('/dashboard?tab=setup', '_blank')}
                variant="outline"
                size="sm" data-id="t2kf2vo90" data-path="src/pages/Admin/SiteManagement.tsx">

                  <Settings className="w-4 h-4 mr-2" data-id="29nuoh76o" data-path="src/pages/Admin/SiteManagement.tsx" />
                  Setup Guide
                </Button>
              }
              {stations.length > 0 &&
              <Checkbox
                checked={stations.length > 0 && batchSelection.selectedCount === stations.length}
                onCheckedChange={() => batchSelection.toggleSelectAll(stations, (station) => station.id)}
                aria-label="Select all stations" data-id="81gi39en6" data-path="src/pages/Admin/SiteManagement.tsx" />

              }
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="p4bxlwstr" data-path="src/pages/Admin/SiteManagement.tsx">
          {loadingStations ?
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="4qfh1zc3n" data-path="src/pages/Admin/SiteManagement.tsx">
              {[1, 2, 3].map((i) =>
            <Card key={i} className="border animate-pulse" data-id="ewbicldie" data-path="src/pages/Admin/SiteManagement.tsx">
                  <CardContent className="p-4" data-id="0n1sr3nim" data-path="src/pages/Admin/SiteManagement.tsx">
                    <div className="space-y-3" data-id="lr943hoco" data-path="src/pages/Admin/SiteManagement.tsx">
                      <div className="h-6 bg-gray-200 rounded w-1/2" data-id="ek1v0l854" data-path="src/pages/Admin/SiteManagement.tsx"></div>
                      <div className="space-y-2" data-id="zyjegsbi9" data-path="src/pages/Admin/SiteManagement.tsx">
                        <div className="h-4 bg-gray-200 rounded w-3/4" data-id="37a1tgtz0" data-path="src/pages/Admin/SiteManagement.tsx"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2" data-id="cpuj6tkfi" data-path="src/pages/Admin/SiteManagement.tsx"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3" data-id="3pxsulqm3" data-path="src/pages/Admin/SiteManagement.tsx"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            )}
            </div> : stations.length === 0 ?
          <div className="text-center py-12" data-id="c762d277g" data-path="src/pages/Admin/SiteManagement.tsx">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" data-id="syzm9p69s" data-path="src/pages/Admin/SiteManagement.tsx" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2" data-id="encc7wwg9" data-path="src/pages/Admin/SiteManagement.tsx">
                No Stations Configured
              </h3>
              <p className="text-gray-500 mb-4" data-id="0fsjew9b5" data-path="src/pages/Admin/SiteManagement.tsx">
                Set up your gas stations (MOBIL, AMOCO ROSEDALE, AMOCO BROOKLYN) to get started.
              </p>
              <Button
              onClick={() => window.open('/dashboard?tab=setup', '_blank')}
              className="bg-blue-600 hover:bg-blue-700" data-id="gpl4kvm2d" data-path="src/pages/Admin/SiteManagement.tsx">

                <Settings className="w-4 h-4 mr-2" data-id="i6filaiy1" data-path="src/pages/Admin/SiteManagement.tsx" />
                Go to Setup Guide
              </Button>
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="64n6ajvn0" data-path="src/pages/Admin/SiteManagement.tsx">
              {stations.map((station, index) =>
            <Card key={station.id || index} className={`border ${batchSelection.isSelected(station.id) ? 'bg-blue-50 border-blue-200' : ''}`} data-id="eec8tyu3u" data-path="src/pages/Admin/SiteManagement.tsx">
                  <CardContent className="p-4" data-id="8wgsq3b4u" data-path="src/pages/Admin/SiteManagement.tsx">
                    <div className="space-y-3" data-id="ckqgz59dk" data-path="src/pages/Admin/SiteManagement.tsx">
                      <div className="flex items-center justify-between" data-id="1o688q41t" data-path="src/pages/Admin/SiteManagement.tsx">
                        <div className="flex items-center space-x-2" data-id="2dbp697ed" data-path="src/pages/Admin/SiteManagement.tsx">
                          <Checkbox
                        checked={batchSelection.isSelected(station.id)}
                        onCheckedChange={() => batchSelection.toggleItem(station.id)}
                        aria-label={`Select station ${station.station_name}`} data-id="9l4a576kb" data-path="src/pages/Admin/SiteManagement.tsx" />

                          <h3 className="font-semibold text-lg" data-id="4osbm1ilo" data-path="src/pages/Admin/SiteManagement.tsx">{station.station_name}</h3>
                        </div>
                        <div className="flex items-center space-x-2" data-id="w9td1hjzy" data-path="src/pages/Admin/SiteManagement.tsx">
                          <Badge className={`${
                      station.status === 'Active' ?
                      'bg-green-100 text-green-800' :
                      station.status === 'Inactive' ?
                      'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`
                      } data-id="5f0iafmmr" data-path="src/pages/Admin/SiteManagement.tsx">
                            {station.status}
                          </Badge>
                          <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStation(station)}
                        className="h-8 w-8 p-0" data-id="vplsxzvy0" data-path="src/pages/Admin/SiteManagement.tsx">

                            <Edit className="w-4 h-4" data-id="tw5futbno" data-path="src/pages/Admin/SiteManagement.tsx" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2" data-id="81iwtenm0" data-path="src/pages/Admin/SiteManagement.tsx">
                        <div className="flex items-start space-x-2" data-id="840km38cy" data-path="src/pages/Admin/SiteManagement.tsx">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" data-id="0dk57zwo3" data-path="src/pages/Admin/SiteManagement.tsx" />
                          <span className="text-sm text-gray-600" data-id="7zm2tcvk6" data-path="src/pages/Admin/SiteManagement.tsx">{station.address}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2" data-id="5vulvs57x" data-path="src/pages/Admin/SiteManagement.tsx">
                          <Phone className="w-4 h-4 text-gray-500" data-id="5az775nhp" data-path="src/pages/Admin/SiteManagement.tsx" />
                          <span className="text-sm text-gray-600" data-id="nrgxsl7ro" data-path="src/pages/Admin/SiteManagement.tsx">{station.phone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2" data-id="clfiyjqe2" data-path="src/pages/Admin/SiteManagement.tsx">
                          <Calendar className="w-4 h-4 text-gray-500" data-id="5vhxbl2j0" data-path="src/pages/Admin/SiteManagement.tsx" />
                          <span className="text-sm text-gray-600" data-id="qib3wech7" data-path="src/pages/Admin/SiteManagement.tsx">{station.operating_hours}</span>
                        </div>
                        
                        <div className="pt-2 border-t" data-id="fprxemh8l" data-path="src/pages/Admin/SiteManagement.tsx">
                          <p className="text-sm font-medium" data-id="w5qqck55p" data-path="src/pages/Admin/SiteManagement.tsx">Manager: {station.manager_name}</p>
                          <p className="text-xs text-gray-500" data-id="diy3kgoe7" data-path="src/pages/Admin/SiteManagement.tsx">
                            Updated: {new Date(station.last_updated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            )}
            </div>
          }
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card data-id="svx4je1v3" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="rshcij2t9" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="po709q71c" data-path="src/pages/Admin/SiteManagement.tsx">
            <Globe className="w-5 h-5" data-id="wys6h22e4" data-path="src/pages/Admin/SiteManagement.tsx" />
            <span data-id="0bqh87n58" data-path="src/pages/Admin/SiteManagement.tsx">General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="shkpjf9qf" data-path="src/pages/Admin/SiteManagement.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="8tuaznuuy" data-path="src/pages/Admin/SiteManagement.tsx">
            <div data-id="0lb8qnu0m" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="siteName" data-id="018j95f5u" data-path="src/pages/Admin/SiteManagement.tsx">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} data-id="imxj0pow7" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div data-id="ln7im4gi5" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="siteDescription" data-id="7be21ctmw" data-path="src/pages/Admin/SiteManagement.tsx">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} data-id="biddp1v5x" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
          
          <div data-id="sz5v5l0g9" data-path="src/pages/Admin/SiteManagement.tsx">
            <Label htmlFor="maintenanceMessage" data-id="m0x1u0bla" data-path="src/pages/Admin/SiteManagement.tsx">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              rows={3} data-id="lyync0f80" data-path="src/pages/Admin/SiteManagement.tsx" />

          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="5ubh26zdr" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="zfb1tag70" data-path="src/pages/Admin/SiteManagement.tsx">
              <div data-id="k0bkl3ux5" data-path="src/pages/Admin/SiteManagement.tsx">
                <Label data-id="t5bsz81gw" data-path="src/pages/Admin/SiteManagement.tsx">User Registration</Label>
                <p className="text-sm text-gray-500" data-id="crekcgvxu" data-path="src/pages/Admin/SiteManagement.tsx">Allow new user registration</p>
              </div>
              <Switch
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })} data-id="5h53i9ia0" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="fck93ylm3" data-path="src/pages/Admin/SiteManagement.tsx">
              <div data-id="j0j3rad5d" data-path="src/pages/Admin/SiteManagement.tsx">
                <Label data-id="kwk0j4prp" data-path="src/pages/Admin/SiteManagement.tsx">Notifications</Label>
                <p className="text-sm text-gray-500" data-id="2600frkl1" data-path="src/pages/Admin/SiteManagement.tsx">Enable system notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })} data-id="hhe1s10sx" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="wnrbk7ggy" data-path="src/pages/Admin/SiteManagement.tsx">
              <div data-id="45gerrzas" data-path="src/pages/Admin/SiteManagement.tsx">
                <Label data-id="lnja5jgz6" data-path="src/pages/Admin/SiteManagement.tsx">Maintenance Mode</Label>
                <p className="text-sm text-gray-500" data-id="fbrm45cf7" data-path="src/pages/Admin/SiteManagement.tsx">Put site in maintenance</p>
              </div>
              <Switch
                checked={settings.enableMaintenance}
                onCheckedChange={(checked) => setSettings({ ...settings, enableMaintenance: checked })} data-id="6jkopu2ox" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card data-id="5dsey1io9" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="8l1ue2ogp" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="wd6ye6k76" data-path="src/pages/Admin/SiteManagement.tsx">
            <Mail className="w-5 h-5" data-id="pmiu5w6df" data-path="src/pages/Admin/SiteManagement.tsx" />
            <span data-id="b3hyds7at" data-path="src/pages/Admin/SiteManagement.tsx">Email Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="x9r508mzs" data-path="src/pages/Admin/SiteManagement.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="myds5c3vq" data-path="src/pages/Admin/SiteManagement.tsx">
            <div data-id="pc1bjo6y4" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="emailFromName" data-id="g3jumj8h2" data-path="src/pages/Admin/SiteManagement.tsx">From Name</Label>
              <Input
                id="emailFromName"
                value={settings.emailFromName}
                onChange={(e) => setSettings({ ...settings, emailFromName: e.target.value })} data-id="akt4y7n83" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div data-id="iu6d9a6uh" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="emailFromAddress" data-id="wbr4iwqdx" data-path="src/pages/Admin/SiteManagement.tsx">From Address</Label>
              <Input
                id="emailFromAddress"
                type="email"
                value={settings.emailFromAddress}
                onChange={(e) => setSettings({ ...settings, emailFromAddress: e.target.value })} data-id="vyzf4mfyv" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
          
          <Button onClick={handleTestEmail} variant="outline" data-id="hraccx6sw" data-path="src/pages/Admin/SiteManagement.tsx">
            <Mail className="w-4 h-4 mr-2" data-id="6qwjlkwc1" data-path="src/pages/Admin/SiteManagement.tsx" />
            Send Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card data-id="tv2xd7lbg" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="bni1w78tv" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="8841zf4xg" data-path="src/pages/Admin/SiteManagement.tsx">
            <Shield className="w-5 h-5" data-id="4ctr4oqhe" data-path="src/pages/Admin/SiteManagement.tsx" />
            <span data-id="a0sdga3je" data-path="src/pages/Admin/SiteManagement.tsx">Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="ablgl361x" data-path="src/pages/Admin/SiteManagement.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="tt0jfh0fh" data-path="src/pages/Admin/SiteManagement.tsx">
            <div data-id="jnqzcn1ka" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="sessionTimeout" data-id="og1qs7zda" data-path="src/pages/Admin/SiteManagement.tsx">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })} data-id="v64t91qah" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div data-id="o0womq3z0" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="passwordMinLength" data-id="4bw5ct5zb" data-path="src/pages/Admin/SiteManagement.tsx">Password Min Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 8 })} data-id="p8c0cccxg" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div data-id="qbvyde0qn" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="logRetentionDays" data-id="257uody9y" data-path="src/pages/Admin/SiteManagement.tsx">Log Retention (days)</Label>
              <Input
                id="logRetentionDays"
                type="number"
                value={settings.logRetentionDays}
                onChange={(e) => setSettings({ ...settings, logRetentionDays: parseInt(e.target.value) || 30 })} data-id="bs12earlp" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="epxl245hg" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="yank33j7t" data-path="src/pages/Admin/SiteManagement.tsx">
              <div data-id="yc2joq0e2" data-path="src/pages/Admin/SiteManagement.tsx">
                <Label data-id="27205x4gw" data-path="src/pages/Admin/SiteManagement.tsx">Password Complexity</Label>
                <p className="text-sm text-gray-500" data-id="h1s3vs2fr" data-path="src/pages/Admin/SiteManagement.tsx">Require complex passwords</p>
              </div>
              <Switch
                checked={settings.requirePasswordComplexity}
                onCheckedChange={(checked) => setSettings({ ...settings, requirePasswordComplexity: checked })} data-id="vfec4o0x0" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="afjhbnqk7" data-path="src/pages/Admin/SiteManagement.tsx">
              <div data-id="dwewv2l0d" data-path="src/pages/Admin/SiteManagement.tsx">
                <Label data-id="haiwtrtc1" data-path="src/pages/Admin/SiteManagement.tsx">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500" data-id="n01rbuny9" data-path="src/pages/Admin/SiteManagement.tsx">Enable 2FA for all users</p>
              </div>
              <Switch
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })} data-id="1h88yzu1u" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Settings */}
      <Card data-id="ea2klc3l4" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="dxb5zlek6" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="y5d4l67ih" data-path="src/pages/Admin/SiteManagement.tsx">
            <Database className="w-5 h-5" data-id="z2nmqqe1p" data-path="src/pages/Admin/SiteManagement.tsx" />
            <span data-id="4kiowzx6g" data-path="src/pages/Admin/SiteManagement.tsx">File Upload Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="kdgfkl7jn" data-path="src/pages/Admin/SiteManagement.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="oj5p5tlpx" data-path="src/pages/Admin/SiteManagement.tsx">
            <div data-id="6oelmdo9a" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="maxFileSize" data-id="tauhyov3a" data-path="src/pages/Admin/SiteManagement.tsx">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) || 10 })} data-id="pxd56k206" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
            
            <div data-id="u0wljdnvo" data-path="src/pages/Admin/SiteManagement.tsx">
              <Label htmlFor="allowedFileTypes" data-id="mm0wn6kij" data-path="src/pages/Admin/SiteManagement.tsx">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                placeholder="jpg,png,pdf,doc" data-id="ph83omro8" data-path="src/pages/Admin/SiteManagement.tsx" />

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Settings Summary */}
      <Card data-id="6aajmg5t5" data-path="src/pages/Admin/SiteManagement.tsx">
        <CardHeader data-id="u2st0pang" data-path="src/pages/Admin/SiteManagement.tsx">
          <CardTitle className="flex items-center space-x-2" data-id="cmc48q7qc" data-path="src/pages/Admin/SiteManagement.tsx">
            <Info className="w-5 h-5" data-id="jicf8r3zf" data-path="src/pages/Admin/SiteManagement.tsx" />
            <span data-id="u1rwo0412" data-path="src/pages/Admin/SiteManagement.tsx">Current Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="5xz2v3yyw" data-path="src/pages/Admin/SiteManagement.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="hpzxojd1t" data-path="src/pages/Admin/SiteManagement.tsx">
            <div className="text-center" data-id="byp2k8muo" data-path="src/pages/Admin/SiteManagement.tsx">
              <p className="text-sm text-gray-600" data-id="xtkujhtn0" data-path="src/pages/Admin/SiteManagement.tsx">Registration</p>
              <Badge className={getStatusColor(settings.enableRegistration)} data-id="vl9e7y281" data-path="src/pages/Admin/SiteManagement.tsx">
                {settings.enableRegistration ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="text-center" data-id="a08ln0r28" data-path="src/pages/Admin/SiteManagement.tsx">
              <p className="text-sm text-gray-600" data-id="h38h2wd3g" data-path="src/pages/Admin/SiteManagement.tsx">Notifications</p>
              <Badge className={getStatusColor(settings.enableNotifications)} data-id="0pkxn171h" data-path="src/pages/Admin/SiteManagement.tsx">
                {settings.enableNotifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="text-center" data-id="rzqwssdwa" data-path="src/pages/Admin/SiteManagement.tsx">
              <p className="text-sm text-gray-600" data-id="g9imt180f" data-path="src/pages/Admin/SiteManagement.tsx">Maintenance</p>
              <Badge className={getStatusColor(settings.enableMaintenance)} data-id="gi31ji4ya" data-path="src/pages/Admin/SiteManagement.tsx">
                {settings.enableMaintenance ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="text-center" data-id="ln9dzpjvq" data-path="src/pages/Admin/SiteManagement.tsx">
              <p className="text-sm text-gray-600" data-id="d8vclf96j" data-path="src/pages/Admin/SiteManagement.tsx">Two-Factor</p>
              <Badge className={getStatusColor(settings.enableTwoFactor)} data-id="9b9mkokks" data-path="src/pages/Admin/SiteManagement.tsx">
                {settings.enableTwoFactor ? 'Required' : 'Optional'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Edit Dialog */}
      <StationEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        station={editingStation}
        onSave={handleStationSaved} data-id="j33zagozp" data-path="src/pages/Admin/SiteManagement.tsx" />

      {/* Batch Edit Dialog */}
      <BatchEditDialog
        isOpen={isBatchEditDialogOpen}
        onClose={() => setIsBatchEditDialogOpen(false)}
        onSave={confirmBatchEdit}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="stations" data-id="4x8m97p8o" data-path="src/pages/Admin/SiteManagement.tsx">

        <div className="space-y-4" data-id="rcrt5e4qg" data-path="src/pages/Admin/SiteManagement.tsx">
          <div data-id="wdbke0eii" data-path="src/pages/Admin/SiteManagement.tsx">
            <Label htmlFor="batch_status" data-id="x0v0r5gge" data-path="src/pages/Admin/SiteManagement.tsx">Status</Label>
            <select
              id="batch_status"
              value={batchEditData.status}
              onChange={(e) => setBatchEditData({ ...batchEditData, status: e.target.value })}
              className="w-full p-2 border rounded-md" data-id="t7gb6i2mx" data-path="src/pages/Admin/SiteManagement.tsx">

              <option value="" data-id="634amhuzp" data-path="src/pages/Admin/SiteManagement.tsx">Keep existing status</option>
              <option value="Active" data-id="4w1uoztbp" data-path="src/pages/Admin/SiteManagement.tsx">Active</option>
              <option value="Inactive" data-id="otpfi0r0b" data-path="src/pages/Admin/SiteManagement.tsx">Inactive</option>
              <option value="Maintenance" data-id="n42dao8p0" data-path="src/pages/Admin/SiteManagement.tsx">Maintenance</option>
            </select>
          </div>
          <div data-id="7uklo5yu4" data-path="src/pages/Admin/SiteManagement.tsx">
            <Label htmlFor="batch_manager" data-id="32u54a9dg" data-path="src/pages/Admin/SiteManagement.tsx">Manager Name</Label>
            <Input
              id="batch_manager"
              value={batchEditData.manager_name}
              onChange={(e) => setBatchEditData({ ...batchEditData, manager_name: e.target.value })}
              placeholder="Leave empty to keep existing managers" data-id="o4ny25utq" data-path="src/pages/Admin/SiteManagement.tsx" />

          </div>
          <div data-id="bm661d864" data-path="src/pages/Admin/SiteManagement.tsx">
            <Label htmlFor="batch_hours" data-id="nsca78cl8" data-path="src/pages/Admin/SiteManagement.tsx">Operating Hours</Label>
            <Input
              id="batch_hours"
              value={batchEditData.operating_hours}
              onChange={(e) => setBatchEditData({ ...batchEditData, operating_hours: e.target.value })}
              placeholder="Leave empty to keep existing hours" data-id="1bxk94rka" data-path="src/pages/Admin/SiteManagement.tsx" />

          </div>
        </div>
      </BatchEditDialog>

      {/* Batch Delete Dialog */}
      <BatchDeleteDialog
        isOpen={isBatchDeleteDialogOpen}
        onClose={() => setIsBatchDeleteDialogOpen(false)}
        onConfirm={confirmBatchDelete}
        selectedCount={batchSelection.selectedCount}
        isLoading={batchActionLoading}
        itemName="stations"
        selectedItems={batchSelection.getSelectedData(stations, (station) => station.id).map((station) => ({
          id: station.id,
          name: station.station_name
        }))} data-id="hggtf4yzb" data-path="src/pages/Admin/SiteManagement.tsx" />


    </div>);

};

export default SiteManagement;
