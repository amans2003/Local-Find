import { MapPin } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <MapPin className="w-10 h-10 text-primary animate-bounce" />
        <p className="text-text-muted text-sm">Loading LocalFind...</p>
      </div>
    </div>
  );
}
