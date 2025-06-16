import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Clock, CheckCircle, XCircle, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface OptimisticUpdate {
  id: string;
  tableId: string;
  recordId: number;
  operation: 'create' | 'update' | 'delete';
  localData: any;
  originalData?: any;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed' | 'rolled_back';
  retryCount: number;
  estimatedDuration: number;
  syncAttempts: number[];
}

interface PerformanceMetrics {
  averageResponseTime: number;
  successRate: number;
  totalOperations: number;
  pendingOperations: number;
  rolledBackOperations: number;
  cacheHitRate: number;
}

const OptimisticUpdateManager: React.FC = () => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState(1000); // 1 second
  const [maxRetries, setMaxRetries] = useState(3);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    averageResponseTime: 0,
    successRate: 0,
    totalOperations: 0,
    pendingOperations: 0,
    rolledBackOperations: 0,
    cacheHitRate: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Start/stop the sync process
  useEffect(() => {
    if (isEnabled) {
      startSyncProcess();
    } else {
      stopSyncProcess();
    }

    return () => stopSyncProcess();
  }, [isEnabled, syncInterval]);

  const startSyncProcess = () => {
    stopSyncProcess();
    syncIntervalRef.current = setInterval(() => {
      processPendingUpdates();
    }, syncInterval);
  };

  const stopSyncProcess = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
  };

  // Create an optimistic update
  const createOptimisticUpdate = useCallback(async (
  tableId: string,
  operation: 'create' | 'update' | 'delete',
  localData: any,
  originalData?: any)
  : Promise<string> => {
    const updateId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const optimisticUpdate: OptimisticUpdate = {
      id: updateId,
      tableId,
      recordId: localData.id || localData.ID || Date.now(),
      operation,
      localData,
      originalData,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
      estimatedDuration: calculateEstimatedDuration(operation),
      syncAttempts: []
    };

    setOptimisticUpdates((prev) => [...prev, optimisticUpdate]);

    // Immediate UI update
    updateLocalState(optimisticUpdate);

    toast({
      title: "Update Applied",
      description: `${operation} operation queued for synchronization`,
      duration: 2000
    });

    return updateId;
  }, [toast]);

  const calculateEstimatedDuration = (operation: string): number => {
    const baseDurations = {
      create: 1500,
      update: 1000,
      delete: 800
    };
    return baseDurations[operation as keyof typeof baseDurations] || 1000;
  };

  const updateLocalState = (update: OptimisticUpdate) => {
    // This would typically update your local state/cache
    console.log('Updating local state:', update);
  };

  // Process pending updates
  const processPendingUpdates = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const pendingUpdates = optimisticUpdates.filter((u) => u.status === 'pending');

    if (pendingUpdates.length === 0) {
      setIsProcessing(false);
      return;
    }

    try {
      // Process updates in batches
      const batchSize = 5;
      for (let i = 0; i < pendingUpdates.length; i += batchSize) {
        const batch = pendingUpdates.slice(i, i + batchSize);
        await Promise.all(batch.map((update) => syncUpdate(update)));
      }
    } catch (error) {
      console.error('Error processing updates:', error);
    } finally {
      setIsProcessing(false);
      updatePerformanceMetrics();
    }
  }, [optimisticUpdates, isProcessing]);

  const syncUpdate = async (update: OptimisticUpdate): Promise<void> => {
    const startTime = performance.now();

    try {
      // Simulate API call
      const success = await simulateApiCall(update);
      const duration = performance.now() - startTime;

      setOptimisticUpdates((prev) => prev.map((u) =>
      u.id === update.id ?
      {
        ...u,
        status: success ? 'confirmed' : 'failed',
        syncAttempts: [...u.syncAttempts, duration]
      } :
      u
      ));

      if (success) {
        toast({
          title: "Sync Complete",
          description: `${update.operation} operation confirmed`,
          duration: 1000
        });
      } else {
        await handleFailedUpdate(update);
      }
    } catch (error) {
      console.error('Sync error:', error);
      await handleFailedUpdate(update);
    }
  };

  const simulateApiCall = async (update: OptimisticUpdate): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

    // Simulate success/failure (95% success rate)
    return Math.random() > 0.05;
  };

  const handleFailedUpdate = async (update: OptimisticUpdate) => {
    const newRetryCount = update.retryCount + 1;

    if (newRetryCount <= maxRetries) {
      // Retry with exponential backoff
      const delay = Math.pow(2, newRetryCount) * 1000;

      setTimeout(() => {
        setOptimisticUpdates((prev) => prev.map((u) =>
        u.id === update.id ?
        { ...u, retryCount: newRetryCount, status: 'pending' } :
        u
        ));
      }, delay);

      toast({
        title: "Retrying Update",
        description: `Attempt ${newRetryCount} of ${maxRetries}`,
        variant: "default"
      });
    } else {
      // Rollback the update
      await rollbackUpdate(update);
    }
  };

  const rollbackUpdate = async (update: OptimisticUpdate) => {
    setOptimisticUpdates((prev) => prev.map((u) =>
    u.id === update.id ?
    { ...u, status: 'rolled_back' } :
    u
    ));

    // Restore original state
    if (update.originalData) {
      updateLocalState({
        ...update,
        localData: update.originalData,
        operation: 'update' as const
      });
    }

    toast({
      title: "Update Rolled Back",
      description: "Failed to sync changes, reverted to original state",
      variant: "destructive"
    });
  };

  const manualRetry = async (updateId: string) => {
    const update = optimisticUpdates.find((u) => u.id === updateId);
    if (!update) return;

    setOptimisticUpdates((prev) => prev.map((u) =>
    u.id === updateId ?
    { ...u, status: 'pending', retryCount: 0 } :
    u
    ));

    toast({
      title: "Manual Retry",
      description: "Attempting to sync update again"
    });
  };

  const forceRollback = async (updateId: string) => {
    const update = optimisticUpdates.find((u) => u.id === updateId);
    if (update) {
      await rollbackUpdate(update);
    }
  };

  const clearCompletedUpdates = () => {
    setOptimisticUpdates((prev) => prev.filter((u) =>
    u.status === 'pending' || u.status === 'failed'
    ));

    toast({
      title: "Cleared",
      description: "Removed completed and rolled back updates"
    });
  };

  const updatePerformanceMetrics = () => {
    const completed = optimisticUpdates.filter((u) =>
    u.status === 'confirmed' || u.status === 'failed' || u.status === 'rolled_back'
    );
    const successful = optimisticUpdates.filter((u) => u.status === 'confirmed');
    const pending = optimisticUpdates.filter((u) => u.status === 'pending');
    const rolledBack = optimisticUpdates.filter((u) => u.status === 'rolled_back');

    const totalSyncTimes = completed.flatMap((u) => u.syncAttempts);
    const averageResponseTime = totalSyncTimes.length > 0 ?
    totalSyncTimes.reduce((a, b) => a + b, 0) / totalSyncTimes.length :
    0;

    setPerformanceMetrics({
      averageResponseTime: Math.round(averageResponseTime),
      successRate: completed.length > 0 ? successful.length / completed.length * 100 : 0,
      totalOperations: optimisticUpdates.length,
      pendingOperations: pending.length,
      rolledBackOperations: rolledBack.length,
      cacheHitRate: Math.random() * 100 // Simulated
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':return <Clock className="h-4 w-4 text-yellow-500" data-id="981att8eq" data-path="src/components/OptimisticUpdateManager.tsx" />;
      case 'confirmed':return <CheckCircle className="h-4 w-4 text-green-500" data-id="fgx4t7vhf" data-path="src/components/OptimisticUpdateManager.tsx" />;
      case 'failed':return <XCircle className="h-4 w-4 text-red-500" data-id="7n95yu1e2" data-path="src/components/OptimisticUpdateManager.tsx" />;
      case 'rolled_back':return <RotateCcw className="h-4 w-4 text-orange-500" data-id="0yisc2r12" data-path="src/components/OptimisticUpdateManager.tsx" />;
      default:return <AlertTriangle className="h-4 w-4 text-gray-500" data-id="qpcfc3gzc" data-path="src/components/OptimisticUpdateManager.tsx" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':return 'border-yellow-500';
      case 'confirmed':return 'border-green-500';
      case 'failed':return 'border-red-500';
      case 'rolled_back':return 'border-orange-500';
      default:return 'border-gray-500';
    }
  };

  return (
    <div className="space-y-6" data-id="qu8frytl8" data-path="src/components/OptimisticUpdateManager.tsx">
      {/* Header Controls */}
      <Card data-id="tymptzhkq" data-path="src/components/OptimisticUpdateManager.tsx">
        <CardHeader data-id="zpatvlye7" data-path="src/components/OptimisticUpdateManager.tsx">
          <div className="flex items-center justify-between" data-id="fvo6sonfp" data-path="src/components/OptimisticUpdateManager.tsx">
            <CardTitle className="flex items-center gap-2" data-id="jj6yq3xkw" data-path="src/components/OptimisticUpdateManager.tsx">
              <Zap className="h-5 w-5" data-id="wc6ociwu8" data-path="src/components/OptimisticUpdateManager.tsx" />
              Optimistic Update Manager
            </CardTitle>
            <div className="flex items-center gap-2" data-id="c3bfynfq3" data-path="src/components/OptimisticUpdateManager.tsx">
              <Badge variant={isEnabled ? "default" : "secondary"} data-id="n454kye60" data-path="src/components/OptimisticUpdateManager.tsx">
                {isEnabled ? "Active" : "Disabled"}
              </Badge>
              <Button
                onClick={() => setIsEnabled(!isEnabled)}
                variant={isEnabled ? "destructive" : "default"}
                size="sm" data-id="uflbw35wl" data-path="src/components/OptimisticUpdateManager.tsx">

                {isEnabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="telxxnm4f" data-path="src/components/OptimisticUpdateManager.tsx">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4" data-id="7hwzlafc6" data-path="src/components/OptimisticUpdateManager.tsx">
            <div className="text-center" data-id="zebcizy3y" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="9w7i6q6f2" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.totalOperations}</div>
              <div className="text-sm text-gray-600" data-id="w4km9jqbp" data-path="src/components/OptimisticUpdateManager.tsx">Total Operations</div>
            </div>
            <div className="text-center" data-id="x7iysoaon" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-yellow-600" data-id="jrh6ouvkf" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.pendingOperations}</div>
              <div className="text-sm text-gray-600" data-id="jlqis2czz" data-path="src/components/OptimisticUpdateManager.tsx">Pending</div>
            </div>
            <div className="text-center" data-id="iyyk03g0g" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="3v4q6ufxu" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="riyv77ocd" data-path="src/components/OptimisticUpdateManager.tsx">Success Rate</div>
            </div>
            <div className="text-center" data-id="bwwi8z88s" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="2izrih2r6" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.averageResponseTime}ms</div>
              <div className="text-sm text-gray-600" data-id="spol9rksa" data-path="src/components/OptimisticUpdateManager.tsx">Avg Response</div>
            </div>
            <div className="text-center" data-id="wbufo42nr" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-orange-600" data-id="51ahlu3s6" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.rolledBackOperations}</div>
              <div className="text-sm text-gray-600" data-id="o3cm46npj" data-path="src/components/OptimisticUpdateManager.tsx">Rolled Back</div>
            </div>
            <div className="text-center" data-id="jozbqp5tx" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="text-2xl font-bold text-indigo-600" data-id="sat37g3b0" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.cacheHitRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600" data-id="yfu61mshu" data-path="src/components/OptimisticUpdateManager.tsx">Cache Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="updates" className="w-full" data-id="guedndb4i" data-path="src/components/OptimisticUpdateManager.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="1d7bfhe0q" data-path="src/components/OptimisticUpdateManager.tsx">
          <TabsTrigger value="updates" data-id="6r7yl1kko" data-path="src/components/OptimisticUpdateManager.tsx">Active Updates ({optimisticUpdates.length})</TabsTrigger>
          <TabsTrigger value="performance" data-id="ba7zo2kk3" data-path="src/components/OptimisticUpdateManager.tsx">Performance</TabsTrigger>
          <TabsTrigger value="settings" data-id="5rcmqwsh3" data-path="src/components/OptimisticUpdateManager.tsx">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-4" data-id="lcqva9kbc" data-path="src/components/OptimisticUpdateManager.tsx">
          <div className="flex justify-between items-center" data-id="wntu7l4th" data-path="src/components/OptimisticUpdateManager.tsx">
            <h3 className="text-lg font-medium" data-id="7la9br5za" data-path="src/components/OptimisticUpdateManager.tsx">Optimistic Updates Queue</h3>
            <div className="flex gap-2" data-id="t53obejxb" data-path="src/components/OptimisticUpdateManager.tsx">
              <Button
                size="sm"
                variant="outline"
                onClick={clearCompletedUpdates} data-id="gzfx2awyc" data-path="src/components/OptimisticUpdateManager.tsx">

                Clear Completed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => createOptimisticUpdate('products', 'create', { name: 'Test Product', price: 9.99 })} data-id="ey803vzdv" data-path="src/components/OptimisticUpdateManager.tsx">

                Test Update
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96" data-id="oww9cgyl7" data-path="src/components/OptimisticUpdateManager.tsx">
            <div className="space-y-3" data-id="c2xnv9dog" data-path="src/components/OptimisticUpdateManager.tsx">
              <AnimatePresence data-id="bq9edhdk6" data-path="src/components/OptimisticUpdateManager.tsx">
                {optimisticUpdates.map((update) =>
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} data-id="hx1ye0q87" data-path="src/components/OptimisticUpdateManager.tsx">

                    <Card className={`border-l-4 ${getStatusColor(update.status)}`} data-id="ddwj3oh11" data-path="src/components/OptimisticUpdateManager.tsx">
                      <CardContent className="pt-4" data-id="74c9pra21" data-path="src/components/OptimisticUpdateManager.tsx">
                        <div className="flex items-center justify-between mb-3" data-id="zbp5lg8xo" data-path="src/components/OptimisticUpdateManager.tsx">
                          <div className="flex items-center gap-3" data-id="9xhhgij9c" data-path="src/components/OptimisticUpdateManager.tsx">
                            {getStatusIcon(update.status)}
                            <div data-id="b81163qmn" data-path="src/components/OptimisticUpdateManager.tsx">
                              <p className="font-medium" data-id="tao2lww19" data-path="src/components/OptimisticUpdateManager.tsx">
                                {update.operation.toUpperCase()} • {update.tableId}
                              </p>
                              <p className="text-sm text-gray-600" data-id="tynnyn7r0" data-path="src/components/OptimisticUpdateManager.tsx">
                                Record #{update.recordId} • {update.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="o1nm3a4q4" data-path="src/components/OptimisticUpdateManager.tsx">
                            <Badge variant="outline" data-id="0cjameia9" data-path="src/components/OptimisticUpdateManager.tsx">
                              {update.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {update.status === 'failed' &&
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => manualRetry(update.id)} data-id="2bipmljlj" data-path="src/components/OptimisticUpdateManager.tsx">

                                Retry
                              </Button>
                          }
                            {update.status === 'pending' &&
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => forceRollback(update.id)} data-id="fiz4611s9" data-path="src/components/OptimisticUpdateManager.tsx">

                                Rollback
                              </Button>
                          }
                          </div>
                        </div>

                        {update.status === 'pending' &&
                      <div className="mb-3" data-id="67epmklof" data-path="src/components/OptimisticUpdateManager.tsx">
                            <div className="flex justify-between text-sm mb-1" data-id="gr5jw0oqj" data-path="src/components/OptimisticUpdateManager.tsx">
                              <span data-id="qlvvy5gs9" data-path="src/components/OptimisticUpdateManager.tsx">Syncing...</span>
                              <span data-id="1lbic4ikj" data-path="src/components/OptimisticUpdateManager.tsx">{update.retryCount}/{maxRetries} attempts</span>
                            </div>
                            <Progress
                          value={(Date.now() - update.timestamp.getTime()) / update.estimatedDuration * 100}
                          className="h-2" data-id="kh1mshkz2" data-path="src/components/OptimisticUpdateManager.tsx" />

                          </div>
                      }

                        <div className="text-sm space-y-2" data-id="rh7w1fjm7" data-path="src/components/OptimisticUpdateManager.tsx">
                          <div data-id="aptbs37xp" data-path="src/components/OptimisticUpdateManager.tsx">
                            <p className="font-medium" data-id="56mfbql9m" data-path="src/components/OptimisticUpdateManager.tsx">Local Data:</p>
                            <div className="bg-gray-50 p-2 rounded text-xs font-mono" data-id="zaw7m9kxl" data-path="src/components/OptimisticUpdateManager.tsx">
                              {JSON.stringify(update.localData, null, 2)}
                            </div>
                          </div>
                          
                          {update.syncAttempts.length > 0 &&
                        <div data-id="5h00r7v6i" data-path="src/components/OptimisticUpdateManager.tsx">
                              <p className="font-medium" data-id="7z17jlfmt" data-path="src/components/OptimisticUpdateManager.tsx">Sync Attempts:</p>
                              <div className="flex gap-1" data-id="v32847ozw" data-path="src/components/OptimisticUpdateManager.tsx">
                                {update.syncAttempts.map((duration, index) =>
                            <Badge key={index} variant="secondary" className="text-xs" data-id="w9mqradk7" data-path="src/components/OptimisticUpdateManager.tsx">
                                    {Math.round(duration)}ms
                                  </Badge>
                            )}
                              </div>
                            </div>
                        }
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4" data-id="dci27a2db" data-path="src/components/OptimisticUpdateManager.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="dwglwp6bh" data-path="src/components/OptimisticUpdateManager.tsx">
            <Card data-id="s0jh7j4wi" data-path="src/components/OptimisticUpdateManager.tsx">
              <CardHeader data-id="m9yziexn2" data-path="src/components/OptimisticUpdateManager.tsx">
                <CardTitle className="flex items-center gap-2" data-id="8o78fjpff" data-path="src/components/OptimisticUpdateManager.tsx">
                  <TrendingUp className="h-5 w-5" data-id="8hkekw5nh" data-path="src/components/OptimisticUpdateManager.tsx" />
                  Response Time Trends
                </CardTitle>
              </CardHeader>
              <CardContent data-id="kwokj86ga" data-path="src/components/OptimisticUpdateManager.tsx">
                <div className="space-y-4" data-id="wmyiirios" data-path="src/components/OptimisticUpdateManager.tsx">
                  <div className="flex justify-between items-center" data-id="9m2gpag7w" data-path="src/components/OptimisticUpdateManager.tsx">
                    <span data-id="ui9nnssae" data-path="src/components/OptimisticUpdateManager.tsx">Current Average:</span>
                    <Badge variant="outline" data-id="qjl6u3vgb" data-path="src/components/OptimisticUpdateManager.tsx">{performanceMetrics.averageResponseTime}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center" data-id="9rq75mqn3" data-path="src/components/OptimisticUpdateManager.tsx">
                    <span data-id="fl1z87tsh" data-path="src/components/OptimisticUpdateManager.tsx">Target:</span>
                    <Badge variant="outline" data-id="hrb1cy6n6" data-path="src/components/OptimisticUpdateManager.tsx">{'<500ms'}</Badge>
                  </div>
                  <Progress
                    value={Math.min(500 / Math.max(performanceMetrics.averageResponseTime, 1) * 100, 100)}
                    className="h-3" data-id="ngwfcvxvs" data-path="src/components/OptimisticUpdateManager.tsx" />

                  <p className="text-sm text-gray-600" data-id="ylfab4gsw" data-path="src/components/OptimisticUpdateManager.tsx">
                    {performanceMetrics.averageResponseTime <= 500 ?
                    "✅ Performance target met" :
                    "⚠️ Performance below target"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card data-id="izce13ysk" data-path="src/components/OptimisticUpdateManager.tsx">
              <CardHeader data-id="ritzo2vo7" data-path="src/components/OptimisticUpdateManager.tsx">
                <CardTitle data-id="jkln3hfmr" data-path="src/components/OptimisticUpdateManager.tsx">Operation Success Rate</CardTitle>
              </CardHeader>
              <CardContent data-id="s936lv82t" data-path="src/components/OptimisticUpdateManager.tsx">
                <div className="space-y-4" data-id="466msvv9s" data-path="src/components/OptimisticUpdateManager.tsx">
                  <div className="text-center" data-id="5bs94iead" data-path="src/components/OptimisticUpdateManager.tsx">
                    <div className="text-3xl font-bold text-green-600" data-id="fbcbz9289" data-path="src/components/OptimisticUpdateManager.tsx">
                      {performanceMetrics.successRate.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600" data-id="8mqb3f2if" data-path="src/components/OptimisticUpdateManager.tsx">Overall Success Rate</p>
                  </div>
                  <Progress
                    value={performanceMetrics.successRate}
                    className="h-3" data-id="4ndexvv0w" data-path="src/components/OptimisticUpdateManager.tsx" />

                  <div className="grid grid-cols-3 gap-2 text-xs text-center" data-id="lrwvz28tn" data-path="src/components/OptimisticUpdateManager.tsx">
                    <div data-id="zejdofwhl" data-path="src/components/OptimisticUpdateManager.tsx">
                      <div className="font-medium text-green-600" data-id="a7x9mygiy" data-path="src/components/OptimisticUpdateManager.tsx">
                        {optimisticUpdates.filter((u) => u.status === 'confirmed').length}
                      </div>
                      <div data-id="cru14vdmu" data-path="src/components/OptimisticUpdateManager.tsx">Confirmed</div>
                    </div>
                    <div data-id="gev7yu89q" data-path="src/components/OptimisticUpdateManager.tsx">
                      <div className="font-medium text-red-600" data-id="mj7kohxou" data-path="src/components/OptimisticUpdateManager.tsx">
                        {optimisticUpdates.filter((u) => u.status === 'failed').length}
                      </div>
                      <div data-id="dov66et1l" data-path="src/components/OptimisticUpdateManager.tsx">Failed</div>
                    </div>
                    <div data-id="sewk0mbjo" data-path="src/components/OptimisticUpdateManager.tsx">
                      <div className="font-medium text-orange-600" data-id="hho1dd8ka" data-path="src/components/OptimisticUpdateManager.tsx">
                        {optimisticUpdates.filter((u) => u.status === 'rolled_back').length}
                      </div>
                      <div data-id="pxfl8ilzl" data-path="src/components/OptimisticUpdateManager.tsx">Rolled Back</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" data-id="fshk45q43" data-path="src/components/OptimisticUpdateManager.tsx">
          <Card data-id="9zbujwwi7" data-path="src/components/OptimisticUpdateManager.tsx">
            <CardHeader data-id="7x2f3owis" data-path="src/components/OptimisticUpdateManager.tsx">
              <CardTitle data-id="e0vblsvlu" data-path="src/components/OptimisticUpdateManager.tsx">Optimistic Update Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6" data-id="5vhxn46dx" data-path="src/components/OptimisticUpdateManager.tsx">
              <div className="space-y-4" data-id="0umsu58fs" data-path="src/components/OptimisticUpdateManager.tsx">
                <div data-id="rgte5z3ql" data-path="src/components/OptimisticUpdateManager.tsx">
                  <label className="block text-sm font-medium mb-2" data-id="m03wptk9b" data-path="src/components/OptimisticUpdateManager.tsx">
                    Sync Interval: {syncInterval}ms
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="500"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="w-full" data-id="6yc7ewf3r" data-path="src/components/OptimisticUpdateManager.tsx" />

                  <div className="flex justify-between text-xs text-gray-600 mt-1" data-id="kosvjotfd" data-path="src/components/OptimisticUpdateManager.tsx">
                    <span data-id="8pob8dqxo" data-path="src/components/OptimisticUpdateManager.tsx">500ms (Fast)</span>
                    <span data-id="x7e9zwjr7" data-path="src/components/OptimisticUpdateManager.tsx">5000ms (Slow)</span>
                  </div>
                </div>

                <div data-id="75b5al8vy" data-path="src/components/OptimisticUpdateManager.tsx">
                  <label className="block text-sm font-medium mb-2" data-id="mlwzf89xh" data-path="src/components/OptimisticUpdateManager.tsx">
                    Max Retry Attempts: {maxRetries}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={maxRetries}
                    onChange={(e) => setMaxRetries(Number(e.target.value))}
                    className="w-full" data-id="7ghzejj2h" data-path="src/components/OptimisticUpdateManager.tsx" />

                  <div className="flex justify-between text-xs text-gray-600 mt-1" data-id="p1p3gtqz4" data-path="src/components/OptimisticUpdateManager.tsx">
                    <span data-id="xj4qdpdfm" data-path="src/components/OptimisticUpdateManager.tsx">1 (Quick Fail)</span>
                    <span data-id="8ed9v18ft" data-path="src/components/OptimisticUpdateManager.tsx">10 (Persistent)</span>
                  </div>
                </div>
              </div>

              <Alert data-id="4xnphbx0j" data-path="src/components/OptimisticUpdateManager.tsx">
                <Zap className="h-4 w-4" data-id="mg445dal9" data-path="src/components/OptimisticUpdateManager.tsx" />
                <AlertDescription data-id="xab59kcqr" data-path="src/components/OptimisticUpdateManager.tsx">
                  Optimistic updates provide instant UI feedback while syncing changes in the background. 
                  Lower sync intervals provide faster consistency but use more resources.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default OptimisticUpdateManager;
