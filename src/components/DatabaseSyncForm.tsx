import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Database,
  Key,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  RotateCcw,
  Monitor,
  Trash2,
  Plus,
  RefreshCw } from
'lucide-react';

interface SyncConfig {
  projectUrl: string;
  apiKey: string;
  jwtSecret: string;
  databaseType: string;
  autoSync: boolean;
  syncInterval: number;
  backupEnabled: boolean;
  encryptionEnabled: boolean;
}

interface SyncStatus {
  isConnected: boolean;
  lastSync: string;
  tablesCount: number;
  recordsCount: number;
  status: 'idle' | 'syncing' | 'error' | 'success';
  errors: string[];
}

const DatabaseSyncForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncConfig, setSyncConfig] = useState<SyncConfig>({
    projectUrl: '',
    apiKey: '',
    jwtSecret: '',
    databaseType: 'postgresql',
    autoSync: true,
    syncInterval: 300, // 5 minutes
    backupEnabled: true,
    encryptionEnabled: true
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: '',
    tablesCount: 0,
    recordsCount: 0,
    status: 'idle',
    errors: []
  });

  const [detectedStructures, setDetectedStructures] = useState<any[]>([]);

  const handleInputChange = (field: keyof SyncConfig, value: any) => {
    setSyncConfig((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful connection
      setSyncStatus((prev) => ({
        ...prev,
        isConnected: true,
        status: 'success'
      }));

      toast({
        title: "Connection Successful",
        description: "Successfully connected to your project database."
      });
    } catch (error) {
      setSyncStatus((prev) => ({
        ...prev,
        isConnected: false,
        status: 'error',
        errors: ['Failed to connect to database']
      }));

      toast({
        title: "Connection Failed",
        description: "Unable to connect to the database. Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const scanForStructures = async () => {
    setIsLoading(true);
    try {
      // Simulate scanning for form structures
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockStructures = [
      {
        name: 'user_registration_form',
        type: 'form',
        fields: ['email', 'password', 'firstName', 'lastName', 'phone'],
        detected: new Date().toISOString(),
        status: 'new'
      },
      {
        name: 'product_inventory',
        type: 'table',
        fields: ['productName', 'sku', 'price', 'quantity', 'category'],
        detected: new Date().toISOString(),
        status: 'existing'
      },
      {
        name: 'order_management',
        type: 'form',
        fields: ['orderNumber', 'customerEmail', 'items', 'totalAmount'],
        detected: new Date().toISOString(),
        status: 'new'
      }];


      setDetectedStructures(mockStructures);

      toast({
        title: "Scan Complete",
        description: `Found ${mockStructures.length} form/table structures.`
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to scan for structures. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoSync = async () => {
    setIsLoading(true);
    try {
      // Simulate starting auto-sync
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create tables for detected structures
      for (const structure of detectedStructures) {
        if (structure.status === 'new') {
          console.log(`Creating table for: ${structure.name}`);
          // Here you would call the actual table creation API
        }
      }

      setSyncStatus((prev) => ({
        ...prev,
        status: 'success',
        lastSync: new Date().toISOString(),
        tablesCount: detectedStructures.length,
        recordsCount: 0
      }));

      toast({
        title: "Auto-Sync Started",
        description: "Database synchronization is now active and monitoring for changes."
      });

      // Start monitoring interval
      if (syncConfig.autoSync) {
        setInterval(() => {
          console.log('Auto-sync check...');
          // Check for new structures and sync
        }, syncConfig.syncInterval * 1000);
      }

    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to start auto-sync. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopAutoSync = () => {
    setSyncStatus((prev) => ({
      ...prev,
      status: 'idle'
    }));

    toast({
      title: "Auto-Sync Stopped",
      description: "Database synchronization has been paused."
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" data-id="ietmo6l95" data-path="src/components/DatabaseSyncForm.tsx">
      <div className="text-center mb-8" data-id="hrwob7tco" data-path="src/components/DatabaseSyncForm.tsx">
        <h1 className="text-3xl font-bold mb-2" data-id="ga9sa5lqj" data-path="src/components/DatabaseSyncForm.tsx">Auto Database Sync</h1>
        <p className="text-muted-foreground" data-id="7c2lg2ti5" data-path="src/components/DatabaseSyncForm.tsx">
          Automatically synchronize your application forms and tables with your database
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full" data-id="8z4qmhic0" data-path="src/components/DatabaseSyncForm.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="s1p0gjcfb" data-path="src/components/DatabaseSyncForm.tsx">
          <TabsTrigger value="setup" data-id="2cg27vbw7" data-path="src/components/DatabaseSyncForm.tsx">Setup</TabsTrigger>
          <TabsTrigger value="structures" data-id="a1cgpb875" data-path="src/components/DatabaseSyncForm.tsx">Structures</TabsTrigger>
          <TabsTrigger value="monitor" data-id="bjzg2783z" data-path="src/components/DatabaseSyncForm.tsx">Monitor</TabsTrigger>
          <TabsTrigger value="settings" data-id="wj6hxq97c" data-path="src/components/DatabaseSyncForm.tsx">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" data-id="g30r4kim9" data-path="src/components/DatabaseSyncForm.tsx">
          <div className="grid gap-6 md:grid-cols-2" data-id="zqqt5kwnq" data-path="src/components/DatabaseSyncForm.tsx">
            <Card data-id="cmhmwofl8" data-path="src/components/DatabaseSyncForm.tsx">
              <CardHeader data-id="n25r9rwuw" data-path="src/components/DatabaseSyncForm.tsx">
                <CardTitle className="flex items-center gap-2" data-id="1z5kll9yr" data-path="src/components/DatabaseSyncForm.tsx">
                  <Key className="h-5 w-5" data-id="mvt1zsgkc" data-path="src/components/DatabaseSyncForm.tsx" />
                  Database Credentials
                </CardTitle>
                <CardDescription data-id="zkd5t55dg" data-path="src/components/DatabaseSyncForm.tsx">
                  Enter your project database credentials to enable auto-sync
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="wc2ehutdp" data-path="src/components/DatabaseSyncForm.tsx">
                <div className="space-y-2" data-id="idyj4jphy" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="projectUrl" data-id="zr6c0rv22" data-path="src/components/DatabaseSyncForm.tsx">Project URL</Label>
                  <Input
                    id="projectUrl"
                    placeholder="https://your-project.com"
                    value={syncConfig.projectUrl}
                    onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                    className="w-full" data-id="rll5hzdnv" data-path="src/components/DatabaseSyncForm.tsx" />

                </div>

                <div className="space-y-2" data-id="8ojc1t9y2" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="apiKey" data-id="b5vhrvrsk" data-path="src/components/DatabaseSyncForm.tsx">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your API key"
                    value={syncConfig.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className="w-full" data-id="6j61f995l" data-path="src/components/DatabaseSyncForm.tsx" />

                </div>

                <div className="space-y-2" data-id="8ya3cz1sg" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="jwtSecret" data-id="pyyd6jzvi" data-path="src/components/DatabaseSyncForm.tsx">JWT Secret</Label>
                  <Input
                    id="jwtSecret"
                    type="password"
                    placeholder="Your JWT secret"
                    value={syncConfig.jwtSecret}
                    onChange={(e) => handleInputChange('jwtSecret', e.target.value)}
                    className="w-full" data-id="u26lx8dok" data-path="src/components/DatabaseSyncForm.tsx" />

                </div>

                <div className="space-y-2" data-id="vwb511c5j" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="databaseType" data-id="nvshazh2h" data-path="src/components/DatabaseSyncForm.tsx">Database Type</Label>
                  <Select
                    value={syncConfig.databaseType}
                    onValueChange={(value) => handleInputChange('databaseType', value)} data-id="0u4rb1jub" data-path="src/components/DatabaseSyncForm.tsx">

                    <SelectTrigger data-id="o75vlr3xf" data-path="src/components/DatabaseSyncForm.tsx">
                      <SelectValue data-id="3h6miumyz" data-path="src/components/DatabaseSyncForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="mmpqphi11" data-path="src/components/DatabaseSyncForm.tsx">
                      <SelectItem value="postgresql" data-id="whogtto2i" data-path="src/components/DatabaseSyncForm.tsx">PostgreSQL</SelectItem>
                      <SelectItem value="mysql" data-id="oasxpj7u3" data-path="src/components/DatabaseSyncForm.tsx">MySQL</SelectItem>
                      <SelectItem value="mongodb" data-id="1xmw8rpa0" data-path="src/components/DatabaseSyncForm.tsx">MongoDB</SelectItem>
                      <SelectItem value="sqlite" data-id="fml4ws752" data-path="src/components/DatabaseSyncForm.tsx">SQLite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2" data-id="lm5e8n76d" data-path="src/components/DatabaseSyncForm.tsx">
                  <Button
                    onClick={testConnection}
                    disabled={isTesting || !syncConfig.projectUrl || !syncConfig.apiKey}
                    className="flex-1" data-id="4ueyiipzj" data-path="src/components/DatabaseSyncForm.tsx">

                    {isTesting ?
                    <Loader2 className="h-4 w-4 animate-spin mr-2" data-id="cv8rieoc2" data-path="src/components/DatabaseSyncForm.tsx" /> :

                    <Globe className="h-4 w-4 mr-2" data-id="g27w7ijyy" data-path="src/components/DatabaseSyncForm.tsx" />
                    }
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card data-id="n6a277wcm" data-path="src/components/DatabaseSyncForm.tsx">
              <CardHeader data-id="r2ht9ijok" data-path="src/components/DatabaseSyncForm.tsx">
                <CardTitle className="flex items-center gap-2" data-id="ud0nmw42e" data-path="src/components/DatabaseSyncForm.tsx">
                  <Monitor className="h-5 w-5" data-id="1yfze28wo" data-path="src/components/DatabaseSyncForm.tsx" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="2xbepf9yp" data-path="src/components/DatabaseSyncForm.tsx">
                <div className="flex items-center gap-2" data-id="ny3xicik7" data-path="src/components/DatabaseSyncForm.tsx">
                  {syncStatus.isConnected ?
                  <CheckCircle className="h-5 w-5 text-green-500" data-id="8px9z0fne" data-path="src/components/DatabaseSyncForm.tsx" /> :

                  <AlertCircle className="h-5 w-5 text-red-500" data-id="qu28jxom9" data-path="src/components/DatabaseSyncForm.tsx" />
                  }
                  <span className={syncStatus.isConnected ? 'text-green-600' : 'text-red-600'} data-id="vitpvrnqj" data-path="src/components/DatabaseSyncForm.tsx">
                    {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {syncStatus.isConnected &&
                <div className="space-y-2" data-id="in8kc69hp" data-path="src/components/DatabaseSyncForm.tsx">
                    <div className="flex justify-between" data-id="5vhqel7ns" data-path="src/components/DatabaseSyncForm.tsx">
                      <span data-id="wq9b7eyai" data-path="src/components/DatabaseSyncForm.tsx">Tables:</span>
                      <Badge variant="secondary" data-id="7de29t84g" data-path="src/components/DatabaseSyncForm.tsx">{syncStatus.tablesCount}</Badge>
                    </div>
                    <div className="flex justify-between" data-id="ldl8l2ik5" data-path="src/components/DatabaseSyncForm.tsx">
                      <span data-id="vic4jvjwi" data-path="src/components/DatabaseSyncForm.tsx">Records:</span>
                      <Badge variant="secondary" data-id="er3ty2ubk" data-path="src/components/DatabaseSyncForm.tsx">{syncStatus.recordsCount}</Badge>
                    </div>
                    <div className="flex justify-between" data-id="opadj105n" data-path="src/components/DatabaseSyncForm.tsx">
                      <span data-id="xr5anp223" data-path="src/components/DatabaseSyncForm.tsx">Last Sync:</span>
                      <span className="text-sm text-muted-foreground" data-id="c4vjsvut4" data-path="src/components/DatabaseSyncForm.tsx">
                        {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                }

                {syncStatus.errors.length > 0 &&
                <Alert data-id="8wdbm3722" data-path="src/components/DatabaseSyncForm.tsx">
                    <AlertCircle className="h-4 w-4" data-id="j1e6ugvmp" data-path="src/components/DatabaseSyncForm.tsx" />
                    <AlertDescription data-id="i3a1u5dgl" data-path="src/components/DatabaseSyncForm.tsx">
                      {syncStatus.errors.join(', ')}
                    </AlertDescription>
                  </Alert>
                }

                <div className="flex gap-2" data-id="psjzmt6ua" data-path="src/components/DatabaseSyncForm.tsx">
                  <Button
                    onClick={scanForStructures}
                    disabled={!syncStatus.isConnected || isLoading}
                    variant="outline"
                    className="flex-1" data-id="mmvmndi8p" data-path="src/components/DatabaseSyncForm.tsx">

                    {isLoading ?
                    <Loader2 className="h-4 w-4 animate-spin mr-2" data-id="pbto60ilb" data-path="src/components/DatabaseSyncForm.tsx" /> :

                    <Database className="h-4 w-4 mr-2" data-id="4lkx2ptdq" data-path="src/components/DatabaseSyncForm.tsx" />
                    }
                    Scan Structures
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structures" data-id="ejj5nhad9" data-path="src/components/DatabaseSyncForm.tsx">
          <Card data-id="p1n45bmg8" data-path="src/components/DatabaseSyncForm.tsx">
            <CardHeader data-id="fpfeujc19" data-path="src/components/DatabaseSyncForm.tsx">
              <CardTitle className="flex items-center gap-2" data-id="xclrsnm47" data-path="src/components/DatabaseSyncForm.tsx">
                <Database className="h-5 w-5" data-id="6qm9s0ekf" data-path="src/components/DatabaseSyncForm.tsx" />
                Detected Structures
              </CardTitle>
              <CardDescription data-id="bw9dbfpjp" data-path="src/components/DatabaseSyncForm.tsx">
                Forms and tables found in your application
              </CardDescription>
            </CardHeader>
            <CardContent data-id="0g5iwm47q" data-path="src/components/DatabaseSyncForm.tsx">
              {detectedStructures.length === 0 ?
              <div className="text-center py-8" data-id="w419r09rg" data-path="src/components/DatabaseSyncForm.tsx">
                  <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" data-id="v9kdpsuvr" data-path="src/components/DatabaseSyncForm.tsx" />
                  <p className="text-muted-foreground" data-id="bdlj05vwi" data-path="src/components/DatabaseSyncForm.tsx">
                    No structures detected. Click "Scan Structures" to find forms and tables.
                  </p>
                </div> :

              <div className="space-y-4" data-id="qijn4iu9w" data-path="src/components/DatabaseSyncForm.tsx">
                  {detectedStructures.map((structure, index) =>
                <Card key={index} className="border-l-4 border-l-blue-500" data-id="f54k4slil" data-path="src/components/DatabaseSyncForm.tsx">
                      <CardContent className="pt-4" data-id="1rodnextc" data-path="src/components/DatabaseSyncForm.tsx">
                        <div className="flex items-center justify-between mb-2" data-id="77m7yetfd" data-path="src/components/DatabaseSyncForm.tsx">
                          <h4 className="font-semibold flex items-center gap-2" data-id="abu27q2ii" data-path="src/components/DatabaseSyncForm.tsx">
                            {structure.type === 'form' ?
                        <Plus className="h-4 w-4" data-id="x561783au" data-path="src/components/DatabaseSyncForm.tsx" /> :

                        <Database className="h-4 w-4" data-id="5fmz9ukp6" data-path="src/components/DatabaseSyncForm.tsx" />
                        }
                            {structure.name}
                          </h4>
                          <Badge variant={structure.status === 'new' ? 'default' : 'secondary'} data-id="tuy0hwdd4" data-path="src/components/DatabaseSyncForm.tsx">
                            {structure.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2" data-id="xh8p5peb6" data-path="src/components/DatabaseSyncForm.tsx">
                          Type: {structure.type} | Fields: {structure.fields.length}
                        </p>
                        <div className="flex flex-wrap gap-1" data-id="29xpeglo4" data-path="src/components/DatabaseSyncForm.tsx">
                          {structure.fields.map((field: string, fieldIndex: number) =>
                      <Badge key={fieldIndex} variant="outline" className="text-xs" data-id="ql8tvv23x" data-path="src/components/DatabaseSyncForm.tsx">
                              {field}
                            </Badge>
                      )}
                        </div>
                      </CardContent>
                    </Card>
                )}
                </div>
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitor" data-id="yxqm51aw8" data-path="src/components/DatabaseSyncForm.tsx">
          <div className="grid gap-6 md:grid-cols-2" data-id="c7x095gc7" data-path="src/components/DatabaseSyncForm.tsx">
            <Card data-id="x1fc2k8c2" data-path="src/components/DatabaseSyncForm.tsx">
              <CardHeader data-id="nou98j7cg" data-path="src/components/DatabaseSyncForm.tsx">
                <CardTitle className="flex items-center gap-2" data-id="zesexuvg7" data-path="src/components/DatabaseSyncForm.tsx">
                  <RefreshCw className="h-5 w-5" data-id="qdx8wtd5g" data-path="src/components/DatabaseSyncForm.tsx" />
                  Auto-Sync Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="k3ap84doh" data-path="src/components/DatabaseSyncForm.tsx">
                <div className="flex items-center justify-between" data-id="m5o8wwlk1" data-path="src/components/DatabaseSyncForm.tsx">
                  <span data-id="qdawjz42x" data-path="src/components/DatabaseSyncForm.tsx">Auto-Sync Status:</span>
                  <Badge variant={syncStatus.status === 'success' ? 'default' : 'secondary'} data-id="yhdwxnlsn" data-path="src/components/DatabaseSyncForm.tsx">
                    {syncStatus.status}
                  </Badge>
                </div>

                <div className="flex gap-2" data-id="9jsb4s0l4" data-path="src/components/DatabaseSyncForm.tsx">
                  <Button
                    onClick={startAutoSync}
                    disabled={!syncStatus.isConnected || isLoading || syncStatus.status === 'success'}
                    className="flex-1" data-id="uxeb64e6f" data-path="src/components/DatabaseSyncForm.tsx">

                    {isLoading ?
                    <Loader2 className="h-4 w-4 animate-spin mr-2" data-id="ap9j493ye" data-path="src/components/DatabaseSyncForm.tsx" /> :

                    <RotateCcw className="h-4 w-4 mr-2" data-id="fmtuwbyw4" data-path="src/components/DatabaseSyncForm.tsx" />
                    }
                    Start Auto-Sync
                  </Button>
                  <Button
                    onClick={stopAutoSync}
                    disabled={syncStatus.status !== 'success'}
                    variant="outline"
                    className="flex-1" data-id="gamfch680" data-path="src/components/DatabaseSyncForm.tsx">

                    <Trash2 className="h-4 w-4 mr-2" data-id="e2382c2pf" data-path="src/components/DatabaseSyncForm.tsx" />
                    Stop Sync
                  </Button>
                </div>

                {syncStatus.status === 'success' &&
                <Alert data-id="tg2u3ji68" data-path="src/components/DatabaseSyncForm.tsx">
                    <CheckCircle className="h-4 w-4" data-id="uqycqxbhs" data-path="src/components/DatabaseSyncForm.tsx" />
                    <AlertDescription data-id="7iwifocey" data-path="src/components/DatabaseSyncForm.tsx">
                      Auto-sync is active. Database will automatically update when changes are detected.
                    </AlertDescription>
                  </Alert>
                }
              </CardContent>
            </Card>

            <Card data-id="whdsbt20e" data-path="src/components/DatabaseSyncForm.tsx">
              <CardHeader data-id="4bzd5xabs" data-path="src/components/DatabaseSyncForm.tsx">
                <CardTitle data-id="dl9iw2wx5" data-path="src/components/DatabaseSyncForm.tsx">Sync Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="dnwr9h059" data-path="src/components/DatabaseSyncForm.tsx">
                <div className="grid grid-cols-2 gap-4" data-id="rrbphuoru" data-path="src/components/DatabaseSyncForm.tsx">
                  <div className="text-center" data-id="sc26qj8ym" data-path="src/components/DatabaseSyncForm.tsx">
                    <div className="text-2xl font-bold text-blue-600" data-id="vvzqu98ns" data-path="src/components/DatabaseSyncForm.tsx">{syncStatus.tablesCount}</div>
                    <div className="text-sm text-muted-foreground" data-id="y4ttkzfax" data-path="src/components/DatabaseSyncForm.tsx">Tables Synced</div>
                  </div>
                  <div className="text-center" data-id="dt5oecwkg" data-path="src/components/DatabaseSyncForm.tsx">
                    <div className="text-2xl font-bold text-green-600" data-id="reupa09xq" data-path="src/components/DatabaseSyncForm.tsx">{syncStatus.recordsCount}</div>
                    <div className="text-sm text-muted-foreground" data-id="xgqvs0l0z" data-path="src/components/DatabaseSyncForm.tsx">Records Synced</div>
                  </div>
                </div>
                
                <div className="text-center" data-id="z92o7imi1" data-path="src/components/DatabaseSyncForm.tsx">
                  <div className="text-sm text-muted-foreground" data-id="myn2ny6es" data-path="src/components/DatabaseSyncForm.tsx">Last Sync</div>
                  <div className="font-medium" data-id="tay7raxqk" data-path="src/components/DatabaseSyncForm.tsx">
                    {syncStatus.lastSync ?
                    new Date(syncStatus.lastSync).toLocaleString() :
                    'Never'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" data-id="6ibgze80x" data-path="src/components/DatabaseSyncForm.tsx">
          <Card data-id="ff6efmzf8" data-path="src/components/DatabaseSyncForm.tsx">
            <CardHeader data-id="7qggpxjg2" data-path="src/components/DatabaseSyncForm.tsx">
              <CardTitle className="flex items-center gap-2" data-id="a7rszwo2j" data-path="src/components/DatabaseSyncForm.tsx">
                <Settings className="h-5 w-5" data-id="ys0ytvz77" data-path="src/components/DatabaseSyncForm.tsx" />
                Sync Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6" data-id="77gyzirj7" data-path="src/components/DatabaseSyncForm.tsx">
              <div className="flex items-center justify-between" data-id="fmg3a0pye" data-path="src/components/DatabaseSyncForm.tsx">
                <div data-id="1f9wtgbth" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="autoSync" data-id="nhberyn7h" data-path="src/components/DatabaseSyncForm.tsx">Enable Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground" data-id="pg6jfe5pf" data-path="src/components/DatabaseSyncForm.tsx">
                    Automatically sync when changes are detected
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={syncConfig.autoSync}
                  onCheckedChange={(checked) => handleInputChange('autoSync', checked)} data-id="ykapltj88" data-path="src/components/DatabaseSyncForm.tsx" />

              </div>

              <div className="space-y-2" data-id="juxjlfrch" data-path="src/components/DatabaseSyncForm.tsx">
                <Label htmlFor="syncInterval" data-id="nj3gss1y7" data-path="src/components/DatabaseSyncForm.tsx">Sync Interval (seconds)</Label>
                <Input
                  id="syncInterval"
                  type="number"
                  value={syncConfig.syncInterval}
                  onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
                  min="60"
                  max="3600" data-id="g1c5kvibz" data-path="src/components/DatabaseSyncForm.tsx" />

                <p className="text-sm text-muted-foreground" data-id="wvh3d6gtx" data-path="src/components/DatabaseSyncForm.tsx">
                  How often to check for changes (minimum 60 seconds)
                </p>
              </div>

              <div className="flex items-center justify-between" data-id="tu2yh8jcn" data-path="src/components/DatabaseSyncForm.tsx">
                <div data-id="rbhgl5osl" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="backupEnabled" data-id="qrxxjxayl" data-path="src/components/DatabaseSyncForm.tsx">Enable Backups</Label>
                  <p className="text-sm text-muted-foreground" data-id="aktjhz49q" data-path="src/components/DatabaseSyncForm.tsx">
                    Create backups before making changes
                  </p>
                </div>
                <Switch
                  id="backupEnabled"
                  checked={syncConfig.backupEnabled}
                  onCheckedChange={(checked) => handleInputChange('backupEnabled', checked)} data-id="kde4p77ml" data-path="src/components/DatabaseSyncForm.tsx" />

              </div>

              <div className="flex items-center justify-between" data-id="0vr5l7rws" data-path="src/components/DatabaseSyncForm.tsx">
                <div data-id="7t9j23r5k" data-path="src/components/DatabaseSyncForm.tsx">
                  <Label htmlFor="encryptionEnabled" data-id="p1da9cidg" data-path="src/components/DatabaseSyncForm.tsx">Enable Encryption</Label>
                  <p className="text-sm text-muted-foreground" data-id="me7ww8bz9" data-path="src/components/DatabaseSyncForm.tsx">
                    Encrypt sensitive data during sync
                  </p>
                </div>
                <Switch
                  id="encryptionEnabled"
                  checked={syncConfig.encryptionEnabled}
                  onCheckedChange={(checked) => handleInputChange('encryptionEnabled', checked)} data-id="r3i8pmi0p" data-path="src/components/DatabaseSyncForm.tsx" />

              </div>

              <div className="pt-4" data-id="ux8acd0y7" data-path="src/components/DatabaseSyncForm.tsx">
                <Button className="w-full" data-id="iofzgduud" data-path="src/components/DatabaseSyncForm.tsx">
                  <Shield className="h-4 w-4 mr-2" data-id="qxv4gcgcr" data-path="src/components/DatabaseSyncForm.tsx" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default DatabaseSyncForm;