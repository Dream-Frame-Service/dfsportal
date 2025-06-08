import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [token, setToken] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { updatePassword } = useSupabaseAuth();

  useEffect(() => {
    const type = searchParams.get('type');
    
    if (type === 'recovery') {
      setToken('recovery');
    } else {
      // For Supabase, we don't need to show an error immediately
      // The user might have been redirected here directly
      setToken('recovery');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setMessage(error.message);
        setMessageType('error');
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMessage('Password reset successfully! Redirecting to login...');
        setMessageType('success');
        toast({
          title: "Success",
          description: "Password reset successfully"
        });

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4" data-id="dpdv55alk" data-path="src/pages/ResetPasswordPage.tsx">
      <div className="w-full max-w-md" data-id="3srcy9393" data-path="src/pages/ResetPasswordPage.tsx">
        {/* Logo and Company Name */}
        <div className="text-center mb-8" data-id="968fyjjtt" data-path="src/pages/ResetPasswordPage.tsx">
          <div className="flex flex-col items-center" data-id="nw3vmu7wh" data-path="src/pages/ResetPasswordPage.tsx">
            <div className="mb-4 transform hover:scale-105 transition-transform duration-200" data-id="oopupxh29" data-path="src/pages/ResetPasswordPage.tsx">
              <Logo size="xl" showText={false} className="mb-4" data-id="wjkr3op05" data-path="src/pages/ResetPasswordPage.tsx" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2" data-id="ix1tvevg8" data-path="src/pages/ResetPasswordPage.tsx">
              DFS Manager Portal
            </h1>
            <p className="text-slate-600 font-medium" data-id="2laq9ll50" data-path="src/pages/ResetPasswordPage.tsx">Reset Your Password</p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95" data-id="045tlkg86" data-path="src/pages/ResetPasswordPage.tsx">
          <CardHeader className="space-y-1 pb-6" data-id="ddnsbfvo5" data-path="src/pages/ResetPasswordPage.tsx">
            <CardTitle className="text-2xl font-bold text-center text-slate-800" data-id="osyjg8yv0" data-path="src/pages/ResetPasswordPage.tsx">
              Set New Password
            </CardTitle>
            <CardDescription className="text-center text-slate-600" data-id="fdgtx5ea9" data-path="src/pages/ResetPasswordPage.tsx">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent data-id="r3rebjnsn" data-path="src/pages/ResetPasswordPage.tsx">
            {message &&
            <Alert className={`mb-4 ${messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-id="qajtm8vvb" data-path="src/pages/ResetPasswordPage.tsx">
                {messageType === 'success' ?
              <CheckCircle2 className="h-4 w-4 text-green-600" data-id="fh2t41ydw" data-path="src/pages/ResetPasswordPage.tsx" /> :

              <AlertCircle className="h-4 w-4 text-red-600" data-id="9apgywdll" data-path="src/pages/ResetPasswordPage.tsx" />
              }
                <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'} data-id="10xeeuax8" data-path="src/pages/ResetPasswordPage.tsx">
                  {message}
                </AlertDescription>
              </Alert>
            }

            <form onSubmit={handleSubmit} className="space-y-4" data-id="d97tkztlr" data-path="src/pages/ResetPasswordPage.tsx">
              {/* Password Field */}
              <div className="space-y-2" data-id="42v14imgh" data-path="src/pages/ResetPasswordPage.tsx">
                <Label htmlFor="password" className="text-slate-700 font-medium" data-id="74qwl0skr" data-path="src/pages/ResetPasswordPage.tsx">New Password</Label>
                <div className="relative" data-id="b3e7hddrf" data-path="src/pages/ResetPasswordPage.tsx">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" data-id="lfx3443mr" data-path="src/pages/ResetPasswordPage.tsx" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-id="zc6r88c9n" data-path="src/pages/ResetPasswordPage.tsx" />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600" data-id="ysc1hlj1y" data-path="src/pages/ResetPasswordPage.tsx">

                    {showPassword ? <EyeOff className="h-4 w-4" data-id="h13dv9gjs" data-path="src/pages/ResetPasswordPage.tsx" /> : <Eye className="h-4 w-4" data-id="du9c3r877" data-path="src/pages/ResetPasswordPage.tsx" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500" data-id="i520b802e" data-path="src/pages/ResetPasswordPage.tsx">Password must be at least 6 characters long</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2" data-id="da1l49887" data-path="src/pages/ResetPasswordPage.tsx">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium" data-id="0u659tl6w" data-path="src/pages/ResetPasswordPage.tsx">Confirm New Password</Label>
                <div className="relative" data-id="0wrnkkphx" data-path="src/pages/ResetPasswordPage.tsx">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" data-id="z6wtvjpi2" data-path="src/pages/ResetPasswordPage.tsx" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-id="eur1s0gtr" data-path="src/pages/ResetPasswordPage.tsx" />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600" data-id="zp9jslwws" data-path="src/pages/ResetPasswordPage.tsx">

                    {showConfirmPassword ? <EyeOff className="h-4 w-4" data-id="2f9yog8zf" data-path="src/pages/ResetPasswordPage.tsx" /> : <Eye className="h-4 w-4" data-id="bfx19cng0" data-path="src/pages/ResetPasswordPage.tsx" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading || !password || !confirmPassword} data-id="75pjsh8tp" data-path="src/pages/ResetPasswordPage.tsx">

                {isLoading ?
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="wa3kktfrr" data-path="src/pages/ResetPasswordPage.tsx" />
                    Resetting Password...
                  </> :

                <>
                    <Lock className="mr-2 h-4 w-4" data-id="3law60b5g" data-path="src/pages/ResetPasswordPage.tsx" />
                    Reset Password
                  </>
                }
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center" data-id="jga3b8h6t" data-path="src/pages/ResetPasswordPage.tsx">
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => navigate('/login')} data-id="nx6c1tfhq" data-path="src/pages/ResetPasswordPage.tsx">

                <ArrowLeft className="mr-2 h-4 w-4" data-id="s1ttobi2d" data-path="src/pages/ResetPasswordPage.tsx" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500" data-id="xxtqp793b" data-path="src/pages/ResetPasswordPage.tsx">
          <p data-id="tcm9vb6sk" data-path="src/pages/ResetPasswordPage.tsx">&copy; 2024 DFS Management Systems. All rights reserved.</p>
        </div>
      </div>
    </div>);

};

export default ResetPasswordPage;