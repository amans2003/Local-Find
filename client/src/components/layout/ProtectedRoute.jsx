import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import PageLoader from '../ui/PageLoader';

export default function ProtectedRoute({ role }) {
  const { user, provider, hasHydrated } = useAuthStore();
  const location = useLocation();

  // Wait for Zustand to rehydrate from localStorage before checking auth.
  // Without this, the first render always sees null state and redirects to login.
  if (!hasHydrated) return <PageLoader />;

  if (role === 'user' && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role === 'provider' && !provider) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
