import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, CheckCircle } from 'lucide-react';
import api from '../../utils/api';

export default function ListingCard({ listing }) {
  const {
    slug, name, city, subLocation, category, subCategory,
    rating, reviewCount, images, logo, phone, isVerified, address,
  } = listing;

  const handlePhoneClick = (e) => {
    e.preventDefault();
    api.post(`/listings/${listing._id}/track/phone`).catch(() => {});
    window.location.href = `tel:${phone[0]}`;
  };

  return (
    <div className="card overflow-hidden group">
      <Link to={`/listing/${slug}`} className="block">
        <div className="relative h-40 bg-primary-light overflow-hidden">
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={name} className="h-16 w-16 object-contain" />
              ) : (
                <span className="text-4xl font-bold text-primary/30">{name[0]}</span>
              )}
            </div>
          )}
          <span className="absolute top-2 left-2 bg-white text-primary text-xs font-semibold px-2 py-1 rounded-full capitalize">
            {subCategory || category}
          </span>
          {isVerified && (
            <span className="absolute top-2 right-2 badge-verified">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/listing/${slug}`} className="font-semibold text-text-dark hover:text-primary transition-colors line-clamp-1">
            {name}
          </Link>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
            <span className="text-xs text-text-muted">({reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-text-muted text-xs">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{subLocation ? `${subLocation}, ` : ''}{city}</span>
        </div>

        {address && (
          <p className="text-xs text-text-muted line-clamp-1">{address}</p>
        )}

        <div className="flex gap-2 pt-1">
          <Link to={`/listing/${slug}`} className="btn-primary text-xs py-2 flex-1 text-center">
            View Details
          </Link>
          {phone?.[0] && (
            <button
              onClick={handlePhoneClick}
              className="btn-outline text-xs py-2 px-3 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
