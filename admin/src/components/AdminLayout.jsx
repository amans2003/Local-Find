import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Users, Briefcase, Star, Tags, LogOut, MapPin } from 'lucide-react';
import { useAdminAuth } from '../App';
import api from '../utils/api';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/listings', icon: List, label: 'Listings' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/providers', icon: Briefcase, label: 'Providers' },
  { to: '/reviews', icon: Star, label: 'Reviews' },
  { to: '/taxonomy', icon: Tags, label: 'Taxonomy' },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/admin-logout'); } catch {}
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">LocalFind</span>
            <span className="text-xs bg-error text-white px-1.5 py-0.5 rounded font-medium ml-auto">Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-mid hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-error hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
