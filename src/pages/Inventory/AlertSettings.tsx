import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Bell, Mail, AlertTriangle, Settings } from 'lucide-react';

interface AlertSettings {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  emailNotifications: boolean;
  autoReorderSuggestions: boolean;
  alertFrequency: string;
  notificationEmails: string[];
  businessHoursOnly: boolean;
  weekendsIncluded: boolean;
}

const AlertSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    emailNotifications: true,
    autoReorderSuggestions: true,
    alertFrequency: 'daily',
    notificationEmails: ['manager@gasstation.com'],
    businessHoursOnly: false,
    weekendsIncluded: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('inventoryAlertSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...settings, ...parsedSettings });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  };

  const handleInputChange = (field: keyof AlertSettings, value: string | number | boolean | string[]) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailListChange = (emails: string) => {
    const emailArray = emails.split(',').map((email) => email.trim()).filter((email) => email);
    handleInputChange('notificationEmails', emailArray);
  };

  const validateSettings = (): boolean => {
    if (settings.criticalStockThreshold >= settings.lowStockThreshold) {
      toast({
        title: 'Validation Error',
        description: 'Critical stock threshold must be lower than low stock threshold',
        variant: 'destructive'
      });
      return false;
    }

    if (settings.criticalStockThreshold < 0 || settings.lowStockThreshold < 0) {
      toast({
        title: 'Validation Error',
        description: 'Stock thresholds must be positive numbers',
        variant: 'destructive'
      });
      return false;
    }

    if (settings.emailNotifications && settings.notificationEmails.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please provide at least one email address for notifications',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setLoading(true);
    try {
      localStorage.setItem('inventoryAlertSettings', JSON.stringify(settings));

      toast({
        title: 'Settings Saved',
        description: 'Alert settings have been updated successfully'
      });

      // Optional: Send a test email to verify settings
      if (settings.emailNotifications) {
        try {
          // TODO: Implement proper email service using Supabase Edge Functions or external service
          console.log('Confirmation email would be sent:', {
            from: 'support@gasstation.com',
            to: settings.notificationEmails,
            subject: '✅ Inventory Alert Settings Updated',
            html: `
              <h2>Inventory Alert Settings Updated</h2>
              <p>Your inventory alert settings have been successfully updated with the following configuration:</p>
              <ul>
                <li><strong>Low Stock Threshold:</strong> ${settings.lowStockThreshold} units</li>
                <li><strong>Critical Stock Threshold:</strong> ${settings.criticalStockThreshold} units</li>
                <li><strong>Email Notifications:</strong> ${settings.emailNotifications ? 'Enabled' : 'Disabled'}</li>
                <li><strong>Alert Frequency:</strong> ${settings.alertFrequency}</li>
                <li><strong>Auto Reorder Suggestions:</strong> ${settings.autoReorderSuggestions ? 'Enabled' : 'Disabled'}</li>
              </ul>
              <p>This is a confirmation email to verify that notifications are working correctly.</p>
              <p><em>Generated at: ${new Date().toLocaleString()}</em></p>
            `
          });
        } catch (emailError) {
          console.error('Error preparing confirmation email:', emailError);
          toast({
            title: 'Warning',
            description: 'Settings saved but email service needs implementation',
            variant: 'destructive'
          });
        }
      }

      setTimeout(() => navigate('/inventory/alerts'), 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save alert settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    try {
      // TODO: Implement proper email service using Supabase Edge Functions or external service
      console.log('Test alert email would be sent:', {
        from: 'support@gasstation.com',
        to: settings.notificationEmails,
        subject: '🧪 Test Inventory Alert',
        html: `
          <h2>🧪 Test Inventory Alert</h2>
          <p>This is a test alert to verify your email notification settings are working correctly.</p>
          
          <div style="background-color: #fee; border: 1px solid #fcc; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #c53030; margin: 0 0 10px 0;">⚠️ Simulated Critical Stock Alert</h3>
            <p><strong>Product:</strong> Test Product ABC</p>
            <p><strong>Current Stock:</strong> 2 units</p>
            <p><strong>Minimum Stock:</strong> 10 units</p>
            <p><strong>Supplier:</strong> Test Supplier</p>
          </div>
          
          <div style="background-color: #fef5e7; border: 1px solid #fbd38d; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #c05621; margin: 0 0 10px 0;">📉 Simulated Low Stock Alert</h3>
            <p><strong>Product:</strong> Test Product XYZ</p>
            <p><strong>Current Stock:</strong> 8 units</p>
            <p><strong>Minimum Stock:</strong> 15 units</p>
            <p><strong>Supplier:</strong> Test Supplier</p>
          </div>
          
          <p><strong>Alert Settings:</strong></p>
          <ul>
            <li>Low Stock Threshold: ${settings.lowStockThreshold} units</li>
            <li>Critical Stock Threshold: ${settings.criticalStockThreshold} units</li>
            <li>Alert Frequency: ${settings.alertFrequency}</li>
          </ul>
          
          <p>If you received this email, your alert notifications are configured correctly!</p>
          <p><em>Test sent at: ${new Date().toLocaleString()}</em></p>
        `
      });

      toast({
        title: 'Test Alert Prepared',
        description: 'Test alert logged to console (email service needs implementation)'
      });
    } catch (error) {
      console.error('Error preparing test alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare test alert email',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6" data-id="815loxi97" data-path="src/pages/Inventory/AlertSettings.tsx">
      <div className="flex items-center gap-4" data-id="173gt7iqv" data-path="src/pages/Inventory/AlertSettings.tsx">
        <Button variant="ghost" onClick={() => navigate('/inventory/alerts')} data-id="9m82kt0ea" data-path="src/pages/Inventory/AlertSettings.tsx">
          <ArrowLeft className="h-4 w-4 mr-2" data-id="fwof5cnef" data-path="src/pages/Inventory/AlertSettings.tsx" />
          Back to Alerts
        </Button>
        <div data-id="eelvj0u5t" data-path="src/pages/Inventory/AlertSettings.tsx">
          <h1 className="text-3xl font-bold" data-id="kfpl43xlh" data-path="src/pages/Inventory/AlertSettings.tsx">Alert Settings</h1>
          <p className="text-muted-foreground" data-id="whwg39ftq" data-path="src/pages/Inventory/AlertSettings.tsx">Configure inventory alert thresholds and notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-id="ycuq1mugi" data-path="src/pages/Inventory/AlertSettings.tsx">
        {/* Stock Thresholds */}
        <Card className="lg:col-span-2" data-id="tvru1ktzc" data-path="src/pages/Inventory/AlertSettings.tsx">
          <CardHeader data-id="233aee8le" data-path="src/pages/Inventory/AlertSettings.tsx">
            <CardTitle className="flex items-center gap-2" data-id="put4obprf" data-path="src/pages/Inventory/AlertSettings.tsx">
              <AlertTriangle className="h-5 w-5" data-id="6aglqpb5h" data-path="src/pages/Inventory/AlertSettings.tsx" />
              Stock Thresholds
            </CardTitle>
            <CardDescription data-id="lv9jyvoyr" data-path="src/pages/Inventory/AlertSettings.tsx">
              Set the stock levels that trigger low stock and critical stock alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6" data-id="jid13z79r" data-path="src/pages/Inventory/AlertSettings.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="9ht2hsnk1" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div className="space-y-2" data-id="776617bbr" data-path="src/pages/Inventory/AlertSettings.tsx">
                <Label htmlFor="lowStockThreshold" data-id="0ois4v0dx" data-path="src/pages/Inventory/AlertSettings.tsx">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="1"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)} data-id="fatn0ws63" data-path="src/pages/Inventory/AlertSettings.tsx" />

                <p className="text-sm text-muted-foreground" data-id="tv8qnrjly" data-path="src/pages/Inventory/AlertSettings.tsx">
                  Alert when stock falls below this level
                </p>
              </div>

              <div className="space-y-2" data-id="ioqpq75uw" data-path="src/pages/Inventory/AlertSettings.tsx">
                <Label htmlFor="criticalStockThreshold" data-id="9y7fvdbjr" data-path="src/pages/Inventory/AlertSettings.tsx">Critical Stock Threshold</Label>
                <Input
                  id="criticalStockThreshold"
                  type="number"
                  min="1"
                  value={settings.criticalStockThreshold}
                  onChange={(e) => handleInputChange('criticalStockThreshold', parseInt(e.target.value) || 0)} data-id="g0q6rc3ba" data-path="src/pages/Inventory/AlertSettings.tsx" />

                <p className="text-sm text-muted-foreground" data-id="6ubp2dhi4" data-path="src/pages/Inventory/AlertSettings.tsx">
                  Urgent alert when stock falls below this level
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="njqzrcqp5" data-path="src/pages/Inventory/AlertSettings.tsx">
              <h4 className="font-medium text-blue-900 mb-2" data-id="z3k52eq0k" data-path="src/pages/Inventory/AlertSettings.tsx">Threshold Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1" data-id="77radq7uk" data-path="src/pages/Inventory/AlertSettings.tsx">
                <li data-id="2ffze2mi2" data-path="src/pages/Inventory/AlertSettings.tsx">• Critical threshold should be lower than low stock threshold</li>
                <li data-id="5vbi3mrke" data-path="src/pages/Inventory/AlertSettings.tsx">• Consider your supplier lead times when setting thresholds</li>
                <li data-id="ihmzxgv7s" data-path="src/pages/Inventory/AlertSettings.tsx">• Higher-volume products may need higher thresholds</li>
                <li data-id="y5ctuqokr" data-path="src/pages/Inventory/AlertSettings.tsx">• Review and adjust thresholds based on sales patterns</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Preview */}
        <Card data-id="w3l69u1e2" data-path="src/pages/Inventory/AlertSettings.tsx">
          <CardHeader data-id="mvd0ve869" data-path="src/pages/Inventory/AlertSettings.tsx">
            <CardTitle data-id="qyxwnbqhj" data-path="src/pages/Inventory/AlertSettings.tsx">Current Status</CardTitle>
            <CardDescription data-id="bo6qntoq9" data-path="src/pages/Inventory/AlertSettings.tsx">Preview of how your settings will work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" data-id="jbqrnztxp" data-path="src/pages/Inventory/AlertSettings.tsx">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200" data-id="u7tlieaq9" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div data-id="qndibm5mg" data-path="src/pages/Inventory/AlertSettings.tsx">
                <div className="font-medium text-red-900" data-id="oynwdg1yg" data-path="src/pages/Inventory/AlertSettings.tsx">Critical Alert</div>
                <div className="text-sm text-red-700" data-id="j45neolmq" data-path="src/pages/Inventory/AlertSettings.tsx">≤ {settings.criticalStockThreshold} units</div>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" data-id="fgopsnsih" data-path="src/pages/Inventory/AlertSettings.tsx" />
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200" data-id="whf0s3j9j" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div data-id="2imj6w7hm" data-path="src/pages/Inventory/AlertSettings.tsx">
                <div className="font-medium text-orange-900" data-id="ct0901qnz" data-path="src/pages/Inventory/AlertSettings.tsx">Low Stock Alert</div>
                <div className="text-sm text-orange-700" data-id="ddhltn2t4" data-path="src/pages/Inventory/AlertSettings.tsx">≤ {settings.lowStockThreshold} units</div>
              </div>
              <Bell className="h-6 w-6 text-orange-600" data-id="mivlt7s0l" data-path="src/pages/Inventory/AlertSettings.tsx" />
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200" data-id="b24zibsce" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div data-id="dw0q042fk" data-path="src/pages/Inventory/AlertSettings.tsx">
                <div className="font-medium text-green-900" data-id="vjrijdvfc" data-path="src/pages/Inventory/AlertSettings.tsx">Good Stock</div>
                <div className="text-sm text-green-700" data-id="29z6cccw8" data-path="src/pages/Inventory/AlertSettings.tsx">&gt; {settings.lowStockThreshold} units</div>
              </div>
              <div className="h-6 w-6 bg-green-600 rounded-full" data-id="204r8i80t" data-path="src/pages/Inventory/AlertSettings.tsx"></div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="lg:col-span-2" data-id="ma1egok2s" data-path="src/pages/Inventory/AlertSettings.tsx">
          <CardHeader data-id="q5upke463" data-path="src/pages/Inventory/AlertSettings.tsx">
            <CardTitle className="flex items-center gap-2" data-id="1c7lwoft3" data-path="src/pages/Inventory/AlertSettings.tsx">
              <Mail className="h-5 w-5" data-id="wu7j50ay1" data-path="src/pages/Inventory/AlertSettings.tsx" />
              Email Notifications
            </CardTitle>
            <CardDescription data-id="e7anoh3gr" data-path="src/pages/Inventory/AlertSettings.tsx">
              Configure how and when you receive alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6" data-id="tgaqxusq4" data-path="src/pages/Inventory/AlertSettings.tsx">
            <div className="flex items-center justify-between" data-id="bf64zxt6w" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div className="space-y-0.5" data-id="z9ogtlyzf" data-path="src/pages/Inventory/AlertSettings.tsx">
                <Label data-id="s6p0hhx37" data-path="src/pages/Inventory/AlertSettings.tsx">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground" data-id="nu9i9q7r6" data-path="src/pages/Inventory/AlertSettings.tsx">
                  Receive alerts via email when stock levels are low
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)} data-id="26tli3q1w" data-path="src/pages/Inventory/AlertSettings.tsx" />

            </div>

            {settings.emailNotifications &&
            <>
                <div className="space-y-2" data-id="afb0do6nk" data-path="src/pages/Inventory/AlertSettings.tsx">
                  <Label htmlFor="notificationEmails" data-id="vjr33a3z9" data-path="src/pages/Inventory/AlertSettings.tsx">Notification Email Addresses</Label>
                  <Input
                  id="notificationEmails"
                  type="email"
                  value={settings.notificationEmails.join(', ')}
                  onChange={(e) => handleEmailListChange(e.target.value)}
                  placeholder="manager@example.com, assistant@example.com" data-id="pkseyval0" data-path="src/pages/Inventory/AlertSettings.tsx" />

                  <p className="text-sm text-muted-foreground" data-id="qhsts3ca5" data-path="src/pages/Inventory/AlertSettings.tsx">
                    Enter multiple email addresses separated by commas
                  </p>
                </div>

                <div className="flex items-center justify-between" data-id="e3q81opz9" data-path="src/pages/Inventory/AlertSettings.tsx">
                  <div className="space-y-0.5" data-id="a23alr14w" data-path="src/pages/Inventory/AlertSettings.tsx">
                    <Label data-id="w1aq5p9rv" data-path="src/pages/Inventory/AlertSettings.tsx">Business Hours Only</Label>
                    <p className="text-sm text-muted-foreground" data-id="ytlgokqi2" data-path="src/pages/Inventory/AlertSettings.tsx">
                      Only send alerts during business hours (9 AM - 6 PM)
                    </p>
                  </div>
                  <Switch
                  checked={settings.businessHoursOnly}
                  onCheckedChange={(checked) => handleInputChange('businessHoursOnly', checked)} data-id="n1ay5scmj" data-path="src/pages/Inventory/AlertSettings.tsx" />

                </div>

                <div className="flex items-center justify-between" data-id="v2wu1wg4q" data-path="src/pages/Inventory/AlertSettings.tsx">
                  <div className="space-y-0.5" data-id="6u8le8hwd" data-path="src/pages/Inventory/AlertSettings.tsx">
                    <Label data-id="q3z8248wf" data-path="src/pages/Inventory/AlertSettings.tsx">Include Weekends</Label>
                    <p className="text-sm text-muted-foreground" data-id="k0v3b98sw" data-path="src/pages/Inventory/AlertSettings.tsx">
                      Send alerts on weekends and holidays
                    </p>
                  </div>
                  <Switch
                  checked={settings.weekendsIncluded}
                  onCheckedChange={(checked) => handleInputChange('weekendsIncluded', checked)} data-id="3rzpth5v5" data-path="src/pages/Inventory/AlertSettings.tsx" />

                </div>

                <Button variant="outline" onClick={sendTestAlert} className="w-full" data-id="x4kephw93" data-path="src/pages/Inventory/AlertSettings.tsx">
                  <Mail className="h-4 w-4 mr-2" data-id="nk0tuhx9v" data-path="src/pages/Inventory/AlertSettings.tsx" />
                  Send Test Alert Email
                </Button>
              </>
            }
          </CardContent>
        </Card>

        {/* Additional Features */}
        <Card data-id="uflp6ttev" data-path="src/pages/Inventory/AlertSettings.tsx">
          <CardHeader data-id="1fgt4eyer" data-path="src/pages/Inventory/AlertSettings.tsx">
            <CardTitle className="flex items-center gap-2" data-id="9dm7m8dgi" data-path="src/pages/Inventory/AlertSettings.tsx">
              <Settings className="h-5 w-5" data-id="lyg16knz7" data-path="src/pages/Inventory/AlertSettings.tsx" />
              Additional Features
            </CardTitle>
            <CardDescription data-id="iv4wkyc09" data-path="src/pages/Inventory/AlertSettings.tsx">Extra automation and suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" data-id="8zmn350n1" data-path="src/pages/Inventory/AlertSettings.tsx">
            <div className="flex items-center justify-between" data-id="c17d4r2pi" data-path="src/pages/Inventory/AlertSettings.tsx">
              <div className="space-y-0.5" data-id="dups66881" data-path="src/pages/Inventory/AlertSettings.tsx">
                <Label data-id="ckv4unr8a" data-path="src/pages/Inventory/AlertSettings.tsx">Auto Reorder Suggestions</Label>
                <p className="text-sm text-muted-foreground" data-id="mpfdrzi8y" data-path="src/pages/Inventory/AlertSettings.tsx">
                  Suggest reorder quantities based on sales history
                </p>
              </div>
              <Switch
                checked={settings.autoReorderSuggestions}
                onCheckedChange={(checked) => handleInputChange('autoReorderSuggestions', checked)} data-id="dja1dz7tj" data-path="src/pages/Inventory/AlertSettings.tsx" />

            </div>

            <div className="space-y-2" data-id="ehxaubuhh" data-path="src/pages/Inventory/AlertSettings.tsx">
              <Label htmlFor="alertFrequency" data-id="5syyw8gm6" data-path="src/pages/Inventory/AlertSettings.tsx">Alert Frequency</Label>
              <select
                id="alertFrequency"
                value={settings.alertFrequency}
                onChange={(e) => handleInputChange('alertFrequency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-id="4xwa4ed0g" data-path="src/pages/Inventory/AlertSettings.tsx">

                <option value="realtime" data-id="63iowiu4x" data-path="src/pages/Inventory/AlertSettings.tsx">Real-time</option>
                <option value="hourly" data-id="fi6kzp4v0" data-path="src/pages/Inventory/AlertSettings.tsx">Hourly</option>
                <option value="daily" data-id="y1spbqdof" data-path="src/pages/Inventory/AlertSettings.tsx">Daily</option>
                <option value="weekly" data-id="vd0lro2en" data-path="src/pages/Inventory/AlertSettings.tsx">Weekly</option>
              </select>
              <p className="text-sm text-muted-foreground" data-id="8od6t2u1q" data-path="src/pages/Inventory/AlertSettings.tsx">
                How often to check and send alerts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Actions */}
      <div className="flex justify-end gap-4" data-id="7mecnue49" data-path="src/pages/Inventory/AlertSettings.tsx">
        <Button variant="outline" onClick={() => navigate('/inventory/alerts')} data-id="895ela90q" data-path="src/pages/Inventory/AlertSettings.tsx">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading} data-id="go3n2vymf" data-path="src/pages/Inventory/AlertSettings.tsx">
          {loading ?
          <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" data-id="rb3yjtsbo" data-path="src/pages/Inventory/AlertSettings.tsx"></div>
              Saving...
            </> :

          <>
              <Save className="h-4 w-4 mr-2" data-id="fnm2mcztg" data-path="src/pages/Inventory/AlertSettings.tsx" />
              Save Settings
            </>
          }
        </Button>
      </div>
    </div>);

};

export default AlertSettingsPage;