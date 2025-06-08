import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Truck,
  Calendar,
  MapPin,
  FileText,
  Gauge,
  Fuel,
  User,
  Hash,
  Printer } from
'lucide-react';

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

interface DeliveryReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: DeliveryRecord | null;
}

const DeliveryReportDialog: React.FC<DeliveryReportDialogProps> = ({
  open,
  onOpenChange,
  delivery
}) => {
  if (!delivery) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getTotalDelivered = () => {
    return delivery.regular_delivered + delivery.plus_delivered + delivery.super_delivered;
  };

  const getTotalTankVolume = () => {
    return delivery.regular_tank_volume + delivery.plus_tank_volume + delivery.super_tank_volume;
  };

  const getStationBadgeColor = (station: string) => {
    switch (station) {
      case 'MOBIL':
        return 'bg-red-100 text-red-800';
      case 'AMOCO ROSEDALE':
        return 'bg-blue-100 text-blue-800';
      case 'AMOCO BROOKLYN':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Report - ${delivery.bol_number || `Record #${delivery.id}`}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; }
            .report-title { font-size: 18px; color: #666; margin-top: 10px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .info-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .info-label { font-size: 12px; color: #666; text-transform: uppercase; }
            .info-value { font-size: 14px; font-weight: bold; margin-top: 5px; }
            .fuel-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            .fuel-item { text-align: center; padding: 15px; border: 2px solid; border-radius: 8px; }
            .fuel-regular { border-color: #3b82f6; background-color: #eff6ff; }
            .fuel-plus { border-color: #10b981; background-color: #f0fdf4; }
            .fuel-super { border-color: #8b5cf6; background-color: #faf5ff; }
            .fuel-total { border-color: #f59e0b; background-color: #fffbeb; }
            .fuel-amount { font-size: 24px; font-weight: bold; }
            .fuel-label { font-size: 12px; margin-top: 5px; }
            .notes { background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">DFS Manager Portal</div>
            <div class="report-title">Fuel Delivery Report</div>
          </div>

          <div class="section">
            <div class="section-title">Delivery Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Record ID</div>
                <div class="info-value">#${delivery.id}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Delivery Date</div>
                <div class="info-value">${formatDate(delivery.delivery_date)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">BOL Number</div>
                <div class="info-value">${delivery.bol_number || 'Not Assigned'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Station</div>
                <div class="info-value">${delivery.station}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Tank Volumes Before Delivery</div>
            <div class="fuel-grid">
              <div class="fuel-item fuel-regular">
                <div class="fuel-amount">${formatNumber(delivery.regular_tank_volume)}</div>
                <div class="fuel-label">Regular Tank (gal)</div>
              </div>
              <div class="fuel-item fuel-plus">
                <div class="fuel-amount">${formatNumber(delivery.plus_tank_volume)}</div>
                <div class="fuel-label">Plus Tank (gal)</div>
              </div>
              <div class="fuel-item fuel-super">
                <div class="fuel-amount">${formatNumber(delivery.super_tank_volume)}</div>
                <div class="fuel-label">Super Tank (gal)</div>
              </div>
              <div class="fuel-item">
                <div class="fuel-amount">${formatNumber(getTotalTankVolume())}</div>
                <div class="fuel-label">Total Volume (gal)</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Fuel Delivered</div>
            <div class="fuel-grid">
              <div class="fuel-item fuel-regular">
                <div class="fuel-amount">${formatNumber(delivery.regular_delivered)}</div>
                <div class="fuel-label">Regular Delivered (gal)</div>
              </div>
              <div class="fuel-item fuel-plus">
                <div class="fuel-amount">${formatNumber(delivery.plus_delivered)}</div>
                <div class="fuel-label">Plus Delivered (gal)</div>
              </div>
              <div class="fuel-item fuel-super">
                <div class="fuel-amount">${formatNumber(delivery.super_delivered)}</div>
                <div class="fuel-label">Super Delivered (gal)</div>
              </div>
              <div class="fuel-item fuel-total">
                <div class="fuel-amount">${formatNumber(getTotalDelivered())}</div>
                <div class="fuel-label">Total Delivered (gal)</div>
              </div>
            </div>
          </div>

          ${delivery.delivery_notes ? `
          <div class="section">
            <div class="section-title">Delivery Notes</div>
            <div class="notes">${delivery.delivery_notes}</div>
          </div>
          ` : ''}

          <div class="footer">
            <div>Report generated on ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</div>
            <div>Created by User #${delivery.created_by} | DFS Manager Portal</div>
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
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-id="n5gzqqtls" data-path="src/components/DeliveryReportDialog.tsx">
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-id="ba3f0r7xf" data-path="src/components/DeliveryReportDialog.tsx">
        <DialogHeader data-id="djioxqcy9" data-path="src/components/DeliveryReportDialog.tsx">
          <div className="flex items-center justify-between" data-id="foqk620oj" data-path="src/components/DeliveryReportDialog.tsx">
            <DialogTitle className="flex items-center gap-2" data-id="h5a6e413e" data-path="src/components/DeliveryReportDialog.tsx">
              <Truck className="h-5 w-5 text-blue-600" data-id="okdr9r30t" data-path="src/components/DeliveryReportDialog.tsx" />
              Delivery Report - {delivery.bol_number || `Record #${delivery.id}`}
            </DialogTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" data-id="7vzqi96zb" data-path="src/components/DeliveryReportDialog.tsx">

              <Printer className="h-4 w-4" data-id="olg5j28zb" data-path="src/components/DeliveryReportDialog.tsx" />
              Print Report
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-6" data-id="0up66qjov" data-path="src/components/DeliveryReportDialog.tsx">
          {/* Header Information */}
          <Card data-id="6o4s44viz" data-path="src/components/DeliveryReportDialog.tsx">
            <CardHeader data-id="z87rjw2da" data-path="src/components/DeliveryReportDialog.tsx">
              <CardTitle className="flex items-center gap-2" data-id="gz9c13h22" data-path="src/components/DeliveryReportDialog.tsx">
                <FileText className="h-5 w-5" data-id="bfok4s129" data-path="src/components/DeliveryReportDialog.tsx" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent data-id="38psuv07d" data-path="src/components/DeliveryReportDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="vxnyttd8f" data-path="src/components/DeliveryReportDialog.tsx">
                <div className="flex items-center gap-2" data-id="zeoruywy2" data-path="src/components/DeliveryReportDialog.tsx">
                  <Hash className="h-4 w-4 text-gray-500" data-id="gnr5yqd7u" data-path="src/components/DeliveryReportDialog.tsx" />
                  <div data-id="ezq7psq9m" data-path="src/components/DeliveryReportDialog.tsx">
                    <p className="text-sm text-gray-600" data-id="erg5bo3x3" data-path="src/components/DeliveryReportDialog.tsx">Record ID</p>
                    <p className="font-semibold" data-id="00qg9xgnf" data-path="src/components/DeliveryReportDialog.tsx">#{delivery.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2" data-id="06he5q6wu" data-path="src/components/DeliveryReportDialog.tsx">
                  <Calendar className="h-4 w-4 text-gray-500" data-id="mrbjr015n" data-path="src/components/DeliveryReportDialog.tsx" />
                  <div data-id="zsjodmq59" data-path="src/components/DeliveryReportDialog.tsx">
                    <p className="text-sm text-gray-600" data-id="k7hpcwqv8" data-path="src/components/DeliveryReportDialog.tsx">Delivery Date</p>
                    <p className="font-semibold" data-id="tm0i5ffed" data-path="src/components/DeliveryReportDialog.tsx">{formatDate(delivery.delivery_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2" data-id="r916ixu17" data-path="src/components/DeliveryReportDialog.tsx">
                  <FileText className="h-4 w-4 text-gray-500" data-id="1u60qpw24" data-path="src/components/DeliveryReportDialog.tsx" />
                  <div data-id="hn3dh1g21" data-path="src/components/DeliveryReportDialog.tsx">
                    <p className="text-sm text-gray-600" data-id="omtmo2vl8" data-path="src/components/DeliveryReportDialog.tsx">BOL Number</p>
                    <p className="font-semibold" data-id="3jrvj37sm" data-path="src/components/DeliveryReportDialog.tsx">{delivery.bol_number || 'Not Assigned'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2" data-id="rgywhvf2q" data-path="src/components/DeliveryReportDialog.tsx">
                  <MapPin className="h-4 w-4 text-gray-500" data-id="19n09z5i1" data-path="src/components/DeliveryReportDialog.tsx" />
                  <div data-id="bkcei25r7" data-path="src/components/DeliveryReportDialog.tsx">
                    <p className="text-sm text-gray-600" data-id="la0kgswz8" data-path="src/components/DeliveryReportDialog.tsx">Station</p>
                    <Badge className={getStationBadgeColor(delivery.station)} data-id="bkvfvgci3" data-path="src/components/DeliveryReportDialog.tsx">
                      {delivery.station}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tank Volumes Before Delivery */}
          <Card data-id="pec1lida6" data-path="src/components/DeliveryReportDialog.tsx">
            <CardHeader data-id="tpl2hghld" data-path="src/components/DeliveryReportDialog.tsx">
              <CardTitle className="flex items-center gap-2" data-id="gnimjmv9p" data-path="src/components/DeliveryReportDialog.tsx">
                <Gauge className="h-5 w-5" data-id="hrrmc591y" data-path="src/components/DeliveryReportDialog.tsx" />
                Tank Volumes Before Delivery
              </CardTitle>
            </CardHeader>
            <CardContent data-id="9q6abja09" data-path="src/components/DeliveryReportDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="8s8n26yoz" data-path="src/components/DeliveryReportDialog.tsx">
                <div className="text-center p-4 bg-blue-50 rounded-lg" data-id="lbef46jzt" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-2xl font-bold text-blue-600" data-id="o0et4xwpo" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.regular_tank_volume)}
                  </div>
                  <div className="text-sm text-blue-800" data-id="vt3llkxqy" data-path="src/components/DeliveryReportDialog.tsx">Regular Tank (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg" data-id="hrgc5f5oj" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-2xl font-bold text-green-600" data-id="tc54uqfxy" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.plus_tank_volume)}
                  </div>
                  <div className="text-sm text-green-800" data-id="nrzu1ecnb" data-path="src/components/DeliveryReportDialog.tsx">Plus Tank (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg" data-id="biyczd4gl" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-2xl font-bold text-purple-600" data-id="evcygpley" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.super_tank_volume)}
                  </div>
                  <div className="text-sm text-purple-800" data-id="0pui125q6" data-path="src/components/DeliveryReportDialog.tsx">Super Tank (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg" data-id="r6vmznrm5" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-2xl font-bold text-gray-600" data-id="bcwu8g307" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(getTotalTankVolume())}
                  </div>
                  <div className="text-sm text-gray-800" data-id="k5enrt2nm" data-path="src/components/DeliveryReportDialog.tsx">Total Volume (gal)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Delivered */}
          <Card data-id="tnkg3rzki" data-path="src/components/DeliveryReportDialog.tsx">
            <CardHeader data-id="2y8v5rzal" data-path="src/components/DeliveryReportDialog.tsx">
              <CardTitle className="flex items-center gap-2" data-id="dasmzkoyl" data-path="src/components/DeliveryReportDialog.tsx">
                <Fuel className="h-5 w-5" data-id="ze6ynw3e6" data-path="src/components/DeliveryReportDialog.tsx" />
                Fuel Delivered
              </CardTitle>
            </CardHeader>
            <CardContent data-id="9ur14khbt" data-path="src/components/DeliveryReportDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="bx4j8xbnr" data-path="src/components/DeliveryReportDialog.tsx">
                <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200" data-id="4i3yeetil" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-3xl font-bold text-blue-600" data-id="nr2cufp71" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.regular_delivered)}
                  </div>
                  <div className="text-sm text-blue-800 font-medium" data-id="xnol15wla" data-path="src/components/DeliveryReportDialog.tsx">Regular Delivered (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200" data-id="rk67e18yr" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-3xl font-bold text-green-600" data-id="0bt2p2bca" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.plus_delivered)}
                  </div>
                  <div className="text-sm text-green-800 font-medium" data-id="novawrcq4" data-path="src/components/DeliveryReportDialog.tsx">Plus Delivered (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200" data-id="5xz94b9pa" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-3xl font-bold text-purple-600" data-id="ey7tpj2pw" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(delivery.super_delivered)}
                  </div>
                  <div className="text-sm text-purple-800 font-medium" data-id="kobm5ujr8" data-path="src/components/DeliveryReportDialog.tsx">Super Delivered (gal)</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200" data-id="kbs5jrws1" data-path="src/components/DeliveryReportDialog.tsx">
                  <div className="text-3xl font-bold text-orange-600" data-id="mm49jpu7v" data-path="src/components/DeliveryReportDialog.tsx">
                    {formatNumber(getTotalDelivered())}
                  </div>
                  <div className="text-sm text-orange-800 font-medium" data-id="celypcoyz" data-path="src/components/DeliveryReportDialog.tsx">Total Delivered (gal)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Summary */}
          <Card data-id="wpotoast2" data-path="src/components/DeliveryReportDialog.tsx">
            <CardHeader data-id="s0ge6j1ne" data-path="src/components/DeliveryReportDialog.tsx">
              <CardTitle data-id="10xx8c35s" data-path="src/components/DeliveryReportDialog.tsx">Delivery Summary</CardTitle>
            </CardHeader>
            <CardContent data-id="l24w205si" data-path="src/components/DeliveryReportDialog.tsx">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="pdonl82a6" data-path="src/components/DeliveryReportDialog.tsx">
                <div data-id="0uqgr9mj0" data-path="src/components/DeliveryReportDialog.tsx">
                  <h4 className="font-semibold text-gray-700 mb-2" data-id="gwkepu1s1" data-path="src/components/DeliveryReportDialog.tsx">Tank Capacity Utilization</h4>
                  <div className="space-y-2" data-id="kkbtxz9s2" data-path="src/components/DeliveryReportDialog.tsx">
                    <div className="flex justify-between" data-id="reuaixvbj" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="o2zv3xyjz" data-path="src/components/DeliveryReportDialog.tsx">Regular:</span>
                      <span className="text-sm font-medium" data-id="ugmib1gl5" data-path="src/components/DeliveryReportDialog.tsx">
                        {delivery.regular_tank_volume > 0 ?
                        `${(delivery.regular_delivered / (delivery.regular_tank_volume + delivery.regular_delivered) * 100).toFixed(1)}%` :
                        'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between" data-id="vpjm55gbt" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="y5yy8pmuv" data-path="src/components/DeliveryReportDialog.tsx">Plus:</span>
                      <span className="text-sm font-medium" data-id="rqqh8xa9b" data-path="src/components/DeliveryReportDialog.tsx">
                        {delivery.plus_tank_volume > 0 ?
                        `${(delivery.plus_delivered / (delivery.plus_tank_volume + delivery.plus_delivered) * 100).toFixed(1)}%` :
                        'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between" data-id="1ecwnq8gp" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="ylo5a0ilm" data-path="src/components/DeliveryReportDialog.tsx">Super:</span>
                      <span className="text-sm font-medium" data-id="867yfbu0l" data-path="src/components/DeliveryReportDialog.tsx">
                        {delivery.super_tank_volume > 0 ?
                        `${(delivery.super_delivered / (delivery.super_tank_volume + delivery.super_delivered) * 100).toFixed(1)}%` :
                        'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div data-id="uvlev90ak" data-path="src/components/DeliveryReportDialog.tsx">
                  <h4 className="font-semibold text-gray-700 mb-2" data-id="bsl4rq6yn" data-path="src/components/DeliveryReportDialog.tsx">Delivery Breakdown</h4>
                  <div className="space-y-2" data-id="emi56ioeq" data-path="src/components/DeliveryReportDialog.tsx">
                    <div className="flex justify-between" data-id="sa4mtf8k2" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="tjc6svj8d" data-path="src/components/DeliveryReportDialog.tsx">Regular:</span>
                      <span className="text-sm font-medium" data-id="fg41kt37v" data-path="src/components/DeliveryReportDialog.tsx">
                        {getTotalDelivered() > 0 ?
                        `${(delivery.regular_delivered / getTotalDelivered() * 100).toFixed(1)}%` :
                        '0%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between" data-id="m5kv9s4mk" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="cbd90j514" data-path="src/components/DeliveryReportDialog.tsx">Plus:</span>
                      <span className="text-sm font-medium" data-id="uz6j3yaen" data-path="src/components/DeliveryReportDialog.tsx">
                        {getTotalDelivered() > 0 ?
                        `${(delivery.plus_delivered / getTotalDelivered() * 100).toFixed(1)}%` :
                        '0%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between" data-id="cn8d6uo9m" data-path="src/components/DeliveryReportDialog.tsx">
                      <span className="text-sm" data-id="hsp3x6sm4" data-path="src/components/DeliveryReportDialog.tsx">Super:</span>
                      <span className="text-sm font-medium" data-id="1zeh7b1m6" data-path="src/components/DeliveryReportDialog.tsx">
                        {getTotalDelivered() > 0 ?
                        `${(delivery.super_delivered / getTotalDelivered() * 100).toFixed(1)}%` :
                        '0%'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div data-id="6pct9rgrw" data-path="src/components/DeliveryReportDialog.tsx">
                  <h4 className="font-semibold text-gray-700 mb-2" data-id="09ha2yxin" data-path="src/components/DeliveryReportDialog.tsx">Record Details</h4>
                  <div className="space-y-2" data-id="m7xu16a29" data-path="src/components/DeliveryReportDialog.tsx">
                    <div className="flex items-center gap-2" data-id="r23ic9l27" data-path="src/components/DeliveryReportDialog.tsx">
                      <User className="h-4 w-4 text-gray-500" data-id="5c7inj6rp" data-path="src/components/DeliveryReportDialog.tsx" />
                      <span className="text-sm" data-id="wy3bcuiar" data-path="src/components/DeliveryReportDialog.tsx">Created by User #{delivery.created_by}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Notes */}
          {delivery.delivery_notes &&
          <Card data-id="jja2ghmc8" data-path="src/components/DeliveryReportDialog.tsx">
              <CardHeader data-id="fz3knhhqc" data-path="src/components/DeliveryReportDialog.tsx">
                <CardTitle data-id="dqql3e53a" data-path="src/components/DeliveryReportDialog.tsx">Delivery Notes</CardTitle>
              </CardHeader>
              <CardContent data-id="55svfleji" data-path="src/components/DeliveryReportDialog.tsx">
                <div className="bg-gray-50 p-4 rounded-lg" data-id="zanwwz6hf" data-path="src/components/DeliveryReportDialog.tsx">
                  <p className="text-gray-700 whitespace-pre-wrap" data-id="v8qinr250" data-path="src/components/DeliveryReportDialog.tsx">
                    {delivery.delivery_notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </DialogContent>
    </Dialog>);

};

export default DeliveryReportDialog;