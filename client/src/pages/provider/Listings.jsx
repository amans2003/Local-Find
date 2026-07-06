import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, BarChart2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const STATUS_CONFIG = {
  active:   { color: 'bg-success/10 text-success border-success/20',   icon: CheckCircle,  label: 'Live' },
  pending:  { color: 'bg-warning/10 text-warning border-warning/20',   icon: Clock,        label: 'Pending Review' },
  rejected: { color: 'bg-error/10 text-error border-error/20',         icon: XCircle,      label: 'Rejected' },
  draft:    { color: 'bg-gray-100 text-text-muted border-border',      icon: AlertCircle,  label: 'Draft' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export default function ProviderListings() {
  const { data, isLoading } = useQuery({
    queryKey: ['provider-listings-all'],
    queryFn: () => api.get('/providers/listings?limit=50').then((r) => r.data),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const listings = data?.data || [];
  const pending  = listings.filter((l) => l.status === 'pending').length;
  const active   = listings.filter((l) => l.status === 'active').length;
  const rejected = listings.filter((l) => l.status === 'rejected').length;

  return (
    <>
      <Helmet><title>My Listings — LocalFind</title></Helmet>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-h1">My Listings</h1>
          <Link to="/provider/listings/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>

        {/* Stats */}
        {!isLoading && listings.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Live',           value: active,   color: 'text-success' },
              { label: 'Pending Review', value: pending,  color: 'text-warning' },
              { label: 'Rejected',       value: rejected, color: 'text-error'   },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pending info banner */}
        {pending > 0 && (
          <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl p-4">
            <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning">
                {pending} listing{pending > 1 ? 's' : ''} pending admin review
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Once approved by our admin team, your listing will go live and be visible to users.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <h2 className="text-h2 mb-2">No listings yet</h2>
            <p className="text-text-muted text-sm mb-6">Create your first listing and it will go to admin for review before going live.</p>
            <Link to="/provider/listings/new" className="btn-primary inline-block">Create Your First Listing</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-gray text-left text-xs text-text-muted font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">City</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((l) => (
                  <tr
                    key={l._id}
                    className={`transition-colors ${
                      l.status === 'rejected' ? 'bg-error/5' :
                      l.status === 'pending'  ? 'bg-warning/5' : 'hover:bg-surface-gray/50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-dark text-sm">{l.name}</p>
                      {/* Show rejection reason inline */}
                      {l.status === 'rejected' && l.rejectionReason && (
                        <p className="text-xs text-error mt-0.5 flex items-start gap-1">
                          <XCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{l.rejectionReason}</span>
                        </p>
                      )}
                      {l.status === 'pending' && (
                        <p className="text-xs text-warning mt-0.5">Awaiting admin approval</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted hidden sm:table-cell capitalize">
                      {l.subCategory || l.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell capitalize">{l.city}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/provider/listings/${l._id}/edit`}
                          className="p-1.5 rounded text-text-muted hover:text-primary transition-colors"
                          title="Edit listing"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/provider/listings/${l._id}/analytics`}
                          className="p-1.5 rounded text-text-muted hover:text-primary transition-colors"
                          title="View analytics"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
