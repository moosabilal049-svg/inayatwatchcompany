import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, Phone, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    brands,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    wishlist,
    navigate,
    currentRoute,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
    setBrandsDropdownOpen(false);
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#121212] text-[#c5a880] text-[11px] tracking-[0.2em] uppercase py-2 px-4 border-b border-[#242424] text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-stone-400">
            <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Authorized Horology Curation</span>
          </div>
          <div className="mx-auto flex items-center gap-3">
            <span>Cash on Delivery Across Pakistan</span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="hidden sm:inline">Inspect Package Before Payment</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://wa.me/923314900788"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#c5a880]" />
              <span className="tracking-wider">+92 331 4900788</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0e0e0e]/95 backdrop-blur-md shadow-xl border-b border-[#222222]'
            : 'bg-[#0d0d0d] border-b border-[#1f1f1f]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-300 hover:text-white transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Left / Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                id="header-brand-logo-btn"
                onClick={() => handleNav('/')}
                className="text-left group flex flex-col items-start"
              >
                <div className="flex items-center gap-2">
                  <span className="font-serif tracking-[0.25em] text-lg sm:text-xl md:text-2xl font-semibold text-white group-hover:text-[#c5a880] transition-colors uppercase">
                    INAYAT
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#a39274] uppercase font-sans font-medium -mt-1">
                  WATCH COMPANY
                </span>
              </button>
            </div>

            {/* Center Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-[13px] tracking-[0.15em] uppercase font-medium">
              <button
                id="nav-home-btn"
                onClick={() => handleNav('/')}
                className={`transition-colors py-2 relative ${
                  currentRoute.name === 'home' ? 'text-[#c5a880]' : 'text-stone-300 hover:text-white'
                }`}
              >
                HOME
                {currentRoute.name === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
                )}
              </button>

              <button
                id="nav-shop-btn"
                onClick={() => handleNav('/shop')}
                className={`transition-colors py-2 relative ${
                  currentRoute.name === 'shop' ? 'text-[#c5a880]' : 'text-stone-300 hover:text-white'
                }`}
              >
                SHOP
                {currentRoute.name === 'shop' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
                )}
              </button>

              {/* Brands Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setBrandsDropdownOpen(true)}
                onMouseLeave={() => setBrandsDropdownOpen(false)}
              >
                <button
                  id="nav-brands-dropdown-btn"
                  onClick={() => setBrandsDropdownOpen(!brandsDropdownOpen)}
                  className={`flex items-center gap-1.5 py-2 transition-colors ${
                    currentRoute.name === 'collection' ? 'text-[#c5a880]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>BRANDS</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${brandsDropdownOpen ? 'rotate-180 text-[#c5a880]' : ''}`} />
                </button>

                {/* Mega Dropdown Menu */}
                {brandsDropdownOpen && (
                  <div
                    id="brands-mega-dropdown"
                    className="absolute top-full -left-20 w-80 bg-[#141414] border border-[#2b2b2b] shadow-2xl py-3 rounded-none animate-fadeIn"
                  >
                    <div className="px-4 py-2 border-b border-[#242424] flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
                        9 Permanent Houses
                      </span>
                      <span className="text-[10px] text-stone-500">Curated Horology</span>
                    </div>
                    <div className="py-2">
                      {brands.map((b) => (
                        <button
                          key={b.id}
                          id={`dropdown-brand-${b.slug}`}
                          onClick={() => handleNav(`/collections/${b.slug}`)}
                          className="w-full text-left px-5 py-2.5 flex items-center justify-between hover:bg-[#1f1f1f] text-stone-300 hover:text-white transition-colors group"
                        >
                          <span className="font-serif text-sm tracking-widest text-stone-200 group-hover:text-[#c5a880] uppercase">
                            {b.name}
                          </span>
                          <span className="text-[11px] text-stone-500 font-sans tracking-normal">
                            {b.product_count !== undefined && b.product_count > 0
                              ? `${b.product_count} models`
                              : 'Collection'}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 bg-[#0d0d0d] border-t border-[#242424] text-center">
                      <button
                        onClick={() => handleNav('/shop')}
                        className="text-[11px] text-[#c5a880] hover:text-white tracking-widest uppercase transition-colors"
                      >
                        View All Collections &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="nav-new-arrivals-btn"
                onClick={() => handleNav('/shop?filter=new')}
                className="text-stone-300 hover:text-white transition-colors py-2"
              >
                NEW ARRIVALS
              </button>

              <button
                id="nav-sale-btn"
                onClick={() => handleNav('/shop?filter=sale')}
                className="text-[#c5a880] hover:text-[#dfc399] transition-colors py-2"
              >
                SALE
              </button>

              <button
                id="nav-contact-btn"
                onClick={() => handleNav('/contact')}
                className={`transition-colors py-2 relative ${
                  currentRoute.name === 'contact' ? 'text-[#c5a880]' : 'text-stone-300 hover:text-white'
                }`}
              >
                CONTACT
                {currentRoute.name === 'contact' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]" />
                )}
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search */}
              <button
                id="header-search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-stone-300 hover:text-white transition-colors"
                title="Search Watches"
                aria-label="Search watches"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                id="header-wishlist-btn"
                onClick={() => handleNav('/shop?filter=wishlist')}
                className="p-2 text-stone-300 hover:text-white transition-colors relative"
                title="Saved Watches"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c5a880] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-stone-300 hover:text-white transition-colors relative"
                title="Shopping Bag"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c5a880] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden bg-[#111111] border-b border-[#252525] px-6 pt-4 pb-8 space-y-4 animate-fadeIn"
          >
            <div className="space-y-2 text-sm tracking-[0.18em] uppercase font-medium">
              <button
                id="mobile-nav-home"
                onClick={() => handleNav('/')}
                className="block w-full text-left py-2.5 text-stone-200 border-b border-[#222222]"
              >
                HOME
              </button>
              <button
                id="mobile-nav-shop"
                onClick={() => handleNav('/shop')}
                className="block w-full text-left py-2.5 text-stone-200 border-b border-[#222222]"
              >
                SHOP ALL WATCHES
              </button>
              
              {/* Mobile Brands Accordion */}
              <div className="py-2 border-b border-[#222222]">
                <div className="text-[11px] tracking-[0.25em] text-[#c5a880] uppercase font-semibold mb-2">
                  SHOP BY BRAND
                </div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      id={`mobile-brand-${b.slug}`}
                      onClick={() => handleNav(`/collections/${b.slug}`)}
                      className="text-left py-1.5 text-stone-300 hover:text-[#c5a880] font-serif text-sm uppercase"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="mobile-nav-new"
                onClick={() => handleNav('/shop?filter=new')}
                className="block w-full text-left py-2.5 text-stone-200 border-b border-[#222222]"
              >
                NEW ARRIVALS
              </button>
              <button
                id="mobile-nav-sale"
                onClick={() => handleNav('/shop?filter=sale')}
                className="block w-full text-left py-2.5 text-[#c5a880] border-b border-[#222222]"
              >
                SALE
              </button>
              <button
                id="mobile-nav-contact"
                onClick={() => handleNav('/contact')}
                className="block w-full text-left py-2.5 text-stone-200"
              >
                CONTACT &amp; WHATSAPP
              </button>
            </div>

            <div className="pt-4 text-center">
              <a
                href="https://wa.me/923314900788"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1d3d29] hover:bg-[#234c32] text-[#86e09c] text-xs tracking-widest uppercase font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +92 331 4900788</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
