import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Phone,
  Shield,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  RefreshCw } from
'lucide-react';

interface TroubleshootingItem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: 'config' | 'account' | 'delivery' | 'format';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  preventive?: string[];
}

const SMSTroubleshootingGuide: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: 'sms-shows-sent-not-received',
    title: 'SMS shows "sent successfully" but recipient doesn\'t receive it',
    description: 'The most common issue where the system reports success but messages don\'t arrive',
    severity: 'high',
    category: 'delivery',
    symptoms: [
    'Application shows "SMS sent successfully"',
    'Recipient never receives the message',
    'No error messages in the application',
    'SMS history shows "Sent" status'],

    causes: [
    'Test mode is enabled and recipient number is not verified',
    'Invalid or incorrectly formatted phone number',
    'Insufficient account balance in Twilio',
    'Twilio number not properly configured',
    'Recipient\'s carrier blocking messages',
    'API credentials are incorrect but validation passed',
    'Network issues between your server and Twilio'],

    solutions: [
    'Verify test mode is disabled for production use',
    'Add recipient number to verified numbers if in test mode',
    'Check phone number format (must be E.164: +1234567890)',
    'Verify Twilio account balance is sufficient',
    'Confirm Twilio phone number is active and SMS-enabled',
    'Test with a different phone number/carrier',
    'Check Twilio delivery logs in their console',
    'Verify API credentials are correct and active'],

    preventive: [
    'Always test with your own phone number first',
    'Set up delivery status webhooks for real-time tracking',
    'Monitor account balance regularly',
    'Use phone number validation before sending']

  },
  {
    id: 'authentication-failed',
    title: 'Authentication failed or invalid credentials',
    description: 'Unable to connect to Twilio API due to credential issues',
    severity: 'high',
    category: 'config',
    symptoms: [
    'Error: "Authentication failed"',
    'HTTP 401 Unauthorized errors',
    'Cannot connect to Twilio API',
    'Configuration validation fails'],

    causes: [
    'Incorrect Account SID',
    'Incorrect Auth Token',
    'Credentials copied with extra spaces or characters',
    'Account SID doesn\'t match Auth Token',
    'Account suspended or deactivated'],

    solutions: [
    'Double-check Account SID starts with "AC"',
    'Verify Auth Token is exactly 32 characters',
    'Copy credentials directly from Twilio Console',
    'Ensure no extra spaces or newlines in credentials',
    'Generate new Auth Token if needed',
    'Check account status in Twilio Console'],

    preventive: [
    'Store credentials securely',
    'Regularly rotate Auth Tokens',
    'Use environment variables for credentials']

  },
  {
    id: 'invalid-phone-number',
    title: 'Invalid phone number format errors',
    description: 'Phone numbers not accepted by Twilio API',
    severity: 'medium',
    category: 'format',
    symptoms: [
    'Error: "Invalid phone number"',
    'Messages fail to send to specific numbers',
    'Phone number validation errors',
    'Some numbers work, others don\'t'],

    causes: [
    'Phone number not in E.164 format',
    'Missing country code',
    'Invalid characters in phone number',
    'Landline number used instead of mobile',
    'Number doesn\'t exist or is disconnected'],

    solutions: [
    'Format all numbers as +[country code][number]',
    'Remove spaces, dashes, and parentheses',
    'Add country code (+1 for US/Canada)',
    'Verify number is a mobile/cell phone',
    'Test with known working numbers',
    'Use phone number validation service'],

    preventive: [
    'Implement phone number validation on input',
    'Auto-format numbers to E.164',
    'Verify numbers are mobile before sending']

  },
  {
    id: 'test-mode-restrictions',
    title: 'Test mode preventing message delivery',
    description: 'Messages only work for verified numbers in test mode',
    severity: 'medium',
    category: 'config',
    symptoms: [
    'Some numbers receive messages, others don\'t',
    'Only your own number receives messages',
    'Error: "Test mode restrictions"',
    'Messages work in development but not production'],

    causes: [
    'Test mode is enabled in Twilio configuration',
    'Recipient numbers not added to verified list',
    'Forgot to disable test mode for production'],

    solutions: [
    'Disable test mode in SMS configuration',
    'Add recipient numbers to verified list',
    'Switch to production mode configuration',
    'Verify account upgrade if needed'],

    preventive: [
    'Clearly document test vs production settings',
    'Use environment-specific configurations',
    'Test with non-verified numbers before going live']

  },
  {
    id: 'insufficient-balance',
    title: 'Insufficient account balance',
    description: 'Twilio account doesn\'t have enough credit to send messages',
    severity: 'high',
    category: 'account',
    symptoms: [
    'Messages stop sending suddenly',
    'Error: "Insufficient funds"',
    'Some messages send, others fail',
    'Account balance warnings'],

    causes: [
    'Twilio account balance is too low',
    'Auto-recharge is disabled',
    'Payment method expired or failed',
    'Unexpected high usage'],

    solutions: [
    'Add funds to Twilio account',
    'Set up auto-recharge',
    'Update payment method',
    'Monitor usage patterns',
    'Set up balance alerts'],

    preventive: [
    'Enable auto-recharge with minimum balance',
    'Monitor monthly usage',
    'Set up low balance alerts',
    'Budget for expected SMS volume']

  },
  {
    id: 'carrier-blocking',
    title: 'Messages blocked by recipient carrier',
    description: 'Mobile carrier is filtering or blocking messages',
    severity: 'medium',
    category: 'delivery',
    symptoms: [
    'Messages don\'t arrive at specific carriers',
    'Inconsistent delivery across carriers',
    'Works for some numbers but not others',
    'Regional delivery issues'],

    causes: [
    'Carrier spam filtering',
    'Message content flagged',
    'High volume sending patterns',
    'Unregistered sender number',
    'Promotional content without opt-in'],

    solutions: [
    'Register sender number with carriers',
    'Modify message content to be less promotional',
    'Implement proper opt-in processes',
    'Use different sending patterns',
    'Contact carrier support',
    'Consider short code or toll-free number'],

    preventive: [
    'Follow carrier guidelines',
    'Implement double opt-in',
    'Monitor delivery rates by carrier',
    'Avoid spam trigger words']

  }];


  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
    prev.includes(itemId) ?
    prev.filter((id) => id !== itemId) :
    [...prev, itemId]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':return 'text-red-600 border-red-200 bg-red-50';
      case 'medium':return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'low':return 'text-blue-600 border-blue-200 bg-blue-50';
      default:return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':return <AlertTriangle className="w-4 h-4" data-id="rfrloghgq" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      case 'medium':return <AlertTriangle className="w-4 h-4" data-id="04t21hrth" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      case 'low':return <CheckCircle className="w-4 h-4" data-id="1qnw5qo7i" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      default:return <MessageSquare className="w-4 h-4" data-id="dr5ph0obg" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'config':return <Shield className="w-4 h-4" data-id="gz0yrs7f9" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      case 'account':return <DollarSign className="w-4 h-4" data-id="ybtpfccr7" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      case 'delivery':return <MessageSquare className="w-4 h-4" data-id="9wueyvid4" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      case 'format':return <Phone className="w-4 h-4" data-id="ctuhodktl" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
      default:return <MessageSquare className="w-4 h-4" data-id="hzpouwn6j" data-path="src/components/SMSTroubleshootingGuide.tsx" />;
    }
  };

  const filteredItems = selectedCategory === 'all' ?
  troubleshootingItems :
  troubleshootingItems.filter((item) => item.category === selectedCategory);

  const categoryStats = troubleshootingItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="w-full" data-id="6711ex63v" data-path="src/components/SMSTroubleshootingGuide.tsx">
      <CardHeader data-id="r2wqkg0he" data-path="src/components/SMSTroubleshootingGuide.tsx">
        <CardTitle className="flex items-center" data-id="8teliw6t9" data-path="src/components/SMSTroubleshootingGuide.tsx">
          <AlertTriangle className="w-5 h-5 mr-2" data-id="ikf354td9" data-path="src/components/SMSTroubleshootingGuide.tsx" />
          SMS Troubleshooting Guide
        </CardTitle>
      </CardHeader>
      <CardContent data-id="598jc6ar4" data-path="src/components/SMSTroubleshootingGuide.tsx">
        <Tabs defaultValue="issues" className="w-full" data-id="uwlf09lxe" data-path="src/components/SMSTroubleshootingGuide.tsx">
          <TabsList className="grid w-full grid-cols-3" data-id="9ydaze2pn" data-path="src/components/SMSTroubleshootingGuide.tsx">
            <TabsTrigger value="issues" data-id="jct05n6si" data-path="src/components/SMSTroubleshootingGuide.tsx">Common Issues</TabsTrigger>
            <TabsTrigger value="checklist" data-id="hhxvcblit" data-path="src/components/SMSTroubleshootingGuide.tsx">Diagnostic Checklist</TabsTrigger>
            <TabsTrigger value="resources" data-id="brano98xf" data-path="src/components/SMSTroubleshootingGuide.tsx">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-4" data-id="ix6j8g9da" data-path="src/components/SMSTroubleshootingGuide.tsx">
            <div className="flex flex-wrap gap-2 mb-4" data-id="yydoug2v9" data-path="src/components/SMSTroubleshootingGuide.tsx">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')} data-id="138ousoy3" data-path="src/components/SMSTroubleshootingGuide.tsx">

                All Issues ({troubleshootingItems.length})
              </Button>
              <Button
                variant={selectedCategory === 'config' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('config')} data-id="y4hobx3n8" data-path="src/components/SMSTroubleshootingGuide.tsx">

                <Shield className="w-3 h-3 mr-1" data-id="g0ihlyc9e" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                Configuration ({categoryStats.config || 0})
              </Button>
              <Button
                variant={selectedCategory === 'delivery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('delivery')} data-id="unp2ko4au" data-path="src/components/SMSTroubleshootingGuide.tsx">

                <MessageSquare className="w-3 h-3 mr-1" data-id="f44piseg7" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                Delivery ({categoryStats.delivery || 0})
              </Button>
              <Button
                variant={selectedCategory === 'account' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('account')} data-id="z8munpq8r" data-path="src/components/SMSTroubleshootingGuide.tsx">

                <DollarSign className="w-3 h-3 mr-1" data-id="49rm2t05p" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                Account ({categoryStats.account || 0})
              </Button>
              <Button
                variant={selectedCategory === 'format' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('format')} data-id="q77mzs537" data-path="src/components/SMSTroubleshootingGuide.tsx">

                <Phone className="w-3 h-3 mr-1" data-id="vu455wjaj" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                Format ({categoryStats.format || 0})
              </Button>
            </div>

            <div className="space-y-3" data-id="74j2nrn1x" data-path="src/components/SMSTroubleshootingGuide.tsx">
              {filteredItems.map((item) =>
              <Card key={item.id} className={`${getSeverityColor(item.severity)} border`} data-id="raa28nqpe" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <Collapsible
                  open={openItems.includes(item.id)}
                  onOpenChange={() => toggleItem(item.id)} data-id="fasz8zawk" data-path="src/components/SMSTroubleshootingGuide.tsx">

                    <CollapsibleTrigger asChild data-id="yetw3r01t" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <CardContent className="pt-4 cursor-pointer hover:bg-opacity-50" data-id="k8h4uos5y" data-path="src/components/SMSTroubleshootingGuide.tsx">
                        <div className="flex items-center justify-between" data-id="a3lgxcocx" data-path="src/components/SMSTroubleshootingGuide.tsx">
                          <div className="flex items-center space-x-3" data-id="wlwu6euuk" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            {getSeverityIcon(item.severity)}
                            <div data-id="vdevn023j" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              <div className="font-medium" data-id="vmomwfnmi" data-path="src/components/SMSTroubleshootingGuide.tsx">{item.title}</div>
                              <div className="text-sm opacity-80" data-id="gq61gnt6d" data-path="src/components/SMSTroubleshootingGuide.tsx">{item.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2" data-id="3qq7ugb6z" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            <Badge variant="outline" className="capitalize" data-id="fiuca0ag7" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              {getCategoryIcon(item.category)}
                              <span className="ml-1" data-id="3seph7sb9" data-path="src/components/SMSTroubleshootingGuide.tsx">{item.category}</span>
                            </Badge>
                            <Badge variant={item.severity === 'high' ? 'destructive' : 'default'} data-id="jxy6fwjtx" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              {item.severity.toUpperCase()}
                            </Badge>
                            {openItems.includes(item.id) ?
                          <ChevronDown className="w-4 h-4" data-id="2niwqipwo" data-path="src/components/SMSTroubleshootingGuide.tsx" /> :
                          <ChevronRight className="w-4 h-4" data-id="6e28mls3f" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                          }
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent data-id="exindecbl" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <CardContent className="pt-0 space-y-4" data-id="2gqvlaaqy" data-path="src/components/SMSTroubleshootingGuide.tsx">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="6cb5smat1" data-path="src/components/SMSTroubleshootingGuide.tsx">
                          <div data-id="ueh3lql9m" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            <h4 className="font-medium mb-2 flex items-center" data-id="gnm4kqyw5" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              <AlertTriangle className="w-3 h-3 mr-1" data-id="nx0s6lkvd" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                              Symptoms
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm" data-id="1ij8a58kj" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              {item.symptoms.map((symptom, index) =>
                            <li key={index} data-id="s8m1hq37w" data-path="src/components/SMSTroubleshootingGuide.tsx">{symptom}</li>
                            )}
                            </ul>
                          </div>

                          <div data-id="blcod9ddk" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            <h4 className="font-medium mb-2 flex items-center" data-id="gsis15s9y" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              <MessageSquare className="w-3 h-3 mr-1" data-id="eehnqtkup" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                              Possible Causes
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm" data-id="8sgc7fwef" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              {item.causes.map((cause, index) =>
                            <li key={index} data-id="gbmuspup0" data-path="src/components/SMSTroubleshootingGuide.tsx">{cause}</li>
                            )}
                            </ul>
                          </div>
                        </div>

                        <div data-id="cx58qabu9" data-path="src/components/SMSTroubleshootingGuide.tsx">
                          <h4 className="font-medium mb-2 flex items-center" data-id="qs1paemrm" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            <CheckCircle className="w-3 h-3 mr-1" data-id="eatomtht7" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                            Solutions
                          </h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm" data-id="1ed5s9cs6" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            {item.solutions.map((solution, index) =>
                          <li key={index} data-id="iwuazli9e" data-path="src/components/SMSTroubleshootingGuide.tsx">{solution}</li>
                          )}
                          </ol>
                        </div>

                        {item.preventive &&
                      <div data-id="va4wdaewr" data-path="src/components/SMSTroubleshootingGuide.tsx">
                            <h4 className="font-medium mb-2 flex items-center" data-id="ay9vqm7bx" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              <Shield className="w-3 h-3 mr-1" data-id="e50a82qb0" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                              Prevention Tips
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm" data-id="4c194grym" data-path="src/components/SMSTroubleshootingGuide.tsx">
                              {item.preventive.map((tip, index) =>
                          <li key={index} data-id="3swbl06pp" data-path="src/components/SMSTroubleshootingGuide.tsx">{tip}</li>
                          )}
                            </ul>
                          </div>
                      }
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4" data-id="bbiaqeeq0" data-path="src/components/SMSTroubleshootingGuide.tsx">
            <Alert data-id="hf1u0kyrx" data-path="src/components/SMSTroubleshootingGuide.tsx">
              <CheckCircle className="h-4 w-4" data-id="tebg63htl" data-path="src/components/SMSTroubleshootingGuide.tsx" />
              <AlertDescription data-id="tncpo9pv2" data-path="src/components/SMSTroubleshootingGuide.tsx">
                Follow this checklist to systematically diagnose SMS delivery issues.
              </AlertDescription>
            </Alert>

            <div className="space-y-4" data-id="a5hwx15up" data-path="src/components/SMSTroubleshootingGuide.tsx">
              <Card data-id="st2js72wi" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="7t5awfv8r" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="82zspfj2p" data-path="src/components/SMSTroubleshootingGuide.tsx">Step 1: Configuration Check</CardTitle>
                </CardHeader>
                <CardContent data-id="ib7gahwe4" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <div className="space-y-2" data-id="mgyei2jd7" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <label className="flex items-center space-x-2" data-id="0nbfpcbfz" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="d2dfihscc" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="ed9mybwmp" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify Account SID starts with "AC" and is 34 characters</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="wjwf68zdp" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="9fdnfjwxa" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="xv1wzo8a4" data-path="src/components/SMSTroubleshootingGuide.tsx">Confirm Auth Token is exactly 32 characters</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="yxbubyxcp" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="jmod2l3wq" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="kbdi1s7wq" data-path="src/components/SMSTroubleshootingGuide.tsx">Check from number is in E.164 format (+1234567890)</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="8h35ziscv" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="ufera6ehx" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="ystfhsag6" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify from number is SMS-enabled in Twilio</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card data-id="6k1itx3bf" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="q5i3anr2a" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="cbc5l8fuw" data-path="src/components/SMSTroubleshootingGuide.tsx">Step 2: Account Status</CardTitle>
                </CardHeader>
                <CardContent data-id="xtifp1eak" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <div className="space-y-2" data-id="q97z2vqse" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <label className="flex items-center space-x-2" data-id="oj0p42m8b" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="r7wvc02d3" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="48d6086ob" data-path="src/components/SMSTroubleshootingGuide.tsx">Check Twilio account balance is sufficient</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="flk3dtst5" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="tfcc7480t" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="6fq9namdv" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify account is not suspended</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="hlohe7srb" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="i47pblsmo" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="curnyzpql" data-path="src/components/SMSTroubleshootingGuide.tsx">Confirm payment method is valid</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="6qu0jq0ml" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="iyv4jvgpu" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="l40nzn27e" data-path="src/components/SMSTroubleshootingGuide.tsx">Check monthly usage limits</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card data-id="fe2kstbbf" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="pqrncc4t7" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="myly68vm1" data-path="src/components/SMSTroubleshootingGuide.tsx">Step 3: Test Mode Check</CardTitle>
                </CardHeader>
                <CardContent data-id="nowuvgdat" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <div className="space-y-2" data-id="km7jmn0m1" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <label className="flex items-center space-x-2" data-id="vis7bdmjq" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="l8771474k" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="9clsv7s51" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify if test mode is enabled/disabled appropriately</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="bvyp2emla" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="pzmayh820" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="vefj0ug96" data-path="src/components/SMSTroubleshootingGuide.tsx">Check if recipient number is in verified list (test mode)</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="3mkd5eri6" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="9iek7fg5s" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="un9yldc3n" data-path="src/components/SMSTroubleshootingGuide.tsx">Test with your own verified number first</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card data-id="1kkk7dyzj" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="qgzoato6x" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="drwa185wi" data-path="src/components/SMSTroubleshootingGuide.tsx">Step 4: Message Content & Format</CardTitle>
                </CardHeader>
                <CardContent data-id="p595x8cjp" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <div className="space-y-2" data-id="fkeowuom6" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <label className="flex items-center space-x-2" data-id="1b6ucfxzk" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="jm5c6jor1" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="eb6c88fmq" data-path="src/components/SMSTroubleshootingGuide.tsx">Validate recipient phone number format</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="it9g22ori" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="gkc905wsp" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="vdzkkm2a5" data-path="src/components/SMSTroubleshootingGuide.tsx">Check message content for spam triggers</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="st8sndg3r" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="356afnt3p" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="80vq8s5ii" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify message length is within limits</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="m762wo08a" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="oqe44bnek" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="1kmc0amjl" data-path="src/components/SMSTroubleshootingGuide.tsx">Test with simple message content</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card data-id="7pxos3xwk" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="levi50mby" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="9cb7kww1q" data-path="src/components/SMSTroubleshootingGuide.tsx">Step 5: Delivery Tracking</CardTitle>
                </CardHeader>
                <CardContent data-id="0h5dmy8sh" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <div className="space-y-2" data-id="qmjnqbm8a" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <label className="flex items-center space-x-2" data-id="w4f58roaz" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="k3405sjoo" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="9helh37xl" data-path="src/components/SMSTroubleshootingGuide.tsx">Check Twilio console for delivery logs</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="3o5ucqpsq" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="wqx1e9p77" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="pqm9ioocz" data-path="src/components/SMSTroubleshootingGuide.tsx">Monitor delivery status updates</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="h1e1fuavw" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="40to9avdy" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="hzb6m2h77" data-path="src/components/SMSTroubleshootingGuide.tsx">Test with different carriers/numbers</span>
                    </label>
                    <label className="flex items-center space-x-2" data-id="6b04oh04f" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <input type="checkbox" className="rounded" data-id="5oxk1uts9" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                      <span data-id="rl9l8i2gp" data-path="src/components/SMSTroubleshootingGuide.tsx">Check for carrier-specific issues</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4" data-id="g1votsspy" data-path="src/components/SMSTroubleshootingGuide.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="yzfuf5luj" data-path="src/components/SMSTroubleshootingGuide.tsx">
              <Card data-id="d56u8ru37" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="pipiprwc4" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg flex items-center" data-id="zg99cutpw" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <ExternalLink className="w-4 h-4 mr-2" data-id="m5721shwk" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                    Twilio Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3" data-id="7wn8cdrsp" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <a
                    href="https://console.twilio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border rounded hover:bg-gray-50 transition-colors" data-id="2rzfoxzyu" data-path="src/components/SMSTroubleshootingGuide.tsx">

                    <div className="font-medium" data-id="hbw6mk4xp" data-path="src/components/SMSTroubleshootingGuide.tsx">Twilio Console</div>
                    <div className="text-sm text-muted-foreground" data-id="fvrunb83k" data-path="src/components/SMSTroubleshootingGuide.tsx">Access your account dashboard and logs</div>
                  </a>
                  
                  <a
                    href="https://www.twilio.com/docs/sms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border rounded hover:bg-gray-50 transition-colors" data-id="6go3q13rr" data-path="src/components/SMSTroubleshootingGuide.tsx">

                    <div className="font-medium" data-id="ezbhs52xb" data-path="src/components/SMSTroubleshootingGuide.tsx">SMS Documentation</div>
                    <div className="text-sm text-muted-foreground" data-id="ls0adod9i" data-path="src/components/SMSTroubleshootingGuide.tsx">Complete SMS API documentation</div>
                  </a>

                  <a
                    href="https://support.twilio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border rounded hover:bg-gray-50 transition-colors" data-id="7mi100roe" data-path="src/components/SMSTroubleshootingGuide.tsx">

                    <div className="font-medium" data-id="atbmgja5x" data-path="src/components/SMSTroubleshootingGuide.tsx">Twilio Support</div>
                    <div className="text-sm text-muted-foreground" data-id="tngvvpvgm" data-path="src/components/SMSTroubleshootingGuide.tsx">Get help from Twilio support team</div>
                  </a>
                </CardContent>
              </Card>

              <Card data-id="chj58yjpg" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardHeader data-id="4w56t1mlk" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <CardTitle className="text-lg" data-id="io0fapw2o" data-path="src/components/SMSTroubleshootingGuide.tsx">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3" data-id="c4eri0ysz" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <Button className="w-full justify-start" data-id="lszzba8kf" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <RefreshCw className="w-4 h-4 mr-2" data-id="kmtma2iby" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                    Test SMS Configuration
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-id="pz3h71f1j" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <CheckCircle className="w-4 h-4 mr-2" data-id="bof6u5253" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                    Validate Phone Numbers
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-id="sr87nito7" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <MessageSquare className="w-4 h-4 mr-2" data-id="pn4zlyn5j" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                    Check Delivery Status
                  </Button>

                  <Button variant="outline" className="w-full justify-start" data-id="z60hgujyq" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <DollarSign className="w-4 h-4 mr-2" data-id="5d1d92xx8" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                    Check Account Balance
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card data-id="1z4xqwoxx" data-path="src/components/SMSTroubleshootingGuide.tsx">
              <CardHeader data-id="u4cktme98" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <CardTitle data-id="qlhtvkmul" data-path="src/components/SMSTroubleshootingGuide.tsx">Emergency Checklist</CardTitle>
              </CardHeader>
              <CardContent data-id="a9zd1g39s" data-path="src/components/SMSTroubleshootingGuide.tsx">
                <Alert variant="destructive" data-id="ucexubfah" data-path="src/components/SMSTroubleshootingGuide.tsx">
                  <AlertTriangle className="h-4 w-4" data-id="3n5mmc9po" data-path="src/components/SMSTroubleshootingGuide.tsx" />
                  <AlertDescription data-id="l923z70n6" data-path="src/components/SMSTroubleshootingGuide.tsx">
                    <div className="font-medium mb-2" data-id="e7c00j77u" data-path="src/components/SMSTroubleshootingGuide.tsx">If SMS is completely broken:</div>
                    <ol className="list-decimal list-inside space-y-1 text-sm" data-id="i5dexyftd" data-path="src/components/SMSTroubleshootingGuide.tsx">
                      <li data-id="jxj9bno5z" data-path="src/components/SMSTroubleshootingGuide.tsx">Check Twilio service status at status.twilio.com</li>
                      <li data-id="p28zlcbwo" data-path="src/components/SMSTroubleshootingGuide.tsx">Verify your account hasn't been suspended</li>
                      <li data-id="ij381tueh" data-path="src/components/SMSTroubleshootingGuide.tsx">Test with the simplest possible message to your own number</li>
                      <li data-id="8bg3pvzj2" data-path="src/components/SMSTroubleshootingGuide.tsx">Check application logs for any error messages</li>
                      <li data-id="9av72vjo2" data-path="src/components/SMSTroubleshootingGuide.tsx">Contact Twilio support if all else fails</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>);

};

export default SMSTroubleshootingGuide;
