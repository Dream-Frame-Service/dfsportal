import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, X } from 'lucide-react';

interface SalesReport {
  ID: number;
  report_date: string;
  station: string;
  total_sales: number;
  cash_sales: number;
  credit_card_sales: number;
  fuel_sales: number;
  convenience_sales: number;
  employee_id: string;
  notes: string;
  created_by: number;
}

interface SalesReportPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: SalesReport | null;
}

const SalesReportPrintDialog: React.FC<SalesReportPrintDialogProps> = ({
  open,
  onOpenChange,
  report
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  const handlePrint = () => {
    window.print();
  };

  if (!report) return null;

  const cashAndCardTotal =
    (Number(report.cash_sales) || 0) + (Number(report.credit_card_sales) || 0);
  const fuelAndConvenienceTotal =
    (Number(report.fuel_sales) || 0) + (Number(report.convenience_sales) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-id="sk79pwjt9" data-path="src/components/SalesReportPrintDialog.tsx">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-id="mla9o3ckg" data-path="src/components/SalesReportPrintDialog.tsx">
        <DialogHeader data-id="ydk9petao" data-path="src/components/SalesReportPrintDialog.tsx">
          <DialogTitle className="flex items-center space-x-2" data-id="zffrvpt9h" data-path="src/components/SalesReportPrintDialog.tsx">
            <Printer className="w-5 h-5" data-id="gl565o2xw" data-path="src/components/SalesReportPrintDialog.tsx" />
            <span data-id="cftj5qdg3" data-path="src/components/SalesReportPrintDialog.tsx">Daily Sales Report - Document Print</span>
          </DialogTitle>
        </DialogHeader>

        {/* Print Content */}
        <div className="print-content space-y-6" data-id="cuviovtzy" data-path="src/components/SalesReportPrintDialog.tsx">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-4" data-id="d8u3vlvau" data-path="src/components/SalesReportPrintDialog.tsx">
            <h1 className="text-2xl font-bold text-gray-800" data-id="uxcgs7w68" data-path="src/components/SalesReportPrintDialog.tsx">Daily Sales Report</h1>
            <p className="text-gray-600" data-id="59jdkucm3" data-path="src/components/SalesReportPrintDialog.tsx">Gas Station Management System</p>
          </div>

          {/* Report Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="qwqanuo3b" data-path="src/components/SalesReportPrintDialog.tsx">
            <Card data-id="xba934grd" data-path="src/components/SalesReportPrintDialog.tsx">
              <CardContent className="p-4" data-id="pqzpl7haa" data-path="src/components/SalesReportPrintDialog.tsx">
                <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="0thsdw7m2" data-path="src/components/SalesReportPrintDialog.tsx">Report Information</h3>
                <div className="space-y-2" data-id="zz1vvi3mm" data-path="src/components/SalesReportPrintDialog.tsx">
                  <div className="flex justify-between" data-id="dn8y6yc5p" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="6731tud36" data-path="src/components/SalesReportPrintDialog.tsx">Report Date:</span>
                    <span className="font-medium" data-id="p46enu9vc" data-path="src/components/SalesReportPrintDialog.tsx">{formatDate(report.report_date)}</span>
                  </div>
                  <div className="flex justify-between" data-id="clsyhsozd" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="8l33rmnkx" data-path="src/components/SalesReportPrintDialog.tsx">Station:</span>
                    <Badge className={`text-white ${getStationBadgeColor(report.station)}`} data-id="h3bigbbtk" data-path="src/components/SalesReportPrintDialog.tsx">
                      {report.station}
                    </Badge>
                  </div>
                  <div className="flex justify-between" data-id="5qw2winl9" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="cipitjhoc" data-path="src/components/SalesReportPrintDialog.tsx">Employee ID:</span>
                    <span className="font-medium" data-id="34pktzph9" data-path="src/components/SalesReportPrintDialog.tsx">{report.employee_id}</span>
                  </div>
                  <div className="flex justify-between" data-id="53v3ucj0m" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="uw2tjeo2j" data-path="src/components/SalesReportPrintDialog.tsx">Report ID:</span>
                    <span className="font-medium" data-id="j7gdeuhoo" data-path="src/components/SalesReportPrintDialog.tsx">#{report.ID}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="usgqdr8dg" data-path="src/components/SalesReportPrintDialog.tsx">
              <CardContent className="p-4" data-id="9w6k22c0a" data-path="src/components/SalesReportPrintDialog.tsx">
                <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="38i1eh2if" data-path="src/components/SalesReportPrintDialog.tsx">Total Sales Summary</h3>
                <div className="space-y-2" data-id="ffrgtl65b" data-path="src/components/SalesReportPrintDialog.tsx">
                  <div className="flex justify-between text-xl" data-id="3pwbebai0" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="46lsmkogu" data-path="src/components/SalesReportPrintDialog.tsx">Total Sales:</span>
                    <span className="font-bold text-green-600" data-id="2omnv1oqq" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(report.total_sales)}</span>
                  </div>
                  <div className="text-sm text-gray-500 pt-2 border-t" data-id="z3ie3pcaj" data-path="src/components/SalesReportPrintDialog.tsx">
                    <div className="flex justify-between" data-id="096czwzyo" data-path="src/components/SalesReportPrintDialog.tsx">
                      <span data-id="m7ik5jl7u" data-path="src/components/SalesReportPrintDialog.tsx">Payment Verification:</span>
                      <span className={Math.abs(cashAndCardTotal - parseFloat(report.total_sales)) <= 0.01 ? 'text-green-600' : 'text-red-600'} data-id="gk04ksql9" data-path="src/components/SalesReportPrintDialog.tsx">
                        {Math.abs(cashAndCardTotal - parseFloat(report.total_sales)) <= 0.01 ? '✓ Verified' : '⚠️ Discrepancy'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="wikxvuef1" data-path="src/components/SalesReportPrintDialog.tsx">
            <Card data-id="cq66vni61" data-path="src/components/SalesReportPrintDialog.tsx">
              <CardContent className="p-4" data-id="7ve6r46c9" data-path="src/components/SalesReportPrintDialog.tsx">
                <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="36n7h524b" data-path="src/components/SalesReportPrintDialog.tsx">Payment Methods</h3>
                <div className="space-y-3" data-id="k60hdc6mc" data-path="src/components/SalesReportPrintDialog.tsx">
                  <div className="flex justify-between" data-id="267rg4b14" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="a0q6n2xjb" data-path="src/components/SalesReportPrintDialog.tsx">Cash Sales:</span>
                    <span className="font-medium" data-id="8ohb958r1" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(report.cash_sales)}</span>
                  </div>
                  <div className="flex justify-between" data-id="gltzvoe05" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="6un9tqwhw" data-path="src/components/SalesReportPrintDialog.tsx">Credit Card Sales:</span>
                    <span className="font-medium" data-id="qrzjhcjbk" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(report.credit_card_sales)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2" data-id="qoulqpemq" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="font-semibold text-gray-800" data-id="pugima974" data-path="src/components/SalesReportPrintDialog.tsx">Payment Total:</span>
                    <span className="font-bold" data-id="1lemb9v1a" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(cashAndCardTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-id="ydakn738z" data-path="src/components/SalesReportPrintDialog.tsx">
              <CardContent className="p-4" data-id="y4gnhm23g" data-path="src/components/SalesReportPrintDialog.tsx">
                <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="yp8jmsq67" data-path="src/components/SalesReportPrintDialog.tsx">Sales Categories</h3>
                <div className="space-y-3" data-id="wcibkm68q" data-path="src/components/SalesReportPrintDialog.tsx">
                  <div className="flex justify-between" data-id="i0mun2sah" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="ed2zfngl6" data-path="src/components/SalesReportPrintDialog.tsx">Fuel Sales:</span>
                    <span className="font-medium text-blue-600" data-id="awkus0pky" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(report.fuel_sales)}</span>
                  </div>
                  <div className="flex justify-between" data-id="nfacd83ih" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="text-gray-600" data-id="5tpt3mz79" data-path="src/components/SalesReportPrintDialog.tsx">Convenience Sales:</span>
                    <span className="font-medium text-purple-600" data-id="pnxmsagbe" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(report.convenience_sales)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2" data-id="8wfoprbfm" data-path="src/components/SalesReportPrintDialog.tsx">
                    <span className="font-semibold text-gray-800" data-id="aa5dlwnk4" data-path="src/components/SalesReportPrintDialog.tsx">Category Total:</span>
                    <span className="font-bold" data-id="z1objemft" data-path="src/components/SalesReportPrintDialog.tsx">{formatCurrency(fuelAndConvenienceTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          {report.notes &&
          <Card data-id="cvlf183ov" data-path="src/components/SalesReportPrintDialog.tsx">
              <CardContent className="p-4" data-id="mj3umbo50" data-path="src/components/SalesReportPrintDialog.tsx">
                <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="81z37slt8" data-path="src/components/SalesReportPrintDialog.tsx">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap" data-id="bpy94wsuj" data-path="src/components/SalesReportPrintDialog.tsx">{report.notes}</p>
              </CardContent>
            </Card>
          }

          {/* Validation Summary */}
          <Card className="border-2 border-gray-300" data-id="4fgdkkn1j" data-path="src/components/SalesReportPrintDialog.tsx">
            <CardContent className="p-4" data-id="ushqfl458" data-path="src/components/SalesReportPrintDialog.tsx">
              <h3 className="font-semibold text-lg mb-3 text-gray-800" data-id="ggnfmryoj" data-path="src/components/SalesReportPrintDialog.tsx">Report Validation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="xe7yrtu4b" data-path="src/components/SalesReportPrintDialog.tsx">
                <div className="flex items-center space-x-2" data-id="dggrpoth5" data-path="src/components/SalesReportPrintDialog.tsx">
                  <span className="text-gray-600" data-id="y42ki91z6" data-path="src/components/SalesReportPrintDialog.tsx">Payment Method Total:</span>
                  <span className={Math.abs(cashAndCardTotal - parseFloat(report.total_sales)) <= 0.01 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'} data-id="divhc2gvb" data-path="src/components/SalesReportPrintDialog.tsx">
                    {Math.abs(cashAndCardTotal - parseFloat(report.total_sales)) <= 0.01 ? '✓ Matches Total Sales' : '⚠️ Does not match Total Sales'}
                  </span>
                </div>
                <div className="flex items-center space-x-2" data-id="gs7jrq08o" data-path="src/components/SalesReportPrintDialog.tsx">
                  <span className="text-gray-600" data-id="rfsv2ap88" data-path="src/components/SalesReportPrintDialog.tsx">Category Breakdown:</span>
                  <span className={fuelAndConvenienceTotal <= parseFloat(report.total_sales) + 0.01 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'} data-id="ru5v6ft47" data-path="src/components/SalesReportPrintDialog.tsx">
                    {fuelAndConvenienceTotal <= parseFloat(report.total_sales) + 0.01 ? '✓ Within Range' : '⚠️ Exceeds Total'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4" data-id="fy3sogu0k" data-path="src/components/SalesReportPrintDialog.tsx">
            <p data-id="fkv276sjn" data-path="src/components/SalesReportPrintDialog.tsx">This is an official document generated by the Gas Station Management System</p>
            <p data-id="9mfv2nnh7" data-path="src/components/SalesReportPrintDialog.tsx">Generated on: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2" data-id="pioz0766q" data-path="src/components/SalesReportPrintDialog.tsx">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-id="lxirck756" data-path="src/components/SalesReportPrintDialog.tsx">
            <X className="w-4 h-4 mr-2" data-id="piz97w8fd" data-path="src/components/SalesReportPrintDialog.tsx" />
            Cancel
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" data-id="82pgjwrec" data-path="src/components/SalesReportPrintDialog.tsx">
            <Printer className="w-4 h-4 mr-2" data-id="og595rpkn" data-path="src/components/SalesReportPrintDialog.tsx" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Print-specific styles */}
      <style jsx global data-id="u4nv4utjp" data-path="src/components/SalesReportPrintDialog.tsx">{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white;
          }
          
          /* Hide dialog chrome when printing */
          [role="dialog"] {
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Ensure proper page breaks */
          .print-content {
            page-break-inside: avoid;
          }
          
          /* Optimize text for print */
          .print-content {
            font-size: 12pt;
            line-height: 1.4;
            color: black;
          }
          
          /* Ensure badges print correctly */
          .print-content .bg-blue-500 {
            background-color: #3b82f6 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-content .bg-green-500 {
            background-color: #10b981 !important;
            -webkit-print-color-adjust: exact;
          }
          .print-content .bg-purple-500 {
            background-color: #8b5cf6 !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </Dialog>);

};

export default SalesReportPrintDialog;