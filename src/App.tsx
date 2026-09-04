import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Portal Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminBrands } from './admin/AdminBrands';
import { AdminOrders } from './admin/AdminOrders';
import { AdminSettings } from './admin/AdminSettings';

const AppContent: React.FC = () => {
  const { currentRoute, isAdminLoggedIn, toast } = useStore();

  const isAdminRoute = currentRoute.name.startsWith('admin-');

  // Handle Admin Pages
  if (isAdminRoute) {
    if (currentRoute.name === 'admin-login') {
      return <AdminLogin />;
    }

    // Require authentication for admin subpages
    if (!isAdminLoggedIn) {
      return <AdminLogin />;
    }

    let adminContent: React.ReactNode = null;
    let activeTab: 'dashboard' | 'products' | 'add-product' | 'brands' | 'orders' | 'settings' = 'dashboard';

    switch (currentRoute.name) {
      case 'admin-dashboard':
        activeTab = 'dashboard';
        adminContent = <AdminDashboard />;
        break;
      case 'admin-products':
        activeTab = 'products';
        adminContent = <AdminProducts />;
        break;
      case 'admin-product-add':
        activeTab = 'add-product';
        adminContent = <AdminProductForm />;
        break;
      case 'admin-product-edit':
        activeTab = 'products';
        adminContent = <AdminProductForm productId={currentRoute.id} />;
        break;
      case 'admin-brands':
        activeTab = 'brands';
        adminContent = <AdminBrands />;
        break;
      case 'admin-orders':
        activeTab = 'orders';
        adminContent = <AdminOrders />;
        break;
      case 'admin-settings':
        activeTab = 'settings';
        adminContent = <AdminSettings />;
        break;
      default:
        adminContent = <AdminDashboard />;
    }

    return (
      <div className="bg-[#0a0a0a] min-h-screen text-stone-200">
        <AdminLayout activeTab={activeTab}>
          {adminContent}
        </AdminLayout>

        {/* Global Notification Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0">
            <div className={`px-5 py-3 shadow-2xl text-xs font-semibold uppercase tracking-wider border flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-800'
                : toast.type === 'info'
                ? 'bg-stone-900 text-stone-200 border-stone-700'
                : 'bg-[#182a1e] text-[#86e2a2] border-[#294c34]'
            }`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle Public Storefront Pages
  let pageContent: React.ReactNode = null;

  switch (currentRoute.name) {
    case 'home':
      pageContent = <HomePage />;
      break;
    case 'shop':
      pageContent = <ShopPage />;
      break;
    case 'collection':
      pageContent = <CollectionPage slug={currentRoute.slug} />;
      break;
    case 'product':
      pageContent = <ProductPage slug={currentRoute.slug} />;
      break;
    case 'cart':
      pageContent = <ShopPage />;
      break;
    case 'checkout':
      pageContent = <CheckoutPage />;
      break;
    case 'contact':
      pageContent = <ContactPage />;
      break;
    default:
      pageContent = <HomePage />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 flex flex-col font-sans selection:bg-[#c5a880] selection:text-black">
      {/* Luxury Global Header */}
      <Header />

      {/* Primary Main Content View */}
      <main className="flex-1">
        {pageContent}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Pakistani WhatsApp Direct Chat Overlay */}
      <FloatingWhatsApp />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <CartDrawer />

      {/* Global Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0">
          <div className={`px-5 py-3 shadow-2xl text-xs font-semibold uppercase tracking-wider border flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : toast.type === 'info'
              ? 'bg-stone-900 text-stone-200 border-stone-700'
              : 'bg-[#182a1e] text-[#86e2a2] border-[#294c34]'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
