import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, MoreHorizontal, Edit2, Copy, 
  Eye, EyeOff, Trash2, Package 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { products } from '@/data/mockData';

export function VendorProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter products for this vendor
  const vendorProducts = products.filter(p => 
    p.vendorId === 'vendor-1' && // Mock: using first vendor
    (statusFilter === 'all' || p.status === statusFilter) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllSelection = () => {
    if (selectedProducts.length === vendorProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(vendorProducts.map(p => p.id));
    }
  };

  const handleDuplicate = (_productId: string) => {
    toast.success('Product duplicated');
  };

  const handleToggleStatus = (_productId: string, currentStatus: string) => {
    toast.success(`Product ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
  };

  const handleDelete = (_productId: string) => {
    toast.success('Product deleted');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
              Products
            </h1>
            <p className="text-[#6B7280]">
              Manage your product catalog
            </p>
          </div>
          <Button className="bg-[#FF6B35] hover:bg-[#e55a2b]">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-[#1A1D21] text-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <span>{selectedProducts.length} products selected</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Activate
              </Button>
              <Button variant="secondary" size="sm">
                Deactivate
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox 
                      checked={selectedProducts.length === vendorProducts.length && vendorProducts.length > 0}
                      onCheckedChange={toggleAllSelection}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-[#1A1D21]">{product.name}</div>
                          <div className="text-sm text-[#6B7280]">{product.category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-mono">{product.sku}</td>
                    <td className="px-4 py-4">
                      <div className="font-medium">${product.price.toFixed(2)}</div>
                      {product.compareAtPrice && (
                        <div className="text-sm text-[#6B7280] line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className={`font-medium ${
                        product.inventory <= product.lowStockThreshold 
                          ? 'text-amber-600' 
                          : ''
                      }`}>
                        {product.inventory}
                      </div>
                      {product.inventory <= product.lowStockThreshold && (
                        <div className="text-xs text-amber-600">Low stock</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/products/${product.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(product.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product.id, product.status)}>
                            {product.status === 'active' ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vendorProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1A1D21] mb-2">
                No products found
              </h3>
              <p className="text-[#6B7280] mb-4">
                Try adjusting your filters or add a new product
              </p>
              <Button className="bg-[#FF6B35] hover:bg-[#e55a2b]">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-[#6B7280]">
            Showing {vendorProducts.length} of {vendorProducts.length} products
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
