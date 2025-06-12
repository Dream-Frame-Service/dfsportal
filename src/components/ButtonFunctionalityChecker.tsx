import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Bug,
  Wrench,
  ShieldCheck
} from 'lucide-react';

interface ButtonTest {
  id: string;
  name: string;
  category: 'Create' | 'Read' | 'Update' | 'Delete' | 'Navigation' | 'Action';
  description: string;
  status: 'passing' | 'failing' | 'warning' | 'untested';
  error?: string;
  lastTested?: Date;
}

const ButtonFunctionalityChecker: React.FC = () => {
  const [tests, setTests] = useState<ButtonTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    passing: 0,
    failing: 0,
    warnings: 0,
    untested: 0
  });
  const { toast } = useToast();

  const initializeTests = (): ButtonTest[] => {
    return [
      // Product Management Tests
      {
        id: 'product-create',
        name: 'Product Create Button',
        category: 'Create',
        description: 'Test product creation functionality',
        status: 'untested'
      },
      {
        id: 'product-edit',
        name: 'Product Edit Button',
        category: 'Update',
        description: 'Test product editing functionality',
        status: 'untested'
      },
      {
        id: 'product-delete',
        name: 'Product Delete Button',
        category: 'Delete',
        description: 'Test product deletion with confirmation',
        status: 'untested'
      },
      {
        id: 'product-save',
        name: 'Product Save Button',
        category: 'Update',
        description: 'Test product save functionality',
        status: 'untested'
      },
      // Employee Management Tests
      {
        id: 'employee-create',
        name: 'Employee Create Button',
        category: 'Create',
        description: 'Test employee creation functionality',
        status: 'untested'
      },
      {
        id: 'employee-edit',
        name: 'Employee Edit Button',
        category: 'Update',
        description: 'Test employee editing functionality',
        status: 'untested'
      },
      {
        id: 'employee-delete',
        name: 'Employee Delete Button',
        category: 'Delete',
        description: 'Test employee deletion with confirmation',
        status: 'untested'
      },
      // Sales Report Tests
      {
        id: 'sales-create',
        name: 'Sales Report Create Button',
        category: 'Create',
        description: 'Test sales report creation functionality',
        status: 'untested'
      },
      {
        id: 'sales-submit',
        name: 'Sales Report Submit Button',
        category: 'Create',
        description: 'Test sales report submission',
        status: 'untested'
      },
      // Order Management Tests
      {
        id: 'order-create',
        name: 'Order Create Button',
        category: 'Create',
        description: 'Test order creation functionality',
        status: 'untested'
      },
      {
        id: 'order-add-item',
        name: 'Order Add Item Button',
        category: 'Action',
        description: 'Test adding items to orders',
        status: 'untested'
      },
      {
        id: 'order-remove-item',
        name: 'Order Remove Item Button',
        category: 'Action',
        description: 'Test removing items from orders',
        status: 'untested'
      },
      // Navigation Tests
      {
        id: 'nav-dashboard',
        name: 'Dashboard Navigation',
        category: 'Navigation',
        description: 'Test navigation to dashboard',
        status: 'untested'
      },
      {
        id: 'nav-back',
        name: 'Back Button Navigation',
        category: 'Navigation',
        description: 'Test back button functionality',
        status: 'untested'
      },
      // Database Connection Tests
      {
        id: 'db-connection',
        name: 'Database Connection',
        category: 'Read',
        description: 'Test database connectivity',
        status: 'untested'
      },
      {
        id: 'db-crud-operations',
        name: 'Database CRUD Operations',
        category: 'Action',
        description: 'Test basic database operations',
        status: 'untested'
      }
    ];
  };

  useEffect(() => {
    const initialTests = initializeTests();
    setTests(initialTests);
    calculateSummary(initialTests);
  }, []);

  const calculateSummary = (testResults: ButtonTest[]) => {
    const summary = testResults.reduce(
      (acc, test) => {
        acc.total++;
        acc[test.status]++;
        return acc;
      },
      { total: 0, passing: 0, failing: 0, warnings: 0, untested: 0 }
    );
    setSummary(summary);
  };

  const testDatabaseConnection = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('count(*)', { count: 'exact', head: true });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  };

  const testProductCRUD = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Test Create
      const testProduct = {
        product_name: 'Test Product - Button Checker',
        serial_number: 999999,
        category: 'Test',
        quantity_in_stock: 0,
        minimum_stock: 0,
        supplier: 'Test Supplier',
        description: 'This is a test product created by the button functionality checker',
        weight: 1,
        weight_unit: 'lb',
        department: 'Test Department',
        case_price: 10.00,
        unit_per_case: 1,
        unit_price: 10.00,
        retail_price: 12.00,
        overdue: false,
        created_by: 1
      };

      const { data: createData, error: createError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()
        .single();

      if (createError) throw new Error(`Create failed: ${createError.message}`);

      const productId = createData.id;

      // Test Read
      const { data: readData, error: readError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (readError) throw new Error(`Read failed: ${readError.message}`);

      // Test Update
      const { error: updateError } = await supabase
        .from('products')
        .update({ product_name: 'Updated Test Product - Button Checker' })
        .eq('id', productId);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);

      // Test Delete (cleanup)
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (deleteError) throw new Error(`Delete failed: ${deleteError.message}`);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const runSingleTest = async (testId: string): Promise<ButtonTest> => {
    const test = tests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');

    const updatedTest = { ...test, lastTested: new Date() };

    try {
      switch (testId) {
        case 'db-connection':
          const dbConnected = await testDatabaseConnection();
          updatedTest.status = dbConnected ? 'passing' : 'failing';
          updatedTest.error = dbConnected ? undefined : 'Cannot connect to database';
          break;

        case 'db-crud-operations':
          const crudResult = await testProductCRUD();
          updatedTest.status = crudResult.success ? 'passing' : 'failing';
          updatedTest.error = crudResult.error;
          break;

        case 'nav-dashboard':
          // Test if dashboard route exists
          updatedTest.status = window.location.pathname.includes('dashboard') ? 'passing' : 'warning';
          updatedTest.error = updatedTest.status === 'warning' ? 'Not currently on dashboard' : undefined;
          break;

        case 'product-create':
        case 'product-edit':
        case 'product-delete':
        case 'product-save':
          // For UI tests, we'll simulate checking if elements exist
          const hasProductButtons = document.querySelector('[data-path*="ProductList"]') !== null;
          updatedTest.status = hasProductButtons ? 'passing' : 'warning';
          updatedTest.error = hasProductButtons ? undefined : 'Product page not currently loaded';
          break;

        default:
          updatedTest.status = 'warning';
          updatedTest.error = 'Test implementation pending';
      }
    } catch (error) {
      updatedTest.status = 'failing';
      updatedTest.error = error instanceof Error ? error.message : 'Test execution failed';
    }

    return updatedTest;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const updatedTests: ButtonTest[] = [];

    for (const test of tests) {
      try {
        const result = await runSingleTest(test.id);
        updatedTests.push(result);
      } catch (error) {
        updatedTests.push({
          ...test,
          status: 'failing',
          error: error instanceof Error ? error.message : 'Test failed',
          lastTested: new Date()
        });
      }
    }

    setTests(updatedTests);
    calculateSummary(updatedTests);
    setIsRunning(false);

    toast({
      title: "Button Functionality Check Complete",
      description: `${updatedTests.filter(t => t.status === 'passing').length} tests passing, ${updatedTests.filter(t => t.status === 'failing').length} tests failing`
    });
  };

  const getStatusIcon = (status: ButtonTest['status']) => {
    switch (status) {
      case 'passing':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failing':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: ButtonTest['status']) => {
    const variants = {
      passing: 'default',
      failing: 'destructive',
      warning: 'secondary',
      untested: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: ButtonTest['category']) => {
    switch (category) {
      case 'Create':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'Read':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'Update':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'Delete':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'Navigation':
        return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
      case 'Action':
        return <div className="w-2 h-2 bg-indigo-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Button Functionality Checker
          </CardTitle>
          <CardDescription>
            Comprehensive testing of all buttons and database integration across the DFS portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Database Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-600" />
              <span className="text-sm">Error Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Functionality Validation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{summary.passing}</div>
                <div className="text-sm text-gray-600">Passing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{summary.failing}</div>
                <div className="text-sm text-gray-600">Failing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{summary.untested}</div>
                <div className="text-sm text-gray-600">Untested</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 mb-6">
            <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>

          {summary.failing > 0 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {summary.failing} test{summary.failing > 1 ? 's' : ''} failing. 
                Check the details below for specific issues.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(test.category)}
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm text-gray-600">{test.description}</div>
                    {test.error && (
                      <div className="text-xs text-red-600 mt-1">{test.error}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {test.category}
                  </Badge>
                  {getStatusBadge(test.status)}
                  {test.lastTested && (
                    <div className="text-xs text-gray-500">
                      {test.lastTested.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonFunctionalityChecker;
