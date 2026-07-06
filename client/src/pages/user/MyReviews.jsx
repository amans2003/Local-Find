import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../../utils/api';
import StarRating from '../../components/ui/StarRating';
import toast from 'react-hot-toast';

export default function MyReviews() {
  const qc = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => api.get('/users/reviews').then((r) => r.data.data),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`),
    onSuccess: () => { toast.success('Review deleted'); qc.invalidateQueries(['my-reviews']); },
  });

  return (
    <>
      <Helmet><title>My Reviews — LocalFind</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-h1 mb-6">My Reviews</h1>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✍️</p>
            <p className="text-text-muted">You haven't written any reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Link to={`/listing/${r.listing?.slug}`} className="font-semibold text-text-dark hover:text-primary">
                      {r.listing?.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={r.rating} />
                      <span className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.title && <p className="text-sm font-medium mt-2">{r.title}</p>}
                    <p className="text-sm text-text-mid mt-1">{r.body}</p>
                  </div>
                  <button onClick={() => del.mutate(r._id)} className="p-2 text-text-muted hover:text-error transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
