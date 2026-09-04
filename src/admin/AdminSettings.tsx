import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../api/client';
import { Save, Shield, Settings, KeyRound, Truck, Phone } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { storeSettings, refreshData, showToast } = useStore();

  const [storeName, setStoreName] = useState('Inayat Watch Company');
  const [whatsapp, setWhatsapp] = useState('+92 331 4900788');
  const [phone, setPhone] = useState('+92 331 4900788');
  const [email, setEmail] = useState('support@inayatwatches.pk');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(10000);

  // Admin password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storeSettings) {
      setStoreName(storeSettings.store_name || 'Inayat Watch Company');
      setWhatsapp(storeSettings.whatsapp_number || '+92 331 4900788');
      setPhone(storeSettings.phone_number || '+92 331 4900788');
      setEmail(storeSettings.email || 'support@inayatwatches.pk');
      setShippingFee(storeSettings.shipping_fee || 0);
      setFreeShippingThreshold(storeSettings.free_shipping_threshold || 10000);
    }
  }, [storeSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await api.updateStoreSettings({
        store_name: storeName,
        whatsapp_number: whatsapp,
        phone_number: phone,
        email: email,
        shipping_fee: Number(shippingFee),
        free_shipping_threshold: Number(freeShippingThreshold),
        ...(newPassword ? { admin_password: newPassword } : {}),
      });

      await refreshData();
      showToast('Store settings saved successfully', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="border-b border-[#222222] pb-6">
        <div className="text-xs tracking-[0.25em] text-[#c5a880] uppercase font-semibold">
          SYSTEM CONFIGURATION
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-wider mt-1">
          Store &amp; Dispatch Settings
        </h1>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Contact & Store Identity */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#222222] pb-3">
            <Phone className="w-4 h-4 text-[#c5a880]" />
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              Store Information &amp; WhatsApp Concierge
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                Store Trade Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                  Primary WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 331 4900788"
                  className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Floating button and order confirmations route to this number
                </p>
              </div>

              <div>
                <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                  Call Line Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 331 4900788"
                  className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@inayatwatches.pk"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#222222] pb-3">
            <Truck className="w-4 h-4 text-[#c5a880]" />
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              Nationwide Delivery &amp; Cash on Delivery Fees
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                Base Courier Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                min={0}
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
              <p className="text-[10px] text-stone-500 mt-1">Set to 0 for Nationwide Free Shipping</p>
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                Free Shipping Minimum Order (Rs.)
              </label>
              <input
                type="number"
                min={0}
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>
        </div>

        {/* Admin Password Change */}
        <div className="bg-[#121212] border border-[#242424] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#222222] pb-3">
            <KeyRound className="w-4 h-4 text-[#c5a880]" />
            <h2 className="font-serif text-lg text-white uppercase tracking-wider">
              Security &amp; Admin Password
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                New Admin Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>

            <div>
              <label className="block text-stone-300 uppercase tracking-wider font-semibold mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-[#181818] border border-[#333333] text-white p-3 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>
        </div>

        <button
          id="save-settings-btn"
          type="submit"
          disabled={isSaving}
          className="w-full py-4 bg-[#c5a880] hover:bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase transition-colors shadow-xl flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'SAVING...' : 'SAVE SYSTEM CONFIGURATION'}</span>
        </button>
      </form>
    </div>
  );
};
