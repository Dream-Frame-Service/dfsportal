import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  componentName?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  componentName = 'Component'
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" data-id="hln3ywrn3" data-path="src/components/ErrorFallback.tsx">
      <Card className="w-full max-w-md" data-id="d7tdtg8gu" data-path="src/components/ErrorFallback.tsx">
        <CardHeader className="text-center" data-id="nfo0im7u0" data-path="src/components/ErrorFallback.tsx">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4" data-id="vbwi47mlt" data-path="src/components/ErrorFallback.tsx">
            <AlertCircle className="w-8 h-8 text-red-600" data-id="zyei66bx2" data-path="src/components/ErrorFallback.tsx" />
          </div>
          <CardTitle className="text-red-800" data-id="ye7k3djki" data-path="src/components/ErrorFallback.tsx">
            {componentName} Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="s1s6l5whw" data-path="src/components/ErrorFallback.tsx">
          <Alert variant="destructive" data-id="ajcqluiog" data-path="src/components/ErrorFallback.tsx">
            <AlertCircle className="w-4 h-4" data-id="21i5qur1q" data-path="src/components/ErrorFallback.tsx" />
            <AlertDescription data-id="9jqe90nop" data-path="src/components/ErrorFallback.tsx">
              {error?.message || `An error occurred while loading the ${componentName} component.`}
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-600 space-y-2" data-id="xgioekmpc" data-path="src/components/ErrorFallback.tsx">
            <p data-id="yz4hyskyq" data-path="src/components/ErrorFallback.tsx"><strong data-id="q00ij8lys" data-path="src/components/ErrorFallback.tsx">What you can do:</strong></p>
            <ul className="list-disc list-inside space-y-1" data-id="ioi4rrjp1" data-path="src/components/ErrorFallback.tsx">
              <li data-id="n0ogtun41" data-path="src/components/ErrorFallback.tsx">Try refreshing the page</li>
              <li data-id="owcbbqpri" data-path="src/components/ErrorFallback.tsx">Clear your browser cache</li>
              <li data-id="dxyd0csd5" data-path="src/components/ErrorFallback.tsx">Check your internet connection</li>
              <li data-id="khyl5g1t8" data-path="src/components/ErrorFallback.tsx">Contact support if the problem persists</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2" data-id="o61ofwbc0" data-path="src/components/ErrorFallback.tsx">
            <Button onClick={handleRetry} className="w-full" data-id="rloghkj2z" data-path="src/components/ErrorFallback.tsx">
              <RefreshCw className="w-4 h-4 mr-2" data-id="9n8jllz72" data-path="src/components/ErrorFallback.tsx" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full" data-id="wq3tjwdq3" data-path="src/components/ErrorFallback.tsx">

              <Home className="w-4 h-4 mr-2" data-id="5yul5n6sz" data-path="src/components/ErrorFallback.tsx" />
              Go to Dashboard
            </Button>
          </div>

          {error &&
          <details className="text-xs text-gray-500 mt-4" data-id="ig4204y7f" data-path="src/components/ErrorFallback.tsx">
              <summary className="cursor-pointer hover:text-gray-700" data-id="g82z5251n" data-path="src/components/ErrorFallback.tsx">
                Technical Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto" data-id="2zlm9f9dx" data-path="src/components/ErrorFallback.tsx">
                {error.stack || error.message}
              </pre>
            </details>
          }
        </CardContent>
      </Card>
    </div>);

};

export default ErrorFallback;
