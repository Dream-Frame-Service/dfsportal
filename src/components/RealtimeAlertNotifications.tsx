import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Volume2,
  VolumeX,
  Settings,
  X,
  Mail,
  MessageSquare,
  Smartphone } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface AlertNotification {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  metrics?: {
    currentValue: number;
    threshold: number;
    unit: string;
  };
}

interface NotificationSettings {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  severityFilter: ('critical' | 'high' | 'medium' | 'low')[];
}

const RealtimeAlertNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enableSound: true,
    enableDesktop: true,
    enableEmail: true,
    enableSMS: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    severityFilter: ['critical', 'high', 'medium', 'low']
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate random alerts for demonstration
        if (Math.random() < 0.1) {// 10% chance every 3 seconds
          generateMockAlert();
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const generateMockAlert = () => {
    const alertTypes = ['critical', 'high', 'medium', 'low'] as const;
    const sources = ['Database Connection', 'Query Performance', 'Memory Usage', 'CPU Usage', 'Error Rate'];
    const metrics = [
    { name: 'Connection Time', unit: 'ms', threshold: 2000 },
    { name: 'Query Response', unit: 'ms', threshold: 1000 },
    { name: 'Memory Usage', unit: '%', threshold: 80 },
    { name: 'CPU Usage', unit: '%', threshold: 90 },
    { name: 'Error Rate', unit: '%', threshold: 5 }];


    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];

    const currentValue = randomMetric.threshold + Math.random() * 50;

    const newAlert: AlertNotification = {
      id: Date.now().toString(),
      type: randomType,
      title: `${randomType.toUpperCase()}: ${randomSource} Alert`,
      message: `${randomMetric.name} has exceeded threshold: ${currentValue.toFixed(2)}${randomMetric.unit} > ${randomMetric.threshold}${randomMetric.unit}`,
      timestamp: new Date(),
      acknowledged: false,
      source: randomSource,
      metrics: {
        currentValue,
        threshold: randomMetric.threshold,
        unit: randomMetric.unit
      }
    };

    if (settings.severityFilter.includes(randomType)) {
      addNotification(newAlert);
    }
  };

  const addNotification = (notification: AlertNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount((prev) => prev + 1);

    // Play sound if enabled
    if (settings.enableSound && !isQuietHours()) {
      playNotificationSound(notification.type);
    }

    // Show desktop notification if enabled
    if (settings.enableDesktop && Notification.permission === 'granted' && !isQuietHours()) {
      showDesktopNotification(notification);
    }

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'critical' ? 'destructive' : 'default'
    });

    // Simulate email/SMS sending
    if (settings.enableEmail && (notification.type === 'critical' || notification.type === 'high')) {
      console.log('Sending email alert:', notification);
    }
    if (settings.enableSMS && notification.type === 'critical') {
      console.log('Sending SMS alert:', notification);
    }
  };

  const playNotificationSound = (type: string) => {
    // Create audio context for different alert sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different alert types
    const frequencies = {
      critical: 800,
      high: 600,
      medium: 400,
      low: 300
    };

    oscillator.frequency.setValueAtTime(frequencies[type as keyof typeof frequencies] || 400, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showDesktopNotification = (notification: AlertNotification) => {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id
    });
  };

  const isQuietHours = () => {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) =>
    prev.map((notif) =>
    notif.id === id ? { ...notif, acknowledged: true } : notif
    )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const acknowledgeAll = () => {
    setNotifications((prev) =>
    prev.map((notif) => ({ ...notif, acknowledged: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical':return 'text-red-600 border-red-200 bg-red-50';
      case 'high':return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'medium':return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'low':return 'text-blue-600 border-blue-200 bg-blue-50';
      default:return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'critical':return <XCircle className="h-4 w-4" data-id="u2rqx9er7" data-path="src/components/RealtimeAlertNotifications.tsx" />;
      case 'high':return <AlertTriangle className="h-4 w-4" data-id="qasha4ney" data-path="src/components/RealtimeAlertNotifications.tsx" />;
      case 'medium':return <Clock className="h-4 w-4" data-id="xbogi97ax" data-path="src/components/RealtimeAlertNotifications.tsx" />;
      case 'low':return <CheckCircle className="h-4 w-4" data-id="wjeo0mnen" data-path="src/components/RealtimeAlertNotifications.tsx" />;
      default:return <Bell className="h-4 w-4" data-id="u5acywbz9" data-path="src/components/RealtimeAlertNotifications.tsx" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="space-y-6" data-id="5hr7oks3v" data-path="src/components/RealtimeAlertNotifications.tsx">
      {/* Control Panel */}
      <Card data-id="8edxkdomz" data-path="src/components/RealtimeAlertNotifications.tsx">
        <CardHeader data-id="yt0z633zx" data-path="src/components/RealtimeAlertNotifications.tsx">
          <CardTitle className="flex items-center gap-2" data-id="veu9eae7m" data-path="src/components/RealtimeAlertNotifications.tsx">
            <Bell className="h-5 w-5" data-id="rh8lzdz4y" data-path="src/components/RealtimeAlertNotifications.tsx" />
            Real-time Alert Notifications
            {unreadCount > 0 &&
            <Badge variant="destructive" className="ml-2" data-id="9wqmq6kf6" data-path="src/components/RealtimeAlertNotifications.tsx">
                {unreadCount} unread
              </Badge>
            }
          </CardTitle>
          <CardDescription data-id="xtu1u2ub0" data-path="src/components/RealtimeAlertNotifications.tsx">
            Live monitoring alerts with configurable notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent data-id="g56bh2d15" data-path="src/components/RealtimeAlertNotifications.tsx">
          <div className="flex items-center justify-between" data-id="l648mijko" data-path="src/components/RealtimeAlertNotifications.tsx">
            <div className="flex items-center gap-4" data-id="k668r2ojb" data-path="src/components/RealtimeAlertNotifications.tsx">
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                className="flex items-center gap-2" data-id="q4g506q2j" data-path="src/components/RealtimeAlertNotifications.tsx">

                {isMonitoring ? <VolumeX className="h-4 w-4" data-id="vmddra34n" data-path="src/components/RealtimeAlertNotifications.tsx" /> : <Volume2 className="h-4 w-4" data-id="hvrh8j291" data-path="src/components/RealtimeAlertNotifications.tsx" />}
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>
              
              {notifications.length > 0 &&
              <div className="flex items-center gap-2" data-id="p274ejixv" data-path="src/components/RealtimeAlertNotifications.tsx">
                  <Button variant="outline" size="sm" onClick={acknowledgeAll} data-id="5704bwshc" data-path="src/components/RealtimeAlertNotifications.tsx">
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAll} data-id="xou84xeoa" data-path="src/components/RealtimeAlertNotifications.tsx">
                    Clear All
                  </Button>
                </div>
              }
            </div>

            <div className="flex items-center gap-2" data-id="cc2ug1d2l" data-path="src/components/RealtimeAlertNotifications.tsx">
              {isQuietHours() &&
              <Badge variant="secondary" className="flex items-center gap-1" data-id="qahtir10n" data-path="src/components/RealtimeAlertNotifications.tsx">
                  <VolumeX className="h-3 w-3" data-id="xkchoeu4e" data-path="src/components/RealtimeAlertNotifications.tsx" />
                  Quiet Hours
                </Badge>
              }
              <Badge variant={isMonitoring ? 'default' : 'secondary'} data-id="w9cjiinip" data-path="src/components/RealtimeAlertNotifications.tsx">
                {isMonitoring ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card data-id="1cebcgecm" data-path="src/components/RealtimeAlertNotifications.tsx">
        <CardHeader data-id="fl8av9i1x" data-path="src/components/RealtimeAlertNotifications.tsx">
          <CardTitle className="flex items-center gap-2" data-id="4w9kwo4zw" data-path="src/components/RealtimeAlertNotifications.tsx">
            <Settings className="h-5 w-5" data-id="831hwyili" data-path="src/components/RealtimeAlertNotifications.tsx" />
            Notification Settings
          </CardTitle>
          <CardDescription data-id="ktrt2qeqz" data-path="src/components/RealtimeAlertNotifications.tsx">
            Configure how and when you receive alert notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="6bjlwr1te" data-path="src/components/RealtimeAlertNotifications.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="tgkjcjmuj" data-path="src/components/RealtimeAlertNotifications.tsx">
            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="fmaynfq23" data-path="src/components/RealtimeAlertNotifications.tsx">
              <div className="flex items-center gap-2" data-id="04hiwnye3" data-path="src/components/RealtimeAlertNotifications.tsx">
                <Volume2 className="h-4 w-4" data-id="d9ovw68sd" data-path="src/components/RealtimeAlertNotifications.tsx" />
                <span className="text-sm font-medium" data-id="exlg9d80o" data-path="src/components/RealtimeAlertNotifications.tsx">Sound Alerts</span>
              </div>
              <Button
                variant={settings.enableSound ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings((prev) => ({ ...prev, enableSound: !prev.enableSound }))} data-id="x3yspelsn" data-path="src/components/RealtimeAlertNotifications.tsx">

                {settings.enableSound ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="l71pzjoxd" data-path="src/components/RealtimeAlertNotifications.tsx">
              <div className="flex items-center gap-2" data-id="6c4dij81m" data-path="src/components/RealtimeAlertNotifications.tsx">
                <Bell className="h-4 w-4" data-id="kxkajj2jw" data-path="src/components/RealtimeAlertNotifications.tsx" />
                <span className="text-sm font-medium" data-id="my1fxk2ql" data-path="src/components/RealtimeAlertNotifications.tsx">Desktop</span>
              </div>
              <Button
                variant={settings.enableDesktop ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings((prev) => ({ ...prev, enableDesktop: !prev.enableDesktop }))} data-id="nbqjv1ib2" data-path="src/components/RealtimeAlertNotifications.tsx">

                {settings.enableDesktop ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="6x9m7cxpa" data-path="src/components/RealtimeAlertNotifications.tsx">
              <div className="flex items-center gap-2" data-id="6mgr49ir5" data-path="src/components/RealtimeAlertNotifications.tsx">
                <Mail className="h-4 w-4" data-id="cl7ebhtlu" data-path="src/components/RealtimeAlertNotifications.tsx" />
                <span className="text-sm font-medium" data-id="f6cg8d0nd" data-path="src/components/RealtimeAlertNotifications.tsx">Email</span>
              </div>
              <Button
                variant={settings.enableEmail ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings((prev) => ({ ...prev, enableEmail: !prev.enableEmail }))} data-id="zy8fkvb1u" data-path="src/components/RealtimeAlertNotifications.tsx">

                {settings.enableEmail ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg" data-id="cj4oe185j" data-path="src/components/RealtimeAlertNotifications.tsx">
              <div className="flex items-center gap-2" data-id="96qnfm28o" data-path="src/components/RealtimeAlertNotifications.tsx">
                <Smartphone className="h-4 w-4" data-id="54ftg3oii" data-path="src/components/RealtimeAlertNotifications.tsx" />
                <span className="text-sm font-medium" data-id="ntaevtcxr" data-path="src/components/RealtimeAlertNotifications.tsx">SMS</span>
              </div>
              <Button
                variant={settings.enableSMS ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings((prev) => ({ ...prev, enableSMS: !prev.enableSMS }))} data-id="obie6ojlm" data-path="src/components/RealtimeAlertNotifications.tsx">

                {settings.enableSMS ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Notifications */}
      <Card data-id="6tuymect0" data-path="src/components/RealtimeAlertNotifications.tsx">
        <CardHeader data-id="14clwhtlf" data-path="src/components/RealtimeAlertNotifications.tsx">
          <CardTitle className="flex items-center justify-between" data-id="qisi5lngf" data-path="src/components/RealtimeAlertNotifications.tsx">
            <span className="flex items-center gap-2" data-id="zfhp9tp99" data-path="src/components/RealtimeAlertNotifications.tsx">
              <AlertTriangle className="h-5 w-5" data-id="l3rf4n04o" data-path="src/components/RealtimeAlertNotifications.tsx" />
              Live Alert Feed
            </span>
            {notifications.length > 0 &&
            <Badge variant="outline" data-id="tn0gmrg5v" data-path="src/components/RealtimeAlertNotifications.tsx">
                {notifications.length} notifications
              </Badge>
            }
          </CardTitle>
          <CardDescription data-id="hb7v0xibj" data-path="src/components/RealtimeAlertNotifications.tsx">
            Real-time alerts and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent data-id="xqrhwqtjc" data-path="src/components/RealtimeAlertNotifications.tsx">
          {notifications.length === 0 ?
          <div className="text-center py-8 text-muted-foreground" data-id="1pfrbos6k" data-path="src/components/RealtimeAlertNotifications.tsx">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" data-id="fspjtbgrm" data-path="src/components/RealtimeAlertNotifications.tsx" />
              <p data-id="be9fq6nhb" data-path="src/components/RealtimeAlertNotifications.tsx">No notifications yet</p>
              <p className="text-sm" data-id="8d6igqs9y" data-path="src/components/RealtimeAlertNotifications.tsx">Start monitoring to receive real-time alerts</p>
            </div> :

          <div className="space-y-3 max-h-96 overflow-y-auto" data-id="5k98s5e2d" data-path="src/components/RealtimeAlertNotifications.tsx">
              <AnimatePresence data-id="mqeifikbd" data-path="src/components/RealtimeAlertNotifications.tsx">
                {notifications.map((notification) =>
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className={`p-4 border rounded-lg ${getSeverityColor(notification.type)} ${
                notification.acknowledged ? 'opacity-60' : ''}`
                } data-id="a4z5uvylx" data-path="src/components/RealtimeAlertNotifications.tsx">

                    <div className="flex items-start justify-between" data-id="ndfm7jwtk" data-path="src/components/RealtimeAlertNotifications.tsx">
                      <div className="flex items-start gap-3 flex-1" data-id="4tangydce" data-path="src/components/RealtimeAlertNotifications.tsx">
                        <div className="mt-0.5" data-id="s8htarxn8" data-path="src/components/RealtimeAlertNotifications.tsx">
                          {getSeverityIcon(notification.type)}
                        </div>
                        <div className="flex-1" data-id="lr456tbyn" data-path="src/components/RealtimeAlertNotifications.tsx">
                          <div className="flex items-center gap-2 mb-1" data-id="vqxsemg1q" data-path="src/components/RealtimeAlertNotifications.tsx">
                            <h4 className="font-medium text-sm" data-id="ju29k3ywt" data-path="src/components/RealtimeAlertNotifications.tsx">{notification.title}</h4>
                            <Badge variant="outline" className="text-xs" data-id="y26yop0lq" data-path="src/components/RealtimeAlertNotifications.tsx">
                              {notification.type}
                            </Badge>
                            {!notification.acknowledged &&
                        <Badge variant="destructive" className="text-xs" data-id="mqgijdlp1" data-path="src/components/RealtimeAlertNotifications.tsx">
                                New
                              </Badge>
                        }
                          </div>
                          <p className="text-sm text-muted-foreground mb-2" data-id="f0cpw75s9" data-path="src/components/RealtimeAlertNotifications.tsx">
                            {notification.message}
                          </p>
                          
                          {notification.metrics &&
                      <div className="text-xs text-muted-foreground mb-2" data-id="9fbahny3b" data-path="src/components/RealtimeAlertNotifications.tsx">
                              <Progress
                          value={notification.metrics.currentValue / (notification.metrics.threshold * 1.5) * 100}
                          className="h-1 mb-1" data-id="83a9sjc7u" data-path="src/components/RealtimeAlertNotifications.tsx" />

                              Current: {notification.metrics.currentValue.toFixed(2)}{notification.metrics.unit} | 
                              Threshold: {notification.metrics.threshold}{notification.metrics.unit}
                            </div>
                      }
                          
                          <div className="flex items-center justify-between" data-id="4am9adc48" data-path="src/components/RealtimeAlertNotifications.tsx">
                            <span className="text-xs text-muted-foreground" data-id="aoka0fstw" data-path="src/components/RealtimeAlertNotifications.tsx">
                              {notification.source} • {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-1" data-id="s00o5wbxq" data-path="src/components/RealtimeAlertNotifications.tsx">
                              {!notification.acknowledged &&
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeNotification(notification.id)}
                            className="h-6 px-2 text-xs" data-id="bl9kpbkpi" data-path="src/components/RealtimeAlertNotifications.tsx">

                                  Acknowledge
                                </Button>
                          }
                              <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearNotification(notification.id)}
                            className="h-6 w-6 p-0" data-id="ryaz0ck7l" data-path="src/components/RealtimeAlertNotifications.tsx">

                                <X className="h-3 w-3" data-id="8fa3nfesl" data-path="src/components/RealtimeAlertNotifications.tsx" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          }
        </CardContent>
      </Card>

      {/* Demo Alert */}
      {isMonitoring &&
      <Alert data-id="66i90gbnm" data-path="src/components/RealtimeAlertNotifications.tsx">
          <AlertTriangle className="h-4 w-4" data-id="r8i9zzqy1" data-path="src/components/RealtimeAlertNotifications.tsx" />
          <AlertDescription data-id="v3npvp3m4" data-path="src/components/RealtimeAlertNotifications.tsx">
            Monitoring is active. Demo alerts will be generated randomly to showcase the notification system.
            In production, alerts would be triggered by actual performance threshold violations.
          </AlertDescription>
        </Alert>
      }
    </div>);

};

export default RealtimeAlertNotifications;
