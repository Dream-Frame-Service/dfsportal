import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calculator, Save, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface SalaryRecord {
  id?: number;
  employee_id: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_date: string;
  pay_frequency: string;
  base_salary: number;
  hourly_rate: number;
  regular_hours: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_pay: number;
  bonus_amount: number;
  commission: number;
  gross_pay: number;
  federal_tax: number;
  state_tax: number;
  social_security: number;
  medicare: number;
  health_insurance: number;
  retirement_401k: number;
  other_deductions: number;
  total_deductions: number;
  net_pay: number;
  station: string;
  status: string;
  notes: string;
  created_by: number;
}

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  position: string;
  station: string;
  salary: number;
}

const SalaryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id && id !== 'new');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SalaryRecord>({
    employee_id: '',
    pay_period_start: '',
    pay_period_end: '',
    pay_date: format(new Date(), 'yyyy-MM-dd'),
    pay_frequency: 'Biweekly',
    base_salary: 0,
    hourly_rate: 0,
    regular_hours: 80,
    overtime_hours: 0,
    overtime_rate: 0,
    overtime_pay: 0,
    bonus_amount: 0,
    commission: 0,
    gross_pay: 0,
    federal_tax: 0,
    state_tax: 0,
    social_security: 0,
    medicare: 0,
    health_insurance: 0,
    retirement_401k: 0,
    other_deductions: 0,
    total_deductions: 0,
    net_pay: 0,
    station: 'MOBIL',
    status: 'Pending',
    notes: '',
    created_by: 1
  });

  const SALARY_TABLE_ID = '11788';
  const EMPLOYEES_TABLE_ID = '11727';

  useEffect(() => {
    fetchEmployees();
    if (isEditing) {
      fetchSalaryRecord();
    }
  }, [id]);

  useEffect(() => {
    calculatePayroll();
  }, [
  formData.base_salary,
  formData.hourly_rate,
  formData.regular_hours,
  formData.overtime_hours,
  formData.bonus_amount,
  formData.commission]
  );

  const fetchEmployees = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(EMPLOYEES_TABLE_ID, {
        PageNo: 1,
        PageSize: 1000,
        OrderByField: 'first_name',
        IsAsc: true,
        Filters: [{ name: 'is_active', op: 'Equal', value: true }]
      });

      if (error) throw error;
      setEmployees(data?.List || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employee data',
        variant: 'destructive'
      });
    }
  };

  const fetchSalaryRecord = async () => {
    if (!id || id === 'new') return;

    setLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(SALARY_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: 'id', op: 'Equal', value: parseInt(id) }]
      });

      if (error) throw error;

      if (data?.List && data.List.length > 0) {
        const record = data.List[0];
        setFormData({
          ...record,
          pay_period_start: format(new Date(record.pay_period_start), 'yyyy-MM-dd'),
          pay_period_end: format(new Date(record.pay_period_end), 'yyyy-MM-dd'),
          pay_date: format(new Date(record.pay_date), 'yyyy-MM-dd')
        });
      }
    } catch (error) {
      console.error('Error fetching salary record:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch salary record',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = () => {
    // Calculate overtime pay
    const overtimeRate = formData.hourly_rate * 1.5;
    const overtimePay = formData.overtime_hours * overtimeRate;

    // Calculate gross pay
    const regularPay = formData.hourly_rate * formData.regular_hours;
    const grossPay = formData.base_salary + regularPay + overtimePay + formData.bonus_amount + formData.commission;

    setFormData((prev) => ({
      ...prev,
      overtime_rate: overtimeRate,
      overtime_pay: overtimePay,
      gross_pay: grossPay,
      net_pay: grossPay
    }));
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
        station: employee.station,
        hourly_rate: employee.salary / 2080 // Assuming 2080 work hours per year
      }));
    }
  };

  const handleInputChange = (field: keyof SalaryRecord, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        pay_period_start: new Date(formData.pay_period_start).toISOString(),
        pay_period_end: new Date(formData.pay_period_end).toISOString(),
        pay_date: new Date(formData.pay_date).toISOString()
      };

      if (isEditing) {
        const { error } = await window.ezsite.apis.tableUpdate(SALARY_TABLE_ID, {
          ID: parseInt(id!),
          ...submitData
        });
        if (error) throw error;
      } else {
        const { error } = await window.ezsite.apis.tableCreate(SALARY_TABLE_ID, submitData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Salary record ${isEditing ? 'updated' : 'created'} successfully`
      });

      navigate('/salary');
    } catch (error) {
      console.error('Error saving salary record:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} salary record`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-id="bybotqknl" data-path="src/pages/Salary/SalaryForm.tsx">
      <div className="flex items-center gap-4" data-id="7w8jrpf9i" data-path="src/pages/Salary/SalaryForm.tsx">
        <Button variant="ghost" onClick={() => navigate('/salary')} data-id="cabslwo6j" data-path="src/pages/Salary/SalaryForm.tsx">
          <ArrowLeft className="h-4 w-4 mr-2" data-id="c1jrkrpsl" data-path="src/pages/Salary/SalaryForm.tsx" />
          Back to Salary Records
        </Button>
        <div data-id="zkhlxbvod" data-path="src/pages/Salary/SalaryForm.tsx">
          <h1 className="text-3xl font-bold" data-id="ikc5yp8cx" data-path="src/pages/Salary/SalaryForm.tsx">
            {isEditing ? 'Edit Salary Record' : 'Create Salary Record'}
          </h1>
          <p className="text-muted-foreground" data-id="0ah2t1lfi" data-path="src/pages/Salary/SalaryForm.tsx">
            {isEditing ? 'Update salary record details' : 'Add a new salary record for payroll processing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-id="gyq6bdphd" data-path="src/pages/Salary/SalaryForm.tsx">
        {/* Basic Information */}
        <Card data-id="xuzm50r1j" data-path="src/pages/Salary/SalaryForm.tsx">
          <CardHeader data-id="tcxfetn5o" data-path="src/pages/Salary/SalaryForm.tsx">
            <CardTitle data-id="5f13hiqiw" data-path="src/pages/Salary/SalaryForm.tsx">Basic Information</CardTitle>
            <CardDescription data-id="xfwzf4e0d" data-path="src/pages/Salary/SalaryForm.tsx">Employee and pay period details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" data-id="y7jsmv8cc" data-path="src/pages/Salary/SalaryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="6yksihvl4" data-path="src/pages/Salary/SalaryForm.tsx">
              <div className="space-y-2" data-id="6gi6uhn9" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="employee_id" data-id="mowc14vm2" data-path="src/pages/Salary/SalaryForm.tsx">Employee *</Label>
                <Select value={formData.employee_id} onValueChange={handleEmployeeChange} data-id="f72iud11i" data-path="src/pages/Salary/SalaryForm.tsx">
                  <SelectTrigger data-id="34xmnel6f" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectValue placeholder="Select employee" data-id="ajszeryex" data-path="src/pages/Salary/SalaryForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="y6marms0q" data-path="src/pages/Salary/SalaryForm.tsx">
                    {employees.map((employee) =>
                    <SelectItem key={employee.employee_id} value={employee.employee_id} data-id="l78soxj4i" data-path="src/pages/Salary/SalaryForm.tsx">
                        {employee.first_name} {employee.last_name} ({employee.employee_id})
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-id="du6dlt0e3" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="pay_frequency" data-id="ukqitau85" data-path="src/pages/Salary/SalaryForm.tsx">Pay Frequency</Label>
                <Select value={formData.pay_frequency} onValueChange={(value) => handleInputChange('pay_frequency', value)} data-id="dd092vd0b" data-path="src/pages/Salary/SalaryForm.tsx">
                  <SelectTrigger data-id="qrj7o2dja" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectValue data-id="xxtbkn71c" data-path="src/pages/Salary/SalaryForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="wbd599hl1" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectItem value="Weekly" data-id="es7gn2cvn" data-path="src/pages/Salary/SalaryForm.tsx">Weekly</SelectItem>
                    <SelectItem value="Biweekly" data-id="7chvd6rfr" data-path="src/pages/Salary/SalaryForm.tsx">Biweekly</SelectItem>
                    <SelectItem value="Monthly" data-id="1gjdv5hbj" data-path="src/pages/Salary/SalaryForm.tsx">Monthly</SelectItem>
                    <SelectItem value="Semi-monthly" data-id="mwo1rgzwz" data-path="src/pages/Salary/SalaryForm.tsx">Semi-monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-id="ekskgtwjn" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="pay_period_start" data-id="cr4yuymwc" data-path="src/pages/Salary/SalaryForm.tsx">Pay Period Start *</Label>
                <Input
                  id="pay_period_start"
                  type="date"
                  value={formData.pay_period_start}
                  onChange={(e) => handleInputChange('pay_period_start', e.target.value)}
                  required data-id="oroubhg3c" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="3vflsvptp" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="pay_period_end" data-id="2pr619mx9" data-path="src/pages/Salary/SalaryForm.tsx">Pay Period End *</Label>
                <Input
                  id="pay_period_end"
                  type="date"
                  value={formData.pay_period_end}
                  onChange={(e) => handleInputChange('pay_period_end', e.target.value)}
                  required data-id="9btwjuqg8" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="vxewo4rgu" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="pay_date" data-id="kxc8f4f5w" data-path="src/pages/Salary/SalaryForm.tsx">Pay Date *</Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={formData.pay_date}
                  onChange={(e) => handleInputChange('pay_date', e.target.value)}
                  required data-id="iddcjav1q" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="tsmg1dxz6" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="station" data-id="ss8gm8eau" data-path="src/pages/Salary/SalaryForm.tsx">Station</Label>
                <Select value={formData.station} onValueChange={(value) => handleInputChange('station', value)} data-id="69sjos8hr" data-path="src/pages/Salary/SalaryForm.tsx">
                  <SelectTrigger data-id="gppogjcdi" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectValue data-id="6rg2ja4bm" data-path="src/pages/Salary/SalaryForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="6thr4xmpg" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectItem value="MOBIL" data-id="g18l973rj" data-path="src/pages/Salary/SalaryForm.tsx">MOBIL</SelectItem>
                    <SelectItem value="AMOCO ROSEDALE" data-id="f0otz1kds" data-path="src/pages/Salary/SalaryForm.tsx">AMOCO ROSEDALE</SelectItem>
                    <SelectItem value="AMOCO BROOKLYN" data-id="30ky4ltyn" data-path="src/pages/Salary/SalaryForm.tsx">AMOCO BROOKLYN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings */}
        <Card data-id="d3yups7e5" data-path="src/pages/Salary/SalaryForm.tsx">
          <CardHeader data-id="ls3nb97gh" data-path="src/pages/Salary/SalaryForm.tsx">
            <CardTitle className="flex items-center gap-2" data-id="ndfk2k8su" data-path="src/pages/Salary/SalaryForm.tsx">
              <DollarSign className="h-5 w-5" data-id="oc6juqqy5" data-path="src/pages/Salary/SalaryForm.tsx" />
              Earnings
            </CardTitle>
            <CardDescription data-id="thoy2sfvm" data-path="src/pages/Salary/SalaryForm.tsx">Base salary, hourly wages, and additional compensation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" data-id="nop3z80q9" data-path="src/pages/Salary/SalaryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="5z210p0hp" data-path="src/pages/Salary/SalaryForm.tsx">
              <div className="space-y-2" data-id="xhg9xenfz" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="base_salary" data-id="ndp77oo4d" data-path="src/pages/Salary/SalaryForm.tsx">Base Salary</Label>
                <NumberInput
                  id="base_salary"
                  step="0.01"
                  value={formData.base_salary}
                  onChange={(value) => handleInputChange('base_salary', value)} data-id="4szvcul7u" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="bhrqdxgzz" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="hourly_rate" data-id="fdfwt0fw8" data-path="src/pages/Salary/SalaryForm.tsx">Hourly Rate</Label>
                <NumberInput
                  id="hourly_rate"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(value) => handleInputChange('hourly_rate', value)} data-id="2iv01s8ee" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="17b8suy0t" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="regular_hours" data-id="1t7j4v0gp" data-path="src/pages/Salary/SalaryForm.tsx">Regular Hours</Label>
                <NumberInput
                  id="regular_hours"
                  step="0.01"
                  value={formData.regular_hours}
                  onChange={(value) => handleInputChange('regular_hours', value)} data-id="43giyqi7m" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="zg2dg42uu" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="overtime_hours" data-id="4fz98tznl" data-path="src/pages/Salary/SalaryForm.tsx">Overtime Hours</Label>
                <NumberInput
                  id="overtime_hours"
                  step="0.01"
                  value={formData.overtime_hours}
                  onChange={(value) => handleInputChange('overtime_hours', value)} data-id="iculuxr8j" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="jn4kufzg1" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="overtime_rate" data-id="ltxixk4zb" data-path="src/pages/Salary/SalaryForm.tsx">Overtime Rate (Auto-calculated)</Label>
                <Input
                  id="overtime_rate"
                  type="number"
                  step="0.01"
                  value={formData.overtime_rate.toFixed(2)}
                  disabled
                  className="bg-muted" data-id="bcp8gk2wq" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="j0817hxnx" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="overtime_pay" data-id="ua1hjma6c" data-path="src/pages/Salary/SalaryForm.tsx">Overtime Pay (Auto-calculated)</Label>
                <Input
                  id="overtime_pay"
                  type="number"
                  step="0.01"
                  value={formData.overtime_pay.toFixed(2)}
                  disabled
                  className="bg-muted" data-id="zjnyghxto" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="4tqika07w" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="bonus_amount" data-id="iez2yl8qg" data-path="src/pages/Salary/SalaryForm.tsx">Bonus Amount</Label>
                <NumberInput
                  id="bonus_amount"
                  step="0.01"
                  value={formData.bonus_amount}
                  onChange={(value) => handleInputChange('bonus_amount', value)} data-id="derc29lna" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="mybay1e88" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="commission" data-id="8advihm43" data-path="src/pages/Salary/SalaryForm.tsx">Commission</Label>
                <NumberInput
                  id="commission"
                  step="0.01"
                  value={formData.commission}
                  onChange={(value) => handleInputChange('commission', value)} data-id="f9qlcz1fb" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>

              <div className="space-y-2" data-id="fts1oxp9j" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="gross_pay" data-id="5vjpgt53i" data-path="src/pages/Salary/SalaryForm.tsx">Gross Pay (Auto-calculated)</Label>
                <Input
                  id="gross_pay"
                  type="number"
                  step="0.01"
                  value={formData.gross_pay.toFixed(2)}
                  disabled
                  className="bg-muted font-bold" data-id="ipqut09z0" data-path="src/pages/Salary/SalaryForm.tsx" />

              </div>
            </div>
          </CardContent>
        </Card>



        {/* Additional Information */}
        <Card data-id="5hslmpskw" data-path="src/pages/Salary/SalaryForm.tsx">
          <CardHeader data-id="utztt0xmp" data-path="src/pages/Salary/SalaryForm.tsx">
            <CardTitle data-id="m5agaq1ay" data-path="src/pages/Salary/SalaryForm.tsx">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="8guzpw169" data-path="src/pages/Salary/SalaryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="82zro7kvt" data-path="src/pages/Salary/SalaryForm.tsx">
              <div className="space-y-2" data-id="08vzlgowp" data-path="src/pages/Salary/SalaryForm.tsx">
                <Label htmlFor="status" data-id="u9go33ott" data-path="src/pages/Salary/SalaryForm.tsx">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)} data-id="m4mkb76ox" data-path="src/pages/Salary/SalaryForm.tsx">
                  <SelectTrigger data-id="p6h9tlgb5" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectValue data-id="t8klju44w" data-path="src/pages/Salary/SalaryForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="md95uajkn" data-path="src/pages/Salary/SalaryForm.tsx">
                    <SelectItem value="Pending" data-id="rqnmoj27k" data-path="src/pages/Salary/SalaryForm.tsx">Pending</SelectItem>
                    <SelectItem value="Processed" data-id="399zhkpu8" data-path="src/pages/Salary/SalaryForm.tsx">Processed</SelectItem>
                    <SelectItem value="Paid" data-id="0797rrfag" data-path="src/pages/Salary/SalaryForm.tsx">Paid</SelectItem>
                    <SelectItem value="Cancelled" data-id="coukukz1f" data-path="src/pages/Salary/SalaryForm.tsx">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2" data-id="dbpaed75d" data-path="src/pages/Salary/SalaryForm.tsx">
              <Label htmlFor="notes" data-id="yk3x4yl27" data-path="src/pages/Salary/SalaryForm.tsx">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about this salary record..."
                rows={3} data-id="p19zucl3q" data-path="src/pages/Salary/SalaryForm.tsx" />

            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4" data-id="f9phyhivu" data-path="src/pages/Salary/SalaryForm.tsx">
          <Button type="button" variant="outline" onClick={() => navigate('/salary')} data-id="0bbzc5xxf" data-path="src/pages/Salary/SalaryForm.tsx">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} data-id="23gq6mhgv" data-path="src/pages/Salary/SalaryForm.tsx">
            {loading ?
            <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" data-id="k161nj8hp" data-path="src/pages/Salary/SalaryForm.tsx"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </> :

            <>
                <Save className="h-4 w-4 mr-2" data-id="4su2kcrqm" data-path="src/pages/Salary/SalaryForm.tsx" />
                {isEditing ? 'Update Record' : 'Create Record'}
              </>
            }
          </Button>
        </div>
      </form>
    </div>);

};

export default SalaryForm;