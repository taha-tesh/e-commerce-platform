import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronRight, Package, Truck, CheckCircle, Clock, 
  XCircle, FileText, RotateCcw, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-800', labelKey: 'orders.pending' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', labelKey: 'orders.processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', labelKey: 'orders.shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', labelKey: 'orders.delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', labelKey: 'orders.cancelled' },
  refunded: { icon: RotateCcw, color: 'bg-gray-100 text-gray-800', labelKey: 'orders.refunded' },
};

function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono font-semibold text-[#1A1D21]">
              {order.orderNumber}
            </span>
            <Badge className={status.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {t(status.labelKey)}
            </Badge>
          </div>
          <div className="text-sm text-[#6B7280]">
            {t('orders.placedOn')} {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-[#1A1D21]">
            {order.total.toFixed(2)} DA
          </div>
          <div className="text-sm text-[#6B7280]">
            {order.items.length} {order.items.length === 1 ? t('cart.item') : t('cart.items')}
          </div>
        </div>
      </div>

      {/* Items preview */}
      <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex-shrink-0">
            <img
              src={item.product?.images[0]?.url}
              alt={item.product?.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
        {order.trackingNumber && (
          <Button variant="outline" size="sm" asChild>
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
              <Truck className="w-4 h-4 mr-2" />
              {t('orders.trackOrder')}
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          {t('orders.invoice')}
        </Button>
        {order.status === 'delivered' && (
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('orders.buyAgain')}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-[#FF6B35]"
          asChild
        >
          <Link to={`/orders/${order.id}`}>
            {t('orders.viewDetails')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />
            <span className="text-[#6B7280]">
              {order.timeline[order.timeline.length - 1].description}
            </span>
            <span className="text-[#6B7280]">
              {new Date(order.timeline[order.timeline.length - 1].timestamp).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Get user orders
  const userOrders = user ? getUserOrders() : [];

  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const orderCounts = {
    all: userOrders.length,
    pending: userOrders.filter(o => o.status === 'pending').length,
    processing: userOrders.filter(o => o.status === 'processing').length,
    shipped: userOrders.filter(o => o.status === 'shipped').length,
    delivered: userOrders.filter(o => o.status === 'delivered').length,
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
          <span className="text-[#1A1D21]">{t('orders.title')}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
            {t('orders.title')}
          </h1>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder={t('orders.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              {t('orders.all')} ({orderCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              {t('orders.pending')} ({orderCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              {t('orders.processing')} ({orderCounts.processing})
            </TabsTrigger>
            <TabsTrigger value="shipped" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              {t('orders.shipped')} ({orderCounts.shipped})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white">
              {t('orders.delivered')} ({orderCounts.delivered})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1D21] mb-2">
                  {t('orders.noOrders')}
                </h3>
                <p className="text-[#6B7280] mb-6">
                  {searchQuery 
                    ? t('orders.tryAdjusting') || 'Try adjusting your search query'
                    : t('orders.noOrdersMessage')
                  }
                </p>
                <Button asChild className="bg-[#FF6B35] hover:bg-[#e55a2b]">
                  <Link to="/products">{t('cart.startShopping')}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
