import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { Product, ApiResponse } from '@/types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<Product | null>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const result = await response.json() as ApiResponse<Product[]>;

      if (!response.ok || !result.success || !result.data) {
        console.error(result.message || 'Failed to load products');
        return;
      }

      setProducts(result.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Product) => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) {
      console.error('Missing auth token');
      return null;
    }

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    const result = await response.json() as ApiResponse<Product>;

    if (!response.ok || !result.success || !result.data) {
      console.error(result.message || 'Failed to create product');
      return null;
    }

    setProducts(prev => [result.data as Product, ...prev]);
    return result.data as Product;
  }, []);

  const updateProduct = useCallback(async (productId: string, data: Partial<Product>) => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) {
      console.error('Missing auth token');
      return null;
    }

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json() as ApiResponse<Product>;

    if (!response.ok || !result.success || !result.data) {
      console.error(result.message || 'Failed to update product');
      return null;
    }

    setProducts(prev =>
      prev.map(p => (p.id === productId ? (result.data as Product) : p)),
    );

    return result.data as Product;
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    const token = localStorage.getItem('nouressalam_token');
    if (!token) {
      console.error('Missing auth token');
      return;
    }

    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to delete product');
      return;
    }

    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const getProductById = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);

  const getProductBySlug = useCallback((slug: string) => {
    return products.find(p => p.slug === slug);
  }, [products]);

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductBySlug,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
