import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Brand, Product, CartItem, PageRoute, StoreSettings } from '../types';
import { api, getAdminToken, clearAdminToken } from '../api/client';

interface StoreContextType {
  brands: Brand[];
  products: Product[];
  settings: StoreSettings;
  storeSettings: StoreSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharges: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Router
  currentRoute: PageRoute;
  navigate: (url: string) => void;

  // Admin Auth state
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  logoutAdmin: () => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: 'INAYAT WATCH COMPANY',
  tagline: 'Timeless Elegance & Horological Excellence',
  whatsapp_number: '+923314900788',
  phone_number: '+92 331 4900788',
  email: 'info@inayatwatches.pk',
  address: 'Inayat Watch Company, Lahore, Pakistan',
  currency: 'Rs.',
  free_shipping_min: 5000,
  standard_shipping_fee: 250,
};

const StoreContext = createContext<StoreContextType | null>(null);

function parsePathToRoute(pathname: string): PageRoute {
  const clean = pathname.replace(/\/$/, '') || '/';

  if (clean === '/') return { name: 'home' };
  if (clean === '/shop') return { name: 'shop' };
  if (clean === '/cart') return { name: 'cart' };
  if (clean === '/checkout') return { name: 'checkout' };
  if (clean === '/contact') return { name: 'contact' };

  if (clean.startsWith('/collections/')) {
    const slug = clean.replace('/collections/', '');
    return { name: 'collection', slug };
  }

  if (clean.startsWith('/products/')) {
    const slug = clean.replace('/products/', '');
    return { name: 'product', slug };
  }

  // Admin routes
  if (clean === '/admin/login') return { name: 'admin-login' };
  if (clean === '/admin' || clean === '/admin/dashboard') return { name: 'admin-dashboard' };
  if (clean === '/admin/products') return { name: 'admin-products' };
  if (clean === '/admin/products/add') return { name: 'admin-product-add' };
  if (clean.startsWith('/admin/products/edit/')) {
    const id = clean.replace('/admin/products/edit/', '');
    return { name: 'admin-product-edit', id };
  }
  if (clean === '/admin/brands') return { name: 'admin-brands' };
  if (clean === '/admin/orders') return { name: 'admin-orders' };
  if (clean === '/admin/settings' || clean === '/admin/customers') return { name: 'admin-settings' };

  return { name: 'home' };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('iwc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('iwc_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Routing
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() =>
    parsePathToRoute(window.location.pathname)
  );

  // Admin auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => !!getAdminToken());

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('iwc_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('iwc_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Browser navigation sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parsePathToRoute(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((url: string) => {
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
      setCurrentRoute(parsePathToRoute(url));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Load data from backend
  const refreshData = useCallback(async () => {
    try {
      const [fetchedBrands, fetchedProducts, fetchedSettings] = await Promise.all([
        api.getBrands(),
        api.getProducts(),
        api.getSettings().catch(() => DEFAULT_SETTINGS),
      ]);
      setBrands(fetchedBrands);
      setProducts(fetchedProducts);
      if (fetchedSettings) setSettings(fetchedSettings);
    } catch (err) {
      console.error('Failed to fetch initial data from server:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Check admin session on mount
  useEffect(() => {
    if (getAdminToken()) {
      api.verifyAuth()
        .then(res => {
          if (!res.valid) {
            clearAdminToken();
            setIsAdminLoggedIn(false);
          }
        })
        .catch(() => {
          clearAdminToken();
          setIsAdminLoggedIn(false);
        });
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    api.logout().catch(() => {});
    clearAdminToken();
    setIsAdminLoggedIn(false);
    showToast('Admin logged out successfully', 'info');
    navigate('/admin/login');
  }, [navigate, showToast]);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
    showToast(`Added ${product.name} to cart`, 'success');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.sale_price !== null && item.product.sale_price !== undefined
      ? item.product.sale_price
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryCharges = cartSubtotal > 0 && cartSubtotal < settings.free_shipping_min
    ? settings.standard_shipping_fee
    : 0;

  const cartTotal = cartSubtotal + deliveryCharges;

  // Wishlist
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <StoreContext.Provider
      value={{
        brands,
        products,
        settings,
        storeSettings: settings,
        isLoading,
        refreshData,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharges,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentRoute,
        navigate,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        logoutAdmin,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
