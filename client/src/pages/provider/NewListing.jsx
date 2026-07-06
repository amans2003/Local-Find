import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useCategories, useCities } from '../../hooks/useListings';

// Parses coordinates from any standard Google Maps share URL
function parseGoogleMapsUrl(url) {
  if (!url) return null;
  // Most share links: /place/Name/@lat,lng,zoom or /@lat,lng,zoom
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };
  // ?q=lat,lng or &q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };
  // ll=lat,lng (older Maps links)
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return { lat: llMatch[1], lng: llMatch[2] };
  // !3dlat!4dlng in embed URLs
  const embedMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (embedMatch) return { lat: embedMatch[1], lng: embedMatch[2] };
  return null;
}

const STEPS = ['Basic Info', 'Contact & Location', 'Details', 'Images', 'Preview'];

export default function ProviderNewListing() {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [mapsStatus, setMapsStatus] = useState(null); // 'ok' | 'error' | null
  const [customFields, setCustomFields] = useState([]);

  const addField = () => setCustomFields((p) => [...p, { key: '', value: '' }]);
  const removeField = (i) => setCustomFields((p) => p.filter((_, j) => j !== i));
  const updateField = (i, prop, val) =>
    setCustomFields((p) => p.map((f, j) => (j === i ? { ...f, [prop]: val } : f)));
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();

  const { register, handleSubmit, watch, getValues, setValue, formState: { errors } } = useForm({
    defaultValues: { status: 'pending' },
  });

  // Category cascade
  const selectedCategory = watch('category');
  const subCategories = categories.find((c) => c.slug === selectedCategory)?.subCategories?.filter((s) => s.isActive !== false) || [];

  // State → City → Area cascade
  const states = useMemo(
    () => [...new Set(cities.map((c) => c.state))].sort(),
    [cities]
  );
  const citiesInState = useMemo(
    () => cities.filter((c) => c.state === selectedState),
    [cities, selectedState]
  );
  const selectedCity = watch('city');
  const areas = cities.find((c) => c.slug === selectedCity)?.subLocations?.filter((s) => s.isActive !== false) || [];

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setValue('city', '');
    setValue('subLocation', '');
  };

  const handleCityChange = (e) => {
    setValue('city', e.target.value);
    setValue('subLocation', '');
  };

  const handleMapsLink = (e) => {
    const url = e.target.value;
    setMapsLink(url);
    if (!url.trim()) { setMapsStatus(null); return; }
    const coords = parseGoogleMapsUrl(url);
    if (coords) {
      setValue('lat', coords.lat);
      setValue('lng', coords.lng);
      setMapsStatus('ok');
    } else {
      setMapsStatus('error');
    }
  };

  const uploadImages = async (files) => {
    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('images', f));
    try {
      const { data } = await api.post('/providers/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages((prev) => [...prev, ...data.data.urls]);
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const create = useMutation({
    mutationFn: (d) => api.post('/providers/listings', { ...d, images }),
    onSuccess: () => {
      toast.success('Listing submitted for review!');
      qc.invalidateQueries(['provider-listings']);
      navigate('/provider/listings');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create listing'),
  });

  const onSubmit = (data) => {
    // Resolve slugs → display names so DB is consistent regardless of who created the listing
    const catObj    = categories.find((c) => c.slug === data.category);
    const subCatObj = catObj?.subCategories?.find((s) => s.slug === data.subCategory);
    const cityObj   = cities.find((c) => c.slug === data.city);
    const areaObj   = cityObj?.subLocations?.find((s) => s.slug === data.subLocation);

    const dynamicFields = Object.fromEntries(
      customFields.filter((f) => f.key.trim()).map((f) => [f.key.trim(), f.value])
    );
    const payload = {
      ...data,
      category:    catObj?.name    || data.category,
      subCategory: subCatObj?.name || data.subCategory,
      city:        cityObj?.name   || data.city,
      subLocation: areaObj?.name   || data.subLocation,
      phone: data.phone ? [data.phone] : [],
      coordinates: {
        type: 'Point',
        coordinates: [parseFloat(data.lng || 0), parseFloat(data.lat || 0)],
      },
      dynamicFields,
    };
    create.mutate(payload);
  };

  return (
    <>
      <Helmet><title>New Listing — LocalFind</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-h1">Create New Listing</h1>

        {/* Step indicator */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-primary font-medium' : 'text-text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-6 space-y-4">
            {step === 0 && (
              <>
                <h2 className="text-h2">Basic Information</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Listing Name *</label>
                  <input {...register('name', { required: true })} className="input-field" placeholder="City Coaching Center" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select {...register('category', { required: true })} className="input-field">
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    {errors.category && <p className="text-xs text-error mt-1">Category is required</p>}
                  </div>

                  {/* Sub-category */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Sub-category *</label>
                    <select
                      {...register('subCategory', { required: true })}
                      className="input-field"
                      disabled={!selectedCategory}
                    >
                      <option value="">{selectedCategory ? 'Select sub-category' : 'Pick category first'}</option>
                      {subCategories.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                    </select>
                    {errors.subCategory && <p className="text-xs text-error mt-1">Sub-category is required</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      className="input-field"
                    >
                      <option value="">Select state</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* City — filtered by state */}
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <select
                      {...register('city', { required: true })}
                      className="input-field"
                      disabled={!selectedState}
                      onChange={handleCityChange}
                    >
                      <option value="">{selectedState ? 'Select city' : 'Pick state first'}</option>
                      {citiesInState.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    {errors.city && <p className="text-xs text-error mt-1">City is required</p>}
                  </div>

                  {/* Area — filtered by city */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Area / Sub-location</label>
                    <select
                      {...register('subLocation')}
                      className="input-field"
                      disabled={!selectedCity}
                    >
                      <option value="">{selectedCity ? 'Select area (optional)' : 'Pick city first'}</option>
                      {areas.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input {...register('address', { required: true })} className="input-field" placeholder="Plot 12, Sector 5, Dwarka" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea {...register('description')} className="input-field min-h-[100px] resize-none" placeholder="Tell customers about your business..." />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-h2">Contact & Location</h2>

                {/* Contact fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input {...register('phone')} type="tel" className="input-field" placeholder="98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="contact@business.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input {...register('website')} type="url" className="input-field" placeholder="https://yourbusiness.com" />
                  </div>
                </div>

                {/* Google Maps link */}
                <div className="border border-border rounded-xl p-4 space-y-3 bg-blue-50/40">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-text-dark">Pin Location from Google Maps</p>
                  </div>
                  <p className="text-xs text-text-muted">
                    Open Google Maps, find your business location, click <strong>Share</strong> → <strong>Copy link</strong>, then paste it below.
                  </p>

                  <div className="relative">
                    <input
                      type="url"
                      value={mapsLink}
                      onChange={handleMapsLink}
                      placeholder="https://maps.google.com/... or https://goo.gl/maps/..."
                      className={[
                        'input-field pr-10',
                        mapsStatus === 'ok' ? 'border-success focus:border-success' :
                        mapsStatus === 'error' ? 'border-error focus:border-error' : '',
                      ].join(' ')}
                    />
                    {mapsStatus === 'ok' && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                    )}
                    {mapsStatus === 'error' && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-error" />
                    )}
                  </div>

                  {mapsStatus === 'ok' && (
                    <p className="text-xs text-success font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Coordinates extracted automatically
                    </p>
                  )}
                  {mapsStatus === 'error' && (
                    <p className="text-xs text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Couldn't read coordinates from this link. Try a full Maps link (not a short goo.gl link).
                    </p>
                  )}

                  {/* Lat/lng — auto-filled but editable */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Latitude</label>
                      <input
                        {...register('lat')}
                        type="text"
                        className="input-field text-sm"
                        placeholder="e.g. 28.6139"
                        readOnly={mapsStatus === 'ok'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Longitude</label>
                      <input
                        {...register('lng')}
                        type="text"
                        className="input-field text-sm"
                        placeholder="e.g. 77.2090"
                        readOnly={mapsStatus === 'ok'}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">
                    Or enter coordinates manually. Find them by right-clicking your location on Google Maps.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-h2">Listing Details</h2>
                <p className="text-text-muted text-sm">Add any custom fields relevant to your business. Click + to add a field.</p>

                <div className="space-y-3">
                  {customFields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1.5">
                        <input
                          className="input-field"
                          placeholder="Field heading (e.g. Fees, Timing)"
                          value={f.key}
                          onChange={(e) => updateField(i, 'key', e.target.value)}
                        />
                        <input
                          className="input-field"
                          placeholder="Value"
                          value={f.value}
                          onChange={(e) => updateField(i, 'value', e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeField(i)}
                        className="mt-1 p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center gap-2 text-sm text-primary border border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 rounded-xl px-4 py-3 w-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>

                {customFields.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-1">No fields added yet.</p>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-h2">Images</h2>
                <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-text-muted" />
                  <span className="text-sm text-text-muted">Click to upload images (max 10, 5MB each)</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadImages(e.target.files)} />
                </label>
                {uploading && <p className="text-sm text-primary">Uploading...</p>}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-h2">Preview & Submit</h2>
                <div className="bg-surface-gray rounded-xl p-4 space-y-2 text-sm">
                  {Object.entries(getValues())
                    .filter(([k, v]) => v && !['lat', 'lng', 'status'].includes(k) && typeof v !== 'object')
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="font-medium text-text-dark capitalize w-32 flex-shrink-0">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-text-mid">{String(v).slice(0, 80)}</span>
                      </div>
                    ))}
                  {customFields.filter((f) => f.key).map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-medium text-text-dark capitalize w-32 flex-shrink-0">{f.key}:</span>
                      <span className="text-text-mid">{f.value}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <span className="font-medium text-text-dark w-32">Images:</span>
                    <span className="text-text-mid">{images.length} uploaded</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted">Your listing will be reviewed by our team before going live.</p>
              </>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn-outline">
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" disabled={create.isPending} className="btn-primary">
                {create.isPending ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
