import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Package, FileText, Loader2, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProductLogs from '@/components/ProductLogs';
import HighlightText from '@/components/HighlightText';
import { ResponsiveTable, ResponsiveStack } from '@/components/ResponsiveWrapper';
import { useResponsiveLayout } from '@/hooks/use-mobile';
import ProductCards from '@/components/ProductCards';
import { ezsiteApisReplacement } from '@/services/supabaseService';


interface Product {
  ID: number;
  product_name: string;
  category: string;
  quantity_in_stock: number;
  minimum_stock: number;
  supplier: string;
  description: string;
  created_by: number;
  serial_number: number;
  weight: number;
  weight_unit: string;
  department: string;
  merchant_id: number;
  bar_code_case: string;
  bar_code_unit: string;
  last_updated_date: string;
  last_shopping_date: string;
  case_price: number;
  unit_per_case: number;
  unit_price: number;
  retail_price: number;
  overdue: boolean;
}

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const responsive = useResponsiveLayout();

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: number;name: string;} | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [savingProductId, setSavingProductId] = useState<number | null>(null);

  const pageSize = 50; // Load more products per batch
  const [loadedProductsCount, setLoadedProductsCount] = useState(pageSize);

  // Ref for the loading trigger element
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setLoadedProductsCount(pageSize); // Reset loaded count when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, pageSize]);

  // Load all products initially
  useEffect(() => {
    loadAllProducts();
  }, []);

  // Filter and slice products when search term or loaded count changes
  useEffect(() => {
    filterAndSliceProducts();
  }, [debouncedSearchTerm, loadedProductsCount, allProducts]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await ezsiteApisReplacement.tablePage('11726', {
        PageNo: 1,
        PageSize: 1000, // Load a large number to get all products
        OrderByField: 'ID',
        IsAsc: false,
        Filters: []
      });

      if (error) throw error;

      setAllProducts(data?.List || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSliceProducts = () => {
    setIsSearching(!!debouncedSearchTerm);

    let filteredProducts = allProducts;

    // Client-side filtering for keyword matching
    if (debouncedSearchTerm) {
      const searchKeywords = debouncedSearchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);

      filteredProducts = allProducts.filter((product) => {
        const searchableText = [
        product.product_name,
        product.description,
        product.category,
        product.supplier,
        product.department,
        product.bar_code_case,
        product.bar_code_unit,
        product.serial_number?.toString()].
        join(' ').toLowerCase();

        // Check if all keywords are present in the searchable text
        return searchKeywords.every((keyword) => searchableText.includes(keyword));
      });
    }

    // Sort by serial number when not searching (show from serial 01)
    if (!debouncedSearchTerm) {
      filteredProducts = filteredProducts.sort((a, b) => {
        const serialA = a.serial_number || 0;
        const serialB = b.serial_number || 0;
        return serialA - serialB;
      });
    }

    // Slice products based on loaded count for infinite scroll
    const slicedProducts = filteredProducts.slice(0, loadedProductsCount);

    setProducts(slicedProducts);
    setTotalCount(filteredProducts.length);
    setHasMoreProducts(loadedProductsCount < filteredProducts.length);
  };

  const handleDelete = async (productId: number) => {
    console.log('handleDelete called for product ID:', productId);

    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to delete this product? This action cannot be undone.');
    console.log('User confirmed deletion:', confirmed);

    if (!confirmed) {
      console.log('Deletion cancelled by user');
      return;
    }

    try {
      console.log('Attempting to delete product with ID:', productId);
      const { error } = await ezsiteApisReplacement.tableDelete('11726', { ID: productId });

      if (error) {
        console.error('API returned error:', error);
        throw error;
      }

      console.log('Product deleted successfully');
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });

      // Reload all products
      loadAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${error}`,
        variant: "destructive"
      });
    }
  };

  const handleSaveProduct = async (productId: number | null = null) => {
    console.log('handleSaveProduct called for product ID:', productId);

    if (!hasEditPermission) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to save product information.",
        variant: "destructive"
      });
      return;
    }

    const isCreating = productId === null;
    setSavingProductId(productId || -1); // Use -1 for new product creation

    try {
      if (isCreating) {
        // Show confirmation dialog for creating new product
        const confirmed = confirm('Create a new product entry? This will add a new product with default values that you can edit.');
        if (!confirmed) {
          console.log('Product creation cancelled by user');
          setSavingProductId(null);
          return;
        }

        // Create a new product with minimal required data
        // Generate new serial number
        const { data: serialData } = await ezsiteApisReplacement.tablePage('11726', {
          PageNo: 1,
          PageSize: 1,
          OrderByField: 'serial_number',
          IsAsc: false,
          Filters: []
        });

        const lastSerial = serialData?.List?.[0]?.serial_number || 0;
        const newSerial = lastSerial + 1;

        const newProductData = {
          serial_number: newSerial,
          product_name: `New Product ${newSerial}`,
          category: 'General',
          quantity_in_stock: 0,
          minimum_stock: 0,
          supplier: '',
          description: 'Please update this product information',
          weight: 0,
          weight_unit: 'lb',
          department: 'Convenience Store',
          merchant_id: null,
          bar_code_case: '',
          bar_code_unit: '',
          last_updated_date: new Date().toISOString(),
          last_shopping_date: null,
          case_price: 0,
          unit_per_case: 1,
          unit_price: 0,
          retail_price: 0,
          overdue: false,
          created_by: userProfile?.user_id || null
        };

        console.log('Creating new product with data:', newProductData);
        const { error } = await ezsiteApisReplacement.tableCreate('11726', newProductData);

        if (error) {
          console.error('API returned error:', error);
          throw error;
        }

        console.log('New product created successfully with serial:', newSerial);
        toast({
          title: "Success",
          description: `New product created with serial #${newSerial}. Please edit it to add complete information.`,
          duration: 5000
        });
      } else {
        // Update existing product
        const product = products.find((p) => p.ID === productId);
        if (!product) {
          throw new Error('Product not found');
        }

        // Show confirmation dialog for updating existing product
        const confirmed = confirm(`Save updates to "${product.product_name}"? This will update the product information with current values.`);
        if (!confirmed) {
          console.log('Product update cancelled by user');
          setSavingProductId(null);
          return;
        }

        console.log('Updating product:', product);

        // Prepare the data for saving (update existing product)
        const updateData = {
          ID: product.ID,
          product_name: product.product_name,
          category: product.category || '',
          quantity_in_stock: product.quantity_in_stock || 0,
          minimum_stock: product.minimum_stock || 0,
          supplier: product.supplier || '',
          description: product.description || '',
          serial_number: product.serial_number || 0,
          weight: product.weight || 0,
          weight_unit: product.weight_unit || 'lb',
          department: product.department || 'Convenience Store',
          merchant_id: product.merchant_id || null,
          bar_code_case: product.bar_code_case || '',
          bar_code_unit: product.bar_code_unit || '',
          last_updated_date: new Date().toISOString(),
          last_shopping_date: product.last_shopping_date || null,
          case_price: product.case_price || 0,
          unit_per_case: product.unit_per_case || 1,
          unit_price: product.unit_price || 0,
          retail_price: product.retail_price || 0,
          overdue: product.overdue || false,
          created_by: product.created_by || userProfile?.user_id || null
        };

        console.log('Updating product with data:', updateData);
        const { error } = await ezsiteApisReplacement.tableUpdate('11726', updateData);

        if (error) {
          console.error('API returned error:', error);
          throw error;
        }

        console.log('Product updated successfully with ID:', product.ID);
        toast({
          title: "Success",
          description: `"${product.product_name}" updated successfully`,
          duration: 3000
        });
      }

      // Reload all products to reflect changes
      loadAllProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to ${isCreating ? 'create' : 'update'} product: ${error}`,
        variant: "destructive"
      });
    } finally {
      setSavingProductId(null);
    }
  };

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;

    setIsLoadingMore(true);

    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setLoadedProductsCount((prev) => prev + pageSize);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMoreProducts, pageSize]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentTrigger = loadingTriggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [loadMoreProducts, hasMoreProducts, isLoadingMore]);

  const handleViewLogs = (productId: number, productName: string) => {
    console.log('handleViewLogs called for:', { productId, productName });
    setSelectedProduct({ id: productId, name: productName });
    setLogsModalOpen(true);
    console.log('Logs modal should now be open');
  };

  // Visual editing enabled for all users
  const hasEditPermission = true;

  // Calculate display text for showing results
  const getDisplayText = () => {
    if (totalCount === 0) return '';

    const currentlyShowing = Math.min(products.length, totalCount);

    if (debouncedSearchTerm) {
      return `Showing ${currentlyShowing} of ${totalCount} products matching "${debouncedSearchTerm}"`;
    }

    if (hasMoreProducts) {
      return `Showing ${currentlyShowing} of ${totalCount} products - Scroll down to load more`;
    }

    return `Showing all ${totalCount} products`;
  };

  // Get search keywords and check if all match
  const getSearchData = (text: string) => {
    if (!debouncedSearchTerm || !text) {
      return {
        keywords: [],
        allMatch: false,
        highlightComponent: text
      };
    }

    const searchKeywords = debouncedSearchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);
    const textLower = text.toLowerCase();

    // Check if all keywords are present in this specific text
    const allMatch = searchKeywords.every((keyword) => textLower.includes(keyword));

    return {
      keywords: searchKeywords,
      allMatch,
      highlightComponent:
      <HighlightText
        text={text}
        searchTerms={searchKeywords}
        allMatch={allMatch} data-id="1wt725buf" data-path="src/pages/Products/ProductList.tsx" />


    };
  };

  // Clear search and reset to show all products from serial 01
  const handleClearSearch = () => {
    setSearchTerm('');
    setLoadedProductsCount(pageSize);
  };

  return (
    <ResponsiveStack spacing="lg" data-id="btwya3lp5" data-path="src/pages/Products/ProductList.tsx">
      <Card data-id="6w9ert8jz" data-path="src/pages/Products/ProductList.tsx">
        <CardHeader data-id="5m1mzk7vo" data-path="src/pages/Products/ProductList.tsx">
          <div className={`flex items-center ${
          responsive.isMobile ? 'flex-col space-y-4' : 'justify-between'}`
          } data-id="bowlpcor5" data-path="src/pages/Products/ProductList.tsx">
            <div className={responsive.isMobile ? 'text-center' : ''} data-id="y8tl5mqr0" data-path="src/pages/Products/ProductList.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="dv5p6okn6" data-path="src/pages/Products/ProductList.tsx">
                <Package className="w-6 h-6" data-id="mpvi5de9f" data-path="src/pages/Products/ProductList.tsx" />
                <span data-id="lssx8ks5s" data-path="src/pages/Products/ProductList.tsx">Products</span>
              </CardTitle>
              <CardDescription className={responsive.isMobile ? 'text-center mt-2' : ''} data-id="60hg960xc" data-path="src/pages/Products/ProductList.tsx">
                Manage your product inventory - Search across all product fields for similar items
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate('/products/new')}
              className={`bg-brand-600 hover:bg-brand-700 text-white ${
              responsive.isMobile ? 'w-full' : ''}`
              } data-id="yrss8uwf7" data-path="src/pages/Products/ProductList.tsx">
              <Plus className="w-4 h-4 mr-2" data-id="8mt4ozszr" data-path="src/pages/Products/ProductList.tsx" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="cgvu9f3kp" data-path="src/pages/Products/ProductList.tsx">
          {/* Search */}
          <div className={`flex items-center mb-6 ${
          responsive.isMobile ? 'flex-col space-y-3' : 'space-x-2'}`
          } data-id="xhu140fsq" data-path="src/pages/Products/ProductList.tsx">
            <div className={`relative ${
            responsive.isMobile ? 'w-full' : 'flex-1 max-w-sm'}`
            } data-id="obkwojs7a" data-path="src/pages/Products/ProductList.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="i4u0f0oyn" data-path="src/pages/Products/ProductList.tsx" />
              {searchTerm &&
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
                title="Clear search" data-id="dkfof42co" data-path="src/pages/Products/ProductList.tsx">

                  <X className="w-4 h-4" data-id="umphay4wr" data-path="src/pages/Products/ProductList.tsx" />
                </button>
              }
              <Input
                placeholder={responsive.isMobile ?
                "Search products..." :
                "Search products by name, description, category, supplier, barcode..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${searchTerm ? 'pr-10' : 'pr-3'}`} data-id="fokk0lrml" data-path="src/pages/Products/ProductList.tsx" />
            </div>
            {debouncedSearchTerm &&
            <div className={`flex items-center space-x-2 ${
            responsive.isMobile ? 'w-full justify-center' : ''}`
            } data-id="vhlhajtb4" data-path="src/pages/Products/ProductList.tsx">
                <Badge variant="secondary" data-id="lx9c47e6v" data-path="src/pages/Products/ProductList.tsx">
                  {totalCount} result{totalCount !== 1 ? 's' : ''} found
                </Badge>
                <Button
                variant="outline"
                size="sm"
                onClick={handleClearSearch} data-id="0gw3ch1r5" data-path="src/pages/Products/ProductList.tsx">
                  Clear
                </Button>
              </div>
            }
          </div>

          {/* Products Display */}
          {loading ?
          <div className="space-y-4" data-id="sizuuqbx0" data-path="src/pages/Products/ProductList.tsx">
              {[...Array(5)].map((_, i) =>
            <div key={i} className={`bg-gray-100 rounded animate-pulse ${
            responsive.isMobile ? 'h-32' : 'h-16'}`
            } data-id="iu3nnrhc1" data-path="src/pages/Products/ProductList.tsx"></div>
            )}
            </div> :
          products.length === 0 ?
          <div className="text-center py-8" data-id="5to45rrj4" data-path="src/pages/Products/ProductList.tsx">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="1pfqp05jo" data-path="src/pages/Products/ProductList.tsx" />
              <p className="text-gray-500" data-id="pdsgjn99d" data-path="src/pages/Products/ProductList.tsx">
                {debouncedSearchTerm ? `No products found matching "${debouncedSearchTerm}"` : 'No products found'}
              </p>
              <Button
              variant="outline"
              className="mt-4"
              onClick={() => debouncedSearchTerm ? handleClearSearch() : navigate('/products/new')} data-id="81ceuepen" data-path="src/pages/Products/ProductList.tsx">
                {debouncedSearchTerm ? 'Clear Search' : 'Add Your First Product'}
              </Button>
            </div> :

          responsive.isMobile ?
          <ProductCards
            products={products}
            searchTerm={debouncedSearchTerm}
            onViewLogs={handleViewLogs}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDelete}
            savingProductId={savingProductId} data-id="rxz6bntu1" data-path="src/pages/Products/ProductList.tsx" /> :


          <ResponsiveTable className="border rounded-lg overflow-hidden" data-id="9u668xl6m" data-path="src/pages/Products/ProductList.tsx">
              <Table data-id="parxcetjj" data-path="src/pages/Products/ProductList.tsx">
                <TableHeader data-id="sywj330th" data-path="src/pages/Products/ProductList.tsx">
                  <TableRow data-id="reg1nxz9g" data-path="src/pages/Products/ProductList.tsx">
                    <TableHead data-id="wr0rdxj7u" data-path="src/pages/Products/ProductList.tsx">Serial</TableHead>
                    <TableHead data-id="xguj479aq" data-path="src/pages/Products/ProductList.tsx">Product Name</TableHead>
                    <TableHead data-id="7h0kv6j17" data-path="src/pages/Products/ProductList.tsx">Weight</TableHead>
                    <TableHead data-id="m0mjuvv7q" data-path="src/pages/Products/ProductList.tsx">Department</TableHead>
                    <TableHead data-id="y38xdhyn7" data-path="src/pages/Products/ProductList.tsx">Merchant</TableHead>
                    <TableHead data-id="hyjsoza3w" data-path="src/pages/Products/ProductList.tsx">Last Updated Date</TableHead>
                    <TableHead data-id="035hbg930" data-path="src/pages/Products/ProductList.tsx">Last Shopping Date</TableHead>
                    <TableHead data-id="th1z3z9u8" data-path="src/pages/Products/ProductList.tsx">Case Price</TableHead>
                    <TableHead data-id="238n5lgcq" data-path="src/pages/Products/ProductList.tsx">Unit Per Case</TableHead>
                    <TableHead data-id="1z9kj96eq" data-path="src/pages/Products/ProductList.tsx">Unit Price</TableHead>
                    <TableHead data-id="yhlio4zkh" data-path="src/pages/Products/ProductList.tsx">Retail Price</TableHead>
                    <TableHead data-id="uqhntcdih" data-path="src/pages/Products/ProductList.tsx">Profit Margin</TableHead>
                    <TableHead data-id="bezh8xz0h" data-path="src/pages/Products/ProductList.tsx">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="tku466zwk" data-path="src/pages/Products/ProductList.tsx">
                  {products.map((product) => {
                  const formatDate = (dateString: string) => {
                    if (!dateString) return '-';
                    try {
                      return new Date(dateString).toLocaleDateString();
                    } catch {
                      return '-';
                    }
                  };

                  return (
                    <TableRow key={product.ID} data-id="v193smj46" data-path="src/pages/Products/ProductList.tsx">
                        <TableCell className="font-medium" data-id="sdowsi684" data-path="src/pages/Products/ProductList.tsx">{product.serial_number || '-'}</TableCell>
                        <TableCell data-id="e8rd7c27x" data-path="src/pages/Products/ProductList.tsx">
                          <div data-id="rg0lp6ej4" data-path="src/pages/Products/ProductList.tsx">
                            <p className="font-medium" data-id="gwy9p1va6" data-path="src/pages/Products/ProductList.tsx">
                              {debouncedSearchTerm ?
                            getSearchData(product.product_name).highlightComponent :
                            product.product_name
                            }
                            </p>
                            {product.description &&
                          <p className="text-sm text-gray-500 truncate max-w-xs" data-id="hgubcoamt" data-path="src/pages/Products/ProductList.tsx">
                                {debouncedSearchTerm ?
                            getSearchData(product.description).highlightComponent :
                            product.description
                            }
                              </p>
                          }
                          </div>
                        </TableCell>
                        <TableCell data-id="6ktazokh3" data-path="src/pages/Products/ProductList.tsx">
                          {product.weight && product.weight > 0 ?
                        `${product.weight} ${product.weight_unit || 'lb'}` : '-'
                        }
                        </TableCell>
                        <TableCell data-id="jzswq8w77" data-path="src/pages/Products/ProductList.tsx">
                          <Badge variant="outline" data-id="hon8kpyv4" data-path="src/pages/Products/ProductList.tsx">
                            {debouncedSearchTerm ?
                          getSearchData(product.department || 'Convenience Store').highlightComponent :
                          product.department || 'Convenience Store'
                          }
                          </Badge>
                        </TableCell>
                        <TableCell data-id="tja925sjn" data-path="src/pages/Products/ProductList.tsx">
                          {debouncedSearchTerm ?
                        getSearchData(product.supplier || '-').highlightComponent :
                        product.supplier || '-'
                        }
                        </TableCell>
                        <TableCell data-id="2ed5zq0bu" data-path="src/pages/Products/ProductList.tsx">{formatDate(product.last_updated_date)}</TableCell>
                        <TableCell data-id="ilzlzxc8k" data-path="src/pages/Products/ProductList.tsx">{formatDate(product.last_shopping_date)}</TableCell>
                        <TableCell data-id="h9o5wgj8v" data-path="src/pages/Products/ProductList.tsx">
                          {product.case_price ? `$${product.case_price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell data-id="de1cqfqco" data-path="src/pages/Products/ProductList.tsx">{product.unit_per_case || '-'}</TableCell>
                        <TableCell data-id="8xxfe4zj9" data-path="src/pages/Products/ProductList.tsx">
                          {product.unit_price ? `$${product.unit_price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell data-id="gvcfe406h" data-path="src/pages/Products/ProductList.tsx">
                          {product.retail_price ? `$${product.retail_price.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell data-id="7pq6gl3td" data-path="src/pages/Products/ProductList.tsx">
                          {(() => {
                          if (product.unit_price && product.retail_price && product.retail_price > 0) {
                            const margin = (product.retail_price - product.unit_price) / product.retail_price * 100;
                            return (
                              <Badge
                                variant={margin > 20 ? 'default' : margin > 10 ? 'secondary' : 'destructive'}
                                className="text-xs" data-id="93py8n7ws" data-path="src/pages/Products/ProductList.tsx">
                                  {margin.toFixed(1)}%
                                </Badge>);
                          }
                          return '-';
                        })()} 
                        </TableCell>
                        <TableCell data-id="l9c1abv6q" data-path="src/pages/Products/ProductList.tsx">
                          <div className="flex items-center space-x-2" data-id="wu5kfr14z" data-path="src/pages/Products/ProductList.tsx">
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('Viewing logs for product:', product.ID, product.product_name);
                              handleViewLogs(product.ID, product.product_name);
                            }}
                            title="View change logs" data-id="1gq3ylslg" data-path="src/pages/Products/ProductList.tsx">
                              <FileText className="w-4 h-4" data-id="coqqs1v3x" data-path="src/pages/Products/ProductList.tsx" />
                            </Button>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('Saving product:', product.ID);
                              handleSaveProduct(product.ID);
                            }}
                            disabled={savingProductId === product.ID}
                            title="Save product" data-id="d6aiaoqcp" data-path="src/pages/Products/ProductList.tsx">
                              {savingProductId === product.ID ?
                            <Loader2 className="w-4 h-4 animate-spin" data-id="86whprmfp" data-path="src/pages/Products/ProductList.tsx" /> :

                            <Save className="w-4 h-4" data-id="lkm8ei34z" data-path="src/pages/Products/ProductList.tsx" />
                            }
                            </Button>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('Deleting product:', product.ID);
                              handleDelete(product.ID);
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="Delete product" data-id="8q1xzfud0" data-path="src/pages/Products/ProductList.tsx">
                              <Trash2 className="w-4 h-4" data-id="k497aogsp" data-path="src/pages/Products/ProductList.tsx" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>);

                })}
                </TableBody>
              </Table>
            </ResponsiveTable>
          }

          {/* Loading Status and Infinite Scroll */}
          {products.length > 0 &&
          <div className="mt-6" data-id="m4aa6rld5" data-path="src/pages/Products/ProductList.tsx">
              <p className="text-sm text-gray-700 text-center mb-4" data-id="er7e69bp3" data-path="src/pages/Products/ProductList.tsx">
                {getDisplayText()}
              </p>
              
              {/* Loading trigger for infinite scroll */}
              {hasMoreProducts &&
            <div
              ref={loadingTriggerRef}
              className="flex items-center justify-center py-8" data-id="hkg96gs2v" data-path="src/pages/Products/ProductList.tsx">

                  {isLoadingMore ?
              <div className="flex items-center space-x-2 text-gray-500" data-id="9u8xoflva" data-path="src/pages/Products/ProductList.tsx">
                      <Loader2 className="w-5 h-5 animate-spin" data-id="kbxlmbr8a" data-path="src/pages/Products/ProductList.tsx" />
                      <span data-id="vi9t8n6nh" data-path="src/pages/Products/ProductList.tsx">Loading more products...</span>
                    </div> :

              <div className="text-gray-400 text-sm" data-id="agnv83oox" data-path="src/pages/Products/ProductList.tsx">
                      Scroll down to load more products
                    </div>
              }
                </div>
            }
              
              {!hasMoreProducts && totalCount > pageSize &&
            <div className="text-center py-4 text-sm text-gray-500" data-id="txy8dbwem" data-path="src/pages/Products/ProductList.tsx">
                  You've reached the end - all {totalCount} products loaded
                </div>
            }
            </div>
          }
        </CardContent>
      </Card>

      {/* Product Logs Modal */}
      {selectedProduct &&
      <ProductLogs
        isOpen={logsModalOpen}
        onClose={() => {
          setLogsModalOpen(false);
          setSelectedProduct(null);
        }}
        productId={selectedProduct.id}
        productName={selectedProduct.name} data-id="ec6cb0czv" data-path="src/pages/Products/ProductList.tsx" />
      }
    </ResponsiveStack>);
};

export default ProductList;