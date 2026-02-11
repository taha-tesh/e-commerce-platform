import { Link } from 'react-router-dom';
import { 
  Users, ShoppingBag, Store, DollarSign,
  ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle,
  Package 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesAnalytics, vendors, orders, users } from '@/data/mockData';

export function AdminDashboardPage() {
  const pendingVendors = vendors.filter(v => v.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const totalUsers = users.length;

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `$${(salesAnalytics.totalSales * 3).toLocaleString()}`, 
      change: '+15.3%', 
      trend: 'up',
      icon: DollarSign 
    },
    { 
      title: 'Total Orders', 
      value: (salesAnalytics.totalOrders * 3).toString(), 
      change: '+10.8%', 
      trend: 'up',
      icon: ShoppingBag 
    },
    { 
      title: 'Active Users', 
      value: totalUsers.toString(), 
      change: '+5.2%', 
      trend: 'up',
      icon: Users 
    },
    { 
      title: 'Vendors', 
      value: vendors.length.toString(), 
      change: '+2', 
      trend: 'up',
      icon: Store 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1D21]">
              Admin Dashboard
            </h1>
            <p className="text-[#6B7280]">
              Platform overview and management
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/moderation">Moderation</Link>
            </Button>
            <Button className="bg-[#FF6B35] hover:bg-[#e55a2b]">
              Generate Report
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

        {/* Alerts */}
        {(pendingVendors.length > 0 || pendingOrders.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {pendingVendors.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">
                        {pendingVendors.length} vendor{pendingVendors.length > 1 ? 's' : ''} pending approval
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Review and approve vendor applications
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-amber-600 hover:bg-amber-700"
                        asChild
                      >
                        <Link to="/admin/moderation">Review Vendors</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {pendingOrders.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900">
                        {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} pending
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Orders waiting to be processed
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-blue-600 hover:bg-blue-700"
                      >
                        Process Orders
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {salesAnalytics.salesByDay.slice(-30).map((day, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#FF6B35]/20 rounded-t hover:bg-[#FF6B35]/40 transition-colors relative group"
                      style={{ height: `${(day.sales / 10000) * 100}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1D21] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${day.sales.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#6B7280]">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesAnalytics.salesByCategory.map((cat) => (
                    <div key={cat.categoryId} className="flex items-center gap-4">
                      <div className="w-32 text-sm">{cat.categoryName}</div>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF6B35] rounded-full"
                          style={{ 
                            width: `${(cat.sales / salesAnalytics.totalSales) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="w-20 text-right text-sm font-medium">
                        ${cat.sales.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesAnalytics.topProducts.map((product, i) => (
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

            {/* Recent Vendors */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <div 
                      key={vendor.id} 
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {vendor.logo ? (
                          <img src={vendor.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <Store className="w-5 h-5 text-[#6B7280]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {vendor.businessName}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {vendor.productCount} products
                        </div>
                      </div>
                      <Badge className={
                        vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                        vendor.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {vendor.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/admin/moderation">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Moderate Content
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Store className="w-4 h-4 mr-2" />
                    Manage Vendors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
