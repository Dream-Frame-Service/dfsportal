import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentType: 'Cash' | 'Credit Card' | 'Cheque';
  chequeNo?: string;
  invoiceFileId?: number;
  notes: string;
}

interface ExpensesSectionProps {
  expenses: Expense[];
  onChange: (expenses: Expense[]) => void;
}

const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  onChange
}) => {
  const [vendors, setVendors] = useState<Array<{id: number;vendor_name: string;}>>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11729, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'vendor_name',
        IsAsc: true,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;
      setVendors(data?.List || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vendors',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      vendorId: '',
      vendorName: '',
      amount: 0,
      paymentType: 'Cash',
      notes: ''
    };
    onChange([...expenses, newExpense]);
  };

  const updateExpense = (index: number, field: keyof Expense, value: any) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };

    if (field === 'vendorId') {
      const vendor = vendors.find((v) => v.id.toString() === value);
      updatedExpenses[index].vendorName = vendor?.vendor_name || '';
    }

    onChange(updatedExpenses);
  };

  const removeExpense = (index: number) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    onChange(updatedExpenses);
  };

  const uploadInvoice = async (index: number, file: File) => {
    try {
      const { data: fileId, error } = await window.ezsite.apis.upload({
        filename: file.name,
        file: file
      });

      if (error) throw error;
      updateExpense(index, 'invoiceFileId', fileId);

      toast({
        title: 'Success',
        description: 'Invoice uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload invoice',
        variant: 'destructive'
      });
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashExpenses = expenses.filter((e) => e.paymentType === 'Cash').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="bg-orange-50 border-orange-200" data-id="8s4jyz0ye" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
      <CardHeader data-id="9q6fpwuhf" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
        <CardTitle className="text-orange-800 flex items-center justify-between" data-id="e8612nboz" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
          <div className="flex items-center space-x-2" data-id="f3tgruxa3" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
            <Receipt className="w-5 h-5" data-id="0b0ei6kw1" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />
            <span data-id="0r7l9c2um" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Expenses</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExpense}
            className="bg-white hover:bg-orange-100" data-id="xd7m103a4" data-path="src/components/SalesReportSections/ExpensesSection.tsx">

            <Plus className="w-4 h-4 mr-2" data-id="ymcugiivr" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />
            Add Expense
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="d6qd6ntr5" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
        {expenses.length === 0 ?
        <div className="text-center py-8 text-gray-500" data-id="slelzjhkg" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
            No expenses recorded. Click "Add Expense" to get started.
          </div> :

        <div className="space-y-4" data-id="5veqkm2cc" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
            {expenses.map((expense, index) =>
          <div key={expense.id} className="border border-orange-200 rounded-lg p-4 bg-white" data-id="y7c1ov1eb" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                <div className="flex items-center justify-between mb-4" data-id="2uuz45n3a" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                  <Badge variant="outline" className="text-orange-700" data-id="e7p29gkbq" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    Expense #{index + 1}
                  </Badge>
                  <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExpense(index)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50" data-id="f2lyywjc6" data-path="src/components/SalesReportSections/ExpensesSection.tsx">

                    <Trash2 className="w-4 h-4" data-id="pwp137tvd" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="xbuew8w28" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                  <div className="space-y-2" data-id="ypnu70e3j" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    <Label data-id="qvu2fvneb" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Vendor *</Label>
                    <Select
                  value={expense.vendorId}
                  onValueChange={(value) => updateExpense(index, 'vendorId', value)} data-id="qp7r0ya4x" data-path="src/components/SalesReportSections/ExpensesSection.tsx">

                      <SelectTrigger data-id="ezrj9ri0j" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                        <SelectValue placeholder="Select vendor" data-id="pdzv3bgrl" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />
                      </SelectTrigger>
                      <SelectContent data-id="2hlzy69gn" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                        {vendors.map((vendor) =>
                    <SelectItem key={vendor.id} value={vendor.id.toString()} data-id="4kr3q80pb" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                            {vendor.vendor_name}
                          </SelectItem>
                    )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2" data-id="cam123ne1" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    <Label data-id="0r5xsph9q" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Amount ($) *</Label>
                    <NumberInput
                  value={expense.amount}
                  onChange={(value) => updateExpense(index, 'amount', value || 0)}
                  min={0}
                  step={0.01}
                  required data-id="34gmn3xeb" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />

                  </div>
                  
                  <div className="space-y-2" data-id="i4n8pesca" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    <Label data-id="u6mtm3uqb" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Payment Type *</Label>
                    <Select
                  value={expense.paymentType}
                  onValueChange={(value) => updateExpense(index, 'paymentType', value)} data-id="4v18561t7" data-path="src/components/SalesReportSections/ExpensesSection.tsx">

                      <SelectTrigger data-id="8q1gee677" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                        <SelectValue data-id="hvczwac5s" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />
                      </SelectTrigger>
                      <SelectContent data-id="9cr91sv8g" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                        <SelectItem value="Cash" data-id="pwehtns07" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Cash</SelectItem>
                        <SelectItem value="Credit Card" data-id="8sahhhgrq" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Credit Card</SelectItem>
                        <SelectItem value="Cheque" data-id="25755f0aj" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {expense.paymentType === 'Cheque' &&
              <div className="space-y-2" data-id="xuklz1qb3" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                      <Label data-id="nj2inloa4" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Cheque Number *</Label>
                      <Input
                  value={expense.chequeNo || ''}
                  onChange={(e) => updateExpense(index, 'chequeNo', e.target.value)}
                  placeholder="Enter cheque number"
                  required data-id="s6700220n" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />

                    </div>
              }
                  
                  <div className="md:col-span-2 space-y-2" data-id="fdicvsdtd" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    <Label data-id="y7ibsrsc8" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Upload Invoice * (Mandatory)</Label>
                    <div className="flex items-center space-x-2" data-id="exwggg5w6" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                      <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadInvoice(index, file);
                    }}
                    className="flex-1" data-id="w0v0v781x" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />

                      {expense.invoiceFileId &&
                  <Badge variant="default" className="bg-green-100 text-green-800" data-id="i3a0r7ud3" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                          ✓ Uploaded
                        </Badge>
                  }
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2" data-id="7j1a92ra6" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                    <Label data-id="bw9gs3gd7" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Notes</Label>
                    <Textarea
                  value={expense.notes}
                  onChange={(e) => updateExpense(index, 'notes', e.target.value)}
                  placeholder="Additional notes about this expense..."
                  rows={2} data-id="qfrklgc31" data-path="src/components/SalesReportSections/ExpensesSection.tsx" />

                  </div>
                </div>
              </div>
          )}
          </div>
        }
        
        {expenses.length > 0 &&
        <div className="pt-4 border-t border-orange-200 bg-orange-100 rounded-lg p-4" data-id="gq5v4elnv" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="2cgi84vxt" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
              <div className="flex items-center justify-between" data-id="frpbg1gq5" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                <Label className="font-semibold" data-id="75swav90q" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Total Expenses:</Label>
                <div className="text-xl font-bold text-orange-800" data-id="1z1ki8c4t" data-path="src/components/SalesReportSections/ExpensesSection.tsx">${totalExpenses.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between" data-id="wb35hkczm" data-path="src/components/SalesReportSections/ExpensesSection.tsx">
                <Label className="font-semibold" data-id="qni7lr8i7" data-path="src/components/SalesReportSections/ExpensesSection.tsx">Cash Expenses:</Label>
                <div className="text-xl font-bold text-orange-800" data-id="fvv1xtsnf" data-path="src/components/SalesReportSections/ExpensesSection.tsx">${cashExpenses.toFixed(2)}</div>
              </div>
            </div>
          </div>
        }
      </CardContent>
    </Card>);

};

export default ExpensesSection;