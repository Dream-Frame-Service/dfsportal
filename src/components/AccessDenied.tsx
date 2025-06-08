import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccessDeniedProps {
  feature?: string;
  requiredRole?: string;
  showBackButton?: boolean;
  className?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  feature = 'this feature',
  requiredRole = 'Administrator',
  showBackButton = true,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center justify-center min-h-64 ${className}`} data-id="9xskset4d" data-path="src/components/AccessDenied.tsx">
      <Card className="max-w-md w-full border-2 border-red-200 bg-red-50" data-id="lngj14q45" data-path="src/components/AccessDenied.tsx">
        <CardHeader className="text-center" data-id="blam2ya1d" data-path="src/components/AccessDenied.tsx">
          <div className="flex justify-center mb-4" data-id="5wesgp6lh" data-path="src/components/AccessDenied.tsx">
            <div className="p-4 bg-red-100 rounded-full" data-id="eev8gt51c" data-path="src/components/AccessDenied.tsx">
              <Shield className="h-12 w-12 text-red-600" data-id="ott9wt521" data-path="src/components/AccessDenied.tsx" />
            </div>
          </div>
          <CardTitle className="text-red-800 flex items-center justify-center gap-2" data-id="r0o4zxcdj" data-path="src/components/AccessDenied.tsx">
            <Lock className="h-5 w-5" data-id="32qejhqm9" data-path="src/components/AccessDenied.tsx" />
            Access Denied
          </CardTitle>
          <CardDescription className="text-red-700" data-id="fvpqf5awk" data-path="src/components/AccessDenied.tsx">
            You don't have permission to access {feature}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4" data-id="rqsqp3qdn" data-path="src/components/AccessDenied.tsx">
          <div className="bg-red-100 p-4 rounded-lg" data-id="d2x957195" data-path="src/components/AccessDenied.tsx">
            <div className="flex items-center justify-center gap-2 mb-2" data-id="q7vj47i9h" data-path="src/components/AccessDenied.tsx">
              <AlertTriangle className="h-5 w-5 text-red-600" data-id="3r8jofh35" data-path="src/components/AccessDenied.tsx" />
              <span className="font-semibold text-red-800" data-id="5b2olpy68" data-path="src/components/AccessDenied.tsx">Administrator Access Required</span>
            </div>
            <p className="text-sm text-red-700" data-id="b45t0ixre" data-path="src/components/AccessDenied.tsx">
              This feature requires {requiredRole} privileges for security and compliance reasons.
            </p>
          </div>
          
          <div className="space-y-2" data-id="vix61zbpp" data-path="src/components/AccessDenied.tsx">
            <Badge variant="destructive" className="w-full py-2" data-id="3q5t8zdu2" data-path="src/components/AccessDenied.tsx">
              Current Role: Non-Administrator
            </Badge>
            <Badge variant="outline" className="w-full py-2 border-red-300 text-red-700" data-id="x5k9a0g9a" data-path="src/components/AccessDenied.tsx">
              Required Role: {requiredRole}
            </Badge>
          </div>

          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200" data-id="7miaetzp6" data-path="src/components/AccessDenied.tsx">
            <p className="font-medium mb-1" data-id="za7zjsoir" data-path="src/components/AccessDenied.tsx">Need access?</p>
            <p data-id="8jt6bmebb" data-path="src/components/AccessDenied.tsx">Contact your system administrator to request {requiredRole} privileges.</p>
          </div>

          {showBackButton &&
          <div className="pt-4" data-id="du3n7tbzv" data-path="src/components/AccessDenied.tsx">
              <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-red-300 text-red-700 hover:bg-red-100" data-id="gaobsnn26" data-path="src/components/AccessDenied.tsx">

                <ArrowLeft className="h-4 w-4 mr-2" data-id="hk3xuvotg" data-path="src/components/AccessDenied.tsx" />
                Go Back
              </Button>
            </div>
          }
        </CardContent>
      </Card>
    </div>);

};

export default AccessDenied;