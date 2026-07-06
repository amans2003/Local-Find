import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import CategoryCard from '../components/listings/CategoryCard';
import ListingCard from '../components/listings/ListingCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useCategories, useSearchListings } from '../hooks/useListings';

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur'];

export default function Home() {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: featuredData, isLoading: featLoading } = useSearchListings({ sort: 'rating', limit: 20 });
  const featured = (featuredData?.data || []).filter((l) => l.rating > 4).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>LocalFind — Discover Local Services Across India</title>
        <meta name="description" content="Find local services, hospitals, schools, restaurants and more across any city in India." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[#0D1F3C]">
          {/* Animated colour orbs */}
          <div className="hero-orb-1 absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-[#1B3A6B] blur-[90px]" />
          <div className="hero-orb-2 absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full bg-[#F26122] blur-[100px]" />
          <div className="hero-orb-3 absolute top-[40%] left-[55%] w-[220px] h-[220px] rounded-full bg-[#2451a3] blur-[80px]" />
          {/* Subtle dot grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            {/* Logo in hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <img src="/logo.png" alt="Digital Patna" className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-xl" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Discover Local Services<br className="hidden sm:block" />
              <span className="text-[#F26122]"> Across Patna</span>
            </h1>
            <p className="text-blue-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Hospitals, schools, lawyers, restaurants and more — all in your city, all verified.
            </p>

            <SearchBar />

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 text-blue-200 text-sm"
            >
              {[
                { num: '500+', label: 'Listings' },
                { num: '50+', label: 'Categories' },
                { num: '10k+', label: 'Users' },
              ].map(({ num, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-white">{num}</span>
                  <span className="text-blue-300">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Popular Cities */}
      <section className="bg-surface-gray border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-text-muted font-medium flex-shrink-0">Popular Cities:</span>
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                to={`/city/${city.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-1.5 rounded-full bg-white border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h1 text-text-dark">Browse by Category</h2>
          <Link to="/search" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {catLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="card p-5 flex flex-col items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded" />
                  <div className="skeleton h-4 w-20" />
                </div>
              ))
            : categories.slice(0, 10).map((cat) => <CategoryCard key={cat._id} category={cat} />)
          }
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-surface-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-h1 text-text-dark">Top Rated Listings</h2>
            </div>
            <Link to="/search?sort=rating" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((l) => <ListingCard key={l._id} listing={l} />)
            }
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0D1F3C] text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-[#F26122] blur-[80px] opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-h1 text-white font-bold mb-4">Own a Business in Patna?</h2>
          <p className="text-blue-200 mb-8 text-base sm:text-lg">List your business for free and get discovered by thousands of local customers.</p>
          <Link
            to="/provider/register"
            className="inline-block bg-[#F26122] hover:bg-[#d9541c] text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-colors shadow-lg shadow-orange-900/30"
          >
            List Your Business Free
          </Link>
        </div>
      </section>
    </>
  );
}
