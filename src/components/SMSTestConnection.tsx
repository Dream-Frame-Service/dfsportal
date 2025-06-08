import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TestTube, CheckCircle, AlertCircle, Send, Loader2 } from 'lucide-react';
import { smsService } from '@/services/smsService';

const SMSTestConnection: React.FC = () => {
  const [testNumber, setTestNumber] = useState('');
  const [testing, setTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);
  const { toast } = useToast();

  const runConnectionTest = async () => {
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
      setLastTestResult(null);

      // Test SMS service connection
      const serviceStatus = await smsService.getServiceStatus();

      if (!serviceStatus.available) {
        throw new Error(serviceStatus.message);
      }

      // Send test SMS
      const result = await smsService.testSMS(testNumber);

      setLastTestResult({
        success: result.success,
        message: result.success ?
        `Test SMS sent successfully to ${testNumber}` :
        result.error,
        timestamp: new Date(),
        messageId: result.messageId,
        phoneNumber: testNumber
      });

      if (result.success) {
        toast({
          title: "✅ Test Successful",
          description: `Test SMS sent to ${testNumber}. Check your phone!`
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || "Failed to send test SMS",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('SMS test error:', error);
      setLastTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date(),
        phoneNumber: testNumber
      });

      toast({
        title: "❌ Connection Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full" data-id="od2udchk7" data-path="src/components/SMSTestConnection.tsx">
      <CardHeader data-id="2kdkufwwa" data-path="src/components/SMSTestConnection.tsx">
        <CardTitle className="flex items-center" data-id="wvbbjvkq5" data-path="src/components/SMSTestConnection.tsx">
          <TestTube className="w-5 h-5 mr-2" data-id="ybt8177bh" data-path="src/components/SMSTestConnection.tsx" />
          SMS Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="xkh9nq0zk" data-path="src/components/SMSTestConnection.tsx">
        <div className="space-y-2" data-id="owzah4cmu" data-path="src/components/SMSTestConnection.tsx">
          <Label htmlFor="testNumber" data-id="g6twrwtzh" data-path="src/components/SMSTestConnection.tsx">Test Phone Number</Label>
          <Input
            id="testNumber"
            type="tel"
            placeholder="+1234567890"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)} data-id="l8mec3xs0" data-path="src/components/SMSTestConnection.tsx" />

          <p className="text-sm text-muted-foreground" data-id="h14njuhir" data-path="src/components/SMSTestConnection.tsx">
            Enter your phone number to receive a test SMS
          </p>
        </div>

        <Button
          onClick={runConnectionTest}
          disabled={testing || !testNumber.trim()}
          className="w-full" data-id="04kenu7pp" data-path="src/components/SMSTestConnection.tsx">

          {testing ?
          <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="j97g2gqiv" data-path="src/components/SMSTestConnection.tsx" />
              Testing Connection...
            </> :

          <>
              <Send className="w-4 h-4 mr-2" data-id="v8fxaocwf" data-path="src/components/SMSTestConnection.tsx" />
              Send Test SMS
            </>
          }
        </Button>

        {lastTestResult &&
        <Alert className={lastTestResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} data-id="w0x2sne3x" data-path="src/components/SMSTestConnection.tsx">
            {lastTestResult.success ?
          <CheckCircle className="h-4 w-4 text-green-600" data-id="gz4lcu27r" data-path="src/components/SMSTestConnection.tsx" /> :

          <AlertCircle className="h-4 w-4 text-red-600" data-id="n1l92vvrx" data-path="src/components/SMSTestConnection.tsx" />
          }
            <AlertDescription data-id="1u6qpr5a0" data-path="src/components/SMSTestConnection.tsx">
              <div className={lastTestResult.success ? "text-green-800" : "text-red-800"} data-id="o63d1l9qo" data-path="src/components/SMSTestConnection.tsx">
                <div className="font-medium" data-id="fel4ewict" data-path="src/components/SMSTestConnection.tsx">
                  {lastTestResult.success ? "✅ Test Successful" : "❌ Test Failed"}
                </div>
                <div className="mt-2 space-y-1 text-sm" data-id="8378nn8zb" data-path="src/components/SMSTestConnection.tsx">
                  <div data-id="u36300j3s" data-path="src/components/SMSTestConnection.tsx"><strong data-id="y0q4n0xpv" data-path="src/components/SMSTestConnection.tsx">Message:</strong> {lastTestResult.message}</div>
                  <div data-id="0my462n5o" data-path="src/components/SMSTestConnection.tsx"><strong data-id="oofpitvsn" data-path="src/components/SMSTestConnection.tsx">Phone:</strong> {lastTestResult.phoneNumber}</div>
                  <div data-id="u9vq0a0fn" data-path="src/components/SMSTestConnection.tsx"><strong data-id="yay2nykv2" data-path="src/components/SMSTestConnection.tsx">Time:</strong> {lastTestResult.timestamp.toLocaleString()}</div>
                  {lastTestResult.messageId &&
                <div data-id="3z7fkn63a" data-path="src/components/SMSTestConnection.tsx"><strong data-id="63fk3qv00" data-path="src/components/SMSTestConnection.tsx">Message ID:</strong> {lastTestResult.messageId}</div>
                }
                </div>
              </div>
            </AlertDescription>
          </Alert>
        }

        <div className="border-t pt-4" data-id="p0gh4oahs" data-path="src/components/SMSTestConnection.tsx">
          <div className="text-sm text-muted-foreground space-y-2" data-id="7w4a8ch69" data-path="src/components/SMSTestConnection.tsx">
            <div className="font-medium" data-id="50cg5dz21" data-path="src/components/SMSTestConnection.tsx">Test Information:</div>
            <ul className="list-disc list-inside space-y-1 text-xs" data-id="6iorw4mu0" data-path="src/components/SMSTestConnection.tsx">
              <li data-id="2rr88nny4" data-path="src/components/SMSTestConnection.tsx">This test sends a real SMS to verify your configuration</li>
              <li data-id="agljz840b" data-path="src/components/SMSTestConnection.tsx">Make sure to enter a phone number you have access to</li>
              <li data-id="5izudjylx" data-path="src/components/SMSTestConnection.tsx">Test messages don't count toward license alerts</li>
              <li data-id="ed6v78huk" data-path="src/components/SMSTestConnection.tsx">Check your SMS provider balance if tests fail</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default SMSTestConnection;