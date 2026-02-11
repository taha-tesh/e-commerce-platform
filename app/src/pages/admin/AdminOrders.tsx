import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Eye, Package, Truck, CheckCircle, 
  Clock, XCircle, ChevronLeft, ChevronRight,
  RotateCcw, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useOrders } from '@/hooks/useOrders';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-800', label: 'orders.pending' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'orders.processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'orders.shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'orders.delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'orders.cancelled' },
  refunded: { icon: RotateCcw, color: 'bg-gray-100 text-gray-800', label: 'orders.refunded' },
};

export function AdminOrders() {
  const { t } = useTranslation();
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      toast.success(t('admin.orderUpdated') || 'Order status updated');
    } else {
      toast.error(t('admin.orderUpdateError') || 'Failed to update order status');
    }
  };

  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    const StatusIcon = config.icon;
    return (
      <Badge className={config.color}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {t(config.label)}
      </Badge>
    );
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1D21]">{t('admin.orders') || 'Orders'}</h1>
          <p className="text-[#6B7280]">{t('admin.manageOrders') || 'Manage customer orders'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-[#6B7280]">{t('admin.totalOrders')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-[#6B7280]">{t('orders.pending')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-sm text-[#6B7280]">{t('orders.processing')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              <p className="text-sm text-[#6B7280]">{t('orders.shipped')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              <p className="text-sm text-[#6B7280]">{t('orders.delivered')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder={t('admin.searchOrders') || 'Search by order number, customer...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#6B7280]" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('orders.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('orders.all')}</SelectItem>
                <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                <SelectItem value="processing">{t('orders.processing')}</SelectItem>
                <SelectItem value="shipped">{t('orders.shipped')}</SelectItem>
                <SelectItem value="delivered">{t('orders.delivered')}</SelectItem>
                <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('orders.orderNumber')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('account.title')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('orders.placedOn')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('cart.total')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('products.availability')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#6B7280]">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-[#6B7280]">{order.items.length} {t('cart.items')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                        <p className="text-xs text-[#6B7280]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {order.total.toFixed(2)} DA
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openViewDialog(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select 
                            value={order.status} 
                            onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                              <SelectItem value="processing">{t('orders.processing')}</SelectItem>
                              <SelectItem value="shipped">{t('orders.shipped')}</SelectItem>
                              <SelectItem value="delivered">{t('orders.delivered')}</SelectItem>
                              <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-[#6B7280]">
                  {t('admin.showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} {t('admin.of')} {filteredOrders.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">{currentPage} / {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('orders.viewDetails')}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#6B7280]">{t('orders.orderNumber')}</p>
                    <p className="font-bold text-lg">{selectedOrder.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#6B7280]">{t('orders.placedOn')}</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <p className="font-medium">{t('products.availability')}</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">{t('account.title')}</p>
                    <p className="text-sm">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                    <p className="text-sm text-[#6B7280]">{selectedOrder.user?.email}</p>
                    <p className="text-sm text-[#6B7280]">{selectedOrder.user?.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">{t('checkout.shippingAddress')}</p>
                    <p className="text-sm">{selectedOrder.shippingAddress?.street}</p>
                    <p className="text-sm text-[#6B7280]">
                      {selectedOrder.shippingAddress?.city}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <p className="font-medium mb-3">{t('checkout.orderItems')}</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.product?.images[0]?.url} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-[#6B7280]">
                            {t('productDetail.quantity')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.total.toFixed(2)} DA</p>
                          <p className="text-sm text-[#6B7280]">{item.price.toFixed(2)} DA / {t('productDetail.quantity')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{t('cart.subtotal')}</span>
                      <span>{selectedOrder.subtotal.toFixed(2)} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{t('cart.tax')}</span>
                      <span>{selectedOrder.tax.toFixed(2)} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{t('cart.shipping')}</span>
                      <span>{selectedOrder.shipping === 0 ? t('cart.free') : `${selectedOrder.shipping.toFixed(2)} DA`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>{t('cart.total')}</span>
                      <span className="text-[#FF6B35]">{selectedOrder.total.toFixed(2)} DA</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                  <div>
                    <p className="font-medium mb-3">{t('admin.orderTimeline') || 'Order Timeline'}</p>
                    <div className="space-y-3">
                      {selectedOrder.timeline.map((event, index) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            index === selectedOrder.timeline!.length - 1 ? 'bg-[#FF6B35]' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{event.description}</p>
                            <p className="text-xs text-[#6B7280]">
                              {new Date(event.timestamp).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
