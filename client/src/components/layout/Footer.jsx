import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-text-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-light" />
              <span className="text-lg font-bold">LocalFind</span>
            </div>
            <p className="text-sm text-gray-400">
              Discover local services, businesses, and institutions across India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/search" className="hover:text-white transition-colors">Search</Link></li>
              <li><Link to="/search?category=education" className="hover:text-white transition-colors">Education</Link></li>
              <li><Link to="/search?category=healthcare" className="hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link to="/search?category=legal" className="hover:text-white transition-colors">Legal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Business</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/provider/register" className="hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link to="/provider/login" className="hover:text-white transition-colors">Provider Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} LocalFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
