import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, _Phone, Building2, Shield, _Calendar, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  station: string;
  employee_id: string;
  hire_date: string;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ isOpen, onClose, onUserCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'Employee',
    station: 'MOBIL',
    employee_id: '',
    hire_date: new Date().toISOString().split('T')[0]
  });

  const roles = ['Administrator', 'Management', 'Employee'];
  const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

  const generateEmployeeId = () => {
    const prefix = formData.station.split(' ')[0].substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const generatePassword = () => {
    const length = 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email || !formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }
    if (!formData.employee_id.trim()) {
      return 'Employee ID is required';
    }
    return null;
  };

  const handleCreateUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.warn('Starting user creation process...');

      // Step 1: Register user with Supabase Auth
      console.warn('Registering user with email:', formData.email);
      const { error: authError } = await window.ezsite.apis.register({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        console.error('Authentication registration failed:', authError);
        throw new Error(`Failed to create user account: ${authError}`);
      }

      console.warn('User authentication account created successfully');

      // Step 2: Get the newly created user info
      let userInfo;
      let retryCount = 0;
      const maxRetries = 5;

      // Retry logic to get user info after registration
      while (retryCount < maxRetries) {
        try {
          const { data, error: userInfoError } = await window.ezsite.apis.getUserInfo();
          if (!userInfoError && data) {
            userInfo = data;
            break;
          }
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        } catch (error) {
          console.warn(`Retry ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      if (!userInfo) {
        console.error('Failed to get user info after registration');
        throw new Error('User was created but profile setup failed. Please try to create the profile manually.');
      }

      console.warn('Retrieved user info:', userInfo);

      // Step 3: Create user profile in the database
      const profileData = {
        user_id: userInfo.ID,
        role: formData.role,
        station: formData.station,
        employee_id: formData.employee_id,
        phone: formData.phone,
        hire_date: formData.hire_date,
        is_active: true,
        detailed_permissions: JSON.stringify({
          dashboard: { view: true, create: false, edit: false, delete: false },
          products: { view: formData.role !== 'Employee', create: false, edit: false, delete: false },
          employees: { view: formData.role === 'Administrator', create: false, edit: false, delete: false },
          sales_reports: { view: true, create: formData.role !== 'Employee', edit: formData.role !== 'Employee', delete: false },
          vendors: { view: formData.role !== 'Employee', create: false, edit: false, delete: false },
          orders: { view: formData.role !== 'Employee', create: formData.role !== 'Employee', edit: formData.role !== 'Employee', delete: false },
          licenses: { view: formData.role !== 'Employee', create: false, edit: false, delete: false },
          salary: { view: formData.role === 'Administrator', create: formData.role === 'Administrator', edit: formData.role === 'Administrator', delete: false },
          inventory: { view: true, create: formData.role !== 'Employee', edit: formData.role !== 'Employee', delete: false },
          delivery: { view: formData.role !== 'Employee', create: formData.role !== 'Employee', edit: formData.role !== 'Employee', delete: false },
          settings: { view: formData.role === 'Administrator', create: false, edit: formData.role === 'Administrator', delete: false },
          user_management: { view: formData.role === 'Administrator', create: formData.role === 'Administrator', edit: formData.role === 'Administrator', delete: formData.role === 'Administrator' },
          site_management: { view: formData.role === 'Administrator', create: formData.role === 'Administrator', edit: formData.role === 'Administrator', delete: formData.role === 'Administrator' },
          system_logs: { view: formData.role === 'Administrator', create: false, edit: false, delete: false },
          security_settings: { view: formData.role === 'Administrator', create: false, edit: formData.role === 'Administrator', delete: false }
        })
      };

      console.warn('Creating user profile with data:', profileData);
      const { error: profileError } = await window.ezsite.apis.tableCreate(11725, profileData);

      if (profileError) {
        console.error('Profile creation failed:', profileError);
        throw new Error(`Failed to create user profile: ${profileError}`);
      }

      console.warn('User profile created successfully');

      // Step 4: Send welcome email (optional)
      try {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Welcome to DFS Manager Portal</h2>
            <p>Hello ${formData.firstName} ${formData.lastName},</p>
            <p>Your account has been successfully created for the DFS Manager Portal.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Account Details:</h3>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Employee ID:</strong> ${formData.employee_id}</p>
              <p><strong>Role:</strong> ${formData.role}</p>
              <p><strong>Station:</strong> ${formData.station}</p>
              <p><strong>Hire Date:</strong> ${new Date(formData.hire_date).toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h4 style="color: #92400e; margin-top: 0;">Login Information:</h4>
              <p style="color: #92400e; margin-bottom: 0;"><strong>Temporary Password:</strong> ${formData.password}</p>
              <p style="color: #92400e; font-size: 14px;"><em>Please change your password after your first login for security purposes.</em></p>
            </div>
            
            <p>You can access the portal at: <a href="${window.location.origin}" style="color: #2563eb;">${window.location.origin}</a></p>
            
            <p>If you have any questions or need assistance, please contact your administrator.</p>
            
            <p>Best regards,<br>DFS Manager Portal Team</p>
          </div>
        `;

        await window.ezsite.apis.sendEmail({
          from: 'support@ezsite.ai',
          to: [formData.email],
          subject: 'Welcome to DFS Manager Portal - Account Created',
          html: emailContent
        });

        console.warn('Welcome email sent successfully');
      } catch (emailError) {
        console.warn('Failed to send welcome email:', emailError);
        // Don't fail the entire process if email fails
      }

      toast({
        title: "Success",
        description: `User account created successfully for ${formData.firstName} ${formData.lastName}. Welcome email sent to ${formData.email}.`
      });

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'Employee',
        station: 'MOBIL',
        employee_id: '',
        hire_date: new Date().toISOString().split('T')[0]
      });

      onUserCreated();
      onClose();

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} data-id="km3gduqdr" data-path="src/components/CreateUserDialog.tsx">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-id="walnpz9pa" data-path="src/components/CreateUserDialog.tsx">
        <DialogHeader data-id="i6yjwrf14" data-path="src/components/CreateUserDialog.tsx">
          <DialogTitle className="flex items-center space-x-2" data-id="9yqv0sv4y" data-path="src/components/CreateUserDialog.tsx">
            <User className="w-5 h-5 text-blue-600" data-id="tqpppjzl3" data-path="src/components/CreateUserDialog.tsx" />
            <span data-id="pzncp6w5m" data-path="src/components/CreateUserDialog.tsx">Create New User</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6" data-id="bwqfjiswa" data-path="src/components/CreateUserDialog.tsx">
          {/* Account Information */}
          <Card data-id="c4urb32v3" data-path="src/components/CreateUserDialog.tsx">
            <CardContent className="p-4" data-id="twlth15i0" data-path="src/components/CreateUserDialog.tsx">
              <div className="flex items-center space-x-2 mb-4" data-id="rh2h78y06" data-path="src/components/CreateUserDialog.tsx">
                <Mail className="w-4 h-4 text-blue-600" data-id="oemknr39k" data-path="src/components/CreateUserDialog.tsx" />
                <h3 className="font-semibold" data-id="svfs3r66c" data-path="src/components/CreateUserDialog.tsx">Account Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="rg2l0qreg" data-path="src/components/CreateUserDialog.tsx">
                <div data-id="hmhxyctjb" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="email" data-id="ucbh5m6og" data-path="src/components/CreateUserDialog.tsx">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="user@example.com"
                    required
                    disabled={loading} data-id="kekulnv4w" data-path="src/components/CreateUserDialog.tsx" />

                </div>
                
                <div data-id="vj1auf2q1" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="password" data-id="mhw3ttq36" data-path="src/components/CreateUserDialog.tsx">Password *</Label>
                  <div className="relative" data-id="rd4jc1nyu" data-path="src/components/CreateUserDialog.tsx">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                      required
                      disabled={loading} data-id="aeqerz2rs" data-path="src/components/CreateUserDialog.tsx" />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading} data-id="1s5co5wq3" data-path="src/components/CreateUserDialog.tsx">

                      {showPassword ? <EyeOff className="w-4 h-4" data-id="y2gfvyrq1" data-path="src/components/CreateUserDialog.tsx" /> : <Eye className="w-4 h-4" data-id="qa1cwiycx" data-path="src/components/CreateUserDialog.tsx" />}
                    </Button>
                  </div>
                  <div className="flex space-x-2 mt-2" data-id="pydn71uks" data-path="src/components/CreateUserDialog.tsx">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('password', generatePassword())}
                      disabled={loading} data-id="oftfsi1dc" data-path="src/components/CreateUserDialog.tsx">

                      Generate Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card data-id="21owqm65d" data-path="src/components/CreateUserDialog.tsx">
            <CardContent className="p-4" data-id="c4k8xe17k" data-path="src/components/CreateUserDialog.tsx">
              <div className="flex items-center space-x-2 mb-4" data-id="j3q11eb15" data-path="src/components/CreateUserDialog.tsx">
                <User className="w-4 h-4 text-green-600" data-id="pyz15q2zf" data-path="src/components/CreateUserDialog.tsx" />
                <h3 className="font-semibold" data-id="azgqr1hrq" data-path="src/components/CreateUserDialog.tsx">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="cqwoqeako" data-path="src/components/CreateUserDialog.tsx">
                <div data-id="y3gtlqx0o" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="firstName" data-id="zh4tae56a" data-path="src/components/CreateUserDialog.tsx">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                    disabled={loading} data-id="rh293ncct" data-path="src/components/CreateUserDialog.tsx" />

                </div>
                
                <div data-id="fgxurblql" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="lastName" data-id="sgq2ck4bc" data-path="src/components/CreateUserDialog.tsx">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                    disabled={loading} data-id="4nuig9esw" data-path="src/components/CreateUserDialog.tsx" />

                </div>
                
                <div data-id="plpprojvp" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="phone" data-id="4cuve2h42" data-path="src/components/CreateUserDialog.tsx">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                    disabled={loading} data-id="jy2318zb3" data-path="src/components/CreateUserDialog.tsx" />

                </div>
                
                <div data-id="r0s47fne2" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="hire_date" data-id="sni834hm0" data-path="src/components/CreateUserDialog.tsx">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    disabled={loading} data-id="aah2duhbt" data-path="src/components/CreateUserDialog.tsx" />

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card data-id="416tr1uza" data-path="src/components/CreateUserDialog.tsx">
            <CardContent className="p-4" data-id="hkkna6u17" data-path="src/components/CreateUserDialog.tsx">
              <div className="flex items-center space-x-2 mb-4" data-id="v2e4xm6se" data-path="src/components/CreateUserDialog.tsx">
                <Building2 className="w-4 h-4 text-purple-600" data-id="zb1nzua2g" data-path="src/components/CreateUserDialog.tsx" />
                <h3 className="font-semibold" data-id="2mu2gqlk8" data-path="src/components/CreateUserDialog.tsx">Work Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="g5xvk75tg" data-path="src/components/CreateUserDialog.tsx">
                <div data-id="hhitevevl" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="role" data-id="t1sjey12n" data-path="src/components/CreateUserDialog.tsx">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={loading} data-id="woyjgrury" data-path="src/components/CreateUserDialog.tsx">

                    <SelectTrigger data-id="4se6lhp6e" data-path="src/components/CreateUserDialog.tsx">
                      <SelectValue placeholder="Select role" data-id="5g2tljgma" data-path="src/components/CreateUserDialog.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="ufpi7864f" data-path="src/components/CreateUserDialog.tsx">
                      {roles.map((role) =>
                      <SelectItem key={role} value={role} data-id="0dsd5g89u" data-path="src/components/CreateUserDialog.tsx">
                          <div className="flex items-center space-x-2" data-id="yyxq1tivo" data-path="src/components/CreateUserDialog.tsx">
                            <Shield className="w-4 h-4" data-id="s09uo4fx0" data-path="src/components/CreateUserDialog.tsx" />
                            <span data-id="08h3u4qcb" data-path="src/components/CreateUserDialog.tsx">{role}</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div data-id="96acp30ck" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="station" data-id="do3kxwxzm" data-path="src/components/CreateUserDialog.tsx">Station *</Label>
                  <Select
                    value={formData.station}
                    onValueChange={(value) => handleInputChange('station', value)}
                    disabled={loading} data-id="1f8cpxdyi" data-path="src/components/CreateUserDialog.tsx">

                    <SelectTrigger data-id="o2efe4vbe" data-path="src/components/CreateUserDialog.tsx">
                      <SelectValue placeholder="Select station" data-id="z8jzr6ik1" data-path="src/components/CreateUserDialog.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="itdmpjmpc" data-path="src/components/CreateUserDialog.tsx">
                      {stations.map((station) =>
                      <SelectItem key={station} value={station} data-id="gwyw5iiqf" data-path="src/components/CreateUserDialog.tsx">
                          <div className="flex items-center space-x-2" data-id="pb0l8621t" data-path="src/components/CreateUserDialog.tsx">
                            <Building2 className="w-4 h-4" data-id="jxlfdqft7" data-path="src/components/CreateUserDialog.tsx" />
                            <span data-id="yjro0ecdj" data-path="src/components/CreateUserDialog.tsx">{station}</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2" data-id="jc0arhrkf" data-path="src/components/CreateUserDialog.tsx">
                  <Label htmlFor="employee_id" data-id="qrya6sf2c" data-path="src/components/CreateUserDialog.tsx">Employee ID *</Label>
                  <div className="flex space-x-2" data-id="zgph5pifg" data-path="src/components/CreateUserDialog.tsx">
                    <Input
                      id="employee_id"
                      value={formData.employee_id}
                      onChange={(e) => handleInputChange('employee_id', e.target.value)}
                      placeholder="EMP-123456"
                      required
                      disabled={loading} data-id="zuujtffey" data-path="src/components/CreateUserDialog.tsx" />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleInputChange('employee_id', generateEmployeeId())}
                      disabled={loading} data-id="fyobwrhui" data-path="src/components/CreateUserDialog.tsx">

                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Preview */}
          <Card data-id="vytev6wl5" data-path="src/components/CreateUserDialog.tsx">
            <CardContent className="p-4" data-id="6ueuwyesn" data-path="src/components/CreateUserDialog.tsx">
              <div className="flex items-center space-x-2 mb-4" data-id="b7xejz6e2" data-path="src/components/CreateUserDialog.tsx">
                <Shield className="w-4 h-4 text-orange-600" data-id="0vvvwi73a" data-path="src/components/CreateUserDialog.tsx" />
                <h3 className="font-semibold" data-id="kq78ppwm7" data-path="src/components/CreateUserDialog.tsx">Permissions Preview</h3>
              </div>
              
              <div className="space-y-2" data-id="eznimjmhi" data-path="src/components/CreateUserDialog.tsx">
                <div className="flex items-center justify-between" data-id="4xnbn6l7b" data-path="src/components/CreateUserDialog.tsx">
                  <span className="text-sm" data-id="bqz1aisvh" data-path="src/components/CreateUserDialog.tsx">Dashboard Access</span>
                  <Badge variant="default" data-id="ppwrzg6zv" data-path="src/components/CreateUserDialog.tsx">Granted</Badge>
                </div>
                <div className="flex items-center justify-between" data-id="nqaneqg68" data-path="src/components/CreateUserDialog.tsx">
                  <span className="text-sm" data-id="sw31aaccd" data-path="src/components/CreateUserDialog.tsx">Sales Reports</span>
                  <Badge variant={formData.role !== 'Employee' ? 'default' : 'secondary'} data-id="jms6idu4p" data-path="src/components/CreateUserDialog.tsx">
                    {formData.role !== 'Employee' ? 'Full Access' : 'View Only'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between" data-id="o2gib9hal" data-path="src/components/CreateUserDialog.tsx">
                  <span className="text-sm" data-id="qigohkpc4" data-path="src/components/CreateUserDialog.tsx">User Management</span>
                  <Badge variant={formData.role === 'Administrator' ? 'default' : 'secondary'} data-id="fx4j18lgp" data-path="src/components/CreateUserDialog.tsx">
                    {formData.role === 'Administrator' ? 'Full Access' : 'No Access'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between" data-id="qvgrv15x8" data-path="src/components/CreateUserDialog.tsx">
                  <span className="text-sm" data-id="sorg0pmox" data-path="src/components/CreateUserDialog.tsx">System Administration</span>
                  <Badge variant={formData.role === 'Administrator' ? 'default' : 'secondary'} data-id="dftnuqtd1" data-path="src/components/CreateUserDialog.tsx">
                    {formData.role === 'Administrator' ? 'Full Access' : 'No Access'}
                  </Badge>
                </div>
              </div>
              
              <Alert className="mt-4" data-id="h6x2vgo5w" data-path="src/components/CreateUserDialog.tsx">
                <AlertDescription className="text-sm" data-id="dp2ezf46d" data-path="src/components/CreateUserDialog.tsx">
                  Permissions can be customized after user creation through the User Management interface.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t" data-id="ce49ctu65" data-path="src/components/CreateUserDialog.tsx">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading} data-id="g08rd8yae" data-path="src/components/CreateUserDialog.tsx">

              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700" data-id="fhce543e0" data-path="src/components/CreateUserDialog.tsx">

              {loading ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" data-id="k1vvppmjq" data-path="src/components/CreateUserDialog.tsx" />
                  Creating User...
                </> :

              <>
                  <User className="w-4 h-4 mr-2" data-id="oq0o86uzt" data-path="src/components/CreateUserDialog.tsx" />
                  Create User Account
                </>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

};

export default CreateUserDialog;