import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { Order, OrderStatus, Address, ApiResponse } from '@/types';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface OrdersContextType {
  orders: Order[];
  createOrder: (shippingData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
    notes?: string;
  }) => Promise<Order>;
  getUserOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<Order | null>;
  addOrder: (order: Order) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { cart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json() as ApiResponse<Order[]>;

      if (!response.ok || !result.success || !result.data) {
        console.error(result.message || 'Failed to load orders');
        return;
      }

      setOrders(result.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const createOrder = useCallback(async (shippingData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
    notes?: string;
  }): Promise<Order> => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const orderNumber = `NE-${Date.now().toString().slice(-6)}`;
    
    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      userId: user?.id || 'guest',
      label: 'Shipping',
      street: shippingData.address,
      city: shippingData.city,
      state: '',
      zipCode: '',
      country: 'Morocco',
      isDefault: true,
    };

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: user?.id || 'guest',
      user: user || {
        id: 'guest',
        email: shippingData.email,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        role: 'customer',
        phone: shippingData.phone,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      status: 'pending',
      paymentStatus: 'pending',
      items: cart.items.map(item => ({
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        vendorId: item.product.vendorId || 'vendor-1',
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      shippingAddress,
      billingAddress: shippingAddress,
      couponCode: cart.couponCode,
      isBulkOrder: false,
      notes: shippingData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `ot-${Date.now()}`,
          status: 'pending',
          description: 'Order placed',
          timestamp: new Date().toISOString(),
        }
      ],
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });

      const result = await response.json() as ApiResponse<Order>;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || 'Failed to create order');
      }

      const savedOrder = result.data as Order;
      setOrders(prev => [savedOrder, ...prev]);
      return savedOrder;
    } catch (error) {
      console.error('Error creating order', error);
      throw error;
    }
  }, [user, cart, orders]);

  const getUserOrders = useCallback(() => {
    if (!user) return [];
    return orders.filter(order => order.userId === user.id);
  }, [orders, user]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId || order.orderNumber === orderId);
  }, [orders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) {
      console.error('Missing auth token');
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json() as ApiResponse<Order>;

      if (!response.ok || !result.success || !result.data) {
        console.error(result.message || 'Failed to update order');
        return null;
      }

      const updatedOrder = result.data as Order;

      setOrders(prev =>
        prev.map(order => (order.id === orderId ? updatedOrder : order)),
      );

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order', error);
      return null;
    }
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  return (
    <OrdersContext.Provider value={{
      orders,
      createOrder,
      getUserOrders,
      getOrderById,
      updateOrderStatus,
      addOrder,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
