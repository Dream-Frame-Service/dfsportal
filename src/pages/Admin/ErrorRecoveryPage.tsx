import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorRecovery } from '@/components/ErrorBoundary';
import ErrorBoundaryDemo from '@/components/ErrorBoundaryDemo';
import EnhancedErrorBoundaryDemo from '@/components/EnhancedErrorBoundaryDemo';
import ErrorAnalyticsDashboard from '@/components/ErrorAnalyticsDashboard';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';
import { AlertTriangle, Shield, Bug, TestTube, BarChart3, Activity } from 'lucide-react';

const ErrorRecoveryPage: React.FC = () => {
  const { hasMonitoringAccess } = useAdminAccess();
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Check admin access first
  if (!hasMonitoringAccess) {
    return (
      <AccessDenied
        feature="Error Recovery and Monitoring"
        requiredRole="Administrator" data-id="1qtn79xc0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />);


  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-id="8uh2jpwlh" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
      {/* Header */}
      <div className="flex items-center space-x-4" data-id="igbwt5y7g" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
        <div className="p-3 bg-red-100 rounded-full" data-id="oefx21e57" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <Bug className="h-8 w-8 text-red-600" data-id="cx1ega705" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
        </div>
        <div data-id="6si7r7w6p" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-id="as7jaca94" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Recovery Center</h1>
          <p className="text-lg text-gray-600" data-id="036v5sp77" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            Monitor and manage application errors for better stability
          </p>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="dtv6s4x8j" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
        <Card data-id="qgcn93y0m" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="7tsdhasbb" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardTitle className="text-sm font-medium" data-id="02w852amd" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Boundaries</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" data-id="580juaiwj" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
          </CardHeader>
          <CardContent data-id="wfbl9d3rp" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <div className="text-2xl font-bold text-green-600" data-id="4sjsspkq9" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Active</div>
            <p className="text-xs text-muted-foreground" data-id="d5pgcmfux" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              Protecting critical components
            </p>
          </CardContent>
        </Card>
        
        <Card data-id="xycbn6ttv" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="wtf9digg8" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardTitle className="text-sm font-medium" data-id="x5v4p2spo" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Logging</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" data-id="xwjpp6f0f" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
          </CardHeader>
          <CardContent data-id="7bmulk8y6" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <div className="text-2xl font-bold text-blue-600" data-id="604t466bc" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Enabled</div>
            <p className="text-xs text-muted-foreground" data-id="38gynn69l" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              Capturing detailed error information
            </p>
          </CardContent>
        </Card>
        
        <Card data-id="u0xpezzqu" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="v9ayiffib" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardTitle className="text-sm font-medium" data-id="or24fl2rl" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Recovery Tools</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" data-id="y8lvgklxb" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
          </CardHeader>
          <CardContent data-id="04jdaawk6" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <div className="text-2xl font-bold text-purple-600" data-id="4zemt1lf7" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Available</div>
            <p className="text-xs text-muted-foreground" data-id="u1qkedozv" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              Export, clear, and analyze errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-id="mrl7a8tvu" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="2alptkyjx" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <TabsTrigger value="overview" data-id="szbcqri9z" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Overview</TabsTrigger>
          <TabsTrigger value="testing" data-id="25rd0zk8i" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Testing</TabsTrigger>
          <TabsTrigger value="analytics" data-id="pb29te5wk" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Analytics</TabsTrigger>
          <TabsTrigger value="recovery" data-id="z483lve3w" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Recovery Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" data-id="77ll5pqqv" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          {/* Error Boundary Implementation */}
          <Card data-id="nisgnw2uw" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardHeader data-id="bg3hxf4yf" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              <CardTitle data-id="cs7i18uhw" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Boundary Implementation</CardTitle>
              <CardDescription data-id="75matbljk" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                This DFS Manager Portal includes comprehensive error handling
              </CardDescription>
            </CardHeader>
            <CardContent data-id="2ywyz9php" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="k1d1yvdvw" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                <div data-id="nrm3pq4o4" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                  <h4 className="font-semibold mb-3" data-id="o4zsxzhq0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Implemented Error Boundaries:</h4>
                  <ul className="space-y-2 text-sm" data-id="x17kvu1m0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    <li className="flex items-center gap-2" data-id="8ihpwn0bk" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-green-500 rounded-full" data-id="lnmro548t" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="6hhres4xz" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"><strong data-id="u95hq0ot5" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Global Error Boundary:</strong> Catches all unhandled errors</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="ilrtiuzh3" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="t0am750my" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="wb35jk023" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"><strong data-id="wnolwq9wo" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Page Error Boundary:</strong> Isolates page-level errors</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="43614qz5g" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" data-id="mfe6o9c01" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="2igp5d28w" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"><strong data-id="mqs0o232w" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Form Error Boundary:</strong> Protects critical form components</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="1r8lzh5vh" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" data-id="1wmf8e8py" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="qpz0w5g55" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"><strong data-id="a2fike1gn" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Component Error Boundary:</strong> Guards individual components</span>
                    </li>
                  </ul>
                </div>
                
                <div data-id="3x27yy161" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                  <h4 className="font-semibold mb-3" data-id="g64qjz06r" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error Handling Features:</h4>
                  <ul className="space-y-2 text-sm" data-id="drqt1tyat" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    <li className="flex items-center gap-2" data-id="lhcoqnlpr" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-green-500 rounded-full" data-id="tniq246f9" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="p6whftqm4" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Graceful fallback UI components</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="8tm0qifk5" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="rk7esok5w" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="retiifz0r" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Detailed error logging and reporting</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="666t0hmo0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" data-id="433fejfq1" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="rq0ufgxk7" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Form data recovery capabilities</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="s3dh6gpsu" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" data-id="x4e0xk0ik" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="9a09ihscm" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">User-friendly error messages</span>
                    </li>
                    <li className="flex items-center gap-2" data-id="bcmppbkde" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                      <div className="w-2 h-2 bg-red-500 rounded-full" data-id="memte24d0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx"></div>
                      <span data-id="e8vn0tr24" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">Error export and analysis tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6" data-id="uteo2tkgo" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <Card data-id="0zvv76awx" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardHeader data-id="99nl1bacz" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              <div className="flex items-center justify-between" data-id="fznba7lc3" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                <div data-id="guxhmfqfi" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                  <CardTitle className="flex items-center gap-2" data-id="bdibnpmf0" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    <TestTube className="h-5 w-5" data-id="5obsa6xo2" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
                    Interactive Error Testing
                  </CardTitle>
                  <CardDescription data-id="dbqwhnfll" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    Comprehensive error boundary testing with pattern monitoring
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowDemo(!showDemo)}
                  variant={showDemo ? 'secondary' : 'default'} data-id="6sse9pxt1" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                  {showDemo ? 'Hide Enhanced Demo' : 'Show Enhanced Demo'}
                </Button>
              </div>
            </CardHeader>
            <CardContent data-id="9swup23tq" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              {showDemo ?
              <EnhancedErrorBoundaryDemo data-id="33217jfd2" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" /> :

              <div className="text-center py-8" data-id="6j5hmlf7r" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                  <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" data-id="0k5gasuj2" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
                  <p className="text-muted-foreground mb-4" data-id="n6g98yjw1" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    Click "Show Enhanced Demo" to access comprehensive error testing scenarios
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1" data-id="aoguz1gmc" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                    <li data-id="3wvox4irz" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">• Component rendering errors</li>
                    <li data-id="9p32a7vss" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">• Async operation failures</li>
                    <li data-id="26lorawxq" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">• Database connection issues</li>
                    <li data-id="sajn4zxrt" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">• Memory leak simulations</li>
                    <li data-id="864f4i1bk" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">• Automated testing suite</li>
                  </ul>
                </div>
              }
            </CardContent>
          </Card>

          {/* Basic Demo Section */}
          <Card data-id="ltuwe4zss" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
            <CardHeader data-id="orlmowhia" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              <CardTitle className="flex items-center gap-2" data-id="7jy5jelut" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                <Bug className="h-5 w-5" data-id="clkgys6vu" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
                Basic Error Boundary Demo
              </CardTitle>
              <CardDescription data-id="1kuzlfv6r" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
                Simple error boundary demonstration
              </CardDescription>
            </CardHeader>
            <CardContent data-id="oz5eaghkl" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
              <ErrorBoundaryDemo data-id="vbe5mco22" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6" data-id="z3y0gm8ky" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <ErrorAnalyticsDashboard data-id="rwave57lm" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6" data-id="vd6bx9jpx" data-path="src/pages/Admin/ErrorRecoveryPage.tsx">
          <ErrorRecovery data-id="g8b9e0puo" data-path="src/pages/Admin/ErrorRecoveryPage.tsx" />
        </TabsContent>
      </Tabs>


    </div>);

};

export default ErrorRecoveryPage;