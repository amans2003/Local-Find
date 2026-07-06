import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProviderLayout from './components/layout/ProviderLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const Bookmarks = lazy(() => import('./pages/user/Bookmarks'));
const MyReviews = lazy(() => import('./pages/user/MyReviews'));
const Profile = lazy(() => import('./pages/user/Profile'));
const ProviderLogin = lazy(() => import('./pages/provider/Login'));
const ProviderRegister = lazy(() => import('./pages/provider/Register'));
const ProviderDashboard = lazy(() => import('./pages/provider/Dashboard'));
const ProviderListings = lazy(() => import('./pages/provider/Listings'));
const ProviderNewListing = lazy(() => import('./pages/provider/NewListing'));
const ProviderEditListing = lazy(() => import('./pages/provider/EditListing'));
const ProviderAnalytics = lazy(() => import('./pages/provider/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="listing/:slug" element={<ListingDetail />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="city/:slug" element={<CityPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute role="user" />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>

        <Route path="provider/login" element={<Navigate to="/login?t=provider" replace />} />
        <Route path="provider/register" element={<Navigate to="/register?t=provider" replace />} />
        <Route element={<ProtectedRoute role="provider" />}>
          <Route element={<ProviderLayout />}>
            <Route path="provider/dashboard" element={<ProviderDashboard />} />
            <Route path="provider/listings" element={<ProviderListings />} />
            <Route path="provider/listings/new" element={<ProviderNewListing />} />
            <Route path="provider/listings/:id/edit" element={<ProviderEditListing />} />
            <Route path="provider/listings/:id/analytics" element={<ProviderAnalytics />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
