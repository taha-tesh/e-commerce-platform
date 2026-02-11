import { Link } from 'react-router-dom';
import { 
  Package, DollarSign, ShoppingBag, AlertTriangle,
  ChevronRight, ArrowUpRight, ArrowDownRight, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vendors, products, orders, salesAnalytics } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

export function VendorDashboardPage() {
  const { user } = useAuth();
  const vendor = vendors.find(v => v.userId === user?.id) || vendors[0];
  
  const vendorProducts = products.filter(p => p.vendorId === vendor.id);
  const lowStockProducts = vendorProducts.filter(p => p.inventory <= p.lowStockThreshold);
  const vendorOrders = orders.filter(o => o.items.some(i => i.vendorId === vendor.id));

  const stats = [
    { 
      title: 'Sales (30d)', 
      value: `$${salesAnalytics.totalSales.toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign 
    },
    { 
      title: 'Orders (30d)', 
      value: salesAnalytics.totalOrders.toString(), 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingBag 
    },
    { 
      title: 'Avg Order', 
      value: `$${salesAnalytics.averageOrderValue.toFixed(2)}`, 
      change: '-2.1%', 
      trend: 'down',
      icon: TrendingUp 
    },
    { 
      title: 'Products', 
      value: vendorProducts.length.toString(), 
      change: '', 
      trend: 'neutral',
      icon: Package 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
              Vendor Dashboard
            </h1>
            <p className="text-[#6B7280]">
              Welcome back, {vendor.businessName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/vendor/products">Manage Products</Link>
            </Button>
            <Button className="bg-[#FF6B35] hover:bg-[#e55a2b]">
              Add New Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-[#6B7280]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <div className={`flex items-center text-xs ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-[#6B7280]'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : stat.trend === 'down' ? (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    ) : null}
                    {stat.change} from last month
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {salesAnalytics.salesByDay.slice(-14).map((day, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#FF6B35]/20 rounded-t hover:bg-[#FF6B35]/40 transition-colors relative group"
                      style={{ height: `${(day.sales / 8000) * 100}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1D21] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${day.sales.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#6B7280]">
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/vendor/orders">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorOrders.slice(0, 5).map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-[#6B7280]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${order.items
                            .filter(i => i.vendorId === vendor.id)
                            .reduce((sum, i) => sum + i.total, 0)
                            .toFixed(2)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-[#6B7280] text-sm">All products are well stocked</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg"
                      >
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{product.name}</div>
                          <div className="text-xs text-amber-600">
                            Only {product.inventory} left
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Restock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesAnalytics.topProducts.slice(0, 5).map((product, i) => (
                    <div 
                      key={product.productId} 
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-sm font-medium text-[#FF6B35]">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {product.productName}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {product.quantity} sold
                        </div>
                      </div>
                      <div className="font-medium text-sm">
                        ${product.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link 
                    to="/vendor/products" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span>Manage Products</span>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </Link>
                  <Link 
                    to="/vendor/orders" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span>View Orders</span>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </Link>
                  <Link 
                    to="/vendor/analytics" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span>Sales Analytics</span>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </Link>
                  <Link 
                    to="/vendor/settings" 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span>Store Settings</span>
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
