import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, List, BarChart2, Eye } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function ProviderDashboard() {
  const { provider } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['provider-listings'],
    queryFn: () => api.get('/providers/listings?limit=5').then((r) => r.data),
  });

  const listings = data?.data || [];
  const total = data?.pagination?.total || 0;

  const statusColor = {
    active: 'text-success',
    pending: 'text-warning',
    rejected: 'text-error',
    draft: 'text-text-muted',
  };

  return (
    <>
      <Helmet><title>Provider Dashboard — LocalFind</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-text-muted mt-1">{provider?.businessName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Listings', value: total, icon: List },
            { label: 'Active Listings', value: listings.filter((l) => l.status === 'active').length, icon: Eye },
            { label: 'Plan', value: provider?.subscription?.plan || 'Free', icon: BarChart2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-muted">{label}</span>
              </div>
              <p className="text-2xl font-bold text-text-dark capitalize">{value}</p>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h2">Recent Listings</h2>
            <Link to="/provider/listings/new" className="btn-primary text-sm py-2 flex items-center gap-1">
              <Plus className="w-4 h-4" /> New Listing
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-text-muted mb-4">No listings yet.</p>
              <Link to="/provider/listings/new" className="btn-primary inline-block">Create Your First Listing</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {listings.map((l) => (
                <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-surface-gray">
                  <div>
                    <p className="font-medium text-text-dark text-sm">{l.name}</p>
                    <p className="text-xs text-text-muted capitalize">{l.city} · {l.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium capitalize ${statusColor[l.status]}`}>{l.status}</span>
                    <Link to={`/provider/listings/${l._id}/analytics`} className="text-xs text-primary hover:underline">Analytics</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
