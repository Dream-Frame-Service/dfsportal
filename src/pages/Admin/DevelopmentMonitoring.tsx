import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccessDenied from '@/components/AccessDenied';
import { useAdminAccess } from '@/hooks/use-admin-access';
import DevelopmentMonitor from '@/components/DevelopmentMonitor';
import {
  Code2,
  FileText,
  GitBranch,
  Monitor,
  Settings,
  Terminal,
  Wrench } from
'lucide-react';

const DevelopmentMonitoringPage: React.FC = () => {
  const { hasAdminAccess } = useAdminAccess();

  if (!hasAdminAccess) {
    return <AccessDenied data-id="1d7hau4hk" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />;
  }

  const quickActions = [
  {
    title: 'Run Lint Check',
    description: 'Check code for linting issues',
    command: 'npm run lint:check',
    icon: <Code2 className="h-4 w-4" data-id="27ys9p7zo" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'blue'
  },
  {
    title: 'Fix Lint Issues',
    description: 'Auto-fix linting problems',
    command: 'npm run lint:fix',
    icon: <Wrench className="h-4 w-4" data-id="aoh8gpfb3" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'green'
  },
  {
    title: 'Check Imports',
    description: 'Analyze import statements',
    command: 'npm run check-imports',
    icon: <GitBranch className="h-4 w-4" data-id="i3qw13klv" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'purple'
  },
  {
    title: 'Type Check',
    description: 'Run TypeScript validation',
    command: 'npm run type-check',
    icon: <FileText className="h-4 w-4" data-id="5zr1cg7gv" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'orange'
  },
  {
    title: 'Quality Check',
    description: 'Complete quality analysis',
    command: 'npm run quality-check',
    icon: <Monitor className="h-4 w-4" data-id="t2j7tritn" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'red'
  },
  {
    title: 'Setup Git Hooks',
    description: 'Install development hooks',
    command: 'npm run setup-hooks',
    icon: <Settings className="h-4 w-4" data-id="ucd6e2qkj" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />,
    color: 'gray'
  }];


  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'green':return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'purple':return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      case 'orange':return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
      case 'red':return 'border-red-200 bg-red-50 hover:bg-red-100';
      default:return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6" data-id="104ji5uzf" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
      <div className="flex items-center justify-between" data-id="4jwr6grim" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
        <div data-id="6xcbvz4p5" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          <h1 className="text-3xl font-bold" data-id="ytfa59ri9" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Development Monitoring</h1>
          <p className="text-muted-foreground" data-id="sp67fbvrk" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
            Monitor code quality, imports, and development workflow
          </p>
        </div>
        <Badge variant="outline" className="text-green-600" data-id="nvc389uoe" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          Development Environment
        </Badge>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6" data-id="fjoewmet7" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="xw5vzn5ua" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          <TabsTrigger value="monitor" data-id="df4yd78nq" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Live Monitor</TabsTrigger>
          <TabsTrigger value="actions" data-id="bhayxt2vp" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Quick Actions</TabsTrigger>
          <TabsTrigger value="setup" data-id="myiwho0rb" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" data-id="0hs1ryto2" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          <DevelopmentMonitor data-id="49c2vtedn" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6" data-id="xa4jx9lto" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          <Card data-id="ghz1j7t1p" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
            <CardHeader data-id="e0sngx629" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
              <CardTitle className="flex items-center gap-2" data-id="1gx7zbixg" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <Terminal className="h-5 w-5" data-id="7n0qh9v9f" data-path="src/pages/Admin/DevelopmentMonitoring.tsx" />
                Development Commands
              </CardTitle>
            </CardHeader>
            <CardContent data-id="52lrjc8hu" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="cohm4bfeo" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                {quickActions.map((action, index) =>
                <Card
                  key={index}
                  className={`cursor-pointer transition-colors ${getColorClasses(action.color)}`}
                  onClick={() => {
                    navigator.clipboard.writeText(action.command);
                    // You could add a toast notification here
                  }} data-id="awryz1uqj" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">

                    <CardContent className="p-4" data-id="1ckofc9vr" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      <div className="flex items-start gap-3" data-id="3t8joetfg" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                        <div className="mt-1" data-id="9n12qay57" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                          {action.icon}
                        </div>
                        <div className="flex-1 min-w-0" data-id="92h68uf5o" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                          <h3 className="font-semibold text-sm mb-1" data-id="g1pt5ozi4" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                            {action.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2" data-id="1aeb9m0gk" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                            {action.description}
                          </p>
                          <code className="text-xs bg-white/50 px-2 py-1 rounded border" data-id="sp9rpdyrn" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                            {action.command}
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200" data-id="953kcu9pp" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <p className="text-sm text-blue-800" data-id="h052rxsb3" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                  💡 <strong data-id="3ae33bjti" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Tip:</strong> Click on any command card to copy the command to your clipboard. 
                  Then paste it in your terminal to run the check.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6" data-id="tocp6sqq5" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-id="z4vvyu2s0" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
            <Card data-id="dkd1b76oc" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
              <CardHeader data-id="g7fgsreae" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <CardTitle data-id="13p91r9ae" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Initial Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="x5hyw950a" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <div className="space-y-3" data-id="h1yrrnbvw" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                  <div className="border-l-4 border-blue-500 pl-4" data-id="6c375j2bf" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="k786s3ys9" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">1. Install Git Hooks</h4>
                    <p className="text-sm text-muted-foreground" data-id="i2azea2k4" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Automatically run checks before commits
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-id="fiy3pebiw" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      npm run setup-hooks
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4" data-id="dw4gcs6xa" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="t54twh286" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">2. VS Code Setup</h4>
                    <p className="text-sm text-muted-foreground" data-id="7bh11o0tp" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Install recommended extensions for better development experience
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4" data-id="vw0ei12jr" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="fntj3hude" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">3. Run Initial Check</h4>
                    <p className="text-sm text-muted-foreground" data-id="tl6f2qyeg" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Verify everything is working correctly
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-id="rs24ibn2h" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      npm run quality-check
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="k12vcc346" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
              <CardHeader data-id="dsjb180nt" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <CardTitle data-id="9ydgs1fzh" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Development Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="6fldj8qzt" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <div className="space-y-3" data-id="0uy6q45sl" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                  <div className="border-l-4 border-orange-500 pl-4" data-id="z0uckor3i" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="58qy9prbk" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Daily Development</h4>
                    <p className="text-sm text-muted-foreground" data-id="mj3owpvgr" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Start development with safety checks
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-id="rbdx3leyt" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      npm run dev:safe
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4" data-id="mcokmi0w6" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="cmtxn6sjc" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Before Deployment</h4>
                    <p className="text-sm text-muted-foreground" data-id="r2t3wt4gu" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Ensure production readiness
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-id="5ba75gefh" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      npm run build:safe
                    </code>
                  </div>
                  
                  <div className="border-l-4 border-gray-500 pl-4" data-id="ze66beptf" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold" data-id="2e8p4w71g" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Weekly Maintenance</h4>
                    <p className="text-sm text-muted-foreground" data-id="oubh95fnm" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      Regular code health checks
                    </p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded" data-id="bgpfga435" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      npm run check-imports
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2" data-id="ty658gb9i" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
              <CardHeader data-id="489kw5ikw" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <CardTitle data-id="uuug62g00" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Monitoring Features</CardTitle>
              </CardHeader>
              <CardContent data-id="v4gh0uiq1" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="5u9bs1ixu" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                  <div data-id="ahvpphqwg" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold mb-2" data-id="io1jq3x9p" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Automated Checks</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground" data-id="8mjh476jm" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      <li data-id="gbhwq0h43" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Import statement validation</li>
                      <li data-id="7vp46dzzk" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Missing dependency detection</li>
                      <li data-id="2qs5gtbz7" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Unused import identification</li>
                      <li data-id="pvui0tnve" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Circular dependency warnings</li>
                      <li data-id="7v5cepaj2" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• TypeScript compilation errors</li>
                      <li data-id="od8ppsx4s" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• ESLint rule violations</li>
                    </ul>
                  </div>
                  <div data-id="xvpc5pr4j" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                    <h4 className="font-semibold mb-2" data-id="xt4q1u5bb" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">Git Integration</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground" data-id="bvgqpcm2o" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">
                      <li data-id="2he208f1m" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Pre-commit quality checks</li>
                      <li data-id="xur7mqti8" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Pre-push build verification</li>
                      <li data-id="vr6l0ug10" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Automatic issue prevention</li>
                      <li data-id="wbr3hbwb5" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Development workflow enforcement</li>
                      <li data-id="yal6trobx" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Code quality maintenance</li>
                      <li data-id="wsk622qhn" data-path="src/pages/Admin/DevelopmentMonitoring.tsx">• Import issue detection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export { DevelopmentMonitoringPage };
export default DevelopmentMonitoringPage;