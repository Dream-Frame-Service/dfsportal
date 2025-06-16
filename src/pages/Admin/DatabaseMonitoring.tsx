import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, AlertTriangle, TrendingUp, Settings, Shield } from 'lucide-react';
import DatabaseConnectionMonitor from '@/components/DatabaseConnectionMonitor';
import AccessDenied from '@/components/AccessDenied';
import useAdminAccess from '@/hooks/use-admin-access';

const DatabaseMonitoringPage = () => {
  const { hasMonitoringAccess } = useAdminAccess();

  // Check admin access first
  if (!hasMonitoringAccess) {
    return (
      <AccessDenied
        feature="Database Monitoring System"
        requiredRole="Administrator" data-id="2h47n0ljp" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />);


  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-id="yjrgpwqdo" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
      <div className="flex items-center justify-between" data-id="xsmdsbao4" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
        <div data-id="l1kxaguxn" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <h1 className="text-3xl font-bold tracking-tight" data-id="tuwdqzvd0" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Database Monitoring</h1>
          <p className="text-muted-foreground" data-id="y3a8ao780" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
            Monitor and manage database performance and connections
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1" data-id="326mhznu9" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <Database className="h-4 w-4 mr-2" data-id="w11v1vaoc" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
          Live Monitoring
        </Badge>
      </div>

      {/* Critical Alert */}
      <Alert variant="destructive" data-id="whmjotbh4" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
        <AlertTriangle className="h-4 w-4" data-id="w7s2nqspi" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
        <AlertTitle data-id="wzot9dxhf" data-path="src/pages/Admin/DatabaseMonitoring.tsx">High Database Connection Count Detected</AlertTitle>
        <AlertDescription data-id="an9wap2yc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          Current connections: 85/100 (85% capacity). Monitor closely and take action to prevent service disruption.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="connections" className="space-y-4" data-id="h3qu0s4lm" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
        <TabsList data-id="4wbaqhx6v" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <TabsTrigger value="connections" data-id="fcqrsxgi0" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Connection Monitor</TabsTrigger>
          <TabsTrigger value="performance" data-id="uz78mwxo0" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Performance</TabsTrigger>
          <TabsTrigger value="optimization" data-id="vdcmw2csv" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Optimization</TabsTrigger>
          <TabsTrigger value="alerts" data-id="4iavo3h8s" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4" data-id="lqtg5a8wo" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <DatabaseConnectionMonitor data-id="cknsg0wkj" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4" data-id="2qstdra87" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="ytmr7ty88" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
            <Card data-id="2fn5i2u3x" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardHeader data-id="2pxpqy5ke" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <CardTitle className="flex items-center space-x-2" data-id="rkwuq1ic5" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <TrendingUp className="h-5 w-5" data-id="5i8ccjy8z" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                  <span data-id="ye8cks2ua" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Query Performance</span>
                </CardTitle>
                <CardDescription data-id="87cybgv68" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  Monitor slow queries and database performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="d0dsk9xo5" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="space-y-2" data-id="th21pxblq" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div className="flex justify-between text-sm" data-id="0oaptod33" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="ysg4rke42" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Average Query Time</span>
                    <Badge variant="secondary" data-id="0nmrc4jmo" data-path="src/pages/Admin/DatabaseMonitoring.tsx">145ms</Badge>
                  </div>
                  <div className="flex justify-between text-sm" data-id="t3502wahi" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="xfujqaw7f" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Slow Queries (&gt;1s)</span>
                    <Badge variant="destructive" data-id="f2bse3vr9" data-path="src/pages/Admin/DatabaseMonitoring.tsx">12</Badge>
                  </div>
                  <div className="flex justify-between text-sm" data-id="251aww5lz" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="yohenp6f1" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Active Transactions</span>
                    <Badge variant="default" data-id="b4gtptkcp" data-path="src/pages/Admin/DatabaseMonitoring.tsx">8</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-id="r86wv9doy" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  View Detailed Performance Report
                </Button>
              </CardContent>
            </Card>

            <Card data-id="xzwl46ue8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardHeader data-id="kv1fcdxcy" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <CardTitle data-id="fnx2i5pso" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Connection Pool Status</CardTitle>
                <CardDescription data-id="dc12swps8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  Current status of database connection pools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="fsbwzw9dc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="space-y-2" data-id="ck3bbuzgx" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div className="flex justify-between text-sm" data-id="s5wuu9w83" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="9z0gcih13" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Active Connections</span>
                    <Badge variant="destructive" data-id="bo84lf5bv" data-path="src/pages/Admin/DatabaseMonitoring.tsx">85</Badge>
                  </div>
                  <div className="flex justify-between text-sm" data-id="s9df6t3tg" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="2h6ev1lpz" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Idle Connections</span>
                    <Badge variant="secondary" data-id="qfahemly8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">3</Badge>
                  </div>
                  <div className="flex justify-between text-sm" data-id="uxw5p9rt0" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <span data-id="ofe2l6zb4" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Waiting for Connection</span>
                    <Badge variant="outline" data-id="zwq84nyj1" data-path="src/pages/Admin/DatabaseMonitoring.tsx">0</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-id="w3xiee1in" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  Manage Connection Pool
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Connection Spikes */}
          <Card data-id="rzp9razdf" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
            <CardHeader data-id="41l422lmw" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardTitle data-id="lxzvezk5e" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Recent Connection Activity</CardTitle>
              <CardDescription data-id="f1isjh9so" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                Identify patterns and potential connection leaks
              </CardDescription>
            </CardHeader>
            <CardContent data-id="i1tby17qc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <div className="space-y-3" data-id="qjqgoxnke" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="flex items-center justify-between p-3 border rounded-lg" data-id="k0mkwfo0y" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div data-id="aqrdu6dc2" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium" data-id="fr8avjpv8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">High connection usage detected</div>
                    <div className="text-sm text-muted-foreground" data-id="ygx7g5s36" data-path="src/pages/Admin/DatabaseMonitoring.tsx">2 minutes ago - 85/100 connections</div>
                  </div>
                  <Badge variant="destructive" data-id="4bw16uo11" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Critical</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg" data-id="oswfneucp" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div data-id="p8kv4bbyn" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium" data-id="wji5edl4e" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Connection spike in sales reports</div>
                    <div className="text-sm text-muted-foreground" data-id="x9l4396ba" data-path="src/pages/Admin/DatabaseMonitoring.tsx">15 minutes ago - 78/100 connections</div>
                  </div>
                  <Badge variant="secondary" data-id="b3ltki6q4" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Warning</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg" data-id="kaim21fxq" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div data-id="n1jvh7ata" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium" data-id="weqq873e9" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Normal connection usage</div>
                    <div className="text-sm text-muted-foreground" data-id="m00cvg6ua" data-path="src/pages/Admin/DatabaseMonitoring.tsx">1 hour ago - 45/100 connections</div>
                  </div>
                  <Badge variant="default" data-id="9cnsy923r" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4" data-id="a8frh1kst" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="ua95mmi4g" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
            <Card data-id="98g9j02to" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardHeader data-id="bfs4guwc0" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <CardTitle data-id="jgu2juwed" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Connection Management</CardTitle>
                <CardDescription data-id="9z999cioc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  Optimize database connection usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="65bc2zdjw" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="space-y-3" data-id="ox8aogmg7" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <Button variant="outline" className="w-full justify-start" data-id="aoyj2n1kc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <Database className="h-4 w-4 mr-2" data-id="vwobod1k3" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    Close Idle Connections
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-id="nbcyq3w38" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <TrendingUp className="h-4 w-4 mr-2" data-id="w1d316rcx" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    Kill Long-Running Queries
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-id="vehil0z95" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <Settings className="h-4 w-4 mr-2" data-id="x5lsw8jvz" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    Adjust Pool Size
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" data-id="hqijslbn7" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <AlertTriangle className="h-4 w-4 mr-2" data-id="gv1338f47" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    Emergency Connection Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card data-id="4mnv8xn2c" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardHeader data-id="lgqlhvf50" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <CardTitle data-id="zeadil80i" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Recommendations</CardTitle>
                <CardDescription data-id="jupvpli7j" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  Immediate actions to reduce connection usage
                </CardDescription>
              </CardHeader>
              <CardContent data-id="jh9cg4o0v" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="space-y-3" data-id="hk9vichwe" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <div className="p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-950" data-id="7lx95hlf8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium text-red-800 dark:text-red-200" data-id="h85f4nxpc" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Critical: Review connection leaks
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-300" data-id="i583zy0g3" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Check for unclosed connections in sales report generation
                    </div>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950" data-id="elxsp9tp5" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200" data-id="jc47mcu7t" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Implement connection pooling
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-300" data-id="vt0wxbsin" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Configure maximum pool size and connection timeout
                    </div>
                  </div>
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950" data-id="kidcoymr7" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <div className="font-medium text-blue-800 dark:text-blue-200" data-id="x2kom6dt1" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Optimize query performance
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-300" data-id="9qhldaf0c" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                      Review slow queries that may be holding connections
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4" data-id="splyc0bfh" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
          <Card data-id="jcrbvfnpy" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
            <CardHeader data-id="8nj32dtgk" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="6gyog6lhd" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <Shield className="h-5 w-5" data-id="behmeo84f" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                <span data-id="77pbo80ec" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Alert Configuration</span>
              </CardTitle>
              <CardDescription data-id="3acs3efap" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                Configure alerts for database connection monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="zy8z0g1lq" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="kzsj9f3ji" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <div className="space-y-2" data-id="1h3jagmw8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <label className="text-sm font-medium" data-id="qfsjhn5sz" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Warning Threshold</label>
                  <div className="flex items-center space-x-2" data-id="qd3pjh6ml" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border rounded-md"
                      defaultValue="70" data-id="dwtmqvqxo" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />

                    <span className="text-sm text-muted-foreground" data-id="zuqeqdl89" data-path="src/pages/Admin/DatabaseMonitoring.tsx">%</span>
                  </div>
                </div>
                <div className="space-y-2" data-id="o5qp63wf8" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <label className="text-sm font-medium" data-id="j82edwzqt" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Critical Threshold</label>
                  <div className="flex items-center space-x-2" data-id="00jqtuv9d" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border rounded-md"
                      defaultValue="85" data-id="a84hg4w40" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />

                    <span className="text-sm text-muted-foreground" data-id="bwqbb5z2m" data-path="src/pages/Admin/DatabaseMonitoring.tsx">%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2" data-id="or76mjfza" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                <label className="text-sm font-medium" data-id="m6h8gbuxf" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Alert Methods</label>
                <div className="space-y-2" data-id="uotyrapa7" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                  <label className="flex items-center space-x-2" data-id="gunx0l3gi" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <input type="checkbox" defaultChecked data-id="5f0s6ecvf" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    <span className="text-sm" data-id="a5o7c06sl" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Browser notifications</span>
                  </label>
                  <label className="flex items-center space-x-2" data-id="80tf1gtm2" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <input type="checkbox" defaultChecked data-id="wtk0msedq" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    <span className="text-sm" data-id="51zc74nl6" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Email alerts</span>
                  </label>
                  <label className="flex items-center space-x-2" data-id="yxctcp00q" data-path="src/pages/Admin/DatabaseMonitoring.tsx">
                    <input type="checkbox" data-id="vm7be213o" data-path="src/pages/Admin/DatabaseMonitoring.tsx" />
                    <span className="text-sm" data-id="vne2oaxwu" data-path="src/pages/Admin/DatabaseMonitoring.tsx">SMS alerts</span>
                  </label>
                </div>
              </div>
              
              <Button className="w-full" data-id="4m745tikj" data-path="src/pages/Admin/DatabaseMonitoring.tsx">Save Alert Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default DatabaseMonitoringPage;
