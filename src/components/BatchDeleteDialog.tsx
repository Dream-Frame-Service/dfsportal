import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface BatchDeleteDialogProps<T = Record<string, unknown>> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isLoading?: boolean;
  itemName?: string; // e.g., "users", "stations", "logs"
  selectedItems?: T[]; // Optional: show preview of items to be deleted
}

const BatchDeleteDialog: React.FC<BatchDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
  itemName = 'items',
  selectedItems = []
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose} data-id="tunntr6ru" data-path="src/components/BatchDeleteDialog.tsx">
      <AlertDialogContent className="max-w-md" data-id="ig084uzkk" data-path="src/components/BatchDeleteDialog.tsx">
        <AlertDialogHeader data-id="gsqsea6wq" data-path="src/components/BatchDeleteDialog.tsx">
          <AlertDialogTitle className="flex items-center gap-2 text-red-600" data-id="bjqp14ayz" data-path="src/components/BatchDeleteDialog.tsx">
            <Trash2 className="h-5 w-5" data-id="7fjuau142" data-path="src/components/BatchDeleteDialog.tsx" />
            Confirm Batch Delete
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3" data-id="qwboeaq7q" data-path="src/components/BatchDeleteDialog.tsx">
            <div data-id="qrgp5x81h" data-path="src/components/BatchDeleteDialog.tsx">
              Are you sure you want to delete{' '}
              <Badge variant="destructive" className="mx-1" data-id="f5igh3ggy" data-path="src/components/BatchDeleteDialog.tsx">
                {selectedCount}
              </Badge>
              {itemName}? This action cannot be undone.
            </div>
            
            {selectedItems.length > 0 && selectedItems.length <= 5 &&
            <div className="mt-4" data-id="cot1ftlzr" data-path="src/components/BatchDeleteDialog.tsx">
                <p className="text-sm font-medium text-gray-700 mb-2" data-id="yvn0rf523" data-path="src/components/BatchDeleteDialog.tsx">Items to be deleted:</p>
                <div className="space-y-1" data-id="thj5d0ojx" data-path="src/components/BatchDeleteDialog.tsx">
                  {selectedItems.map((item, index) =>
                <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded" data-id="i72auv86j" data-path="src/components/BatchDeleteDialog.tsx">
                      {item.name || item.title || item.id || 'Unknown item'}
                    </div>
                )}
                </div>
              </div>
            }
            
            {selectedItems.length > 5 &&
            <div className="mt-4" data-id="95dav1yn9" data-path="src/components/BatchDeleteDialog.tsx">
                <p className="text-sm text-gray-600" data-id="5vifoq4rf" data-path="src/components/BatchDeleteDialog.tsx">
                  {selectedCount} {itemName} will be permanently deleted.
                </p>
              </div>
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter data-id="oxayl72pe" data-path="src/components/BatchDeleteDialog.tsx">
          <AlertDialogCancel disabled={isLoading} data-id="ka2ps1g2e" data-path="src/components/BatchDeleteDialog.tsx">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600" data-id="1h2zts0i7" data-path="src/components/BatchDeleteDialog.tsx">

            {isLoading ? 'Deleting...' : `Delete ${selectedCount} ${itemName}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

};

export default BatchDeleteDialog;