import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  User, Phone, Mail, Calendar, Bookmark, Star,
  Shield, CheckCircle, LogOut, Camera,
} from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser, accessToken } = useAuthStore();
  const logout = useLogout();

  const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.get('/users/bookmarks').then((r) => r.data.data),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => api.get('/users/reviews').then((r) => r.data.data),
  });

  const update = useMutation({
    mutationFn: (d) => api.patch('/users/me', d),
    onSuccess: ({ data }) => {
      setUser(data.data, accessToken);
      toast.success('Profile updated');
    },
    onError: () => toast.error('Update failed'),
  });

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      <Helmet><title>Profile — Digital Patna</title></Helmet>

      <div className="p-4 sm:p-6 md:p-8 max-w-2xl space-y-4">

        {/* ── Hero card ──────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-2xl font-bold shadow-inner">
                {initials}
              </div>
            </div>

            {/* Name / email */}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold truncate">{user?.name}</h1>
              <p className="text-sm text-white/75 truncate mt-0.5">{user?.email}</p>
              {memberSince && (
                <p className="text-xs text-white/55 mt-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold leading-none">{bookmarks.length}</p>
              <p className="text-xs text-white/60 mt-1.5 flex items-center justify-center gap-1">
                <Bookmark className="w-3 h-3" /> Saved
              </p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-2xl font-bold leading-none">{reviews.length}</p>
              <p className="text-xs text-white/60 mt-1.5 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" /> Reviews
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold leading-none">
                {user?.isVerified ? '✓' : '—'}
              </p>
              <p className="text-xs text-white/60 mt-1.5 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Verified
              </p>
            </div>
          </div>
        </div>

        {/* ── Edit form ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-dark mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal Information
          </h2>

          <form onSubmit={handleSubmit((d) => update.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                {...register('name', { required: true })}
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  {...register('phone')}
                  type="tel"
                  className="input-field pl-9"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={update.isPending}
              className="btn-primary w-full py-2.5 text-sm font-semibold"
            >
              {update.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Account details ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-dark mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Account Details
          </h2>

          <div className="divide-y divide-border">
            {/* Email */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-dark">{user?.email}</span>
                {user?.isVerified && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </div>
            </div>

            {/* Member since */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <span className="text-sm font-medium text-text-dark">{memberSince || '—'}</span>
            </div>

            {/* Login method */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Shield className="w-4 h-4" />
                Login Method
              </div>
              <span className="text-sm font-medium text-text-dark">
                {user?.provider === 'google' ? 'Google' : 'Email & Password'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Mobile-only sign out ───────────────────── */}
        <button
          onClick={() => logout.mutate()}
          className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

      </div>
    </>
  );
}
