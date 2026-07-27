import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, PlusCircle, Inbox } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['event', 'job', 'alert', 'sale', 'service', 'announcement', 'other'];

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', city: '', q: '', sort: 'recent' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const res = await api.get('/feed', { params });
        setPosts(res.data.posts);
        setPages(res.data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [filters, page]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero / greeting strip - COLOR: gradient background here */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl2 bg-gradient-to-r from-brand-600 via-brand-700 to-accent-500 text-white p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {user ? `Hey ${user.name.split(' ')[0]}, here's what's nearby` : "What's happening nearby"}
          </h1>
          <p className="text-brand-100 text-sm mt-1">Ads, notices, and events from your local area — all in one feed.</p>
        </div>
        {user && (
          <Link
            to={user.role === 'business' ? '/post-ad' : '/post-notice'}
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold text-sm px-4 py-2.5 rounded-lg shadow-card hover:bg-brand-50 transition whitespace-nowrap"
          >
            <PlusCircle size={16} /> {user.role === 'business' ? 'Post an ad' : 'Post a notice'}
          </Link>
        )}
      </motion.div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search posts..."
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
            value={filters.q}
            onChange={(e) => updateFilter('q', e.target.value)}
          />
        </div>
        <input
          placeholder="City"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-28 outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition ${
            showFilters ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-slate-200 text-slate-600'
          }`}
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden mb-6"
      >
        <div className="flex flex-wrap gap-2 pb-2">
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
          >
            <option value="">All types</option>
            <option value="ad">Ads</option>
            <option value="notice">Notices</option>
          </select>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="recent">Most recent</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </motion.div>

      {/* SIZE: grid columns - sm:2 lg:3. Change lg:grid-cols-3 to -4 for a denser grid on wide screens */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={Inbox} title="Nothing here yet" subtitle="Try clearing a filter or widening your search area." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                p === page ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
