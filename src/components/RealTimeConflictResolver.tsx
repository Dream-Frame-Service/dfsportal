import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Users, Clock, CheckCircle, XCircle, GitMerge, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'motion/react';

interface ConflictData {
  id: string;
  tableId: string;
  recordId: number;
  fieldName: string;
  originalValue: any;
  userValue: any;
  otherUserValue: any;
  otherUserId: number;
  otherUserName: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ConflictResolution {
  strategy: 'merge' | 'user_wins' | 'other_wins' | 'manual';
  resolvedValue: any;
  reasoning: string;
}

interface ActiveUser {
  userId: number;
  userName: string;
  currentTable: string;
  currentRecord: number;
  lastActivity: Date;
  activeFields: string[];
}

const RealTimeConflictResolver: React.FC = () => {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictData | null>(null);
  const [resolutionStrategy, setResolutionStrategy] = useState<ConflictResolution | null>(null);
  const [autoResolveEnabled, setAutoResolveEnabled] = useState(true);
  const [conflictStats, setConflictStats] = useState({
    totalConflicts: 0,
    resolvedToday: 0,
    averageResolutionTime: 0,
    conflictRate: 0
  });
  const { toast } = useToast();

  // Simulate real-time conflict detection
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      detectConflicts();
      updateActiveUsers();
      updateConflictStats();
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const detectConflicts = useCallback(async () => {
    try {
      // Simulate conflict detection by checking for concurrent edits
      const simulatedConflicts = generateSimulatedConflicts();

      const newConflicts = simulatedConflicts.filter((conflict) =>
      !conflicts.some((existing) => existing.id === conflict.id)
      );

      if (newConflicts.length > 0) {
        setConflicts((prev) => [...prev, ...newConflicts]);

        newConflicts.forEach((conflict) => {
          if (autoResolveEnabled && conflict.severity !== 'critical') {
            resolveConflictAutomatically(conflict);
          } else {
            toast({
              title: "Edit Conflict Detected",
              description: `${conflict.otherUserName} is editing the same ${conflict.fieldName} field`,
              variant: "destructive"
            });
          }
        });
      }
    } catch (error) {
      console.error('Error detecting conflicts:', error);
    }
  }, [conflicts, autoResolveEnabled, toast]);

  const generateSimulatedConflicts = (): ConflictData[] => {
    const shouldGenerate = Math.random() < 0.1; // 10% chance
    if (!shouldGenerate) return [];

    const tableNames = ['products', 'employees', 'sales', 'orders'];
    const fieldNames = ['name', 'price', 'quantity', 'status', 'notes'];
    const users = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez'];

    return [{
      id: `conflict_${Date.now()}_${Math.random()}`,
      tableId: tableNames[Math.floor(Math.random() * tableNames.length)],
      recordId: Math.floor(Math.random() * 100) + 1,
      fieldName: fieldNames[Math.floor(Math.random() * fieldNames.length)],
      originalValue: 'Original Value',
      userValue: 'Your Changes',
      otherUserValue: 'Other User Changes',
      otherUserId: Math.floor(Math.random() * 1000),
      otherUserName: users[Math.floor(Math.random() * users.length)],
      timestamp: new Date(),
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any
    }];
  };

  const updateActiveUsers = useCallback(() => {
    // Simulate active users tracking
    const simulatedUsers: ActiveUser[] = [
    {
      userId: 1,
      userName: 'John Smith',
      currentTable: 'products',
      currentRecord: 123,
      lastActivity: new Date(),
      activeFields: ['name', 'price']
    },
    {
      userId: 2,
      userName: 'Sarah Johnson',
      currentTable: 'employees',
      currentRecord: 45,
      lastActivity: new Date(Date.now() - 30000),
      activeFields: ['salary', 'position']
    }];


    setActiveUsers(simulatedUsers);
  }, []);

  const updateConflictStats = useCallback(() => {
    setConflictStats({
      totalConflicts: conflicts.length,
      resolvedToday: Math.floor(conflicts.length * 0.8),
      averageResolutionTime: 45, // seconds
      conflictRate: Math.random() * 5 // conflicts per hour
    });
  }, [conflicts.length]);

  const resolveConflictAutomatically = async (conflict: ConflictData) => {
    try {
      let resolution: ConflictResolution;

      switch (conflict.severity) {
        case 'low':
          // For low severity, prefer newer value
          resolution = {
            strategy: 'other_wins',
            resolvedValue: conflict.otherUserValue,
            reasoning: 'Auto-resolved: Newer value preferred for low-impact changes'
          };
          break;
        case 'medium':
          // For medium severity, attempt merge
          resolution = {
            strategy: 'merge',
            resolvedValue: `${conflict.userValue} | ${conflict.otherUserValue}`,
            reasoning: 'Auto-resolved: Values merged for review'
          };
          break;
        default:
          // High and critical require manual resolution
          return;
      }

      await applyResolution(conflict, resolution);
      removeConflict(conflict.id);

      toast({
        title: "Conflict Auto-Resolved",
        description: resolution.reasoning
      });
    } catch (error) {
      console.error('Error auto-resolving conflict:', error);
    }
  };

  const resolveConflictManually = async (conflict: ConflictData, resolution: ConflictResolution) => {
    try {
      await applyResolution(conflict, resolution);
      removeConflict(conflict.id);
      setSelectedConflict(null);

      toast({
        title: "Conflict Resolved",
        description: `Applied ${resolution.strategy} strategy successfully`
      });
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Resolution Failed",
        description: "Failed to apply conflict resolution",
        variant: "destructive"
      });
    }
  };

  const applyResolution = async (conflict: ConflictData, resolution: ConflictResolution) => {
    // Simulate API call to apply resolution
    console.log('Applying resolution:', { conflict, resolution });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const removeConflict = (conflictId: string) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':return 'bg-green-500';
      case 'medium':return 'bg-yellow-500';
      case 'high':return 'bg-orange-500';
      case 'critical':return 'bg-red-500';
      default:return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':return <CheckCircle className="h-4 w-4" data-id="pzq9cyarg" data-path="src/components/RealTimeConflictResolver.tsx" />;
      case 'medium':return <Clock className="h-4 w-4" data-id="tp44jvcmf" data-path="src/components/RealTimeConflictResolver.tsx" />;
      case 'high':return <AlertTriangle className="h-4 w-4" data-id="w45k545r5" data-path="src/components/RealTimeConflictResolver.tsx" />;
      case 'critical':return <XCircle className="h-4 w-4" data-id="2mxllgix7" data-path="src/components/RealTimeConflictResolver.tsx" />;
      default:return <AlertTriangle className="h-4 w-4" data-id="glpezfr6r" data-path="src/components/RealTimeConflictResolver.tsx" />;
    }
  };

  return (
    <div className="space-y-6" data-id="snc9vl3ti" data-path="src/components/RealTimeConflictResolver.tsx">
      {/* Header Controls */}
      <Card data-id="t7dj452rc" data-path="src/components/RealTimeConflictResolver.tsx">
        <CardHeader data-id="9sl5mztkn" data-path="src/components/RealTimeConflictResolver.tsx">
          <div className="flex items-center justify-between" data-id="7kkdd7upx" data-path="src/components/RealTimeConflictResolver.tsx">
            <CardTitle className="flex items-center gap-2" data-id="ctc3s5npx" data-path="src/components/RealTimeConflictResolver.tsx">
              <GitMerge className="h-5 w-5" data-id="w6q9utlee" data-path="src/components/RealTimeConflictResolver.tsx" />
              Real-Time Conflict Resolver
            </CardTitle>
            <div className="flex items-center gap-2" data-id="brkabi3ca" data-path="src/components/RealTimeConflictResolver.tsx">
              <Badge variant={isMonitoring ? "default" : "secondary"} data-id="z3ji0l7og" data-path="src/components/RealTimeConflictResolver.tsx">
                {isMonitoring ? "Monitoring" : "Stopped"}
              </Badge>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                size="sm" data-id="0tr6finte" data-path="src/components/RealTimeConflictResolver.tsx">

                {isMonitoring ? "Stop" : "Start"} Monitoring
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent data-id="6te420g3l" data-path="src/components/RealTimeConflictResolver.tsx">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="6xleud99b" data-path="src/components/RealTimeConflictResolver.tsx">
            <div className="text-center" data-id="kenusfovc" data-path="src/components/RealTimeConflictResolver.tsx">
              <div className="text-2xl font-bold text-red-600" data-id="7fyhebl2t" data-path="src/components/RealTimeConflictResolver.tsx">{conflictStats.totalConflicts}</div>
              <div className="text-sm text-gray-600" data-id="ddjioh71j" data-path="src/components/RealTimeConflictResolver.tsx">Active Conflicts</div>
            </div>
            <div className="text-center" data-id="5mutrux70" data-path="src/components/RealTimeConflictResolver.tsx">
              <div className="text-2xl font-bold text-green-600" data-id="ubgly1f4u" data-path="src/components/RealTimeConflictResolver.tsx">{conflictStats.resolvedToday}</div>
              <div className="text-sm text-gray-600" data-id="qlqi02rl1" data-path="src/components/RealTimeConflictResolver.tsx">Resolved Today</div>
            </div>
            <div className="text-center" data-id="zw6wy83pj" data-path="src/components/RealTimeConflictResolver.tsx">
              <div className="text-2xl font-bold text-blue-600" data-id="n6xs17dwg" data-path="src/components/RealTimeConflictResolver.tsx">{conflictStats.averageResolutionTime}s</div>
              <div className="text-sm text-gray-600" data-id="avojy7q6e" data-path="src/components/RealTimeConflictResolver.tsx">Avg Resolution Time</div>
            </div>
            <div className="text-center" data-id="q4ovhwrl5" data-path="src/components/RealTimeConflictResolver.tsx">
              <div className="text-2xl font-bold text-orange-600" data-id="3pgva4ouh" data-path="src/components/RealTimeConflictResolver.tsx">{conflictStats.conflictRate.toFixed(1)}</div>
              <div className="text-sm text-gray-600" data-id="m3ivotrmy" data-path="src/components/RealTimeConflictResolver.tsx">Conflicts/Hour</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="conflicts" className="w-full" data-id="08np5t6ai" data-path="src/components/RealTimeConflictResolver.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="ne2hq0913" data-path="src/components/RealTimeConflictResolver.tsx">
          <TabsTrigger value="conflicts" data-id="8zlw597az" data-path="src/components/RealTimeConflictResolver.tsx">Active Conflicts ({conflicts.length})</TabsTrigger>
          <TabsTrigger value="users" data-id="49re29csl" data-path="src/components/RealTimeConflictResolver.tsx">Active Users ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="settings" data-id="8dwwc3ytu" data-path="src/components/RealTimeConflictResolver.tsx">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts" className="space-y-4" data-id="vz314lfpw" data-path="src/components/RealTimeConflictResolver.tsx">
          {conflicts.length === 0 ?
          <Alert data-id="1fssa4z6p" data-path="src/components/RealTimeConflictResolver.tsx">
              <CheckCircle className="h-4 w-4" data-id="ynk4tewxp" data-path="src/components/RealTimeConflictResolver.tsx" />
              <AlertDescription data-id="kehxq03l7" data-path="src/components/RealTimeConflictResolver.tsx">
                No active conflicts detected. All users are working in harmony!
              </AlertDescription>
            </Alert> :

          <div className="space-y-3" data-id="746aq3yvr" data-path="src/components/RealTimeConflictResolver.tsx">
              <AnimatePresence data-id="xlr8e94c4" data-path="src/components/RealTimeConflictResolver.tsx">
                {conflicts.map((conflict) =>
              <motion.div
                key={conflict.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} data-id="nw7fohgwj" data-path="src/components/RealTimeConflictResolver.tsx">

                    <Card className="border-l-4" style={{ borderLeftColor: getSeverityColor(conflict.severity).replace('bg-', '#') }} data-id="jhxb6nl0q" data-path="src/components/RealTimeConflictResolver.tsx">
                      <CardContent className="pt-4" data-id="pcwujqci8" data-path="src/components/RealTimeConflictResolver.tsx">
                        <div className="flex items-center justify-between" data-id="72mjsypwh" data-path="src/components/RealTimeConflictResolver.tsx">
                          <div className="flex items-center gap-3" data-id="supg5zbn3" data-path="src/components/RealTimeConflictResolver.tsx">
                            <Badge variant="outline" className="flex items-center gap-1" data-id="m5ew2uxm5" data-path="src/components/RealTimeConflictResolver.tsx">
                              {getSeverityIcon(conflict.severity)}
                              {conflict.severity.toUpperCase()}
                            </Badge>
                            <div data-id="1aim9k34n" data-path="src/components/RealTimeConflictResolver.tsx">
                              <p className="font-medium" data-id="x2wvhooz9" data-path="src/components/RealTimeConflictResolver.tsx">
                                {conflict.tableId} → {conflict.fieldName}
                              </p>
                              <p className="text-sm text-gray-600" data-id="u0xyw0k6a" data-path="src/components/RealTimeConflictResolver.tsx">
                                Conflict with {conflict.otherUserName} • Record #{conflict.recordId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" data-id="r7142s1c3" data-path="src/components/RealTimeConflictResolver.tsx">
                            <Badge variant="secondary" data-id="liy2o772u" data-path="src/components/RealTimeConflictResolver.tsx">
                              <Clock className="h-3 w-3 mr-1" data-id="qhj56ktfc" data-path="src/components/RealTimeConflictResolver.tsx" />
                              {new Date(conflict.timestamp).toLocaleTimeString()}
                            </Badge>
                            <Button
                          size="sm"
                          onClick={() => setSelectedConflict(conflict)} data-id="f685hv2jg" data-path="src/components/RealTimeConflictResolver.tsx">

                              Resolve
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm" data-id="1pqaek34k" data-path="src/components/RealTimeConflictResolver.tsx">
                          <div data-id="j0qb2dccz" data-path="src/components/RealTimeConflictResolver.tsx">
                            <p className="font-medium text-blue-600" data-id="rtfovzq09" data-path="src/components/RealTimeConflictResolver.tsx">Your Changes:</p>
                            <p className="bg-blue-50 p-2 rounded" data-id="zr9mzeeca" data-path="src/components/RealTimeConflictResolver.tsx">{conflict.userValue}</p>
                          </div>
                          <div data-id="y9md6bokv" data-path="src/components/RealTimeConflictResolver.tsx">
                            <p className="font-medium text-orange-600" data-id="baexxwd9h" data-path="src/components/RealTimeConflictResolver.tsx">{conflict.otherUserName}'s Changes:</p>
                            <p className="bg-orange-50 p-2 rounded" data-id="vkyjku48a" data-path="src/components/RealTimeConflictResolver.tsx">{conflict.otherUserValue}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>
          }
        </TabsContent>

        <TabsContent value="users" className="space-y-4" data-id="y5y7pdsn0" data-path="src/components/RealTimeConflictResolver.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-id="7evnqhb0g" data-path="src/components/RealTimeConflictResolver.tsx">
            {activeUsers.map((user) =>
            <Card key={user.userId} data-id="rexn8f8t2" data-path="src/components/RealTimeConflictResolver.tsx">
                <CardContent className="pt-4" data-id="nnquw87ar" data-path="src/components/RealTimeConflictResolver.tsx">
                  <div className="flex items-center gap-3 mb-3" data-id="jxaqvjvxy" data-path="src/components/RealTimeConflictResolver.tsx">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium" data-id="nboxavxqw" data-path="src/components/RealTimeConflictResolver.tsx">
                      {user.userName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div data-id="8vkchkv4j" data-path="src/components/RealTimeConflictResolver.tsx">
                      <p className="font-medium" data-id="u2wsrk8pz" data-path="src/components/RealTimeConflictResolver.tsx">{user.userName}</p>
                      <p className="text-sm text-gray-600" data-id="oj8mb5ciy" data-path="src/components/RealTimeConflictResolver.tsx">ID: {user.userId}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm" data-id="23myuqqos" data-path="src/components/RealTimeConflictResolver.tsx">
                    <div className="flex justify-between" data-id="lghfelv8v" data-path="src/components/RealTimeConflictResolver.tsx">
                      <span data-id="39dev8q22" data-path="src/components/RealTimeConflictResolver.tsx">Current Table:</span>
                      <Badge variant="outline" data-id="bx8qt356y" data-path="src/components/RealTimeConflictResolver.tsx">{user.currentTable}</Badge>
                    </div>
                    <div className="flex justify-between" data-id="z3gfkqb66" data-path="src/components/RealTimeConflictResolver.tsx">
                      <span data-id="cyuym02dh" data-path="src/components/RealTimeConflictResolver.tsx">Record:</span>
                      <span data-id="v2ycp93ti" data-path="src/components/RealTimeConflictResolver.tsx">#{user.currentRecord}</span>
                    </div>
                    <div className="flex justify-between" data-id="3c77m8oc8" data-path="src/components/RealTimeConflictResolver.tsx">
                      <span data-id="9pe0mhju2" data-path="src/components/RealTimeConflictResolver.tsx">Last Activity:</span>
                      <span data-id="wafkwjpd3" data-path="src/components/RealTimeConflictResolver.tsx">{new Date(user.lastActivity).toLocaleTimeString()}</span>
                    </div>
                    <div data-id="41xp2dfi9" data-path="src/components/RealTimeConflictResolver.tsx">
                      <span data-id="4hhq1ddn7" data-path="src/components/RealTimeConflictResolver.tsx">Active Fields:</span>
                      <div className="flex flex-wrap gap-1 mt-1" data-id="or1vm6oy8" data-path="src/components/RealTimeConflictResolver.tsx">
                        {user.activeFields.map((field) =>
                      <Badge key={field} variant="secondary" className="text-xs" data-id="2tsdqf1ne" data-path="src/components/RealTimeConflictResolver.tsx">
                            {field}
                          </Badge>
                      )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" data-id="39dopuh0a" data-path="src/components/RealTimeConflictResolver.tsx">
          <Card data-id="1zn2buy7t" data-path="src/components/RealTimeConflictResolver.tsx">
            <CardHeader data-id="h4e02h7cp" data-path="src/components/RealTimeConflictResolver.tsx">
              <CardTitle data-id="kdcojj2cz" data-path="src/components/RealTimeConflictResolver.tsx">Conflict Resolution Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="6gc9rtznv" data-path="src/components/RealTimeConflictResolver.tsx">
              <div className="flex items-center justify-between" data-id="g7ox5sfwi" data-path="src/components/RealTimeConflictResolver.tsx">
                <div data-id="js2h7r3cw" data-path="src/components/RealTimeConflictResolver.tsx">
                  <p className="font-medium" data-id="5no7vs645" data-path="src/components/RealTimeConflictResolver.tsx">Auto-resolve Low/Medium Conflicts</p>
                  <p className="text-sm text-gray-600" data-id="zwu5ndnu5" data-path="src/components/RealTimeConflictResolver.tsx">Automatically resolve conflicts with low to medium severity</p>
                </div>
                <Button
                  variant={autoResolveEnabled ? "default" : "outline"}
                  onClick={() => setAutoResolveEnabled(!autoResolveEnabled)} data-id="wh2qwsijw" data-path="src/components/RealTimeConflictResolver.tsx">

                  {autoResolveEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
              
              <div className="space-y-2" data-id="qn2g0xbwt" data-path="src/components/RealTimeConflictResolver.tsx">
                <p className="font-medium" data-id="fpdtofinf" data-path="src/components/RealTimeConflictResolver.tsx">Detection Interval</p>
                <div className="flex items-center gap-2" data-id="2ldp8wvs1" data-path="src/components/RealTimeConflictResolver.tsx">
                  <span className="text-sm" data-id="sqfdl8y9i" data-path="src/components/RealTimeConflictResolver.tsx">Real-time (2s intervals)</span>
                  <Progress value={100} className="flex-1" data-id="bk7coqbbt" data-path="src/components/RealTimeConflictResolver.tsx" />
                  <Zap className="h-4 w-4 text-green-500" data-id="jl5by97sz" data-path="src/components/RealTimeConflictResolver.tsx" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conflict Resolution Dialog */}
      <Dialog open={!!selectedConflict} onOpenChange={() => setSelectedConflict(null)} data-id="zo94gi6zr" data-path="src/components/RealTimeConflictResolver.tsx">
        <DialogContent className="max-w-4xl" data-id="96hv50h53" data-path="src/components/RealTimeConflictResolver.tsx">
          <DialogHeader data-id="g91cbsp67" data-path="src/components/RealTimeConflictResolver.tsx">
            <DialogTitle data-id="n71nbsd0t" data-path="src/components/RealTimeConflictResolver.tsx">Resolve Edit Conflict</DialogTitle>
          </DialogHeader>
          
          {selectedConflict &&
          <div className="space-y-4" data-id="2vng28xq2" data-path="src/components/RealTimeConflictResolver.tsx">
              <Alert data-id="sdaz5xya2" data-path="src/components/RealTimeConflictResolver.tsx">
                <AlertTriangle className="h-4 w-4" data-id="8xhvbf1ya" data-path="src/components/RealTimeConflictResolver.tsx" />
                <AlertDescription data-id="eiiypedxf" data-path="src/components/RealTimeConflictResolver.tsx">
                  Multiple users have edited the same field. Choose how to resolve this conflict.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-3 gap-4 text-sm" data-id="ea6tgb3pg" data-path="src/components/RealTimeConflictResolver.tsx">
                <div data-id="04rt6embr" data-path="src/components/RealTimeConflictResolver.tsx">
                  <p className="font-medium mb-2" data-id="uztgrni1h" data-path="src/components/RealTimeConflictResolver.tsx">Original Value:</p>
                  <div className="bg-gray-50 p-3 rounded border" data-id="po3s9uliu" data-path="src/components/RealTimeConflictResolver.tsx">
                    {selectedConflict.originalValue}
                  </div>
                </div>
                <div data-id="kcshc522t" data-path="src/components/RealTimeConflictResolver.tsx">
                  <p className="font-medium mb-2 text-blue-600" data-id="te93vdl13" data-path="src/components/RealTimeConflictResolver.tsx">Your Changes:</p>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200" data-id="ww6raiwmq" data-path="src/components/RealTimeConflictResolver.tsx">
                    {selectedConflict.userValue}
                  </div>
                </div>
                <div data-id="t605ewxy8" data-path="src/components/RealTimeConflictResolver.tsx">
                  <p className="font-medium mb-2 text-orange-600" data-id="3hx6pn3fg" data-path="src/components/RealTimeConflictResolver.tsx">{selectedConflict.otherUserName}'s Changes:</p>
                  <div className="bg-orange-50 p-3 rounded border border-orange-200" data-id="rytyj19op" data-path="src/components/RealTimeConflictResolver.tsx">
                    {selectedConflict.otherUserValue}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2" data-id="u4hmmvsi9" data-path="src/components/RealTimeConflictResolver.tsx">
                <Button
                variant="outline"
                onClick={() => resolveConflictManually(selectedConflict, {
                  strategy: 'user_wins',
                  resolvedValue: selectedConflict.userValue,
                  reasoning: 'User chose to keep their changes'
                })} data-id="7fpoyb3qe" data-path="src/components/RealTimeConflictResolver.tsx">

                  Keep Mine
                </Button>
                <Button
                variant="outline"
                onClick={() => resolveConflictManually(selectedConflict, {
                  strategy: 'other_wins',
                  resolvedValue: selectedConflict.otherUserValue,
                  reasoning: 'User chose to accept other user\'s changes'
                })} data-id="f14kvy5fp" data-path="src/components/RealTimeConflictResolver.tsx">

                  Accept Theirs
                </Button>
                <Button
                variant="outline"
                onClick={() => resolveConflictManually(selectedConflict, {
                  strategy: 'merge',
                  resolvedValue: `${selectedConflict.userValue} | ${selectedConflict.otherUserValue}`,
                  reasoning: 'User chose to merge both values'
                })} data-id="qyp59v0r6" data-path="src/components/RealTimeConflictResolver.tsx">

                  Merge Both
                </Button>
                <Button
                variant="outline"
                onClick={() => setSelectedConflict(null)} data-id="l5l3onaeb" data-path="src/components/RealTimeConflictResolver.tsx">

                  Cancel
                </Button>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

};

export default RealTimeConflictResolver;
