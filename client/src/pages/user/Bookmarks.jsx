import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Star, Trash2, ExternalLink, Search } from 'lucide-react';
import api from '../../utils/api';
import { useToggleBookmark } from '../../hooks/useListings';

function SavedCard({ listing }) {
  const remove = useToggleBookmark();
  const { slug, name, category, subCategory, city, subLocation, rating, reviewCount, images, logo, isVerified } = listing;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden flex group hover:shadow-md hover:border-primary/20 transition-all duration-200">

      {/* Thumbnail */}
      <Link
        to={`/listing/${slug}`}
        className="flex-shrink-0 w-24 sm:w-32 bg-primary-light overflow-hidden"
      >
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : logo ? (
          <img src={logo} alt={name} className="w-full h-full object-contain p-3" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/20 select-none">
            {name[0]}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between gap-2">
        <div className="space-y-1.5">
          {/* Name + rating */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/listing/${slug}`}
              className="font-semibold text-text-dark hover:text-primary transition-colors line-clamp-1 text-sm sm:text-base"
            >
              {name}
            </Link>
            <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-700">{rating?.toFixed(1)}</span>
              <span className="text-xs text-amber-500 hidden sm:inline">({reviewCount})</span>
            </div>
          </div>

          {/* Category + verified */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {subCategory || category}
            </span>
            {isVerified && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">
              {subLocation ? `${subLocation}, ` : ''}{city}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/listing/${slug}`}
            className="flex items-center gap-1.5 text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </Link>
          <button
            onClick={() => remove.mutate({ listingId: listing._id, isBookmarked: true })}
            disabled={remove.isPending}
            className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Bookmarks() {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.get('/users/bookmarks').then((r) => r.data.data),
  });

  return (
    <>
      <Helmet><title>Saved Listings — Digital Patna</title></Helmet>

      <div className="p-4 sm:p-6 md:p-8 max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary fill-primary/30" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-dark">Saved Listings</h1>
            <p className="text-sm text-text-muted">
              {isLoading ? 'Loading...' : `${bookmarks.length} business${bookmarks.length !== 1 ? 'es' : ''} saved`}
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Bookmark className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-dark mb-2">No saved businesses yet</h2>
            <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
              Tap the bookmark icon on any listing to save it here for quick access.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 text-sm font-semibold"
            >
              <Search className="w-4 h-4" />
              Explore Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((l) => (
              <SavedCard key={l._id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
