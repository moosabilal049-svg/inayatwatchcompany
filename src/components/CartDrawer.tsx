import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryCharges,
    cartTotal,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `*Assalamualaikum Inayat Watch Company,*\nI would like to place an order for the following watch(es):\n\n`;
    cart.forEach((item, index) => {
      const price = item.product.sale_price || item.product.price;
      text += `*${index + 1}. ${item.product.name}*\nBrand: ${item.product.brand_id.toUpperCase()}\nQuantity: ${item.quantity}\nPrice: Rs. ${price.toLocaleString()}\nSubtotal: Rs. ${(price * item.quantity).toLocaleString()}\n\n`;
    });

    text += `*Delivery Charges:* ${deliveryCharges === 0 ? 'FREE' : `Rs. ${deliveryCharges}`}\n`;
    text += `*Grand Total:* Rs. ${cartTotal.toLocaleString()}\n`;
    text += `*Payment:* Cash on Delivery\n\nPlease confirm availability and dispatch details.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/923314900788?text=${encoded}`, '_blank');
  };

  return (
    <div
      id="cart-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-container"
        className="w-full max-w-md bg-[#121212] border-l border-[#242424] h-full flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c5a880]" />
            <h2 className="font-serif tracking-widest text-lg text-white uppercase font-medium">
              Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-stone-400">
              <ShoppingBag className="w-12 h-12 text-stone-600 stroke-1" />
              <div>
                <p className="text-white font-serif text-lg tracking-wide">Your bag is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover timeless masterpieces from our 9 pre-configured brand houses.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors mt-2"
              >
                Browse Watches
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const activePrice = item.product.sale_price || item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-[#181818] border border-[#222222] relative group"
                >
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover bg-black border border-stone-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] tracking-widest text-[#c5a880] uppercase font-semibold">
                        {item.product.brand_id}
                      </div>
                      <div className="text-xs text-white font-medium truncate mt-0.5">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-stone-300 font-semibold mt-1">
                        Rs. {activePrice.toLocaleString()}
                        {item.product.sale_price && (
                          <span className="text-[10px] text-stone-500 line-through ml-2">
                            Rs. {item.product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#262626]">
                      <div className="flex items-center border border-[#333333]">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="px-2 py-0.5 text-stone-400 hover:text-white transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="px-2 py-0.5 text-stone-400 hover:text-white transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#0f0f0f] border-t border-[#242424] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Nationwide Shipping</span>
                <span className="text-white font-medium">
                  {deliveryCharges === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE (COD)</span>
                  ) : (
                    `Rs. ${deliveryCharges.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-[#222222]">
                <span className="font-serif">Total (Cash on Delivery)</span>
                <span className="text-[#c5a880]">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                id="cart-proceed-checkout-btn"
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#c5a880] hover:bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="cart-order-whatsapp-btn"
                onClick={handleWhatsAppOrder}
                className="w-full py-3 bg-[#1e3b26] hover:bg-[#254c30] text-[#8aeaa2] border border-[#2e5e3b] text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ORDER BAG VIA WHATSAPP</span>
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 text-center text-[11px] text-stone-400 hover:text-white uppercase tracking-wider transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
