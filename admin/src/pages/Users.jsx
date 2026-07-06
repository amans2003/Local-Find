import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban, CheckCircle, ShieldCheck, ShieldOff } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => api.get('/admin/users', { params: { page, limit: 20 } }).then((r) => r.data),
  });

  const ban = useMutation({
    mutationFn: (id) => api.patch(`/admin/users/${id}/ban`),
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries(['admin-users']); },
  });

  const verify = useMutation({
    mutationFn: (id) => api.patch(`/admin/users/${id}/verify`),
    onSuccess: () => { toast.success('Verification updated'); qc.invalidateQueries(['admin-users']); },
  });

  const users = data?.data || [];
  const total = data?.pagination?.total || 0;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-text-dark">Users ({total})</h1>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border text-xs text-text-muted font-medium text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 hidden md:table-cell">Joined</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted">No users found</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-text-dark text-sm">{u.name}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{u.email}</td>
                <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell">
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.isVerified ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-muted'}`}>
                    {u.isVerified ? '✓ Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {u.isActive ? 'Active' : 'Banned'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => verify.mutate(u._id)}
                      disabled={verify.isPending}
                      title={u.isVerified ? 'Remove verification' : 'Mark as verified'}
                      className={`p-1.5 rounded transition-colors ${
                        u.isVerified
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-success hover:bg-success/10'
                      }`}
                    >
                      {u.isVerified ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => ban.mutate(u._id)}
                      disabled={ban.isPending}
                      title={u.isActive ? 'Ban user' : 'Unban user'}
                      className={`p-1.5 rounded transition-colors ${
                        u.isActive ? 'text-error hover:bg-error/10' : 'text-success hover:bg-success/10'
                      }`}
                    >
                      {u.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= total}
                className="px-3 py-1.5 text-sm rounded-lg border border-border disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
