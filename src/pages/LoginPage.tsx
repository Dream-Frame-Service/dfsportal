import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Mail, Lock, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';


type AuthMode = 'login' | 'register' | 'forgot-password';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const { signIn, signUp, resetPassword, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setMessage(error.message);
        setMessageType('error');
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMessage('Password reset link has been sent to your email address');
        setMessageType('success');
        toast({
          title: "Success",
          description: "Password reset link sent to your email"
        });
        setTimeout(() => {
          setAuthMode('login');
          clearForm();
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (authMode === 'forgot-password') {
      return handleForgotPassword(e);
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password);
        if (!error) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in"
          });
          navigate('/dashboard');
        } else {
          setMessage(error.message);
          setMessageType('error');
        }
      } else if (authMode === 'register') {
        const { error } = await signUp(email, password);
        if (!error) {
          setMessage('Account created successfully! Please check your email for verification.');
          setMessageType('success');
          toast({
            title: "Account Created",
            description: "Please check your email for verification"
          });
          setTimeout(() => {
            setAuthMode('login');
            clearForm();
          }, 3000);
        } else {
          setMessage(error.message);
          setMessageType('error');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessage(errorMessage);
      setMessageType('error');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getFormTitle = () => {
    switch (authMode) {
      case 'login':return 'Welcome Back';
      case 'register':return 'Create Account';
      case 'forgot-password':return 'Reset Password';
      default:return 'Sign In';
    }
  };

  const getFormDescription = () => {
    switch (authMode) {
      case 'login':return 'Enter your credentials to access the portal';
      case 'register':return 'Create a new account to get started';
      case 'forgot-password':return 'Enter your email to receive a password reset link';
      default:return '';
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return 'Please wait...';
    switch (authMode) {
      case 'login':return 'Sign In';
      case 'register':return 'Create Account';
      case 'forgot-password':return 'Send Reset Link';
      default:return 'Submit';
    }
  };

  const getSubmitButtonIcon = () => {
    if (loading) return <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="vvzw0qnje" data-path="src/pages/LoginPage.tsx" />;
    switch (authMode) {
      case 'login':return <LogIn className="mr-2 h-4 w-4" data-id="7z4t0t8ky" data-path="src/pages/LoginPage.tsx" />;
      case 'register':return <UserPlus className="mr-2 h-4 w-4" data-id="i8zrm8lbg" data-path="src/pages/LoginPage.tsx" />;
      case 'forgot-password':return <Mail className="mr-2 h-4 w-4" data-id="a44hnevqk" data-path="src/pages/LoginPage.tsx" />;
      default:return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" data-id="l2x1li2t5" data-path="src/pages/LoginPage.tsx">
      <div className="flex items-center justify-center p-4 min-h-screen" data-id="gjn5ll2kk" data-path="src/pages/LoginPage.tsx">
        <div className="w-full max-w-md" data-id="jhjfy039g" data-path="src/pages/LoginPage.tsx">
        {/* Logo and Company Name */}
        <div className="text-center mb-8" data-id="rq6vbuqss" data-path="src/pages/LoginPage.tsx">
          <div className="flex flex-col items-center" data-id="1wp02bgiu" data-path="src/pages/LoginPage.tsx">
            <div className="mb-4 transform hover:scale-105 transition-transform duration-200" data-id="4vshqpwf7" data-path="src/pages/LoginPage.tsx">
              <Logo size="xl" showText={false} className="mb-4" data-id="zu56lqzhr" data-path="src/pages/LoginPage.tsx" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2" data-id="yu886bozh" data-path="src/pages/LoginPage.tsx">
              DFS Manager Portal
            </h1>
            <p className="text-slate-600 font-medium" data-id="vqlhciznd" data-path="src/pages/LoginPage.tsx">Gas Station Management System</p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95" data-id="f0i8rryu3" data-path="src/pages/LoginPage.tsx">
          <CardHeader className="space-y-1 pb-6" data-id="6qjh22mrn" data-path="src/pages/LoginPage.tsx">
            <CardTitle className="text-2xl font-bold text-center text-slate-800" data-id="5ji5apmyx" data-path="src/pages/LoginPage.tsx">
              {getFormTitle()}
            </CardTitle>
            <CardDescription className="text-center text-slate-600" data-id="hcjheekl1" data-path="src/pages/LoginPage.tsx">
              {getFormDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent data-id="1c0vgqqv8" data-path="src/pages/LoginPage.tsx">
            {message &&
              <Alert className={`mb-4 ${messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`} data-id="6wkxm01r6" data-path="src/pages/LoginPage.tsx">
                {messageType === 'success' ?
                <CheckCircle2 className="h-4 w-4 text-green-600" data-id="0byobyvoj" data-path="src/pages/LoginPage.tsx" /> :

                <AlertCircle className="h-4 w-4 text-red-600" data-id="8i1q65grn" data-path="src/pages/LoginPage.tsx" />
                }
                <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'} data-id="hv52jqdv3" data-path="src/pages/LoginPage.tsx">
                  {message}
                </AlertDescription>
              </Alert>
              }

            <form onSubmit={handleSubmit} className="space-y-4" data-id="ko5sxb44f" data-path="src/pages/LoginPage.tsx">
              {/* Email Field */}
              <div className="space-y-2" data-id="wob81wdbs" data-path="src/pages/LoginPage.tsx">
                <Label htmlFor="email" className="text-slate-700 font-medium" data-id="c4t9jbvi7" data-path="src/pages/LoginPage.tsx">Email Address</Label>
                <div className="relative" data-id="4gkxupm8z" data-path="src/pages/LoginPage.tsx">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" data-id="52fcjkm2m" data-path="src/pages/LoginPage.tsx" />
                  <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-id="2xzzs2py7" data-path="src/pages/LoginPage.tsx" />

                </div>
              </div>

              {/* Password Field */}
              {authMode !== 'forgot-password' &&
                <div className="space-y-2" data-id="cozmvmhu4" data-path="src/pages/LoginPage.tsx">
                  <Label htmlFor="password" className="text-slate-700 font-medium" data-id="0giglj74c" data-path="src/pages/LoginPage.tsx">Password</Label>
                  <div className="relative" data-id="efgorijtx" data-path="src/pages/LoginPage.tsx">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" data-id="4s89t4v82" data-path="src/pages/LoginPage.tsx" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-id="c1ass35rn" data-path="src/pages/LoginPage.tsx" />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600" data-id="uabn2ylgi" data-path="src/pages/LoginPage.tsx">

                      {showPassword ? <EyeOff className="h-4 w-4" data-id="c52k1mmaj" data-path="src/pages/LoginPage.tsx" /> : <Eye className="h-4 w-4" data-id="rvyoo10vx" data-path="src/pages/LoginPage.tsx" />}
                    </button>
                  </div>
                </div>
                }

              {/* Confirm Password Field */}
              {authMode === 'register' &&
                <div className="space-y-2" data-id="p7ux041vi" data-path="src/pages/LoginPage.tsx">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium" data-id="acc0apzqz" data-path="src/pages/LoginPage.tsx">Confirm Password</Label>
                  <div className="relative" data-id="uui7a7s0l" data-path="src/pages/LoginPage.tsx">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" data-id="pry3u41id" data-path="src/pages/LoginPage.tsx" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-id="vvyxbyhz0" data-path="src/pages/LoginPage.tsx" />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600" data-id="q8rddb71u" data-path="src/pages/LoginPage.tsx">

                      {showConfirmPassword ? <EyeOff className="h-4 w-4" data-id="b1wn8zcnx" data-path="src/pages/LoginPage.tsx" /> : <Eye className="h-4 w-4" data-id="6sejlsvlj" data-path="src/pages/LoginPage.tsx" />}
                    </button>
                  </div>
                </div>
                }

              {/* Forgot Password Link */}
              {authMode === 'login' &&
                <div className="text-right" data-id="hpseh5ri0" data-path="src/pages/LoginPage.tsx">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm"
                    onClick={() => {
                      setAuthMode('forgot-password');
                      setPassword('');
                      setMessage('');
                    }} data-id="8txeeww12" data-path="src/pages/LoginPage.tsx">

                    Forgot password?
                  </Button>
                </div>
                }

              {/* Submit Button */}
              <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={loading} data-id="ucima2lp4" data-path="src/pages/LoginPage.tsx">

                {getSubmitButtonIcon()}
                {getSubmitButtonText()}
              </Button>
            </form>

            {/* Auth Mode Switcher */}
            <div className="mt-6" data-id="1srgn86ni" data-path="src/pages/LoginPage.tsx">
              <Separator className="my-4" data-id="rv30gigct" data-path="src/pages/LoginPage.tsx" />
              <div className="text-center space-y-2" data-id="lhuxmwo33" data-path="src/pages/LoginPage.tsx">
                {authMode === 'login' &&
                  <div data-id="wt94m5i8c" data-path="src/pages/LoginPage.tsx">
                    <span className="text-sm text-slate-600" data-id="6t0bdylcu" data-path="src/pages/LoginPage.tsx">Don't have an account? </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setAuthMode('register');
                        clearForm();
                      }} data-id="prnd21mgl" data-path="src/pages/LoginPage.tsx">

                      Create one
                    </Button>
                  </div>
                  }

                {authMode === 'register' &&
                  <div data-id="il0pj01vz" data-path="src/pages/LoginPage.tsx">
                    <span className="text-sm text-slate-600" data-id="ovynygwin" data-path="src/pages/LoginPage.tsx">Already have an account? </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setAuthMode('login');
                        clearForm();
                      }} data-id="bgtcwipo4" data-path="src/pages/LoginPage.tsx">

                      Sign in
                    </Button>
                  </div>
                  }

                {authMode === 'forgot-password' &&
                  <div data-id="zerql7jsc" data-path="src/pages/LoginPage.tsx">
                    <span className="text-sm text-slate-600" data-id="rirhb5dcm" data-path="src/pages/LoginPage.tsx">Remember your password? </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setAuthMode('login');
                        clearForm();
                      }} data-id="7v3409vz4" data-path="src/pages/LoginPage.tsx">

                      Sign in
                    </Button>
                  </div>
                  }
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-slate-500" data-id="uzd26sn75" data-path="src/pages/LoginPage.tsx">
            <p data-id="bnjw7t0yg" data-path="src/pages/LoginPage.tsx">&copy; 2024 DFS Management Systems. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>);


};

export default LoginPage;
