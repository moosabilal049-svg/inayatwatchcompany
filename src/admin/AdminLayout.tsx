import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Clock,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'products' | 'add-product' | 'brands' | 'orders' | 'settings';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { navigate, logoutAdmin } = useStore();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-stone-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#121212] border-r border-[#222222] flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Top Brand Header */}
          <div className="p-6 border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#c5a880]" />
              <span className="font-serif tracking-[0.2em] text-white text-base font-semibold uppercase">
                INAYAT ADMIN
              </span>
            </div>
            <div className="text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-sans mt-0.5">
              Horology Control Room
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-medium uppercase tracking-wider">
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate('/admin/products')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>

            <button
              onClick={() => navigate('/admin/products/add')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'add-product'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Watch</span>
            </button>

            <button
              onClick={() => navigate('/admin/brands')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'brands'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>9 Brand Houses</span>
            </button>

            <button
              onClick={() => navigate('/admin/orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#c5a880] text-black font-semibold'
                  : 'text-stone-300 hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="p-4 border-t border-[#222222] space-y-2 text-xs">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#181818] hover:bg-[#202020] text-stone-300 hover:text-white transition-colors tracking-wider uppercase text-[11px]"
          >
            <span>Public Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-stone-400 hover:text-rose-400 hover:bg-[#1c1414] transition-colors tracking-wider uppercase text-[11px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
