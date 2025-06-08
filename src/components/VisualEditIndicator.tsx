import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Edit3, CheckCircle } from 'lucide-react';

interface VisualEditIndicatorProps {
  feature?: string;
  className?: string;
}

const VisualEditIndicator: React.FC<VisualEditIndicatorProps> = ({
  feature = 'all features',
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`} data-id="nt9p158u2" data-path="src/components/VisualEditIndicator.tsx">
      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors" data-id="gcqb6ardq" data-path="src/components/VisualEditIndicator.tsx">
        <CheckCircle className="w-3 h-3 mr-1" data-id="hu5ve97sn" data-path="src/components/VisualEditIndicator.tsx" />
        Visual Editing Enabled
      </Badge>
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors" data-id="3mr1c5gbw" data-path="src/components/VisualEditIndicator.tsx">
        <Edit3 className="w-3 h-3 mr-1" data-id="ytx87hh06" data-path="src/components/VisualEditIndicator.tsx" />
        Full Permissions Active
      </Badge>
    </div>);

};

export default VisualEditIndicator;