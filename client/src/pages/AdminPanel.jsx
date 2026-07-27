import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Flag, Users2, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

const TABS = [
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'reports', label: 'Reports', icon: Flag },
  { key: 'users', label: 'Users', icon: Users2 },
];

// Nicer labels for the raw analytics keys coming back from the API
const LABELS = {
  userCount: 'Residents', businessCount: 'Businesses', adCount: 'Ads',
  noticeCount: 'Notices', pendingReports: 'Pending reports', activePosts: 'Active posts',
};

export default function AdminPanel() {
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  const loadAnalytics = () => api.get('/admin/analytics').then((r) => setAnalytics(r.data));
  const loadReports = () => api.get('/admin/reports').then((r) => setReports(r.data));
  const loadUsers = () => api.get('/admin/users').then((r) => setUsers(r.data));

  useEffect(() => { loadAnalytics(); }, []);
  useEffect(() => {
    if (tab === 'reports') loadReports();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const resolveReport = async (reportId, action) => {
    await api.put(`/admin/reports/${reportId}/resolve`, { action });
    loadReports();
  };
  const toggleBan = async (userId) => {
    await api.put(`/admin/users/${userId}/ban`);
    loadUsers();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="text-brand-600" size={22} />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin panel</h1>
      </div>

      {/* Tab bar - COLOR: active tab uses bg-brand-600 */}
      <div className="flex gap-1.5 mb-6 bg-slate-100 dark:bg-white/5 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t.key ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            {tab === t.key && (
              <motion.span layoutId="adminTabPill" className="absolute inset-0 bg-brand-600 rounded-md -z-10" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'analytics' && analytics && (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(analytics).map(([key, value], i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border border-slate-200 dark:border-white/10 rounded-xl2 p-5 bg-white dark:bg-[#1c1410] shadow-card">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{LABELS[key] || key}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'reports' && (
          <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {reports.length === 0 ? (
              <EmptyState icon={Flag} title="No pending reports" subtitle="Everything's clean for now." />
            ) : reports.map((r) => (
              <div key={r._id} className="border border-slate-200 rounded-lg p-4 text-sm bg-white shadow-card">
                <p className="font-medium text-slate-800 dark:text-slate-100">{r.postId?.title || 'Post removed'}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Reported by {r.reportedBy?.name}: "{r.reason}"</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => resolveReport(r._id, 'remove')} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition">
                    Remove post
                  </button>
                  <button onClick={() => resolveReport(r._id, 'restore')} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium hover:bg-slate-200 transition">
                    Dismiss / restore
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {users.map((u) => (
              <div key={u._id} className="flex items-center justify-between border border-slate-200 dark:border-white/10 rounded-lg p-3.5 text-sm bg-white dark:bg-[#1c1410] shadow-card">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{u.name} <span className="text-xs text-slate-400 dark:text-slate-500 uppercase ml-1">({u.role})</span></p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{u.email}</p>
                </div>
                {u.role !== 'admin' && (
                  <button onClick={() => toggleBan(u._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${u.isBanned ? 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/25' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/25'}`}>
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
