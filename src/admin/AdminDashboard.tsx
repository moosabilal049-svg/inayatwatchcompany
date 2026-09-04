import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { DashboardStats } from '../types';
import {
  Package,
  Tag,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate, brands, products } = useStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then(res => setStats(res))
      .catch(err => console.error('Failed to load admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
            INAYAT WATCH COMPANY
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
            Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products/add')}
            className="px-5 py-2.5 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Watch</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Watches</span>
            <Package className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-2xl font-serif text-white font-bold">
            {stats?.totalProducts ?? products.length}
          </div>
          <div className="text-[10px] text-stone-500">In database</div>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Brand Houses</span>
            <Tag className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-2xl font-serif text-white font-bold">
            {stats?.totalBrands ?? brands.length}
          </div>
          <div className="text-[10px] text-stone-500">Core pre-configured</div>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-2xl font-serif text-white font-bold">
            {stats?.totalOrders ?? 0}
          </div>
          <div className="text-[10px] text-stone-500">Placed via COD</div>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Sales</span>
            <DollarSign className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="text-xl font-serif text-white font-bold truncate">
            Rs. {(stats?.totalSales ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-500">Gross revenue</div>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-serif text-amber-400 font-bold">
            {stats?.lowStock ?? 0}
          </div>
          <div className="text-[10px] text-stone-500">&le; 3 units</div>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424] space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Out of Stock</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-serif text-rose-400 font-bold">
            {stats?.outOfStock ?? 0}
          </div>
          <div className="text-[10px] text-stone-500">Needs restock</div>
        </div>
      </div>

      {/* Brand Houses Overview */}
      <div className="p-6 bg-[#121212] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              The 9 Pre-Configured Brand Houses
            </h2>
            <p className="text-xs text-stone-400">Permanent collections ready to receive watch inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/brands')}
            className="text-xs text-[#c5a880] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>Manage Brand Visuals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 pt-2">
          {brands.map(b => (
            <div
              key={b.id}
              onClick={() => navigate(`/collections/${b.slug}`)}
              className="p-3 bg-[#181818] border border-[#262626] hover:border-[#c5a880] cursor-pointer text-center group transition-colors"
            >
              <div className="font-serif text-xs font-semibold text-white group-hover:text-[#c5a880] uppercase truncate">
                {b.name}
              </div>
              <div className="text-[10px] text-stone-500 mt-1">
                {b.product_count || 0} models
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 bg-[#121212] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-stone-400">All orders placed with Cash on Delivery nationwide</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs text-[#c5a880] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#262626] text-stone-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Watches</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {stats.recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{o.order_number}</td>
                    <td className="py-3 px-3 text-stone-300">{o.customer_name}</td>
                    <td className="py-3 px-3 text-stone-400">{o.city}</td>
                    <td className="py-3 px-3 text-stone-400">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">Rs. {o.total.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : o.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-500">
            No orders placed yet. Orders received via online checkout will automatically display here.
          </div>
        )}
      </div>
    </div>
  );
};
