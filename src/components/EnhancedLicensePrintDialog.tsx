import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Printer, FileText, Calendar, MapPin, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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

interface EnhancedLicensePrintDialogProps {
  license: License | null;
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedLicensePrintDialog: React.FC<EnhancedLicensePrintDialogProps> = ({ license, isOpen, onClose }) => {
  if (!license) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusInfo = (status: string, expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    switch (status.toLowerCase()) {
      case 'active':
        if (daysUntilExpiry <= 30) {
          return {
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            icon: '⚠️',
            message: `Expires in ${daysUntilExpiry} days - Renewal Required Soon`
          };
        } else if (daysUntilExpiry <= 90) {
          return {
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            icon: '📅',
            message: `Expires in ${daysUntilExpiry} days - Plan Renewal`
          };
        }
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '✅',
          message: 'Active and Valid'
        };
      case 'expired':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '❌',
          message: `Expired ${Math.abs(daysUntilExpiry)} days ago - Immediate Action Required`
        };
      case 'pending renewal':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '⏳',
          message: 'Renewal in Progress'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '❓',
          message: 'Status Unknown'
        };
    }
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      'Business': { icon: '🏢', description: 'General business operations license' },
      'Environmental': { icon: '🌱', description: 'Environmental compliance and permits' },
      'Safety': { icon: '🦺', description: 'Safety regulations and protocols' },
      'Health': { icon: '🏥', description: 'Public health requirements' },
      'Fire': { icon: '🔥', description: 'Fire safety and prevention' },
      'Building': { icon: '🏗️', description: 'Construction and building permits' }
    };
    return categoryMap[category as keyof typeof categoryMap] || { icon: '📄', description: 'License certification' };
  };

  const getStationInfo = (station: string) => {
    const stationMap = {
      'MOBIL': { color: 'bg-red-500', description: 'Mobil Gas Station' },
      'AMOCO ROSEDALE': { color: 'bg-blue-500', description: 'Amoco Rosedale Station' },
      'AMOCO BROOKLYN': { color: 'bg-green-500', description: 'Amoco Brooklyn Station' },
      'ALL': { color: 'bg-gray-500', description: 'All Station Locations' }
    };
    return stationMap[station as keyof typeof stationMap] || { color: 'bg-gray-500', description: station };
  };

  const statusInfo = getStatusInfo(license.status, license.expiry_date);
  const categoryInfo = getCategoryInfo(license.category);
  const stationInfo = getStationInfo(license.station);

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>License Certificate - ${license.license_name}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.5;
            }
            .certificate-header {
              text-align: center;
              margin-bottom: 40px;
              border: 3px solid #2563eb;
              padding: 30px;
              border-radius: 15px;
              background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            }
            .company-logo {
              font-size: 32px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .certificate-title {
              font-size: 24px;
              color: #374151;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .certificate-subtitle {
              font-size: 16px;
              color: #6b7280;
              font-style: italic;
            }
            .license-info {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .license-name {
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              color: #1f2937;
              margin-bottom: 20px;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 25px 0;
            }
            .info-item {
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #fafafa;
            }
            .info-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .info-value {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
            }
            .status-section {
              background: ${statusInfo.bgColor};
              border: 2px solid ${statusInfo.borderColor.replace('border-', '')};
              border-radius: 10px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .status-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .status-message {
              font-size: 18px;
              font-weight: bold;
              color: ${statusInfo.color.replace('text-', '')};
              margin-bottom: 10px;
            }
            .dates-section {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 25px 0;
            }
            .date-card {
              text-align: center;
              padding: 20px;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              background: white;
            }
            .date-label {
              font-size: 14px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 10px;
            }
            .date-value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .authority-section {
              background: #f0f9ff;
              border: 2px solid #0ea5e9;
              border-radius: 10px;
              padding: 20px;
              margin: 25px 0;
            }
            .category-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin: 5px;
            }
            .station-badge {
              background: ${stationInfo.color};
              color: white;
            }
            .category-business { background: #dbeafe; color: #1e40af; }
            .category-environmental { background: #dcfce7; color: #166534; }
            .category-safety { background: #fed7aa; color: #c2410c; }
            .category-health { background: #e9d5ff; color: #7c2d12; }
            .category-fire { background: #fecaca; color: #dc2626; }
            .category-building { background: #f3f4f6; color: #374151; }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 2px solid #e5e7eb;
              padding-top: 30px;
            }
            .official-seal {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 80px;
              height: 80px;
              border: 3px solid #2563eb;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-size: 10px;
              text-align: center;
              font-weight: bold;
              color: #2563eb;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(37, 99, 235, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
            @media print {
              body { font-size: 11pt; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">OFFICIAL</div>
          <div class="official-seal">
            DFS<br>OFFICIAL<br>SEAL
          </div>

          <div class="certificate-header">
            <div class="company-logo">DFS Manager Portal</div>
            <div class="certificate-title">License & Certificate Record</div>
            <div class="certificate-subtitle">Official Documentation System</div>
          </div>

          <div class="license-info">
            <div class="license-name">${license.license_name}</div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">License Number</div>
                <div class="info-value" style="font-family: monospace; font-size: 18px;">${license.license_number}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Record ID</div>
                <div class="info-value">#${license.ID}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Category</div>
                <div class="info-value">
                  <span class="category-badge category-${license.category.toLowerCase()}">${categoryInfo.icon} ${license.category}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Station Coverage</div>
                <div class="info-value">
                  <span class="category-badge station-badge">${license.station}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dates-section">
            <div class="date-card">
              <div class="date-label">📅 Issue Date</div>
              <div class="date-value">${formatDate(license.issue_date)}</div>
            </div>
            <div class="date-card">
              <div class="date-label">⏰ Expiry Date</div>
              <div class="date-value">${formatDate(license.expiry_date)}</div>
            </div>
          </div>

          <div class="status-section">
            <div class="status-icon">${statusInfo.icon}</div>
            <div class="status-message">${license.status.toUpperCase()}</div>
            <div style="font-size: 14px; color: #6b7280;">${statusInfo.message}</div>
          </div>

          <div class="authority-section">
            <div class="info-label">Issuing Authority</div>
            <div style="font-size: 20px; font-weight: bold; color: #0ea5e9; margin-top: 10px;">
              ${license.issuing_authority}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 10px;">
              ${categoryInfo.description}
            </div>
          </div>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <div class="info-label">Document Information</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
              <div>
                <span style="font-size: 12px; color: #6b7280;">File Reference ID:</span><br>
                <span style="font-weight: bold;">${license.document_file_id || 'Not Available'}</span>
              </div>
              <div>
                <span style="font-size: 12px; color: #6b7280;">Created by User:</span><br>
                <span style="font-weight: bold;">#${license.created_by}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div style="font-weight: bold; margin-bottom: 10px;">
              This is an official license certificate document
            </div>
            <div>
              Generated on ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
            </div>
            <div style="margin-top: 15px; font-style: italic;">
              DFS Manager Portal - License Management System v2.0
            </div>
            <div style="margin-top: 10px; font-size: 10px;">
              This document is valid only when accompanied by the original license certificate.
              For verification, contact the issuing authority directly.
            </div>
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} data-id="s0exazr4p" data-path="src/components/EnhancedLicensePrintDialog.tsx">
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto" data-id="gn50485xh" data-path="src/components/EnhancedLicensePrintDialog.tsx">
        <DialogHeader data-id="ojntp57qu" data-path="src/components/EnhancedLicensePrintDialog.tsx">
          <div className="flex items-center justify-between" data-id="53v2jzhve" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <DialogTitle className="flex items-center gap-2" data-id="0xdhhsi7e" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <Shield className="h-5 w-5 text-blue-600" data-id="umulnvsiu" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
              Enhanced License Certificate - {license.license_name}
            </DialogTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" data-id="kn56xoj8l" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <Printer className="h-4 w-4" data-id="12e8dsugx" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
              Print Certificate
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="space-y-6" data-id="ndqaf5jvx" data-path="src/components/EnhancedLicensePrintDialog.tsx">
          {/* Header Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-id="ovbjj1g3l" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <CardHeader data-id="r5rslt1rw" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <div className="text-center" data-id="qvx9eiufz" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <CardTitle className="text-2xl text-blue-800 mb-2" data-id="93w5c852u" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.license_name}</CardTitle>
                <div className="flex items-center justify-center gap-4" data-id="p22hfv600" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <Badge className={`${stationInfo.color} text-white`} data-id="zd2m3dmvr" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.station}</Badge>
                  <Badge variant="outline" className="text-blue-600" data-id="mr1tm08em" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.license_number}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Status Card */}
          <Card className={`border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`} data-id="tjml8opcj" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <CardContent className="p-6 text-center" data-id="sdzxmnga2" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <div className="text-4xl mb-2" data-id="w77bwe2y4" data-path="src/components/EnhancedLicensePrintDialog.tsx">{statusInfo.icon}</div>
              <div className={`text-xl font-bold ${statusInfo.color} mb-2`} data-id="x11hbilp9" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.status.toUpperCase()}</div>
              <div className="text-sm text-gray-600" data-id="yu3tra3h8" data-path="src/components/EnhancedLicensePrintDialog.tsx">{statusInfo.message}</div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="f1vhkdokh" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            {/* Basic Information */}
            <Card data-id="46ndicbon" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <CardHeader data-id="a92g4iyzc" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <CardTitle className="text-sm flex items-center gap-2" data-id="s419mvc9v" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <FileText className="h-4 w-4" data-id="ydguqliyt" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
                  License Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="njeezhgiy" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <div data-id="82alm4m41" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="ctdircnt5" data-path="src/components/EnhancedLicensePrintDialog.tsx">Category</div>
                  <div className="flex items-center gap-2 mt-1" data-id="d1a0t1d2w" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                    <span className="text-lg" data-id="h3zdhxbky" data-path="src/components/EnhancedLicensePrintDialog.tsx">{categoryInfo.icon}</span>
                    <div data-id="gci1aifng" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                      <div className="font-medium" data-id="1plcu0rr1" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.category}</div>
                      <div className="text-xs text-gray-500" data-id="f1reblv0j" data-path="src/components/EnhancedLicensePrintDialog.tsx">{categoryInfo.description}</div>
                    </div>
                  </div>
                </div>
                <Separator data-id="bkjl46e0m" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
                <div data-id="k4oefa9yy" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="d1hbr794h" data-path="src/components/EnhancedLicensePrintDialog.tsx">Issuing Authority</div>
                  <div className="font-medium mt-1" data-id="wuazurtzc" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.issuing_authority}</div>
                </div>
                <div data-id="evufmseuk" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="9mzyz07h5" data-path="src/components/EnhancedLicensePrintDialog.tsx">Document File ID</div>
                  <div className="font-medium mt-1" data-id="67tkyu3w8" data-path="src/components/EnhancedLicensePrintDialog.tsx">{license.document_file_id || 'Not Available'}</div>
                </div>
              </CardContent>
            </Card>

            {/* Dates and Status */}
            <Card data-id="14az79k8t" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <CardHeader data-id="wuzbck0sn" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <CardTitle className="text-sm flex items-center gap-2" data-id="dj3bb2lqw" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <Calendar className="h-4 w-4" data-id="fxb3exznm" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="57wiwk9vd" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <div data-id="c019bhbdh" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="f9a9q7ztr" data-path="src/components/EnhancedLicensePrintDialog.tsx">Issue Date</div>
                  <div className="font-medium mt-1" data-id="l9bc0os68" data-path="src/components/EnhancedLicensePrintDialog.tsx">{formatDate(license.issue_date)}</div>
                </div>
                <Separator data-id="f32oc95e5" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
                <div data-id="nwa8rott5" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="1bn1zvj6g" data-path="src/components/EnhancedLicensePrintDialog.tsx">Expiry Date</div>
                  <div className="font-medium mt-1" data-id="a4vtcc2h9" data-path="src/components/EnhancedLicensePrintDialog.tsx">{formatDate(license.expiry_date)}</div>
                </div>
                <Separator data-id="mfpqu1btt" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
                <div data-id="4p8tdsctx" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <div className="text-xs text-gray-600 uppercase font-medium" data-id="5kneeyjqp" data-path="src/components/EnhancedLicensePrintDialog.tsx">Station Coverage</div>
                  <div className="mt-1" data-id="rzgxlkw6s" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                    <Badge className={`${stationInfo.color} text-white`} data-id="5ao7v5xmb" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                      {license.station}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1" data-id="uxhmv4gz9" data-path="src/components/EnhancedLicensePrintDialog.tsx">{stationInfo.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card data-id="ab9hmnwqy" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <CardHeader data-id="5vrg32wah" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <CardTitle className="text-sm" data-id="h2rl1ht2e" data-path="src/components/EnhancedLicensePrintDialog.tsx">System Information</CardTitle>
            </CardHeader>
            <CardContent data-id="nyusgezri" data-path="src/components/EnhancedLicensePrintDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="p8tzcbij0" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                <div className="flex justify-between" data-id="twcw3qd8t" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <span className="text-gray-600" data-id="l9sikfxgy" data-path="src/components/EnhancedLicensePrintDialog.tsx">Record ID:</span>
                  <span className="font-medium" data-id="q0rf34tb9" data-path="src/components/EnhancedLicensePrintDialog.tsx">#{license.ID}</span>
                </div>
                <div className="flex justify-between" data-id="kfkp5rf0h" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <span className="text-gray-600" data-id="bleimivet" data-path="src/components/EnhancedLicensePrintDialog.tsx">Created by User:</span>
                  <span className="font-medium" data-id="obtfhrimq" data-path="src/components/EnhancedLicensePrintDialog.tsx">#{license.created_by}</span>
                </div>
                <div className="flex justify-between" data-id="5ig9g94i9" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <span className="text-gray-600" data-id="u4p305jo0" data-path="src/components/EnhancedLicensePrintDialog.tsx">Document Generated:</span>
                  <span className="font-medium" data-id="mf8cftrc7" data-path="src/components/EnhancedLicensePrintDialog.tsx">{formatDateShort(new Date().toISOString())}</span>
                </div>
                <div className="flex justify-between" data-id="opo3u2rf8" data-path="src/components/EnhancedLicensePrintDialog.tsx">
                  <span className="text-gray-600" data-id="xx8a23981" data-path="src/components/EnhancedLicensePrintDialog.tsx">System Version:</span>
                  <span className="font-medium" data-id="kv32uam1w" data-path="src/components/EnhancedLicensePrintDialog.tsx">DFS Portal v2.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-end space-x-2" data-id="37k7lybh1" data-path="src/components/EnhancedLicensePrintDialog.tsx">
          <Button variant="outline" onClick={onClose} data-id="sgut48qoo" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <X className="w-4 h-4 mr-2" data-id="x8hzlg7bt" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" data-id="xad6fzgkb" data-path="src/components/EnhancedLicensePrintDialog.tsx">
            <Printer className="w-4 h-4 mr-2" data-id="f702uqf02" data-path="src/components/EnhancedLicensePrintDialog.tsx" />
            Print Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

};

export default EnhancedLicensePrintDialog;
