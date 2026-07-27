import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Mail, Pencil } from 'lucide-react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['retail', 'food', 'services', 'health', 'education', 'other'];

export default function BusinessProfile() {
  const [business, setBusiness] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ businessName: '', category: 'retail', description: '', city: '', area: '', phone: '', email: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/businesses/me');
      setBusiness(res.data);
      setForm({
        businessName: res.data.businessName, category: res.data.category, description: res.data.description,
        city: res.data.location.city, area: res.data.location.area, phone: res.data.contact.phone, email: res.data.contact.email,
      });
    } catch {
      setEditing(true);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!business) return;
    api.get('/posts/mine').then((res) => setPosts(res.data.filter((p) => p.type === 'ad')));
  }, [business]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      businessName: form.businessName, category: form.category, description: form.description,
      location: { city: form.city, area: form.area }, contact: { phone: form.phone, email: form.email },
    };
    try {
      const res = business ? await api.put(`/businesses/${business._id}`, payload) : await api.post('/businesses', payload);
      setBusiness(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save business profile');
    }
  };

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition';

  if (editing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-slate-900 mb-6">{business ? 'Edit business profile' : 'Create your business profile'}</h1>
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-xl2 shadow-card p-6">
          <input placeholder="Business name" required className={inputClass} value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea placeholder="Description" rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <input placeholder="City" required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="Area" required className={inputClass} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <input placeholder="Phone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Contact email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-2">
            <button className="flex-1 bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition shadow-card">Save</button>
            {business && <button type="button" onClick={() => setEditing(false)} className="px-4 rounded-lg border border-slate-200 text-sm">Cancel</button>}
          </div>
        </motion.form>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-xl2 shadow-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* COLOR: business avatar placeholder circle */}
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{business.businessName}</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">{business.category}</p>
            </div>
          </div>
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
            <Pencil size={13} /> Edit
          </button>
        </div>

        <p className="text-slate-600 mt-4 text-sm leading-relaxed">{business.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><MapPin size={14} /> {business.location.area}, {business.location.city}</span>
          {business.contact.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {business.contact.phone}</span>}
          {business.contact.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {business.contact.email}</span>}
        </div>
      </motion.div>

      <h2 className="font-semibold text-slate-900 mt-8 mb-3">Your ads ({posts.length})</h2>
      {posts.length === 0 ? (
        <EmptyState icon={Store} title="No ads yet" subtitle="Post your first ad to reach residents nearby." />
      ) : (
        <div className="space-y-2">
          {posts.map((p, i) => (
            <motion.a
              key={p._id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              href={`/posts/${p._id}`}
              className="block border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white hover:shadow-card transition-shadow"
            >
              {p.title}
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
