import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, Zap } from 'lucide-react';
import { ComponentErrorBoundary, FormErrorBoundary } from './ErrorBoundary';

// Component that throws an error on demand
const ErrorProneComponent: React.FC<{shouldError: boolean;}> = ({ shouldError }) => {
  if (shouldError) {
    throw new Error('This is a demo error thrown by ErrorProneComponent');
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-id="bifayvn7t" data-path="src/components/ErrorBoundaryDemo.tsx">
      <div className="flex items-center gap-2" data-id="pht0zhurs" data-path="src/components/ErrorBoundaryDemo.tsx">
        <div className="w-2 h-2 bg-green-500 rounded-full" data-id="11u4a9b5d" data-path="src/components/ErrorBoundaryDemo.tsx"></div>
        <span className="text-sm text-green-800" data-id="kyocrgemw" data-path="src/components/ErrorBoundaryDemo.tsx">Component is working normally</span>
      </div>
    </div>);

};

// Form component that can throw errors
const ErrorProneForm: React.FC<{shouldError: boolean;}> = ({ shouldError }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shouldError) {
      throw new Error('Form submission error for demo purposes');
    }
  };

  if (shouldError && Math.random() > 0.5) {
    throw new Error('Form rendering error for demo purposes');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-id="3vnq1ui6g" data-path="src/components/ErrorBoundaryDemo.tsx">
      <div data-id="2dkz0st29" data-path="src/components/ErrorBoundaryDemo.tsx">
        <label className="block text-sm font-medium mb-1" data-id="cl8kdirfq" data-path="src/components/ErrorBoundaryDemo.tsx">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name" data-id="kfe6ijh3d" data-path="src/components/ErrorBoundaryDemo.tsx" />

      </div>
      <div data-id="zqdm6f994" data-path="src/components/ErrorBoundaryDemo.tsx">
        <label className="block text-sm font-medium mb-1" data-id="ch5mdytki" data-path="src/components/ErrorBoundaryDemo.tsx">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email" data-id="8cv13nvaw" data-path="src/components/ErrorBoundaryDemo.tsx" />

      </div>
      <Button type="submit" className="w-full" data-id="9pvouyweg" data-path="src/components/ErrorBoundaryDemo.tsx">
        Submit Form
      </Button>
    </form>);

};

const ErrorBoundaryDemo: React.FC = () => {
  const [componentError, setComponentError] = useState(false);
  const [formError, setFormError] = useState(false);

  return (
    <div className="space-y-6" data-id="jg7cp67s7" data-path="src/components/ErrorBoundaryDemo.tsx">
      <Card data-id="41hy1m4fe" data-path="src/components/ErrorBoundaryDemo.tsx">
        <CardHeader data-id="zbksdx6l8" data-path="src/components/ErrorBoundaryDemo.tsx">
          <CardTitle className="flex items-center gap-2" data-id="rl42otsre" data-path="src/components/ErrorBoundaryDemo.tsx">
            <Bug className="h-6 w-6" data-id="knuz7lv0l" data-path="src/components/ErrorBoundaryDemo.tsx" />
            Error Boundary Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6" data-id="czjvtl9so" data-path="src/components/ErrorBoundaryDemo.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="rp4sy2e0s" data-path="src/components/ErrorBoundaryDemo.tsx">
            {/* Component Error Boundary Demo */}
            <div className="space-y-4" data-id="el93kr1qc" data-path="src/components/ErrorBoundaryDemo.tsx">
              <div className="flex items-center justify-between" data-id="992r1lstv" data-path="src/components/ErrorBoundaryDemo.tsx">
                <h3 className="text-lg font-semibold" data-id="3gudc3zb6" data-path="src/components/ErrorBoundaryDemo.tsx">Component Error Boundary</h3>
                <Badge variant={componentError ? 'destructive' : 'secondary'} data-id="17bmzo789" data-path="src/components/ErrorBoundaryDemo.tsx">
                  {componentError ? 'Error Active' : 'Normal'}
                </Badge>
              </div>
              
              <ComponentErrorBoundary
                componentName="Demo Component"
                severity="medium"
                showErrorDetails={true} data-id="nmuduhf8q" data-path="src/components/ErrorBoundaryDemo.tsx">

                <ErrorProneComponent shouldError={componentError} data-id="x6y55e85f" data-path="src/components/ErrorBoundaryDemo.tsx" />
              </ComponentErrorBoundary>
              
              <Button
                onClick={() => setComponentError(!componentError)}
                variant={componentError ? 'default' : 'destructive'}
                size="sm" data-id="l48tfotm1" data-path="src/components/ErrorBoundaryDemo.tsx">

                <Zap className="w-4 h-4 mr-2" data-id="1hc7ge165" data-path="src/components/ErrorBoundaryDemo.tsx" />
                {componentError ? 'Fix Component' : 'Trigger Error'}
              </Button>
            </div>

            {/* Form Error Boundary Demo */}
            <div className="space-y-4" data-id="exkfrqqa6" data-path="src/components/ErrorBoundaryDemo.tsx">
              <div className="flex items-center justify-between" data-id="s37f1epzl" data-path="src/components/ErrorBoundaryDemo.tsx">
                <h3 className="text-lg font-semibold" data-id="msaj99d3s" data-path="src/components/ErrorBoundaryDemo.tsx">Form Error Boundary</h3>
                <Badge variant={formError ? 'destructive' : 'secondary'} data-id="fq47x1e05" data-path="src/components/ErrorBoundaryDemo.tsx">
                  {formError ? 'Error Active' : 'Normal'}
                </Badge>
              </div>
              
              <FormErrorBoundary
                formName="Demo Form"
                showDataRecovery={true}
                onFormReset={() => {
                  setFormError(false);
                }} data-id="8r7r5dvqm" data-path="src/components/ErrorBoundaryDemo.tsx">

                <ErrorProneForm shouldError={formError} data-id="ebb8vyg1i" data-path="src/components/ErrorBoundaryDemo.tsx" />
              </FormErrorBoundary>
              
              <Button
                onClick={() => setFormError(!formError)}
                variant={formError ? 'default' : 'destructive'}
                size="sm" data-id="bp7ybfdat" data-path="src/components/ErrorBoundaryDemo.tsx">

                <Zap className="w-4 h-4 mr-2" data-id="bckj3jxjc" data-path="src/components/ErrorBoundaryDemo.tsx" />
                {formError ? 'Fix Form' : 'Trigger Error'}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="tgxkk4vq6" data-path="src/components/ErrorBoundaryDemo.tsx">
            <div className="flex items-start gap-3" data-id="05dtrq7td" data-path="src/components/ErrorBoundaryDemo.tsx">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" data-id="71o2ddfok" data-path="src/components/ErrorBoundaryDemo.tsx" />
              <div data-id="cc6hqznee" data-path="src/components/ErrorBoundaryDemo.tsx">
                <h4 className="font-semibold text-blue-800" data-id="s4yqm5iw2" data-path="src/components/ErrorBoundaryDemo.tsx">How to Test Error Boundaries</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1" data-id="p681ac347" data-path="src/components/ErrorBoundaryDemo.tsx">
                  <li data-id="62ru8zqup" data-path="src/components/ErrorBoundaryDemo.tsx">• Click "Trigger Error" buttons to simulate component errors</li>
                  <li data-id="hvkxx77mk" data-path="src/components/ErrorBoundaryDemo.tsx">• Notice how errors are gracefully handled with fallback UI</li>
                  <li data-id="31gfnadoo" data-path="src/components/ErrorBoundaryDemo.tsx">• Try the "Retry" buttons in the error fallback components</li>
                  <li data-id="5o9f0zb01" data-path="src/components/ErrorBoundaryDemo.tsx">• Check the Error Recovery page in Admin section for logged errors</li>
                  <li data-id="bi4xu9cdv" data-path="src/components/ErrorBoundaryDemo.tsx">• Form errors include data recovery options</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default ErrorBoundaryDemo;