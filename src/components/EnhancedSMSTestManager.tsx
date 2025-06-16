import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  TestTube,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  Phone,
  Settings,
  Bug,
  Clock,
  RefreshCw,
  AlertTriangle,
  Info } from
'lucide-react';
import { enhancedSmsService } from '@/services/enhancedSmsService';

interface TestResult {
  success: boolean;
  message: string;
  timestamp: Date;
  phoneNumber: string;
  messageId?: string;
  errorCode?: string;
  details?: any;
  deliveryStatus?: any;
}

const EnhancedSMSTestManager: React.FC = () => {
  const [testNumber, setTestNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [deliveryTracking, setDeliveryTracking] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    try {
      setConfigLoading(true);
      await enhancedSmsService.loadConfiguration();
      const status = await enhancedSmsService.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Error loading service status:', error);
      setServiceStatus({
        available: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setConfigLoading(false);
    }
  };

  const runBasicTest = async () => {
    if (!testNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);

      const result = await enhancedSmsService.testSMS(testNumber);

      const testResult: TestResult = {
        success: result.success,
        message: result.success ?
        `Test SMS sent successfully to ${testNumber}` :
        result.error || 'Unknown error',
        timestamp: new Date(),
        phoneNumber: testNumber,
        messageId: result.messageId,
        errorCode: result.errorCode,
        details: result
      };

      setTestResults((prev) => [testResult, ...prev]);

      // Track delivery status if message was sent
      if (result.success && result.messageId) {
        trackDeliveryStatus(result.messageId, testNumber);
      }

      if (result.success) {
        toast({
          title: "✅ Test SMS Sent",
          description: `Test message sent to ${testNumber}. Check your phone!`
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || 'Failed to send test SMS',
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('SMS test error:', error);
      const testResult: TestResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
        phoneNumber: testNumber
      };
      setTestResults((prev) => [testResult, ...prev]);

      toast({
        title: "❌ Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const runAdvancedTest = async () => {
    if (!testNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to test",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);

      const testData = await enhancedSmsService.testSMSWithDetails(testNumber);

      const testResult: TestResult = {
        success: testData.response.success,
        message: testData.response.success ?
        `Advanced test completed for ${testNumber}` :
        testData.response.error || 'Unknown error',
        timestamp: new Date(),
        phoneNumber: testNumber,
        messageId: testData.response.messageId,
        errorCode: testData.response.errorCode,
        details: testData,
        deliveryStatus: testData.deliveryStatus
      };

      setTestResults((prev) => [testResult, ...prev]);

      if (testData.response.success) {
        toast({
          title: "✅ Advanced Test Completed",
          description: `Comprehensive test completed for ${testNumber}`
        });
      } else {
        toast({
          title: "❌ Advanced Test Failed",
          description: testData.response.error || 'Failed to complete advanced test',
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Advanced SMS test error:', error);
      toast({
        title: "❌ Advanced Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const sendCustomMessage = async () => {
    if (!testNumber.trim() || !customMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);

      const result = await enhancedSmsService.sendSMS({
        to: testNumber,
        message: customMessage,
        type: 'custom'
      });

      const testResult: TestResult = {
        success: result.success,
        message: result.success ?
        `Custom message sent to ${testNumber}` :
        result.error || 'Unknown error',
        timestamp: new Date(),
        phoneNumber: testNumber,
        messageId: result.messageId,
        errorCode: result.errorCode,
        details: result
      };

      setTestResults((prev) => [testResult, ...prev]);

      if (result.success) {
        toast({
          title: "✅ Custom Message Sent",
          description: `Message sent to ${testNumber}`
        });
        setCustomMessage(''); // Clear after successful send
      } else {
        toast({
          title: "❌ Send Failed",
          description: result.error || 'Failed to send message',
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Custom SMS error:', error);
      toast({
        title: "❌ Send Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const trackDeliveryStatus = async (messageId: string, phoneNumber: string) => {
    try {
      // Initial status
      setDeliveryTracking((prev) => ({
        ...prev,
        [messageId]: { status: 'checking', phoneNumber }
      }));

      // Check status after a delay
      setTimeout(async () => {
        try {
          const status = await enhancedSmsService.getDeliveryStatus(messageId);
          setDeliveryTracking((prev) => ({
            ...prev,
            [messageId]: { ...status, phoneNumber }
          }));
        } catch (error) {
          console.error('Error tracking delivery:', error);
          setDeliveryTracking((prev) => ({
            ...prev,
            [messageId]: {
              status: 'error',
              phoneNumber,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }));
        }
      }, 10000); // Check after 10 seconds
    } catch (error) {
      console.error('Error setting up delivery tracking:', error);
    }
  };

  const addToTestNumbers = async () => {
    if (!testNumber.trim()) return;

    try {
      await enhancedSmsService.addTestNumber(testNumber);
      toast({
        title: "✅ Test Number Added",
        description: `${testNumber} added to verified test numbers`
      });
      await loadServiceStatus(); // Refresh status
    } catch (error) {
      toast({
        title: "❌ Failed to Add",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':return 'text-green-600';
      case 'sent':case 'queued':return 'text-blue-600';
      case 'failed':case 'undelivered':return 'text-red-600';
      default:return 'text-yellow-600';
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ?
    <CheckCircle className="h-4 w-4 text-green-600" data-id="eyp125i2h" data-path="src/components/EnhancedSMSTestManager.tsx" /> :
    <AlertCircle className="h-4 w-4 text-red-600" data-id="8kdnekdoa" data-path="src/components/EnhancedSMSTestManager.tsx" />;
  };

  return (
    <Card className="w-full" data-id="o9s1mfffz" data-path="src/components/EnhancedSMSTestManager.tsx">
      <CardHeader data-id="cfebj3fw6" data-path="src/components/EnhancedSMSTestManager.tsx">
        <CardTitle className="flex items-center justify-between" data-id="xdfs72ukw" data-path="src/components/EnhancedSMSTestManager.tsx">
          <div className="flex items-center" data-id="hrp785kvq" data-path="src/components/EnhancedSMSTestManager.tsx">
            <TestTube className="w-5 h-5 mr-2" data-id="vrv8ihras" data-path="src/components/EnhancedSMSTestManager.tsx" />
            Enhanced SMS Testing & Debugging
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadServiceStatus}
            disabled={configLoading} data-id="ojetsxc7a" data-path="src/components/EnhancedSMSTestManager.tsx">

            {configLoading ? <Loader2 className="w-4 h-4 animate-spin" data-id="mpfcslxcl" data-path="src/components/EnhancedSMSTestManager.tsx" /> : <RefreshCw className="w-4 h-4" data-id="lwdfi43v0" data-path="src/components/EnhancedSMSTestManager.tsx" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent data-id="kaqh2inw2" data-path="src/components/EnhancedSMSTestManager.tsx">
        <Tabs defaultValue="testing" className="w-full" data-id="qmidfa85x" data-path="src/components/EnhancedSMSTestManager.tsx">
          <TabsList className="grid w-full grid-cols-4" data-id="dhkro61cc" data-path="src/components/EnhancedSMSTestManager.tsx">
            <TabsTrigger value="testing" data-id="f715q29kp" data-path="src/components/EnhancedSMSTestManager.tsx">Testing</TabsTrigger>
            <TabsTrigger value="status" data-id="j214j5wp7" data-path="src/components/EnhancedSMSTestManager.tsx">Status</TabsTrigger>
            <TabsTrigger value="results" data-id="qqdazmsug" data-path="src/components/EnhancedSMSTestManager.tsx">Results</TabsTrigger>
            <TabsTrigger value="tracking" data-id="js2wera3q" data-path="src/components/EnhancedSMSTestManager.tsx">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="testing" className="space-y-4" data-id="8f0cxbmsd" data-path="src/components/EnhancedSMSTestManager.tsx">
            <div className="space-y-2" data-id="0dhc8y7lf" data-path="src/components/EnhancedSMSTestManager.tsx">
              <Label htmlFor="testNumber" data-id="ii8fedj96" data-path="src/components/EnhancedSMSTestManager.tsx">Phone Number</Label>
              <Input
                id="testNumber"
                type="tel"
                placeholder="+1234567890"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)} data-id="9b36rdzzj" data-path="src/components/EnhancedSMSTestManager.tsx" />

              <p className="text-sm text-muted-foreground" data-id="b34dip4oo" data-path="src/components/EnhancedSMSTestManager.tsx">
                Enter phone number in E.164 format (+1234567890)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="oa0upkr9o" data-path="src/components/EnhancedSMSTestManager.tsx">
              <Button
                onClick={runBasicTest}
                disabled={testing || !testNumber.trim()}
                className="w-full" data-id="5flduxeiy" data-path="src/components/EnhancedSMSTestManager.tsx">

                {testing ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="st438eyjf" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Testing...
                  </> :
                <>
                    <Send className="w-4 h-4 mr-2" data-id="nf4ragatu" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Basic Test
                  </>
                }
              </Button>

              <Button
                onClick={runAdvancedTest}
                disabled={testing || !testNumber.trim()}
                variant="outline"
                className="w-full" data-id="124ytzuo9" data-path="src/components/EnhancedSMSTestManager.tsx">

                {testing ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="t0ocx4yh7" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Testing...
                  </> :
                <>
                    <Bug className="w-4 h-4 mr-2" data-id="24h453i0w" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Advanced Test
                  </>
                }
              </Button>
            </div>

            {serviceStatus?.testMode &&
            <Button
              onClick={addToTestNumbers}
              disabled={!testNumber.trim()}
              variant="outline"
              size="sm"
              className="w-full" data-id="qtf3a3og1" data-path="src/components/EnhancedSMSTestManager.tsx">

                <Phone className="w-4 h-4 mr-2" data-id="wwsnirs0o" data-path="src/components/EnhancedSMSTestManager.tsx" />
                Add to Verified Test Numbers
              </Button>
            }

            <div className="border-t pt-4 space-y-2" data-id="xn5b4587u" data-path="src/components/EnhancedSMSTestManager.tsx">
              <Label htmlFor="customMessage" data-id="cj8pgqn7u" data-path="src/components/EnhancedSMSTestManager.tsx">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                placeholder="Enter custom message to test..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3} data-id="wu5xvn1g0" data-path="src/components/EnhancedSMSTestManager.tsx" />

              
              <Button
                onClick={sendCustomMessage}
                disabled={testing || !testNumber.trim() || !customMessage.trim()}
                variant="secondary"
                className="w-full" data-id="9d6k23404" data-path="src/components/EnhancedSMSTestManager.tsx">

                {testing ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="oifka3l4o" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Sending...
                  </> :
                <>
                    <Send className="w-4 h-4 mr-2" data-id="g3uehylsr" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    Send Custom Message
                  </>
                }
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4" data-id="4mqapmcdv" data-path="src/components/EnhancedSMSTestManager.tsx">
            {configLoading ?
            <div className="flex items-center justify-center py-8" data-id="2do6a3hj5" data-path="src/components/EnhancedSMSTestManager.tsx">
                <Loader2 className="w-6 h-6 animate-spin mr-2" data-id="vf3bc42fj" data-path="src/components/EnhancedSMSTestManager.tsx" />
                Loading service status...
              </div> :
            serviceStatus ?
            <div className="space-y-4" data-id="rdzeg7j3d" data-path="src/components/EnhancedSMSTestManager.tsx">
                <Alert className={serviceStatus.available ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} data-id="5gtxrdubm" data-path="src/components/EnhancedSMSTestManager.tsx">
                  {serviceStatus.available ?
                <CheckCircle className="h-4 w-4 text-green-600" data-id="hz8z836oz" data-path="src/components/EnhancedSMSTestManager.tsx" /> :
                <AlertCircle className="h-4 w-4 text-red-600" data-id="e4q7gx4xo" data-path="src/components/EnhancedSMSTestManager.tsx" />
                }
                  <AlertDescription data-id="883vnlm6o" data-path="src/components/EnhancedSMSTestManager.tsx">
                    <div className={serviceStatus.available ? "text-green-800" : "text-red-800"} data-id="9qierurrg" data-path="src/components/EnhancedSMSTestManager.tsx">
                      <div className="font-medium" data-id="zoegjr3bw" data-path="src/components/EnhancedSMSTestManager.tsx">
                        {serviceStatus.available ? "✅ SMS Service Active" : "❌ SMS Service Inactive"}
                      </div>
                      <div className="mt-1" data-id="1m4rbb0cj" data-path="src/components/EnhancedSMSTestManager.tsx">{serviceStatus.message}</div>
                    </div>
                  </AlertDescription>
                </Alert>

                {serviceStatus.configuration &&
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="12bxthghm" data-path="src/components/EnhancedSMSTestManager.tsx">
                    <Card data-id="inyrxs0o8" data-path="src/components/EnhancedSMSTestManager.tsx">
                      <CardContent className="pt-4" data-id="sgeq2cdql" data-path="src/components/EnhancedSMSTestManager.tsx">
                        <div className="space-y-2" data-id="cdxe8qzsi" data-path="src/components/EnhancedSMSTestManager.tsx">
                          <div className="text-sm font-medium" data-id="397r8oumx" data-path="src/components/EnhancedSMSTestManager.tsx">Configuration</div>
                          <div className="space-y-1 text-sm" data-id="5apw29kpa" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <div data-id="4z14b46hg" data-path="src/components/EnhancedSMSTestManager.tsx">From Number: {serviceStatus.configuration.fromNumber}</div>
                            <div data-id="ubteawiy2" data-path="src/components/EnhancedSMSTestManager.tsx">
                              Test Mode: 
                              <Badge variant={serviceStatus.configuration.testMode ? "secondary" : "default"} className="ml-1" data-id="9p9ko3nj3" data-path="src/components/EnhancedSMSTestManager.tsx">
                                {serviceStatus.configuration.testMode ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            {serviceStatus.configuration.testNumbers?.length > 0 &&
                        <div data-id="8hjlykd4l" data-path="src/components/EnhancedSMSTestManager.tsx">
                                Test Numbers: {serviceStatus.configuration.testNumbers.length}
                              </div>
                        }
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {serviceStatus.quota &&
                <Card data-id="azlcox7ni" data-path="src/components/EnhancedSMSTestManager.tsx">
                        <CardContent className="pt-4" data-id="lb321s4aw" data-path="src/components/EnhancedSMSTestManager.tsx">
                          <div className="space-y-2" data-id="43lvbd1bi" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <div className="text-sm font-medium" data-id="tr8yceb7q" data-path="src/components/EnhancedSMSTestManager.tsx">Account Status</div>
                            <div className="space-y-1 text-sm" data-id="aeczbhmv7" data-path="src/components/EnhancedSMSTestManager.tsx">
                              <div data-id="x2jxr68rx" data-path="src/components/EnhancedSMSTestManager.tsx">Balance: {serviceStatus.quota.quotaRemaining}</div>
                              <div data-id="sn740gy2j" data-path="src/components/EnhancedSMSTestManager.tsx">Provider: Twilio</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                }
                  </div>
              }

                {serviceStatus.testMode &&
              <Alert data-id="4exskpi14" data-path="src/components/EnhancedSMSTestManager.tsx">
                    <Info className="h-4 w-4" data-id="n0f2ezfa0" data-path="src/components/EnhancedSMSTestManager.tsx" />
                    <AlertDescription data-id="op0a3pkoh" data-path="src/components/EnhancedSMSTestManager.tsx">
                      <div className="font-medium" data-id="srnzm31nr" data-path="src/components/EnhancedSMSTestManager.tsx">Test Mode is Enabled</div>
                      <div className="mt-1" data-id="64s4kuehw" data-path="src/components/EnhancedSMSTestManager.tsx">
                        Only verified phone numbers can receive SMS messages. 
                        Add your phone number to the verified list using the "Add to Verified Test Numbers" button.
                      </div>
                    </AlertDescription>
                  </Alert>
              }
              </div> :

            <Alert variant="destructive" data-id="uvywg0ell" data-path="src/components/EnhancedSMSTestManager.tsx">
                <AlertTriangle className="h-4 w-4" data-id="4d9ogi1qm" data-path="src/components/EnhancedSMSTestManager.tsx" />
                <AlertDescription data-id="j5pgqt1ky" data-path="src/components/EnhancedSMSTestManager.tsx">
                  Unable to load service status. Please check your configuration.
                </AlertDescription>
              </Alert>
            }
          </TabsContent>

          <TabsContent value="results" className="space-y-4" data-id="8ylqagl2g" data-path="src/components/EnhancedSMSTestManager.tsx">
            <div className="flex items-center justify-between" data-id="amrpwhxsx" data-path="src/components/EnhancedSMSTestManager.tsx">
              <h3 className="text-lg font-medium" data-id="l71zk183c" data-path="src/components/EnhancedSMSTestManager.tsx">Test Results</h3>
              <Badge variant="outline" data-id="wodsslxwx" data-path="src/components/EnhancedSMSTestManager.tsx">{testResults.length} tests</Badge>
            </div>

            {testResults.length === 0 ?
            <div className="text-center py-8 text-muted-foreground" data-id="wkxsu5xjc" data-path="src/components/EnhancedSMSTestManager.tsx">
                No test results yet. Run a test to see results here.
              </div> :

            <div className="space-y-3" data-id="yx2qhwavx" data-path="src/components/EnhancedSMSTestManager.tsx">
                {testResults.map((result, index) =>
              <Card key={index} className={result.success ? "border-green-200" : "border-red-200"} data-id="avnuyw1sk" data-path="src/components/EnhancedSMSTestManager.tsx">
                    <CardContent className="pt-4" data-id="88czpluti" data-path="src/components/EnhancedSMSTestManager.tsx">
                      <div className="flex items-start justify-between" data-id="la78jx0u1" data-path="src/components/EnhancedSMSTestManager.tsx">
                        <div className="flex items-center space-x-2" data-id="m39z47wpc" data-path="src/components/EnhancedSMSTestManager.tsx">
                          {getStatusIcon(result.success)}
                          <div data-id="c1uqg8x4z" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <div className="font-medium" data-id="qadlfpkxx" data-path="src/components/EnhancedSMSTestManager.tsx">{result.phoneNumber}</div>
                            <div className="text-sm text-muted-foreground" data-id="yes4zfefk" data-path="src/components/EnhancedSMSTestManager.tsx">
                              {result.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={result.success ? "default" : "destructive"} data-id="whtmp1ury" data-path="src/components/EnhancedSMSTestManager.tsx">
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2" data-id="kf96ufus5" data-path="src/components/EnhancedSMSTestManager.tsx">
                        <div className="text-sm" data-id="u16fbf4b4" data-path="src/components/EnhancedSMSTestManager.tsx">{result.message}</div>
                        
                        {result.messageId &&
                    <div className="text-xs text-muted-foreground" data-id="gyxcgdwa7" data-path="src/components/EnhancedSMSTestManager.tsx">
                            Message ID: {result.messageId}
                          </div>
                    }

                        {result.errorCode &&
                    <Badge variant="destructive" className="text-xs" data-id="m3x0g9u13" data-path="src/components/EnhancedSMSTestManager.tsx">
                            Error: {result.errorCode}
                          </Badge>
                    }

                        {result.details &&
                    <details className="text-xs" data-id="qfzf0f7h6" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <summary className="cursor-pointer text-muted-foreground" data-id="p7vj6kdc5" data-path="src/components/EnhancedSMSTestManager.tsx">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto" data-id="3tfpb69nr" data-path="src/components/EnhancedSMSTestManager.tsx">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                    }
                      </div>
                    </CardContent>
                  </Card>
              )}
              </div>
            }
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4" data-id="46ilk16e8" data-path="src/components/EnhancedSMSTestManager.tsx">
            <div className="flex items-center justify-between" data-id="opeazmh8i" data-path="src/components/EnhancedSMSTestManager.tsx">
              <h3 className="text-lg font-medium" data-id="ypyacevws" data-path="src/components/EnhancedSMSTestManager.tsx">Delivery Tracking</h3>
              <Badge variant="outline" data-id="aabkisomr" data-path="src/components/EnhancedSMSTestManager.tsx">{Object.keys(deliveryTracking).length} messages</Badge>
            </div>

            {Object.keys(deliveryTracking).length === 0 ?
            <div className="text-center py-8 text-muted-foreground" data-id="2rj30qssq" data-path="src/components/EnhancedSMSTestManager.tsx">
                No delivery tracking data. Send a test message to see tracking information.
              </div> :

            <div className="space-y-3" data-id="wxkrxh0zh" data-path="src/components/EnhancedSMSTestManager.tsx">
                {Object.entries(deliveryTracking).map(([messageId, tracking]) =>
              <Card key={messageId} data-id="l0jw5qp5e" data-path="src/components/EnhancedSMSTestManager.tsx">
                    <CardContent className="pt-4" data-id="09bvqj07b" data-path="src/components/EnhancedSMSTestManager.tsx">
                      <div className="space-y-2" data-id="yo605o5ud" data-path="src/components/EnhancedSMSTestManager.tsx">
                        <div className="flex items-center justify-between" data-id="w60jx3nr8" data-path="src/components/EnhancedSMSTestManager.tsx">
                          <div className="font-medium" data-id="jy72j6sgf" data-path="src/components/EnhancedSMSTestManager.tsx">{tracking.phoneNumber}</div>
                          <Badge className={getStatusColor(tracking.status)} data-id="pkao71tbh" data-path="src/components/EnhancedSMSTestManager.tsx">
                            {tracking.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground" data-id="embvfc9o9" data-path="src/components/EnhancedSMSTestManager.tsx">
                          Message ID: {messageId}
                        </div>

                        {tracking.deliveredAt &&
                    <div className="text-sm" data-id="iqx880a1i" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <Clock className="w-3 h-3 inline mr-1" data-id="fiznlofqd" data-path="src/components/EnhancedSMSTestManager.tsx" />
                            Delivered: {new Date(tracking.deliveredAt).toLocaleString()}
                          </div>
                    }

                        {tracking.errorMessage &&
                    <Alert variant="destructive" className="mt-2" data-id="694f0v1da" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <AlertDescription className="text-sm" data-id="i3qalrxy4" data-path="src/components/EnhancedSMSTestManager.tsx">
                              {tracking.errorMessage}
                            </AlertDescription>
                          </Alert>
                    }

                        {tracking.status === 'checking' &&
                    <div className="flex items-center space-x-2" data-id="nwjvap91q" data-path="src/components/EnhancedSMSTestManager.tsx">
                            <Loader2 className="w-3 h-3 animate-spin" data-id="s18htc3gr" data-path="src/components/EnhancedSMSTestManager.tsx" />
                            <span className="text-sm text-muted-foreground" data-id="zsnudxhvl" data-path="src/components/EnhancedSMSTestManager.tsx">
                              Checking delivery status...
                            </span>
                          </div>
                    }
                      </div>
                    </CardContent>
                  </Card>
              )}
              </div>
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>);

};

export default EnhancedSMSTestManager;
