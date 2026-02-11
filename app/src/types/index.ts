// User Types
export type UserRole = 'customer' | 'contractor' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Contractor specific
  companyName?: string;
  taxId?: string;
  contractorStatus?: 'pending' | 'approved' | 'rejected';
  // Vendor specific
  vendorId?: string;
}

// Address Type
export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  subcategories?: Category[];
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  costPerUnit?: string;
  sku: string;
  barcode?: string;
  inventory: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  status: 'active' | 'draft' | 'archived';
  categoryId: string;
  category: Category;
  vendorId?: string;
  vendor?: Vendor;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
  ratings: RatingSummary;
  reviews: Review[];
  tags: string[];
  weight?: number;
  dimensions?: Dimensions;
  shippingClass?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  // Bulk pricing
  bulkPricing?: BulkPricingTier[];
  // SEO
  isFeatured: boolean;
  isBestseller: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  inventory: number;
  options: { name: string; value: string }[];
  image?: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm' | 'ft' | 'm';
}

export interface BulkPricingTier {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface RatingSummary {
  average: number;
  count: number;
  distribution: { [key: number]: number };
}

// Vendor Types
export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  status: 'pending' | 'approved' | 'suspended';
  commissionRate: number;
  ratings: RatingSummary;
  productCount: number;
  totalSales: number;
  joinedAt: string;
  documents?: VendorDocument[];
}

export interface VendorDocument {
  id: string;
  type: 'business_license' | 'tax_id' | 'insurance' | 'other';
  url: string;
  verified: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  itemCount: number;
}

// Order Types
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: User;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: PaymentMethod;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  internalNotes?: string;
  couponCode?: string;
  isBulkOrder: boolean;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  vendorId: string;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  description: string;
  location?: string;
  timestamp: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isActive: boolean;
}

// Wishlist Types
export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Bulk Order Types
export interface BulkOrderTemplate {
  id: string;
  userId: string;
  name: string;
  items: BulkOrderTemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkOrderTemplateItem {
  productId: string;
  sku: string;
  quantity: number;
}

// Analytics Types
export interface SalesAnalytics {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  salesByDay: { date: string; sales: number; orders: number }[];
  salesByCategory: { categoryId: string; categoryName: string; sales: number }[];
  topProducts: { productId: string; productName: string; quantity: number; revenue: number }[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'shipment' | 'promotion' | 'system' | 'review';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Filter Types
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  brands?: string[];
  attributes?: Record<string, string[]>;
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
