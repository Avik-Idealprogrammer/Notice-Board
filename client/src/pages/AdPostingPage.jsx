import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import PostForm from '../components/PostForm';

export default function AdPostingPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-1">
        <Megaphone className="text-brand-600" size={20} />
        <h1 className="text-xl font-bold text-slate-900">Post a business ad</h1>
      </motion.div>
      <p className="text-slate-400 text-sm mb-6">Visible to residents browsing your city and area.</p>
      <PostForm fixedType="ad" />
    </div>
  );
}
