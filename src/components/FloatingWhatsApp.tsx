import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside aria-label="WhatsApp Assistance" className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip badge */}
      {isHovered && (
        <div className="mr-3 bg-[#111111] text-stone-200 text-xs py-2 px-3.5 border border-[#2b2b2b] shadow-2xl rounded-none hidden sm:block animate-fadeIn">
          <div className="font-semibold text-[#c5a880] text-[11px] tracking-wider uppercase">
            Inayat Watch Concierge
          </div>
          <div className="text-[11px] text-stone-400">Order directly on WhatsApp: +92 331 4900788</div>
        </div>
      )}

      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/923314900788"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 rounded-full"
        title="Chat on WhatsApp (+92 331 4900788)"
        aria-label="Order or chat on WhatsApp (+92 331 4900788)"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
};
