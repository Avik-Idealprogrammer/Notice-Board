import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Users, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'user', city: '', area: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // shared input classes - kept as a variable so every field stays visually consistent
  const inputClass =
    'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-xl2 shadow-card p-8"
      >
        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
        <p className="text-slate-400 text-sm mt-1 mb-6">Join your local NoticeBoard community</p>

        {/* Role selector - two big tappable cards instead of plain radio buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { key: 'user', label: 'Resident', icon: Users, desc: 'Browse & post notices' },
            { key: 'business', label: 'Business', icon: Store, desc: 'Post ads & offers' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setForm({ ...form, role: opt.key })}
              // COLOR: selected-state border/background for role cards
              className={`text-left p-3 rounded-xl border-2 transition ${
                form.role === opt.key
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <opt.icon size={18} className={form.role === opt.key ? 'text-brand-600' : 'text-slate-400'} />
              <p className="font-medium text-sm text-slate-800 mt-1.5">{opt.label}</p>
              <p className="text-xs text-slate-400">{opt.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            placeholder="Full name"
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            className={inputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              placeholder="City"
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="Area"
              className={inputClass}
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-card"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Creating account...' : 'Sign up'}
          </motion.button>
        </form>

        <p className="text-sm text-slate-500 mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
