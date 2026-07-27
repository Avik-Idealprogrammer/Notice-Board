import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin } from 'lucide-react';

// COLOR: category badge colors. Add/edit categories here.
const CATEGORY_COLORS = {
  event: 'bg-purple-100 text-purple-700',
  job: 'bg-amber-100 text-amber-700',
  alert: 'bg-red-100 text-red-700',
  sale: 'bg-green-100 text-green-700',
  service: 'bg-blue-100 text-blue-700',
  announcement: 'bg-slate-100 text-slate-700',
  other: 'bg-slate-100 text-slate-700',
};

// index is passed in for stagger delay when rendered in a list (see Dashboard.jsx / NoticeBoard.jsx)
export default function PostCard({ post, index = 0 }) {
  const badgeColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/posts/${post._id}`}
        // SIZE: card corner radius is rounded-xl2 (defined in tailwind.config.js)
        className="block border border-slate-200 rounded-xl2 overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300"
      >
        {post.images?.[0] ? (
          // SIZE: image height — change h-40 to make cards taller/shorter
          <img src={post.images[0]} alt={post.title} className="w-full h-40 object-cover" />
        ) : (
          // COLOR: placeholder gradient when a post has no image
          <div className="w-full h-40 bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center">
            <span className="text-3xl">{post.type === 'ad' ? '📢' : '📌'}</span>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeColor}`}>
              {post.category}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-white uppercase tracking-wide">
              {post.type}
            </span>
          </div>

          <h3 className="font-semibold text-slate-900 line-clamp-1">{post.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">{post.description}</p>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {post.location?.area}, {post.location?.city}
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart size={12} /> {post.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} /> {post.comments?.length || 0}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
