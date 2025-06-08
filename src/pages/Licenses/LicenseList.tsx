import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, FileText, AlertTriangle, CheckCircle, Printer, MessageSquare, Send, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedLicensePrintDialog from '@/components/EnhancedLicensePrintDialog';
import { smsService } from '@/services/smsService';
import licenseAlertService from '@/services/licenseAlertService';
import { supabase } from '@/lib/supabase';

interface License {
  ID: number;
  license_name: string;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  station: string;
  category: string;
  status: string;
  document_file_id: number;
  created_by: number;
}

const LicenseList: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLicenseForPrint, setSelectedLicenseForPrint] = useState<License | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [deletingLicenseId, setDeletingLicenseId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [showCancelled, setShowCancelled] = useState(true);
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const pageSize = 10;

  useEffect(() => {
    loadLicenses();
  }, [currentPage, searchTerm, showCancelled]);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('licenses_certificates')
        .select('*', { count: 'exact' })
        .order('expiry_date', { ascending: true });

      if (searchTerm) {
        query = query.ilike('license_name', `%${searchTerm}%`);
      }

      if (!showCancelled) {
        query = query.ilike('status', '%Active%');
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setLicenses(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading licenses:', error);
      toast({
        title: "Error",
        description: "Failed to load licenses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (license: License) => {
    setLicenseToDelete(license);
    setDeleteDialogOpen(true);
  };

  const handleSoftDelete = async (licenseId: number) => {
    try {
      setDeletingLicenseId(licenseId);

      // Update status to "Cancelled" or "Inactive"
      const { error } = await supabase
        .from('licenses_certificates')
        .update({ status: 'Cancelled' })
        .eq('ID', licenseId);

      if (error) throw error;

      toast({
        title: "✅ License Deactivated",
        description: "License has been marked as cancelled. It can be reactivated later if needed.",
        duration: 5000
      });

      await loadLicenses();

    } catch (error) {
      console.error('Error deactivating license:', error);
      toast({
        title: "❌ Deactivation Failed",
        description: `Failed to deactivate license: ${error}`,
        variant: "destructive"
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };

  const handleHardDelete = async (licenseId: number) => {
    setDeletingLicenseId(licenseId);

    try {
      // Step 1: Get license details to check for associated files
      const { data: licenseData, error: fetchError } = await supabase
        .from('licenses_certificates')
        .select('*')
        .eq('ID', licenseId)
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      const license = licenseData;
      if (!license) {
        throw new Error('License not found');
      }

      // Show progress toast
      toast({
        title: "🗑️ Deleting License",
        description: "Removing associated files and data..."
      });

      // Step 2: Delete associated file if exists
      if (license.document_file_id) {
        try {
          // Note: File deletion through API - assuming the file deletion is handled server-side
          console.log(`Deleting file with ID: ${license.document_file_id}`);
          // File deletion would be handled by the database cascade or server-side cleanup
        } catch (fileError) {
          console.warn('File deletion warning:', fileError);
          // Continue with deletion even if file cleanup fails
        }
      }

      // Step 3: Delete SMS alert history for this license
      try {
        const { data: alertHistory, error: alertHistoryError } = await supabase
          .from('sms_alert_history')
          .select('*')
          .eq('license_id', licenseId);

        if (!alertHistoryError && alertHistory?.length > 0) {
          await supabase
            .from('sms_alert_history')
            .delete()
            .eq('license_id', licenseId);
          console.log(`Deleted ${alertHistory.length} SMS alert history records`);
        }
      } catch (alertError) {
        console.warn('SMS alert history cleanup warning:', alertError);
        // Continue with deletion even if alert cleanup fails
      }

      // Step 4: Delete any scheduled alerts for this license
      try {
        const { data: schedules, error: scheduleError } = await supabase
          .from('sms_alert_schedules')
          .select('*')
          .eq('alert_type', 'License Expiry')
          .eq('station_filter', license.station);

        if (!scheduleError && schedules?.length > 0) {
          console.log(`Found ${schedules.length} related alert schedules`);
          // Note: We might not want to delete all schedules, just log for now
        }
      } catch (scheduleError) {
        console.warn('Alert schedule cleanup warning:', scheduleError);
      }

      // Step 5: Finally delete the license record
      const { error: deleteError } = await supabase
        .from('licenses_certificates')
        .delete()
        .eq('ID', licenseId);
      if (deleteError) throw deleteError;

      // Success message with details
      toast({
        title: "✅ License Deleted Successfully",
        description: `${license.license_name} and all associated data have been removed from the system.`,
        duration: 5000
      });

      // Reload licenses to reflect changes
      await loadLicenses();

    } catch (error) {
      console.error('Error during license deletion:', error);
      toast({
        title: "❌ Deletion Failed",
        description: `Failed to delete license: ${error}`,
        variant: "destructive",
        duration: 7000
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };

  const handlePrint = (license: License) => {
    setSelectedLicenseForPrint(license);
    setIsPrintDialogOpen(true);
  };

  const closePrintDialog = () => {
    setIsPrintDialogOpen(false);
    setSelectedLicenseForPrint(null);
  };

  const sendExpiryAlerts = async () => {
    try {
      setSendingSMS(true);

      toast({
        title: "📱 Checking Licenses",
        description: "Analyzing licenses for expiry alerts..."
      });

      // Use the enhanced license alert service
      await licenseAlertService.checkAndSendAlerts();

      toast({
        title: "✅ License Alerts Complete",
        description: "SMS alerts sent for expiring licenses. Check SMS History for details."
      });

    } catch (error) {
      console.error('Error sending SMS alerts:', error);
      toast({
        title: "❌ Alert Failed",
        description: "Failed to send SMS alerts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingSMS(false);
    }
  };

  const sendImmediateAlert = async (licenseId: number) => {
    try {
      const result = await licenseAlertService.sendImmediateAlert(licenseId);

      if (result.success) {
        toast({
          title: "📱 SMS Alert Sent",
          description: result.message
        });
      } else {
        toast({
          title: "❌ Alert Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending immediate alert:', error);
      toast({
        title: "Error",
        description: "Failed to send SMS alert",
        variant: "destructive"
      });
    }
  };

  const checkShouldSendAlert = async (licenseId: number, frequencyDays: number) => {
    try {
      // Check if we've sent an alert for this license recently
      const { data, error } = await supabase
        .from('sms_alert_history')
        .select('*')
        .eq('license_id', licenseId)
        .order('sent_date', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastAlert = data[0];
        const lastAlertDate = new Date(lastAlert.sent_date);
        const daysSinceLastAlert = Math.ceil((new Date().getTime() - lastAlertDate.getTime()) / (1000 * 3600 * 24));

        return daysSinceLastAlert >= frequencyDays;
      }

      return true; // No previous alert found, should send
    } catch (error) {
      console.error('Error checking alert frequency:', error);
      return true; // Default to sending if we can't check
    }
  };

  // Check if user is Administrator
  const isAdmin = userProfile?.role === 'Administrator';

  const handleReactivate = async (licenseId: number) => {
    try {
      setDeletingLicenseId(licenseId);

      const { error } = await supabase
        .from('licenses_certificates')
        .update({ status: 'Active' })
        .eq('ID', licenseId);

      if (error) throw error;

      toast({
        title: "✅ License Reactivated",
        description: "License has been successfully reactivated.",
        duration: 3000
      });

      await loadLicenses();

    } catch (error) {
      console.error('Error reactivating license:', error);
      toast({
        title: "❌ Reactivation Failed",
        description: `Failed to reactivate license: ${error}`,
        variant: "destructive"
      });
    } finally {
      setDeletingLicenseId(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'pending renewal':
        return 'bg-yellow-500';
      case 'cancelled':
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'Business': 'bg-blue-500',
      'Environmental': 'bg-green-500',
      'Safety': 'bg-orange-500',
      'Health': 'bg-purple-500',
      'Fire': 'bg-red-500',
      'Building': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-blue-600';
      case 'AMOCO ROSEDALE':
        return 'bg-green-600';
      case 'AMOCO BROOKLYN':
        return 'bg-purple-600';
      case 'ALL':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate summary stats
  const stats = licenses.reduce((acc, license) => ({
    active: acc.active + (license.status.toLowerCase() === 'active' ? 1 : 0),
    expiring_soon: acc.expiring_soon + (isExpiringSoon(license.expiry_date) && license.status.toLowerCase() !== 'cancelled' ? 1 : 0),
    expired: acc.expired + (isExpired(license.expiry_date) && license.status.toLowerCase() !== 'cancelled' ? 1 : 0),
    cancelled: acc.cancelled + (license.status.toLowerCase() === 'cancelled' || license.status.toLowerCase() === 'inactive' ? 1 : 0)
  }), { active: 0, expiring_soon: 0, expired: 0, cancelled: 0 });

  return (
    <div className="space-y-6" data-id="yswgfq1j5" data-path="src/pages/Licenses/LicenseList.tsx">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="5r2l194w7" data-path="src/pages/Licenses/LicenseList.tsx">
        <Card data-id="atyucaqyf" data-path="src/pages/Licenses/LicenseList.tsx">
          <CardContent className="p-6" data-id="a9hpxkk5w" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="flex items-center space-x-2" data-id="eez32slb7" data-path="src/pages/Licenses/LicenseList.tsx">
              <CheckCircle className="w-8 h-8 text-green-600" data-id="9ofqej4wj" data-path="src/pages/Licenses/LicenseList.tsx" />
              <div data-id="chwtjll9l" data-path="src/pages/Licenses/LicenseList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="7sffce40f" data-path="src/pages/Licenses/LicenseList.tsx">Active Licenses</p>
                <p className="text-2xl font-bold" data-id="l17wuf920" data-path="src/pages/Licenses/LicenseList.tsx">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="2b8d7amw4" data-path="src/pages/Licenses/LicenseList.tsx">
          <CardContent className="p-6" data-id="m2lkb2jw5" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="flex items-center space-x-2" data-id="x5ina2l32" data-path="src/pages/Licenses/LicenseList.tsx">
              <AlertTriangle className="w-8 h-8 text-yellow-600" data-id="mrezj5fzj" data-path="src/pages/Licenses/LicenseList.tsx" />
              <div data-id="sism71vxc" data-path="src/pages/Licenses/LicenseList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="vab0am73w" data-path="src/pages/Licenses/LicenseList.tsx">Expiring Soon</p>
                <p className="text-2xl font-bold" data-id="4y9b7j3ie" data-path="src/pages/Licenses/LicenseList.tsx">{stats.expiring_soon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="x9d9uavqk" data-path="src/pages/Licenses/LicenseList.tsx">
          <CardContent className="p-6" data-id="ztqbvisoh" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="flex items-center space-x-2" data-id="36ayaa0v1" data-path="src/pages/Licenses/LicenseList.tsx">
              <FileText className="w-8 h-8 text-red-600" data-id="6nu7c2amt" data-path="src/pages/Licenses/LicenseList.tsx" />
              <div data-id="gn93luqhz" data-path="src/pages/Licenses/LicenseList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="p3lkeeox6" data-path="src/pages/Licenses/LicenseList.tsx">Expired</p>
                <p className="text-2xl font-bold" data-id="5g2f2bvma" data-path="src/pages/Licenses/LicenseList.tsx">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="c4k8m9z1x" data-path="src/pages/Licenses/LicenseList.tsx">
          <CardContent className="p-6" data-id="l3h5n7q2w" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="flex items-center space-x-2" data-id="r9t6e8u4i" data-path="src/pages/Licenses/LicenseList.tsx">
              <Archive className="w-8 h-8 text-gray-600" data-id="m2p5j8k1l" data-path="src/pages/Licenses/LicenseList.tsx" />
              <div data-id="s7f3g9h6n" data-path="src/pages/Licenses/LicenseList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="d4v7x2c9b" data-path="src/pages/Licenses/LicenseList.tsx">Cancelled</p>
                <p className="text-2xl font-bold" data-id="q8w1e5r3t" data-path="src/pages/Licenses/LicenseList.tsx">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-id="jm43kzapy" data-path="src/pages/Licenses/LicenseList.tsx">
        <CardHeader data-id="hjtkiiwbm" data-path="src/pages/Licenses/LicenseList.tsx">
          <div className="flex items-center justify-between" data-id="wr2xpz1ii" data-path="src/pages/Licenses/LicenseList.tsx">
            <div data-id="2xvj28q73" data-path="src/pages/Licenses/LicenseList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="5uc6totjh" data-path="src/pages/Licenses/LicenseList.tsx">
                <FileText className="w-6 h-6" data-id="h3dmrqctq" data-path="src/pages/Licenses/LicenseList.tsx" />
                <span data-id="yexlwvcda" data-path="src/pages/Licenses/LicenseList.tsx">Licenses & Certificates</span>
              </CardTitle>
              <CardDescription data-id="wyppc18um" data-path="src/pages/Licenses/LicenseList.tsx">
                Manage your business licenses and certificates
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2" data-id="4syl9p6ld" data-path="src/pages/Licenses/LicenseList.tsx">
              {isAdmin &&
              <>
                  <Button
                  onClick={sendExpiryAlerts}
                  disabled={sendingSMS}
                  variant="outline"
                  className="flex items-center space-x-2" data-id="id478c0xo" data-path="src/pages/Licenses/LicenseList.tsx">

                    <Send className="w-4 h-4" data-id="h3naa0eet" data-path="src/pages/Licenses/LicenseList.tsx" />
                    <span data-id="pnkhgtxes" data-path="src/pages/Licenses/LicenseList.tsx">{sendingSMS ? 'Sending...' : 'Send SMS Alerts'}</span>
                  </Button>
                  <Button
                  onClick={() => navigate('/admin/sms-alerts')}
                  variant="outline"
                  className="flex items-center space-x-2" data-id="xo2ixxym6" data-path="src/pages/Licenses/LicenseList.tsx">

                    <MessageSquare className="w-4 h-4" data-id="yiui8n7e9" data-path="src/pages/Licenses/LicenseList.tsx" />
                    <span data-id="2dueaelmw" data-path="src/pages/Licenses/LicenseList.tsx">SMS Settings</span>
                  </Button>
                </>
              }
              <Button onClick={() => navigate('/licenses/new')} className="flex items-center space-x-2" data-id="abxmlmxl0" data-path="src/pages/Licenses/LicenseList.tsx">
                <Plus className="w-4 h-4" data-id="skmboegpn" data-path="src/pages/Licenses/LicenseList.tsx" />
                <span data-id="tsnjzr2xg" data-path="src/pages/Licenses/LicenseList.tsx">Add License</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="y72l9z6g4" data-path="src/pages/Licenses/LicenseList.tsx">
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6" data-id="2bm6ntwyq" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="relative flex-1 max-w-sm" data-id="c6igq7xfz" data-path="src/pages/Licenses/LicenseList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="zw0db9clp" data-path="src/pages/Licenses/LicenseList.tsx" />
              <Input
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="dvr2nry9d" data-path="src/pages/Licenses/LicenseList.tsx" />
            </div>
            
            <div className="flex items-center space-x-2" data-id="op01c6tmk" data-path="src/pages/Licenses/LicenseList.tsx">
              <Button
                variant={showCancelled ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCancelled(!showCancelled)}
                className="flex items-center space-x-2" data-id="1zhi4gtzj" data-path="src/pages/Licenses/LicenseList.tsx">

                <Archive className="w-4 h-4" data-id="d8am7onkr" data-path="src/pages/Licenses/LicenseList.tsx" />
                <span data-id="ezlv06j8k" data-path="src/pages/Licenses/LicenseList.tsx">{showCancelled ? 'Hide' : 'Show'} Cancelled</span>
              </Button>
            </div>
          </div>

          {/* Licenses Table */}
          {loading ?
          <div className="space-y-4" data-id="kd40f4ksu" data-path="src/pages/Licenses/LicenseList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="0sz4qxz0i" data-path="src/pages/Licenses/LicenseList.tsx"></div>
            )}
            </div> :
          licenses.length === 0 ?
          <div className="text-center py-8" data-id="ipujzvq9h" data-path="src/pages/Licenses/LicenseList.tsx">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="bml786pig" data-path="src/pages/Licenses/LicenseList.tsx" />
              <p className="text-gray-500" data-id="lokrg9ghh" data-path="src/pages/Licenses/LicenseList.tsx">No licenses found</p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/licenses/new')} data-id="sf88hfx2g" data-path="src/pages/Licenses/LicenseList.tsx">

                Add Your First License
              </Button>
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="7hbb55i8g" data-path="src/pages/Licenses/LicenseList.tsx">
              <Table data-id="4yfu037pc" data-path="src/pages/Licenses/LicenseList.tsx">
                <TableHeader data-id="ug8dk0az2" data-path="src/pages/Licenses/LicenseList.tsx">
                  <TableRow data-id="bgdtq60zj" data-path="src/pages/Licenses/LicenseList.tsx">
                    <TableHead data-id="3jrl2m6dd" data-path="src/pages/Licenses/LicenseList.tsx">License Name</TableHead>
                    <TableHead data-id="k1qaq974y" data-path="src/pages/Licenses/LicenseList.tsx">License Number</TableHead>
                    <TableHead data-id="739qv6alh" data-path="src/pages/Licenses/LicenseList.tsx">Category</TableHead>
                    <TableHead data-id="j5pztsjh0" data-path="src/pages/Licenses/LicenseList.tsx">Station</TableHead>
                    <TableHead data-id="4ga60onxb" data-path="src/pages/Licenses/LicenseList.tsx">Issue Date</TableHead>
                    <TableHead data-id="ko1xt4c5m" data-path="src/pages/Licenses/LicenseList.tsx">Expiry Date</TableHead>
                    <TableHead data-id="zx3311yla" data-path="src/pages/Licenses/LicenseList.tsx">Status</TableHead>
                    <TableHead data-id="zoxkxoety" data-path="src/pages/Licenses/LicenseList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="buujsytow" data-path="src/pages/Licenses/LicenseList.tsx">
                  {licenses.map((license) =>
                <TableRow key={license.ID} className={isExpired(license.expiry_date) ? 'bg-red-50' : isExpiringSoon(license.expiry_date) ? 'bg-yellow-50' : ''} data-id="y9n0bda44" data-path="src/pages/Licenses/LicenseList.tsx">
                      <TableCell data-id="dbfj6ylxj" data-path="src/pages/Licenses/LicenseList.tsx">
                        <div data-id="4te9yy1if" data-path="src/pages/Licenses/LicenseList.tsx">
                          <p className="font-medium" data-id="8b4nauy2o" data-path="src/pages/Licenses/LicenseList.tsx">{license.license_name}</p>
                          <p className="text-sm text-gray-500" data-id="7k9k0gs3s" data-path="src/pages/Licenses/LicenseList.tsx">{license.issuing_authority}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium" data-id="9qi906uae" data-path="src/pages/Licenses/LicenseList.tsx">
                        {license.license_number}
                      </TableCell>
                      <TableCell data-id="4pa5phxhw" data-path="src/pages/Licenses/LicenseList.tsx">
                        <Badge className={`text-white ${getCategoryBadgeColor(license.category)}`} data-id="9rdtgbweq" data-path="src/pages/Licenses/LicenseList.tsx">
                          {license.category}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="ckjncht0o" data-path="src/pages/Licenses/LicenseList.tsx">
                        <Badge className={`text-white ${getStationBadgeColor(license.station)}`} data-id="tkir01xrz" data-path="src/pages/Licenses/LicenseList.tsx">
                          {license.station}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="3zeucj880" data-path="src/pages/Licenses/LicenseList.tsx">{formatDate(license.issue_date)}</TableCell>
                      <TableCell data-id="1pch0ufc8" data-path="src/pages/Licenses/LicenseList.tsx">
                        <div className="flex items-center space-x-2" data-id="yxbcfn6vs" data-path="src/pages/Licenses/LicenseList.tsx">
                          <span data-id="vz89ei5b8" data-path="src/pages/Licenses/LicenseList.tsx">{formatDate(license.expiry_date)}</span>
                          {isExpired(license.expiry_date) &&
                      <AlertTriangle className="w-4 h-4 text-red-500" data-id="l8kr4227b" data-path="src/pages/Licenses/LicenseList.tsx" />
                      }
                          {isExpiringSoon(license.expiry_date) && !isExpired(license.expiry_date) &&
                      <AlertTriangle className="w-4 h-4 text-yellow-500" data-id="hsmbf5fpg" data-path="src/pages/Licenses/LicenseList.tsx" />
                      }
                        </div>
                      </TableCell>
                      <TableCell data-id="9b40djbk1" data-path="src/pages/Licenses/LicenseList.tsx">
                        <Badge className={`text-white ${getStatusBadgeColor(license.status)}`} data-id="iju5cgzhq" data-path="src/pages/Licenses/LicenseList.tsx">
                          {license.status}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="g76he2ar0" data-path="src/pages/Licenses/LicenseList.tsx">
                        <div className="flex items-center space-x-2" data-id="ag3vb9cgq" data-path="src/pages/Licenses/LicenseList.tsx">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(license)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Print Document" data-id="mh73cu15f" data-path="src/pages/Licenses/LicenseList.tsx">
                            <Printer className="w-4 h-4" data-id="q9ctilc62" data-path="src/pages/Licenses/LicenseList.tsx" />
                          </Button>
                          {(isExpiringSoon(license.expiry_date) || isExpired(license.expiry_date)) &&
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendImmediateAlert(license.ID)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Send SMS Alert" data-id="20hg8dybs" data-path="src/pages/Licenses/LicenseList.tsx">
                              <MessageSquare className="w-4 h-4" data-id="clhjnskux" data-path="src/pages/Licenses/LicenseList.tsx" />
                            </Button>
                      }
                          {isAdmin &&
                      <>
                              <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/licenses/edit/${license.ID}`)}
                          title="Edit License" data-id="itticots7" data-path="src/pages/Licenses/LicenseList.tsx">
                                <Edit className="w-4 h-4" data-id="wnimbsr32" data-path="src/pages/Licenses/LicenseList.tsx" />
                              </Button>
                              {license.status.toLowerCase() === 'cancelled' || license.status.toLowerCase() === 'inactive' ?
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReactivate(license.ID)}
                          disabled={deletingLicenseId === license.ID}
                          className={`${deletingLicenseId === license.ID ? 'text-gray-400' : 'text-green-600 hover:text-green-700'}`}
                          title={deletingLicenseId === license.ID ? "Processing..." : "Reactivate License"} data-id="1pdv67sx2" data-path="src/pages/Licenses/LicenseList.tsx">
                                  <CheckCircle className={`w-4 h-4 ${deletingLicenseId === license.ID ? 'animate-spin' : ''}`} data-id="kuzfq3h9d" data-path="src/pages/Licenses/LicenseList.tsx" />
                                </Button> :

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(license)}
                          disabled={deletingLicenseId === license.ID}
                          className={`${deletingLicenseId === license.ID ? 'text-gray-400' : 'text-red-600 hover:text-red-700'}`}
                          title={deletingLicenseId === license.ID ? "Processing..." : "Delete License"} data-id="knpqb3mfi" data-path="src/pages/Licenses/LicenseList.tsx">
                                  <Trash2 className={`w-4 h-4 ${deletingLicenseId === license.ID ? 'animate-spin' : ''}`} data-id="vn548kq6e" data-path="src/pages/Licenses/LicenseList.tsx" />
                                </Button>
                        }
                            </>
                      }
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }

          {/* Pagination */}
          {totalPages > 1 &&
          <div className="flex items-center justify-between mt-6" data-id="ycqywaxtw" data-path="src/pages/Licenses/LicenseList.tsx">
              <p className="text-sm text-gray-700" data-id="0nir713c7" data-path="src/pages/Licenses/LicenseList.tsx">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} licenses
              </p>
              <div className="flex items-center space-x-2" data-id="r3iarkpra" data-path="src/pages/Licenses/LicenseList.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} data-id="jwrw6r2p1" data-path="src/pages/Licenses/LicenseList.tsx">

                  Previous
                </Button>
                <span className="text-sm" data-id="49r9tevk0" data-path="src/pages/Licenses/LicenseList.tsx">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} data-id="p27tf86gc" data-path="src/pages/Licenses/LicenseList.tsx">

                  Next
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Enhanced Print Dialog */}
      <EnhancedLicensePrintDialog
        license={selectedLicenseForPrint}
        isOpen={isPrintDialogOpen}
        onClose={closePrintDialog} data-id="hb04mov5w" data-path="src/pages/Licenses/LicenseList.tsx" />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} data-id="n1zza37kk" data-path="src/pages/Licenses/LicenseList.tsx">
        <DialogContent className="sm:max-w-[425px]" data-id="xoilc6udn" data-path="src/pages/Licenses/LicenseList.tsx">
          <DialogHeader data-id="mwvwy2jaw" data-path="src/pages/Licenses/LicenseList.tsx">
            <DialogTitle className="flex items-center space-x-2" data-id="7z2yq8262" data-path="src/pages/Licenses/LicenseList.tsx">
              <Trash2 className="w-5 h-5 text-red-500" data-id="os6658jic" data-path="src/pages/Licenses/LicenseList.tsx" />
              <span data-id="i6jlrv51t" data-path="src/pages/Licenses/LicenseList.tsx">Delete License</span>
            </DialogTitle>
            <DialogDescription data-id="rdnrk302z" data-path="src/pages/Licenses/LicenseList.tsx">
              Choose how you want to handle the license: <strong data-id="jlq2qfawf" data-path="src/pages/Licenses/LicenseList.tsx">{licenseToDelete?.license_name}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4" data-id="f0zj0485r" data-path="src/pages/Licenses/LicenseList.tsx">
            <div className="space-y-3" data-id="yufi95y7f" data-path="src/pages/Licenses/LicenseList.tsx">
              <div className="flex items-start space-x-3 p-4 border rounded-lg bg-yellow-50" data-id="93gy1o817" data-path="src/pages/Licenses/LicenseList.tsx">
                <Archive className="w-5 h-5 text-yellow-600 mt-1" data-id="275gn4wzj" data-path="src/pages/Licenses/LicenseList.tsx" />
                <div data-id="m9l026q8v" data-path="src/pages/Licenses/LicenseList.tsx">
                  <h4 className="font-medium text-yellow-800" data-id="nl9xupz4u" data-path="src/pages/Licenses/LicenseList.tsx">Soft Delete (Recommended)</h4>
                  <p className="text-sm text-yellow-700" data-id="jvemo5og3" data-path="src/pages/Licenses/LicenseList.tsx">Mark as cancelled but keep all data for potential recovery. This is safer and maintains audit trails.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg bg-red-50" data-id="em0td25aa" data-path="src/pages/Licenses/LicenseList.tsx">
                <Trash2 className="w-5 h-5 text-red-600 mt-1" data-id="0f6ss8ufm" data-path="src/pages/Licenses/LicenseList.tsx" />
                <div data-id="gxb82jqiv" data-path="src/pages/Licenses/LicenseList.tsx">
                  <h4 className="font-medium text-red-800" data-id="qzc1dp9ij" data-path="src/pages/Licenses/LicenseList.tsx">Permanent Delete</h4>
                  <p className="text-sm text-red-700" data-id="bj6s0c2iy" data-path="src/pages/Licenses/LicenseList.tsx">Completely remove the license and all associated files and SMS history. This cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-2" data-id="mr560w56p" data-path="src/pages/Licenses/LicenseList.tsx">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingLicenseId !== null} data-id="9toabgrdg" data-path="src/pages/Licenses/LicenseList.tsx">

              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleSoftDelete(licenseToDelete?.ID || 0);
                setDeleteDialogOpen(false);
              }}
              disabled={deletingLicenseId !== null}
              className="text-yellow-600 hover:text-yellow-700 border-yellow-200 hover:bg-yellow-50" data-id="5w1rbh2g6" data-path="src/pages/Licenses/LicenseList.tsx">

              <Archive className="w-4 h-4 mr-2" data-id="5j9eivygn" data-path="src/pages/Licenses/LicenseList.tsx" />
              Soft Delete
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleHardDelete(licenseToDelete?.ID || 0);
                setDeleteDialogOpen(false);
              }}
              disabled={deletingLicenseId !== null} data-id="uvp6rp9l4" data-path="src/pages/Licenses/LicenseList.tsx">

              <Trash2 className="w-4 h-4 mr-2" data-id="lyb93izyu" data-path="src/pages/Licenses/LicenseList.tsx" />
              Permanent Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>);

};

export default LicenseList;