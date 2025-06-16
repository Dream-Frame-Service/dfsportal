import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface CashCollectionSectionProps {
  values: {
    cashCollectionOnHand: number;
    totalCashFromSales: number; // Calculated from cash sales
    totalCashFromExpenses: number; // Calculated from cash expenses
  };
  onChange: (field: string, value: number) => void;
}

const CashCollectionSection: React.FC<CashCollectionSectionProps> = ({
  values,
  onChange
}) => {
  // Auto-calculate short/over: Cash on hand - (Total cash sales - Cash expenses)
  const expectedCash = values.totalCashFromSales - values.totalCashFromExpenses;
  const shortOver = values.cashCollectionOnHand - expectedCash;
  const isShort = shortOver < 0;
  const isOver = shortOver > 0;

  return (
    <Card className="bg-gray-50 border-gray-200" data-id="b8zsgc17l" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
      <CardHeader data-id="02w8t5auq" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
        <CardTitle className="text-gray-800 flex items-center space-x-2" data-id="hhqvcw364" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
          <DollarSign className="w-5 h-5" data-id="xd3g6tv50" data-path="src/components/SalesReportSections/CashCollectionSection.tsx" />
          <span data-id="iae9et2kd" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Cash Collection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="q8y6trpde" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="gohpm80qi" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
          <div className="space-y-2" data-id="iekcjvesy" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
            <Label htmlFor="cashOnHand" data-id="wq4t4tfd4" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Cash Collection on Hand ($) *</Label>
            <NumberInput
              id="cashOnHand"
              value={values.cashCollectionOnHand}
              onChange={(value) => onChange('cashCollectionOnHand', value || 0)}
              min={0}
              step={0.01}
              required data-id="56xnb4q1a" data-path="src/components/SalesReportSections/CashCollectionSection.tsx" />

            <div className="text-xs text-gray-600" data-id="af8w7pm07" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              Physical cash counted at end of shift
            </div>
          </div>
          
          <div className="space-y-2" data-id="9kcg690fi" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
            <Label data-id="jzbejnd0v" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Expected Cash ($)</Label>
            <div className="h-10 px-3 py-2 border border-gray-200 rounded-md bg-gray-100 flex items-center" data-id="kamq1z5k9" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span className="text-gray-700 font-medium" data-id="3hqtt6enp" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">${expectedCash.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-600" data-id="6dhtfxg7m" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              Cash sales - Cash expenses
            </div>
          </div>
          
          <div className="space-y-2" data-id="azrus5mli" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
            <Label data-id="ufx835pcj" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Total (+/-) Short/Over</Label>
            <div className="h-10 px-3 py-2 border rounded-md flex items-center justify-between bg-white" data-id="iyxho6guo" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span className={`font-bold text-lg ${
              isShort ? 'text-red-600' : isOver ? 'text-green-600' : 'text-gray-700'}`
              } data-id="c96gox6fv" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
                ${Math.abs(shortOver).toFixed(2)}
              </span>
              {isShort && <TrendingDown className="w-5 h-5 text-red-600" data-id="gdth30qoo" data-path="src/components/SalesReportSections/CashCollectionSection.tsx" />}
              {isOver && <TrendingUp className="w-5 h-5 text-green-600" data-id="72chsswmc" data-path="src/components/SalesReportSections/CashCollectionSection.tsx" />}
            </div>
            <div className="flex items-center space-x-1" data-id="dsc0xmsym" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              {isShort &&
              <Badge variant="destructive" className="text-xs" data-id="24vmulrxa" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
                  Short
                </Badge>
              }
              {isOver &&
              <Badge className="bg-green-100 text-green-800 text-xs" data-id="9weqlvere" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
                  Over
                </Badge>
              }
              {!isShort && !isOver &&
              <Badge variant="outline" className="text-xs" data-id="mo372y04t" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
                  Exact
                </Badge>
              }
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 bg-blue-50 rounded-lg p-4" data-id="ympokidez" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
          <div className="text-sm text-blue-800 space-y-2" data-id="pbb2nttqe" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
            <div className="flex justify-between" data-id="b0vzcouye" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span data-id="ylpybcqdv" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Cash Sales:</span>
              <span className="font-medium" data-id="qakitw5qn" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">${values.totalCashFromSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" data-id="r3j32iex8" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span data-id="uvpqcnil2" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Cash Expenses:</span>
              <span className="font-medium" data-id="qs3dz0wzm" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">-${values.totalCashFromExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2 font-semibold" data-id="rlbrp814k" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span data-id="byi0b7jzg" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Expected Cash:</span>
              <span data-id="6df1hrwj0" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">${expectedCash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" data-id="v9190wohq" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span data-id="vi7rxiek8" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Actual Cash on Hand:</span>
              <span className="font-medium" data-id="g1y326ojh" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">${values.cashCollectionOnHand.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between border-t border-blue-200 pt-2 font-bold ${
            isShort ? 'text-red-600' : isOver ? 'text-green-600' : 'text-blue-800'}`
            } data-id="htux0asjd" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">
              <span data-id="8wwbazsn7" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">Difference:</span>
              <span data-id="09n355m2s" data-path="src/components/SalesReportSections/CashCollectionSection.tsx">{isShort ? '-' : '+'}${Math.abs(shortOver).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default CashCollectionSection;
