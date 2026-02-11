import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, ShoppingCart, Package, 
  DollarSign, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { salesAnalytics } from '@/data/mockData';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { products } = useProducts();

  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: t('admin.totalRevenue') || 'Total Revenue',
      value: `${totalRevenue.toFixed(2)} DA`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: t('admin.totalOrders') || 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: t('admin.totalProducts') || 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      trend: '+3.1%',
      trendUp: true,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: t('admin.pendingOrders') || 'Pending Orders',
      value: pendingOrders.toString(),
      icon: TrendingUp,
      trend: pendingOrders > 0 ? 'Action needed' : 'All caught up',
      trendUp: pendingOrders === 0,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  // Low stock products
  const lowStockItems = products
    .filter(p => p.inventory <= (p.lowStockThreshold || 10))
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D21]">{t('admin.dashboard') || 'Dashboard'}</h1>
          <p className="text-[#6B7280]">{t('admin.welcome') || 'Welcome to your admin panel'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1A1D21]">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm mt-1 ${
                  stat.trendUp ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Lists Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.salesOverview') || 'Sales Overview'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesAnalytics.salesByCategory.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{cat.categoryName}</span>
                        <span className="text-sm text-[#6B7280]">{cat.sales.toLocaleString()} DA</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF6B35] rounded-full transition-all"
                          style={{ 
                            width: `${(cat.sales / Math.max(...salesAnalytics.salesByCategory.map(c => c.sales))) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.topProducts') || 'Top Products'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesAnalytics.topProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center text-sm font-bold text-[#FF6B35]">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.productName}</p>
                      <p className="text-xs text-[#6B7280]">{product.quantity} {t('cart.items')}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {product.revenue.toLocaleString()} DA
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.recentOrders') || 'Recent Orders'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-[#6B7280]">{order.user?.firstName} {order.user?.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total.toFixed(2)} DA</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {t(`orders.${order.status}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t('admin.lowStock') || 'Low Stock Alert'}
                {lowStockItems.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {lowStockItems.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-[#6B7280] text-center py-4">{t('admin.allStockGood') || 'All products have sufficient stock'}</p>
              ) : (
                <div className="space-y-4">
                  {lowStockItems.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={product.images[0]?.url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-[#6B7280]">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${product.inventory === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                          {product.inventory} {t('productDetail.quantity')}
                        </p>
                        <p className="text-xs text-[#6B7280]">{t('products.inStockOnly')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
