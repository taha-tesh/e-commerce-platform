import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, ShoppingCart, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

export function CartDrawer() {
  const { t } = useTranslation();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    applyCoupon,
    removeCoupon,
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="w-5 h-5" />
            {t('cart.title')}
            {cart.itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cart.itemCount} {cart.itemCount === 1 ? t('cart.item') : t('cart.items')}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1D21] mb-2">
              {t('cart.empty')}
            </h3>
            <p className="text-[#6B7280] mb-6">
              {t('cart.emptyMessage')}
            </p>
            <Button 
              onClick={() => setIsCartOpen(false)}
              className="bg-[#FF6B35] hover:bg-[#e55a2b]"
              asChild
            >
              <Link to="/products">{t('cart.startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg group"
                  >
                    {/* Image */}
                    <Link 
                      to={`/products/${item.product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden"
                    >
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-medium text-[#1A1D21] line-clamp-2 hover:text-[#FF6B35] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.variant && (
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          {item.variant.options.map(o => o.value).join(', ')}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-[#FF6B35] transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded hover:border-[#FF6B35] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-semibold text-[#1A1D21]">
                            {item.total.toFixed(2)} DA
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {item.price.toFixed(2)} DA
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#6B7280] hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            {!cart.couponCode ? (
              <div className="py-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('cart.couponPlaceholder')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    {t('cart.apply')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-0">
                    {cart.couponCode}
                  </Badge>
                  <span className="text-sm text-green-700">{t('cart.applied')}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-sm text-green-700 hover:text-green-900"
                >
                  {t('cart.remove')}
                </button>
              </div>
            )}

            <Separator />

            {/* Summary */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{t('cart.subtotal')}</span>
                <span className="font-medium">{cart.subtotal.toFixed(2)} DA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{t('cart.tax')}</span>
                <span className="font-medium">{cart.tax.toFixed(2)} DA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{t('cart.shipping')}</span>
                <span className="font-medium">
                  {cart.shipping === 0 ? t('cart.free') : `${cart.shipping.toFixed(2)} DA`}
                </span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t('cart.discount')}</span>
                  <span className="font-medium">-{cart.discount.toFixed(2)} DA</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-lg">{t('cart.total')}</span>
                <span className="font-bold text-xl text-[#FF6B35]">
                  {cart.total.toFixed(2)} DA
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button 
                className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] h-12 text-lg"
                onClick={() => {
                  setIsCartOpen(false);
                }}
                asChild
              >
                <Link to="/checkout">{t('cart.checkout')}</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsCartOpen(false)}
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
