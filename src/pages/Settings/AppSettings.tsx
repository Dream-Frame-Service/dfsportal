import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Zap, Bell, Database, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageCompressionSettings from '@/components/ImageCompressionSettings';
import CompressionDemo from '@/components/CompressionDemo';

const AppSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6" data-id="jrimbwgiq" data-path="src/pages/Settings/AppSettings.tsx">
      {/* Header */}
      <div className="flex items-center gap-4" data-id="6f4xib8ua" data-path="src/pages/Settings/AppSettings.tsx">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2" data-id="hc8c877kp" data-path="src/pages/Settings/AppSettings.tsx">

          <ArrowLeft className="h-4 w-4" data-id="q5wqlmnv4" data-path="src/pages/Settings/AppSettings.tsx" />
          Back to Dashboard
        </Button>
        <div data-id="jsageh2k0" data-path="src/pages/Settings/AppSettings.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-id="tr5pmwu9n" data-path="src/pages/Settings/AppSettings.tsx">App Settings</h1>
          <p className="text-gray-600" data-id="2svtbop23" data-path="src/pages/Settings/AppSettings.tsx">Configure system preferences and optimize performance</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" data-id="zy3toji9h" data-path="src/pages/Settings/AppSettings.tsx">
        <div className="xl:col-span-2" data-id="fbby74pgg" data-path="src/pages/Settings/AppSettings.tsx">
          <ImageCompressionSettings data-id="vjldtilid" data-path="src/pages/Settings/AppSettings.tsx" />
        </div>
        
        <div className="xl:col-span-1" data-id="kwwcr2wx3" data-path="src/pages/Settings/AppSettings.tsx">
          <CompressionDemo data-id="8yv5sthlv" data-path="src/pages/Settings/AppSettings.tsx" />
        </div>
        
        <div className="xl:col-span-1 space-y-4" data-id="1hzjuamt5" data-path="src/pages/Settings/AppSettings.tsx">
          {/* Information Card */}
          <Card data-id="2om41xro5" data-path="src/pages/Settings/AppSettings.tsx">
            <CardHeader data-id="i9b6btm0m" data-path="src/pages/Settings/AppSettings.tsx">
              <CardTitle className="text-lg flex items-center gap-2" data-id="4idvpbh9v" data-path="src/pages/Settings/AppSettings.tsx">
                <Zap className="h-5 w-5 text-blue-600" data-id="5hdhm3jrv" data-path="src/pages/Settings/AppSettings.tsx" />
                About Image Compression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" data-id="hwk2v33f8" data-path="src/pages/Settings/AppSettings.tsx">
              <div className="text-sm text-gray-600 space-y-2" data-id="jvwy1fi7u" data-path="src/pages/Settings/AppSettings.tsx">
                <p data-id="t0rd7auh9" data-path="src/pages/Settings/AppSettings.tsx">
                  <strong data-id="fsux5nztl" data-path="src/pages/Settings/AppSettings.tsx">Automatic compression</strong> helps reduce file sizes for faster uploads and better storage efficiency.
                </p>
                <p data-id="euc3800tf" data-path="src/pages/Settings/AppSettings.tsx">
                  Large images are automatically optimized while maintaining visual quality, making your application faster and more responsive.
                </p>
              </div>
              
              <div className="space-y-2" data-id="bed1htnct" data-path="src/pages/Settings/AppSettings.tsx">
                <h4 className="font-medium text-sm" data-id="x49jqdopx" data-path="src/pages/Settings/AppSettings.tsx">Benefits:</h4>
                <ul className="text-xs text-gray-600 space-y-1" data-id="t8vwbph0z" data-path="src/pages/Settings/AppSettings.tsx">
                  <li data-id="3f6s44yhn" data-path="src/pages/Settings/AppSettings.tsx">• Faster upload times</li>
                  <li data-id="uwi06kuym" data-path="src/pages/Settings/AppSettings.tsx">• Reduced bandwidth usage</li>
                  <li data-id="fjdgsebnn" data-path="src/pages/Settings/AppSettings.tsx">• Better storage efficiency</li>
                  <li data-id="pahz3vkhp" data-path="src/pages/Settings/AppSettings.tsx">• Improved app performance</li>
                  <li data-id="6wgbctfkp" data-path="src/pages/Settings/AppSettings.tsx">• Maintained image quality</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card data-id="li2jwgufe" data-path="src/pages/Settings/AppSettings.tsx">
            <CardHeader data-id="5592hy0af" data-path="src/pages/Settings/AppSettings.tsx">
              <CardTitle className="text-lg flex items-center gap-2" data-id="b8f95bpze" data-path="src/pages/Settings/AppSettings.tsx">
                <Database className="h-5 w-5 text-green-600" data-id="j29wj6p05" data-path="src/pages/Settings/AppSettings.tsx" />
                Compression Stats
              </CardTitle>
            </CardHeader>
            <CardContent data-id="07xprbhwj" data-path="src/pages/Settings/AppSettings.tsx">
              <div className="space-y-3" data-id="ax5t95qgt" data-path="src/pages/Settings/AppSettings.tsx">
                <div className="flex justify-between" data-id="3m57pbe3e" data-path="src/pages/Settings/AppSettings.tsx">
                  <span className="text-sm text-gray-600" data-id="3vvwqkoi0" data-path="src/pages/Settings/AppSettings.tsx">Files Compressed Today</span>
                  <Badge variant="secondary" data-id="6cxhvcthj" data-path="src/pages/Settings/AppSettings.tsx">0</Badge>
                </div>
                <div className="flex justify-between" data-id="t0bjph6bi" data-path="src/pages/Settings/AppSettings.tsx">
                  <span className="text-sm text-gray-600" data-id="c1lqjxt44" data-path="src/pages/Settings/AppSettings.tsx">Storage Saved</span>
                  <Badge variant="secondary" data-id="kk6cqt4yf" data-path="src/pages/Settings/AppSettings.tsx">0 MB</Badge>
                </div>
                <div className="flex justify-between" data-id="8oxo0s8kh" data-path="src/pages/Settings/AppSettings.tsx">
                  <span className="text-sm text-gray-600" data-id="djr7btum7" data-path="src/pages/Settings/AppSettings.tsx">Average Compression</span>
                  <Badge variant="secondary" data-id="z9y7nijz6" data-path="src/pages/Settings/AppSettings.tsx">N/A</Badge>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3" data-id="5s2i2xizg" data-path="src/pages/Settings/AppSettings.tsx">
                Statistics will update as you upload and compress images.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card data-id="tf71npsma" data-path="src/pages/Settings/AppSettings.tsx">
            <CardHeader data-id="w677sp0my" data-path="src/pages/Settings/AppSettings.tsx">
              <CardTitle className="text-lg flex items-center gap-2" data-id="4evc242iq" data-path="src/pages/Settings/AppSettings.tsx">
                <Settings className="h-5 w-5 text-purple-600" data-id="6phtkdbxp" data-path="src/pages/Settings/AppSettings.tsx" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" data-id="05j1bjci8" data-path="src/pages/Settings/AppSettings.tsx">
              <Button variant="outline" className="w-full text-sm" disabled data-id="wp5f11ouw" data-path="src/pages/Settings/AppSettings.tsx">
                <Bell className="h-4 w-4 mr-2" data-id="s7i3exmml" data-path="src/pages/Settings/AppSettings.tsx" />
                Notification Settings
                <Badge variant="secondary" className="ml-auto" data-id="1h86fqago" data-path="src/pages/Settings/AppSettings.tsx">Soon</Badge>
              </Button>
              <Button variant="outline" className="w-full text-sm" disabled data-id="n63sbczbd" data-path="src/pages/Settings/AppSettings.tsx">
                <Shield className="h-4 w-4 mr-2" data-id="ccfrucanu" data-path="src/pages/Settings/AppSettings.tsx" />
                Security Settings
                <Badge variant="secondary" className="ml-auto" data-id="9zevwnl3u" data-path="src/pages/Settings/AppSettings.tsx">Soon</Badge>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};

export default AppSettings;