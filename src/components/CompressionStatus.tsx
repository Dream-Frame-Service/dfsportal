import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, FileImage, TrendingDown, Check } from 'lucide-react';
import { formatFileSize, type CompressionResult } from '@/utils/imageCompression';

interface CompressionStatusProps {
  result: CompressionResult;
  className?: string;
}

const CompressionStatus: React.FC<CompressionStatusProps> = ({ result, className = '' }) => {
  if (!result.wasCompressed) {
    return null;
  }

  const savingsPercentage = ((result.originalSize - result.compressedSize) / result.originalSize * 100).toFixed(1);

  return (
    <Card className={`border-green-200 bg-green-50 ${className}`} data-id="d2iwbjw4f" data-path="src/components/CompressionStatus.tsx">
      <CardContent className="p-4" data-id="9kgoqdbjj" data-path="src/components/CompressionStatus.tsx">
        <div className="flex items-start gap-3" data-id="koms1kx8p" data-path="src/components/CompressionStatus.tsx">
          <div className="p-2 bg-green-100 rounded-full" data-id="2kwzkm1tn" data-path="src/components/CompressionStatus.tsx">
            <Zap className="h-4 w-4 text-green-600" data-id="nr5p1hw3b" data-path="src/components/CompressionStatus.tsx" />
          </div>
          
          <div className="flex-1 space-y-2" data-id="u76ig4hvy" data-path="src/components/CompressionStatus.tsx">
            <div className="flex items-center gap-2" data-id="x1n6gaftm" data-path="src/components/CompressionStatus.tsx">
              <Check className="h-4 w-4 text-green-600" data-id="q0j89fx66" data-path="src/components/CompressionStatus.tsx" />
              <span className="font-medium text-green-800" data-id="4go0wuzm1" data-path="src/components/CompressionStatus.tsx">Image Compressed Successfully</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm" data-id="ccxfybhnp" data-path="src/components/CompressionStatus.tsx">
              <div className="space-y-1" data-id="7cwlx0qux" data-path="src/components/CompressionStatus.tsx">
                <p className="text-gray-600" data-id="3y22jrwwq" data-path="src/components/CompressionStatus.tsx">Original Size</p>
                <Badge variant="outline" className="text-xs" data-id="ze95kupn9" data-path="src/components/CompressionStatus.tsx">
                  <FileImage className="h-3 w-3 mr-1" data-id="t4w6tvqwu" data-path="src/components/CompressionStatus.tsx" />
                  {formatFileSize(result.originalSize)}
                </Badge>
              </div>
              
              <div className="space-y-1" data-id="ml4a2orla" data-path="src/components/CompressionStatus.tsx">
                <p className="text-gray-600" data-id="icd1uu1dl" data-path="src/components/CompressionStatus.tsx">Compressed Size</p>
                <Badge variant="outline" className="text-xs bg-green-100 border-green-300" data-id="zt8s3h2sc" data-path="src/components/CompressionStatus.tsx">
                  <FileImage className="h-3 w-3 mr-1" data-id="chnkp9235" data-path="src/components/CompressionStatus.tsx" />
                  {formatFileSize(result.compressedSize)}
                </Badge>
              </div>
              
              <div className="space-y-1" data-id="1cdz9neli" data-path="src/components/CompressionStatus.tsx">
                <p className="text-gray-600" data-id="clelyo5em" data-path="src/components/CompressionStatus.tsx">Space Saved</p>
                <Badge variant="default" className="text-xs bg-green-600" data-id="hxst0s0ad" data-path="src/components/CompressionStatus.tsx">
                  <TrendingDown className="h-3 w-3 mr-1" data-id="5llgvp5z7" data-path="src/components/CompressionStatus.tsx" />
                  {savingsPercentage}%
                </Badge>
              </div>
              
              <div className="space-y-1" data-id="6agl45nlk" data-path="src/components/CompressionStatus.tsx">
                <p className="text-gray-600" data-id="q2flvgy9h" data-path="src/components/CompressionStatus.tsx">Compression Ratio</p>
                <Badge variant="outline" className="text-xs" data-id="kq27jlhmi" data-path="src/components/CompressionStatus.tsx">
                  {result.compressionRatio.toFixed(1)}:1
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-green-700" data-id="5kvg8egsm" data-path="src/components/CompressionStatus.tsx">
              Your image has been optimized for faster uploads and better performance while maintaining visual quality.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default CompressionStatus;