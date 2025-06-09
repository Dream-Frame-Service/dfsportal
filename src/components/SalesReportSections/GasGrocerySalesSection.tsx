import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Fuel, ShoppingCart } from 'lucide-react';

interface GasGrocerySalesSectionProps {
  station: string;
  values: {
    creditCardAmount: number;
    debitCardAmount: number;
    mobileAmount: number;
    cashAmount: number;
    grocerySales: number;
    ebtSales?: number; // Only for MOBIL
    // Separate grocery breakdown fields (MOBIL only) - completely independent from main section
    groceryCashSales?: number;
    groceryCreditDebitSales?: number;
  };
  onChange: (field: string, value: number) => void;
}

const GasGrocerySalesSection: React.FC<GasGrocerySalesSectionProps> = ({
  station,
  values,
  onChange
}) => {
  const isMobil = station === 'MOBIL';
  const totalSales = values.creditCardAmount + values.debitCardAmount + values.mobileAmount + values.cashAmount + values.grocerySales;

  return (
    <div className="space-y-6" data-id="diai4nlv0" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
      {/* Gas &amp; Grocery Sales Section */}
      <Card className="bg-blue-50 border-blue-200" data-id="xl0j83sgl" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
        <CardHeader data-id="73mseup0u" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
          <CardTitle className="text-blue-800 flex items-center space-x-2" data-id="83t5xflpy" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
            <Fuel className="w-5 h-5" data-id="nltvye4g1" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />
            <span data-id="l9l0a6256" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Gas &amp; Grocery Sales</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-id="mul7bdst7" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="2dzkiqrob" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
            <div className="space-y-2" data-id="rl37ip09o" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label htmlFor="creditCard" data-id="cs9oarj8q" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Credit Card Amount ($) *</Label>
              <NumberInput
                id="creditCard"
                value={values.creditCardAmount}
                onChange={(value) => onChange('creditCardAmount', value || 0)}
                min={0}
                step={0.01}
                required data-id="id7oxqbna" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

            </div>
            <div className="space-y-2" data-id="28w1eo7oe" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label htmlFor="debitCard" data-id="3mdnam8zt" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Debit Card Amount ($) *</Label>
              <NumberInput
                id="debitCard"
                value={values.debitCardAmount}
                onChange={(value) => onChange('debitCardAmount', value || 0)}
                min={0}
                step={0.01}
                required data-id="s5kq5937e" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

            </div>
            <div className="space-y-2" data-id="7sz0hhfkf" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label htmlFor="mobile" data-id="5pe3lezuv" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Mobile Payment Amount ($) *</Label>
              <NumberInput
                id="mobile"
                value={values.mobileAmount}
                onChange={(value) => onChange('mobileAmount', value || 0)}
                min={0}
                step={0.01}
                required data-id="jah41v0h8" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

            </div>
            <div className="space-y-2" data-id="nc6hio325" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label htmlFor="cash" data-id="kmm0g0q66" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Cash Amount ($) *</Label>
              <NumberInput
                id="cash"
                value={values.cashAmount}
                onChange={(value) => onChange('cashAmount', value || 0)}
                min={0}
                step={0.01}
                required data-id="u6m1wq00p" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

            </div>
            <div className="space-y-2" data-id="iokmvbgxb" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label htmlFor="grocery" data-id="r6a83mdew" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Grocery Sales ($) *</Label>
              <NumberInput
                id="grocery"
                value={values.grocerySales}
                onChange={(value) => onChange('grocerySales', value || 0)}
                min={0}
                step={0.01}
                required data-id="0pfy1hl3d" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-200" data-id="odcpj8dfu" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
            <div className="flex items-center justify-between" data-id="kcq6hqjo9" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <Label className="text-lg font-semibold" data-id="z5mkrc2r1" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Total Sales (Auto-calculated)</Label>
              <div className="text-2xl font-bold text-blue-800" data-id="nm5p9ebr0" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">${totalSales.toFixed(2)}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1" data-id="n6kzq86zq" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              Credit + Debit + Mobile + Cash + Grocery = ${totalSales.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grocery Sales Section (MOBIL only) */}
      {isMobil &&
      <Card className="bg-green-50 border-green-200" data-id="af1hgre6e" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
          <CardHeader data-id="ngs2alqqt" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
            <CardTitle className="text-green-800 flex items-center space-x-2" data-id="9bt5ed51f" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <ShoppingCart className="w-5 h-5" data-id="yy2ls5h14" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />
              <span data-id="olkvhqykl" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Grocery Sales Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="5nu41vjfk" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="v77tpkd6n" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <div className="space-y-2" data-id="aqi4b36xo" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
                <Label htmlFor="groceryCash" data-id="cn75xmcuu" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Cash Sales ($) *</Label>
                <NumberInput
                id="groceryCash"
                value={values.groceryCashSales || 0}
                onChange={(value) => onChange('groceryCashSales', value || 0)}
                min={0}
                step={0.01}
                required data-id="ft2eat9ur" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

              </div>
              <div className="space-y-2" data-id="3cdjltecn" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
                <Label htmlFor="groceryCreditDebit" data-id="8i1k82e60" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Credit/Debit Card ($) *</Label>
                <NumberInput
                id="groceryCreditDebit"
                value={values.groceryCreditDebitSales || 0}
                onChange={(value) => onChange('groceryCreditDebitSales', value || 0)}
                min={0}
                step={0.01}
                required data-id="y1ke7r6fz" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

              </div>
              <div className="space-y-2" data-id="3xwu01mhr" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
                <Label htmlFor="ebt" data-id="19centwhu" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">EBT ($) *</Label>
                <NumberInput
                id="ebt"
                value={values.ebtSales || 0}
                onChange={(value) => onChange('ebtSales', value || 0)}
                min={0}
                step={0.01}
                required data-id="ppzkvble8" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx" />

              </div>
            </div>
            
            <div className="pt-4 border-t border-green-200" data-id="eqnvuqd8n" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
              <div className="flex items-center justify-between" data-id="tk4k9upj6" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
                <Label className="text-lg font-semibold" data-id="m0gi6t14t" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">Total Grocery Sales</Label>
                <div className="text-2xl font-bold text-green-800" data-id="rhlvg4yh8" data-path="src/components/SalesReportSections/GasGrocerySalesSection.tsx">
                  ${((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Grocery Cash + Credit/Debit + EBT = ${((values.groceryCashSales || 0) + (values.groceryCreditDebitSales || 0) + (values.ebtSales || 0)).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default GasGrocerySalesSection;