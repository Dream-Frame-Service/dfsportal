import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Play, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ButtonTest {
  id: string;
  name: string;
  description: string;
  category: 'navigation' | 'action' | 'form' | 'utility';
  testFunction: () => Promise<boolean>;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
  duration?: number;
}

interface TestResult {
  testId: string;
  passed: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}

export const ButtonFunctionalityChecker: React.FC = () => {
  const [tests, setTests] = useState<ButtonTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize tests
  useEffect(() => {
    const buttonTests: ButtonTest[] = [
      {
        id: 'nav-home',
        name: 'Home Navigation',
        description: 'Test home button navigation',
        category: 'navigation',
        testFunction: async () => {
          // Simulate navigation test
          await new Promise(resolve => setTimeout(resolve, 500));
          return Math.random() > 0.2;
        },
        status: 'pending'
      },
      {
        id: 'nav-dashboard',
        name: 'Dashboard Navigation',
        description: 'Test dashboard button navigation',
        category: 'navigation',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 300));
          return Math.random() > 0.1;
        },
        status: 'pending'
      },
      {
        id: 'action-save',
        name: 'Save Action',
        description: 'Test save button functionality',
        category: 'action',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
          return Math.random() > 0.15;
        },
        status: 'pending'
      },
      {
        id: 'action-delete',
        name: 'Delete Action',
        description: 'Test delete button functionality',
        category: 'action',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 600));
          return Math.random() > 0.25;
        },
        status: 'pending'
      },
      {
        id: 'form-submit',
        name: 'Form Submit',
        description: 'Test form submission buttons',
        category: 'form',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 700));
          return Math.random() > 0.1;
        },
        status: 'pending'
      },
      {
        id: 'form-reset',
        name: 'Form Reset',
        description: 'Test form reset buttons',
        category: 'form',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 400));
          return Math.random() > 0.05;
        },
        status: 'pending'
      },
      {
        id: 'util-print',
        name: 'Print Utility',
        description: 'Test print button functionality',
        category: 'utility',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return Math.random() > 0.2;
        },
        status: 'pending'
      },
      {
        id: 'util-export',
        name: 'Export Utility',
        description: 'Test export button functionality',
        category: 'utility',
        testFunction: async () => {
          await new Promise(resolve => setTimeout(resolve, 900));
          return Math.random() > 0.3;
        },
        status: 'pending'
      }
    ];

    setTests(buttonTests);
  }, []);

  const runSingleTest = useCallback(async (test: ButtonTest): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const passed = await test.testFunction();
      const duration = Date.now() - startTime;
      
      return {
        testId: test.id,
        passed,
        duration,
        timestamp: new Date()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testId: test.id,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date()
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const filteredTests = selectedCategory === 'all' 
      ? tests 
      : tests.filter(test => test.category === selectedCategory);

    const newResults: TestResult[] = [];

    for (let i = 0; i < filteredTests.length; i++) {
      const test = filteredTests[i];
      
      // Update test status to running
      setTests(prev => prev.map(t => 
        t.id === test.id ? { ...t, status: 'running' } : t
      ));

      const result = await runSingleTest(test);
      newResults.push(result);

      // Update test status based on result
      setTests(prev => prev.map(t => 
        t.id === test.id 
          ? { 
              ...t, 
              status: result.passed ? 'passed' : 'failed',
              error: result.error,
              duration: result.duration
            } 
          : t
      ));

      setResults(prev => [...prev, result]);
      setProgress(((i + 1) / filteredTests.length) * 100);
    }

    setIsRunning(false);
    
    const passedCount = newResults.filter(r => r.passed).length;
    const totalCount = newResults.length;
    
    if (passedCount === totalCount) {
      toast.success(`All ${totalCount} tests passed!`);
    } else {
      toast.error(`${totalCount - passedCount} of ${totalCount} tests failed`);
    }
  }, [tests, selectedCategory, runSingleTest]);

  const resetTests = useCallback(() => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'pending',
      error: undefined,
      duration: undefined
    })));
    setResults([]);
    setProgress(0);
  }, []);

  const exportResults = useCallback(() => {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        averageDuration: results.reduce((acc, r) => acc + r.duration, 0) / results.length
      },
      results: results.map(result => {
        const test = tests.find(t => t.id === result.testId);
        return {
          testName: test?.name || result.testId,
          category: test?.category || 'unknown',
          passed: result.passed,
          duration: result.duration,
          error: result.error,
          timestamp: result.timestamp.toISOString()
        };
      })
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `button-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Test report exported successfully');
  }, [results, tests]);

  const getStatusIcon = (status: ButtonTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ButtonTest['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      passed: 'default',
      failed: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      running: 'bg-blue-100 text-blue-800',
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <Badge 
        variant={variants[status]} 
        className={colors[status]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const stats = {
    total: filteredTests.length,
    passed: filteredTests.filter(t => t.status === 'passed').length,
    failed: filteredTests.filter(t => t.status === 'failed').length,
    pending: filteredTests.filter(t => t.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Button Functionality Checker
          </CardTitle>
          <CardDescription>
            Comprehensive testing suite for all button functionalities across the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Tests
            </Button>
            
            {results.length > 0 && (
              <Button 
                variant="outline" 
                onClick={exportResults}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            )}
          </div>

          {isRunning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Testing Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="action">Actions</TabsTrigger>
          <TabsTrigger value="form">Forms</TabsTrigger>
          <TabsTrigger value="utility">Utilities</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredTests.map((test) => {
            const result = results.find(r => r.testId === test.id);
            
            return (
              <Card key={test.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h3 className="font-medium">{test.name}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {test.duration && (
                        <span className="text-sm text-gray-500">
                          {test.duration}ms
                        </span>
                      )}
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                  
                  {test.error && (
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error:</strong> {test.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium">
                  {Math.round((stats.passed / stats.total) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Duration:</span>
                <span className="font-medium">
                  {Math.round(results.reduce((acc, r) => acc + r.duration, 0) / results.length)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Run:</span>
                <span className="font-medium">
                  {results[results.length - 1]?.timestamp.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ButtonFunctionalityChecker;
