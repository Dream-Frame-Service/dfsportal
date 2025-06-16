import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Truck, Filter, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

import EnhancedDeliveryPrintDialog from '@/components/EnhancedDeliveryPrintDialog';

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

const DeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const pageSize = 10;

  const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

  useEffect(() => {
    loadDeliveries();
  }, [currentPage, searchTerm, stationFilter]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('delivery_records')
        .select('*', { count: 'exact' })
        .order('delivery_date', { ascending: false });

      if (stationFilter !== 'all') {
        query = query.eq('station', stationFilter);
      }

      if (searchTerm) {
        query = query.ilike('bol_number', `%${searchTerm}%`);
      }

      const startRange = (currentPage - 1) * pageSize;
      const endRange = startRange + pageSize - 1;
      
      const { data, error, count } = await query.range(startRange, endRange);

      if (error) throw error;

      setDeliveries(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      toast({
        title: "Error",
        description: "Failed to load delivery records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this delivery record?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_records')
        .delete()
        .eq('id', id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery record deleted successfully"
      });

      loadDeliveries();
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast({
        title: "Error",
        description: "Failed to delete delivery record",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  const getTotalDelivered = (record: DeliveryRecord) => {
    return record.regular_delivered + record.plus_delivered + record.super_delivered;
  };

  const getTotalTankVolume = (record: DeliveryRecord) => {
    return record.regular_tank_volume + record.plus_tank_volume + record.super_tank_volume;
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

  const handleViewReport = (delivery: DeliveryRecord) => {
    setSelectedDelivery(delivery);
    setReportDialogOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-id="ut549evh3" data-path="src/pages/Delivery/DeliveryList.tsx">
        <div className="text-center" data-id="d53pfoe7m" data-path="src/pages/Delivery/DeliveryList.tsx">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" data-id="eddn1jbfx" data-path="src/pages/Delivery/DeliveryList.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="ltmk3j3qb" data-path="src/pages/Delivery/DeliveryList.tsx">Loading delivery records...</p>
        </div>
      </div>);

  }

  return (
    <div className="container mx-auto px-4 py-6" data-id="51g5lpbln" data-path="src/pages/Delivery/DeliveryList.tsx">
      
      <div className="mb-6" data-id="aqns6md1x" data-path="src/pages/Delivery/DeliveryList.tsx">
        <div className="flex items-center justify-between mb-4" data-id="k5341z5kc" data-path="src/pages/Delivery/DeliveryList.tsx">
          <div className="flex items-center gap-2" data-id="r18ht4ueq" data-path="src/pages/Delivery/DeliveryList.tsx">
            <Truck className="h-6 w-6 text-blue-600" data-id="8cgdh2o7o" data-path="src/pages/Delivery/DeliveryList.tsx" />
            <h1 className="text-2xl font-bold text-gray-900" data-id="ar6zprqm6" data-path="src/pages/Delivery/DeliveryList.tsx">Delivery Records</h1>
          </div>
          <Button onClick={() => navigate('/delivery/new')} data-id="6qdmreff6" data-path="src/pages/Delivery/DeliveryList.tsx">
            <Plus className="mr-2 h-4 w-4" data-id="ctit9jdlb" data-path="src/pages/Delivery/DeliveryList.tsx" />
            New Delivery
          </Button>
        </div>

        {/* Search and Filter */}
        <Card data-id="j5si32rec" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardContent className="pt-6" data-id="olrgucllu" data-path="src/pages/Delivery/DeliveryList.tsx">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="brgk9wj34" data-path="src/pages/Delivery/DeliveryList.tsx">
              <div className="relative" data-id="s2msberpa" data-path="src/pages/Delivery/DeliveryList.tsx">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" data-id="1hbq9s6c8" data-path="src/pages/Delivery/DeliveryList.tsx" />
                <Input
                  placeholder="Search by BOL number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" data-id="en9388n5p" data-path="src/pages/Delivery/DeliveryList.tsx" />

              </div>
              
              <div data-id="vx5hukpxy" data-path="src/pages/Delivery/DeliveryList.tsx">
                <Select value={stationFilter} onValueChange={setStationFilter} data-id="9s9vw3pms" data-path="src/pages/Delivery/DeliveryList.tsx">
                  <SelectTrigger data-id="oofmgecc1" data-path="src/pages/Delivery/DeliveryList.tsx">
                    <SelectValue placeholder="Filter by station" data-id="mz9dor8mj" data-path="src/pages/Delivery/DeliveryList.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="p0gvl7hg7" data-path="src/pages/Delivery/DeliveryList.tsx">
                    <SelectItem value="all" data-id="h708aueci" data-path="src/pages/Delivery/DeliveryList.tsx">All Stations</SelectItem>
                    {stations.map((station) =>
                    <SelectItem key={station} value={station} data-id="q8lwul5eh" data-path="src/pages/Delivery/DeliveryList.tsx">
                        {station}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2" data-id="f2orngb0j" data-path="src/pages/Delivery/DeliveryList.tsx">
                <Button variant="outline" onClick={loadDeliveries} data-id="jwyvudwv0" data-path="src/pages/Delivery/DeliveryList.tsx">
                  <Filter className="mr-2 h-4 w-4" data-id="m5lm66588" data-path="src/pages/Delivery/DeliveryList.tsx" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-id="n8zizlvpw" data-path="src/pages/Delivery/DeliveryList.tsx">
        <Card data-id="qhvtmfclq" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardContent className="pt-6" data-id="44devtjlw" data-path="src/pages/Delivery/DeliveryList.tsx">
            <div className="text-2xl font-bold text-blue-600" data-id="mnbmdpbhb" data-path="src/pages/Delivery/DeliveryList.tsx">{totalCount}</div>
            <p className="text-sm text-gray-600" data-id="lxyxy49k4" data-path="src/pages/Delivery/DeliveryList.tsx">Total Deliveries</p>
          </CardContent>
        </Card>
        
        <Card data-id="pvrh36vwl" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardContent className="pt-6" data-id="9zleb1f85" data-path="src/pages/Delivery/DeliveryList.tsx">
            <div className="text-2xl font-bold text-green-600" data-id="28mgu70gk" data-path="src/pages/Delivery/DeliveryList.tsx">
              {deliveries.reduce((sum, d) => sum + getTotalDelivered(d), 0).toFixed(0)}
            </div>
            <p className="text-sm text-gray-600" data-id="13401591a" data-path="src/pages/Delivery/DeliveryList.tsx">Total Gallons Delivered</p>
          </CardContent>
        </Card>
        
        <Card data-id="bre2ydcfr" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardContent className="pt-6" data-id="cw6vqes5n" data-path="src/pages/Delivery/DeliveryList.tsx">
            <div className="text-2xl font-bold text-purple-600" data-id="jorsqhbq2" data-path="src/pages/Delivery/DeliveryList.tsx">
              {new Set(deliveries.map((d) => d.station)).size}
            </div>
            <p className="text-sm text-gray-600" data-id="2nbxi3oew" data-path="src/pages/Delivery/DeliveryList.tsx">Stations Served</p>
          </CardContent>
        </Card>
        
        <Card data-id="sdu94cxvi" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardContent className="pt-6" data-id="ptytn7e5i" data-path="src/pages/Delivery/DeliveryList.tsx">
            <div className="text-2xl font-bold text-orange-600" data-id="bih73a1pv" data-path="src/pages/Delivery/DeliveryList.tsx">
              {deliveries.filter((d) => new Date(d.delivery_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-sm text-gray-600" data-id="c2cf8gfkj" data-path="src/pages/Delivery/DeliveryList.tsx">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Records Table */}
      <Card data-id="7w65fe873" data-path="src/pages/Delivery/DeliveryList.tsx">
        <CardHeader data-id="2dq179bdp" data-path="src/pages/Delivery/DeliveryList.tsx">
          <CardTitle data-id="6l1h3e78q" data-path="src/pages/Delivery/DeliveryList.tsx">Delivery Records</CardTitle>
        </CardHeader>
        <CardContent data-id="vj02u6kyz" data-path="src/pages/Delivery/DeliveryList.tsx">
          {deliveries.length === 0 ?
          <div className="text-center py-8" data-id="77oi6icmy" data-path="src/pages/Delivery/DeliveryList.tsx">
              <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" data-id="hrz90e6r0" data-path="src/pages/Delivery/DeliveryList.tsx" />
              <p className="text-gray-600" data-id="84o5waqt8" data-path="src/pages/Delivery/DeliveryList.tsx">No delivery records found</p>
              <Button onClick={() => navigate('/delivery/new')} className="mt-4" data-id="vw32puxq1" data-path="src/pages/Delivery/DeliveryList.tsx">
                <Plus className="mr-2 h-4 w-4" data-id="h9ybuqdai" data-path="src/pages/Delivery/DeliveryList.tsx" />
                Add First Delivery
              </Button>
            </div> :

          <>
              <div className="overflow-x-auto" data-id="a4p3un3b6" data-path="src/pages/Delivery/DeliveryList.tsx">
                <Table data-id="7tx2aixs3" data-path="src/pages/Delivery/DeliveryList.tsx">
                  <TableHeader data-id="alqa86996" data-path="src/pages/Delivery/DeliveryList.tsx">
                    <TableRow data-id="bvq1g3gt4" data-path="src/pages/Delivery/DeliveryList.tsx">
                      <TableHead data-id="v4da8675j" data-path="src/pages/Delivery/DeliveryList.tsx">Serial</TableHead>
                      <TableHead data-id="6ucs8z2yi" data-path="src/pages/Delivery/DeliveryList.tsx">Date</TableHead>
                      <TableHead data-id="epm3geoos" data-path="src/pages/Delivery/DeliveryList.tsx">BOL Number</TableHead>
                      <TableHead data-id="iemp5n8jh" data-path="src/pages/Delivery/DeliveryList.tsx">Station Name</TableHead>
                      <TableHead data-id="38mv34k9w" data-path="src/pages/Delivery/DeliveryList.tsx">Regular (Delivered)</TableHead>
                      <TableHead data-id="5qnblzoka" data-path="src/pages/Delivery/DeliveryList.tsx">Plus Delivered</TableHead>
                      <TableHead data-id="e4yjtylr1" data-path="src/pages/Delivery/DeliveryList.tsx">Super Delivered</TableHead>
                      <TableHead data-id="wcktfhiks" data-path="src/pages/Delivery/DeliveryList.tsx">Full Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody data-id="9oyx1ydpg" data-path="src/pages/Delivery/DeliveryList.tsx">
                    {deliveries.map((delivery, index) =>
                  <TableRow key={delivery.id} data-id="3kac2fic3" data-path="src/pages/Delivery/DeliveryList.tsx">
                        <TableCell className="font-medium" data-id="tfr3s47ok" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900" data-id="tiw02pi9n" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {formatDate(delivery.delivery_date)}
                        </TableCell>
                        <TableCell className="font-medium text-indigo-600" data-id="tp7zh6fvi" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {delivery.bol_number || 'N/A'}
                        </TableCell>
                        <TableCell data-id="zkeztif12" data-path="src/pages/Delivery/DeliveryList.tsx">
                          <Badge className={getStationBadgeColor(delivery.station)} data-id="xfphn92yn" data-path="src/pages/Delivery/DeliveryList.tsx">
                            {delivery.station}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-blue-600" data-id="nn0las98j" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {formatNumber(delivery.regular_delivered)} gal
                        </TableCell>
                        <TableCell className="font-medium text-green-600" data-id="7ywa29n8v" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {formatNumber(delivery.plus_delivered)} gal
                        </TableCell>
                        <TableCell className="font-medium text-purple-600" data-id="64tsjavqc" data-path="src/pages/Delivery/DeliveryList.tsx">
                          {formatNumber(delivery.super_delivered)} gal
                        </TableCell>
                        <TableCell data-id="4ktgcyc4y" data-path="src/pages/Delivery/DeliveryList.tsx">
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(delivery)}
                        className="h-8 w-8 p-0 hover:bg-blue-50" data-id="5ujbdh052" data-path="src/pages/Delivery/DeliveryList.tsx">

                            <Eye className="h-4 w-4 text-blue-600" data-id="rquwmau9p" data-path="src/pages/Delivery/DeliveryList.tsx" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 &&
            <div className="flex items-center justify-between mt-4" data-id="42ak88muf" data-path="src/pages/Delivery/DeliveryList.tsx">
                  <p className="text-sm text-gray-600" data-id="maxsj7x94" data-path="src/pages/Delivery/DeliveryList.tsx">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} records
                  </p>
                  <div className="flex space-x-2" data-id="kz1evp82m" data-path="src/pages/Delivery/DeliveryList.tsx">
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1} data-id="slt18xieu" data-path="src/pages/Delivery/DeliveryList.tsx">

                      Previous
                    </Button>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages} data-id="humz6rvor" data-path="src/pages/Delivery/DeliveryList.tsx">

                      Next
                    </Button>
                  </div>
                </div>
            }
            </>
          }
        </CardContent>
      </Card>

      {/* Enhanced Delivery Report Dialog */}
      <EnhancedDeliveryPrintDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        delivery={selectedDelivery} data-id="mhcfh4vy0" data-path="src/pages/Delivery/DeliveryList.tsx" />

    </div>);

};

export default DeliveryList;
