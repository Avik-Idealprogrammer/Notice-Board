import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutGrid, Megaphone, ClipboardList, ShieldCheck, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Central nav-link definitions. Add/remove links here and both desktop + mobile menus update.
const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, always: true },
  { to: '/notices', label: 'Notice Board', icon: ClipboardList, always: true },
  { to: '/post-ad', label: 'Post Ad', icon: Megaphone, roles: ['business', 'admin'] },
  { to: '/business/profile', label: 'My Business', icon: Megaphone, roles: ['business', 'admin'] },
  { to: '/saved', label: 'Saved', icon: Bookmark, requiresAuth: true },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['admin'] },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.always) return true;
    if (link.requiresAuth) return Boolean(user);
    if (link.roles) return user && link.roles.includes(user.role);
    return false;
  });

  return (
    // COLOR: navbar background + border
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl tracking-tight text-slate-900">
          Notice<span className="text-brand-600">Board</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {visibleLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg transition-colors ${
                  active ? 'text-brand-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.label}
                {active && (
                  // COLOR: active-tab pill background
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 -z-10 bg-brand-50 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log in
              </Link>
              {/* COLOR: primary CTA button - this exact class combo is reused across the app */}
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-card"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-slate-700" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 my-1" />
              {user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <div className="flex gap-2 px-3 py-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 rounded-lg border text-sm">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-brand-600 text-white text-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
