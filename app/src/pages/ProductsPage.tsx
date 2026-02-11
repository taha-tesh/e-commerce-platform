import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Filter, SlidersHorizontal, Grid3X3, List, 
  X, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { categories } from '@/data/mockData';

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products } = useProducts();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  // Parse URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    
    if (category) {
      setSelectedCategory(category);
    }
    if (sort) {
      setSortBy(sort);
    }
  }, [searchParams]);

  // Initialize price range based on loaded products
  useEffect(() => {
    if (products.length === 0) return;

    const prices = products.map(p => p.price);
    const highest = Math.max(...prices);
    const normalizedMax = Math.ceil(highest / 50) * 50 || 500;

    setMaxPrice(normalizedMax);
    setPriceRange([0, normalizedMax]);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        result = result.filter(p => p.categoryId === category.id);
      }
    }

    // Filter by search
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }

    // Filter by deals
    if (searchParams.get('deals') === 'true') {
      result = result.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by rating
    if (selectedRating > 0) {
      result = result.filter(p => p.ratings.average >= selectedRating);
    }

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.inventory > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Popularity - sort by rating count
        result.sort((a, b) => b.ratings.count - a.ratings.count);
    }

    return result;
  }, [products, selectedCategory, priceRange, selectedRating, inStockOnly, sortBy, searchParams]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedRating > 0) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, priceRange, selectedRating, inStockOnly]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setSelectedRating(0);
    setInStockOnly(false);
    setSearchParams({});
  };

  const updateSort = (value: string) => {
    setSortBy(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-[#1A1D21] mb-3">{t('products.categories')}</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label 
              key={category.id} 
              className="flex items-center gap-2 cursor-pointer hover:text-[#FF6B35] transition-colors"
            >
              <Checkbox
                checked={selectedCategory === category.slug}
                onCheckedChange={(checked) => {
                  setSelectedCategory(checked ? category.slug : '');
                  const newParams = new URLSearchParams(searchParams);
                  if (checked) {
                    newParams.set('category', category.slug);
                  } else {
                    newParams.delete('category');
                  }
                  setSearchParams(newParams);
                }}
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-[#1A1D21] mb-3">{t('products.priceRange')}</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={maxPrice}
          step={10}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm">
          <span>{priceRange[0]} DA</span>
          <span>{priceRange[1]} DA</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-[#1A1D21] mb-3">{t('products.minRating')}</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label 
              key={rating} 
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedRating === rating}
                onCheckedChange={(checked) => {
                  setSelectedRating(checked ? rating : 0);
                }}
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-[#FF6B35] text-[#FF6B35]' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold text-[#1A1D21] mb-3">{t('products.availability')}</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <span className="text-sm">{t('products.inStockOnly')}</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb and header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
            {searchParams.get('search') 
              ? `${t('common.search')}: "${searchParams.get('search')}"`
              : searchParams.get('deals') === 'true'
              ? t('nav.deals')
              : selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name
              : t('products.title')
            }
          </h1>
          <p className="text-[#6B7280] mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? t('products.productFound') : t('products.productsFound')}
          </p>
        </div>

        {/* Active filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-[#6B7280]">{t('products.filters')}:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    setSelectedCategory('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                  }}
                />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {priceRange[0]} DA - {priceRange[1]} DA
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setPriceRange([0, 500])}
                />
              </Badge>
            )}
            {selectedRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedRating}+ {t('productDetail.reviews')}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setSelectedRating(0)}
                />
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {t('products.inStockOnly')}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setInStockOnly(false)}
                />
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-[#FF6B35] hover:underline"
            >
              {t('products.clearFilters')}
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1D21]">{t('products.filters')}</h3>
                <Filter className="w-4 h-4 text-[#6B7280]" />
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a2b]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t('products.filters')}
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-white text-[#FF6B35]">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>{t('products.filters')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and View */}
            <div className="flex items-center justify-between mb-6">
              <Select value={sortBy} onValueChange={updateSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('products.sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">{t('products.mostPopular')}</SelectItem>
                  <SelectItem value="price_asc">{t('products.priceLowHigh')}</SelectItem>
                  <SelectItem value="price_desc">{t('products.priceHighLow')}</SelectItem>
                  <SelectItem value="rating">{t('products.highestRated')}</SelectItem>
                  <SelectItem value="newest">{t('products.newest')}</SelectItem>
                </SelectContent>
              </Select>

              {/* View mode */}
              <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#FF6B35] text-white' : 'bg-white text-[#6B7280]'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#FF6B35] text-white' : 'bg-white text-[#6B7280]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1D21] mb-2">
                  {t('products.noProducts')}
                </h3>
                <p className="text-[#6B7280] mb-6">
                  {t('products.tryAdjusting')}
                </p>
                <Button onClick={clearFilters} variant="outline">
                  {t('products.clearFilters')}
                </Button>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              } gap-4 md:gap-6`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
