import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  position: string;
  station: string;
  is_active: boolean;
}

interface EmployeeSelectorProps {
  value?: string;
  onValueChange: (employeeId: string, employeeName: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  station?: string; // Filter by station if provided
  className?: string;
  showLabel?: boolean;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  value,
  onValueChange,
  label = "Employee",
  placeholder = "Select employee",
  required = false,
  disabled = false,
  station,
  className = "",
  showLabel = true
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmployees();
  }, [station]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const filters = [
      { name: 'is_active', op: 'Equal', value: true }];


      // Add station filter if provided
      let query = supabase
        .from('employees')
        .select('*')
        .order('first_name', { ascending: true })
        .limit(1000);

      if (station) {
        query = query.eq('station', station);
      }

      const { data, error } = await query;

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
      setLoading(false);
    }
  };

  const handleValueChange = (selectedEmployeeId: string) => {
    const selectedEmployee = employees.find((emp) => emp.employee_id === selectedEmployeeId);
    if (selectedEmployee) {
      const fullName = `${selectedEmployee.first_name} ${selectedEmployee.last_name}`;
      onValueChange(selectedEmployeeId, fullName);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} data-id="htgoczga6" data-path="src/components/EmployeeSelector.tsx">
      {showLabel &&
      <Label htmlFor="employee-selector" className="flex items-center gap-2" data-id="s8ie4yppw" data-path="src/components/EmployeeSelector.tsx">
          <Users className="w-4 h-4" data-id="ec4zf3nj1" data-path="src/components/EmployeeSelector.tsx" />
          {label} {required && <span className="text-red-500" data-id="ezmwyhm0p" data-path="src/components/EmployeeSelector.tsx">*</span>}
        </Label>
      }
      
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled || loading}
        required={required} data-id="cf745dxpu" data-path="src/components/EmployeeSelector.tsx">

        <SelectTrigger className="w-full" data-id="25eyepay4" data-path="src/components/EmployeeSelector.tsx">
          <SelectValue
            placeholder={
            loading ?
            <div className="flex items-center gap-2" data-id="2zu2j4nlo" data-path="src/components/EmployeeSelector.tsx">
                  <Loader2 className="w-4 h-4 animate-spin" data-id="2ek3uewq7" data-path="src/components/EmployeeSelector.tsx" />
                  Loading employees...
                </div> :
            placeholder
            } data-id="m2yoz8ow7" data-path="src/components/EmployeeSelector.tsx" />

        </SelectTrigger>
        <SelectContent data-id="7suu6c72h" data-path="src/components/EmployeeSelector.tsx">
          {employees.length === 0 && !loading &&
          <div className="p-2 text-center text-gray-500" data-id="qez0zjq5y" data-path="src/components/EmployeeSelector.tsx">
              {station ? `No active employees found for ${station}` : 'No active employees found'}
            </div>
          }
          
          {employees.map((employee) =>
          <SelectItem key={employee.id} value={employee.employee_id} data-id="jplc15lco" data-path="src/components/EmployeeSelector.tsx">
              <div className="flex flex-col" data-id="oy2vnjrwy" data-path="src/components/EmployeeSelector.tsx">
                <span className="font-medium" data-id="1x2u0g8li" data-path="src/components/EmployeeSelector.tsx">
                  {employee.first_name} {employee.last_name}
                </span>
                <span className="text-xs text-gray-500" data-id="d6nr76ou4" data-path="src/components/EmployeeSelector.tsx">
                  ID: {employee.employee_id} • {employee.position} • {employee.station}
                </span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {station &&
      <p className="text-xs text-gray-500" data-id="7pt3k69d7" data-path="src/components/EmployeeSelector.tsx">
          Showing employees from {station} station only
        </p>
      }
    </div>);

};

export default EmployeeSelector;