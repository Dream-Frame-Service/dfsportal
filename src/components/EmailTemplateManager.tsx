import React, { useState, useEffect } from 'react';
import DatabaseService from '@/services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  Send,
  FileText,
  Code,
  Variables,
  Save,
  RefreshCw } from
'lucide-react';

interface EmailTemplate {
  id?: number;
  template_name: string;
  template_type: string;
  subject: string;
  html_content: string;
  text_content: string;
  is_active: boolean;
  variables: string;
  preview_data: string;
  usage_count: number;
  last_used: string;
  created_by?: number;
}

interface TemplatePreviewData {
  [key: string]: string;
}

const EmailTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<TemplatePreviewData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const { toast } = useToast();

  // Template types
  const templateTypes = [
  'License Alert',
  'Sales Report',
  'Delivery Report',
  'System Notification',
  'Employee Alert',
  'Custom'];


  // Common variables for different template types
  const commonVariables = {
    'License Alert': ['license_name', 'station_name', 'expiry_date', 'days_remaining', 'recipient_name'],
    'Sales Report': ['report_date', 'station_name', 'total_sales', 'fuel_sales', 'store_sales'],
    'Delivery Report': ['delivery_date', 'station_name', 'fuel_type', 'amount_delivered', 'bol_number'],
    'System Notification': ['notification_type', 'message', 'timestamp', 'system_name'],
    'Employee Alert': ['employee_name', 'station_name', 'alert_type', 'message', 'date'],
    'Custom': []
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      console.log('Loading email templates...');
      // Mock data until database tables are created
      setTemplates([
      {
        id: 1,
        template_name: 'License Expiry Alert',
        template_type: 'License Alert',
        subject: 'URGENT: License "{license_name}" expires in {days_remaining} days',
        html_content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">🚨 License Expiry Alert</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333; margin-top: 0;">Dear {recipient_name},</h2>
                
                <div style="background: #fff; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0;">
                  <h3 style="color: #ff6b6b; margin-top: 0;">License Expiring Soon!</h3>
                  <p><strong>License:</strong> {license_name}</p>
                  <p><strong>Station:</strong> {station_name}</p>
                  <p><strong>Expiry Date:</strong> {expiry_date}</p>
                  <p><strong>Days Remaining:</strong> <span style="color: #ff6b6b; font-size: 18px; font-weight: bold;">{days_remaining}</span></p>
                </div>
                
                <p>Please take immediate action to renew this license to avoid any business disruption.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View License Details</a>
                </div>
              </div>
              
              <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
                <p>This is an automated message from DFS Manager System</p>
                <p>© ${new Date().getFullYear()} DFS Manager. All rights reserved.</p>
              </div>
            </div>
          `,
        text_content: 'URGENT: License "{license_name}" for {station_name} expires on {expiry_date}. Days remaining: {days_remaining}. Please renew immediately.',
        is_active: true,
        variables: 'license_name,station_name,expiry_date,days_remaining,recipient_name',
        preview_data: JSON.stringify({
          license_name: 'Business License 2024',
          station_name: 'MOBIL Station',
          expiry_date: '2024-03-15',
          days_remaining: '15',
          recipient_name: 'John Manager'
        }),
        usage_count: 45,
        last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        template_name: 'Daily Sales Summary',
        template_type: 'Sales Report',
        subject: 'Daily Sales Report - {station_name} ({report_date})',
        html_content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">📊 Daily Sales Report</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333; margin-top: 0;">Sales Summary for {report_date}</h2>
                <h3 style="color: #666;">Station: {station_name}</h3>
                
                <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f1f5f9;">
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Category</th>
                      <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Amount</th>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Total Sales</td>
                      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #059669;">\${total_sales}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Fuel Sales</td>
                      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">\${fuel_sales}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Store Sales</td>
                      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">\${store_sales}</td>
                    </tr>
                  </table>
                </div>
                
                <p style="color: #666; font-style: italic;">Generated automatically by DFS Manager at {timestamp}</p>
              </div>
              
              <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
                <p>DFS Manager - Automated Sales Reporting</p>
              </div>
            </div>
          `,
        text_content: 'Daily Sales Report for {station_name} on {report_date}: Total Sales: ${total_sales}, Fuel: ${fuel_sales}, Store: ${store_sales}',
        is_active: true,
        variables: 'report_date,station_name,total_sales,fuel_sales,store_sales,timestamp',
        preview_data: JSON.stringify({
          report_date: '2024-02-15',
          station_name: 'AMOCO ROSEDALE',
          total_sales: '12,450.75',
          fuel_sales: '8,230.50',
          store_sales: '4,220.25',
          timestamp: new Date().toLocaleString()
        }),
        usage_count: 120,
        last_used: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        template_name: 'System Maintenance Alert',
        template_type: 'System Notification',
        subject: 'Scheduled Maintenance - {system_name}',
        html_content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">⚠️ System Maintenance Notice</h1>
              </div>
              
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333; margin-top: 0;">Scheduled Maintenance</h2>
                
                <div style="background: #fff; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                  <h3 style="color: #f59e0b; margin-top: 0;">System: {system_name}</h3>
                  <p><strong>Type:</strong> {notification_type}</p>
                  <p><strong>Scheduled Time:</strong> {timestamp}</p>
                  <p><strong>Message:</strong> {message}</p>
                </div>
                
                <p>Please plan accordingly and save any work in progress.</p>
              </div>
              
              <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px;">
                <p>DFS Manager System Notifications</p>
              </div>
            </div>
          `,
        text_content: 'System Maintenance: {system_name} - {notification_type} at {timestamp}. {message}',
        is_active: true,
        variables: 'system_name,notification_type,timestamp,message',
        preview_data: JSON.stringify({
          system_name: 'DFS Manager Portal',
          notification_type: 'Database Maintenance',
          timestamp: '2024-02-20 02:00 AM',
          message: 'System will be unavailable for approximately 30 minutes'
        }),
        usage_count: 8,
        last_used: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }]
      );
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewTemplate = () => {
    setEditingTemplate({
      template_name: '',
      template_type: 'Custom',
      subject: '',
      html_content: '',
      text_content: '',
      is_active: true,
      variables: '',
      preview_data: '{}',
      usage_count: 0,
      last_used: ''
    });
    setIsDialogOpen(true);
  };

  const editTemplate = (template: EmailTemplate) => {
    setEditingTemplate({ ...template });
    setIsDialogOpen(true);
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    setSaving(true);
    try {
      if (editingTemplate.id) {
        // Update existing template
        setTemplates((prev) => prev.map((t) =>
        t.id === editingTemplate.id ? { ...editingTemplate } : t
        ));
        toast({
          title: "Template Updated",
          description: "Email template has been updated successfully"
        });
      } else {
        // Create new template
        const newTemplate = {
          ...editingTemplate,
          id: Math.max(...templates.map((t) => t.id || 0)) + 1,
          usage_count: 0,
          last_used: ''
        };
        setTemplates((prev) => [...prev, newTemplate]);
        toast({
          title: "Template Created",
          description: "New email template has been created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const duplicateTemplate = (template: EmailTemplate) => {
    const duplicated = {
      ...template,
      id: undefined,
      template_name: `${template.template_name} (Copy)`,
      usage_count: 0,
      last_used: ''
    };
    setEditingTemplate(duplicated);
    setIsDialogOpen(true);
  };

  const deleteTemplate = async (id: number) => {
    try {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Template Deleted",
        description: "Email template has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const sendTestEmail = async (template: EmailTemplate) => {
    try {
      const testData = JSON.parse(template.preview_data || '{}');
      let processedSubject = template.subject;
      let processedContent = template.html_content;

      // Replace variables in subject and content
      Object.entries(testData).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value as string);
        processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value as string);
      });

      const { error } = await DatabaseService.sendEmail({
        from: 'DFS Manager <support@dfsportal.com>',
        to: ['support@dfsportal.com'], // Send to configured email
        subject: `TEST: ${processedSubject}`,
        html: processedContent,
        text: template.text_content
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: `Test email sent successfully for template: ${template.template_name}`
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    }
  };

  const generatePreview = (template: EmailTemplate) => {
    if (!template.preview_data) return template.html_content;

    try {
      const data = JSON.parse(template.preview_data);
      let preview = template.html_content;

      Object.entries(data).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        preview = preview.replace(new RegExp(placeholder, 'g'), value as string);
      });

      return preview;
    } catch {
      return template.html_content;
    }
  };

  const addVariable = (variable: string) => {
    if (!editingTemplate) return;

    const currentVars = editingTemplate.variables.split(',').filter((v) => v.trim());
    if (!currentVars.includes(variable)) {
      const newVars = [...currentVars, variable].join(',');
      setEditingTemplate({
        ...editingTemplate,
        variables: newVars
      });
    }
  };

  if (loading) {
    return (
      <Card data-id="6vdcwbwby" data-path="src/components/EmailTemplateManager.tsx">
        <CardContent className="p-6" data-id="920g67p0q" data-path="src/components/EmailTemplateManager.tsx">
          <div className="flex items-center justify-center space-x-2" data-id="ffpkbj4a2" data-path="src/components/EmailTemplateManager.tsx">
            <RefreshCw className="w-4 h-4 animate-spin" data-id="bql4ltu2x" data-path="src/components/EmailTemplateManager.tsx" />
            <span data-id="plfqzxnkg" data-path="src/components/EmailTemplateManager.tsx">Loading email templates...</span>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6" data-id="6b5mljiav" data-path="src/components/EmailTemplateManager.tsx">
      <Card data-id="p4dqzq4fj" data-path="src/components/EmailTemplateManager.tsx">
        <CardHeader data-id="8uuyt8vth" data-path="src/components/EmailTemplateManager.tsx">
          <CardTitle className="flex items-center justify-between" data-id="7i55f4rih" data-path="src/components/EmailTemplateManager.tsx">
            <div className="flex items-center space-x-2" data-id="r1rmxygni" data-path="src/components/EmailTemplateManager.tsx">
              <Mail className="w-5 h-5" data-id="48o2qs9g6" data-path="src/components/EmailTemplateManager.tsx" />
              <span data-id="gom92lvtt" data-path="src/components/EmailTemplateManager.tsx">Email Templates</span>
              <Badge variant="secondary" data-id="tf9r40grj" data-path="src/components/EmailTemplateManager.tsx">{templates.length} Templates</Badge>
            </div>
            <Button onClick={createNewTemplate} data-id="0veitv4er" data-path="src/components/EmailTemplateManager.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="4y7hhd6y7" data-path="src/components/EmailTemplateManager.tsx" />
              New Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent data-id="sv6uzulor" data-path="src/components/EmailTemplateManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="ay4f10l6p" data-path="src/components/EmailTemplateManager.tsx">
            {templates.map((template) =>
            <Card key={template.id} className="border hover:shadow-md transition-shadow" data-id="5ciuy4bsq" data-path="src/components/EmailTemplateManager.tsx">
                <CardHeader className="pb-3" data-id="j4lb41m2l" data-path="src/components/EmailTemplateManager.tsx">
                  <div className="flex items-center justify-between" data-id="ubxjswpbm" data-path="src/components/EmailTemplateManager.tsx">
                    <div className="flex items-center space-x-2" data-id="mqa3whzoe" data-path="src/components/EmailTemplateManager.tsx">
                      <FileText className="w-4 h-4 text-blue-600" data-id="9zid57anh" data-path="src/components/EmailTemplateManager.tsx" />
                      <span className="font-medium text-sm" data-id="2zlvhet78" data-path="src/components/EmailTemplateManager.tsx">{template.template_name}</span>
                    </div>
                    <Badge className={template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} data-id="df23idawz" data-path="src/components/EmailTemplateManager.tsx">
                      {template.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600" data-id="za4kioa2g" data-path="src/components/EmailTemplateManager.tsx">{template.template_type}</p>
                </CardHeader>
                <CardContent className="space-y-3" data-id="ms5a1cm64" data-path="src/components/EmailTemplateManager.tsx">
                  <div data-id="mx3uvltsm" data-path="src/components/EmailTemplateManager.tsx">
                    <p className="text-xs text-gray-600" data-id="bo698sak2" data-path="src/components/EmailTemplateManager.tsx">Subject</p>
                    <p className="text-sm font-medium truncate" data-id="i3918n1ql" data-path="src/components/EmailTemplateManager.tsx">{template.subject}</p>
                  </div>
                  
                  <div data-id="gppaurl1p" data-path="src/components/EmailTemplateManager.tsx">
                    <p className="text-xs text-gray-600" data-id="nef9222ma" data-path="src/components/EmailTemplateManager.tsx">Variables</p>
                    <div className="flex flex-wrap gap-1 mt-1" data-id="a23azxgp8" data-path="src/components/EmailTemplateManager.tsx">
                      {template.variables.split(',').slice(0, 3).map((variable, index) =>
                    <Badge key={index} variant="outline" className="text-xs" data-id="djyhk9yhr" data-path="src/components/EmailTemplateManager.tsx">
                          {variable.trim()}
                        </Badge>
                    )}
                      {template.variables.split(',').length > 3 &&
                    <Badge variant="outline" className="text-xs" data-id="ebq63rcsq" data-path="src/components/EmailTemplateManager.tsx">
                          +{template.variables.split(',').length - 3}
                        </Badge>
                    }
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs" data-id="lkoa7juv8" data-path="src/components/EmailTemplateManager.tsx">
                    <div data-id="n79l178cw" data-path="src/components/EmailTemplateManager.tsx">
                      <p className="text-gray-600" data-id="l7sz6m63d" data-path="src/components/EmailTemplateManager.tsx">Used</p>
                      <p className="font-medium" data-id="b1rqbv075" data-path="src/components/EmailTemplateManager.tsx">{template.usage_count} times</p>
                    </div>
                    <div data-id="e9shrrmei" data-path="src/components/EmailTemplateManager.tsx">
                      <p className="text-gray-600" data-id="opcs3k23k" data-path="src/components/EmailTemplateManager.tsx">Last Used</p>
                      <p className="font-medium" data-id="max6pwi7s" data-path="src/components/EmailTemplateManager.tsx">
                        {template.last_used ? new Date(template.last_used).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 pt-2" data-id="fu46ltu2z" data-path="src/components/EmailTemplateManager.tsx">
                    <Button size="sm" variant="outline" onClick={() => editTemplate(template)} className="flex-1" data-id="qixyqddx2" data-path="src/components/EmailTemplateManager.tsx">
                      <Edit className="w-3 h-3" data-id="w30vd2gbu" data-path="src/components/EmailTemplateManager.tsx" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template)} data-id="gwhh2dg6z" data-path="src/components/EmailTemplateManager.tsx">
                      <Copy className="w-3 h-3" data-id="4hwh5rde2" data-path="src/components/EmailTemplateManager.tsx" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => sendTestEmail(template)} data-id="inilr3ocx" data-path="src/components/EmailTemplateManager.tsx">
                      <Send className="w-3 h-3" data-id="y3s7d9rdk" data-path="src/components/EmailTemplateManager.tsx" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteTemplate(template.id!)} data-id="yt2j5e3tu" data-path="src/components/EmailTemplateManager.tsx">
                      <Trash2 className="w-3 h-3" data-id="a423ems02" data-path="src/components/EmailTemplateManager.tsx" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} data-id="mlvnvtgvr" data-path="src/components/EmailTemplateManager.tsx">
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-id="yil8qrnb5" data-path="src/components/EmailTemplateManager.tsx">
          <DialogHeader data-id="v62897w0y" data-path="src/components/EmailTemplateManager.tsx">
            <DialogTitle data-id="w1ci1elcd" data-path="src/components/EmailTemplateManager.tsx">
              {editingTemplate?.id ? 'Edit Email Template' : 'Create New Email Template'}
            </DialogTitle>
          </DialogHeader>
          
          {editingTemplate &&
          <div className="space-y-6" data-id="cj7pmsut1" data-path="src/components/EmailTemplateManager.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="rt05p1zz1" data-path="src/components/EmailTemplateManager.tsx">
                <div data-id="ztmcr2wre" data-path="src/components/EmailTemplateManager.tsx">
                  <Label htmlFor="template_name" data-id="ry5f47pb2" data-path="src/components/EmailTemplateManager.tsx">Template Name</Label>
                  <Input
                  id="template_name"
                  value={editingTemplate.template_name}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    template_name: e.target.value
                  })}
                  placeholder="Enter template name" data-id="kf286y4kj" data-path="src/components/EmailTemplateManager.tsx" />

                </div>
                <div data-id="3fuuwott1" data-path="src/components/EmailTemplateManager.tsx">
                  <Label htmlFor="template_type" data-id="zq58adllg" data-path="src/components/EmailTemplateManager.tsx">Template Type</Label>
                  <Select
                  value={editingTemplate.template_type}
                  onValueChange={(value) => setEditingTemplate({
                    ...editingTemplate,
                    template_type: value,
                    variables: commonVariables[value as keyof typeof commonVariables]?.join(',') || editingTemplate.variables
                  })} data-id="o1ng7g9yc" data-path="src/components/EmailTemplateManager.tsx">

                    <SelectTrigger data-id="5kzi2s3g8" data-path="src/components/EmailTemplateManager.tsx">
                      <SelectValue data-id="9b6nwtjsm" data-path="src/components/EmailTemplateManager.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="qnr22c6v3" data-path="src/components/EmailTemplateManager.tsx">
                      {templateTypes.map((type) =>
                    <SelectItem key={type} value={type} data-id="ej8lyb5o1" data-path="src/components/EmailTemplateManager.tsx">{type}</SelectItem>
                    )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div data-id="324p54vxz" data-path="src/components/EmailTemplateManager.tsx">
                <Label htmlFor="subject" data-id="5n53epjzl" data-path="src/components/EmailTemplateManager.tsx">Email Subject</Label>
                <Input
                id="subject"
                value={editingTemplate.subject}
                onChange={(e) => setEditingTemplate({
                  ...editingTemplate,
                  subject: e.target.value
                })}
                placeholder="Enter email subject (use {variable_name} for variables)" data-id="hfujzum5i" data-path="src/components/EmailTemplateManager.tsx" />

              </div>

              <div data-id="uxyg7iqey" data-path="src/components/EmailTemplateManager.tsx">
                <Label htmlFor="variables" data-id="9gaqsuniw" data-path="src/components/EmailTemplateManager.tsx">Variables (comma separated)</Label>
                <div className="flex space-x-2" data-id="pgzd7mw6x" data-path="src/components/EmailTemplateManager.tsx">
                  <Input
                  id="variables"
                  value={editingTemplate.variables}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    variables: e.target.value
                  })}
                  placeholder="variable1,variable2,variable3"
                  className="flex-1" data-id="efuwlrzvy" data-path="src/components/EmailTemplateManager.tsx" />

                  <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const suggested = commonVariables[editingTemplate.template_type as keyof typeof commonVariables] || [];
                    setEditingTemplate({
                      ...editingTemplate,
                      variables: suggested.join(',')
                    });
                  }} data-id="8u9asj8lw" data-path="src/components/EmailTemplateManager.tsx">

                    <Variables className="w-4 h-4 mr-1" data-id="elq6x575j" data-path="src/components/EmailTemplateManager.tsx" />
                    Suggest
                  </Button>
                </div>
                {editingTemplate.variables &&
              <div className="flex flex-wrap gap-1 mt-2" data-id="yr6su1duy" data-path="src/components/EmailTemplateManager.tsx">
                    {editingTemplate.variables.split(',').map((variable, index) =>
                <Badge key={index} variant="outline" className="text-xs" data-id="p4huycztc" data-path="src/components/EmailTemplateManager.tsx">
                        {variable.trim()}
                      </Badge>
                )}
                  </div>
              }
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} data-id="ww5082sxd" data-path="src/components/EmailTemplateManager.tsx">
                <TabsList data-id="3o324fxvc" data-path="src/components/EmailTemplateManager.tsx">
                  <TabsTrigger value="html" data-id="0mqpu3skr" data-path="src/components/EmailTemplateManager.tsx">HTML Content</TabsTrigger>
                  <TabsTrigger value="text" data-id="jezn8zp7a" data-path="src/components/EmailTemplateManager.tsx">Text Content</TabsTrigger>
                  <TabsTrigger value="preview" data-id="5e2n7pi7p" data-path="src/components/EmailTemplateManager.tsx">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="mt-4" data-id="3dd0y0d0u" data-path="src/components/EmailTemplateManager.tsx">
                  <Label htmlFor="html_content" data-id="8rnpmb4gc" data-path="src/components/EmailTemplateManager.tsx">HTML Content</Label>
                  <Textarea
                  id="html_content"
                  value={editingTemplate.html_content}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    html_content: e.target.value
                  })}
                  placeholder="Enter HTML email content"
                  rows={15}
                  className="font-mono text-sm" data-id="wgze3inyi" data-path="src/components/EmailTemplateManager.tsx" />

                </TabsContent>

                <TabsContent value="text" className="mt-4" data-id="8nors5xvz" data-path="src/components/EmailTemplateManager.tsx">
                  <Label htmlFor="text_content" data-id="9f8jsioye" data-path="src/components/EmailTemplateManager.tsx">Text Content (fallback)</Label>
                  <Textarea
                  id="text_content"
                  value={editingTemplate.text_content}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    text_content: e.target.value
                  })}
                  placeholder="Enter plain text version"
                  rows={6} data-id="tfgp6ostf" data-path="src/components/EmailTemplateManager.tsx" />

                </TabsContent>

                <TabsContent value="preview" className="mt-4" data-id="t0x9gt9ft" data-path="src/components/EmailTemplateManager.tsx">
                  <div className="space-y-4" data-id="y1dvysjwz" data-path="src/components/EmailTemplateManager.tsx">
                    <div data-id="4uw5o52do" data-path="src/components/EmailTemplateManager.tsx">
                      <Label htmlFor="preview_data" data-id="6eczx85wm" data-path="src/components/EmailTemplateManager.tsx">Preview Data (JSON)</Label>
                      <Textarea
                      id="preview_data"
                      value={editingTemplate.preview_data}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        preview_data: e.target.value
                      })}
                      placeholder='{"variable_name": "sample_value"}'
                      rows={4}
                      className="font-mono text-sm" data-id="g8x8p2i9c" data-path="src/components/EmailTemplateManager.tsx" />

                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50" data-id="z0eq3ti78" data-path="src/components/EmailTemplateManager.tsx">
                      <h4 className="font-medium mb-2" data-id="sskrg6rl7" data-path="src/components/EmailTemplateManager.tsx">Email Preview</h4>
                      <div
                      className="border bg-white p-4 rounded max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: generatePreview(editingTemplate) }} data-id="p97qqbyay" data-path="src/components/EmailTemplateManager.tsx" />

                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-4" data-id="tntgzvkk5" data-path="src/components/EmailTemplateManager.tsx">
                <div className="flex items-center space-x-2" data-id="2aixx3f4j" data-path="src/components/EmailTemplateManager.tsx">
                  <Switch
                  checked={editingTemplate.is_active}
                  onCheckedChange={(checked) => setEditingTemplate({
                    ...editingTemplate,
                    is_active: checked
                  })} data-id="f4q5dgz2p" data-path="src/components/EmailTemplateManager.tsx" />

                  <Label data-id="lca3yu3pu" data-path="src/components/EmailTemplateManager.tsx">Active Template</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2" data-id="4q1wl4134" data-path="src/components/EmailTemplateManager.tsx">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-id="6yvu13xwb" data-path="src/components/EmailTemplateManager.tsx">
                  Cancel
                </Button>
                <Button onClick={saveTemplate} disabled={saving} data-id="lbqcbkfj4" data-path="src/components/EmailTemplateManager.tsx">
                  {saving && <RefreshCw className="w-4 h-4 mr-2 animate-spin" data-id="w2kd42ld6" data-path="src/components/EmailTemplateManager.tsx" />}
                  <Save className="w-4 h-4 mr-2" data-id="72l46rhm9" data-path="src/components/EmailTemplateManager.tsx" />
                  Save Template
                </Button>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

};

export default EmailTemplateManager;
