import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export function ProductCard({ product, showBadge = true }: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('auth.signIn'));
      return;
    }
    toast.success(t('productDetail.addToWishlist'));
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-[#FF6B35] text-white border-0">
                {t('products.save')} {discount}%
              </Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-[#1A1D21] text-white border-0">
                {t('products.bestseller')}
              </Badge>
            )}
            {product.isFeatured && !product.isBestseller && (
              <Badge className="bg-[#6B7280] text-white border-0">
                {t('products.featured')}
              </Badge>
            )}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-[#FF6B35]"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick add button (mobile always visible) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-white text-[#1A1D21] hover:bg-[#FF6B35] hover:text-white"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('products.addToCart')}
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <div className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">
          {product.vendor?.businessName || 'Quincaillerie Nour Essalam'}
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-[#1A1D21] line-clamp-2 mb-2 group-hover:text-[#FF6B35] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.ratings.average)
                    ? 'fill-[#FF6B35] text-[#FF6B35]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#6B7280]">
            ({product.ratings.count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1A1D21]">
              {product.price.toFixed(2)} DA
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#6B7280] line-through">
                {product.compareAtPrice.toFixed(2)} DA
              </span>
            )}
          </div>

          {/* Mobile add button */}
          <Button
            onClick={handleAddToCart}
            size="icon"
            className="md:hidden bg-[#FF6B35] hover:bg-[#e55a2b]"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock status */}
        {product.inventory <= product.lowStockThreshold && product.inventory > 0 && (
          <div className="mt-2 text-xs text-amber-600">
            {t('products.onlyLeft', { count: product.inventory })}
          </div>
        )}
        {product.inventory === 0 && (
          <div className="mt-2 text-xs text-red-600">
            {t('products.outOfStock')}
          </div>
        )}
      </div>
    </div>
  );
}
