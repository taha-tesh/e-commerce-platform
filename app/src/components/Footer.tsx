import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, Shield, Phone, Mail, MapPin, Headphones, RotateCcw } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    shop: [
      { label: t('categories.powerTools'), href: '/products?category=power-tools' },
      { label: t('categories.handTools'), href: '/products?category=hand-tools' },
      { label: t('categories.plumbing'), href: '/products?category=plumbing' },
      { label: t('categories.electrical'), href: '/products?category=electrical' },
      { label: t('categories.hardware'), href: '/products?category=hardware' },
      { label: t('categories.safety'), href: '/products?category=safety' },
    ],
    support: [
      { label: t('nav.support'), href: '/support' },
      { label: t('support.faq'), href: '/support#faqs' },
      { label: t('footer.freeShippingDesc'), href: '/support#shipping' },
      { label: t('footer.returnsDesc'), href: '/support#returns' },
      { label: t('nav.orders'), href: '/orders' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Sustainability', href: '/sustainability' },
    ],
    account: [
      { label: t('nav.account'), href: '/account' },
      { label: t('nav.orders'), href: '/orders' },
      { label: t('nav.wishlist'), href: '/wishlist' },
    ],
  };

  return (
    <footer className="bg-[#1A1D21] text-white">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-semibold">{t('footer.freeShipping')}</div>
                <div className="text-sm text-[#9AA2AD]">{t('footer.freeShippingDesc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-semibold">{t('footer.securePayment')}</div>
                <div className="text-sm text-[#9AA2AD]">{t('footer.secureDesc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-semibold">{t('footer.expertSupport')}</div>
                <div className="text-sm text-[#9AA2AD]">{t('footer.supportDesc')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-semibold">{t('footer.easyReturns')}</div>
                <div className="text-sm text-[#9AA2AD]">{t('footer.returnsDesc')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/logo.png" 
                alt="Quincaillerie Nour Essalam" 
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-[#9AA2AD] text-sm mb-6 max-w-xs">
              {t('hero.subtitle')}
            </p>
            <div className="space-y-2 text-sm text-[#9AA2AD]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+212 5XX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@nouressalam.ma</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Casablanca, Maroc</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.shop')}</h3>
            <ul className="space-y-2 text-sm text-[#9AA2AD]">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm text-[#9AA2AD]">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm text-[#9AA2AD]">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('nav.account')}</h3>
            <ul className="space-y-2 text-sm text-[#9AA2AD]">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#9AA2AD]">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-6 text-sm text-[#9AA2AD]">
              <Link to="/privacy" className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                {t('footer.cookies')}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
