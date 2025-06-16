import React, { useState } from 'react';
import DatabaseService from '@/services/databaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Code,
  Lightbulb,
  BookOpen,
  Target,
  Shield,
  Zap } from
'lucide-react';

interface CodeExample {
  title: string;
  description: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

const MemoryLeakPreventionGuide: React.FC = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const commonPatterns: CodeExample[] = [
  {
    title: "Timer Cleanup",
    description: "Always clear timers when components unmount",
    badCode: `// ❌ BAD: Timer not cleared
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setInterval(() => {
      setCount(prev => prev + 1); // Memory leak!
    }, 1000);
  }, []);
  
  return <div>{count}</div>;
}`,
    goodCode: `// ✅ GOOD: Timer properly cleaned up
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup
  }, []);
  
  return <div>{count}</div>;
}`,
    explanation: "Timers continue running even after component unmount unless explicitly cleared, causing memory leaks and potential state updates on unmounted components."
  },
  {
    title: "Event Listener Cleanup",
    description: "Remove event listeners to prevent memory leaks",
    badCode: `// ❌ BAD: Event listener not removed
function BadComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    // Missing cleanup!
  }, []);
  
  return <div>Mouse: {position.x}, {position.y}</div>;
}`,
    goodCode: `// ✅ GOOD: Event listener properly removed
function GoodComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <div>Mouse: {position.x}, {position.y}</div>;
}`,
    explanation: "Event listeners hold references to components, preventing garbage collection. Always remove them in cleanup functions."
  },
  {
    title: "Async Operations",
    description: "Cancel async operations when component unmounts",
    badCode: `// ❌ BAD: Async operation not cancelled
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const userData = await response.json();
      setUser(userData); // May run after unmount!
    }
    
    fetchUser();
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`,
    goodCode: `// ✅ GOOD: Async operation cancelled on unmount
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`, {
          signal: abortController.signal
        });
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    }
    
    fetchUser();
    
    return () => abortController.abort();
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`,
    explanation: "Async operations can complete after component unmount, leading to state updates on unmounted components. Use AbortController to cancel them."
  }];


  const bestPractices = [
  {
    title: "Use Memory Leak Detection Hooks",
    description: "Implement our custom hooks for automatic cleanup",
    icon: <Shield className="h-5 w-5" data-id="gfq20e7ro" data-path="src/components/MemoryLeakPreventionGuide.tsx" />,
    tips: [
    "Use useMemoryLeakDetector for automatic resource tracking",
    "Implement useSafeAsync for protected async operations",
    "Wrap components with withMemoryLeakDetection HOC"]

  },
  {
    title: "Monitor Component Lifecycle",
    description: "Track mount/unmount cycles and resource usage",
    icon: <Target className="h-5 w-5" data-id="ku3quabk6" data-path="src/components/MemoryLeakPreventionGuide.tsx" />,
    tips: [
    "Use refs to track component mount status",
    "Log resource allocation and cleanup",
    "Monitor memory usage during development"]

  },
  {
    title: "Implement Proper Error Boundaries",
    description: "Catch and handle errors to prevent resource leaks",
    icon: <Zap className="h-5 w-5" data-id="08tc275d9" data-path="src/components/MemoryLeakPreventionGuide.tsx" />,
    tips: [
    "Use error boundaries to prevent cascading failures",
    "Clean up resources in error scenarios",
    "Log errors with memory context"]

  }];


  const checklistItems = [
  "✅ All timers are cleared in useEffect cleanup",
  "✅ Event listeners are removed on unmount",
  "✅ Async operations use AbortController",
  "✅ Subscriptions are properly unsubscribed",
  "✅ Large objects are not captured in closures",
  "✅ State updates check component mount status",
  "✅ WebSocket connections are closed",
  "✅ ResizeObserver and IntersectionObserver are disconnected",
  "✅ File readers and streams are closed",
  "✅ Animation frames are cancelled"];


  return (
    <div className="space-y-6" data-id="sisudn3be" data-path="src/components/MemoryLeakPreventionGuide.tsx">
      <div className="text-center" data-id="5o8txfkuq" data-path="src/components/MemoryLeakPreventionGuide.tsx">
        <h1 className="text-3xl font-bold mb-2" data-id="pw2pwu1er" data-path="src/components/MemoryLeakPreventionGuide.tsx">Memory Leak Prevention Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto" data-id="n16thn1kz" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          Comprehensive guide to preventing memory leaks in React applications. 
          Learn patterns, best practices, and use our monitoring tools.
        </p>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4" data-id="kx4ks1q4x" data-path="src/components/MemoryLeakPreventionGuide.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="9qih1lc9k" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          <TabsTrigger value="patterns" data-id="r2wzh5emi" data-path="src/components/MemoryLeakPreventionGuide.tsx">Common Patterns</TabsTrigger>
          <TabsTrigger value="practices" data-id="pxb4w5j0j" data-path="src/components/MemoryLeakPreventionGuide.tsx">Best Practices</TabsTrigger>
          <TabsTrigger value="checklist" data-id="a3c0y0or5" data-path="src/components/MemoryLeakPreventionGuide.tsx">Checklist</TabsTrigger>
          <TabsTrigger value="tools" data-id="t31341hgg" data-path="src/components/MemoryLeakPreventionGuide.tsx">Our Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4" data-id="9p78sqil3" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          <Alert data-id="r5mnoquxm" data-path="src/components/MemoryLeakPreventionGuide.tsx">
            <AlertTriangle className="h-4 w-4" data-id="pe3albdl2" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
            <AlertDescription data-id="lllp10n5j" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              These examples show common memory leak patterns and their solutions. 
              Click on each section to expand the code examples.
            </AlertDescription>
          </Alert>

          <div className="space-y-4" data-id="v0i3m1wxk" data-path="src/components/MemoryLeakPreventionGuide.tsx">
            {commonPatterns.map((pattern, index) =>
            <Card key={index} data-id="1sz8n0b22" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <div data-id="48qm0vt5z" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <CardHeader
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(`pattern-${index}`)} data-id="i1hfa7uzz" data-path="src/components/MemoryLeakPreventionGuide.tsx">

                    <div className="flex items-center justify-between" data-id="1sfcadkuc" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                      <div data-id="chsz9azbd" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                        <CardTitle className="flex items-center gap-2" data-id="se12upv8x" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                          <Code className="h-5 w-5" data-id="lm7wco979" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                          {pattern.title}
                        </CardTitle>
                        <CardDescription data-id="r0ly04usw" data-path="src/components/MemoryLeakPreventionGuide.tsx">{pattern.description}</CardDescription>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                    openSections.has(`pattern-${index}`) ? 'rotate-180' : ''}`
                    } data-id="robanvf29" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                    </div>
                  </CardHeader>
                  {openSections.has(`pattern-${index}`) &&
                <CardContent className="space-y-4" data-id="yjd91z85t" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                      <div className="grid md:grid-cols-2 gap-4" data-id="c47v43f25" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                        <div data-id="2wrp355wz" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                          <h4 className="font-semibold text-red-600 mb-2" data-id="sephttjn8" data-path="src/components/MemoryLeakPreventionGuide.tsx">❌ Problematic Code</h4>
                          <pre className="bg-red-50 border border-red-200 rounded p-3 text-sm overflow-x-auto" data-id="tjk9um1fg" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                            <code data-id="rvz8in9oe" data-path="src/components/MemoryLeakPreventionGuide.tsx">{pattern.badCode}</code>
                          </pre>
                        </div>
                        <div data-id="fl2l13ahs" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                          <h4 className="font-semibold text-green-600 mb-2" data-id="dgoanmfal" data-path="src/components/MemoryLeakPreventionGuide.tsx">✅ Correct Code</h4>
                          <pre className="bg-green-50 border border-green-200 rounded p-3 text-sm overflow-x-auto" data-id="ysdmlb8ay" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                            <code data-id="p2gcd2z5b" data-path="src/components/MemoryLeakPreventionGuide.tsx">{pattern.goodCode}</code>
                          </pre>
                        </div>
                      </div>
                      <Alert data-id="7z64gntmn" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                        <Lightbulb className="h-4 w-4" data-id="fbo76aaxg" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                        <AlertDescription data-id="zo9edg9on" data-path="src/components/MemoryLeakPreventionGuide.tsx">{pattern.explanation}</AlertDescription>
                      </Alert>
                    </CardContent>
                }
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4" data-id="sqtqi9ll4" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          <div className="grid gap-4" data-id="b3dd9s84s" data-path="src/components/MemoryLeakPreventionGuide.tsx">
            {bestPractices.map((practice, index) =>
            <Card key={index} data-id="2doaciajn" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <CardHeader data-id="vaf47xo51" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <CardTitle className="flex items-center gap-2" data-id="8sb3y0i5x" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                    {practice.icon}
                    {practice.title}
                  </CardTitle>
                  <CardDescription data-id="otgv2k3v6" data-path="src/components/MemoryLeakPreventionGuide.tsx">{practice.description}</CardDescription>
                </CardHeader>
                <CardContent data-id="7m4q1rsrc" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <ul className="space-y-2" data-id="jxj7ncngi" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                    {practice.tips.map((tip, tipIndex) =>
                  <li key={tipIndex} className="flex items-start gap-2" data-id="z8j0alaqq" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" data-id="u0ah7vpni" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                        <span className="text-sm" data-id="tc26h1bkq" data-path="src/components/MemoryLeakPreventionGuide.tsx">{tip}</span>
                      </li>
                  )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-4" data-id="w3kqbbgzs" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          <Card data-id="l0y3ks5x9" data-path="src/components/MemoryLeakPreventionGuide.tsx">
            <CardHeader data-id="daru9uknp" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="444t3jmtx" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <BookOpen className="h-5 w-5" data-id="mmkfnjs2h" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                Memory Leak Prevention Checklist
              </CardTitle>
              <CardDescription data-id="1kez7gyj1" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                Use this checklist when reviewing components for potential memory leaks
              </CardDescription>
            </CardHeader>
            <CardContent data-id="h1c1oyoa2" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              <div className="grid gap-3" data-id="9t1yww3k3" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                {checklistItems.map((item, index) =>
                <div key={index} className="flex items-start gap-2 p-2 rounded hover:bg-muted/50" data-id="9bd6ih1bg" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" data-id="c320fl8kf" data-path="src/components/MemoryLeakPreventionGuide.tsx" />
                    <span className="text-sm" data-id="ohcnbl01x" data-path="src/components/MemoryLeakPreventionGuide.tsx">{item.replace('✅ ', '')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4" data-id="9iso0oowi" data-path="src/components/MemoryLeakPreventionGuide.tsx">
          <div className="grid gap-4" data-id="zio42xk0i" data-path="src/components/MemoryLeakPreventionGuide.tsx">
            <Card data-id="n7apllg0k" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              <CardHeader data-id="e8l1b1pt9" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <CardTitle data-id="pzqop0055" data-path="src/components/MemoryLeakPreventionGuide.tsx">useMemoryLeakDetector Hook</CardTitle>
                <CardDescription data-id="tpn2qi65d" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  Automatically track and clean up component resources
                </CardDescription>
              </CardHeader>
              <CardContent data-id="fpnm1dx0b" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm" data-id="6owqnqiep" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <code data-id="elfdgnsu6" data-path="src/components/MemoryLeakPreventionGuide.tsx">{`import useMemoryLeakDetector from '@/hooks/use-memory-leak-detector';

function MyComponent() {
  const memoryTools = useMemoryLeakDetector('MyComponent');
  
  useEffect(() => {
    // Safe timer that auto-cleans
    const timer = memoryTools.safeSetTimeout(() => {
      console.log('Timer executed');
    }, 1000);
    
    // Safe event listener that auto-removes
    memoryTools.safeAddEventListener(window, 'scroll', handleScroll);
    
    return memoryTools.cleanup.all;
  }, []);
  
  return <div>Component content</div>;
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card data-id="yo9xsfdmm" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              <CardHeader data-id="kkivnbtc8" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <CardTitle data-id="vdblb4485" data-path="src/components/MemoryLeakPreventionGuide.tsx">useSafeAsync Hook</CardTitle>
                <CardDescription data-id="s4n4ifw9d" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  Handle async operations with automatic cancellation
                </CardDescription>
              </CardHeader>
              <CardContent data-id="7p18di5u5" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm" data-id="jayzcqazq" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <code data-id="okylzip64" data-path="src/components/MemoryLeakPreventionGuide.tsx">{`import useSafeAsync from '@/hooks/use-safe-async';

function MyComponent() {
  const { safeApiCall } = useSafeAsync('MyComponent');
  const [data, setData] = useState(null);
  
  useEffect(() => {
    safeApiCall(
      () => DatabaseService.tablePage(tableId, params),
      {
        onSuccess: (result) => setData(result.data),
        onError: (error) => console.error(error)
      }
    );
  }, []);
  
  return <div>{data ? 'Loaded' : 'Loading...'}</div>;
}`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card data-id="hfs5inrk7" data-path="src/components/MemoryLeakPreventionGuide.tsx">
              <CardHeader data-id="3av5awtk9" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <CardTitle data-id="eydz6f235" data-path="src/components/MemoryLeakPreventionGuide.tsx">Memory Leak Dashboard</CardTitle>
                <CardDescription data-id="ecozacgg7" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  Real-time monitoring of memory usage and leak detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2" data-id="yolpwxsqz" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                <div className="flex gap-2" data-id="6i8cj692o" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  <Badge data-id="xgv180fon" data-path="src/components/MemoryLeakPreventionGuide.tsx">Real-time monitoring</Badge>
                  <Badge data-id="7acdv35cv" data-path="src/components/MemoryLeakPreventionGuide.tsx">Component tracking</Badge>
                  <Badge data-id="qu881evsh" data-path="src/components/MemoryLeakPreventionGuide.tsx">Leak detection</Badge>
                  <Badge data-id="khpbjli1s" data-path="src/components/MemoryLeakPreventionGuide.tsx">Memory reports</Badge>
                </div>
                <p className="text-sm text-muted-foreground" data-id="gk2rkn4z8" data-path="src/components/MemoryLeakPreventionGuide.tsx">
                  Access the dashboard at /admin/memory-monitoring to view detailed 
                  memory usage statistics and potential leak reports.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export default MemoryLeakPreventionGuide;
