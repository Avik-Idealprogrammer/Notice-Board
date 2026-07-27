import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

// Community notices ONLY (type=notice locked in the query). Ads never appear here.
const NOTICE_CATEGORIES = ['event', 'job', 'alert', 'announcement', 'other'];

export default function NoticeBoard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { type: 'notice', sort: 'recent' };
        if (category) params.category = category;
        if (area) params.area = area;
        const res = await api.get('/feed', { params });
        setPosts(res.data.posts);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, area]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {/* COLOR: notice-board icon uses accent color, distinct from Dashboard's brand color */}
          <ClipboardList className="text-accent-600" size={22} />
          <h1 className="text-xl font-bold text-slate-900">Notice Board</h1>
        </div>
        {user && (
          <Link
            to="/post-notice"
            className="inline-flex items-center gap-1.5 bg-accent-600 text-white text-sm font-semibold px-3.5 py-2 rounded-lg hover:bg-accent-500 transition shadow-card"
          >
            <PlusCircle size={15} /> New notice
          </Link>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-6">Community alerts, events, jobs and announcements — no ads here.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <input
          placeholder="Filter by area..."
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-40 outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              category === '' ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {NOTICE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                category === c ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No notices yet" subtitle="Be the first to post something for your neighborhood." />
      ) : (
        // SIZE: notice board uses a 2-column layout (vs 3 on Dashboard) since notices read better wider
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}
