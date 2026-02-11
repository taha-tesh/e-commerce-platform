import { Link, useParams } from 'react-router-dom';
import { Check, Package, Truck, Mail, Printer, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function OrderConfirmationPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  
  // Calculate estimated delivery (7-10 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 10);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    toast.success(t('orderConfirmation.emailSent') || 'Receipt sent to your email');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21] mb-2">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-[#6B7280] mb-6">
            {t('orderConfirmation.message')}
          </p>

          {/* Order Only Notice */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-700 text-sm">
              {t('checkout.orderOnly') || 'This is an order request. You will be contacted for payment confirmation.'}
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-sm text-[#6B7280] mb-1">{t('orderConfirmation.orderNumber')}</div>
            <div className="text-2xl font-bold text-[#1A1D21] font-mono">
              {orderId}
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Truck className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-[#1A1D21]">
              {t('orderConfirmation.estimatedDelivery')}:{' '}
              <span className="font-semibold">
                {deliveryDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                {' - '}
                {deliveryEnd.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </span>
          </div>

          {/* What's Next */}
          <div className="text-left bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-[#1A1D21] mb-4">{t('orderConfirmation.whatsNext')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="font-medium text-[#1A1D21]">{t('orderConfirmation.paymentContact') || 'Payment Confirmation'}</div>
                  <div className="text-sm text-[#6B7280]">
                    {t('orderConfirmation.paymentContactDesc') || 'We will contact you shortly to confirm payment details.'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="font-medium text-[#1A1D21]">{t('orderConfirmation.confirmationEmail')}</div>
                  <div className="text-sm text-[#6B7280]">
                    {t('orderConfirmation.confirmationDesc')}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="font-medium text-[#1A1D21]">{t('orderConfirmation.processing')}</div>
                  <div className="text-sm text-[#6B7280]">
                    {t('orderConfirmation.processingDesc')}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div>
                  <div className="font-medium text-[#1A1D21]">{t('orderConfirmation.shippingNotif')}</div>
                  <div className="text-sm text-[#6B7280]">
                    {t('orderConfirmation.shippingDesc')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-[#FF6B35] hover:bg-[#e55a2b]"
              asChild
            >
              <Link to="/products">
                {t('orderConfirmation.continueShopping')}
              </Link>
            </Button>
            <Button 
              variant="outline"
              asChild
            >
              <Link to="/orders">
                {t('orderConfirmation.viewOrder')}
              </Link>
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#FF6B35] transition-colors"
            >
              <Printer className="w-4 h-4" />
              {t('orderConfirmation.printReceipt')}
            </button>
            <span className="text-[#6B7280]">|</span>
            <button 
              onClick={handleEmailReceipt}
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#FF6B35] transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('orderConfirmation.emailReceipt')}
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-[#6B7280] text-sm">
            {t('orderConfirmation.support')}{' '}
            <a href="mailto:contact@nouressalam.ma" className="text-[#FF6B35] hover:underline">
              contact@nouressalam.ma
            </a>
            {' '}{t('common.or') || 'or'}{' '}
            <a href="tel:+2125XXXXXXXX" className="text-[#FF6B35] hover:underline">
              +212 5XX-XXXXXX
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
