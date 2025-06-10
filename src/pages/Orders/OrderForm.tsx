import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Save, ArrowLeft, Camera, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductSearchBar from '@/components/ProductSearchBar';
import ProductSelectionDialog from '@/components/ProductSelectionDialog';
import { supabase } from '@/lib/supabase';

interface Product {
  ID: number;
  product_name: string;
  product_code: string;
  bar_code_case: string;
  bar_code_unit: string;
  price: number;
  retail_price: number;
  category: string;
  supplier: string;
  quantity_in_stock: number;
  unit_per_case: number;
  weight: number;
  weight_unit: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  unitType: string;
  subtotal: number;
}

interface OrderFormData {
  order_number: string;
  station: string;
  notes: string;
  items: OrderItem[];
  total_amount: number;
}

const OrderForm: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [formData, setFormData] = useState<OrderFormData>({
    order_number: '',
    station: 'MOBIL',
    notes: '',
    items: [],
    total_amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<{[key: number]: number;}>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const stations = ['MOBIL', 'AMOCO ROSEDALE', 'AMOCO BROOKLYN'];

  // Enhanced barcode scanner with camera access
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef) {
        videoRef.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions."
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const searchProductsByBarcode = async (barcode: string) => {
    try {
      setLoading(true);

      // Search for products matching the barcode
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`bar_code_case.eq.${barcode},bar_code_unit.eq.${barcode}`)
        .limit(10);

      if (error) throw error;

      const products = data || [];
      setMatchedProducts(products);

      if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: `No products found with barcode: ${barcode}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Products Found",
          description: `Found ${products.length} product(s) matching barcode: ${barcode}`
        });
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateBarcodeCapture = () => {
    // Simulate barcode detection for demo purposes
    // In production, this would use a real barcode detection library
    const simulatedBarcode = '123456789012';
    searchProductsByBarcode(simulatedBarcode);
    setScannerOpen(false);
    stopCamera();
  };

  const addProductToOrder = (product: Product, quantity: number = 1, unitType: string = 'pieces') => {
    let pricePerUnit = product.price;

    // Adjust price based on unit type
    if (unitType === 'cases' && product.unit_per_case > 0) {
      pricePerUnit = product.price * product.unit_per_case;
    }

    const subtotal = pricePerUnit * quantity;

    const newItem: OrderItem = {
      product,
      quantity,
      unitType,
      subtotal
    };

    // Check if product already exists in order with same unit type
    const existingItemIndex = formData.items.findIndex(
      (item) => item.product.ID === product.ID && item.unitType === unitType
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...formData.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      let newPricePerUnit = updatedItems[existingItemIndex].product.price;

      if (unitType === 'cases' && product.unit_per_case > 0) {
        newPricePerUnit = product.price * product.unit_per_case;
      }

      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: newPricePerUnit * newQuantity
      };
    } else {
      // Add new item
      updatedItems = [...formData.items, newItem];
    }

    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));

    setMatchedProducts([]);
    setSelectedQuantity({});

    toast({
      title: "Product Added",
      description: `${quantity} ${unitType} of ${product.product_name} added to order`
    });
  };

  const updateItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemIndex);
      return;
    }

    const updatedItems = [...formData.items];
    const item = updatedItems[itemIndex];
    let pricePerUnit = item.product.price;

    if (item.unitType === 'cases' && item.product.unit_per_case > 0) {
      pricePerUnit = item.product.price * item.product.unit_per_case;
    }

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: newQuantity,
      subtotal: pricePerUnit * newQuantity
    };

    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));
  };

  const removeItem = (itemIndex: number) => {
    const updatedItems = formData.items.filter((_, index) => index !== itemIndex);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total_amount: newTotal
    }));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowSelectionDialog(true);
  };

  const handleProductConfirm = (product: Product, quantity: number, unitType: string) => {
    addProductToOrder(product, quantity, unitType);
    setShowSelectionDialog(false);
    setSelectedProduct(null);
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    return `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order",
        variant: "destructive"
      });
      return;
    }

    if (!formData.station) {
      toast({
        title: "Error",
        description: "Please select a delivery station",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const orderNumber = formData.order_number || generateOrderNumber();

      const orderData = {
        order_number: orderNumber,
        vendor_id: 1, // Default vendor for barcode orders
        order_date: new Date().toISOString(),
        station: formData.station,
        total_amount: formData.total_amount,
        status: 'Pending',
        notes: `${formData.notes  }\n\nItems:\n${formData.items.map((item) =>
        `- ${item.product.product_name} (${item.product.product_code}) x${item.quantity} ${item.unitType} = $${item.subtotal.toFixed(2)}`
        ).join('\n')}`,
        created_by: 1
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderData);
        
      if (error) throw error;

      toast({
        title: "Success",
        description: "Order created successfully"
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-id="0pyrrmwh1" data-path="src/pages/Orders/OrderForm.tsx">
      {/* Station Selection Card - Primary Selection */}
      <Card className="border-2 border-primary/20" data-id="0eua6gv07" data-path="src/pages/Orders/OrderForm.tsx">
        <CardHeader data-id="ixga767n8" data-path="src/pages/Orders/OrderForm.tsx">
          <div className="flex items-center justify-between" data-id="4l0wcm9y4" data-path="src/pages/Orders/OrderForm.tsx">
            <div data-id="dj3d5ikpw" data-path="src/pages/Orders/OrderForm.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="ti14ij8pz" data-path="src/pages/Orders/OrderForm.tsx">
                <ShoppingCart className="w-6 h-6" data-id="ierrfj0ok" data-path="src/pages/Orders/OrderForm.tsx" />
                <span data-id="gs8bnexoh" data-path="src/pages/Orders/OrderForm.tsx">Create Order - Station Selection</span>
              </CardTitle>
              <CardDescription data-id="z3i1wlhaa" data-path="src/pages/Orders/OrderForm.tsx">
                First, select the station for this order, then add products
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/orders')} data-id="xzmeawgtt" data-path="src/pages/Orders/OrderForm.tsx">
              <ArrowLeft className="w-4 h-4 mr-2" data-id="p6rbs575a" data-path="src/pages/Orders/OrderForm.tsx" />
              Back to Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent data-id="fcnauv34o" data-path="src/pages/Orders/OrderForm.tsx">
          <div className="space-y-4" data-id="1mcogms5m" data-path="src/pages/Orders/OrderForm.tsx">
            <div className="space-y-2" data-id="9902e07dq" data-path="src/pages/Orders/OrderForm.tsx">
              <Label htmlFor="station-selector" className="text-lg font-semibold" data-id="frbpir74k" data-path="src/pages/Orders/OrderForm.tsx">Select Delivery Station *</Label>
              <Select
                value={selectedStation}
                onValueChange={(value) => {
                  setSelectedStation(value);
                  setFormData((prev) => ({ ...prev, station: value }));
                }} data-id="x8h93mjsv" data-path="src/pages/Orders/OrderForm.tsx">
                <SelectTrigger className="text-lg p-4 h-12" data-id="ebi3pxc6g" data-path="src/pages/Orders/OrderForm.tsx">
                  <SelectValue placeholder="Choose a station to begin creating your order" data-id="bdldvv3s4" data-path="src/pages/Orders/OrderForm.tsx" />
                </SelectTrigger>
                <SelectContent data-id="608lb1o1o" data-path="src/pages/Orders/OrderForm.tsx">
                  {stations.map((station) =>
                  <SelectItem key={station} value={station} className="text-lg p-3" data-id="13wwub84t" data-path="src/pages/Orders/OrderForm.tsx">
                      {station}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedStation &&
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-id="q0iafqshg" data-path="src/pages/Orders/OrderForm.tsx">
                <p className="text-green-800 font-medium" data-id="sptj95zmk" data-path="src/pages/Orders/OrderForm.tsx">
                  📍 Selected Station: <span className="font-bold" data-id="6c08r5a2g" data-path="src/pages/Orders/OrderForm.tsx">{selectedStation}</span>
                </p>
                <p className="text-green-600 text-sm mt-1" data-id="dh54amp05" data-path="src/pages/Orders/OrderForm.tsx">
                  You can now add products to your order for this station.
                </p>
              </div>
            }
          </div>
        </CardContent>
      </Card>

      {/* Content Section - Only show when station is selected */}
      {selectedStation &&
      <Card data-id="gs64qjgwg" data-path="src/pages/Orders/OrderForm.tsx">
          <CardHeader data-id="fdb2u8uon" data-path="src/pages/Orders/OrderForm.tsx">
            <div className="flex items-center justify-between" data-id="6mb3zf6to" data-path="src/pages/Orders/OrderForm.tsx">
              <div data-id="35rik3idc" data-path="src/pages/Orders/OrderForm.tsx">
                <CardTitle className="flex items-center space-x-2" data-id="88bq5feiw" data-path="src/pages/Orders/OrderForm.tsx">
                  <ShoppingCart className="w-6 h-6" data-id="spt9q9g4e" data-path="src/pages/Orders/OrderForm.tsx" />
                  <span data-id="g8b2lq5qm" data-path="src/pages/Orders/OrderForm.tsx">Order for {selectedStation}</span>
                </CardTitle>
                <CardDescription data-id="86yg1tsqo" data-path="src/pages/Orders/OrderForm.tsx">
                  Scan product barcodes or search manually to add items to your order
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        <CardContent data-id="3l84ct1b4" data-path="src/pages/Orders/OrderForm.tsx">
          {/* Barcode Scanner Section */}
          <div className="space-y-6" data-id="gbf0po2qr" data-path="src/pages/Orders/OrderForm.tsx">
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors" data-id="pmfipr63n" data-path="src/pages/Orders/OrderForm.tsx">
              <CardContent className="p-6" data-id="35uckn5lp" data-path="src/pages/Orders/OrderForm.tsx">
                <div className="text-center space-y-4" data-id="rzp325dyw" data-path="src/pages/Orders/OrderForm.tsx">
                  <Camera className="w-12 h-12 mx-auto text-primary" data-id="i40nmaqmu" data-path="src/pages/Orders/OrderForm.tsx" />
                  <h3 className="text-lg font-semibold" data-id="5fucoxh31" data-path="src/pages/Orders/OrderForm.tsx">Barcode Scanner</h3>
                  <p className="text-muted-foreground" data-id="hn6q8pjgf" data-path="src/pages/Orders/OrderForm.tsx">
                    Click to open camera and scan product barcodes
                  </p>
                  <Button
                    onClick={() => {
                      setScannerOpen(true);
                      setTimeout(startCamera, 100);
                    }}
                    className="w-full sm:w-auto"
                    disabled={loading} data-id="qe6zp8q09" data-path="src/pages/Orders/OrderForm.tsx">

                    <Camera className="w-4 h-4 mr-2" data-id="s9gkv18b3" data-path="src/pages/Orders/OrderForm.tsx" />
                    Open Barcode Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Product Search */}
            <ProductSearchBar onProductSelect={handleProductSelect} data-id="y4jp3qfx2" data-path="src/pages/Orders/OrderForm.tsx" />

            {/* Camera Dialog */}
            {scannerOpen &&
            <Card className="border-primary" data-id="rxdhdr09r" data-path="src/pages/Orders/OrderForm.tsx">
                <CardHeader data-id="1i1e8llr5" data-path="src/pages/Orders/OrderForm.tsx">
                  <CardTitle data-id="v3357qx1x" data-path="src/pages/Orders/OrderForm.tsx">Barcode Scanner</CardTitle>
                </CardHeader>
                <CardContent data-id="y3nk4kh3a" data-path="src/pages/Orders/OrderForm.tsx">
                  <div className="space-y-4" data-id="xvfw2ekn5" data-path="src/pages/Orders/OrderForm.tsx">
                    <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-lg overflow-hidden" data-id="1aq9pqyt0" data-path="src/pages/Orders/OrderForm.tsx">
                      <video
                      ref={(ref) => setVideoRef(ref)}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover" data-id="mk5d0ekfc" data-path="src/pages/Orders/OrderForm.tsx" />

                      <div className="absolute inset-0 flex items-center justify-center" data-id="cx3rg1y7z" data-path="src/pages/Orders/OrderForm.tsx">
                        <div className="border-2 border-white border-dashed w-48 h-24 rounded-lg" data-id="8edg4yx14" data-path="src/pages/Orders/OrderForm.tsx"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-center" data-id="bvj4rx52t" data-path="src/pages/Orders/OrderForm.tsx">
                      <Button onClick={simulateBarcodeCapture} disabled={loading} data-id="57yt7qwih" data-path="src/pages/Orders/OrderForm.tsx">
                        Capture Barcode
                      </Button>
                      <Button
                      variant="outline"
                      onClick={() => {
                        setScannerOpen(false);
                        stopCamera();
                      }} data-id="81i3txece" data-path="src/pages/Orders/OrderForm.tsx">

                        Cancel
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center" data-id="c3p3xgcgh" data-path="src/pages/Orders/OrderForm.tsx">
                      Position the barcode within the frame and click Capture
                    </p>
                  </div>
                </CardContent>
              </Card>
            }

            {/* Matched Products Section */}
            {matchedProducts.length > 0 &&
            <Card data-id="qiz7hez36" data-path="src/pages/Orders/OrderForm.tsx">
                <CardHeader data-id="meazw3q06" data-path="src/pages/Orders/OrderForm.tsx">
                  <CardTitle data-id="vtgnpfvj6" data-path="src/pages/Orders/OrderForm.tsx">Found Products</CardTitle>
                </CardHeader>
                <CardContent data-id="hd99ymrsf" data-path="src/pages/Orders/OrderForm.tsx">
                  <div className="space-y-3" data-id="yq4submw8" data-path="src/pages/Orders/OrderForm.tsx">
                    {matchedProducts.map((product) =>
                  <div key={product.ID} className="flex items-center justify-between p-4 border rounded-lg" data-id="qdjjter6p" data-path="src/pages/Orders/OrderForm.tsx">
                        <div className="flex-1" data-id="bma3fqudt" data-path="src/pages/Orders/OrderForm.tsx">
                          <h4 className="font-semibold" data-id="pjk10i5l0" data-path="src/pages/Orders/OrderForm.tsx">{product.product_name}</h4>
                          <p className="text-sm text-muted-foreground" data-id="0mnrwflcz" data-path="src/pages/Orders/OrderForm.tsx">
                            Code: {product.product_code} | Category: {product.category}
                          </p>
                          <p className="text-sm font-medium text-green-600" data-id="0hjre35th" data-path="src/pages/Orders/OrderForm.tsx">
                            Price: ${product.price.toFixed(2)} | Stock: {product.quantity_in_stock}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3" data-id="j7jt65frc" data-path="src/pages/Orders/OrderForm.tsx">
                          <div className="flex items-center space-x-2" data-id="29fprcx19" data-path="src/pages/Orders/OrderForm.tsx">
                            <Label htmlFor={`qty-${product.ID}`} className="text-sm" data-id="ko6m039zq" data-path="src/pages/Orders/OrderForm.tsx">Qty:</Label>
                            <NumberInput
                          id={`qty-${product.ID}`}
                          value={selectedQuantity[product.ID] || 1}
                          onChange={(value) => setSelectedQuantity((prev) => ({
                            ...prev,
                            [product.ID]: value
                          }))}
                          min={1}
                          max={product.quantity_in_stock}
                          className="w-20" data-id="9s6pygfvd" data-path="src/pages/Orders/OrderForm.tsx" />

                          </div>
                          <Button
                        size="sm"
                        onClick={() => addProductToOrder(product)}
                        className="flex items-center space-x-1" data-id="xx7ux3k6h" data-path="src/pages/Orders/OrderForm.tsx">

                            <Plus className="w-4 h-4" data-id="yltx4a0x0" data-path="src/pages/Orders/OrderForm.tsx" />
                            <span data-id="ax25ekm2e" data-path="src/pages/Orders/OrderForm.tsx">Add</span>
                          </Button>
                        </div>
                      </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            }

            {/* Order Items Section */}
            {formData.items.length > 0 &&
            <Card data-id="56m4ay7k9" data-path="src/pages/Orders/OrderForm.tsx">
                <CardHeader data-id="j6yg60m9" data-path="src/pages/Orders/OrderForm.tsx">
                  <CardTitle data-id="zv94brus7" data-path="src/pages/Orders/OrderForm.tsx">Order Items ({formData.items.length})</CardTitle>
                </CardHeader>
                <CardContent data-id="lulve2ryi" data-path="src/pages/Orders/OrderForm.tsx">
                  <div className="space-y-3" data-id="zscfqc248" data-path="src/pages/Orders/OrderForm.tsx">
                    {formData.items.map((item, index) =>
                  <div key={`${item.product.ID}-${index}`} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50" data-id="j1g343t3m" data-path="src/pages/Orders/OrderForm.tsx">
                        <div className="flex-1" data-id="qvm659s56" data-path="src/pages/Orders/OrderForm.tsx">
                          <h4 className="font-semibold" data-id="g9a06cvwj" data-path="src/pages/Orders/OrderForm.tsx">{item.product.product_name}</h4>
                          <p className="text-sm text-muted-foreground" data-id="jiajez3tj" data-path="src/pages/Orders/OrderForm.tsx">
                            {item.product.product_code} | ${(item.subtotal / item.quantity).toFixed(2)} per {item.unitType}
                          </p>
                          <p className="text-xs text-muted-foreground" data-id="tggaq43q0" data-path="src/pages/Orders/OrderForm.tsx">
                            Unit Type: {item.unitType}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3" data-id="np1k3vibm" data-path="src/pages/Orders/OrderForm.tsx">
                          <div className="flex items-center space-x-2" data-id="h52ds73ns" data-path="src/pages/Orders/OrderForm.tsx">
                            <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity - 1)} data-id="hzt21ym38" data-path="src/pages/Orders/OrderForm.tsx">

                              <Minus className="w-3 h-3" data-id="evhhf6vat" data-path="src/pages/Orders/OrderForm.tsx" />
                            </Button>
                            <span className="w-8 text-center font-medium" data-id="4lr74r9e3" data-path="src/pages/Orders/OrderForm.tsx">{item.quantity} {item.unitType}</span>
                            <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemQuantity(index, item.quantity + 1)} data-id="3m5hwspgv" data-path="src/pages/Orders/OrderForm.tsx">

                              <Plus className="w-3 h-3" data-id="62xm8hvpk" data-path="src/pages/Orders/OrderForm.tsx" />
                            </Button>
                          </div>
                          <div className="text-right min-w-[80px]" data-id="m4i77n0fj" data-path="src/pages/Orders/OrderForm.tsx">
                            <p className="font-semibold" data-id="2veb9kffl" data-path="src/pages/Orders/OrderForm.tsx">${item.subtotal.toFixed(2)}</p>
                          </div>
                          <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(index)} data-id="r6r7xk4ii" data-path="src/pages/Orders/OrderForm.tsx">

                            <Trash2 className="w-4 h-4" data-id="q9l29xqg3" data-path="src/pages/Orders/OrderForm.tsx" />
                          </Button>
                        </div>
                      </div>
                  )}
                    <div className="border-t pt-3" data-id="lddeeboj6" data-path="src/pages/Orders/OrderForm.tsx">
                      <div className="flex justify-between items-center text-lg font-bold" data-id="reyrgo2dl" data-path="src/pages/Orders/OrderForm.tsx">
                        <span data-id="bdh4y3tge" data-path="src/pages/Orders/OrderForm.tsx">Total Amount:</span>
                        <span data-id="gx23gl6cy" data-path="src/pages/Orders/OrderForm.tsx">${formData.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }

            {/* Order Details Form */}
            <Card data-id="f2le6exuv" data-path="src/pages/Orders/OrderForm.tsx">
              <CardHeader data-id="v8g87a07j" data-path="src/pages/Orders/OrderForm.tsx">
                <CardTitle data-id="sh2g9qpmy" data-path="src/pages/Orders/OrderForm.tsx">Order Details</CardTitle>
              </CardHeader>
              <CardContent data-id="de6xb30d7" data-path="src/pages/Orders/OrderForm.tsx">
                <form onSubmit={handleSubmit} className="space-y-4" data-id="uhnulbpiz" data-path="src/pages/Orders/OrderForm.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="e697mscou" data-path="src/pages/Orders/OrderForm.tsx">
                    <div className="space-y-2" data-id="uibwxus4z" data-path="src/pages/Orders/OrderForm.tsx">
                      <Label htmlFor="order_number" data-id="k2ucfu1ra" data-path="src/pages/Orders/OrderForm.tsx">Order Number</Label>
                      <Input
                        id="order_number"
                        value={formData.order_number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, order_number: e.target.value }))}
                        placeholder="Auto-generated if left empty" data-id="dvydn158k" data-path="src/pages/Orders/OrderForm.tsx" />

                    </div>

                    <div className="space-y-2" data-id="hfxlkwa1k" data-path="src/pages/Orders/OrderForm.tsx">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg" data-id="dmtec7m4l" data-path="src/pages/Orders/OrderForm.tsx">
                        <Label className="text-blue-800 font-medium" data-id="2u1odd6gb" data-path="src/pages/Orders/OrderForm.tsx">Delivery Station</Label>
                        <p className="text-blue-600 font-semibold text-lg" data-id="mpgp9z7j9" data-path="src/pages/Orders/OrderForm.tsx">{selectedStation}</p>
                        <p className="text-blue-500 text-sm" data-id="tguzkhkzp" data-path="src/pages/Orders/OrderForm.tsx">Selected at the top of the page</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2" data-id="3q43pyzud" data-path="src/pages/Orders/OrderForm.tsx">
                    <Label htmlFor="notes" data-id="ptfthgsks" data-path="src/pages/Orders/OrderForm.tsx">Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter any additional notes about this order..." data-id="seqen17lb" data-path="src/pages/Orders/OrderForm.tsx" />

                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-4" data-id="v79ifklm9" data-path="src/pages/Orders/OrderForm.tsx">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/orders')} data-id="g72qz7isz" data-path="src/pages/Orders/OrderForm.tsx">

                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading || formData.items.length === 0} data-id="29q17f8kk" data-path="src/pages/Orders/OrderForm.tsx">
                      {loading ? 'Creating...' :
                      <>
                          <Save className="w-4 h-4 mr-2" data-id="e2yz262dy" data-path="src/pages/Orders/OrderForm.tsx" />
                          Create Order
                        </>
                      }
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      }

      {/* Product Selection Dialog */}
      <ProductSelectionDialog
        isOpen={showSelectionDialog}
        onClose={() => {
          setShowSelectionDialog(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onConfirm={handleProductConfirm} data-id="iy79s7n9i" data-path="src/pages/Orders/OrderForm.tsx" />

    </div>);

};

export default OrderForm;