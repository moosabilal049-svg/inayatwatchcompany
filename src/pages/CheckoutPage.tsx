import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Truck, ShieldCheck, CheckCircle2, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

const POPULAR_PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other City',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, deliveryCharges, cartTotal, clearCart, navigate, showToast, refreshData } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: 'Lahore',
    customCity: '',
    orderNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a] text-stone-300">
        <ShoppingBag className="w-14 h-14 text-stone-600 mb-4 stroke-1" />
        <h1 className="font-serif text-2xl text-white uppercase mb-2">Your Bag is Empty</h1>
        <p className="text-xs text-stone-400 max-w-sm mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
        >
          Explore Watches
        </button>
      </div>
    );
  }

  // Order Success Screen
  if (completedOrder) {
    const handleWhatsAppConfirm = () => {
      const msg = `*Assalamualaikum Inayat Watch Company,*\nI have placed an order online.\n\n*Order Number:* ${completedOrder.order_number}\n*Name:* ${completedOrder.customer_name}\n*Total:* Rs. ${completedOrder.total.toLocaleString()}\n*City:* ${completedOrder.city}\n\nPlease confirm dispatch.`;
      window.open(`https://wa.me/923314900788?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-stone-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-[#121212] border border-[#262626] p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-[#183421] text-[#8aeaa2] border border-[#2b5837] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold">
              ORDER RECEIVED • CASH ON DELIVERY
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-wider">
              Thank You for Your Order
            </h1>
            <p className="text-sm text-stone-400 font-light">
              Your order number is <strong className="text-white tracking-widest">{completedOrder.order_number}</strong>.
            </p>
          </div>

          {/* Order Details box */}
          <div className="bg-[#181818] border border-[#222222] p-5 text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-[#262626] pb-2">
              <span className="text-stone-400">Recipient:</span>
              <span className="text-white font-medium">{completedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-[#262626] pb-2">
              <span className="text-stone-400">Phone / WhatsApp:</span>
              <span className="text-white font-medium">{completedOrder.phone}</span>
            </div>
            <div className="flex justify-between border-b border-[#262626] pb-2">
              <span className="text-stone-400">Delivery Address:</span>
              <span className="text-white font-medium text-right max-w-xs">{completedOrder.address}, {completedOrder.city}</span>
            </div>
            <div className="flex justify-between border-b border-[#262626] pb-2">
              <span className="text-stone-400">Payment:</span>
              <span className="text-emerald-400 font-semibold">{completedOrder.payment_method}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold text-white">
              <span>Total Payable:</span>
              <span className="text-[#c5a880]">Rs. {completedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            Our dispatch verification team will contact you via WhatsApp (+92 331 4900788) or direct call before packaging your timepiece.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleWhatsAppConfirm}
              className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Confirm via WhatsApp (+92 331 4900788)</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 border border-stone-700 hover:border-white text-stone-300 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Please fill all required fields (Name, Phone, Address)', 'error');
      return;
    }

    const cityToSave = formData.city === 'Other City' ? formData.customCity.trim() || 'Pakistan' : formData.city;

    const orderPayload = {
      customer_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      whatsapp: (formData.whatsapp || formData.phone).trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim(),
      city: cityToSave,
      order_notes: formData.orderNotes.trim() || undefined,
      items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        brand_name: item.product.brand_id.toUpperCase(),
        price: item.product.sale_price || item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
      })),
      subtotal: cartSubtotal,
      delivery_charges: deliveryCharges,
      total: cartTotal,
      payment_method: 'Cash on Delivery',
    };

    try {
      setIsSubmitting(true);
      const created = await api.createOrder(orderPayload);
      setCompletedOrder(created);
      clearCart();
      refreshData();
      showToast('Order placed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again or order on WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-page-container" className="min-h-screen bg-[#0a0a0a] text-stone-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white text-xs uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </button>

        <div className="mb-10 text-center sm:text-left">
          <div className="text-xs tracking-[0.3em] text-[#c5a880] uppercase font-semibold mb-1">
            SECURE PAKISTAN CHECKOUT
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white uppercase tracking-wider">
            Order Confirmation &amp; Delivery
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Customer Form (7 Cols) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-lg text-white uppercase tracking-wider border-b border-[#222222] pb-3">
                1. Delivery &amp; Contact Details
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Muhammad Bilal"
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                      Phone Number (for Courier Calls) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300 1234567"
                      className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                      WhatsApp Number (for Photo / Tracking Updates)
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="Leave blank if same as phone"
                      className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Complete Street Address (House/Shop #, Street, Area) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House / Apartment #, Street Name, Sector or Area, Landmark"
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                      Destination City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                    >
                      {POPULAR_PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {formData.city === 'Other City' && (
                    <div>
                      <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                        Specify City Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customCity}
                        onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                        placeholder="e.g. Mardan, Sukkur, Jhelum..."
                        className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Special Instructions / Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    placeholder="e.g. Call before delivery, gift wrap requested..."
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-lg text-white uppercase tracking-wider border-b border-[#222222] pb-3">
                2. Payment Method
              </h2>

              <div className="p-4 bg-[#181e19] border border-[#23452b] flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-black flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-white font-semibold text-sm">
                    Cash on Delivery (COD)
                  </div>
                  <p className="text-stone-300 leading-relaxed font-light">
                    Pay safely in cash when the courier delivers your watch package to your doorstep anywhere in Pakistan.
                  </p>
                </div>
              </div>
            </div>

            <button
              id="place-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase transition-colors shadow-2xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>RECORDING ORDER...</span>
              ) : (
                <span>PLACE ORDER (RS. {cartTotal.toLocaleString()})</span>
              )}
            </button>
          </form>

          {/* Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-lg text-white uppercase tracking-wider border-b border-[#222222] pb-3">
                Order Summary ({cart.reduce((t, i) => t + i.quantity, 0)})
              </h2>

              <div className="divide-y divide-[#222222] max-h-80 overflow-y-auto pr-2 space-y-3">
                {cart.map((item) => {
                  const activePrice = item.product.sale_price || item.product.price;
                  return (
                    <div key={item.product.id} className="pt-3 flex gap-3">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=150&q=80'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover bg-black border border-stone-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="text-[10px] tracking-widest text-[#c5a880] uppercase font-semibold">
                          {item.product.brand_id}
                        </div>
                        <div className="text-white font-medium truncate mt-0.5">
                          {item.product.name}
                        </div>
                        <div className="text-stone-400 mt-1">
                          Qty: {item.quantity} × Rs. {activePrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-white">
                        Rs. {(activePrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#222222] text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Nationwide Courier Delivery</span>
                  <span className="text-white font-medium">
                    {deliveryCharges === 0 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `Rs. ${deliveryCharges.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-white pt-3 border-t border-[#262626]">
                  <span className="font-serif">Grand Total (COD)</span>
                  <span className="text-[#c5a880]">Rs. {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Ordering Alternative */}
            <div className="p-5 bg-[#121814] border border-[#1e3d29] space-y-3 text-xs text-stone-300">
              <div className="flex items-center gap-2 text-[#8aeaa2] font-semibold tracking-wider uppercase">
                <MessageCircle className="w-4 h-4" />
                <span>Prefer to order over chat?</span>
              </div>
              <p className="text-stone-400 leading-relaxed font-light">
                Send your cart directly to our WhatsApp representative. We will verify your address and dispatch without filling out forms.
              </p>
              <a
                href="https://wa.me/923314900788?text=Assalamualaikum%20Inayat%20Watch%20Company,%20I%20would%20like%20to%20place%20an%20order%20directly."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#8aeaa2] hover:underline"
              >
                <span>WhatsApp: +92 331 4900788 &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
