import { lazy, Suspense, createContext, useContext, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Listings = lazy(() => import('./pages/Listings'));
const Users = lazy(() => import('./pages/Users'));
const Providers = lazy(() => import('./pages/Providers'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Taxonomy = lazy(() => import('./pages/Taxonomy'));

const AuthContext = createContext(null);

export function useAdminAuth() {
  return useContext(AuthContext);
}

function AdminRoute({ children }) {
  const { token } = useAdminAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);

  const login = useCallback((newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-primary font-semibold">
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="listings" element={<Listings />} />
            <Route path="users" element={<Users />} />
            <Route path="providers" element={<Providers />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="taxonomy" element={<Taxonomy />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthContext.Provider>
  );
}
