import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, Search, Edit2, Trash2, MoreVertical, 
  ChevronLeft, ChevronRight, Package, Image as ImageIcon,
  Upload, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { categories } from '@/data/mockData';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { Product } from '@/types';

export function AdminProducts() {
  const { t } = useTranslation();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    inventory: 0,
    categoryId: '',
    sku: '',
    status: 'active',
  });

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check total images limit (max 5)
      if (previewImages.length + files.length > 5) {
        toast.error(t('admin.tooManyImages') || 'Maximum 5 images allowed');
        return;
      }

      Array.from(files).forEach((file) => {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error(t('admin.imageTooLarge') || 'Image too large (max 2MB)');
          return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name || '',
      slug: formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
      description: formData.description || '',
      shortDescription: formData.description?.slice(0, 100) || '',
      price: formData.price || 0,
      costPerUnit: 'each',
      sku: formData.sku || '',
      inventory: formData.inventory || 0,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorders: false,
      status: formData.status as 'active' | 'draft' | 'archived' || 'active',
      categoryId: formData.categoryId || '',
      category: categories.find(c => c.id === formData.categoryId) || categories[0],
      vendorId: 'vendor-1',
      images: previewImages.length > 0
        ? previewImages.map((url, index) => ({ 
            id: `img-${Date.now()}-${index}`, 
            url, 
            alt: formData.name || 'Product', 
            position: index 
          }))
        : [{ id: `img-${Date.now()}`, url: 'https://images.unsplash.com/photo-1581147036324-c17ac41dd161?w=800&q=80', alt: 'Product', position: 0 }],
      attributes: [],
      ratings: { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
      reviews: [],
      tags: [],
      weight: 1,
      dimensions: { length: 1, width: 1, height: 1, unit: 'in' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: false,
      isBestseller: false,
    };

    addProduct(newProduct);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success(t('admin.productAdded') || 'Product added successfully');
  };

  const handleEdit = () => {
    if (!selectedProduct) return;

    const updates: Partial<Product> = {
      name: formData.name,
      slug: formData.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: formData.description,
      shortDescription: formData.description?.slice(0, 100),
      price: formData.price,
      inventory: formData.inventory,
      categoryId: formData.categoryId,
      category: categories.find(c => c.id === formData.categoryId) || categories[0],
      status: formData.status as 'active' | 'draft' | 'archived',
    };

    if (previewImages.length > 0) {
      updates.images = previewImages.map((url, index) => ({ 
        id: `img-${Date.now()}-${index}`, 
        url, 
        alt: formData.name || 'Product', 
        position: index 
      }));
    }

    updateProduct(selectedProduct.id, updates);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    toast.success(t('admin.productUpdated') || 'Product updated successfully');
  };

  const handleDelete = () => {
    if (!selectedProduct) return;

    deleteProduct(selectedProduct.id);
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    toast.success(t('admin.productDeleted') || 'Product deleted successfully');
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      inventory: product.inventory,
      categoryId: product.categoryId,
      sku: product.sku,
      status: product.status,
    });
    setPreviewImages(product.images.map(img => img.url));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      inventory: 0,
      categoryId: '',
      sku: '',
      status: 'active',
    });
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.inventory === 0) return { label: t('products.outOfStock'), color: 'bg-red-100 text-red-700' };
    if (product.inventory <= (product.lowStockThreshold || 10)) return { label: t('admin.lowStock'), color: 'bg-orange-100 text-orange-700' };
    return { label: t('products.inStockOnly'), color: 'bg-green-100 text-green-700' };
  };

  // Image upload component
  const ImageUploadField = () => (
    <div className="space-y-2">
      <Label>{t('admin.productImages') || 'Product Images'} ({previewImages.length}/5)</Label>
      <div className="flex flex-wrap items-start gap-4">
        {previewImages.map((img, index) => (
          <div key={index} className="relative">
            <img 
              src={img} 
              alt={`Preview ${index + 1}`} 
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {previewImages.length < 5 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">{t('admin.upload') || 'Upload'}</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="text-sm text-gray-500">
          <p>{t('admin.imageHint') || 'Click to upload images'}</p>
          <p className="text-xs">{t('admin.imageMaxSize') || 'Max 2MB each, up to 5 images'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1D21]">{t('admin.products') || 'Products'}</h1>
            <p className="text-[#6B7280]">{t('admin.manageProducts') || 'Manage your product catalog'}</p>
          </div>
          <Button 
            onClick={() => { resetForm(); setIsAddDialogOpen(true); }}
            className="bg-[#FF6B35] hover:bg-[#e55a2b]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.addProduct') || 'Add Product'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-[#6B7280]">{t('admin.totalProducts')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-[#6B7280]">{t('admin.active') || 'Active'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.inventory <= (p.lowStockThreshold || 10) && p.inventory > 0).length}</p>
                <p className="text-sm text-[#6B7280]">{t('admin.lowStock')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.inventory === 0).length}</p>
                <p className="text-sm text-[#6B7280]">{t('products.outOfStock')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <Input
            placeholder={t('admin.searchProducts') || 'Search products by name or SKU...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('products.title')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('products.priceRange')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('productDetail.quantity')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('products.availability')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.images[0]?.url} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-[#6B7280]">{product.category?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.sku}</td>
                        <td className="px-4 py-3 text-sm font-medium">{product.price.toFixed(2)} DA</td>
                        <td className="px-4 py-3 text-sm">{product.inventory}</td>
                        <td className="px-4 py-3">
                          <Badge className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(product)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-[#6B7280]">
                  {t('admin.showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} {t('admin.of')} {filteredProducts.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">{currentPage} / {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.addProduct') || 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageUploadField />
              
              <div>
                <Label>{t('products.title')} *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={t('admin.productName') || 'Product name'}
                />
              </div>
              <div>
                <Label>{t('productDetail.description')}</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('admin.productDescription') || 'Product description'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SKU *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="SKU-001"
                  />
                </div>
                <div>
                  <Label>{t('products.categories')} *</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({...formData, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.selectCategory') || 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('products.priceRange')} (DA) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>{t('productDetail.quantity')} *</Label>
                  <Input
                    type="number"
                    value={formData.inventory}
                    onChange={(e) => setFormData({...formData, inventory: parseInt(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label>{t('products.availability')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'draft' | 'archived'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('admin.active') || 'Active'}</SelectItem>
                    <SelectItem value="draft">{t('admin.draft') || 'Draft'}</SelectItem>
                    <SelectItem value="archived">{t('admin.archived') || 'Archived'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleAdd}
                className="bg-[#FF6B35] hover:bg-[#e55a2b]"
                disabled={!formData.name || !formData.sku || !formData.categoryId}
              >
                {t('admin.addProduct')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.editProduct') || 'Edit Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageUploadField />
              
              <div>
                <Label>{t('products.title')} *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>{t('productDetail.description')}</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SKU *</Label>
                  <Input value={formData.sku} disabled />
                </div>
                <div>
                  <Label>{t('products.categories')} *</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({...formData, categoryId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('products.priceRange')} (DA) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>{t('productDetail.quantity')} *</Label>
                  <Input
                    type="number"
                    value={formData.inventory}
                    onChange={(e) => setFormData({...formData, inventory: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label>{t('products.availability')}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'draft' | 'archived'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('admin.active') || 'Active'}</SelectItem>
                    <SelectItem value="draft">{t('admin.draft') || 'Draft'}</SelectItem>
                    <SelectItem value="archived">{t('admin.archived') || 'Archived'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleEdit}
                className="bg-[#FF6B35] hover:bg-[#e55a2b]"
              >
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.confirmDelete') || 'Confirm Delete'}</DialogTitle>
            </DialogHeader>
            <p className="text-[#6B7280]">
              {t('admin.deleteConfirmMessage') || 'Are you sure you want to delete'} <strong>{selectedProduct?.name}</strong>?
              {t('admin.deleteWarning') || 'This action cannot be undone.'}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleDelete}
                variant="destructive"
              >
                {t('common.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
