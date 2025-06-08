import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, TrendingUp, DollarSign, Package, ArrowRight } from 'lucide-react';

interface ProductLog {
  ID: number;
  product_id: number;
  field_name: string;
  old_value: string;
  new_value: string;
  change_date: string;
  changed_by: number;
}

interface ProductLogsProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

const ProductLogs: React.FC<ProductLogsProps> = ({ isOpen, onClose, productId, productName }) => {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      loadProductLogs();
    }
  }, [isOpen, productId]);

  const loadProductLogs = async () => {
    try {
      setLoading(true);
      console.log('Loading product logs for product ID:', productId);

      const { data, error } = await window.ezsite.apis.tablePage('11756', {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'change_date',
        IsAsc: false,
        Filters: [
        { name: 'product_id', op: 'Equal', value: productId }]

      });

      if (error) {
        console.error('API error loading logs:', error);
        throw error;
      }

      console.log('Loaded logs:', data?.List || []);
      setLogs(data?.List || []);
    } catch (error) {
      console.error('Error loading product logs:', error);
      toast({
        title: "Error",
        description: `Failed to load product change logs: ${error}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '-';
    }
  };

  const formatValue = (fieldName: string, value: string) => {
    if (!value || value === '') return '-';

    // Format price fields with currency
    if (fieldName.includes('price') || fieldName === 'profit_margin') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return `$${numValue.toFixed(2)}`;
      }
    }

    // Format date fields
    if (fieldName.includes('date')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    return value;
  };

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'last_shopping_date':
        return <Calendar className="w-4 h-4" data-id="hc2kwpyda" data-path="src/components/ProductLogs.tsx" />;
      case 'case_price':
      case 'unit_price':
      case 'retail_price':
        return <DollarSign className="w-4 h-4" data-id="cl9g91i3q" data-path="src/components/ProductLogs.tsx" />;
      case 'unit_per_case':
        return <Package className="w-4 h-4" data-id="4znreyhu3" data-path="src/components/ProductLogs.tsx" />;
      case 'profit_margin':
        return <TrendingUp className="w-4 h-4" data-id="xeuod0e31" data-path="src/components/ProductLogs.tsx" />;
      default:
        return null;
    }
  };

  const getFieldDisplayName = (fieldName: string) => {
    switch (fieldName) {
      case 'last_shopping_date':
        return 'Last Shopping Date';
      case 'case_price':
        return 'Case Price';
      case 'unit_per_case':
        return 'Unit Per Case';
      case 'unit_price':
        return 'Unit Price';
      case 'retail_price':
        return 'Retail Price';
      case 'profit_margin':
        return 'Profit Margin';
      default:
        return fieldName.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const getFieldColor = (fieldName: string) => {
    switch (fieldName) {
      case 'last_shopping_date':
        return 'bg-blue-100 text-blue-800';
      case 'case_price':
        return 'bg-green-100 text-green-800';
      case 'unit_per_case':
        return 'bg-purple-100 text-purple-800';
      case 'unit_price':
        return 'bg-orange-100 text-orange-800';
      case 'retail_price':
        return 'bg-red-100 text-red-800';
      case 'profit_margin':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="riru1v0g2" data-path="src/components/ProductLogs.tsx">
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-id="t07tjcdcm" data-path="src/components/ProductLogs.tsx">
        <DialogHeader data-id="zecicbo1p" data-path="src/components/ProductLogs.tsx">
          <DialogTitle className="flex items-center space-x-2" data-id="2kw0lyje1" data-path="src/components/ProductLogs.tsx">
            <Package className="w-5 h-5" data-id="0tqm973z6" data-path="src/components/ProductLogs.tsx" />
            <span data-id="6s0lx11jg" data-path="src/components/ProductLogs.tsx">Product Change Logs</span>
          </DialogTitle>
          <DialogDescription data-id="n6ihqul3s" data-path="src/components/ProductLogs.tsx">
            Change history for: <span className="font-medium" data-id="cleq4da3a" data-path="src/components/ProductLogs.tsx">{productName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4" data-id="sw9xfs0so" data-path="src/components/ProductLogs.tsx">
          {loading ?
          <div className="space-y-4" data-id="5jcpjg805" data-path="src/components/ProductLogs.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="g970bd1vj" data-path="src/components/ProductLogs.tsx"></div>
            )}
            </div> :
          logs.length === 0 ?
          <div className="text-center py-8" data-id="7yugrxnu6" data-path="src/components/ProductLogs.tsx">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="cdb8qxkju" data-path="src/components/ProductLogs.tsx" />
              <p className="text-gray-500" data-id="u8sg253u8" data-path="src/components/ProductLogs.tsx">No change logs found for this product</p>
              <p className="text-sm text-gray-400 mt-2" data-id="jq8ddkkhp" data-path="src/components/ProductLogs.tsx">
                Changes will appear here when product information is updated
              </p>
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="v396cnny9" data-path="src/components/ProductLogs.tsx">
              <Table data-id="i7eusq3he" data-path="src/components/ProductLogs.tsx">
                <TableHeader data-id="0irube5by" data-path="src/components/ProductLogs.tsx">
                  <TableRow data-id="8z8htwwqs" data-path="src/components/ProductLogs.tsx">
                    <TableHead data-id="3p0gnpe49" data-path="src/components/ProductLogs.tsx">Field</TableHead>
                    <TableHead data-id="jre7lj1as" data-path="src/components/ProductLogs.tsx">Change Date</TableHead>
                    <TableHead data-id="go1ih1wcq" data-path="src/components/ProductLogs.tsx">Old Value</TableHead>
                    <TableHead className="text-center" data-id="o6h79kyqt" data-path="src/components/ProductLogs.tsx">→</TableHead>
                    <TableHead data-id="sqxw0lg6q" data-path="src/components/ProductLogs.tsx">New Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="710opnlq5" data-path="src/components/ProductLogs.tsx">
                  {logs.map((log) =>
                <TableRow key={log.ID} data-id="iigia2ugp" data-path="src/components/ProductLogs.tsx">
                      <TableCell data-id="th8b3xny0" data-path="src/components/ProductLogs.tsx">
                        <div className="flex items-center space-x-2" data-id="j14l1bm8r" data-path="src/components/ProductLogs.tsx">
                          {getFieldIcon(log.field_name)}
                          <Badge className={getFieldColor(log.field_name)} data-id="6muz1l9ue" data-path="src/components/ProductLogs.tsx">
                            {getFieldDisplayName(log.field_name)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600" data-id="dvj4xrm9w" data-path="src/components/ProductLogs.tsx">
                        {formatDate(log.change_date)}
                      </TableCell>
                      <TableCell data-id="azykl7sv0" data-path="src/components/ProductLogs.tsx">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm" data-id="sdqmonw28" data-path="src/components/ProductLogs.tsx">
                          {formatValue(log.field_name, log.old_value)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center" data-id="ahuzhn6l6" data-path="src/components/ProductLogs.tsx">
                        <ArrowRight className="w-4 h-4 text-gray-400" data-id="3c6qzx23v" data-path="src/components/ProductLogs.tsx" />
                      </TableCell>
                      <TableCell data-id="t449z8zqe" data-path="src/components/ProductLogs.tsx">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm" data-id="8v0patywo" data-path="src/components/ProductLogs.tsx">
                          {formatValue(log.field_name, log.new_value)}
                        </span>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }
        </div>
      </DialogContent>
    </Dialog>);

};

export default ProductLogs;