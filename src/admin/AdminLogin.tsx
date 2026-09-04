import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api, setAdminToken } from '../api/client';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { navigate, setIsAdminLoggedIn, showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email: email.trim(), password: password.trim() });
      if (res.token) {
        setAdminToken(res.token);
        setIsAdminLoggedIn(true);
        showToast('Welcome to Inayat Watch Company Control Room', 'success');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>

        <div className="bg-[#121212] border border-[#242424] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#1b1b1b] border border-[#333333] text-[#c5a880] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl text-white uppercase tracking-wider">
              Admin Authentication
            </h1>
            <p className="text-xs text-stone-400 tracking-wide">
              Inayat Watch Company Portal Access
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] text-white pl-10 pr-3 py-3 focus:outline-none focus:border-[#c5a880]"
                  placeholder="admin@inayatwatches.pk"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2b2b2b] text-white pl-10 pr-3 py-3 focus:outline-none focus:border-[#c5a880]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#c5a880] hover:bg-white text-black font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <span>SIGN IN TO PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
