import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Users, Mail, Phone, Plus, Eye, Download, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewModal from '@/components/ViewModal';
import { useListKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface Employee {
  ID: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  station: string;
  hire_date: string;
  salary: number;
  is_active: boolean;
  created_by: number;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  const pageSize = 10;

  useEffect(() => {
    loadEmployees();
  }, [currentPage, searchTerm, selectedStation]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('employees')
        .select('*', { count: 'exact' })
        .order('ID', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,employee_id.ilike.%${searchTerm}%`);
      }

      if (selectedStation && selectedStation !== 'ALL') {
        query = query.eq('station', selectedStation);
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setEmployees(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee.ID);
    setViewModalOpen(true);
  };

  const handleEdit = (employeeId: number) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDelete = async (employeeId: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee deleted successfully"
      });
      loadEmployees();
      setViewModalOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!selectedEmployee) return;

    const csvContent = [
    'Field,Value',
    `Employee ID,${selectedEmployee.employee_id}`,
    `Name,${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
    `Email,${selectedEmployee.email}`,
    `Phone,${selectedEmployee.phone}`,
    `Position,${selectedEmployee.position}`,
    `Station,${selectedEmployee.station}`,
    `Hire Date,${selectedEmployee.hire_date}`,
    `Salary,${selectedEmployee.salary}`,
    `Status,${selectedEmployee.is_active ? 'Active' : 'Inactive'}`].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_${selectedEmployee.employee_id}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Employee details exported successfully"
    });
  };

  // Keyboard shortcuts
  useListKeyboardShortcuts(
    selectedEmployeeId,
    (id) => {
      const employee = employees.find((emp) => emp.ID === id);
      if (employee) handleView(employee);
    },
    handleEdit,
    handleDelete,
    () => navigate('/employees/new')
  );

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-blue-500';
      case 'AMOCO ROSEDALE':
        return 'bg-green-500';
      case 'AMOCO BROOKLYN':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Define view modal fields
  const getViewModalFields = (employee: Employee) => [
  {
    key: 'employee_id',
    label: 'Employee ID',
    value: employee.employee_id,
    type: 'text' as const,
    icon: User
  },
  {
    key: 'name',
    label: 'Full Name',
    value: `${employee.first_name} ${employee.last_name}`,
    type: 'text' as const,
    icon: User
  },
  {
    key: 'email',
    label: 'Email',
    value: employee.email,
    type: 'email' as const
  },
  {
    key: 'phone',
    label: 'Phone',
    value: employee.phone,
    type: 'phone' as const
  },
  {
    key: 'position',
    label: 'Position',
    value: employee.position,
    type: 'text' as const
  },
  {
    key: 'station',
    label: 'Station',
    value: employee.station,
    type: 'badge' as const,
    badgeColor: getStationBadgeColor(employee.station)
  },
  {
    key: 'hire_date',
    label: 'Hire Date',
    value: employee.hire_date,
    type: 'date' as const
  },
  {
    key: 'salary',
    label: 'Salary',
    value: employee.salary,
    type: 'currency' as const
  },
  {
    key: 'is_active',
    label: 'Status',
    value: employee.is_active,
    type: 'boolean' as const
  }];


  return (
    <div className="space-y-6" data-id="zmmkn8bnw" data-path="src/pages/Employees/EmployeeList.tsx">
      <Card data-id="uxdnid6ft" data-path="src/pages/Employees/EmployeeList.tsx">
        <CardHeader data-id="tu2w7bkm3" data-path="src/pages/Employees/EmployeeList.tsx">
          <div className="flex items-center justify-between" data-id="muol9vvbd" data-path="src/pages/Employees/EmployeeList.tsx">
            <div className="flex flex-col" data-id="b4ei4ih1y" data-path="src/pages/Employees/EmployeeList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="kc411o880" data-path="src/pages/Employees/EmployeeList.tsx">
                <Users className="w-6 h-6" data-id="zfdraguaf" data-path="src/pages/Employees/EmployeeList.tsx" />
                <span data-id="0nmrmqj64" data-path="src/pages/Employees/EmployeeList.tsx">Employee List</span>
              </CardTitle>
              <CardDescription data-id="0z075w2c2" data-path="src/pages/Employees/EmployeeList.tsx">
                Manage your employees across all stations
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate('/employees/new')}
              className="flex items-center space-x-2" data-id="bybi2tm73" data-path="src/pages/Employees/EmployeeList.tsx">

              <Plus className="w-4 h-4" data-id="4z56y4t30" data-path="src/pages/Employees/EmployeeList.tsx" />
              <span data-id="d1zvu9yiq" data-path="src/pages/Employees/EmployeeList.tsx">Add Employee</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="be1j7hds5" data-path="src/pages/Employees/EmployeeList.tsx">
          {/* Station Filter */}
          <div className="flex items-center space-x-4 mb-6" data-id="l1pja9kvd" data-path="src/pages/Employees/EmployeeList.tsx">
            <div className="w-64" data-id="4tp5vq593" data-path="src/pages/Employees/EmployeeList.tsx">
              <Select value={selectedStation} onValueChange={setSelectedStation} data-id="7m72i2mz0" data-path="src/pages/Employees/EmployeeList.tsx">
                <SelectTrigger data-id="jpur4sjuj" data-path="src/pages/Employees/EmployeeList.tsx">
                  <SelectValue placeholder="Select Station" data-id="9j5he2aix" data-path="src/pages/Employees/EmployeeList.tsx" />
                </SelectTrigger>
                <SelectContent data-id="kkbd0hlr9" data-path="src/pages/Employees/EmployeeList.tsx">
                  <SelectItem value="ALL" data-id="85vrrdznp" data-path="src/pages/Employees/EmployeeList.tsx">Select Any Station</SelectItem>
                  <SelectItem value="MOBIL" data-id="x4eu19zdf" data-path="src/pages/Employees/EmployeeList.tsx">MOBIL</SelectItem>
                  <SelectItem value="AMOCO ROSEDALE" data-id="2k4a7qk9q" data-path="src/pages/Employees/EmployeeList.tsx">AMOCO ROSEDALE</SelectItem>
                  <SelectItem value="AMOCO BROOKLYN" data-id="q39y6o9hr" data-path="src/pages/Employees/EmployeeList.tsx">AMOCO BROOKLYN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 max-w-sm" data-id="i5jvqz05m" data-path="src/pages/Employees/EmployeeList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="ebsi0qdr1" data-path="src/pages/Employees/EmployeeList.tsx" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="jvpmuxhpi" data-path="src/pages/Employees/EmployeeList.tsx" />
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-id="0yl8qwrxb" data-path="src/pages/Employees/EmployeeList.tsx">
            <p className="text-sm text-blue-700" data-id="wqswrmsd7" data-path="src/pages/Employees/EmployeeList.tsx">
              <strong data-id="ca8ls0gyv" data-path="src/pages/Employees/EmployeeList.tsx">Keyboard shortcuts:</strong> Select a row, then press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs" data-id="mtypif3ek" data-path="src/pages/Employees/EmployeeList.tsx">V</kbd> to view, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="u7gu7kqum" data-path="src/pages/Employees/EmployeeList.tsx">E</kbd> to edit, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="vl1iyntwg" data-path="src/pages/Employees/EmployeeList.tsx">D</kbd> to delete, or 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="cu3p5jgo9" data-path="src/pages/Employees/EmployeeList.tsx">Ctrl+N</kbd> to create new
            </p>
          </div>

          {/* Employees Table */}
          {loading ?
          <div className="space-y-4" data-id="1bh0bxn2i" data-path="src/pages/Employees/EmployeeList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="e8hdycdfx" data-path="src/pages/Employees/EmployeeList.tsx"></div>
            )}
            </div> :
          employees.length === 0 ?
          <div className="text-center py-8" data-id="unsu76yyp" data-path="src/pages/Employees/EmployeeList.tsx">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="fgccdxg32" data-path="src/pages/Employees/EmployeeList.tsx" />
              <p className="text-gray-500" data-id="ef5gtm3m0" data-path="src/pages/Employees/EmployeeList.tsx">No employees found</p>
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="xdm7tfsfq" data-path="src/pages/Employees/EmployeeList.tsx">
              <Table data-id="xv7v28pfo" data-path="src/pages/Employees/EmployeeList.tsx">
                <TableHeader data-id="b04pp8sp1" data-path="src/pages/Employees/EmployeeList.tsx">
                  <TableRow data-id="xfbuelacs" data-path="src/pages/Employees/EmployeeList.tsx">
                    <TableHead data-id="qddxyqv1w" data-path="src/pages/Employees/EmployeeList.tsx">Employee ID</TableHead>
                    <TableHead data-id="c2im5d5jv" data-path="src/pages/Employees/EmployeeList.tsx">Name</TableHead>
                    <TableHead data-id="6f10948kv" data-path="src/pages/Employees/EmployeeList.tsx">Contact</TableHead>
                    <TableHead data-id="nea2rabf4" data-path="src/pages/Employees/EmployeeList.tsx">Position</TableHead>
                    <TableHead data-id="f5x7kcvgc" data-path="src/pages/Employees/EmployeeList.tsx">Station</TableHead>
                    <TableHead data-id="b813hg7w3" data-path="src/pages/Employees/EmployeeList.tsx">Hire Date</TableHead>
                    <TableHead data-id="ghtn2lbek" data-path="src/pages/Employees/EmployeeList.tsx">Status</TableHead>
                    <TableHead data-id="inkk7barm" data-path="src/pages/Employees/EmployeeList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="uv45zdj6q" data-path="src/pages/Employees/EmployeeList.tsx">
                  {employees.map((employee, index) =>
                <motion.tr
                  key={employee.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedEmployeeId === employee.ID ? 'bg-blue-50 border-blue-200' : ''}`
                  }
                  onClick={() => setSelectedEmployeeId(employee.ID)} data-id="s9x68qcp6" data-path="src/pages/Employees/EmployeeList.tsx">

                      <TableCell className="font-medium" data-id="t6cjhvsn2" data-path="src/pages/Employees/EmployeeList.tsx">{employee.employee_id}</TableCell>
                      <TableCell data-id="eujv99as4" data-path="src/pages/Employees/EmployeeList.tsx">
                        <div data-id="bx49fz3gr" data-path="src/pages/Employees/EmployeeList.tsx">
                          <p className="font-medium" data-id="wr0jkekan" data-path="src/pages/Employees/EmployeeList.tsx">{employee.first_name} {employee.last_name}</p>
                          <p className="text-sm text-gray-500" data-id="obzmh00xr" data-path="src/pages/Employees/EmployeeList.tsx">{employee.position}</p>
                        </div>
                      </TableCell>
                      <TableCell data-id="4fzyy21vx" data-path="src/pages/Employees/EmployeeList.tsx">
                        <div className="space-y-1" data-id="o01xfi1dn" data-path="src/pages/Employees/EmployeeList.tsx">
                          {employee.email &&
                      <div className="flex items-center space-x-1 text-sm" data-id="2edakrf7b" data-path="src/pages/Employees/EmployeeList.tsx">
                              <Mail className="w-3 h-3" data-id="6x2s6wcs9" data-path="src/pages/Employees/EmployeeList.tsx" />
                              <span data-id="lwnny6tnb" data-path="src/pages/Employees/EmployeeList.tsx">{employee.email}</span>
                            </div>
                      }
                          {employee.phone &&
                      <div className="flex items-center space-x-1 text-sm" data-id="qof4owl4b" data-path="src/pages/Employees/EmployeeList.tsx">
                              <Phone className="w-3 h-3" data-id="84dst5jpo" data-path="src/pages/Employees/EmployeeList.tsx" />
                              <span data-id="s46tecofs" data-path="src/pages/Employees/EmployeeList.tsx">{employee.phone}</span>
                            </div>
                      }
                        </div>
                      </TableCell>
                      <TableCell data-id="u2pbnhvdh" data-path="src/pages/Employees/EmployeeList.tsx">{employee.position}</TableCell>
                      <TableCell data-id="o9h7jbfko" data-path="src/pages/Employees/EmployeeList.tsx">
                        <Badge className={`text-white ${getStationBadgeColor(employee.station)}`} data-id="ggvzngnc6" data-path="src/pages/Employees/EmployeeList.tsx">
                          {employee.station}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="wkjt75be5" data-path="src/pages/Employees/EmployeeList.tsx">{formatDate(employee.hire_date)}</TableCell>
                      <TableCell data-id="1e91rwri3" data-path="src/pages/Employees/EmployeeList.tsx">
                        <Badge variant={employee.is_active ? "default" : "secondary"} data-id="i9qlbly9g" data-path="src/pages/Employees/EmployeeList.tsx">
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="dw3le627q" data-path="src/pages/Employees/EmployeeList.tsx">
                        <div className="flex items-center space-x-2" data-id="1ln5fu8na" data-path="src/pages/Employees/EmployeeList.tsx">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(employee);
                        }}
                        className="text-blue-600 hover:text-blue-700" data-id="r83qrzb9m" data-path="src/pages/Employees/EmployeeList.tsx">

                            <Eye className="w-4 h-4" data-id="7hsn61dl7" data-path="src/pages/Employees/EmployeeList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(employee.ID);
                        }} data-id="s96ihm5uy" data-path="src/pages/Employees/EmployeeList.tsx">

                            <Edit className="w-4 h-4" data-id="k1d5xiv5n" data-path="src/pages/Employees/EmployeeList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(employee.ID);
                        }}
                        className="text-red-600 hover:text-red-700" data-id="l96cn6jgn" data-path="src/pages/Employees/EmployeeList.tsx">

                            <Trash2 className="w-4 h-4" data-id="ed5t8yyg4" data-path="src/pages/Employees/EmployeeList.tsx" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                )}
                </TableBody>
              </Table>
            </div>
          }

          {/* Pagination */}
          {totalPages > 1 &&
          <div className="flex items-center justify-between mt-6" data-id="9irxs9jae" data-path="src/pages/Employees/EmployeeList.tsx">
              <p className="text-sm text-gray-700" data-id="hso0coido" data-path="src/pages/Employees/EmployeeList.tsx">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} employees
              </p>
              <div className="flex items-center space-x-2" data-id="sziex4qrk" data-path="src/pages/Employees/EmployeeList.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} data-id="tagh7fm1g" data-path="src/pages/Employees/EmployeeList.tsx">

                  Previous
                </Button>
                <span className="text-sm" data-id="56vw801ao" data-path="src/pages/Employees/EmployeeList.tsx">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} data-id="72b1oks56" data-path="src/pages/Employees/EmployeeList.tsx">

                  Next
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>
      
      {/* View Modal */}
      {selectedEmployee &&
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedEmployee(null);
          setSelectedEmployeeId(null);
        }}
        title={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
        subtitle={`Employee ID: ${selectedEmployee.employee_id} • ${selectedEmployee.position}`}
        data={selectedEmployee}
        fields={getViewModalFields(selectedEmployee)}
        onEdit={() => {
          setViewModalOpen(false);
          handleEdit(selectedEmployee.ID);
        }}
        onDelete={() => handleDelete(selectedEmployee.ID)}
        onExport={handleExport}
        canEdit={true}
        canDelete={true}
        canExport={true} data-id="rp94i4iwx" data-path="src/pages/Employees/EmployeeList.tsx" />

      }
    </div>);

};

export default EmployeeList;