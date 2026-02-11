import { Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { wishlists, products } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';

export function WishlistPage() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  
  // Get wishlist items (using mock data)
  const wishlistItems = wishlists[0]?.items || [];

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    toast.success(t('productDetail.addedToCart') || 'Added to cart');
  };

  const handleRemove = () => {
    toast.info(t('wishlist.removed') || 'Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">{t('nav.home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/account" className="hover:text-[#FF6B35]">{t('account.title')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">{t('wishlist.title')}</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
            {t('wishlist.title')}
          </h1>
          <span className="text-[#6B7280]">
            {wishlistItems.length} {wishlistItems.length === 1 ? t('cart.item') : t('cart.items')}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1D21] mb-2">
              {t('wishlist.empty')}
            </h3>
            <p className="text-[#6B7280] mb-6">
              {t('wishlist.emptyMessage')}
            </p>
            <Button asChild className="bg-[#FF6B35] hover:bg-[#e55a2b]">
              <Link to="/products">{t('wishlist.startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden group"
              >
                {/* Image */}
                <Link 
                  to={`/products/${item.product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-gray-50"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="font-medium text-[#1A1D21] line-clamp-2 mb-2 group-hover:text-[#FF6B35] transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-[#1A1D21]">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.product.compareAtPrice && (
                      <span className="text-sm text-[#6B7280] line-through">
                        ${item.product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-[#FF6B35] hover:bg-[#e55a2b]"
                    onClick={() => handleAddToCart(item.product)}
                    disabled={item.product.inventory === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.product.inventory === 0 ? t('products.outOfStock') : t('products.addToCart')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
