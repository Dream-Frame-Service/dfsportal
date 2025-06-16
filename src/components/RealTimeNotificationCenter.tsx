import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Bell, BellOff, Settings, User, Database, AlertTriangle, CheckCircle, Clock, Zap, Volume2, VolumeX, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'conflict' | 'sync' | 'audit' | 'system' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  isRead: boolean;
  isAcknowledged: boolean;
  actionRequired: boolean;
  relatedData?: any;
  expiresAt?: Date;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'browser' | 'email' | 'sms' | 'webhook';
  isEnabled: boolean;
  config: any;
}

interface NotificationSettings {
  globalEnabled: boolean;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  batchDelay: number;
  maxNotifications: number;
  autoAcknowledge: boolean;
  channels: NotificationChannel[];
  filters: {
    types: string[];
    priorities: string[];
    sources: string[];
  };
}

const RealTimeNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    globalEnabled: true,
    soundEnabled: true,
    desktopEnabled: true,
    batchDelay: 2000,
    maxNotifications: 100,
    autoAcknowledge: false,
    channels: [
    { id: 'browser', name: 'Browser Notifications', type: 'browser', isEnabled: true, config: {} },
    { id: 'email', name: 'Email Alerts', type: 'email', isEnabled: true, config: { email: 'admin@gasstation.com' } },
    { id: 'sms', name: 'SMS Alerts', type: 'sms', isEnabled: false, config: { phone: '+1234567890' } }],

    filters: {
      types: ['conflict', 'sync', 'audit', 'system', 'security', 'performance'],
      priorities: ['low', 'medium', 'high', 'critical'],
      sources: []
    }
  });
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [stats, setStats] = useState({
    unread: 0,
    acknowledged: 0,
    actionRequired: 0,
    last24Hours: 0
  });
  const { toast } = useToast();

  // Initialize with sample notifications
  useEffect(() => {
    generateSampleNotifications();
  }, []);

  // Real-time notification simulation
  useEffect(() => {
    if (!settings.globalEnabled) return;

    const interval = setInterval(() => {
      generateRandomNotification();
    }, 5000);

    return () => clearInterval(interval);
  }, [settings.globalEnabled]);

  // Update stats whenever notifications change
  useEffect(() => {
    updateStats();
  }, [notifications]);

  const generateSampleNotifications = () => {
    const sampleNotifications: Notification[] = [
    {
      id: 'notif_1',
      type: 'conflict',
      priority: 'high',
      title: 'Edit Conflict Detected',
      message: 'Sarah Johnson is editing the same product record as you',
      timestamp: new Date(Date.now() - 300000),
      source: 'Conflict Resolver',
      isRead: false,
      isAcknowledged: false,
      actionRequired: true,
      relatedData: { tableId: 'products', recordId: 123 }
    },
    {
      id: 'notif_2',
      type: 'sync',
      priority: 'medium',
      title: 'Optimistic Update Confirmed',
      message: 'Product price update has been successfully synchronized',
      timestamp: new Date(Date.now() - 240000),
      source: 'Optimistic Update Manager',
      isRead: true,
      isAcknowledged: true,
      actionRequired: false,
      relatedData: { operation: 'update', tableId: 'products' }
    },
    {
      id: 'notif_3',
      type: 'security',
      priority: 'critical',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP 45.123.45.67',
      timestamp: new Date(Date.now() - 180000),
      source: 'Audit Trail',
      isRead: false,
      isAcknowledged: false,
      actionRequired: true,
      relatedData: { ipAddress: '45.123.45.67', attempts: 5 }
    },
    {
      id: 'notif_4',
      type: 'performance',
      priority: 'medium',
      title: 'Cache Hit Rate Declining',
      message: 'Cache performance has dropped below 85% in the last hour',
      timestamp: new Date(Date.now() - 120000),
      source: 'Cache Manager',
      isRead: false,
      isAcknowledged: false,
      actionRequired: false,
      relatedData: { hitRate: 83.2, threshold: 85 }
    },
    {
      id: 'notif_5',
      type: 'system',
      priority: 'low',
      title: 'Database Trigger Executed',
      message: 'License expiry alert trigger completed successfully',
      timestamp: new Date(Date.now() - 60000),
      source: 'Database Triggers',
      isRead: false,
      isAcknowledged: false,
      actionRequired: false,
      relatedData: { triggerId: 'license_alert', executionTime: 250 }
    }];


    setNotifications(sampleNotifications);
  };

  const generateRandomNotification = useCallback(() => {
    const types: ('conflict' | 'sync' | 'audit' | 'system' | 'security' | 'performance')[] = ['conflict', 'sync', 'audit', 'system', 'security', 'performance'];
    const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const sources = ['Conflict Resolver', 'Optimistic Update Manager', 'Cache Manager', 'Database Triggers', 'Audit Trail', 'Security Monitor'];

    const templates = {
      conflict: [
      { title: 'Edit Conflict Detected', message: 'Multiple users editing the same record' },
      { title: 'Concurrent Modification', message: 'Simultaneous changes detected on employee record' }],

      sync: [
      { title: 'Sync Completed', message: 'All pending updates synchronized successfully' },
      { title: 'Sync Failed', message: 'Unable to synchronize changes, retrying...' }],

      audit: [
      { title: 'Suspicious Activity', message: 'Unusual access pattern detected' },
      { title: 'Compliance Alert', message: 'Audit requirement threshold reached' }],

      system: [
      { title: 'System Update', message: 'Background maintenance completed' },
      { title: 'Configuration Change', message: 'System settings updated' }],

      security: [
      { title: 'Security Alert', message: 'Potential security threat detected' },
      { title: 'Access Violation', message: 'Unauthorized access attempt blocked' }],

      performance: [
      { title: 'Performance Warning', message: 'System performance degraded' },
      { title: 'Resource Alert', message: 'Memory usage approaching limit' }]

    };

    const shouldGenerate = Math.random() < 0.4; // 40% chance
    if (!shouldGenerate) return;

    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const template = templates[type][Math.floor(Math.random() * templates[type].length)];

    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      type,
      priority,
      title: template.title,
      message: template.message,
      timestamp: new Date(),
      source,
      isRead: false,
      isAcknowledged: false,
      actionRequired: priority === 'high' || priority === 'critical',
      relatedData: { generated: true },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, settings.maxNotifications - 1)]);

    // Show notification based on settings
    showNotification(newNotification);
  }, [settings, toast]);

  const showNotification = (notification: Notification) => {
    if (!settings.globalEnabled) return;

    // Filter check
    if (!settings.filters.types.includes(notification.type)) return;
    if (!settings.filters.priorities.includes(notification.priority)) return;

    // Browser notification
    if (settings.desktopEnabled && settings.channels.find((c) => c.id === 'browser')?.isEnabled) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
    }

    // Sound notification
    if (settings.soundEnabled && (notification.priority === 'high' || notification.priority === 'critical')) {
      // Would play notification sound here
      console.log('🔔 Notification sound would play');
    }

    // Toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.priority === 'critical' || notification.priority === 'high' ? 'destructive' : 'default',
      duration: notification.priority === 'critical' ? 10000 : 5000
    });
  };

  const updateStats = () => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const acknowledged = notifications.filter((n) => n.isAcknowledged).length;
    const actionRequired = notifications.filter((n) => n.actionRequired && !n.isAcknowledged).length;
    const last24Hours = notifications.filter((n) =>
    Date.now() - n.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;

    setStats({ unread, acknowledged, actionRequired, last24Hours });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) =>
    n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAsAcknowledged = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) =>
    n.id === notificationId ? { ...n, isAcknowledged: true, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been removed"
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You will now receive desktop notifications"
        });
      }
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter((notification) => {
      if (filterType !== 'all' && notification.type !== filterType) return false;
      if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
      return true;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':return 'bg-gray-500 text-white';
      case 'medium':return 'bg-blue-500 text-white';
      case 'high':return 'bg-orange-500 text-white';
      case 'critical':return 'bg-red-500 text-white';
      default:return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict':return <AlertTriangle className="h-4 w-4" data-id="5u4vtueme" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      case 'sync':return <CheckCircle className="h-4 w-4" data-id="c7jgbxvp8" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      case 'audit':return <User className="h-4 w-4" data-id="jqrbiyann" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      case 'system':return <Database className="h-4 w-4" data-id="k7ktl6m8f" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      case 'security':return <AlertTriangle className="h-4 w-4" data-id="rfm1kks41" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      case 'performance':return <Zap className="h-4 w-4" data-id="9ad8rlbc6" data-path="src/components/RealTimeNotificationCenter.tsx" />;
      default:return <Bell className="h-4 w-4" data-id="pjlynt51x" data-path="src/components/RealTimeNotificationCenter.tsx" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conflict':return 'text-orange-600 bg-orange-50';
      case 'sync':return 'text-green-600 bg-green-50';
      case 'audit':return 'text-blue-600 bg-blue-50';
      case 'system':return 'text-purple-600 bg-purple-50';
      case 'security':return 'text-red-600 bg-red-50';
      case 'performance':return 'text-yellow-600 bg-yellow-50';
      default:return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6" data-id="oha8gv2d6" data-path="src/components/RealTimeNotificationCenter.tsx">
      {/* Header Stats */}
      <Card data-id="lgdgawp25" data-path="src/components/RealTimeNotificationCenter.tsx">
        <CardHeader data-id="z8penuuvr" data-path="src/components/RealTimeNotificationCenter.tsx">
          <div className="flex items-center justify-between" data-id="6632vwu8p" data-path="src/components/RealTimeNotificationCenter.tsx">
            <CardTitle className="flex items-center gap-2" data-id="5epy0sdki" data-path="src/components/RealTimeNotificationCenter.tsx">
              {settings.globalEnabled ? <Bell className="h-5 w-5" data-id="qbn5jfacd" data-path="src/components/RealTimeNotificationCenter.tsx" /> : <BellOff className="h-5 w-5" data-id="7vdwd7gzn" data-path="src/components/RealTimeNotificationCenter.tsx" />}
              Real-Time Notification Center
            </CardTitle>
            <div className="flex items-center gap-2" data-id="0c4cl7lgx" data-path="src/components/RealTimeNotificationCenter.tsx">
              <Badge variant={settings.globalEnabled ? "default" : "secondary"} data-id="i9ba1pmmf" data-path="src/components/RealTimeNotificationCenter.tsx">
                {settings.globalEnabled ? "Active" : "Paused"}
              </Badge>
              <Button
                onClick={() => setSettings((prev) => ({ ...prev, globalEnabled: !prev.globalEnabled }))}
                variant={settings.globalEnabled ? "destructive" : "default"}
                size="sm" data-id="5g7mc5baj" data-path="src/components/RealTimeNotificationCenter.tsx">

                {settings.globalEnabled ? "Disable" : "Enable"}
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="sm" data-id="3gluhod9o" data-path="src/components/RealTimeNotificationCenter.tsx">

                <Settings className="h-4 w-4 mr-1" data-id="bumbhh3tr" data-path="src/components/RealTimeNotificationCenter.tsx" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="m44uanspt" data-path="src/components/RealTimeNotificationCenter.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="2slntn2lt" data-path="src/components/RealTimeNotificationCenter.tsx">
            <div className="text-center" data-id="rp25adxqt" data-path="src/components/RealTimeNotificationCenter.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="wgagd1h4j" data-path="src/components/RealTimeNotificationCenter.tsx">{stats.unread}</div>
              <div className="text-sm text-gray-600" data-id="0cf5dpv2g" data-path="src/components/RealTimeNotificationCenter.tsx">Unread</div>
            </div>
            <div className="text-center" data-id="irqw8gpkj" data-path="src/components/RealTimeNotificationCenter.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="y45pbqdxl" data-path="src/components/RealTimeNotificationCenter.tsx">{stats.actionRequired}</div>
              <div className="text-sm text-gray-600" data-id="u9lqtwqra" data-path="src/components/RealTimeNotificationCenter.tsx">Action Required</div>
            </div>
            <div className="text-center" data-id="6we8wion6" data-path="src/components/RealTimeNotificationCenter.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="o15vhrprc" data-path="src/components/RealTimeNotificationCenter.tsx">{stats.acknowledged}</div>
              <div className="text-sm text-gray-600" data-id="781ruppra" data-path="src/components/RealTimeNotificationCenter.tsx">Acknowledged</div>
            </div>
            <div className="text-center" data-id="48hpeo94i" data-path="src/components/RealTimeNotificationCenter.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="fysmo0ibm" data-path="src/components/RealTimeNotificationCenter.tsx">{stats.last24Hours}</div>
              <div className="text-sm text-gray-600" data-id="hekmw8vsq" data-path="src/components/RealTimeNotificationCenter.tsx">Last 24h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="notifications" className="w-full" data-id="55uzbbg21" data-path="src/components/RealTimeNotificationCenter.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="iraxoio2i" data-path="src/components/RealTimeNotificationCenter.tsx">
          <TabsTrigger value="notifications" data-id="vfiauu5us" data-path="src/components/RealTimeNotificationCenter.tsx">Notifications ({notifications.length})</TabsTrigger>
          <TabsTrigger value="channels" data-id="07h6suvjs" data-path="src/components/RealTimeNotificationCenter.tsx">Channels</TabsTrigger>
          <TabsTrigger value="analytics" data-id="vutp6z9n5" data-path="src/components/RealTimeNotificationCenter.tsx">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4" data-id="uf3izd6xo" data-path="src/components/RealTimeNotificationCenter.tsx">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" data-id="vgzcw2ys6" data-path="src/components/RealTimeNotificationCenter.tsx">
            <div className="flex gap-2" data-id="8mrdajylz" data-path="src/components/RealTimeNotificationCenter.tsx">
              <Select value={filterType} onValueChange={setFilterType} data-id="uezmtnkny" data-path="src/components/RealTimeNotificationCenter.tsx">
                <SelectTrigger className="w-40" data-id="tr7zof2uq" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <SelectValue placeholder="Filter by type" data-id="ajhaqxuwd" data-path="src/components/RealTimeNotificationCenter.tsx" />
                </SelectTrigger>
                <SelectContent data-id="jehr0q2ed" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <SelectItem value="all" data-id="hjshnns6b" data-path="src/components/RealTimeNotificationCenter.tsx">All Types</SelectItem>
                  <SelectItem value="conflict" data-id="mtqdm9d91" data-path="src/components/RealTimeNotificationCenter.tsx">Conflicts</SelectItem>
                  <SelectItem value="sync" data-id="57bw0t7or" data-path="src/components/RealTimeNotificationCenter.tsx">Sync</SelectItem>
                  <SelectItem value="audit" data-id="pluvy02b4" data-path="src/components/RealTimeNotificationCenter.tsx">Audit</SelectItem>
                  <SelectItem value="system" data-id="64ov4tpio" data-path="src/components/RealTimeNotificationCenter.tsx">System</SelectItem>
                  <SelectItem value="security" data-id="liaxfbu78" data-path="src/components/RealTimeNotificationCenter.tsx">Security</SelectItem>
                  <SelectItem value="performance" data-id="vo64a6zla" data-path="src/components/RealTimeNotificationCenter.tsx">Performance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority} data-id="wtwkqj637" data-path="src/components/RealTimeNotificationCenter.tsx">
                <SelectTrigger className="w-40" data-id="filhsoutv" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <SelectValue placeholder="Filter by priority" data-id="71ewd3gwh" data-path="src/components/RealTimeNotificationCenter.tsx" />
                </SelectTrigger>
                <SelectContent data-id="rcjr2dwea" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <SelectItem value="all" data-id="dmlv1po37" data-path="src/components/RealTimeNotificationCenter.tsx">All Priorities</SelectItem>
                  <SelectItem value="low" data-id="vgedratrd" data-path="src/components/RealTimeNotificationCenter.tsx">Low</SelectItem>
                  <SelectItem value="medium" data-id="425v6f4jp" data-path="src/components/RealTimeNotificationCenter.tsx">Medium</SelectItem>
                  <SelectItem value="high" data-id="n1wydwsyr" data-path="src/components/RealTimeNotificationCenter.tsx">High</SelectItem>
                  <SelectItem value="critical" data-id="u1bovwt8f" data-path="src/components/RealTimeNotificationCenter.tsx">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2" data-id="kcyydune9" data-path="src/components/RealTimeNotificationCenter.tsx">
              <Button size="sm" variant="outline" onClick={markAllAsRead} data-id="r9yhnqvp0" data-path="src/components/RealTimeNotificationCenter.tsx">
                Mark All Read
              </Button>
              <Button size="sm" variant="outline" onClick={clearNotifications} data-id="sz6d5yk0a" data-path="src/components/RealTimeNotificationCenter.tsx">
                Clear All
              </Button>
              <Button size="sm" variant="outline" onClick={requestNotificationPermission} data-id="8ltxj1omd" data-path="src/components/RealTimeNotificationCenter.tsx">
                Enable Desktop
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-96" data-id="s9ipzg320" data-path="src/components/RealTimeNotificationCenter.tsx">
            <div className="space-y-3" data-id="9vlu52igb" data-path="src/components/RealTimeNotificationCenter.tsx">
              <AnimatePresence data-id="9wqflslpc" data-path="src/components/RealTimeNotificationCenter.tsx">
                {getFilteredNotifications().map((notification, index) =>
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }} data-id="vu3z2u5al" data-path="src/components/RealTimeNotificationCenter.tsx">

                    <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`
                    }
                    onClick={() => {
                      setSelectedNotification(notification);
                      markAsRead(notification.id);
                    }} data-id="7b2u2gl3o" data-path="src/components/RealTimeNotificationCenter.tsx">

                      <CardContent className="pt-4" data-id="ag4riwjl7" data-path="src/components/RealTimeNotificationCenter.tsx">
                        <div className="flex items-center justify-between mb-2" data-id="98e5pnfqt" data-path="src/components/RealTimeNotificationCenter.tsx">
                          <div className="flex items-center gap-3" data-id="uq4bes6wc" data-path="src/components/RealTimeNotificationCenter.tsx">
                            <div className={`p-1 rounded ${getTypeColor(notification.type)}`} data-id="11eslusnb" data-path="src/components/RealTimeNotificationCenter.tsx">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div data-id="twc348ukb" data-path="src/components/RealTimeNotificationCenter.tsx">
                              <p className="font-medium text-sm" data-id="jagizc26w" data-path="src/components/RealTimeNotificationCenter.tsx">{notification.title}</p>
                              <p className="text-xs text-gray-600" data-id="qfeio8ggc" data-path="src/components/RealTimeNotificationCenter.tsx">
                                {notification.source} • {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="gx4qfy8qp" data-path="src/components/RealTimeNotificationCenter.tsx">
                            <Badge className={getPriorityColor(notification.priority)} data-id="6o1vkas41" data-path="src/components/RealTimeNotificationCenter.tsx">
                              {notification.priority.toUpperCase()}
                            </Badge>
                            {notification.actionRequired && !notification.isAcknowledged &&
                          <Badge variant="destructive" data-id="8j6lcy0vr" data-path="src/components/RealTimeNotificationCenter.tsx">Action Required</Badge>
                          }
                            {notification.isAcknowledged &&
                          <CheckCircle className="h-4 w-4 text-green-500" data-id="954ir8woe" data-path="src/components/RealTimeNotificationCenter.tsx" />
                          }
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3" data-id="0451y7fgv" data-path="src/components/RealTimeNotificationCenter.tsx">{notification.message}</p>

                        {notification.actionRequired && !notification.isAcknowledged &&
                      <div className="flex gap-2" data-id="jpzprycqo" data-path="src/components/RealTimeNotificationCenter.tsx">
                            <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsAcknowledged(notification.id);
                          }} data-id="84l5faswj" data-path="src/components/RealTimeNotificationCenter.tsx">

                              Acknowledge
                            </Button>
                            <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNotification(notification);
                          }} data-id="7i1i87wqq" data-path="src/components/RealTimeNotificationCenter.tsx">

                              View Details
                            </Button>
                          </div>
                      }
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4" data-id="i8uvgh5f1" data-path="src/components/RealTimeNotificationCenter.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="ywzg8aasl" data-path="src/components/RealTimeNotificationCenter.tsx">
            {settings.channels.map((channel) =>
            <Card key={channel.id} data-id="k7fdajpl5" data-path="src/components/RealTimeNotificationCenter.tsx">
                <CardHeader data-id="brxdw7yzp" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <div className="flex items-center justify-between" data-id="1hucve1vg" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <CardTitle className="text-lg" data-id="cy45xsaby" data-path="src/components/RealTimeNotificationCenter.tsx">{channel.name}</CardTitle>
                    <Switch
                    checked={channel.isEnabled}
                    onCheckedChange={(checked) => {
                      setSettings((prev) => ({
                        ...prev,
                        channels: prev.channels.map((c) =>
                        c.id === channel.id ? { ...c, isEnabled: checked } : c
                        )
                      }));
                    }} data-id="gx0c1jkt2" data-path="src/components/RealTimeNotificationCenter.tsx" />

                  </div>
                </CardHeader>
                <CardContent data-id="0n7prb7p9" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <div className="space-y-2" data-id="cgaei6lx8" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <Badge variant="outline" data-id="ozs9mkwr0" data-path="src/components/RealTimeNotificationCenter.tsx">{channel.type}</Badge>
                    {channel.type === 'email' &&
                  <p className="text-sm text-gray-600" data-id="lpd3tyj8c" data-path="src/components/RealTimeNotificationCenter.tsx">
                        Email: {channel.config.email}
                      </p>
                  }
                    {channel.type === 'sms' &&
                  <p className="text-sm text-gray-600" data-id="jcfcpoff4" data-path="src/components/RealTimeNotificationCenter.tsx">
                        Phone: {channel.config.phone}
                      </p>
                  }
                    <div className="flex gap-2 pt-2" data-id="crw5an8c6" data-path="src/components/RealTimeNotificationCenter.tsx">
                      <Button size="sm" variant="outline" data-id="41frcpi5r" data-path="src/components/RealTimeNotificationCenter.tsx">
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" data-id="vp0tlgen8" data-path="src/components/RealTimeNotificationCenter.tsx">
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4" data-id="1a2qqpqw0" data-path="src/components/RealTimeNotificationCenter.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="e4rrztw41" data-path="src/components/RealTimeNotificationCenter.tsx">
            <Card data-id="6y9p3ioar" data-path="src/components/RealTimeNotificationCenter.tsx">
              <CardHeader data-id="gnweio7mq" data-path="src/components/RealTimeNotificationCenter.tsx">
                <CardTitle data-id="d0tb3m5o0" data-path="src/components/RealTimeNotificationCenter.tsx">Notification Volume</CardTitle>
              </CardHeader>
              <CardContent data-id="2u4nc0ytv" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div className="space-y-4" data-id="imr0tcjai" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <div className="flex justify-between" data-id="o1a6gcpse" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <span data-id="fseawzvmv" data-path="src/components/RealTimeNotificationCenter.tsx">Today:</span>
                    <Badge variant="outline" data-id="15d4ttwlx" data-path="src/components/RealTimeNotificationCenter.tsx">{stats.last24Hours}</Badge>
                  </div>
                  <div className="flex justify-between" data-id="umt1qaq7t" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <span data-id="4jknote3x" data-path="src/components/RealTimeNotificationCenter.tsx">Average per day:</span>
                    <Badge variant="outline" data-id="t9eg0olhb" data-path="src/components/RealTimeNotificationCenter.tsx">{Math.round(stats.last24Hours * 0.8)}</Badge>
                  </div>
                  <div className="flex justify-between" data-id="acwu1hp2b" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <span data-id="ji1t0ry1x" data-path="src/components/RealTimeNotificationCenter.tsx">Peak hour:</span>
                    <Badge variant="outline" data-id="v58mddcr4" data-path="src/components/RealTimeNotificationCenter.tsx">10:00 AM - 11:00 AM</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="d1qj8ir4r" data-path="src/components/RealTimeNotificationCenter.tsx">
              <CardHeader data-id="349yu4fry" data-path="src/components/RealTimeNotificationCenter.tsx">
                <CardTitle data-id="07t7vl4wh" data-path="src/components/RealTimeNotificationCenter.tsx">Response Metrics</CardTitle>
              </CardHeader>
              <CardContent data-id="qchbr9b6r" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div className="space-y-4" data-id="ht8yoo7sn" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <div data-id="t6f3u40z0" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <div className="flex justify-between mb-2" data-id="fwyjv1kt9" data-path="src/components/RealTimeNotificationCenter.tsx">
                      <span data-id="h105lnjzx" data-path="src/components/RealTimeNotificationCenter.tsx">Acknowledgment Rate:</span>
                      <span data-id="2x848evg1" data-path="src/components/RealTimeNotificationCenter.tsx">{(stats.acknowledged / notifications.length * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.acknowledged / notifications.length * 100} className="h-2" data-id="fuvqhvhm9" data-path="src/components/RealTimeNotificationCenter.tsx" />
                  </div>
                  <div data-id="errfp9qs0" data-path="src/components/RealTimeNotificationCenter.tsx">
                    <div className="flex justify-between mb-2" data-id="xh57l5v59" data-path="src/components/RealTimeNotificationCenter.tsx">
                      <span data-id="q0sgs5ks6" data-path="src/components/RealTimeNotificationCenter.tsx">Action Required Rate:</span>
                      <span data-id="pjphc8tb4" data-path="src/components/RealTimeNotificationCenter.tsx">{(stats.actionRequired / notifications.length * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.actionRequired / notifications.length * 100} className="h-2" data-id="kex7dofmp" data-path="src/components/RealTimeNotificationCenter.tsx" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert data-id="2zfe9oj7s" data-path="src/components/RealTimeNotificationCenter.tsx">
            <Bell className="h-4 w-4" data-id="zdl7xw6cc" data-path="src/components/RealTimeNotificationCenter.tsx" />
            <AlertDescription data-id="o6ail1wvx" data-path="src/components/RealTimeNotificationCenter.tsx">
              Notification analytics help optimize alert strategies and reduce notification fatigue. 
              Monitor response rates and adjust thresholds accordingly.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings} data-id="sdvitor2n" data-path="src/components/RealTimeNotificationCenter.tsx">
        <DialogContent className="max-w-2xl" data-id="u9noiwoli" data-path="src/components/RealTimeNotificationCenter.tsx">
          <DialogHeader data-id="hbtoxwuds" data-path="src/components/RealTimeNotificationCenter.tsx">
            <DialogTitle data-id="vzxs2zqkq" data-path="src/components/RealTimeNotificationCenter.tsx">Notification Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6" data-id="yk6vr6l0e" data-path="src/components/RealTimeNotificationCenter.tsx">
            <div className="space-y-4" data-id="kicuzeu5j" data-path="src/components/RealTimeNotificationCenter.tsx">
              <h4 className="font-medium" data-id="xzjesrfa5" data-path="src/components/RealTimeNotificationCenter.tsx">General Settings</h4>
              
              <div className="flex items-center justify-between" data-id="nnrfefp8u" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div data-id="cjwp4wgqs" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <Label data-id="uyxihokg3" data-path="src/components/RealTimeNotificationCenter.tsx">Sound Notifications</Label>
                  <p className="text-sm text-gray-600" data-id="iiuacgni9" data-path="src/components/RealTimeNotificationCenter.tsx">Play sound for high priority alerts</p>
                </div>
                <div className="flex items-center gap-2" data-id="6s7u9mjg9" data-path="src/components/RealTimeNotificationCenter.tsx">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4" data-id="zhsvv1oi8" data-path="src/components/RealTimeNotificationCenter.tsx" /> : <VolumeX className="h-4 w-4" data-id="osidayopb" data-path="src/components/RealTimeNotificationCenter.tsx" />}
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, soundEnabled: checked }))} data-id="uznwidj48" data-path="src/components/RealTimeNotificationCenter.tsx" />

                </div>
              </div>

              <div className="flex items-center justify-between" data-id="u689pvgfe" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div data-id="s7vt3ilx6" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <Label data-id="ns0r0gy5n" data-path="src/components/RealTimeNotificationCenter.tsx">Desktop Notifications</Label>
                  <p className="text-sm text-gray-600" data-id="hcflkmhtj" data-path="src/components/RealTimeNotificationCenter.tsx">Show browser notifications</p>
                </div>
                <Switch
                  checked={settings.desktopEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, desktopEnabled: checked }))} data-id="gk554o9f0" data-path="src/components/RealTimeNotificationCenter.tsx" />

              </div>

              <div className="flex items-center justify-between" data-id="wlet6vm37" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div data-id="1q3g39o00" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <Label data-id="g4q9zlx9k" data-path="src/components/RealTimeNotificationCenter.tsx">Auto-acknowledge Low Priority</Label>
                  <p className="text-sm text-gray-600" data-id="byuf0g9nq" data-path="src/components/RealTimeNotificationCenter.tsx">Automatically acknowledge low priority notifications</p>
                </div>
                <Switch
                  checked={settings.autoAcknowledge}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoAcknowledge: checked }))} data-id="yd4c3l64w" data-path="src/components/RealTimeNotificationCenter.tsx" />

              </div>
            </div>

            <div className="space-y-4" data-id="pe937esbz" data-path="src/components/RealTimeNotificationCenter.tsx">
              <h4 className="font-medium" data-id="gyw2eewoi" data-path="src/components/RealTimeNotificationCenter.tsx">Batch Settings</h4>
              
              <div className="space-y-2" data-id="lsot9qui0" data-path="src/components/RealTimeNotificationCenter.tsx">
                <Label data-id="0642b8x37" data-path="src/components/RealTimeNotificationCenter.tsx">Batch Delay: {settings.batchDelay}ms</Label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={settings.batchDelay}
                  onChange={(e) => setSettings((prev) => ({ ...prev, batchDelay: Number(e.target.value) }))}
                  className="w-full" data-id="9pg5z2a2d" data-path="src/components/RealTimeNotificationCenter.tsx" />

                <div className="flex justify-between text-xs text-gray-600" data-id="x41sl8o75" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span data-id="4pvyn4itx" data-path="src/components/RealTimeNotificationCenter.tsx">1s (Immediate)</span>
                  <span data-id="yu87l6wsx" data-path="src/components/RealTimeNotificationCenter.tsx">10s (Batched)</span>
                </div>
              </div>

              <div className="space-y-2" data-id="sidrwxt4i" data-path="src/components/RealTimeNotificationCenter.tsx">
                <Label data-id="mqs2ct5hm" data-path="src/components/RealTimeNotificationCenter.tsx">Max Notifications: {settings.maxNotifications}</Label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={settings.maxNotifications}
                  onChange={(e) => setSettings((prev) => ({ ...prev, maxNotifications: Number(e.target.value) }))}
                  className="w-full" data-id="sdml9osna" data-path="src/components/RealTimeNotificationCenter.tsx" />

                <div className="flex justify-between text-xs text-gray-600" data-id="0g2dd8ofg" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span data-id="u2hcx3gb0" data-path="src/components/RealTimeNotificationCenter.tsx">50 (Minimal)</span>
                  <span data-id="raxdzm2uy" data-path="src/components/RealTimeNotificationCenter.tsx">500 (Maximum)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2" data-id="ddgrffu73" data-path="src/components/RealTimeNotificationCenter.tsx">
              <Button variant="outline" onClick={() => setShowSettings(false)} data-id="hitk2cnm5" data-path="src/components/RealTimeNotificationCenter.tsx">
                Cancel
              </Button>
              <Button onClick={() => setShowSettings(false)} data-id="6iv6irovk" data-path="src/components/RealTimeNotificationCenter.tsx">
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)} data-id="5u7ck2xkv" data-path="src/components/RealTimeNotificationCenter.tsx">
        <DialogContent className="max-w-2xl" data-id="d1f318nnn" data-path="src/components/RealTimeNotificationCenter.tsx">
          <DialogHeader data-id="a5sb4mcgx" data-path="src/components/RealTimeNotificationCenter.tsx">
            <DialogTitle data-id="a7rtutyk7" data-path="src/components/RealTimeNotificationCenter.tsx">Notification Details</DialogTitle>
          </DialogHeader>
          
          {selectedNotification &&
          <div className="space-y-4" data-id="f2frdpnqs" data-path="src/components/RealTimeNotificationCenter.tsx">
              <div className="flex items-center gap-3" data-id="hdn0dsus6" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div className={`p-2 rounded ${getTypeColor(selectedNotification.type)}`} data-id="ow72iskr0" data-path="src/components/RealTimeNotificationCenter.tsx">
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div className="flex-1" data-id="7zvvedpxo" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <h3 className="font-medium" data-id="6xsc2cbae" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.title}</h3>
                  <p className="text-sm text-gray-600" data-id="rwit3nfqj" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.source}</p>
                </div>
                <Badge className={getPriorityColor(selectedNotification.priority)} data-id="04qj48nee" data-path="src/components/RealTimeNotificationCenter.tsx">
                  {selectedNotification.priority.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm" data-id="amsbfumsg" data-path="src/components/RealTimeNotificationCenter.tsx">
                <div data-id="1bteqw12o" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span className="font-medium" data-id="mwldwo98s" data-path="src/components/RealTimeNotificationCenter.tsx">Timestamp:</span>
                  <p data-id="yaf521asy" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.timestamp.toLocaleString()}</p>
                </div>
                <div data-id="8vkt0sqhl" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span className="font-medium" data-id="fm4lltpwr" data-path="src/components/RealTimeNotificationCenter.tsx">Type:</span>
                  <p data-id="utlzghnwb" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.type}</p>
                </div>
                <div data-id="01rxjbrtf" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span className="font-medium" data-id="jqayjg84w" data-path="src/components/RealTimeNotificationCenter.tsx">Status:</span>
                  <p data-id="5r73zu1bt" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.isAcknowledged ? 'Acknowledged' : 'Pending'}</p>
                </div>
                <div data-id="o6378ujjx" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span className="font-medium" data-id="uhw0vz39i" data-path="src/components/RealTimeNotificationCenter.tsx">Action Required:</span>
                  <p data-id="cghr0bs3t" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.actionRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div data-id="pklsilsqh" data-path="src/components/RealTimeNotificationCenter.tsx">
                <span className="font-medium" data-id="rp6n8ucn3" data-path="src/components/RealTimeNotificationCenter.tsx">Message:</span>
                <p className="mt-1 p-3 bg-gray-50 rounded" data-id="p5czy0tke" data-path="src/components/RealTimeNotificationCenter.tsx">{selectedNotification.message}</p>
              </div>

              {selectedNotification.relatedData &&
            <div data-id="cs09fvb2i" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <span className="font-medium" data-id="tz0l2r4oh" data-path="src/components/RealTimeNotificationCenter.tsx">Related Data:</span>
                  <code className="block mt-1 p-3 bg-gray-100 rounded text-xs" data-id="nhlhv5ge0" data-path="src/components/RealTimeNotificationCenter.tsx">
                    {JSON.stringify(selectedNotification.relatedData, null, 2)}
                  </code>
                </div>
            }

              {selectedNotification.actionRequired && !selectedNotification.isAcknowledged &&
            <div className="flex gap-2 pt-4" data-id="dtxasj9bw" data-path="src/components/RealTimeNotificationCenter.tsx">
                  <Button
                onClick={() => {
                  markAsAcknowledged(selectedNotification.id);
                  setSelectedNotification(null);
                }} data-id="7p93rlu8w" data-path="src/components/RealTimeNotificationCenter.tsx">

                    Acknowledge
                  </Button>
                  <Button
                variant="outline"
                onClick={() => setSelectedNotification(null)} data-id="2qo9aghw7" data-path="src/components/RealTimeNotificationCenter.tsx">

                    Close
                  </Button>
                </div>
            }
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

};

export default RealTimeNotificationCenter;
