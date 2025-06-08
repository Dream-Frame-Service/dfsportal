import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Ticket } from 'lucide-react';

interface LotterySalesSectionProps {
  values: {
    lotteryNetSales: number;
    scratchOffSales: number;
  };
  onChange: (field: string, value: number) => void;
}

const LotterySalesSection: React.FC<LotterySalesSectionProps> = ({
  values,
  onChange
}) => {
  const totalLotteryCash = values.lotteryNetSales + values.scratchOffSales;

  return (
    <Card className="bg-yellow-50 border-yellow-200" data-id="md0s2nm2h" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
      <CardHeader data-id="rrnmqui74" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
        <CardTitle className="text-yellow-800 flex items-center space-x-2" data-id="un5p0qj6t" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
          <Ticket className="w-5 h-5" data-id="evpwd8u2a" data-path="src/components/SalesReportSections/LotterySalesSection.tsx" />
          <span data-id="d4drohryy" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">NY Lottery Sales</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="rwmoopcet" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="ku24slxcz" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
          <div className="space-y-2" data-id="3fxu82yz5" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
            <Label htmlFor="lotteryNet" data-id="oycl6vj6e" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">Net Sales ($) *</Label>
            <NumberInput
              id="lotteryNet"
              value={values.lotteryNetSales}
              onChange={(value) => onChange('lotteryNetSales', value || 0)}
              min={0}
              step={0.01}
              required data-id="krk3kmmwz" data-path="src/components/SalesReportSections/LotterySalesSection.tsx" />

          </div>
          <div className="space-y-2" data-id="bg9viufpm" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
            <Label htmlFor="scratchOff" data-id="wccdzh8el" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">Scratch Off Sales ($) *</Label>
            <NumberInput
              id="scratchOff"
              value={values.scratchOffSales}
              onChange={(value) => onChange('scratchOffSales', value || 0)}
              min={0}
              step={0.01}
              required data-id="sipyopeo2" data-path="src/components/SalesReportSections/LotterySalesSection.tsx" />

          </div>
        </div>
        
        <div className="pt-4 border-t border-yellow-200" data-id="bbmw5hzjd" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
          <div className="flex items-center justify-between" data-id="2i1945lo8" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
            <Label className="text-lg font-semibold" data-id="ob0z8k2ai" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">Total Sales Cash (Auto-calculated)</Label>
            <div className="text-2xl font-bold text-yellow-800" data-id="mvab1n4d7" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">${totalLotteryCash.toFixed(2)}</div>
          </div>
          <div className="text-sm text-gray-600 mt-1" data-id="6zp1re2ek" data-path="src/components/SalesReportSections/LotterySalesSection.tsx">
            Net Sales + Scratch Off = ${totalLotteryCash.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default LotterySalesSection;