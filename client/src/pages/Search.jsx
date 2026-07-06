import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X, Star, CheckCircle } from 'lucide-react';
import ListingCard from '../components/listings/ListingCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useSearchListings, useCategories, useCities } from '../hooks/useListings';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const sp = (k, def = '') => searchParams.get(k) || def;
  const category    = sp('category');
  const subCategory = sp('subCategory');
  const city        = sp('city');
  const subLocation = sp('subLocation');
  const q           = sp('q');
  const sort        = sp('sort', 'rating');
  const page        = Number(sp('page', '1'));
  const minRating   = sp('minRating');
  const verified    = sp('verified');

  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();

  const states = useMemo(
    () => [...new Set(cities.map((c) => c.state))].sort(),
    [cities]
  );
  const citiesInState = useMemo(
    () => cities.filter((c) => c.state === selectedState),
    [cities, selectedState]
  );
  const selectedCityObj = cities.find((c) => c.name === city);
  const areas = (selectedCityObj?.subLocations || []).filter((a) => a.isActive !== false);

  const selectedCategoryObj = categories.find((c) => c.name === category);
  const subCategories = (selectedCategoryObj?.subCategories || []).filter((s) => s.isActive !== false);

  // Auto-fill state when city arrives from URL
  useEffect(() => {
    if (city && cities.length) {
      const obj = cities.find((c) => c.name === city);
      if (obj) setSelectedState(obj.state);
    }
  }, [city, cities]);

  // Update URL params and reset page
  const updateParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, String(v));
        else next.delete(k);
      });
      next.delete('page');
      return next;
    }, { replace: true });
  };

  const handleStateChange = (val) => {
    setSelectedState(val);
    updateParams({ city: '', subLocation: '' });
  };

  const handleCityChange = (val) => {
    updateParams({ city: val, subLocation: '' });
    const obj = cities.find((c) => c.name === val);
    if (obj) setSelectedState(obj.state);
  };

  const clearAll = () => {
    setSelectedState('');
    setSearchParams({ sort: 'rating' }, { replace: true });
  };

  const queryParams = {
    category, subCategory, city, subLocation, q, sort, page, limit: 12,
    ...(minRating && { minRating }),
    ...(verified  && { isVerified: 'true' }),
  };

  const { data, isLoading, isFetching } = useSearchListings(queryParams);
  const listings = data?.data || [];
  const pagination = data?.pagination;

  const activeFilters = [
    category    && { key: 'category',    label: category },
    subCategory && { key: 'subCategory', label: subCategory },
    city        && { key: 'city',        label: city },
    subLocation && { key: 'subLocation', label: subLocation },
    minRating   && { key: 'minRating',   label: `${minRating}★ & above` },
    verified    && { key: 'verified',    label: 'Verified only' },
  ].filter(Boolean);

  // Sidebar filter count shown on mobile button (location filters excluded — they're in the top bar)
  const sidebarFilterCount = [category, subCategory, minRating, verified].filter(Boolean).length;

  const RATING_OPTIONS = [
    { value: '',  label: 'All Ratings' },
    { value: '4', label: '4★ & above' },
    { value: '3', label: '3★ & above' },
  ];

  // Sidebar content — rendered in both desktop aside and mobile drawer
  const sidebarContent = (
    <div className="space-y-6">

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Category</p>
        <div className="space-y-0.5">
          <button
            onClick={() => updateParams({ category: '', subCategory: '' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !category ? 'bg-primary text-white font-medium' : 'text-text-mid hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateParams({ category: c.name, subCategory: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === c.name ? 'bg-primary text-white font-medium' : 'text-text-mid hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-category — only when a category is selected */}
      {subCategories.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Sub-category</p>
          <div className="space-y-0.5">
            <button
              onClick={() => updateParams({ subCategory: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !subCategory ? 'bg-primary/10 text-primary font-medium' : 'text-text-mid hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {subCategories.map((s) => (
              <button
                key={s.slug}
                onClick={() => updateParams({ subCategory: s.name })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  subCategory === s.name ? 'bg-primary/10 text-primary font-medium' : 'text-text-mid hover:bg-gray-100'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Rating</p>
        <div className="space-y-0.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParams({ minRating: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                minRating === opt.value
                  ? 'bg-amber-50 text-amber-700 font-medium'
                  : 'text-text-mid hover:bg-gray-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 flex-shrink-0 ${
                minRating === opt.value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
              }`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified toggle */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Trust</p>
        <button
          onClick={() => updateParams({ verified: verified ? '' : 'true' })}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
            verified
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border text-text-mid hover:border-primary/40'
          }`}
        >
          <CheckCircle className={`w-4 h-4 flex-shrink-0 ${verified ? 'text-primary' : 'text-gray-400'}`} />
          <span className="text-sm font-medium">Verified listings only</span>
        </button>
      </div>

      {/* Clear all */}
      {activeFilters.length > 0 && (
        <button
          onClick={clearAll}
          className="w-full text-sm text-red-500 hover:text-red-600 font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Explore — Digital Patna</title>
      </Helmet>

      {/* ── Sticky top bar ───────────────────────────────── */}
      <div className="bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* Filters row */}
          <div className="flex gap-2 flex-wrap items-center">

            {/* Text search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                key={q}
                type="text"
                placeholder="Search businesses..."
                defaultValue={q}
                onKeyDown={(e) => { if (e.key === 'Enter') updateParams({ q: e.target.value }); }}
                onBlur={(e) => { if (e.target.value !== q) updateParams({ q: e.target.value }); }}
                className="w-full pl-9 pr-3 h-10 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              />
            </div>

            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-xl border border-border text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-w-[130px]"
            >
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* City */}
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!selectedState}
              className={`h-10 pl-3 pr-8 rounded-xl border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-w-[130px] ${
                !selectedState ? 'border-border text-text-muted bg-gray-50 cursor-not-allowed' : 'border-border bg-white'
              }`}
            >
              <option value="">{selectedState ? 'All Cities' : 'Pick state first'}</option>
              {citiesInState.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
            </select>

            {/* Area */}
            <select
              value={subLocation}
              onChange={(e) => updateParams({ subLocation: e.target.value })}
              disabled={!city}
              className={`h-10 pl-3 pr-8 rounded-xl border text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary min-w-[130px] ${
                !city ? 'border-border text-text-muted bg-gray-50 cursor-not-allowed' : 'border-border bg-white'
              }`}
            >
              <option value="">{city ? 'All Areas' : 'Pick city first'}</option>
              {areas.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
            </select>

            {/* Mobile filter button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-xl border border-border text-sm font-medium text-text-mid hover:border-primary hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {sidebarFilterCount > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {sidebarFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2.5">
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => updateParams({ [f.key]: '', ...(f.key === 'category' ? { subCategory: '' } : {}) })}
                  className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors font-medium"
                >
                  {f.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-red-500 hover:text-red-600 px-1 py-1 font-medium underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Page body ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-[134px] bg-white rounded-2xl border border-border p-5 max-h-[calc(100vh-158px)] overflow-y-auto scrollbar-hide">
              {sidebarContent}
            </div>
          </aside>

          {/* Listings column */}
          <div className="flex-1 min-w-0">

            {/* Result count + sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-text-muted">
                {isLoading
                  ? 'Searching...'
                  : `${pagination?.total ?? 0} result${pagination?.total !== 1 ? 's' : ''} found`}
              </p>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="input-field w-auto text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
                <option value="name">A–Z</option>
              </select>
            </div>

            {/* Grid */}
            {isLoading || isFetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <h2 className="text-xl font-semibold text-text-dark mb-2">No listings found</h2>
                <p className="text-text-muted text-sm mb-5">Try broadening or clearing your filters</p>
                <button onClick={clearAll} className="btn-primary px-8">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSearchParams((prev) => {
                          const n = new URLSearchParams(prev);
                          n.set('page', String(p));
                          return n;
                        }, { replace: true })}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-primary text-white'
                            : 'border border-border hover:border-primary text-text-mid'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto lg:hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-text-dark">Filters</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-text-mid" />
                </button>
              </div>
              {sidebarContent}
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-primary w-full mt-6 py-3 text-sm font-semibold"
              >
                Show {pagination?.total != null ? `${pagination.total} ` : ''}Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
