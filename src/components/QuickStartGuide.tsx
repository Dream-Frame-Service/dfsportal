import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play, CheckCircle, Clock, ArrowRight, Users, Building,
  MessageSquare, Package, FileText, Shield, Zap, Database,
  Rocket, Target, Calendar, Book } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface QuickStartTask {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  category: 'essential' | 'recommended' | 'optional';
  actionPath: string;
  actionLabel: string;
  benefits: string[];
}

const QuickStartGuide: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const quickStartTasks: QuickStartTask[] = [
  {
    id: 'create-admin',
    title: 'Create Your First Admin Account',
    description: 'Set up an administrator account to manage your gas station system',
    icon: <Users className="h-5 w-5" data-id="3ba4v0axd" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '5 min',
    difficulty: 'easy',
    category: 'essential',
    actionPath: '/admin/user-management',
    actionLabel: 'Create Admin',
    benefits: [
    'Full system access and control',
    'Ability to manage other users',
    'Access to all administrative features']

  },
  {
    id: 'setup-stations',
    title: 'Configure Your Gas Stations',
    description: 'Add information for MOBIL, AMOCO ROSEDALE, and AMOCO BROOKLYN',
    icon: <Building className="h-5 w-5" data-id="sl6l2lxw7" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '10 min',
    difficulty: 'easy',
    category: 'essential',
    actionPath: '/admin/site-management',
    actionLabel: 'Setup Stations',
    benefits: [
    'Organize operations by location',
    'Track station-specific performance',
    'Manage location-based permissions']

  },
  {
    id: 'configure-sms',
    title: 'Enable SMS Alerts',
    description: 'Set up automatic notifications for license renewals and critical alerts',
    icon: <MessageSquare className="h-5 w-5" data-id="ynl72hsyt" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '15 min',
    difficulty: 'medium',
    category: 'essential',
    actionPath: '/admin/sms-alert-management',
    actionLabel: 'Setup SMS',
    benefits: [
    'Never miss license renewal deadlines',
    'Instant alerts for critical issues',
    'Automated compliance notifications']

  },
  {
    id: 'add-employees',
    title: 'Add Your Team Members',
    description: 'Create employee profiles and assign appropriate access levels',
    icon: <Users className="h-5 w-5" data-id="7q7yhqqo1" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '20 min',
    difficulty: 'easy',
    category: 'recommended',
    actionPath: '/employees',
    actionLabel: 'Add Employees',
    benefits: [
    'Track employee information',
    'Manage payroll and schedules',
    'Control system access by role']

  },
  {
    id: 'upload-licenses',
    title: 'Upload Business Licenses',
    description: 'Add all required licenses and certificates with expiry tracking',
    icon: <FileText className="h-5 w-5" data-id="kec9o5034" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '25 min',
    difficulty: 'medium',
    category: 'essential',
    actionPath: '/licenses',
    actionLabel: 'Upload Licenses',
    benefits: [
    'Automatic expiry notifications',
    'Compliance tracking',
    'Digital document storage']

  },
  {
    id: 'import-products',
    title: 'Add Your Product Inventory',
    description: 'Import existing products or start adding items with barcode scanning',
    icon: <Package className="h-5 w-5" data-id="v9zf6e93x" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '30 min',
    difficulty: 'medium',
    category: 'recommended',
    actionPath: '/products',
    actionLabel: 'Manage Inventory',
    benefits: [
    'Track stock levels automatically',
    'Monitor profit margins',
    'Automate reorder alerts']

  },
  {
    id: 'test-visual-editing',
    title: 'Test Visual Editing Features',
    description: 'Try the visual editing tools to customize your interface',
    icon: <Zap className="h-5 w-5" data-id="sze8v1kus" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '10 min',
    difficulty: 'easy',
    category: 'optional',
    actionPath: '/',
    actionLabel: 'Test Editing',
    benefits: [
    'Customize interface without coding',
    'Update content in real-time',
    'Personalize user experience']

  },
  {
    id: 'setup-security',
    title: 'Configure Security Settings',
    description: 'Enable audit logging and set up access controls',
    icon: <Shield className="h-5 w-5" data-id="d5bxqq6vg" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '15 min',
    difficulty: 'advanced',
    category: 'recommended',
    actionPath: '/admin/security',
    actionLabel: 'Setup Security',
    benefits: [
    'Track all user actions',
    'Prevent unauthorized access',
    'Meet compliance requirements']

  },
  {
    id: 'monitor-database',
    title: 'Enable System Monitoring',
    description: 'Set up performance monitoring and automated alerts',
    icon: <Database className="h-5 w-5" data-id="vfkspw9ic" data-path="src/components/QuickStartGuide.tsx" />,
    duration: '10 min',
    difficulty: 'advanced',
    category: 'optional',
    actionPath: '/admin/database-monitoring',
    actionLabel: 'Setup Monitoring',
    benefits: [
    'Proactive issue detection',
    'Performance optimization',
    'System health insights']

  }];


  const getDifficultyBadge = (difficulty: QuickStartTask['difficulty']) => {
    const config = {
      easy: { label: 'Easy', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: 'Advanced', className: 'bg-red-100 text-red-800' }
    };
    return <Badge className={config[difficulty].className} data-id="r1i7gb8or" data-path="src/components/QuickStartGuide.tsx">{config[difficulty].label}</Badge>;
  };

  const getCategoryBadge = (category: QuickStartTask['category']) => {
    const config = {
      essential: { label: 'Essential', className: 'bg-red-500 text-white' },
      recommended: { label: 'Recommended', className: 'bg-blue-500 text-white' },
      optional: { label: 'Optional', className: 'bg-gray-500 text-white' }
    };
    return <Badge className={config[category].className} data-id="1hzgbsvyy" data-path="src/components/QuickStartGuide.tsx">{config[category].label}</Badge>;
  };

  const handleTaskAction = (task: QuickStartTask) => {
    navigate(task.actionPath);
    toast({
      title: "Starting Setup Task",
      description: `Opening ${task.title} configuration...`
    });
  };

  const markTaskCompleted = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      toast({
        title: "Task Completed!",
        description: "Great job! You're making excellent progress."
      });
    }
  };

  const getTasksByCategory = (category: string) => {
    return quickStartTasks.filter((task) => task.category === category);
  };

  const essentialTasks = getTasksByCategory('essential');
  const recommendedTasks = getTasksByCategory('recommended');
  const optionalTasks = getTasksByCategory('optional');

  const completionPercentage = Math.round(completedTasks.length / quickStartTasks.length * 100);

  return (
    <div className="space-y-6" data-id="nyzbpworv" data-path="src/components/QuickStartGuide.tsx">
      {/* Quick Start Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" data-id="524liuqrk" data-path="src/components/QuickStartGuide.tsx">
        <CardHeader data-id="deb9dm14r" data-path="src/components/QuickStartGuide.tsx">
          <div className="flex items-center justify-between" data-id="gocp5s50r" data-path="src/components/QuickStartGuide.tsx">
            <div data-id="cvj3g0ne4" data-path="src/components/QuickStartGuide.tsx">
              <CardTitle className="flex items-center gap-2 text-2xl" data-id="byuq4lhww" data-path="src/components/QuickStartGuide.tsx">
                <Rocket className="h-8 w-8" data-id="8sto1157c" data-path="src/components/QuickStartGuide.tsx" />
                Quick Start Guide
              </CardTitle>
              <p className="text-blue-100 mt-2 text-lg" data-id="b0hkzkek0" data-path="src/components/QuickStartGuide.tsx">
                Get your DFS Manager Portal up and running in under an hour
              </p>
            </div>
            <div className="text-center" data-id="iq8fxu2d9" data-path="src/components/QuickStartGuide.tsx">
              <div className="text-4xl font-bold" data-id="hqupyzegj" data-path="src/components/QuickStartGuide.tsx">{completionPercentage}%</div>
              <p className="text-blue-100" data-id="2a0zoooc5" data-path="src/components/QuickStartGuide.tsx">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="2wxthlhos" data-path="src/components/QuickStartGuide.tsx">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center" data-id="5w9339odk" data-path="src/components/QuickStartGuide.tsx">
            <div data-id="a2wskmzeh" data-path="src/components/QuickStartGuide.tsx">
              <div className="text-2xl font-bold" data-id="ztqs6229e" data-path="src/components/QuickStartGuide.tsx">{essentialTasks.length}</div>
              <p className="text-blue-100" data-id="sjfy4saok" data-path="src/components/QuickStartGuide.tsx">Essential Tasks</p>
            </div>
            <div data-id="zxseq6py2" data-path="src/components/QuickStartGuide.tsx">
              <div className="text-2xl font-bold" data-id="uep64z9lz" data-path="src/components/QuickStartGuide.tsx">{recommendedTasks.length}</div>
              <p className="text-blue-100" data-id="c00zsoqmz" data-path="src/components/QuickStartGuide.tsx">Recommended</p>
            </div>
            <div data-id="qkn0l302r" data-path="src/components/QuickStartGuide.tsx">
              <div className="text-2xl font-bold" data-id="a691vx5n0" data-path="src/components/QuickStartGuide.tsx">~60 min</div>
              <p className="text-blue-100" data-id="lcwjt1eqc" data-path="src/components/QuickStartGuide.tsx">Total Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Checklist */}
      <Card data-id="r8ec3kuap" data-path="src/components/QuickStartGuide.tsx">
        <CardHeader data-id="hhvhjdzhf" data-path="src/components/QuickStartGuide.tsx">
          <CardTitle className="flex items-center gap-2" data-id="ukqov39b3" data-path="src/components/QuickStartGuide.tsx">
            <Target className="h-6 w-6" data-id="lcillolt1" data-path="src/components/QuickStartGuide.tsx" />
            Your Quick Start Checklist
          </CardTitle>
          <p className="text-gray-600" data-id="xjx6z8yrl" data-path="src/components/QuickStartGuide.tsx">
            Follow these steps in order for the best setup experience
          </p>
        </CardHeader>
        <CardContent data-id="2r894o27v" data-path="src/components/QuickStartGuide.tsx">
          <Tabs defaultValue="essential" data-id="mcph548ar" data-path="src/components/QuickStartGuide.tsx">
            <TabsList className="grid w-full grid-cols-3" data-id="zobsfc9lz" data-path="src/components/QuickStartGuide.tsx">
              <TabsTrigger value="essential" data-id="yazbbig7e" data-path="src/components/QuickStartGuide.tsx">
                Essential ({essentialTasks.length})
              </TabsTrigger>
              <TabsTrigger value="recommended" data-id="ylmuz2dkg" data-path="src/components/QuickStartGuide.tsx">
                Recommended ({recommendedTasks.length})
              </TabsTrigger>
              <TabsTrigger value="optional" data-id="y60qy6bc8" data-path="src/components/QuickStartGuide.tsx">
                Optional ({optionalTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="essential" className="space-y-4" data-id="ouipa9wp4" data-path="src/components/QuickStartGuide.tsx">
              <Alert data-id="9osrgd28h" data-path="src/components/QuickStartGuide.tsx">
                <Target className="h-4 w-4" data-id="elewbsmom" data-path="src/components/QuickStartGuide.tsx" />
                <AlertDescription data-id="8ho4fipfu" data-path="src/components/QuickStartGuide.tsx">
                  These tasks are essential for basic system functionality. Complete these first to get started.
                </AlertDescription>
              </Alert>
              
              {essentialTasks.map((task, index) =>
              <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50" data-id="m36f38lp8" data-path="src/components/QuickStartGuide.tsx">
                  <div className="flex-shrink-0" data-id="ih94g2mrs" data-path="src/components/QuickStartGuide.tsx">
                    {completedTasks.includes(task.id) ?
                  <CheckCircle className="h-8 w-8 text-green-500" data-id="ftx3yd0gq" data-path="src/components/QuickStartGuide.tsx" /> :

                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600" data-id="otez6mw2k" data-path="src/components/QuickStartGuide.tsx">
                        {index + 1}
                      </div>
                  }
                  </div>
                  
                  <div className="flex-1" data-id="pl4g4gmio" data-path="src/components/QuickStartGuide.tsx">
                    <div className="flex items-center gap-2 mb-1" data-id="v79g9uwfe" data-path="src/components/QuickStartGuide.tsx">
                      <h4 className="font-semibold" data-id="uub4wsbcc" data-path="src/components/QuickStartGuide.tsx">{task.title}</h4>
                      {getCategoryBadge(task.category)}
                      {getDifficultyBadge(task.difficulty)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2" data-id="cby8zzj7u" data-path="src/components/QuickStartGuide.tsx">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500" data-id="s70ij1cr7" data-path="src/components/QuickStartGuide.tsx">
                      <span className="flex items-center gap-1" data-id="z09og92y8" data-path="src/components/QuickStartGuide.tsx">
                        <Clock className="h-3 w-3" data-id="i7k7lawk0" data-path="src/components/QuickStartGuide.tsx" />
                        {task.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2" data-id="fs6a4h5nx" data-path="src/components/QuickStartGuide.tsx">
                    {!completedTasks.includes(task.id) &&
                  <Button onClick={() => handleTaskAction(task)} data-id="kit9tibdg" data-path="src/components/QuickStartGuide.tsx">
                        {task.actionLabel}
                        <ArrowRight className="h-4 w-4 ml-2" data-id="2kbd4pupw" data-path="src/components/QuickStartGuide.tsx" />
                      </Button>
                  }
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markTaskCompleted(task.id)}
                    disabled={completedTasks.includes(task.id)} data-id="a2dputhf2" data-path="src/components/QuickStartGuide.tsx">

                      {completedTasks.includes(task.id) ? 'Completed' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4" data-id="mdty9kdwz" data-path="src/components/QuickStartGuide.tsx">
              <Alert data-id="qomjnjk5t" data-path="src/components/QuickStartGuide.tsx">
                <Book className="h-4 w-4" data-id="jhqtaic6j" data-path="src/components/QuickStartGuide.tsx" />
                <AlertDescription data-id="74pln9z82" data-path="src/components/QuickStartGuide.tsx">
                  These tasks will enhance your system's functionality and help you get the most out of the platform.
                </AlertDescription>
              </Alert>
              
              {recommendedTasks.map((task, index) =>
              <div key={task.id} className="p-4 border rounded-lg" data-id="9flkzy4w7" data-path="src/components/QuickStartGuide.tsx">
                  <div className="flex items-start justify-between mb-3" data-id="bn5nx6qil" data-path="src/components/QuickStartGuide.tsx">
                    <div className="flex items-center gap-3" data-id="nkhz7ulwg" data-path="src/components/QuickStartGuide.tsx">
                      <div className="p-2 bg-blue-100 rounded-lg" data-id="qcmdad2ul" data-path="src/components/QuickStartGuide.tsx">
                        {task.icon}
                      </div>
                      <div data-id="lvmy7ufgv" data-path="src/components/QuickStartGuide.tsx">
                        <div className="flex items-center gap-2 mb-1" data-id="4aebc3t36" data-path="src/components/QuickStartGuide.tsx">
                          <h4 className="font-semibold" data-id="wqpsg5crc" data-path="src/components/QuickStartGuide.tsx">{task.title}</h4>
                          {getCategoryBadge(task.category)}
                          {getDifficultyBadge(task.difficulty)}
                        </div>
                        <p className="text-gray-600 text-sm" data-id="1w8qy6j51" data-path="src/components/QuickStartGuide.tsx">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500" data-id="zq2xq1qd9" data-path="src/components/QuickStartGuide.tsx">
                      <Clock className="h-4 w-4" data-id="wppeb28o1" data-path="src/components/QuickStartGuide.tsx" />
                      {task.duration}
                    </div>
                  </div>
                  
                  <div className="ml-11 space-y-3" data-id="4y9mmc5ml" data-path="src/components/QuickStartGuide.tsx">
                    <div className="p-3 bg-green-50 rounded-lg" data-id="qgfgoq4v7" data-path="src/components/QuickStartGuide.tsx">
                      <h5 className="text-sm font-medium text-green-800 mb-2" data-id="uhv0fizxb" data-path="src/components/QuickStartGuide.tsx">Benefits:</h5>
                      <ul className="text-sm text-green-700 space-y-1" data-id="9t4xxc16t" data-path="src/components/QuickStartGuide.tsx">
                        {task.benefits.map((benefit, i) =>
                      <li key={i} className="flex items-start gap-2" data-id="6544lrwoc" data-path="src/components/QuickStartGuide.tsx">
                            <span className="text-green-500 mt-1" data-id="97nq16hxp" data-path="src/components/QuickStartGuide.tsx">•</span>
                            {benefit}
                          </li>
                      )}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2" data-id="wkv2pujje" data-path="src/components/QuickStartGuide.tsx">
                      <Button onClick={() => handleTaskAction(task)} data-id="cnrief0c4" data-path="src/components/QuickStartGuide.tsx">
                        {task.actionLabel}
                      </Button>
                      <Button
                      variant="outline"
                      onClick={() => markTaskCompleted(task.id)}
                      disabled={completedTasks.includes(task.id)} data-id="8vxgcnv1r" data-path="src/components/QuickStartGuide.tsx">

                        {completedTasks.includes(task.id) ? 'Completed' : 'Mark Done'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="optional" className="space-y-4" data-id="ht7dot4iv" data-path="src/components/QuickStartGuide.tsx">
              <Alert data-id="d7n22uxq5" data-path="src/components/QuickStartGuide.tsx">
                <Zap className="h-4 w-4" data-id="oikqsotfo" data-path="src/components/QuickStartGuide.tsx" />
                <AlertDescription data-id="cpcyo310t" data-path="src/components/QuickStartGuide.tsx">
                  These optional tasks will help you explore advanced features and customize your experience.
                </AlertDescription>
              </Alert>
              
              {optionalTasks.map((task) =>
              <div key={task.id} className="p-4 border rounded-lg" data-id="f7pebcz6a" data-path="src/components/QuickStartGuide.tsx">
                  <div className="flex items-center justify-between mb-3" data-id="m327wby9g" data-path="src/components/QuickStartGuide.tsx">
                    <div className="flex items-center gap-3" data-id="a1ns6wwdd" data-path="src/components/QuickStartGuide.tsx">
                      <div className="p-2 bg-purple-100 rounded-lg" data-id="jhdqaiwgz" data-path="src/components/QuickStartGuide.tsx">
                        {task.icon}
                      </div>
                      <div data-id="4o4fj9rjq" data-path="src/components/QuickStartGuide.tsx">
                        <div className="flex items-center gap-2 mb-1" data-id="ovrdkvhvs" data-path="src/components/QuickStartGuide.tsx">
                          <h4 className="font-semibold" data-id="q51ml0own" data-path="src/components/QuickStartGuide.tsx">{task.title}</h4>
                          {getCategoryBadge(task.category)}
                          {getDifficultyBadge(task.difficulty)}
                        </div>
                        <p className="text-gray-600 text-sm" data-id="asaw1p62h" data-path="src/components/QuickStartGuide.tsx">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500" data-id="0gers2tm1" data-path="src/components/QuickStartGuide.tsx">
                      <Clock className="h-4 w-4" data-id="oghoeyokg" data-path="src/components/QuickStartGuide.tsx" />
                      {task.duration}
                    </div>
                  </div>
                  
                  <div className="flex gap-2" data-id="b1zsc1hxw" data-path="src/components/QuickStartGuide.tsx">
                    <Button variant="outline" onClick={() => handleTaskAction(task)} data-id="nach391hn" data-path="src/components/QuickStartGuide.tsx">
                      {task.actionLabel}
                    </Button>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markTaskCompleted(task.id)}
                    disabled={completedTasks.includes(task.id)} data-id="cxot1rrzj" data-path="src/components/QuickStartGuide.tsx">

                      {completedTasks.includes(task.id) ? '✓ Done' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Message */}
      {completionPercentage === 100 &&
      <Card className="border-green-500 bg-green-50" data-id="h8oyzmc3u" data-path="src/components/QuickStartGuide.tsx">
          <CardContent className="pt-6" data-id="3ffuhatmo" data-path="src/components/QuickStartGuide.tsx">
            <div className="text-center" data-id="7b003izvq" data-path="src/components/QuickStartGuide.tsx">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" data-id="wppgfutt8" data-path="src/components/QuickStartGuide.tsx" />
              <h3 className="text-2xl font-bold text-green-800 mb-2" data-id="lpm9rjl66" data-path="src/components/QuickStartGuide.tsx">
                Congratulations! 🎉
              </h3>
              <p className="text-green-700 mb-4" data-id="7tjbs8v9n" data-path="src/components/QuickStartGuide.tsx">
                You've completed the quick start guide. Your DFS Manager Portal is ready to use!
              </p>
              <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/dashboard')} data-id="4x1caiku7" data-path="src/components/QuickStartGuide.tsx">

                Go to Full Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default QuickStartGuide;
