export interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  banner_image: string;
  logo_image: string;
  active: boolean;
  display_order: number;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSpecifications {
  movement?: string;
  case_material?: string;
  strap_material?: string;
  dial_color?: string;
  case_color?: string;
  water_resistance?: string;
  gender?: string;
  watch_type?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_id: string; // brand slug e.g. "citizen", "tissot"
  category: string;
  description: string;
  price: number;
  sale_price?: number | null;
  sku: string;
  stock: number;
  images: string[];
  featured: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  specifications: ProductSpecifications;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  slug: string;
  brand_name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  order_notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charges: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  currency: string;
  free_shipping_min: number;
  standard_shipping_fee: number;
  shipping_fee?: number;
  free_shipping_threshold?: number;
  admin_password?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalBrands: number;
  totalOrders: number;
  totalSales: number;
  lowStock: number;
  outOfStock: number;
  recentOrders: Order[];
}

export type PageRoute =
  | { name: 'home' }
  | { name: 'shop'; query?: { brand?: string; category?: string; search?: string } }
  | { name: 'collection'; slug: string }
  | { name: 'product'; slug: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'contact' }
  | { name: 'admin-login' }
  | { name: 'admin-dashboard' }
  | { name: 'admin-products' }
  | { name: 'admin-product-add' }
  | { name: 'admin-product-edit'; id: string }
  | { name: 'admin-brands' }
  | { name: 'admin-orders' }
  | { name: 'admin-settings' };
