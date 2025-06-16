import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fuel, ShoppingCart, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SalesData {
  ID: number;
  station: string;
  report_date: string;
  total_sales: number;
  grocery_sales: number;
  cash_collection_on_hand: number;
  regular_gallons: number;
  super_gallons: number;
  diesel_gallons: number;
  lottery_net_sales: number;
  employee_name: string;
  shift: string;
}

interface StationSalesData {
  station: string;
  totalSales: number;
  fuelSales: number;
  grocerySales: number;
  lotterySales: number;
  totalGallons: number;
  cashOnHand: number;
  lastUpdated: string;
  employeeName: string;
  shift: string;
  reportCount: number;
}

const STATIONS = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

const StationSalesBoxes: React.FC = () => {
  const [salesData, setSalesData] = useState<StationSalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSalesData = async () => {
    try {
      setError(null);

      // Get today's date for filtering
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Fetch recent sales reports from the enhanced table using Supabase
      const { data: reports, error: apiError } = await supabase
        .from('daily_sales_reports_enhanced')
        .select('*')
        .gte('report_date', todayStr)
        .order('report_date', { ascending: false })
        .limit(50);

      if (apiError) throw new Error(apiError.message);

      // Process data by station
      const stationData: StationSalesData[] = STATIONS.map((station) => {
        const stationReports = reports?.filter((report: SalesData) =>
          report.station === station
        ) || [];

        const totalSales = stationReports.reduce((sum: number, report: SalesData) =>
        sum + (report.total_sales || 0), 0
        );

        const grocerySales = stationReports.reduce((sum: number, report: SalesData) =>
        sum + (report.grocery_sales || 0), 0
        );

        const lotterySales = stationReports.reduce((sum: number, report: SalesData) =>
        sum + (report.lottery_net_sales || 0), 0
        );

        const totalGallons = stationReports.reduce((sum: number, report: SalesData) =>
        sum + (report.regular_gallons || 0) + (report.super_gallons || 0) + (report.diesel_gallons || 0), 0
        );

        const cashOnHand = stationReports.reduce((sum: number, report: SalesData) =>
        sum + (report.cash_collection_on_hand || 0), 0
        );

        // Calculate fuel sales - for MOBIL station exclude grocery sales from calculation
        // For MOBIL: fuel sales = total - lottery (gas sales are included in total)
        // For AMOCO stations: fuel sales = total - grocery - lottery (current logic)
        const fuelSales = station === 'MOBIL' 
          ? totalSales - lotterySales 
          : totalSales - grocerySales - lotterySales;

        const latestReport = stationReports[0];

        return {
          station,
          totalSales,
          fuelSales: Math.max(0, fuelSales),
          grocerySales,
          lotterySales,
          totalGallons,
          cashOnHand,
          lastUpdated: latestReport?.report_date || '',
          employeeName: latestReport?.employee_name || 'N/A',
          shift: latestReport?.shift || 'N/A',
          reportCount: stationReports.length
        };
      });

      setSalesData(stationData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError(error as string);
      toast({
        title: "Error",
        description: "Failed to fetch sales data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSalesData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStationColor = (station: string) => {
    switch (station) {
      case 'MOBIL':
        return 'blue';
      case 'AMOCO ROSEDALE':
        return 'green';
      case 'AMOCO BROOKLYN':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'No data';

    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="emjl65s0h" data-path="src/components/StationSalesBoxes.tsx">
        {STATIONS.map((station) =>
        <Card key={station} className="p-6" data-id="aian4b9xe" data-path="src/components/StationSalesBoxes.tsx">
            <div className="animate-pulse" data-id="2znq7mxan" data-path="src/components/StationSalesBoxes.tsx">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" data-id="askdsk342" data-path="src/components/StationSalesBoxes.tsx"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" data-id="f7cwxjh4b" data-path="src/components/StationSalesBoxes.tsx"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3" data-id="yehupl018" data-path="src/components/StationSalesBoxes.tsx"></div>
            </div>
          </Card>
        )}
      </div>);

  }

  return (
    <div className="space-y-4" data-id="pjas796s3" data-path="src/components/StationSalesBoxes.tsx">
      <div className="flex items-center justify-between" data-id="uokwputj7" data-path="src/components/StationSalesBoxes.tsx">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-id="kbcvg21kp" data-path="src/components/StationSalesBoxes.tsx">
          <TrendingUp className="w-6 h-6 text-blue-600" data-id="knwtysqbu" data-path="src/components/StationSalesBoxes.tsx" />
          Real-time Station Sales
        </h2>
        <div className="flex items-center gap-2" data-id="31dbvyh73" data-path="src/components/StationSalesBoxes.tsx">
          <Badge variant="outline" className="text-green-600 border-green-200" data-id="wil15g9qd" data-path="src/components/StationSalesBoxes.tsx">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" data-id="tilf1wdu8" data-path="src/components/StationSalesBoxes.tsx"></div>
            Live Data
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSalesData}
            disabled={loading} data-id="x87rih3dg" data-path="src/components/StationSalesBoxes.tsx">

            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="cgzeyyui5" data-path="src/components/StationSalesBoxes.tsx">
        {salesData.map((data) => {
          const color = getStationColor(data.station);
          const hasData = data.reportCount > 0;

          return (
            <Card
              key={data.station}
              className={`p-6 transition-all duration-300 hover:shadow-lg border-l-4 ${
              color === 'blue' ? 'border-l-blue-500 bg-blue-50/30' :
              color === 'green' ? 'border-l-green-500 bg-green-50/30' :
              'border-l-purple-500 bg-purple-50/30'}`
              } data-id="sw8zno4fv" data-path="src/components/StationSalesBoxes.tsx">

              {/* Station Header */}
              <div className="flex items-center justify-between mb-4" data-id="xfg3enbtd" data-path="src/components/StationSalesBoxes.tsx">
                <div data-id="i0q76tls7" data-path="src/components/StationSalesBoxes.tsx">
                  <h3 className="text-lg font-bold text-gray-900" data-id="ie7p5wap9" data-path="src/components/StationSalesBoxes.tsx">{data.station}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600" data-id="au06qscgi" data-path="src/components/StationSalesBoxes.tsx">
                    <Clock className="w-3 h-3" data-id="mnk8f079p" data-path="src/components/StationSalesBoxes.tsx" />
                    <span data-id="4zamfxwbq" data-path="src/components/StationSalesBoxes.tsx">Updated: {formatTime(data.lastUpdated)}</span>
                  </div>
                </div>
                <Badge
                  variant={hasData ? "default" : "secondary"}
                  className={
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                  } data-id="08mawhf8i" data-path="src/components/StationSalesBoxes.tsx">

                  {data.reportCount} Reports
                </Badge>
              </div>

              {!hasData ?
              <div className="text-center py-8" data-id="unq3jgivn" data-path="src/components/StationSalesBoxes.tsx">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" data-id="avwqds0ue" data-path="src/components/StationSalesBoxes.tsx" />
                  <p className="text-gray-500 font-medium" data-id="dg152vicd" data-path="src/components/StationSalesBoxes.tsx">No sales data today</p>
                  <p className="text-sm text-gray-400" data-id="ziq04pq37" data-path="src/components/StationSalesBoxes.tsx">Reports will appear here once created</p>
                </div> :

              <>
                  {/* Total Sales */}
                  <div className="mb-6" data-id="2f983120w" data-path="src/components/StationSalesBoxes.tsx">
                    <div className="flex items-center justify-between" data-id="h8gg99ydo" data-path="src/components/StationSalesBoxes.tsx">
                      <div className="flex items-center gap-2" data-id="ovbjoqkp8" data-path="src/components/StationSalesBoxes.tsx">
                        <DollarSign className={`w-5 h-5 ${
                      color === 'blue' ? 'text-blue-600' :
                      color === 'green' ? 'text-green-600' :
                      'text-purple-600'}`
                      } data-id="nhi1dmbfv" data-path="src/components/StationSalesBoxes.tsx" />
                        <span className="text-sm font-medium text-gray-600" data-id="p44ibbu1x" data-path="src/components/StationSalesBoxes.tsx">Total Sales</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900" data-id="bsxadnv7l" data-path="src/components/StationSalesBoxes.tsx">
                        {formatCurrency(data.totalSales)}
                      </span>
                    </div>
                  </div>

                  {/* Sales Breakdown */}
                  <div className="space-y-3 mb-6" data-id="9mykw3pl1" data-path="src/components/StationSalesBoxes.tsx">
                    <div className="flex items-center justify-between" data-id="fy42h66t4" data-path="src/components/StationSalesBoxes.tsx">
                      <div className="flex items-center gap-2" data-id="c2oiuzwh2" data-path="src/components/StationSalesBoxes.tsx">
                        <Fuel className="w-4 h-4 text-blue-500" data-id="qt6cqv7gz" data-path="src/components/StationSalesBoxes.tsx" />
                        <span className="text-sm text-gray-600" data-id="d4iatka4g" data-path="src/components/StationSalesBoxes.tsx">Fuel Sales</span>
                      </div>
                      <span className="font-medium" data-id="r73eeaq76" data-path="src/components/StationSalesBoxes.tsx">{formatCurrency(data.fuelSales)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between" data-id="gla3n7gdq" data-path="src/components/StationSalesBoxes.tsx">
                      <div className="flex items-center gap-2" data-id="z54ciufzv" data-path="src/components/StationSalesBoxes.tsx">
                        <ShoppingCart className="w-4 h-4 text-green-500" data-id="rfzbtlnqd" data-path="src/components/StationSalesBoxes.tsx" />
                        <span className="text-sm text-gray-600" data-id="wm8z085kn" data-path="src/components/StationSalesBoxes.tsx">Grocery Sales</span>
                      </div>
                      <span className="font-medium" data-id="1nsqugbyp" data-path="src/components/StationSalesBoxes.tsx">{formatCurrency(data.grocerySales)}</span>
                    </div>

                    {data.lotterySales > 0 &&
                  <div className="flex items-center justify-between" data-id="t0a5vtqkt" data-path="src/components/StationSalesBoxes.tsx">
                        <div className="flex items-center gap-2" data-id="zlkx61ilr" data-path="src/components/StationSalesBoxes.tsx">
                          <div className="w-4 h-4 bg-yellow-500 rounded text-white text-xs flex items-center justify-center" data-id="uwqiwfe23" data-path="src/components/StationSalesBoxes.tsx">
                            🎫
                          </div>
                          <span className="text-sm text-gray-600" data-id="fqaimerq8" data-path="src/components/StationSalesBoxes.tsx">Lottery Sales</span>
                        </div>
                        <span className="font-medium" data-id="aj5479so5" data-path="src/components/StationSalesBoxes.tsx">{formatCurrency(data.lotterySales)}</span>
                      </div>
                  }
                  </div>

                  {/* Additional Metrics */}
                  <div className="border-t pt-4 space-y-2" data-id="5j7nlh9an" data-path="src/components/StationSalesBoxes.tsx">
                    <div className="flex justify-between text-sm" data-id="uh2yksonc" data-path="src/components/StationSalesBoxes.tsx">
                      <span className="text-gray-600" data-id="z02jvxg43" data-path="src/components/StationSalesBoxes.tsx">Fuel Gallons:</span>
                      <span className="font-medium" data-id="swfj7pfh6" data-path="src/components/StationSalesBoxes.tsx">{data.totalGallons.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm" data-id="japef1qlx" data-path="src/components/StationSalesBoxes.tsx">
                      <span className="text-gray-600" data-id="ax55h4bb2" data-path="src/components/StationSalesBoxes.tsx">Cash on Hand:</span>
                      <span className="font-medium" data-id="t278o46ku" data-path="src/components/StationSalesBoxes.tsx">{formatCurrency(data.cashOnHand)}</span>
                    </div>
                    <div className="flex justify-between text-sm" data-id="789m6e8f1" data-path="src/components/StationSalesBoxes.tsx">
                      <span className="text-gray-600" data-id="9xsxk3fu5" data-path="src/components/StationSalesBoxes.tsx">Current Staff:</span>
                      <span className="font-medium" data-id="quoqe4v8q" data-path="src/components/StationSalesBoxes.tsx">{data.employeeName} ({data.shift})</span>
                    </div>
                  </div>
                </>
              }
            </Card>);

        })}
      </div>

      {error &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-id="3nmns792w" data-path="src/components/StationSalesBoxes.tsx">
          <div className="flex items-center gap-2 text-red-800" data-id="qhjj1f0ub" data-path="src/components/StationSalesBoxes.tsx">
            <AlertCircle className="w-5 h-5" data-id="a9cxc77ze" data-path="src/components/StationSalesBoxes.tsx" />
            <span className="font-medium" data-id="nrj5krcbi" data-path="src/components/StationSalesBoxes.tsx">Error loading sales data</span>
          </div>
          <p className="text-red-600 text-sm mt-1" data-id="xhdbxns7q" data-path="src/components/StationSalesBoxes.tsx">{error}</p>
        </div>
      }
    </div>);

};

export default StationSalesBoxes;
