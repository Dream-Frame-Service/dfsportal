import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone, MapPin, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewModal from '@/components/ViewModal';
import { useListKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { ezsiteApisReplacement } from '@/services/supabaseService';
import { motion } from 'motion/react';

interface Vendor {
  ID: number;
  vendor_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  payment_terms: string;
  is_active: boolean;
  created_by: number;
}

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const navigate = useNavigate();

  const pageSize = 10;

  useEffect(() => {
    loadVendors();
  }, [currentPage, searchTerm]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const filters = [];

      if (searchTerm) {
        filters.push({ name: 'vendor_name', op: 'StringContains', value: searchTerm });
      }

      const { data, error } = await ezsiteApisReplacement.tablePage('11729', {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: 'vendor_name',
        IsAsc: true,
        Filters: filters
      });

      if (error) throw error;

      setVendors(data?.List || []);
      setTotalCount(data?.VirtualCount || 0);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSelectedVendorId(vendor.ID);
    setViewModalOpen(true);
  };

  const handleEdit = (vendorId: number) => {
    navigate(`/vendors/edit/${vendorId}`);
  };

  const handleDelete = async (vendorId: number) => {
    if (!confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      const { error } = await ezsiteApisReplacement.tableDelete('11729', { ID: vendorId });
      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor deleted successfully"
      });
      loadVendors();
      setViewModalOpen(false);
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!selectedVendor) return;

    const csvContent = [
    'Field,Value',
    `Vendor Name,${selectedVendor.vendor_name}`,
    `Contact Person,${selectedVendor.contact_person}`,
    `Email,${selectedVendor.email}`,
    `Phone,${selectedVendor.phone}`,
    `Address,${selectedVendor.address}`,
    `Category,${selectedVendor.category}`,
    `Payment Terms,${selectedVendor.payment_terms}`,
    `Status,${selectedVendor.is_active ? 'Active' : 'Inactive'}`].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor_${selectedVendor.vendor_name.replace(/\s+/g, '_')}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Vendor details exported successfully"
    });
  };

  // Keyboard shortcuts
  useListKeyboardShortcuts(
    selectedVendorId,
    (id) => {
      const vendor = vendors.find((v) => v.ID === id);
      if (vendor) handleView(vendor);
    },
    handleEdit,
    handleDelete,
    () => navigate('/vendors/new')
  );

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'Fuel Supplier': 'bg-blue-500',
      'Food & Beverages': 'bg-green-500',
      'Automotive': 'bg-orange-500',
      'Maintenance': 'bg-purple-500',
      'Office Supplies': 'bg-gray-500',
      'Technology': 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Define view modal fields
  const getViewModalFields = (vendor: Vendor) => [
  {
    key: 'vendor_name',
    label: 'Vendor Name',
    value: vendor.vendor_name,
    type: 'text' as const,
    icon: Building2
  },
  {
    key: 'contact_person',
    label: 'Contact Person',
    value: vendor.contact_person,
    type: 'text' as const
  },
  {
    key: 'email',
    label: 'Email',
    value: vendor.email,
    type: 'email' as const
  },
  {
    key: 'phone',
    label: 'Phone',
    value: vendor.phone,
    type: 'phone' as const
  },
  {
    key: 'address',
    label: 'Address',
    value: vendor.address,
    type: 'text' as const,
    icon: MapPin
  },
  {
    key: 'category',
    label: 'Category',
    value: vendor.category,
    type: 'badge' as const,
    badgeColor: getCategoryBadgeColor(vendor.category)
  },
  {
    key: 'payment_terms',
    label: 'Payment Terms',
    value: vendor.payment_terms,
    type: 'text' as const
  },
  {
    key: 'is_active',
    label: 'Status',
    value: vendor.is_active,
    type: 'boolean' as const
  }];


  return (
    <div className="space-y-6" data-id="0ex25eayp" data-path="src/pages/Vendors/VendorList.tsx">
      <Card data-id="eijtox9z9" data-path="src/pages/Vendors/VendorList.tsx">
        <CardHeader data-id="vp4bieem5" data-path="src/pages/Vendors/VendorList.tsx">
          <div className="flex items-center justify-between" data-id="odpe77wur" data-path="src/pages/Vendors/VendorList.tsx">
            <div data-id="xajk9qe2o" data-path="src/pages/Vendors/VendorList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="gzkglal9u" data-path="src/pages/Vendors/VendorList.tsx">
                <Building2 className="w-6 h-6" data-id="yboy4f7hw" data-path="src/pages/Vendors/VendorList.tsx" />
                <span data-id="wmaf6c4lp" data-path="src/pages/Vendors/VendorList.tsx">Vendors</span>
              </CardTitle>
              <CardDescription data-id="hzw14fsx4" data-path="src/pages/Vendors/VendorList.tsx">
                Manage your vendor contacts and information
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/vendors/new')} className="flex items-center space-x-2" data-id="0caea7ew4" data-path="src/pages/Vendors/VendorList.tsx">
              <Plus className="w-4 h-4" data-id="owmll3jle" data-path="src/pages/Vendors/VendorList.tsx" />
              <span data-id="kcpuv2ipl" data-path="src/pages/Vendors/VendorList.tsx">Add Vendor</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="fb9v2mupm" data-path="src/pages/Vendors/VendorList.tsx">
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6" data-id="wrkemffjr" data-path="src/pages/Vendors/VendorList.tsx">
            <div className="relative flex-1 max-w-sm" data-id="j3tjepgr1" data-path="src/pages/Vendors/VendorList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="zgclsibjd" data-path="src/pages/Vendors/VendorList.tsx" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="eo0pu4rq7" data-path="src/pages/Vendors/VendorList.tsx" />

            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-id="qmdgpq588" data-path="src/pages/Vendors/VendorList.tsx">
            <p className="text-sm text-blue-700" data-id="f0tzwfyhz" data-path="src/pages/Vendors/VendorList.tsx">
              <strong data-id="2q6mv101g" data-path="src/pages/Vendors/VendorList.tsx">Keyboard shortcuts:</strong> Select a row, then press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs" data-id="bqeebw590" data-path="src/pages/Vendors/VendorList.tsx">V</kbd> to view, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="k2krkm0ox" data-path="src/pages/Vendors/VendorList.tsx">E</kbd> to edit, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="zeo0nagy2" data-path="src/pages/Vendors/VendorList.tsx">D</kbd> to delete, or 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="2izk2sxd7" data-path="src/pages/Vendors/VendorList.tsx">Ctrl+N</kbd> to create new
            </p>
          </div>

          {/* Vendors Table */}
          {loading ?
          <div className="space-y-4" data-id="v2oygv6u1" data-path="src/pages/Vendors/VendorList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="1e8x7ahv3" data-path="src/pages/Vendors/VendorList.tsx"></div>
            )}
            </div> :
          vendors.length === 0 ?
          <div className="text-center py-8" data-id="44a9pjagf" data-path="src/pages/Vendors/VendorList.tsx">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="psqo3evau" data-path="src/pages/Vendors/VendorList.tsx" />
              <p className="text-gray-500" data-id="jfw2h4fgn" data-path="src/pages/Vendors/VendorList.tsx">No vendors found</p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/vendors/new')} data-id="fil8rspu6" data-path="src/pages/Vendors/VendorList.tsx">

                Add Your First Vendor
              </Button>
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="p23uparyd" data-path="src/pages/Vendors/VendorList.tsx">
              <Table data-id="ah6an831e" data-path="src/pages/Vendors/VendorList.tsx">
                <TableHeader data-id="s7wk0hvp9" data-path="src/pages/Vendors/VendorList.tsx">
                  <TableRow data-id="o5g14ihqk" data-path="src/pages/Vendors/VendorList.tsx">
                    <TableHead data-id="3mmatqpz9" data-path="src/pages/Vendors/VendorList.tsx">Vendor Name</TableHead>
                    <TableHead data-id="kxowitj6g" data-path="src/pages/Vendors/VendorList.tsx">Contact Person</TableHead>
                    <TableHead data-id="hw37vfakn" data-path="src/pages/Vendors/VendorList.tsx">Contact Info</TableHead>
                    <TableHead data-id="bb9luyr9l" data-path="src/pages/Vendors/VendorList.tsx">Category</TableHead>
                    <TableHead data-id="o9bzvn4ka" data-path="src/pages/Vendors/VendorList.tsx">Payment Terms</TableHead>
                    <TableHead data-id="0atrmi18g" data-path="src/pages/Vendors/VendorList.tsx">Status</TableHead>
                    <TableHead data-id="37cir1lcc" data-path="src/pages/Vendors/VendorList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="4ctwuo99y" data-path="src/pages/Vendors/VendorList.tsx">
                  {vendors.map((vendor, index) =>
                <motion.tr
                  key={vendor.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedVendorId === vendor.ID ? 'bg-blue-50 border-blue-200' : ''}`
                  }
                  onClick={() => setSelectedVendorId(vendor.ID)} data-id="503mhq4ap" data-path="src/pages/Vendors/VendorList.tsx">

                      <TableCell data-id="a4zwf2h2k" data-path="src/pages/Vendors/VendorList.tsx">
                        <div data-id="d0m5fj0r3" data-path="src/pages/Vendors/VendorList.tsx">
                          <p className="font-medium" data-id="bs03tzdo3" data-path="src/pages/Vendors/VendorList.tsx">{vendor.vendor_name}</p>
                          {vendor.address &&
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1" data-id="jt0scht7n" data-path="src/pages/Vendors/VendorList.tsx">
                              <MapPin className="w-3 h-3" data-id="9bvuw8gsy" data-path="src/pages/Vendors/VendorList.tsx" />
                              <span className="truncate max-w-xs" data-id="i5leu8ygx" data-path="src/pages/Vendors/VendorList.tsx">{vendor.address}</span>
                            </div>
                      }
                        </div>
                      </TableCell>
                      <TableCell data-id="l7as0451d" data-path="src/pages/Vendors/VendorList.tsx">
                        <p className="font-medium" data-id="io1x2obhk" data-path="src/pages/Vendors/VendorList.tsx">{vendor.contact_person}</p>
                      </TableCell>
                      <TableCell data-id="qraz83dde" data-path="src/pages/Vendors/VendorList.tsx">
                        <div className="space-y-1" data-id="gd1q3860x" data-path="src/pages/Vendors/VendorList.tsx">
                          {vendor.email &&
                      <div className="flex items-center space-x-1 text-sm" data-id="43cxkf22f" data-path="src/pages/Vendors/VendorList.tsx">
                              <Mail className="w-3 h-3" data-id="1o8lbv8qt" data-path="src/pages/Vendors/VendorList.tsx" />
                              <span data-id="nxf43xqh4" data-path="src/pages/Vendors/VendorList.tsx">{vendor.email}</span>
                            </div>
                      }
                          {vendor.phone &&
                      <div className="flex items-center space-x-1 text-sm" data-id="7z61oj6b6" data-path="src/pages/Vendors/VendorList.tsx">
                              <Phone className="w-3 h-3" data-id="js086lqyz" data-path="src/pages/Vendors/VendorList.tsx" />
                              <span data-id="bkmlz67l8" data-path="src/pages/Vendors/VendorList.tsx">{vendor.phone}</span>
                            </div>
                      }
                        </div>
                      </TableCell>
                      <TableCell data-id="dt9stoima" data-path="src/pages/Vendors/VendorList.tsx">
                        <Badge className={`text-white ${getCategoryBadgeColor(vendor.category)}`} data-id="4dvvtmjqu" data-path="src/pages/Vendors/VendorList.tsx">
                          {vendor.category}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="cq02pe9z6" data-path="src/pages/Vendors/VendorList.tsx">
                        <span className="text-sm" data-id="drf4ebyqi" data-path="src/pages/Vendors/VendorList.tsx">{vendor.payment_terms || 'N/A'}</span>
                      </TableCell>
                      <TableCell data-id="adeehyj96" data-path="src/pages/Vendors/VendorList.tsx">
                        <Badge variant={vendor.is_active ? "default" : "secondary"} data-id="evq24tx10" data-path="src/pages/Vendors/VendorList.tsx">
                          {vendor.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="v0imuccs9" data-path="src/pages/Vendors/VendorList.tsx">
                        <div className="flex items-center space-x-2" data-id="j5bhn8g16" data-path="src/pages/Vendors/VendorList.tsx">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(vendor);
                        }}
                        className="text-blue-600 hover:text-blue-700" data-id="fsanx8xv3" data-path="src/pages/Vendors/VendorList.tsx">

                            <Eye className="w-4 h-4" data-id="b42pqtef7" data-path="src/pages/Vendors/VendorList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(vendor.ID);
                        }} data-id="euuthcxhd" data-path="src/pages/Vendors/VendorList.tsx">

                            <Edit className="w-4 h-4" data-id="5lzwnzmbs" data-path="src/pages/Vendors/VendorList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vendor.ID);
                        }}
                        className="text-red-600 hover:text-red-700" data-id="dlbhos6x7" data-path="src/pages/Vendors/VendorList.tsx">

                            <Trash2 className="w-4 h-4" data-id="duous25e1" data-path="src/pages/Vendors/VendorList.tsx" />
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
          <div className="flex items-center justify-between mt-6" data-id="nn20y26ky" data-path="src/pages/Vendors/VendorList.tsx">
              <p className="text-sm text-gray-700" data-id="fw58gu8fx" data-path="src/pages/Vendors/VendorList.tsx">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} vendors
              </p>
              <div className="flex items-center space-x-2" data-id="bk5rtlhp6" data-path="src/pages/Vendors/VendorList.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} data-id="jlxalnzlh" data-path="src/pages/Vendors/VendorList.tsx">

                  Previous
                </Button>
                <span className="text-sm" data-id="tlx1w410e" data-path="src/pages/Vendors/VendorList.tsx">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} data-id="zmojnsrks" data-path="src/pages/Vendors/VendorList.tsx">

                  Next
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>
      
      {/* View Modal */}
      {selectedVendor &&
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedVendor(null);
          setSelectedVendorId(null);
        }}
        title={selectedVendor.vendor_name}
        subtitle={`Contact: ${selectedVendor.contact_person} • ${selectedVendor.category}`}
        data={selectedVendor}
        fields={getViewModalFields(selectedVendor)}
        onEdit={() => {
          setViewModalOpen(false);
          handleEdit(selectedVendor.ID);
        }}
        onDelete={() => handleDelete(selectedVendor.ID)}
        onExport={handleExport}
        canEdit={true}
        canDelete={true}
        canExport={true} data-id="4dv16ttvz" data-path="src/pages/Vendors/VendorList.tsx" />

      }
    </div>);

};

export default VendorList;