import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  UserPlus, Building, MessageSquare, Shield, CheckCircle,
  ArrowRight, Loader2, Info } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  inProgress: boolean;
}

const AdminFirstTimeSetup: React.FC = () => {
  const { toast } = useToast();
  const { userProfile: _userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [_setupProgress, setSetupProgress] = useState(0);

  // Form data for admin user creation
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Administrator',
    station: 'ALL'
  });

  // Setup steps
  const [steps, setSteps] = useState<SetupStep[]>([
  {
    id: 'admin-account',
    title: 'Create Admin Account',
    description: 'Set up your first administrator account',
    completed: false,
    inProgress: false
  },
  {
    id: 'station-setup',
    title: 'Configure Stations',
    description: 'Set up your gas station information',
    completed: false,
    inProgress: false
  },
  {
    id: 'sms-config',
    title: 'SMS Configuration',
    description: 'Configure SMS alerts for license notifications',
    completed: false,
    inProgress: false
  },
  {
    id: 'security-setup',
    title: 'Security Settings',
    description: 'Configure basic security and access controls',
    completed: false,
    inProgress: false
  }]
  );

  useEffect(() => {
    checkSetupProgress();
  }, []);

  const checkSetupProgress = async () => {
    try {
      // Check if admin users exist
      const { data: adminData, error: adminError } = await window.ezsite.apis.tablePage(11725, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [{ "name": "role", "op": "Equal", "value": "Administrator" }]
      });

      // Check if stations are configured
      const { data: stationData, error: stationError } = await window.ezsite.apis.tablePage(12599, {
        "PageNo": 1,
        "PageSize": 1
      });

      // Check if SMS is configured
      const { data: smsData, error: smsError } = await window.ezsite.apis.tablePage(12640, {
        "PageNo": 1,
        "PageSize": 1,
        "Filters": [{ "name": "is_active", "op": "Equal", "value": true }]
      });

      // Update steps based on existing data
      const updatedSteps = [...steps];
      let completedCount = 0;

      // Admin check
      if (!adminError && adminData?.List?.length > 0) {
        updatedSteps[0].completed = true;
        completedCount++;
      }

      // Station check
      if (!stationError && stationData?.List?.length > 0) {
        updatedSteps[1].completed = true;
        completedCount++;
      }

      // SMS check
      if (!smsError && smsData?.List?.length > 0) {
        updatedSteps[2].completed = true;
        completedCount++;
      }

      // Security is always optional for now
      updatedSteps[3].completed = true;
      completedCount++;

      setSteps(updatedSteps);
      setSetupProgress(completedCount / steps.length * 100);

      // Find next incomplete step
      const nextIncompleteStep = updatedSteps.findIndex((step) => !step.completed);
      if (nextIncompleteStep !== -1) {
        setCurrentStep(nextIncompleteStep);
      }
    } catch (error) {
      console.error('Error checking setup progress:', error);
    }
  };

  const createAdminUser = async () => {
    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (adminForm.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Create user profile record
      const { error } = await window.ezsite.apis.tableCreate(11725, {
        user_id: 1, // Mock user ID - in real app this would come from auth system
        role: adminForm.role,
        station: adminForm.station,
        employee_id: 'ADMIN001',
        phone: '',
        hire_date: new Date().toISOString(),
        is_active: true,
        detailed_permissions: JSON.stringify({
          dashboard: { canView: true },
          products: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          employees: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          sales: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
          vendors: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          orders: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          licenses: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          delivery: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          inventory: { canView: true, canCreate: true, canEdit: true, canDelete: true },
          admin: { canView: true, canCreate: true, canEdit: true, canDelete: true }
        })
      });

      if (error) {
        throw new Error(error);
      }

      // Update step completion
      const updatedSteps = [...steps];
      updatedSteps[0].completed = true;
      setSteps(updatedSteps);

      toast({
        title: "Success!",
        description: "Admin account created successfully"
      });

      // Move to next step
      setCurrentStep(1);

    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create admin account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupDefaultStations = async () => {
    try {
      setLoading(true);

      const defaultStations = [
      {
        station_name: 'MOBIL',
        address: 'Please update with actual address',
        phone: 'Please update with phone number',
        operating_hours: '24/7',
        manager_name: 'Please update manager name',
        status: 'Active'
      },
      {
        station_name: 'AMOCO ROSEDALE',
        address: 'Please update with actual address',
        phone: 'Please update with phone number',
        operating_hours: '24/7',
        manager_name: 'Please update manager name',
        status: 'Active'
      },
      {
        station_name: 'AMOCO BROOKLYN',
        address: 'Please update with actual address',
        phone: 'Please update with phone number',
        operating_hours: '24/7',
        manager_name: 'Please update manager name',
        status: 'Active'
      }];


      for (const station of defaultStations) {
        const { error } = await window.ezsite.apis.tableCreate(12599, {
          ...station,
          last_updated: new Date().toISOString(),
          created_by: 1
        });

        if (error) {
          throw new Error(`Failed to create ${station.station_name}: ${error}`);
        }
      }

      // Update step completion
      const updatedSteps = [...steps];
      updatedSteps[1].completed = true;
      setSteps(updatedSteps);

      toast({
        title: "Success!",
        description: "Default stations created. Please update their details in Site Management."
      });

      // Move to next step
      setCurrentStep(2);

    } catch (error) {
      console.error('Error setting up stations:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to setup stations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const configureSMSPlaceholder = () => {
    // Update step completion (placeholder)
    const updatedSteps = [...steps];
    updatedSteps[2].completed = true;
    setSteps(updatedSteps);

    toast({
      title: "SMS Configuration",
      description: "SMS setup can be completed later in Admin Settings"
    });

    // Move to next step
    setCurrentStep(3);
  };

  const completeSecuritySetup = () => {
    // Update step completion
    const updatedSteps = [...steps];
    updatedSteps[3].completed = true;
    setSteps(updatedSteps);

    toast({
      title: "Setup Complete!",
      description: "Your DFS Manager Portal is ready to use"
    });

    // Update progress
    setSetupProgress(100);
  };

  const getStepIcon = (step: SetupStep, index: number) => {
    if (step.completed) return <CheckCircle className="h-5 w-5 text-green-500" data-id="16o82v661" data-path="src/components/AdminFirstTimeSetup.tsx" />;
    if (step.inProgress || index === currentStep) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" data-id="rto7bgpm5" data-path="src/components/AdminFirstTimeSetup.tsx" />;
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" data-id="4dea1a9jp" data-path="src/components/AdminFirstTimeSetup.tsx" />;
  };

  const completedSteps = steps.filter((step) => step.completed).length;
  const progressPercentage = completedSteps / steps.length * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-id="m8w6xz3ed" data-path="src/components/AdminFirstTimeSetup.tsx">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" data-id="sc99zve86" data-path="src/components/AdminFirstTimeSetup.tsx">
        <CardHeader data-id="zfdozspso" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardTitle className="text-2xl flex items-center gap-2" data-id="rygxkscxi" data-path="src/components/AdminFirstTimeSetup.tsx">
            <UserPlus className="h-8 w-8" data-id="nkbwr04y4" data-path="src/components/AdminFirstTimeSetup.tsx" />
            Welcome to DFS Manager Portal
          </CardTitle>
          <p className="text-blue-100" data-id="u9pgljepy" data-path="src/components/AdminFirstTimeSetup.tsx">
            Let's get your gas station management system set up in just a few steps
          </p>
        </CardHeader>
        <CardContent data-id="le19rilac" data-path="src/components/AdminFirstTimeSetup.tsx">
          <div className="space-y-4" data-id="hl3hnl1b3" data-path="src/components/AdminFirstTimeSetup.tsx">
            <div className="flex justify-between items-center" data-id="24aji2vgg" data-path="src/components/AdminFirstTimeSetup.tsx">
              <span className="text-blue-100" data-id="2tu4c5383" data-path="src/components/AdminFirstTimeSetup.tsx">Setup Progress</span>
              <span className="font-bold" data-id="uyidgtc7t" data-path="src/components/AdminFirstTimeSetup.tsx">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" data-id="wf8l0sk4x" data-path="src/components/AdminFirstTimeSetup.tsx" />
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps Overview */}
      <Card data-id="jak1e5uea" data-path="src/components/AdminFirstTimeSetup.tsx">
        <CardHeader data-id="0rp362rww" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardTitle data-id="cof3q8ndp" data-path="src/components/AdminFirstTimeSetup.tsx">Setup Steps</CardTitle>
        </CardHeader>
        <CardContent data-id="0h881zq0g" data-path="src/components/AdminFirstTimeSetup.tsx">
          <div className="space-y-4" data-id="kx2bxq0v6" data-path="src/components/AdminFirstTimeSetup.tsx">
            {steps.map((step, index) =>
            <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border" data-id="4c1dlcgtf" data-path="src/components/AdminFirstTimeSetup.tsx">
                {getStepIcon(step, index)}
                <div className="flex-1" data-id="57zpbvdrg" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold" data-id="amrtliozk" data-path="src/components/AdminFirstTimeSetup.tsx">{step.title}</h4>
                  <p className="text-sm text-gray-600" data-id="ympbnt3pi" data-path="src/components/AdminFirstTimeSetup.tsx">{step.description}</p>
                </div>
                <div className="flex items-center gap-2" data-id="r8ph0wssn" data-path="src/components/AdminFirstTimeSetup.tsx">
                  {step.completed && <Badge className="bg-green-100 text-green-800" data-id="lw7ooshdz" data-path="src/components/AdminFirstTimeSetup.tsx">Complete</Badge>}
                  {index === currentStep && !step.completed &&
                <Badge className="bg-blue-100 text-blue-800" data-id="wpzw91vur" data-path="src/components/AdminFirstTimeSetup.tsx">Current</Badge>
                }
                  {index > currentStep && !step.completed &&
                <Badge variant="outline" data-id="a4mi88w41" data-path="src/components/AdminFirstTimeSetup.tsx">Pending</Badge>
                }
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Details */}
      {currentStep === 0 && !steps[0].completed &&
      <Card data-id="0hk9eefug" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardHeader data-id="vo2j07uqx" data-path="src/components/AdminFirstTimeSetup.tsx">
            <CardTitle className="flex items-center gap-2" data-id="2oxi2p076" data-path="src/components/AdminFirstTimeSetup.tsx">
              <UserPlus className="h-6 w-6" data-id="o4nl0a1i0" data-path="src/components/AdminFirstTimeSetup.tsx" />
              Step 1: Create Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent data-id="jl3p3xkn0" data-path="src/components/AdminFirstTimeSetup.tsx">
            <Alert className="mb-6" data-id="k9w88vyro" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Info className="h-4 w-4" data-id="pgnr1kwkl" data-path="src/components/AdminFirstTimeSetup.tsx" />
              <AlertDescription data-id="aaujrj069" data-path="src/components/AdminFirstTimeSetup.tsx">
                Create your first administrator account to manage the system. 
                This account will have full access to all features.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="n3wramiri" data-path="src/components/AdminFirstTimeSetup.tsx">
              <div className="space-y-2" data-id="8foxvu32x" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Label htmlFor="username" data-id="zhoj3n3z5" data-path="src/components/AdminFirstTimeSetup.tsx">Username</Label>
                <Input
                id="username"
                value={adminForm.username}
                onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                placeholder="admin" data-id="y76rwjgkw" data-path="src/components/AdminFirstTimeSetup.tsx" />

              </div>

              <div className="space-y-2" data-id="8sa4csrpp" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Label htmlFor="email" data-id="nvrftfee8" data-path="src/components/AdminFirstTimeSetup.tsx">Email</Label>
                <Input
                id="email"
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                placeholder="admin@yourcompany.com" data-id="ot5wzt6uv" data-path="src/components/AdminFirstTimeSetup.tsx" />

              </div>

              <div className="space-y-2" data-id="h02vdc348" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Label htmlFor="password" data-id="tfho3vwe1" data-path="src/components/AdminFirstTimeSetup.tsx">Password</Label>
                <Input
                id="password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                placeholder="Minimum 8 characters" data-id="h49vzlft8" data-path="src/components/AdminFirstTimeSetup.tsx" />

              </div>

              <div className="space-y-2" data-id="0xnyqv7qi" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Label htmlFor="confirmPassword" data-id="9sevs0sqh" data-path="src/components/AdminFirstTimeSetup.tsx">Confirm Password</Label>
                <Input
                id="confirmPassword"
                type="password"
                value={adminForm.confirmPassword}
                onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                placeholder="Confirm your password" data-id="kczqlo29f" data-path="src/components/AdminFirstTimeSetup.tsx" />

              </div>
            </div>

            <div className="mt-6" data-id="jwzfwmapv" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Button
              onClick={createAdminUser}
              disabled={loading || !adminForm.username || !adminForm.email || !adminForm.password}
              className="w-full md:w-auto" data-id="yhf1zx4kh" data-path="src/components/AdminFirstTimeSetup.tsx">

                {loading ?
              <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" data-id="a6g5ab93o" data-path="src/components/AdminFirstTimeSetup.tsx" />
                    Creating Account...
                  </> :

              <>
                    Create Admin Account
                    <ArrowRight className="h-4 w-4 ml-2" data-id="33ln9izex" data-path="src/components/AdminFirstTimeSetup.tsx" />
                  </>
              }
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      {currentStep === 1 && !steps[1].completed &&
      <Card data-id="3ugog6y3o" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardHeader data-id="hvruwtvz4" data-path="src/components/AdminFirstTimeSetup.tsx">
            <CardTitle className="flex items-center gap-2" data-id="g9lqt98b1" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Building className="h-6 w-6" data-id="u3qac6an1" data-path="src/components/AdminFirstTimeSetup.tsx" />
              Step 2: Configure Stations
            </CardTitle>
          </CardHeader>
          <CardContent data-id="7ne4bgm1t" data-path="src/components/AdminFirstTimeSetup.tsx">
            <Alert className="mb-6" data-id="w2otuglhh" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Info className="h-4 w-4" data-id="hx1wfdou3" data-path="src/components/AdminFirstTimeSetup.tsx" />
              <AlertDescription data-id="tvp38l3so" data-path="src/components/AdminFirstTimeSetup.tsx">
                Set up your gas stations. We'll create default entries for MOBIL, AMOCO ROSEDALE, 
                and AMOCO BROOKLYN that you can update later with specific details.
              </AlertDescription>
            </Alert>

            <div className="space-y-4" data-id="odqm0roq0" data-path="src/components/AdminFirstTimeSetup.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="3biadhgan" data-path="src/components/AdminFirstTimeSetup.tsx">
                <div className="p-4 border rounded-lg" data-id="afekq7on3" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold" data-id="1vi1qcgd2" data-path="src/components/AdminFirstTimeSetup.tsx">MOBIL</h4>
                  <p className="text-sm text-gray-600" data-id="lmqh2nchu" data-path="src/components/AdminFirstTimeSetup.tsx">Main gas station location</p>
                </div>
                <div className="p-4 border rounded-lg" data-id="5farevekc" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold" data-id="1xnvyvdpc" data-path="src/components/AdminFirstTimeSetup.tsx">AMOCO ROSEDALE</h4>
                  <p className="text-sm text-gray-600" data-id="fton71tqj" data-path="src/components/AdminFirstTimeSetup.tsx">Rosedale location</p>
                </div>
                <div className="p-4 border rounded-lg" data-id="r6zf5lmi6" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold" data-id="pwc48aruw" data-path="src/components/AdminFirstTimeSetup.tsx">AMOCO BROOKLYN</h4>
                  <p className="text-sm text-gray-600" data-id="vxh2jfads" data-path="src/components/AdminFirstTimeSetup.tsx">Brooklyn location</p>
                </div>
              </div>

              <Button
              onClick={setupDefaultStations}
              disabled={loading}
              className="w-full md:w-auto" data-id="ott7oz3nb" data-path="src/components/AdminFirstTimeSetup.tsx">

                {loading ?
              <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" data-id="c4utrpn8v" data-path="src/components/AdminFirstTimeSetup.tsx" />
                    Setting up stations...
                  </> :

              <>
                    Setup Default Stations
                    <ArrowRight className="h-4 w-4 ml-2" data-id="hpb4w73dg" data-path="src/components/AdminFirstTimeSetup.tsx" />
                  </>
              }
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      {currentStep === 2 && !steps[2].completed &&
      <Card data-id="idqt0tu23" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardHeader data-id="ctype6t15" data-path="src/components/AdminFirstTimeSetup.tsx">
            <CardTitle className="flex items-center gap-2" data-id="2hm8yby2a" data-path="src/components/AdminFirstTimeSetup.tsx">
              <MessageSquare className="h-6 w-6" data-id="fj1bdz571" data-path="src/components/AdminFirstTimeSetup.tsx" />
              Step 3: SMS Configuration (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent data-id="edpfrlc79" data-path="src/components/AdminFirstTimeSetup.tsx">
            <Alert className="mb-6" data-id="8d2h4cnec" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Info className="h-4 w-4" data-id="9ui3eok7y" data-path="src/components/AdminFirstTimeSetup.tsx" />
              <AlertDescription data-id="yy51kankf" data-path="src/components/AdminFirstTimeSetup.tsx">
                SMS alerts will notify you when licenses are about to expire. 
                You can configure this now or skip and set it up later in Admin Settings.
              </AlertDescription>
            </Alert>

            <div className="space-y-4" data-id="9duwurowy" data-path="src/components/AdminFirstTimeSetup.tsx">
              <p className="text-gray-600" data-id="a6wzpz0ll" data-path="src/components/AdminFirstTimeSetup.tsx">
                SMS configuration requires Twilio credentials and can be complex. 
                We recommend completing the basic setup first and configuring SMS later.
              </p>

              <div className="flex gap-2" data-id="r7nfjiu48" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Button
                onClick={configureSMSPlaceholder}
                variant="outline"
                className="flex-1" data-id="ctleov7j0" data-path="src/components/AdminFirstTimeSetup.tsx">

                  Skip for Now
                  <ArrowRight className="h-4 w-4 ml-2" data-id="e0ydwguye" data-path="src/components/AdminFirstTimeSetup.tsx" />
                </Button>
                <Button
                onClick={() => window.open('/admin/sms-alert-management', '_blank')}
                className="flex-1" data-id="fz1c06i48" data-path="src/components/AdminFirstTimeSetup.tsx">

                  Configure SMS Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }

      {currentStep === 3 && !steps[3].completed &&
      <Card data-id="idhzughni" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardHeader data-id="7liiyht68" data-path="src/components/AdminFirstTimeSetup.tsx">
            <CardTitle className="flex items-center gap-2" data-id="bnjoudgpy" data-path="src/components/AdminFirstTimeSetup.tsx">
              <Shield className="h-6 w-6" data-id="bvko8h5kx" data-path="src/components/AdminFirstTimeSetup.tsx" />
              Step 4: Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent data-id="y61adacra" data-path="src/components/AdminFirstTimeSetup.tsx">
            <Alert className="mb-6" data-id="8h27u68yf" data-path="src/components/AdminFirstTimeSetup.tsx">
              <CheckCircle className="h-4 w-4" data-id="q04h1v7x8" data-path="src/components/AdminFirstTimeSetup.tsx" />
              <AlertDescription data-id="7l05e9s4l" data-path="src/components/AdminFirstTimeSetup.tsx">
                Basic security settings are already configured. You can customize them later 
                in the Security Settings page.
              </AlertDescription>
            </Alert>

            <div className="space-y-4" data-id="1hevs576j" data-path="src/components/AdminFirstTimeSetup.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="9d6xs69pd" data-path="src/components/AdminFirstTimeSetup.tsx">
                <div className="p-4 border rounded-lg" data-id="sv4x1fdrh" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold text-green-600" data-id="xsa8z6xt6" data-path="src/components/AdminFirstTimeSetup.tsx">✓ User Access Control</h4>
                  <p className="text-sm text-gray-600" data-id="zfzdovn3u" data-path="src/components/AdminFirstTimeSetup.tsx">Role-based permissions are active</p>
                </div>
                <div className="p-4 border rounded-lg" data-id="43ghyh1jh" data-path="src/components/AdminFirstTimeSetup.tsx">
                  <h4 className="font-semibold text-green-600" data-id="hoj9ri8ra" data-path="src/components/AdminFirstTimeSetup.tsx">✓ Audit Logging</h4>
                  <p className="text-sm text-gray-600" data-id="6ha3njvlw" data-path="src/components/AdminFirstTimeSetup.tsx">User actions are being tracked</p>
                </div>
              </div>

              <Button
              onClick={completeSecuritySetup}
              className="w-full md:w-auto" data-id="ta9axx8ar" data-path="src/components/AdminFirstTimeSetup.tsx">

                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" data-id="pk58v1qaz" data-path="src/components/AdminFirstTimeSetup.tsx" />
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      {/* Setup Complete */}
      {progressPercentage === 100 &&
      <Card className="border-green-500 bg-green-50" data-id="bbp4dvamx" data-path="src/components/AdminFirstTimeSetup.tsx">
          <CardContent className="pt-6" data-id="8090bek7a" data-path="src/components/AdminFirstTimeSetup.tsx">
            <div className="text-center" data-id="vgyn0yevh" data-path="src/components/AdminFirstTimeSetup.tsx">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" data-id="g6tc16fds" data-path="src/components/AdminFirstTimeSetup.tsx" />
              <h3 className="text-2xl font-bold text-green-800 mb-2" data-id="fssm71zbb" data-path="src/components/AdminFirstTimeSetup.tsx">
                Setup Complete! 🎉
              </h3>
              <p className="text-green-700 mb-4" data-id="qynxlgcqw" data-path="src/components/AdminFirstTimeSetup.tsx">
                Your DFS Manager Portal is ready to use. You can now start managing your gas stations.
              </p>
              <div className="flex gap-2 justify-center" data-id="kxdfhxhvd" data-path="src/components/AdminFirstTimeSetup.tsx">
                <Button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-green-600 hover:bg-green-700" data-id="il8pl4qly" data-path="src/components/AdminFirstTimeSetup.tsx">

                  Go to Dashboard
                </Button>
                <Button
                variant="outline"
                onClick={() => window.open('/dashboard?tab=setup', '_blank')} data-id="2p6to1d2y" data-path="src/components/AdminFirstTimeSetup.tsx">

                  View Setup Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default AdminFirstTimeSetup;