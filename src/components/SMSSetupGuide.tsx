import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Settings, CheckCircle } from 'lucide-react';

const SMSSetupGuide: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-id="ycjj1h3xb" data-path="src/components/SMSSetupGuide.tsx">
      <CardHeader data-id="0b787bwd7" data-path="src/components/SMSSetupGuide.tsx">
        <CardTitle className="flex items-center text-blue-700" data-id="iooodfdrl" data-path="src/components/SMSSetupGuide.tsx">
          <MessageSquare className="w-6 h-6 mr-2" data-id="5l3gvh6oi" data-path="src/components/SMSSetupGuide.tsx" />
          SMS Alert Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="zyyoygys7" data-path="src/components/SMSSetupGuide.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="272zrlr5a" data-path="src/components/SMSSetupGuide.tsx">
          <div className="flex items-start space-x-3" data-id="xf25yxvx5" data-path="src/components/SMSSetupGuide.tsx">
            <div className="flex-shrink-0" data-id="xvcef2j4t" data-path="src/components/SMSSetupGuide.tsx">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center" data-id="vqbr306ja" data-path="src/components/SMSSetupGuide.tsx">
                <Phone className="w-4 h-4 text-blue-600" data-id="we0fl3g1q" data-path="src/components/SMSSetupGuide.tsx" />
              </div>
            </div>
            <div data-id="tyjv44ivg" data-path="src/components/SMSSetupGuide.tsx">
              <h4 className="font-semibold text-gray-900" data-id="c9655eln6" data-path="src/components/SMSSetupGuide.tsx">1. Add SMS Contacts</h4>
              <p className="text-sm text-gray-600" data-id="tmw3d9msk" data-path="src/components/SMSSetupGuide.tsx">
                Go to SMS Alert Management → SMS Contacts tab and add mobile numbers
              </p>
              <Badge variant="outline" className="mt-1 text-xs" data-id="bfgjlwjkv" data-path="src/components/SMSSetupGuide.tsx">
                Format: +1234567890
              </Badge>
            </div>
          </div>

          <div className="flex items-start space-x-3" data-id="9d9p5azb2" data-path="src/components/SMSSetupGuide.tsx">
            <div className="flex-shrink-0" data-id="6dkjma0aj" data-path="src/components/SMSSetupGuide.tsx">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" data-id="es4l14681" data-path="src/components/SMSSetupGuide.tsx">
                <Settings className="w-4 h-4 text-green-600" data-id="myrr3f68o" data-path="src/components/SMSSetupGuide.tsx" />
              </div>
            </div>
            <div data-id="ujamvwxkq" data-path="src/components/SMSSetupGuide.tsx">
              <h4 className="font-semibold text-gray-900" data-id="80r2xhevv" data-path="src/components/SMSSetupGuide.tsx">2. Configure Settings</h4>
              <p className="text-sm text-gray-600" data-id="g2hrpqj6n" data-path="src/components/SMSSetupGuide.tsx">
                Set up alert timing and message templates in Alert Settings tab
              </p>
              <Badge variant="outline" className="mt-1 text-xs" data-id="yixxskpap" data-path="src/components/SMSSetupGuide.tsx">
                Default: 30 days before expiry
              </Badge>
            </div>
          </div>

          <div className="flex items-start space-x-3" data-id="oed1rdfx6" data-path="src/components/SMSSetupGuide.tsx">
            <div className="flex-shrink-0" data-id="pcrbl8zdp" data-path="src/components/SMSSetupGuide.tsx">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center" data-id="17zzxgsuh" data-path="src/components/SMSSetupGuide.tsx">
                <CheckCircle className="w-4 h-4 text-purple-600" data-id="n7q20rrh2" data-path="src/components/SMSSetupGuide.tsx" />
              </div>
            </div>
            <div data-id="7wvrqkdzy" data-path="src/components/SMSSetupGuide.tsx">
              <h4 className="font-semibold text-gray-900" data-id="8i4b6u0ee" data-path="src/components/SMSSetupGuide.tsx">3. Test SMS</h4>
              <p className="text-sm text-gray-600" data-id="04v8x3jvl" data-path="src/components/SMSSetupGuide.tsx">
                Click "Send Test SMS" to verify your phone number receives messages
              </p>
              <Badge variant="outline" className="mt-1 text-xs" data-id="8pf5qjy45" data-path="src/components/SMSSetupGuide.tsx">
                Check your mobile device
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-200 pt-4" data-id="fw0nlgjuh" data-path="src/components/SMSSetupGuide.tsx">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3" data-id="0lgz1j94t" data-path="src/components/SMSSetupGuide.tsx">
            <h5 className="font-medium text-yellow-800 mb-1" data-id="dgqzt0uvz" data-path="src/components/SMSSetupGuide.tsx">📱 Important Notes:</h5>
            <ul className="text-sm text-yellow-700 space-y-1" data-id="qy5ww80lo" data-path="src/components/SMSSetupGuide.tsx">
              <li data-id="vvuzgnt93" data-path="src/components/SMSSetupGuide.tsx">• Phone numbers must be in international format (+1 for US/Canada)</li>
              <li data-id="luca6742e" data-path="src/components/SMSSetupGuide.tsx">• SMS service uses TextBelt for testing (free tier has limitations)</li>
              <li data-id="m8bmmwep4" data-path="src/components/SMSSetupGuide.tsx">• For production, configure a premium SMS provider (Twilio, AWS SNS)</li>
              <li data-id="w3sw1mit2" data-path="src/components/SMSSetupGuide.tsx">• Test SMS will be sent to ALL active contacts</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default SMSSetupGuide;
