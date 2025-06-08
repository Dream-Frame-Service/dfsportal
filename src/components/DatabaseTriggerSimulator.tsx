import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, Plus, Play, Pause, Settings, Database, Code, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface DatabaseTrigger {
  id: string;
  name: string;
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  condition: string;
  action: string;
  priority: number;
  isActive: boolean;
  lastExecuted?: Date;
  executionCount: number;
  averageExecutionTime: number;
  errorCount: number;
  description: string;
}

interface TriggerExecution {
  id: string;
  triggerId: string;
  triggerName: string;
  event: string;
  table: string;
  timestamp: Date;
  executionTime: number;
  status: 'success' | 'error' | 'warning';
  data: any;
  result: string;
  errorMessage?: string;
}

interface TriggerStats {
  totalTriggers: number;
  activeTriggers: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  triggersToday: number;
}

const DatabaseTriggerSimulator: React.FC = () => {
  const [triggers, setTriggers] = useState<DatabaseTrigger[]>([]);
  const [executions, setExecutions] = useState<TriggerExecution[]>([]);
  const [stats, setStats] = useState<TriggerStats>({
    totalTriggers: 0,
    activeTriggers: 0,
    totalExecutions: 0,
    successRate: 0,
    averageExecutionTime: 0,
    triggersToday: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<DatabaseTrigger | null>(null);
  const [newTrigger, setNewTrigger] = useState<Partial<DatabaseTrigger>>({
    name: '',
    table: '',
    event: 'INSERT',
    condition: '',
    action: '',
    priority: 1,
    isActive: true,
    description: ''
  });
  const { toast } = useToast();

  // Initialize with sample triggers
  useEffect(() => {
    const sampleTriggers: DatabaseTrigger[] = [
    {
      id: 'trigger_1',
      name: 'License Expiry Alert',
      table: 'licenses_certificates',
      event: 'UPDATE',
      condition: 'expiry_date <= CURRENT_DATE + INTERVAL \'30 days\'',
      action: 'EXECUTE send_license_alert_notification(NEW.id, NEW.license_name, NEW.expiry_date)',
      priority: 1,
      isActive: true,
      executionCount: 15,
      averageExecutionTime: 250,
      errorCount: 0,
      description: 'Automatically sends SMS alerts when licenses are approaching expiration'
    },
    {
      id: 'trigger_2',
      name: 'Inventory Low Stock Alert',
      table: 'products',
      event: 'UPDATE',
      condition: 'NEW.quantity_in_stock <= NEW.minimum_stock AND OLD.quantity_in_stock > OLD.minimum_stock',
      action: 'INSERT INTO inventory_alerts (product_id, alert_type, message) VALUES (NEW.id, \'LOW_STOCK\', CONCAT(\'Product \', NEW.product_name, \' is running low\'))',
      priority: 2,
      isActive: true,
      executionCount: 8,
      averageExecutionTime: 180,
      errorCount: 1,
      description: 'Creates alerts when product inventory falls below minimum stock level'
    },
    {
      id: 'trigger_3',
      name: 'Sales Report Auto-Calculation',
      table: 'daily_sales_reports_enhanced',
      event: 'INSERT',
      condition: '',
      action: 'UPDATE daily_sales_reports_enhanced SET total_sales = (grocery_sales + lottery_total_cash + (regular_gallons + super_gallons + diesel_gallons) * 3.50) WHERE id = NEW.id',
      priority: 3,
      isActive: true,
      executionCount: 22,
      averageExecutionTime: 120,
      errorCount: 0,
      description: 'Automatically calculates total sales when a new daily report is created'
    },
    {
      id: 'trigger_4',
      name: 'Employee Audit Trail',
      table: 'employees',
      event: 'UPDATE',
      condition: '',
      action: 'INSERT INTO audit_logs (event_type, user_id, resource_accessed, action_performed, additional_data) VALUES (\'Data Modification\', USER_ID(), \'employees\', \'update\', JSON_OBJECT(\'employee_id\', NEW.employee_id, \'changes\', JSON_OBJECT()))',
      priority: 5,
      isActive: true,
      executionCount: 12,
      averageExecutionTime: 95,
      errorCount: 0,
      description: 'Maintains audit trail for all employee record modifications'
    }];


    setTriggers(sampleTriggers);
  }, []);

  // Simulate trigger monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      simulateDataChanges();
      updateStats();
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, triggers]);

  const simulateDataChanges = useCallback(() => {
    // Simulate random database changes that might trigger our triggers
    const activeTriggersArray = triggers.filter((t) => t.isActive);
    if (activeTriggersArray.length === 0) return;

    const shouldTrigger = Math.random() < 0.3; // 30% chance
    if (!shouldTrigger) return;

    const randomTrigger = activeTriggersArray[Math.floor(Math.random() * activeTriggersArray.length)];
    executeTrigger(randomTrigger);
  }, [triggers]);

  const executeTrigger = async (trigger: DatabaseTrigger) => {
    const startTime = performance.now();

    try {
      // Simulate trigger execution
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 100));

      const executionTime = performance.now() - startTime;
      const isSuccess = Math.random() > 0.05; // 95% success rate

      const execution: TriggerExecution = {
        id: `exec_${Date.now()}_${Math.random()}`,
        triggerId: trigger.id,
        triggerName: trigger.name,
        event: trigger.event,
        table: trigger.table,
        timestamp: new Date(),
        executionTime,
        status: isSuccess ? 'success' : 'error',
        data: generateMockTriggerData(trigger.table, trigger.event),
        result: isSuccess ? 'Trigger executed successfully' : 'Execution failed',
        errorMessage: isSuccess ? undefined : 'Simulated execution error'
      };

      setExecutions((prev) => [execution, ...prev.slice(0, 99)]); // Keep last 100 executions

      // Update trigger statistics
      setTriggers((prev) => prev.map((t) =>
      t.id === trigger.id ?
      {
        ...t,
        lastExecuted: new Date(),
        executionCount: t.executionCount + 1,
        averageExecutionTime: (t.averageExecutionTime * t.executionCount + executionTime) / (t.executionCount + 1),
        errorCount: isSuccess ? t.errorCount : t.errorCount + 1
      } :
      t
      ));

      if (isSuccess) {
        toast({
          title: `Trigger Executed`,
          description: `${trigger.name} completed successfully`,
          duration: 2000
        });
      } else {
        toast({
          title: `Trigger Failed`,
          description: `${trigger.name} execution failed`,
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Trigger execution error:', error);
    }
  };

  const generateMockTriggerData = (table: string, event: string) => {
    const mockData = {
      licenses_certificates: { id: 1, license_name: 'Business License', expiry_date: '2024-12-31' },
      products: { id: 1, product_name: 'Sample Product', quantity_in_stock: 5, minimum_stock: 10 },
      daily_sales_reports_enhanced: { id: 1, station: 'MOBIL', total_sales: 1250.00 },
      employees: { id: 1, employee_id: 'EMP001', first_name: 'John', last_name: 'Doe' }
    };

    return mockData[table as keyof typeof mockData] || { id: 1, data: 'sample' };
  };

  const updateStats = () => {
    const activeTriggersCount = triggers.filter((t) => t.isActive).length;
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter((e) => e.status === 'success').length;
    const successRate = totalExecutions > 0 ? successfulExecutions / totalExecutions * 100 : 0;
    const avgExecutionTime = executions.length > 0 ?
    executions.reduce((sum, e) => sum + e.executionTime, 0) / executions.length :
    0;

    const today = new Date().toDateString();
    const triggersToday = executions.filter((e) => e.timestamp.toDateString() === today).length;

    setStats({
      totalTriggers: triggers.length,
      activeTriggers: activeTriggersCount,
      totalExecutions,
      successRate,
      averageExecutionTime: avgExecutionTime,
      triggersToday
    });
  };

  const createTrigger = () => {
    if (!newTrigger.name || !newTrigger.table || !newTrigger.action) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const trigger: DatabaseTrigger = {
      id: `trigger_${Date.now()}`,
      name: newTrigger.name!,
      table: newTrigger.table!,
      event: newTrigger.event!,
      condition: newTrigger.condition || '',
      action: newTrigger.action!,
      priority: newTrigger.priority || 1,
      isActive: newTrigger.isActive !== false,
      executionCount: 0,
      averageExecutionTime: 0,
      errorCount: 0,
      description: newTrigger.description || ''
    };

    setTriggers((prev) => [...prev, trigger]);
    setNewTrigger({
      name: '',
      table: '',
      event: 'INSERT',
      condition: '',
      action: '',
      priority: 1,
      isActive: true,
      description: ''
    });
    setShowCreateDialog(false);

    toast({
      title: "Trigger Created",
      description: `${trigger.name} has been added successfully`
    });
  };

  const toggleTrigger = (triggerId: string) => {
    setTriggers((prev) => prev.map((t) =>
    t.id === triggerId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const deleteTrigger = (triggerId: string) => {
    setTriggers((prev) => prev.filter((t) => t.id !== triggerId));
    toast({
      title: "Trigger Deleted",
      description: "Trigger has been removed successfully"
    });
  };

  const manualExecuteTrigger = (trigger: DatabaseTrigger) => {
    if (trigger.isActive) {
      executeTrigger(trigger);
    } else {
      toast({
        title: "Trigger Inactive",
        description: "Cannot execute inactive trigger",
        variant: "destructive"
      });
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'INSERT':return 'bg-green-500';
      case 'UPDATE':return 'bg-blue-500';
      case 'DELETE':return 'bg-red-500';
      case 'SELECT':return 'bg-purple-500';
      default:return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':return 'text-green-600 bg-green-50';
      case 'error':return 'text-red-600 bg-red-50';
      case 'warning':return 'text-yellow-600 bg-yellow-50';
      default:return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return 'High';
    if (priority <= 4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6" data-id="j0lo5vi4i" data-path="src/components/DatabaseTriggerSimulator.tsx">
      {/* Header Controls */}
      <Card data-id="uodmv2kan" data-path="src/components/DatabaseTriggerSimulator.tsx">
        <CardHeader data-id="4deojendq" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <div className="flex items-center justify-between" data-id="b4f9mahcg" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <CardTitle className="flex items-center gap-2" data-id="g7skz4oyw" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Database className="h-5 w-5" data-id="q0l3c6hut" data-path="src/components/DatabaseTriggerSimulator.tsx" />
              Database Trigger Simulator
            </CardTitle>
            <div className="flex items-center gap-2" data-id="imhujkqep" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Badge variant={isMonitoring ? "default" : "secondary"} data-id="3vfm8tbaz" data-path="src/components/DatabaseTriggerSimulator.tsx">
                {isMonitoring ? "Monitoring" : "Paused"}
              </Badge>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                size="sm" data-id="m3tf2jp3y" data-path="src/components/DatabaseTriggerSimulator.tsx">

                {isMonitoring ? <Pause className="h-4 w-4 mr-1" data-id="nyi5kyfag" data-path="src/components/DatabaseTriggerSimulator.tsx" /> : <Play className="h-4 w-4 mr-1" data-id="gek4w1tx9" data-path="src/components/DatabaseTriggerSimulator.tsx" />}
                {isMonitoring ? "Pause" : "Start"}
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                size="sm" data-id="g2dykwrzd" data-path="src/components/DatabaseTriggerSimulator.tsx">

                <Plus className="h-4 w-4 mr-1" data-id="zs19cnyp8" data-path="src/components/DatabaseTriggerSimulator.tsx" />
                New Trigger
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="bzm0o2gcj" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4" data-id="guoyskqle" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <div className="text-center" data-id="vkqhr12af" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="w8rufado6" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.totalTriggers}</div>
              <div className="text-sm text-gray-600" data-id="251w1drw3" data-path="src/components/DatabaseTriggerSimulator.tsx">Total Triggers</div>
            </div>
            <div className="text-center" data-id="0bb9x25ev" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="tomheudzw" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.activeTriggers}</div>
              <div className="text-sm text-gray-600" data-id="yj9l59psp" data-path="src/components/DatabaseTriggerSimulator.tsx">Active</div>
            </div>
            <div className="text-center" data-id="jmgmzodu9" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="lzrab8e39" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.totalExecutions}</div>
              <div className="text-sm text-gray-600" data-id="lszaxsfir" data-path="src/components/DatabaseTriggerSimulator.tsx">Executions</div>
            </div>
            <div className="text-center" data-id="pq99mjooy" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-orange-600" data-id="3lb4xx65q" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="q8xp21ot8" data-path="src/components/DatabaseTriggerSimulator.tsx">Success Rate</div>
            </div>
            <div className="text-center" data-id="6zwjbvc8c" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-indigo-600" data-id="tq3jnu4of" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.averageExecutionTime.toFixed(0)}ms</div>
              <div className="text-sm text-gray-600" data-id="a0dzbhrcr" data-path="src/components/DatabaseTriggerSimulator.tsx">Avg Time</div>
            </div>
            <div className="text-center" data-id="opqm7c567" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="text-2xl font-bold text-teal-600" data-id="mztepac26" data-path="src/components/DatabaseTriggerSimulator.tsx">{stats.triggersToday}</div>
              <div className="text-sm text-gray-600" data-id="ciffvcqcp" data-path="src/components/DatabaseTriggerSimulator.tsx">Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="triggers" className="w-full" data-id="wrysls0ff" data-path="src/components/DatabaseTriggerSimulator.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="nh58zp952" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <TabsTrigger value="triggers" data-id="g0mjip0e3" data-path="src/components/DatabaseTriggerSimulator.tsx">Triggers ({triggers.length})</TabsTrigger>
          <TabsTrigger value="executions" data-id="0qpg7al41" data-path="src/components/DatabaseTriggerSimulator.tsx">Executions ({executions.length})</TabsTrigger>
          <TabsTrigger value="templates" data-id="byh8vb7xf" data-path="src/components/DatabaseTriggerSimulator.tsx">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers" className="space-y-4" data-id="2f5y29lcl" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-id="1jcvs2ir7" data-path="src/components/DatabaseTriggerSimulator.tsx">
            {triggers.map((trigger) =>
            <Card key={trigger.id} className="relative" data-id="34fzknfs1" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <CardHeader className="pb-3" data-id="c73lwit3y" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <div className="flex items-center justify-between" data-id="42ppxfurx" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <div className="flex items-center gap-3" data-id="hozjjnf7q" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <Badge className={`${getEventColor(trigger.event)} text-white`} data-id="lz5g1nyud" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        {trigger.event}
                      </Badge>
                      <div data-id="iqg9jl1ca" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        <h3 className="font-medium" data-id="n7qqz5kxq" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.name}</h3>
                        <p className="text-sm text-gray-600" data-id="vdphq4huf" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.table}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" data-id="knyy9jq3t" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <Badge variant="outline" data-id="v06d9ells" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        {getPriorityLabel(trigger.priority)}
                      </Badge>
                      <Switch
                      checked={trigger.isActive}
                      onCheckedChange={() => toggleTrigger(trigger.id)}
                      size="sm" data-id="i3awl7e6l" data-path="src/components/DatabaseTriggerSimulator.tsx" />

                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3" data-id="oitz1u9fa" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <p className="text-sm text-gray-700" data-id="wbb8szpqk" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm" data-id="onreg04qo" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <div data-id="6sgxg0u6n" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="font-medium" data-id="ws0w61p88" data-path="src/components/DatabaseTriggerSimulator.tsx">Executions:</p>
                      <p data-id="yibwzgn6q" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.executionCount}</p>
                    </div>
                    <div data-id="2ll6t8gch" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="font-medium" data-id="svkrt8owc" data-path="src/components/DatabaseTriggerSimulator.tsx">Avg Time:</p>
                      <p data-id="70lz8fwl5" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.averageExecutionTime.toFixed(0)}ms</p>
                    </div>
                    <div data-id="482g9c5jm" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="font-medium" data-id="v5r3abwmk" data-path="src/components/DatabaseTriggerSimulator.tsx">Errors:</p>
                      <p className={trigger.errorCount > 0 ? "text-red-600" : "text-green-600"} data-id="l9x71b45j" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        {trigger.errorCount}
                      </p>
                    </div>
                    <div data-id="7l6tttont" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="font-medium" data-id="e8vw9832c" data-path="src/components/DatabaseTriggerSimulator.tsx">Last Run:</p>
                      <p data-id="ecn1movs6" data-path="src/components/DatabaseTriggerSimulator.tsx">{trigger.lastExecuted ? trigger.lastExecuted.toLocaleTimeString() : 'Never'}</p>
                    </div>
                  </div>

                  <div className="space-y-2" data-id="26mkjhgtq" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <div data-id="1cp2geup6" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="text-xs font-medium text-gray-600" data-id="eeagh3z26" data-path="src/components/DatabaseTriggerSimulator.tsx">CONDITION:</p>
                      <code className="text-xs bg-gray-100 p-1 rounded block" data-id="4z6frqqtx" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        {trigger.condition || 'No condition'}
                      </code>
                    </div>
                    <div data-id="c549d2z88" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <p className="text-xs font-medium text-gray-600" data-id="mpatmy3mn" data-path="src/components/DatabaseTriggerSimulator.tsx">ACTION:</p>
                      <code className="text-xs bg-gray-100 p-1 rounded block" data-id="ufuw30q3f" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        {trigger.action.substring(0, 100)}...
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2" data-id="mkww11fkb" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => manualExecuteTrigger(trigger)}
                    disabled={!trigger.isActive} data-id="9phf3k5bv" data-path="src/components/DatabaseTriggerSimulator.tsx">

                      <Play className="h-3 w-3 mr-1" data-id="uhj4jgjf7" data-path="src/components/DatabaseTriggerSimulator.tsx" />
                      Execute
                    </Button>
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTrigger(trigger)} data-id="urrpwx1h5" data-path="src/components/DatabaseTriggerSimulator.tsx">

                      <Settings className="h-3 w-3 mr-1" data-id="7ctdqcbv0" data-path="src/components/DatabaseTriggerSimulator.tsx" />
                      Edit
                    </Button>
                    <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTrigger(trigger.id)} data-id="zfq4kxbeq" data-path="src/components/DatabaseTriggerSimulator.tsx">

                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4" data-id="du1rcizhy" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <ScrollArea className="h-96" data-id="n6bu0csn4" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <div className="space-y-3" data-id="jycxpdrlh" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <AnimatePresence data-id="31wpaxh38" data-path="src/components/DatabaseTriggerSimulator.tsx">
                {executions.map((execution, index) =>
                <motion.div
                  key={execution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02 }} data-id="pbsmty1nz" data-path="src/components/DatabaseTriggerSimulator.tsx">

                    <Card data-id="mpotu94cw" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <CardContent className="pt-4" data-id="61ei17aoz" data-path="src/components/DatabaseTriggerSimulator.tsx">
                        <div className="flex items-center justify-between mb-3" data-id="290l58b8o" data-path="src/components/DatabaseTriggerSimulator.tsx">
                          <div className="flex items-center gap-3" data-id="m0qcost67" data-path="src/components/DatabaseTriggerSimulator.tsx">
                            <Badge className={`${getEventColor(execution.event)} text-white`} data-id="478142dhb" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              {execution.event}
                            </Badge>
                            <div data-id="f05w9vx9u" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              <p className="font-medium" data-id="spcvmupaa" data-path="src/components/DatabaseTriggerSimulator.tsx">{execution.triggerName}</p>
                              <p className="text-sm text-gray-600" data-id="cy2d99lh2" data-path="src/components/DatabaseTriggerSimulator.tsx">
                                {execution.table} • {execution.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="xmdz5owcx" data-path="src/components/DatabaseTriggerSimulator.tsx">
                            <Badge className={getStatusColor(execution.status)} data-id="iqg53p0kv" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              {execution.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" data-id="hwzherz3g" data-path="src/components/DatabaseTriggerSimulator.tsx" />}
                              {execution.status === 'error' && <Clock className="h-3 w-3 mr-1" data-id="0kg3oqgrm" data-path="src/components/DatabaseTriggerSimulator.tsx" />}
                              {execution.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" data-id="bte0fuyj8" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              {execution.executionTime.toFixed(0)}ms
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm" data-id="gl2rldnao" data-path="src/components/DatabaseTriggerSimulator.tsx">
                          <div data-id="1kuqql34s" data-path="src/components/DatabaseTriggerSimulator.tsx">
                            <p className="font-medium" data-id="m9e6zv2kp" data-path="src/components/DatabaseTriggerSimulator.tsx">Trigger Data:</p>
                            <code className="text-xs bg-gray-100 p-2 rounded block mt-1" data-id="574inyamb" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              {JSON.stringify(execution.data, null, 2)}
                            </code>
                          </div>
                          <div data-id="ceqnsgawg" data-path="src/components/DatabaseTriggerSimulator.tsx">
                            <p className="font-medium" data-id="0xa55785u" data-path="src/components/DatabaseTriggerSimulator.tsx">Result:</p>
                            <p className={`mt-1 p-2 rounded text-xs ${getStatusColor(execution.status)}`} data-id="fkfx1v52y" data-path="src/components/DatabaseTriggerSimulator.tsx">
                              {execution.result}
                              {execution.errorMessage &&
                            <span className="block mt-1 text-red-600" data-id="m2q126ge4" data-path="src/components/DatabaseTriggerSimulator.tsx">
                                  Error: {execution.errorMessage}
                                </span>
                            }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4" data-id="oxb2o7u5y" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <Alert data-id="2p14a5swd" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <Code className="h-4 w-4" data-id="j8dd3beka" data-path="src/components/DatabaseTriggerSimulator.tsx" />
            <AlertDescription data-id="nantjlbri" data-path="src/components/DatabaseTriggerSimulator.tsx">
              Pre-built trigger templates for common database operations. Click to use as a starting point for your custom triggers.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="058mw6ky4" data-path="src/components/DatabaseTriggerSimulator.tsx">
            {[
            {
              name: 'Audit Log Trigger',
              description: 'Automatically log all changes to sensitive tables',
              template: `INSERT INTO audit_logs (event_type, table_name, record_id, old_data, new_data, timestamp) 
VALUES ('${newTrigger.event}', '${newTrigger.table}', NEW.id, OLD, NEW, NOW())`
            },
            {
              name: 'Status Update Notification',
              description: 'Send notifications when status fields change',
              template: `IF NEW.status != OLD.status THEN
  INSERT INTO notifications (user_id, message, type) 
  VALUES (NEW.user_id, CONCAT('Status changed to ', NEW.status), 'status_update');
END IF`
            },
            {
              name: 'Calculated Field Update',
              description: 'Automatically update calculated fields',
              template: `UPDATE ${newTrigger.table} 
SET calculated_field = (field1 + field2) * 0.1 
WHERE id = NEW.id`
            },
            {
              name: 'Cascade Delete Safety',
              description: 'Prevent accidental cascade deletions',
              template: `IF (SELECT COUNT(*) FROM related_table WHERE parent_id = OLD.id) > 0 THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete record with dependencies';
END IF`
            }].
            map((template, index) =>
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" data-id="77ckm73r1" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <CardHeader data-id="eq10feh9p" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <div className="flex items-center justify-between" data-id="pxpg7ce6p" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <div data-id="8jqy89970" data-path="src/components/DatabaseTriggerSimulator.tsx">
                      <h3 className="font-medium" data-id="en2mf7avb" data-path="src/components/DatabaseTriggerSimulator.tsx">{template.name}</h3>
                      <p className="text-sm text-gray-600" data-id="o88n67dfq" data-path="src/components/DatabaseTriggerSimulator.tsx">{template.description}</p>
                    </div>
                    <Button
                    size="sm"
                    onClick={() => {
                      setNewTrigger((prev) => ({ ...prev, action: template.template }));
                      setShowCreateDialog(true);
                    }} data-id="c10z2y682" data-path="src/components/DatabaseTriggerSimulator.tsx">

                      Use Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent data-id="5i1zvl462" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <code className="text-xs bg-gray-100 p-2 rounded block" data-id="p7d4gziwt" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    {template.template}
                  </code>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Trigger Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog} data-id="55mg9p17d" data-path="src/components/DatabaseTriggerSimulator.tsx">
        <DialogContent className="max-w-2xl" data-id="guo75y380" data-path="src/components/DatabaseTriggerSimulator.tsx">
          <DialogHeader data-id="ezvtepn7c" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <DialogTitle data-id="wlheicv5r" data-path="src/components/DatabaseTriggerSimulator.tsx">Create New Database Trigger</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4" data-id="uxnw53cot" data-path="src/components/DatabaseTriggerSimulator.tsx">
            <div className="grid grid-cols-2 gap-4" data-id="o4xcupli6" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="space-y-2" data-id="ehzdexqpx" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <Label data-id="3q8gzdww1" data-path="src/components/DatabaseTriggerSimulator.tsx">Trigger Name</Label>
                <Input
                  value={newTrigger.name}
                  onChange={(e) => setNewTrigger((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter trigger name" data-id="jvc2ewfph" data-path="src/components/DatabaseTriggerSimulator.tsx" />

              </div>
              <div className="space-y-2" data-id="npxroari4" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <Label data-id="7dbb8bf07" data-path="src/components/DatabaseTriggerSimulator.tsx">Table</Label>
                <Select value={newTrigger.table} onValueChange={(value) => setNewTrigger((prev) => ({ ...prev, table: value }))} data-id="nv0z3teep" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <SelectTrigger data-id="dihnbc3sw" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <SelectValue placeholder="Select table" data-id="88kxpmal8" data-path="src/components/DatabaseTriggerSimulator.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="pc2qzsq91" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <SelectItem value="products" data-id="ntgh79364" data-path="src/components/DatabaseTriggerSimulator.tsx">products</SelectItem>
                    <SelectItem value="employees" data-id="9tqzcry96" data-path="src/components/DatabaseTriggerSimulator.tsx">employees</SelectItem>
                    <SelectItem value="licenses_certificates" data-id="178gry5ur" data-path="src/components/DatabaseTriggerSimulator.tsx">licenses_certificates</SelectItem>
                    <SelectItem value="daily_sales_reports_enhanced" data-id="zia38j1vt" data-path="src/components/DatabaseTriggerSimulator.tsx">daily_sales_reports_enhanced</SelectItem>
                    <SelectItem value="orders" data-id="npws22fex" data-path="src/components/DatabaseTriggerSimulator.tsx">orders</SelectItem>
                    <SelectItem value="vendors" data-id="mvxorga2y" data-path="src/components/DatabaseTriggerSimulator.tsx">vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" data-id="a4igvcppy" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <div className="space-y-2" data-id="f2xmiuogl" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <Label data-id="4ht5635cz" data-path="src/components/DatabaseTriggerSimulator.tsx">Event</Label>
                <Select value={newTrigger.event} onValueChange={(value: any) => setNewTrigger((prev) => ({ ...prev, event: value }))} data-id="jg2epfmmo" data-path="src/components/DatabaseTriggerSimulator.tsx">
                  <SelectTrigger data-id="u6eh9zk7k" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <SelectValue data-id="sghnn76k2" data-path="src/components/DatabaseTriggerSimulator.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="0q3lrrw3g" data-path="src/components/DatabaseTriggerSimulator.tsx">
                    <SelectItem value="INSERT" data-id="ba5rf4g1g" data-path="src/components/DatabaseTriggerSimulator.tsx">INSERT</SelectItem>
                    <SelectItem value="UPDATE" data-id="uv5iwyx8c" data-path="src/components/DatabaseTriggerSimulator.tsx">UPDATE</SelectItem>
                    <SelectItem value="DELETE" data-id="40dq5xler" data-path="src/components/DatabaseTriggerSimulator.tsx">DELETE</SelectItem>
                    <SelectItem value="SELECT" data-id="sd4wmv2nh" data-path="src/components/DatabaseTriggerSimulator.tsx">SELECT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2" data-id="1y2dzjpb2" data-path="src/components/DatabaseTriggerSimulator.tsx">
                <Label data-id="zbkbrrp5f" data-path="src/components/DatabaseTriggerSimulator.tsx">Priority (1 = Highest)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newTrigger.priority}
                  onChange={(e) => setNewTrigger((prev) => ({ ...prev, priority: Number(e.target.value) }))} data-id="h8oxxzww5" data-path="src/components/DatabaseTriggerSimulator.tsx" />

              </div>
            </div>

            <div className="space-y-2" data-id="ai4torg32" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Label data-id="4z55o9bva" data-path="src/components/DatabaseTriggerSimulator.tsx">Condition (Optional)</Label>
              <Input
                value={newTrigger.condition}
                onChange={(e) => setNewTrigger((prev) => ({ ...prev, condition: e.target.value }))}
                placeholder="e.g., NEW.status != OLD.status" data-id="khwrf1k18" data-path="src/components/DatabaseTriggerSimulator.tsx" />

            </div>

            <div className="space-y-2" data-id="i0w2530vs" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Label data-id="cupu84sze" data-path="src/components/DatabaseTriggerSimulator.tsx">Action (SQL Code)</Label>
              <Textarea
                value={newTrigger.action}
                onChange={(e) => setNewTrigger((prev) => ({ ...prev, action: e.target.value }))}
                placeholder="Enter the SQL action to execute"
                rows={4} data-id="8mham8p4r" data-path="src/components/DatabaseTriggerSimulator.tsx" />

            </div>

            <div className="space-y-2" data-id="g5k9i47vg" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Label data-id="xemfu2ovu" data-path="src/components/DatabaseTriggerSimulator.tsx">Description</Label>
              <Input
                value={newTrigger.description}
                onChange={(e) => setNewTrigger((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this trigger does" data-id="fcy48yc49" data-path="src/components/DatabaseTriggerSimulator.tsx" />

            </div>

            <div className="flex items-center space-x-2" data-id="qkym2dgy3" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Switch
                checked={newTrigger.isActive}
                onCheckedChange={(checked) => setNewTrigger((prev) => ({ ...prev, isActive: checked }))} data-id="ppymdut7e" data-path="src/components/DatabaseTriggerSimulator.tsx" />

              <Label data-id="54u00h2bj" data-path="src/components/DatabaseTriggerSimulator.tsx">Active</Label>
            </div>

            <div className="flex justify-end gap-2" data-id="bpwjnrgsd" data-path="src/components/DatabaseTriggerSimulator.tsx">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} data-id="hamaidkr0" data-path="src/components/DatabaseTriggerSimulator.tsx">
                Cancel
              </Button>
              <Button onClick={createTrigger} data-id="8kl5actzv" data-path="src/components/DatabaseTriggerSimulator.tsx">
                Create Trigger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);

};

export default DatabaseTriggerSimulator;