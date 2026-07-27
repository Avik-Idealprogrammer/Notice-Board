import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import NoticeBoard from './pages/NoticeBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import AdPostingPage from './pages/AdPostingPage';
import NoticePostingPage from './pages/NoticePostingPage';
import EditPost from './pages/EditPost';
import BusinessProfile from './pages/BusinessProfile';
import AdminPanel from './pages/AdminPanel';
import SavedPosts from './pages/SavedPosts';

// PAGE MAP (6 core pages the PRD asked for, plus supporting routes):
//   /              -> Dashboard        (mixed ads + notices feed)
//   /login /register -> Login          (auth)
//   /notices       -> NoticeBoard      (notices only)
//   /post-ad       -> AdPostingPage    (business accounts only)
//   /post-notice   -> NoticePostingPage
//   /business/profile -> BusinessProfile
//   /admin         -> AdminPanel
export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* AnimatePresence + location.pathname as key = smooth cross-fade between pages */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />

          <Route path="/post-ad" element={
            <ProtectedRoute roles={['business', 'admin']}><AdPostingPage /></ProtectedRoute>
          } />
          <Route path="/post-notice" element={
            <ProtectedRoute><NoticePostingPage /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute><EditPost /></ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute><SavedPosts /></ProtectedRoute>
          } />
          <Route path="/business/profile" element={
            <ProtectedRoute roles={['business', 'admin']}><BusinessProfile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>
          } />

          <Route path="*" element={<p className="text-center mt-20 text-slate-400">Page not found</p>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
