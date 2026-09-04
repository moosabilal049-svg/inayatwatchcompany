import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleWishlist, isInWishlist, brands } = useStore();

  const brand = brands.find(b => b.slug.toLowerCase() === product.brand_id.toLowerCase());
  const isWishlisted = isInWishlist(product.id);
  const activePrice = product.sale_price || product.price;
  const isSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.price;

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const brandName = brand?.name || product.brand_id;
    const msg = `*Assalamualaikum Inayat Watch Company,*\nI want to order:\n\n*Product:* ${product.name}\n*Brand:* ${brandName}\n*Quantity:* 1\n*Price:* Rs. ${activePrice.toLocaleString()}\n*SKU:* ${product.sku}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/923314900788?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-[#121212] border border-[#222222] hover:border-[#444444] transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#0d0d0d]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSale && (
            <span className="px-2 py-0.5 bg-[#8e2828] text-white text-[10px] tracking-widest font-semibold uppercase">
              SALE
            </span>
          )}
          {product.new_arrival && (
            <span className="px-2 py-0.5 bg-[#1f382a] text-[#86e2a2] text-[10px] tracking-widest font-semibold uppercase">
              NEW
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 bg-[#222222]/90 text-[#c5a880] text-[10px] tracking-widest font-semibold uppercase">
              SIGNATURE
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-10 ${
            isWishlisted
              ? 'bg-[#c5a880] text-black'
              : 'bg-black/60 text-white hover:bg-black'
          }`}
          title={isWishlisted ? 'Saved' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-white hover:bg-[#c5a880] text-black text-[10px] font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-2 bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
            title="Order instantly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#121212]">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-semibold font-sans">
            {brand?.name || product.brand_id}
          </div>
          <h3 className="font-serif text-sm sm:text-base text-white font-medium line-clamp-1 group-hover:text-[#c5a880] transition-colors mt-0.5">
            {product.name}
          </h3>
          <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
            {product.category} {product.specifications.movement ? `• ${product.specifications.movement}` : ''}
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f1f1f] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
              Rs. {activePrice.toLocaleString()}
            </span>
            {isSale && (
              <span className="text-xs text-stone-500 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
            {product.stock > 0 ? (
              <span className="text-stone-400">In Stock</span>
            ) : (
              <span className="text-amber-500">Backorder</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
