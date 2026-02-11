import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronRight, Truck, MapPin, 
  Check, Package, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  
  const [step, setStep] = useState<'shipping' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [shippingData, setShippingData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    phone: '',
    notes: '',
  });

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-[#6B7280]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1D21] mb-2">
            {t('cart.empty')}
          </h1>
          <p className="text-[#6B7280] mb-6">
            {t('cart.emptyMessage')}
          </p>
          <Button asChild className="bg-[#FF6B35] hover:bg-[#e55a2b]">
            <Link to="/products">{t('cart.startShopping')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Create the order using the orders hook
      const newOrder = await createOrder(shippingData);
      
      clearCart();
      toast.success(t('orderConfirmation.title'));
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    } catch (error) {
      toast.error(t('checkout.orderError') || 'Error placing order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', label: t('checkout.shipping'), number: 1 },
    { id: 'review', label: t('checkout.review'), number: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  step === s.id 
                    ? 'bg-[#FF6B35] text-white' 
                    : steps.findIndex(st => st.id === step) > index
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-[#6B7280]'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.id 
                      ? 'bg-white text-[#FF6B35]' 
                      : steps.findIndex(st => st.id === step) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-white'
                  }`}>
                    {steps.findIndex(st => st.id === step) > index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      s.number
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    steps.findIndex(st => st.id === step) > index 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {/* Shipping Step */}
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-xl font-bold text-[#1A1D21] mb-6">
                    {t('checkout.shippingInfo')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">{t('checkout.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('checkout.firstName')} *</Label>
                        <Input
                          id="firstName"
                          required
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('checkout.lastName')} *</Label>
                        <Input
                          id="lastName"
                          required
                          value={shippingData.lastName}
                          onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">{t('checkout.address')} *</Label>
                      <Input
                        id="address"
                        required
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        placeholder="123 Rue Principale"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('checkout.city')} *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                          placeholder="Casablanca"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('checkout.phone')} *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                          placeholder="+212 6XX-XXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">{t('checkout.notes') || 'Notes (optional)'}</Label>
                      <Input
                        id="notes"
                        value={shippingData.notes}
                        onChange={(e) => setShippingData({...shippingData, notes: e.target.value})}
                        placeholder={t('checkout.notesPlaceholder') || 'Any special instructions...'}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      type="submit"
                      className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] h-12"
                    >
                      {t('checkout.reviewOrderBtn')}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <div>
                  <h2 className="text-xl font-bold text-[#1A1D21] mb-6">
                    {t('checkout.reviewOrder')}
                  </h2>

                  {/* Info Banner */}
                  <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 text-sm">
                      {t('checkout.orderOnly') || 'This is an order request. You will be contacted for payment confirmation.'}
                    </span>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t('checkout.shippingAddress')}
                      </h3>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-sm text-[#FF6B35] hover:underline"
                      >
                        {t('common.edit')}
                      </button>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      <p>{shippingData.firstName} {shippingData.lastName}</p>
                      <p>{shippingData.address}</p>
                      <p>{shippingData.city}</p>
                      <p>{shippingData.phone}</p>
                      {shippingData.notes && (
                        <p className="mt-2 text-[#9AA2AD]">{t('checkout.notes')}: {shippingData.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold">{t('checkout.orderItems')}</h3>
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-[#6B7280]">
                            {t('productDetail.quantity')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.total.toFixed(2)} DA</p>
                          <p className="text-sm text-[#6B7280]">
                            {item.price.toFixed(2)} DA / {t('productDetail.quantity')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep('shipping')}
                      disabled={isProcessing}
                    >
                      {t('checkout.back')}
                    </Button>
                    <Button 
                      className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b] h-12"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('checkout.processing')}
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          {t('checkout.placeOrder')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-[#1A1D21] mb-4">{t('cart.total')}</h3>
              
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{item.total.toFixed(2)} DA</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
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
                    <span>{t('cart.discount')} ({cart.couponCode})</span>
                    <span className="font-medium">-{cart.discount.toFixed(2)} DA</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-semibold">{t('cart.total')}</span>
                <span className="font-bold text-xl text-[#FF6B35]">
                  {cart.total.toFixed(2)} DA
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-[#6B7280]">
                <Truck className="w-4 h-4" />
                <span>{t('hero.freeDelivery')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
