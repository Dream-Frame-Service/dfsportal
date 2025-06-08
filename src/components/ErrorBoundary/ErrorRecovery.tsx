import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ErrorLogger, ErrorLogEntry } from '@/services/errorLogger';
import { useToast } from '@/hooks/use-toast';

const ErrorRecovery: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const errorLogger = ErrorLogger.getInstance();

  useEffect(() => {
    loadErrorLogs();
  }, []);

  const loadErrorLogs = () => {
    try {
      setIsLoading(true);
      const logs = errorLogger.getLogs();
      setErrorLogs(logs);
    } catch (error) {
      console.error('Failed to load error logs:', error);
      toast({
        title: "Error Loading Logs",
        description: "Failed to load error recovery information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllLogs = () => {
    try {
      errorLogger.clearLogs();
      setErrorLogs([]);
      toast({
        title: "Logs Cleared",
        description: "All error logs have been cleared successfully."
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear error logs.",
        variant: "destructive"
      });
    }
  };

  const exportLogs = () => {
    try {
      const logsData = JSON.stringify(errorLogs, null, 2);
      const blob = new Blob([logsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dfs-error-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Error logs exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export error logs.",
        variant: "destructive"
      });
    }
  };

  const getSeverityBadge = (severity: ErrorLogEntry['severity']) => {
    const variants = {
      low: { variant: 'secondary' as const, color: 'text-yellow-600' },
      medium: { variant: 'secondary' as const, color: 'text-orange-600' },
      high: { variant: 'destructive' as const, color: 'text-red-600' },
      critical: { variant: 'destructive' as const, color: 'text-red-800' }
    };
    return variants[severity] || variants.medium;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSummary = () => {
    return errorLogger.getLogsSummary();
  };

  const summary = getSummary();

  if (isLoading) {
    return (
      <Card data-id="wm4whgo0a" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
        <CardContent className="flex items-center justify-center p-8" data-id="jpogwd1cn" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <div className="flex items-center gap-2" data-id="ox0lzmv48" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <Clock className="animate-spin" size={20} data-id="qxrnftnpp" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
            Loading error recovery information...
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6" data-id="zqtxl3i5y" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="pddxwzd2w" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
        <Card data-id="0vm92rhw8" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <CardContent className="flex items-center justify-between p-4" data-id="45r28eu42" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <div data-id="xb73hruew" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <p className="text-sm font-medium text-gray-600" data-id="k8wnrh6sw" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Total Errors</p>
              <p className="text-2xl font-bold" data-id="zq5tji54a" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">{summary.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-400" data-id="vjm2gz5y1" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
          </CardContent>
        </Card>

        <Card data-id="j7nb49lmo" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <CardContent className="flex items-center justify-between p-4" data-id="o5wv4myhf" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <div data-id="hv14t541e" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <p className="text-sm font-medium text-gray-600" data-id="fi9v6vbfp" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Critical</p>
              <p className="text-2xl font-bold text-red-600" data-id="fjne5m07s" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                {summary.bySeverity.critical || 0}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" data-id="n1j0o7if2" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
          </CardContent>
        </Card>

        <Card data-id="jlmca3j2y" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <CardContent className="flex items-center justify-between p-4" data-id="t638q6yka" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <div data-id="bz6roycw7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <p className="text-sm font-medium text-gray-600" data-id="3rz0ut8pt" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">High</p>
              <p className="text-2xl font-bold text-orange-600" data-id="gl9evnqa3" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                {summary.bySeverity.high || 0}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" data-id="m409xp9lp" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
          </CardContent>
        </Card>

        <Card data-id="oonvu91z8" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <CardContent className="flex items-center justify-between p-4" data-id="wffdfdee2" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <div data-id="h606zunz0" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <p className="text-sm font-medium text-gray-600" data-id="7wxaesyrm" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Medium/Low</p>
              <p className="text-2xl font-bold text-yellow-600" data-id="w8imhpkqc" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                {(summary.bySeverity.medium || 0) + (summary.bySeverity.low || 0)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-yellow-400" data-id="1th2gw0d9" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
          </CardContent>
        </Card>
      </div>

      {/* Error Logs Table */}
      <Card data-id="45bzvj0pb" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
        <CardHeader data-id="yqcc8q2k0" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <div className="flex items-center justify-between" data-id="1tn7ja2k7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <CardTitle className="flex items-center gap-2" data-id="a4609es23" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <AlertTriangle size={20} data-id="k776x79p6" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
              Error Recovery Center
            </CardTitle>
            <div className="flex gap-2" data-id="7esgz1ke5" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <Button
                onClick={exportLogs}
                variant="outline"
                size="sm"
                disabled={errorLogs.length === 0} data-id="j08deqdoc" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">

                <Download size={16} className="mr-1" data-id="8oy3r6ppi" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
                Export
              </Button>
              <Button
                onClick={clearAllLogs}
                variant="outline"
                size="sm"
                disabled={errorLogs.length === 0} data-id="csrrp63p9" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">

                <Trash2 size={16} className="mr-1" data-id="d6xva3m8j" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent data-id="cpg7qnrdz" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          {errorLogs.length === 0 ?
          <div className="text-center py-8" data-id="a8mdab2c0" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" data-id="o4j7i64au" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="kul11jzpf" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                No Errors Detected
              </h3>
              <p className="text-gray-500" data-id="tbi1n5wbb" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                Great! Your application is running smoothly without any recorded errors.
              </p>
            </div> :

          <div className="overflow-x-auto" data-id="jw6eexeth" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <Table data-id="d277i8glo" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                <TableHeader data-id="a0txcsat7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                  <TableRow data-id="3dk6ahbth" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                    <TableHead data-id="giajxet4f" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Timestamp</TableHead>
                    <TableHead data-id="7ghf4b0qh" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Severity</TableHead>
                    <TableHead data-id="8uw68gdhv" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Component</TableHead>
                    <TableHead data-id="fzfd7ojs7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Error</TableHead>
                    <TableHead data-id="wxzgx0udw" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="i8gysx0mp" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                  {errorLogs.slice(0, 20).map((log) =>
                <TableRow key={log.id} data-id="7fbt8h4a9" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                      <TableCell className="text-sm" data-id="tpd805thb" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell data-id="cory14bu1" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                        <Badge
                      variant={getSeverityBadge(log.severity).variant}
                      className={getSeverityBadge(log.severity).color} data-id="ckmerv3q3" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">

                          {log.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm" data-id="o2k6eoerd" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                        {log.component || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate" data-id="3pxmr8w1s" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                        <span title={log.error.message} data-id="qk3j5zkbq" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                          {log.error.name}: {log.error.message}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate" data-id="k5njji6c9" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                        <span title={log.url} data-id="zxzufgwfm" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                          {new URL(log.url).pathname}
                        </span>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
              
              {errorLogs.length > 20 &&
            <div className="mt-4 text-center text-sm text-gray-500" data-id="s8fvpd7y7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                  Showing 20 of {errorLogs.length} errors. Export for full details.
                </div>
            }
            </div>
          }
        </CardContent>
      </Card>

      {/* Recovery Tips */}
      <Card data-id="v0lusqpyy" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
        <CardHeader data-id="egvguv790" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <CardTitle className="text-lg" data-id="j7g3qxdde" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">Error Recovery Tips</CardTitle>
        </CardHeader>
        <CardContent data-id="b7rgpukq4" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="u5a5ln11y" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
            <div data-id="yx16ptl8q" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <h4 className="font-semibold mb-2" data-id="bhfgf5nru" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">For Users:</h4>
              <ul className="text-sm space-y-1 text-gray-600" data-id="m7okk4wm7" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                <li data-id="slv1l1osr" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Refresh the page to reset the component state</li>
                <li data-id="96opsj4bv" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Clear browser cache and cookies</li>
                <li data-id="0a13yz550" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Try using a different browser</li>
                <li data-id="8x9zx56dw" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Check your internet connection</li>
                <li data-id="zsjp20hky" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Contact support if errors persist</li>
              </ul>
            </div>
            <div data-id="onrpd4c57" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
              <h4 className="font-semibold mb-2" data-id="lmfmm5scg" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">For Developers:</h4>
              <ul className="text-sm space-y-1 text-gray-600" data-id="hs89hya4r" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">
                <li data-id="c4xf0c9wj" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Check console for detailed error information</li>
                <li data-id="ip1qy661x" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Export error logs for analysis</li>
                <li data-id="5p4pfvfer" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Review component stack traces</li>
                <li data-id="2o7cz2s24" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Implement additional error boundaries if needed</li>
                <li data-id="2uwq9gc1d" data-path="src/components/ErrorBoundary/ErrorRecovery.tsx">• Monitor error patterns and frequency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default ErrorRecovery;