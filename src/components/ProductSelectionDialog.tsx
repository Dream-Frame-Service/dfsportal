import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  ID: number;
  product_name: string;
  product_code: string;
  category: string;
  price: number;
  retail_price: number;
  quantity_in_stock: number;
  supplier: string;
  unit_per_case: number;
  weight: number;
  weight_unit: string;
}

interface ProductSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (product: Product, quantity: number, unitType: string) => void;
}

const ProductSelectionDialog: React.FC<ProductSelectionDialogProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm
}) => {
  const [quantity, setQuantity] = useState(1);
  const [unitType, setUnitType] = useState('pieces');

  // Unit type options
  const unitTypes = [
  { value: 'pieces', label: 'Pieces (Individual Units)' },
  { value: 'cases', label: 'Cases (Bulk Units)' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'packs', label: 'Packs' },
  { value: 'bottles', label: 'Bottles' },
  { value: 'cans', label: 'Cans' },
  { value: 'bags', label: 'Bags' },
  { value: 'cartons', label: 'Cartons' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'gallons', label: 'Gallons' },
  { value: 'liters', label: 'Liters' },
  { value: 'pounds', label: 'Pounds' },
  { value: 'kilograms', label: 'Kilograms' }];


  const handleConfirm = () => {
    if (!product) return;

    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (quantity > product.quantity_in_stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity_in_stock} units available in stock`,
        variant: "destructive"
      });
      return;
    }

    onConfirm(product, quantity, unitType);
    handleClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setUnitType('pieces');
    onClose();
  };

  const calculatePrice = () => {
    if (!product) return 0;

    // Calculate price based on unit type
    let pricePerUnit = product.price;

    if (unitType === 'cases' && product.unit_per_case > 0) {
      pricePerUnit = product.price * product.unit_per_case;
    }

    return pricePerUnit * quantity;
  };

  const getUnitInfo = () => {
    if (!product) return '';

    if (unitType === 'cases' && product.unit_per_case > 0) {
      return `(${product.unit_per_case} pieces per case)`;
    }

    return '';
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} data-id="wozsi0j6k" data-path="src/components/ProductSelectionDialog.tsx">
      <DialogContent className="sm:max-w-md" data-id="vaniqh385" data-path="src/components/ProductSelectionDialog.tsx">
        <DialogHeader data-id="nrv0rfzqt" data-path="src/components/ProductSelectionDialog.tsx">
          <DialogTitle className="flex items-center space-x-2" data-id="yqrhz6v2o" data-path="src/components/ProductSelectionDialog.tsx">
            <Package className="w-5 h-5" data-id="rlti0j0s2" data-path="src/components/ProductSelectionDialog.tsx" />
            <span data-id="y5rxy7cqv" data-path="src/components/ProductSelectionDialog.tsx">Add Product to Order</span>
          </DialogTitle>
          <DialogDescription data-id="rfel3yq3d" data-path="src/components/ProductSelectionDialog.tsx">
            Configure the quantity and unit type for this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6" data-id="exn9d468n" data-path="src/components/ProductSelectionDialog.tsx">
          {/* Product Information */}
          <div className="bg-gray-50 p-4 rounded-lg" data-id="7wi5kxet7" data-path="src/components/ProductSelectionDialog.tsx">
            <h3 className="font-semibold text-lg" data-id="m6zuodu9s" data-path="src/components/ProductSelectionDialog.tsx">{product.product_name}</h3>
            <div className="mt-2 space-y-1" data-id="mbvcabk1h" data-path="src/components/ProductSelectionDialog.tsx">
              <p className="text-sm text-muted-foreground" data-id="81g450ji4" data-path="src/components/ProductSelectionDialog.tsx">
                Product Code: <span className="font-medium" data-id="jvx5wynrg" data-path="src/components/ProductSelectionDialog.tsx">{product.product_code}</span>
              </p>
              <p className="text-sm text-muted-foreground" data-id="estw84xqc" data-path="src/components/ProductSelectionDialog.tsx">
                Category: <span className="font-medium" data-id="tprh59y9y" data-path="src/components/ProductSelectionDialog.tsx">{product.category}</span>
              </p>
              <p className="text-sm text-muted-foreground" data-id="um7vtm8e4" data-path="src/components/ProductSelectionDialog.tsx">
                Supplier: <span className="font-medium" data-id="syzs4lhwe" data-path="src/components/ProductSelectionDialog.tsx">{product.supplier}</span>
              </p>
              <div className="flex items-center space-x-2 mt-2" data-id="3cot7quul" data-path="src/components/ProductSelectionDialog.tsx">
                <Badge variant="secondary" data-id="iag1jgb4x" data-path="src/components/ProductSelectionDialog.tsx">
                  ${product.price.toFixed(2)} per unit
                </Badge>
                <Badge variant="outline" data-id="xxlnbsypl" data-path="src/components/ProductSelectionDialog.tsx">
                  {product.quantity_in_stock} in stock
                </Badge>
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2" data-id="qfieeo8yo" data-path="src/components/ProductSelectionDialog.tsx">
            <Label htmlFor="quantity" data-id="ortv0ap21" data-path="src/components/ProductSelectionDialog.tsx">Quantity *</Label>
            <NumberInput
              id="quantity"
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.quantity_in_stock}
              className="w-full"
              placeholder="Enter quantity" data-id="pvjask3t9" data-path="src/components/ProductSelectionDialog.tsx" />

            <p className="text-xs text-muted-foreground" data-id="ycu6x3lv7" data-path="src/components/ProductSelectionDialog.tsx">
              Maximum available: {product.quantity_in_stock} units
            </p>
          </div>

          {/* Unit Type Selection */}
          <div className="space-y-2" data-id="t79brasrv" data-path="src/components/ProductSelectionDialog.tsx">
            <Label htmlFor="unitType" data-id="cwvfld0wb" data-path="src/components/ProductSelectionDialog.tsx">Unit Type *</Label>
            <Select value={unitType} onValueChange={setUnitType} data-id="qde6e5udp" data-path="src/components/ProductSelectionDialog.tsx">
              <SelectTrigger data-id="otav86nlm" data-path="src/components/ProductSelectionDialog.tsx">
                <SelectValue placeholder="Select unit type" data-id="k7v4fyv42" data-path="src/components/ProductSelectionDialog.tsx" />
              </SelectTrigger>
              <SelectContent data-id="4eimc21qr" data-path="src/components/ProductSelectionDialog.tsx">
                {unitTypes.map((unit) =>
                <SelectItem key={unit.value} value={unit.value} data-id="g5aa23plr" data-path="src/components/ProductSelectionDialog.tsx">
                    {unit.label}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {getUnitInfo() &&
            <p className="text-xs text-muted-foreground" data-id="fu8x64nja" data-path="src/components/ProductSelectionDialog.tsx">{getUnitInfo()}</p>
            }
          </div>

          {/* Price Calculation */}
          <div className="bg-blue-50 p-3 rounded-lg" data-id="9ol2e44gq" data-path="src/components/ProductSelectionDialog.tsx">
            <div className="flex items-center justify-between" data-id="dao767au7" data-path="src/components/ProductSelectionDialog.tsx">
              <span className="text-sm font-medium" data-id="22ngjbnjf" data-path="src/components/ProductSelectionDialog.tsx">Total Price:</span>
              <span className="text-lg font-bold text-blue-600" data-id="s4qfglp8p" data-path="src/components/ProductSelectionDialog.tsx">
                ${calculatePrice().toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1" data-id="vjmali5pq" data-path="src/components/ProductSelectionDialog.tsx">
              {quantity} {unitType} × ${(calculatePrice() / quantity).toFixed(2)} each
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3" data-id="cnvh952sf" data-path="src/components/ProductSelectionDialog.tsx">
            <Button variant="outline" onClick={handleClose} data-id="af63dsran" data-path="src/components/ProductSelectionDialog.tsx">
              <X className="w-4 h-4 mr-2" data-id="lwahkrou1" data-path="src/components/ProductSelectionDialog.tsx" />
              Cancel
            </Button>
            <Button onClick={handleConfirm} data-id="s2ord991c" data-path="src/components/ProductSelectionDialog.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="hgy66ers7" data-path="src/components/ProductSelectionDialog.tsx" />
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

};

export default ProductSelectionDialog;
