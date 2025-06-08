import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Fuel,
  Truck,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Eye } from
'lucide-react';
import { useNavigate } from 'react-router-dom';


interface GasDelivery {
  id: number;
  delivery_date: string;
  station: string;
  fuel_type: string;
  quantity_delivered: number;
  unit_price: number;
  total_amount: number;
  supplier: string;
  delivery_truck_number: string;
  driver_name: string;
  status: 'Delivered' | 'Pending' | 'In Transit' | 'Cancelled';
  tank_level_before: number;
  tank_level_after: number;
  delivery_notes: string;
  created_by: number;
}

const GasDeliveryInventory: React.FC = () => {
  const [deliveries, setDeliveries] = useState<GasDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const mockDeliveries: GasDelivery[] = [
  {
    id: 1,
    delivery_date: '2024-01-15T10:30:00Z',
    station: 'MOBIL',
    fuel_type: 'Regular (87)',
    quantity_delivered: 8500,
    unit_price: 2.85,
    total_amount: 24225.00,
    supplier: 'ExxonMobil Supply',
    delivery_truck_number: 'TRK-001',
    driver_name: 'John Smith',
    status: 'Delivered',
    tank_level_before: 2500,
    tank_level_after: 11000,
    delivery_notes: 'Delivery completed successfully. Tank capacity verified.',
    created_by: 1
  },
  {
    id: 2,
    delivery_date: '2024-01-15T14:15:00Z',
    station: 'AMOCO ROSEDALE',
    fuel_type: 'Premium (93)',
    quantity_delivered: 6000,
    unit_price: 3.15,
    total_amount: 18900.00,
    supplier: 'BP Supply Chain',
    delivery_truck_number: 'TRK-102',
    driver_name: 'Mike Johnson',
    status: 'In Transit',
    tank_level_before: 1800,
    tank_level_after: 0,
    delivery_notes: 'Delivery scheduled for 2 PM. Tank inspection completed.',
    created_by: 1
  },
  {
    id: 3,
    delivery_date: '2024-01-16T09:00:00Z',
    station: 'AMOCO BROOKLYN',
    fuel_type: 'Diesel',
    quantity_delivered: 7200,
    unit_price: 3.05,
    total_amount: 21960.00,
    supplier: 'Shell Energy',
    delivery_truck_number: 'TRK-205',
    driver_name: 'Sarah Davis',
    status: 'Pending',
    tank_level_before: 3200,
    tank_level_after: 0,
    delivery_notes: 'Scheduled delivery. Awaiting truck arrival.',
    created_by: 1
  }];


  useEffect(() => {
    // Simulate API call
    const fetchDeliveries = () => {
      setLoading(true);
      setTimeout(() => {
        setDeliveries(mockDeliveries);
        setLoading(false);
      }, 1000);
    };

    fetchDeliveries();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800" data-id="lrokrw1w5" data-path="src/pages/Inventory/GasDeliveryInventory.tsx"><CheckCircle className="w-3 h-3 mr-1" data-id="43bebgs6a" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />Delivered</Badge>;
      case 'In Transit':
        return <Badge className="bg-blue-100 text-blue-800" data-id="c4t2222yy" data-path="src/pages/Inventory/GasDeliveryInventory.tsx"><Truck className="w-3 h-3 mr-1" data-id="h223mivh6" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />In Transit</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800" data-id="huin90x4z" data-path="src/pages/Inventory/GasDeliveryInventory.tsx"><Clock className="w-3 h-3 mr-1" data-id="qiv3apomv" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />Pending</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800" data-id="zcj5qohtl" data-path="src/pages/Inventory/GasDeliveryInventory.tsx"><AlertCircle className="w-3 h-3 mr-1" data-id="l115xu7y7" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary" data-id="e8kdfw5t9" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{status}</Badge>;
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
    delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.delivery_truck_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.fuel_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStation = !stationFilter || stationFilter === 'all' || delivery.station === stationFilter;
    const matchesStatus = !statusFilter || statusFilter === 'all' || delivery.status === statusFilter;
    const matchesFuelType = !fuelTypeFilter || fuelTypeFilter === 'all' || delivery.fuel_type === fuelTypeFilter;

    return matchesSearch && matchesStation && matchesStatus && matchesFuelType;
  });

  const totalDeliveries = filteredDeliveries.length;
  const totalQuantity = filteredDeliveries.reduce((sum, delivery) => sum + delivery.quantity_delivered, 0);
  const totalValue = filteredDeliveries.reduce((sum, delivery) => sum + delivery.total_amount, 0);
  const completedDeliveries = filteredDeliveries.filter((d) => d.status === 'Delivered').length;

  return (
    <div className="space-y-6" data-id="z122bwuwo" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" data-id="e5dhk7zk5" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
        <div data-id="33pxtb43x" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center" data-id="9qn0zen7b" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            <Fuel className="w-6 h-6 mr-2 text-blue-600" data-id="4gixazcie" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
            GAS Delivery Inventory
          </h1>
          <p className="text-gray-600 mt-1" data-id="679t98rvu" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Track and manage fuel deliveries across all stations</p>
        </div>
        <Button
          onClick={() => navigate('/gas-delivery/new')}
          className="mt-4 sm:mt-0" data-id="n4hxszcyh" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <Plus className="w-4 h-4 mr-2" data-id="bpnsiw9wm" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
          New Delivery
        </Button>
      </div>

      {/* Station Selection */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-id="0f1wlfhz6" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
        <CardContent className="p-6" data-id="tk6kuk6h0" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" data-id="4nwumqeth" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            <div className="mb-4 sm:mb-0" data-id="zkylfeqz8" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <h2 className="text-lg font-semibold text-gray-900 mb-1" data-id="r6pnfno8v" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Select Station</h2>
              <p className="text-gray-600 text-sm" data-id="yj9qvqrrz" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Choose a station to view its gas delivery inventory</p>
            </div>
            <div className="w-full sm:w-80" data-id="hbjhpl1dy" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <Select value={stationFilter} onValueChange={setStationFilter} data-id="mgypp6sqh" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500" data-id="a4fi854if" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <SelectValue placeholder="Choose Station" data-id="n3sc56t0z" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                </SelectTrigger>
                <SelectContent data-id="l5p83amdk" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <SelectItem value="all" data-id="t48pucqgh" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">All Stations</SelectItem>
                  <SelectItem value="MOBIL" data-id="89nhrjm9e" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">MOBIL</SelectItem>
                  <SelectItem value="AMOCO ROSEDALE" data-id="ad6l1ew75" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">AMOCO ROSEDALE</SelectItem>
                  <SelectItem value="AMOCO BROOKLYN" data-id="r3rf8lvsh" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">AMOCO BROOKLYN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {stationFilter && stationFilter !== 'all' &&
          <div className="mt-4 p-3 bg-blue-100 rounded-lg" data-id="uu3wxwjz1" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <p className="text-blue-800 font-medium flex items-center" data-id="fme75qdct" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <Fuel className="w-4 h-4 mr-2" data-id="jkeh3dy3l" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                Showing data for: <span className="ml-1 font-bold" data-id="fjkm1uqqs" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{stationFilter}</span>
              </p>
            </div>
          }
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Card data-id="qwl7a9g9n" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
        <CardHeader data-id="av1pizzv8" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <CardTitle className="flex items-center text-lg" data-id="0wxzcgzh0" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" data-id="y60xb3hib" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
            {stationFilter === 'all' ? 'All Stations Summary' : `${stationFilter} Summary`}
          </CardTitle>
          <CardDescription data-id="nrt213noo" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            {stationFilter === 'all' ?
            'Overall statistics for all gas delivery operations' :
            `Statistics for ${stationFilter} station deliveries`
            }
          </CardDescription>
        </CardHeader>
        <CardContent data-id="f7cm4d762" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="wyq0wj5us" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            <div className="p-4 bg-blue-50 rounded-lg" data-id="hawg3zbob" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <div className="flex items-center" data-id="tk73tix45" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <div className="p-2 bg-blue-100 rounded-lg" data-id="le3j41ybt" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <Truck className="w-6 h-6 text-blue-600" data-id="f1z0acuvz" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                </div>
                <div className="ml-4" data-id="oiq8r27sm" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <p className="text-sm font-medium text-gray-600" data-id="0f7mzod5f" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-900" data-id="bxhle2i9u" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{totalDeliveries}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg" data-id="gw1bf6ihh" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <div className="flex items-center" data-id="u7axxs7ao" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <div className="p-2 bg-green-100 rounded-lg" data-id="xbfmp5j4x" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <Fuel className="w-6 h-6 text-green-600" data-id="3efksfrnv" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                </div>
                <div className="ml-4" data-id="r3jm0t3xk" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <p className="text-sm font-medium text-gray-600" data-id="rrnqur1zw" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Total Gallons</p>
                  <p className="text-2xl font-bold text-gray-900" data-id="0zxpqc8so" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{totalQuantity.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg" data-id="zd8pz9lys" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <div className="flex items-center" data-id="ke3oxzp9f" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <div className="p-2 bg-yellow-100 rounded-lg" data-id="l6oa7x66v" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <TrendingUp className="w-6 h-6 text-yellow-600" data-id="29hvjliwi" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                </div>
                <div className="ml-4" data-id="zekjko3x4" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <p className="text-sm font-medium text-gray-600" data-id="d0pcv0q97" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900" data-id="ktltylkd9" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg" data-id="uganarpxo" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <div className="flex items-center" data-id="751xfvu1x" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <div className="p-2 bg-purple-100 rounded-lg" data-id="vn1fkpfj2" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <CheckCircle className="w-6 h-6 text-purple-600" data-id="q2u409yia" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                </div>
                <div className="ml-4" data-id="j4rir0by0" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <p className="text-sm font-medium text-gray-600" data-id="hypm6ewwe" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Completed</p>
                  <p className="text-2xl font-bold text-gray-900" data-id="fk1pr99fo" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{completedDeliveries}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card data-id="agoe9sev2" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
        <CardContent className="p-6" data-id="imhbsc4rz" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-id="t8bmm0wsr" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            <div className="relative" data-id="mg77c1rkb" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" data-id="rxgltun7k" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="kym4ln6mo" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter} data-id="8btcj34u7" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <SelectTrigger data-id="fkd1nbtug" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <SelectValue placeholder="Filter by Status" data-id="sa0dz70hv" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
              </SelectTrigger>
              <SelectContent data-id="5usm1a8am" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <SelectItem value="all" data-id="4x7cks3fn" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">All Statuses</SelectItem>
                <SelectItem value="Delivered" data-id="0vk553410" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Delivered</SelectItem>
                <SelectItem value="In Transit" data-id="lnic6fbca" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">In Transit</SelectItem>
                <SelectItem value="Pending" data-id="nyxj0h3ri" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Pending</SelectItem>
                <SelectItem value="Cancelled" data-id="yozc0xfye" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter} data-id="44c52vo8s" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <SelectTrigger data-id="f42gkweel" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <SelectValue placeholder="Filter by Fuel Type" data-id="awjtnd96b" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
              </SelectTrigger>
              <SelectContent data-id="b4jy6mn2d" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <SelectItem value="all" data-id="pk6c6v6i2" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">All Fuel Types</SelectItem>
                <SelectItem value="Regular (87)" data-id="m56tcsdo6" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Regular (87)</SelectItem>
                <SelectItem value="Premium (93)" data-id="ywcxf2ood" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Premium (93)</SelectItem>
                <SelectItem value="Diesel" data-id="m53042v5j" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Diesel</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setFuelTypeFilter('all');
            }} data-id="6t23ob9wj" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card data-id="gyhvjowt5" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
        <CardHeader data-id="kmv3fohzl" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          <CardTitle data-id="460egvsd8" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Gas Delivery Records</CardTitle>
          <CardDescription data-id="raf1ad90u" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
            Recent fuel deliveries and their status across all stations
          </CardDescription>
        </CardHeader>
        <CardContent data-id="uy0uswpg5" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
          {loading ?
          <div className="flex items-center justify-center py-8" data-id="ug44dkanu" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-id="wz4wno6e2" data-path="src/pages/Inventory/GasDeliveryInventory.tsx"></div>
            </div> :

          <div className="rounded-md border" data-id="j29phc6c3" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <Table data-id="rfn3eerq5" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                <TableHeader data-id="y06oyvs7z" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  <TableRow data-id="q8u87ecyf" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                    <TableHead data-id="d1t4cnne6" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Delivery Date</TableHead>
                    <TableHead data-id="v4maabvej" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Station</TableHead>
                    <TableHead data-id="1orlj98i0" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Fuel Type</TableHead>
                    <TableHead data-id="uz8o6tkay" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Quantity (Gal)</TableHead>
                    <TableHead data-id="f2ddyodre" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Supplier</TableHead>
                    <TableHead data-id="dstqu4v7s" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Driver</TableHead>
                    <TableHead data-id="obxdamu0r" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Status</TableHead>
                    <TableHead data-id="y7jzn9vfg" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Total Amount</TableHead>
                    <TableHead data-id="425jaeray" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="inj5oj3yi" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                  {filteredDeliveries.map((delivery) =>
                <TableRow key={delivery.id} data-id="f4putjjf0" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                      <TableCell data-id="5ocn27uk8" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                        <div className="flex items-center" data-id="dhgefcbke" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" data-id="822m9oxwz" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                          {new Date(delivery.delivery_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell data-id="4txdvzg2g" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                        <Badge variant="outline" data-id="pr2w2o3kx" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{delivery.station}</Badge>
                      </TableCell>
                      <TableCell data-id="sg3tu89k9" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{delivery.fuel_type}</TableCell>
                      <TableCell className="font-medium" data-id="wp610l0mm" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                        {delivery.quantity_delivered.toLocaleString()}
                      </TableCell>
                      <TableCell data-id="m0ms5usug" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{delivery.supplier}</TableCell>
                      <TableCell data-id="pyvypmx8p" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{delivery.driver_name}</TableCell>
                      <TableCell data-id="nnv5azp50" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell className="font-medium" data-id="fjwfpzqm8" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                        ${delivery.total_amount.toLocaleString()}
                      </TableCell>
                      <TableCell data-id="0ybuj2s30" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                        <div className="flex items-center space-x-2" data-id="4kw7hkkdk" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                          <Button variant="ghost" size="sm" data-id="7onbeaiuk" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                            <Eye className="w-4 h-4" data-id="0paxlnygr" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                          </Button>
                          <Button variant="ghost" size="sm" data-id="jnze0uwsi" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
                            <Edit className="w-4 h-4" data-id="iknveurhi" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
                </TableBody>
              </Table>
            </div>
          }

          {!loading && filteredDeliveries.length === 0 &&
          <div className="text-center py-8" data-id="3ub86uwdi" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">
              <Fuel className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="gf6vceefy" data-path="src/pages/Inventory/GasDeliveryInventory.tsx" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="bj1oxngmf" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">No deliveries found</h3>
              <p className="text-gray-600" data-id="4hbz2jc7g" data-path="src/pages/Inventory/GasDeliveryInventory.tsx">Try adjusting your search or filter criteria.</p>
            </div>
          }
        </CardContent>
      </Card>
    </div>);

};

export default GasDeliveryInventory;