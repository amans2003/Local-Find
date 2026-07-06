import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Star, Clock, Flag } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

function StarDisplay({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review, actions }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
              {review.user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-dark">{review.user?.name}</p>
              <p className="text-xs text-text-muted">{review.user?.email}</p>
            </div>
          </div>
          <div className="mt-2 ml-10">
            <p className="text-xs text-text-muted mb-1">
              on <span className="text-primary font-medium">{review.listing?.name}</span>
              {' · '}<StarDisplay rating={review.rating} />
              {' · '}{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            {review.title && <p className="text-sm font-semibold text-text-dark">{review.title}</p>}
            <p className="text-sm text-text-mid mt-1 leading-relaxed">{review.body}</p>
            {review.flagReason && (
              <p className="mt-2 text-xs text-error flex items-center gap-1">
                <Flag className="w-3 h-3" /> Flag reason: {review.flagReason}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">{actions}</div>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [tab, setTab] = useState('pending');
  const qc = useQueryClient();

  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: ['admin-reviews-pending'],
    queryFn: () => api.get('/admin/reviews/pending').then((r) => r.data.data),
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const { data: flagged = [], isLoading: loadingFlagged } = useQuery({
    queryKey: ['admin-reviews-flagged'],
    queryFn: () => api.get('/admin/reviews/flagged').then((r) => r.data.data),
    staleTime: 0,
  });

  const approve = useMutation({
    mutationFn: (id) => api.patch(`/admin/reviews/${id}/approve`),
    onSuccess: () => {
      toast.success('Review approved — now live!');
      qc.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
    },
  });

  const reject = useMutation({
    mutationFn: (id) => api.patch(`/admin/reviews/${id}/reject`),
    onSuccess: () => {
      toast.success('Review rejected and removed');
      qc.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
    },
  });

  const moderate = useMutation({
    mutationFn: ({ id, action }) => api.patch(`/admin/reviews/${id}/moderate`, { action }),
    onSuccess: () => {
      toast.success('Done');
      qc.invalidateQueries({ queryKey: ['admin-reviews-flagged'] });
    },
  });

  const tabs = [
    { key: 'pending', label: 'Pending Approval', count: pending.length, icon: Clock },
    { key: 'flagged', label: 'Flagged', count: flagged.length, icon: Flag },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-text-dark">Reviews</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-dark'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                key === 'pending' ? 'bg-warning/15 text-warning' : 'bg-error/15 text-error'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Pending tab */}
      {tab === 'pending' && (
        <>
          {loadingPending ? (
            <p className="text-text-muted text-sm">Loading...</p>
          ) : pending.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-text-muted">No reviews waiting for approval</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  actions={
                    <>
                      <button
                        onClick={() => approve.mutate(r._id)}
                        disabled={approve.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-success bg-success/10 hover:bg-success/20 rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => reject.mutate(r._id)}
                        disabled={reject.isPending}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Flagged tab */}
      {tab === 'flagged' && (
        <>
          {loadingFlagged ? (
            <p className="text-text-muted text-sm">Loading...</p>
          ) : flagged.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <p className="text-text-muted">No flagged reviews</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flagged.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  actions={
                    <>
                      <button
                        onClick={() => moderate.mutate({ id: r._id, action: 'approve' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-success bg-success/10 hover:bg-success/20 rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Keep
                      </button>
                      <button
                        onClick={() => moderate.mutate({ id: r._id, action: 'remove' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
