import { motion } from 'framer-motion';

// Shown whenever a list is empty (no posts, no notices, no reports, etc.)
export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4"
    >
      {Icon && (
        // 🎨 COLOR: empty-state icon circle background/color
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
          <Icon size={26} />
        </div>
      )}
      <p className="font-medium text-slate-700">{title}</p>
      {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-xs">{subtitle}</p>}
    </motion.div>
  );
}
