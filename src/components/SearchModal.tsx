import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { Product } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, brands, navigate } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedBrands = trimmed
    ? brands.filter(b => b.name.toLowerCase().includes(trimmed) || b.slug.toLowerCase().includes(trimmed))
    : [];

  const matchedProducts: Product[] = trimmed
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(trimmed) ||
          p.brand_id.toLowerCase().includes(trimmed) ||
          p.sku.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed)
      )
    : [];

  const handleSelectProduct = (slug: string) => {
    navigate(`/products/${slug}`);
    setIsSearchOpen(false);
  };

  const handleSelectBrand = (slug: string) => {
    navigate(`/collections/${slug}`);
    setIsSearchOpen(false);
  };

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-3xl bg-[#121212] border border-[#262626] shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#c5a880]" />
            <input
              ref={inputRef}
              id="search-input-field"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by watch name, brand (e.g. Citizen, Rado), or SKU..."
              className="w-full bg-transparent text-lg text-white placeholder-stone-500 focus:outline-none tracking-wide"
            />
          </div>
          <button
            id="close-search-btn"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Brand Shortcuts when query is empty */}
        {!trimmed && (
          <div className="space-y-3">
            <div className="text-[11px] tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
              Explore Our 9 Houses
            </div>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBrand(b.slug)}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#222222] border border-[#2b2b2b] hover:border-[#c5a880] text-xs font-serif uppercase tracking-widest text-stone-300 hover:text-white transition-colors"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {trimmed && (
          <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
            {/* Matching Brands */}
            {matchedBrands.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] tracking-[0.2em] text-[#c5a880] uppercase font-semibold">
                  Brands ({matchedBrands.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedBrands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectBrand(b.slug)}
                      className="flex items-center justify-between p-3 bg-[#181818] border border-[#242424] hover:border-[#c5a880] text-left group"
                    >
                      <div>
                        <span className="font-serif text-base text-white group-hover:text-[#c5a880] uppercase tracking-wider block">
                          {b.name}
                        </span>
                        <span className="text-xs text-stone-400">View Brand Collection</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#c5a880] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Products */}
            <div className="space-y-3">
              <div className="text-[11px] tracking-[0.2em] text-[#c5a880] uppercase font-semibold">
                Watches ({matchedProducts.length})
              </div>
              {matchedProducts.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-sm">
                  No watches found matching &quot;<span className="text-white">{query}</span>&quot;.
                  <div className="mt-2 text-xs text-stone-500">
                    Try searching for one of our 9 brands: Citizen, Tissot, Rado, Casio, Edifice, Slazenger, Imperial, Emporio Armani, Crysm.
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#222222]">
                  {matchedProducts.map((p) => {
                    const brandObj = brands.find(b => b.slug.toLowerCase() === p.brand_id.toLowerCase());
                    const priceDisplay = p.sale_price ? p.sale_price : p.price;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p.slug)}
                        className="py-3 flex items-center gap-4 cursor-pointer hover:bg-[#181818] px-3 transition-colors group"
                      >
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=150&q=80'}
                          alt={p.name}
                          className="w-14 h-14 object-cover bg-black border border-stone-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] tracking-widest text-[#c5a880] uppercase font-semibold">
                            {brandObj?.name || p.brand_id}
                          </div>
                          <div className="text-sm text-stone-200 font-medium truncate group-hover:text-white">
                            {p.name}
                          </div>
                          <div className="text-xs text-stone-400">
                            SKU: {p.sku} • {p.category}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-white">
                            Rs. {priceDisplay.toLocaleString()}
                          </div>
                          {p.sale_price && (
                            <div className="text-xs text-stone-500 line-through">
                              Rs. {p.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
