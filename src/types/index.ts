export interface Product {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  sku: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  brand: string;
  tags: string[];
  variants: Variant[];
  inventory: number;
  lowStockThreshold: number;
  featured: boolean;
  active: boolean;
  status: 'draft' | 'published' | 'archived';
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export interface Variant {
  id: string;
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "Large", "Red"
  sku: string;
  priceModifier?: number; // e.g. +$10 for large
  stock: number;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'prepaid';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Dispatched' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  variantSelections?: Record<string, string>;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'customer' | 'admin';
  displayName?: string;
  phone?: string;
  createdAt: number;
}
