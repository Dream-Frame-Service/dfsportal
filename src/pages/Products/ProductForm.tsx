import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { ArrowLeft, Save, Calculator, Upload, Eye, Plus, Download, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import BarcodeScanner from '@/components/BarcodeScanner';
import { useAuth } from '@/contexts/AuthContext';
import { FormErrorBoundary } from '@/components/ErrorBoundary';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Vendor {
  id: number;
  vendor_name: string;
  is_active: boolean;
}

interface ProductCategory {
  id: number;
  category_name: string;
  department: string;
  is_active: boolean;
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { handleApiCall, handleError } = useErrorHandler({
    component: 'ProductForm',
    severity: 'high'
  });

  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [bulkUploadData, setBulkUploadData] = useState<any[]>([]);
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  const [formData, setFormData] = useState({
    product_name: '',
    weight: 0,
    weight_unit: 'lb',
    department: 'Convenience Store',
    merchant_id: '',
    last_updated_date: new Date().toISOString().split('T')[0],
    last_shopping_date: '',
    case_price: 0,
    unit_per_case: 1,
    unit_price: 0,
    retail_price: 0,
    profit_margin: 0,
    category: '',
    supplier: '',
    quantity_in_stock: 0,
    minimum_stock: 0,
    description: '',
    bar_code_case: '',
    bar_code_unit: '',
    serial_number: 0,
    overdue: false
  });

  const [originalData, setOriginalData] = useState<any>(null);

  // USA Weight Units
  const weightUnits = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'ton', label: 'Tons' },
  { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
  { value: 'gal', label: 'Gallons (gal)' },
  { value: 'qt', label: 'Quarts (qt)' },
  { value: 'pt', label: 'Pints (pt)' },
  { value: 'cup', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons (tbsp)' },
  { value: 'tsp', label: 'Teaspoons (tsp)' }];


  // Departments based on gas station categories
  const departments = [
  'Convenience Store',
  'Fuel & Oil',
  'Automotive',
  'Food & Beverages',
  'Tobacco Products',
  'Lottery & Gaming',
  'Health & Personal Care',
  'Electronics & Accessories',
  'Cleaning Supplies',
  'Office Supplies',
  'Snacks & Candy',
  'Hot Foods & Coffee',
  'Cold Beverages',
  'Energy Drinks',
  'Beer & Wine',
  'Ice & Frozen',
  'Phone Cards & Prepaid',
  'Car Accessories',
  'Gift Cards',
  'Pharmacy & Medicine'];


  useEffect(() => {
    fetchVendors();
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    } else {
      generateSerialNumber();
    }
  }, [id]);

  // Auto-calculate unit price when case price or unit per case changes
  useEffect(() => {
    if (formData.case_price > 0 && formData.unit_per_case > 0) {
      const calculatedUnitPrice = formData.case_price / formData.unit_per_case;
      setFormData((prev) => ({
        ...prev,
        unit_price: Math.round(calculatedUnitPrice * 100) / 100
      }));
    }
  }, [formData.case_price, formData.unit_per_case]);

  // Auto-calculate retail price when unit price changes
  useEffect(() => {
    if (formData.unit_price > 0) {
      const suggestedPrice = calculateSuggestedRetailPrice(formData.unit_price);
      // Only auto-update if retail price is 0 or very close to the previous suggestion
      if (formData.retail_price === 0) {
        setFormData((prev) => ({
          ...prev,
          retail_price: suggestedPrice
        }));
      }
    } else if (formData.unit_price === 0) {
      setFormData((prev) => ({
        ...prev,
        retail_price: 0
      }));
    }
  }, [formData.unit_price]);

  // Auto-calculate profit margin
  useEffect(() => {
    if (formData.unit_price > 0 && formData.retail_price > 0) {
      const margin = (formData.retail_price - formData.unit_price) / formData.retail_price * 100;
      setFormData((prev) => ({
        ...prev,
        profit_margin: Math.round(margin * 100) / 100
      }));
    } else {
      setFormData((prev) => ({ ...prev, profit_margin: 0 }));
    }
  }, [formData.unit_price, formData.retail_price]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('vendor_name', { ascending: true })
        .limit(100);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('category_name', { ascending: true })
        .limit(100);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSerialNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('serial_number')
        .order('serial_number', { ascending: false })
        .limit(1);

      if (error) throw error;
      const lastSerial = data?.[0]?.serial_number || 0;
      setFormData((prev) => ({ ...prev, serial_number: lastSerial + 1 }));
    } catch (error) {
      console.error('Error generating serial number:', error);
      setFormData((prev) => ({ ...prev, serial_number: 1 }));
    }
  };

  const fetchProduct = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        const product = data;
        const productData = {
          product_name: product.product_name || '',
          weight: product.weight || 0,
          weight_unit: product.weight_unit || 'lb',
          department: product.department || 'Convenience Store',
          merchant_id: product.merchant_id?.toString() || '',
          last_updated_date: product.last_updated_date ? product.last_updated_date.split('T')[0] : '',
          last_shopping_date: product.last_shopping_date ? product.last_shopping_date.split('T')[0] : '',
          case_price: product.case_price || 0,
          unit_per_case: product.unit_per_case || 1,
          unit_price: product.unit_price || 0,
          retail_price: product.retail_price || 0,
          profit_margin: 0, // Will be calculated by useEffect
          category: product.category || '',
          supplier: product.supplier || '',
          quantity_in_stock: product.quantity_in_stock || 0,
          minimum_stock: product.minimum_stock || 0,
          description: product.description || '',
          bar_code_case: product.bar_code_case || '',
          bar_code_unit: product.bar_code_unit || '',
          serial_number: product.serial_number || 0,
          overdue: product.overdue || false
        };
        setFormData(productData);
        setOriginalData(productData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate suggested retail price based on unit price with specific rules
  const calculateSuggestedRetailPrice = (unitPrice: number) => {
    if (unitPrice === 0) return 0;

    let markupPercentage = 0;
    if (unitPrice < 4) {
      markupPercentage = 65;
    } else if (unitPrice >= 4 && unitPrice < 6) {
      markupPercentage = 55;
    } else if (unitPrice >= 6 && unitPrice < 8) {
      markupPercentage = 45;
    } else if (unitPrice >= 8 && unitPrice < 10) {
      markupPercentage = 35;
    } else {
      markupPercentage = 25;
    }

    const suggestedPrice = unitPrice * (1 + markupPercentage / 100);

    // Round to closest .25, .49, .75, or .99
    const roundingTargets = [0.25, 0.49, 0.75, 0.99];
    const wholeNumber = Math.floor(suggestedPrice);
    const decimal = suggestedPrice - wholeNumber;

    let closestRounding = 0.99;
    let minDifference = Math.abs(decimal - 0.99);

    roundingTargets.forEach((target) => {
      const difference = Math.abs(decimal - target);
      if (difference < minDifference) {
        minDifference = difference;
        closestRounding = target;
      }
    });

    return wholeNumber + closestRounding;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBarcodeScanned = (field: string, barcode: string) => {
    setFormData((prev) => ({ ...prev, [field]: barcode }));
    toast({
      title: "Barcode Scanned",
      description: `Barcode ${barcode} added to ${field.replace('_', ' ')}`
    });
  };

  // Bulk upload functionality
  const handleBulkFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          const product: any = {};

          headers.forEach((header, i) => {
            let value = values[i]?.trim() || '';

            // Map CSV headers to database fields
            const fieldMapping: {[key: string]: string;} = {
              'product name': 'product_name',
              'product_name': 'product_name',
              'weight': 'weight',
              'weight unit': 'weight_unit',
              'weight_unit': 'weight_unit',
              'department': 'department',
              'merchant': 'merchant_id',
              'merchant_id': 'merchant_id',
              'last shopping date': 'last_shopping_date',
              'last_shopping_date': 'last_shopping_date',
              'case price': 'case_price',
              'case_price': 'case_price',
              'unit per case': 'unit_per_case',
              'unit_per_case': 'unit_per_case',
              'unit price': 'unit_price',
              'unit_price': 'unit_price',
              'retail price': 'retail_price',
              'retail_price': 'retail_price',
              'category': 'category',
              'supplier': 'supplier',
              'description': 'description'
            };

            const dbField = fieldMapping[header] || header;

            // Convert numeric fields
            if (['weight', 'case_price', 'unit_per_case', 'unit_price', 'retail_price', 'merchant_id'].includes(dbField)) {
              value = value ? parseFloat(value) || 0 : 0;
            }

            product[dbField] = value;
          });

          // Auto-calculate unit price if case price and unit per case are provided
          if (product.case_price > 0 && product.unit_per_case > 0 && !product.unit_price) {
            product.unit_price = Math.round(product.case_price / product.unit_per_case * 100) / 100;
          }

          // Calculate suggested retail price if unit price is available
          if (product.unit_price > 0 && !product.retail_price) {
            product.retail_price = calculateSuggestedRetailPrice(product.unit_price);
          }

          return product;
        });

        setBulkUploadData(data);
        setShowBulkPreview(true);

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to parse CSV file. Please check the format."
        });
      }
    };

    reader.readAsText(file);
  };

  const handleBulkSubmit = async () => {
    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User profile not found."
      });
      return;
    }

    setIsUploadingBulk(true);
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Get the latest serial number
      const serialResponse = await supabase
        .from('products')
        .select('serial_number')
        .order('serial_number', { ascending: false })
        .limit(1);

      let lastSerial = serialResponse.data?.[0]?.serial_number || 0;

      for (const productData of bulkUploadData) {
        try {
          if (!productData.product_name?.trim()) {
            errors.push(`Row ${successCount + errorCount + 1}: Product name is required`);
            errorCount++;
            continue;
          }

          const productPayload: any = {
            serial_number: lastSerial + successCount + 1,
            product_name: productData.product_name.trim(),
            last_updated_date: new Date().toISOString(),
            overdue: false,
            weight: productData.weight || 0,
            weight_unit: productData.weight_unit || 'lb',
            department: productData.department || 'Convenience Store',
            case_price: productData.case_price || 0,
            unit_per_case: productData.unit_per_case || 1,
            unit_price: productData.unit_price || 0,
            retail_price: productData.retail_price || 0,
            category: productData.category || '',
            supplier: productData.supplier || '',
            description: productData.description || '',
            quantity_in_stock: 0,
            minimum_stock: 0,
            bar_code_case: '',
            bar_code_unit: '',
            created_by: userProfile.user_id
          };

          if (productData.merchant_id) {
            productPayload.merchant_id = parseInt(productData.merchant_id);
          }

          if (productData.last_shopping_date) {
            productPayload.last_shopping_date = new Date(productData.last_shopping_date).toISOString();
          }

          const { error } = await supabase
            .from('products')
            .insert(productPayload);

          if (error) {
            errors.push(`${productData.product_name}: ${error}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`${productData.product_name || 'Unknown'}: ${errorMsg}`);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} products. ${errorCount > 0 ? `${errorCount} errors occurred.` : ''}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: `No products were imported. ${errorCount} errors occurred.`
        });
      }

      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }

      if (successCount > 0) {
        setShowBulkPreview(false);
        setBulkUploadData([]);
        navigate('/products');
      }
    } catch (error) {
      console.error('Bulk import error:', error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import product data."
      });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const logFieldChange = async (productId: number, fieldName: string, oldValue: any, newValue: any, userId: number) => {
    try {
      const { error } = await supabase
        .from('product_field_changes')
        .insert({
          product_id: productId,
          field_name: fieldName,
          old_value: oldValue?.toString() || '',
          new_value: newValue?.toString() || '',
          change_date: new Date().toISOString(),
          changed_by: userId
        });
      if (error) {
        console.error('Error logging field change:', error);
      }
    } catch (error) {
      console.error('Error logging field change:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Product name is required."
      });
      return;
    }

    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User profile not found."
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        last_updated_date: new Date().toISOString(),
        last_shopping_date: formData.last_shopping_date ? new Date(formData.last_shopping_date).toISOString() : null,
        merchant_id: formData.merchant_id ? parseInt(formData.merchant_id) : null,
        created_by: userProfile.user_id
      };

      const { error } = isEdit ?
        await supabase.from('products').update(payload).eq('id', parseInt(id!)) :
        await supabase.from('products').insert(payload);

      if (error) throw error;

      // Log changes for existing products
      if (isEdit && originalData && userProfile) {
        const fieldsToTrack = [
        'last_shopping_date',
        'case_price',
        'unit_per_case',
        'unit_price',
        'retail_price'];


        for (const field of fieldsToTrack) {
          const oldValue = originalData[field];
          const newValue = formData[field];

          if (oldValue !== newValue) {
            await logFieldChange(parseInt(id!), field, oldValue, newValue, userProfile.user_id);
          }
        }

        // Calculate and log profit margin changes
        const oldProfitMargin = originalData.unit_price > 0 && originalData.retail_price > 0 ?
        (originalData.retail_price - originalData.unit_price) / originalData.retail_price * 100 : 0;
        const newProfitMargin = formData.profit_margin;

        if (Math.abs(oldProfitMargin - newProfitMargin) > 0.01) {
          await logFieldChange(parseInt(id!), 'profit_margin', oldProfitMargin.toFixed(2), newProfitMargin.toFixed(2), userProfile.user_id);
        }
      }

      toast({
        title: "Success",
        description: `Product ${isEdit ? 'updated' : 'created'} successfully.`
      });

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} product.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedRetailPrice = calculateSuggestedRetailPrice(formData.unit_price);

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = [
    'Product Name,Weight,Weight Unit,Department,Merchant,Case Price,Unit Per Case,Unit Price,Retail Price,Category,Supplier,Description',
    'Example Product,12,oz,Food & Beverages,,24.00,24,1.00,1.99,Soft Drinks,Example Supplier,Example description'].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-id="bx12wklbd" data-path="src/pages/Products/ProductForm.tsx">
      {/* Header */}
      <div className="flex items-center justify-between" data-id="q5k5t85tc" data-path="src/pages/Products/ProductForm.tsx">
        <div className="flex items-center space-x-4" data-id="wlu98sixy" data-path="src/pages/Products/ProductForm.tsx">
          <Button variant="outline" size="sm" onClick={() => navigate('/products')} data-id="bdw35t5fy" data-path="src/pages/Products/ProductForm.tsx">
            <ArrowLeft className="w-4 h-4 mr-2" data-id="rtvwkpjqu" data-path="src/pages/Products/ProductForm.tsx" />
            Back to Products
          </Button>
          <div data-id="q5m983vey" data-path="src/pages/Products/ProductForm.tsx">
            <h1 className="text-2xl font-bold" data-id="41gy26pq3" data-path="src/pages/Products/ProductForm.tsx">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-muted-foreground" data-id="h07pjygjz" data-path="src/pages/Products/ProductForm.tsx">
              {isEdit ? 'Update product information' : 'Add a new product to your inventory'}
            </p>
          </div>
        </div>
        
        {/* Bulk Upload Dialog */}
        <Dialog open={showBulkPreview} onOpenChange={setShowBulkPreview} data-id="hi7kexvnf" data-path="src/pages/Products/ProductForm.tsx">
          <DialogTrigger asChild data-id="93g6amn9o" data-path="src/pages/Products/ProductForm.tsx">
            <Button variant="outline" data-id="uy4lxewlc" data-path="src/pages/Products/ProductForm.tsx">
              <Upload className="w-4 h-4 mr-2" data-id="h92678uku" data-path="src/pages/Products/ProductForm.tsx" />
              Bulk Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto" data-id="0nz2kj64x" data-path="src/pages/Products/ProductForm.tsx">
            <DialogHeader data-id="rmb9repv9" data-path="src/pages/Products/ProductForm.tsx">
              <DialogTitle data-id="s0xq7459l" data-path="src/pages/Products/ProductForm.tsx">Bulk Product Upload</DialogTitle>
              <DialogDescription data-id="hlbqg641c" data-path="src/pages/Products/ProductForm.tsx">
                Upload a CSV file with product data. Click "Download Template" for the correct format.
              </DialogDescription>
            </DialogHeader>
            
            {bulkUploadData.length === 0 ?
            <div className="space-y-4" data-id="otrmnjarm" data-path="src/pages/Products/ProductForm.tsx">
                <div className="flex justify-between items-center" data-id="jnbayeohh" data-path="src/pages/Products/ProductForm.tsx">
                  <h3 className="text-lg font-medium" data-id="iflfxutqr" data-path="src/pages/Products/ProductForm.tsx">Upload CSV File</h3>
                  <Button variant="outline" onClick={downloadTemplate} data-id="7citiads7" data-path="src/pages/Products/ProductForm.tsx">
                    <Download className="w-4 h-4 mr-2" data-id="6gsm7c3h7" data-path="src/pages/Products/ProductForm.tsx" />
                    Download Template
                  </Button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center" data-id="l6duwtega" data-path="src/pages/Products/ProductForm.tsx">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" data-id="bvz7kpd58" data-path="src/pages/Products/ProductForm.tsx" />
                  <div className="space-y-2" data-id="xqwub2p94" data-path="src/pages/Products/ProductForm.tsx">
                    <h3 className="text-lg font-medium" data-id="kjou9apny" data-path="src/pages/Products/ProductForm.tsx">Upload CSV File</h3>
                    <p className="text-sm text-gray-500" data-id="3xwvpr12u" data-path="src/pages/Products/ProductForm.tsx">Select a CSV file containing product data</p>
                    <Input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkFileUpload}
                    className="max-w-xs mx-auto" data-id="r8qynfi9q" data-path="src/pages/Products/ProductForm.tsx" />

                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="3dwp5fzxb" data-path="src/pages/Products/ProductForm.tsx">
                  <h4 className="font-medium text-blue-800 mb-2" data-id="u2zoncman" data-path="src/pages/Products/ProductForm.tsx">Required Columns:</h4>
                  <ul className="text-sm text-blue-700 space-y-1" data-id="rhkwpjqrw" data-path="src/pages/Products/ProductForm.tsx">
                    <li data-id="guya2pqun" data-path="src/pages/Products/ProductForm.tsx">• Product Name (required)</li>
                    <li data-id="tgq6dgo04" data-path="src/pages/Products/ProductForm.tsx">• Weight, Weight Unit, Department, Merchant</li>
                    <li data-id="jvpyf8maa" data-path="src/pages/Products/ProductForm.tsx">• Case Price, Unit Per Case, Unit Price, Retail Price</li>
                    <li data-id="44pem9vcv" data-path="src/pages/Products/ProductForm.tsx">• Category, Supplier, Description</li>
                  </ul>
                </div>
              </div> :

            <div className="space-y-4" data-id="13jnbnr6s" data-path="src/pages/Products/ProductForm.tsx">
                <div className="flex items-center justify-between" data-id="vl7z3re82" data-path="src/pages/Products/ProductForm.tsx">
                  <h3 className="text-lg font-medium" data-id="x7eodbrud" data-path="src/pages/Products/ProductForm.tsx">Preview Import Data ({bulkUploadData.length} products)</h3>
                  <div className="space-x-2" data-id="spwy9543p" data-path="src/pages/Products/ProductForm.tsx">
                    <Button variant="outline" onClick={() => {
                    setBulkUploadData([]);
                    setShowBulkPreview(false);
                  }} data-id="nf798ix7z" data-path="src/pages/Products/ProductForm.tsx">
                      Cancel
                    </Button>
                    <Button onClick={handleBulkSubmit} disabled={isUploadingBulk} data-id="s0l90qs0w" data-path="src/pages/Products/ProductForm.tsx">
                      {isUploadingBulk ? 'Importing...' : 'Import Products'}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg max-h-96 overflow-auto" data-id="8knn1mgms" data-path="src/pages/Products/ProductForm.tsx">
                  <Table data-id="p9k1dq6d0" data-path="src/pages/Products/ProductForm.tsx">
                    <TableHeader data-id="1d31nj8tz" data-path="src/pages/Products/ProductForm.tsx">
                      <TableRow data-id="7ay0v18xb" data-path="src/pages/Products/ProductForm.tsx">
                        <TableHead data-id="3aba6dsmt" data-path="src/pages/Products/ProductForm.tsx">Product Name</TableHead>
                        <TableHead data-id="h7safkm9m" data-path="src/pages/Products/ProductForm.tsx">Weight</TableHead>
                        <TableHead data-id="fnhhv5m54" data-path="src/pages/Products/ProductForm.tsx">Department</TableHead>
                        <TableHead data-id="eoxwo0so8" data-path="src/pages/Products/ProductForm.tsx">Case Price</TableHead>
                        <TableHead data-id="lietay58u" data-path="src/pages/Products/ProductForm.tsx">Unit Price</TableHead>
                        <TableHead data-id="vob1mrzrz" data-path="src/pages/Products/ProductForm.tsx">Retail Price</TableHead>
                        <TableHead data-id="9qxs82bs8" data-path="src/pages/Products/ProductForm.tsx">Profit %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody data-id="nyr9xf477" data-path="src/pages/Products/ProductForm.tsx">
                      {bulkUploadData.map((product, index) => {
                      const profit = product.unit_price > 0 && product.retail_price > 0 ?
                      ((product.retail_price - product.unit_price) / product.retail_price * 100).toFixed(1) :
                      '0';

                      return (
                        <TableRow key={index} data-id="0w8qpnjpw" data-path="src/pages/Products/ProductForm.tsx">
                            <TableCell className="font-medium" data-id="ztfzojfdy" data-path="src/pages/Products/ProductForm.tsx">{product.product_name}</TableCell>
                            <TableCell data-id="qxwlle97c" data-path="src/pages/Products/ProductForm.tsx">{product.weight} {product.weight_unit}</TableCell>
                            <TableCell data-id="nawb7vr9m" data-path="src/pages/Products/ProductForm.tsx">{product.department}</TableCell>
                            <TableCell data-id="6ackpc71i" data-path="src/pages/Products/ProductForm.tsx">${product.case_price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell data-id="ag0ksahtm" data-path="src/pages/Products/ProductForm.tsx">${product.unit_price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell data-id="4yr04zme5" data-path="src/pages/Products/ProductForm.tsx">${product.retail_price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell data-id="iecxknd33" data-path="src/pages/Products/ProductForm.tsx">
                              <Badge variant={parseFloat(profit) > 20 ? 'default' : 'secondary'} data-id="kbs73ub5d" data-path="src/pages/Products/ProductForm.tsx">
                                {profit}%
                              </Badge>
                            </TableCell>
                          </TableRow>);

                    })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>

      {/* Form */}
      <Card data-id="ybi5y9x0t" data-path="src/pages/Products/ProductForm.tsx">
        <CardHeader data-id="c0sro9agp" data-path="src/pages/Products/ProductForm.tsx">
          <CardTitle data-id="yblpzeajq" data-path="src/pages/Products/ProductForm.tsx">{isEdit ? 'Edit Product' : 'New Product'}</CardTitle>
          <CardDescription data-id="4snm2u3bc" data-path="src/pages/Products/ProductForm.tsx">
            {isEdit ? 'Update the product information below' : 'Enter the product details below'}
          </CardDescription>
        </CardHeader>
        <CardContent data-id="9gdcuh4ed" data-path="src/pages/Products/ProductForm.tsx">
          <FormErrorBoundary
            formName="Product Form"
            showDataRecovery={true}
            onFormReset={() => {
              if (isEdit) {
                fetchProduct();
              } else {
                setFormData({
                  product_name: '',
                  weight: 0,
                  weight_unit: 'lb',
                  department: 'Convenience Store',
                  merchant_id: '',
                  last_updated_date: new Date().toISOString().split('T')[0],
                  last_shopping_date: '',
                  case_price: 0,
                  unit_per_case: 1,
                  unit_price: 0,
                  retail_price: 0,
                  profit_margin: 0,
                  category: '',
                  supplier: '',
                  quantity_in_stock: 0,
                  minimum_stock: 0,
                  description: '',
                  bar_code_case: '',
                  bar_code_unit: '',
                  serial_number: 0,
                  overdue: false
                });
                generateSerialNumber();
              }
            }} data-id="cktkquzxl" data-path="src/pages/Products/ProductForm.tsx">

            <form onSubmit={handleSubmit} className="space-y-6" data-id="b47e9aqag" data-path="src/pages/Products/ProductForm.tsx">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="xjmwfhyiz" data-path="src/pages/Products/ProductForm.tsx">
                <div className="space-y-2" data-id="kglmcicue" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="product_name" data-id="phoq35hdt" data-path="src/pages/Products/ProductForm.tsx">Product Name *</Label>
                  <Input
                    id="product_name"
                    placeholder="Enter product name"
                    value={formData.product_name}
                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                    required data-id="rjrlm6qa7" data-path="src/pages/Products/ProductForm.tsx" />

                </div>

                <div className="space-y-2" data-id="5wnmbfxgz" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="category" data-id="4rvslpa8b" data-path="src/pages/Products/ProductForm.tsx">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)} data-id="cj8kg9x7v" data-path="src/pages/Products/ProductForm.tsx">

                    <SelectTrigger data-id="h53ofq07e" data-path="src/pages/Products/ProductForm.tsx">
                      <SelectValue placeholder="Select category" data-id="lt19useuz" data-path="src/pages/Products/ProductForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="tu1fli4s7" data-path="src/pages/Products/ProductForm.tsx">
                      {categories.map((cat) =>
                      <SelectItem key={cat.id} value={cat.category_name} data-id="dxg4exzsk" data-path="src/pages/Products/ProductForm.tsx">
                          {cat.category_name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weight and Measurement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="kcclizqrd" data-path="src/pages/Products/ProductForm.tsx">
                <div className="space-y-2" data-id="rbfly9jkc" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="weight" data-id="5kewfxhrq" data-path="src/pages/Products/ProductForm.tsx">Weight</Label>
                  <NumberInput
                    id="weight"
                    step={0.01}
                    min={0}
                    value={formData.weight}
                    onChange={(value) => handleInputChange('weight', value)} data-id="ntm2991pu" data-path="src/pages/Products/ProductForm.tsx" />

                </div>

                <div className="space-y-2" data-id="dpy100zkt" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="weight_unit" data-id="lmhazo1o2" data-path="src/pages/Products/ProductForm.tsx">Weight Unit (USA Measurements)</Label>
                  <Select
                    value={formData.weight_unit}
                    onValueChange={(value) => handleInputChange('weight_unit', value)} data-id="ykhzxj6ot" data-path="src/pages/Products/ProductForm.tsx">

                    <SelectTrigger data-id="ibo0fui0o" data-path="src/pages/Products/ProductForm.tsx">
                      <SelectValue placeholder="Select unit" data-id="wikid8ydq" data-path="src/pages/Products/ProductForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="o46bsqe2q" data-path="src/pages/Products/ProductForm.tsx">
                      {weightUnits.map((unit) =>
                      <SelectItem key={unit.value} value={unit.value} data-id="vr3gmqpg9" data-path="src/pages/Products/ProductForm.tsx">
                          {unit.label}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground" data-id="ilqscfzlv" data-path="src/pages/Products/ProductForm.tsx">
                    Combined: {formData.weight} {formData.weight_unit}
                  </p>
                </div>

                <div className="space-y-2" data-id="qsxt1su8b" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="department" data-id="ui00cry10" data-path="src/pages/Products/ProductForm.tsx">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange('department', value)} data-id="9e5cpkg0a" data-path="src/pages/Products/ProductForm.tsx">

                    <SelectTrigger data-id="o17mjjiz5" data-path="src/pages/Products/ProductForm.tsx">
                      <SelectValue placeholder="Select department" data-id="onct4n5nl" data-path="src/pages/Products/ProductForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="5w12yqkd7" data-path="src/pages/Products/ProductForm.tsx">
                      {departments.map((dept) =>
                      <SelectItem key={dept} value={dept} data-id="f42auxyjl" data-path="src/pages/Products/ProductForm.tsx">
                          {dept}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Merchant and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="8ev602vbv" data-path="src/pages/Products/ProductForm.tsx">
                <div className="space-y-2" data-id="2a4vpkma2" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="merchant_id" data-id="lyuaqm4jk" data-path="src/pages/Products/ProductForm.tsx">Merchant</Label>
                  <Select
                    value={formData.merchant_id}
                    onValueChange={(value) => handleInputChange('merchant_id', value)} data-id="07ewjpxem" data-path="src/pages/Products/ProductForm.tsx">

                    <SelectTrigger data-id="r6bhwqo6v" data-path="src/pages/Products/ProductForm.tsx">
                      <SelectValue placeholder="Select merchant" data-id="gcgdwhskz" data-path="src/pages/Products/ProductForm.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="stxcuz9bv" data-path="src/pages/Products/ProductForm.tsx">
                      {vendors.map((vendor) =>
                      <SelectItem key={vendor.id} value={vendor.id.toString()} data-id="8t00h2uci" data-path="src/pages/Products/ProductForm.tsx">
                          {vendor.vendor_name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2" data-id="7xotykfm4" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="last_updated_date" data-id="d4wo4tj5g" data-path="src/pages/Products/ProductForm.tsx">Last Updated Date</Label>
                  <Input
                    id="last_updated_date"
                    type="date"
                    value={formData.last_updated_date}
                    onChange={(e) => handleInputChange('last_updated_date', e.target.value)} data-id="afigj8q8r" data-path="src/pages/Products/ProductForm.tsx" />

                </div>

                <div className="space-y-2" data-id="joc9bnqgp" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="last_shopping_date" data-id="nfkbcc485" data-path="src/pages/Products/ProductForm.tsx">Last Shopping Date</Label>
                  <Input
                    id="last_shopping_date"
                    type="date"
                    value={formData.last_shopping_date}
                    onChange={(e) => handleInputChange('last_shopping_date', e.target.value)} data-id="4brvqnedm" data-path="src/pages/Products/ProductForm.tsx" />

                </div>
              </div>

              {/* Pricing Information */}
              <Separator data-id="9o0gwbwwq" data-path="src/pages/Products/ProductForm.tsx" />
              <div className="space-y-4" data-id="wbwknuhfy" data-path="src/pages/Products/ProductForm.tsx">
                <h3 className="text-lg font-medium" data-id="yu7bdekm3" data-path="src/pages/Products/ProductForm.tsx">Pricing Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="iwqed2cq2" data-path="src/pages/Products/ProductForm.tsx">
                  <div className="space-y-2" data-id="h13mzseq5" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="case_price" data-id="3yq7lv3rt" data-path="src/pages/Products/ProductForm.tsx">Case Price ($)</Label>
                    <NumberInput
                      id="case_price"
                      step={0.01}
                      min={0}
                      value={formData.case_price}
                      onChange={(value) => handleInputChange('case_price', value)} data-id="8lif39lep" data-path="src/pages/Products/ProductForm.tsx" />

                  </div>

                  <div className="space-y-2" data-id="8ilbz7re9" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="unit_per_case" data-id="lu93lxaue" data-path="src/pages/Products/ProductForm.tsx">Unit Per Case</Label>
                    <NumberInput
                      id="unit_per_case"
                      min={1}
                      value={formData.unit_per_case}
                      onChange={(value) => handleInputChange('unit_per_case', value)} data-id="xpreug7g1" data-path="src/pages/Products/ProductForm.tsx" />

                  </div>

                  <div className="space-y-2" data-id="sqleu9w7o" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="unit_price" data-id="bw3hnk8lw" data-path="src/pages/Products/ProductForm.tsx">Unit Price ($)</Label>
                    <NumberInput
                      id="unit_price"
                      step={0.01}
                      min={0}
                      value={formData.unit_price}
                      onChange={(value) => handleInputChange('unit_price', value)} data-id="bhjy2741g" data-path="src/pages/Products/ProductForm.tsx" />

                    {formData.case_price > 0 && formData.unit_per_case > 0 &&
                    <p className="text-xs text-green-600 flex items-center" data-id="mig3drq7h" data-path="src/pages/Products/ProductForm.tsx">
                        <Calculator className="w-3 h-3 mr-1" data-id="9wwkfvxsf" data-path="src/pages/Products/ProductForm.tsx" />
                        Auto-calculated from case price
                      </p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="7szavq7wt" data-path="src/pages/Products/ProductForm.tsx">
                  <div className="space-y-2" data-id="s44v0bd4c" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="retail_price" data-id="sw3slkr61" data-path="src/pages/Products/ProductForm.tsx">Retail Price ($)</Label>
                    <NumberInput
                      id="retail_price"
                      step={0.01}
                      min={0}
                      value={formData.retail_price}
                      onChange={(value) => handleInputChange('retail_price', value)} data-id="nhp6pvirq" data-path="src/pages/Products/ProductForm.tsx" />

                    {/* Auto-calculation indicator */}
                    {formData.unit_price > 0 && Math.abs(formData.retail_price - suggestedRetailPrice) < 0.01 &&
                    <p className="text-xs text-green-600 flex items-center" data-id="c6694zlow" data-path="src/pages/Products/ProductForm.tsx">
                        <Calculator className="w-3 h-3 mr-1" data-id="7j2ylnx8a" data-path="src/pages/Products/ProductForm.tsx" />
                        Auto-calculated from unit price
                      </p>
                    }
                    
                    {/* Pricing Suggestion */}
                    {formData.unit_price > 0 && Math.abs(formData.retail_price - suggestedRetailPrice) >= 0.01 &&
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg" data-id="7ggtw6coy" data-path="src/pages/Products/ProductForm.tsx">
                        <div className="flex items-center justify-between" data-id="ggamngcao" data-path="src/pages/Products/ProductForm.tsx">
                          <div className="flex items-center space-x-2" data-id="1l6080zer" data-path="src/pages/Products/ProductForm.tsx">
                            <DollarSign className="w-4 h-4 text-red-600" data-id="r1rmqer56" data-path="src/pages/Products/ProductForm.tsx" />
                            <span className="text-sm font-medium text-red-800" data-id="hs4p8lfhn" data-path="src/pages/Products/ProductForm.tsx">
                              Suggested: ${suggestedRetailPrice.toFixed(2)}
                            </span>
                          </div>
                          <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleInputChange('retail_price', suggestedRetailPrice)}
                          className="text-xs h-6 px-2" data-id="rhpckr8hc" data-path="src/pages/Products/ProductForm.tsx">

                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-red-700 mt-1" data-id="on56s08f2" data-path="src/pages/Products/ProductForm.tsx">
                          {formData.unit_price < 4 ? '+65%' :
                        formData.unit_price < 6 ? '+55%' :
                        formData.unit_price < 8 ? '+45%' :
                        formData.unit_price < 10 ? '+35%' : '+25%'} markup, 
                          rounded to .25/.49/.75/.99
                        </p>
                      </div>
                    }
                  </div>

                  <div className="space-y-2" data-id="orczwe7jq" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="profit_margin" data-id="sq9xzux3z" data-path="src/pages/Products/ProductForm.tsx">Profit Margin (%)</Label>
                    <div className="flex items-center space-x-2" data-id="jf7rutm1u" data-path="src/pages/Products/ProductForm.tsx">
                      <NumberInput
                        id="profit_margin"
                        step={0.01}
                        value={formData.profit_margin}
                        disabled
                        className="bg-muted" data-id="uiwlfbodg" data-path="src/pages/Products/ProductForm.tsx" />

                      <Badge variant={formData.profit_margin > 20 ? 'default' : 'secondary'} data-id="3fkohoku4" data-path="src/pages/Products/ProductForm.tsx">
                        {formData.profit_margin > 20 ? 'Good' : 'Low'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground" data-id="p6l0gv7lg" data-path="src/pages/Products/ProductForm.tsx">Auto-calculated from unit and retail price</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <Separator data-id="rqx6u6vw5" data-path="src/pages/Products/ProductForm.tsx" />
              <div className="space-y-4" data-id="rpa5p141o" data-path="src/pages/Products/ProductForm.tsx">
                <h3 className="text-lg font-medium" data-id="kkeqlckhp" data-path="src/pages/Products/ProductForm.tsx">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="t1uth5etf" data-path="src/pages/Products/ProductForm.tsx">
                  <div className="space-y-2" data-id="br0f51o36" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="supplier" data-id="nwezqijbs" data-path="src/pages/Products/ProductForm.tsx">Supplier</Label>
                    <Input
                      id="supplier"
                      placeholder="Enter supplier name"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)} data-id="txymx9tx5" data-path="src/pages/Products/ProductForm.tsx" />

                  </div>

                  <div className="space-y-2" data-id="9x4r9yo2t" data-path="src/pages/Products/ProductForm.tsx">
                    <Label data-id="2f1u5b9f8" data-path="src/pages/Products/ProductForm.tsx">Stock Information</Label>
                    <div className="grid grid-cols-2 gap-2" data-id="qa7poz02u" data-path="src/pages/Products/ProductForm.tsx">
                      <NumberInput
                        placeholder="Current Stock"
                        value={formData.quantity_in_stock}
                        onChange={(value) => handleInputChange('quantity_in_stock', value)}
                        min={0} data-id="aizhy7ulb" data-path="src/pages/Products/ProductForm.tsx" />

                      <NumberInput
                        placeholder="Min Stock"
                        value={formData.minimum_stock}
                        onChange={(value) => handleInputChange('minimum_stock', value)}
                        min={0} data-id="dckcsjdop" data-path="src/pages/Products/ProductForm.tsx" />

                    </div>
                    <p className="text-xs text-muted-foreground" data-id="hbdkhswsk" data-path="src/pages/Products/ProductForm.tsx">Current stock / Minimum stock level</p>
                  </div>
                </div>

                <div className="space-y-2" data-id="i6cs0n1a2" data-path="src/pages/Products/ProductForm.tsx">
                  <Label htmlFor="description" data-id="vr0yez4f7" data-path="src/pages/Products/ProductForm.tsx">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)} data-id="pi8xzw20m" data-path="src/pages/Products/ProductForm.tsx" />

                </div>

                {/* Barcode Scanning */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="bcdeqdoq5" data-path="src/pages/Products/ProductForm.tsx">
                  <div className="space-y-2" data-id="00ykzf331" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="bar_code_case" data-id="sx2pox7kt" data-path="src/pages/Products/ProductForm.tsx">Barcode (Case)</Label>
                    <div className="flex space-x-2" data-id="6ri7xrix9" data-path="src/pages/Products/ProductForm.tsx">
                      <Input
                        id="bar_code_case"
                        placeholder="Scan or enter case barcode"
                        value={formData.bar_code_case}
                        onChange={(e) => handleInputChange('bar_code_case', e.target.value)} data-id="bzbisylmd" data-path="src/pages/Products/ProductForm.tsx" />

                      <BarcodeScanner
                        onScanned={(barcode) => handleBarcodeScanned('bar_code_case', barcode)} data-id="98bp73w7a" data-path="src/pages/Products/ProductForm.tsx" />

                    </div>
                  </div>

                  <div className="space-y-2" data-id="x7tmyo56s" data-path="src/pages/Products/ProductForm.tsx">
                    <Label htmlFor="bar_code_unit" data-id="hdxeaxie5" data-path="src/pages/Products/ProductForm.tsx">Barcode (Unit)</Label>
                    <div className="flex space-x-2" data-id="s3j3g1f3f" data-path="src/pages/Products/ProductForm.tsx">
                      <Input
                        id="bar_code_unit"
                        placeholder="Scan or enter unit barcode"
                        value={formData.bar_code_unit}
                        onChange={(e) => handleInputChange('bar_code_unit', e.target.value)} data-id="5irm9j9k9" data-path="src/pages/Products/ProductForm.tsx" />

                      <BarcodeScanner
                        onScanned={(barcode) => handleBarcodeScanned('bar_code_unit', barcode)} data-id="eshdnhw4l" data-path="src/pages/Products/ProductForm.tsx" />

                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6" data-id="2pgb4f3ov" data-path="src/pages/Products/ProductForm.tsx">
                <Button type="button" variant="outline" onClick={() => navigate('/products')} data-id="t2fbqbrwk" data-path="src/pages/Products/ProductForm.tsx">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} data-id="fp7m4hvvp" data-path="src/pages/Products/ProductForm.tsx">
                  <Save className="w-4 h-4 mr-2" data-id="e2dbj22gs" data-path="src/pages/Products/ProductForm.tsx" />
                  {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </FormErrorBoundary>
        </CardContent>
      </Card>
    </div>);

};

export default ProductForm;