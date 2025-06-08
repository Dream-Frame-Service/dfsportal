import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, ShoppingCart, Calendar, DollarSign, Eye, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewModal from '@/components/ViewModal';
import { useListKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { supabase } from '@/lib/supabase';
import { motion } from 'motion/react';

interface Order {
  ID: number;
  order_number: string;
  vendor_id: number;
  order_date: string;
  expected_delivery: string;
  station: string;
  total_amount: number;
  status: string;
  notes: string;
  created_by: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const pageSize = 10;

  useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('order_date', { ascending: false });

      if (searchTerm) {
        query = query.ilike('order_number', `%${searchTerm}%`);
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setOrders(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderId(order.ID);
    setViewModalOpen(true);
  };

  const handleEdit = (orderId: number) => {
    navigate(`/orders/edit/${orderId}`);
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "Order deleted successfully"
      });
      loadOrders();
      setViewModalOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!selectedOrder) return;

    const csvContent = [
    'Field,Value',
    `Order Number,${selectedOrder.order_number}`,
    `Vendor ID,${selectedOrder.vendor_id}`,
    `Order Date,${selectedOrder.order_date}`,
    `Expected Delivery,${selectedOrder.expected_delivery}`,
    `Station,${selectedOrder.station}`,
    `Total Amount,${selectedOrder.total_amount}`,
    `Status,${selectedOrder.status}`,
    `Notes,${selectedOrder.notes}`].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${selectedOrder.order_number}_details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Order details exported successfully"
    });
  };

  // Keyboard shortcuts
  useListKeyboardShortcuts(
    selectedOrderId,
    (id) => {
      const order = orders.find((o) => o.ID === id);
      if (order) handleView(order);
    },
    handleEdit,
    handleDelete,
    () => navigate('/orders/new')
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStationBadgeColor = (station: string) => {
    switch (station.toUpperCase()) {
      case 'MOBIL':
        return 'bg-blue-600';
      case 'AMOCO ROSEDALE':
        return 'bg-green-600';
      case 'AMOCO BROOKLYN':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
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

  // Calculate totals for summary
  const totals = orders.reduce((acc, order) => ({
    total_amount: acc.total_amount + (order.total_amount || 0),
    pending_orders: acc.pending_orders + (order.status.toLowerCase() === 'pending' ? 1 : 0),
    delivered_orders: acc.delivered_orders + (order.status.toLowerCase() === 'delivered' ? 1 : 0)
  }), {
    total_amount: 0,
    pending_orders: 0,
    delivered_orders: 0
  });

  // Define view modal fields
  const getViewModalFields = (order: Order) => [
  {
    key: 'order_number',
    label: 'Order Number',
    value: order.order_number,
    type: 'text' as const,
    icon: FileText
  },
  {
    key: 'vendor_id',
    label: 'Vendor ID',
    value: order.vendor_id,
    type: 'number' as const
  },
  {
    key: 'order_date',
    label: 'Order Date',
    value: order.order_date,
    type: 'date' as const
  },
  {
    key: 'expected_delivery',
    label: 'Expected Delivery',
    value: order.expected_delivery,
    type: 'date' as const
  },
  {
    key: 'station',
    label: 'Station',
    value: order.station,
    type: 'badge' as const,
    badgeColor: getStationBadgeColor(order.station)
  },
  {
    key: 'total_amount',
    label: 'Total Amount',
    value: order.total_amount,
    type: 'currency' as const
  },
  {
    key: 'status',
    label: 'Status',
    value: order.status,
    type: 'badge' as const,
    badgeColor: getStatusBadgeColor(order.status)
  },
  {
    key: 'notes',
    label: 'Notes',
    value: order.notes,
    type: 'text' as const
  }];


  return (
    <div className="space-y-6" data-id="67r1zc9tj" data-path="src/pages/Orders/OrderList.tsx">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="3cscsoext" data-path="src/pages/Orders/OrderList.tsx">
        <Card data-id="a3gj6bo4f" data-path="src/pages/Orders/OrderList.tsx">
          <CardContent className="p-6" data-id="sm65cnbop" data-path="src/pages/Orders/OrderList.tsx">
            <div className="flex items-center space-x-2" data-id="gi9fg0bs6" data-path="src/pages/Orders/OrderList.tsx">
              <DollarSign className="w-8 h-8 text-green-600" data-id="f6krppjbe" data-path="src/pages/Orders/OrderList.tsx" />
              <div data-id="huhjtfmzn" data-path="src/pages/Orders/OrderList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="o8yidfrvg" data-path="src/pages/Orders/OrderList.tsx">Total Order Value</p>
                <p className="text-2xl font-bold" data-id="nlbts1wbv" data-path="src/pages/Orders/OrderList.tsx">{formatCurrency(totals.total_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="t6uwtmx4o" data-path="src/pages/Orders/OrderList.tsx">
          <CardContent className="p-6" data-id="331978kg6" data-path="src/pages/Orders/OrderList.tsx">
            <div className="flex items-center space-x-2" data-id="3js950h40" data-path="src/pages/Orders/OrderList.tsx">
              <Calendar className="w-8 h-8 text-yellow-600" data-id="45sc5thi7" data-path="src/pages/Orders/OrderList.tsx" />
              <div data-id="l0tr6sn1f" data-path="src/pages/Orders/OrderList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="vf0daqftg" data-path="src/pages/Orders/OrderList.tsx">Pending Orders</p>
                <p className="text-2xl font-bold" data-id="majya5yey" data-path="src/pages/Orders/OrderList.tsx">{totals.pending_orders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="o4yokkov9" data-path="src/pages/Orders/OrderList.tsx">
          <CardContent className="p-6" data-id="dnpqti81m" data-path="src/pages/Orders/OrderList.tsx">
            <div className="flex items-center space-x-2" data-id="73ks6g49l" data-path="src/pages/Orders/OrderList.tsx">
              <ShoppingCart className="w-8 h-8 text-green-600" data-id="kminb79gr" data-path="src/pages/Orders/OrderList.tsx" />
              <div data-id="haywzfyua" data-path="src/pages/Orders/OrderList.tsx">
                <p className="text-sm font-medium text-gray-600" data-id="m8tyoxu35" data-path="src/pages/Orders/OrderList.tsx">Delivered Orders</p>
                <p className="text-2xl font-bold" data-id="bl0233x3y" data-path="src/pages/Orders/OrderList.tsx">{totals.delivered_orders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-id="9w4zoozwx" data-path="src/pages/Orders/OrderList.tsx">
        <CardHeader data-id="u5nqhobgv" data-path="src/pages/Orders/OrderList.tsx">
          <div className="flex items-center justify-between" data-id="bajj06erg" data-path="src/pages/Orders/OrderList.tsx">
            <div data-id="g4e1kans2" data-path="src/pages/Orders/OrderList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="tn0i9t31w" data-path="src/pages/Orders/OrderList.tsx">
                <ShoppingCart className="w-6 h-6" data-id="mb0q8vqyi" data-path="src/pages/Orders/OrderList.tsx" />
                <span data-id="xva3lr5us" data-path="src/pages/Orders/OrderList.tsx">Orders</span>
              </CardTitle>
              <CardDescription data-id="33n0ohwcq" data-path="src/pages/Orders/OrderList.tsx">
                Manage your purchase orders and deliveries
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/orders/new')} className="flex items-center space-x-2" data-id="oois18u7s" data-path="src/pages/Orders/OrderList.tsx">
              <Plus className="w-4 h-4" data-id="q4pqo4ih0" data-path="src/pages/Orders/OrderList.tsx" />
              <span data-id="uh1jjg8x1" data-path="src/pages/Orders/OrderList.tsx">Create Order</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="kkqzkbzsp" data-path="src/pages/Orders/OrderList.tsx">
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6" data-id="6ewdsk20j" data-path="src/pages/Orders/OrderList.tsx">
            <div className="relative flex-1 max-w-sm" data-id="eetiqs9vq" data-path="src/pages/Orders/OrderList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="j6k05o7xf" data-path="src/pages/Orders/OrderList.tsx" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="ebbq6bhr4" data-path="src/pages/Orders/OrderList.tsx" />

            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-id="osw6fwg6j" data-path="src/pages/Orders/OrderList.tsx">
            <p className="text-sm text-blue-700" data-id="2djz0fpuh" data-path="src/pages/Orders/OrderList.tsx">
              <strong data-id="0sdptbf8c" data-path="src/pages/Orders/OrderList.tsx">Keyboard shortcuts:</strong> Select a row, then press <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs" data-id="00q3h59z2" data-path="src/pages/Orders/OrderList.tsx">V</kbd> to view, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="ilv8gs0ol" data-path="src/pages/Orders/OrderList.tsx">E</kbd> to edit, 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="w5rqf67ic" data-path="src/pages/Orders/OrderList.tsx">D</kbd> to delete, or 
              <kbd className="px-1 py-0.5 bg-blue-100 rounded text-xs ml-1" data-id="48qskiazf" data-path="src/pages/Orders/OrderList.tsx">Ctrl+N</kbd> to create new
            </p>
          </div>

          {/* Orders Table */}
          {loading ?
          <div className="space-y-4" data-id="nf8jutl77" data-path="src/pages/Orders/OrderList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" data-id="rs581dmoz" data-path="src/pages/Orders/OrderList.tsx"></div>
            )}
            </div> :
          orders.length === 0 ?
          <div className="text-center py-8" data-id="b6dvt9xpz" data-path="src/pages/Orders/OrderList.tsx">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="h3mwa6k2m" data-path="src/pages/Orders/OrderList.tsx" />
              <p className="text-gray-500" data-id="4q6cyxoe3" data-path="src/pages/Orders/OrderList.tsx">No orders found</p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/orders/new')} data-id="3khn9oet9" data-path="src/pages/Orders/OrderList.tsx">

                Create Your First Order
              </Button>
            </div> :

          <div className="border rounded-lg overflow-hidden" data-id="nsa2rgbtv" data-path="src/pages/Orders/OrderList.tsx">
              <Table data-id="hlif6kk59" data-path="src/pages/Orders/OrderList.tsx">
                <TableHeader data-id="fapyqz2ju" data-path="src/pages/Orders/OrderList.tsx">
                  <TableRow data-id="9hzudae8s" data-path="src/pages/Orders/OrderList.tsx">
                    <TableHead data-id="gmp0756bx" data-path="src/pages/Orders/OrderList.tsx">Order Number</TableHead>
                    <TableHead data-id="g5ahy226w" data-path="src/pages/Orders/OrderList.tsx">Order Date</TableHead>
                    <TableHead data-id="bq92vxafb" data-path="src/pages/Orders/OrderList.tsx">Station</TableHead>
                    <TableHead data-id="ifzmarrym" data-path="src/pages/Orders/OrderList.tsx">Total Amount</TableHead>
                    <TableHead data-id="254niljm7" data-path="src/pages/Orders/OrderList.tsx">Expected Delivery</TableHead>
                    <TableHead data-id="h00n713wf" data-path="src/pages/Orders/OrderList.tsx">Status</TableHead>
                    <TableHead data-id="nszm8emh9" data-path="src/pages/Orders/OrderList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="ar4epdfvy" data-path="src/pages/Orders/OrderList.tsx">
                  {orders.map((order, index) =>
                <motion.tr
                  key={order.ID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedOrderId === order.ID ? 'bg-blue-50 border-blue-200' : ''}`
                  }
                  onClick={() => setSelectedOrderId(order.ID)} data-id="jp7axzmmv" data-path="src/pages/Orders/OrderList.tsx">

                      <TableCell className="font-medium" data-id="j08vmzeid" data-path="src/pages/Orders/OrderList.tsx">
                        {order.order_number}
                        {order.notes &&
                    <p className="text-sm text-gray-500 truncate max-w-xs mt-1" data-id="ngucv7x8q" data-path="src/pages/Orders/OrderList.tsx">
                            {order.notes}
                          </p>
                    }
                      </TableCell>
                      <TableCell data-id="t0r1j2f9g" data-path="src/pages/Orders/OrderList.tsx">{formatDate(order.order_date)}</TableCell>
                      <TableCell data-id="t55237rv0" data-path="src/pages/Orders/OrderList.tsx">
                        <Badge className={`text-white ${getStationBadgeColor(order.station)}`} data-id="ovz9m8gg1" data-path="src/pages/Orders/OrderList.tsx">
                          {order.station}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium" data-id="dieptlvpb" data-path="src/pages/Orders/OrderList.tsx">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell data-id="qukhjph7u" data-path="src/pages/Orders/OrderList.tsx">{formatDate(order.expected_delivery)}</TableCell>
                      <TableCell data-id="wmkor2out" data-path="src/pages/Orders/OrderList.tsx">
                        <Badge className={`text-white ${getStatusBadgeColor(order.status)}`} data-id="9bzkxu4ua" data-path="src/pages/Orders/OrderList.tsx">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell data-id="x1u09itp4" data-path="src/pages/Orders/OrderList.tsx">
                        <div className="flex items-center space-x-2" data-id="8at5ajkyu" data-path="src/pages/Orders/OrderList.tsx">
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(order);
                        }}
                        className="text-blue-600 hover:text-blue-700" data-id="ogkduhsv6" data-path="src/pages/Orders/OrderList.tsx">

                            <Eye className="w-4 h-4" data-id="8yqu3ji25" data-path="src/pages/Orders/OrderList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(order.ID);
                        }} data-id="q9k1s24bq" data-path="src/pages/Orders/OrderList.tsx">

                            <Edit className="w-4 h-4" data-id="adqp2h0je" data-path="src/pages/Orders/OrderList.tsx" />
                          </Button>
                          <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.ID);
                        }}
                        className="text-red-600 hover:text-red-700" data-id="laps7j8v9" data-path="src/pages/Orders/OrderList.tsx">

                            <Trash2 className="w-4 h-4" data-id="ml8i88t9n" data-path="src/pages/Orders/OrderList.tsx" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                )}
                </TableBody>
              </Table>
            </div>
          }

          {/* Pagination */}
          {totalPages > 1 &&
          <div className="flex items-center justify-between mt-6" data-id="343lopjlo" data-path="src/pages/Orders/OrderList.tsx">
              <p className="text-sm text-gray-700" data-id="dil50xp8f" data-path="src/pages/Orders/OrderList.tsx">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} orders
              </p>
              <div className="flex items-center space-x-2" data-id="mog6zv672" data-path="src/pages/Orders/OrderList.tsx">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} data-id="qicxpnd15" data-path="src/pages/Orders/OrderList.tsx">

                  Previous
                </Button>
                <span className="text-sm" data-id="g5rzac5h2" data-path="src/pages/Orders/OrderList.tsx">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} data-id="hw2f6u6nc" data-path="src/pages/Orders/OrderList.tsx">

                  Next
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>
      
      {/* View Modal */}
      {selectedOrder &&
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedOrder(null);
          setSelectedOrderId(null);
        }}
        title={`Order #${selectedOrder.order_number}`}
        subtitle={`${selectedOrder.station} • ${formatCurrency(selectedOrder.total_amount)} • ${selectedOrder.status}`}
        data={selectedOrder}
        fields={getViewModalFields(selectedOrder)}
        onEdit={() => {
          setViewModalOpen(false);
          handleEdit(selectedOrder.ID);
        }}
        onDelete={() => handleDelete(selectedOrder.ID)}
        onExport={handleExport}
        canEdit={true}
        canDelete={true}
        canExport={true} data-id="exw24pupy" data-path="src/pages/Orders/OrderList.tsx" />

      }
    </div>);

};

export default OrderList;