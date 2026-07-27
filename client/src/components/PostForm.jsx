import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ImagePlus, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AD_CATEGORIES = ['sale', 'service', 'announcement', 'other'];
const NOTICE_CATEGORIES = ['event', 'job', 'alert', 'announcement', 'other'];

// Shared form for both Ad Posting Page and Notice Posting Page.
// `fixedType` locks the post type ('ad' | 'notice') - pass nothing to allow editing either.
export default function PostForm({ fixedType }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing an existing post
  const isEditing = Boolean(id);
  const type = fixedType;

  const categories = type === 'ad' ? AD_CATEGORIES : NOTICE_CATEGORIES;

  const [form, setForm] = useState({
    title: '', description: '', category: categories[0],
    city: user?.location?.city || '', area: user?.location?.area || '', eventDate: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/posts/${id}`).then((res) => {
      const p = res.data;
      setForm({
        title: p.title, description: p.description, category: p.category,
        city: p.location.city, area: p.location.area,
        eventDate: p.eventDate ? p.eventDate.slice(0, 10) : '',
      });
    });
  }, [id, isEditing]);

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const location = { city: form.city, area: form.area };

      if (isEditing) {
        await api.put(`/posts/${id}`, {
          title: form.title, description: form.description, category: form.category,
          location, eventDate: form.eventDate || null,
        });
        navigate(`/posts/${id}`);
        return;
      }

      const fd = new FormData();
      fd.append('type', type);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('location', JSON.stringify(location));
      if (form.eventDate) fd.append('eventDate', form.eventDate);
      images.forEach((img) => fd.append('images', img));

      const res = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save post');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition';

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 bg-white border border-slate-200 rounded-xl2 shadow-card p-6"
    >
      <input
        placeholder="Title"
        required
        maxLength={120}
        className={inputClass}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        required
        rows={4}
        maxLength={2000}
        className={inputClass}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <select
        className={inputClass}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <div className="flex gap-3">
        <input placeholder="City" required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="Area" required className={inputClass} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
      </div>

      {type === 'notice' && (
        <div>
          <label className="text-xs text-slate-500 block mb-1">Event date (optional)</label>
          <input type="date" className={inputClass} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
        </div>
      )}

      {!isEditing && (
        <div>
          <label className="text-xs text-slate-500 block mb-2">Photos (up to 5)</label>
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={src} className="w-16 h-16 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white rounded-full p-0.5">
                  <X size={10} />
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <label className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer text-slate-400 hover:border-brand-400 hover:text-brand-500 transition">
                <ImagePlus size={18} />
                <input type="file" multiple accept="image/*" onChange={handleImagePick} className="hidden" />
              </label>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-card"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Saving...' : isEditing ? 'Save changes' : type === 'ad' ? 'Publish ad' : 'Publish notice'}
      </motion.button>
    </motion.form>
  );
}
