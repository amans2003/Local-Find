import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, Home, LayoutDashboard, LogOut, ChevronDown, Bookmark, Star, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, provider, role } = useAuthStore();
  const logout = useLogout();

  const isLoggedIn = !!(user || provider);
  const dashboardPath = role === 'provider' ? '/provider/dashboard' : '/dashboard';
  const displayName = user?.name || provider?.businessName || 'Account';
  const userEmail = user?.email || provider?.email || '';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const drawerLinks = [
    { to: '/',       icon: Home,            label: 'Home',        color: 'bg-blue-50 text-blue-600',    end: true },
    { to: '/search', icon: Search,          label: 'Explore',     color: 'bg-violet-50 text-violet-600'          },
    ...(isLoggedIn ? [
      { to: dashboardPath,              icon: LayoutDashboard, label: 'Dashboard',  color: 'bg-emerald-50 text-emerald-600' },
      { to: '/dashboard/bookmarks',     icon: Bookmark,        label: 'Saved',      color: 'bg-amber-50 text-amber-600'    },
      { to: '/dashboard/reviews',       icon: Star,            label: 'My Reviews', color: 'bg-rose-50 text-rose-600'      },
      { to: '/dashboard/profile',       icon: User,            label: 'Profile',    color: 'bg-indigo-50 text-indigo-600'  },
    ] : []),
  ];

  return (
    <>
      {/* ── Sticky navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">

            {/* Logo — bigger on both phone and desktop */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Digital Patna"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-primary/5' : 'text-text-mid hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                <Home className="w-4 h-4" />
                Home
              </NavLink>

              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-primary/5' : 'text-text-mid hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                <Search className="w-4 h-4" />
                Explore
              </NavLink>

              {isLoggedIn ? (
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-mid hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <span className="max-w-[100px] truncate">{displayName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-border py-1.5 z-50">
                      <div className="px-3 py-2.5 border-b border-border mb-1">
                        <p className="text-xs text-text-muted">Signed in as</p>
                        <p className="text-sm font-semibold text-text-dark truncate">{displayName}</p>
                      </div>
                      <Link
                        to={dashboardPath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-mid hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { logout.mutate(); setDropdownOpen(false); }}
                        className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-text-mid hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
                </div>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-text-mid" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Right-side mobile drawer ──────────────────── */}

      {/* Backdrop */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel — slides in from the right */}
      <aside
        className="fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out"
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <img src="/logo.png" alt="Digital Patna" className="h-10 w-auto object-contain" />
          <button
            onClick={closeMobile}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-text-mid" />
          </button>
        </div>

        {/* User info (logged in) */}
        {isLoggedIn && (
          <div className="mx-4 mt-4 mb-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-dark truncate text-sm">{displayName}</p>
              <p className="text-xs text-text-muted truncate">{userEmail}</p>
            </div>
          </div>
        )}

        {/* Nav links with colored icon boxes */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {drawerLinks.map(({ to, icon: Icon, label, color, end }) => (
            <NavLink
              key={to + label}
              to={to}
              end={end}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-mid hover:bg-gray-50 hover:text-text-dark'
                }`
              }
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: sign out or login/signup */}
        <div className="px-4 py-4 border-t border-border flex-shrink-0 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={() => { logout.mutate(); closeMobile(); }}
              className="flex items-center gap-3.5 px-3 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              Sign Out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex items-center justify-center w-full py-2.5 rounded-xl border border-border text-sm font-semibold text-text-dark hover:border-primary hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobile}
                className="flex items-center justify-center w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
