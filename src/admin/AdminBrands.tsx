import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Brand } from '../types';
import {
  Tag,
  Edit,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Save,
  Check,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const AdminBrands: React.FC = () => {
  const { brands, navigate, refreshData, showToast } = useStore();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setTagline(brand.tagline || '');
    setDescription(brand.description || '');
    setLogoImage(brand.logo_image || '');
    setBannerImage(brand.banner_image || '');
    setDisplayOrder(brand.display_order || 0);
    setIsActive(brand.active ?? true);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerImage(event.target.result as string);
        showToast('Banner preview loaded', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoImage(event.target.result as string);
        showToast('Logo preview loaded', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;

    setIsSaving(true);
    try {
      await api.updateBrand(editingBrand.id, {
        name,
        tagline,
        description,
        logo_image: logoImage,
        banner_image: bannerImage,
        display_order: Number(displayOrder),
        active: isActive,
      });

      await refreshData();
      showToast(`Updated ${name} brand house visuals`, 'success');
      setEditingBrand(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update brand', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
            BRAND ARCHITECTURE
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
            The 9 Brand Houses
          </h1>
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Core brands permanently protected</span>
        </div>
      </div>

      <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
        These 9 brand houses are pre-configured to guarantee dedicated collections at <code>/collections/[brand]</code>. You can customize the hero banner, brand narrative, and display order. Homepage banners update instantly!
      </p>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-[#121212] border border-[#222222] overflow-hidden group hover:border-stone-700 transition-colors flex flex-col justify-between"
          >
            {/* Banner preview */}
            <div className="relative h-36 bg-[#0a0a0a] overflow-hidden border-b border-[#1f1f1f]">
              <img
                src={b.banner_image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80'}
                alt={b.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between">
                <span className="font-serif text-lg text-white font-semibold tracking-wider uppercase">
                  {b.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-black/80 border border-stone-800 text-[#c5a880]">
                  {b.product_count || 0} Models
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 space-y-3 text-xs flex-1">
              <div className="text-[10px] tracking-[0.2em] text-[#c5a880] uppercase font-semibold truncate">
                {b.tagline || 'Inayat Horological House'}
              </div>
              <p className="text-stone-400 font-light text-[11px] line-clamp-2 leading-relaxed">
                {b.description}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="p-3 bg-[#181818] border-t border-[#202020] flex items-center justify-between text-xs">
              <button
                onClick={() => navigate(`/collections/${b.slug}`)}
                className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors text-[11px] uppercase tracking-wider"
              >
                <span>View Collection</span>
                <ExternalLink className="w-3 h-3 text-[#c5a880]" />
              </button>

              <button
                id={`edit-brand-btn-${b.slug}`}
                onClick={() => startEdit(b)}
                className="px-3 py-1.5 bg-[#c5a880] hover:bg-white text-black font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1 transition-colors"
              >
                <Edit className="w-3 h-3" />
                <span>Edit Visuals</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-semibold">
                  CUSTOMIZE BRAND HOUSE
                </div>
                <h3 className="font-serif text-2xl text-white uppercase tracking-wider">
                  {editingBrand.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingBrand(null)}
                className="text-stone-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Better Starts Now • Japanese Precision"
                  className="w-full bg-[#1c1c1c] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1">
                  Brand Heritage &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official story and craftsmanship highlights..."
                  className="w-full bg-[#1c1c1c] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880] resize-none"
                />
              </div>

              {/* Banner Image Customization */}
              <div className="space-y-2">
                <label className="block text-stone-400 uppercase tracking-wider font-semibold">
                  Hero Banner Image
                </label>
                {bannerImage && (
                  <div className="relative h-28 w-full bg-black border border-stone-800 overflow-hidden mb-2">
                    <img src={bannerImage} alt="Banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-3 bg-[#1e1e1e] border border-dashed border-[#383838] text-center cursor-pointer hover:border-[#c5a880] transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-[#c5a880]" />
                    <span className="text-[11px] text-stone-300">Upload Banner File</span>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="Or paste banner image URL"
                    className="w-full bg-[#1c1c1c] border border-[#333333] text-white p-3 text-[11px] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {/* Logo Image */}
              <div className="space-y-2">
                <label className="block text-stone-400 uppercase tracking-wider font-semibold">
                  Logo / Badge Image URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={logoImage}
                    onChange={(e) => setLogoImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#1c1c1c] border border-[#333333] text-white p-3 text-[11px] focus:outline-none focus:border-[#c5a880]"
                  />
                  <label className="px-3 py-3 bg-[#1e1e1e] border border-[#383838] hover:border-[#c5a880] text-stone-300 text-[11px] cursor-pointer flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-[#1c1c1c] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded-none accent-[#c5a880]"
                    />
                    <span>Brand Active on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="px-5 py-2.5 border border-stone-700 hover:border-white text-stone-300 hover:text-white uppercase font-semibold text-xs tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="save-brand-visuals-btn"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'SAVING...' : 'SAVE VISUALS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
