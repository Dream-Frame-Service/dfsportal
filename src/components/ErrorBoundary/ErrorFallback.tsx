import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  showDetails?: boolean;
  showNavigation?: boolean;
  customMessage?: string;
  customActions?: React.ReactNode;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  severity = 'medium',
  component,
  showDetails = true,
  showNavigation = true,
  customMessage,
  customActions
}) => {
  const navigate = useNavigate();
  const [showDetailedError, setShowDetailedError] = React.useState(false);

  const getSeverityConfig = (severity: string) => {
    const configs = {
      low: {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        badgeVariant: 'secondary' as const,
        icon: AlertTriangle,
        title: 'Minor Issue Detected'
      },
      medium: {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
        badgeVariant: 'destructive' as const,
        icon: AlertTriangle,
        title: 'Error Occurred'
      },
      high: {
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        badgeVariant: 'destructive' as const,
        icon: AlertTriangle,
        title: 'Serious Error'
      },
      critical: {
        color: 'text-red-700',
        bgColor: 'bg-red-100 border-red-300',
        badgeVariant: 'destructive' as const,
        icon: Bug,
        title: 'Critical System Error'
      }
    };
    return configs[severity] || configs.medium;
  };

  const config = getSeverityConfig(severity);
  const IconComponent = config.icon;

  const getErrorMessage = () => {
    if (customMessage) return customMessage;

    switch (severity) {
      case 'low':
        return 'A minor issue occurred, but you can continue using the application.';
      case 'medium':
        return 'An error occurred while processing your request. Please try again.';
      case 'high':
        return 'A serious error occurred. Some features may not work properly.';
      case 'critical':
        return 'A critical system error occurred. Please contact support if this continues.';
      default:
        return 'Something went wrong. Please try refreshing the page.';
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const formatErrorForDisplay = (error: Error) => {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 10).join('\n') // Limit stack trace
    };
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4" data-id="qxpwrwel0" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
      <Card className={`w-full max-w-2xl ${config.bgColor} border-2`} data-id="jfsd90z39" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
        <CardHeader className="text-center" data-id="cyv947hr2" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
          <div className="flex items-center justify-center mb-4" data-id="g53cxgf07" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            <div className={`p-3 rounded-full bg-white shadow-md ${config.color}`} data-id="ywmk0itai" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
              <IconComponent size={32} data-id="b1p8vup0g" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
            </div>
          </div>
          <CardTitle className={`text-xl font-bold ${config.color}`} data-id="q54uama4x" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            {config.title}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2" data-id="vwfvixe0n" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            <Badge variant={config.badgeVariant} className="text-sm" data-id="97oogdqnq" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
              {severity.toUpperCase()}
            </Badge>
            {component &&
            <Badge variant="outline" className="text-sm" data-id="u38dvv094" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                {component}
              </Badge>
            }
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4" data-id="xf8t419uk" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
          <p className="text-gray-700 text-center leading-relaxed" data-id="iacm2p8cc" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            {getErrorMessage()}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center" data-id="6xy1mkhw6" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            <Button
              onClick={resetError}
              variant="default"
              className="flex items-center gap-2" data-id="2z1r7fb9z" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">

              <RefreshCw size={16} data-id="o30vv6smg" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
              Try Again
            </Button>
            
            {showNavigation &&
            <>
                <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex items-center gap-2" data-id="ccoedpd4u" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">

                  <Home size={16} data-id="f3wnk9qzx" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
                  Go to Dashboard
                </Button>
                
                <Button
                onClick={handleRefreshPage}
                variant="outline"
                className="flex items-center gap-2" data-id="jqv0fa49f" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">

                  <RefreshCw size={16} data-id="gc8trphpm" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
                  Refresh Page
                </Button>
              </>
            }
          </div>

          {/* Custom Actions */}
          {customActions &&
          <div className="flex justify-center" data-id="oh5kvk8u0" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
              {customActions}
            </div>
          }

          {/* Error Details */}
          {showDetails &&
          <Collapsible
            open={showDetailedError}
            onOpenChange={setShowDetailedError}
            className="mt-6" data-id="xqp2ljfbn" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">

              <CollapsibleTrigger asChild data-id="bjbgp52h9" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800" data-id="lf27pmpfq" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">

                  {showDetailedError ?
                <>
                      <ChevronUp size={16} data-id="ceqo4m5j9" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
                      Hide Technical Details
                    </> :

                <>
                      <ChevronDown size={16} data-id="y8gar1bgv" data-path="src/components/ErrorBoundary/ErrorFallback.tsx" />
                      Show Technical Details
                    </>
                }
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-3" data-id="prcocxet0" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono" data-id="59nxiih8n" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                  <div className="mb-2" data-id="lfaw8qoxm" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                    <strong data-id="gj451x0bm" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">Error Type:</strong> {formatErrorForDisplay(error).name}
                  </div>
                  <div className="mb-2" data-id="ck5auvd50" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                    <strong data-id="pveizacff" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">Message:</strong> {formatErrorForDisplay(error).message}
                  </div>
                  {formatErrorForDisplay(error).stack &&
                <div data-id="qcg9g1zg0" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                      <strong data-id="rzsyw92ew" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">Stack Trace:</strong>
                      <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto" data-id="3ytt1u7cg" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                        {formatErrorForDisplay(error).stack}
                      </pre>
                    </div>
                }
                  <div className="mt-2 text-xs text-gray-500" data-id="1ykzjh440" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
                    <strong data-id="kdck9a7au" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">Timestamp:</strong> {new Date().toISOString()}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          }

          {/* Support Information */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-600" data-id="25vuylgik" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
            <p data-id="7w9t9daat" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
              If this error persists, please contact support with the error details above.
            </p>
            <p className="mt-1" data-id="wc9sewilr" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">
              <strong data-id="k8pdtzrzh" data-path="src/components/ErrorBoundary/ErrorFallback.tsx">Error ID:</strong> {Date.now().toString(36)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default ErrorFallback;
