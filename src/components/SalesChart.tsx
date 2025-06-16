import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarDays, TrendingUp, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ⚠️ IMPORTANT: This component implements MOBIL-specific sales calculation
// For MOBIL station: fuel_sales = total_sales - lottery_sales (gas included in total)
// For AMOCO stations: fuel_sales = total_sales - grocery_sales - lottery_sales (existing logic)
// This ensures consistency with StationSalesBoxes.tsx calculation

interface SalesData {
  date: string;
  day: string;
  MOBIL_fuel: number;
  MOBIL_convenience: number;
  MOBIL_total: number;
  AMOCO_ROSEDALE_fuel: number;
  AMOCO_ROSEDALE_convenience: number;
  AMOCO_ROSEDALE_total: number;
  AMOCO_BROOKLYN_fuel: number;
  AMOCO_BROOKLYN_convenience: number;
  AMOCO_BROOKLYN_total: number;
  total_all_stations: number;
}

interface StationTotals {
  station: string;
  fuel: number;
  convenience: number;
  total: number;
}

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [stationTotals, setStationTotals] = useState<StationTotals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      console.log('Fetching sales data from:', startDate.toISOString(), 'to:', endDate.toISOString());

      // Fetch sales reports for the last 30 days using Supabase
      const { data: reports, error: apiError } = await supabase
        .from('daily_sales_reports_enhanced')
        .select('*')
        .gte('report_date', startDate.toISOString())
        .order('report_date', { ascending: true })
        .limit(1000);

      if (apiError) throw new Error(apiError.message);

      if (!reports || reports.length === 0) {
        console.log('No sales data found');
        setSalesData([]);
        setStationTotals([]);
        return;
      }
      console.log('Raw sales reports:', reports);

      // Group data by date and station
      const dailyData: {[key: string]: any;} = {};
      const stationSummary: {[key: string]: {fuel: number;convenience: number;total: number;};} = {
        'MOBIL': { fuel: 0, convenience: 0, total: 0 },
        'AMOCO ROSEDALE': { fuel: 0, convenience: 0, total: 0 },
        'AMOCO BROOKLYN': { fuel: 0, convenience: 0, total: 0 }
      };

      // Process each report
      reports.forEach((report: any) => {
        const reportDate = new Date(report.report_date);
        const dateStr = reportDate.toISOString().split('T')[0];
        const dayName = reportDate.toLocaleDateString('en-US', { weekday: 'short' });
        const station = report.station || 'Unknown';

        if (!dailyData[dateStr]) {
          dailyData[dateStr] = {
            date: dateStr,
            day: dayName,
            MOBIL_fuel: 0,
            MOBIL_convenience: 0,
            MOBIL_total: 0,
            AMOCO_ROSEDALE_fuel: 0,
            AMOCO_ROSEDALE_convenience: 0,
            AMOCO_ROSEDALE_total: 0,
            AMOCO_BROOKLYN_fuel: 0,
            AMOCO_BROOKLYN_convenience: 0,
            AMOCO_BROOKLYN_total: 0,
            total_all_stations: 0
          };
        }

        const totalSales = report.total_sales || 0;
        const grocerySales = report.grocery_sales || 0;
        const lotterySales = report.lottery_net_sales || report.lottery_sales || 0;
        
        // Calculate fuel and convenience sales with MOBIL-specific logic
        // For MOBIL: fuel sales = total - lottery (gas sales are included in total)
        // For AMOCO stations: fuel sales = total - grocery - lottery (current logic)
        const fuelSales = station === 'MOBIL' 
          ? Math.max(0, totalSales - lotterySales)
          : Math.max(0, totalSales - grocerySales - lotterySales);
        
        // Convenience sales = grocery sales for all stations
        const convenienceSales = grocerySales;

        // Update daily data based on station
        if (station === 'MOBIL') {
          dailyData[dateStr].MOBIL_fuel += fuelSales;
          dailyData[dateStr].MOBIL_convenience += convenienceSales;
          dailyData[dateStr].MOBIL_total += totalSales;
        } else if (station === 'AMOCO ROSEDALE') {
          dailyData[dateStr].AMOCO_ROSEDALE_fuel += fuelSales;
          dailyData[dateStr].AMOCO_ROSEDALE_convenience += convenienceSales;
          dailyData[dateStr].AMOCO_ROSEDALE_total += totalSales;
        } else if (station === 'AMOCO BROOKLYN') {
          dailyData[dateStr].AMOCO_BROOKLYN_fuel += fuelSales;
          dailyData[dateStr].AMOCO_BROOKLYN_convenience += convenienceSales;
          dailyData[dateStr].AMOCO_BROOKLYN_total += totalSales;
        }

        // Update station totals
        if (stationSummary[station]) {
          stationSummary[station].fuel += fuelSales;
          stationSummary[station].convenience += convenienceSales;
          stationSummary[station].total += totalSales;
        }
      });

      // Calculate total for all stations for each day
      Object.values(dailyData).forEach((day: any) => {
        day.total_all_stations = day.MOBIL_total + day.AMOCO_ROSEDALE_total + day.AMOCO_BROOKLYN_total;
      });

      // Convert to array and sort by date
      const chartData = Object.values(dailyData).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Convert station summary to array
      const stationTotalsArray = Object.entries(stationSummary).map(([station, totals]) => ({
        station,
        ...totals
      }));

      console.log('Processed chart data:', chartData);
      console.log('Station totals:', stationTotalsArray);

      setSalesData(chartData);
      setStationTotals(stationTotalsArray);

    } catch (error) {
      console.error('Error loading sales data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg" data-id="n6ufm8ieu" data-path="src/components/SalesChart.tsx">
          <p className="font-semibold" data-id="hseqrr5er" data-path="src/components/SalesChart.tsx">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) =>
          <p key={index} style={{ color: entry.color }} data-id="vdk1b4oxy" data-path="src/components/SalesChart.tsx">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          )}
        </div>);

    }
    return null;
  };

  const totalSalesAllStations = stationTotals.reduce((sum, station) => sum + station.total, 0);
  const totalFuelSales = stationTotals.reduce((sum, station) => sum + station.fuel, 0);
  const totalConvenienceSales = stationTotals.reduce((sum, station) => sum + station.convenience, 0);

  if (loading) {
    return (
      <Card data-id="csbmnw5vz" data-path="src/components/SalesChart.tsx">
        <CardHeader data-id="ztf7vr94c" data-path="src/components/SalesChart.tsx">
          <CardTitle className="flex items-center gap-2" data-id="gcx7lv3d9" data-path="src/components/SalesChart.tsx">
            <TrendingUp className="w-5 h-5 text-blue-600" data-id="1vuuhsfrf" data-path="src/components/SalesChart.tsx" />
            Sales Analytics - Last 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent data-id="0sec0a3wk" data-path="src/components/SalesChart.tsx">
          <div className="h-80 flex items-center justify-center" data-id="xgy2a8r5w" data-path="src/components/SalesChart.tsx">
            <div className="animate-pulse space-y-4 w-full" data-id="abxds80xt" data-path="src/components/SalesChart.tsx">
              <div className="h-4 bg-gray-200 rounded w-3/4" data-id="j67bbr1a6" data-path="src/components/SalesChart.tsx"></div>
              <div className="h-64 bg-gray-200 rounded" data-id="92yr8hw48" data-path="src/components/SalesChart.tsx"></div>
            </div>
          </div>
        </CardContent>
      </Card>);

  }

  if (error) {
    return (
      <Card data-id="htmb0kyv6" data-path="src/components/SalesChart.tsx">
        <CardHeader data-id="ri0xqwjx3" data-path="src/components/SalesChart.tsx">
          <CardTitle className="flex items-center gap-2" data-id="kcx1rgu9c" data-path="src/components/SalesChart.tsx">
            <TrendingUp className="w-5 h-5 text-red-600" data-id="6y1bynwfy" data-path="src/components/SalesChart.tsx" />
            Sales Analytics - Error
          </CardTitle>
        </CardHeader>
        <CardContent data-id="f4vitg504" data-path="src/components/SalesChart.tsx">
          <div className="h-80 flex items-center justify-center" data-id="tvgo59plb" data-path="src/components/SalesChart.tsx">
            <div className="text-center text-red-600" data-id="kpivzm9na" data-path="src/components/SalesChart.tsx">
              <p className="font-medium" data-id="2y060k3nm" data-path="src/components/SalesChart.tsx">Error loading sales data</p>
              <p className="text-sm" data-id="45w07twuy" data-path="src/components/SalesChart.tsx">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card data-id="nj4ieim1b" data-path="src/components/SalesChart.tsx">
      <CardHeader data-id="dg6txldf1" data-path="src/components/SalesChart.tsx">
        <CardTitle className="flex items-center gap-2" data-id="ocgntfnue" data-path="src/components/SalesChart.tsx">
          <TrendingUp className="w-5 h-5 text-blue-600" data-id="jfvz52htk" data-path="src/components/SalesChart.tsx" />
          Sales Analytics - Last 30 Days
        </CardTitle>
        <CardDescription className="flex items-center gap-2" data-id="hg5pv9woy" data-path="src/components/SalesChart.tsx">
          <CalendarDays className="w-4 h-4" data-id="ywk3cvnd4" data-path="src/components/SalesChart.tsx" />
          Total sales across all gas stations: {formatCurrency(totalSalesAllStations)}
        </CardDescription>
      </CardHeader>
      <CardContent data-id="hnnk5dd8o" data-path="src/components/SalesChart.tsx">
        {salesData.length === 0 ?
        <div className="h-80 flex items-center justify-center text-gray-500" data-id="yw4vts6n9" data-path="src/components/SalesChart.tsx">
            <div className="text-center" data-id="ctf78x931" data-path="src/components/SalesChart.tsx">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" data-id="8imvcbh7w" data-path="src/components/SalesChart.tsx" />
              <p className="font-medium" data-id="jkg23dcgb" data-path="src/components/SalesChart.tsx">No sales data available</p>
              <p className="text-sm" data-id="tnt74n35n" data-path="src/components/SalesChart.tsx">Sales data for the last 30 days will appear here</p>
            </div>
          </div> :

        <div className="space-y-6" data-id="7egkkt7n4" data-path="src/components/SalesChart.tsx">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="7ez8td1ov" data-path="src/components/SalesChart.tsx">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100" data-id="s6vc7z9p0" data-path="src/components/SalesChart.tsx">
                <div className="flex items-center justify-between" data-id="cwl0tqm8u" data-path="src/components/SalesChart.tsx">
                  <div data-id="97fxn6c6i" data-path="src/components/SalesChart.tsx">
                    <p className="text-sm font-medium text-blue-900" data-id="2ghmygv1m" data-path="src/components/SalesChart.tsx">Fuel Sales</p>
                    <p className="text-2xl font-bold text-blue-900" data-id="wy0ez02yc" data-path="src/components/SalesChart.tsx">{formatCurrency(totalFuelSales)}</p>
                  </div>
                  <div className="p-2 bg-blue-500 text-white rounded" data-id="286qeiaxu" data-path="src/components/SalesChart.tsx">⛽</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100" data-id="fr0uc3vwl" data-path="src/components/SalesChart.tsx">
                <div className="flex items-center justify-between" data-id="2iu535v4s" data-path="src/components/SalesChart.tsx">
                  <div data-id="zujsra5n7" data-path="src/components/SalesChart.tsx">
                    <p className="text-sm font-medium text-green-900" data-id="fxpmj8s0y" data-path="src/components/SalesChart.tsx">Convenience Store</p>
                    <p className="text-2xl font-bold text-green-900" data-id="jt723nn5c" data-path="src/components/SalesChart.tsx">{formatCurrency(totalConvenienceSales)}</p>
                  </div>
                  <div className="p-2 bg-green-500 text-white rounded" data-id="y5safalj0" data-path="src/components/SalesChart.tsx">🏪</div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100" data-id="r3bzmcqh6" data-path="src/components/SalesChart.tsx">
                <div className="flex items-center justify-between" data-id="7c7csssow" data-path="src/components/SalesChart.tsx">
                  <div data-id="9j7gthrdc" data-path="src/components/SalesChart.tsx">
                    <p className="text-sm font-medium text-purple-900" data-id="p8bqa1wl7" data-path="src/components/SalesChart.tsx">Total Sales</p>
                    <p className="text-2xl font-bold text-purple-900" data-id="2s0kknikz" data-path="src/components/SalesChart.tsx">{formatCurrency(totalSalesAllStations)}</p>
                  </div>
                  <div className="p-2 bg-purple-500 text-white rounded" data-id="9b37zizk7" data-path="src/components/SalesChart.tsx">💰</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80" data-id="9jqzhdk9i" data-path="src/components/SalesChart.tsx">
              <ResponsiveContainer width="100%" height="100%" data-id="hxy6au90n" data-path="src/components/SalesChart.tsx">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} data-id="4gumqxp1g" data-path="src/components/SalesChart.tsx">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} data-id="ltewuwyi1" data-path="src/components/SalesChart.tsx" />
                  <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }} data-id="m7dkw3yxw" data-path="src/components/SalesChart.tsx" />

                  <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12 }} data-id="1g41s86u1" data-path="src/components/SalesChart.tsx" />

                  <Tooltip content={<CustomTooltip data-id="qn6ww4izk" data-path="src/components/SalesChart.tsx" />} data-id="n821izfu7" data-path="src/components/SalesChart.tsx" />
                  <Legend data-id="a32jzhz0p" data-path="src/components/SalesChart.tsx" />
                  
                  {/* MOBIL Station Bars */}
                  <Bar
                  dataKey="MOBIL_fuel"
                  stackId="MOBIL"
                  fill="#3B82F6"
                  name="MOBIL - Fuel" data-id="vlegsjz68" data-path="src/components/SalesChart.tsx" />

                  <Bar
                  dataKey="MOBIL_convenience"
                  stackId="MOBIL"
                  fill="#60A5FA"
                  name="MOBIL - Convenience" data-id="2h78bvqfk" data-path="src/components/SalesChart.tsx" />

                  
                  {/* AMOCO ROSEDALE Station Bars */}
                  <Bar
                  dataKey="AMOCO_ROSEDALE_fuel"
                  stackId="AMOCO_ROSEDALE"
                  fill="#10B981"
                  name="AMOCO ROSEDALE - Fuel" data-id="h2s2y4hut" data-path="src/components/SalesChart.tsx" />

                  <Bar
                  dataKey="AMOCO_ROSEDALE_convenience"
                  stackId="AMOCO_ROSEDALE"
                  fill="#34D399"
                  name="AMOCO ROSEDALE - Convenience" data-id="i1iosvsom" data-path="src/components/SalesChart.tsx" />

                  
                  {/* AMOCO BROOKLYN Station Bars */}
                  <Bar
                  dataKey="AMOCO_BROOKLYN_fuel"
                  stackId="AMOCO_BROOKLYN"
                  fill="#8B5CF6"
                  name="AMOCO BROOKLYN - Fuel" data-id="mpnwvem8a" data-path="src/components/SalesChart.tsx" />

                  <Bar
                  dataKey="AMOCO_BROOKLYN_convenience"
                  stackId="AMOCO_BROOKLYN"
                  fill="#A78BFA"
                  name="AMOCO BROOKLYN - Convenience" data-id="iz06p5fdn" data-path="src/components/SalesChart.tsx" />

                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Station Summary */}
            <div className="border-t pt-4" data-id="h9k80ztyf" data-path="src/components/SalesChart.tsx">
              <h4 className="font-semibold mb-3 text-gray-900" data-id="kgbteayga" data-path="src/components/SalesChart.tsx">Station Performance Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="3pxe5kegp" data-path="src/components/SalesChart.tsx">
                {stationTotals.map((station) =>
              <div key={station.station} className="bg-gray-50 p-3 rounded-lg" data-id="3jxzj7rk8" data-path="src/components/SalesChart.tsx">
                    <h5 className="font-medium text-gray-900 mb-2" data-id="qr92k6rj3" data-path="src/components/SalesChart.tsx">{station.station}</h5>
                    <div className="space-y-1 text-sm" data-id="nqtf4fegs" data-path="src/components/SalesChart.tsx">
                      <div className="flex justify-between" data-id="vyywlhnco" data-path="src/components/SalesChart.tsx">
                        <span className="text-gray-600" data-id="1fw73uh0j" data-path="src/components/SalesChart.tsx">Fuel:</span>
                        <span className="font-medium" data-id="c46xqt1q9" data-path="src/components/SalesChart.tsx">{formatCurrency(station.fuel)}</span>
                      </div>
                      <div className="flex justify-between" data-id="ps0jaf333" data-path="src/components/SalesChart.tsx">
                        <span className="text-gray-600" data-id="dejo3m1n5" data-path="src/components/SalesChart.tsx">Convenience:</span>
                        <span className="font-medium" data-id="yomve130a" data-path="src/components/SalesChart.tsx">{formatCurrency(station.convenience)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1" data-id="mmbuc232d" data-path="src/components/SalesChart.tsx">
                        <span className="font-medium text-gray-900" data-id="roxdr1u7a" data-path="src/components/SalesChart.tsx">Total:</span>
                        <span className="font-bold text-gray-900" data-id="thp01tt0y" data-path="src/components/SalesChart.tsx">{formatCurrency(station.total)}</span>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>
        }
      </CardContent>
    </Card>);

};

export default SalesChart;
