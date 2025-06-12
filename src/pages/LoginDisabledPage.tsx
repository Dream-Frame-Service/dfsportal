import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Wrench, Clock, AlertTriangle } from 'lucide-react';

const LoginDisabledPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Login Temporarily Disabled
          </CardTitle>
          <CardDescription className="text-gray-600">
            The login system is currently undergoing maintenance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Wrench className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">System Maintenance</h3>
                <p className="text-sm text-yellow-700">
                  We're currently performing system updates to improve security and performance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Expected Duration</h3>
                <p className="text-sm text-blue-700">
                  Login access will be restored shortly. Thank you for your patience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Emergency Access</h3>
                <p className="text-sm text-red-700">
                  For urgent matters, please contact your system administrator.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <Clock className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDisabledPage;
