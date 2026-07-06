import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check, X, Search, Plus, XCircle, Clock, Eye, EyeOff,
  Edit2, Trash2, ShieldCheck, ShieldOff, MoreVertical, ChevronLeft, ChevronRight,
  Upload, MapPin, CheckCircle, AlertCircle,
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  active:   'bg-success/10 text-success border-success/20',
  pending:  'bg-warning/10 text-warning border-warning/20',
  rejected: 'bg-error/10 text-error border-error/20',
  draft:    'bg-gray-100 text-text-muted border-border',
};

function parseGoogleMapsUrl(url) {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return { lat: llMatch[1], lng: llMatch[2] };
  const embedMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (embedMatch) return { lat: embedMatch[1], lng: embedMatch[2] };
  return null;
}

const STEPS = ['Basic Info', 'Contact & Location', 'Details', 'Images', 'Preview'];

/* ── ActionMenu (per-row dropdown) ─────────────────────────────── */
function ActionMenu({ listing, onEdit, onDelete, onVisibility, onVerify, onApprove, onReject }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const item = (icon, label, onClick, color = '') => (
    <button
      onClick={() => { onClick(); setOpen(false); }}
      className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${color}`}
    >
      {icon}{label}
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded hover:bg-gray-100 text-text-muted transition-colors"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-30 py-1 overflow-hidden">
          {listing.status === 'pending' && (
            <>
              {item(<Check className="w-4 h-4 text-success" />, 'Approve', () => onApprove(listing), 'text-success')}
              {item(<X className="w-4 h-4 text-error" />, 'Reject…', () => onReject(listing), 'text-error')}
              <div className="h-px bg-border my-1" />
            </>
          )}
          {item(<Edit2 className="w-4 h-4" />, 'Edit listing', () => onEdit(listing))}
          {item(
            listing.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
            listing.isActive ? 'Hide from public' : 'Make visible',
            () => onVisibility(listing)
          )}
          {item(
            listing.isVerified ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />,
            listing.isVerified ? 'Remove verified badge' : 'Mark as verified',
            () => onVerify(listing)
          )}
          <div className="h-px bg-border my-1" />
          {item(<Trash2 className="w-4 h-4" />, 'Delete permanently', () => onDelete(listing), 'text-error hover:bg-error/5')}
        </div>
      )}
    </div>
  );
}

/* ── Shared 5-step Wizard Modal ─────────────────────────────────── */
function WizardModal({ title, initialForm, initialImages = [], initialCustomFields = [], opts, onClose, onSubmit, isPending, submitLabel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [mapsLink, setMapsLink] = useState('');
  const [mapsStatus, setMapsStatus] = useState(null);
  const [customFields, setCustomFields] = useState(initialCustomFields);

  const addField = () => setCustomFields((p) => [...p, { key: '', value: '' }]);
  const removeField = (i) => setCustomFields((p) => p.filter((_, j) => j !== i));
  const updateField = (i, prop, val) =>
    setCustomFields((p) => p.map((f, j) => (j === i ? { ...f, [prop]: val } : f)));

  const categories = opts?.categories || [];
  const cities = opts?.cities || [];

  // Sync state field when opts (cities) finish loading in edit mode
  useEffect(() => {
    if (initialForm.state && !form.state) {
      setForm((p) => ({ ...p, state: initialForm.state }));
    }
  }, [initialForm.state]);

  const states = useMemo(
    () => [...new Set(cities.map((c) => c.state))].filter(Boolean).sort(),
    [cities]
  );
  const citiesInState = useMemo(
    () => cities.filter((c) => c.state === form.state),
    [cities, form.state]
  );
  const selectedCityObj = cities.find((c) => c.name === form.city);
  const areas = selectedCityObj?.subLocations?.filter((s) => s.isActive !== false) || [];
  const selectedCat = categories.find((c) => c.name === form.category);
  const subCategories = selectedCat?.subCategories?.filter((s) => s.isActive !== false) || [];

  const field = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: val }));
  };
  const handleCat = (e) => setForm((p) => ({ ...p, category: e.target.value, subCategory: '' }));
  const handleState = (e) => setForm((p) => ({ ...p, state: e.target.value, city: '', subLocation: '' }));
  const handleCity = (e) => setForm((p) => ({ ...p, city: e.target.value, subLocation: '' }));

  const handleMapsLink = (e) => {
    const url = e.target.value;
    setMapsLink(url);
    if (!url.trim()) { setMapsStatus(null); return; }
    const coords = parseGoogleMapsUrl(url);
    if (coords) {
      setForm((p) => ({ ...p, lat: coords.lat, lng: coords.lng }));
      setMapsStatus('ok');
    } else {
      setMapsStatus('error');
    }
  };

  const uploadImages = async (files) => {
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      const { data } = await api.post('/admin/listings/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((p) => [...p, ...data.data.urls]);
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name?.trim()) return toast.error('Business name is required');
    if (!form.category) return toast.error('Category is required');
    if (!form.city) return toast.error('City is required');
    if (!form.address?.trim()) return toast.error('Address is required');

    const { state: _s, lat, lng, ...rest } = form;
    const dynamicFields = Object.fromEntries(
      customFields.filter((f) => f.key.trim()).map((f) => [f.key.trim(), f.value])
    );
    const payload = {
      ...rest,
      phone: rest.phone ? [rest.phone] : [],
      coordinates: lat && lng
        ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
        : undefined,
      dynamicFields,
      images,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[94vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <h2 className="text-base font-bold text-text-dark">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-error transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-5 pt-4 pb-2 flex-shrink-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1 min-w-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block truncate ${i === step ? 'text-primary font-medium' : 'text-text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">

          {/* ─── Step 0: Basic Info ─── */}
          {step === 0 && (
            <>
              <h3 className="font-semibold text-text-dark">Basic Information</h3>
              <div>
                <label className="label">Business Name <span className="text-error">*</span></label>
                <input className="input" placeholder="e.g. Sharma Electronics" value={form.name} onChange={field('name')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category <span className="text-error">*</span></label>
                  <select className="input" value={form.category} onChange={handleCat}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Sub-Category</label>
                  <select className="input" value={form.subCategory} onChange={field('subCategory')} disabled={!form.category}>
                    <option value="">{form.category ? 'Select sub-category' : 'Pick category first'}</option>
                    {subCategories.map((s) => <option key={s._id || s.slug} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">State <span className="text-error">*</span></label>
                  <select className="input" value={form.state || ''} onChange={handleState}>
                    <option value="">Select state</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">City <span className="text-error">*</span></label>
                  <select className="input" value={form.city || ''} onChange={handleCity} disabled={!form.state}>
                    <option value="">{form.state ? 'Select city' : 'Pick state first'}</option>
                    {citiesInState.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Area / Sub-location</label>
                  <select className="input" value={form.subLocation || ''} onChange={field('subLocation')} disabled={!form.city}>
                    <option value="">{form.city ? 'Select area (optional)' : 'Pick city first'}</option>
                    {areas.map((a) => <option key={a._id || a.slug} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Full Address <span className="text-error">*</span></label>
                <input className="input" placeholder="Shop no., Street, Locality" value={form.address} onChange={field('address')} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="Brief description of the business..." value={form.description} onChange={field('description')} />
              </div>
            </>
          )}

          {/* ─── Step 1: Contact & Location ─── */}
          {step === 1 && (
            <>
              <h3 className="font-semibold text-text-dark">Contact & Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input className="input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={field('phone')} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" placeholder="contact@business.com" value={form.email} onChange={field('email')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Website</label>
                  <input className="input" type="url" placeholder="https://example.com" value={form.website} onChange={field('website')} />
                </div>
              </div>

              {/* Google Maps link */}
              <div className="border border-border rounded-xl p-4 space-y-3 bg-blue-50/40">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-text-dark">Pin Location from Google Maps</p>
                </div>
                <p className="text-xs text-text-muted">
                  Open Google Maps, find the business, click <strong>Share</strong> → <strong>Copy link</strong>, paste below.
                </p>
                <div className="relative">
                  <input
                    type="url"
                    value={mapsLink}
                    onChange={handleMapsLink}
                    placeholder="https://maps.google.com/... or https://goo.gl/maps/..."
                    className={[
                      'input pr-10',
                      mapsStatus === 'ok' ? 'border-success focus:border-success' :
                      mapsStatus === 'error' ? 'border-error focus:border-error' : '',
                    ].join(' ')}
                  />
                  {mapsStatus === 'ok' && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />}
                  {mapsStatus === 'error' && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-error" />}
                </div>
                {mapsStatus === 'ok' && (
                  <p className="text-xs text-success font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Coordinates extracted automatically
                  </p>
                )}
                {mapsStatus === 'error' && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Couldn't read coordinates. Try a full Maps link (not a short goo.gl link).
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Latitude</label>
                    <input
                      className="input text-sm"
                      placeholder="e.g. 28.6139"
                      value={form.lat || ''}
                      onChange={field('lat')}
                      readOnly={mapsStatus === 'ok'}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Longitude</label>
                    <input
                      className="input text-sm"
                      placeholder="e.g. 77.2090"
                      value={form.lng || ''}
                      onChange={field('lng')}
                      readOnly={mapsStatus === 'ok'}
                    />
                  </div>
                </div>
                <p className="text-xs text-text-muted">Or enter coordinates manually by right-clicking on Google Maps.</p>
              </div>
            </>
          )}

          {/* ─── Step 2: Custom Details ─── */}
          {step === 2 && (
            <>
              <h3 className="font-semibold text-text-dark">Listing Details</h3>
              <p className="text-sm text-text-muted">Add any custom fields relevant to this business. Click + to add a field.</p>

              <div className="space-y-3">
                {customFields.map((f, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        className="input mb-1.5"
                        placeholder="Field heading (e.g. Fees, Timing)"
                        value={f.key}
                        onChange={(e) => updateField(i, 'key', e.target.value)}
                      />
                      <input
                        className="input"
                        placeholder="Value"
                        value={f.value}
                        onChange={(e) => updateField(i, 'value', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="mt-1 p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors flex-shrink-0"
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
                <p className="text-xs text-text-muted text-center py-2">No fields added yet.</p>
              )}
            </>
          )}

          {/* ─── Step 3: Images ─── */}
          {step === 3 && (
            <>
              <h3 className="font-semibold text-text-dark">Images</h3>
              <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-text-muted" />
                <span className="text-sm text-text-muted">Click to upload images (max 10, 5MB each)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadImages(e.target.files)}
                />
              </label>
              {uploading && <p className="text-sm text-primary animate-pulse">Uploading...</p>}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length === 0 && !uploading && (
                <p className="text-xs text-text-muted text-center">No images yet — optional but recommended.</p>
              )}
            </>
          )}

          {/* ─── Step 4: Preview & Admin Settings ─── */}
          {step === 4 && (
            <>
              <h3 className="font-semibold text-text-dark">Preview & Admin Settings</h3>

              {/* Summary */}
              <div className="bg-gray-50 border border-border rounded-xl p-4 space-y-2 text-sm">
                {[
                  ['Name', form.name],
                  ['Category', form.category],
                  ['Sub-category', form.subCategory],
                  ['City', form.city],
                  ['Area', form.subLocation],
                  ['Address', form.address],
                  ['Phone', form.phone],
                  ['Email', form.email],
                  ['Website', form.website],
                  ['Description', form.description?.slice(0, 80)],
                  ['Lat / Lng', form.lat && form.lng ? `${form.lat}, ${form.lng}` : null],
                  ['Images', `${images.length} uploaded`],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="font-medium text-text-dark w-28 flex-shrink-0">{k}:</span>
                    <span className="text-text-mid">{v}</span>
                  </div>
                ))}
                {customFields.filter((f) => f.key).map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-medium text-text-dark w-28 flex-shrink-0 capitalize">{f.key}:</span>
                    <span className="text-text-mid">{f.value}</span>
                  </div>
                ))}
              </div>

              {/* Admin-only settings */}
              <div className="border border-border rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-text-dark">Admin Settings</p>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={field('status')}>
                    <option value="active">Active (Live)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={field('isActive')} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium text-text-dark">Visible to public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isVerified} onChange={field('isVerified')} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium text-text-dark">Verified badge</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-5 border-t border-border flex-shrink-0">
          <button type="button" onClick={onClose} className="btn border border-border text-text-mid hover:bg-gray-50">
            Cancel
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn border border-border text-text-mid hover:bg-gray-50">
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isPending} className="btn-primary">
                {isPending ? 'Saving...' : submitLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Listing Modal ──────────────────────────────────────────── */
function EditModal({ listing, opts, onClose, onSaved }) {
  const cities = opts?.cities || [];

  const initState = useMemo(() => {
    const cityObj = cities.find((c) => c.name === listing.city);
    return cityObj?.state || '';
  }, [cities, listing.city]);

  const [lngVal, latVal] = listing.coordinates?.coordinates || ['', ''];

  const save = useMutation({
    mutationFn: (body) => api.patch(`/admin/listings/${listing._id}`, body),
    onSuccess: () => { toast.success('Listing updated'); onSaved(); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Update failed'),
  });

  return (
    <WizardModal
      title="Edit Listing"
      initialForm={{
        name: listing.name || '',
        category: listing.category || '',
        subCategory: listing.subCategory || '',
        state: initState,
        city: listing.city || '',
        subLocation: listing.subLocation || '',
        address: listing.address || '',
        description: listing.description || '',
        phone: listing.phone?.[0] || '',
        email: listing.email || '',
        website: listing.website || '',
        lat: String(latVal || ''),
        lng: String(lngVal || ''),
        status: listing.status || 'active',
        isActive: listing.isActive ?? true,
        isVerified: listing.isVerified ?? false,
      }}
      initialImages={listing.images || []}
      initialCustomFields={Object.entries(listing.dynamicFields || {}).map(([k, v]) => ({ key: k, value: String(v) }))}
      opts={opts}
      onClose={onClose}
      onSubmit={save.mutate}
      isPending={save.isPending}
      submitLabel="Save Changes"
    />
  );
}

/* ── Create Listing Modal ───────────────────────────────────────── */
function CreateModal({ opts, onClose, onCreated }) {
  const create = useMutation({
    mutationFn: (body) => api.post('/admin/listings', body),
    onSuccess: () => { toast.success('Listing created'); onCreated(); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create listing'),
  });

  return (
    <WizardModal
      title="Add New Listing"
      initialForm={{
        name: '', category: '', subCategory: '', state: '', city: '', subLocation: '',
        address: '', description: '', phone: '', email: '', website: '',
        lat: '', lng: '',
        status: 'active', isActive: true, isVerified: false,
      }}
      initialImages={[]}
      initialCustomFields={[]}
      opts={opts}
      onClose={onClose}
      onSubmit={create.mutate}
      isPending={create.isPending}
      submitLabel="Create Listing"
    />
  );
}

/* ── Reject Reason Modal ────────────────────────────────────────── */
function RejectModal({ listing, onClose, onConfirm, isPending }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold text-text-dark flex items-center gap-2">
            <X className="w-4 h-4 text-error" /> Reject Listing
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-error">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-text-muted">
            Rejecting <span className="font-semibold text-text-dark">"{listing.name}"</span>. The provider will be notified.
          </p>
          <textarea
            className="input resize-none w-full"
            rows={3}
            placeholder="e.g. Incomplete info, wrong category, spam…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="btn border border-border text-text-mid hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || isPending}
            className="btn bg-error text-white hover:bg-error/90 disabled:opacity-50"
          >
            {isPending ? 'Rejecting...' : 'Reject Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ───────────────────────────────────────── */
function DeleteModal({ listing, onClose, onConfirm, isPending }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6 text-error" />
          </div>
          <h2 className="text-base font-bold text-text-dark">Delete Listing?</h2>
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text-dark">"{listing.name}"</span> will be permanently deleted. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="btn border border-border text-text-mid hover:bg-gray-50 flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="btn bg-error text-white hover:bg-error/90 disabled:opacity-50 flex-1"
          >
            {isPending ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Listings Page ─────────────────────────────────────────── */
export default function AdminListings() {
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const qc = useQueryClient();

  const { data: opts } = useQuery({
    queryKey: ['admin-form-options'],
    queryFn: () => api.get('/admin/listings/form-options').then((r) => r.data.data),
    staleTime: Infinity,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings', { status, q, page }],
    queryFn: () => api.get('/admin/listings', { params: { status, q, page, limit: 20 } }).then((r) => r.data),
    staleTime: 0,
  });

  const { data: pendingData } = useQuery({
    queryKey: ['admin-listings-pending-count'],
    queryFn: () => api.get('/admin/listings', { params: { status: 'pending', limit: 1 } }).then((r) => r.data),
    refetchInterval: 30000,
  });
  const pendingCount = pendingData?.pagination?.total || 0;

  const listings = data?.data || [];
  const pagination = data?.pagination;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-listings'] });
    qc.invalidateQueries({ queryKey: ['admin-listings-pending-count'] });
    setSelected([]);
  };

  const approveMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/listings/${id}/approve`),
    onSuccess: () => { toast.success('Listing approved — now live!'); invalidate(); },
    onError: () => toast.error('Approve failed'),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }) => api.patch(`/admin/listings/${id}/reject`, { reason }),
    onSuccess: () => { toast.success('Listing rejected'); setRejectTarget(null); invalidate(); },
    onError: () => toast.error('Reject failed'),
  });

  const visibilityMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/listings/${id}/visibility`),
    onSuccess: (res) => { toast.success(res.data.message); invalidate(); },
    onError: () => toast.error('Action failed'),
  });

  const verifyMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/listings/${id}/verified`),
    onSuccess: (res) => { toast.success(res.data.message); invalidate(); },
    onError: () => toast.error('Action failed'),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/listings/${id}`),
    onSuccess: () => { toast.success('Listing deleted'); setDeleteTarget(null); invalidate(); },
    onError: () => toast.error('Delete failed'),
  });

  const bulkMut = useMutation({
    mutationFn: (body) => api.post('/admin/listings/bulk', body),
    onSuccess: () => { toast.success('Bulk action applied'); invalidate(); },
    onError: () => toast.error('Bulk action failed'),
  });

  const handleTabChange = (val) => { setStatus(val); setPage(1); setSelected([]); };
  const toggleSelect = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="space-y-5">
      {/* Modals */}
      {showCreate && (
        <CreateModal opts={opts} onClose={() => setShowCreate(false)} onCreated={invalidate} />
      )}
      {editTarget && (
        <EditModal listing={editTarget} opts={opts} onClose={() => setEditTarget(null)} onSaved={invalidate} />
      )}
      {rejectTarget && (
        <RejectModal
          listing={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => rejectMut.mutate({ id: rejectTarget._id, reason })}
          isPending={rejectMut.isPending}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          listing={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteMut.mutate(deleteTarget._id)}
          isPending={deleteMut.isPending}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Listings</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-warning font-medium mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pendingCount} listing{pendingCount > 1 ? 's' : ''} awaiting review
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.length > 0 && (
            <>
              <button
                onClick={() => bulkMut.mutate({ ids: selected, action: 'approve' })}
                className="btn bg-success text-white hover:bg-success/90 text-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Approve {selected.length}
              </button>
              <button
                onClick={() => bulkMut.mutate({ ids: selected, action: 'reject' })}
                className="btn bg-error text-white hover:bg-error/90 text-xs flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Reject {selected.length}
              </button>
              <button
                onClick={() => bulkMut.mutate({ ids: selected, action: 'delete' })}
                className="btn bg-gray-700 text-white hover:bg-gray-800 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete {selected.length}
              </button>
            </>
          )}
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { value: 'pending', label: 'Pending', count: pendingCount },
          { value: 'active', label: 'Active' },
          { value: 'rejected', label: 'Rejected' },
          { value: '', label: 'All' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
              status === tab.value ? 'bg-white text-text-dark shadow-sm' : 'text-text-muted hover:text-text-dark',
            ].join(' ')}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-warning text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          className="input pl-9"
          placeholder="Search listings…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-text-muted text-sm">Loading…</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border text-xs text-text-muted font-medium text-left">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    onChange={(e) => setSelected(e.target.checked ? listings.map((l) => l._id) : [])}
                    checked={selected.length === listings.length && listings.length > 0}
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 hidden lg:table-cell">City</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((l) => (
                <tr
                  key={l._id}
                  className={`transition-colors ${
                    l.status === 'pending' ? 'bg-warning/5 hover:bg-warning/8' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(l._id)} onChange={() => toggleSelect(l._id)} />
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="font-medium text-text-dark text-sm truncate">{l.name}</p>
                    {l.status === 'rejected' && l.rejectionReason && (
                      <p className="text-xs text-error mt-0.5 truncate">↳ {l.rejectionReason}</p>
                    )}
                    {!l.isActive && l.status === 'active' && (
                      <p className="text-xs text-text-muted mt-0.5 flex items-center gap-0.5">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden md:table-cell capitalize">
                    {l.subCategory || l.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell capitalize">{l.city}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_BADGE[l.status] || ''}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {l.isVerified && (
                        <span title="Verified" className="text-primary">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                      {!l.isActive && (
                        <span title="Hidden from public" className="text-text-muted">
                          <EyeOff className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {l.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveMut.mutate(l._id)}
                            disabled={approveMut.isPending}
                            className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRejectTarget(l)}
                            className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <ActionMenu
                        listing={l}
                        onEdit={setEditTarget}
                        onDelete={setDeleteTarget}
                        onVisibility={(lx) => visibilityMut.mutate(lx._id)}
                        onVerify={(lx) => verifyMut.mutate(lx._id)}
                        onApprove={(lx) => approveMut.mutate(lx._id)}
                        onReject={setRejectTarget}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-text-muted text-sm">
                    {status === 'pending' ? '✅ No pending listings — all clear!' : 'No listings found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded border border-border disabled:opacity-40 hover:border-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                p === page ? 'bg-primary text-white' : 'border border-border hover:border-primary'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="p-1.5 rounded border border-border disabled:opacity-40 hover:border-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
