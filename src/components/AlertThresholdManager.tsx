import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Bell,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Save,
  TestTube,
  Mail,
  MessageSquare,
  Clock } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notification_methods: ('email' | 'sms' | 'in_app')[];
  cooldown_minutes: number;
  description: string;
  created_at: string;
  last_triggered?: string;
}

interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'webhook';
  name: string;
  configuration: Record<string, any>;
  enabled: boolean;
}

const AlertThresholdManager = () => {
  const { toast } = useToast();
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
  {
    id: '1',
    name: 'High Connection Time',
    metric: 'connection_time',
    operator: 'greater_than',
    threshold: 2000,
    severity: 'high',
    enabled: true,
    notification_methods: ['email', 'in_app'],
    cooldown_minutes: 15,
    description: 'Alert when database connection time exceeds 2 seconds',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Critical Error Rate',
    metric: 'error_rate',
    operator: 'greater_than',
    threshold: 5,
    severity: 'critical',
    enabled: true,
    notification_methods: ['email', 'sms', 'in_app'],
    cooldown_minutes: 5,
    description: 'Alert when error rate exceeds 5%',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Memory Usage Warning',
    metric: 'memory_usage',
    operator: 'greater_than',
    threshold: 80,
    severity: 'medium',
    enabled: true,
    notification_methods: ['in_app'],
    cooldown_minutes: 30,
    description: 'Alert when memory usage exceeds 80%',
    created_at: new Date().toISOString()
  }]
  );

  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
  {
    id: '1',
    type: 'email',
    name: 'Admin Email',
    configuration: { recipients: ['admin@dfsmanager.com'] },
    enabled: true
  },
  {
    id: '2',
    type: 'sms',
    name: 'Emergency SMS',
    configuration: { phone_numbers: ['+1234567890'] },
    enabled: true
  }]
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: '',
    metric: 'connection_time',
    operator: 'greater_than',
    threshold: 1000,
    severity: 'medium',
    enabled: true,
    notification_methods: ['in_app'],
    cooldown_minutes: 15,
    description: ''
  });

  const availableMetrics = [
  { value: 'connection_time', label: 'Connection Time (ms)', unit: 'ms' },
  { value: 'query_response_time', label: 'Query Response Time (ms)', unit: 'ms' },
  { value: 'error_rate', label: 'Error Rate (%)', unit: '%' },
  { value: 'memory_usage', label: 'Memory Usage (%)', unit: '%' },
  { value: 'cpu_usage', label: 'CPU Usage (%)', unit: '%' },
  { value: 'active_connections', label: 'Active Connections', unit: 'count' }];


  const handleCreateRule = () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: "Validation Error",
        description: "Please provide name and description for the alert rule",
        variant: "destructive"
      });
      return;
    }

    const rule: AlertRule = {
      ...(newRule as AlertRule),
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };

    setAlertRules((prev) => [...prev, rule]);
    setNewRule({
      name: '',
      metric: 'connection_time',
      operator: 'greater_than',
      threshold: 1000,
      severity: 'medium',
      enabled: true,
      notification_methods: ['in_app'],
      cooldown_minutes: 15,
      description: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Alert Rule Created",
      description: `Successfully created alert rule: ${rule.name}`
    });
  };

  const handleUpdateRule = (updatedRule: AlertRule) => {
    setAlertRules((prev) =>
    prev.map((rule) => rule.id === updatedRule.id ? updatedRule : rule)
    );
    setEditingRule(null);

    toast({
      title: "Alert Rule Updated",
      description: `Successfully updated alert rule: ${updatedRule.name}`
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    const rule = alertRules.find((r) => r.id === ruleId);
    setAlertRules((prev) => prev.filter((rule) => rule.id !== ruleId));

    toast({
      title: "Alert Rule Deleted",
      description: `Successfully deleted alert rule: ${rule?.name}`
    });
  };

  const handleToggleRule = (ruleId: string) => {
    setAlertRules((prev) =>
    prev.map((rule) =>
    rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    )
    );
  };

  const testAlertRule = async (rule: AlertRule) => {
    toast({
      title: "Testing Alert Rule",
      description: `Sending test notification for: ${rule.name}`
    });

    // Simulate test notification
    setTimeout(() => {
      toast({
        title: "Test Notification Sent",
        description: `Test alert sent successfully via ${rule.notification_methods.join(', ')}`,
        variant: "default"
      });
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':return 'destructive';
      case 'high':return 'secondary';
      case 'medium':return 'outline';
      default:return 'default';
    }
  };

  const getMetricUnit = (metric: string) => {
    const metricConfig = availableMetrics.find((m) => m.value === metric);
    return metricConfig?.unit || '';
  };

  const formatLastTriggered = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6" data-id="775fdlxed" data-path="src/components/AlertThresholdManager.tsx">
      <Card data-id="kv5elyz5f" data-path="src/components/AlertThresholdManager.tsx">
        <CardHeader data-id="zhr77avm0" data-path="src/components/AlertThresholdManager.tsx">
          <CardTitle className="flex items-center gap-2" data-id="giqmdccgk" data-path="src/components/AlertThresholdManager.tsx">
            <Bell className="h-5 w-5" data-id="z1j9b4m4a" data-path="src/components/AlertThresholdManager.tsx" />
            Alert Threshold Manager
          </CardTitle>
          <CardDescription data-id="1qjtqcy6e" data-path="src/components/AlertThresholdManager.tsx">
            Configure automated monitoring alerts and notification thresholds
          </CardDescription>
        </CardHeader>
        <CardContent data-id="z190m5c3w" data-path="src/components/AlertThresholdManager.tsx">
          <div className="flex items-center justify-between" data-id="ls7isctyk" data-path="src/components/AlertThresholdManager.tsx">
            <div className="flex items-center gap-4" data-id="cx525iau3" data-path="src/components/AlertThresholdManager.tsx">
              <Badge variant="outline" data-id="h497jjo4q" data-path="src/components/AlertThresholdManager.tsx">
                {alertRules.filter((r) => r.enabled).length} Active Rules
              </Badge>
              <Badge variant="secondary" data-id="9l06s8379" data-path="src/components/AlertThresholdManager.tsx">
                {notificationChannels.filter((c) => c.enabled).length} Notification Channels
              </Badge>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} data-id="0r6vl8z6k" data-path="src/components/AlertThresholdManager.tsx">
              <DialogTrigger asChild data-id="ctxju84vd" data-path="src/components/AlertThresholdManager.tsx">
                <Button className="flex items-center gap-2" data-id="gf1ocjvd0" data-path="src/components/AlertThresholdManager.tsx">
                  <Plus className="h-4 w-4" data-id="b6yv466eg" data-path="src/components/AlertThresholdManager.tsx" />
                  Create Alert Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" data-id="4dc7td54r" data-path="src/components/AlertThresholdManager.tsx">
                <DialogHeader data-id="oihukgib4" data-path="src/components/AlertThresholdManager.tsx">
                  <DialogTitle data-id="0y7xriqeq" data-path="src/components/AlertThresholdManager.tsx">Create New Alert Rule</DialogTitle>
                  <DialogDescription data-id="fst37n17o" data-path="src/components/AlertThresholdManager.tsx">
                    Set up automated monitoring alerts with custom thresholds
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4" data-id="7k4qfnps3" data-path="src/components/AlertThresholdManager.tsx">
                  <div className="grid grid-cols-2 gap-4" data-id="j7d9cpd8j" data-path="src/components/AlertThresholdManager.tsx">
                    <div data-id="nuwupofvi" data-path="src/components/AlertThresholdManager.tsx">
                      <Label htmlFor="name" data-id="hshxpj6ox" data-path="src/components/AlertThresholdManager.tsx">Rule Name</Label>
                      <Input
                        id="name"
                        value={newRule.name || ''}
                        onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter rule name" data-id="t3cqyttfi" data-path="src/components/AlertThresholdManager.tsx" />

                    </div>
                    <div data-id="72ao7plzf" data-path="src/components/AlertThresholdManager.tsx">
                      <Label htmlFor="metric" data-id="8gbj6mv6j" data-path="src/components/AlertThresholdManager.tsx">Metric</Label>
                      <Select
                        value={newRule.metric}
                        onValueChange={(value) => setNewRule((prev) => ({ ...prev, metric: value }))} data-id="6gq6etvdd" data-path="src/components/AlertThresholdManager.tsx">

                        <SelectTrigger data-id="idu553ecw" data-path="src/components/AlertThresholdManager.tsx">
                          <SelectValue data-id="oehnpsufo" data-path="src/components/AlertThresholdManager.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="419o6ly1n" data-path="src/components/AlertThresholdManager.tsx">
                          {availableMetrics.map((metric) =>
                          <SelectItem key={metric.value} value={metric.value} data-id="yw1cucotk" data-path="src/components/AlertThresholdManager.tsx">
                              {metric.label}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4" data-id="6j6k4prg7" data-path="src/components/AlertThresholdManager.tsx">
                    <div data-id="ox7k5oujv" data-path="src/components/AlertThresholdManager.tsx">
                      <Label htmlFor="operator" data-id="drvctsrjm" data-path="src/components/AlertThresholdManager.tsx">Operator</Label>
                      <Select
                        value={newRule.operator}
                        onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, operator: value }))} data-id="0sltkx7la" data-path="src/components/AlertThresholdManager.tsx">

                        <SelectTrigger data-id="w4yrvcd96" data-path="src/components/AlertThresholdManager.tsx">
                          <SelectValue data-id="xgb26he3a" data-path="src/components/AlertThresholdManager.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="3l9xz9yu7" data-path="src/components/AlertThresholdManager.tsx">
                          <SelectItem value="greater_than" data-id="vob1mvmsw" data-path="src/components/AlertThresholdManager.tsx">Greater Than</SelectItem>
                          <SelectItem value="less_than" data-id="uwm6dbonf" data-path="src/components/AlertThresholdManager.tsx">Less Than</SelectItem>
                          <SelectItem value="equals" data-id="yzas3sr45" data-path="src/components/AlertThresholdManager.tsx">Equals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div data-id="qvdkkbd3w" data-path="src/components/AlertThresholdManager.tsx">
                      <Label htmlFor="threshold" data-id="jn9263pip" data-path="src/components/AlertThresholdManager.tsx">Threshold</Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={newRule.threshold || 0}
                        onChange={(e) => setNewRule((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
                        placeholder="Enter threshold value" data-id="cd26u2z1u" data-path="src/components/AlertThresholdManager.tsx" />

                    </div>
                    <div data-id="2wi23ykmd" data-path="src/components/AlertThresholdManager.tsx">
                      <Label htmlFor="severity" data-id="06p1n03kh" data-path="src/components/AlertThresholdManager.tsx">Severity</Label>
                      <Select
                        value={newRule.severity}
                        onValueChange={(value: any) => setNewRule((prev) => ({ ...prev, severity: value }))} data-id="2xsq1qzhw" data-path="src/components/AlertThresholdManager.tsx">

                        <SelectTrigger data-id="9sp80jkzk" data-path="src/components/AlertThresholdManager.tsx">
                          <SelectValue data-id="45rq6lotm" data-path="src/components/AlertThresholdManager.tsx" />
                        </SelectTrigger>
                        <SelectContent data-id="a4zex3xt1" data-path="src/components/AlertThresholdManager.tsx">
                          <SelectItem value="low" data-id="w3pqa2rtb" data-path="src/components/AlertThresholdManager.tsx">Low</SelectItem>
                          <SelectItem value="medium" data-id="xcxkos7hw" data-path="src/components/AlertThresholdManager.tsx">Medium</SelectItem>
                          <SelectItem value="high" data-id="yp3o1pmfb" data-path="src/components/AlertThresholdManager.tsx">High</SelectItem>
                          <SelectItem value="critical" data-id="y5k2glycq" data-path="src/components/AlertThresholdManager.tsx">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div data-id="7vyh46f85" data-path="src/components/AlertThresholdManager.tsx">
                    <Label htmlFor="description" data-id="kvk41quwz" data-path="src/components/AlertThresholdManager.tsx">Description</Label>
                    <Input
                      id="description"
                      value={newRule.description || ''}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this alert monitors" data-id="2c2cttqag" data-path="src/components/AlertThresholdManager.tsx" />

                  </div>

                  <div data-id="eno3hsmsc" data-path="src/components/AlertThresholdManager.tsx">
                    <Label htmlFor="cooldown" data-id="pwcnsmsrj" data-path="src/components/AlertThresholdManager.tsx">Cooldown Period (minutes)</Label>
                    <Input
                      id="cooldown"
                      type="number"
                      value={newRule.cooldown_minutes || 15}
                      onChange={(e) => setNewRule((prev) => ({ ...prev, cooldown_minutes: Number(e.target.value) }))}
                      placeholder="Minimum time between alerts" data-id="ney7214h0" data-path="src/components/AlertThresholdManager.tsx" />

                  </div>

                  <div className="flex items-center justify-between pt-4" data-id="imc4yzf5i" data-path="src/components/AlertThresholdManager.tsx">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} data-id="i5c6bx2i8" data-path="src/components/AlertThresholdManager.tsx">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRule} className="flex items-center gap-2" data-id="2d36sk4u4" data-path="src/components/AlertThresholdManager.tsx">
                      <Save className="h-4 w-4" data-id="yhta2lra3" data-path="src/components/AlertThresholdManager.tsx" />
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rules" className="space-y-4" data-id="u2d7riq34" data-path="src/components/AlertThresholdManager.tsx">
        <TabsList data-id="ndtxu1lgy" data-path="src/components/AlertThresholdManager.tsx">
          <TabsTrigger value="rules" data-id="of8fkphff" data-path="src/components/AlertThresholdManager.tsx">Alert Rules</TabsTrigger>
          <TabsTrigger value="channels" data-id="ojc7j4jfj" data-path="src/components/AlertThresholdManager.tsx">Notification Channels</TabsTrigger>
          <TabsTrigger value="settings" data-id="5k4c5en1i" data-path="src/components/AlertThresholdManager.tsx">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4" data-id="vque0bwx1" data-path="src/components/AlertThresholdManager.tsx">
          {alertRules.length === 0 ?
          <Card data-id="4cvzhx22x" data-path="src/components/AlertThresholdManager.tsx">
              <CardContent className="text-center py-8" data-id="nthgoe68f" data-path="src/components/AlertThresholdManager.tsx">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" data-id="b1e2h0jei" data-path="src/components/AlertThresholdManager.tsx" />
                <h3 className="text-lg font-semibold mb-2" data-id="6dekhh3c3" data-path="src/components/AlertThresholdManager.tsx">No Alert Rules Configured</h3>
                <p className="text-muted-foreground mb-4" data-id="xvelcs48z" data-path="src/components/AlertThresholdManager.tsx">
                  Create your first alert rule to start monitoring system performance
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} data-id="ea1kqi1s4" data-path="src/components/AlertThresholdManager.tsx">
                  Create Alert Rule
                </Button>
              </CardContent>
            </Card> :

          <div className="space-y-4" data-id="coghdnuio" data-path="src/components/AlertThresholdManager.tsx">
              {alertRules.map((rule) =>
            <Card key={rule.id} data-id="xcooqqqm4" data-path="src/components/AlertThresholdManager.tsx">
                  <CardHeader data-id="slu4a45sd" data-path="src/components/AlertThresholdManager.tsx">
                    <div className="flex items-center justify-between" data-id="ot7syh5fj" data-path="src/components/AlertThresholdManager.tsx">
                      <div className="flex items-center gap-3" data-id="6gs7xnev5" data-path="src/components/AlertThresholdManager.tsx">
                        <CardTitle className="text-lg" data-id="riy565p6b" data-path="src/components/AlertThresholdManager.tsx">{rule.name}</CardTitle>
                        <Badge variant={getSeverityColor(rule.severity)} data-id="n2celgsdp" data-path="src/components/AlertThresholdManager.tsx">
                          {rule.severity}
                        </Badge>
                        <Badge variant={rule.enabled ? 'default' : 'secondary'} data-id="mw2xqk2qu" data-path="src/components/AlertThresholdManager.tsx">
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2" data-id="vqjd26sl9" data-path="src/components/AlertThresholdManager.tsx">
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAlertRule(rule)}
                      className="flex items-center gap-1" data-id="ff5obqv0z" data-path="src/components/AlertThresholdManager.tsx">

                          <TestTube className="h-3 w-3" data-id="moeq04jpw" data-path="src/components/AlertThresholdManager.tsx" />
                          Test
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRule(rule)}
                      className="flex items-center gap-1" data-id="li77jatpe" data-path="src/components/AlertThresholdManager.tsx">

                          <Edit className="h-3 w-3" data-id="b233sbxpf" data-path="src/components/AlertThresholdManager.tsx" />
                          Edit
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700" data-id="0k8b500r3" data-path="src/components/AlertThresholdManager.tsx">

                          <Trash2 className="h-3 w-3" data-id="qk39j7jn3" data-path="src/components/AlertThresholdManager.tsx" />
                          Delete
                        </Button>
                        <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)} data-id="h6edoozo4" data-path="src/components/AlertThresholdManager.tsx" />

                      </div>
                    </div>
                    <CardDescription data-id="tj54fwgbx" data-path="src/components/AlertThresholdManager.tsx">{rule.description}</CardDescription>
                  </CardHeader>
                  <CardContent data-id="bfxiixt39" data-path="src/components/AlertThresholdManager.tsx">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="mozu1vkxp" data-path="src/components/AlertThresholdManager.tsx">
                      <div data-id="v0kk5pk7d" data-path="src/components/AlertThresholdManager.tsx">
                        <Label className="text-sm text-muted-foreground" data-id="v75oh5wb3" data-path="src/components/AlertThresholdManager.tsx">Metric</Label>
                        <div className="font-medium" data-id="sm2d8foyz" data-path="src/components/AlertThresholdManager.tsx">
                          {availableMetrics.find((m) => m.value === rule.metric)?.label || rule.metric}
                        </div>
                      </div>
                      <div data-id="tani66ar6" data-path="src/components/AlertThresholdManager.tsx">
                        <Label className="text-sm text-muted-foreground" data-id="id1tlh4ia" data-path="src/components/AlertThresholdManager.tsx">Condition</Label>
                        <div className="font-medium" data-id="53svymkxq" data-path="src/components/AlertThresholdManager.tsx">
                          {rule.operator.replace('_', ' ')} {rule.threshold}{getMetricUnit(rule.metric)}
                        </div>
                      </div>
                      <div data-id="0pdjtkktk" data-path="src/components/AlertThresholdManager.tsx">
                        <Label className="text-sm text-muted-foreground" data-id="ribb5b78y" data-path="src/components/AlertThresholdManager.tsx">Cooldown</Label>
                        <div className="font-medium flex items-center gap-1" data-id="ku4qr4iuj" data-path="src/components/AlertThresholdManager.tsx">
                          <Clock className="h-3 w-3" data-id="5r3hthnrj" data-path="src/components/AlertThresholdManager.tsx" />
                          {rule.cooldown_minutes} min
                        </div>
                      </div>
                      <div data-id="4nmiqvb6w" data-path="src/components/AlertThresholdManager.tsx">
                        <Label className="text-sm text-muted-foreground" data-id="cymxypge0" data-path="src/components/AlertThresholdManager.tsx">Last Triggered</Label>
                        <div className="font-medium text-sm" data-id="q8t6m1ru6" data-path="src/components/AlertThresholdManager.tsx">
                          {formatLastTriggered(rule.last_triggered)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4" data-id="mvwiry09f" data-path="src/components/AlertThresholdManager.tsx">
                      <Label className="text-sm text-muted-foreground" data-id="pr1nmjjq7" data-path="src/components/AlertThresholdManager.tsx">Notification Methods</Label>
                      <div className="flex items-center gap-2 mt-1" data-id="voljfpgne" data-path="src/components/AlertThresholdManager.tsx">
                        {rule.notification_methods.map((method) =>
                    <Badge key={method} variant="outline" className="flex items-center gap-1" data-id="i4fe1f33y" data-path="src/components/AlertThresholdManager.tsx">
                            {method === 'email' && <Mail className="h-3 w-3" data-id="t9faykati" data-path="src/components/AlertThresholdManager.tsx" />}
                            {method === 'sms' && <MessageSquare className="h-3 w-3" data-id="vvkzldw8h" data-path="src/components/AlertThresholdManager.tsx" />}
                            {method === 'in_app' && <Bell className="h-3 w-3" data-id="3j05a2cc7" data-path="src/components/AlertThresholdManager.tsx" />}
                            {method.replace('_', ' ')}
                          </Badge>
                    )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
            )}
            </div>
          }
        </TabsContent>

        <TabsContent value="channels" className="space-y-4" data-id="lh1m9bucc" data-path="src/components/AlertThresholdManager.tsx">
          <Card data-id="o3nxq247j" data-path="src/components/AlertThresholdManager.tsx">
            <CardHeader data-id="bt0bq0vj7" data-path="src/components/AlertThresholdManager.tsx">
              <CardTitle data-id="dyvzt3r3y" data-path="src/components/AlertThresholdManager.tsx">Notification Channels</CardTitle>
              <CardDescription data-id="324h0179k" data-path="src/components/AlertThresholdManager.tsx">
                Configure how alerts are delivered to administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="0w8dsxras" data-path="src/components/AlertThresholdManager.tsx">
              {notificationChannels.map((channel) =>
              <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg" data-id="lazhmm439" data-path="src/components/AlertThresholdManager.tsx">
                  <div className="flex items-center gap-3" data-id="tcm6jbvs0" data-path="src/components/AlertThresholdManager.tsx">
                    {channel.type === 'email' && <Mail className="h-5 w-5 text-blue-500" data-id="r988e887v" data-path="src/components/AlertThresholdManager.tsx" />}
                    {channel.type === 'sms' && <MessageSquare className="h-5 w-5 text-green-500" data-id="nvfbshj2x" data-path="src/components/AlertThresholdManager.tsx" />}
                    <div data-id="lhtlwmo40" data-path="src/components/AlertThresholdManager.tsx">
                      <div className="font-medium" data-id="p69y8c6gx" data-path="src/components/AlertThresholdManager.tsx">{channel.name}</div>
                      <div className="text-sm text-muted-foreground capitalize" data-id="sg05sjakn" data-path="src/components/AlertThresholdManager.tsx">
                        {channel.type} notifications
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" data-id="1em4h0s5u" data-path="src/components/AlertThresholdManager.tsx">
                    <Badge variant={channel.enabled ? 'default' : 'secondary'} data-id="otnyl3xwx" data-path="src/components/AlertThresholdManager.tsx">
                      {channel.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm" data-id="xwfkzxcn2" data-path="src/components/AlertThresholdManager.tsx">
                      Configure
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" data-id="qt64m6gwv" data-path="src/components/AlertThresholdManager.tsx">
          <Card data-id="r809m5ykq" data-path="src/components/AlertThresholdManager.tsx">
            <CardHeader data-id="gzb4dghhw" data-path="src/components/AlertThresholdManager.tsx">
              <CardTitle className="flex items-center gap-2" data-id="8eag62di4" data-path="src/components/AlertThresholdManager.tsx">
                <Settings className="h-5 w-5" data-id="xmnm6nm7d" data-path="src/components/AlertThresholdManager.tsx" />
                Global Alert Settings
              </CardTitle>
              <CardDescription data-id="r23ihdbav" data-path="src/components/AlertThresholdManager.tsx">
                Configure system-wide alert behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-id="9dpnxhw3i" data-path="src/components/AlertThresholdManager.tsx">
              <Alert data-id="2mf94ukg8" data-path="src/components/AlertThresholdManager.tsx">
                <AlertTriangle className="h-4 w-4" data-id="uy92fy5ws" data-path="src/components/AlertThresholdManager.tsx" />
                <AlertDescription data-id="c5san62ar" data-path="src/components/AlertThresholdManager.tsx">
                  Global settings affect all alert rules and notification channels.
                  Changes take effect immediately for all monitoring activities.
                </AlertDescription>
              </Alert>

              <div className="space-y-4" data-id="1yllqmq3o" data-path="src/components/AlertThresholdManager.tsx">
                <div className="flex items-center justify-between" data-id="m2q03agli" data-path="src/components/AlertThresholdManager.tsx">
                  <div data-id="o4kvvgrws" data-path="src/components/AlertThresholdManager.tsx">
                    <Label className="text-base" data-id="qdfbb8in5" data-path="src/components/AlertThresholdManager.tsx">Enable Alert System</Label>
                    <p className="text-sm text-muted-foreground" data-id="viyyenett" data-path="src/components/AlertThresholdManager.tsx">
                      Master switch for all alert functionality
                    </p>
                  </div>
                  <Switch defaultChecked data-id="zx3lhmkpw" data-path="src/components/AlertThresholdManager.tsx" />
                </div>

                <div className="flex items-center justify-between" data-id="eyxhglhb2" data-path="src/components/AlertThresholdManager.tsx">
                  <div data-id="goq92wsa4" data-path="src/components/AlertThresholdManager.tsx">
                    <Label className="text-base" data-id="8j1gmvfcx" data-path="src/components/AlertThresholdManager.tsx">Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground" data-id="gk0l2ahoe" data-path="src/components/AlertThresholdManager.tsx">
                      Suppress non-critical alerts during specified hours
                    </p>
                  </div>
                  <Switch data-id="r5isdlmcs" data-path="src/components/AlertThresholdManager.tsx" />
                </div>

                <div className="flex items-center justify-between" data-id="0dr2n6nbc" data-path="src/components/AlertThresholdManager.tsx">
                  <div data-id="zm8vjms7z" data-path="src/components/AlertThresholdManager.tsx">
                    <Label className="text-base" data-id="582o318di" data-path="src/components/AlertThresholdManager.tsx">Alert Escalation</Label>
                    <p className="text-sm text-muted-foreground" data-id="i5mmp3tzd" data-path="src/components/AlertThresholdManager.tsx">
                      Automatically escalate unacknowledged critical alerts
                    </p>
                  </div>
                  <Switch defaultChecked data-id="ehyeb58jm" data-path="src/components/AlertThresholdManager.tsx" />
                </div>

                <div className="flex items-center justify-between" data-id="uappyt6uw" data-path="src/components/AlertThresholdManager.tsx">
                  <div data-id="ry752xitx" data-path="src/components/AlertThresholdManager.tsx">
                    <Label className="text-base" data-id="151mtf5qm" data-path="src/components/AlertThresholdManager.tsx">Alert History Retention</Label>
                    <p className="text-sm text-muted-foreground" data-id="ti3vjc8ny" data-path="src/components/AlertThresholdManager.tsx">
                      Keep alert history for specified number of days
                    </p>
                  </div>
                  <Input
                    type="number"
                    defaultValue={30}
                    className="w-20"
                    min={1}
                    max={365} data-id="wmzuypgu1" data-path="src/components/AlertThresholdManager.tsx" />

                </div>
              </div>

              <div className="pt-4 border-t" data-id="5r6l23ycw" data-path="src/components/AlertThresholdManager.tsx">
                <Button className="flex items-center gap-2" data-id="2vg7zdoqo" data-path="src/components/AlertThresholdManager.tsx">
                  <Save className="h-4 w-4" data-id="s7xoeunf0" data-path="src/components/AlertThresholdManager.tsx" />
                  Save Global Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default AlertThresholdManager;