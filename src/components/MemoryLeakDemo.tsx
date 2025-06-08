import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  Activity,
  Timer,
  MousePointer,
  Zap,
  Database } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Simple demo component without complex dependencies
const BadComponent: React.FC<{onStop: () => void;}> = ({ onStop }) => {
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // ❌ Memory leak: Timer not cleared
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    // Missing cleanup - intentional for demo
  }, []);

  useEffect(() => {
    if (count > 10) {
      toast({
        title: "Memory Leak Demo",
        description: "Timer has been running for 10 seconds without cleanup!",
        variant: "destructive"
      });
      onStop();
    }
  }, [count, onStop, toast]);

  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50" data-id="eevqd5xhg" data-path="src/components/MemoryLeakDemo.tsx">
      <h3 className="font-semibold text-red-900 mb-2" data-id="yfj71hp66" data-path="src/components/MemoryLeakDemo.tsx">❌ Component with Memory Leaks</h3>
      <p className="text-red-700 text-sm mb-2" data-id="o9zve6g8p" data-path="src/components/MemoryLeakDemo.tsx">Count: {count}</p>
      <Alert className="mt-2" data-id="wudqgjqhm" data-path="src/components/MemoryLeakDemo.tsx">
        <AlertTriangle className="h-4 w-4" data-id="v56gdmqqv" data-path="src/components/MemoryLeakDemo.tsx" />
        <AlertDescription className="text-red-800" data-id="z6fuybz64" data-path="src/components/MemoryLeakDemo.tsx">
          This component has active timers that won't be cleaned up!
        </AlertDescription>
      </Alert>
    </div>);

};

// Simple good component
const GoodComponent: React.FC<{onStop: () => void;}> = ({ onStop }) => {
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // ✅ Safe timer with cleanup
    const timer = setTimeout(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    // Proper cleanup
    return () => clearTimeout(timer);
  }, [count]);

  useEffect(() => {
    if (count > 10) {
      toast({
        title: "Memory Safe Demo",
        description: "Timer has been safely managed for 10 seconds!"
      });
      onStop();
    }
  }, [count, onStop, toast]);

  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50" data-id="gxdnf5pu4" data-path="src/components/MemoryLeakDemo.tsx">
      <h3 className="font-semibold text-green-900 mb-2" data-id="7w26kcdvs" data-path="src/components/MemoryLeakDemo.tsx">✅ Component with Memory Protection</h3>
      <p className="text-green-700 text-sm mb-2" data-id="xr84gtzra" data-path="src/components/MemoryLeakDemo.tsx">Count: {count}</p>
      <Alert className="mt-2" data-id="sczf7ajrr" data-path="src/components/MemoryLeakDemo.tsx">
        <CheckCircle className="h-4 w-4" data-id="qirwbq5sz" data-path="src/components/MemoryLeakDemo.tsx" />
        <AlertDescription className="text-green-800" data-id="37036hehv" data-path="src/components/MemoryLeakDemo.tsx">
          This component properly cleans up its resources!
        </AlertDescription>
      </Alert>
    </div>);

};

const MemoryLeakDemo: React.FC = () => {
  const [badComponentActive, setBadComponentActive] = useState(false);
  const [goodComponentActive, setGoodComponentActive] = useState(false);

  const startBadDemo = () => {
    setBadComponentActive(true);

    setTimeout(() => {
      setBadComponentActive(false);
    }, 15000); // Auto-stop after 15 seconds
  };

  const startGoodDemo = () => {
    setGoodComponentActive(true);

    setTimeout(() => {
      setGoodComponentActive(false);
    }, 15000); // Auto-stop after 15 seconds
  };

  const stopBadDemo = () => {
    setBadComponentActive(false);
  };

  const stopGoodDemo = () => {
    setGoodComponentActive(false);
  };

  return (
    <div className="space-y-6" data-id="7mjatho6s" data-path="src/components/MemoryLeakDemo.tsx">
      <div className="text-center" data-id="b8zya9j5v" data-path="src/components/MemoryLeakDemo.tsx">
        <h2 className="text-2xl font-bold mb-2" data-id="nt4unsuu1" data-path="src/components/MemoryLeakDemo.tsx">Memory Leak Detection Demo</h2>
        <p className="text-muted-foreground" data-id="mri75enp4" data-path="src/components/MemoryLeakDemo.tsx">
          Compare components with and without memory leak protection
        </p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4" data-id="h3rkkjqn4" data-path="src/components/MemoryLeakDemo.tsx">
        <TabsList className="grid w-full grid-cols-2" data-id="xkejefwoa" data-path="src/components/MemoryLeakDemo.tsx">
          <TabsTrigger value="comparison" data-id="deb4ymjfm" data-path="src/components/MemoryLeakDemo.tsx">Live Comparison</TabsTrigger>
          <TabsTrigger value="patterns" data-id="ocy1ofz46" data-path="src/components/MemoryLeakDemo.tsx">Leak Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4" data-id="0mp565ti9" data-path="src/components/MemoryLeakDemo.tsx">
          <div className="grid md:grid-cols-2 gap-6" data-id="fgbc4uvcv" data-path="src/components/MemoryLeakDemo.tsx">
            {/* Bad Component Demo */}
            <Card data-id="hoc0k9i8m" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="8uq1iufi6" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-red-600" data-id="whvmz1n3a" data-path="src/components/MemoryLeakDemo.tsx">
                  <AlertTriangle className="h-5 w-5" data-id="879e63924" data-path="src/components/MemoryLeakDemo.tsx" />
                  Memory Leak Component
                </CardTitle>
                <CardDescription data-id="gumo276m7" data-path="src/components/MemoryLeakDemo.tsx">
                  Demonstrates common memory leak patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="wn9o1whg4" data-path="src/components/MemoryLeakDemo.tsx">
                <div className="flex gap-2" data-id="9z16dls2j" data-path="src/components/MemoryLeakDemo.tsx">
                  <Button
                    onClick={startBadDemo}
                    disabled={badComponentActive}
                    variant="destructive"
                    size="sm" data-id="fneghorhf" data-path="src/components/MemoryLeakDemo.tsx">

                    <Play className="h-4 w-4 mr-2" data-id="q4qb7etar" data-path="src/components/MemoryLeakDemo.tsx" />
                    Start Leak Demo
                  </Button>
                  <Button
                    onClick={stopBadDemo}
                    disabled={!badComponentActive}
                    variant="outline"
                    size="sm" data-id="go2qh17e0" data-path="src/components/MemoryLeakDemo.tsx">

                    <Square className="h-4 w-4 mr-2" data-id="tibz9kj20" data-path="src/components/MemoryLeakDemo.tsx" />
                    Stop
                  </Button>
                  {badComponentActive &&
                  <Badge variant="destructive" data-id="qay0lji6w" data-path="src/components/MemoryLeakDemo.tsx">
                      <Activity className="h-3 w-3 mr-1" data-id="taopt75km" data-path="src/components/MemoryLeakDemo.tsx" />
                      Active Leaks
                    </Badge>
                  }
                </div>
                
                {badComponentActive &&
                <BadComponent onStop={stopBadDemo} data-id="qch0j54bg" data-path="src/components/MemoryLeakDemo.tsx" />
                }
              </CardContent>
            </Card>

            {/* Good Component Demo */}
            <Card data-id="281fpbb4q" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="76v2hrjnn" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-green-600" data-id="izp8qcxym" data-path="src/components/MemoryLeakDemo.tsx">
                  <CheckCircle className="h-5 w-5" data-id="57v1bemvq" data-path="src/components/MemoryLeakDemo.tsx" />
                  Memory Safe Component
                </CardTitle>
                <CardDescription data-id="gjk3b9a4s" data-path="src/components/MemoryLeakDemo.tsx">
                  Uses proper cleanup patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="yfkifxurc" data-path="src/components/MemoryLeakDemo.tsx">
                <div className="flex gap-2" data-id="nrqrang49" data-path="src/components/MemoryLeakDemo.tsx">
                  <Button
                    onClick={startGoodDemo}
                    disabled={goodComponentActive}
                    size="sm" data-id="cawv85yy3" data-path="src/components/MemoryLeakDemo.tsx">

                    <Play className="h-4 w-4 mr-2" data-id="435rop0r3" data-path="src/components/MemoryLeakDemo.tsx" />
                    Start Safe Demo
                  </Button>
                  <Button
                    onClick={stopGoodDemo}
                    disabled={!goodComponentActive}
                    variant="outline"
                    size="sm" data-id="itcxh6mf1" data-path="src/components/MemoryLeakDemo.tsx">

                    <Square className="h-4 w-4 mr-2" data-id="nxr1vwouj" data-path="src/components/MemoryLeakDemo.tsx" />
                    Stop
                  </Button>
                  {goodComponentActive &&
                  <Badge variant="default" data-id="me3ofv0ca" data-path="src/components/MemoryLeakDemo.tsx">
                      <CheckCircle className="h-3 w-3 mr-1" data-id="hosxw32gl" data-path="src/components/MemoryLeakDemo.tsx" />
                      Protected
                    </Badge>
                  }
                </div>
                
                {goodComponentActive &&
                <GoodComponent onStop={stopGoodDemo} data-id="5lzs0i9to" data-path="src/components/MemoryLeakDemo.tsx" />
                }
              </CardContent>
            </Card>
          </div>

          <Alert data-id="izbf7320x" data-path="src/components/MemoryLeakDemo.tsx">
            <Activity className="h-4 w-4" data-id="qu4fu1tfk" data-path="src/components/MemoryLeakDemo.tsx" />
            <AlertDescription data-id="wq5n3w37m" data-path="src/components/MemoryLeakDemo.tsx">
              <strong data-id="nmy595osd" data-path="src/components/MemoryLeakDemo.tsx">Monitor the Memory Dashboard:</strong> Run these demos and watch the memory 
              dashboard to see the difference in memory usage and leak detection between the two approaches.
              The bad component will trigger leak warnings, while the good component will show clean monitoring.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4" data-id="5wy9repcj" data-path="src/components/MemoryLeakDemo.tsx">
          <div className="grid gap-4" data-id="u08yhyaw4" data-path="src/components/MemoryLeakDemo.tsx">
            <Card className="border-red-200" data-id="dfxyip3rd" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="cp7dh06l3" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-red-600" data-id="qgci7uzr8" data-path="src/components/MemoryLeakDemo.tsx">
                  <Timer className="h-5 w-5" data-id="utxzvv6oz" data-path="src/components/MemoryLeakDemo.tsx" />
                  Timer Leaks
                </CardTitle>
              </CardHeader>
              <CardContent data-id="dfdd798so" data-path="src/components/MemoryLeakDemo.tsx">
                <p className="text-sm text-muted-foreground mb-2" data-id="zyl3tw78v" data-path="src/components/MemoryLeakDemo.tsx">
                  Timers that aren't cleared continue running after component unmount
                </p>
                <Badge variant="destructive" data-id="r2l69avei" data-path="src/components/MemoryLeakDemo.tsx">High Impact</Badge>
              </CardContent>
            </Card>

            <Card className="border-orange-200" data-id="upjwealm6" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="17fkp8owl" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-orange-600" data-id="m2voymc53" data-path="src/components/MemoryLeakDemo.tsx">
                  <MousePointer className="h-5 w-5" data-id="ljgg48021" data-path="src/components/MemoryLeakDemo.tsx" />
                  Event Listener Leaks
                </CardTitle>
              </CardHeader>
              <CardContent data-id="4uoorub9q" data-path="src/components/MemoryLeakDemo.tsx">
                <p className="text-sm text-muted-foreground mb-2" data-id="kdjih11xs" data-path="src/components/MemoryLeakDemo.tsx">
                  Event listeners hold references preventing garbage collection
                </p>
                <Badge variant="secondary" data-id="ye8202xum" data-path="src/components/MemoryLeakDemo.tsx">Medium Impact</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-200" data-id="uiaj5hvps" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="ab6bu5405" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-purple-600" data-id="7egh7u6xc" data-path="src/components/MemoryLeakDemo.tsx">
                  <Zap className="h-5 w-5" data-id="iei8ejgc9" data-path="src/components/MemoryLeakDemo.tsx" />
                  Async Operation Leaks
                </CardTitle>
              </CardHeader>
              <CardContent data-id="ni2fc192r" data-path="src/components/MemoryLeakDemo.tsx">
                <p className="text-sm text-muted-foreground mb-2" data-id="0gtpmgy35" data-path="src/components/MemoryLeakDemo.tsx">
                  Fetch requests and promises completing after unmount
                </p>
                <Badge variant="secondary" data-id="zv57rvozn" data-path="src/components/MemoryLeakDemo.tsx">Medium Impact</Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-200" data-id="kc968qo89" data-path="src/components/MemoryLeakDemo.tsx">
              <CardHeader data-id="6e7lcw1wj" data-path="src/components/MemoryLeakDemo.tsx">
                <CardTitle className="flex items-center gap-2 text-blue-600" data-id="rmadvhr50" data-path="src/components/MemoryLeakDemo.tsx">
                  <Database className="h-5 w-5" data-id="fwuj2f2cr" data-path="src/components/MemoryLeakDemo.tsx" />
                  Subscription Leaks
                </CardTitle>
              </CardHeader>
              <CardContent data-id="ne6017xan" data-path="src/components/MemoryLeakDemo.tsx">
                <p className="text-sm text-muted-foreground mb-2" data-id="anwl35clj" data-path="src/components/MemoryLeakDemo.tsx">
                  Observables and subscriptions not properly unsubscribed
                </p>
                <Badge variant="secondary" data-id="9fwlzii5w" data-path="src/components/MemoryLeakDemo.tsx">High Impact</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export default MemoryLeakDemo;