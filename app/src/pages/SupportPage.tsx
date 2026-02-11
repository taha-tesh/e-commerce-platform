import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Phone, Mail, Clock, MessageCircle,
  Package, RotateCcw, Truck, CreditCard,
  Send 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function SupportPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: t('support.faqTrackOrder') || 'How do I track my order?',
      answer: t('support.faqTrackOrderAnswer') || 'You can track your order by logging into your account and visiting the Orders page. Click on the order you want to track and you\'ll see the current status and tracking information.',
      icon: Package,
    },
    {
      question: t('support.faqReturn') || 'What is your return policy?',
      answer: t('support.faqReturnAnswer') || 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging. Some items like safety equipment and custom orders may not be eligible for return.',
      icon: RotateCcw,
    },
    {
      question: t('support.faqShipping') || 'How long does shipping take?',
      answer: t('support.faqShippingAnswer') || 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. Free shipping is available on orders over $75.',
      icon: Truck,
    },
    {
      question: t('support.faqPayment') || 'What payment methods do you accept?',
      answer: t('support.faqPaymentAnswer') || 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.',
      icon: CreditCard,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t('support.messageSent') || 'Message sent! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      orderNumber: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">{t('nav.home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1A1D21]">{t('nav.support')}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1D21] mb-4">
            {t('support.title')}
          </h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            {t('support.subtitle')}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <h3 className="font-semibold text-[#1A1D21] mb-2">{t('support.phone')}</h3>
            <p className="text-[#6B7280] text-sm mb-4">
              {t('support.phoneDesc')}
            </p>
            <a 
              href="tel:1-800-BUILD-IT" 
              className="text-[#FF6B35] font-medium hover:underline"
            >
              1-800-BUILD-IT
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <h3 className="font-semibold text-[#1A1D21] mb-2">{t('support.email')}</h3>
            <p className="text-[#6B7280] text-sm mb-4">
              {t('support.emailDesc')}
            </p>
            <a 
              href="mailto:support@buildmart.com" 
              className="text-[#FF6B35] font-medium hover:underline"
            >
              support@buildmart.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <h3 className="font-semibold text-[#1A1D21] mb-2">{t('support.liveChat')}</h3>
            <p className="text-[#6B7280] text-sm mb-4">
              {t('support.chatDesc')}
            </p>
            <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e55a2b]">
              {t('support.startChat')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#1A1D21] mb-6">
              {t('support.sendMessage')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('support.name')} *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('support.namePlaceholder') || 'Your name'}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('auth.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="orderNumber">{t('support.orderNumber')}</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                  placeholder="BM-2024-XXXX"
                />
              </div>

              <div>
                <Label htmlFor="subject">{t('support.subject')} *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder={t('support.subjectPlaceholder') || 'How can we help?'}
                />
              </div>

              <div>
                <Label htmlFor="message">{t('support.message')} *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={t('support.messagePlaceholder') || 'Tell us more about your question or issue...'}
                  rows={5}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t('support.sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('support.send')}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* FAQs */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1A1D21]">
              {t('support.faq')}
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1D21] mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-[#6B7280] text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-[#1A1D21] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('support.hours')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9AA2AD]">{t('support.monFri')}</span>
                  <span>7:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA2AD]">{t('support.saturday')}</span>
                  <span>8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA2AD]">{t('support.sunday')}</span>
                  <span>{t('support.closed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
