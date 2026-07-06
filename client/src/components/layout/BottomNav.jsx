import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/dashboard/bookmarks', icon: Bookmark, label: 'Saved' },
  { to: '/dashboard', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { user } = useAuthStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text-mid'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
