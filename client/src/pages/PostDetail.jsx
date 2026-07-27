import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Bookmark, Pencil, Trash2, Flag, MapPin, Calendar } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load post');
    }
  };

  useEffect(() => { load(); }, [id]);

  const requireLogin = () => {
    if (!user) { navigate('/login'); return true; }
    return false;
  };

  const handleLike = async () => { if (requireLogin()) return; await api.put(`/posts/${id}/like`); load(); };
  const handleSave = async () => { if (requireLogin()) return; await api.put(`/posts/${id}/save`); };
  const handleShare = async () => {
    await api.post(`/posts/${id}/share`);
    if (navigator.share) navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
    else navigator.clipboard.writeText(window.location.href);
    load();
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (requireLogin()) return;
    if (!commentText.trim()) return;
    await api.post(`/posts/${id}/comments`, { text: commentText });
    setCommentText('');
    load();
  };
  const handleReport = async (e) => {
    e.preventDefault();
    if (requireLogin()) return;
    await api.post(`/posts/${id}/report`, { reason: reportReason });
    setShowReport(false);
    setReportReason('');
    alert('Reported. Our team will review this post.');
  };
  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    navigate('/');
  };

  if (error) return <p className="text-center text-red-600 mt-16">{error}</p>;
  if (!post) return <p className="text-center text-slate-400 mt-16 text-sm">Loading...</p>;

  const isOwner = user && String(post.ownerId?._id) === String(user._id);
  const isLiked = user && post.likes?.includes(user._id);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4 py-8">
      {post.images?.[0] && (
        <img src={post.images[0]} alt={post.title} className="w-full max-h-80 object-cover rounded-xl2 mb-5 shadow-card" />
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-white uppercase tracking-wide">{post.type}</span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">{post.category}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
        <span className="flex items-center gap-1"><MapPin size={13} /> {post.location?.area}, {post.location?.city}</span>
        {post.businessId && <span>· {post.businessId.businessName}</span>}
        {post.eventDate && <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(post.eventDate).toLocaleDateString()}</span>}
      </div>

      <p className="text-slate-700 mt-5 whitespace-pre-wrap leading-relaxed">{post.description}</p>

      <div className="flex items-center gap-2 mt-6 text-sm flex-wrap">
        <motion.button whileTap={{ scale: 0.92 }} onClick={handleLike}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} /> {post.likes?.length || 0}
        </motion.button>
        <button onClick={handleShare} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
          <Share2 size={14} /> {post.shareCount || 0}
        </button>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
          <Bookmark size={14} /> Save
        </button>

        {isOwner ? (
          <>
            <Link to={`/edit/${post._id}`} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
              <Pencil size={14} /> Edit
            </Link>
            <button onClick={handleDelete} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
              <Trash2 size={14} /> Delete
            </button>
          </>
        ) : (
          <button onClick={() => setShowReport(!showReport)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition ml-auto">
            <Flag size={14} /> Report
          </button>
        )}
      </div>

      <AnimatePresence>
        {showReport && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReport} className="mt-3 flex gap-2 overflow-hidden">
            <input required placeholder="Reason for reporting..." className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-sm" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium">Submit</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-10">
        <h2 className="font-semibold text-slate-900 mb-3">Comments ({post.comments?.length || 0})</h2>
        <form onSubmit={handleComment} className="flex gap-2 mb-4">
          <input placeholder={user ? 'Write a comment...' : 'Log in to comment'} className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
          <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition">Post</button>
        </form>

        <div className="space-y-3">
          {post.comments?.map((c) => (
            <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm border-b border-slate-100 pb-2.5">
              <span className="font-medium text-slate-800">{c.userId?.name || 'User'}</span>
              <span className="text-slate-600 ml-2">{c.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
