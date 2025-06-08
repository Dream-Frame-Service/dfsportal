import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Send, Phone, MessageSquare, AlertCircle, CheckCircle, Loader2, User } from 'lucide-react';
import { smsService } from '@/services/smsService';
import SMSTestConnection from '@/components/SMSTestConnection';

interface SMSContact {
  id: number;
  contact_name: string;
  mobile_number: string;
  station: string;
  is_active: boolean;
  contact_role: string;
}

interface SMSProvider {
  id: number;
  provider_name: string;
  from_number: string;
  is_active: boolean;
  test_mode: boolean;
  monthly_limit: number;
  current_month_count: number;
}

const CustomSMSSendingForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [fromNumber, setFromNumber] = useState('');
  const [contacts, setContacts] = useState<SMSContact[]>([]);
  const [providers, setProviders] = useState<SMSProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [lastSentMessage, setLastSentMessage] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
    loadProviders();
    loadSMSService();
  }, []);

  const loadSMSService = async () => {
    try {
      await smsService.loadConfiguration();
    } catch (error) {
      console.error('Error loading SMS service:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage('12612', {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'contact_name',
        IsAsc: true,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });
      if (error) throw error;
      setContacts(data?.List || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS contacts",
        variant: "destructive"
      });
    }
  };

  const loadProviders = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage('12640', {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });
      if (error) throw error;
      const providerList = data?.List || [];
      setProviders(providerList);

      // Auto-select the first active provider
      if (providerList.length > 0 && !fromNumber) {
        setFromNumber(providerList[0].from_number);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS providers",
        variant: "destructive"
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!phoneNumber.trim()) {
      errors.push('Phone number is required');
    } else if (!isValidPhoneNumber(phoneNumber)) {
      errors.push('Please enter a valid phone number (e.g., +1234567890 or 1234567890)');
    }

    if (!message.trim()) {
      errors.push('Message content is required');
    } else if (message.length > 1600) {
      errors.push('Message is too long (maximum 1600 characters)');
    }

    if (!fromNumber) {
      errors.push('Please select a sender number');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/[^\d]/g, '');

    // Check if it's a valid length (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }

    // US phone number validation (10 or 11 digits)
    if (cleaned.length === 10 || cleaned.length === 11 && cleaned.startsWith('1')) {
      return true;
    }

    // International numbers (10-15 digits)
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/[^\d]/g, '');

    // Add + prefix if not present
    if (!phone.startsWith('+')) {
      if (cleaned.length === 10) {
        return `+1${cleaned}`;
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`;
      } else {
        return `+${cleaned}`;
      }
    }

    return phone;
  };

  const selectContact = (contact: SMSContact) => {
    setPhoneNumber(contact.mobile_number);
    toast({
      title: "Contact Selected",
      description: `Selected ${contact.contact_name} (${contact.mobile_number})`
    });
  };

  const sendCustomSMS = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setSendingProgress(0);

      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Progress simulation
      const progressInterval = setInterval(() => {
        setSendingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Send SMS using the service with selected from number
      const result = await smsService.sendCustomSMS(formattedPhone, message, fromNumber);

      clearInterval(progressInterval);
      setSendingProgress(100);

      if (result.success) {
        // Log to SMS history
        await window.ezsite.apis.tableCreate('12613', {
          license_id: 0, // Custom message
          contact_id: 0, // Manual entry
          mobile_number: formattedPhone,
          message_content: message,
          sent_date: new Date().toISOString(),
          delivery_status: 'Sent',
          days_before_expiry: 0,
          created_by: 1
        });

        setLastSentMessage({
          phone: formattedPhone,
          message: message,
          timestamp: new Date(),
          messageId: result.messageId
        });

        toast({
          title: "✅ SMS Sent Successfully",
          description: `Message sent to ${formattedPhone}`
        });

        // Clear form
        setMessage('');
        if (!contacts.find((c) => c.mobile_number === formattedPhone)) {
          setPhoneNumber('');
        }
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending custom SMS:', error);
      toast({
        title: "❌ SMS Failed",
        description: error instanceof Error ? error.message : 'Failed to send SMS',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSendingProgress(0);
    }
  };

  const getCharacterCount = () => {
    const count = message.length;
    const smsLength = 160;
    const segments = Math.ceil(count / smsLength);

    return {
      count,
      segments,
      remaining: smsLength - (count % smsLength || smsLength),
      isLong: segments > 1
    };
  };

  const charInfo = getCharacterCount();

  return (
    <div className="space-y-6" data-id="b0i9t05x7" data-path="src/components/CustomSMSSendingForm.tsx">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-id="z77fo09mq" data-path="src/components/CustomSMSSendingForm.tsx">
        <div className="lg:col-span-2" data-id="ux35pw6ru" data-path="src/components/CustomSMSSendingForm.tsx">
          <Card className="w-full" data-id="d1lkxajop" data-path="src/components/CustomSMSSendingForm.tsx">
            <CardHeader data-id="bdxmdpfw4" data-path="src/components/CustomSMSSendingForm.tsx">
              <CardTitle className="flex items-center" data-id="fcrl9q5fk" data-path="src/components/CustomSMSSendingForm.tsx">
                <MessageSquare className="w-5 h-5 mr-2" data-id="q41x07ssr" data-path="src/components/CustomSMSSendingForm.tsx" />
                Send Custom SMS
              </CardTitle>
            </CardHeader>
      <CardContent className="space-y-6" data-id="a6yd3z9p7" data-path="src/components/CustomSMSSendingForm.tsx">
        {validationErrors.length > 0 &&
              <Alert variant="destructive" data-id="t6io0rsq3" data-path="src/components/CustomSMSSendingForm.tsx">
            <AlertCircle className="h-4 w-4" data-id="o4bshrxkg" data-path="src/components/CustomSMSSendingForm.tsx" />
            <AlertDescription data-id="xyaokz3at" data-path="src/components/CustomSMSSendingForm.tsx">
              <ul className="list-disc list-inside space-y-1" data-id="kwcti1z6l" data-path="src/components/CustomSMSSendingForm.tsx">
                {validationErrors.map((error, index) =>
                    <li key={index} data-id="pu1fmogh4" data-path="src/components/CustomSMSSendingForm.tsx">{error}</li>
                    )}
              </ul>
            </AlertDescription>
          </Alert>
              }

        {/* Provider Selection */}
        <div className="space-y-2" data-id="azam3kbzk" data-path="src/components/CustomSMSSendingForm.tsx">
          <Label htmlFor="fromNumber" data-id="chcaxwggm" data-path="src/components/CustomSMSSendingForm.tsx">Send From Number</Label>
          <Select value={fromNumber} onValueChange={setFromNumber} data-id="9ooa4qehp" data-path="src/components/CustomSMSSendingForm.tsx">
            <SelectTrigger data-id="c6oahcbir" data-path="src/components/CustomSMSSendingForm.tsx">
              <SelectValue placeholder="Select sender number" data-id="t3iicq5vh" data-path="src/components/CustomSMSSendingForm.tsx" />
            </SelectTrigger>
            <SelectContent data-id="n5gdbyc1y" data-path="src/components/CustomSMSSendingForm.tsx">
              {providers.map((provider) =>
                    <SelectItem key={provider.id} value={provider.from_number} data-id="o1qgtjo8n" data-path="src/components/CustomSMSSendingForm.tsx">
                  <div className="flex items-center justify-between w-full" data-id="nm0tu16xb" data-path="src/components/CustomSMSSendingForm.tsx">
                    <span data-id="gq0i2qt28" data-path="src/components/CustomSMSSendingForm.tsx">{provider.from_number}</span>
                    <div className="flex items-center space-x-2 ml-4" data-id="dybxt7wgi" data-path="src/components/CustomSMSSendingForm.tsx">
                      <Badge variant={provider.test_mode ? "outline" : "default"} className="text-xs" data-id="4xfzm8ygg" data-path="src/components/CustomSMSSendingForm.tsx">
                        {provider.provider_name}
                      </Badge>
                      {provider.test_mode &&
                          <Badge variant="secondary" className="text-xs" data-id="p28gm0qig" data-path="src/components/CustomSMSSendingForm.tsx">TEST</Badge>
                          }
                    </div>
                  </div>
                </SelectItem>
                    )}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Contact Selection */}
        {contacts.length > 0 &&
              <div className="space-y-2" data-id="0pengc8h5" data-path="src/components/CustomSMSSendingForm.tsx">
            <Label data-id="gfou8r1ri" data-path="src/components/CustomSMSSendingForm.tsx">Quick Select Contact</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" data-id="g9gmsdjuq" data-path="src/components/CustomSMSSendingForm.tsx">
              {contacts.slice(0, 6).map((contact) =>
                  <Button
                    key={contact.id}
                    variant="outline"
                    size="sm"
                    onClick={() => selectContact(contact)}
                    className="justify-start text-left h-auto p-3" data-id="lrc55e5wj" data-path="src/components/CustomSMSSendingForm.tsx">

                  <div className="flex items-center space-x-2" data-id="t4dmh2naq" data-path="src/components/CustomSMSSendingForm.tsx">
                    <User className="w-4 h-4" data-id="fkyjm7k6g" data-path="src/components/CustomSMSSendingForm.tsx" />
                    <div data-id="qanarfxes" data-path="src/components/CustomSMSSendingForm.tsx">
                      <div className="font-medium text-sm" data-id="yd2vasmyg" data-path="src/components/CustomSMSSendingForm.tsx">{contact.contact_name}</div>
                      <div className="text-xs text-muted-foreground" data-id="n2kpgihf0" data-path="src/components/CustomSMSSendingForm.tsx">{contact.mobile_number}</div>
                      <Badge variant="outline" className="text-xs mt-1" data-id="ndbozbbtv" data-path="src/components/CustomSMSSendingForm.tsx">{contact.station}</Badge>
                    </div>
                  </div>
                </Button>
                  )}
            </div>
          </div>
              }

        {/* Phone Number Input */}
        <div className="space-y-2" data-id="n8nv3rnti" data-path="src/components/CustomSMSSendingForm.tsx">
          <Label htmlFor="phoneNumber" data-id="8eafwrqwu" data-path="src/components/CustomSMSSendingForm.tsx">
            Recipient Phone Number
            <span className="text-red-500 ml-1" data-id="x7el1pc3t" data-path="src/components/CustomSMSSendingForm.tsx">*</span>
          </Label>
          <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890 or 1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={validationErrors.some((e) => e.includes('Phone')) ? "border-red-500" : ""} data-id="20dxdons3" data-path="src/components/CustomSMSSendingForm.tsx" />

          <p className="text-sm text-muted-foreground" data-id="pt1nvoxoo" data-path="src/components/CustomSMSSendingForm.tsx">
            Enter a valid phone number (US: 1234567890, International: +1234567890)
          </p>
        </div>

        {/* Message Input */}
        <div className="space-y-2" data-id="py3u7lqnx" data-path="src/components/CustomSMSSendingForm.tsx">
          <Label htmlFor="message" data-id="xqqn71uei" data-path="src/components/CustomSMSSendingForm.tsx">
            Message Content
            <span className="text-red-500 ml-1" data-id="9cm9nt4ti" data-path="src/components/CustomSMSSendingForm.tsx">*</span>
          </Label>
          <Textarea
                  id="message"
                  placeholder="Type your custom SMS message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={validationErrors.some((e) => e.includes('Message')) ? "border-red-500" : ""} data-id="9avkopser" data-path="src/components/CustomSMSSendingForm.tsx" />

          <div className="flex justify-between items-center text-sm" data-id="w6ift44jb" data-path="src/components/CustomSMSSendingForm.tsx">
            <span className={`${charInfo.count > 1500 ? 'text-red-500' : 'text-muted-foreground'}`} data-id="y25orxyk8" data-path="src/components/CustomSMSSendingForm.tsx">
              {charInfo.count}/1600 characters
            </span>
            <div className="flex items-center space-x-2" data-id="jxnxco4rr" data-path="src/components/CustomSMSSendingForm.tsx">
              {charInfo.isLong &&
                    <Badge variant="outline" className="text-xs" data-id="ecgky18sc" data-path="src/components/CustomSMSSendingForm.tsx">
                  {charInfo.segments} SMS segments
                </Badge>
                    }
              <span className="text-muted-foreground" data-id="jjj7nfv7p" data-path="src/components/CustomSMSSendingForm.tsx">
                {charInfo.remaining} remaining in current segment
              </span>
            </div>
          </div>
        </div>

        {/* Sending Progress */}
        {loading &&
              <div className="space-y-2" data-id="pu6zrgen3" data-path="src/components/CustomSMSSendingForm.tsx">
            <div className="flex items-center space-x-2" data-id="njag10vfl" data-path="src/components/CustomSMSSendingForm.tsx">
              <Loader2 className="w-4 h-4 animate-spin" data-id="jv43mil8e" data-path="src/components/CustomSMSSendingForm.tsx" />
              <span className="text-sm" data-id="lzq48ac9k" data-path="src/components/CustomSMSSendingForm.tsx">Sending SMS...</span>
            </div>
            <Progress value={sendingProgress} className="w-full" data-id="c85cu0zsf" data-path="src/components/CustomSMSSendingForm.tsx" />
          </div>
              }

        {/* Last Sent Message Info */}
        {lastSentMessage &&
              <Alert className="border-green-200 bg-green-50" data-id="4d6sc0mze" data-path="src/components/CustomSMSSendingForm.tsx">
            <CheckCircle className="h-4 w-4 text-green-600" data-id="pfn8808ev" data-path="src/components/CustomSMSSendingForm.tsx" />
            <AlertDescription data-id="9n1oob21u" data-path="src/components/CustomSMSSendingForm.tsx">
              <div className="text-green-800" data-id="j9tp2tf8a" data-path="src/components/CustomSMSSendingForm.tsx">
                <strong data-id="6oagc5jmu" data-path="src/components/CustomSMSSendingForm.tsx">Last message sent successfully:</strong>
                <div className="mt-2 space-y-1 text-sm" data-id="y4ivfntlp" data-path="src/components/CustomSMSSendingForm.tsx">
                  <div data-id="mcejh0fod" data-path="src/components/CustomSMSSendingForm.tsx"><strong data-id="3xdh5731v" data-path="src/components/CustomSMSSendingForm.tsx">To:</strong> {lastSentMessage.phone}</div>
                  <div data-id="vmwwnuv8j" data-path="src/components/CustomSMSSendingForm.tsx"><strong data-id="foj13qa18" data-path="src/components/CustomSMSSendingForm.tsx">At:</strong> {lastSentMessage.timestamp.toLocaleString()}</div>
                  <div data-id="0w93g9i9t" data-path="src/components/CustomSMSSendingForm.tsx"><strong data-id="9kvp5nzq9" data-path="src/components/CustomSMSSendingForm.tsx">Message ID:</strong> {lastSentMessage.messageId}</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
              }

        {/* Send Button */}
        <Button
                onClick={sendCustomSMS}
                disabled={loading || !phoneNumber || !message || !fromNumber}
                className="w-full"
                size="lg" data-id="qmsm3hnm7" data-path="src/components/CustomSMSSendingForm.tsx">

          <Send className="w-4 h-4 mr-2" data-id="teqh0ji4t" data-path="src/components/CustomSMSSendingForm.tsx" />
          {loading ? 'Sending...' : 'Send SMS'}
        </Button>

        {/* Usage Info */}
        {providers.length > 0 &&
              <div className="pt-4 border-t" data-id="kqqfx80y5" data-path="src/components/CustomSMSSendingForm.tsx">
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground" data-id="c39uo4gte" data-path="src/components/CustomSMSSendingForm.tsx">
              <div data-id="sy4cwnjg7" data-path="src/components/CustomSMSSendingForm.tsx">
                <strong data-id="zm2bwqmjy" data-path="src/components/CustomSMSSendingForm.tsx">Service Status:</strong>
                <div className="flex items-center mt-1" data-id="elobv2yef" data-path="src/components/CustomSMSSendingForm.tsx">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" data-id="dwh7ygpxv" data-path="src/components/CustomSMSSendingForm.tsx" />
                  SMS Service Active
                </div>
              </div>
              <div data-id="s5utcbty3" data-path="src/components/CustomSMSSendingForm.tsx">
                <strong data-id="zfghmxd7o" data-path="src/components/CustomSMSSendingForm.tsx">Monthly Usage:</strong>
                <div className="mt-1" data-id="xc09uxj51" data-path="src/components/CustomSMSSendingForm.tsx">
                  {providers[0]?.current_month_count || 0} / {providers[0]?.monthly_limit || 1000} messages
                </div>
              </div>
            </div>
          </div>
              }
      </CardContent>
    </Card>
        </div>
        
        <div className="space-y-6" data-id="lk3qyrl4v" data-path="src/components/CustomSMSSendingForm.tsx">
          <SMSTestConnection data-id="obrsid3xj" data-path="src/components/CustomSMSSendingForm.tsx" />
        </div>
      </div>
    </div>);

};

export default CustomSMSSendingForm;