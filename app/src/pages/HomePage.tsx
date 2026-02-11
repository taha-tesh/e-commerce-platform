import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, ArrowRight, Truck, RotateCcw, BadgePercent, 
  ChevronRight, Star, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { categories } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { products } = useProducts();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation (auto-play on load)
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      tl.fromTo('.hero-title', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
      .fromTo('.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      )
      .fromTo(searchRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.2'
      )
      .fromTo(pillsRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );

      // Scroll-driven exit animation for hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.7) {
            const exitProgress = (progress - 0.7) / 0.3;
            gsap.to('.hero-title', {
              y: -22 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.75,
              overwrite: true,
            });
            gsap.to('.hero-subtitle', {
              y: -14 * exitProgress + 'vh',
              opacity: 1 - exitProgress * 0.75,
              overwrite: true,
            });
            gsap.to(searchRef.current, {
              y: -10 * exitProgress + 'vh',
              scale: 1 - exitProgress * 0.02,
              opacity: 1 - exitProgress * 0.75,
              overwrite: true,
            });
          }
        },
        onLeaveBack: () => {
          // Reset to visible when scrolling back to top
          gsap.to('.hero-title', { y: 0, opacity: 1, overwrite: true });
          gsap.to('.hero-subtitle', { y: 0, opacity: 1, overwrite: true });
          gsap.to(searchRef.current, { y: 0, scale: 1, opacity: 1, overwrite: true });
        },
      });

      // Category cards animation
      gsap.fromTo('.category-card',
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.categories-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Deals banner animation
      gsap.fromTo('.deals-banner',
        { x: isRTL ? 50 : -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.deals-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo('.deals-image',
        { x: isRTL ? -50 : 50, opacity: 0, scale: 1.02 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.deals-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Featured products animation
      gsap.fromTo('.featured-product',
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.featured-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isRTL]);

  const featuredProducts = (() => {
    const tagged = products.filter(p => p.isFeatured || p.isBestseller);
    if (tagged.length > 0) {
      return tagged.slice(0, 8);
    }
    // Fallback: show newest products if none are marked as featured/bestseller
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  })();

  const dealProduct = products.find(p => p.compareAtPrice && p.compareAtPrice > p.price) || products[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1D21]/60 to-[#1A1D21]/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <form 
              ref={searchRef}
              className="max-w-2xl mx-auto mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.querySelector('input') as HTMLInputElement;
                if (input.value.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(input.value)}`;
                }
              }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full h-14 pl-12 pr-4 text-lg bg-white rounded-xl shadow-2xl border-0 focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF6B35] hover:bg-[#e55a2b]"
                >
                  {t('common.search')}
                </Button>
              </div>
            </form>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button 
                size="lg"
                className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-8 h-14 text-lg"
                asChild
              >
                <Link to="/products">
                  {t('hero.shopNow')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust pills */}
            <div ref={pillsRef} className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <Truck className="w-4 h-4" />
                {t('hero.freeDelivery')}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <RotateCcw className="w-4 h-4" />
                {t('hero.returns')}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <BadgePercent className="w-4 h-4" />
                {t('hero.tradePricing')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-16 md:py-24 bg-[#F6F7F9]" style={{ zIndex: 20 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
              {t('categories.title')}
            </h2>
            <Link 
              to="/products" 
              className="flex items-center gap-1 text-[#FF6B35] hover:underline font-medium"
            >
              {t('categories.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="category-card group"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      {dealProduct && (
        <section className="deals-section py-8 bg-[#F6F7F9]" style={{ zIndex: 20 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="deals-banner relative bg-[#1A1D21] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative grid md:grid-cols-2 gap-6 p-8 md:p-12 items-center">
                <div className="text-white">
                  <Badge className="bg-[#FF6B35] text-white border-0 mb-4">
                    <Zap className="w-3 h-3 mr-1" />
                    {t('nav.deals')}
                  </Badge>
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    {t('products.save')} {Math.round(((dealProduct.compareAtPrice! - dealProduct.price) / dealProduct.compareAtPrice!) * 100)}% {t('products.on')} {dealProduct.name}
                  </h2>
                  <p className="text-white/70 mb-6">
                    {t('hero.subtitle')}
                  </p>
                  <Button 
                    className="bg-[#FF6B35] hover:bg-[#e55a2b]"
                    asChild
                  >
                    <Link to={`/products/${dealProduct.slug}`}>
                      {t('hero.shopNow')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <div className="deals-image flex justify-center">
                  <img
                    src={dealProduct.images[0]?.url}
                    alt={dealProduct.name}
                    className="max-h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="featured-section py-16 md:py-24 bg-[#F6F7F9]" style={{ zIndex: 20 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1D21] mb-2">
                {t('products.featured')}
              </h2>
              <p className="text-[#6B7280]">{t('products.handpicked')}</p>
            </div>
            <Link 
              to="/products" 
              className="flex items-center gap-1 text-[#FF6B35] hover:underline font-medium"
            >
              {t('categories.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="featured-product">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-[#F6F7F9]" style={{ zIndex: 20 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1D21] mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              See why contractors and DIY enthusiasts choose BuildMart for their projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Mike Johnson',
                role: 'General Contractor',
                content: 'BuildMart has become my go-to for all job site supplies. The prices save me thousands every month.',
                rating: 5,
              },
              {
                name: 'Sarah Williams',
                role: 'DIY Enthusiast',
                content: 'Fast shipping, great prices, and excellent customer service. I recommend BuildMart to all my friends.',
                rating: 5,
              },
              {
                name: 'David Chen',
                role: 'Electrician',
                content: 'The electrical selection is top-notch. I can find everything I need in one place, and it ships fast.',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                  ))}
                </div>
                <p className="text-[#1A1D21] mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-semibold text-[#1A1D21]">{testimonial.name}</div>
                  <div className="text-sm text-[#6B7280]">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
