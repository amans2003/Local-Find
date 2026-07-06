import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import ListingCard from '../components/listings/ListingCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useSearchListings } from '../hooks/useListings';

export default function CategoryPage() {
  const { slug } = useParams();
  const [sp] = useSearchParams();

  const { data: cat } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then((r) => r.data.data),
  });

  // Use display name so the server regex matches DB values exactly
  const { data, isLoading } = useSearchListings({ category: cat?.name || '', limit: 12 });
  const listings = data?.data || [];

  return (
    <>
      <Helmet>
        <title>{cat?.name || slug} — LocalFind</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-h1 capitalize">{cat?.name || slug}</h1>
          <p className="text-text-muted mt-1">{data?.pagination?.total || 0} listings found</p>
        </div>
        {cat?.subCategories?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {cat.subCategories.filter((s) => s.isActive).map((s) => (
              <span key={s.slug} className="px-3 py-1 rounded-full border border-border text-sm text-text-mid hover:border-primary hover:text-primary cursor-pointer transition-colors">
                {s.name}
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : listings.map((l) => <ListingCard key={l._id} listing={l} />)
          }
        </div>
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📂</p>
            <h2 className="text-h2">No listings in this category yet</h2>
          </div>
        )}
      </div>
    </>
  );
}
