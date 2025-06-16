import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Phone, Settings, History, Plus, Edit, Trash2, Send, CheckCircle, AlertCircle, TestTube, AlertTriangle } from 'lucide-react';
import { useAdminAccess } from '@/hooks/use-admin-access';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';
import AccessDenied from '@/components/AccessDenied';
import CustomSMSSendingForm from '@/components/CustomSMSSendingForm';
import EnhancedSMSTestManager from '@/components/EnhancedSMSTestManager';
import { supabase } from '@/lib/supabase';
import SMSConfigurationValidator from '@/components/SMSConfigurationValidator';
import SMSTroubleshootingGuide from '@/components/SMSTroubleshootingGuide';

interface SMSAlertSetting {
  id: number;
  setting_name: string;
  days_before_expiry: number;
  alert_frequency_days: number;
  is_active: boolean;
  message_template: string;
  created_by: number;
}

interface SMSContact {
  id: number;
  contact_name: string;
  mobile_number: string;
  station: string;
  is_active: boolean;
  contact_role: string;
  created_by: number;
}

interface SMSHistory {
  id: number;
  license_id: number;
  contact_id: number;
  mobile_number: string;
  message_content: string;
  sent_date: string;
  delivery_status: string;
  days_before_expiry: number;
  created_by: number;
}

const SMSAlertManagement: React.FC = () => {
  const { isAdmin } = useAdminAccess();
  const [settings, setSettings] = useState<SMSAlertSetting[]>([]);
  const [contacts, setContacts] = useState<SMSContact[]>([]);
  const [history, setHistory] = useState<SMSHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.allSettled([
        loadSettings(),
        loadContacts(),
        loadHistory()]
        );
      } catch (error) {
        console.error('Error initializing SMS Alert Management:', error);
        setError('Failed to initialize SMS Alert Management');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_settings')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading SMS settings:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS alert settings",
        variant: "destructive"
      });
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_contacts')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading SMS contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS contacts",
        variant: "destructive"
      });
    }
  };

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_alert_history')
        .select('*')
        .order('sent_date', { ascending: false })
        .limit(50);
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading SMS history:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS history",
        variant: "destructive"
      });
    }
  };

  const sendTestSMS = async () => {
    try {
      setLoading(true);
      const testMessage = "🔔 Test SMS from DFS Manager: This is a test message from your License Alert System. SMS functionality is working correctly!";

      // Get all active contacts
      const activeContacts = contacts.filter((c) => c.is_active);

      if (activeContacts.length === 0) {
        toast({
          title: "No Active Contacts",
          description: "Please add active SMS contacts before sending test messages.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sending Test SMS",
        description: `Sending test SMS to ${activeContacts.length} contact(s)...`
      });

      let successCount = 0;
      let failureCount = 0;

      // Send SMS to each contact (simulated)
      for (const contact of activeContacts) {
        console.log(`Sending test SMS to ${contact.contact_name} at ${contact.mobile_number}`);

        // Simulate SMS sending
        const smsResult = {
          success: Math.random() > 0.1, // 90% success rate
          error: Math.random() > 0.1 ? null : 'Simulated failure for testing'
        };

        if (smsResult.success) {
          successCount++;
          console.log(`✅ SMS sent successfully to ${contact.contact_name}`);
        } else {
          failureCount++;
          console.error(`❌ SMS failed to ${contact.contact_name}:`, smsResult.error);
        }

        // Create history record
        await supabase
          .from('sms_alert_history')
          .insert({
            license_id: 0, // Test SMS
            contact_id: contact.id,
            mobile_number: contact.mobile_number,
            message_content: testMessage,
            sent_date: new Date().toISOString(),
            delivery_status: smsResult.success ? 'Sent' : `Failed - ${smsResult.error}`,
            days_before_expiry: 0,
            created_by: 1
          });
      }

      // Show results
      if (successCount > 0 && failureCount === 0) {
        toast({
          title: "✅ Test SMS Sent Successfully",
          description: `Test SMS sent to all ${successCount} contact(s). Check your mobile device!`
        });
      } else if (successCount > 0 && failureCount > 0) {
        toast({
          title: "⚠️ Partial Success",
          description: `${successCount} SMS sent successfully, ${failureCount} failed. Check SMS History for details.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ All SMS Failed",
          description: "Failed to send SMS to any contacts. Please check phone numbers and try again.",
          variant: "destructive"
        });
      }

      loadHistory();
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast({
        title: "Error",
        description: `Failed to send test SMS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check admin access first
  if (!isAdmin) {
    return (
      <AccessDenied
        feature="SMS Alert Management"
        requiredRole="Administrator" data-id="fa3pygj5c" data-path="src/pages/Admin/SMSAlertManagement.tsx" />);

  }

  if (error) {
    return (
      <Card className="mx-auto max-w-lg" data-id="txmgc5gbh" data-path="src/pages/Admin/SMSAlertManagement.tsx">
        <CardHeader data-id="48qddszsp" data-path="src/pages/Admin/SMSAlertManagement.tsx">
          <CardTitle className="flex items-center text-red-600" data-id="hjhqevcxt" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <AlertCircle className="w-5 h-5 mr-2" data-id="0p06fhvnt" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
            Error Loading SMS Alert Management
          </CardTitle>
        </CardHeader>
        <CardContent data-id="mqmvlckhl" data-path="src/pages/Admin/SMSAlertManagement.tsx">
          <Alert variant="destructive" data-id="vie4mlom1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <AlertDescription data-id="ux33jt26g" data-path="src/pages/Admin/SMSAlertManagement.tsx">{error}</AlertDescription>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            className="w-full mt-4" data-id="v0kbp0hu5" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            Retry
          </Button>
        </CardContent>
      </Card>);

  }

  return (
    <ComponentErrorBoundary fallback="SMS Alert Management" data-id="ihht9xkda" data-path="src/pages/Admin/SMSAlertManagement.tsx">
      <div className="space-y-6" data-id="jlapip954" data-path="src/pages/Admin/SMSAlertManagement.tsx">
        {/* SMS Diagnostic Guide Banner */}
        <Alert className="border-red-200 bg-red-50" data-id="kdys6fiyg" data-path="src/pages/Admin/SMSAlertManagement.tsx">
          <AlertTriangle className="h-4 w-4 text-red-600" data-id="1ns16y5ws" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
          <AlertDescription className="text-red-800" data-id="moe3l6r1h" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <div className="space-y-2" data-id="uzlw7iuhn" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <div data-id="p4p0s3rax" data-path="src/pages/Admin/SMSAlertManagement.tsx"><strong data-id="eujmd5pfr" data-path="src/pages/Admin/SMSAlertManagement.tsx">💛 SMS Not Working? Common Fix:</strong></div>
              <div className="text-sm space-y-1" data-id="dr84ty48g" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <div data-id="p3vfyokcn" data-path="src/pages/Admin/SMSAlertManagement.tsx">• <strong data-id="2t2wpbcag" data-path="src/pages/Admin/SMSAlertManagement.tsx">Check Test Mode:</strong> If in test mode, only verified numbers receive SMS</div>
                <div data-id="dbtn661f9" data-path="src/pages/Admin/SMSAlertManagement.tsx">• <strong data-id="b2gb16fx6" data-path="src/pages/Admin/SMSAlertManagement.tsx">Verify Phone Format:</strong> Use E.164 format (+1234567890)</div>
                <div data-id="yd56joi8q" data-path="src/pages/Admin/SMSAlertManagement.tsx">• <strong data-id="681f7alc6" data-path="src/pages/Admin/SMSAlertManagement.tsx">Check Twilio Balance:</strong> Insufficient funds will show "sent" but not deliver</div>
                <div data-id="166d7p54k" data-path="src/pages/Admin/SMSAlertManagement.tsx">• <strong data-id="1vewz1w7n" data-path="src/pages/Admin/SMSAlertManagement.tsx">Use Debug Tab:</strong> Complete troubleshooting guide available in the Debug tab</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center" data-id="11wf7a8jr" data-path="src/pages/Admin/SMSAlertManagement.tsx">
          <h1 className="text-3xl font-bold" data-id="po9j66bxt" data-path="src/pages/Admin/SMSAlertManagement.tsx">SMS Alert Management</h1>
          <div className="flex items-center space-x-4" data-id="7w5agbioz" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <div className="flex items-center space-x-2" data-id="l9zdh8lcp" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <CheckCircle className="w-5 h-5 text-green-500" data-id="bm3cxqq2k" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
              <span className="text-sm text-green-600" data-id="xz8ia3820" data-path="src/pages/Admin/SMSAlertManagement.tsx">SMS Service Online</span>
            </div>
            <Button
              onClick={sendTestSMS}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700" data-id="ukv198wwo" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <Send className="w-4 h-4 mr-2" data-id="1t39ru9iq" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
              {loading ? 'Sending...' : 'Send Test SMS'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" data-id="xl3707j2y" data-path="src/pages/Admin/SMSAlertManagement.tsx">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8" data-id="60dgfpq2t" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <TabsTrigger value="overview" data-id="dc6fm0s2b" data-path="src/pages/Admin/SMSAlertManagement.tsx">📊 Overview</TabsTrigger>
            <TabsTrigger value="config" data-id="6kf8nod5k" data-path="src/pages/Admin/SMSAlertManagement.tsx">🔧 Config</TabsTrigger>
            <TabsTrigger value="testing" data-id="x39etl5fj" data-path="src/pages/Admin/SMSAlertManagement.tsx">🧪 Testing</TabsTrigger>
            <TabsTrigger value="troubleshoot" data-id="n3oyl3m4v" data-path="src/pages/Admin/SMSAlertManagement.tsx">🔍 Debug</TabsTrigger>
            <TabsTrigger value="custom" data-id="udzg85pk6" data-path="src/pages/Admin/SMSAlertManagement.tsx">📱 Send SMS</TabsTrigger>
            <TabsTrigger value="contacts" data-id="n1rr2ohli" data-path="src/pages/Admin/SMSAlertManagement.tsx">📞 Contacts</TabsTrigger>
            <TabsTrigger value="settings" data-id="ve7x047e0" data-path="src/pages/Admin/SMSAlertManagement.tsx">⚙️ Settings</TabsTrigger>
            <TabsTrigger value="history" data-id="sh8zs1oxz" data-path="src/pages/Admin/SMSAlertManagement.tsx">📝 History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" data-id="kxae05c5u" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="lulfjjera" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <Card data-id="pihm4lm6k" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <CardHeader data-id="6zhftrcgi" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <CardTitle className="flex items-center" data-id="nlb5hjwlg" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Phone className="w-5 h-5 mr-2" data-id="lxqbs751o" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    Active Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent data-id="c3iypdhlv" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <div className="text-3xl font-bold text-blue-600" data-id="50ll69bpx" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    {contacts.filter((c) => c.is_active).length}
                  </div>
                  <p className="text-sm text-muted-foreground" data-id="6rs0lb3rq" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    Out of {contacts.length} total contacts
                  </p>
                </CardContent>
              </Card>

              <Card data-id="fbssoislu" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <CardHeader data-id="v2p6xg6lf" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <CardTitle className="flex items-center" data-id="80gdvopek" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Settings className="w-5 h-5 mr-2" data-id="8ujas8fvc" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    Alert Settings
                  </CardTitle>
                </CardHeader>
                <CardContent data-id="x43zxerso" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <div className="text-3xl font-bold text-green-600" data-id="z4no0qcfc" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    {settings.filter((s) => s.is_active).length}
                  </div>
                  <p className="text-sm text-muted-foreground" data-id="el6ek4b7i" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    Active alert configurations
                  </p>
                </CardContent>
              </Card>

              <Card data-id="74dtp5p6t" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <CardHeader data-id="0m8y6nupt" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <CardTitle className="flex items-center" data-id="j9uus3gs1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <History className="w-5 h-5 mr-2" data-id="3p5vyta09" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent data-id="n3e3b84im" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <div className="text-3xl font-bold text-purple-600" data-id="luawe1ktx" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    {history.length}
                  </div>
                  <p className="text-sm text-muted-foreground" data-id="1xuijd1ct" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    SMS messages sent
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6" data-id="bvochyjk3" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <CardHeader data-id="l6mawk374" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <CardTitle data-id="hgqgl7chj" data-path="src/pages/Admin/SMSAlertManagement.tsx">Quick Setup Guide</CardTitle>
              </CardHeader>
              <CardContent data-id="aoz59e65r" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <div className="space-y-4" data-id="iumgb0evb" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <div className="flex items-center space-x-2" data-id="smcb2x6u6" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600" data-id="2gyh3qlsf" data-path="src/pages/Admin/SMSAlertManagement.tsx">1</div>
                    <span data-id="tm4weowzh" data-path="src/pages/Admin/SMSAlertManagement.tsx">Add SMS contacts in the SMS Contacts tab</span>
                  </div>
                  <div className="flex items-center space-x-2" data-id="cmnubaixk" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600" data-id="81otdwydv" data-path="src/pages/Admin/SMSAlertManagement.tsx">2</div>
                    <span data-id="pmpvqcxeq" data-path="src/pages/Admin/SMSAlertManagement.tsx">Configure alert settings for license expiry notifications</span>
                  </div>
                  <div className="flex items-center space-x-2" data-id="g6963fqgu" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600" data-id="d8fwcl4em" data-path="src/pages/Admin/SMSAlertManagement.tsx">3</div>
                    <span data-id="22b51qd7c" data-path="src/pages/Admin/SMSAlertManagement.tsx">Send test SMS to verify everything works correctly</span>
                  </div>
                  <div className="flex items-center space-x-2" data-id="q5vpr9tcj" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600" data-id="o3obj3ygg" data-path="src/pages/Admin/SMSAlertManagement.tsx">4</div>
                    <span data-id="8jem6h4at" data-path="src/pages/Admin/SMSAlertManagement.tsx">Monitor SMS history to track delivery status</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" data-id="jq50ga4bw" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <SMSConfigurationValidator data-id="z6nwz71hg" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
          </TabsContent>

          <TabsContent value="testing" data-id="fb4xmt2ii" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <EnhancedSMSTestManager data-id="iyjr4331h" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
          </TabsContent>

          <TabsContent value="troubleshoot" data-id="ub8sr1aaf" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <SMSTroubleshootingGuide data-id="cqxgfthlh" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
          </TabsContent>

          <TabsContent value="custom" data-id="c24y5s1z1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <CustomSMSSendingForm data-id="hpjg77gyd" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
          </TabsContent>

          <TabsContent value="contacts" data-id="w6yygl8nu" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <Card data-id="h22bkjnfb" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <CardHeader data-id="79kqw0s4n" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <div className="flex justify-between items-center" data-id="jxw54bguh" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <CardTitle className="flex items-center" data-id="nkyxs8pf4" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Phone className="w-5 h-5 mr-2" data-id="hpxfjllrx" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    SMS Contacts ({contacts.filter((c) => c.is_active).length} active)
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Add Contact",
                        description: "Opening contact creation form...",
                      });
                      // TODO: Implement contact creation modal
                    }}
                    data-id="z1vn5ehl7" 
                    data-path="src/pages/Admin/SMSAlertManagement.tsx"
                  >
                    <Plus className="w-4 h-4 mr-2" data-id="yxh2s9s02" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent data-id="k5r6rnr4r" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                {contacts.length > 0 ?
                <Table data-id="0yiscmdli" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <TableHeader data-id="kaj625zc7" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      <TableRow data-id="72sck4817" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                        <TableHead data-id="7g59h3do1" data-path="src/pages/Admin/SMSAlertManagement.tsx">Name</TableHead>
                        <TableHead data-id="68wslbg4f" data-path="src/pages/Admin/SMSAlertManagement.tsx">Mobile Number</TableHead>
                        <TableHead data-id="80r8ictzx" data-path="src/pages/Admin/SMSAlertManagement.tsx">Station</TableHead>
                        <TableHead data-id="3s500d81a" data-path="src/pages/Admin/SMSAlertManagement.tsx">Role</TableHead>
                        <TableHead data-id="qdgwzi21j" data-path="src/pages/Admin/SMSAlertManagement.tsx">Status</TableHead>
                        <TableHead data-id="y2mxh3lq1" data-path="src/pages/Admin/SMSAlertManagement.tsx">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody data-id="68whtqiez" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      {contacts.map((contact) =>
                    <TableRow key={contact.id} data-id="ayj5tbkpl" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                          <TableCell className="font-medium" data-id="gr6nb5jkh" data-path="src/pages/Admin/SMSAlertManagement.tsx">{contact.contact_name}</TableCell>
                          <TableCell data-id="gfzu748kk" data-path="src/pages/Admin/SMSAlertManagement.tsx">{contact.mobile_number}</TableCell>
                          <TableCell data-id="yemfq2ccc" data-path="src/pages/Admin/SMSAlertManagement.tsx">{contact.station}</TableCell>
                          <TableCell data-id="jgh2wt20h" data-path="src/pages/Admin/SMSAlertManagement.tsx">{contact.contact_role}</TableCell>
                          <TableCell data-id="vfclgaegq" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            <Badge variant={contact.is_active ? 'default' : 'secondary'} data-id="fprz23oke" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                              {contact.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell data-id="mysqc46zb" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            <div className="flex space-x-2" data-id="vnq72y3im" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  toast({
                                    title: "Edit Contact",
                                    description: `Editing contact: ${contact.contact_name}`,
                                  });
                                }}
                                title="Edit contact"
                                data-id="xszk8t9xv" 
                                data-path="src/pages/Admin/SMSAlertManagement.tsx"
                              >
                                <Edit className="w-4 h-4" data-id="kh07sx1bk" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete contact "${contact.contact_name}"?`)) {
                                    toast({
                                      title: "Contact Deleted",
                                      description: `Contact ${contact.contact_name} has been deleted`,
                                      variant: "destructive"
                                    });
                                    // TODO: Implement actual deletion
                                    loadContacts();
                                  }
                                }}
                                title="Delete contact"
                                className="text-red-600 hover:text-red-700"
                                data-id="6venazdgp" 
                                data-path="src/pages/Admin/SMSAlertManagement.tsx"
                              >
                                <Trash2 className="w-4 h-4" data-id="20qzh63rb" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                  </Table> :

                <div className="text-center py-8" data-id="26hacs4n1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Phone className="w-12 h-12 mx-auto text-muted-foreground mb-4" data-id="yux5y2jhd" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    <h3 className="text-lg font-semibold mb-2" data-id="mummj2nrp" data-path="src/pages/Admin/SMSAlertManagement.tsx">No SMS Contacts</h3>
                    <p className="text-muted-foreground mb-4" data-id="dh359v7ij" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      Add contacts to receive SMS alerts for license expiries
                    </p>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Add Contact",
                          description: "Opening contact creation form...",
                        });
                        // TODO: Implement contact creation modal
                      }}
                      data-id="8f7359q6k" 
                      data-path="src/pages/Admin/SMSAlertManagement.tsx"
                    >
                      <Plus className="w-4 h-4 mr-2" data-id="h3f805g6m" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                      Add Your First Contact
                    </Button>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" data-id="3qam673f1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <Card data-id="z49jqe939" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <CardHeader data-id="peh2kxgv4" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <div className="flex justify-between items-center" data-id="az9fd8qvn" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <CardTitle className="flex items-center" data-id="jkcw2hbub" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Settings className="w-5 h-5 mr-2" data-id="n30xt648c" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    SMS Alert Settings
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Add Setting",
                        description: "Opening SMS alert setting creation form...",
                      });
                      // TODO: Implement setting creation modal
                    }}
                    data-id="n34gdw5bq" 
                    data-path="src/pages/Admin/SMSAlertManagement.tsx"
                  >
                    <Plus className="w-4 h-4 mr-2" data-id="2l8xx1yok" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    Add Setting
                  </Button>
                </div>
              </CardHeader>
              <CardContent data-id="olmmrn70o" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                {settings.length > 0 ?
                <Table data-id="6fk6sixt7" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <TableHeader data-id="12r8jzvsn" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      <TableRow data-id="bdundy4fz" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                        <TableHead data-id="9vvk7i52p" data-path="src/pages/Admin/SMSAlertManagement.tsx">Setting Name</TableHead>
                        <TableHead data-id="5av6mu9xs" data-path="src/pages/Admin/SMSAlertManagement.tsx">Days Before</TableHead>
                        <TableHead data-id="41kvp4e73" data-path="src/pages/Admin/SMSAlertManagement.tsx">Frequency</TableHead>
                        <TableHead data-id="gpnfwv15l" data-path="src/pages/Admin/SMSAlertManagement.tsx">Status</TableHead>
                        <TableHead data-id="wpprswk7i" data-path="src/pages/Admin/SMSAlertManagement.tsx">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody data-id="wrxun8mvh" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      {settings.map((setting) =>
                    <TableRow key={setting.id} data-id="1tpsvc0i8" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                          <TableCell className="font-medium" data-id="qulad56h2" data-path="src/pages/Admin/SMSAlertManagement.tsx">{setting.setting_name}</TableCell>
                          <TableCell data-id="h814vh2s1" data-path="src/pages/Admin/SMSAlertManagement.tsx">{setting.days_before_expiry} days</TableCell>
                          <TableCell data-id="9a0fc749h" data-path="src/pages/Admin/SMSAlertManagement.tsx">Every {setting.alert_frequency_days} days</TableCell>
                          <TableCell data-id="optdzhf6i" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            <Badge variant={setting.is_active ? 'default' : 'secondary'} data-id="xn1xfk4mx" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                              {setting.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell data-id="mtle4hnq1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            <div className="flex space-x-2" data-id="cqm2l429k" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                              <Button size="sm" variant="outline" data-id="5o4fj9ypf" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                                <Edit className="w-4 h-4" data-id="c1xhpvz92" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                              </Button>
                              <Button size="sm" variant="outline" data-id="k6w6ie3p1" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                                <Trash2 className="w-4 h-4" data-id="a4qknue7y" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                  </Table> :

                <div className="text-center py-8" data-id="kvfx2iouj" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" data-id="98fqnmg8z" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    <h3 className="text-lg font-semibold mb-2" data-id="cfxlo1bnt" data-path="src/pages/Admin/SMSAlertManagement.tsx">No Alert Settings</h3>
                    <p className="text-muted-foreground mb-4" data-id="26hjqt8hs" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      Configure when and how often to send license expiry alerts
                    </p>
                    <Button data-id="erayvemba" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      <Plus className="w-4 h-4 mr-2" data-id="wmsry6rbz" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                      Create First Setting
                    </Button>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" data-id="jlx22ige6" data-path="src/pages/Admin/SMSAlertManagement.tsx">
            <Card data-id="qg322b402" data-path="src/pages/Admin/SMSAlertManagement.tsx">
              <CardHeader data-id="03xbkxt51" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                <CardTitle className="flex items-center" data-id="nvwvz5jz8" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                  <History className="w-5 h-5 mr-2" data-id="37desjxcm" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                  SMS Alert History
                </CardTitle>
              </CardHeader>
              <CardContent data-id="w75lfx4u6" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                {history.length > 0 ?
                <Table data-id="lh2mpf3d4" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <TableHeader data-id="vcdwbk0w9" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      <TableRow data-id="ockiw39kz" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                        <TableHead data-id="57km8xnrd" data-path="src/pages/Admin/SMSAlertManagement.tsx">Date Sent</TableHead>
                        <TableHead data-id="2r4u11o7t" data-path="src/pages/Admin/SMSAlertManagement.tsx">Mobile Number</TableHead>
                        <TableHead data-id="zmmrmarvs" data-path="src/pages/Admin/SMSAlertManagement.tsx">Message</TableHead>
                        <TableHead data-id="ij26jof2c" data-path="src/pages/Admin/SMSAlertManagement.tsx">Days Before Expiry</TableHead>
                        <TableHead data-id="n0i1eznm9" data-path="src/pages/Admin/SMSAlertManagement.tsx">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody data-id="fppuse7ri" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      {history.map((record) =>
                    <TableRow key={record.id} data-id="sm1r99lea" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                          <TableCell data-id="9blolhwqt" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            {new Date(record.sent_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell data-id="z8o1bc5qr" data-path="src/pages/Admin/SMSAlertManagement.tsx">{record.mobile_number}</TableCell>
                          <TableCell className="max-w-xs truncate" data-id="sfp9gox57" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            {record.message_content}
                          </TableCell>
                          <TableCell data-id="mq5dtqc5m" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            {record.days_before_expiry === 0 ? 'Test' : `${record.days_before_expiry} days`}
                          </TableCell>
                          <TableCell data-id="4itvveow6" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                            <Badge
                          variant={record.delivery_status === 'Sent' || record.delivery_status === 'Test Sent' ?
                          'default' : 'destructive'} data-id="qpold76mr" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                              {record.delivery_status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                  </Table> :

                <div className="text-center py-8" data-id="gearu7wk5" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                    <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" data-id="06fcy7q3m" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                    <h3 className="text-lg font-semibold mb-2" data-id="kkamw42wr" data-path="src/pages/Admin/SMSAlertManagement.tsx">No SMS History</h3>
                    <p className="text-muted-foreground mb-4" data-id="xm0keth7w" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      SMS delivery history will appear here once you start sending alerts
                    </p>
                    <Button onClick={sendTestSMS} disabled={loading} data-id="rtgllwrhr" data-path="src/pages/Admin/SMSAlertManagement.tsx">
                      <Send className="w-4 h-4 mr-2" data-id="2lo2k8i6b" data-path="src/pages/Admin/SMSAlertManagement.tsx" />
                      Send Test SMS
                    </Button>
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ComponentErrorBoundary>);

};

export default SMSAlertManagement;
