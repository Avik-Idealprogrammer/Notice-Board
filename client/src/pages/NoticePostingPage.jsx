import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import PostForm from '../components/PostForm';

export default function NoticePostingPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-1">
        <ClipboardList className="text-accent-600" size={20} />
        <h1 className="text-xl font-bold text-slate-900">Post a community notice</h1>
      </motion.div>
      <p className="text-slate-400 text-sm mb-6">Events, alerts, jobs, or announcements for your neighborhood.</p>
      <PostForm fixedType="notice" />
    </div>
  );
}
