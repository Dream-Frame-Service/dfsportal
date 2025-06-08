import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Trash2, Loader2 } from 'lucide-react';
import HighlightText from '@/components/HighlightText';

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

interface ProductCardsProps {
  products: Product[];
  searchTerm: string;
  onViewLogs: (id: number, name: string) => void;
  onSaveProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
  savingProductId: number | null;
}

const ProductCards: React.FC<ProductCardsProps> = ({
  products,
  searchTerm,
  onViewLogs,
  onSaveProduct,
  onDeleteProduct,
  savingProductId
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const getSearchData = (text: string) => {
    if (!searchTerm || !text) {
      return {
        keywords: [],
        allMatch: false,
        highlightComponent: text
      };
    }

    const searchKeywords = searchTerm.toLowerCase().trim().split(/\s+/).filter((keyword) => keyword.length > 0);
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
        allMatch={allMatch} data-id="58g0bt74c" data-path="src/components/ProductCards.tsx" />
    };
  };

  const calculateMargin = (product: Product) => {
    if (product.unit_price && product.retail_price && product.retail_price > 0) {
      const margin = (product.retail_price - product.unit_price) / product.retail_price * 100;
      return {
        value: margin,
        variant: margin > 20 ? 'default' : margin > 10 ? 'secondary' : 'destructive'
      };
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-4" data-id="vcoqocbmv" data-path="src/components/ProductCards.tsx">
      {products.map((product) => {
        const margin = calculateMargin(product);

        return (
          <Card key={product.ID} className="hover:shadow-md transition-shadow" data-id="tkdth0ury" data-path="src/components/ProductCards.tsx">
            <CardHeader className="pb-3" data-id="uq7z5v57b" data-path="src/components/ProductCards.tsx">
              <div className="flex items-start justify-between" data-id="ngqjwvfws" data-path="src/components/ProductCards.tsx">
                <div className="flex-1 min-w-0" data-id="yui8uv297" data-path="src/components/ProductCards.tsx">
                  <CardTitle className="text-lg leading-tight" data-id="4gefxa46g" data-path="src/components/ProductCards.tsx">
                    {searchTerm ?
                    getSearchData(product.product_name).highlightComponent :
                    product.product_name
                    }
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1" data-id="07m0b3qxb" data-path="src/components/ProductCards.tsx">
                    <Badge variant="outline" className="text-xs" data-id="6igwrok4a" data-path="src/components/ProductCards.tsx">
                      #{product.serial_number || '-'}
                    </Badge>
                    <Badge variant="outline" className="text-xs" data-id="qv4tmx4tv" data-path="src/components/ProductCards.tsx">
                      {searchTerm ?
                      getSearchData(product.department || 'Convenience Store').highlightComponent :
                      product.department || 'Convenience Store'
                      }
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2" data-id="dkhe03wrp" data-path="src/components/ProductCards.tsx">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewLogs(product.ID, product.product_name)}
                    className="p-2"
                    title="View logs" data-id="eo88gx6p9" data-path="src/components/ProductCards.tsx">

                    <FileText className="w-4 h-4" data-id="23l7w9v0h" data-path="src/components/ProductCards.tsx" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSaveProduct(product.ID)}
                    disabled={savingProductId === product.ID}
                    className="p-2"
                    title="Save product" data-id="wy9upx6j1" data-path="src/components/ProductCards.tsx">

                    {savingProductId === product.ID ?
                    <Loader2 className="w-4 h-4 animate-spin" data-id="cpi13a2im" data-path="src/components/ProductCards.tsx" /> :
                    <Save className="w-4 h-4" data-id="56qwhn9hs" data-path="src/components/ProductCards.tsx" />
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteProduct(product.ID)}
                    className="p-2 text-red-600 hover:text-red-700"
                    title="Delete product" data-id="ll1ytnsax" data-path="src/components/ProductCards.tsx">

                    <Trash2 className="w-4 h-4" data-id="znbcibmod" data-path="src/components/ProductCards.tsx" />
                  </Button>
                </div>
              </div>
              {product.description &&
              <p className="text-sm text-gray-600 mt-2 line-clamp-2" data-id="8mdo5s8fb" data-path="src/components/ProductCards.tsx">
                  {searchTerm ?
                getSearchData(product.description).highlightComponent :
                product.description
                }
                </p>
              }
            </CardHeader>
            <CardContent className="space-y-3" data-id="w5zeaa2gx" data-path="src/components/ProductCards.tsx">
              {/* Pricing Information */}
              <div className="grid grid-cols-2 gap-3 text-sm" data-id="zjkp7xddy" data-path="src/components/ProductCards.tsx">
                <div data-id="i32gsz0q6" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="0h7r2acdd" data-path="src/components/ProductCards.tsx">Unit Price:</span>
                  <div className="font-medium" data-id="cr4jora7q" data-path="src/components/ProductCards.tsx">
                    {product.unit_price ? `$${product.unit_price.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div data-id="fb7oysbqc" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="lo8tua9hv" data-path="src/components/ProductCards.tsx">Retail Price:</span>
                  <div className="font-medium" data-id="9u6yh2lg0" data-path="src/components/ProductCards.tsx">
                    {product.retail_price ? `$${product.retail_price.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div data-id="z8oswopfk" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="64ozply7o" data-path="src/components/ProductCards.tsx">Case Price:</span>
                  <div className="font-medium" data-id="jy4ue1prr" data-path="src/components/ProductCards.tsx">
                    {product.case_price ? `$${product.case_price.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div data-id="4sl3z79p4" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="d846ca4wm" data-path="src/components/ProductCards.tsx">Profit Margin:</span>
                  <div className="font-medium" data-id="s7kltybae" data-path="src/components/ProductCards.tsx">
                    {margin ?
                    <Badge variant={margin.variant as any} className="text-xs" data-id="st1wcyk5n" data-path="src/components/ProductCards.tsx">
                        {margin.value.toFixed(1)}%
                      </Badge> :
                    '-'}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 gap-2 text-sm border-t pt-3" data-id="8ughceoru" data-path="src/components/ProductCards.tsx">
                <div className="flex justify-between" data-id="o55w5fzun" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="9t7nnwi4o" data-path="src/components/ProductCards.tsx">Weight:</span>
                  <span className="font-medium" data-id="x66bd4ci2" data-path="src/components/ProductCards.tsx">
                    {product.weight && product.weight > 0 ?
                    `${product.weight} ${product.weight_unit || 'lb'}` :
                    '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between" data-id="9e15p2e4z" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="osmo02jsp" data-path="src/components/ProductCards.tsx">Supplier:</span>
                  <span className="font-medium truncate ml-2" data-id="pd3k5olyc" data-path="src/components/ProductCards.tsx">
                    {searchTerm ?
                    getSearchData(product.supplier || '-').highlightComponent :
                    product.supplier || '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between" data-id="o39vnn1ce" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="utyht6qtb" data-path="src/components/ProductCards.tsx">Unit per Case:</span>
                  <span className="font-medium" data-id="3f91uaoh8" data-path="src/components/ProductCards.tsx">{product.unit_per_case || '-'}</span>
                </div>
                <div className="flex justify-between" data-id="161xfgys0" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="2tbhaxvf4" data-path="src/components/ProductCards.tsx">Last Updated:</span>
                  <span className="font-medium" data-id="o9pd996us" data-path="src/components/ProductCards.tsx">{formatDate(product.last_updated_date)}</span>
                </div>
                <div className="flex justify-between" data-id="bxtiv50ng" data-path="src/components/ProductCards.tsx">
                  <span className="text-gray-500" data-id="ikluthn8r" data-path="src/components/ProductCards.tsx">Last Shopping:</span>
                  <span className="font-medium" data-id="oqm9cafl6" data-path="src/components/ProductCards.tsx">{formatDate(product.last_shopping_date)}</span>
                </div>
              </div>
            </CardContent>
          </Card>);

      })}
    </div>);

};

export default ProductCards;