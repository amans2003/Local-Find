import { useQuery } from '@tanstack/react-query';
import { List, Clock, Users, Briefcase } from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data.data),
  });

  if (isLoading) return <div className="text-text-muted">Loading dashboard...</div>;

  const { kpis, dailyListings = [], categoryDistribution = [], cityDistribution = [] } = data || {};

  const kpiCards = [
    { label: 'Total Listings', value: kpis?.totalListings || 0, icon: List, color: 'text-primary' },
    { label: 'Pending Approval', value: kpis?.pendingListings || 0, icon: Clock, color: 'text-warning' },
    { label: 'Registered Users', value: kpis?.totalUsers || 0, icon: Users, color: 'text-success' },
    { label: 'Service Providers', value: kpis?.totalProviders || 0, icon: Briefcase, color: 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-muted">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-text-dark">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-text-dark mb-4">Category Distribution</h2>
          <div className="space-y-2">
            {categoryDistribution.slice(0, 8).map(({ _id, count }) => {
              const max = categoryDistribution[0]?.count || 1;
              return (
                <div key={_id} className="flex items-center gap-3">
                  <span className="text-sm text-text-mid w-32 capitalize flex-shrink-0">{_id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-text-muted w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold text-text-dark mb-4">Top Cities</h2>
          <div className="space-y-2">
            {cityDistribution.slice(0, 8).map(({ _id, count }) => {
              const max = cityDistribution[0]?.count || 1;
              return (
                <div key={_id} className="flex items-center gap-3">
                  <span className="text-sm text-text-mid w-32 capitalize flex-shrink-0">{_id}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-text-muted w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
