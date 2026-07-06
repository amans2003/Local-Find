import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'active', 'suspended'];
const BADGE = { pending: 'bg-warning/10 text-warning', active: 'bg-success/10 text-success', suspended: 'bg-error/10 text-error' };

export default function AdminProviders() {
  const [statusFilter, setStatusFilter] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-providers', statusFilter],
    queryFn: () => api.get('/admin/providers', { params: { status: statusFilter, limit: 50 } }).then((r) => r.data),
  });

  const update = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/providers/${id}/status`, { status }),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-providers']); },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">Providers</h1>
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border text-xs text-text-muted font-medium text-left">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3 hidden md:table-cell">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-text-muted">Loading...</td></tr>
            ) : (data?.data || []).map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-text-dark text-sm">{p.businessName}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{p.ownerName}<br /><span className="text-xs">{p.email}</span></td>
                <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell capitalize">{p.category}</td>
                <td className="px-4 py-3"><span className={`badge capitalize ${BADGE[p.status]}`}>{p.status}</span></td>
                <td className="px-4 py-3">
                  <select
                    className="input w-auto text-xs py-1"
                    value={p.status}
                    onChange={(e) => update.mutate({ id: p._id, status: e.target.value })}
                  >
                    {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
