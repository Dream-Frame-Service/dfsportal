import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Bell, Mail, Settings, Package, TrendingDown, RefreshCw, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  product_name: string;
  category: string;
  quantity_in_stock: number;
  minimum_stock: number;
  supplier: string;
  department: string;
  retail_price: number;
  last_updated_date: string;
  overdue: boolean;
}

interface AlertSettings {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  emailNotifications: boolean;
  autoReorderSuggestions: boolean;
}

const InventoryAlerts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    emailNotifications: true,
    autoReorderSuggestions: true
  });
  const { toast } = useToast();

  const pageSize = 20;

  useEffect(() => {
    fetchProducts();
    loadAlertSettings();
  }, [currentPage, categoryFilter, severityFilter, searchTerm]);

  const loadAlertSettings = () => {
    const saved = localStorage.getItem('inventoryAlertSettings');
    if (saved) {
      setAlertSettings(JSON.parse(saved));
    }
  };

  const saveAlertSettings = (newSettings: AlertSettings) => {
    setAlertSettings(newSettings);
    localStorage.setItem('inventoryAlertSettings', JSON.stringify(newSettings));
    toast({
      title: 'Settings Saved',
      description: 'Alert settings have been updated successfully'
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('quantity_in_stock', { ascending: true });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (searchTerm) {
        query = query.ilike('product_name', `%${searchTerm}%`);
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const allProducts = data || [];
      setProducts(allProducts);
      setTotalRecords(count || 0);

      // Filter products that need attention
      const alertProducts = allProducts.filter((product) => {
        const stockRatio = product.quantity_in_stock / (product.minimum_stock || 1);

        if (severityFilter === 'critical') {
          return product.quantity_in_stock <= alertSettings.criticalStockThreshold;
        } else if (severityFilter === 'low') {
          return product.quantity_in_stock <= alertSettings.lowStockThreshold &&
          product.quantity_in_stock > alertSettings.criticalStockThreshold;
        } else if (severityFilter === 'reorder') {
          return product.quantity_in_stock <= product.minimum_stock;
        } else if (severityFilter === 'overdue') {
          return product.overdue;
        }

        return product.quantity_in_stock <= alertSettings.lowStockThreshold ||
        product.quantity_in_stock <= product.minimum_stock ||
        product.overdue;
      });

      setLowStockProducts(alertProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    toast({
      title: 'Data Refreshed',
      description: 'Inventory data has been updated'
    });
  };

  const sendLowStockAlert = async () => {
    if (lowStockProducts.length === 0) {
      toast({
        title: 'No Alerts to Send',
        description: 'All products are adequately stocked'
      });
      return;
    }

    try {
      const criticalItems = lowStockProducts.filter((p) => p.quantity_in_stock <= alertSettings.criticalStockThreshold);
      const lowItems = lowStockProducts.filter((p) =>
      p.quantity_in_stock <= alertSettings.lowStockThreshold &&
      p.quantity_in_stock > alertSettings.criticalStockThreshold
      );

      const emailContent = `
        <h2>🚨 Inventory Alert Report</h2>
        <p>The following products require immediate attention:</p>
        
        ${criticalItems.length > 0 ? `
        <h3 style="color: #dc2626;">⚠️ Critical Stock Levels (${criticalItems.length} items)</h3>
        <ul>
          ${criticalItems.map((item) => `
            <li><strong>${item.product_name}</strong> - Only ${item.quantity_in_stock} units remaining (Supplier: ${item.supplier})</li>
          `).join('')}
        </ul>
        ` : ''}
        
        ${lowItems.length > 0 ? `
        <h3 style="color: #ea580c;">📉 Low Stock Levels (${lowItems.length} items)</h3>
        <ul>
          ${lowItems.map((item) => `
            <li><strong>${item.product_name}</strong> - ${item.quantity_in_stock} units remaining (Min: ${item.minimum_stock})</li>
          `).join('')}
        </ul>
        ` : ''}
        
        <p><strong>Report generated:</strong> ${new Date().toLocaleString()}</p>
        <p>Please review and take appropriate action to restock these items.</p>
      `;

      // TODO: Implement proper email service using Supabase Edge Functions or external service
      console.log('Email alert would be sent:', {
        from: 'support@gasstation.com',
        to: ['manager@gasstation.com'],
        subject: `🚨 Inventory Alert: ${lowStockProducts.length} products need attention`,
        html: emailContent
      });

      toast({
        title: 'Alert Prepared',
        description: `Alert for ${lowStockProducts.length} products logged to console (email service needs implementation)`
      });
    } catch (error) {
      console.error('Error preparing alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare email alert',
        variant: 'destructive'
      });
    }
  };

  const getStockSeverity = (product: Product) => {
    if (product.quantity_in_stock <= alertSettings.criticalStockThreshold) return 'critical';
    if (product.quantity_in_stock <= alertSettings.lowStockThreshold) return 'low';
    if (product.quantity_in_stock <= product.minimum_stock) return 'reorder';
    if (product.overdue) return 'overdue';
    return 'normal';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="bg-red-100 text-red-800" data-id="a30o0ocq8" data-path="src/pages/Inventory/InventoryAlerts.tsx">Critical</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800" data-id="plnxseqpj" data-path="src/pages/Inventory/InventoryAlerts.tsx">Low Stock</Badge>;
      case 'reorder':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800" data-id="2xkyb7n6d" data-path="src/pages/Inventory/InventoryAlerts.tsx">Reorder</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="bg-purple-100 text-purple-800" data-id="sg35tiovp" data-path="src/pages/Inventory/InventoryAlerts.tsx">Overdue</Badge>;
      default:
        return <Badge variant="default" data-id="65l5w5afg" data-path="src/pages/Inventory/InventoryAlerts.tsx">Normal</Badge>;
    }
  };

  const calculateSummaryStats = () => {
    const critical = products.filter((p) => getStockSeverity(p) === 'critical').length;
    const low = products.filter((p) => getStockSeverity(p) === 'low').length;
    const reorder = products.filter((p) => getStockSeverity(p) === 'reorder').length;
    const overdue = products.filter((p) => getStockSeverity(p) === 'overdue').length;

    return { critical, low, reorder, overdue, total: products.length };
  };

  const stats = calculateSummaryStats();
  const totalPages = Math.ceil(totalRecords / pageSize);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6" data-id="foihocveu" data-path="src/pages/Inventory/InventoryAlerts.tsx">
      <div className="flex items-center justify-between" data-id="463qvqka5" data-path="src/pages/Inventory/InventoryAlerts.tsx">
        <div data-id="3kh3ogkcs" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <h1 className="text-3xl font-bold" data-id="f9l6bbi0n" data-path="src/pages/Inventory/InventoryAlerts.tsx">Inventory Alerts</h1>
          <p className="text-muted-foreground" data-id="w91b6yag9" data-path="src/pages/Inventory/InventoryAlerts.tsx">Monitor stock levels and manage inventory alerts</p>
        </div>
        <div className="flex gap-2" data-id="dvkomjnb9" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <Button variant="outline" onClick={refreshData} disabled={refreshing} data-id="0h2gniaki" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} data-id="kbd88z3d1" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            Refresh
          </Button>
          <Button onClick={sendLowStockAlert} disabled={lowStockProducts.length === 0} data-id="5krtteca5" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <Mail className="h-4 w-4 mr-2" data-id="rkgfzqm2w" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            Send Alert Email
          </Button>
          <Link to="/inventory/settings" data-id="ljgtm9cay" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <Button variant="outline" data-id="fpnantxry" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <Settings className="h-4 w-4 mr-2" data-id="a242ndn54" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4" data-id="cm8ov6o5p" data-path="src/pages/Inventory/InventoryAlerts.tsx">
        <Card className="border-red-200 bg-red-50" data-id="at0zptqmw" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardContent className="flex items-center p-4" data-id="ydl6ldsr2" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" data-id="z6i34ubm9" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            <div data-id="1dnezbvwf" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <p className="text-sm font-medium text-red-600" data-id="0krhy0ifw" data-path="src/pages/Inventory/InventoryAlerts.tsx">Critical Stock</p>
              <p className="text-2xl font-bold text-red-700" data-id="4gwumhf55" data-path="src/pages/Inventory/InventoryAlerts.tsx">{stats.critical}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50" data-id="hy4d4rdlm" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardContent className="flex items-center p-4" data-id="ybzal07b6" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <TrendingDown className="h-8 w-8 text-orange-600 mr-3" data-id="4052m37v2" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            <div data-id="5x3kn7yub" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <p className="text-sm font-medium text-orange-600" data-id="rq0tfeyhb" data-path="src/pages/Inventory/InventoryAlerts.tsx">Low Stock</p>
              <p className="text-2xl font-bold text-orange-700" data-id="c5ixhlexa" data-path="src/pages/Inventory/InventoryAlerts.tsx">{stats.low}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50" data-id="kmsd5lu7k" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardContent className="flex items-center p-4" data-id="trfjcyywm" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <Bell className="h-8 w-8 text-yellow-600 mr-3" data-id="8zi0kheh2" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            <div data-id="bext11ys4" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <p className="text-sm font-medium text-yellow-600" data-id="2z3284zy3" data-path="src/pages/Inventory/InventoryAlerts.tsx">Reorder Point</p>
              <p className="text-2xl font-bold text-yellow-700" data-id="xx9hp3r2s" data-path="src/pages/Inventory/InventoryAlerts.tsx">{stats.reorder}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50" data-id="2yldedjve" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardContent className="flex items-center p-4" data-id="1mj7y4kpo" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <Package className="h-8 w-8 text-purple-600 mr-3" data-id="7iksjmo46" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            <div data-id="pwzu3a5t0" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <p className="text-sm font-medium text-purple-600" data-id="vlejnt7ct" data-path="src/pages/Inventory/InventoryAlerts.tsx">Overdue</p>
              <p className="text-2xl font-bold text-purple-700" data-id="feywnn116" data-path="src/pages/Inventory/InventoryAlerts.tsx">{stats.overdue}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card data-id="zdqqcwgaz" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardContent className="flex items-center p-4" data-id="dicspmlad" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <Package className="h-8 w-8 text-blue-600 mr-3" data-id="qj1f1e9ti" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
            <div data-id="wh47dkcf3" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <p className="text-sm font-medium text-muted-foreground" data-id="5k6l40bsr" data-path="src/pages/Inventory/InventoryAlerts.tsx">Total Products</p>
              <p className="text-2xl font-bold" data-id="5fmsxzg8c" data-path="src/pages/Inventory/InventoryAlerts.tsx">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card data-id="t8xi25xtp" data-path="src/pages/Inventory/InventoryAlerts.tsx">
        <CardContent className="p-4" data-id="14910sqxi" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <div className="flex flex-wrap gap-4" data-id="y7xesgmx3" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            <div className="flex-1 min-w-[200px]" data-id="l6m27jdlb" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full" data-id="8o5wd8nh5" data-path="src/pages/Inventory/InventoryAlerts.tsx" />

            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter} data-id="vzw5m0q8w" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <SelectTrigger className="w-[180px]" data-id="m3mx21voi" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                <SelectValue placeholder="Category" data-id="eu2nw14q7" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
              </SelectTrigger>
              <SelectContent data-id="sc5ug5fck" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                <SelectItem value="all" data-id="xwzb07wr6" data-path="src/pages/Inventory/InventoryAlerts.tsx">All Categories</SelectItem>
                {categories.filter((category) => category && category.trim() !== '').map((category) =>
                <SelectItem key={category} value={category} data-id="zyep88opo" data-path="src/pages/Inventory/InventoryAlerts.tsx">{category}</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter} data-id="jld9k7yx9" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <SelectTrigger className="w-[150px]" data-id="hv2esr0e9" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                <SelectValue placeholder="Severity" data-id="5hp5chdsu" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
              </SelectTrigger>
              <SelectContent data-id="7jpzvb0i6" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                <SelectItem value="all" data-id="cz6jr63ud" data-path="src/pages/Inventory/InventoryAlerts.tsx">All Items</SelectItem>
                <SelectItem value="critical" data-id="6jy95i4kg" data-path="src/pages/Inventory/InventoryAlerts.tsx">Critical Only</SelectItem>
                <SelectItem value="low" data-id="j209ciunq" data-path="src/pages/Inventory/InventoryAlerts.tsx">Low Stock</SelectItem>
                <SelectItem value="reorder" data-id="41023f2sm" data-path="src/pages/Inventory/InventoryAlerts.tsx">Reorder Point</SelectItem>
                <SelectItem value="overdue" data-id="chagw6kbt" data-path="src/pages/Inventory/InventoryAlerts.tsx">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Alerts Table */}
      <Card data-id="ssjwnyxtw" data-path="src/pages/Inventory/InventoryAlerts.tsx">
        <CardHeader data-id="vhnkjyguh" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <CardTitle data-id="m7v1hqvi6" data-path="src/pages/Inventory/InventoryAlerts.tsx">Inventory Status</CardTitle>
          <CardDescription data-id="zva6k5y7g" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            Showing {products.length} products ({lowStockProducts.length} need attention)
          </CardDescription>
        </CardHeader>
        <CardContent data-id="f4o0hm09a" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          {loading ?
          <div className="flex justify-center py-8" data-id="251aiz8sf" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-id="4vlxqxc8a" data-path="src/pages/Inventory/InventoryAlerts.tsx"></div>
            </div> :

          <div className="overflow-x-auto" data-id="qy2si58gn" data-path="src/pages/Inventory/InventoryAlerts.tsx">
              <Table data-id="wlwlfd6co" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                <TableHeader data-id="hs2vgak5c" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                  <TableRow data-id="cxprp9pvb" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                    <TableHead data-id="42t3fsf6m" data-path="src/pages/Inventory/InventoryAlerts.tsx">Product</TableHead>
                    <TableHead data-id="idlrfuxgi" data-path="src/pages/Inventory/InventoryAlerts.tsx">Category</TableHead>
                    <TableHead data-id="p6ge0ysk1" data-path="src/pages/Inventory/InventoryAlerts.tsx">Current Stock</TableHead>
                    <TableHead data-id="5ml0541lv" data-path="src/pages/Inventory/InventoryAlerts.tsx">Min Stock</TableHead>
                    <TableHead data-id="tdv8korso" data-path="src/pages/Inventory/InventoryAlerts.tsx">Status</TableHead>
                    <TableHead data-id="w9qprvr8c" data-path="src/pages/Inventory/InventoryAlerts.tsx">Supplier</TableHead>
                    <TableHead data-id="gqckiukqy" data-path="src/pages/Inventory/InventoryAlerts.tsx">Last Updated</TableHead>
                    <TableHead data-id="ozp5qpshs" data-path="src/pages/Inventory/InventoryAlerts.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="mx10g2oie" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                  {products.map((product) => {
                  const severity = getStockSeverity(product);
                  const stockPercentage = product.quantity_in_stock / product.minimum_stock * 100;

                  return (
                    <TableRow key={product.id} className={severity === 'critical' ? 'bg-red-50' : severity === 'low' ? 'bg-orange-50' : ''} data-id="8ag4hd4qv" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                        <TableCell className="font-medium" data-id="1s6jbyihi" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                          <div data-id="vem91e1za" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                            <div className="font-semibold" data-id="wro8lw1fn" data-path="src/pages/Inventory/InventoryAlerts.tsx">{product.product_name}</div>
                            <div className="text-sm text-muted-foreground" data-id="1bnb3hqon" data-path="src/pages/Inventory/InventoryAlerts.tsx">{product.department}</div>
                          </div>
                        </TableCell>
                        <TableCell data-id="6cpmviezs" data-path="src/pages/Inventory/InventoryAlerts.tsx">{product.category}</TableCell>
                        <TableCell data-id="3ssfzz95o" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                          <div className="flex items-center gap-2" data-id="m1ynhombv" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                            <span className={`font-medium ${severity === 'critical' ? 'text-red-600' : severity === 'low' ? 'text-orange-600' : ''}`} data-id="5ewhf52zb" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                              {product.quantity_in_stock}
                            </span>
                            {severity !== 'normal' &&
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden" data-id="j2twlvh2v" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                                <div
                              className={`h-full ${severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }} data-id="4w6m19h9x" data-path="src/pages/Inventory/InventoryAlerts.tsx" />

                              </div>
                          }
                          </div>
                        </TableCell>
                        <TableCell data-id="jm4qt4d89" data-path="src/pages/Inventory/InventoryAlerts.tsx">{product.minimum_stock}</TableCell>
                        <TableCell data-id="4hr9sd98g" data-path="src/pages/Inventory/InventoryAlerts.tsx">{getSeverityBadge(severity)}</TableCell>
                        <TableCell data-id="8tx11ig7v" data-path="src/pages/Inventory/InventoryAlerts.tsx">{product.supplier}</TableCell>
                        <TableCell data-id="qs23prziy" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                          {new Date(product.last_updated_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell data-id="brujwzxaz" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                          <div className="flex items-center gap-2" data-id="1irc0uoqu" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                            <Link to={`/products/${product.id}`} data-id="371r15r41" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                              <Button variant="ghost" size="sm" data-id="462l5yswb" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                                <Eye className="h-4 w-4" data-id="jni8he2j2" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
                              </Button>
                            </Link>
                            <Link to={`/products/${product.id}/edit`} data-id="l7kxy6rqp" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                              <Button variant="ghost" size="sm" data-id="m7yzn6rhg" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                                <Plus className="h-4 w-4" data-id="lydpmzfqc" data-path="src/pages/Inventory/InventoryAlerts.tsx" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>);

                })}
                </TableBody>
              </Table>
              
              {products.length === 0 &&
            <div className="text-center py-8 text-muted-foreground" data-id="6x71p2lwm" data-path="src/pages/Inventory/InventoryAlerts.tsx">
                  No products found matching your criteria.
                </div>
            }
            </div>
          }
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex justify-center gap-2" data-id="8xd0ggy4v" data-path="src/pages/Inventory/InventoryAlerts.tsx">
          <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1} data-id="cdkg607fw" data-path="src/pages/Inventory/InventoryAlerts.tsx">

            Previous
          </Button>
          <span className="flex items-center px-4" data-id="8ksunlavb" data-path="src/pages/Inventory/InventoryAlerts.tsx">
            Page {currentPage} of {totalPages}
          </span>
          <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages} data-id="58vpcd98p" data-path="src/pages/Inventory/InventoryAlerts.tsx">

            Next
          </Button>
        </div>
      }
    </div>);

};

export default InventoryAlerts;