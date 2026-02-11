import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Star, ShoppingCart, Heart, Share2, Truck, Shield, 
  RotateCcw, ChevronRight, Minus, Plus, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { ProductCard } from '@/components/ProductCard';

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { products, getProductBySlug } = useProducts();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = getProductBySlug(slug || '');
  
  // Related products
  const relatedProducts = products
    .filter(p => p.categoryId === product?.categoryId && p.id !== product?.id)
    .slice(0, 4);

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [product, navigate]);

  if (!product) return null;

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast.error(t('auth.signIn'));
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? t('wishlist.empty') : t('productDetail.addToWishlist'));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">{t('nav.home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-[#FF6B35]">{t('nav.shop')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link 
            to={`/products?category=${product.category.slug}`} 
            className="hover:text-[#FF6B35]"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#FF6B35]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.vendor?.businessName && (
                  <Badge variant="secondary">{product.vendor.businessName}</Badge>
                )}
                {product.isBestseller && (
                  <Badge className="bg-[#FF6B35]">{t('products.bestseller')}</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21] mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.ratings.average)
                          ? 'fill-[#FF6B35] text-[#FF6B35]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#6B7280]">
                  {product.ratings.average} ({product.ratings.count} {t('productDetail.reviews')})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1A1D21]">
                {product.price.toFixed(2)} DA
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-[#6B7280] line-through">
                    {product.compareAtPrice.toFixed(2)} DA
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {t('products.save')} {discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-[#6B7280]">{product.shortDescription}</p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.inventory > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {t('productDetail.inStock', { count: product.inventory })}
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-medium">{t('productDetail.outOfStock')}</span>
                </>
              )}
            </div>

            {/* Quantity and Actions */}
            {product.inventory > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{t('productDetail.quantity')}:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:border-[#FF6B35] transition-colors"
                      disabled={quantity >= product.inventory}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] h-14 text-lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('products.addToCart')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`h-14 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                    onClick={handleAddToWishlist}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                    {isWishlisted ? t('productDetail.wishlisted') : t('productDetail.addToWishlist')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-5 h-5 text-[#FF6B35]" />
                <span>{t('productDetail.freeShipping')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="w-5 h-5 text-[#FF6B35]" />
                <span>{t('productDetail.returns')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-[#FF6B35]" />
                <span>{t('productDetail.secureCheckout')}</span>
              </div>
            </div>

            {/* SKU */}
            <div className="text-sm text-[#6B7280]">
              {t('productDetail.sku')}: <span className="font-mono">{product.sku}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="bg-white rounded-xl shadow-sm">
            <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
              <TabsTrigger 
                value="description" 
                className="rounded-none px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35]"
              >
                {t('productDetail.description')}
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35]"
              >
                {t('productDetail.specifications')}
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none px-6 py-4 data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35]"
              >
                {t('productDetail.reviews')} ({product.ratings.count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <p className="text-[#1A1D21] leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {product.attributes.map((attr) => (
                  <div 
                    key={attr.name} 
                    className="flex justify-between py-3 border-b border-gray-100"
                  >
                    <span className="text-[#6B7280]">{attr.name}</span>
                    <span className="font-medium text-[#1A1D21]">{attr.value}</span>
                  </div>
                ))}
                {product.weight && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-[#6B7280]">Weight</span>
                    <span className="font-medium text-[#1A1D21]">{product.weight} lbs</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-[#6B7280]">Dimensions</span>
                    <span className="font-medium text-[#1A1D21]">
                      {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Rating summary */}
                <div className="md:col-span-1">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-5xl font-bold text-[#1A1D21] mb-2">
                      {product.ratings.average}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.ratings.average)
                              ? 'fill-[#FF6B35] text-[#FF6B35]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[#6B7280]">
                      {t('productDetail.basedOn')} {product.ratings.count} {t('productDetail.reviews')}
                    </div>
                  </div>
                </div>

                {/* Reviews list */}
                <div className="md:col-span-2 space-y-6">
                  {product.reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#6B7280]">No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {review.user.firstName[0]}
                            </div>
                            <div>
                              <div className="font-medium">
                                {review.user.firstName} {review.user.lastName}
                              </div>
                              {review.isVerifiedPurchase && (
                                <Badge variant="secondary" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  {t('productDetail.verifiedPurchase')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-[#6B7280]">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-[#FF6B35] text-[#FF6B35]'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-semibold mb-1">{review.title}</h4>
                        <p className="text-[#6B7280]">{review.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1A1D21] mb-6">
              {t('productDetail.youMayAlsoLike')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
