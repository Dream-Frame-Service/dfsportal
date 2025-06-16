import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Printer, X, Truck, Fuel, Calendar, FileText, MapPin, Gauge, BarChart3, AlertTriangle } from 'lucide-react';

interface DeliveryRecord {
  id: number;
  delivery_date: string;
  bol_number: string;
  station: string;
  regular_tank_volume: number;
  plus_tank_volume: number;
  super_tank_volume: number;
  regular_delivered: number;
  plus_delivered: number;
  super_delivered: number;
  delivery_notes: string;
  created_by: number;
}

interface AfterDeliveryReport {
  id: number;
  report_date: string;
  station: string;
  delivery_record_id: number;
  bol_number: string;
  regular_tank_final: number;
  plus_tank_final: number;
  super_tank_final: number;
  tank_temperature: number;
  verification_status: string;
  discrepancy_notes: string;
  reported_by: string;
  supervisor_approval: boolean;
  additional_notes: string;
  created_by: number;
}

interface EnhancedDeliveryPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: DeliveryRecord | null;
  afterDeliveryReport?: AfterDeliveryReport | null;
}

const EnhancedDeliveryPrintDialog: React.FC<EnhancedDeliveryPrintDialogProps> = ({
  open,
  onOpenChange,
  delivery,
  afterDeliveryReport
}) => {
  if (!delivery) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return (num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-red-500 text-white';
      case 'AMOCO ROSEDALE':
        return 'bg-blue-500 text-white';
      case 'AMOCO BROOKLYN':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'text-green-600';
      case 'discrepancy found':
        return 'text-red-600';
      case 'pending review':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate totals and comparisons
  const totalTankVolumeBefore = delivery.regular_tank_volume + delivery.plus_tank_volume + delivery.super_tank_volume;
  const totalDelivered = delivery.regular_delivered + delivery.plus_delivered + delivery.super_delivered;
  const expectedTotalAfter = totalTankVolumeBefore + totalDelivered;

  // After delivery calculations (if available)
  const totalAfterDelivery = afterDeliveryReport ?
  afterDeliveryReport.regular_tank_final + afterDeliveryReport.plus_tank_final + afterDeliveryReport.super_tank_final : 0;

  const volumeDiscrepancy = afterDeliveryReport ? Math.abs(expectedTotalAfter - totalAfterDelivery) : 0;
  const hasVolumeDiscrepancy = volumeDiscrepancy > 5; // 5 gallon tolerance

  // Individual tank expected vs actual
  const regularExpected = delivery.regular_tank_volume + delivery.regular_delivered;
  const plusExpected = delivery.plus_tank_volume + delivery.plus_delivered;
  const superExpected = delivery.super_tank_volume + delivery.super_delivered;

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fuel Delivery Report - ${delivery.bol_number || `Record #${delivery.id}`}</title>
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
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .company-logo {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .report-title {
              font-size: 20px;
              color: #374151;
              margin-bottom: 10px;
            }
            .report-meta {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            .meta-item {
              text-align: center;
            }
            .meta-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
            }
            .meta-value {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            .station-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              color: white;
              font-size: 12px;
              font-weight: 600;
            }
            .section {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .section-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            .section-icon {
              margin-right: 10px;
              color: #2563eb;
              font-size: 18px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .data-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .fuel-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
            }
            .data-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              background: #ffffff;
              text-align: center;
            }
            .fuel-card {
              border: 2px solid;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
            }
            .fuel-regular {
              border-color: #3b82f6;
              background: #eff6ff;
            }
            .fuel-plus {
              border-color: #10b981;
              background: #f0fdf4;
            }
            .fuel-super {
              border-color: #8b5cf6;
              background: #faf5ff;
            }
            .fuel-total {
              border-color: #f59e0b;
              background: #fffbeb;
            }
            .data-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .data-value {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            .fuel-amount {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .fuel-label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            .comparison-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .comparison-table th,
            .comparison-table td {
              padding: 12px;
              text-align: center;
              border: 1px solid #e5e7eb;
            }
            .comparison-table th {
              background: #f3f4f6;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
            }
            .verification-section {
              background: #f0fdf4;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .verification-warning {
              background: #fffbeb;
              border-color: #f59e0b;
            }
            .verification-error {
              background: #fef2f2;
              border-color: #ef4444;
            }
            .status-verified {
              color: #059669;
              font-weight: bold;
            }
            .status-warning {
              color: #d97706;
              font-weight: bold;
            }
            .status-error {
              color: #dc2626;
              font-weight: bold;
            }
            .notes-section {
              background: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { font-size: 11pt; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-logo">DFS Manager Portal</div>
            <div class="report-title">Fuel Delivery Report - Enhanced</div>
          </div>

          <div class="report-meta">
            <div class="meta-item">
              <div class="meta-label">Delivery Date</div>
              <div class="meta-value">${formatDate(delivery.delivery_date)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Station</div>
              <div class="meta-value">
                <span class="station-badge" style="background: ${delivery.station === 'MOBIL' ? '#ef4444' : delivery.station === 'AMOCO ROSEDALE' ? '#3b82f6' : '#10b981'}">${delivery.station}</span>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-label">BOL Number</div>
              <div class="meta-value">${delivery.bol_number || 'Not Assigned'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">📊</span>
              <span class="section-title">Delivery Summary</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Record ID</div>
                <div class="data-value">#${delivery.id}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Delivered</div>
                <div class="data-value">${formatNumber(totalDelivered)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Total Before</div>
                <div class="data-value">${formatNumber(totalTankVolumeBefore)} gal</div>
              </div>
              <div class="data-card">
                <div class="data-label">Expected Total After</div>
                <div class="data-value">${formatNumber(expectedTotalAfter)} gal</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">⛽</span>
              <span class="section-title">Tank Volumes Before Delivery</span>
            </div>
            <div class="fuel-grid">
              <div class="fuel-card fuel-regular">
                <div class="fuel-amount">${formatNumber(delivery.regular_tank_volume)}</div>
                <div class="fuel-label">Regular Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-plus">
                <div class="fuel-amount">${formatNumber(delivery.plus_tank_volume)}</div>
                <div class="fuel-label">Plus Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-super">
                <div class="fuel-amount">${formatNumber(delivery.super_tank_volume)}</div>
                <div class="fuel-label">Super Tank (gal)</div>
              </div>
              <div class="fuel-card fuel-total">
                <div class="fuel-amount">${formatNumber(totalTankVolumeBefore)}</div>
                <div class="fuel-label">Total Volume (gal)</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <span class="section-icon">🚛</span>
              <span class="section-title">Fuel Delivered</span>
            </div>
            <div class="fuel-grid">
              <div class="fuel-card fuel-regular">
                <div class="fuel-amount">${formatNumber(delivery.regular_delivered)}</div>
                <div class="fuel-label">Regular Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-plus">
                <div class="fuel-amount">${formatNumber(delivery.plus_delivered)}</div>
                <div class="fuel-label">Plus Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-super">
                <div class="fuel-amount">${formatNumber(delivery.super_delivered)}</div>
                <div class="fuel-label">Super Delivered (gal)</div>
              </div>
              <div class="fuel-card fuel-total">
                <div class="fuel-amount">${formatNumber(totalDelivered)}</div>
                <div class="fuel-label">Total Delivered (gal)</div>
              </div>
            </div>
          </div>

          ${afterDeliveryReport ? `
          <div class="section">
            <div class="section-header">
              <span class="section-icon">✅</span>
              <span class="section-title">Post-Delivery Verification</span>
            </div>
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Tank Type</th>
                  <th>Before Delivery</th>
                  <th>Delivered</th>
                  <th>Expected After</th>
                  <th>Actual After</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Regular</strong></td>
                  <td>${formatNumber(delivery.regular_tank_volume)}</td>
                  <td>${formatNumber(delivery.regular_delivered)}</td>
                  <td>${formatNumber(regularExpected)}</td>
                  <td>${formatNumber(afterDeliveryReport.regular_tank_final)}</td>
                  <td class="${Math.abs(regularExpected - afterDeliveryReport.regular_tank_final) <= 2 ? 'status-verified' : 'status-error'}">
                    ${formatNumber(Math.abs(regularExpected - afterDeliveryReport.regular_tank_final))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Plus</strong></td>
                  <td>${formatNumber(delivery.plus_tank_volume)}</td>
                  <td>${formatNumber(delivery.plus_delivered)}</td>
                  <td>${formatNumber(plusExpected)}</td>
                  <td>${formatNumber(afterDeliveryReport.plus_tank_final)}</td>
                  <td class="${Math.abs(plusExpected - afterDeliveryReport.plus_tank_final) <= 2 ? 'status-verified' : 'status-error'}">
                    ${formatNumber(Math.abs(plusExpected - afterDeliveryReport.plus_tank_final))}
                  </td>
                </tr>
                <tr>
                  <td><strong>Super</strong></td>
                  <td>${formatNumber(delivery.super_tank_volume)}</td>
                  <td>${formatNumber(delivery.super_delivered)}</td>
                  <td>${formatNumber(superExpected)}</td>
                  <td>${formatNumber(afterDeliveryReport.super_tank_final)}</td>
                  <td class="${Math.abs(superExpected - afterDeliveryReport.super_tank_final) <= 2 ? 'status-verified' : 'status-error'}">
                    ${formatNumber(Math.abs(superExpected - afterDeliveryReport.super_tank_final))}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #374151; font-weight: bold;">
                  <td><strong>TOTAL</strong></td>
                  <td>${formatNumber(totalTankVolumeBefore)}</td>
                  <td>${formatNumber(totalDelivered)}</td>
                  <td>${formatNumber(expectedTotalAfter)}</td>
                  <td>${formatNumber(totalAfterDelivery)}</td>
                  <td class="${hasVolumeDiscrepancy ? 'status-error' : 'status-verified'}">
                    ${formatNumber(volumeDiscrepancy)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="verification-section ${hasVolumeDiscrepancy ? 'verification-error' : 'verification-section'}">
            <div class="section-header">
              <span class="section-icon">${hasVolumeDiscrepancy ? '⚠️' : '✅'}</span>
              <span class="section-title">Verification Status</span>
            </div>
            <div class="data-grid">
              <div class="data-card">
                <div class="data-label">Status</div>
                <div class="data-value ${getStatusColor(afterDeliveryReport.verification_status)}">${afterDeliveryReport.verification_status}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Tank Temperature</div>
                <div class="data-value">${afterDeliveryReport.tank_temperature}°F</div>
              </div>
              <div class="data-card">
                <div class="data-label">Reported By</div>
                <div class="data-value">${afterDeliveryReport.reported_by}</div>
              </div>
              <div class="data-card">
                <div class="data-label">Supervisor Approval</div>
                <div class="data-value ${afterDeliveryReport.supervisor_approval ? 'status-verified' : 'status-warning'}">
                  ${afterDeliveryReport.supervisor_approval ? '✅ Approved' : '⏳ Pending'}
                </div>
              </div>
            </div>
            ${afterDeliveryReport.discrepancy_notes ? `
            <div style="margin-top: 15px; padding: 10px; background: #fef2f2; border-radius: 5px;">
              <strong>Discrepancy Notes:</strong><br>
              ${afterDeliveryReport.discrepancy_notes}
            </div>
            ` : ''}
          </div>
          ` : `
          <div class="verification-section verification-warning">
            <div class="section-header">
              <span class="section-icon">⏳</span>
              <span class="section-title">Verification Pending</span>
            </div>
            <p>Post-delivery tank verification has not been completed yet. Please ensure tank levels are measured and recorded after the delivery is complete.</p>
          </div>
          `}

          ${delivery.delivery_notes ? `
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📝</span>
              <span class="section-title">Delivery Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${delivery.delivery_notes}</p>
          </div>
          ` : ''}

          ${afterDeliveryReport && afterDeliveryReport.additional_notes ? `
          <div class="notes-section">
            <div class="section-header">
              <span class="section-icon">📋</span>
              <span class="section-title">Additional Verification Notes</span>
            </div>
            <p style="margin: 0; white-space: pre-wrap;">${afterDeliveryReport.additional_notes}</p>
          </div>
          ` : ''}

          <div class="footer">
            <div>Delivery Record ID: #${delivery.id} | Generated on ${new Date().toLocaleString()}</div>
            <div>Created by User #${delivery.created_by} | DFS Manager Portal v2.0</div>
            ${afterDeliveryReport ? `<div>Verification Report ID: #${afterDeliveryReport.id} | Verified by User #${afterDeliveryReport.created_by}</div>` : ''}
            <div style="margin-top: 10px; font-style: italic;">
              This is an official fuel delivery document. Please retain for your records and regulatory compliance.
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
    <Dialog open={open} onOpenChange={onOpenChange} data-id="7g13qjo8k" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto" data-id="j17bwjjg9" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
        <DialogHeader data-id="bvxic7ih2" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
          <div className="flex items-center justify-between" data-id="j7nb9ss9d" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <DialogTitle className="flex items-center gap-2" data-id="3236vkw03" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <Truck className="h-5 w-5 text-blue-600" data-id="t0re7zq71" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
              Enhanced Delivery Report - {delivery.bol_number || `Record #${delivery.id}`}
            </DialogTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" data-id="ixdigii21" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <Printer className="h-4 w-4" data-id="gxj77kg79" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
              Print Full Report
            </Button>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="space-y-6" data-id="lf5navhp2" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
          {/* Header Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-id="lcj3od2ui" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <CardHeader data-id="z2isggh5t" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <div className="flex items-center justify-between" data-id="hx2bq16dn" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <div data-id="dpdnrmtdv" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <CardTitle className="text-blue-800" data-id="3i1y28o6k" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatDate(delivery.delivery_date)}</CardTitle>
                  <div className="flex items-center gap-2 mt-2" data-id="89zun3ij9" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <Badge className={getStationBadgeColor(delivery.station)} data-id="7mbuerl9t" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{delivery.station}</Badge>
                    <span className="text-sm text-gray-600" data-id="606ftoww7" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">BOL: {delivery.bol_number || 'Not Assigned'}</span>
                  </div>
                </div>
                <div className="text-right" data-id="0hyzw7gzn" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <div className="text-2xl font-bold text-blue-800" data-id="nje360opo" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(totalDelivered)} gal</div>
                  <div className="text-sm text-gray-600" data-id="ormc4ftan" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Total Delivered</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="wc048v04l" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <Card data-id="gqfofa4k5" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardContent className="p-4 text-center" data-id="2iuaacmlt" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <Fuel className="h-8 w-8 mx-auto text-blue-600 mb-2" data-id="cfdolijx4" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="text-2xl font-bold text-blue-600" data-id="727oac79j" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.regular_delivered)}</div>
                <div className="text-sm text-gray-600" data-id="0sdbcu1bd" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Regular Delivered</div>
              </CardContent>
            </Card>
            <Card data-id="lq1wonm1s" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardContent className="p-4 text-center" data-id="ho1eajel4" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <Fuel className="h-8 w-8 mx-auto text-green-600 mb-2" data-id="0rxh03drn" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="text-2xl font-bold text-green-600" data-id="6fhsuk8d1" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.plus_delivered)}</div>
                <div className="text-sm text-gray-600" data-id="xfg59ov4e" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Plus Delivered</div>
              </CardContent>
            </Card>
            <Card data-id="0ddvpuqwj" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardContent className="p-4 text-center" data-id="wsxw0qk2h" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <Fuel className="h-8 w-8 mx-auto text-purple-600 mb-2" data-id="ika4j6xag" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="text-2xl font-bold text-purple-600" data-id="k4k5aayho" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.super_delivered)}</div>
                <div className="text-sm text-gray-600" data-id="fvk8d5e3u" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Super Delivered</div>
              </CardContent>
            </Card>
            <Card data-id="11pw4nroz" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardContent className="p-4 text-center" data-id="0xxt3j7o9" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <BarChart3 className="h-8 w-8 mx-auto text-orange-600 mb-2" data-id="zaukfk2tk" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="text-2xl font-bold text-orange-600" data-id="adg47x8yx" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(totalDelivered)}</div>
                <div className="text-sm text-gray-600" data-id="dcczxwqm6" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Total Delivered</div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Status */}
          {afterDeliveryReport &&
          <Card className={`border-2 ${hasVolumeDiscrepancy ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`} data-id="t51rskvbu" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardHeader data-id="7dusxrkyh" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <CardTitle className="flex items-center gap-2" data-id="o38ujh6uy" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  {hasVolumeDiscrepancy ?
                <div className="text-red-600 flex items-center gap-2" data-id="lhvgsrspb" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                      <AlertTriangle className="h-5 w-5" data-id="9j27r0ouc" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                      Volume Discrepancy Detected
                    </div> :
                <div className="text-green-600" data-id="xb9yns53y" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">✓ Delivery Verified</div>
                }
                </CardTitle>
              </CardHeader>
              <CardContent data-id="43i2jorpi" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="jtpbjdme6" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <div className="flex justify-between" data-id="3rakvduqm" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <span data-id="bk84rgg5m" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Status:</span>
                    <span className={`font-medium ${getStatusColor(afterDeliveryReport.verification_status)}`} data-id="mm5ugrpjj" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                      {afterDeliveryReport.verification_status}
                    </span>
                  </div>
                  <div className="flex justify-between" data-id="ptx2jj91h" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <span data-id="fihlgburt" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Temperature:</span>
                    <span className="font-medium" data-id="l22zkk605" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{afterDeliveryReport.tank_temperature}°F</span>
                  </div>
                  <div className="flex justify-between" data-id="kroxszmas" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <span data-id="f78zevcuc" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Volume Difference:</span>
                    <span className={`font-medium ${hasVolumeDiscrepancy ? 'text-red-600' : 'text-green-600'}`} data-id="5vm0opd5k" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                      {formatNumber(volumeDiscrepancy)} gal
                    </span>
                  </div>
                  <div className="flex justify-between" data-id="gv391gcs7" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <span data-id="n7yoqx3gz" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Supervisor Approval:</span>
                    <span className={`font-medium ${afterDeliveryReport.supervisor_approval ? 'text-green-600' : 'text-yellow-600'}`} data-id="qwl13c12e" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                      {afterDeliveryReport.supervisor_approval ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          }

          {/* Tank Volumes Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="ptt5gqur9" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <Card data-id="35qlh8wu9" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardHeader data-id="2fpsyf1os" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <CardTitle className="text-sm" data-id="uzpx1tvys" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Tank Volumes Before</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" data-id="2qa178cqu" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <div className="flex justify-between text-sm" data-id="ezaffzqap" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="wz6x9n8ks" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Regular:</span>
                  <span className="font-medium" data-id="hxof07m68" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.regular_tank_volume)} gal</span>
                </div>
                <div className="flex justify-between text-sm" data-id="kmwwce6w2" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="xi4o8ild2" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Plus:</span>
                  <span className="font-medium" data-id="tvz1wupl1" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.plus_tank_volume)} gal</span>
                </div>
                <div className="flex justify-between text-sm" data-id="onom9powu" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="bka7xd1vn" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Super:</span>
                  <span className="font-medium" data-id="fvr7v217o" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.super_tank_volume)} gal</span>
                </div>
                <Separator data-id="ikh526tci" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="flex justify-between text-sm font-semibold" data-id="l0w4g3i80" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="vzswt8v21" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Total:</span>
                  <span data-id="rue6d51jb" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(totalTankVolumeBefore)} gal</span>
                </div>
              </CardContent>
            </Card>

            <Card data-id="63u7k1luj" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardHeader data-id="9je631pmj" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <CardTitle className="text-sm" data-id="208n9xoe7" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Fuel Delivered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" data-id="q0h9vcotc" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <div className="flex justify-between text-sm" data-id="xxgj3iqnc" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="au1gxqybk" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Regular:</span>
                  <span className="font-medium text-blue-600" data-id="vsxkgcepi" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.regular_delivered)} gal</span>
                </div>
                <div className="flex justify-between text-sm" data-id="8ws30845l" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="nji4wytu6" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Plus:</span>
                  <span className="font-medium text-green-600" data-id="nenn6mgbw" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.plus_delivered)} gal</span>
                </div>
                <div className="flex justify-between text-sm" data-id="izyqobtvq" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="wz4qf7jhk" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Super:</span>
                  <span className="font-medium text-purple-600" data-id="dlthzrrep" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(delivery.super_delivered)} gal</span>
                </div>
                <Separator data-id="rkrmf176z" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
                <div className="flex justify-between text-sm font-semibold" data-id="87cv98346" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                  <span data-id="u199xtboz" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Total:</span>
                  <span className="text-orange-600" data-id="02fzk5mo7" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{formatNumber(totalDelivered)} gal</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Preview */}
          {(delivery.delivery_notes || afterDeliveryReport && afterDeliveryReport.additional_notes) &&
          <Card data-id="4u2aml0vh" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
              <CardHeader data-id="chi75fm1j" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                <CardTitle className="text-sm" data-id="62d291517" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-id="c6oaupdbo" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                {delivery.delivery_notes &&
              <div data-id="4o64w3zc2" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <div className="text-xs font-medium text-gray-600 mb-1" data-id="o7cfub9q3" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Delivery Notes:</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap" data-id="9q56rscwk" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{delivery.delivery_notes}</p>
                  </div>
              }
                {afterDeliveryReport && afterDeliveryReport.additional_notes &&
              <div data-id="q0idl5vbo" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
                    <div className="text-xs font-medium text-gray-600 mb-1" data-id="8ha7zrj45" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">Verification Notes:</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap" data-id="w3vh9077p" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">{afterDeliveryReport.additional_notes}</p>
                  </div>
              }
              </CardContent>
            </Card>
          }
        </div>

        <DialogFooter className="flex justify-end space-x-2" data-id="b1t3lsjho" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-id="su798zt3n" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <X className="w-4 h-4 mr-2" data-id="12hryy11e" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700" data-id="n8hgefn5m" data-path="src/components/EnhancedDeliveryPrintDialog.tsx">
            <Printer className="w-4 h-4 mr-2" data-id="03k3j03kp" data-path="src/components/EnhancedDeliveryPrintDialog.tsx" />
            Print Full Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

};

export default EnhancedDeliveryPrintDialog;
