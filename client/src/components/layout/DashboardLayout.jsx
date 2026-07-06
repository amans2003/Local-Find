import { NavLink, Outlet } from 'react-router-dom';
import { Bookmark, Star, User, LayoutDashboard, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

const NAV = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Overview', short: 'Home',    end: true },
  { to: '/dashboard/bookmarks', icon: Bookmark,        label: 'Saved Listings', short: 'Saved'   },
  { to: '/dashboard/reviews',   icon: Star,            label: 'My Reviews',     short: 'Reviews' },
  { to: '/dashboard/profile',   icon: User,            label: 'Profile',        short: 'Profile' },
];

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* ── Desktop sidebar ──────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-border flex-shrink-0 flex-col">

        {/* User card */}
        <div className="p-5 border-b border-border">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-lg font-bold mb-3 shadow-sm">
            {initials}
          </div>
          <p className="font-semibold text-text-dark truncate">{user?.name}</p>
          <p className="text-xs text-text-muted truncate mt-0.5">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-mid hover:bg-gray-100 hover:text-text-dark'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-auto bg-surface-gray pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile bottom tab bar ────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-border z-30 flex lg:hidden safe-area-bottom">
        {NAV.map(({ to, icon: Icon, short, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {short}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
