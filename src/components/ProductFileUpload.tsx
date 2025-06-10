import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, Download, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFileUpload from '@/components/EnhancedFileUpload';

interface ProductFileUploadProps {
  onDataImport: (data: any[]) => void;
  disabled?: boolean;
}

interface ParsedProduct {
  original: any;
  mapped: any;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
  productName: string;
  weight: number;
  profitMargin: number;
  isOverdue: boolean;
}

const ProductFileUpload: React.FC<ProductFileUploadProps> = ({ onDataImport, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'enhanced'>('enhanced');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [existingProducts, setExistingProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = [
    'product_name',
    'weight',
    'weight_unit',
    'department',
    'bar_code_case',
    'bar_code_unit',
    'case_price',
    'unit_per_case',
    'unit_price',
    'retail_price',
    'category',
    'supplier',
    'quantity_in_stock',
    'minimum_stock',
    'description'];


    const csvContent = `${headers.join(',')  }\n` +
    `Sample Product,1.5,lb,Convenience Store,123456789012,987654321098,24.99,12,2.99,3.49,Snacks,Sample Supplier,100,10,Sample product description`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Field mapping for header names - now includes exact matches and variations
  const fieldMapping: {[key: string]: string;} = {
    // Exact field name matches (priority)
    'product_name': 'product_name',
    'weight': 'weight',
    'weight_unit': 'weight_unit',
    'department': 'department',
    'bar_code_case': 'bar_code_case',
    'bar_code_unit': 'bar_code_unit',
    'case_price': 'case_price',
    'unit_per_case': 'unit_per_case',
    'unit_price': 'unit_price',
    'retail_price': 'retail_price',
    'category': 'category',
    'supplier': 'supplier',
    'quantity_in_stock': 'quantity_in_stock',
    'minimum_stock': 'minimum_stock',
    'description': 'description',

    // Product name variations
    'product name': 'product_name',
    'productname': 'product_name',
    'name': 'product_name',
    'item': 'product_name',
    'title': 'product_name',
    'product': 'product_name',

    // Weight variations
    'weight unit': 'weight_unit',
    'weightunit': 'weight_unit',
    'unit': 'weight_unit',
    'wt unit': 'weight_unit',
    'wt_unit': 'weight_unit',

    // Department variations
    'dept': 'department',
    'dep': 'department',

    // Category variations
    'cat': 'category',
    'type': 'category',
    'group': 'category',

    // Barcode case variations
    'barcode case': 'bar_code_case',
    'barcode_case': 'bar_code_case',
    'case barcode': 'bar_code_case',
    'casebarcode': 'bar_code_case',
    'case_barcode': 'bar_code_case',
    'upc case': 'bar_code_case',
    'upc_case': 'bar_code_case',

    // Barcode unit variations
    'barcode unit': 'bar_code_unit',
    'barcode_unit': 'bar_code_unit',
    'unit barcode': 'bar_code_unit',
    'unitbarcode': 'bar_code_unit',
    'unit_barcode': 'bar_code_unit',
    'upc unit': 'bar_code_unit',
    'upc_unit': 'bar_code_unit',
    'upc': 'bar_code_unit',

    // Case price variations
    'case price': 'case_price',
    'caseprice': 'case_price',
    'price case': 'case_price',
    'case_cost': 'case_price',
    'case cost': 'case_price',
    'wholesale price': 'case_price',
    'wholesale_price': 'case_price',

    // Unit per case variations
    'unit per case': 'unit_per_case',
    'unitpercase': 'unit_per_case',
    'units per case': 'unit_per_case',
    'unitspercase': 'unit_per_case',
    'units_per_case': 'unit_per_case',
    'pack size': 'unit_per_case',
    'pack_size': 'unit_per_case',
    'case size': 'unit_per_case',
    'case_size': 'unit_per_case',

    // Unit price variations
    'unit price': 'unit_price',
    'unitprice': 'unit_price',
    'price unit': 'unit_price',
    'unit_cost': 'unit_price',
    'unit cost': 'unit_price',
    'cost': 'unit_price',
    'price': 'unit_price',
    'cost per unit': 'unit_price',
    'per unit': 'unit_price',
    'individual price': 'unit_price',

    // Retail price variations
    'retail price': 'retail_price',
    'retailprice': 'retail_price',
    'selling price': 'retail_price',
    'sale price': 'retail_price',
    'sell price': 'retail_price',
    'sellprice': 'retail_price',
    'selling_price': 'retail_price',
    'sale_price': 'retail_price',
    'msrp': 'retail_price',

    // Supplier variations
    'vendor': 'supplier',
    'manufacturer': 'supplier',
    'brand': 'supplier',
    'company': 'supplier',
    'mfg': 'supplier',
    'distributor': 'supplier',

    // Quantity variations
    'quantity': 'quantity_in_stock',
    'stock': 'quantity_in_stock',
    'quantity in stock': 'quantity_in_stock',
    'current stock': 'quantity_in_stock',
    'qty': 'quantity_in_stock',
    'qty_in_stock': 'quantity_in_stock',
    'on hand': 'quantity_in_stock',
    'on_hand': 'quantity_in_stock',
    'inventory': 'quantity_in_stock',

    // Minimum stock variations
    'minimum stock': 'minimum_stock',
    'min stock': 'minimum_stock',
    'reorder level': 'minimum_stock',
    'reorder_level': 'minimum_stock',
    'min_stock': 'minimum_stock',
    'minimum_stock_level': 'minimum_stock',
    'min_qty': 'minimum_stock',
    'min quantity': 'minimum_stock',

    // Description variations
    'desc': 'description',
    'notes': 'description',
    'details': 'description',
    'comments': 'description',
    'remarks': 'description',
    'note': 'description',

    // Additional field variations for better mapping
    'last shopping date': 'last_shopping_date',
    'last_shopping_date': 'last_shopping_date',
    'lastshoppingdate': 'last_shopping_date',
    'last purchase': 'last_shopping_date',
    'last_purchase': 'last_shopping_date',
    'purchase date': 'last_shopping_date',
    'purchase_date': 'last_shopping_date'
  };

  const mapHeaderToField = (header: string): string => {
    const originalHeader = header.trim();

    // First try exact match (case-sensitive)
    if (fieldMapping[originalHeader]) {
      return fieldMapping[originalHeader];
    }

    // Then try exact match (case-insensitive)
    const lowerHeader = originalHeader.toLowerCase();
    if (fieldMapping[lowerHeader]) {
      return fieldMapping[lowerHeader];
    }

    // Finally try cleaned version
    const cleanHeader = lowerHeader.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
    return fieldMapping[cleanHeader] || originalHeader;
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          const mappedField = mapHeaderToField(header);
          row[mappedField] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const fetchExistingProducts = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(11726, {
        PageNo: 1,
        PageSize: 1000, // Get all products to check for duplicates
        OrderByField: 'product_name',
        IsAsc: true,
        Filters: []
      });

      if (error) throw error;
      setExistingProducts(data?.List || []);
      return data?.List || [];
    } catch (error) {
      console.error('Error fetching existing products:', error);
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Could not fetch existing products for duplicate check."
      });
      return [];
    }
  };

  // Calculate profit margin based on cost and retail price
  const calculateProfitMargin = (unitPrice: number, retailPrice: number): number => {
    if (!unitPrice || !retailPrice || unitPrice <= 0 || retailPrice <= 0) {
      return 0;
    }
    return (retailPrice - unitPrice) / retailPrice * 100;
  };

  // Check if product is overdue for restocking (if no last_shopping_date or older than 90 days)
  const calculateOverdueStatus = (lastShoppingDate?: string, quantityInStock?: number, minimumStock?: number): boolean => {
    // If we have stock data and current stock is below minimum, it's overdue
    if (quantityInStock !== undefined && minimumStock !== undefined && quantityInStock < minimumStock) {
      return true;
    }

    // If no last shopping date provided, consider as not overdue (new products)
    if (!lastShoppingDate) {
      return false;
    }

    try {
      const lastDate = new Date(lastShoppingDate);
      const now = new Date();
      const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 90; // Consider overdue if no shopping for more than 90 days
    } catch {
      return false; // Invalid date format
    }
  };

  const validateAndCheckDuplicates = (importedData: any[], existingProducts: any[]): ParsedProduct[] => {
    const existingNames = new Set(existingProducts.map((p) => p.product_name?.toLowerCase().trim()));
    const existingWeights = new Set(existingProducts.map((p) => `${p.product_name?.toLowerCase().trim()}_${p.weight || 0}`));
    const importingNames = new Set(); // Track names within the current import to prevent duplicates
    const importingWeights = new Set(); // Track name+weight combinations

    return importedData.map((row, index) => {
      const errors: string[] = [];
      const productName = row.product_name || row.name || row.productname || row.item || row.title || '';
      const cleanProductName = productName.trim();
      const weight = parseFloat(row.weight) || 0;
      const nameWeightKey = `${cleanProductName.toLowerCase()}_${weight}`;

      // Validate required field (only product name)
      if (!cleanProductName) {
        errors.push('Product name is required');
      }

      // Check for product name duplicates against existing products
      const isDuplicateNameInDB = cleanProductName && existingNames.has(cleanProductName.toLowerCase());
      if (isDuplicateNameInDB) {
        errors.push('Product name already exists in database');
      }

      // Check for product name duplicates within the import file
      const isDuplicateNameInImport = cleanProductName && importingNames.has(cleanProductName.toLowerCase());
      if (isDuplicateNameInImport) {
        errors.push('Duplicate product name found in import file');
      }

      // Check for name+weight combination duplicates against existing products
      const isDuplicateWeightInDB = cleanProductName && weight > 0 && existingWeights.has(nameWeightKey);
      if (isDuplicateWeightInDB) {
        errors.push('Product with same name and weight already exists in database');
      }

      // Check for name+weight combination duplicates within the import file
      const isDuplicateWeightInImport = cleanProductName && weight > 0 && importingWeights.has(nameWeightKey);
      if (isDuplicateWeightInImport) {
        errors.push('Duplicate product name and weight combination found in import file');
      }

      // Add to tracking sets if not empty
      if (cleanProductName) {
        importingNames.add(cleanProductName.toLowerCase());
        if (weight > 0) {
          importingWeights.add(nameWeightKey);
        }
      }

      // Map the data to proper format - only populate fields that have actual values
      const mapped: any = {
        product_name: cleanProductName
      };

      // Only add fields if they have meaningful values from the file
      if (row.weight !== undefined && row.weight !== '' && !isNaN(parseFloat(row.weight))) {
        mapped.weight = parseFloat(row.weight);
      }
      if (row.weight_unit && row.weight_unit.trim()) {
        mapped.weight_unit = row.weight_unit.trim();
      } else {
        mapped.weight_unit = 'lb'; // Default weight unit
      }
      if (row.department && row.department.trim()) {
        mapped.department = row.department.trim();
      } else {
        mapped.department = 'Convenience Store'; // Default department
      }

      // Validate department against allowed values
      const validDepartments = [
      'Convenience Store', 'Fuel & Oil', 'Automotive', 'Food & Beverages',
      'Tobacco Products', 'Lottery & Gaming', 'Health & Personal Care',
      'Electronics & Accessories', 'Cleaning Supplies', 'Office Supplies',
      'Snacks & Candy', 'Hot Foods & Coffee', 'Cold Beverages', 'Energy Drinks',
      'Beer & Wine', 'Ice & Frozen', 'Phone Cards & Prepaid', 'Car Accessories',
      'Gift Cards', 'Pharmacy & Medicine', 'Household Items', 'Safety & Emergency',
      'Tools & Hardware', 'Sporting Goods', 'Pet Supplies'];


      if (mapped.department && !validDepartments.includes(mapped.department)) {
        mapped.department = 'Convenience Store'; // Reset to default if invalid
      }

      // Validate category against allowed values
      const validCategories = [
      'Food Items', 'Beverages', 'Tobacco', 'Automotive', 'Personal Care',
      'Electronics', 'Household', 'Office Supplies', 'Health & Medicine',
      'Fuel Products', 'Motor Oil', 'Car Care', 'Snacks', 'Candy & Gum',
      'Energy Drinks', 'Soft Drinks', 'Water & Juice', 'Beer & Wine',
      'Cigarettes', 'Cigars', 'Vaping Products', 'Lottery Tickets',
      'Scratch Cards', 'Phone Cards', 'Gift Cards', 'Ice Products',
      'Hot Food', 'Coffee & Tea', 'Dairy Products', 'Frozen Foods',
      'Emergency Supplies', 'Pet Food', 'Cleaning Products', 'Paper Products',
      'Batteries', 'Phone Accessories', 'Sunglasses', 'Travel Items', 'Maps & Guides'];


      if (mapped.category && !validCategories.includes(mapped.category)) {
        // Try to auto-map common category variations
        const categoryMappings: {[key: string]: string;} = {
          'food': 'Food Items',
          'drink': 'Beverages',
          'drinks': 'Beverages',
          'beverage': 'Beverages',
          'snack': 'Snacks',
          'candy': 'Candy & Gum',
          'gum': 'Candy & Gum',
          'cigarette': 'Cigarettes',
          'cigar': 'Cigars',
          'vape': 'Vaping Products',
          'lottery': 'Lottery Tickets',
          'scratch': 'Scratch Cards',
          'phone': 'Phone Cards',
          'gift': 'Gift Cards',
          'ice': 'Ice Products',
          'coffee': 'Coffee & Tea',
          'tea': 'Coffee & Tea',
          'dairy': 'Dairy Products',
          'frozen': 'Frozen Foods',
          'pet': 'Pet Food',
          'cleaning': 'Cleaning Products',
          'paper': 'Paper Products',
          'battery': 'Batteries',
          'batteries': 'Batteries'
        };

        const lowerCategory = mapped.category.toLowerCase();
        mapped.category = categoryMappings[lowerCategory] || mapped.category;
      }
      if (row.bar_code_case && row.bar_code_case.trim()) {
        mapped.bar_code_case = row.bar_code_case.trim();
      }
      if (row.bar_code_unit && row.bar_code_unit.trim()) {
        mapped.bar_code_unit = row.bar_code_unit.trim();
      }
      if (row.case_price !== undefined && row.case_price !== '' && !isNaN(parseFloat(row.case_price))) {
        mapped.case_price = parseFloat(row.case_price);
      }
      if (row.unit_per_case !== undefined && row.unit_per_case !== '' && !isNaN(parseInt(row.unit_per_case))) {
        mapped.unit_per_case = parseInt(row.unit_per_case);
      } else if (mapped.case_price && mapped.unit_price) {
        // Try to calculate unit_per_case if case_price and unit_price are available
        mapped.unit_per_case = Math.round(mapped.case_price / mapped.unit_price);
      }
      if (row.unit_price !== undefined && row.unit_price !== '' && !isNaN(parseFloat(row.unit_price))) {
        mapped.unit_price = parseFloat(row.unit_price);
      }
      if (row.retail_price !== undefined && row.retail_price !== '' && !isNaN(parseFloat(row.retail_price))) {
        mapped.retail_price = parseFloat(row.retail_price);
      }
      if (row.category && row.category.trim()) {
        mapped.category = row.category.trim();
      }
      if (row.supplier && row.supplier.trim()) {
        mapped.supplier = row.supplier.trim();
      }
      if (row.quantity_in_stock !== undefined && row.quantity_in_stock !== '' && !isNaN(parseInt(row.quantity_in_stock))) {
        mapped.quantity_in_stock = parseInt(row.quantity_in_stock);
      }
      if (row.minimum_stock !== undefined && row.minimum_stock !== '' && !isNaN(parseInt(row.minimum_stock))) {
        mapped.minimum_stock = parseInt(row.minimum_stock);
      }
      if (row.description && row.description.trim()) {
        mapped.description = row.description.trim();
      }
      if (row.last_shopping_date && row.last_shopping_date.trim()) {
        try {
          mapped.last_shopping_date = new Date(row.last_shopping_date).toISOString();
        } catch {































































































































































































          // Invalid date format, ignore
        }} // Calculate profit margin
      const unitPrice = mapped.unit_price || 0;const retailPrice = mapped.retail_price || 0;const profitMargin = calculateProfitMargin(unitPrice, retailPrice); // Calculate overdue status
      const isOverdue = calculateOverdueStatus(mapped.last_shopping_date, mapped.quantity_in_stock, mapped.minimum_stock); // Auto-populate calculated fields
      if (profitMargin > 0) {mapped.profit_margin = profitMargin;}mapped.overdue = isOverdue;mapped.updated_at = new Date().toISOString();mapped.last_updated_date = new Date().toISOString();const isDuplicate = isDuplicateNameInDB || isDuplicateNameInImport || isDuplicateWeightInDB || isDuplicateWeightInImport;return { original: row, mapped, isValid: errors.length === 0, isDuplicate, errors, productName: cleanProductName, weight, profitMargin, isOverdue };});};const handleFileUpload = async () => {if (!file) {toast({ variant: "destructive", title: "No File Selected", description: "Please select a CSV file to upload." });return;}setIsProcessing(true);try {const text = await file.text();const parsedData = parseCSV(text);if (parsedData.length === 0) {throw new Error('No valid data found in file');} // Fetch existing products for duplicate checking
      const existing = await fetchExistingProducts(); // Validate and check for duplicates
      const validatedProducts = validateAndCheckDuplicates(parsedData, existing);if (validatedProducts.length === 0) {throw new Error('No valid products found in file');}setParsedProducts(validatedProducts);setShowPreview(true);const validCount = validatedProducts.filter((p) => p.isValid).length;const duplicateCount = validatedProducts.filter((p) => p.isDuplicate).length;const errorCount = validatedProducts.filter((p) => !p.isValid).length;toast({ title: "File Processed", description: `Found ${validatedProducts.length} products. ${validCount} valid, ${duplicateCount} duplicates, ${errorCount} errors.` });} catch (error) {console.error('File upload error:', error);toast({ variant: "destructive", title: "Import Failed", description: error instanceof Error ? error.message : "Failed to process file." });} finally {setIsProcessing(false);}};const handleConfirmImport = () => {const validProducts = parsedProducts.filter((p) => p.isValid && !p.isDuplicate);if (validProducts.length === 0) {toast({ variant: "destructive", title: "No Valid Products", description: "No valid products to import." });return;}const dataToImport = validProducts.map((p) => p.mapped);onDataImport(dataToImport); // Reset state
    setIsOpen(false);setFile(null);setParsedProducts([]);setShowPreview(false);};const handleCloseDialog = () => {setIsOpen(false);setFile(null);setParsedProducts([]);setShowPreview(false);};const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {const selectedFile = e.target.files?.[0];if (selectedFile) {if (!selectedFile.name.endsWith('.csv')) {toast({ variant: "destructive", title: "Invalid File Type", description: "Please select a CSV file." });return;}setFile(selectedFile);}};const handleEnhancedFileSelect = (selectedFile: File) => {if (!selectedFile.name.endsWith('.csv') && !selectedFile.type.includes('image')) {toast({ variant: "destructive", title: "Invalid File Type", description: "Please select a CSV file or image." });return;}setFile(selectedFile);};return <Dialog open={isOpen} onOpenChange={setIsOpen} data-id="2cyhjncvk" data-path="src/components/ProductFileUpload.tsx">
      <DialogTrigger asChild data-id="oeodg2959" data-path="src/components/ProductFileUpload.tsx">
        <Button variant="outline" disabled={disabled} data-id="a2nuid11l" data-path="src/components/ProductFileUpload.tsx">
          <Upload className="w-4 h-4 mr-2" data-id="ge99px9fo" data-path="src/components/ProductFileUpload.tsx" />
          Import Products
        </Button>
      </DialogTrigger>
      <DialogContent className={showPreview ? "sm:max-w-6xl max-h-[80vh] overflow-y-auto" : "sm:max-w-2xl"} data-id="bhwlht53e" data-path="src/components/ProductFileUpload.tsx">
        <DialogHeader data-id="lue9uh4l4" data-path="src/components/ProductFileUpload.tsx">
          <DialogTitle data-id="fep258ln3" data-path="src/components/ProductFileUpload.tsx">{showPreview ? 'Import Preview' : 'Import Product Data'}</DialogTitle>
        </DialogHeader>
        
        {!showPreview ? <div className="space-y-6" data-id="ryw8ufzb9" data-path="src/components/ProductFileUpload.tsx">
            {/* Upload method selector */}
            <div className="flex gap-4 justify-center" data-id="no4is14p8" data-path="src/components/ProductFileUpload.tsx">
              <Button variant={uploadMethod === 'enhanced' ? 'default' : 'outline'} onClick={() => setUploadMethod('enhanced')} className="flex items-center gap-2" data-id="jmmrom5ja" data-path="src/components/ProductFileUpload.tsx">
                <Upload className="h-4 w-4" data-id="3br0om185" data-path="src/components/ProductFileUpload.tsx" />
                Enhanced Upload
              </Button>
              <Button variant={uploadMethod === 'manual' ? 'default' : 'outline'} onClick={() => setUploadMethod('manual')} className="flex items-center gap-2" data-id="9yahamsq7" data-path="src/components/ProductFileUpload.tsx">
                <FileText className="h-4 w-4" data-id="5yq0rg9xy" data-path="src/components/ProductFileUpload.tsx" />
                Manual Upload
              </Button>
            </div>

            {uploadMethod === 'enhanced' ? (/* Enhanced upload with camera option */<div className="space-y-4" data-id="ichqg3vow" data-path="src/components/ProductFileUpload.tsx">
                {/* Compression info banner */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" data-id="o39fpcpv8" data-path="src/components/ProductFileUpload.tsx">
                  <div className="flex items-center gap-2 text-blue-700" data-id="s33147dr4" data-path="src/components/ProductFileUpload.tsx">
                    <Zap className="h-4 w-4" data-id="7ns46r8c0" data-path="src/components/ProductFileUpload.tsx" />
                    <span className="text-sm font-medium" data-id="z0wkpgpeq" data-path="src/components/ProductFileUpload.tsx">Auto-compression enabled for large images</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1" data-id="uda6aur8p" data-path="src/components/ProductFileUpload.tsx">
                    Images over 1MB will be automatically optimized for faster uploads and processing
                  </p>
                </div>
                
                <EnhancedFileUpload onFileSelect={handleEnhancedFileSelect} accept=".csv,image/*" label="Select CSV File or Take Photo" currentFile={file?.name} maxSize={10} allowCamera={true} data-id="2pr6qmouw" data-path="src/components/ProductFileUpload.tsx" />

                {file && <div className="p-3 bg-gray-50 rounded-lg" data-id="vb8rjl89w" data-path="src/components/ProductFileUpload.tsx">
                    <p className="text-sm font-medium" data-id="89d6gmdcy" data-path="src/components/ProductFileUpload.tsx">Selected file:</p>
                    <p className="text-sm text-gray-600" data-id="ijzpaxk89" data-path="src/components/ProductFileUpload.tsx">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1" data-id="ku03xpc0k" data-path="src/components/ProductFileUpload.tsx">
                      {file.type.includes('image') ? 'Image file - OCR processing will be applied' : 'CSV file ready for import'}
                    </p>
                  </div>}
              </div>) : (/* Traditional manual upload */<div className="space-y-2" data-id="rtvetve28" data-path="src/components/ProductFileUpload.tsx">
                <Label htmlFor="file" data-id="t1ckqp4fh" data-path="src/components/ProductFileUpload.tsx">Select CSV File</Label>
                <Input id="file" type="file" accept=".csv" onChange={handleFileChange} data-id="l0lth5uj2" data-path="src/components/ProductFileUpload.tsx" />
                {file && <p className="text-sm text-muted-foreground" data-id="232olsxry" data-path="src/components/ProductFileUpload.tsx">
                    Selected: {file.name}
                  </p>}
              </div>)}

            {/* Header mapping info */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200" data-id="4ezub8k3s" data-path="src/components/ProductFileUpload.tsx">
              <div className="flex items-center gap-2 text-green-700" data-id="royrnr69x" data-path="src/components/ProductFileUpload.tsx">
                <CheckCircle className="h-4 w-4" data-id="we78x1m7s" data-path="src/components/ProductFileUpload.tsx" />
                <span className="text-sm font-medium" data-id="2ona3yjyf" data-path="src/components/ProductFileUpload.tsx">Smart Header Mapping</span>
              </div>
              <p className="text-xs text-green-600 mt-1" data-id="uuwlhol76" data-path="src/components/ProductFileUpload.tsx">
                Headers are automatically mapped to database fields. Exact matches take priority. Product Name is required. Products with same name OR same name+weight combination will be flagged as duplicates. Profit Margin and Overdue status are calculated automatically.
              </p>
            </div>

            <div className="space-y-2" data-id="3nxpm77zi" data-path="src/components/ProductFileUpload.tsx">
              <Label data-id="jinhy2smb" data-path="src/components/ProductFileUpload.tsx">Download Template</Label>
              <Button type="button" variant="outline" onClick={downloadTemplate} className="w-full" data-id="h317ztr29" data-path="src/components/ProductFileUpload.tsx">
                <Download className="w-4 h-4 mr-2" data-id="qz3jqpoae" data-path="src/components/ProductFileUpload.tsx" />
                Download CSV Template
              </Button>
              <p className="text-sm text-muted-foreground" data-id="ba3qxjbay" data-path="src/components/ProductFileUpload.tsx">
                Download a template file with the correct format and sample data.
              </p>
            </div>

            <div className="flex space-x-2" data-id="ggofnmpzj" data-path="src/components/ProductFileUpload.tsx">
              <Button onClick={handleFileUpload} disabled={!file || isProcessing} className="flex-1" data-id="wg450pgse" data-path="src/components/ProductFileUpload.tsx">
                {isProcessing ? <>
                    <FileText className="w-4 h-4 mr-2 animate-spin" data-id="fgm1m4skl" data-path="src/components/ProductFileUpload.tsx" />
                    Processing...
                  </> : <>
                    <Upload className="w-4 h-4 mr-2" data-id="6mdjyxa9n" data-path="src/components/ProductFileUpload.tsx" />
                    Process File
                  </>}
              </Button>
              <Button variant="outline" onClick={handleCloseDialog} data-id="7en7nkhka" data-path="src/components/ProductFileUpload.tsx">
                Cancel
              </Button>
            </div>
          </div> : (/* Preview Section */<div className="space-y-6" data-id="mk07h8bsa" data-path="src/components/ProductFileUpload.tsx">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="7rjw5ouc5" data-path="src/components/ProductFileUpload.tsx">
              <Card data-id="rqzkih86f" data-path="src/components/ProductFileUpload.tsx">
                <CardContent className="p-4" data-id="ejcjb503j" data-path="src/components/ProductFileUpload.tsx">
                  <div className="text-center" data-id="uc6bcsxs1" data-path="src/components/ProductFileUpload.tsx">
                    <p className="text-2xl font-bold text-blue-600" data-id="nlvlpiju7" data-path="src/components/ProductFileUpload.tsx">{parsedProducts.length}</p>
                    <p className="text-sm text-muted-foreground" data-id="2rw6p21s0" data-path="src/components/ProductFileUpload.tsx">Total Products</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-id="xshj85zwy" data-path="src/components/ProductFileUpload.tsx">
                <CardContent className="p-4" data-id="byddmnna2" data-path="src/components/ProductFileUpload.tsx">
                  <div className="text-center" data-id="12yohbk7j" data-path="src/components/ProductFileUpload.tsx">
                    <p className="text-2xl font-bold text-green-600" data-id="2s7nqgjrf" data-path="src/components/ProductFileUpload.tsx">{parsedProducts.filter((p) => p.isValid && !p.isDuplicate).length}</p>
                    <p className="text-sm text-muted-foreground" data-id="6rdwe53x0" data-path="src/components/ProductFileUpload.tsx">Valid</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-id="piqz2v6al" data-path="src/components/ProductFileUpload.tsx">
                <CardContent className="p-4" data-id="nm6grb6tq" data-path="src/components/ProductFileUpload.tsx">
                  <div className="text-center" data-id="gl2cfehv2" data-path="src/components/ProductFileUpload.tsx">
                    <p className="text-2xl font-bold text-yellow-600" data-id="rmjeyp751" data-path="src/components/ProductFileUpload.tsx">{parsedProducts.filter((p) => p.isDuplicate).length}</p>
                    <p className="text-sm text-muted-foreground" data-id="4eguz2mgc" data-path="src/components/ProductFileUpload.tsx">Duplicates</p>
                  </div>
                </CardContent>
              </Card>
              <Card data-id="h3y69zqxf" data-path="src/components/ProductFileUpload.tsx">
                <CardContent className="p-4" data-id="4zziy25r7" data-path="src/components/ProductFileUpload.tsx">
                  <div className="text-center" data-id="hjbzo18nm" data-path="src/components/ProductFileUpload.tsx">
                    <p className="text-2xl font-bold text-red-600" data-id="ued2600p4" data-path="src/components/ProductFileUpload.tsx">{parsedProducts.filter((p) => !p.isValid).length}</p>
                    <p className="text-sm text-muted-foreground" data-id="1yakhdd6x" data-path="src/components/ProductFileUpload.tsx">Errors</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products table */}
            <div className="border rounded-lg max-h-96 overflow-y-auto" data-id="feqmmf45f" data-path="src/components/ProductFileUpload.tsx">
              <Table data-id="nwerfygi7" data-path="src/components/ProductFileUpload.tsx">
                <TableHeader data-id="mmrl8uh4x" data-path="src/components/ProductFileUpload.tsx">
                  <TableRow data-id="aqahpgnra" data-path="src/components/ProductFileUpload.tsx">
                    <TableHead data-id="q6bq3b3a7" data-path="src/components/ProductFileUpload.tsx">Status</TableHead>
                    <TableHead data-id="nbhfyp3dw" data-path="src/components/ProductFileUpload.tsx">Product Name</TableHead>
                    <TableHead data-id="lsipgiasz" data-path="src/components/ProductFileUpload.tsx">Weight</TableHead>
                    <TableHead data-id="j5chzbwen" data-path="src/components/ProductFileUpload.tsx">Mapped Fields</TableHead>
                    <TableHead data-id="7k5zv3y49" data-path="src/components/ProductFileUpload.tsx">Price Info</TableHead>
                    <TableHead data-id="6yq7t0z4x" data-path="src/components/ProductFileUpload.tsx">Stock</TableHead>
                    <TableHead data-id="nqvax6t3n" data-path="src/components/ProductFileUpload.tsx">Calculated</TableHead>
                    <TableHead data-id="0hsgxcjtd" data-path="src/components/ProductFileUpload.tsx">Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-id="jriph9ke4" data-path="src/components/ProductFileUpload.tsx">
                  {parsedProducts.map((product, index) => {// Count non-empty mapped fields (excluding product_name)
                  const mappedFieldsCount = Object.entries(product.mapped).filter(([key, value]) => key !== 'product_name' && value !== undefined && value !== '' && value !== 0).length;return <TableRow key={index} data-id="vxa4tl2bp" data-path="src/components/ProductFileUpload.tsx">
                      <TableCell data-id="g8oph3wa4" data-path="src/components/ProductFileUpload.tsx">
                        {product.isValid && !product.isDuplicate ? <Badge variant="default" className="bg-green-100 text-green-800" data-id="k93hjienz" data-path="src/components/ProductFileUpload.tsx">
                            <CheckCircle className="w-3 h-3 mr-1" data-id="kxn5pr06e" data-path="src/components/ProductFileUpload.tsx" />
                            Valid
                          </Badge> :
                      product.isDuplicate ?
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" data-id="vv26gyafa" data-path="src/components/ProductFileUpload.tsx">
                            <AlertTriangle className="w-3 h-3 mr-1" data-id="oox2bsis2" data-path="src/components/ProductFileUpload.tsx" />
                            Duplicate
                          </Badge> :

                      <Badge variant="destructive" data-id="819gpq0iw" data-path="src/components/ProductFileUpload.tsx">
                            <XCircle className="w-3 h-3 mr-1" data-id="14li9l8s6" data-path="src/components/ProductFileUpload.tsx" />
                            Error
                          </Badge>
                      }
                      </TableCell>
                      <TableCell className="font-medium" data-id="cqqq1gwzr" data-path="src/components/ProductFileUpload.tsx">{product.productName || 'N/A'}</TableCell>
                      <TableCell data-id="gstobgqwa" data-path="src/components/ProductFileUpload.tsx">
                        {product.weight > 0 ?
                      <span className="text-sm" data-id="z4v7223eb" data-path="src/components/ProductFileUpload.tsx">{product.weight} {product.mapped.weight_unit || 'lb'}</span> :

                      <span className="text-sm text-gray-400" data-id="ohmible8c" data-path="src/components/ProductFileUpload.tsx">N/A</span>
                      }
                      </TableCell>
                      <TableCell data-id="dbljuluju" data-path="src/components/ProductFileUpload.tsx">
                        <div className="flex items-center gap-1" data-id="cz0tlfvd8" data-path="src/components/ProductFileUpload.tsx">
                          <span className="text-sm" data-id="8iaa5l4rl" data-path="src/components/ProductFileUpload.tsx">{mappedFieldsCount} fields</span>
                          {mappedFieldsCount > 0 &&
                        <Badge variant="outline" className="text-xs" data-id="jxox98bpa" data-path="src/components/ProductFileUpload.tsx">
                              {mappedFieldsCount > 5 ? 'Complete' : 'Partial'}
                            </Badge>
                        }
                        </div>
                      </TableCell>
                      <TableCell data-id="odnv4k9fc" data-path="src/components/ProductFileUpload.tsx">
                        <div className="text-xs" data-id="otxqlt9xy" data-path="src/components/ProductFileUpload.tsx">
                          {product.mapped.retail_price > 0 &&
                        <div data-id="s4jp2alcy" data-path="src/components/ProductFileUpload.tsx">Retail: ${product.mapped.retail_price.toFixed(2)}</div>
                        }
                          {product.mapped.unit_price > 0 &&
                        <div data-id="flymztmy8" data-path="src/components/ProductFileUpload.tsx">Unit: ${product.mapped.unit_price.toFixed(2)}</div>
                        }
                          {product.mapped.case_price > 0 &&
                        <div data-id="4im0edh7v" data-path="src/components/ProductFileUpload.tsx">Case: ${product.mapped.case_price.toFixed(2)}</div>
                        }
                          {!product.mapped.retail_price && !product.mapped.unit_price && !product.mapped.case_price && 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell data-id="zwkzcc7ji" data-path="src/components/ProductFileUpload.tsx">
                        <div className="text-xs" data-id="mly22fpmz" data-path="src/components/ProductFileUpload.tsx">
                          {product.mapped.quantity_in_stock !== undefined ?
                        <div data-id="sjywq89an" data-path="src/components/ProductFileUpload.tsx">Current: {product.mapped.quantity_in_stock}</div> :
                        null}
                          {product.mapped.minimum_stock !== undefined ?
                        <div data-id="2vt3fsqur" data-path="src/components/ProductFileUpload.tsx">Min: {product.mapped.minimum_stock}</div> :
                        null}
                          {product.mapped.quantity_in_stock === undefined && product.mapped.minimum_stock === undefined && 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell data-id="enbbc0k1l" data-path="src/components/ProductFileUpload.tsx">
                        <div className="text-xs space-y-1" data-id="h4pnvcsiq" data-path="src/components/ProductFileUpload.tsx">
                          {product.profitMargin > 0 &&
                        <div className="flex items-center gap-1" data-id="frc8685fm" data-path="src/components/ProductFileUpload.tsx">
                              <span data-id="8zwdam8zr" data-path="src/components/ProductFileUpload.tsx">Profit:</span>
                              <Badge variant={product.profitMargin > 20 ? "default" : "secondary"} className="text-xs" data-id="pyz7vl8yz" data-path="src/components/ProductFileUpload.tsx">
                                {product.profitMargin.toFixed(1)}%
                              </Badge>
                            </div>
                        }
                          <div className="flex items-center gap-1" data-id="0ptau1t31" data-path="src/components/ProductFileUpload.tsx">
                            <span data-id="sx2y2e49a" data-path="src/components/ProductFileUpload.tsx">Status:</span>
                            <Badge variant={product.isOverdue ? "destructive" : "default"} className="text-xs" data-id="yr3geu9kk" data-path="src/components/ProductFileUpload.tsx">
                              {product.isOverdue ? 'Overdue' : 'Current'}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell data-id="iooufszzc" data-path="src/components/ProductFileUpload.tsx">
                        {product.errors.length > 0 &&
                      <div className="text-xs text-red-600" data-id="l4ggd0b87" data-path="src/components/ProductFileUpload.tsx">
                            {product.errors.join(', ')}
                          </div>
                      }
                      </TableCell>
                    </TableRow>;

                })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center" data-id="fjl99lc7f" data-path="src/components/ProductFileUpload.tsx">
              <Button
            variant="outline"
            onClick={() => setShowPreview(false)} data-id="on0wnp5yb" data-path="src/components/ProductFileUpload.tsx">
                Back to Upload
              </Button>
              <div className="flex space-x-2" data-id="lji9umh5d" data-path="src/components/ProductFileUpload.tsx">
                <Button
              variant="outline"
              onClick={handleCloseDialog} data-id="di938ia9g" data-path="src/components/ProductFileUpload.tsx">
                  Cancel
                </Button>
                <Button
              onClick={handleConfirmImport}
              disabled={parsedProducts.filter((p) => p.isValid && !p.isDuplicate).length === 0}
              className="bg-green-600 hover:bg-green-700" data-id="o0dhy2zk7" data-path="src/components/ProductFileUpload.tsx">
                  <CheckCircle className="w-4 h-4 mr-2" data-id="k2ygf4wto" data-path="src/components/ProductFileUpload.tsx" />
                  Import {parsedProducts.filter((p) => p.isValid && !p.isDuplicate).length} Products
                </Button>
              </div>
            </div>
          </div>)
      }
      </DialogContent>
    </Dialog>;

};

export default ProductFileUpload;