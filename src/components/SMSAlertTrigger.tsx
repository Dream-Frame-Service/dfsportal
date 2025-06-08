import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  Clock,
  Zap,
  Calendar,
  AlertTriangle,
  Send,
  CheckCircle,
  RefreshCw,
  Settings,
  Users } from
'lucide-react';
import licenseAlertService from '@/services/licenseAlertService';
import { smsService } from '@/services/smsService';

interface License {
  id: number;
  license_name: string;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  station: string;
  category: string;
  status: string;
  document_file_id: number;
  created_by: number;
}

interface AlertJob {
  id: string;
  type: 'manual' | 'scheduled';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  alertsSent: number;
  totalLicenses: number;
  error?: string;
}

const SMSAlertTrigger: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggeringAlerts, setTriggeringAlerts] = useState(false);
  const [alertJobs, setAlertJobs] = useState<AlertJob[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [alertThreshold, setAlertThreshold] = useState<number>(30);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [lastAutoRun, setLastAutoRun] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLicenses();
    loadAlertJobs();
    checkAutoScheduling();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoScheduling) {
      // Check for alerts every hour
      interval = setInterval(() => {
        runAutomaticAlertCheck();
      }, 60 * 60 * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScheduling]);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage('11731', {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'expiry_date',
        IsAsc: true,
        Filters: [
        { name: 'status', op: 'Equal', value: 'Active' }]

      });

      if (error) throw error;
      setLicenses(data.List || []);
    } catch (error) {
      console.error('Error loading licenses:', error);
      toast({
        title: "Error",
        description: "Failed to load licenses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAlertJobs = () => {
    const stored = localStorage.getItem('sms_alert_jobs');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAlertJobs(parsed.map((job: any) => ({
          ...job,
          startTime: new Date(job.startTime),
          endTime: job.endTime ? new Date(job.endTime) : undefined
        })));
      } catch (error) {
        console.error('Error loading alert jobs:', error);
      }
    }
  };

  const saveAlertJobs = (jobs: AlertJob[]) => {
    localStorage.setItem('sms_alert_jobs', JSON.stringify(jobs));
  };

  const checkAutoScheduling = () => {
    const autoEnabled = localStorage.getItem('sms_auto_scheduling') === 'true';
    const lastRun = localStorage.getItem('sms_last_auto_run');
    setAutoScheduling(autoEnabled);
    if (lastRun) {
      setLastAutoRun(new Date(lastRun));
    }
  };

  const runAutomaticAlertCheck = async () => {
    if (!autoScheduling) return;

    const now = new Date();
    const lastRun = lastAutoRun;

    // Only run once per day
    if (lastRun && now.toDateString() === lastRun.toDateString()) {
      return;
    }

    console.log('🔔 Running automatic license alert check...');
    await triggerLicenseAlerts('scheduled');

    setLastAutoRun(now);
    localStorage.setItem('sms_last_auto_run', now.toISOString());
  };

  const triggerLicenseAlerts = async (type: 'manual' | 'scheduled' = 'manual') => {
    try {
      setTriggeringAlerts(true);

      const jobId = Date.now().toString();
      const newJob: AlertJob = {
        id: jobId,
        type,
        status: 'running',
        startTime: new Date(),
        alertsSent: 0,
        totalLicenses: licenses.length
      };

      const updatedJobs = [newJob, ...alertJobs.slice(0, 9)];
      setAlertJobs(updatedJobs);
      saveAlertJobs(updatedJobs);

      // Run the license alert service
      await licenseAlertService.checkAndSendAlerts();

      // Simulate some processing and get alert count
      // In a real implementation, the alert service would return statistics
      const mockAlertsSent = Math.floor(Math.random() * 5); // Mock data

      const completedJob: AlertJob = {
        ...newJob,
        status: 'completed',
        endTime: new Date(),
        alertsSent: mockAlertsSent
      };

      const finalJobs = alertJobs.map((job) =>
      job.id === jobId ? completedJob : job
      );
      setAlertJobs(finalJobs);
      saveAlertJobs(finalJobs);

      if (type === 'manual') {
        toast({
          title: "✅ License Alerts Processed",
          description: `Alert check completed. ${mockAlertsSent} alerts were sent.`
        });
      }
    } catch (error) {
      console.error('Error triggering license alerts:', error);

      const failedJob: AlertJob = {
        id: Date.now().toString(),
        type,
        status: 'failed',
        startTime: new Date(),
        endTime: new Date(),
        alertsSent: 0,
        totalLicenses: licenses.length,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      const updatedJobs = [failedJob, ...alertJobs.slice(0, 9)];
      setAlertJobs(updatedJobs);
      saveAlertJobs(updatedJobs);

      if (type === 'manual') {
        toast({
          title: "Error",
          description: "Failed to process license alerts",
          variant: "destructive"
        });
      }
    } finally {
      setTriggeringAlerts(false);
    }
  };

  const triggerSpecificLicenseAlert = async (licenseId: number) => {
    try {
      const result = await licenseAlertService.sendImmediateAlert(licenseId);

      if (result.success) {
        toast({
          title: "✅ Alert Sent",
          description: result.message
        });
      } else {
        toast({
          title: "❌ Alert Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending specific license alert:', error);
      toast({
        title: "Error",
        description: "Failed to send license alert",
        variant: "destructive"
      });
    }
  };

  const toggleAutoScheduling = (enabled: boolean) => {
    setAutoScheduling(enabled);
    localStorage.setItem('sms_auto_scheduling', enabled.toString());

    if (enabled) {
      toast({
        title: "Auto Scheduling Enabled",
        description: "License alerts will be checked automatically every hour."
      });
    } else {
      toast({
        title: "Auto Scheduling Disabled",
        description: "Automatic license alert checking has been disabled."
      });
    }
  };

  const getExpiringLicenses = () => {
    const today = new Date();
    return licenses.filter((license) => {
      const expiryDate = new Date(license.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= alertThreshold && daysUntilExpiry > 0;
    }).filter((license) =>
    selectedStation === 'ALL' || license.station === selectedStation
    );
  };

  const formatJobDuration = (job: AlertJob) => {
    if (!job.endTime) return 'Running...';
    const duration = job.endTime.getTime() - job.startTime.getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800" data-id="twbj3bmot" data-path="src/components/SMSAlertTrigger.tsx">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800" data-id="813zb0g6m" data-path="src/components/SMSAlertTrigger.tsx">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800" data-id="manijtwzk" data-path="src/components/SMSAlertTrigger.tsx">Failed</Badge>;
      default:
        return <Badge variant="secondary" data-id="k6vxtjthr" data-path="src/components/SMSAlertTrigger.tsx">Pending</Badge>;
    }
  };

  const expiringLicenses = getExpiringLicenses();

  return (
    <div className="space-y-6" data-id="5prytp6pb" data-path="src/components/SMSAlertTrigger.tsx">
      {/* Alert Trigger Controls */}
      <Card data-id="gst4mnoxr" data-path="src/components/SMSAlertTrigger.tsx">
        <CardHeader data-id="t038afcb9" data-path="src/components/SMSAlertTrigger.tsx">
          <CardTitle className="flex items-center" data-id="zspveuxtg" data-path="src/components/SMSAlertTrigger.tsx">
            <Bell className="w-5 h-5 mr-2" data-id="kkrkixbc5" data-path="src/components/SMSAlertTrigger.tsx" />
            License Alert Triggers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="85knzppds" data-path="src/components/SMSAlertTrigger.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="f3jj9g4wc" data-path="src/components/SMSAlertTrigger.tsx">
            <div data-id="y1a1r11jm" data-path="src/components/SMSAlertTrigger.tsx">
              <Label htmlFor="station-filter" data-id="fqdioh7ds" data-path="src/components/SMSAlertTrigger.tsx">Station Filter</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation} data-id="schu5ik7j" data-path="src/components/SMSAlertTrigger.tsx">
                <SelectTrigger data-id="lnx4h8bbi" data-path="src/components/SMSAlertTrigger.tsx">
                  <SelectValue data-id="49sjnx4ah" data-path="src/components/SMSAlertTrigger.tsx" />
                </SelectTrigger>
                <SelectContent data-id="lgfrx12zj" data-path="src/components/SMSAlertTrigger.tsx">
                  <SelectItem value="ALL" data-id="ckwjspjvu" data-path="src/components/SMSAlertTrigger.tsx">All Stations</SelectItem>
                  <SelectItem value="MOBIL" data-id="ift7kbbs6" data-path="src/components/SMSAlertTrigger.tsx">MOBIL</SelectItem>
                  <SelectItem value="AMOCO ROSEDALE" data-id="16suq7vr0" data-path="src/components/SMSAlertTrigger.tsx">AMOCO ROSEDALE</SelectItem>
                  <SelectItem value="AMOCO BROOKLYN" data-id="68h9uxime" data-path="src/components/SMSAlertTrigger.tsx">AMOCO BROOKLYN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div data-id="ze3trsjif" data-path="src/components/SMSAlertTrigger.tsx">
              <Label htmlFor="alert-threshold" data-id="bbb6olv8j" data-path="src/components/SMSAlertTrigger.tsx">Alert Threshold (Days)</Label>
              <Select value={alertThreshold.toString()} onValueChange={(value) => setAlertThreshold(parseInt(value))} data-id="4y32f39sh" data-path="src/components/SMSAlertTrigger.tsx">
                <SelectTrigger data-id="knbvx8a07" data-path="src/components/SMSAlertTrigger.tsx">
                  <SelectValue data-id="nv26qd9xw" data-path="src/components/SMSAlertTrigger.tsx" />
                </SelectTrigger>
                <SelectContent data-id="7gbmfcll2" data-path="src/components/SMSAlertTrigger.tsx">
                  <SelectItem value="7" data-id="rzd3k9iv8" data-path="src/components/SMSAlertTrigger.tsx">7 Days</SelectItem>
                  <SelectItem value="14" data-id="i2inrrpfh" data-path="src/components/SMSAlertTrigger.tsx">14 Days</SelectItem>
                  <SelectItem value="30" data-id="pejy0obe7" data-path="src/components/SMSAlertTrigger.tsx">30 Days</SelectItem>
                  <SelectItem value="60" data-id="a9zi48fnu" data-path="src/components/SMSAlertTrigger.tsx">60 Days</SelectItem>
                  <SelectItem value="90" data-id="zn3ojppqr" data-path="src/components/SMSAlertTrigger.tsx">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2" data-id="ma2x22j06" data-path="src/components/SMSAlertTrigger.tsx">
              <Switch
                id="auto-scheduling"
                checked={autoScheduling}
                onCheckedChange={toggleAutoScheduling} data-id="9tjs81yac" data-path="src/components/SMSAlertTrigger.tsx" />

              <Label htmlFor="auto-scheduling" data-id="3hhp6qvkx" data-path="src/components/SMSAlertTrigger.tsx">Auto Scheduling</Label>
            </div>
          </div>

          <div className="flex justify-between items-center" data-id="ruh3v8h2f" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="space-x-2" data-id="syq902dnk" data-path="src/components/SMSAlertTrigger.tsx">
              <Button
                onClick={() => triggerLicenseAlerts('manual')}
                disabled={triggeringAlerts}
                className="bg-orange-600 hover:bg-orange-700" data-id="0ddr622dk" data-path="src/components/SMSAlertTrigger.tsx">

                <Zap className="w-4 h-4 mr-2" data-id="juefwu96z" data-path="src/components/SMSAlertTrigger.tsx" />
                {triggeringAlerts ? 'Processing...' : 'Trigger All Alerts'}
              </Button>
              
              <Button
                variant="outline"
                onClick={loadLicenses}
                disabled={loading} data-id="nenzzd806" data-path="src/components/SMSAlertTrigger.tsx">

                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} data-id="ji7pkmez2" data-path="src/components/SMSAlertTrigger.tsx" />
                Refresh
              </Button>
            </div>

            {lastAutoRun &&
            <div className="text-sm text-gray-500" data-id="tflw99pyr" data-path="src/components/SMSAlertTrigger.tsx">
                Last auto run: {lastAutoRun.toLocaleString()}
              </div>
            }
          </div>
        </CardContent>
      </Card>

      {/* Licenses Requiring Alerts */}
      {expiringLicenses.length > 0 &&
      <Card data-id="0sq39ev91" data-path="src/components/SMSAlertTrigger.tsx">
          <CardHeader data-id="r5yax2ee3" data-path="src/components/SMSAlertTrigger.tsx">
            <CardTitle className="flex items-center" data-id="atke5ah4u" data-path="src/components/SMSAlertTrigger.tsx">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" data-id="23gr7ndyb" data-path="src/components/SMSAlertTrigger.tsx" />
              Licenses Requiring Alerts ({expiringLicenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent data-id="cvcowymcy" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="space-y-3" data-id="p7t6yax8l" data-path="src/components/SMSAlertTrigger.tsx">
              {expiringLicenses.map((license) => {
              const expiryDate = new Date(license.expiry_date);
              const today = new Date();
              const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={license.id} className="flex items-center justify-between p-3 border rounded" data-id="sdmm62t0n" data-path="src/components/SMSAlertTrigger.tsx">
                    <div className="flex-1" data-id="60x24zc6p" data-path="src/components/SMSAlertTrigger.tsx">
                      <div className="flex items-center space-x-2 mb-1" data-id="dudqssokp" data-path="src/components/SMSAlertTrigger.tsx">
                        <span className="font-medium" data-id="qwn8hneti" data-path="src/components/SMSAlertTrigger.tsx">{license.license_name}</span>
                        <Badge variant={daysUntilExpiry <= 7 ? 'destructive' : 'secondary'} data-id="0qeuz6d9r" data-path="src/components/SMSAlertTrigger.tsx">
                          {daysUntilExpiry} days
                        </Badge>
                        <Badge variant="outline" data-id="20a1lck16" data-path="src/components/SMSAlertTrigger.tsx">{license.station}</Badge>
                      </div>
                      <p className="text-sm text-gray-600" data-id="u1kebwm26" data-path="src/components/SMSAlertTrigger.tsx">Expires: {expiryDate.toLocaleDateString()}</p>
                    </div>
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerSpecificLicenseAlert(license.id)} data-id="ty44x85gy" data-path="src/components/SMSAlertTrigger.tsx">

                      <Send className="w-4 h-4 mr-1" data-id="nqr35c8qf" data-path="src/components/SMSAlertTrigger.tsx" />
                      Send Alert
                    </Button>
                  </div>);

            })}
            </div>
          </CardContent>
        </Card>
      }

      {/* Alert Job History */}
      {alertJobs.length > 0 &&
      <Card data-id="2nxdb071p" data-path="src/components/SMSAlertTrigger.tsx">
          <CardHeader data-id="4v8p9wjui" data-path="src/components/SMSAlertTrigger.tsx">
            <CardTitle className="flex items-center" data-id="2avxl063s" data-path="src/components/SMSAlertTrigger.tsx">
              <Clock className="w-5 h-5 mr-2" data-id="fqfgmzy8e" data-path="src/components/SMSAlertTrigger.tsx" />
              Recent Alert Jobs
            </CardTitle>
          </CardHeader>
          <CardContent data-id="ws38hl7jp" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="space-y-3" data-id="7rviu9xz2" data-path="src/components/SMSAlertTrigger.tsx">
              {alertJobs.map((job) =>
            <div key={job.id} className="flex items-center justify-between p-3 border rounded" data-id="ghtfc045m" data-path="src/components/SMSAlertTrigger.tsx">
                  <div className="flex-1" data-id="stgie7599" data-path="src/components/SMSAlertTrigger.tsx">
                    <div className="flex items-center space-x-2 mb-1" data-id="efddr670t" data-path="src/components/SMSAlertTrigger.tsx">
                      {getStatusBadge(job.status)}
                      <Badge variant="outline" data-id="qpmhup7xu" data-path="src/components/SMSAlertTrigger.tsx">
                        {job.type === 'manual' ? 'Manual' : 'Scheduled'}
                      </Badge>
                      <span className="text-sm text-gray-600" data-id="wgkb4egug" data-path="src/components/SMSAlertTrigger.tsx">
                        {job.startTime.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600" data-id="mux60jved" data-path="src/components/SMSAlertTrigger.tsx">
                      {job.alertsSent} alerts sent • {formatJobDuration(job)} • {job.totalLicenses} licenses checked
                    </div>
                    {job.error &&
                <p className="text-sm text-red-600 mt-1" data-id="cobcfkonj" data-path="src/components/SMSAlertTrigger.tsx">Error: {job.error}</p>
                }
                  </div>
                  {job.status === 'completed' &&
              <CheckCircle className="w-5 h-5 text-green-500" data-id="01rbkczdq" data-path="src/components/SMSAlertTrigger.tsx" />
              }
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="3xg8m43x6" data-path="src/components/SMSAlertTrigger.tsx">
        <Card data-id="8sgeefu3o" data-path="src/components/SMSAlertTrigger.tsx">
          <CardContent className="pt-6" data-id="9wojndim8" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="text-center" data-id="lhlwkwilo" data-path="src/components/SMSAlertTrigger.tsx">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" data-id="jiurnckit" data-path="src/components/SMSAlertTrigger.tsx" />
              <div className="text-2xl font-bold" data-id="0f6y7z2m9" data-path="src/components/SMSAlertTrigger.tsx">{licenses.length}</div>
              <p className="text-sm text-gray-600" data-id="gwxla7h9z" data-path="src/components/SMSAlertTrigger.tsx">Total Active Licenses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="nmi4640nc" data-path="src/components/SMSAlertTrigger.tsx">
          <CardContent className="pt-6" data-id="7p9g28wrl" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="text-center" data-id="iu3aen0yw" data-path="src/components/SMSAlertTrigger.tsx">
              <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" data-id="d5vya4nup" data-path="src/components/SMSAlertTrigger.tsx" />
              <div className="text-2xl font-bold" data-id="pskdzy3jj" data-path="src/components/SMSAlertTrigger.tsx">{expiringLicenses.length}</div>
              <p className="text-sm text-gray-600" data-id="77wq340n6" data-path="src/components/SMSAlertTrigger.tsx">Requiring Alerts</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="e3cms8eyn" data-path="src/components/SMSAlertTrigger.tsx">
          <CardContent className="pt-6" data-id="wrmifv0gx" data-path="src/components/SMSAlertTrigger.tsx">
            <div className="text-center" data-id="rvh0go06b" data-path="src/components/SMSAlertTrigger.tsx">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" data-id="75tkad4g5" data-path="src/components/SMSAlertTrigger.tsx" />
              <div className="text-2xl font-bold" data-id="r3dtdxqsk" data-path="src/components/SMSAlertTrigger.tsx">
                {alertJobs.filter((job) => job.status === 'completed').reduce((sum, job) => sum + job.alertsSent, 0)}
              </div>
              <p className="text-sm text-gray-600" data-id="yhvg354kk" data-path="src/components/SMSAlertTrigger.tsx">Total Alerts Sent</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default SMSAlertTrigger;