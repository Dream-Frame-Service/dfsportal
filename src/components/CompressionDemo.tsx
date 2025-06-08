import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, FileImage, TrendingDown, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressImage, formatFileSize, isImageFile, type CompressionResult } from '@/utils/imageCompression';

interface CompressionDemoProps {
  className?: string;
}

const CompressionDemo: React.FC<CompressionDemoProps> = ({ className = '' }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressionResult(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      const result = await compressImage(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        quality: 0.8
      });

      setCompressionResult(result);

      if (result.wasCompressed) {
        toast({
          title: 'Compression Complete!',
          description: `File size reduced by ${((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)}%`
        });
      } else {
        toast({
          title: 'No compression needed',
          description: 'File was already optimized or not an image',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Compression failed:', error);
      toast({
        title: 'Compression failed',
        description: 'Could not compress the image',
        variant: 'destructive'
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const resetDemo = () => {
    setSelectedFile(null);
    setCompressionResult(null);
  };

  return (
    <Card className={className} data-id="xsr6sn7vv" data-path="src/components/CompressionDemo.tsx">
      <CardHeader data-id="m4u45o777" data-path="src/components/CompressionDemo.tsx">
        <CardTitle className="flex items-center gap-2" data-id="ow31lr7ow" data-path="src/components/CompressionDemo.tsx">
          <Zap className="h-5 w-5 text-blue-600" data-id="nzjrza5ww" data-path="src/components/CompressionDemo.tsx" />
          Compression Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="loymnlpnn" data-path="src/components/CompressionDemo.tsx">
        {!selectedFile ?
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center" data-id="8jcmvfuu5" data-path="src/components/CompressionDemo.tsx">
            <div className="space-y-3" data-id="riv21ug7v" data-path="src/components/CompressionDemo.tsx">
              <Upload className="h-8 w-8 mx-auto text-gray-400" data-id="2rvarlw89" data-path="src/components/CompressionDemo.tsx" />
              <div data-id="fu9b36vc2" data-path="src/components/CompressionDemo.tsx">
                <p className="text-sm font-medium text-gray-700" data-id="jm218ss1m" data-path="src/components/CompressionDemo.tsx">Select an image to test compression</p>
                <p className="text-xs text-gray-500" data-id="y3wkvcpkt" data-path="src/components/CompressionDemo.tsx">Choose a large image file (&gt;1MB) to see compression in action</p>
              </div>
              <label className="cursor-pointer" data-id="4fe82lx4t" data-path="src/components/CompressionDemo.tsx">
                <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden" data-id="u1wkalqyw" data-path="src/components/CompressionDemo.tsx" />

                <Button variant="outline" className="mt-2" data-id="70r3nh7yf" data-path="src/components/CompressionDemo.tsx">
                  Choose File
                </Button>
              </label>
            </div>
          </div> :

        <div className="space-y-4" data-id="3142hddgy" data-path="src/components/CompressionDemo.tsx">
            {/* Selected file info */}
            <div className="p-3 bg-gray-50 rounded-lg" data-id="vfnirllt1" data-path="src/components/CompressionDemo.tsx">
              <div className="flex items-center justify-between" data-id="ygqa9cmre" data-path="src/components/CompressionDemo.tsx">
                <div className="flex items-center gap-2" data-id="nhtans5n9" data-path="src/components/CompressionDemo.tsx">
                  <FileImage className="h-4 w-4 text-blue-600" data-id="nj3ufjjd0" data-path="src/components/CompressionDemo.tsx" />
                  <span className="text-sm font-medium truncate" data-id="q7s6hzeyq" data-path="src/components/CompressionDemo.tsx">{selectedFile.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={resetDemo} data-id="brqc8pldv" data-path="src/components/CompressionDemo.tsx">
                  <X className="h-4 w-4" data-id="5h3autwzn" data-path="src/components/CompressionDemo.tsx" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-600" data-id="09lkit8vd" data-path="src/components/CompressionDemo.tsx">
                <span data-id="dvn3e7gzo" data-path="src/components/CompressionDemo.tsx">Size: {formatFileSize(selectedFile.size)}</span>
                <span data-id="540wumcwx" data-path="src/components/CompressionDemo.tsx">Type: {selectedFile.type}</span>
                {isImageFile(selectedFile) && selectedFile.size > 1024 * 1024 &&
              <Badge variant="outline" className="text-xs" data-id="1xzyz8a2p" data-path="src/components/CompressionDemo.tsx">
                    <Zap className="h-3 w-3 mr-1" data-id="p5rk3ria2" data-path="src/components/CompressionDemo.tsx" />
                    Will be compressed
                  </Badge>
              }
              </div>
            </div>

            {/* Compression button */}
            <Button
            onClick={handleCompress}
            disabled={isCompressing}
            className="w-full" data-id="763g6d1jk" data-path="src/components/CompressionDemo.tsx">

              {isCompressing ?
            <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" data-id="2dtwdgvjd" data-path="src/components/CompressionDemo.tsx" />
                  Compressing...
                </> :

            <>
                  <Zap className="h-4 w-4 mr-2" data-id="ts1umxfc5" data-path="src/components/CompressionDemo.tsx" />
                  Test Compression
                </>
            }
            </Button>

            {/* Results */}
            {compressionResult &&
          <div className="space-y-3" data-id="0e2tqao00" data-path="src/components/CompressionDemo.tsx">
                <div className="flex items-center gap-2" data-id="byzdhdokb" data-path="src/components/CompressionDemo.tsx">
                  {compressionResult.wasCompressed ?
              <Check className="h-5 w-5 text-green-600" data-id="xfm8i9su5" data-path="src/components/CompressionDemo.tsx" /> :

              <FileImage className="h-5 w-5 text-blue-600" data-id="49rkozvks" data-path="src/components/CompressionDemo.tsx" />
              }
                  <span className="font-medium text-sm" data-id="dufmaegg1" data-path="src/components/CompressionDemo.tsx">
                    {compressionResult.wasCompressed ? 'Compression Complete' : 'No Compression Needed'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm" data-id="zbba7xvp0" data-path="src/components/CompressionDemo.tsx">
                  <div data-id="pzz8kmnxq" data-path="src/components/CompressionDemo.tsx">
                    <p className="text-gray-600" data-id="q9iraffem" data-path="src/components/CompressionDemo.tsx">Original Size</p>
                    <p className="font-medium" data-id="78u0pgcti" data-path="src/components/CompressionDemo.tsx">{formatFileSize(compressionResult.originalSize)}</p>
                  </div>
                  <div data-id="9arypm99w" data-path="src/components/CompressionDemo.tsx">
                    <p className="text-gray-600" data-id="dpctysao0" data-path="src/components/CompressionDemo.tsx">Final Size</p>
                    <p className="font-medium" data-id="bxuf0d1hj" data-path="src/components/CompressionDemo.tsx">{formatFileSize(compressionResult.compressedSize)}</p>
                  </div>
                </div>

                {compressionResult.wasCompressed &&
            <div className="p-3 bg-green-50 rounded-lg" data-id="ubtfx1jx4" data-path="src/components/CompressionDemo.tsx">
                    <div className="flex items-center gap-2 text-green-800" data-id="awpsemh4t" data-path="src/components/CompressionDemo.tsx">
                      <TrendingDown className="h-4 w-4" data-id="vxhrcavgr" data-path="src/components/CompressionDemo.tsx" />
                      <span className="font-medium" data-id="ow1cschc5" data-path="src/components/CompressionDemo.tsx">
                        {((1 - compressionResult.compressedSize / compressionResult.originalSize) * 100).toFixed(1)}% reduction
                      </span>
                    </div>
                    <p className="text-xs text-green-700 mt-1" data-id="owny9aykl" data-path="src/components/CompressionDemo.tsx">
                      Saved {formatFileSize(compressionResult.originalSize - compressionResult.compressedSize)} of storage space
                    </p>
                  </div>
            }
              </div>
          }
          </div>
        }
      </CardContent>
    </Card>);

};

export default CompressionDemo;