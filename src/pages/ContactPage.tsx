import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to our concierge desk.', 'success');
  };

  return (
    <div id="contact-page-container" className="min-h-screen bg-[#0a0a0a] text-stone-200 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs tracking-[0.35em] text-[#c5a880] uppercase font-semibold">
            HOROLOGICAL CONCIERGE
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl tracking-widest text-white uppercase">
            CONTACT INAYAT WATCH COMPANY
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light tracking-wide max-w-xl mx-auto">
            Whether you are inquiring about a specific reference, need assistance ordering on WhatsApp, or require package tracking, we are at your service.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#121212] border border-[#222222] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1c291f] text-[#8aeaa2] flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-serif text-lg text-white uppercase tracking-wider">
              WhatsApp Concierge
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Fastest response for photos, stock checks, and direct Cash on Delivery orders.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/923314900788"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                +92 331 4900788
              </a>
            </div>
          </div>

          <div className="p-8 bg-[#121212] border border-[#222222] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1b1b1b] text-[#c5a880] flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-white uppercase tracking-wider">
              Direct Phone Call
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Speak with our watch consultant during standard operating hours (10:00 AM – 9:00 PM).
            </p>
            <div className="pt-2">
              <a
                href="tel:+923314900788"
                className="text-stone-200 hover:text-[#c5a880] font-serif text-sm tracking-wider"
              >
                +92 331 4900788
              </a>
            </div>
          </div>

          <div className="p-8 bg-[#121212] border border-[#222222] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1b1b1b] text-[#c5a880] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-white uppercase tracking-wider">
              Nationwide Delivery
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Lahore, Karachi, Islamabad, and all cities throughout Pakistan. Inspected and shockproof packaged.
            </p>
            <div className="pt-2 text-xs text-[#c5a880] uppercase tracking-widest font-semibold">
              Cash on Delivery (COD)
            </div>
          </div>
        </div>

        {/* Contact Form & Note */}
        <div className="max-w-3xl mx-auto bg-[#121212] border border-[#242424] p-8 sm:p-12 space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider border-b border-[#222222] pb-4">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1b3824] text-[#86e2a2] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-white uppercase">Inquiry Received</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Thank you. An Inayat representative will review your message and reply via WhatsApp or phone call.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#c5a880] uppercase tracking-widest hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Asad Khan"
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0300 1234567"
                    className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                  Subject / Watch Reference
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Citizen Chronograph inquiry, pricing, or custom order"
                  className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your inquiry..."
                  className="w-full bg-[#181818] border border-[#2b2b2b] text-white p-3 focus:outline-none focus:border-[#c5a880] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT INQUIRY</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
