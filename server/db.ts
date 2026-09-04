import fs from 'fs';
import path from 'path';

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
  created_at: string;
  updated_at: string;
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
  brand_id: string; // matches brand.slug e.g. "citizen"
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

export interface OrderItem {
  product_id: string;
  name: string;
  slug: string;
  brand_name: string;
  price: number;
  quantity: number;
  image: string;
}

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
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
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
  admin_email: string;
  admin_password_hash: string;
}

export interface DatabaseSchema {
  brands: Brand[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brand-citizen',
    name: 'Citizen',
    slug: 'citizen',
    tagline: 'Eco-Drive & Precision Horology',
    description: 'Pioneering Japanese engineering, Eco-Drive light-powered movements, and unrivaled durability crafted for discerning collectors.',
    banner_image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80',
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-tissot',
    name: 'Tissot',
    slug: 'tissot',
    tagline: 'Swiss Tradition Since 1853',
    description: 'Swiss horological mastery featuring iconic automatic movements, sapphire crystal dials, and classical aesthetic balance.',
    banner_image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-rado',
    name: 'Rado',
    slug: 'rado',
    tagline: 'Master of High-Tech Materials',
    description: 'World-renowned for revolutionary scratch-resistant high-tech ceramic, minimalist contours, and avant-garde luxury.',
    banner_image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-casio',
    name: 'Casio',
    slug: 'casio',
    tagline: 'Legendary Reliability & Timeless Design',
    description: 'Iconic digital and analog designs built for endurance, absolute precision, and unmistakable retro-modern appeal.',
    banner_image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-edifice',
    name: 'Edifice',
    slug: 'edifice',
    tagline: 'Speed, Intelligence & Motorsport Precision',
    description: 'Engineered for motorsport passion with complex multi-layered dials, chronograph accuracy, and dynamic stainless steel cases.',
    banner_image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-slazenger',
    name: 'Slazenger',
    slug: 'slazenger',
    tagline: 'Distinguished British Heritage',
    description: 'Classic British sporting prestige and timeless fashion chronographs designed for everyday luxury and active distinction.',
    banner_image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-imperial',
    name: 'Imperial',
    slug: 'imperial',
    tagline: 'Regal Distinction & Prestige',
    description: 'Opulent executive wristwatches with exquisite champagne gold accents, rich leather straps, and aristocratic charm.',
    banner_image: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-emporio-armani',
    name: 'Emporio Armani',
    slug: 'emporio-armani',
    tagline: 'Contemporary Italian Luxury',
    description: 'Milanese high fashion elegance with sleek architectural silhouettes, refined sunray dials, and iconic Eagle insignia.',
    banner_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-crysm',
    name: 'Crysm',
    slug: 'crysm',
    tagline: 'Modern Crystalline Architecture',
    description: 'Bold geometric angles, precision cut crystals, and contemporary minimalist dials for the modern trendsetter.',
    banner_image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1600&q=85',
    logo_image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    active: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  store_name: 'INAYAT WATCH COMPANY',
  tagline: 'Timeless Elegance & Horological Excellence',
  whatsapp_number: '+923314900788',
  phone_number: '+92 331 4900788',
  email: 'info@inayatwatches.pk',
  address: 'Inayat Watch Company, Lahore, Pakistan',
  currency: 'Rs.',
  free_shipping_min: 5000,
  standard_shipping_fee: 250,
  admin_email: 'admin@inayatwatches.pk',
  admin_password_hash: 'inayat123', // In production or custom setup, stored securely
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        
        // Ensure all 9 required brands exist and are maintained
        const existingSlugs = new Set(parsed.brands?.map((b: Brand) => b.slug) || []);
        const mergedBrands = [...(parsed.brands || [])];

        for (const initialBrand of INITIAL_BRANDS) {
          if (!existingSlugs.has(initialBrand.slug)) {
            mergedBrands.push(initialBrand);
          }
        }

        return {
          brands: mergedBrands,
          products: parsed.products || [],
          orders: parsed.orders || [],
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
        };
      }
    } catch (err) {
      console.error('Error reading database file, creating fresh initial store:', err);
    }

    // Default fresh DB with the 9 pre-configured brands and 0 products
    const initialDb: DatabaseSchema = {
      brands: INITIAL_BRANDS,
      products: [],
      orders: [],
      settings: INITIAL_SETTINGS,
    };
    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      // Atomic write via temp file
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  // Brands
  getBrands(): Brand[] {
    return [...this.data.brands].sort((a, b) => a.display_order - b.display_order);
  }

  getBrandBySlug(slug: string): Brand | undefined {
    return this.data.brands.find(b => b.slug.toLowerCase() === slug.toLowerCase());
  }

  getBrandById(id: string): Brand | undefined {
    return this.data.brands.find(b => b.id === id);
  }

  updateBrand(idOrSlug: string, updates: Partial<Brand>): Brand | null {
    const index = this.data.brands.findIndex(b => b.id === idOrSlug || b.slug === idOrSlug);
    if (index === -1) return null;

    this.data.brands[index] = {
      ...this.data.brands[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.brands[index];
  }

  // Products
  getProducts(filters?: {
    brand_id?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    new_arrival?: boolean;
    on_sale?: boolean;
    sort?: string;
  }): Product[] {
    let result = [...this.data.products];

    if (filters?.brand_id) {
      const bSlug = filters.brand_id.toLowerCase().trim();
      result = result.filter(p => p.brand_id.toLowerCase().trim() === bSlug);
    }

    if (filters?.category) {
      const cat = filters.category.toLowerCase().trim();
      result = result.filter(p => p.category.toLowerCase().includes(cat));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand_id.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filters?.featured !== undefined) {
      result = result.filter(p => p.featured === filters.featured);
    }

    if (filters?.new_arrival !== undefined) {
      result = result.filter(p => p.new_arrival === filters.new_arrival);
    }

    if (filters?.on_sale !== undefined) {
      result = result.filter(p => p.on_sale === filters.on_sale);
    }

    // Sorting
    if (filters?.sort === 'price-asc') {
      result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (filters?.sort === 'price-desc') {
      result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (filters?.sort === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Default: featured first, then newest
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  }

  addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    
    // Ensure slug is clean and unique
    let baseSlug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!baseSlug) baseSlug = `watch-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (this.data.products.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProduct: Product = {
      ...productData,
      id,
      slug,
      created_at: now,
      updated_at: now,
    };

    this.data.products.unshift(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = this.data.products[index];

    // If slug is changed, verify uniqueness
    let slug = existing.slug;
    if (updates.slug && updates.slug !== existing.slug) {
      let baseSlug = updates.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      slug = baseSlug;
      let counter = 1;
      while (this.data.products.some(p => p.id !== id && p.slug === slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    this.data.products[index] = {
      ...existing,
      ...updates,
      slug,
      updated_at: new Date().toISOString(),
    };

    this.saveData();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.order_number === id);
  }

  addOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'status'>): Order {
    const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = `IWC-${1000 + this.data.orders.length + 1}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      order_number: orderNumber,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    };

    // Optionally decrease stock for items
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.product_id);
      if (prod && prod.stock > 0) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date().toISOString();
    this.saveData();
    return order;
  }

  // Settings
  getSettings(): StoreSettings {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.saveData();
    return this.data.settings;
  }

  // Stats
  getStats() {
    const products = this.data.products;
    const orders = this.data.orders;
    const brands = this.data.brands;

    const totalProducts = products.length;
    const totalBrands = brands.length;
    const totalOrders = orders.length;
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 3).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return {
      totalProducts,
      totalBrands,
      totalOrders,
      totalSales,
      lowStock,
      outOfStock,
      recentOrders: orders.slice(0, 5),
    };
  }
}

export const db = new Database();
