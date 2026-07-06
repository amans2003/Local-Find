import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Eye, Phone, Map } from 'lucide-react';
import api from '../../utils/api';

export default function ProviderAnalytics() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['listing-analytics', id],
    queryFn: () => api.get(`/providers/listings/${id}/analytics?days=30`).then((r) => r.data.data),
  });

  if (isLoading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>;

  const { listing, daily = [] } = data || {};

  const kpis = [
    { label: 'Total Views', value: listing?.views || 0, icon: Eye },
    { label: 'Phone Clicks', value: listing?.phoneClicks || 0, icon: Phone },
    { label: 'Map Opens', value: listing?.mapOpens || 0, icon: Map },
  ];

  return (
    <>
      <Helmet><title>Analytics — {listing?.name}</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-h1">{listing?.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kpis.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-text-muted">{label}</span>
              </div>
              <p className="text-3xl font-bold text-text-dark">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h2 className="text-h2 mb-4">Daily Activity (Last 30 Days)</h2>
          {daily.length === 0 ? (
            <p className="text-text-muted text-sm">No activity data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-text-muted border-b border-border">
                  <tr>
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Views</th>
                    <th className="pb-2 text-right">Phone</th>
                    <th className="pb-2 text-right">Map</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {daily.map((d) => (
                    <tr key={d.date}>
                      <td className="py-2 text-text-dark">{d.date}</td>
                      <td className="py-2 text-right">{d.views}</td>
                      <td className="py-2 text-right">{d.phoneClicks}</td>
                      <td className="py-2 text-right">{d.mapOpens}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
