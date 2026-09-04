import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Product } from '../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, brands, navigate, refreshData, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedSale, setSelectedSale] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand_id.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand_id.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (selectedStock === 'in-stock') {
      list = list.filter(p => p.stock > 0);
    } else if (selectedStock === 'out-of-stock') {
      list = list.filter(p => p.stock === 0);
    } else if (selectedStock === 'low-stock') {
      list = list.filter(p => p.stock > 0 && p.stock <= 3);
    }

    if (selectedSale === 'sale') {
      list = list.filter(p => p.on_sale || (p.sale_price !== null && p.sale_price !== undefined && p.sale_price < p.price));
    }

    return list;
  }, [products, search, selectedBrand, selectedStock, selectedSale]);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      await api.deleteProduct(productToDelete.id);
      await refreshData();
      showToast(`Deleted ${productToDelete.name} from catalog`, 'success');
      setProductToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
            INVENTORY MANAGEMENT
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
            Watch Catalog ({products.length})
          </h1>
        </div>

        <button
          id="admin-add-product-btn"
          onClick={() => navigate('/admin/products/add')}
          className="px-6 py-3 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Watch</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#121212] border border-[#242424] p-4 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, or SKU..."
              className="w-full bg-[#181818] border border-[#2b2b2b] text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#c5a880]"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-[#181818] border border-[#2b2b2b] text-stone-200 px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
          >
            <option value="all">Filter by Brand (All 9)</option>
            {brands.map(b => (
              <option key={b.id} value={b.slug}>{b.name}</option>
            ))}
          </select>

          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="bg-[#181818] border border-[#2b2b2b] text-stone-200 px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
          >
            <option value="all">Stock Status (All)</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock (&le; 3)</option>
            <option value="out-of-stock">Out of Stock (0)</option>
          </select>

          <select
            value={selectedSale}
            onChange={(e) => setSelectedSale(e.target.value)}
            className="bg-[#181818] border border-[#2b2b2b] text-stone-200 px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
          >
            <option value="all">Sale Status (All)</option>
            <option value="sale">On Sale Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121212] border border-[#242424] overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Clock className="w-12 h-12 text-[#c5a880] mx-auto stroke-1" />
            <h3 className="font-serif text-xl text-white uppercase tracking-wider">
              No Watches Added Yet
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Your 9 brand houses (Citizen, Tissot, Rado, Casio, Edifice, Slazenger, Imperial, Emporio Armani, Crysm) are ready. Click &quot;Add New Watch&quot; to begin cataloging your products.
            </p>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="px-6 py-2.5 bg-[#c5a880] text-black text-xs font-semibold uppercase tracking-widest hover:bg-white transition-colors"
            >
              Add First Watch
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400 space-y-2">
            <p>No products match your active search filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedBrand('all');
                setSelectedStock('all');
                setSelectedSale('all');
              }}
              className="text-[#c5a880] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] border-b border-[#242424] text-stone-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Watch</th>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {filteredProducts.map((p) => {
                  const brandObj = brands.find(b => b.slug.toLowerCase() === p.brand_id.toLowerCase());
                  const activePrice = p.sale_price || p.price;
                  return (
                    <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=100&q=80'}
                            alt={p.name}
                            className="w-12 h-12 object-cover bg-black border border-stone-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-white text-sm truncate max-w-xs sm:max-w-sm">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              SKU: {p.sku} • {p.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-serif text-sm uppercase tracking-wider text-[#c5a880]">
                          {brandObj?.name || p.brand_id}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">
                          Rs. {activePrice.toLocaleString()}
                        </div>
                        {p.sale_price && (
                          <div className="text-[10px] text-stone-500 line-through">
                            Rs. {p.price.toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wider ${
                          p.stock > 3
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : p.stock > 0
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && (
                            <span className="px-1.5 py-0.5 bg-stone-800 text-stone-300 text-[9px] uppercase">
                              Featured
                            </span>
                          )}
                          {p.new_arrival && (
                            <span className="px-1.5 py-0.5 bg-[#17301e] text-[#86e2a2] text-[9px] uppercase">
                              New
                            </span>
                          )}
                          {p.on_sale && (
                            <span className="px-1.5 py-0.5 bg-rose-900/60 text-rose-300 text-[9px] uppercase">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`admin-view-product-${p.id}`}
                            onClick={() => navigate(`/products/${p.slug}`)}
                            className="p-1.5 text-stone-400 hover:text-white transition-colors"
                            title="View on public store"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`admin-edit-product-${p.id}`}
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            className="p-1.5 text-stone-400 hover:text-[#c5a880] transition-colors"
                            title="Edit watch"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`admin-delete-product-${p.id}`}
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 transition-colors"
                            title="Delete watch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl text-white uppercase">
                Delete Watch?
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">&quot;{productToDelete.name}&quot;</strong>?
                This watch will be removed from the database, its brand collection ({productToDelete.brand_id}), and all searches.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                id="cancel-delete-btn"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-stone-700 hover:border-white text-stone-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>
              <button
                id="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                {isDeleting ? 'DELETING...' : 'DELETE WATCH'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
