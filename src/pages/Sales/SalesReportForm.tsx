import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StationSelector from '@/components/StationSelector';
import GasGrocerySalesSection from '@/components/SalesReportSections/GasGrocerySalesSection';
import LotterySalesSection from '@/components/SalesReportSections/LotterySalesSection';
import GasTankReportSection from '@/components/SalesReportSections/GasTankReportSection';
import ExpensesSection from '@/components/SalesReportSections/ExpensesSection';
import DocumentsUploadSection from '@/components/SalesReportSections/DocumentsUploadSection';
import CashCollectionSection from '@/components/SalesReportSections/CashCollectionSection';
import { supabase } from '@/lib/supabase';

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

export default function SalesReportForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!id;

  const [selectedStation, setSelectedStation] = useState('');
  const [employees, setEmployees] = useState<Array<{id: number;first_name: string;last_name: string;employee_id: string;}>>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  const [formData, setFormData] = useState({
    report_date: new Date().toISOString().split('T')[0],
    station: '',
    shift: 'DAY',
    employee_name: '',
    employee_id: '',
    // Cash Collection
    cashCollectionOnHand: 0,
    // Gas & Grocery Sales
    creditCardAmount: 0,
    debitCardAmount: 0,
    mobileAmount: 0,
    cashAmount: 0,
    grocerySales: 0,
    ebtSales: 0, // MOBIL only
    // Separate Grocery Sales Breakdown Fields
    groceryCashSales: 0,
    groceryCreditDebitSales: 0,
    // Lottery
    lotteryNetSales: 0,
    scratchOffSales: 0,
    // Gas Tank Report
    regularGallons: 0,
    superGallons: 0,
    dieselGallons: 0,
    // Documents
    dayReportFileId: undefined as number | undefined,
    veederRootFileId: undefined as number | undefined,
    lottoReportFileId: undefined as number | undefined,
    scratchOffReportFileId: undefined as number | undefined,
    // Notes
    notes: ''
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (selectedStation) {
      setFormData((prev) => ({ ...prev, station: selectedStation }));
      loadEmployees(selectedStation);
    }
  }, [selectedStation]);

  useEffect(() => {
    if (isEditing && id) {
      loadExistingReport();
    }
  }, [isEditing, id]);

  const loadExistingReport = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_sales_reports_enhanced')
        .select('*')
        .eq('id', parseInt(id!))
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        const report = data;
        setSelectedStation(report.station);
        setFormData({
          report_date: report.report_date.split('T')[0],
          station: report.station,
          shift: report.shift || 'DAY',
          employee_name: report.employee_name,
          employee_id: report.employee_id || '',
          cashCollectionOnHand: report.cash_collection_on_hand,
          creditCardAmount: report.credit_card_amount,
          debitCardAmount: report.debit_card_amount,
          mobileAmount: report.mobile_amount,
          cashAmount: report.cash_amount,
          grocerySales: report.grocery_sales,
          ebtSales: report.ebt_sales,
          groceryCashSales: report.grocery_cash_sales || 0,
          groceryCreditDebitSales: report.grocery_credit_debit_sales || 0,
          lotteryNetSales: report.lottery_net_sales,
          scratchOffSales: report.scratch_off_sales,
          regularGallons: report.regular_gallons,
          superGallons: report.super_gallons,
          dieselGallons: report.diesel_gallons,
          dayReportFileId: report.day_report_file_id,
          veederRootFileId: report.veeder_root_file_id,
          lottoReportFileId: report.lotto_report_file_id,
          scratchOffReportFileId: report.scratch_off_report_file_id,
          notes: report.notes
        });

        // Parse expenses from JSON
        if (report.expenses_data) {
          try {
            setExpenses(JSON.parse(report.expenses_data));
          } catch (e) {
            console.error('Error parsing expenses data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading report:', error);
      toast({
        title: 'Error',
        description: 'Failed to load existing report',
        variant: 'destructive'
      });
    }
  };

  const loadEmployees = async (station: string) => {
    setIsLoadingEmployees(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('station', station)
        .eq('is_active', true)
        .order('first_name', { ascending: true })
        .limit(100);

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to load employees',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Auto-calculations
  const totalSales = formData.creditCardAmount + formData.debitCardAmount + formData.mobileAmount + formData.cashAmount + formData.grocerySales;
  const totalGallons = formData.regularGallons + formData.superGallons + formData.dieselGallons;
  const totalLotteryCash = formData.lotteryNetSales + formData.scratchOffSales;
  // Expected Cash calculation: Cash Amount + Grocery Sales (cash portion) + NY Lottery Net Sales + Scratch Off Sales
  const totalCashFromSales = formData.cashAmount + formData.grocerySales + formData.lotteryNetSales + formData.scratchOffSales;
  const totalCashFromExpenses = expenses.filter((e) => e.paymentType === 'Cash').reduce((sum, expense) => sum + expense.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required documents
    const requiredDocs = ['dayReportFileId', 'veederRootFileId', 'lottoReportFileId', 'scratchOffReportFileId'];
    const missingDocs = requiredDocs.filter((doc) => !formData[doc as keyof typeof formData]);

    if (missingDocs.length > 0) {
      toast({
        title: 'Missing Documents',
        description: 'Please upload all required documents before submitting.',
        variant: 'destructive'
      });
      return;
    }

    // Validate expenses have invoices
    const expensesWithoutInvoices = expenses.filter((expense) => !expense.invoiceFileId);
    if (expensesWithoutInvoices.length > 0) {
      toast({
        title: 'Missing Invoices',
        description: 'Please upload invoices for all expenses.',
        variant: 'destructive'
      });
      return;
    }

    const submitData = {
      report_date: formData.report_date,
      station: formData.station,
      shift: formData.shift,
      employee_name: formData.employee_name,
      employee_id: formData.employee_id,
      cash_collection_on_hand: formData.cashCollectionOnHand,
      total_short_over: formData.cashCollectionOnHand - (totalCashFromSales - totalCashFromExpenses),
      credit_card_amount: formData.creditCardAmount,
      debit_card_amount: formData.debitCardAmount,
      mobile_amount: formData.mobileAmount,
      cash_amount: formData.cashAmount,
      grocery_sales: formData.grocerySales,
      ebt_sales: formData.ebtSales,
      grocery_cash_sales: formData.groceryCashSales,
      grocery_credit_debit_sales: formData.groceryCreditDebitSales,
      lottery_net_sales: formData.lotteryNetSales,
      scratch_off_sales: formData.scratchOffSales,
      lottery_total_cash: totalLotteryCash,
      regular_gallons: formData.regularGallons,
      super_gallons: formData.superGallons,
      diesel_gallons: formData.dieselGallons,
      total_gallons: totalGallons,
      expenses_data: JSON.stringify(expenses),
      day_report_file_id: formData.dayReportFileId,
      veeder_root_file_id: formData.veederRootFileId,
      lotto_report_file_id: formData.lottoReportFileId,
      scratch_off_report_file_id: formData.scratchOffReportFileId,
      total_sales: totalSales,
      notes: formData.notes,
      created_by: user?.ID || 0
    };

    try {
      let result;
      if (isEditing) {
        result = await supabase
          .from('daily_sales_reports_enhanced')
          .update(submitData)
          .eq('id', parseInt(id!));
      } else {
        result = await supabase
          .from('daily_sales_reports_enhanced')
          .insert(submitData);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast({
        title: isEditing ? 'Report Updated' : 'Report Created',
        description: `Sales report has been ${isEditing ? 'updated' : 'created'} successfully.`
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save report',
        variant: 'destructive'
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpensesChange = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  const handleDocumentUpload = (field: string, fileId: number) => {
    setFormData((prev) => ({ ...prev, [field]: fileId }));
  };

  // If no station selected, show station selector
  if (!selectedStation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="1992jutk5" data-path="src/pages/Sales/SalesReportForm.tsx">
        <div className="max-w-4xl mx-auto" data-id="82dt9nypj" data-path="src/pages/Sales/SalesReportForm.tsx">
          <div className="mb-6" data-id="jivcyb8vs" data-path="src/pages/Sales/SalesReportForm.tsx">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="mb-4" data-id="w52u7b3r0" data-path="src/pages/Sales/SalesReportForm.tsx">
              <ArrowLeft className="w-4 h-4 mr-2" data-id="ojxr86pdk" data-path="src/pages/Sales/SalesReportForm.tsx" />
              Back to Reports
            </Button>
            <h1 className="text-3xl font-bold text-gray-900" data-id="vb18xna1a" data-path="src/pages/Sales/SalesReportForm.tsx">Create Daily Sales Report</h1>
            <p className="text-gray-600 mt-2" data-id="sv6mr3t55" data-path="src/pages/Sales/SalesReportForm.tsx">Step 1: Select your station to begin</p>
          </div>
          <StationSelector onStationSelect={setSelectedStation} data-id="tpjxqwze1" data-path="src/pages/Sales/SalesReportForm.tsx" />
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="m7nm6l53p" data-path="src/pages/Sales/SalesReportForm.tsx">
      <div className="max-w-6xl mx-auto" data-id="5qpv8vavd" data-path="src/pages/Sales/SalesReportForm.tsx">
        <div className="mb-6" data-id="y8n71nuuj" data-path="src/pages/Sales/SalesReportForm.tsx">
          <Button
            variant="outline"
            onClick={() => setSelectedStation('')}
            className="mb-4" data-id="po9lifn3h" data-path="src/pages/Sales/SalesReportForm.tsx">

            <ArrowLeft className="w-4 h-4 mr-2" data-id="c6zowg5yd" data-path="src/pages/Sales/SalesReportForm.tsx" />
            Change Station
          </Button>
          <div data-id="2v555ol5c" data-path="src/pages/Sales/SalesReportForm.tsx">
            <h1 className="text-3xl font-bold text-gray-900" data-id="9cdzibt1d" data-path="src/pages/Sales/SalesReportForm.tsx">
              {isEditing ? 'Edit' : 'Create'} Daily Sales Report
            </h1>
            <p className="text-gray-600 mt-2" data-id="dtwr1sknr" data-path="src/pages/Sales/SalesReportForm.tsx">
              Station: <span className="font-semibold" data-id="myzyy8d0s" data-path="src/pages/Sales/SalesReportForm.tsx">{selectedStation}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-id="r0ffml9nv" data-path="src/pages/Sales/SalesReportForm.tsx">
          {/* Basic Information */}
          <Card data-id="vix9niv3v" data-path="src/pages/Sales/SalesReportForm.tsx">
            <CardHeader data-id="0movlh0ur" data-path="src/pages/Sales/SalesReportForm.tsx">
              <CardTitle className="text-lg" data-id="ly7wzb4l7" data-path="src/pages/Sales/SalesReportForm.tsx">Basic Information</CardTitle>
            </CardHeader>
            <CardContent data-id="p3n0b2yq6" data-path="src/pages/Sales/SalesReportForm.tsx">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-id="wvm9onl7p" data-path="src/pages/Sales/SalesReportForm.tsx">
                <div className="space-y-2" data-id="lrga58nld" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <Label htmlFor="report_date" data-id="banmg5c89" data-path="src/pages/Sales/SalesReportForm.tsx">Report Date *</Label>
                  <Input
                    type="date"
                    id="report_date"
                    value={formData.report_date}
                    onChange={(e) => updateFormData('report_date', e.target.value)}
                    required data-id="i8sgiah32" data-path="src/pages/Sales/SalesReportForm.tsx" />

                </div>
                <div className="space-y-2" data-id="jfhtjka0j" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <Label data-id="a1hzoaa7q" data-path="src/pages/Sales/SalesReportForm.tsx">Station</Label>
                  <div className="h-9 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center" data-id="78x8zy248" data-path="src/pages/Sales/SalesReportForm.tsx">
                    <span className="text-gray-700 font-medium" data-id="fgubkl08c" data-path="src/pages/Sales/SalesReportForm.tsx">{selectedStation}</span>
                  </div>
                </div>
                <div className="space-y-2" data-id="c4xhoh3w0" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <Label htmlFor="shift" data-id="5wzhywn5c" data-path="src/pages/Sales/SalesReportForm.tsx">Shift *</Label>
                  <Select
                    value={formData.shift}
                    onValueChange={(value) => updateFormData('shift', value)} data-id="3jt27s11c" data-path="src/pages/Sales/SalesReportForm.tsx">
                    <SelectTrigger data-id="ukpmiw248" data-path="src/pages/Sales/SalesReportForm.tsx">
                      <SelectValue placeholder="Select shift" data-id="7x905gyno" data-path="src/pages/Sales/SalesReportForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="c45thqsal" data-path="src/pages/Sales/SalesReportForm.tsx">
                      <SelectItem value="DAY" data-id="9kzbwh9fw" data-path="src/pages/Sales/SalesReportForm.tsx">DAY</SelectItem>
                      <SelectItem value="NIGHT" data-id="m4ji8msys" data-path="src/pages/Sales/SalesReportForm.tsx">NIGHT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2" data-id="zypr5hqay" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <Label htmlFor="employee" data-id="ijii3lo44" data-path="src/pages/Sales/SalesReportForm.tsx">Employee Name *</Label>
                  <Select
                    value={formData.employee_id}
                    onValueChange={(value) => {
                      const selectedEmployee = employees.find((emp) => emp.employee_id === value);
                      if (selectedEmployee) {
                        updateFormData('employee_id', value);
                        updateFormData('employee_name', `${selectedEmployee.first_name} ${selectedEmployee.last_name}`);
                      }
                    }}
                    disabled={isLoadingEmployees} data-id="bef6k6k5c" data-path="src/pages/Sales/SalesReportForm.tsx">
                    <SelectTrigger data-id="3zvu2xa3w" data-path="src/pages/Sales/SalesReportForm.tsx">
                      <SelectValue placeholder={isLoadingEmployees ? "Loading employees..." : "Select employee"} data-id="zdaor99vr" data-path="src/pages/Sales/SalesReportForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="p4h3ka3tm" data-path="src/pages/Sales/SalesReportForm.tsx">
                      {employees.map((employee) =>
                      <SelectItem key={employee.id} value={employee.employee_id} data-id="jtjprmlro" data-path="src/pages/Sales/SalesReportForm.tsx">
                          {employee.first_name} {employee.last_name} (ID: {employee.employee_id})
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Collection */}
          <CashCollectionSection
            values={{
              cashCollectionOnHand: formData.cashCollectionOnHand,
              totalCashFromSales: totalCashFromSales,
              totalCashFromExpenses: totalCashFromExpenses
            }}
            onChange={updateFormData} data-id="uxwy7v32k" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* Gas & Grocery Sales */}
          <GasGrocerySalesSection
            station={selectedStation}
            values={{
              creditCardAmount: formData.creditCardAmount,
              debitCardAmount: formData.debitCardAmount,
              mobileAmount: formData.mobileAmount,
              cashAmount: formData.cashAmount,
              grocerySales: formData.grocerySales,
              ebtSales: formData.ebtSales,
              groceryCashSales: formData.groceryCashSales,
              groceryCreditDebitSales: formData.groceryCreditDebitSales
            }}
            onChange={updateFormData} data-id="su4yecnsb" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* NY Lottery Sales */}
          <LotterySalesSection
            values={{
              lotteryNetSales: formData.lotteryNetSales,
              scratchOffSales: formData.scratchOffSales
            }}
            onChange={updateFormData} data-id="as7nxntuu" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* Gas Tank Report */}
          <GasTankReportSection
            values={{
              regularGallons: formData.regularGallons,
              superGallons: formData.superGallons,
              dieselGallons: formData.dieselGallons
            }}
            onChange={updateFormData} data-id="jzuwg6nf6" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* Expenses */}
          <ExpensesSection
            expenses={expenses}
            onChange={handleExpensesChange} data-id="92wy5v4kp" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* Documents Upload */}
          <DocumentsUploadSection
            documents={{
              dayReportFileId: formData.dayReportFileId,
              veederRootFileId: formData.veederRootFileId,
              lottoReportFileId: formData.lottoReportFileId,
              scratchOffReportFileId: formData.scratchOffReportFileId
            }}
            onChange={handleDocumentUpload} data-id="touqzwt68" data-path="src/pages/Sales/SalesReportForm.tsx" />


          {/* Notes */}
          <Card data-id="lzjrn4c1g" data-path="src/pages/Sales/SalesReportForm.tsx">
            <CardHeader data-id="nrxxc2jqk" data-path="src/pages/Sales/SalesReportForm.tsx">
              <CardTitle className="text-lg" data-id="6duge341e" data-path="src/pages/Sales/SalesReportForm.tsx">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent data-id="21hj4k0li" data-path="src/pages/Sales/SalesReportForm.tsx">
              <div className="space-y-2" data-id="6c1u5rtss" data-path="src/pages/Sales/SalesReportForm.tsx">
                <Label htmlFor="notes" data-id="ndiaylsan" data-path="src/pages/Sales/SalesReportForm.tsx">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Enter any additional notes about the day's operations..."
                  rows={4} data-id="zhr37xift" data-path="src/pages/Sales/SalesReportForm.tsx" />

              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-id="c2heb41n4" data-path="src/pages/Sales/SalesReportForm.tsx">
            <CardHeader data-id="i74zo007n" data-path="src/pages/Sales/SalesReportForm.tsx">
              <CardTitle className="text-blue-800" data-id="72b0pfnyh" data-path="src/pages/Sales/SalesReportForm.tsx">Report Summary</CardTitle>
            </CardHeader>
            <CardContent data-id="ssy71e617" data-path="src/pages/Sales/SalesReportForm.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="jkused2y4" data-path="src/pages/Sales/SalesReportForm.tsx">
                <div className="text-center" data-id="hnvz53fyb" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <div className="text-2xl font-bold text-blue-800" data-id="0yddfgqps" data-path="src/pages/Sales/SalesReportForm.tsx">${totalSales.toFixed(2)}</div>
                  <div className="text-sm text-gray-600" data-id="g5ijmhke7" data-path="src/pages/Sales/SalesReportForm.tsx">Total Sales</div>
                </div>
                <div className="text-center" data-id="5a1xo5a2p" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <div className="text-2xl font-bold text-green-800" data-id="w0dbzs1bn" data-path="src/pages/Sales/SalesReportForm.tsx">{totalGallons.toFixed(2)}</div>
                  <div className="text-sm text-gray-600" data-id="z6k7tdfuk" data-path="src/pages/Sales/SalesReportForm.tsx">Total Gallons</div>
                </div>
                <div className="text-center" data-id="b7hag1ylu" data-path="src/pages/Sales/SalesReportForm.tsx">
                  <div className="text-2xl font-bold text-purple-800" data-id="1255hs8zm" data-path="src/pages/Sales/SalesReportForm.tsx">${totalLotteryCash.toFixed(2)}</div>
                  <div className="text-sm text-gray-600" data-id="649589f1a" data-path="src/pages/Sales/SalesReportForm.tsx">Lottery Sales</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6" data-id="xlhvwoxkm" data-path="src/pages/Sales/SalesReportForm.tsx">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')} data-id="eef649rx4" data-path="src/pages/Sales/SalesReportForm.tsx">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" data-id="ijhupfqu1" data-path="src/pages/Sales/SalesReportForm.tsx">
              <Save className="w-4 h-4 mr-2" data-id="7olp2zhiu" data-path="src/pages/Sales/SalesReportForm.tsx" />
              {isEditing ? 'Update' : 'Create'} Report
            </Button>
          </div>
        </form>
      </div>
    </div>);

}