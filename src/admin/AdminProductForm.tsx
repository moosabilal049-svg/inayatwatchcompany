import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Product } from '../types';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Save,
  HelpCircle,
} from 'lucide-react';

interface AdminProductFormProps {
  productId?: string;
}

const DEFAULT_WATCH_IMAGE = 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80';

const CATEGORY_OPTIONS = [
  'Men',
  'Women',
  'Unisex',
  'Chronograph',
  'Automatic',
  'Quartz',
  'Sports',
  'Dress',
  'Fashion',
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId }) => {
  const { brands, products, navigate, refreshData, showToast } = useStore();

  const isEditing = Boolean(productId);
  const existingProduct = isEditing ? products.find(p => p.id === productId) : null;

  // Form states
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('citizen');
  const [category, setCategory] = useState('Men');
  const [price, setPrice] = useState<number | ''>(25000);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number | ''>(5);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [onSale, setOnSale] = useState(false);

  // Specifications
  const [movement, setMovement] = useState('Quartz Movement');
  const [caseMaterial, setCaseMaterial] = useState('Stainless Steel');
  const [strapMaterial, setStrapMaterial] = useState('Solid Steel Bracelet');
  const [dialColor, setDialColor] = useState('Classic Black');
  const [caseColor, setCaseColor] = useState('Silver');
  const [waterResistance, setWaterResistance] = useState('50M / 5 ATM');
  const [gender, setGender] = useState('Men');
  const [watchType, setWatchType] = useState('Luxury Dress / Sports');

  // Images list
  const [images, setImages] = useState<string[]>([DEFAULT_WATCH_IMAGE]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate if editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setBrandId(existingProduct.brand_id);
      setCategory(existingProduct.category);
      setPrice(existingProduct.price);
      setSalePrice(existingProduct.sale_price ?? '');
      setSku(existingProduct.sku);
      setStock(existingProduct.stock);
      setDescription(existingProduct.description);
      setFeatured(existingProduct.featured);
      setNewArrival(existingProduct.new_arrival);
      setOnSale(existingProduct.on_sale);
      setImages(existingProduct.images && existingProduct.images.length > 0 ? existingProduct.images : [DEFAULT_WATCH_IMAGE]);

      if (existingProduct.specifications) {
        setMovement(existingProduct.specifications.movement || 'Quartz Movement');
        setCaseMaterial(existingProduct.specifications.case_material || 'Stainless Steel');
        setStrapMaterial(existingProduct.specifications.strap_material || 'Solid Steel Bracelet');
        setDialColor(existingProduct.specifications.dial_color || 'Classic Black');
        setCaseColor(existingProduct.specifications.case_color || 'Silver');
        setWaterResistance(existingProduct.specifications.water_resistance || '50M / 5 ATM');
        setGender(existingProduct.specifications.gender || 'Men');
        setWatchType(existingProduct.specifications.watch_type || 'Luxury Dress / Sports');
      }
    } else {
      // Generate default SKU
      setSku(`IWC-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [existingProduct]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImages(prev => {
            // If the first image is default fallback, replace it
            if (prev.length === 1 && prev[0] === DEFAULT_WATCH_IMAGE) {
              return [resultStr];
            }
            return [...prev, resultStr];
          });
          showToast('Image uploaded successfully', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => {
      if (prev.length === 1 && prev[0] === DEFAULT_WATCH_IMAGE) {
        return [newImageUrl.trim()];
      }
      return [...prev, newImageUrl.trim()];
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      setImages([DEFAULT_WATCH_IMAGE]);
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast('Please enter a valid price in PKR', 'error');
      return;
    }

    const payload = {
      name: name.trim(),
      brand_id: brandId.toLowerCase(), // CRITICAL: strictly assigns brand_id to selected brand slug
      category,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
      sku: sku.trim() || `IWC-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: Number(stock) || 0,
      description: description.trim(),
      images: images.filter(img => Boolean(img)),
      featured,
      new_arrival: newArrival,
      on_sale: onSale || (salePrice ? Number(salePrice) < Number(price) : false),
      specifications: {
        movement,
        case_material: caseMaterial,
        strap_material: strapMaterial,
        dial_color: dialColor,
        case_color: caseColor,
        water_resistance: waterResistance,
        gender,
        watch_type: watchType,
      },
    };

    setIsSubmitting(true);
    try {
      if (isEditing && productId) {
        await api.updateProduct(productId, payload);
        showToast(`Updated "${name}" successfully`, 'success');
      } else {
        await api.createProduct(payload);
        showToast(`Saved "${name}" into ${brandId.toUpperCase()} house!`, 'success');
      }

      await refreshData();
      navigate('/admin/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product List</span>
        </button>

        <span className="text-xs text-[#c5a880] uppercase tracking-wider font-semibold">
          {isEditing ? 'Editing Mode' : 'New Watch Creation'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* SECTION 1: Identity & Brand House */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#222222] pb-3">
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              1. Brand House &amp; Watch Name
            </h2>
            <p className="text-[11px] text-stone-400">
              Select one of the 9 pre-configured brand houses. The watch will automatically be placed in its dedicated collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* BRAND DROPDOWN (Strict mandate: Admin does NOT type manually) */}
            <div className="sm:col-span-1">
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Brand House *
              </label>
              <select
                id="product-form-brand-select"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 text-sm uppercase tracking-wider focus:outline-none focus:border-[#c5a880] font-serif font-semibold"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.slug} className="bg-black py-2">
                    {b.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-stone-500 mt-1">
                Will be displayed on `/collections/{brandId}`
              </p>
            </div>

            {/* Category */}
            <div className="sm:col-span-1">
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 text-sm focus:outline-none focus:border-[#c5a880]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Full Watch Model / Reference Name *
              </label>
              <input
                id="product-form-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Citizen Promaster Eco-Drive Marine Diver"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 text-sm focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing & Inventory */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#222222] pb-3">
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              2. Pricing &amp; Inventory (Pakistani Rupees)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Regular Price (Rs.) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 45000"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Sale Price (Rs. Optional)
              </label>
              <input
                type="number"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 39500"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                SKU / Reference Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. CTZ-BN0150"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 font-mono focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 5"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          {/* Visibility Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#222222]">
            <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded-none accent-[#c5a880]"
              />
              <span>Feature on Homepage Curations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="rounded-none accent-[#c5a880]"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white">
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="rounded-none accent-[#c5a880]"
              />
              <span>Mark as Sale Watch</span>
            </label>
          </div>
        </div>

        {/* SECTION 3: Visual Imagery Gallery */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#222222] pb-3">
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              3. Watch Imagery
            </h2>
            <p className="text-[11px] text-stone-400">
              Upload files directly from your computer, or paste public image URLs. The first image will be used as the primary display image.
            </p>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-black border border-[#2a2a2a] group overflow-hidden">
                <img src={img} alt={`Watch ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-[#c5a880] text-black text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/80 text-rose-400 hover:bg-rose-700 hover:text-white transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Direct File Upload */}
            <div className="p-4 bg-[#181818] border border-dashed border-[#333333] text-center space-y-2">
              <Upload className="w-6 h-6 text-[#c5a880] mx-auto stroke-1" />
              <div className="text-xs text-stone-300 font-medium">Upload Watch Photos</div>
              <p className="text-[10px] text-stone-500">Supports PNG, JPG, WEBP</p>
              <label className="inline-block px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Paste URL */}
            <div className="p-4 bg-[#181818] border border-[#333333] space-y-2">
              <div className="text-xs text-stone-300 font-medium">Or Add by Image URL</div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#121212] border border-[#333333] text-white px-3 py-2 text-xs focus:outline-none focus:border-[#c5a880]"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-3 py-2 bg-[#c5a880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-[10px] text-stone-500">Add multiple high-res angles</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Description & Horological Specifications */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#222222] pb-3">
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              4. Specifications &amp; Overview
            </h2>
          </div>

          <div>
            <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1.5">
              Watch Description &amp; Heritage
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the craftsmanship, dial finish, movement heritage, and warranty coverage..."
              className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Movement
              </label>
              <input
                type="text"
                value={movement}
                onChange={(e) => setMovement(e.target.value)}
                placeholder="e.g. Japanese Quartz"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Case Material
              </label>
              <input
                type="text"
                value={caseMaterial}
                onChange={(e) => setCaseMaterial(e.target.value)}
                placeholder="e.g. 316L Stainless Steel"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Strap Material
              </label>
              <input
                type="text"
                value={strapMaterial}
                onChange={(e) => setStrapMaterial(e.target.value)}
                placeholder="e.g. Steel Bracelet / Leather"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Dial Color
              </label>
              <input
                type="text"
                value={dialColor}
                onChange={(e) => setDialColor(e.target.value)}
                placeholder="e.g. Sunray Blue"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Case Color / Finish
              </label>
              <input
                type="text"
                value={caseColor}
                onChange={(e) => setCaseColor(e.target.value)}
                placeholder="e.g. Silver / Gold Accents"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Water Resistance
              </label>
              <input
                type="text"
                value={waterResistance}
                onChange={(e) => setWaterResistance(e.target.value)}
                placeholder="e.g. 100M / 10 Bar"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Target Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1 font-medium text-[11px]">
                Watch Style Type
              </label>
              <input
                type="text"
                value={watchType}
                onChange={(e) => setWatchType(e.target.value)}
                placeholder="e.g. Chronograph / Diver"
                className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3.5 border border-stone-700 hover:border-white text-stone-300 hover:text-white uppercase font-semibold tracking-widest text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            id="save-watch-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase flex items-center gap-2 transition-colors shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'PERSISTING TO DATABASE...' : isEditing ? 'SAVE CHANGES' : 'SAVE WATCH TO BRAND HOUSE'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
