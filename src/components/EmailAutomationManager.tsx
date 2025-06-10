import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { _Input } from '@/components/ui/input';
import { _Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { _Select, _SelectContent, _SelectItem, _SelectTrigger, _SelectValue } from '@/components/ui/select';
import { _Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { _Alert, _AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Send,
  Settings,
  _Calendar,
  _Users,
  CheckCircle,
  _AlertCircle,
  Clock,
  Zap,
  BarChart3,
  RefreshCw,
  Plus,
  Edit,
  _Trash2,
  _Play,
  _Pause,
  Eye } from
'lucide-react';

interface EmailAutomationConfig {
  id?: number;
  automation_name: string;
  email_type: string;
  is_active: boolean;
  from_email: string;
  from_name: string;
  trigger_condition: string;
  trigger_value: number;
  frequency_hours: number;
  template_id?: number;
  recipient_groups: string;
  last_run?: string;
  next_run?: string;
  total_sent: number;
  success_rate: number;
  created_by?: number;
}

interface EmailTemplate {
  id?: number;
  template_name: string;
  template_type: string;
  subject: string;
  html_content: string;
  text_content: string;
  is_active: boolean;
  variables: string;
  created_by?: number;
}

interface EmailStats {
  totalSent: number;
  successRate: number;
  deliveryRate: number;
  openRate: number;
  lastSent: string;
  queuedEmails: number;
}

const EmailAutomationManager: React.FC = () => {
  const [automations, setAutomations] = useState<EmailAutomationConfig[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    totalSent: 0,
    successRate: 0,
    deliveryRate: 0,
    openRate: 0,
    lastSent: '',
    queuedEmails: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [_editingAutomation, _setEditingAutomation] = useState<EmailAutomationConfig | null>(null);
  const [_editingTemplate, _setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [testEmailSending, setTestEmailSending] = useState<number | null>(null);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadAutomations();
    loadTemplates();
    loadStats();
  }, [loadAutomations, loadTemplates, loadStats]);

  const loadAutomations = async () => {
    try {
      // Since email automation tables don't exist yet, we'll create them first
      console.log('Loading email automations...');
      // For now, use mock data until tables are created
      setAutomations([
      {
        id: 1,
        automation_name: 'License Expiry Alerts',
        email_type: 'License Alert',
        is_active: true,
        from_email: 'alerts@dfsmanager.com',
        from_name: 'DFS Manager Alerts',
        trigger_condition: 'days_before_expiry',
        trigger_value: 30,
        frequency_hours: 24,
        recipient_groups: 'station_managers,admin',
        total_sent: 45,
        success_rate: 98.5,
        last_run: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        next_run: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        automation_name: 'Daily Sales Reports',
        email_type: 'Sales Report',
        is_active: true,
        from_email: 'reports@dfsmanager.com',
        from_name: 'DFS Manager Reports',
        trigger_condition: 'daily_schedule',
        trigger_value: 8,
        frequency_hours: 24,
        recipient_groups: 'management',
        total_sent: 120,
        success_rate: 99.2,
        last_run: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        next_run: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()
      }]
      );
    } catch (error) {
      console.error('Error loading automations:', error);
      toast({
        title: "Error",
        description: "Failed to load email automations",
        variant: "destructive"
      });
    }
  };

  const loadTemplates = async () => {
    try {
      console.log('Loading email templates...');
      // Mock template data
      setTemplates([
      {
        id: 1,
        template_name: 'License Expiry Alert',
        template_type: 'License Alert',
        subject: 'License Expiring Soon - {license_name}',
        html_content: `
            <h2>License Expiry Alert</h2>
            <p>Dear {recipient_name},</p>
            <p>This is a reminder that the license <strong>{license_name}</strong> for station <strong>{station_name}</strong> will expire on <strong>{expiry_date}</strong>.</p>
            <p>Please take immediate action to renew this license to avoid any business disruption.</p>
            <p>Days remaining: <strong>{days_remaining}</strong></p>
            <hr>
            <p>DFS Manager System</p>
          `,
        text_content: 'License {license_name} for {station_name} expires on {expiry_date}. Days remaining: {days_remaining}',
        is_active: true,
        variables: 'license_name,station_name,expiry_date,days_remaining,recipient_name'
      },
      {
        id: 2,
        template_name: 'Daily Sales Summary',
        template_type: 'Sales Report',
        subject: 'Daily Sales Report - {report_date}',
        html_content: `
            <h2>Daily Sales Report</h2>
            <p>Sales summary for {report_date}</p>
            <table border="1" style="border-collapse: collapse; width: 100%;">
              <tr><th>Station</th><th>Total Sales</th><th>Fuel Sales</th><th>Store Sales</th></tr>
              <tr><td>{station_name}</td><td>$\{total_sales}</td><td>$\{fuel_sales}</td><td>$\{store_sales}</td></tr>
            </table>
            <p>Generated automatically by DFS Manager</p>
          `,
        text_content: 'Daily sales for {report_date}: Total: ${total_sales}, Fuel: ${fuel_sales}, Store: ${store_sales}',
        is_active: true,
        variables: 'report_date,station_name,total_sales,fuel_sales,store_sales'
      }]
      );
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive"
      });
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from automations
      const totalSent = automations.reduce((sum, auto) => sum + auto.total_sent, 0);
      const avgSuccessRate = automations.length > 0 ?
      automations.reduce((sum, auto) => sum + auto.success_rate, 0) / automations.length :
      0;

      setStats({
        totalSent,
        successRate: avgSuccessRate,
        deliveryRate: 96.8,
        openRate: 78.3,
        lastSent: automations.length > 0 ? automations[0].last_run || '' : '',
        queuedEmails: 12
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async (automationId: number) => {
    setTestEmailSending(automationId);
    try {
      const automation = automations.find((a) => a.id === automationId);
      if (!automation) return;

      const { error } = await window.ezsite.apis.sendEmail({
        from: `${automation.from_name} <${automation.from_email}>`,
        to: [automation.from_email], // Send to self for testing
        subject: `TEST: ${automation.automation_name} - ${new Date().toLocaleString()}`,
        html: `
          <h2>Email Automation Test</h2>
          <p>This is a test email for the automation: <strong>${automation.automation_name}</strong></p>
          <p><strong>Type:</strong> ${automation.email_type}</p>
          <p><strong>Trigger:</strong> ${automation.trigger_condition} = ${automation.trigger_value}</p>
          <p><strong>Frequency:</strong> Every ${automation.frequency_hours} hours</p>
          <p><strong>Recipients:</strong> ${automation.recipient_groups}</p>
          <hr>
          <p>Test sent at: ${new Date().toLocaleString()}</p>
          <p>DFS Manager Email Automation System</p>
        `
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: `Test email sent successfully for ${automation.automation_name}`
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    } finally {
      setTestEmailSending(null);
    }
  };

  const toggleAutomation = async (id: number, active: boolean) => {
    try {
      setAutomations((prev) => prev.map((auto) =>
      auto.id === id ? { ...auto, is_active: active } : auto
      ));

      toast({
        title: active ? "Automation Enabled" : "Automation Disabled",
        description: `Email automation has been ${active ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "Error",
        description: "Failed to update automation status",
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  const formatTimeUntil = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));

    if (diff < 0) return 'Overdue';
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  if (loading) {
    return (
      <Card data-id="j24n4x4go" data-path="src/components/EmailAutomationManager.tsx">
        <CardContent className="p-6" data-id="3dizzwkj6" data-path="src/components/EmailAutomationManager.tsx">
          <div className="flex items-center justify-center space-x-2" data-id="a1xp0rzim" data-path="src/components/EmailAutomationManager.tsx">
            <RefreshCw className="w-4 h-4 animate-spin" data-id="61l7y59q3" data-path="src/components/EmailAutomationManager.tsx" />
            <span data-id="39goe89g4" data-path="src/components/EmailAutomationManager.tsx">Loading email automation...</span>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6" data-id="c2ps498tz" data-path="src/components/EmailAutomationManager.tsx">
      <Tabs value={activeTab} onValueChange={setActiveTab} data-id="hc2f281fp" data-path="src/components/EmailAutomationManager.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="4cw66953k" data-path="src/components/EmailAutomationManager.tsx">
          <TabsTrigger value="overview" data-id="tmgc7ir5c" data-path="src/components/EmailAutomationManager.tsx">Overview</TabsTrigger>
          <TabsTrigger value="automations" data-id="4byzjwrf9" data-path="src/components/EmailAutomationManager.tsx">Automations</TabsTrigger>
          <TabsTrigger value="templates" data-id="e8a45bqu5" data-path="src/components/EmailAutomationManager.tsx">Templates</TabsTrigger>
          <TabsTrigger value="analytics" data-id="t1ad9olyl" data-path="src/components/EmailAutomationManager.tsx">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4" data-id="ypxdp3nvj" data-path="src/components/EmailAutomationManager.tsx">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="atlw1fqh9" data-path="src/components/EmailAutomationManager.tsx">
            <Card data-id="9hnl79urf" data-path="src/components/EmailAutomationManager.tsx">
              <CardContent className="p-4" data-id="fb6vkhqha" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-3" data-id="dscy04j63" data-path="src/components/EmailAutomationManager.tsx">
                  <Send className="w-8 h-8 text-blue-600" data-id="pzotnzlgp" data-path="src/components/EmailAutomationManager.tsx" />
                  <div data-id="jz5n2t54u" data-path="src/components/EmailAutomationManager.tsx">
                    <p className="text-sm text-gray-600" data-id="o74lvg06r" data-path="src/components/EmailAutomationManager.tsx">Total Sent</p>
                    <p className="text-2xl font-bold text-blue-600" data-id="a95uwddnf" data-path="src/components/EmailAutomationManager.tsx">{stats.totalSent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="iqcwlsjp7" data-path="src/components/EmailAutomationManager.tsx">
              <CardContent className="p-4" data-id="flk469dxm" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-3" data-id="dxy2eze4g" data-path="src/components/EmailAutomationManager.tsx">
                  <CheckCircle className="w-8 h-8 text-green-600" data-id="kzdsonbf8" data-path="src/components/EmailAutomationManager.tsx" />
                  <div data-id="yohlcny4c" data-path="src/components/EmailAutomationManager.tsx">
                    <p className="text-sm text-gray-600" data-id="3qfpejiyy" data-path="src/components/EmailAutomationManager.tsx">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600" data-id="0dcuidqj8" data-path="src/components/EmailAutomationManager.tsx">{stats.successRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="yy0p22yar" data-path="src/components/EmailAutomationManager.tsx">
              <CardContent className="p-4" data-id="bamai04ea" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-3" data-id="dbvz9c07a" data-path="src/components/EmailAutomationManager.tsx">
                  <BarChart3 className="w-8 h-8 text-purple-600" data-id="1wmpisina" data-path="src/components/EmailAutomationManager.tsx" />
                  <div data-id="686qllnjn" data-path="src/components/EmailAutomationManager.tsx">
                    <p className="text-sm text-gray-600" data-id="acoxuuvfk" data-path="src/components/EmailAutomationManager.tsx">Open Rate</p>
                    <p className="text-2xl font-bold text-purple-600" data-id="fem3p95t4" data-path="src/components/EmailAutomationManager.tsx">{stats.openRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="qga7wdayk" data-path="src/components/EmailAutomationManager.tsx">
              <CardContent className="p-4" data-id="u2g4nc9zn" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-3" data-id="jcq9ekcn1" data-path="src/components/EmailAutomationManager.tsx">
                  <Clock className="w-8 h-8 text-orange-600" data-id="b8a7rnw2o" data-path="src/components/EmailAutomationManager.tsx" />
                  <div data-id="ywilj8xvr" data-path="src/components/EmailAutomationManager.tsx">
                    <p className="text-sm text-gray-600" data-id="fhu6ktnf2" data-path="src/components/EmailAutomationManager.tsx">Queued</p>
                    <p className="text-2xl font-bold text-orange-600" data-id="dmyf1ce98" data-path="src/components/EmailAutomationManager.tsx">{stats.queuedEmails}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Automations */}
          <Card data-id="mquq2tn02" data-path="src/components/EmailAutomationManager.tsx">
            <CardHeader data-id="fvsqcook5" data-path="src/components/EmailAutomationManager.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="yue4m02o7" data-path="src/components/EmailAutomationManager.tsx">
                <Zap className="w-5 h-5" data-id="t713s0ijl" data-path="src/components/EmailAutomationManager.tsx" />
                <span data-id="u2d1azcva" data-path="src/components/EmailAutomationManager.tsx">Active Automations</span>
                <Badge variant="secondary" data-id="5icjza4vu" data-path="src/components/EmailAutomationManager.tsx">{automations.filter((a) => a.is_active).length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="extbghkmu" data-path="src/components/EmailAutomationManager.tsx">
              <div className="space-y-3" data-id="163klaw54" data-path="src/components/EmailAutomationManager.tsx">
                {automations.filter((a) => a.is_active).map((automation) =>
                <div key={automation.id} className="flex items-center justify-between p-3 border rounded-lg" data-id="h0pk1bt2r" data-path="src/components/EmailAutomationManager.tsx">
                    <div className="flex items-center space-x-3" data-id="yy09de6be" data-path="src/components/EmailAutomationManager.tsx">
                      <Mail className="w-5 h-5 text-blue-600" data-id="vcn08kzm4" data-path="src/components/EmailAutomationManager.tsx" />
                      <div data-id="hrdhntdyt" data-path="src/components/EmailAutomationManager.tsx">
                        <p className="font-medium" data-id="r4wcmvvuz" data-path="src/components/EmailAutomationManager.tsx">{automation.automation_name}</p>
                        <p className="text-sm text-gray-600" data-id="sjwq0kbpt" data-path="src/components/EmailAutomationManager.tsx">
                          Last run: {formatTimeAgo(automation.last_run || '')} • 
                          Next: {formatTimeUntil(automation.next_run || '')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" data-id="imrz7f62i" data-path="src/components/EmailAutomationManager.tsx">
                      <Badge className="bg-green-100 text-green-800" data-id="o77putzd2" data-path="src/components/EmailAutomationManager.tsx">
                        {automation.success_rate}% success
                      </Badge>
                      <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestEmail(automation.id!)}
                      disabled={testEmailSending === automation.id} data-id="jvi6ei9i2" data-path="src/components/EmailAutomationManager.tsx">

                        {testEmailSending === automation.id ?
                      <RefreshCw className="w-4 h-4 animate-spin" data-id="p5imc2wmx" data-path="src/components/EmailAutomationManager.tsx" /> :

                      <Send className="w-4 h-4" data-id="lry5ul38d" data-path="src/components/EmailAutomationManager.tsx" />
                      }
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4" data-id="n5pxkz2no" data-path="src/components/EmailAutomationManager.tsx">
          <Card data-id="j0f8l32cg" data-path="src/components/EmailAutomationManager.tsx">
            <CardHeader data-id="fjbcmlrvq" data-path="src/components/EmailAutomationManager.tsx">
              <CardTitle className="flex items-center justify-between" data-id="aficmcovm" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-2" data-id="192a3sgrr" data-path="src/components/EmailAutomationManager.tsx">
                  <Settings className="w-5 h-5" data-id="lom0t865x" data-path="src/components/EmailAutomationManager.tsx" />
                  <span data-id="2y33dg7ql" data-path="src/components/EmailAutomationManager.tsx">Email Automations</span>
                </div>
                <Button data-id="mk8bapl3z" data-path="src/components/EmailAutomationManager.tsx">
                  <Plus className="w-4 h-4 mr-2" data-id="d5rj3iant" data-path="src/components/EmailAutomationManager.tsx" />
                  New Automation
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="82mxdvwb3" data-path="src/components/EmailAutomationManager.tsx">
              <div className="space-y-4" data-id="ckkveabdm" data-path="src/components/EmailAutomationManager.tsx">
                {automations.map((automation) =>
                <Card key={automation.id} className="border" data-id="jr1pxys3q" data-path="src/components/EmailAutomationManager.tsx">
                    <CardContent className="p-4" data-id="a2zahr6gv" data-path="src/components/EmailAutomationManager.tsx">
                      <div className="flex items-center justify-between" data-id="sc3epb9la" data-path="src/components/EmailAutomationManager.tsx">
                        <div className="flex items-center space-x-4" data-id="lwz0a3kza" data-path="src/components/EmailAutomationManager.tsx">
                          <div className="flex items-center space-x-3" data-id="h7jqx0hfl" data-path="src/components/EmailAutomationManager.tsx">
                            <Switch
                            checked={automation.is_active}
                            onCheckedChange={(checked) => toggleAutomation(automation.id!, checked)} data-id="tnaw58h9s" data-path="src/components/EmailAutomationManager.tsx" />

                            <div data-id="vgsyquqyz" data-path="src/components/EmailAutomationManager.tsx">
                              <h3 className="font-semibold" data-id="kmamyj2gf" data-path="src/components/EmailAutomationManager.tsx">{automation.automation_name}</h3>
                              <p className="text-sm text-gray-600" data-id="7n5bord3j" data-path="src/components/EmailAutomationManager.tsx">{automation.email_type}</p>
                            </div>
                          </div>
                          <div className="hidden md:block" data-id="9b5bviy05" data-path="src/components/EmailAutomationManager.tsx">
                            <p className="text-sm text-gray-600" data-id="f5jmnw7gg" data-path="src/components/EmailAutomationManager.tsx">
                              Trigger: {automation.trigger_condition} = {automation.trigger_value}
                            </p>
                            <p className="text-sm text-gray-600" data-id="9q2ssxjl6" data-path="src/components/EmailAutomationManager.tsx">
                              Frequency: Every {automation.frequency_hours} hours
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2" data-id="3fdmdzfhy" data-path="src/components/EmailAutomationManager.tsx">
                          <Badge className={automation.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} data-id="br7nflo71" data-path="src/components/EmailAutomationManager.tsx">
                            {automation.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button size="sm" variant="outline" data-id="3xst5432k" data-path="src/components/EmailAutomationManager.tsx">
                            <Edit className="w-4 h-4" data-id="s92dzav00" data-path="src/components/EmailAutomationManager.tsx" />
                          </Button>
                          <Button size="sm" variant="outline" data-id="71x555qfc" data-path="src/components/EmailAutomationManager.tsx">
                            <Eye className="w-4 h-4" data-id="nrdish7bi" data-path="src/components/EmailAutomationManager.tsx" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t" data-id="9jdghlk0u" data-path="src/components/EmailAutomationManager.tsx">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" data-id="gdbcxz22n" data-path="src/components/EmailAutomationManager.tsx">
                          <div data-id="7ordqzksq" data-path="src/components/EmailAutomationManager.tsx">
                            <p className="text-gray-600" data-id="arbws7lmo" data-path="src/components/EmailAutomationManager.tsx">Total Sent</p>
                            <p className="font-medium" data-id="ht0klevnj" data-path="src/components/EmailAutomationManager.tsx">{automation.total_sent}</p>
                          </div>
                          <div data-id="toi9udg7k" data-path="src/components/EmailAutomationManager.tsx">
                            <p className="text-gray-600" data-id="87t23wi4n" data-path="src/components/EmailAutomationManager.tsx">Success Rate</p>
                            <p className="font-medium" data-id="piprzgubf" data-path="src/components/EmailAutomationManager.tsx">{automation.success_rate}%</p>
                          </div>
                          <div data-id="fl9ylz75f" data-path="src/components/EmailAutomationManager.tsx">
                            <p className="text-gray-600" data-id="5jhzetice" data-path="src/components/EmailAutomationManager.tsx">Last Run</p>
                            <p className="font-medium" data-id="64qvjqhqn" data-path="src/components/EmailAutomationManager.tsx">{formatTimeAgo(automation.last_run || '')}</p>
                          </div>
                          <div data-id="vh9bhc6hz" data-path="src/components/EmailAutomationManager.tsx">
                            <p className="text-gray-600" data-id="swu4nz991" data-path="src/components/EmailAutomationManager.tsx">Next Run</p>
                            <p className="font-medium" data-id="gosdo1zv6" data-path="src/components/EmailAutomationManager.tsx">{formatTimeUntil(automation.next_run || '')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4" data-id="pp6okwzrt" data-path="src/components/EmailAutomationManager.tsx">
          <Card data-id="58htwowjk" data-path="src/components/EmailAutomationManager.tsx">
            <CardHeader data-id="v4kt1iihk" data-path="src/components/EmailAutomationManager.tsx">
              <CardTitle className="flex items-center justify-between" data-id="uzkb2vpt8" data-path="src/components/EmailAutomationManager.tsx">
                <div className="flex items-center space-x-2" data-id="b4vvg2t3x" data-path="src/components/EmailAutomationManager.tsx">
                  <Mail className="w-5 h-5" data-id="jifadgx84" data-path="src/components/EmailAutomationManager.tsx" />
                  <span data-id="5wlojudf8" data-path="src/components/EmailAutomationManager.tsx">Email Templates</span>
                </div>
                <Button data-id="qdnzz29ct" data-path="src/components/EmailAutomationManager.tsx">
                  <Plus className="w-4 h-4 mr-2" data-id="270wu4q5n" data-path="src/components/EmailAutomationManager.tsx" />
                  New Template
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent data-id="54htleiw9" data-path="src/components/EmailAutomationManager.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="rf6ps3sw0" data-path="src/components/EmailAutomationManager.tsx">
                {templates.map((template) =>
                <Card key={template.id} className="border" data-id="q4he7e7rd" data-path="src/components/EmailAutomationManager.tsx">
                    <CardHeader className="pb-3" data-id="h1i0z14zb" data-path="src/components/EmailAutomationManager.tsx">
                      <div className="flex items-center justify-between" data-id="g9rkdc6mf" data-path="src/components/EmailAutomationManager.tsx">
                        <CardTitle className="text-lg" data-id="rm1mzhyln" data-path="src/components/EmailAutomationManager.tsx">{template.template_name}</CardTitle>
                        <Badge className={template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} data-id="8vqu35udu" data-path="src/components/EmailAutomationManager.tsx">
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent data-id="a5g1blhut" data-path="src/components/EmailAutomationManager.tsx">
                      <div className="space-y-3" data-id="mdb94nz4p" data-path="src/components/EmailAutomationManager.tsx">
                        <div data-id="whztupchc" data-path="src/components/EmailAutomationManager.tsx">
                          <p className="text-sm text-gray-600" data-id="k7ywor03p" data-path="src/components/EmailAutomationManager.tsx">Type</p>
                          <p className="font-medium" data-id="o4ygby4as" data-path="src/components/EmailAutomationManager.tsx">{template.template_type}</p>
                        </div>
                        <div data-id="ssdgh8qjl" data-path="src/components/EmailAutomationManager.tsx">
                          <p className="text-sm text-gray-600" data-id="7dcr52uor" data-path="src/components/EmailAutomationManager.tsx">Subject</p>
                          <p className="font-medium text-sm" data-id="34km4xvc7" data-path="src/components/EmailAutomationManager.tsx">{template.subject}</p>
                        </div>
                        <div data-id="jt1levv79" data-path="src/components/EmailAutomationManager.tsx">
                          <p className="text-sm text-gray-600" data-id="rm1fhn72q" data-path="src/components/EmailAutomationManager.tsx">Variables</p>
                          <div className="flex flex-wrap gap-1 mt-1" data-id="oosgcmhkk" data-path="src/components/EmailAutomationManager.tsx">
                            {template.variables.split(',').map((variable, index) =>
                          <Badge key={index} variant="outline" className="text-xs" data-id="5oq8idzq6" data-path="src/components/EmailAutomationManager.tsx">
                                {variable.trim()}
                              </Badge>
                          )}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2" data-id="rxlecuj07" data-path="src/components/EmailAutomationManager.tsx">
                          <Button size="sm" variant="outline" className="flex-1" data-id="5d715mc8o" data-path="src/components/EmailAutomationManager.tsx">
                            <Edit className="w-4 h-4 mr-1" data-id="f6lmhnxqf" data-path="src/components/EmailAutomationManager.tsx" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" data-id="o5fnggxb5" data-path="src/components/EmailAutomationManager.tsx">
                            <Eye className="w-4 h-4 mr-1" data-id="r75xvh0ww" data-path="src/components/EmailAutomationManager.tsx" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="4bhhywa2i" data-path="src/components/EmailAutomationManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="sgi5kaps3" data-path="src/components/EmailAutomationManager.tsx">
            <Card data-id="1mi9hv9zv" data-path="src/components/EmailAutomationManager.tsx">
              <CardHeader data-id="86hgib4sb" data-path="src/components/EmailAutomationManager.tsx">
                <CardTitle data-id="f4u21nrhx" data-path="src/components/EmailAutomationManager.tsx">Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent data-id="z6y19ipte" data-path="src/components/EmailAutomationManager.tsx">
                <div className="space-y-4" data-id="ahj3th1zl" data-path="src/components/EmailAutomationManager.tsx">
                  <div data-id="wtte5xi12" data-path="src/components/EmailAutomationManager.tsx">
                    <div className="flex justify-between text-sm mb-1" data-id="m4iuy7xo9" data-path="src/components/EmailAutomationManager.tsx">
                      <span data-id="pxi02zqfh" data-path="src/components/EmailAutomationManager.tsx">Delivery Rate</span>
                      <span data-id="3f457inim" data-path="src/components/EmailAutomationManager.tsx">{stats.deliveryRate}%</span>
                    </div>
                    <Progress value={stats.deliveryRate} className="h-2" data-id="h94zi8fxl" data-path="src/components/EmailAutomationManager.tsx" />
                  </div>
                  <div data-id="3csxh1usj" data-path="src/components/EmailAutomationManager.tsx">
                    <div className="flex justify-between text-sm mb-1" data-id="k9mf3wdxq" data-path="src/components/EmailAutomationManager.tsx">
                      <span data-id="orjk8kcjp" data-path="src/components/EmailAutomationManager.tsx">Open Rate</span>
                      <span data-id="ee3krx1e2" data-path="src/components/EmailAutomationManager.tsx">{stats.openRate}%</span>
                    </div>
                    <Progress value={stats.openRate} className="h-2" data-id="9lc1wejzx" data-path="src/components/EmailAutomationManager.tsx" />
                  </div>
                  <div data-id="11v7s3fjd" data-path="src/components/EmailAutomationManager.tsx">
                    <div className="flex justify-between text-sm mb-1" data-id="verh6v55m" data-path="src/components/EmailAutomationManager.tsx">
                      <span data-id="2757gff88" data-path="src/components/EmailAutomationManager.tsx">Success Rate</span>
                      <span data-id="iewau8fw2" data-path="src/components/EmailAutomationManager.tsx">{stats.successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.successRate} className="h-2" data-id="hest7d081" data-path="src/components/EmailAutomationManager.tsx" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="ilgva1ga6" data-path="src/components/EmailAutomationManager.tsx">
              <CardHeader data-id="8su5ojley" data-path="src/components/EmailAutomationManager.tsx">
                <CardTitle data-id="vj9h47y2y" data-path="src/components/EmailAutomationManager.tsx">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent data-id="ave8tvg1a" data-path="src/components/EmailAutomationManager.tsx">
                <div className="space-y-3" data-id="zfpa74ijv" data-path="src/components/EmailAutomationManager.tsx">
                  {automations.slice(0, 5).map((automation) =>
                  <div key={automation.id} className="flex items-center justify-between" data-id="j3y7u2ihm" data-path="src/components/EmailAutomationManager.tsx">
                      <div data-id="ppqgqccc6" data-path="src/components/EmailAutomationManager.tsx">
                        <p className="font-medium text-sm" data-id="015jiwgzt" data-path="src/components/EmailAutomationManager.tsx">{automation.automation_name}</p>
                        <p className="text-xs text-gray-600" data-id="xb5134uz5" data-path="src/components/EmailAutomationManager.tsx">
                          {formatTimeAgo(automation.last_run || '')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800" data-id="c9j9jucf3" data-path="src/components/EmailAutomationManager.tsx">
                        Sent
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export default EmailAutomationManager;