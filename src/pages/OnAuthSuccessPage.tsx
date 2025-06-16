import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const OnAuthSuccessPage: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" data-id="zcfjn3r4l" data-path="src/pages/OnAuthSuccessPage.tsx">
      <div className="w-full max-w-md" data-id="zpldusfqo" data-path="src/pages/OnAuthSuccessPage.tsx">
        <Card className="shadow-xl border-0 text-center" data-id="jkle1agv1" data-path="src/pages/OnAuthSuccessPage.tsx">
          <CardHeader className="pb-4" data-id="i0n5qed6d" data-path="src/pages/OnAuthSuccessPage.tsx">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center" data-id="a45ydcsp7" data-path="src/pages/OnAuthSuccessPage.tsx">
              <CheckCircle className="w-8 h-8 text-white" data-id="w87ijcdfz" data-path="src/pages/OnAuthSuccessPage.tsx" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900" data-id="amwr3bt40" data-path="src/pages/OnAuthSuccessPage.tsx">
              Email Verified Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="uhx75msc7" data-path="src/pages/OnAuthSuccessPage.tsx">
            <p className="text-gray-600" data-id="rcjoeic18" data-path="src/pages/OnAuthSuccessPage.tsx">
              Your email has been verified and your account is now active.
            </p>
            <p className="text-sm text-gray-500" data-id="9iroi5zyg" data-path="src/pages/OnAuthSuccessPage.tsx">
              You will be redirected to the login page in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2" data-id="gqeejdueh" data-path="src/pages/OnAuthSuccessPage.tsx">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(5 - countdown) / 5 * 100}%` }} data-id="qh3629h4o" data-path="src/pages/OnAuthSuccessPage.tsx">
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default OnAuthSuccessPage;
