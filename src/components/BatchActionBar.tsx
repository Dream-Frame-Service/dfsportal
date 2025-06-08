import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, X } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  onBatchEdit?: () => void;
  onBatchDelete?: () => void;
  onClearSelection: () => void;
  isLoading?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onBatchEdit,
  onBatchDelete,
  onClearSelection,
  isLoading = false,
  showEdit = true,
  showDelete = true
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4" data-id="0aq0wg9l0" data-path="src/components/BatchActionBar.tsx">
      <div className="flex items-center gap-3" data-id="gz90tg1fw" data-path="src/components/BatchActionBar.tsx">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800" data-id="bomuvx2cj" data-path="src/components/BatchActionBar.tsx">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </Badge>
        
        <div className="flex items-center gap-2" data-id="sxnas9rvj" data-path="src/components/BatchActionBar.tsx">
          {showEdit && onBatchEdit &&
          <Button
            size="sm"
            variant="outline"
            onClick={onBatchEdit}
            disabled={isLoading}
            className="flex items-center gap-2" data-id="1fn5056g4" data-path="src/components/BatchActionBar.tsx">

              <Edit className="h-4 w-4" data-id="kmo5nebba" data-path="src/components/BatchActionBar.tsx" />
              Edit Selected
            </Button>
          }
          
          {showDelete && onBatchDelete &&
          <Button
            size="sm"
            variant="outline"
            onClick={onBatchDelete}
            disabled={isLoading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" data-id="ppxvidknj" data-path="src/components/BatchActionBar.tsx">

              <Trash2 className="h-4 w-4" data-id="86azf1n4e" data-path="src/components/BatchActionBar.tsx" />
              Delete Selected
            </Button>
          }
        </div>
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={onClearSelection}
        disabled={isLoading}
        className="flex items-center gap-2" data-id="x2ekj2amk" data-path="src/components/BatchActionBar.tsx">

        <X className="h-4 w-4" data-id="wk7tpf02e" data-path="src/components/BatchActionBar.tsx" />
        Clear Selection
      </Button>
    </div>);

};

export default BatchActionBar;