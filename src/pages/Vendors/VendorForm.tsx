import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface VendorFormData {
  vendor_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  payment_terms: string;
  is_active: boolean;
  station: string;
}

const VendorForm: React.FC = () => {
  const [formData, setFormData] = useState<VendorFormData>({
    vendor_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    payment_terms: '',
    is_active: true,
    station: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('');

  const navigate = useNavigate();
  const { id } = useParams();

  const categories = [
  'Fuel Supplier',
  'Food & Beverages',
  'Automotive',
  'Maintenance',
  'Office Supplies',
  'Technology',
  'Cleaning Services',
  'Security Services',
  'Other'];


  const paymentTermsOptions = [
  'Net 30',
  'Net 15',
  'Payment on Delivery',
  'Prepaid',
  '2/10 Net 30',
  'Custom Terms'];

  const stations = [
  'MOBIL',
  'AMOCO ROSEDALE',
  'AMOCO BROOKLYN'];



  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadVendor(parseInt(id));
    }
  }, [id]);

  const loadVendor = async (vendorId: number) => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage('11729', {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: 'ID', op: 'Equal', value: vendorId }]
      });

      if (error) throw error;

      if (data && data.List && data.List.length > 0) {
        const vendor = data.List[0];
        setFormData({
          vendor_name: vendor.vendor_name || '',
          contact_person: vendor.contact_person || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          address: vendor.address || '',
          category: vendor.category || '',
          payment_terms: vendor.payment_terms || '',
          is_active: vendor.is_active !== false,
          station: vendor.station || ''
        });
        setSelectedStation(vendor.station || '');
      }
    } catch (error) {
      console.error('Error loading vendor:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dataToSubmit = {
        ...formData,
        station: selectedStation,
        created_by: 1
      };

      if (isEditing && id) {
        const { error } = await window.ezsite.apis.tableUpdate('11729', {
          ID: parseInt(id),
          ...dataToSubmit
        });
        if (error) throw error;

        toast({
          title: "Success",
          description: "Vendor updated successfully"
        });
      } else {
        const { error } = await window.ezsite.apis.tableCreate('11729', dataToSubmit);
        if (error) throw error;

        toast({
          title: "Success",
          description: "Vendor created successfully"
        });
      }

      navigate('/vendors');
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} vendor`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VendorFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStationSelect = (station: string) => {
    setSelectedStation(station);
    setFormData((prev) => ({ ...prev, station }));
  };

  return (
    <div className="space-y-6" data-id="2w9w0ie3m" data-path="src/pages/Vendors/VendorForm.tsx">
      <Card data-id="u92ybbjr1" data-path="src/pages/Vendors/VendorForm.tsx">
        <CardHeader data-id="s8341u6fd" data-path="src/pages/Vendors/VendorForm.tsx">
          <div className="flex items-center justify-between" data-id="yyw5vejf6" data-path="src/pages/Vendors/VendorForm.tsx">
            <div data-id="ev0vfxymk" data-path="src/pages/Vendors/VendorForm.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="08bfvda04" data-path="src/pages/Vendors/VendorForm.tsx">
                <Building2 className="w-6 h-6" data-id="0clsb3u9t" data-path="src/pages/Vendors/VendorForm.tsx" />
                <span data-id="6tjj5n0jk" data-path="src/pages/Vendors/VendorForm.tsx">{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</span>
              </CardTitle>
              <CardDescription data-id="sm0c6svar" data-path="src/pages/Vendors/VendorForm.tsx">
                {isEditing ? 'Update vendor information' : 'Add a new vendor to your contacts'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/vendors')} data-id="ux2b0t48o" data-path="src/pages/Vendors/VendorForm.tsx">
              <ArrowLeft className="w-4 h-4 mr-2" data-id="vb47p75yn" data-path="src/pages/Vendors/VendorForm.tsx" />
              Back to Vendors
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="1aauotzv3" data-path="src/pages/Vendors/VendorForm.tsx">
          {!selectedStation && !isEditing ?
          <div className="space-y-6" data-id="59k8of4qv" data-path="src/pages/Vendors/VendorForm.tsx">
              <div className="text-center space-y-4" data-id="9fjk7gf6k" data-path="src/pages/Vendors/VendorForm.tsx">
                <h3 className="text-lg font-semibold" data-id="mx5ipbxd6" data-path="src/pages/Vendors/VendorForm.tsx">Select Station First</h3>
                <p className="text-gray-600" data-id="5uvreq4zk" data-path="src/pages/Vendors/VendorForm.tsx">Please select a station before creating a vendor.</p>
              </div>
              
              <div className="max-w-md mx-auto space-y-4" data-id="jyc5mbay0" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="station" data-id="3n3z724vf" data-path="src/pages/Vendors/VendorForm.tsx">Station *</Label>
                <Select value={selectedStation} onValueChange={handleStationSelect} data-id="6ndbfufr7" data-path="src/pages/Vendors/VendorForm.tsx">
                  <SelectTrigger data-id="09vrw0453" data-path="src/pages/Vendors/VendorForm.tsx">
                    <SelectValue placeholder="Select a station" data-id="r3jv6eej9" data-path="src/pages/Vendors/VendorForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="wysv0k2uo" data-path="src/pages/Vendors/VendorForm.tsx">
                    {stations.map((station) =>
                  <SelectItem key={station} value={station} data-id="tz1igse0i" data-path="src/pages/Vendors/VendorForm.tsx">
                        {station}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
            </div> :

          <form onSubmit={handleSubmit} className="space-y-6" data-id="0p6uv9atr" data-path="src/pages/Vendors/VendorForm.tsx">
              {selectedStation &&
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-id="g1ezcq9i7" data-path="src/pages/Vendors/VendorForm.tsx">
                  <div className="flex items-center justify-between" data-id="0hhj943nv" data-path="src/pages/Vendors/VendorForm.tsx">
                    <div data-id="3ps9n35b4" data-path="src/pages/Vendors/VendorForm.tsx">
                      <h4 className="font-medium text-blue-900" data-id="ts5qkbam9" data-path="src/pages/Vendors/VendorForm.tsx">Selected Station</h4>
                      <p className="text-blue-700" data-id="a05hk127r" data-path="src/pages/Vendors/VendorForm.tsx">{selectedStation}</p>
                    </div>
                    {!isEditing &&
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStation('')} data-id="q4faa3po5" data-path="src/pages/Vendors/VendorForm.tsx">

                        Change Station
                      </Button>
                }
                  </div>
                </div>
            }
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="e3b0gpvp9" data-path="src/pages/Vendors/VendorForm.tsx">
              <div className="space-y-2" data-id="8yqmc129j" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="vendor_name" data-id="vobse7vlx" data-path="src/pages/Vendors/VendorForm.tsx">Vendor Name *</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => handleInputChange('vendor_name', e.target.value)}
                  placeholder="Enter vendor company name"
                  required data-id="isf47otkl" data-path="src/pages/Vendors/VendorForm.tsx" />

              </div>

              <div className="space-y-2" data-id="ed3s2hg8o" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="contact_person" data-id="baabf5xru" data-path="src/pages/Vendors/VendorForm.tsx">Contact Person *</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="Enter primary contact name"
                  required data-id="pa2962rko" data-path="src/pages/Vendors/VendorForm.tsx" />

              </div>

              <div className="space-y-2" data-id="zo1ejfl08" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="email" data-id="o6iftxzhh" data-path="src/pages/Vendors/VendorForm.tsx">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address" data-id="658lw18im" data-path="src/pages/Vendors/VendorForm.tsx" />

              </div>

              <div className="space-y-2" data-id="8zj8o3cig" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="phone" data-id="gol5ruinf" data-path="src/pages/Vendors/VendorForm.tsx">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number" data-id="e2svn4reb" data-path="src/pages/Vendors/VendorForm.tsx" />

              </div>

              <div className="space-y-2" data-id="gcl8n0cya" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="category" data-id="iee7yf4uc" data-path="src/pages/Vendors/VendorForm.tsx">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} data-id="dpk05vaoq" data-path="src/pages/Vendors/VendorForm.tsx">
                  <SelectTrigger data-id="xnz7lc8sb" data-path="src/pages/Vendors/VendorForm.tsx">
                    <SelectValue placeholder="Select vendor category" data-id="kl1ptz7ih" data-path="src/pages/Vendors/VendorForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="p6de13mta" data-path="src/pages/Vendors/VendorForm.tsx">
                    {categories.map((category) =>
                    <SelectItem key={category} value={category} data-id="kz349t2q3" data-path="src/pages/Vendors/VendorForm.tsx">
                        {category}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-id="x4hvgsrqj" data-path="src/pages/Vendors/VendorForm.tsx">
                <Label htmlFor="payment_terms" data-id="qflhxi9dw" data-path="src/pages/Vendors/VendorForm.tsx">Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)} data-id="nyv09ifgq" data-path="src/pages/Vendors/VendorForm.tsx">
                  <SelectTrigger data-id="wfbk3ktue" data-path="src/pages/Vendors/VendorForm.tsx">
                    <SelectValue placeholder="Select payment terms" data-id="kpn4p993i" data-path="src/pages/Vendors/VendorForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="5qtd6ipbp" data-path="src/pages/Vendors/VendorForm.tsx">
                    {paymentTermsOptions.map((terms) =>
                    <SelectItem key={terms} value={terms} data-id="5lldzxc60" data-path="src/pages/Vendors/VendorForm.tsx">
                        {terms}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2" data-id="3td80c7pn" data-path="src/pages/Vendors/VendorForm.tsx">
              <Label htmlFor="address" data-id="mx6j44ifg" data-path="src/pages/Vendors/VendorForm.tsx">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full business address"
                rows={3} data-id="8yvhuyrxe" data-path="src/pages/Vendors/VendorForm.tsx" />

            </div>

            <div className="space-y-2" data-id="b4ei1lhzc" data-path="src/pages/Vendors/VendorForm.tsx">
              <Label htmlFor="is_active" data-id="xrmb0876n" data-path="src/pages/Vendors/VendorForm.tsx">Active Status</Label>
              <div className="flex items-center space-x-2" data-id="qb3heg9iv" data-path="src/pages/Vendors/VendorForm.tsx">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)} data-id="1bb7t3tbd" data-path="src/pages/Vendors/VendorForm.tsx" />

                <span className="text-sm text-gray-600" data-id="s0ef3kxp4" data-path="src/pages/Vendors/VendorForm.tsx">
                  {formData.is_active ? 'Active vendor' : 'Inactive vendor'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4" data-id="mdj8qi9uy" data-path="src/pages/Vendors/VendorForm.tsx">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vendors')} data-id="8cc83c10p" data-path="src/pages/Vendors/VendorForm.tsx">

                Cancel
              </Button>
              <Button type="submit" disabled={loading} data-id="owev6r2tt" data-path="src/pages/Vendors/VendorForm.tsx">
                {loading ?
                'Saving...' :

                <>
                    <Save className="w-4 h-4 mr-2" data-id="1mkpbhdp1" data-path="src/pages/Vendors/VendorForm.tsx" />
                    {isEditing ? 'Update Vendor' : 'Create Vendor'}
                  </>
                }
              </Button>
            </div>
          </form>
          }
        </CardContent>
      </Card>
    </div>);

};

export default VendorForm;