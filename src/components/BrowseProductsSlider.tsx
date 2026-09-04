import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '../types';

export const BrowseProductsSlider: React.FC = () => {
  const { products, navigate, addToCart, showToast } = useStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter products for the slider (prioritize on_sale, featured, or all)
  const displayProducts = products.length > 0
    ? products
    : [];

  // Auto-slide effect (moves forward smoothly every 2.5 seconds)
  useEffect(() => {
    if (isPaused || displayProducts.length <= 1) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const cardWidth = 300; // approximate card + gap width

        // If near end, loop back to start smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, displayProducts.length]);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    showToast(`Added ${product.name} to your cart`, 'success');
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1800);
  };

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="browse-products-slider-section"
      className="py-16 bg-[#0a0a0a] border-b border-[#1c1c1c] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-[#c5a880] uppercase font-semibold">
              FEATURED WATCH CATALOGUE
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl tracking-[0.15em] text-white uppercase mt-1">
              BROWSE PRODUCTS
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a880] mt-3 mx-auto sm:mx-0" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleScrollLeft}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-stone-700 bg-[#141414] hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880] text-stone-300 transition-colors flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleScrollRight}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-stone-700 bg-[#141414] hover:bg-[#c5a880] hover:text-black hover:border-[#c5a880] text-stone-300 transition-colors flex items-center justify-center shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sliding Carousel Track */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProducts.map((product) => {
            const hasDiscount =
              product.sale_price !== null &&
              product.sale_price !== undefined &&
              product.sale_price < product.price;

            const discountPercentage = hasDiscount
              ? Math.round(((product.price - (product.sale_price as number)) / product.price) * 100)
              : null;

            const activePrice = product.sale_price || product.price;
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white text-stone-900 rounded-sm border border-stone-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-4 cursor-pointer group snap-start"
              >
                {/* Watch Stage & Discount Badge */}
                <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden mb-3">
                  {/* Circular Discount Tag (-10%, -15%, etc.) */}
                  {discountPercentage !== null && (
                    <div className="absolute top-2 left-2 z-10 w-11 h-11 rounded-full bg-[#6d757d] text-white flex items-center justify-center font-bold text-xs shadow-md tracking-tight">
                      -{discountPercentage}%
                    </div>
                  )}

                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Information */}
                <div className="text-center space-y-2 flex-1 flex flex-col justify-between">
                  <h3 className="text-[#2b3a4a] hover:text-[#0a0a0a] font-sans text-xs sm:text-[13px] font-medium uppercase tracking-tight line-clamp-2 leading-snug min-h-[36px]">
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {hasDiscount && (
                      <span className="text-xs text-stone-400 line-through">
                        Rs{product.price.toLocaleString()}.00
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-bold text-black tracking-tight">
                      Rs{activePrice.toLocaleString()}.00
                    </span>
                  </div>

                  {/* Add To Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 mt-2 ${
                      isAdded
                        ? 'bg-[#18392b] text-white'
                        : 'bg-[#1c1c1c] hover:bg-black text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#52b788]" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <span>ADD TO CART</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
