import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3, Settings, CheckCircle, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VisualEditToolbarProps {
  className?: string;
  showQuickActions?: boolean;
}

const VisualEditToolbar: React.FC<VisualEditToolbarProps> = ({
  className = '',
  showQuickActions = true
}) => {
  const { isVisualEditingEnabled, canEdit, canDelete, canCreate } = useAuth();

  if (!isVisualEditingEnabled) {
    return null;
  }

  return (
    <Card className={`border-green-200 bg-green-50 ${className}`} data-id="g3g2wynnb" data-path="src/components/VisualEditToolbar.tsx">
      <CardContent className="p-4" data-id="2prjf8tce" data-path="src/components/VisualEditToolbar.tsx">
        <div className="flex items-center justify-between flex-wrap gap-4" data-id="m3wk6y8ci" data-path="src/components/VisualEditToolbar.tsx">
          <div className="flex items-center space-x-3" data-id="jidooxta6" data-path="src/components/VisualEditToolbar.tsx">
            <div className="flex items-center space-x-2" data-id="t8y3owxb2" data-path="src/components/VisualEditToolbar.tsx">
              <CheckCircle className="w-5 h-5 text-green-600" data-id="vrho79fnm" data-path="src/components/VisualEditToolbar.tsx" />
              <span className="font-medium text-green-800" data-id="t1dz1rahp" data-path="src/components/VisualEditToolbar.tsx">Visual Editing Active</span>
            </div>
            <div className="flex items-center space-x-2" data-id="p59c5zli0" data-path="src/components/VisualEditToolbar.tsx">
              {canCreate() &&
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200" data-id="6zg5lyjdi" data-path="src/components/VisualEditToolbar.tsx">
                  <Plus className="w-3 h-3 mr-1" data-id="bemidxlej" data-path="src/components/VisualEditToolbar.tsx" />
                  Create
                </Badge>
              }
              {canEdit() &&
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200" data-id="g44blbdv7" data-path="src/components/VisualEditToolbar.tsx">
                  <Pencil className="w-3 h-3 mr-1" data-id="1abtr3y3k" data-path="src/components/VisualEditToolbar.tsx" />
                  Edit
                </Badge>
              }
              {canDelete() &&
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200" data-id="p5yuu4ezk" data-path="src/components/VisualEditToolbar.tsx">
                  <Trash2 className="w-3 h-3 mr-1" data-id="gc2nd6s69" data-path="src/components/VisualEditToolbar.tsx" />
                  Delete
                </Badge>
              }
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200" data-id="6he5qmdz2" data-path="src/components/VisualEditToolbar.tsx">
                <Eye className="w-3 h-3 mr-1" data-id="pdcw9n5st" data-path="src/components/VisualEditToolbar.tsx" />
                View
              </Badge>
            </div>
          </div>
          
          {showQuickActions &&
          <div className="flex items-center space-x-2" data-id="po019uks7" data-path="src/components/VisualEditToolbar.tsx">
              <span className="text-sm text-green-700" data-id="tl5yqun5y" data-path="src/components/VisualEditToolbar.tsx">All permissions enabled</span>
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800" data-id="26fh4kxhi" data-path="src/components/VisualEditToolbar.tsx">
                <Settings className="w-4 h-4" data-id="jvnnrbwre" data-path="src/components/VisualEditToolbar.tsx" />
              </Button>
            </div>
          }
        </div>
      </CardContent>
    </Card>);

};

export default VisualEditToolbar;