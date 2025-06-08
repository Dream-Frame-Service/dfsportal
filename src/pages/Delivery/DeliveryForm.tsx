import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Truck, Save, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DeliveryRecord {
  id?: number;
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
  regular_tank_final: number;
  plus_tank_final: number;
  super_tank_final: number;
}

interface DiscrepancyData {
  regular_expected: number;
  plus_expected: number;
  super_expected: number;
  regular_discrepancy: number;
  plus_discrepancy: number;
  super_discrepancy: number;
  has_discrepancy: boolean;
}

const DeliveryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DeliveryRecord>({
    delivery_date: new Date().toISOString().split('T')[0],
    bol_number: '',
    station: '',
    regular_tank_volume: 0,
    plus_tank_volume: 0,
    super_tank_volume: 0,
    regular_delivered: 0,
    plus_delivered: 0,
    super_delivered: 0,
    delivery_notes: '',
    created_by: 1 // This should be set from auth context
  });

  const [afterDeliveryData, setAfterDeliveryData] = useState<AfterDeliveryReport>({
    regular_tank_final: 0,
    plus_tank_final: 0,
    super_tank_final: 0
  });

  const [discrepancyData, setDiscrepancyData] = useState<DiscrepancyData>({
    regular_expected: 0,
    plus_expected: 0,
    super_expected: 0,
    regular_discrepancy: 0,
    plus_discrepancy: 0,
    super_discrepancy: 0,
    has_discrepancy: false
  });

  const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

  // Calculate expected tank levels and discrepancies
  useEffect(() => {
    const regular_expected = formData.regular_tank_volume + formData.regular_delivered;
    const plus_expected = formData.plus_tank_volume + formData.plus_delivered;
    const super_expected = formData.super_tank_volume + formData.super_delivered;

    const regular_discrepancy = afterDeliveryData.regular_tank_final - regular_expected;
    const plus_discrepancy = afterDeliveryData.plus_tank_final - plus_expected;
    const super_discrepancy = afterDeliveryData.super_tank_final - super_expected;

    const tolerance = 5; // 5 gallon tolerance
    const has_discrepancy =
    Math.abs(regular_discrepancy) > tolerance ||
    Math.abs(plus_discrepancy) > tolerance ||
    Math.abs(super_discrepancy) > tolerance;

    setDiscrepancyData({
      regular_expected,
      plus_expected,
      super_expected,
      regular_discrepancy,
      plus_discrepancy,
      super_discrepancy,
      has_discrepancy
    });

    // Auto-update verification status based on discrepancies - removed as verification_status field is no longer used
  }, [formData, afterDeliveryData.regular_tank_final, afterDeliveryData.plus_tank_final, afterDeliveryData.super_tank_final]);

  useEffect(() => {
    if (id) {
      loadDeliveryRecord();
    }
  }, [id]);

  const loadAfterDeliveryReport = async (deliveryId: number) => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(12331, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: 'delivery_record_id', op: 'Equal', value: deliveryId }]
      });

      if (error) throw error;

      if (data?.List?.length > 0) {
        const report = data.List[0];
        setAfterDeliveryData({
          regular_tank_final: report.regular_tank_final || 0,
          plus_tank_final: report.plus_tank_final || 0,
          super_tank_final: report.super_tank_final || 0
        });
      }
    } catch (error) {
      console.error('Error loading after delivery report:', error);
    }
  };

  const loadDeliveryRecord = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(12196, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: 'id', op: 'Equal', value: parseInt(id!) }]
      });

      if (error) throw error;

      if (data?.List?.length > 0) {
        const record = data.List[0];
        setFormData({
          ...record,
          delivery_date: record.delivery_date ? new Date(record.delivery_date).toISOString().split('T')[0] : ''
        });

        // Load associated after-delivery tank report if exists
        loadAfterDeliveryReport(parseInt(id!));
      }
    } catch (error) {
      console.error('Error loading delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to load delivery record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.station || !formData.delivery_date || !formData.bol_number) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Date, BOL Number, and Station)",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        delivery_date: new Date(formData.delivery_date).toISOString()
      };

      let deliveryRecordId;

      if (id) {
        const { error } = await window.ezsite.apis.tableUpdate(12196, {
          ID: parseInt(id),
          ...submitData
        });
        if (error) throw error;
        deliveryRecordId = parseInt(id);

        toast({
          title: "Success",
          description: "Delivery record updated successfully"
        });
      } else {
        const { data, error } = await window.ezsite.apis.tableCreate(12196, submitData);
        if (error) throw error;
        deliveryRecordId = data.ID;

        toast({
          title: "Success",
          description: "Delivery record created successfully"
        });
      }

      // Save after-delivery tank report if any final tank values are provided
      if (afterDeliveryData.regular_tank_final > 0 || afterDeliveryData.plus_tank_final > 0 || afterDeliveryData.super_tank_final > 0) {
        const afterDeliverySubmitData = {
          report_date: new Date().toISOString(),
          station: formData.station,
          delivery_record_id: deliveryRecordId,
          bol_number: formData.bol_number,
          regular_tank_final: afterDeliveryData.regular_tank_final,
          plus_tank_final: afterDeliveryData.plus_tank_final,
          super_tank_final: afterDeliveryData.super_tank_final,
          created_by: formData.created_by
        };

        // Check if after-delivery report already exists for this delivery
        const { data: existingReport } = await window.ezsite.apis.tablePage(12331, {
          PageNo: 1,
          PageSize: 1,
          Filters: [{ name: 'delivery_record_id', op: 'Equal', value: deliveryRecordId }]
        });

        if (existingReport?.List?.length > 0) {
          // Update existing report
          const { error: afterError } = await window.ezsite.apis.tableUpdate(12331, {
            ID: existingReport.List[0].ID,
            ...afterDeliverySubmitData
          });
          if (afterError) throw afterError;
        } else {
          // Create new report
          const { error: afterError } = await window.ezsite.apis.tableCreate(12331, afterDeliverySubmitData);
          if (afterError) throw afterError;
        }
      }

      navigate('/delivery');
    } catch (error) {
      console.error('Error saving delivery record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DeliveryRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAfterDeliveryChange = (field: keyof AfterDeliveryReport, value: any) => {
    setAfterDeliveryData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-id="qjiwphgcr" data-path="src/pages/Delivery/DeliveryForm.tsx">
        <div className="text-center" data-id="yy6msmwmn" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" data-id="3uvnof8g2" data-path="src/pages/Delivery/DeliveryForm.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="nnq7nk5k1" data-path="src/pages/Delivery/DeliveryForm.tsx">Loading delivery record...</p>
        </div>
      </div>);

  }

  return (
    <div className="container mx-auto px-4 py-6" data-id="ym5o74tcw" data-path="src/pages/Delivery/DeliveryForm.tsx">
      <div className="mb-6" data-id="9rgdr49h9" data-path="src/pages/Delivery/DeliveryForm.tsx">
        <Button
          onClick={() => navigate('/delivery')}
          variant="ghost"
          className="mb-4" data-id="qbmayvtjs" data-path="src/pages/Delivery/DeliveryForm.tsx">

          <ArrowLeft className="mr-2 h-4 w-4" data-id="elnuhue8v" data-path="src/pages/Delivery/DeliveryForm.tsx" />
          Back to Delivery List
        </Button>
        
        <div className="flex items-center gap-2 mb-4" data-id="9937epgce" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <Truck className="h-6 w-6 text-blue-600" data-id="j4w9ijmun" data-path="src/pages/Delivery/DeliveryForm.tsx" />
          <h1 className="text-2xl font-bold text-gray-900" data-id="dybwek1o6" data-path="src/pages/Delivery/DeliveryForm.tsx">
            {id ? 'Edit Delivery Record' : 'New Delivery Record'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-id="vaaokxrhj" data-path="src/pages/Delivery/DeliveryForm.tsx">
        {/* Basic Information */}
        <Card data-id="5hn17sb0r" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="z31tu53a5" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle data-id="43q1a7ugi" data-path="src/pages/Delivery/DeliveryForm.tsx">Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="rejwi35tl" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="17rsy954y" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <div data-id="iwzjvn6yz" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="delivery_date" data-id="hgylcxigw" data-path="src/pages/Delivery/DeliveryForm.tsx">Delivery Date *</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                  required data-id="9nduj3nd0" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="4yvswfg23" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="bol_number" data-id="3gk8z4vil" data-path="src/pages/Delivery/DeliveryForm.tsx">BOL Number *</Label>
                <Input
                  id="bol_number"
                  type="text"
                  placeholder="Enter BOL Number"
                  value={formData.bol_number}
                  onChange={(e) => handleInputChange('bol_number', e.target.value)}
                  required data-id="5gapk0z7l" data-path="src/pages/Delivery/DeliveryForm.tsx" />
              </div>
              
              <div data-id="mkkga0ae0" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="station" data-id="801u01hof" data-path="src/pages/Delivery/DeliveryForm.tsx">Station *</Label>
                <Select
                  value={formData.station}
                  onValueChange={(value) => handleInputChange('station', value)} data-id="rteafyt3u" data-path="src/pages/Delivery/DeliveryForm.tsx">

                  <SelectTrigger data-id="d6k604lze" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <SelectValue placeholder="Select station" data-id="mve9mlk0y" data-path="src/pages/Delivery/DeliveryForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="ql5td0w3e" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    {stations.map((station) =>
                    <SelectItem key={station} value={station} data-id="qg69ci9um" data-path="src/pages/Delivery/DeliveryForm.tsx">
                        {station}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Before Delivery Tank Report */}
        <Card data-id="op7bb5pb4" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="trpjp55pm" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle data-id="v4d5snxev" data-path="src/pages/Delivery/DeliveryForm.tsx">Before Delivery Tank Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="t14znqdm1" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="r0pbe565d" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <div data-id="xs0dvjg68" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="regular_tank_volume" data-id="03e3pht51" data-path="src/pages/Delivery/DeliveryForm.tsx">Regular Tank Volume (Gallons)</Label>
                <NumberInput
                  id="regular_tank_volume"
                  step="0.01"
                  value={formData.regular_tank_volume}
                  onChange={(value) => handleInputChange('regular_tank_volume', value)} data-id="i1nth2xoz" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="poi77v7n6" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="plus_tank_volume" data-id="jqydd9oaw" data-path="src/pages/Delivery/DeliveryForm.tsx">Plus Tank Volume (Gallons)</Label>
                <NumberInput
                  id="plus_tank_volume"
                  step="0.01"
                  value={formData.plus_tank_volume}
                  onChange={(value) => handleInputChange('plus_tank_volume', value)} data-id="hn1nx5l7p" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="595a8w7e2" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="super_tank_volume" data-id="rdnuw40qp" data-path="src/pages/Delivery/DeliveryForm.tsx">Super Tank Volume (Gallons)</Label>
                <NumberInput
                  id="super_tank_volume"
                  step="0.01"
                  value={formData.super_tank_volume}
                  onChange={(value) => handleInputChange('super_tank_volume', value)} data-id="85ffhifvy" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivered Amounts */}
        <Card data-id="mp30tpj9l" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="4gpy1a6hv" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle data-id="xw6h17w57" data-path="src/pages/Delivery/DeliveryForm.tsx">Delivery Amounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="g58qqou7s" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="z5m3a1dk3" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <div data-id="fk66ebw4k" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="regular_delivered" data-id="fkoiyikf3" data-path="src/pages/Delivery/DeliveryForm.tsx">Regular Delivered (Gallons)</Label>
                <NumberInput
                  id="regular_delivered"
                  step="0.01"
                  value={formData.regular_delivered}
                  onChange={(value) => handleInputChange('regular_delivered', value)} data-id="vxyqbaikb" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="mjl65njxr" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="plus_delivered" data-id="tyqscjhca" data-path="src/pages/Delivery/DeliveryForm.tsx">Plus Delivered (Gallons)</Label>
                <NumberInput
                  id="plus_delivered"
                  step="0.01"
                  value={formData.plus_delivered}
                  onChange={(value) => handleInputChange('plus_delivered', value)} data-id="g9rw8yyt8" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="r3p1hcarz" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="super_delivered" data-id="dl4jqgr0h" data-path="src/pages/Delivery/DeliveryForm.tsx">Super Delivered (Gallons)</Label>
                <NumberInput
                  id="super_delivered"
                  step="0.01"
                  value={formData.super_delivered}
                  onChange={(value) => handleInputChange('super_delivered', value)} data-id="htytyfg19" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
            </div>
          </CardContent>
        </Card>

        {/* After Delivery Tank Report */}
        <Card data-id="2t2w5uvry" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="2dom57icc" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle data-id="dnnfqiyq8" data-path="src/pages/Delivery/DeliveryForm.tsx">After Delivery Tank Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="wmksflvnl" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="vk0m13sy7" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <div data-id="fj4irpalc" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="regular_tank_final" data-id="bgq6o4amm" data-path="src/pages/Delivery/DeliveryForm.tsx">Regular Tank Final (Gallons)</Label>
                <NumberInput
                  id="regular_tank_final"
                  step="0.01"
                  value={afterDeliveryData.regular_tank_final}
                  onChange={(value) => handleAfterDeliveryChange('regular_tank_final', value)} data-id="8ln60m07e" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="lxvkdfxzf" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="plus_tank_final" data-id="edf6327p0" data-path="src/pages/Delivery/DeliveryForm.tsx">Plus Tank Final (Gallons)</Label>
                <NumberInput
                  id="plus_tank_final"
                  step="0.01"
                  value={afterDeliveryData.plus_tank_final}
                  onChange={(value) => handleAfterDeliveryChange('plus_tank_final', value)} data-id="alo38gtg6" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
              
              <div data-id="zvc6r0mop" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <Label htmlFor="super_tank_final" data-id="fpihlk8oz" data-path="src/pages/Delivery/DeliveryForm.tsx">Super Tank Final (Gallons)</Label>
                <NumberInput
                  id="super_tank_final"
                  step="0.01"
                  value={afterDeliveryData.super_tank_final}
                  onChange={(value) => handleAfterDeliveryChange('super_tank_final', value)} data-id="pl0fp5ikz" data-path="src/pages/Delivery/DeliveryForm.tsx" />

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discrepancy Report */}
        <Card data-id="xiiafec68" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="fq5lemo6w" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle className="flex items-center gap-2" data-id="sa6ek0ww9" data-path="src/pages/Delivery/DeliveryForm.tsx">
              {discrepancyData.has_discrepancy ?
              <AlertTriangle className="h-5 w-5 text-red-500" data-id="qxdx77fn4" data-path="src/pages/Delivery/DeliveryForm.tsx" /> :

              <CheckCircle className="h-5 w-5 text-green-500" data-id="4c89ui7au" data-path="src/pages/Delivery/DeliveryForm.tsx" />
              }
              Discrepancy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="dojkbcuud" data-path="src/pages/Delivery/DeliveryForm.tsx">
            {discrepancyData.has_discrepancy &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" data-id="3u2ricbx7" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <div className="flex items-center gap-2 mb-2" data-id="otq7cfyud" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  <XCircle className="h-4 w-4 text-red-500" data-id="v6dk3omyt" data-path="src/pages/Delivery/DeliveryForm.tsx" />
                  <span className="font-medium text-red-800" data-id="yh1es487h" data-path="src/pages/Delivery/DeliveryForm.tsx">Discrepancies Detected</span>
                </div>
                <p className="text-red-700 text-sm" data-id="h5npba40b" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  One or more tank levels show discrepancies greater than 5 gallons. Please review and verify the measurements.
                </p>
              </div>
            }
            
            {!discrepancyData.has_discrepancy && (afterDeliveryData.regular_tank_final > 0 || afterDeliveryData.plus_tank_final > 0 || afterDeliveryData.super_tank_final > 0) &&
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4" data-id="cjab8442c" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <div className="flex items-center gap-2 mb-2" data-id="8m8b3hk9o" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  <CheckCircle className="h-4 w-4 text-green-500" data-id="fxna4rdwe" data-path="src/pages/Delivery/DeliveryForm.tsx" />
                  <span className="font-medium text-green-800" data-id="72njc03sn" data-path="src/pages/Delivery/DeliveryForm.tsx">All Measurements Verified</span>
                </div>
                <p className="text-green-700 text-sm" data-id="59p9671fx" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  Tank levels are within acceptable tolerance limits (±5 gallons).
                </p>
              </div>
            }
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="w4j2x80fh" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <div data-id="k6ldqsoxl" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <h4 className="font-medium text-gray-700 mb-2" data-id="j6yyznhfy" data-path="src/pages/Delivery/DeliveryForm.tsx">Regular Gas</h4>
                <div className="space-y-1 text-sm" data-id="9uytim88z" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  <div className="flex justify-between" data-id="ugmo6xxpm" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="5zkw9dxub" data-path="src/pages/Delivery/DeliveryForm.tsx">Before + Delivered:</span>
                    <span data-id="s0bnjbv98" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.regular_expected.toFixed(2)} gal</span>
                  </div>
                  <div className="flex justify-between" data-id="qhx81fxr1" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="o2l6a22oq" data-path="src/pages/Delivery/DeliveryForm.tsx">After Delivery:</span>
                    <span data-id="1yc3msjx9" data-path="src/pages/Delivery/DeliveryForm.tsx">{afterDeliveryData.regular_tank_final.toFixed(2)} gal</span>
                  </div>
                  <div className={`flex justify-between font-medium ${
                  Math.abs(discrepancyData.regular_discrepancy) > 5 ? 'text-red-600' : 'text-green-600'}`
                  } data-id="qm2pgtzg0" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="0weux64ns" data-path="src/pages/Delivery/DeliveryForm.tsx">Difference:</span>
                    <span data-id="nkuyvt2hs" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.regular_discrepancy >= 0 ? '+' : ''}{discrepancyData.regular_discrepancy.toFixed(2)} gal</span>
                  </div>
                </div>
              </div>
              
              <div data-id="iract17bu" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <h4 className="font-medium text-gray-700 mb-2" data-id="ctal6jpxy" data-path="src/pages/Delivery/DeliveryForm.tsx">Plus Gas</h4>
                <div className="space-y-1 text-sm" data-id="dkyp2xiih" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  <div className="flex justify-between" data-id="gqbzb2gtg" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="6z5rcx5jl" data-path="src/pages/Delivery/DeliveryForm.tsx">Before + Delivered:</span>
                    <span data-id="qi7wt0yb7" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.plus_expected.toFixed(2)} gal</span>
                  </div>
                  <div className="flex justify-between" data-id="uavwum8ya" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="gov5iwnix" data-path="src/pages/Delivery/DeliveryForm.tsx">After Delivery:</span>
                    <span data-id="uk8axkosf" data-path="src/pages/Delivery/DeliveryForm.tsx">{afterDeliveryData.plus_tank_final.toFixed(2)} gal</span>
                  </div>
                  <div className={`flex justify-between font-medium ${
                  Math.abs(discrepancyData.plus_discrepancy) > 5 ? 'text-red-600' : 'text-green-600'}`
                  } data-id="f2lkhi9h9" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="wq93r8lu8" data-path="src/pages/Delivery/DeliveryForm.tsx">Difference:</span>
                    <span data-id="9zczfwrym" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.plus_discrepancy >= 0 ? '+' : ''}{discrepancyData.plus_discrepancy.toFixed(2)} gal</span>
                  </div>
                </div>
              </div>
              
              <div data-id="dy2nutplb" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <h4 className="font-medium text-gray-700 mb-2" data-id="2db450zsy" data-path="src/pages/Delivery/DeliveryForm.tsx">Super Gas</h4>
                <div className="space-y-1 text-sm" data-id="2jpx59jr8" data-path="src/pages/Delivery/DeliveryForm.tsx">
                  <div className="flex justify-between" data-id="hl2sabzbg" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="dga9xjobo" data-path="src/pages/Delivery/DeliveryForm.tsx">Before + Delivered:</span>
                    <span data-id="36xtg8ang" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.super_expected.toFixed(2)} gal</span>
                  </div>
                  <div className="flex justify-between" data-id="lga78czeg" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="fgqpdsomk" data-path="src/pages/Delivery/DeliveryForm.tsx">After Delivery:</span>
                    <span data-id="0jqznt5ua" data-path="src/pages/Delivery/DeliveryForm.tsx">{afterDeliveryData.super_tank_final.toFixed(2)} gal</span>
                  </div>
                  <div className={`flex justify-between font-medium ${
                  Math.abs(discrepancyData.super_discrepancy) > 5 ? 'text-red-600' : 'text-green-600'}`
                  } data-id="h88rfyrax" data-path="src/pages/Delivery/DeliveryForm.tsx">
                    <span data-id="53exz4vvn" data-path="src/pages/Delivery/DeliveryForm.tsx">Difference:</span>
                    <span data-id="ren3bnvn7" data-path="src/pages/Delivery/DeliveryForm.tsx">{discrepancyData.super_discrepancy >= 0 ? '+' : ''}{discrepancyData.super_discrepancy.toFixed(2)} gal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3" data-id="l0zwex5dh" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <p className="text-sm text-gray-600" data-id="f2oric7r7" data-path="src/pages/Delivery/DeliveryForm.tsx">
                <strong data-id="qd9rtx5w1" data-path="src/pages/Delivery/DeliveryForm.tsx">Note:</strong> Acceptable tolerance is ±5 gallons. Differences outside this range should be investigated and documented.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card data-id="1ek6h4brb" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <CardHeader data-id="xm00rjrzk" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <CardTitle data-id="ikbkkxyaj" data-path="src/pages/Delivery/DeliveryForm.tsx">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent data-id="lrjgpng6d" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <div data-id="5yjifyhh2" data-path="src/pages/Delivery/DeliveryForm.tsx">
              <Label htmlFor="delivery_notes" data-id="5a764weme" data-path="src/pages/Delivery/DeliveryForm.tsx">Delivery Notes</Label>
              <Textarea
                id="delivery_notes"
                value={formData.delivery_notes}
                onChange={(e) => handleInputChange('delivery_notes', e.target.value)}
                placeholder="Enter any additional notes about the delivery..."
                rows={3} data-id="wbdbppkor" data-path="src/pages/Delivery/DeliveryForm.tsx" />

            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4" data-id="mqle8lu1y" data-path="src/pages/Delivery/DeliveryForm.tsx">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/delivery')} data-id="xhps5us75" data-path="src/pages/Delivery/DeliveryForm.tsx">

            Cancel
          </Button>
          <Button type="submit" disabled={loading} data-id="sbzo96lrw" data-path="src/pages/Delivery/DeliveryForm.tsx">
            <Save className="mr-2 h-4 w-4" data-id="wukcr18wa" data-path="src/pages/Delivery/DeliveryForm.tsx" />
            {loading ? 'Saving...' : 'Save Delivery Record'}
          </Button>
        </div>
      </form>
    </div>);

};

export default DeliveryForm;