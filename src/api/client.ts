import { Brand, Product, Order, StoreSettings, DashboardStats } from '../types';

const ADMIN_TOKEN_KEY = 'iwc_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `API Error (${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) errorMsg = errorJson.error;
    } catch {
      // fallback to status text
      errorMsg = res.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Public
  getBrands: () => apiRequest<Brand[]>('/api/brands'),
  getBrand: (slug: string) => apiRequest<{ brand: Brand; products: Product[]; product_count: number }>(`/api/brands/${slug}`),
  
  getProducts: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const url = `/api/products${query.toString() ? `?${query.toString()}` : ''}`;
    return apiRequest<Product[]>(url);
  },

  getProduct: (slug: string) => apiRequest<{ product: Product; brand?: Brand; related: Product[] }>(`/api/products/${slug}`),

  getSettings: () => apiRequest<StoreSettings>('/api/settings'),

  createOrder: (orderData: any) => apiRequest<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Admin Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ success: boolean; token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyAuth: () => apiRequest<{ valid: boolean }>('/api/auth/verify'),

  logout: () => apiRequest<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  // Admin Operations
  getAdminStats: () => apiRequest<DashboardStats>('/api/admin/stats'),

  createProduct: (data: Partial<Product>) =>
    apiRequest<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  updateBrand: (id: string, data: Partial<Brand>) =>
    apiRequest<Brand>(`/api/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadImage: (data: { data: string; filename?: string }) =>
    apiRequest<{ url: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrders: () => apiRequest<Order[]>('/api/orders'),
  getAdminOrders: () => apiRequest<Order[]>('/api/orders'),

  getOrder: (id: string) => apiRequest<Order>(`/api/orders/${id}`),

  updateOrderStatus: (id: string, status: Order['status']) =>
    apiRequest<Order>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  updateSettings: (data: Partial<StoreSettings>) =>
    apiRequest<StoreSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateStoreSettings: (data: Partial<StoreSettings>) =>
    apiRequest<StoreSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
