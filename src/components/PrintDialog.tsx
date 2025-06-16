import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Printer } from 'lucide-react';

interface License {
  ID: number;
  license_name: string;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  station: string;
  category: string;
  status: string;
  document_file_id: number;
  created_by: number;
}

interface PrintDialogProps {
  license: License | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ license, isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'pending renewal':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'Business': 'bg-blue-500',
      'Environmental': 'bg-green-500',
      'Safety': 'bg-orange-500',
      'Health': 'bg-purple-500',
      'Fire': 'bg-red-500',
      'Building': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-blue-600';
      case 'AMOCO ROSEDALE':
        return 'bg-green-600';
      case 'AMOCO BROOKLYN':
        return 'bg-purple-600';
      case 'ALL':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (!license) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="g8joa6brn" data-path="src/components/PrintDialog.tsx">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none" data-id="boata0jov" data-path="src/components/PrintDialog.tsx">
        <DialogHeader className="print:hidden" data-id="76b771v0z" data-path="src/components/PrintDialog.tsx">
          <DialogTitle className="flex items-center justify-between" data-id="1f4h7nvnl" data-path="src/components/PrintDialog.tsx">
            <span data-id="njm8pl8to" data-path="src/components/PrintDialog.tsx">License Document Preview</span>
            <Button variant="ghost" size="sm" onClick={onClose} data-id="3ljzwzghs" data-path="src/components/PrintDialog.tsx">
              <X className="w-4 h-4" data-id="x2dzowsb3" data-path="src/components/PrintDialog.tsx" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Print Content */}
        <div className="space-y-6 print:space-y-4" data-id="io76td1i0" data-path="src/components/PrintDialog.tsx">
          {/* Header */}
          <div className="text-center border-b pb-4 print:pb-2" data-id="g0avxigwm" data-path="src/components/PrintDialog.tsx">
            <h1 className="text-2xl font-bold text-gray-900 print:text-xl" data-id="ghz4qc646" data-path="src/components/PrintDialog.tsx">
              LICENSE & CERTIFICATE RECORD
            </h1>
            <p className="text-gray-600 mt-2 print:text-sm" data-id="56lbz0x8m" data-path="src/components/PrintDialog.tsx">
              Official Document Copy - {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* License Information Card */}
          <Card className="print:shadow-none print:border" data-id="qenf6c3pt" data-path="src/components/PrintDialog.tsx">
            <CardContent className="p-6 print:p-4" data-id="kconzyo80" data-path="src/components/PrintDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4" data-id="9v24hgvrq" data-path="src/components/PrintDialog.tsx">
                {/* Basic Information */}
                <div className="space-y-4 print:space-y-2" data-id="4sqrp11qd" data-path="src/components/PrintDialog.tsx">
                  <div data-id="ayixx7xow" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="5tk9z9oxd" data-path="src/components/PrintDialog.tsx">License Name</label>
                    <p className="text-lg font-semibold print:text-base" data-id="4d14flt5h" data-path="src/components/PrintDialog.tsx">{license.license_name}</p>
                  </div>
                  
                  <div data-id="n6sir56lq" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="uvd4l6st7" data-path="src/components/PrintDialog.tsx">License Number</label>
                    <p className="text-lg font-mono print:text-base" data-id="clq7998cl" data-path="src/components/PrintDialog.tsx">{license.license_number}</p>
                  </div>
                  
                  <div data-id="5ld5gyfvp" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="hvfcwzbo8" data-path="src/components/PrintDialog.tsx">Issuing Authority</label>
                    <p className="print:text-sm" data-id="9rb4cahq8" data-path="src/components/PrintDialog.tsx">{license.issuing_authority}</p>
                  </div>
                  
                  <div data-id="p9ox13jfq" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="170hvfz52" data-path="src/components/PrintDialog.tsx">Category</label>
                    <div className="mt-1" data-id="c8h9g2jle" data-path="src/components/PrintDialog.tsx">
                      <Badge className={`text-white ${getCategoryBadgeColor(license.category)} print:bg-gray-600 print:text-white`} data-id="7otqbrodb" data-path="src/components/PrintDialog.tsx">
                        {license.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Dates and Status */}
                <div className="space-y-4 print:space-y-2" data-id="hbhkzowqj" data-path="src/components/PrintDialog.tsx">
                  <div data-id="dr77a6amq" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="uk29qv8ey" data-path="src/components/PrintDialog.tsx">Issue Date</label>
                    <p className="print:text-sm" data-id="mdtbigomd" data-path="src/components/PrintDialog.tsx">{formatDate(license.issue_date)}</p>
                  </div>
                  
                  <div data-id="mfwo40mgy" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="otwgdn0i3" data-path="src/components/PrintDialog.tsx">Expiry Date</label>
                    <p className="print:text-sm" data-id="h4dfmysqn" data-path="src/components/PrintDialog.tsx">{formatDate(license.expiry_date)}</p>
                  </div>
                  
                  <div data-id="l45im1d92" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="14olg5x1y" data-path="src/components/PrintDialog.tsx">Station</label>
                    <div className="mt-1" data-id="ycr5a518h" data-path="src/components/PrintDialog.tsx">
                      <Badge className={`text-white ${getStationBadgeColor(license.station)} print:bg-gray-600 print:text-white`} data-id="cye42ango" data-path="src/components/PrintDialog.tsx">
                        {license.station}
                      </Badge>
                    </div>
                  </div>
                  
                  <div data-id="vbhh64te0" data-path="src/components/PrintDialog.tsx">
                    <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="hagwh444s" data-path="src/components/PrintDialog.tsx">Status</label>
                    <div className="mt-1" data-id="st3att7a7" data-path="src/components/PrintDialog.tsx">
                      <Badge className={`text-white ${getStatusBadgeColor(license.status)} print:bg-gray-600 print:text-white`} data-id="q5olw82hw" data-path="src/components/PrintDialog.tsx">
                        {license.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="print:shadow-none print:border" data-id="artqxx7rz" data-path="src/components/PrintDialog.tsx">
            <CardContent className="p-6 print:p-4" data-id="yue2kvgxf" data-path="src/components/PrintDialog.tsx">
              <h3 className="text-lg font-semibold mb-4 print:text-base print:mb-2" data-id="7kg1ybjl2" data-path="src/components/PrintDialog.tsx">Document Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2" data-id="a9yu3mpcd" data-path="src/components/PrintDialog.tsx">
                <div data-id="2x2lguqo7" data-path="src/components/PrintDialog.tsx">
                  <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="94b7iw2d3" data-path="src/components/PrintDialog.tsx">Document ID</label>
                  <p className="print:text-sm" data-id="9e2jdv4n7" data-path="src/components/PrintDialog.tsx">{license.ID}</p>
                </div>
                <div data-id="3otlyw6s2" data-path="src/components/PrintDialog.tsx">
                  <label className="text-sm font-medium text-gray-600 print:text-xs" data-id="naouj9njn" data-path="src/components/PrintDialog.tsx">File Reference</label>
                  <p className="print:text-sm" data-id="7mjmf1l6x" data-path="src/components/PrintDialog.tsx">{license.document_file_id || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="border-t pt-4 print:pt-2 text-center text-sm text-gray-600 print:text-xs" data-id="g6xcnlqxl" data-path="src/components/PrintDialog.tsx">
            <p data-id="erbtoz4zn" data-path="src/components/PrintDialog.tsx">This document was generated on {new Date().toLocaleString()}</p>
            <p className="mt-1" data-id="ymcbll9z0" data-path="src/components/PrintDialog.tsx">License Management System - Gas Station Operations</p>
          </div>
        </div>

        <DialogFooter className="print:hidden" data-id="9jic38r4s" data-path="src/components/PrintDialog.tsx">
          <Button variant="outline" onClick={onClose} data-id="nc6a4aunf" data-path="src/components/PrintDialog.tsx">
            Cancel
          </Button>
          <Button onClick={handlePrint} className="flex items-center space-x-2" data-id="1kdq76e97" data-path="src/components/PrintDialog.tsx">
            <Printer className="w-4 h-4" data-id="518df89ih" data-path="src/components/PrintDialog.tsx" />
            <span data-id="8rlhc1ere" data-path="src/components/PrintDialog.tsx">Print</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

};

export default PrintDialog;
