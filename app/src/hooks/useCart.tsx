import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Cart, CartItem, Product, ProductVariant } from '@/types';
import { initialCart } from '@/data/mockData';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD = 75;

function calculateCartTotals(items: CartItem[], discount: number = 0): Partial<Cart> {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12.99;
  const total = subtotal + tax + shipping - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    const saved = localStorage.getItem('buildmart_cart');
    return saved ? JSON.parse(saved) : initialCart;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage
  React.useEffect(() => {
    localStorage.setItem('buildmart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => 
        item.productId === product.id && item.variantId === variant?.id
      );

      let newItems: CartItem[];
      
      if (existingItem) {
        // Update existing item
        newItems = prev.items.map(item => {
          if (item.id === existingItem.id) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              total: Math.round(newQuantity * item.price * 100) / 100,
            };
          }
          return item;
        });
      } else {
        // Add new item
        const price = variant?.price || product.price;
        const newItem: CartItem = {
          id: `ci-${Date.now()}`,
          productId: product.id,
          product,
          variantId: variant?.id,
          variant,
          quantity,
          price,
          total: Math.round(quantity * price * 100) / 100,
        };
        newItems = [...prev.items, newItem];
      }

      const totals = calculateCartTotals(newItems, prev.discount);
      
      toast.success(`Added ${product.name} to cart`);
      
      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      const totals = calculateCartTotals(newItems, prev.discount);
      
      toast.info('Item removed from cart');
      
      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            total: Math.round(quantity * item.price * 100) / 100,
          };
        }
        return item;
      });

      const totals = calculateCartTotals(newItems, prev.discount);
      
      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(initialCart);
    localStorage.removeItem('buildmart_cart');
    toast.info('Cart cleared');
  }, []);

  const applyCoupon = useCallback((code: string) => {
    // Mock coupon validation
    const coupons: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
      'WELCOME15': { type: 'percentage', value: 15 },
      'BUILD20': { type: 'fixed', value: 20 },
      'CONTRACTOR10': { type: 'percentage', value: 10 },
    };

    const coupon = coupons[code.toUpperCase()];
    
    if (!coupon) {
      toast.error('Invalid coupon code');
      return;
    }

    setCart(prev => {
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = prev.subtotal * (coupon.value / 100);
      } else {
        discount = coupon.value;
      }
      discount = Math.min(discount, prev.subtotal);

      const totals = calculateCartTotals(prev.items, discount);
      
      toast.success(`Coupon applied: ${code}`);
      
      return {
        ...prev,
        couponCode: code.toUpperCase(),
        discount: Math.round(discount * 100) / 100,
        ...totals,
      };
    });
  }, []);

  const removeCoupon = useCallback(() => {
    setCart(prev => {
      const totals = calculateCartTotals(prev.items, 0);
      
      toast.info('Coupon removed');
      
      return {
        ...prev,
        couponCode: undefined,
        discount: 0,
        ...totals,
      };
    });
  }, []);

  const cartItemCount = useMemo(() => cart.itemCount, [cart.itemCount]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      setIsCartOpen,
      cartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
