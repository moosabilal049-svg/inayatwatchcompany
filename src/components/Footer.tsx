import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, MessageSquare, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brands, navigate } = useStore();

  return (
    <footer id="main-footer" className="bg-[#0a0a0a] text-stone-300 border-t border-[#1c1c1c] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#1c1c1c]">
          <div className="flex items-center space-x-4 p-4 bg-[#111111] border border-[#222222]">
            <Truck className="w-8 h-8 text-[#c5a880] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold tracking-wider text-white uppercase">Cash on Delivery</div>
              <div className="text-[11px] text-stone-400">Available all across Pakistan</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-[#111111] border border-[#222222]">
            <ShieldCheck className="w-8 h-8 text-[#c5a880] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold tracking-wider text-white uppercase">Handpicked Quality</div>
              <div className="text-[11px] text-stone-400">Inspected prior to dispatch</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-[#111111] border border-[#222222]">
            <MessageSquare className="w-8 h-8 text-[#c5a880] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold tracking-wider text-white uppercase">Direct WhatsApp Care</div>
              <div className="text-[11px] text-stone-400">+92 331 4900788 consultation</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-[#111111] border border-[#222222]">
            <RefreshCw className="w-8 h-8 text-[#c5a880] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold tracking-wider text-white uppercase">Safe Transit Box</div>
              <div className="text-[11px] text-stone-400">Cushioned protective luxury packaging</div>
            </div>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="text-left group"
            >
              <span className="font-serif tracking-[0.25em] text-xl font-bold text-white uppercase block">
                INAYAT
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#c5a880] uppercase block">
                WATCH COMPANY
              </span>
            </button>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Timeless style, trusted quality, and carefully selected watches for the refined gentleman and lady. Serving watch connoisseurs across Pakistan with authentic curation and personalized service.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <a
                href="https://wa.me/923314900788"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#c5a880] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#c5a880]" />
                <span>WhatsApp: +92 331 4900788</span>
              </a>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-4 h-4 text-[#c5a880]" />
                <span>info@inayatwatches.pk</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <MapPin className="w-4 h-4 text-[#c5a880]" />
                <span>Lahore, Pakistan • Nationwide Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs tracking-[0.2em] font-semibold text-white uppercase border-b border-[#242424] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-[#c5a880] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-[#c5a880] transition-colors">
                  Shop All Watches
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?filter=new')} className="hover:text-[#c5a880] transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?filter=sale')} className="hover:text-[#c5a880] transition-colors">
                  Sale &amp; Offers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#c5a880] transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Pre-configured Brands */}
          <div className="space-y-3">
            <h3 className="text-xs tracking-[0.2em] font-semibold text-white uppercase border-b border-[#242424] pb-2">
              The 9 Brands
            </h3>
            <ul className="space-y-2 text-xs">
              {brands.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => navigate(`/collections/${b.slug}`)}
                    className="hover:text-[#c5a880] transition-colors font-serif tracking-wider uppercase text-left"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="text-xs tracking-[0.2em] font-semibold text-white uppercase border-b border-[#242424] pb-2">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Cash on Delivery (COD) across Pakistan</li>
              <li>Order dispatch within 24 hours</li>
              <li>7-day return &amp; exchange assistance</li>
              <li>Safe transit insured packaging</li>
              <li>WhatsApp order placement</li>
            </ul>
            <div className="pt-3">
              <a
                href="https://wa.me/923314900788"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3.5 py-2 bg-[#1b3824] hover:bg-[#234c32] text-[#8ce9a3] text-[11px] tracking-wider uppercase font-medium transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} INAYAT WATCH COMPANY. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Karachi</span>
            <span>•</span>
            <span>Lahore</span>
            <span>•</span>
            <span>Islamabad</span>
            <span>•</span>
            <span>Nationwide Delivery</span>
            <button
              id="admin-lock-access-btn"
              onClick={() => navigate('/admin')}
              className="text-stone-600 hover:text-[#c5a880] transition-colors p-1 rounded inline-flex items-center justify-center"
              title="Admin Portal Access"
              aria-label="Admin Portal Access"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
