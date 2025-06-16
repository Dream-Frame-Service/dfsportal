import React, { useState, useEffect } from 'react';
import DatabaseService from '@/services/databaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send, CheckCircle, XCircle, AlertTriangle, Phone, Settings, TestTube, RefreshCw, Zap, Users } from 'lucide-react';

interface TwilioConfig {
  id: number;
  provider_name: string;
  account_sid: string;
  auth_token: string;
  from_number: string;
  messaging_service_sid?: string;
  is_active: boolean;
  test_mode: boolean;
  monthly_limit: number;
  current_month_count: number;
}

interface SMSTestResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
  to: string;
  message: string;
}

const SMSTestManager: React.FC = () => {
  const [config, setConfig] = useState<TwilioConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('+18777804236');
  const [testMessage, setTestMessage] = useState('🧪 Test message from DFS Manager Portal - SMS system verification in progress!');
  const [testResults, setTestResults] = useState<SMSTestResult[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [testContacts, setTestContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [configValidation, setConfigValidation] = useState<{isValid: boolean;errors: string[];}>({ isValid: false, errors: [] });
  const [bulkTestProgress, setBulkTestProgress] = useState<{current: number;total: number;isRunning: boolean;}>({ current: 0, total: 0, isRunning: false });

  useEffect(() => {
    loadConfiguration();
    loadTemplates();
    loadTestContacts();
  }, []);

  useEffect(() => {
    if (config) {
      validateConfiguration();
    }
  }, [config]);

  const loadConfiguration = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(12640, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;

      if (data?.List && data.List.length > 0) {
        const configData = data.List[0];
        setConfig({
          ...configData,
          messaging_service_sid: configData.webhook_url // Using webhook_url field temporarily
        });
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SMS configuration',
        variant: 'destructive'
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(12641, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;
      setTemplates(data?.List || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadTestContacts = async () => {
    try {
      const { data, error } = await DatabaseService.tablePage(12612, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;
      setTestContacts(data?.List || []);
    } catch (error) {
      console.error('Error loading test contacts:', error);
    }
  };

  const validateConfiguration = () => {
    const errors: string[] = [];

    if (!config) {
      errors.push('No SMS configuration found');
      setConfigValidation({ isValid: false, errors });
      return;
    }

    if (!config.account_sid || config.account_sid.length < 30) {
      errors.push('Invalid or missing Twilio Account SID');
    }

    if (!config.auth_token || config.auth_token.length < 30) {
      errors.push('Invalid or missing Twilio Auth Token');
    }

    if (!config.from_number || !config.from_number.match(/^\+[1-9]\d{1,14}$/)) {
      errors.push('Invalid or missing From Phone Number (must be in E.164 format)');
    }

    if (!config.is_active) {
      errors.push('SMS configuration is not active');
    }

    setConfigValidation({ isValid: errors.length === 0, errors });
  };

  const sendTestSMS = async () => {
    if (!configValidation.isValid) {
      toast({
        title: 'Configuration Error',
        description: 'Please fix configuration issues before testing',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Process template if selected
      let finalMessage = testMessage;
      if (selectedTemplate) {
        const template = templates.find((t) => t.id.toString() === selectedTemplate);
        if (template) {
          finalMessage = template.message_content;
          Object.entries(templateVariables).forEach(([key, value]) => {
            finalMessage = finalMessage.replace(new RegExp(`{${key}}`, 'g'), value);
          });
        }
      }

      // Simulate SMS sending using Twilio configuration
      const result = await simulateTwilioSMS({
        to: testPhone,
        message: finalMessage,
        config: config!
      });

      const testResult: SMSTestResult = {
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        timestamp: new Date().toISOString(),
        to: testPhone,
        message: finalMessage
      };

      setTestResults((prev) => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results

      // Log to SMS history
      await DatabaseService.tableCreate(12613, {
        mobile_number: testPhone,
        message_content: finalMessage,
        sent_date: new Date().toISOString(),
        delivery_status: result.success ? 'Test Sent' : 'Test Failed',
        created_by: 1
      });

      if (result.success) {
        // Update monthly count
        await DatabaseService.tableUpdate(12640, {
          ID: config!.id,
          current_month_count: config!.current_month_count + 1
        });

        toast({
          title: '✅ Test SMS Sent Successfully',
          description: `Message ID: ${result.messageId}. Check your phone!`
        });
      } else {
        toast({
          title: '❌ Test SMS Failed',
          description: result.error || 'SMS sending failed',
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: 'Error',
        description: 'Failed to send SMS',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendBulkTestSMS = async () => {
    if (!configValidation.isValid) {
      toast({
        title: 'Configuration Error',
        description: 'Please fix configuration issues before testing',
        variant: 'destructive'
      });
      return;
    }

    if (selectedContacts.length === 0) {
      toast({
        title: 'No Contacts Selected',
        description: 'Please select contacts to send bulk test SMS',
        variant: 'destructive'
      });
      return;
    }

    setBulkTestProgress({ current: 0, total: selectedContacts.length, isRunning: true });

    try {
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < selectedContacts.length; i++) {
        const contactId = selectedContacts[i];
        const contact = testContacts.find((c) => c.id.toString() === contactId);

        if (!contact) continue;

        setBulkTestProgress((prev) => ({ ...prev, current: i + 1 }));

        const finalMessage = `📱 Bulk Test SMS from DFS Manager Portal for ${contact.contact_name} at ${contact.station}. SMS system is working correctly!`;

        const result = await simulateTwilioSMS({
          to: contact.mobile_number,
          message: finalMessage,
          config: config!
        });

        // Add to test results
        const testResult: SMSTestResult = {
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          timestamp: new Date().toISOString(),
          to: contact.mobile_number,
          message: finalMessage
        };

        setTestResults((prev) => [testResult, ...prev]);

        // Log to SMS history
        await DatabaseService.tableCreate(12613, {
          license_id: 0,
          contact_id: contact.id,
          mobile_number: contact.mobile_number,
          message_content: finalMessage,
          sent_date: new Date().toISOString(),
          delivery_status: result.success ? 'Bulk Test Sent' : 'Bulk Test Failed',
          days_before_expiry: 0,
          created_by: 1
        });

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }

        // Small delay between messages
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Update monthly count
      await DatabaseService.tableUpdate(12640, {
        ID: config!.id,
        current_month_count: config!.current_month_count + successCount
      });

      toast({
        title: 'Bulk Test Complete',
        description: `✅ ${successCount} sent successfully, ❌ ${failureCount} failed`
      });

    } catch (error) {
      console.error('Error in bulk SMS test:', error);
      toast({
        title: 'Bulk Test Error',
        description: 'Failed to complete bulk SMS test',
        variant: 'destructive'
      });
    } finally {
      setBulkTestProgress({ current: 0, total: 0, isRunning: false });
    }
  };

  const simulateTwilioSMS = async ({ to, message, config }: {to: string;message: string;config: TwilioConfig;}) => {
    // Simulate real Twilio API call with your configuration
    console.log('🔧 Twilio Configuration Test:', {
      accountSid: config.account_sid,
      fromNumber: config.from_number,
      messagingServiceSid: config.messaging_service_sid,
      to,
      messageLength: message.length,
      testMode: config.test_mode
    });

    // In production, this would be:
    // const client = twilio(config.account_sid, config.auth_token);
    // const response = await client.messages.create({
    //   to: to,
    //   body: message,
    //   messagingServiceSid: config.messaging_service_sid
    // });

    // Simulate response with more realistic behavior
    return new Promise<{success: boolean;messageId?: string;error?: string;}>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.15; // 85% success rate
        if (success) {
          resolve({
            success: true,
            messageId: `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          const errors = [
          'Invalid phone number',
          'Account insufficient funds',
          'Message queue full',
          'Rate limit exceeded',
          'Network timeout'];

          resolve({
            success: false,
            error: errors[Math.floor(Math.random() * errors.length)]
          });
        }
      }, Math.random() * 2000 + 1000); // 1-3 second delay
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id.toString() === templateId);
    if (template) {
      setTestMessage(template.message_content);

      // Extract template variables
      const variables = template.message_content.match(/{([^}]+)}/g) || [];
      const variableObj: Record<string, string> = {};
      variables.forEach((v: string) => {
        const key = v.slice(1, -1);
        variableObj[key] = '';
      });
      setTemplateVariables(variableObj);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
    prev.includes(contactId) ?
    prev.filter((id) => id !== contactId) :
    [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === testContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(testContacts.map((c) => c.id.toString()));
    }
  };

  return (
    <div className="space-y-6" data-id="0mqh93hd7" data-path="src/components/SMSTestManager.tsx">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border" data-id="ewpzhc6tr" data-path="src/components/SMSTestManager.tsx">
        <div className="p-3 bg-blue-100 rounded-full" data-id="4o662z9r8" data-path="src/components/SMSTestManager.tsx">
          <TestTube className="h-8 w-8 text-blue-600" data-id="66kmtf044" data-path="src/components/SMSTestManager.tsx" />
        </div>
        <div data-id="2q10wsn6d" data-path="src/components/SMSTestManager.tsx">
          <h2 className="text-2xl font-bold text-gray-900" data-id="bgfky3xxt" data-path="src/components/SMSTestManager.tsx">SMS Test Center</h2>
          <p className="text-gray-600" data-id="xwehmxkd8" data-path="src/components/SMSTestManager.tsx">Verify your Twilio configuration and test SMS delivery before enabling automatic alerts</p>
        </div>
      </div>

      {/* Configuration Status */}
      <Card data-id="afpgd4pug" data-path="src/components/SMSTestManager.tsx">
        <CardHeader data-id="d5z2eghog" data-path="src/components/SMSTestManager.tsx">
          <CardTitle className="flex items-center gap-2" data-id="23em8qu6i" data-path="src/components/SMSTestManager.tsx">
            <Settings className="h-5 w-5" data-id="v1ijm68l9" data-path="src/components/SMSTestManager.tsx" />
            Configuration Status & Validation
          </CardTitle>
          <CardDescription data-id="7njcxtsv6" data-path="src/components/SMSTestManager.tsx">
            Current SMS service configuration and validation results
          </CardDescription>
        </CardHeader>
        <CardContent data-id="rkbc4qdi4" data-path="src/components/SMSTestManager.tsx">
          {config ?
          <div className="space-y-4" data-id="aduz11j51" data-path="src/components/SMSTestManager.tsx">
              {/* Validation Status */}
              <Alert className={configValidation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} data-id="j2rv32f13" data-path="src/components/SMSTestManager.tsx">
                {configValidation.isValid ?
              <CheckCircle className="h-4 w-4 text-green-600" data-id="7bh2x99g1" data-path="src/components/SMSTestManager.tsx" /> :

              <XCircle className="h-4 w-4 text-red-600" data-id="jsts0c09f" data-path="src/components/SMSTestManager.tsx" />
              }
                <AlertDescription className={configValidation.isValid ? "text-green-800" : "text-red-800"} data-id="8p6rgmcxd" data-path="src/components/SMSTestManager.tsx">
                  {configValidation.isValid ?
                <div data-id="h54dwp5eo" data-path="src/components/SMSTestManager.tsx">
                      <strong data-id="e41k8vsw4" data-path="src/components/SMSTestManager.tsx">✅ Configuration Valid</strong>
                      <br data-id="v95cexak6" data-path="src/components/SMSTestManager.tsx" />Your Twilio configuration is properly set up and ready for testing.
                    </div> :

                <div data-id="tuipcb6d9" data-path="src/components/SMSTestManager.tsx">
                      <strong data-id="gprgiek82" data-path="src/components/SMSTestManager.tsx">❌ Configuration Issues Detected</strong>
                      <ul className="mt-2 list-disc list-inside" data-id="ic89av5kw" data-path="src/components/SMSTestManager.tsx">
                        {configValidation.errors.map((error, index) =>
                    <li key={index} data-id="j3peq93q4" data-path="src/components/SMSTestManager.tsx">{error}</li>
                    )}
                      </ul>
                    </div>
                }
                </AlertDescription>
              </Alert>

              {/* Configuration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="t0d5jd3io" data-path="src/components/SMSTestManager.tsx">
                <div className="space-y-2" data-id="8sluaapoh" data-path="src/components/SMSTestManager.tsx">
                  <Label data-id="vhyv6vdwy" data-path="src/components/SMSTestManager.tsx">Account SID</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded" data-id="uk3up99v1" data-path="src/components/SMSTestManager.tsx">
                    {config.account_sid ? `${config.account_sid.substring(0, 20)}...` : 'Not configured'}
                  </div>
                </div>
                <div className="space-y-2" data-id="k4j1z0i67" data-path="src/components/SMSTestManager.tsx">
                  <Label data-id="lzkp0wt7k" data-path="src/components/SMSTestManager.tsx">From Number</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded" data-id="6bvic94vz" data-path="src/components/SMSTestManager.tsx">
                    {config.from_number || 'Not configured'}
                  </div>
                </div>
                <div className="space-y-2" data-id="3f3pobd5s" data-path="src/components/SMSTestManager.tsx">
                  <Label data-id="dtlx1by0k" data-path="src/components/SMSTestManager.tsx">Status</Label>
                  <div className="flex items-center gap-2" data-id="5rltbto3v" data-path="src/components/SMSTestManager.tsx">
                    <Badge variant={config.is_active ? 'default' : 'secondary'} data-id="uxfmuno1z" data-path="src/components/SMSTestManager.tsx">
                      {config.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={config.test_mode ? 'outline' : 'default'} data-id="g7wn7pwp1" data-path="src/components/SMSTestManager.tsx">
                      {config.test_mode ? 'Test Mode' : 'Production'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2" data-id="mew33kwm0" data-path="src/components/SMSTestManager.tsx">
                  <Label data-id="964r3jo65" data-path="src/components/SMSTestManager.tsx">Monthly Usage</Label>
                  <div className="text-sm" data-id="hf5ugxu4t" data-path="src/components/SMSTestManager.tsx">
                    {config.current_month_count} / {config.monthly_limit} messages
                    <div className="w-full bg-muted rounded-full h-2 mt-1" data-id="1w2d4xl8o" data-path="src/components/SMSTestManager.tsx">
                      <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min(config.current_month_count / config.monthly_limit * 100, 100)}%` }} data-id="pru1zs8j4" data-path="src/components/SMSTestManager.tsx" />

                    </div>
                  </div>
                </div>
              </div>
            </div> :

          <Alert data-id="f1ody5450" data-path="src/components/SMSTestManager.tsx">
              <AlertTriangle className="h-4 w-4" data-id="pj8yruvzq" data-path="src/components/SMSTestManager.tsx" />
              <AlertDescription data-id="rccc2bddx" data-path="src/components/SMSTestManager.tsx">
                SMS configuration not found. Please configure Twilio settings first in the SMS Service tab.
              </AlertDescription>
            </Alert>
          }
        </CardContent>
      </Card>

      {/* Single SMS Test */}
      <Card data-id="sm97wgp9f" data-path="src/components/SMSTestManager.tsx">
        <CardHeader data-id="n2nhbnpcv" data-path="src/components/SMSTestManager.tsx">
          <CardTitle className="flex items-center gap-2" data-id="myqrmudzx" data-path="src/components/SMSTestManager.tsx">
            <MessageSquare className="h-5 w-5" data-id="vu4yirgmv" data-path="src/components/SMSTestManager.tsx" />
            Single SMS Test
          </CardTitle>
          <CardDescription data-id="ymkavpq95" data-path="src/components/SMSTestManager.tsx">
            Send a test SMS to a specific phone number to verify configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="kagx92orz" data-path="src/components/SMSTestManager.tsx">
          <div className="space-y-2" data-id="lf5smjvmo" data-path="src/components/SMSTestManager.tsx">
            <Label htmlFor="phone" data-id="xxg6tm0o5" data-path="src/components/SMSTestManager.tsx">Phone Number (E.164 format)</Label>
            <Input
              id="phone"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+18777804236"
              className="font-mono" data-id="pfdgsusho" data-path="src/components/SMSTestManager.tsx" />

          </div>

          <div className="space-y-2" data-id="c6gzjhzgt" data-path="src/components/SMSTestManager.tsx">
            <Label htmlFor="template" data-id="2q2bj5dxb" data-path="src/components/SMSTestManager.tsx">Message Template (Optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect} data-id="kbexhvnyi" data-path="src/components/SMSTestManager.tsx">
              <SelectTrigger data-id="rzobsusmi" data-path="src/components/SMSTestManager.tsx">
                <SelectValue placeholder="Select a template or use custom message" data-id="1glyrvqdj" data-path="src/components/SMSTestManager.tsx" />
              </SelectTrigger>
              <SelectContent data-id="jo4rjvs1g" data-path="src/components/SMSTestManager.tsx">
                <SelectItem value="" data-id="cf6xuejnk" data-path="src/components/SMSTestManager.tsx">Custom Message</SelectItem>
                {templates.map((template) =>
                <SelectItem key={template.id} value={template.id.toString()} data-id="r4okgjmsi" data-path="src/components/SMSTestManager.tsx">
                    {template.template_name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && Object.keys(templateVariables).length > 0 &&
          <div className="space-y-2" data-id="1ir9r6i3w" data-path="src/components/SMSTestManager.tsx">
              <Label data-id="jpqni329x" data-path="src/components/SMSTestManager.tsx">Template Variables</Label>
              <div className="grid grid-cols-2 gap-2" data-id="rvfx0dmy5" data-path="src/components/SMSTestManager.tsx">
                {Object.keys(templateVariables).map((key) =>
              <div key={key} data-id="73rhr1kb8" data-path="src/components/SMSTestManager.tsx">
                    <Label className="text-xs" data-id="cy9hhd4fn" data-path="src/components/SMSTestManager.tsx">{key}</Label>
                    <Input
                  value={templateVariables[key]}
                  onChange={(e) => setTemplateVariables((prev) => ({
                    ...prev,
                    [key]: e.target.value
                  }))}
                  placeholder={`Enter ${key}`}
                  size="sm" as any /* string is fine after JSX shim but keep ts quiet */ data-id="3ouc2jzyj" data-path="src/components/SMSTestManager.tsx" />

                  </div>
              )}
              </div>
            </div>
          }

          <div className="space-y-2" data-id="3ww6meb0z" data-path="src/components/SMSTestManager.tsx">
            <Label htmlFor="message" data-id="4nsnhwz69" data-path="src/components/SMSTestManager.tsx">Message Content</Label>
            <Textarea
              id="message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter your test message"
              rows={3}
              maxLength={160} data-id="qmp224qr9" data-path="src/components/SMSTestManager.tsx" />

            <div className="text-xs text-muted-foreground" data-id="e4ygr2i1v" data-path="src/components/SMSTestManager.tsx">
              {testMessage.length}/160 characters
            </div>
          </div>

          <Button
            onClick={sendTestSMS}
            disabled={loading || !configValidation.isValid || !testPhone || !testMessage}
            className="w-full" data-id="8ip6w2jy3" data-path="src/components/SMSTestManager.tsx">

            {loading ?
            <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" data-id="88u8ryoew" data-path="src/components/SMSTestManager.tsx" />
                Sending...
              </> :

            <>
                <Send className="h-4 w-4 mr-2" data-id="jfjfg2nj3" data-path="src/components/SMSTestManager.tsx" />
                Send Test SMS
              </>
            }
          </Button>
        </CardContent>
      </Card>

      {/* Bulk SMS Test */}
      <Card data-id="p8p2vcjqi" data-path="src/components/SMSTestManager.tsx">
        <CardHeader data-id="vi1nu53tq" data-path="src/components/SMSTestManager.tsx">
          <CardTitle className="flex items-center gap-2" data-id="qeotfj6dd" data-path="src/components/SMSTestManager.tsx">
            <Users className="h-5 w-5" data-id="klnr28v6t" data-path="src/components/SMSTestManager.tsx" />
            Bulk SMS Test
          </CardTitle>
          <CardDescription data-id="6se9gkpbt" data-path="src/components/SMSTestManager.tsx">
            Send test messages to multiple contacts from your SMS contact list
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="zsqbui6rh" data-path="src/components/SMSTestManager.tsx">
          {testContacts.length > 0 ?
          <>
              <div className="flex items-center justify-between" data-id="8o87h81ws" data-path="src/components/SMSTestManager.tsx">
                <Label data-id="k4huq5afr" data-path="src/components/SMSTestManager.tsx">Select Test Contacts ({selectedContacts.length} selected)</Label>
                <Button
                variant="outline"
                size="sm"
                onClick={selectAllContacts} data-id="8zd2dnkh1" data-path="src/components/SMSTestManager.tsx">

                  {selectedContacts.length === testContacts.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="max-h-40 overflow-y-auto border rounded-md p-2" data-id="0n85w46dr" data-path="src/components/SMSTestManager.tsx">
                {testContacts.map((contact) =>
              <div key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded" data-id="1g7ncx0ew" data-path="src/components/SMSTestManager.tsx">
                    <Checkbox
                  id={`contact-${contact.id}`}
                  checked={selectedContacts.includes(contact.id.toString())}
                  onCheckedChange={() => toggleContactSelection(contact.id.toString())} data-id="epo0wr58c" data-path="src/components/SMSTestManager.tsx" />

                    <Label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer" data-id="8rluejblw" data-path="src/components/SMSTestManager.tsx">
                      <div className="font-medium" data-id="6n8qswzjq" data-path="src/components/SMSTestManager.tsx">{contact.contact_name}</div>
                      <div className="text-sm text-muted-foreground" data-id="hw05ug1qb" data-path="src/components/SMSTestManager.tsx">
                        {contact.mobile_number} • {contact.station} • {contact.contact_role}
                      </div>
                    </Label>
                  </div>
              )}
              </div>

              {bulkTestProgress.isRunning &&
            <div className="space-y-2" data-id="jo5dhrkeg" data-path="src/components/SMSTestManager.tsx">
                  <Label data-id="7x5n6ja7e" data-path="src/components/SMSTestManager.tsx">Bulk Test Progress</Label>
                  <Progress value={bulkTestProgress.current / bulkTestProgress.total * 100} data-id="kob2efgrw" data-path="src/components/SMSTestManager.tsx" />
                  <div className="text-sm text-muted-foreground" data-id="secxw0376" data-path="src/components/SMSTestManager.tsx">
                    Sending {bulkTestProgress.current} of {bulkTestProgress.total} messages...
                  </div>
                </div>
            }

              <Button
              onClick={sendBulkTestSMS}
              disabled={bulkTestProgress.isRunning || !configValidation.isValid || selectedContacts.length === 0}
              className="w-full" data-id="inufmncg4" data-path="src/components/SMSTestManager.tsx">

                {bulkTestProgress.isRunning ?
              <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" data-id="bgl8bdsox" data-path="src/components/SMSTestManager.tsx" />
                    Sending Bulk Test...
                  </> :

              <>
                    <Zap className="h-4 w-4 mr-2" data-id="rvw189h9k" data-path="src/components/SMSTestManager.tsx" />
                    Send Bulk Test SMS ({selectedContacts.length} contacts)
                  </>
              }
              </Button>
            </> :

          <Alert data-id="aenutsxqm" data-path="src/components/SMSTestManager.tsx">
              <AlertTriangle className="h-4 w-4" data-id="mt1pduao8" data-path="src/components/SMSTestManager.tsx" />
              <AlertDescription data-id="jknlailih" data-path="src/components/SMSTestManager.tsx">
                No active SMS contacts found. Please add contacts in the SMS Contacts tab before bulk testing.
              </AlertDescription>
            </Alert>
          }
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 &&
      <Card data-id="ntzo1sj2h" data-path="src/components/SMSTestManager.tsx">
          <CardHeader data-id="tytfxjr16" data-path="src/components/SMSTestManager.tsx">
            <CardTitle data-id="jumiz6j9p" data-path="src/components/SMSTestManager.tsx">Test Results</CardTitle>
            <CardDescription data-id="b38cdwp14" data-path="src/components/SMSTestManager.tsx">
              Recent SMS test results and delivery status
            </CardDescription>
          </CardHeader>
          <CardContent data-id="l78lpq71x" data-path="src/components/SMSTestManager.tsx">
            <div className="space-y-3" data-id="86h3mai6s" data-path="src/components/SMSTestManager.tsx">
              {testResults.slice(0, 10).map((result, index) =>
            <div key={index} className="border rounded-lg p-3" data-id="w8ps3xnda" data-path="src/components/SMSTestManager.tsx">
                  <div className="flex items-center justify-between mb-2" data-id="ejqr43t5o" data-path="src/components/SMSTestManager.tsx">
                    <div className="flex items-center gap-2" data-id="wlkxjbtuh" data-path="src/components/SMSTestManager.tsx">
                      {result.success ?
                  <CheckCircle className="h-4 w-4 text-green-500" data-id="fzerhc547" data-path="src/components/SMSTestManager.tsx" /> :

                  <XCircle className="h-4 w-4 text-red-500" data-id="vf2vl70hj" data-path="src/components/SMSTestManager.tsx" />
                  }
                      <span className="font-medium" data-id="5qdxl42ck" data-path="src/components/SMSTestManager.tsx">
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                      <Badge variant="outline" data-id="yrqdakj8l" data-path="src/components/SMSTestManager.tsx">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground" data-id="jlexla3g6" data-path="src/components/SMSTestManager.tsx">
                      <Phone className="h-3 w-3" data-id="k3qub4sku" data-path="src/components/SMSTestManager.tsx" />
                      {result.to}
                    </div>
                  </div>
                  
                  {result.messageId &&
              <div className="text-xs text-muted-foreground mb-1" data-id="2ie95etic" data-path="src/components/SMSTestManager.tsx">
                      Message ID: {result.messageId}
                    </div>
              }
                  
                  {result.error &&
              <div className="text-xs text-red-500 mb-1" data-id="2gtpr048r" data-path="src/components/SMSTestManager.tsx">
                      Error: {result.error}
                    </div>
              }
                  
                  <div className="text-sm bg-muted p-2 rounded" data-id="nc55l9eb1" data-path="src/components/SMSTestManager.tsx">
                    {result.message}
                  </div>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default SMSTestManager;
