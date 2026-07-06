import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, MapPin, RefreshCw, Pencil, X, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ── Edit City Modal ─────────────────────────────────────────────── */
function EditCityModal({ city, onClose }) {
  const qc = useQueryClient();
  const [name, setName] = useState(city.name);
  const [state, setState] = useState(city.state);
  const [subLocations, setSubLocations] = useState(
    (city.subLocations || []).filter((s) => s.isActive !== false)
  );
  const [newArea, setNewArea] = useState('');

  const addArea = () => {
    const trimmed = newArea.trim();
    if (!trimmed) return;
    if (subLocations.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Area already exists');
      return;
    }
    setSubLocations((p) => [...p, { name: trimmed, slug: toSlug(trimmed), isActive: true }]);
    setNewArea('');
  };

  const removeArea = (slug) =>
    setSubLocations((p) => p.filter((s) => s.slug !== slug));

  const save = useMutation({
    mutationFn: () =>
      api.patch(`/admin/cities/${city._id}`, { name, state, subLocations }),
    onSuccess: () => {
      toast.success('City updated');
      qc.invalidateQueries({ queryKey: ['admin-cities'] });
      onClose();
    },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold text-text-dark flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Edit City
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-error transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">City Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="City name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">State / UT</label>
              <input
                className="input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          {/* Sub-locations */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-2">
              Areas / Sub-locations
              <span className="ml-1 text-primary">({subLocations.length})</span>
            </label>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
              {subLocations.map((s) => (
                <span
                  key={s.slug}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {s.name}
                  <button
                    type="button"
                    onClick={() => removeArea(s.slug)}
                    className="hover:text-error transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {subLocations.length === 0 && (
                <p className="text-xs text-text-muted italic">No areas added yet</p>
              )}
            </div>

            {/* Add area input */}
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Type area name and press Enter"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addArea(); } }}
              />
              <button
                type="button"
                onClick={addArea}
                disabled={!newArea.trim()}
                className="btn-primary px-3 flex items-center gap-1 text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="btn border border-border text-text-mid hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={!name.trim() || !state.trim() || save.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {save.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Category Modal ─────────────────────────────────────────── */
function EditCategoryModal({ category, onClose }) {
  const qc = useQueryClient();
  const [name, setName] = useState(category.name);
  const [subCategories, setSubCategories] = useState(
    (category.subCategories || []).filter((s) => s.isActive !== false)
  );
  const [newSub, setNewSub] = useState('');

  const addSub = () => {
    const trimmed = newSub.trim();
    if (!trimmed) return;
    if (subCategories.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Sub-category already exists');
      return;
    }
    setSubCategories((p) => [...p, { name: trimmed, slug: toSlug(trimmed), isActive: true }]);
    setNewSub('');
  };

  const removeSub = (slug) =>
    setSubCategories((p) => p.filter((s) => s.slug !== slug));

  const save = useMutation({
    mutationFn: () =>
      api.patch(`/admin/categories/${category._id}`, { name, subCategories }),
    onSuccess: () => {
      toast.success('Category updated');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      onClose();
    },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold text-text-dark flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Edit Category
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-error transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Category Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-2">
              Sub-categories
              <span className="ml-1 text-primary">({subCategories.length})</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
              {subCategories.map((s) => (
                <span
                  key={s.slug}
                  className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {s.name}
                  <button
                    type="button"
                    onClick={() => removeSub(s.slug)}
                    className="hover:text-error transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {subCategories.length === 0 && (
                <p className="text-xs text-text-muted italic">No sub-categories added yet</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Type sub-category name and press Enter"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } }}
              />
              <button
                type="button"
                onClick={addSub}
                disabled={!newSub.trim()}
                className="btn-primary px-3 flex items-center gap-1 text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="btn border border-border text-text-mid hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => save.mutate()}
            disabled={!name.trim() || save.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {save.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Taxonomy Page ──────────────────────────────────────────── */
export default function AdminTaxonomy() {
  const [tab, setTab] = useState('cities');
  const [form, setForm] = useState({ name: '', state: '' });
  const [editCity, setEditCity] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const qc = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: () => api.get('/cities').then((r) => r.data.data),
  });

  const grouped = cities.reduce((acc, c) => {
    if (!acc[c.state]) acc[c.state] = [];
    acc[c.state].push(c);
    return acc;
  }, {});

  const create = useMutation({
    mutationFn: (d) =>
      tab === 'categories' ? api.post('/admin/categories', d) : api.post('/admin/cities', d),
    onSuccess: () => {
      toast.success(`${tab === 'categories' ? 'Category' : 'City'} created`);
      setForm({ name: '', state: '' });
      qc.invalidateQueries({ queryKey: [tab === 'categories' ? 'admin-categories' : 'admin-cities'] });
    },
    onError: () => toast.error('Failed to create'),
  });

  const del = useMutation({
    mutationFn: (id) =>
      tab === 'categories'
        ? api.delete(`/admin/categories/${id}`)
        : api.patch(`/admin/cities/${id}`, { isActive: false }),
    onSuccess: () => {
      toast.success('Removed');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['admin-cities'] });
    },
  });

  const seedIndia = useMutation({
    mutationFn: (replace) => api.post('/admin/seed-india-locations', { replace }),
    onSuccess: ({ data }) => {
      const { added, skipped } = data.data;
      toast.success(`Added ${added} cities${skipped > 0 ? `, ${skipped} already existed` : ''}`);
      setShowReplaceConfirm(false);
      qc.invalidateQueries({ queryKey: ['admin-cities'] });
    },
    onError: () => toast.error('Seed failed'),
  });

  const stateCount = Object.keys(grouped).length;

  return (
    <div className="space-y-5">
      {editCity && <EditCityModal city={editCity} onClose={() => setEditCity(null)} />}
      {editCategory && <EditCategoryModal category={editCategory} onClose={() => setEditCategory(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-text-dark">Taxonomy</h1>

        {tab === 'cities' && (
          <div className="flex items-center gap-2">
            {!showReplaceConfirm ? (
              <button
                onClick={() => seedIndia.mutate(false)}
                disabled={seedIndia.isPending}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <MapPin className="w-4 h-4" />
                {seedIndia.isPending ? 'Seeding...' : 'Seed All India Locations'}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-error rounded-lg px-3 py-2">
                <p className="text-sm text-error font-medium">Replace all existing cities?</p>
                <button onClick={() => seedIndia.mutate(true)} className="btn bg-error text-white text-xs">
                  Yes, Replace
                </button>
                <button onClick={() => setShowReplaceConfirm(false)} className="btn border border-border text-xs">
                  Cancel
                </button>
              </div>
            )}
            {cities.length > 0 && !showReplaceConfirm && (
              <button
                onClick={() => setShowReplaceConfirm(true)}
                className="btn border border-border text-text-muted hover:border-error hover:text-error text-sm flex items-center gap-1.5"
                title="Delete all cities and re-seed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-seed
              </button>
            )}
          </div>
        )}
      </div>

      {tab === 'cities' && cities.length > 0 && (
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-dark">{cities.length}</span> cities across{' '}
          <span className="font-semibold text-text-dark">{stateCount}</span> states / UTs
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {['cities', 'categories'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-primary text-white'
                : 'border border-border text-text-mid hover:border-primary'
            }`}
          >
            {t} ({t === 'cities' ? cities.length : categories.length})
          </button>
        ))}
      </div>

      {/* Add form */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-text-dark mb-3">
          Add {tab === 'categories' ? 'Category' : 'City'}
        </h2>
        <div className="flex gap-3 flex-wrap">
          <input
            className="input flex-1 min-w-40"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          {tab === 'cities' && (
            <input
              className="input flex-1 min-w-40"
              placeholder="State / UT"
              value={form.state}
              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
            />
          )}
          <button
            onClick={() => create.mutate(form)}
            disabled={!form.name || create.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Cities grouped by state */}
      {tab === 'cities' && (
        <div className="space-y-4">
          {Object.keys(grouped).sort().map((state) => (
            <div key={state} className="card overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-border">
                <h3 className="text-sm font-semibold text-text-dark flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {state}
                  <span className="text-xs text-text-muted font-normal">
                    — {grouped[state].length} {grouped[state].length === 1 ? 'city' : 'cities'}
                  </span>
                </h3>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-border">
                  {grouped[state].map((city) => (
                    <tr key={city._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-text-dark text-sm w-48">
                        {city.name}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-muted">
                        {city.subLocations?.length || 0} areas
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-muted font-mono hidden sm:table-cell">
                        {city.slug}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditCity(city)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit city"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => del.mutate(city._id)}
                            className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                            title="Remove city"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {cities.length === 0 && (
            <div className="card p-12 text-center">
              <MapPin className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="font-medium text-text-dark mb-1">No cities yet</p>
              <p className="text-sm text-text-muted mb-4">
                Click "Seed All India Locations" to add all Indian cities at once
              </p>
            </div>
          )}
        </div>
      )}

      {/* Categories flat table */}
      {tab === 'categories' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border text-xs text-text-muted font-medium text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Sub-categories</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-text-dark text-sm">{cat.name}</td>
                  <td className="px-4 py-3 text-sm text-text-muted font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {cat.subCategories?.map((s) => s.name).join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditCategory(cat)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => del.mutate(cat._id)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-colors"
                        title="Remove category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                    No categories yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
