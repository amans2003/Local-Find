import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Globe, Clock, CheckCircle, Star, Bookmark, Share2, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useListing, useToggleBookmark } from '../hooks/useListings';
import { SkeletonText } from '../components/ui/Skeleton';
import StarRating from '../components/ui/StarRating';
import useAuthStore from '../store/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const MapView = lazy(() => import('../components/listings/MapView'));

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ListingDetail() {
  const { slug } = useParams();
  const { data: listing, isLoading, error } = useListing(slug);
  const { user } = useAuthStore();
  const toggleBookmark = useToggleBookmark();
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const images = listing?.images || [];
  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const goNext = useCallback(() => setLightboxIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goPrev, goNext, closeLightbox]);

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', listing?._id],
    queryFn: () => api.get(`/reviews/listing/${listing._id}`).then((r) => r.data.data),
    enabled: !!listing?._id,
  });

  // Fetch bookmarks only when user is logged in — used to show filled/outline icon
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.get('/users/bookmarks').then((r) => r.data.data),
    enabled: !!user,
    staleTime: 0,
  });
  const isBookmarked = !!listing && bookmarks.some((b) => b._id === listing._id);

  if (isLoading) return <DetailSkeleton />;
  if (error || !listing) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-5xl mb-4">😕</p>
      <h1 className="text-h1">Listing not found</h1>
      <Link to="/search" className="btn-primary mt-6 inline-block">Back to Search</Link>
    </div>
  );

  const handlePhoneClick = () => {
    api.post(`/listings/${listing._id}/track/phone`).catch(() => {});
  };

  const handleMapOpen = () => {
    api.post(`/listings/${listing._id}/track/map`).catch(() => {});
  };

  const submitReview = async () => {
    if (!user) return toast.error('Please login to submit a review');
    if (!reviewBody.trim()) return toast.error('Please write something');
    try {
      await api.post(`/reviews/listing/${listing._id}`, { rating: reviewRating, body: reviewBody });
      toast.success('Review submitted — it will appear once approved by admin');
      setReviewBody('');
      setReviewRating(5);
      setReviewSubmitted(true);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    }
  };

  const coords = listing.coordinates?.coordinates;
  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
    : `https://www.google.com/maps/search/${encodeURIComponent(listing.address)}`;

  return (
    <>
      <Helmet>
        <title>{listing.name} — {listing.city} | LocalFind</title>
        <meta name="description" content={listing.description?.slice(0, 160) || `${listing.name} in ${listing.city}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-text-muted mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/city/${listing.city?.toLowerCase()}`} className="hover:text-primary capitalize">{listing.city}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${listing.category?.toLowerCase()}`} className="hover:text-primary capitalize">{listing.category}</Link>
          {listing.subCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize">{listing.subCategory}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-dark font-medium">{listing.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden h-64">
                <img
                  src={images[0]}
                  alt={listing.name}
                  className="col-span-2 w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                  onClick={() => openLightbox(0)}
                />
                <div className="flex flex-col gap-2">
                  {images.slice(1, 3).map((img, i) => (
                    <div key={i} className="relative flex-1 overflow-hidden">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                        onClick={() => openLightbox(i + 1)}
                      />
                      {i === 1 && images.length > 3 && (
                        <button
                          onClick={() => openLightbox(2)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm"
                        >
                          +{images.length - 3} more
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                onClick={closeLightbox}
              >
                {/* Close */}
                <button
                  className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
                  onClick={closeLightbox}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Counter */}
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {images.length}
                </span>

                {/* Prev */}
                {images.length > 1 && (
                  <button
                    className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Image */}
                <img
                  src={images[lightboxIndex]}
                  alt=""
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Next */}
                {images.length > 1 && (
                  <button
                    className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                        className={`w-12 h-9 rounded overflow-hidden border-2 transition ${i === lightboxIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-h1">{listing.name}</h1>
                    {listing.isVerified && (
                      <span className="badge-verified">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <StarRating rating={listing.rating} size="md" />
                      <span className="font-semibold text-text-dark">{listing.rating.toFixed(1)}</span>
                      <span className="text-text-muted text-sm">({listing.reviewCount} reviews)</span>
                    </div>
                    <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full capitalize font-medium">
                      {listing.subCategory || listing.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => user
                      ? toggleBookmark.mutate({ listingId: listing._id, isBookmarked })
                      : toast.error('Please login to save listings')
                    }
                    className={`p-2 rounded-lg border transition-colors ${
                      isBookmarked
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary text-text-muted'
                    }`}
                    title={isBookmarked ? 'Remove from saved' : 'Save listing'}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: listing.name, url: window.location.href })}
                    className="p-2 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-1.5 mt-3 text-text-muted">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-sm">{listing.address}{listing.subLocation ? `, ${listing.subLocation}` : ''}, {listing.city}</span>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="card p-5">
                <h2 className="text-h2 mb-3">About</h2>
                <p className="text-body text-text-mid whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Dynamic Fields */}
            {listing.dynamicFields && Object.keys(listing.dynamicFields).length > 0 && (
              <div className="card p-5">
                <h2 className="text-h2 mb-4">Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(listing.dynamicFields).map(([key, val]) => (
                    <div key={key} className="bg-surface-gray rounded-lg p-3">
                      <p className="text-xs text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-sm font-medium text-text-dark mt-0.5">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timings */}
            {listing.timings?.length > 0 && (
              <div className="card p-5">
                <h2 className="text-h2 mb-4">Opening Hours</h2>
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const t = listing.timings.find((tm) => tm.day === day);
                    return (
                      <div key={day} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                        <span className="font-medium text-text-dark">{day}</span>
                        <span className={t?.isClosed ? 'text-error' : 'text-text-mid'}>
                          {t?.isClosed ? 'Closed' : t ? `${t.open} – ${t.close}` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-5">
              <h2 className="text-h2 mb-4">Reviews ({listing.reviewCount})</h2>
              {user && !reviewSubmitted && (
                <div className="mb-6 bg-surface-gray rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Write a Review</p>
                  <StarRating rating={reviewRating} size="lg" interactive onChange={setReviewRating} />
                  <textarea
                    className="input-field mt-3 min-h-[80px] resize-none"
                    placeholder="Share your experience..."
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                  />
                  <button onClick={submitReview} className="btn-primary mt-2">Submit Review</button>
                </div>
              )}
              {reviewSubmitted && (
                <div className="mb-6 flex items-start gap-3 bg-success/10 border border-success/30 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-success">Review submitted!</p>
                    <p className="text-xs text-text-muted mt-0.5">It will appear here once our team approves it.</p>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                        {r.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-dark">{r.user?.name}</p>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                    </div>
                    {r.title && <p className="text-sm font-semibold text-text-dark mb-1">{r.title}</p>}
                    <p className="text-sm text-text-mid">{r.body}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-text-muted text-sm">No reviews yet. Be the first!</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4 sticky top-20">
              {listing.phone?.length > 0 && (
                <a
                  href={`tel:${listing.phone[0]}`}
                  onClick={handlePhoneClick}
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3"
                >
                  <Phone className="w-5 h-5" />
                  {listing.phone[0]}
                </a>
              )}
              {listing.website && (
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center justify-center gap-2 w-full">
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              )}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMapOpen}
                className="btn-outline flex items-center justify-center gap-2 w-full"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>

              <Suspense fallback={<div className="skeleton h-48 rounded-xl" />}>
                <MapView listing={listing} />
              </Suspense>

              {listing.phone?.slice(1).map((p) => (
                <p key={p} className="text-sm text-text-muted text-center">{p}</p>
              ))}
              {listing.email && (
                <p className="text-xs text-text-muted text-center break-all">{listing.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="skeleton h-64 rounded-xl" />
          <SkeletonText lines={5} />
        </div>
        <div className="skeleton h-80 rounded-xl" />
      </div>
    </div>
  );
}
