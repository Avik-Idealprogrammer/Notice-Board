import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // SIZE: min-h-[calc(100vh-4rem)] accounts for the 64px navbar height (h-16 in Navbar.jsx)
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left decorative panel - hidden on mobile. COLOR: gradient defined here */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-500 via-brand-700 to-accent-500 relative overflow-hidden items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-white max-w-sm"
        >
          <MapPin size={40} className="mb-6 opacity-80" />
          <h2 className="text-3xl font-bold leading-tight">
            Everything happening in your neighborhood, in one place.
          </h2>
          <p className="text-brand-100 mt-4 text-sm">
            Community notices, local business ads, and events — all filtered by
            where you actually live.
          </p>
        </motion.div>
        {/* decorative blurred circles - purely visual, safe to delete */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1 mb-8">Log in to your NoticeBoard account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                // COLOR/SIZE: shared input style - focus ring color is brand-500
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              // COLOR: primary button - bg-brand-600 / hover:bg-brand-700
              className="w-full bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-card"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Logging in...' : 'Log in'}
            </motion.button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            No account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
