import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MapPin, Tag, Map, Building2, Layers } from 'lucide-react';
import { useCategories, useCities } from '../../hooks/useListings';
import useSearchStore from '../../store/searchStore';

function SelectField({ icon: Icon, label, value, onChange, options, disabled = false }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none z-10" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          'w-full h-12 rounded-xl border bg-white text-sm appearance-none transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          Icon ? 'pl-9 pr-8' : 'pl-3 pr-8',
          disabled
            ? 'border-border text-text-muted cursor-not-allowed bg-gray-50'
            : 'border-border text-text-dark cursor-pointer hover:border-primary/50',
        ].join(' ')}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
  );
}

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const { city, category, subCategory, subLocation, setSearch } = useSearchStore();
  const [selectedState, setSelectedState] = useState('');

  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();

  // All store values are display NAMES (e.g. "Healthcare", "Dehradun", "Patel Nagar").
  // Slugs are only used as React keys — never sent to the API.

  // Sync selectedState when city is already set (e.g. landing on /search?city=Dehradun)
  useEffect(() => {
    if (city && cities.length) {
      const cityObj = cities.find((c) => c.name === city || c.slug === city);
      if (cityObj) setSelectedState(cityObj.state);
    }
  }, [city, cities]);

  const states = useMemo(
    () => [...new Set(cities.map((c) => c.state))].sort().map((s) => ({ value: s, label: s })),
    [cities]
  );

  const citiesInState = useMemo(
    () => cities.filter((c) => c.state === selectedState),
    [cities, selectedState]
  );

  // Find objects by name (primary) so cascade works even when store holds names
  const selectedCategoryObj = categories.find((c) => c.name === category || c.slug === category);
  const subCategories = (selectedCategoryObj?.subCategories || []).filter((s) => s.isActive !== false);

  const selectedCityObj = cities.find((c) => c.name === city || c.slug === city);
  const areas = (selectedCityObj?.subLocations || []).filter((s) => s.isActive !== false);

  const handleStateChange = (val) => {
    setSelectedState(val);
    setSearch({ city: '', subLocation: '' });
  };

  const handleCityChange = (val) => {
    setSearch({ city: val, subLocation: '' });
    // Keep selectedState in sync when city is chosen
    const cityObj = cities.find((c) => c.name === val);
    if (cityObj) setSelectedState(cityObj.state);
  };

  // Build URL with display names so the server regex matches DB values directly
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city)        params.set('city', city);
    if (category)    params.set('category', category);
    if (subCategory) params.set('subCategory', subCategory);
    if (subLocation) params.set('subLocation', subLocation);
    navigate(`/search?${params.toString()}`);
  };

  /* ── Compact mode (Search/Explore page header) ──── */
  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {/* Category */}
        <select
          className="input-field appearance-none min-w-[130px]"
          value={category}
          onChange={(e) => setSearch({ category: e.target.value, subCategory: '' })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* State */}
        <select
          className="input-field appearance-none min-w-[130px]"
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* City — filtered by selected state */}
        <select
          className="input-field appearance-none min-w-[130px]"
          value={city}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">{selectedState ? 'Select City' : 'Pick state first'}</option>
          {citiesInState.map((c) => (
            <option key={c.slug} value={c.name}>{c.name}</option>
          ))}
        </select>

        {/* Area — filtered by selected city */}
        <select
          className="input-field appearance-none min-w-[130px]"
          value={subLocation}
          onChange={(e) => setSearch({ subLocation: e.target.value })}
          disabled={!city}
        >
          <option value="">{city ? 'Select Area' : 'Pick city first'}</option>
          {areas.map((a) => (
            <option key={a.slug} value={a.name}>{a.name}</option>
          ))}
        </select>

        <button onClick={handleSearch} className="btn-primary flex-shrink-0 px-5">
          <Search className="w-4 h-4" />
        </button>
      </div>
    );
  }

  /* ── Hero search bar ─────────────────────────────── */
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5">

      {/* Step indicators */}
      <div className="hidden md:flex items-center gap-1 mb-3 px-1">
        {[
          { n: 1, label: 'Category' },
          { n: 2, label: 'Sub-category' },
          { n: 3, label: 'State' },
          { n: 4, label: 'City' },
          { n: 5, label: 'Area' },
        ].map((step, i, arr) => (
          <div key={step.n} className="flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  (step.n === 1 && category) ||
                  (step.n === 2 && subCategory) ||
                  (step.n === 3 && selectedState) ||
                  (step.n === 4 && city) ||
                  (step.n === 5 && subLocation)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-muted',
                ].join(' ')}
              >
                {step.n}
              </span>
              <span className="text-xs text-text-muted font-medium whitespace-nowrap">{step.label}</span>
            </div>
            {i < arr.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Dropdowns — options always carry display names as values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Category */}
        <SelectField
          icon={Tag}
          label="Select Category"
          value={category}
          onChange={(val) => setSearch({ category: val, subCategory: '' })}
          options={categories.map((c) => ({ value: c.name, label: c.name }))}
        />

        {/* 2. Sub-category */}
        <SelectField
          icon={Layers}
          label={category ? 'Sub-category' : 'Pick category first'}
          value={subCategory}
          onChange={(val) => setSearch({ subCategory: val })}
          options={subCategories.map((s) => ({ value: s.name, label: s.name }))}
          disabled={!category}
        />

        {/* 3. State */}
        <SelectField
          icon={Map}
          label="Select State"
          value={selectedState}
          onChange={handleStateChange}
          options={states}
        />

        {/* 4. City */}
        <SelectField
          icon={Building2}
          label={selectedState ? 'Select City' : 'Pick state first'}
          value={city}
          onChange={handleCityChange}
          options={citiesInState.map((c) => ({ value: c.name, label: c.name }))}
          disabled={!selectedState}
        />

        {/* 5. Area */}
        <SelectField
          icon={MapPin}
          label={city ? 'Select Area' : 'Pick city first'}
          value={subLocation}
          onChange={(val) => setSearch({ subLocation: val })}
          options={areas.map((s) => ({ value: s.name, label: s.name }))}
          disabled={!city}
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3 text-base font-semibold rounded-xl"
      >
        <Search className="w-5 h-5" />
        Search Local Services
      </button>
    </div>
  );
}
