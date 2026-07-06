import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.get('/users/bookmarks').then((r) => r.data.data),
  });

  return (
    <>
      <Helmet><title>Dashboard — LocalFind</title></Helmet>
      <div className="p-6 md:p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-text-dark">
          Welcome, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-text-muted mt-1 mb-8">{user?.email}</p>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-dark">Saved Listings</p>
                <p className="text-sm text-text-muted">{bookmarks.length} saved</p>
              </div>
            </div>
            <Link to="/dashboard/bookmarks" className="text-sm text-primary font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-text-dark">My Reviews</p>
                <p className="text-sm text-text-muted">Manage your reviews</p>
              </div>
            </div>
            <Link to="/dashboard/reviews" className="text-sm text-primary font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-text-dark">Discover</p>
                <p className="text-sm text-text-muted">Find local services near you</p>
              </div>
            </div>
            <Link to="/search" className="text-sm text-primary font-medium hover:underline">
              Explore
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
