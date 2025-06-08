import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Bug,
  Zap,
  Timer,
  Database,
  Network,
  FileX,
  Shield,
  BarChart3,
  RefreshCcw,
  Download,
  Trash2 } from
'lucide-react';
import { ComponentErrorBoundary, FormErrorBoundary } from './ErrorBoundary';
import { ErrorLogger } from '@/services/errorLogger';
import { useToast } from '@/hooks/use-toast';

// Error simulation components
const AsyncErrorComponent: React.FC<{shouldError: boolean;errorType: string;}> = ({ shouldError, errorType }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldError) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        if (errorType === 'network') {
          throw new Error('Network request failed: Connection timeout');
        } else if (errorType === 'parsing') {
          throw new Error('JSON parsing error: Unexpected token');
        } else if (errorType === 'permission') {
          throw new Error('Permission denied: Insufficient privileges');
        }
      }, 1000);
    }
  }, [shouldError, errorType]);

  if (isLoading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" data-id="vjlmgjzzp" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
        <div className="flex items-center gap-3" data-id="gfo60luk0" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" data-id="8esh4v41m" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
          <span className="text-sm text-yellow-800" data-id="8d27ylxzi" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Processing request...</span>
        </div>
      </div>);

  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-id="gglobclql" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
      <div className="flex items-center gap-2" data-id="hzpbls9mz" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
        <div className="w-2 h-2 bg-green-500 rounded-full" data-id="u173e2qiu" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
        <span className="text-sm text-green-800" data-id="jmptgdt78" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Async operation completed successfully</span>
      </div>
    </div>);

};

const MemoryLeakComponent: React.FC<{shouldError: boolean;}> = ({ shouldError }) => {
  const [intervalIds, setIntervalIds] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (shouldError) {
      // Simulate memory leak by creating multiple intervals
      const ids: NodeJS.Timeout[] = [];
      for (let i = 0; i < 100; i++) {
        const id = setInterval(() => {
          console.log(`Memory leak interval ${i}`);
        }, 100);
        ids.push(id);
      }
      setIntervalIds(ids);

      // Throw error after creating memory leak
      setTimeout(() => {
        throw new Error('Memory leak detected: Too many active intervals');
      }, 500);
    }

    return () => {
      intervalIds.forEach((id) => clearInterval(id));
    };
  }, [shouldError, intervalIds]);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg" data-id="e4gz3cgc2" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
      <div className="flex items-center gap-2" data-id="6dib8bzlx" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
        <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="v7aqh15nv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
        <span className="text-sm text-blue-800" data-id="sgyzvkaey" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Memory management component active</span>
      </div>
    </div>);

};

const DatabaseErrorComponent: React.FC<{shouldError: boolean;}> = ({ shouldError }) => {
  useEffect(() => {
    if (shouldError) {
      setTimeout(() => {
        throw new Error('Database connection failed: Unable to establish connection to primary database');
      }, 800);
    }
  }, [shouldError]);

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg" data-id="o93hdkp9c" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
      <div className="flex items-center gap-2" data-id="debp9trxr" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
        <Database className="w-4 h-4 text-purple-600" data-id="jd3knyihr" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
        <span className="text-sm text-purple-800" data-id="bg0fr7if5" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Database connection established</span>
      </div>
    </div>);

};

const EnhancedErrorBoundaryDemo: React.FC = () => {
  const [activeErrors, setActiveErrors] = useState<Record<string, boolean>>({});
  const [errorType, setErrorType] = useState('network');
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const { toast } = useToast();

  const errorLogger = ErrorLogger.getInstance();

  const errorScenarios = [
  {
    id: 'component',
    name: 'Component Render Error',
    description: 'Simulates a component that throws during rendering',
    icon: Bug,
    severity: 'medium' as const,
    component: (shouldError: boolean) =>
    <ComponentErrorBoundary componentName="Demo Component" severity="medium" data-id="xtoa52ln1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <div className={shouldError ? 'throw-error' : 'working'} data-id="54sy8k4o5" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
            {shouldError && (() => {throw new Error('Component render error for demo');})()}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-id="9pqk4uwfw" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <div className="flex items-center gap-2" data-id="0bkt02coi" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <div className="w-2 h-2 bg-green-500 rounded-full" data-id="ms4b67jhe" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                <span className="text-sm text-green-800" data-id="ij69upfrs" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Component rendering normally</span>
              </div>
            </div>
          </div>
        </ComponentErrorBoundary>

  },
  {
    id: 'async',
    name: 'Async Operation Error',
    description: 'Simulates errors in asynchronous operations',
    icon: Timer,
    severity: 'high' as const,
    component: (shouldError: boolean) =>
    <ComponentErrorBoundary componentName="Async Component" severity="high" data-id="j8eg1au81" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <AsyncErrorComponent shouldError={shouldError} errorType={errorType} data-id="mxgzqwbhf" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
        </ComponentErrorBoundary>

  },
  {
    id: 'database',
    name: 'Database Error',
    description: 'Simulates database connection or query errors',
    icon: Database,
    severity: 'critical' as const,
    component: (shouldError: boolean) =>
    <ComponentErrorBoundary componentName="Database Component" severity="critical" data-id="xbj456ste" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <DatabaseErrorComponent shouldError={shouldError} data-id="gxsw7j576" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
        </ComponentErrorBoundary>

  },
  {
    id: 'memory',
    name: 'Memory Leak Error',
    description: 'Simulates memory management issues',
    icon: Zap,
    severity: 'high' as const,
    component: (shouldError: boolean) =>
    <ComponentErrorBoundary componentName="Memory Component" severity="high" data-id="e9caydzpr" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <MemoryLeakComponent shouldError={shouldError} data-id="a2jmevh7b" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
        </ComponentErrorBoundary>

  }];


  const toggleError = (scenarioId: string) => {
    setActiveErrors((prev) => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }));
  };

  const runAutomatedTest = async () => {
    setTestingInProgress(true);
    setTestProgress(0);

    for (let i = 0; i < errorScenarios.length; i++) {
      const scenario = errorScenarios[i];

      // Trigger error
      setActiveErrors((prev) => ({ ...prev, [scenario.id]: true }));
      setTestProgress((i + 0.5) / errorScenarios.length * 100);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear error
      setActiveErrors((prev) => ({ ...prev, [scenario.id]: false }));
      setTestProgress((i + 1) / errorScenarios.length * 100);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setTestingInProgress(false);
    toast({
      title: "Automated Test Complete",
      description: "All error scenarios have been tested successfully."
    });
  };

  const clearAllErrors = () => {
    setActiveErrors({});
    toast({
      title: "Errors Cleared",
      description: "All active error states have been reset."
    });
  };

  const exportErrorLogs = () => {
    const logs = errorLogger.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast({
      title: "Error Logs Exported",
      description: "Error logs have been downloaded as JSON file."
    });
  };

  const clearErrorLogs = () => {
    errorLogger.clearLogs();
    toast({
      title: "Error Logs Cleared",
      description: "All stored error logs have been cleared."
    });
  };

  const errorSummary = errorLogger.getLogsSummary();

  return (
    <div className="space-y-6" data-id="tkn8erxh1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
      <Card data-id="g2vojnzyp" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
        <CardHeader data-id="kqg7qxbn1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <div className="flex items-center justify-between" data-id="jxchng0pe" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
            <div data-id="43x50thvy" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <CardTitle className="flex items-center gap-2" data-id="v78ycf5y9" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <Shield className="h-6 w-6" data-id="1ebgh038u" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                Enhanced Error Boundary Demo
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1" data-id="o7mfnz7f6" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                Comprehensive error testing and monitoring system
              </p>
            </div>
            <div className="flex gap-2" data-id="ug8ub7e2b" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <Button
                onClick={runAutomatedTest}
                disabled={testingInProgress}
                variant="outline"
                size="sm" data-id="25ougill1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">

                <BarChart3 className="w-4 h-4 mr-2" data-id="f6bpixxi3" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                Run All Tests
              </Button>
              <Button
                onClick={clearAllErrors}
                variant="outline"
                size="sm" data-id="trcurxt9i" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">

                <RefreshCcw className="w-4 h-4 mr-2" data-id="6fyhdjmp3" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="nes8sh07f" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
          <Tabs defaultValue="scenarios" className="space-y-4" data-id="kiusmjzra" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
            <TabsList className="grid w-full grid-cols-3" data-id="232ddcg8m" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <TabsTrigger value="scenarios" data-id="q42i5mtxi" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Error Scenarios</TabsTrigger>
              <TabsTrigger value="monitoring" data-id="phzqnokzw" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Error Monitoring</TabsTrigger>
              <TabsTrigger value="analytics" data-id="94ldrvt0z" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scenarios" className="space-y-6" data-id="w8sy6yzel" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              {testingInProgress &&
              <Alert data-id="72su62l5r" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <Timer className="h-4 w-4" data-id="o2iyiumju" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                  <AlertDescription data-id="332r2n4ol" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <div className="space-y-2" data-id="ovfuaufit" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <div data-id="coyac8dw9" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Automated testing in progress...</div>
                      <Progress value={testProgress} className="w-full" data-id="kv836odal" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                    </div>
                  </AlertDescription>
                </Alert>
              }

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="pfk26wyke" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                {errorScenarios.map((scenario) => {
                  const IconComponent = scenario.icon;
                  const isActive = activeErrors[scenario.id];

                  return (
                    <div key={scenario.id} className="space-y-4" data-id="ppfygpnqf" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <div className="flex items-center justify-between" data-id="yp3nfruav" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <div className="flex items-center gap-3" data-id="vtewlzsps" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <IconComponent className="h-5 w-5 text-gray-600" data-id="qfxn79ihl" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                          <div data-id="b4kcj4bkz" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <h3 className="font-semibold" data-id="dak32290b" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">{scenario.name}</h3>
                            <p className="text-sm text-muted-foreground" data-id="gqyhn2qd1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                              {scenario.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" data-id="f1l6wp0bu" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <Badge variant={isActive ? 'destructive' : 'secondary'} data-id="5n8o4hvoq" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            {isActive ? 'Error Active' : 'Normal'}
                          </Badge>
                          <Badge variant="outline" className="text-xs" data-id="eorrr4kpx" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            {scenario.severity}
                          </Badge>
                        </div>
                      </div>
                      
                      {scenario.component(isActive)}
                      
                      <Button
                        onClick={() => toggleError(scenario.id)}
                        variant={isActive ? 'default' : 'destructive'}
                        size="sm"
                        disabled={testingInProgress} data-id="wng4x1bj6" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">

                        <Zap className="w-4 h-4 mr-2" data-id="d82dgathj" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                        {isActive ? 'Fix Error' : 'Trigger Error'}
                      </Button>
                    </div>);

                })}
              </div>

              <Card className="bg-blue-50 border-blue-200" data-id="utxqifck1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <CardContent className="p-4" data-id="rrqyt8660" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <div className="flex items-start gap-3" data-id="tb4mh03mm" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" data-id="07ty2b3tq" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                    <div data-id="mv9zwcl74" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <h4 className="font-semibold text-blue-800" data-id="2atashqr2" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Advanced Configuration</h4>
                      <div className="mt-2 space-y-3" data-id="9sabc97pu" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <div data-id="4qdi4sgrb" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <label className="text-sm font-medium text-blue-700" data-id="t9iupfb1p" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            Async Error Type:
                          </label>
                          <Select value={errorType} onValueChange={setErrorType} data-id="t07y7tjo4" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <SelectTrigger className="w-full mt-1" data-id="5pqu6qd9b" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                              <SelectValue data-id="219ovq9yn" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                            </SelectTrigger>
                            <SelectContent data-id="0un6thi4d" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                              <SelectItem value="network" data-id="elxg93oel" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Network Error</SelectItem>
                              <SelectItem value="parsing" data-id="i12pciyse" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Parsing Error</SelectItem>
                              <SelectItem value="permission" data-id="xzpmjv882" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Permission Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-sm text-blue-600" data-id="g9xsa8wlk" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          Configure the type of async error to simulate for testing different error handling scenarios.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitoring" className="space-y-6" data-id="talqlwx53" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="oatkd2bsj" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <Card data-id="kltnbwejv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="qyq9fzzh3" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <CardTitle className="text-sm font-medium" data-id="36qv6a3w6" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Total Errors</CardTitle>
                    <Bug className="h-4 w-4 text-muted-foreground" data-id="f94af0rlo" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                  </CardHeader>
                  <CardContent data-id="tus469vdz" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <div className="text-2xl font-bold text-red-600" data-id="bgatgbvyj" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      {errorSummary.total}
                    </div>
                    <p className="text-xs text-muted-foreground" data-id="zddznavun" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      Errors logged in current session
                    </p>
                  </CardContent>
                </Card>
                
                <Card data-id="n2e30ni77" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="34u3ld0lr" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <CardTitle className="text-sm font-medium" data-id="6imb9t079" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Critical Errors</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" data-id="ra43z9d1n" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                  </CardHeader>
                  <CardContent data-id="4ovf0a00r" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <div className="text-2xl font-bold text-orange-600" data-id="88v1ijpna" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      {errorSummary.bySeverity.critical || 0}
                    </div>
                    <p className="text-xs text-muted-foreground" data-id="xab98v0v4" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      High priority errors requiring attention
                    </p>
                  </CardContent>
                </Card>
                
                <Card data-id="osbc02eg0" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="eoxo00tp1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <CardTitle className="text-sm font-medium" data-id="rne4tdkbx" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Active Tests</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" data-id="gcadoqk0r" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                  </CardHeader>
                  <CardContent data-id="s8ql3873i" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <div className="text-2xl font-bold text-blue-600" data-id="ht9y4g70o" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      {Object.values(activeErrors).filter(Boolean).length}
                    </div>
                    <p className="text-xs text-muted-foreground" data-id="3i4m3nkki" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      Currently running error scenarios
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card data-id="5lrms3q47" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <CardHeader data-id="q0vkkbo86" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <div className="flex items-center justify-between" data-id="vkoe0g468" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <CardTitle data-id="qzdqvjv0k" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Error Log Management</CardTitle>
                    <div className="flex gap-2" data-id="4lzwjjf68" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <Button onClick={exportErrorLogs} variant="outline" size="sm" data-id="gcbfcdqf2" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <Download className="w-4 h-4 mr-2" data-id="jn7dwzldh" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                        Export Logs
                      </Button>
                      <Button onClick={clearErrorLogs} variant="outline" size="sm" data-id="ws3gzxm9z" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <Trash2 className="w-4 h-4 mr-2" data-id="5kc7amm67" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                        Clear Logs
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent data-id="2lk8j9fik" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <div className="space-y-4" data-id="eb1gb87ab" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="s4sjz80bp" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      {Object.entries(errorSummary.bySeverity).map(([severity, count]) =>
                      <div key={severity} className="text-center" data-id="yzlfupzwk" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <div className="text-lg font-semibold" data-id="5pl4qbuqa" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">{count}</div>
                          <div className="text-sm text-muted-foreground capitalize" data-id="0zmx9cchb" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            {severity}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6" data-id="xzlhjfmi5" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
              <Card data-id="yb9df0rlc" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                <CardHeader data-id="4iijdr9by" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <CardTitle data-id="25mog12mk" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Error Pattern Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground" data-id="384akvi0q" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    Analyze error patterns over time to identify system issues
                  </p>
                </CardHeader>
                <CardContent data-id="b9ndt1tf9" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                  <div className="space-y-6" data-id="o1dn4t3rx" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                    <Alert data-id="g9895iyj5" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <BarChart3 className="h-4 w-4" data-id="1x2z59oee" data-path="src/components/EnhancedErrorBoundaryDemo.tsx" />
                      <AlertDescription data-id="ui952upjp" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <strong data-id="8vf8w5yrl" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Pattern Detection:</strong> The system monitors error frequency, 
                        severity distribution, and component failure rates to help identify 
                        potential system issues before they become critical.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="lhzo9hvm9" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                      <div data-id="e24g626jb" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <h4 className="font-semibold mb-3" data-id="75k38k2xu" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Common Error Patterns:</h4>
                        <ul className="space-y-2 text-sm" data-id="ti9u1zy1i" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <li className="flex items-center gap-2" data-id="b999psgv3" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-red-500 rounded-full" data-id="mhihpnppv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="ezuvgcspk" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Repeated component failures indicate code issues</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="3i7g9krnv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" data-id="7vd01uqtv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="ofv8tvw31" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Network errors suggest connectivity problems</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="flt1llud1" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" data-id="q85p74rnz" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="i0ucaq0u4" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Memory errors indicate resource management issues</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="j9n498v0l" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="enwrqjvxd" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="cszbkoxhv" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Database errors suggest backend problems</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div data-id="rzi1omluo" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                        <h4 className="font-semibold mb-3" data-id="yqpv3e5pm" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Monitoring Benefits:</h4>
                        <ul className="space-y-2 text-sm" data-id="joxutpk5x" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                          <li className="flex items-center gap-2" data-id="otr9sflrl" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-green-500 rounded-full" data-id="v0539rok7" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="tys0fbuxt" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Early detection of system degradation</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="o1zv6eyks" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-green-500 rounded-full" data-id="369z4ge2h" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="lw8m0rtr4" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Improved user experience through better error handling</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="6r025emwf" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-green-500 rounded-full" data-id="tkinbxl6k" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="rn0ko8phb" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Data-driven decisions for system improvements</span>
                          </li>
                          <li className="flex items-center gap-2" data-id="c8u012zf3" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">
                            <div className="w-2 h-2 bg-green-500 rounded-full" data-id="k9o92y8ct" data-path="src/components/EnhancedErrorBoundaryDemo.tsx"></div>
                            <span data-id="lv1f8h6q0" data-path="src/components/EnhancedErrorBoundaryDemo.tsx">Reduced downtime through proactive monitoring</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>);

};

export default EnhancedErrorBoundaryDemo;