import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { MessageCircle, SlidersHorizontal, ArrowLeft, Clock } from 'lucide-react';

interface CollectionPageProps {
  slug: string;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({ slug }) => {
  const { brands, products, navigate } = useStore();

  const brand = brands.find(b => b.slug.toLowerCase() === slug.toLowerCase());

  // CRITICAL: Filter products strictly where brand_id = brand.slug
  const brandProducts = useMemo(() => {
    if (!brand) return [];
    return products.filter(p => p.brand_id.toLowerCase() === brand.slug.toLowerCase());
  }, [products, brand]);

  // Local filter & sort state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const categories = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [brandProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...brandProducts];

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [brandProducts, selectedCategory, sortBy]);

  if (!brand) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
        <h1 className="font-serif text-3xl text-white uppercase mb-4">House Not Found</h1>
        <p className="text-stone-400 text-sm max-w-md mb-8">
          The brand collection you requested does not exist or has been modified.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold"
        >
          Return to All Collections
        </button>
      </div>
    );
  }

  const handleBrandWhatsAppInquiry = () => {
    const text = `*Assalamualaikum Inayat Watch Company,*\nI am inquiring about your ${brand.name} watch collection. Please share any current or upcoming ${brand.name} models.`;
    window.open(`https://wa.me/923314900788?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div id={`collection-page-${brand.slug}`} className="min-h-screen bg-[#0a0a0a] text-stone-200">
      {/* 1. Large Brand Banner Hero */}
      <section className="relative h-[340px] sm:h-[420px] md:h-[500px] flex items-end justify-center overflow-hidden border-b border-[#1f1f1f]">
        <img
          src={brand.banner_image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85'}
          alt={`${brand.name} banner`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12 sm:pb-16 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#c5a880] text-xs uppercase tracking-widest transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs sm:text-sm tracking-[0.35em] text-[#c5a880] uppercase font-sans font-semibold">
            {brand.tagline || 'Inayat Horological Curation'}
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-[0.18em] text-white uppercase font-normal leading-tight">
            {brand.name}
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-stone-300 font-light tracking-wide leading-relaxed">
            {brand.description}
          </p>

          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-[0.2em] px-3 py-1 bg-black/70 border border-stone-800 text-stone-400">
              {brandProducts.length} {brandProducts.length === 1 ? 'Watch' : 'Watches'} Catalogued
            </span>
          </div>
        </div>
      </section>

      {/* 2. Collection Bar: Filters & Sorting */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#c5a880]" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              All {brand.name} Watches
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#141414] border border-[#2b2b2b] text-stone-300 text-xs px-3 py-2 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#141414] border border-[#2b2b2b] text-stone-300 text-xs px-3 py-2 uppercase tracking-wider focus:outline-none focus:border-[#c5a880]"
            >
              <option value="default">Sort: Curated</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3. Product Grid or Elegant Empty State */}
        <div className="py-12">
          {brandProducts.length === 0 ? (
            /* Explicit requirement: "If Citizen has no watches: Show: CITIZEN: New Citizen watches are coming soon. Do not show fake products. Once I add Citizen products from Admin: The empty message disappears automatically. The real products appear." */
            <div
              id={`empty-collection-${brand.slug}`}
              className="p-12 sm:p-20 bg-[#0e0e0e] border border-[#222222] text-center max-w-2xl mx-auto space-y-6"
            >
              <Clock className="w-12 h-12 text-[#c5a880] mx-auto stroke-1" />
              <div className="space-y-2">
                <div className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold">
                  {brand.name} Collection
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider">
                  New {brand.name} watches are coming soon.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-md mx-auto">
                Our horological curators are cataloging authenticated {brand.name} timepieces for this private collection. You can inquire directly with our store concierge on WhatsApp for pre-orders or custom sourcing.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleBrandWhatsAppInquiry}
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Inquire on WhatsApp</span>
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-3 border border-stone-700 hover:border-[#c5a880] text-stone-300 hover:text-white text-xs tracking-widest uppercase font-semibold transition-colors w-full sm:w-auto"
                >
                  Explore Other Houses
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm">
              No {brand.name} watches matched your selected category filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* 4. Other Brands Navigation strip */}
        <div className="pt-16 pb-8 border-t border-[#1f1f1f]">
          <div className="text-center mb-8">
            <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
              EXPLORE OTHER HOUSES
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {brands
              .filter(b => b.slug !== brand.slug)
              .map(b => (
                <button
                  key={b.id}
                  onClick={() => navigate(`/collections/${b.slug}`)}
                  className="p-3 bg-[#121212] border border-[#222222] hover:border-[#c5a880] text-stone-300 hover:text-white transition-colors text-center"
                >
                  <div className="font-serif text-xs uppercase tracking-wider truncate">
                    {b.name}
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
