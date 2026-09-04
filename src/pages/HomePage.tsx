import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { BrowseProductsSlider } from '../components/BrowseProductsSlider';

export const HomePage: React.FC = () => {
  const { brands, products, navigate } = useStore();

  const featuredProducts = products.filter(p => p.featured || p.new_arrival).slice(0, 4);

  const scrollToBrands = () => {
    const el = document.getElementById('shop-by-brand-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/shop');
    }
  };

  return (
    <div id="homepage-container" className="min-h-screen bg-[#0a0a0a] text-stone-200">
      {/* -------------------------------------------------------------
          1. HERO SECTION
          ------------------------------------------------------------- */}
      <section
        id="hero-section"
        className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-center border-b border-[#1c1c1c]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 100%), url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2560&q=90")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-[#0a0a0a]/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#c5a880]/40 bg-black/50 backdrop-blur-sm text-[#c5a880] text-[11px] tracking-[0.3em] uppercase font-medium mb-6 animate-fadeIn">
            <Sparkles className="w-3 h-3" />
            <span>INAYAT WATCH COMPANY • ESTABLISHED FOR CONNOISSEURS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] text-white font-medium uppercase mb-6 leading-tight drop-shadow-md">
            TIMELESS <span className="text-[#c5a880] font-light">ELEGANCE</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-300 font-light tracking-wide leading-relaxed mb-10">
            Discover timeless watches from the world&apos;s most iconic collections. Hand-selected timepieces delivered nationwide across Pakistan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              id="hero-shop-now-btn"
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-8 py-4 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-xl"
            >
              SHOP NOW
            </button>
            <button
              id="hero-explore-brands-btn"
              onClick={scrollToBrands}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#1a1a1a] text-stone-200 hover:text-white border border-stone-600 hover:border-[#c5a880] font-semibold text-xs tracking-[0.25em] uppercase transition-all duration-300"
            >
              EXPLORE BRANDS
            </button>
          </div>

          {/* Quick trust strip under hero */}
          <div className="mt-16 pt-8 border-t border-stone-800/60 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-xs tracking-wider uppercase text-stone-400">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />
              <span>9 Iconic Houses</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#c5a880]" />
              <span>Cash on Delivery</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Inspected Curation</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. SHOP BY BRAND — MOST IMPORTANT SECTION
          ------------------------------------------------------------- */}
      <section id="shop-by-brand-section" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <div className="text-[#c5a880] text-xs tracking-[0.35em] uppercase font-semibold mb-3">
            HERITAGE &amp; HOROLOGY
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-[0.15em] text-white uppercase">
            SHOP BY BRAND
          </h2>
          <div className="w-24 h-[1.5px] bg-[#c5a880] mx-auto mt-6 mb-4" />
          <p className="max-w-xl mx-auto text-sm text-stone-400 tracking-wider">
            Explore our 9 pre-configured horological masters. Click any brand visual to enter its dedicated collection.
          </p>
        </div>

        {/* Brand Editorial Showcase - Full Width Visual Sections inspired by Reference */}
        <div className="space-y-16 sm:space-y-24">
          {brands.map((brand, index) => {
            const collectionUrl = `/collections/${brand.slug}`;
            return (
              <article
                key={brand.id}
                id={`brand-showcase-${brand.slug}`}
                onClick={() => navigate(collectionUrl)}
                className="group cursor-pointer block border-y border-[#1c1c1c] bg-[#0d0d0d] hover:bg-[#121212] transition-colors duration-500 overflow-hidden"
              >
                {/* 1. Large Brand Watch Image Visual */}
                <div className="relative w-full h-[380px] sm:h-[480px] md:h-[620px] lg:h-[720px] bg-black overflow-hidden">
                  <img
                    src={brand.banner_image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85'}
                    alt={`${brand.name} Luxury Watch`}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle darkening gradient overlays for editorial luxury feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/20 to-transparent" />
                  
                  {/* Floating house badge in corner */}
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-stone-800 text-[10px] sm:text-xs tracking-[0.25em] text-stone-300 uppercase">
                    House #{index + 1} • Inayat Selection
                  </div>

                  {brand.product_count !== undefined && brand.product_count > 0 && (
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-[#c5a880] text-black px-3 py-1 text-[11px] tracking-wider uppercase font-semibold">
                      {brand.product_count} Models Available
                    </div>
                  )}
                </div>

                {/* 2. Large Brand Name & Call to Action underneath Image */}
                <div className="py-12 sm:py-16 md:py-20 px-6 sm:px-12 text-center max-w-5xl mx-auto space-y-4 sm:space-y-6">
                  {brand.tagline && (
                    <div className="text-xs sm:text-sm tracking-[0.35em] text-[#c5a880] uppercase font-sans font-medium">
                      {brand.tagline}
                    </div>
                  )}

                  {/* Brand Name in Very Large Typography */}
                  <h3 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.16em] sm:tracking-[0.2em] text-white uppercase font-normal group-hover:text-[#c5a880] transition-colors duration-300 leading-none">
                    {brand.name}
                  </h3>

                  <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-400 font-light leading-relaxed tracking-wide">
                    {brand.description}
                  </p>

                  {/* Shop Collection CTA Button */}
                  <div className="pt-4 sm:pt-6">
                    <span className="inline-flex items-center gap-3 px-8 py-3.5 border border-stone-700 group-hover:border-[#c5a880] group-hover:bg-[#c5a880] group-hover:text-black text-white text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300">
                      <span>SHOP COLLECTION</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. AUTO-SLIDING "BROWSE PRODUCTS" WATCH CAROUSEL (Image Reference)
          ------------------------------------------------------------- */}
      <BrowseProductsSlider />

      {/* -------------------------------------------------------------
          4. FEATURED / NEW ARRIVALS SECTION
          ------------------------------------------------------------- */}
      <section id="featured-watches-section" className="py-24 bg-[#0d0d0d] border-t border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-[#c5a880] text-xs tracking-[0.3em] uppercase font-semibold mb-2">
                CURATED SELECTIONS
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-widest text-white uppercase">
                FEATURED &amp; NEW ARRIVALS
              </h2>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 md:mt-0 text-xs tracking-[0.25em] uppercase text-stone-400 hover:text-[#c5a880] flex items-center gap-2 transition-colors"
            >
              <span>VIEW FULL CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {featuredProducts.length === 0 ? (
            /* Elegant empty state as products will be added by admin */
            <div className="p-12 sm:p-16 border border-[#222222] bg-[#111111] text-center max-w-2xl mx-auto space-y-4">
              <Clock className="w-10 h-10 text-[#c5a880] mx-auto stroke-1" />
              <h3 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider">
                Curating The Private Reserve
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed max-w-lg mx-auto">
                Our initial 9 pre-configured brand houses are ready. New watches added by the administrator in the Admin Portal will instantly appear in this showcase and inside their respective brand collections.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-[#c5a880] text-black text-xs tracking-widest uppercase font-semibold hover:bg-white transition-colors"
                >
                  Explore Brand Houses
                </button>
                <a
                  href="https://wa.me/923314900788"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#1b3824] text-[#8aeaa2] text-xs tracking-widest uppercase font-semibold hover:bg-[#234c32] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask On WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. ABOUT THE BRAND
          ------------------------------------------------------------- */}
      <section id="about-brand-section" className="py-24 bg-[#0a0a0a] border-t border-[#1c1c1c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="text-xs tracking-[0.35em] text-[#c5a880] uppercase font-semibold">
            ABOUT INAYAT WATCH COMPANY
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl tracking-wide text-white uppercase leading-snug">
            &ldquo;Timeless style, trusted quality and carefully selected watches.&rdquo;
          </h2>
          <div className="w-20 h-[1.5px] bg-[#c5a880] mx-auto my-6" />
          <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed max-w-2xl mx-auto">
            Inayat Watch Company was established with a singular devotion: bringing genuine horological appreciation to collectors and enthusiasts across Pakistan. From precision Japanese Eco-Drive technology to timeless Swiss mechanics and contemporary fashion icons, we curate timepieces that define stature, precision, and lasting elegance.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. WHY CHOOSE US
          ------------------------------------------------------------- */}
      <section id="why-choose-us-section" className="py-20 bg-[#0e0e0e] border-t border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold mb-2">
              EXCELLENCE IN SERVICE
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-widest text-white uppercase">
              WHY CHOOSE US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="p-6 bg-[#131313] border border-[#222222] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-[#c5a880] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Premium Selection</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Handpicked timepieces from 9 globally celebrated horological houses.
              </p>
            </div>

            <div className="p-6 bg-[#131313] border border-[#222222] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-[#c5a880] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Easy Ordering</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Seamless online checkout or instant 1-click WhatsApp order confirmation.
              </p>
            </div>

            <div className="p-6 bg-[#131313] border border-[#222222] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-[#c5a880] flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">WhatsApp Support</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct concierge line at +92 331 4900788 for real-time inquiries and photos.
              </p>
            </div>

            <div className="p-6 bg-[#131313] border border-[#222222] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-[#c5a880] flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Cash on Delivery</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Pay safely upon doorstep arrival anywhere across all cities in Pakistan.
              </p>
            </div>

            <div className="p-6 bg-[#131313] border border-[#222222] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-[#c5a880] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Secure Packaging</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                High-grade shockproof padded presentation boxes for flawless transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. WHATSAPP CALL TO ACTION
          ------------------------------------------------------------- */}
      <section id="whatsapp-cta-section" className="py-20 bg-[#090909] border-t border-[#1c1c1c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center p-10 bg-[#121814] border border-[#1e3d29] space-y-6">
          <div className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <MessageCircle className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-white uppercase tracking-wider">
            Personalized WhatsApp Assistance
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto font-light">
            Need advice on choosing the perfect watch, strap adjustment, or urgent delivery across Pakistan? Connect directly with Inayat Watch Company.
          </p>
          <div className="text-lg sm:text-xl font-serif text-[#c5a880] tracking-widest">
            +92 331 4900788
          </div>
          <div>
            <a
              id="whatsapp-cta-button"
              href="https://wa.me/923314900788?text=Assalamualaikum%20Inayat%20Watch%20Company,%20I%20am%20interested%20in%20your%20watch%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs tracking-[0.2em] uppercase transition-colors shadow-xl"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>CHAT ON WHATSAPP (+923314900788)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
