import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const cls = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= Math.round(rating) ? 'text-accent fill-accent' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-accent' : ''}`}
          onClick={() => interactive && onChange?.(star)}
        />
      ))}
    </div>
  );
}
