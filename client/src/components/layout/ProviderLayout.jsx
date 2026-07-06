import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, List, Plus, BarChart2, MapPin, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import api from '../../utils/api';
import { useMutation } from '@tanstack/react-query';

const nav = [
  { to: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/provider/listings', icon: List, label: 'My Listings' },
  { to: '/provider/listings/new', icon: Plus, label: 'New Listing' },
];

export default function ProviderLayout() {
  const { provider } = useAuthStore();
  const logout = useMutation({
    mutationFn: () => api.post('/providers/logout'),
    onSettled: () => { useAuthStore.getState().logout(); window.location.href = '/provider/login'; },
  });

  return (
    <div className="min-h-screen flex bg-surface-gray">
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">LocalFind</span>
          </Link>
          <p className="text-xs text-text-muted mt-1">{provider?.businessName}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/provider/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-light text-primary' : 'text-text-mid hover:bg-surface-gray'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
