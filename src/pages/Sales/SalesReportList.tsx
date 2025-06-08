import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, TrendingUp, DollarSign, Calendar, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedSalesReportPrintDialog from '@/components/EnhancedSalesReportPrintDialog';
import { ezsiteApisReplacement } from '@/services/supabaseService';

interface SalesReport {
  ID: number;
  report_date: string;
  station: string;
  shift: string;
  employee_name: string;
  cash_collection_on_hand: number;
  total_short_over: number;
  credit_card_amount: number;
  debit_card_amount: number;
  mobile_amount: number;
  cash_amount: number;
  grocery_sales: number;
  ebt_sales: number;
  lottery_net_sales: number;
  scratch_off_sales: number;
  lottery_total_cash: number;
  regular_gallons: number;
  super_gallons: number;
  diesel_gallons: number;
  total_gallons: number;
  expenses_data: string;
  day_report_file_id?: number;
  veeder_root_file_id?: number;
  lotto_report_file_id?: number;
  scratch_off_report_file_id?: number;
  total_sales: number;
  notes: string;
  created_by: number;
}

const SalesReportList: React.FC = () => {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SalesReport | null>(null);
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const pageSize = 10;

  useEffect(() => {
    loadReports();
  }, [currentPage, searchTerm]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const filters = [];

      if (searchTerm) {
        filters.push({ name: 'station', op: 'StringContains', value: searchTerm });
      }

      const { data, error } = await ezsiteApisReplacement.tablePage('12356', {
        PageNo: currentPage,
        PageSize: pageSize,
        OrderByField: 'report_date',
        IsAsc: false,
        Filters: filters
      });

      if (error) throw error;

      setReports(data?.List || []);
      setTotalCount(data?.VirtualCount || 0);
    } catch (error) {
      console.error('Error loading sales reports:', error);
      toast({
        title: "Error",
        description: "Failed to load sales reports",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: number) => {
    if (!confirm('Are you sure you want to delete this sales report?')) {
      return;
    }

    try {
      const { error } = await ezsiteApisReplacement.tableDelete('12356', { ID: reportId });
      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales report deleted successfully"
      });
      loadReports();
    } catch (error) {
      console.error('Error deleting sales report:', error);
      toast({
        title: "Error",
        description: "Failed to delete sales report",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (report: SalesReport) => {
    setSelectedReport(report);
    setPrintDialogOpen(true);
  };

  const isAdmin = userProfile?.role === 'Administrator';
  const canAddReport = userProfile?.role === 'Employee' || userProfile?.role === 'Administrator';

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-blue-500';
      case 'AMOCO ROSEDALE':
        return 'bg-green-500';
      case 'AMOCO BROOKLYN':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate totals for all visible reports with proper validation
  const totals = reports.reduce((acc, report) => {
    // Ensure all values are properly parsed as numbers
    const totalSales = parseFloat(report.total_sales) || 0;
    const cashAmount = parseFloat(report.cash_amount) || 0;
    const creditCardAmount = parseFloat(report.credit_card_amount) || 0;
    const debitCardAmount = parseFloat(report.debit_card_amount) || 0;
    const mobileAmount = parseFloat(report.mobile_amount) || 0;
    const grocerySales = parseFloat(report.grocery_sales) || 0;
    const totalGallons = parseFloat(report.total_gallons) || 0;
    const lotteryTotalCash = parseFloat(report.lottery_total_cash) || 0;

    // Calculate payment method totals
    const paymentTotal = cashAmount + creditCardAmount + debitCardAmount + mobileAmount;

    // Log any discrepancies for debugging
    if (Math.abs(paymentTotal + grocerySales - totalSales) > 0.01) {
      console.warn(`Report ID ${report.ID}: Payment methods + grocery (${paymentTotal + grocerySales}) don't match total (${totalSales})`);
    }

    return {
      total_sales: acc.total_sales + totalSales,
      cash_amount: acc.cash_amount + cashAmount,
      credit_card_amount: acc.credit_card_amount + creditCardAmount,
      debit_card_amount: acc.debit_card_amount + debitCardAmount,
      mobile_amount: acc.mobile_amount + mobileAmount,
      grocery_sales: acc.grocery_sales + grocerySales,
      total_gallons: acc.total_gallons + totalGallons,
      lottery_total_cash: acc.lottery_total_cash + lotteryTotalCash
    };
  }, {
    total_sales: 0,
    cash_amount: 0,
    credit_card_amount: 0,
    debit_card_amount: 0,
    mobile_amount: 0,
    grocery_sales: 0,
    total_gallons: 0,
    lottery_total_cash: 0
  });

  // Validate the summary totals
  const summaryPaymentTotal = totals.cash_amount + totals.credit_card_amount + totals.debit_card_amount + totals.mobile_amount;
  const summaryWithGrocery = summaryPaymentTotal + totals.grocery_sales;

  console.log('Summary calculations:', {
    total_sales: totals.total_sales,
    payment_total: summaryPaymentTotal,
    with_grocery: summaryWithGrocery,
    payment_matches: Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01
  });

  return (
    <div className="space-y-6" data-id="s5u1kk052" data-path="src/pages/Sales/SalesReportList.tsx">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="qhmyaexfo" data-path="src/pages/Sales/SalesReportList.tsx">
        <Card data-id="scn6up0zx" data-path="src/pages/Sales/SalesReportList.tsx">
          <CardContent className="p-6" data-id="87t2gaaif" data-path="src/pages/Sales/SalesReportList.tsx">
            <div className="flex items-center space-x-2" data-id="3xj99lvdk" data-path="src/pages/Sales/SalesReportList.tsx">
              <DollarSign className="w-8 h-8 text-green-600" data-id="9aa0i27p0" data-path="src/pages/Sales/SalesReportList.tsx" />
              <div data-id="twcfmv49t" data-path="src/pages/Sales/SalesReportList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="sbtcrnf8m" data-path="src/pages/Sales/SalesReportList.tsx">Total Sales</p>
                <p className="text-2xl font-bold" data-id="592ufcqd6" data-path="src/pages/Sales/SalesReportList.tsx">{formatCurrency(totals.total_sales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="7nd82zbx4" data-path="src/pages/Sales/SalesReportList.tsx">
          <CardContent className="p-6" data-id="667v9mtfl" data-path="src/pages/Sales/SalesReportList.tsx">
            <div className="flex items-center space-x-2" data-id="v8g5si2tf" data-path="src/pages/Sales/SalesReportList.tsx">
              <TrendingUp className="w-8 h-8 text-blue-600" data-id="r2vv9bv12" data-path="src/pages/Sales/SalesReportList.tsx" />
              <div data-id="ocbavfrn5" data-path="src/pages/Sales/SalesReportList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="4j9zbsskh" data-path="src/pages/Sales/SalesReportList.tsx">Total Gallons</p>
                <p className="text-2xl font-bold" data-id="146pnef7x" data-path="src/pages/Sales/SalesReportList.tsx">{totals.total_gallons.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="5zi37se7w" data-path="src/pages/Sales/SalesReportList.tsx">
          <CardContent className="p-6" data-id="hesdv1g92" data-path="src/pages/Sales/SalesReportList.tsx">
            <div className="flex items-center space-x-2" data-id="4z7s1ym0k" data-path="src/pages/Sales/SalesReportList.tsx">
              <DollarSign className="w-8 h-8 text-purple-600" data-id="9ag2hnusd" data-path="src/pages/Sales/SalesReportList.tsx" />
              <div data-id="dlablt0wf" data-path="src/pages/Sales/SalesReportList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="axoky002i" data-path="src/pages/Sales/SalesReportList.tsx">Grocery Sales</p>
                <p className="text-2xl font-bold" data-id="1dqgizwu8" data-path="src/pages/Sales/SalesReportList.tsx">{formatCurrency(totals.grocery_sales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="je80z1cro" data-path="src/pages/Sales/SalesReportList.tsx">
          <CardContent className="p-6" data-id="uu7pawc68" data-path="src/pages/Sales/SalesReportList.tsx">
            <div className="flex items-center space-x-2" data-id="9796tjll9" data-path="src/pages/Sales/SalesReportList.tsx">
              <Calendar className="w-8 h-8 text-orange-600" data-id="ysx5bcmy0" data-path="src/pages/Sales/SalesReportList.tsx" />
              <div data-id="r73woml87" data-path="src/pages/Sales/SalesReportList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="p1qq0csze" data-path="src/pages/Sales/SalesReportList.tsx">Reports</p>
                <p className="text-2xl font-bold" data-id="zi459xupw" data-path="src/pages/Sales/SalesReportList.tsx">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-id="32cx6pk95" data-path="src/pages/Sales/SalesReportList.tsx">
        <CardHeader data-id="04cc4ooyq" data-path="src/pages/Sales/SalesReportList.tsx">
          <div className="flex items-center justify-between" data-id="6wminfuht" data-path="src/pages/Sales/SalesReportList.tsx">
            <div data-id="pv9fk1tjx" data-path="src/pages/Sales/SalesReportList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="unwia1h0r" data-path="src/pages/Sales/SalesReportList.tsx">
                <TrendingUp className="w-6 h-6" data-id="xhkhx1r5u" data-path="src/pages/Sales/SalesReportList.tsx" />
                <span data-id="6d3fhtgo2" data-path="src/pages/Sales/SalesReportList.tsx">Daily Sales Reports</span>
              </CardTitle>
              <CardDescription data-id="gp5k9lo5r" data-path="src/pages/Sales/SalesReportList.tsx">
                Track daily sales performance across all stations
              </CardDescription>
            </div>
            {canAddReport &&
            <Button onClick={() => navigate('/sales/new')} className="flex items-center space-x-2" data-id="pht7kseoz" data-path="src/pages/Sales/SalesReportList.tsx">
                <Plus className="w-4 h-4" data-id="pftbd4tf9" data-path="src/pages/Sales/SalesReportList.tsx" />
                <span data-id="dnnqy57ls" data-path="src/pages/Sales/SalesReportList.tsx">Add Report</span>
              </Button>
            }
          </div>
        </CardHeader>
        <CardContent data-id="pow67ybyx" data-path="src/pages/Sales/SalesReportList.tsx">
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6" data-id="yrrfk8331" data-path="src/pages/Sales/SalesReportList.tsx">
            <div className="relative flex-1 max-w-sm" data-id="hkkkhtrow" data-path="src/pages/Sales/SalesReportList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="uv7p5m56x" data-path="src/pages/Sales/SalesReportList.tsx" />
              <Input
                placeholder="Search by station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="wmgbkyjb5" data-path="src/pages/Sales/SalesReportList.tsx" />

            </div>
          </div>

          {/* Reports Table */}
          {loading ?
          <div className="space-y-4" data-id="2xyu4lboq" data-path="src/pages/Sales/SalesReportList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="476u6o1nn" data-path="src/pages/Sales/SalesReportList.tsx"></div>
            )}
            </div> :
          reports.length === 0 ?
          <div className="text-center py-8" data-id="0hxymx7ub" data-path="src/pages/Sales/SalesReportList.tsx">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="1pzr8c80m" data-path="src/pages/Sales/SalesReportList.tsx" />
              <p className="text-gray-500" data-id="yf7nl72kh" data-path="src/pages/Sales/SalesReportList.tsx">No sales reports found</p>
              {canAddReport &&
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/sales/new')} data-id="szxh6ni1x" data-path="src/pages/Sales/SalesReportList.tsx">
                  Add Your First Sales Report
                </Button>
            }
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="wqs58113r" data-path="src/pages/Sales/SalesReportList.tsx">
              <Table data-id="ufobs1uih" data-path="src/pages/Sales/SalesReportList.tsx">
                <TableHeader data-id="y6qi5ku5q" data-path="src/pages/Sales/SalesReportList.tsx">
                  <TableRow data-id="r5fgbhpxt" data-path="src/pages/Sales/SalesReportList.tsx">
                    <TableHead data-id="3mh4ydd8m" data-path="src/pages/Sales/SalesReportList.tsx">Date</TableHead>
                    <TableHead data-id="2jmevvzkr" data-path="src/pages/Sales/SalesReportList.tsx">Station</TableHead>
                    <TableHead data-id="8z76o578g" data-path="src/pages/Sales/SalesReportList.tsx">Shift</TableHead>
                    <TableHead data-id="gx2j5u8ai" data-path="src/pages/Sales/SalesReportList.tsx">Total Sales</TableHead>
                    <TableHead data-id="l8eb3s5ms" data-path="src/pages/Sales/SalesReportList.tsx">Gallons</TableHead>
                    <TableHead data-id="eokb4eub4" data-path="src/pages/Sales/SalesReportList.tsx">Grocery</TableHead>
                    <TableHead data-id="0ynqnn2xm" data-path="src/pages/Sales/SalesReportList.tsx">Payment Methods</TableHead>
                    <TableHead data-id="w3dlyggdn" data-path="src/pages/Sales/SalesReportList.tsx">Employee</TableHead>
                    <TableHead data-id="ccdq3tnxc" data-path="src/pages/Sales/SalesReportList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="4uit7uusw" data-path="src/pages/Sales/SalesReportList.tsx">
                  {reports.map((report) =>
                <TableRow key={report.ID} data-id="1xig3o9au" data-path="src/pages/Sales/SalesReportList.tsx">
                      <TableCell className="font-medium" data-id="z6mr8m4c6" data-path="src/pages/Sales/SalesReportList.tsx">
                        {formatDate(report.report_date)}
                      </TableCell>
                      <TableCell data-id="pa6fvyglv" data-path="src/pages/Sales/SalesReportList.tsx">
                        <Badge className={`text-white ${getStationBadgeColor(report.station)}`} data-id="9b5s4fdjx" data-path="src/pages/Sales/SalesReportList.tsx">
                          {report.station}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="vx923wpqk" data-path="src/pages/Sales/SalesReportList.tsx">
                        <Badge variant={report.shift === 'DAY' ? 'default' : 'secondary'} data-id="ybhw0zoup" data-path="src/pages/Sales/SalesReportList.tsx">
                          {report.shift || 'DAY'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium" data-id="tznbwjn1m" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="flex items-center space-x-2" data-id="o6lmw26e1" data-path="src/pages/Sales/SalesReportList.tsx">
                          <span data-id="6g5smdd5u" data-path="src/pages/Sales/SalesReportList.tsx">{formatCurrency(report.total_sales)}</span>
                          {(() => {
                        const total = parseFloat(report.total_sales) || 0;
                        const cash = parseFloat(report.cash_amount) || 0;
                        const credit = parseFloat(report.credit_card_amount) || 0;
                        const debit = parseFloat(report.debit_card_amount) || 0;
                        const mobile = parseFloat(report.mobile_amount) || 0;
                        const grocery = parseFloat(report.grocery_sales) || 0;
                        const paymentTotal = cash + credit + debit + mobile + grocery;
                        const isPaymentCorrect = Math.abs(paymentTotal - total) <= 0.01;

                        return isPaymentCorrect ?
                        <span className="text-green-600 text-xs" data-id="agqa1bafc" data-path="src/pages/Sales/SalesReportList.tsx">✓</span> :
                        <span className="text-red-600 text-xs" title={`Payment total: ${formatCurrency(paymentTotal)}`} data-id="qyd4z8kx6" data-path="src/pages/Sales/SalesReportList.tsx">⚠️</span>;
                      })()} 
                        </div>
                      </TableCell>
                      <TableCell data-id="8f6fxcj56" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="flex items-center space-x-2" data-id="tdylbfoiz" data-path="src/pages/Sales/SalesReportList.tsx">
                          <span data-id="7kkdzpoti" data-path="src/pages/Sales/SalesReportList.tsx">{parseFloat(report.total_gallons || '0').toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell data-id="qi55yv2zj" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="flex items-center space-x-2" data-id="4hf2o1etg" data-path="src/pages/Sales/SalesReportList.tsx">
                          <span data-id="avohx0haa" data-path="src/pages/Sales/SalesReportList.tsx">{formatCurrency(report.grocery_sales)}</span>
                        </div>
                      </TableCell>
                      <TableCell data-id="zjh9zkjy1" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="space-y-1 text-xs" data-id="1754eno96" data-path="src/pages/Sales/SalesReportList.tsx">
                          <div data-id="vhgk8tk9l" data-path="src/pages/Sales/SalesReportList.tsx">Cash: {formatCurrency(report.cash_amount)}</div>
                          <div data-id="anarega25" data-path="src/pages/Sales/SalesReportList.tsx">Credit: {formatCurrency(report.credit_card_amount)}</div>
                          <div data-id="jggo3ytwq" data-path="src/pages/Sales/SalesReportList.tsx">Debit: {formatCurrency(report.debit_card_amount)}</div>
                          <div data-id="7nr82o2gz" data-path="src/pages/Sales/SalesReportList.tsx">Mobile: {formatCurrency(report.mobile_amount)}</div>
                        </div>
                      </TableCell>
                      <TableCell data-id="ynwaqtax1" data-path="src/pages/Sales/SalesReportList.tsx">{report.employee_name}</TableCell>
                      <TableCell data-id="r2vymdorf" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="flex items-center space-x-2" data-id="8yhtt2u1o" data-path="src/pages/Sales/SalesReportList.tsx">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(report)}
                        title="Document Print" data-id="dht8tyoo6" data-path="src/pages/Sales/SalesReportList.tsx">
                            <Printer className="w-4 h-4" data-id="dzvhe8g2t" data-path="src/pages/Sales/SalesReportList.tsx" />
                          </Button>
                          {isAdmin &&
                      <>
                              <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/sales/edit/${report.ID}`)}
                          title="Edit Report" data-id="l7ti8a6yh" data-path="src/pages/Sales/SalesReportList.tsx">
                                <Edit className="w-4 h-4" data-id="vbjym211y" data-path="src/pages/Sales/SalesReportList.tsx" />
                              </Button>
                              <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(report.ID)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Report" data-id="6rxu2g1rj" data-path="src/pages/Sales/SalesReportList.tsx">
                                <Trash2 className="w-4 h-4" data-id="69nisn1dy" data-path="src/pages/Sales/SalesReportList.tsx" />
                              </Button>
                            </>
                      }
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                
                {/* Summary Row */}
                {reports.length > 0 &&
                <TableRow className="bg-gray-50 font-semibold border-t-2" data-id="hwt1t6mo3" data-path="src/pages/Sales/SalesReportList.tsx">
                    <TableCell className="font-bold" data-id="13xu8wdw2" data-path="src/pages/Sales/SalesReportList.tsx">TOTALS</TableCell>
                    <TableCell data-id="fevjht7ea" data-path="src/pages/Sales/SalesReportList.tsx">
                      <Badge variant="outline" className="text-xs" data-id="s47z4mlud" data-path="src/pages/Sales/SalesReportList.tsx">
                        {reports.length} reports
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500" data-id="ylqdsmrt8" data-path="src/pages/Sales/SalesReportList.tsx">-</TableCell>
                    <TableCell className="font-bold text-green-600" data-id="rwacl78b7" data-path="src/pages/Sales/SalesReportList.tsx">
                      <div className="flex items-center space-x-2" data-id="4phdcmjga" data-path="src/pages/Sales/SalesReportList.tsx">
                        <span data-id="41fk6g02u" data-path="src/pages/Sales/SalesReportList.tsx">{formatCurrency(totals.total_sales)}</span>
                        {Math.abs(summaryWithGrocery - totals.total_sales) <= 0.01 ?
                      <span className="text-green-600 text-xs" data-id="ozmy4ve9q" data-path="src/pages/Sales/SalesReportList.tsx">✓</span> :
                      <span className="text-red-600 text-xs" data-id="ng2f07tub" data-path="src/pages/Sales/SalesReportList.tsx">⚠️</span>
                      }
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-blue-600" data-id="3efpkwfz4" data-path="src/pages/Sales/SalesReportList.tsx">
                      {totals.total_gallons.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-bold text-purple-600" data-id="gg5wqoq96" data-path="src/pages/Sales/SalesReportList.tsx">
                      {formatCurrency(totals.grocery_sales)}
                    </TableCell>
                    <TableCell data-id="uku5v8r73" data-path="src/pages/Sales/SalesReportList.tsx">
                      <div className="space-y-1 text-xs" data-id="yk3tm42az" data-path="src/pages/Sales/SalesReportList.tsx">
                        <div className="font-medium" data-id="l9x4ihss6" data-path="src/pages/Sales/SalesReportList.tsx">Cash: {formatCurrency(totals.cash_amount)}</div>
                        <div className="font-medium" data-id="lta79l341" data-path="src/pages/Sales/SalesReportList.tsx">Credit: {formatCurrency(totals.credit_card_amount)}</div>
                        <div className="font-medium" data-id="lamqbtca6" data-path="src/pages/Sales/SalesReportList.tsx">Debit: {formatCurrency(totals.debit_card_amount)}</div>
                        <div className="font-medium" data-id="3w9dn37d2" data-path="src/pages/Sales/SalesReportList.tsx">Mobile: {formatCurrency(totals.mobile_amount)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500" data-id="6sdod4a9s" data-path="src/pages/Sales/SalesReportList.tsx">-</TableCell>
                    <TableCell className="text-gray-500" data-id="6s921ucne" data-path="src/pages/Sales/SalesReportList.tsx">-</TableCell>
                  </TableRow>
                }
                </TableBody>
              </Table>
            </div>
          }

          {/* Pagination */}
          {totalPages > 1 &&
          <div className="flex items-center justify-between mt-6" data-id="olodcsrpp" data-path="src/pages/Sales/SalesReportList.tsx">
              <p className="text-sm text-gray-700" data-id="3e59g74zn" data-path="src/pages/Sales/SalesReportList.tsx">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} reports
              </p>
              <div className="flex items-center space-x-2" data-id="j231ia14b" data-path="src/pages/Sales/SalesReportList.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} data-id="sutaj09af" data-path="src/pages/Sales/SalesReportList.tsx">

                  Previous
                </Button>
                <span className="text-sm" data-id="s9uewymzw" data-path="src/pages/Sales/SalesReportList.tsx">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} data-id="7nilrpyru" data-path="src/pages/Sales/SalesReportList.tsx">

                  Next
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* Enhanced Print Dialog */}
      <EnhancedSalesReportPrintDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        report={selectedReport} data-id="83o0ak1kp" data-path="src/pages/Sales/SalesReportList.tsx" />

    </div>);

};

export default SalesReportList;