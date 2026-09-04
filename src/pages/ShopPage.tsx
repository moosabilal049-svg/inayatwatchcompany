import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, Clock, MessageCircle } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, brands, wishlist } = useStore();

  // URL query params
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSaleOnly, setSelectedSaleOnly] = useState(false);
  const [selectedInStockOnly, setSelectedInStockOnly] = useState(false);
  const [selectedWishlistOnly, setSelectedWishlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    const brand = params.get('brand');
    const q = params.get('q');

    if (filter === 'sale') setSelectedSaleOnly(true);
    if (filter === 'new') setSortBy('newest');
    if (filter === 'wishlist') setSelectedWishlistOnly(true);
    if (brand) setSelectedBrand(brand);
    if (q) setSearchQuery(q);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand_id.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedBrand !== 'all') {
      list = list.filter(p => p.brand_id.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSaleOnly) {
      list = list.filter(p => p.on_sale || (p.sale_price !== null && p.sale_price !== undefined && p.sale_price < p.price));
    }

    if (selectedInStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    if (selectedWishlistOnly) {
      list = list.filter(p => wishlist.includes(p.id));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // featured
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return list;
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedSaleOnly, selectedInStockOnly, selectedWishlistOnly, sortBy, wishlist]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedSaleOnly(false);
    setSelectedInStockOnly(false);
    setSelectedWishlistOnly(false);
    setSortBy('featured');
  };

  return (
    <div id="shop-page-container" className="min-h-screen bg-[#0a0a0a] text-stone-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs tracking-[0.35em] text-[#c5a880] uppercase font-semibold">
            THE COMPLETE HOROLOGICAL GALLERY
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl tracking-widest text-white uppercase">
            {selectedWishlistOnly ? 'YOUR SAVED WATCHES' : 'ALL TIMEPIECES'}
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light tracking-wide max-w-xl mx-auto">
            Explore authentic models across all 9 pre-configured brand houses. Nationwide Cash on Delivery across Pakistan.
          </p>
        </div>

        {/* Filter Control Bar */}
        <div className="bg-[#111111] border border-[#222222] p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches..."
                className="w-full bg-[#161616] border border-[#262626] text-white text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] text-stone-200 text-xs px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all">All 9 Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] text-stone-200 text-xs px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#161616] border border-[#262626] text-stone-200 text-xs px-3 py-2.5 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Checkbox Chips */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#1f1f1f] text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedSaleOnly}
                  onChange={(e) => setSelectedSaleOnly(e.target.checked)}
                  className="rounded-none accent-[#c5a880]"
                />
                <span>On Sale Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedInStockOnly}
                  onChange={(e) => setSelectedInStockOnly(e.target.checked)}
                  className="rounded-none accent-[#c5a880]"
                />
                <span>In Stock Only</span>
              </label>

              {wishlist.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer text-[#c5a880]">
                  <input
                    type="checkbox"
                    checked={selectedWishlistOnly}
                    onChange={(e) => setSelectedWishlistOnly(e.target.checked)}
                    className="rounded-none accent-[#c5a880]"
                  />
                  <span>Wishlist ({wishlist.length})</span>
                </label>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="text-stone-500 hover:text-[#c5a880] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>
            Showing <span className="text-white font-semibold">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'watch' : 'watches'}
          </span>
          {selectedBrand !== 'all' && (
            <span className="uppercase text-[#c5a880] tracking-wider">
              Filtered by: {brands.find(b => b.slug === selectedBrand)?.name || selectedBrand}
            </span>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {products.length === 0 ? (
          <div className="p-16 bg-[#111111] border border-[#222222] text-center max-w-2xl mx-auto space-y-6">
            <Clock className="w-12 h-12 text-[#c5a880] mx-auto stroke-1" />
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-white uppercase tracking-wider">
                Store Catalog In Preparation
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-md mx-auto">
                Our 9 brand houses are pre-configured in the database. New watches added by the administrator in the Admin Portal will immediately populate this catalog.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://wa.me/923314900788"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact On WhatsApp (+92 331 4900788)</span>
              </a>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 bg-[#111111] border border-[#222222] text-center max-w-xl mx-auto space-y-4">
            <p className="text-base text-stone-300 font-medium">No watches match your search criteria.</p>
            <p className="text-xs text-stone-500">Try changing your brand, category, or clearing the search query.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
