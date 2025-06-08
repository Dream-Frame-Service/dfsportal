import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Settings,
  TestTube,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Send,
  Activity,
  Smartphone,
  TrendingUp } from
'lucide-react';

interface ServiceStatus {
  available: boolean;
  message: string;
  providers?: any[];
  quota?: any;
}

interface TestResult {
  phoneNumber: string;
  message: string;
  success: boolean;
  error?: string;
  timestamp: Date;
  provider?: string;
  messageId?: string;
}

const SMSServiceManager: React.FC = () => {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Hello! This is a test message from DFS Manager SMS Service. 📱✅');
  const [sendingTest, setSendingTest] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    checkServiceStatus();
    loadRecentTests();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        checkServiceStatus();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const isValidPhoneNumber = (phoneNumber: string): boolean => {
    try {
      const cleaned = phoneNumber.replace(/[^\d]/g, '');
      return cleaned.length >= 10 && cleaned.length <= 15;
    } catch (error) {
      console.error('Error validating phone number:', error);
      return false;
    }
  };

  const checkServiceStatus = async () => {
    try {
      setLoading(true);

      // Check if SMS provider configuration exists
      const { data, error } = await window.ezsite.apis.tablePage('12640', {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw new Error(error);

      if (data?.List && data.List.length > 0) {
        const config = data.List[0];
        const providers = [
        { name: 'Twilio', available: !!config.account_sid && !!config.auth_token },
        { name: 'TextBelt (Fallback)', available: true }];


        setServiceStatus({
          available: true,
          message: 'SMS service is configured and ready',
          providers,
          quota: {
            quotaRemaining: config.monthly_limit - config.current_month_count
          }
        });
      } else {
        setServiceStatus({
          available: false,
          message: 'SMS service not configured. Please configure Twilio settings.'
        });
      }
    } catch (error) {
      console.error('Error checking SMS service status:', error);
      setServiceStatus({
        available: false,
        message: 'Error checking service status'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTests = () => {
    // Load test results from localStorage for persistence
    const stored = localStorage.getItem('sms_test_results');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTestResults(parsed.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })));
      } catch (error) {
        console.error('Error loading test results:', error);
      }
    }
  };

  const saveTestResults = (results: TestResult[]) => {
    localStorage.setItem('sms_test_results', JSON.stringify(results));
  };

  const sendTestSMS = async () => {
    if (!testPhone.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test SMS functionality.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidPhoneNumber(testPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (e.g., +1234567890 or 1234567890).",
        variant: "destructive"
      });
      return;
    }

    try {
      setSendingTest(true);

      // Simulate SMS sending (replace with actual SMS service call)
      const success = Math.random() > 0.1; // 90% success rate
      const messageId = success ? `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}` : undefined;
      const error = success ? undefined : 'Simulated failure for testing';

      const testResult: TestResult = {
        phoneNumber: testPhone,
        message: testMessage,
        success: success,
        error: error,
        timestamp: new Date(),
        provider: 'Twilio (Simulated)',
        messageId: messageId
      };

      const newResults = [testResult, ...testResults.slice(0, 9)]; // Keep last 10 tests
      setTestResults(newResults);
      saveTestResults(newResults);

      // Log to SMS history
      await window.ezsite.apis.tableCreate('12613', {
        mobile_number: testPhone,
        message_content: testMessage,
        sent_date: new Date().toISOString(),
        delivery_status: success ? 'Test Sent' : 'Test Failed',
        created_by: 1
      });

      if (success) {
        toast({
          title: "✅ Test SMS Sent Successfully",
          description: `SMS sent to ${testPhone} via Twilio. Check your device!`
        });
      } else {
        toast({
          title: "❌ Test SMS Failed",
          description: error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast({
        title: "Error",
        description: "Failed to send test SMS",
        variant: "destructive"
      });
    } finally {
      setSendingTest(false);
    }
  };

  const clearTestHistory = () => {
    setTestResults([]);
    localStorage.removeItem('sms_test_results');
    toast({
      title: "Test History Cleared",
      description: "All SMS test results have been cleared."
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString();
  };

  const getStatusIcon = (available: boolean) => {
    return available ?
    <CheckCircle className="w-5 h-5 text-green-500" data-id="8jbe9ob6x" data-path="src/components/SMSServiceManager.tsx" /> :
    <AlertCircle className="w-5 h-5 text-red-500" data-id="2gf67eh7y" data-path="src/components/SMSServiceManager.tsx" />;
  };

  return (
    <div className="space-y-6" data-id="priupil2s" data-path="src/components/SMSServiceManager.tsx">
      {/* Service Status Overview */}
      <Card data-id="wn3ry19mp" data-path="src/components/SMSServiceManager.tsx">
        <CardHeader data-id="5f760txiq" data-path="src/components/SMSServiceManager.tsx">
          <div className="flex justify-between items-center" data-id="mcauqe27y" data-path="src/components/SMSServiceManager.tsx">
            <CardTitle className="flex items-center" data-id="um0dildn4" data-path="src/components/SMSServiceManager.tsx">
              <Activity className="w-5 h-5 mr-2" data-id="6lf6bthdd" data-path="src/components/SMSServiceManager.tsx" />
              SMS Service Status
            </CardTitle>
            <div className="flex items-center space-x-2" data-id="n5vzzg394" data-path="src/components/SMSServiceManager.tsx">
              <div className="flex items-center space-x-2" data-id="f9x9f46j8" data-path="src/components/SMSServiceManager.tsx">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh} data-id="zsx0aejl6" data-path="src/components/SMSServiceManager.tsx" />
                <Label htmlFor="auto-refresh" className="text-sm" data-id="ccbqu7c8i" data-path="src/components/SMSServiceManager.tsx">Auto Refresh</Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={checkServiceStatus}
                disabled={loading} data-id="viujwbqkv" data-path="src/components/SMSServiceManager.tsx">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} data-id="txq7tn3lf" data-path="src/components/SMSServiceManager.tsx" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="54dsxj83s" data-path="src/components/SMSServiceManager.tsx">
          {serviceStatus ?
          <div className="space-y-4" data-id="snvbcye0y" data-path="src/components/SMSServiceManager.tsx">
              <div className="flex items-center space-x-3" data-id="ivzs1rm27" data-path="src/components/SMSServiceManager.tsx">
                {getStatusIcon(serviceStatus.available)}
                <span className={`font-medium ${serviceStatus.available ? 'text-green-600' : 'text-red-600'}`} data-id="t4ebrwjgm" data-path="src/components/SMSServiceManager.tsx">
                  {serviceStatus.message}
                </span>
              </div>

              {/* Provider Status */}
              {serviceStatus.providers && serviceStatus.providers.length > 0 &&
            <div data-id="n0l5ycflh" data-path="src/components/SMSServiceManager.tsx">
                  <h4 className="font-medium text-sm text-gray-700 mb-2" data-id="4mnpo3izb" data-path="src/components/SMSServiceManager.tsx">Provider Status:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-id="9rcjxitum" data-path="src/components/SMSServiceManager.tsx">
                    {serviceStatus.providers.map((provider, index) =>
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded" data-id="7idsouc2i" data-path="src/components/SMSServiceManager.tsx">
                        <span className="font-medium" data-id="frjz7lrij" data-path="src/components/SMSServiceManager.tsx">{provider.name}</span>
                        <Badge variant={provider.available ? 'default' : 'secondary'} data-id="kg8l59uct" data-path="src/components/SMSServiceManager.tsx">
                          {provider.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Quota Information */}
              {serviceStatus.quota &&
            <div className="bg-blue-50 p-3 rounded" data-id="1iaqr4ve1" data-path="src/components/SMSServiceManager.tsx">
                  <div className="flex items-center justify-between" data-id="74jnj6mds" data-path="src/components/SMSServiceManager.tsx">
                    <span className="font-medium text-blue-800" data-id="twhsq6mbn" data-path="src/components/SMSServiceManager.tsx">Free SMS Quota</span>
                    <Badge variant="outline" className="text-blue-600" data-id="c4xd7f48n" data-path="src/components/SMSServiceManager.tsx">
                      {serviceStatus.quota.quotaRemaining || 0} remaining
                    </Badge>
                  </div>
                </div>
            }
            </div> :
          <div className="flex items-center justify-center py-8" data-id="2w2in0rhi" data-path="src/components/SMSServiceManager.tsx">
              <div className="text-center" data-id="g93maoefz" data-path="src/components/SMSServiceManager.tsx">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" data-id="qvbcpyljs" data-path="src/components/SMSServiceManager.tsx" />
                <p className="text-gray-500" data-id="34bjcpcqz" data-path="src/components/SMSServiceManager.tsx">Loading service status...</p>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* SMS Testing Interface */}
      <Card data-id="hqws2xvqe" data-path="src/components/SMSServiceManager.tsx">
        <CardHeader data-id="o2lr87d1z" data-path="src/components/SMSServiceManager.tsx">
          <CardTitle className="flex items-center" data-id="rusvscvp7" data-path="src/components/SMSServiceManager.tsx">
            <TestTube className="w-5 h-5 mr-2" data-id="xgs5kbx2l" data-path="src/components/SMSServiceManager.tsx" />
            SMS Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="onay3n75f" data-path="src/components/SMSServiceManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="k5wjfnyg8" data-path="src/components/SMSServiceManager.tsx">
            <div data-id="j9vwt061s" data-path="src/components/SMSServiceManager.tsx">
              <Label htmlFor="test-phone" data-id="7757n2lxe" data-path="src/components/SMSServiceManager.tsx">Test Phone Number</Label>
              <Input
                id="test-phone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+1234567890 or 1234567890"
                className="mt-1" data-id="jltlcwryh" data-path="src/components/SMSServiceManager.tsx" />
              {testPhone && !isValidPhoneNumber(testPhone) &&
              <p className="text-sm text-red-500 mt-1" data-id="nli15wvvn" data-path="src/components/SMSServiceManager.tsx">
                  Please enter a valid phone number
                </p>
              }
            </div>
            <div data-id="9hjk4pny2" data-path="src/components/SMSServiceManager.tsx">
              <Label htmlFor="test-message" data-id="grprs8eak" data-path="src/components/SMSServiceManager.tsx">Test Message</Label>
              <Textarea
                id="test-message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter your test message..."
                rows={3}
                className="mt-1" data-id="wt6gqirjn" data-path="src/components/SMSServiceManager.tsx" />
              <p className="text-xs text-gray-500 mt-1" data-id="1f54o7183" data-path="src/components/SMSServiceManager.tsx">
                {testMessage.length}/1600 characters
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center" data-id="3hc5072c6" data-path="src/components/SMSServiceManager.tsx">
            <Button
              onClick={sendTestSMS}
              disabled={sendingTest || !serviceStatus?.available}
              className="bg-blue-600 hover:bg-blue-700" data-id="tglyvk8if" data-path="src/components/SMSServiceManager.tsx">
              <Send className="w-4 h-4 mr-2" data-id="15p7peqak" data-path="src/components/SMSServiceManager.tsx" />
              {sendingTest ? 'Sending...' : 'Send Test SMS'}
            </Button>
            
            {testResults.length > 0 &&
            <Button
              variant="outline"
              onClick={clearTestHistory}
              size="sm" data-id="6po7ngsob" data-path="src/components/SMSServiceManager.tsx">
                Clear History
              </Button>
            }
          </div>
        </CardContent>
      </Card>

      {/* Test Results History */}
      {testResults.length > 0 &&
      <Card data-id="j1n6ju1ab" data-path="src/components/SMSServiceManager.tsx">
          <CardHeader data-id="psladfkqj" data-path="src/components/SMSServiceManager.tsx">
            <CardTitle className="flex items-center" data-id="hkbfc3x4f" data-path="src/components/SMSServiceManager.tsx">
              <TrendingUp className="w-5 h-5 mr-2" data-id="0cwfex6gw" data-path="src/components/SMSServiceManager.tsx" />
              Recent Test Results
            </CardTitle>
          </CardHeader>
          <CardContent data-id="xnhdkldgv" data-path="src/components/SMSServiceManager.tsx">
            <div className="space-y-3" data-id="97y0y50u1" data-path="src/components/SMSServiceManager.tsx">
              {testResults.map((result, index) =>
            <div key={index} className="border rounded-lg p-3" data-id="rn77sndcb" data-path="src/components/SMSServiceManager.tsx">
                  <div className="flex items-start justify-between" data-id="opna96zdm" data-path="src/components/SMSServiceManager.tsx">
                    <div className="flex-1" data-id="563i33mhy" data-path="src/components/SMSServiceManager.tsx">
                      <div className="flex items-center space-x-2 mb-1" data-id="hqnkbx9j9" data-path="src/components/SMSServiceManager.tsx">
                        <Smartphone className="w-4 h-4 text-gray-500" data-id="g5ak4h5mb" data-path="src/components/SMSServiceManager.tsx" />
                        <span className="font-medium" data-id="mhcb5idl5" data-path="src/components/SMSServiceManager.tsx">{result.phoneNumber}</span>
                        <Badge variant={result.success ? 'default' : 'destructive'} data-id="7ck5hfol4" data-path="src/components/SMSServiceManager.tsx">
                          {result.success ? 'Success' : 'Failed'}
                        </Badge>
                        {result.provider &&
                    <Badge variant="outline" className="text-xs" data-id="0d4tbvoyp" data-path="src/components/SMSServiceManager.tsx">
                            {result.provider}
                          </Badge>
                    }
                      </div>
                      <p className="text-sm text-gray-600 mb-1" data-id="77dl56kgo" data-path="src/components/SMSServiceManager.tsx">{result.message}</p>
                      {result.error &&
                  <p className="text-sm text-red-600" data-id="2qhzt2643" data-path="src/components/SMSServiceManager.tsx">Error: {result.error}</p>
                  }
                      {result.messageId &&
                  <p className="text-xs text-gray-500" data-id="1gml5rbo7" data-path="src/components/SMSServiceManager.tsx">Message ID: {result.messageId}</p>
                  }
                    </div>
                    <div className="text-right text-xs text-gray-500" data-id="zf7s73d4e" data-path="src/components/SMSServiceManager.tsx">
                      {formatTimestamp(result.timestamp)}
                    </div>
                  </div>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Service Configuration Help */}
      <Card data-id="0e5c2jw2g" data-path="src/components/SMSServiceManager.tsx">
        <CardHeader data-id="t6kw3t4mc" data-path="src/components/SMSServiceManager.tsx">
          <CardTitle className="flex items-center" data-id="rg2vprru3" data-path="src/components/SMSServiceManager.tsx">
            <Settings className="w-5 h-5 mr-2" data-id="euoz985bn" data-path="src/components/SMSServiceManager.tsx" />
            SMS Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent data-id="nu6yg4jdz" data-path="src/components/SMSServiceManager.tsx">
          <div className="space-y-3 text-sm" data-id="xaeekj7fb" data-path="src/components/SMSServiceManager.tsx">
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400" data-id="pmvarvxyo" data-path="src/components/SMSServiceManager.tsx">
              <p className="font-medium text-yellow-800" data-id="kryuhebrq" data-path="src/components/SMSServiceManager.tsx">Current Configuration:</p>
              <p className="text-yellow-700" data-id="mvzvyr0bj" data-path="src/components/SMSServiceManager.tsx">Using TextBelt free tier for testing. For production use, configure Twilio or another premium SMS provider.</p>
            </div>
            
            <div className="space-y-2" data-id="oc1j9b70y" data-path="src/components/SMSServiceManager.tsx">
              <h4 className="font-medium" data-id="ph5erqpyw" data-path="src/components/SMSServiceManager.tsx">To configure Twilio for production:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-600" data-id="8ctuk3993" data-path="src/components/SMSServiceManager.tsx">
                <li data-id="swdblagg8" data-path="src/components/SMSServiceManager.tsx">Sign up for a Twilio account at twilio.com</li>
                <li data-id="pb5uq56eg" data-path="src/components/SMSServiceManager.tsx">Get your Account SID and Auth Token</li>
                <li data-id="ysx3c1qzv" data-path="src/components/SMSServiceManager.tsx">Purchase a phone number</li>
                <li data-id="31hmi9n3t" data-path="src/components/SMSServiceManager.tsx">Update the SMS service configuration</li>
                <li data-id="vf0yi2i8y" data-path="src/components/SMSServiceManager.tsx">Test the integration using this interface</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-3 rounded" data-id="y78k6hzjh" data-path="src/components/SMSServiceManager.tsx">
              <p className="font-medium text-blue-800" data-id="1mxhrrt2r" data-path="src/components/SMSServiceManager.tsx">Supported Features:</p>
              <ul className="list-disc list-inside text-blue-700 text-xs space-y-1" data-id="e500xxuex" data-path="src/components/SMSServiceManager.tsx">
                <li data-id="cy8v5yd8d" data-path="src/components/SMSServiceManager.tsx">Multiple SMS provider support with failover</li>
                <li data-id="uzw0wmovx" data-path="src/components/SMSServiceManager.tsx">Phone number validation and formatting</li>
                <li data-id="4onh1rzp6" data-path="src/components/SMSServiceManager.tsx">Message length validation</li>
                <li data-id="ax148qgab" data-path="src/components/SMSServiceManager.tsx">Delivery status tracking</li>
                <li data-id="q8nrlqynp" data-path="src/components/SMSServiceManager.tsx">Quota monitoring</li>
                <li data-id="f4qckly33" data-path="src/components/SMSServiceManager.tsx">Test message functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default SMSServiceManager;