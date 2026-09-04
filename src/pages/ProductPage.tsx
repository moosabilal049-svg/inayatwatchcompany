import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface ProductPageProps {
  slug: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({ slug }) => {
  const { products, brands, addToCart, toggleWishlist, isInWishlist, navigate, showToast } = useStore();

  const product = products.find(p => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug);
  const brand = brands.find(b => b.slug.toLowerCase() === product?.brand_id.toLowerCase());

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'returns'>('specs');

  // Related products from SAME brand
  const relatedWatches = useMemo(() => {
    if (!product) return [];
    let sameBrand = products.filter(p => p.id !== product.id && p.brand_id.toLowerCase() === product.brand_id.toLowerCase());
    if (sameBrand.length < 4) {
      const others = products.filter(p => p.id !== product.id && !sameBrand.some(s => s.id === p.id));
      sameBrand = [...sameBrand, ...others.slice(0, 4 - sameBrand.length)];
    }
    return sameBrand.slice(0, 4);
  }, [product, products]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
        <h1 className="font-serif text-3xl text-white uppercase mb-4">Timepiece Not Found</h1>
        <p className="text-stone-400 text-sm max-w-md mb-8">
          The requested watch may have been updated or removed from the catalog.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold"
        >
          Return to All Watches
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const activePrice = product.sale_price || product.price;
  const isSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.price;
  const brandDisplayName = brand?.name || product.brand_id.toUpperCase();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = `*Assalamualaikum Inayat Watch Company,*\nI want to order:\n\n*Product:* ${product.name}\n*Brand:* ${brandDisplayName}\n*Quantity:* ${quantity}\n*Price:* Rs. ${activePrice.toLocaleString()}\n*SKU:* ${product.sku}\n*Payment Method:* Cash on Delivery\n\nPlease confirm my order.`;
    window.open(`https://wa.me/923314900788?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | Inayat Watch Company`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard', 'info');
    }
  };

  return (
    <div id={`product-page-${product.id}`} className="min-h-screen bg-[#0a0a0a] text-stone-200 py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-400 border-b border-[#1f1f1f] pb-4">
          <div className="flex items-center gap-2 truncate">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/collections/${product.brand_id}`)} className="hover:text-[#c5a880] transition-colors uppercase font-serif">
              {brandDisplayName}
            </button>
            <span>/</span>
            <span className="text-stone-200 truncate">{product.name}</span>
          </div>

          <button
            onClick={() => navigate(`/collections/${product.brand_id}`)}
            className="flex items-center gap-1 hover:text-[#c5a880] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to {brandDisplayName}</span>
          </button>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-square w-full bg-[#111111] border border-[#222222] overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isSale && (
                  <span className="px-3 py-1 bg-[#8e2828] text-white text-[11px] tracking-widest font-semibold uppercase">
                    SALE
                  </span>
                )}
                {product.new_arrival && (
                  <span className="px-3 py-1 bg-[#1f382a] text-[#86e2a2] text-[11px] tracking-widest font-semibold uppercase">
                    NEW ARRIVAL
                  </span>
                )}
              </div>

              {/* Wishlist and Share */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full transition-colors ${
                    isWishlisted ? 'bg-[#c5a880] text-black' : 'bg-black/60 text-white hover:bg-black'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 flex-shrink-0 bg-[#141414] border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#c5a880]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <button
                onClick={() => navigate(`/collections/${product.brand_id}`)}
                className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold font-serif hover:underline block mb-1"
              >
                {brandDisplayName}
              </button>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-tight">
                {product.name}
              </h1>
              <div className="text-xs text-stone-400 mt-2 flex items-center gap-4">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>Category: {product.category}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-[#121212] border border-[#222222] flex items-baseline justify-between">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
                  Rs. {activePrice.toLocaleString()}
                </div>
                {isSale && (
                  <div className="text-sm text-stone-500 line-through mt-0.5">
                    Original Price: Rs. {product.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${
                  product.stock > 0 ? 'bg-[#1b3824] text-[#86e2a2]' : 'bg-[#382b1b] text-amber-300'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Order on Request'}
                </span>
              </div>
            </div>

            {/* Description brief */}
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              {product.description || 'Crafted to the highest horological standards with an unyielding commitment to precision, durability, and refined aesthetics.'}
            </p>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-700 bg-[#121212]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-stone-400 hover:text-white transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-stone-400 hover:text-white transition-colors"
                    title="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-white hover:bg-[#c5a880] text-black font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase transition-colors shadow-lg"
              >
                BUY NOW (CASH ON DELIVERY)
              </button>

              {/* ORDER ON WHATSAPP BUTTON (Mandated format) */}
              <button
                id="product-order-whatsapp-btn"
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>ORDER ON WHATSAPP (+92 331 4900788)</span>
              </button>
            </div>

            {/* Quick Assurance Badges */}
            <div className="pt-6 border-t border-[#1f1f1f] space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <span>Cash on Delivery (COD) across Karachi, Lahore, Islamabad &amp; all cities</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <span>Thoroughly inspected horological packaging prior to dispatch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                <span>7-Day Return &amp; Exchange support via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Specifications, Delivery, Returns) */}
        <div className="border-t border-[#1f1f1f] pt-12 space-y-8">
          <div className="flex border-b border-[#222222] text-xs uppercase tracking-[0.2em]">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-6 font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'specs' ? 'border-[#c5a880] text-white' : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`py-4 px-6 font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'delivery' ? 'border-[#c5a880] text-white' : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Delivery Info
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 px-6 font-semibold transition-colors border-b-2 -mb-[2px] ${
                activeTab === 'returns' ? 'border-[#c5a880] text-white' : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Return &amp; Exchange
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Brand</span>
                  <span className="text-white font-medium uppercase font-serif">{brandDisplayName}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Movement</span>
                  <span className="text-white font-medium">{product.specifications?.movement || 'Precision Movement'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Case Material</span>
                  <span className="text-white font-medium">{product.specifications?.case_material || 'Stainless Steel'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Strap Material</span>
                  <span className="text-white font-medium">{product.specifications?.strap_material || 'Solid Steel / Leather'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Dial Color</span>
                  <span className="text-white font-medium">{product.specifications?.dial_color || 'Sunray / Classic'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Water Resistance</span>
                  <span className="text-white font-medium">{product.specifications?.water_resistance || 'Daily Water Resistant'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Gender</span>
                  <span className="text-white font-medium">{product.specifications?.gender || 'Men / Unisex'}</span>
                </div>
                <div className="p-3.5 bg-[#121212] border border-[#222222] flex justify-between">
                  <span className="text-stone-400">Watch Type</span>
                  <span className="text-white font-medium">{product.specifications?.watch_type || product.category}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                <strong>Cash on Delivery:</strong> Available across all major and regional cities throughout Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta.
              </p>
              <p>
                <strong>Dispatch Timeline:</strong> Orders confirmed before 4:00 PM are dispatched within 24 hours via premier insured courier services (TCS / Leopards / Call Courier). Estimated delivery is 2 to 4 business days.
              </p>
              <p>
                <strong>Verification Call:</strong> Our order dispatch team will reach out via WhatsApp (+92 331 4900788) or direct phone call to verify your address before releasing the shipment.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                <strong>7-Day Return &amp; Replacement:</strong> If the timepiece arrives damaged in transit or exhibits any manufacturing defect, notify us within 7 days of delivery with your order ID.
              </p>
              <p>
                <strong>Condition:</strong> The watch must be in original unworn condition with plastic seals, protective tags, and presentation box intact.
              </p>
              <p>
                <strong>Concierge Assistance:</strong> For fast exchanges or inquiries, message our WhatsApp support desk anytime at +92 331 4900788.
              </p>
            </div>
          )}
        </div>

        {/* Related Watches (Strictly from same brand first) */}
        {relatedWatches.length > 0 && (
          <div className="pt-16 border-t border-[#1f1f1f] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold">
                  MORE FROM {brandDisplayName}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider">
                  Related Watches
                </h2>
              </div>
              <button
                onClick={() => navigate(`/collections/${product.brand_id}`)}
                className="text-xs uppercase tracking-widest text-stone-400 hover:text-[#c5a880] transition-colors"
              >
                View All {brandDisplayName} &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedWatches.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
