import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Clock,
  Activity,
  Shield,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle } from
'lucide-react';
import { EnhancedErrorLogger, ErrorPattern, formatErrorPattern, getSeverityColor } from '@/services/enhancedErrorLogger';
import { useToast } from '@/hooks/use-toast';

const ErrorAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState(null);
  const [patterns, setPatterns] = useState<ErrorPattern[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const errorLogger = EnhancedErrorLogger.getInstance();

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const analyticsData = errorLogger.getAnalytics();
      const patternsData = errorLogger.getPatterns();
      const recommendationsData = errorLogger.getRecommendations();

      setAnalytics(analyticsData);
      setPatterns(patternsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      toast({
        title: "Error Loading Analytics",
        description: "Failed to refresh analytics data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportReport = () => {
    try {
      const report = errorLogger.exportComprehensiveReport();
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `error-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      toast({
        title: "Report Exported",
        description: "Comprehensive error analytics report has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics report.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    refreshData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8" data-id="zgj4qhadx" data-path="src/components/ErrorAnalyticsDashboard.tsx">
        <div className="text-center" data-id="rtutkh0zi" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" data-id="leakab0ii" data-path="src/components/ErrorAnalyticsDashboard.tsx"></div>
          <p className="text-sm text-muted-foreground" data-id="zo0uf2wm0" data-path="src/components/ErrorAnalyticsDashboard.tsx">Loading analytics data...</p>
        </div>
      </div>);

  }

  const criticalPatterns = patterns.filter((p) => p.severity === 'critical' || p.trend === 'increasing');
  const healthScore = Math.max(0, 100 - analytics.trends.hourly * 10);

  return (
    <div className="space-y-6" data-id="lj8xedm6x" data-path="src/components/ErrorAnalyticsDashboard.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="4xi0b9plf" data-path="src/components/ErrorAnalyticsDashboard.tsx">
        <div data-id="6d3dla97c" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <h2 className="text-2xl font-bold tracking-tight" data-id="tl1gklduv" data-path="src/components/ErrorAnalyticsDashboard.tsx">Error Analytics Dashboard</h2>
          <p className="text-muted-foreground" data-id="r79hv6sy4" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            Real-time monitoring and analysis of application errors
          </p>
        </div>
        <div className="flex gap-2" data-id="hdjngk1k5" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            size="sm" data-id="l9fr3iil5" data-path="src/components/ErrorAnalyticsDashboard.tsx">

            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} data-id="wjqkrsxc3" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
            Refresh
          </Button>
          <Button onClick={exportReport} variant="outline" size="sm" data-id="pryse1sdp" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <Download className="w-4 h-4 mr-2" data-id="za9rxbdr4" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="evx7egait" data-path="src/components/ErrorAnalyticsDashboard.tsx">
        <Card data-id="kcdwyb48n" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="x1zl1ygds" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="b2oazvgt6" data-path="src/components/ErrorAnalyticsDashboard.tsx">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" data-id="p089i8uc5" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="wvcgjqm8t" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <div className="text-2xl font-bold text-green-600" data-id="k8vb6epbu" data-path="src/components/ErrorAnalyticsDashboard.tsx">{healthScore.toFixed(0)}%</div>
            <Progress value={healthScore} className="mt-2" data-id="uqsmzcod4" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
            <p className="text-xs text-muted-foreground mt-1" data-id="y5hnb7vaj" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              Based on recent error trends
            </p>
          </CardContent>
        </Card>

        <Card data-id="3uzqeqg9i" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="s2l9g0v6e" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="yr4atx222" data-path="src/components/ErrorAnalyticsDashboard.tsx">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" data-id="2gj4mv6cv" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="3dy6utfsh" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <div className="text-2xl font-bold text-red-600" data-id="mj49rmlud" data-path="src/components/ErrorAnalyticsDashboard.tsx">{analytics.totalErrors}</div>
            <p className="text-xs text-muted-foreground" data-id="jm0atz15z" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              Across all components and time periods
            </p>
          </CardContent>
        </Card>

        <Card data-id="wc9ezuf5d" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="dbwpc07pl" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="btsfz5bxl" data-path="src/components/ErrorAnalyticsDashboard.tsx">Active Patterns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" data-id="9eej3z6hz" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="t9l97v3ig" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <div className="text-2xl font-bold text-blue-600" data-id="l699teqcq" data-path="src/components/ErrorAnalyticsDashboard.tsx">{patterns.length}</div>
            <p className="text-xs text-muted-foreground" data-id="cegun09h5" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              {criticalPatterns.length} critical patterns detected
            </p>
          </CardContent>
        </Card>

        <Card data-id="33sc66mqy" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="0xk2pimo9" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardTitle className="text-sm font-medium" data-id="qe02kts8s" data-path="src/components/ErrorAnalyticsDashboard.tsx">Recovery Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" data-id="w8mulnsom" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
          </CardHeader>
          <CardContent data-id="ki9jpdsdt" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <div className="text-2xl font-bold text-green-600" data-id="ssqqkw3wz" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              {analytics.recoveryRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground" data-id="x5genfhrx" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              System stability and error recovery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalPatterns.length > 0 &&
      <Alert className="border-red-200 bg-red-50" data-id="6bwaxk2kr" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <AlertTriangle className="h-4 w-4 text-red-600" data-id="v4esk3iq9" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
          <AlertDescription data-id="neyw9d1fe" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <div className="flex items-center justify-between" data-id="vdfl941v7" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <div data-id="m6rwyykjn" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <strong className="text-red-800" data-id="9zk7l31n9" data-path="src/components/ErrorAnalyticsDashboard.tsx">Critical Issues Detected:</strong> 
                <span className="ml-2 text-red-700" data-id="yelujjwah" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  {criticalPatterns.length} pattern(s) require immediate attention
                </span>
              </div>
              <Badge variant="destructive" data-id="aflrmkl6q" data-path="src/components/ErrorAnalyticsDashboard.tsx">{criticalPatterns.length}</Badge>
            </div>
          </AlertDescription>
        </Alert>
      }

      <Tabs defaultValue="overview" className="space-y-4" data-id="540jp8oqu" data-path="src/components/ErrorAnalyticsDashboard.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="4e2zd22gk" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <TabsTrigger value="overview" data-id="v48qo4zzi" data-path="src/components/ErrorAnalyticsDashboard.tsx">Overview</TabsTrigger>
          <TabsTrigger value="patterns" data-id="m4u5u1vka" data-path="src/components/ErrorAnalyticsDashboard.tsx">Error Patterns</TabsTrigger>
          <TabsTrigger value="trends" data-id="l5g4eaxrx" data-path="src/components/ErrorAnalyticsDashboard.tsx">Trends & Metrics</TabsTrigger>
          <TabsTrigger value="recommendations" data-id="hpc8pleg7" data-path="src/components/ErrorAnalyticsDashboard.tsx">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6" data-id="thkdkefyq" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="xvdbgk4tj" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            {/* Error Distribution by Severity */}
            <Card data-id="7v7vemr6x" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardHeader data-id="wi8gsh53h" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <CardTitle className="text-lg" data-id="xktwzrmuy" data-path="src/components/ErrorAnalyticsDashboard.tsx">Error Distribution by Severity</CardTitle>
              </CardHeader>
              <CardContent data-id="ytvy3tlhs" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <div className="space-y-3" data-id="5isd0syu8" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  {Object.entries(analytics.errorsBySeverity).map(([severity, count]) =>
                  <div key={severity} className="flex items-center justify-between" data-id="7ceu9zudg" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <div className="flex items-center gap-2" data-id="5slkylxel" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <Badge variant="outline" className={getSeverityColor(severity)} data-id="1iklsdz5i" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                          {severity}
                        </Badge>
                        <span className="text-sm" data-id="k1a594t79" data-path="src/components/ErrorAnalyticsDashboard.tsx">{count} errors</span>
                      </div>
                      <div className="flex-1 mx-4" data-id="mw4ma56y5" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <Progress
                        value={count / analytics.totalErrors * 100}
                        className="h-2" data-id="k9dlart3p" data-path="src/components/ErrorAnalyticsDashboard.tsx" />

                      </div>
                      <span className="text-xs text-muted-foreground" data-id="gbtwi57gk" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        {(count / analytics.totalErrors * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Error Components */}
            <Card data-id="gmvnb9gau" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardHeader data-id="5anapefou" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <CardTitle className="text-lg" data-id="3e4x6u4a7" data-path="src/components/ErrorAnalyticsDashboard.tsx">Components with Most Errors</CardTitle>
              </CardHeader>
              <CardContent data-id="7ikyxazh1" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <div className="space-y-3" data-id="thc3ze7tt" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  {Object.entries(analytics.errorsByComponent).
                  sort(([, a], [, b]) => b - a).
                  slice(0, 5).
                  map(([component, count]) =>
                  <div key={component} className="flex items-center justify-between" data-id="yk39c3jdh" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <span className="text-sm font-medium" data-id="cd33oona9" data-path="src/components/ErrorAnalyticsDashboard.tsx">{component}</span>
                      <div className="flex items-center gap-2" data-id="dkblcg7a8" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <span className="text-sm text-muted-foreground" data-id="zlet17dr2" data-path="src/components/ErrorAnalyticsDashboard.tsx">{count} errors</span>
                        <Badge variant="secondary" data-id="fvmsyi3ar" data-path="src/components/ErrorAnalyticsDashboard.tsx">{count}</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Error Trends */}
          <Card data-id="7qor40o7q" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardHeader data-id="zivipquza" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardTitle className="text-lg" data-id="pajmv3uqv" data-path="src/components/ErrorAnalyticsDashboard.tsx">Recent Error Trends</CardTitle>
              <CardDescription data-id="90bi2udu0" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                Error frequency over different time periods
              </CardDescription>
            </CardHeader>
            <CardContent data-id="fwh13oo6d" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="dvq54nmc9" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <div className="text-center p-4 border rounded-lg" data-id="fylusnudg" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" data-id="enfnnuymw" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                  <div className="text-2xl font-bold" data-id="5dpp7gbnc" data-path="src/components/ErrorAnalyticsDashboard.tsx">{analytics.trends.hourly}</div>
                  <div className="text-sm text-muted-foreground" data-id="ul9ph4mms" data-path="src/components/ErrorAnalyticsDashboard.tsx">Last Hour</div>
                </div>
                <div className="text-center p-4 border rounded-lg" data-id="m1cixqabg" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" data-id="mdb8puwh6" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                  <div className="text-2xl font-bold" data-id="yt63s8hrn" data-path="src/components/ErrorAnalyticsDashboard.tsx">{analytics.trends.daily}</div>
                  <div className="text-sm text-muted-foreground" data-id="gqpktnkky" data-path="src/components/ErrorAnalyticsDashboard.tsx">Last 24 Hours</div>
                </div>
                <div className="text-center p-4 border rounded-lg" data-id="7hbd0amy9" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" data-id="cv5c0lgcx" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                  <div className="text-2xl font-bold" data-id="z6v9c00x9" data-path="src/components/ErrorAnalyticsDashboard.tsx">{analytics.trends.weekly}</div>
                  <div className="text-sm text-muted-foreground" data-id="pxoker20z" data-path="src/components/ErrorAnalyticsDashboard.tsx">Last 7 Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6" data-id="f0pt7o6lj" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <Card data-id="aaj4jcrgb" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardHeader data-id="yog3996h2" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardTitle className="text-lg" data-id="c6672jqex" data-path="src/components/ErrorAnalyticsDashboard.tsx">Detected Error Patterns</CardTitle>
              <CardDescription data-id="k3pm3tqoq" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                Automatically identified patterns in error occurrences
              </CardDescription>
            </CardHeader>
            <CardContent data-id="ea17ixj9g" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <div className="space-y-4" data-id="f30pnbc2y" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                {patterns.length === 0 ?
                <div className="text-center py-8" data-id="ap7gbj43m" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" data-id="f7uc20m9q" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                    <p className="text-muted-foreground" data-id="q7vsf5vtf" data-path="src/components/ErrorAnalyticsDashboard.tsx">No error patterns detected</p>
                  </div> :

                patterns.map((pattern) =>
                <Card key={pattern.id} className="border-l-4 border-l-blue-500" data-id="hu68ex5g9" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <CardContent className="p-4" data-id="uw8x889cc" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <div className="flex items-start justify-between" data-id="x2syakgo9" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                          <div className="flex-1" data-id="nzyym0mcy" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                            <div className="flex items-center gap-2 mb-2" data-id="n6bapwc8k" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                              <h4 className="font-semibold" data-id="1e72s2guu" data-path="src/components/ErrorAnalyticsDashboard.tsx">{pattern.name}</h4>
                              <Badge variant="outline" className={getSeverityColor(pattern.severity)} data-id="dayupmfb3" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                                {pattern.severity}
                              </Badge>
                              <Badge variant={pattern.trend === 'increasing' ? 'destructive' : 'secondary'} data-id="vf5urbebx" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                                {pattern.trend === 'increasing' && <TrendingUp className="w-3 h-3 mr-1" data-id="we7okggan" data-path="src/components/ErrorAnalyticsDashboard.tsx" />}
                                {pattern.trend === 'decreasing' && <TrendingDown className="w-3 h-3 mr-1" data-id="4vo7t2b8e" data-path="src/components/ErrorAnalyticsDashboard.tsx" />}
                                {pattern.trend}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3" data-id="up71ipl53" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                              {pattern.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground" data-id="qrvu6xb05" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                              <span data-id="ib4qng0l3" data-path="src/components/ErrorAnalyticsDashboard.tsx">Frequency: {pattern.frequency}</span>
                              <span data-id="efc172ple" data-path="src/components/ErrorAnalyticsDashboard.tsx">Last: {pattern.lastOccurrence.toLocaleString()}</span>
                              <span data-id="3wffgu8ez" data-path="src/components/ErrorAnalyticsDashboard.tsx">Components: {pattern.components.join(', ')}</span>
                            </div>
                          </div>
                          <div className="text-right" data-id="yv1luc8hv" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                            <div className="text-2xl font-bold text-red-600" data-id="e2h0gc2rq" data-path="src/components/ErrorAnalyticsDashboard.tsx">{pattern.frequency}</div>
                            <div className="text-xs text-muted-foreground" data-id="5y9x83asm" data-path="src/components/ErrorAnalyticsDashboard.tsx">occurrences</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                )
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6" data-id="2gmo86y9q" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="mtcmwuf0o" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            {/* Hourly Distribution */}
            <Card data-id="htjyqldzm" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardHeader data-id="s4ehofze8" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <CardTitle className="text-lg" data-id="4q9y7tm8d" data-path="src/components/ErrorAnalyticsDashboard.tsx">Errors by Hour</CardTitle>
              </CardHeader>
              <CardContent data-id="pszjzp2k1" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <div className="space-y-2" data-id="404fz6q47" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  {Object.entries(analytics.errorsByHour).
                  sort(([a], [b]) => parseInt(a) - parseInt(b)).
                  map(([hour, count]) =>
                  <div key={hour} className="flex items-center gap-3" data-id="s8jnlar14" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <span className="text-sm font-mono w-8" data-id="b4406bmlf" data-path="src/components/ErrorAnalyticsDashboard.tsx">{hour}:00</span>
                      <div className="flex-1" data-id="1qn0gxy9s" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <Progress value={count / Math.max(...Object.values(analytics.errorsByHour)) * 100} data-id="rw8b0ldvz" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                      </div>
                      <span className="text-sm w-8 text-right" data-id="bssdn8epc" data-path="src/components/ErrorAnalyticsDashboard.tsx">{count}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Error Messages */}
            <Card data-id="5mes0azif" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardHeader data-id="wm8kj6bhb" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <CardTitle className="text-lg" data-id="bzocpkohc" data-path="src/components/ErrorAnalyticsDashboard.tsx">Most Common Errors</CardTitle>
              </CardHeader>
              <CardContent data-id="ye9i9dqyx" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                <div className="space-y-3" data-id="b04v89fay" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                  {analytics.topErrorMessages.slice(0, 5).map((error, index) =>
                  <div key={index} className="p-3 border rounded-lg" data-id="wec0ja6d6" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <div className="flex items-center justify-between mb-1" data-id="xqjjsdch3" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <Badge variant="secondary" data-id="knscjbgqw" data-path="src/components/ErrorAnalyticsDashboard.tsx">{error.count}x</Badge>
                        <span className="text-xs text-muted-foreground" data-id="7b0hps8y3" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                          {(error.count / analytics.totalErrors * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground" data-id="r34f1gswe" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        {error.message.length > 80 ?
                      `${error.message.substring(0, 80)}...` :
                      error.message
                      }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6" data-id="whk5ztwdu" data-path="src/components/ErrorAnalyticsDashboard.tsx">
          <Card data-id="3mav448c7" data-path="src/components/ErrorAnalyticsDashboard.tsx">
            <CardHeader data-id="qfu26cmmr" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <CardTitle className="text-lg" data-id="ai0syas6i" data-path="src/components/ErrorAnalyticsDashboard.tsx">System Improvement Recommendations</CardTitle>
              <CardDescription data-id="o1ndeze96" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                AI-generated suggestions based on error pattern analysis
              </CardDescription>
            </CardHeader>
            <CardContent data-id="8gx9osa87" data-path="src/components/ErrorAnalyticsDashboard.tsx">
              <div className="space-y-4" data-id="ultu8ilyh" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                {recommendations.length === 0 ?
                <div className="text-center py-8" data-id="8eolm4fo8" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" data-id="86my8ytez" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                    <p className="text-muted-foreground" data-id="dq0plj1pc" data-path="src/components/ErrorAnalyticsDashboard.tsx">No specific recommendations at this time</p>
                    <p className="text-sm text-muted-foreground mt-1" data-id="1bwihhzem" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      System appears to be running smoothly
                    </p>
                  </div> :

                recommendations.map((rec, index) =>
                <Card key={index} className="border-l-4 border-l-orange-500" data-id="dykgfdunm" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                      <CardContent className="p-4" data-id="vnuluymzf" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                        <div className="flex items-start gap-3" data-id="iot6o6eao" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                          <div className="p-2 rounded-full bg-orange-100" data-id="k58oosweo" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                            {rec.priority === 'high' ?
                        <AlertCircle className="h-4 w-4 text-orange-600" data-id="s4ojth8az" data-path="src/components/ErrorAnalyticsDashboard.tsx" /> :
                        rec.priority === 'medium' ?
                        <AlertTriangle className="h-4 w-4 text-yellow-600" data-id="sauosobqo" data-path="src/components/ErrorAnalyticsDashboard.tsx" /> :

                        <Target className="h-4 w-4 text-blue-600" data-id="olj7ch71d" data-path="src/components/ErrorAnalyticsDashboard.tsx" />
                        }
                          </div>
                          <div className="flex-1" data-id="v7eo28h08" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                            <div className="flex items-center gap-2 mb-1" data-id="fodi6oaqt" data-path="src/components/ErrorAnalyticsDashboard.tsx">
                              <h4 className="font-medium" data-id="jbw5nj83f" data-path="src/components/ErrorAnalyticsDashboard.tsx">{rec.action}</h4>
                              <Badge
                            variant={rec.priority === 'high' ? 'destructive' :
                            rec.priority === 'medium' ? 'default' : 'secondary'} data-id="6v52tjzrx" data-path="src/components/ErrorAnalyticsDashboard.tsx">

                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground" data-id="kdomh8sfg" data-path="src/components/ErrorAnalyticsDashboard.tsx">{rec.reason}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                )
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default ErrorAnalyticsDashboard;
