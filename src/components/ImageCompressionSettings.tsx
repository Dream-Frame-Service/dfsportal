import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Settings, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompressionSettings {
  enabled: boolean;
  maxSizeMB: number;
  quality: number;
  maxResolution: number;
  autoCompress: boolean;
}

interface ImageCompressionSettingsProps {
  className?: string;
  onSettingsChange?: (settings: CompressionSettings) => void;
}

const DEFAULT_SETTINGS: CompressionSettings = {
  enabled: true,
  maxSizeMB: 1,
  quality: 0.8,
  maxResolution: 1920,
  autoCompress: true
};

const ImageCompressionSettings: React.FC<ImageCompressionSettingsProps> = ({
  className = '',
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('imageCompressionSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to load compression settings:', error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('imageCompressionSettings');
    const currentSettings = JSON.stringify(settings);
    const originalSettings = savedSettings || JSON.stringify(DEFAULT_SETTINGS);
    setHasChanges(currentSettings !== originalSettings);
  }, [settings]);

  const updateSetting = <K extends keyof CompressionSettings,>(
  key: K,
  value: CompressionSettings[K]) =>
  {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('imageCompressionSettings', JSON.stringify(settings));
      onSettingsChange?.(settings);
      setHasChanges(false);
      toast({
        title: 'Settings Saved',
        description: 'Image compression settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Failed to Save',
        description: 'Could not save compression settings.',
        variant: 'destructive'
      });
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: 'Settings Reset',
      description: 'Compression settings have been reset to defaults.'
    });
  };

  const qualityPercentage = Math.round(settings.quality * 100);

  return (
    <Card className={className} data-id="xj2j2v9z5" data-path="src/components/ImageCompressionSettings.tsx">
      <CardHeader data-id="26fh75al8" data-path="src/components/ImageCompressionSettings.tsx">
        <CardTitle className="flex items-center gap-2" data-id="bfzxrmky5" data-path="src/components/ImageCompressionSettings.tsx">
          <Zap className="h-5 w-5 text-blue-600" data-id="rbtbsibr4" data-path="src/components/ImageCompressionSettings.tsx" />
          Image Compression Settings
          {settings.enabled &&
          <Badge variant="default" className="ml-2" data-id="5gs6l2fqb" data-path="src/components/ImageCompressionSettings.tsx">
              <Settings className="h-3 w-3 mr-1" data-id="gq9uoar6o" data-path="src/components/ImageCompressionSettings.tsx" />
              Active
            </Badge>
          }
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6" data-id="31haonsv7" data-path="src/components/ImageCompressionSettings.tsx">
        {/* Enable/Disable compression */}
        <div className="flex items-center justify-between" data-id="ltkjvvhy1" data-path="src/components/ImageCompressionSettings.tsx">
          <div className="space-y-0.5" data-id="sh1s74gp7" data-path="src/components/ImageCompressionSettings.tsx">
            <Label className="text-base" data-id="nrwtpd44k" data-path="src/components/ImageCompressionSettings.tsx">Enable Auto-Compression</Label>
            <p className="text-sm text-gray-600" data-id="3rbywx7t8" data-path="src/components/ImageCompressionSettings.tsx">
              Automatically compress large images during upload
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)} data-id="flr23n74q" data-path="src/components/ImageCompressionSettings.tsx" />

        </div>

        {settings.enabled &&
        <>
            {/* Auto-compress threshold */}
            <div className="space-y-3" data-id="dyla9pt5u" data-path="src/components/ImageCompressionSettings.tsx">
              <div className="flex items-center justify-between" data-id="yel82qok1" data-path="src/components/ImageCompressionSettings.tsx">
                <Label data-id="cs2a1py6n" data-path="src/components/ImageCompressionSettings.tsx">Compression Threshold</Label>
                <Badge variant="outline" data-id="78dyxtha5" data-path="src/components/ImageCompressionSettings.tsx">{settings.maxSizeMB}MB</Badge>
              </div>
              <Slider
              value={[settings.maxSizeMB]}
              onValueChange={([value]) => updateSetting('maxSizeMB', value)}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full" data-id="q1qmvtqq0" data-path="src/components/ImageCompressionSettings.tsx" />

              <p className="text-xs text-gray-600" data-id="xmk3zj8go" data-path="src/components/ImageCompressionSettings.tsx">
                Images larger than this size will be compressed
              </p>
            </div>

            {/* Quality setting */}
            <div className="space-y-3" data-id="zyyt0t8im" data-path="src/components/ImageCompressionSettings.tsx">
              <div className="flex items-center justify-between" data-id="d2nk887fd" data-path="src/components/ImageCompressionSettings.tsx">
                <Label data-id="559bwkd8w" data-path="src/components/ImageCompressionSettings.tsx">Compression Quality</Label>
                <Badge variant="outline" data-id="tw6a0coh0" data-path="src/components/ImageCompressionSettings.tsx">{qualityPercentage}%</Badge>
              </div>
              <Slider
              value={[settings.quality]}
              onValueChange={([value]) => updateSetting('quality', value)}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full" data-id="r9nnye8or" data-path="src/components/ImageCompressionSettings.tsx" />

              <p className="text-xs text-gray-600" data-id="vs4cs9juf" data-path="src/components/ImageCompressionSettings.tsx">
                Higher quality means larger file sizes
              </p>
            </div>

            {/* Maximum resolution */}
            <div className="space-y-3" data-id="98tiyvus1" data-path="src/components/ImageCompressionSettings.tsx">
              <div className="flex items-center justify-between" data-id="o7gdn1mrd" data-path="src/components/ImageCompressionSettings.tsx">
                <Label data-id="dq077lxd2" data-path="src/components/ImageCompressionSettings.tsx">Maximum Resolution</Label>
                <Badge variant="outline" data-id="eqnp7h0r8" data-path="src/components/ImageCompressionSettings.tsx">{settings.maxResolution}px</Badge>
              </div>
              <Slider
              value={[settings.maxResolution]}
              onValueChange={([value]) => updateSetting('maxResolution', value)}
              max={4096}
              min={720}
              step={240}
              className="w-full" data-id="o44t3ohtt" data-path="src/components/ImageCompressionSettings.tsx" />

              <p className="text-xs text-gray-600" data-id="nmwco0bbs" data-path="src/components/ImageCompressionSettings.tsx">
                Maximum width or height for compressed images
              </p>
            </div>

            {/* Auto-compress all images */}
            <div className="flex items-center justify-between" data-id="2vo15gsh0" data-path="src/components/ImageCompressionSettings.tsx">
              <div className="space-y-0.5" data-id="71r817yvi" data-path="src/components/ImageCompressionSettings.tsx">
                <Label data-id="ywkgc287i" data-path="src/components/ImageCompressionSettings.tsx">Auto-compress All Images</Label>
                <p className="text-sm text-gray-600" data-id="c6aw023kw" data-path="src/components/ImageCompressionSettings.tsx">
                  Compress all images regardless of size
                </p>
              </div>
              <Switch
              checked={settings.autoCompress}
              onCheckedChange={(checked) => updateSetting('autoCompress', checked)} data-id="go6aglwwm" data-path="src/components/ImageCompressionSettings.tsx" />

            </div>
          </>
        }

        {/* Compression preview/info */}
        <div className="p-3 bg-gray-50 rounded-lg" data-id="8qabtpxov" data-path="src/components/ImageCompressionSettings.tsx">
          <h4 className="text-sm font-medium mb-2" data-id="eou98vxg9" data-path="src/components/ImageCompressionSettings.tsx">Current Settings Summary</h4>
          <div className="space-y-1 text-xs text-gray-600" data-id="4426he896" data-path="src/components/ImageCompressionSettings.tsx">
            <p data-id="79u3sefqj" data-path="src/components/ImageCompressionSettings.tsx">Status: {settings.enabled ? 'Enabled' : 'Disabled'}</p>
            {settings.enabled &&
            <>
                <p data-id="k5gqipb8v" data-path="src/components/ImageCompressionSettings.tsx">Threshold: Images over {settings.maxSizeMB}MB will be compressed</p>
                <p data-id="stf01jhme" data-path="src/components/ImageCompressionSettings.tsx">Quality: {qualityPercentage}% (balance of quality vs. file size)</p>
                <p data-id="0n5twu4tu" data-path="src/components/ImageCompressionSettings.tsx">Max Resolution: {settings.maxResolution}px (width or height)</p>
                <p data-id="v3hytj3ft" data-path="src/components/ImageCompressionSettings.tsx">Auto-compress: {settings.autoCompress ? 'All images' : 'Large images only'}</p>
              </>
            }
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2" data-id="ia2rljsbn" data-path="src/components/ImageCompressionSettings.tsx">
          <Button
            onClick={saveSettings}
            disabled={!hasChanges}
            className="flex-1" data-id="odhv900ka" data-path="src/components/ImageCompressionSettings.tsx">

            <Save className="h-4 w-4 mr-2" data-id="kprag1kmi" data-path="src/components/ImageCompressionSettings.tsx" />
            Save Settings
          </Button>
          <Button
            variant="outline"
            onClick={resetSettings} data-id="9sr3xbsvt" data-path="src/components/ImageCompressionSettings.tsx">

            <RotateCcw className="h-4 w-4 mr-2" data-id="kr34hpxuf" data-path="src/components/ImageCompressionSettings.tsx" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>);

};

export default ImageCompressionSettings;
