import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Gauge } from 'lucide-react';

interface GasTankReportSectionProps {
  values: {
    regularGallons: number;
    superGallons: number;
    dieselGallons: number;
  };
  onChange: (field: string, value: number) => void;
}

const GasTankReportSection: React.FC<GasTankReportSectionProps> = ({
  values,
  onChange
}) => {
  const totalGallons = values.regularGallons + values.superGallons + values.dieselGallons;

  return (
    <Card className="bg-red-50 border-red-200" data-id="puq5bgwl9" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
      <CardHeader data-id="gqed43qpz" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
        <CardTitle className="text-red-800 flex items-center space-x-2" data-id="qat72qfwp" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
          <Gauge className="w-5 h-5" data-id="oqlmw5tzc" data-path="src/components/SalesReportSections/GasTankReportSection.tsx" />
          <span data-id="tceex993p" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">Gas Tank Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="diljp6f7l" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="2cyfwq3wm" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
          <div className="space-y-2" data-id="od5pc9akg" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
            <Label htmlFor="regular" data-id="lc987qu7n" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">Regular (Gallons) *</Label>
            <NumberInput
              id="regular"
              value={values.regularGallons}
              onChange={(value) => onChange('regularGallons', value || 0)}
              min={0}
              step={0.01}
              required data-id="u6tif438z" data-path="src/components/SalesReportSections/GasTankReportSection.tsx" />

          </div>
          <div className="space-y-2" data-id="k3rap7fq7" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
            <Label htmlFor="super" data-id="fygnqnwil" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">Super (Gallons) *</Label>
            <NumberInput
              id="super"
              value={values.superGallons}
              onChange={(value) => onChange('superGallons', value || 0)}
              min={0}
              step={0.01}
              required data-id="fjp8n70ad" data-path="src/components/SalesReportSections/GasTankReportSection.tsx" />

          </div>
          <div className="space-y-2" data-id="c7tgyaffh" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
            <Label htmlFor="diesel" data-id="gl01iiaml" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">Diesel (Gallons) *</Label>
            <NumberInput
              id="diesel"
              value={values.dieselGallons}
              onChange={(value) => onChange('dieselGallons', value || 0)}
              min={0}
              step={0.01}
              required data-id="pt98u4vwk" data-path="src/components/SalesReportSections/GasTankReportSection.tsx" />

          </div>
        </div>
        
        <div className="pt-4 border-t border-red-200" data-id="lxwfw7ile" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
          <div className="flex items-center justify-between" data-id="rkxbkowzr" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
            <Label className="text-lg font-semibold" data-id="ov1wi7ykc" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">Total Gallons Sold (Auto-calculated)</Label>
            <div className="text-2xl font-bold text-red-800" data-id="ek6hf9mxg" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">{totalGallons.toFixed(2)} gal</div>
          </div>
          <div className="text-sm text-gray-600 mt-1" data-id="8vl0ixxvy" data-path="src/components/SalesReportSections/GasTankReportSection.tsx">
            Regular + Super + Diesel = {totalGallons.toFixed(2)} gallons
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default GasTankReportSection;
