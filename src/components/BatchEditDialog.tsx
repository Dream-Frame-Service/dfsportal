import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

interface BatchEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedCount: number;
  isLoading?: boolean;
  itemName?: string;
  children: React.ReactNode; // Form fields for editing
}

const BatchEditDialog: React.FC<BatchEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedCount,
  isLoading = false,
  itemName = 'items',
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="33dxiz55a" data-path="src/components/BatchEditDialog.tsx">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-id="7s33n6491" data-path="src/components/BatchEditDialog.tsx">
        <DialogHeader data-id="rakbtj1bb" data-path="src/components/BatchEditDialog.tsx">
          <DialogTitle className="flex items-center gap-2" data-id="2ujf26grh" data-path="src/components/BatchEditDialog.tsx">
            <Edit className="h-5 w-5" data-id="aw7s8gcm1" data-path="src/components/BatchEditDialog.tsx" />
            Batch Edit {itemName}
          </DialogTitle>
          <DialogDescription data-id="p0vyfnq7j" data-path="src/components/BatchEditDialog.tsx">
            Editing{' '}
            <Badge variant="secondary" className="mx-1" data-id="an1h1m5ym" data-path="src/components/BatchEditDialog.tsx">
              {selectedCount}
            </Badge>
            {itemName}. Changes will be applied to all selected items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4" data-id="6qcaejntg" data-path="src/components/BatchEditDialog.tsx">
          {children}
        </div>
        
        <DialogFooter data-id="a27fh47gb" data-path="src/components/BatchEditDialog.tsx">
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-id="077umshvg" data-path="src/components/BatchEditDialog.tsx">
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isLoading} data-id="skgmuchp3" data-path="src/components/BatchEditDialog.tsx">
            {isLoading ? 'Saving...' : `Update ${selectedCount} ${itemName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

};

export default BatchEditDialog;