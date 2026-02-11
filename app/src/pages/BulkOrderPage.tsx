import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Building2, Upload, Plus, Minus, Trash2, 
  FileSpreadsheet, Save, ShoppingCart, Search, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { products, bulkOrderTemplates } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';

interface BulkOrderItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function BulkOrderPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState<BulkOrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const addItem = (product: typeof products[0]) => {
    const existingItem = items.find(item => item.productId === product.id);
    
    if (existingItem) {
      setItems(items.map(item => 
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: BulkOrderItem = {
        id: `bi-${Date.now()}`,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price,
      };
      setItems([...items, newItem]);
    }
    
    setSearchQuery('');
    setShowSearchResults(false);
    toast.success(`Added ${product.name}`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(item => 
      item.id === id
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const loadTemplate = (template: typeof bulkOrderTemplates[0]) => {
    const templateItems: BulkOrderItem[] = template.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        id: `bi-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        sku: item.sku,
        name: product?.name || item.sku,
        quantity: item.quantity,
        unitPrice: product?.price || 0,
        total: (product?.price || 0) * item.quantity,
      };
    });
    setItems(templateItems);
    toast.success(`Loaded template: ${template.name}`);
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    toast.success(`Saved template: ${templateName}`);
    setTemplateName('');
  };

  const addAllToCart = () => {
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        // Add multiple times to simulate quantity
        for (let i = 0; i < item.quantity; i++) {
          addToCart(product, 1);
        }
      }
    });
    setItems([]);
    toast.success('All items added to cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">Bulk Order</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
                Contractor Bulk Order
              </h1>
              <p className="text-[#6B7280]">
                Quick order multiple items with volume pricing
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Label className="text-lg font-semibold mb-4 block">Add Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  className="pl-10"
                />
                
                {/* Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                      >
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-[#6B7280]">{product.sku}</div>
                        </div>
                        <div className="font-semibold">${product.price.toFixed(2)}</div>
                        <Plus className="w-5 h-5 text-[#FF6B35]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CSV Upload */}
              <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
                <p className="text-sm text-[#6B7280] mb-2">
                  Drag CSV file here or click to upload
                </p>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">Order Items</Label>
                <span className="text-sm text-[#6B7280]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#6B7280]">
                    No items added yet. Search above to add products.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-[#6B7280]">SKU: {item.sku}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-[#6B7280]">${item.unitPrice.toFixed(2)} each</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-[#FF6B35]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-[#FF6B35]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="w-20 text-right font-semibold">
                        ${item.total.toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#6B7280] hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-lg font-semibold">Subtotal</span>
                    <span className="text-2xl font-bold text-[#FF6B35]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b]"
                      onClick={addAllToCart}
                      disabled={items.length === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Template name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="w-40"
                      />
                      <Button variant="outline" onClick={saveTemplate}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Templates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Label className="text-lg font-semibold mb-4 block">Saved Templates</Label>
              <div className="space-y-3">
                {bulkOrderTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-[#6B7280]">
                      {template.items.length} items
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#1A1D21] rounded-xl p-6 text-white">
              <Label className="text-lg font-semibold mb-4 block text-white">
                Contractor Benefits
              </Label>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Volume discounts on large orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Save and reuse order templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">CSV import for quick ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
              </ul>
              <Button className="w-full mt-4 bg-[#FF6B35] hover:bg-[#e55a2b]">
                Apply for Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
