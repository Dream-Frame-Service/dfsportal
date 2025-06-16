import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, Bug } from 'lucide-react';
import { sanitizeUserInput } from '@/utils/sanitizeHelper';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
  retryCount: number;
}

class InvalidCharacterErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if this is an InvalidCharacterError
    if (error.name === 'InvalidCharacterError' ||
    error.message.includes('invalid characters') ||
    error.message.includes('InvalidCharacterError')) {
      return {
        hasError: true,
        error,
        errorId: `invalid-char-${Date.now()}`
      };
    }

    // Let other error boundaries handle non-InvalidCharacterError
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('InvalidCharacterError caught:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log detailed error information
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Detailed InvalidCharacterError info:', errorDetails);

    // Attempt to sanitize localStorage data if it might be the cause
    this.sanitizeStorageData();
  }

  private sanitizeStorageData = () => {
    try {
      // Sanitize localStorage data that might contain invalid characters
      const keysToCheck = ['formData', 'userData', 'cachedData', 'preferences'];

      keysToCheck.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            const sanitized = sanitizeUserInput(parsed);
            localStorage.setItem(key, JSON.stringify(sanitized));
          } catch (e) {
            // If parsing fails, remove the potentially corrupted data
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error sanitizing storage data:', error);
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorId: '',
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Force a page reload if we've exceeded retry attempts
      window.location.reload();
    }
  };

  private handleReset = () => {
    // Clear potentially problematic data
    this.sanitizeStorageData();

    // Clear form data that might contain invalid characters
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      try {
        form.reset();
      } catch (e) {
        console.error('Error resetting form:', e);
      }
    });

    this.setState({
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Show custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" data-id="wabkz4qeu" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
          <Card className="w-full max-w-lg border-red-200" data-id="2rnx9c5dl" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
            <CardHeader className="text-center" data-id="fl6qf7lfo" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4" data-id="ce2q2jmp2" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                <Bug className="w-6 h-6 text-red-600" data-id="8j7tvk5xh" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" />
              </div>
              <CardTitle className="text-red-800" data-id="vqdzkd8qo" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">Character Encoding Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="74ccw3cq3" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
              <Alert variant="destructive" data-id="j569uufvh" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                <AlertTriangle className="h-4 w-4" data-id="ki28a2s3r" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" />
                <AlertDescription data-id="62jm3cbau" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                  The application encountered invalid characters that prevent proper display. 
                  This can happen with special characters in form inputs or data.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-3 rounded-lg" data-id="kxie2bcj0" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                <h4 className="font-medium text-sm mb-2" data-id="ub2v565el" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">Error Details:</h4>
                <p className="text-xs text-gray-600 break-words" data-id="gpq0sp5bd" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                  {this.state.error.message}
                </p>
                <p className="text-xs text-gray-500 mt-1" data-id="f8b4n0gd2" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                  Error ID: {this.state.errorId}
                </p>
              </div>

              <div className="space-y-2" data-id="bp8xt3cdp" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                <h4 className="font-medium text-sm" data-id="yiktgwvw2" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">Suggested Solutions:</h4>
                <ul className="text-sm text-gray-600 space-y-1" data-id="5kwgkcgf3" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                  <li data-id="yklppa576" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">• Clear form data and try again</li>
                  <li data-id="b4p1mq0y8" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">• Remove special characters from inputs</li>
                  <li data-id="mrxpy1tw5" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">• Refresh the page to reset the application</li>
                  <li data-id="cfgl0b8za" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">• Check for copy-pasted text with hidden characters</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2" data-id="2wjreo1vx" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                {this.state.retryCount < this.maxRetries ?
                <Button
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="outline" data-id="mdzspkqf4" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">

                    <RefreshCw className="w-4 h-4 mr-2" data-id="q748tk92x" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx" />
                    Try Again ({this.maxRetries - this.state.retryCount} left)
                  </Button> :
                null}
                
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="outline" data-id="krtnghemr" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">

                  Clear Data & Reset
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  className="flex-1" data-id="9jylgkpd5" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">

                  Reload Page
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center" data-id="wl1cwmj01" data-path="src/components/ErrorBoundary/InvalidCharacterErrorBoundary.tsx">
                If the problem persists, please contact support with Error ID: {this.state.errorId}
              </div>
            </CardContent>
          </Card>
        </div>);

    }

    return this.props.children;
  }
}

export default InvalidCharacterErrorBoundary;
