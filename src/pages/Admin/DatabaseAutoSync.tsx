import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, Monitor, Settings } from 'lucide-react';
import DatabaseSyncForm from '@/components/DatabaseSyncForm';
import SyncMonitoringDashboard from '@/components/SyncMonitoringDashboard';
import { useAdminAccess } from '@/hooks/use-admin-access';
import AccessDenied from '@/components/AccessDenied';

const DatabaseAutoSyncPage: React.FC = () => {
  const { hasAdminAccess } = useAdminAccess();

  if (!hasAdminAccess) {
    return <AccessDenied data-id="naagq82g3" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-id="yny82pxfp" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
      <div className="text-center mb-8" data-id="inlk9hxb2" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-id="k1kx5iava" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          Database Auto-Sync
        </h1>
        <p className="text-muted-foreground text-lg" data-id="6xwiqjj39" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          Automatically synchronize your application forms and tables with the database
        </p>
        <div className="flex justify-center gap-2 mt-4" data-id="hpovol0by" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <Badge variant="outline" className="bg-blue-50" data-id="ud4okwfpo" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Database className="h-3 w-3 mr-1" data-id="6x9bvc1kq" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            Auto Structure Detection
          </Badge>
          <Badge variant="outline" className="bg-green-50" data-id="yeip6ypon" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Monitor className="h-3 w-3 mr-1" data-id="vwwj7rwct" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            Real-time Monitoring
          </Badge>
          <Badge variant="outline" className="bg-purple-50" data-id="njxxstbj3" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Settings className="h-3 w-3 mr-1" data-id="tbkeguwx7" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            Smart Configuration
          </Badge>
        </div>
      </div>

      <Card className="mb-6" data-id="0r2x9wd5x" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
        <CardHeader data-id="r2h58ijtw" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <CardTitle className="flex items-center gap-2" data-id="s4hv732o0" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Database className="h-5 w-5" data-id="l5hae33l0" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            How Auto-Sync Works
          </CardTitle>
          <CardDescription data-id="jgsc4rh7k" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            Understanding the automated database synchronization process
          </CardDescription>
        </CardHeader>
        <CardContent data-id="z4irkdrx1" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <div className="grid gap-4 md:grid-cols-3" data-id="tdr7a1m4e" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <div className="text-center p-4 border rounded-lg" data-id="zsy79hb09" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3" data-id="y6ychrhk7" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <Database className="h-6 w-6 text-blue-600" data-id="d49j6p7o4" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
              </div>
              <h3 className="font-semibold mb-2" data-id="rmd2yzs1g" data-path="src/pages/Admin/DatabaseAutoSync.tsx">1. Structure Detection</h3>
              <p className="text-sm text-muted-foreground" data-id="vxr7ixz62" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                Automatically scans your application for forms, tables, and data structures
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg" data-id="6pugx50ek" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3" data-id="omul7m35p" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <Monitor className="h-6 w-6 text-green-600" data-id="5kdktsxaw" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
              </div>
              <h3 className="font-semibold mb-2" data-id="ds10ua0vx" data-path="src/pages/Admin/DatabaseAutoSync.tsx">2. Real-time Monitoring</h3>
              <p className="text-sm text-muted-foreground" data-id="vhj0mozqz" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                Continuously monitors for changes and updates to your application structure
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg" data-id="qnn0xo503" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3" data-id="qttfc28zp" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <Settings className="h-6 w-6 text-purple-600" data-id="59g8cssj9" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
              </div>
              <h3 className="font-semibold mb-2" data-id="eg4mhflw5" data-path="src/pages/Admin/DatabaseAutoSync.tsx">3. Auto Synchronization</h3>
              <p className="text-sm text-muted-foreground" data-id="k62bvaoj0" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                Automatically creates, updates, or removes database tables as needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="setup" className="w-full" data-id="thfikg2ev" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
        <TabsList className="grid w-full grid-cols-2" data-id="a27waarm7" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <TabsTrigger value="setup" className="flex items-center gap-2" data-id="rl6uu72me" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Database className="h-4 w-4" data-id="mnd2nzw5r" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            Setup & Configuration
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2" data-id="ka9o5v6uc" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <Monitor className="h-4 w-4" data-id="9ijfxshey" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
            Monitoring & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" data-id="d5iu9ut5q" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <DatabaseSyncForm data-id="7tmiaig9t" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
        </TabsContent>

        <TabsContent value="monitoring" data-id="g3s4i2lbd" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <SyncMonitoringDashboard data-id="m00xanwz6" data-path="src/pages/Admin/DatabaseAutoSync.tsx" />
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" data-id="wqocpjqiv" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
        <CardHeader data-id="vz2thdfrs" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <CardTitle className="text-blue-800" data-id="0qzj24nzr" data-path="src/pages/Admin/DatabaseAutoSync.tsx">Key Benefits</CardTitle>
        </CardHeader>
        <CardContent data-id="ymj1hz7ho" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
          <div className="grid gap-3 md:grid-cols-2" data-id="0dfq12lcn" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
            <div className="flex items-start gap-3" data-id="togvn4a0u" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-2 w-2 bg-blue-600 rounded-full mt-2" data-id="imxqsly3r" data-path="src/pages/Admin/DatabaseAutoSync.tsx"></div>
              <div data-id="lu8k852yj" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <h4 className="font-semibold text-blue-800" data-id="q42kgiwie" data-path="src/pages/Admin/DatabaseAutoSync.tsx">Zero Manual Configuration</h4>
                <p className="text-sm text-blue-600" data-id="31errrsch" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                  No need to manually create database tables or update schemas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-id="ah0092dq8" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-2 w-2 bg-green-600 rounded-full mt-2" data-id="4bclj3g4r" data-path="src/pages/Admin/DatabaseAutoSync.tsx"></div>
              <div data-id="3j6qrv81r" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <h4 className="font-semibold text-green-800" data-id="8cg07rxxs" data-path="src/pages/Admin/DatabaseAutoSync.tsx">Real-time Updates</h4>
                <p className="text-sm text-green-600" data-id="iv3jdvuiq" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                  Database structure stays in sync with your application changes
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-id="2byuoa2xb" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-2 w-2 bg-purple-600 rounded-full mt-2" data-id="ps0fj0b8i" data-path="src/pages/Admin/DatabaseAutoSync.tsx"></div>
              <div data-id="xwo05ftfj" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <h4 className="font-semibold text-purple-800" data-id="pvqyyo12d" data-path="src/pages/Admin/DatabaseAutoSync.tsx">Data Integrity</h4>
                <p className="text-sm text-purple-600" data-id="tg8han2bw" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                  Backup and rollback capabilities ensure data safety
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-id="1ayvbwaxq" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
              <div className="h-2 w-2 bg-orange-600 rounded-full mt-2" data-id="c31s8gmwp" data-path="src/pages/Admin/DatabaseAutoSync.tsx"></div>
              <div data-id="9w7swvijr" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                <h4 className="font-semibold text-orange-800" data-id="8ukkp7uem" data-path="src/pages/Admin/DatabaseAutoSync.tsx">Performance Monitoring</h4>
                <p className="text-sm text-orange-600" data-id="2oa50s7q5" data-path="src/pages/Admin/DatabaseAutoSync.tsx">
                  Built-in analytics and performance tracking
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default DatabaseAutoSyncPage;