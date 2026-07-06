import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Eye, EyeOff, User, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const userSchema = z.object({
  name: z.string().min(2, 'Name too short').max(60),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

const providerSchema = z.object({
  businessName: z.string().min(2, 'Business name too short').max(100),
  ownerName: z.string().min(2, 'Owner name too short').max(60),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  category: z.string().min(1, 'Select a category'),
  password: z.string().min(8, 'Min 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

const CATEGORIES = [
  'Education', 'Healthcare', 'Legal', 'Finance', 'Real Estate',
  'Restaurants', 'Retail', 'Services', 'Government', 'Religious',
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('t') === 'provider' ? 'provider' : 'user');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { user, provider, setUser, setProvider } = useAuthStore();

  if (user) return <Navigate to="/dashboard" replace />;
  if (provider) return <Navigate to="/provider/dashboard" replace />;

  const userForm = useForm({ resolver: zodResolver(userSchema) });
  const providerForm = useForm({ resolver: zodResolver(providerSchema) });

  const activeForm = tab === 'provider' ? providerForm : userForm;

  const switchTab = (t) => {
    setTab(t);
    userForm.reset();
    providerForm.reset();
  };

  const userRegister = useMutation({
    mutationFn: (d) => api.post('/auth/register', { name: d.name, email: d.email, password: d.password }),
    onSuccess: ({ data }) => {
      setUser(data.data.user, data.data.accessToken);
      toast.success('Welcome to Digital Patna!');
      navigate('/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Registration failed'),
  });

  const providerRegister = useMutation({
    mutationFn: (d) => api.post('/providers/register', {
      businessName: d.businessName,
      ownerName: d.ownerName,
      email: d.email,
      phone: d.phone,
      category: d.category.toLowerCase(),
      password: d.password,
    }),
    onSuccess: ({ data }) => {
      setProvider(data.data.provider, data.data.accessToken);
      toast.success('Business registered! Welcome to LocalFind.');
      navigate('/provider/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Registration failed'),
  });

  const isPending = userRegister.isPending || providerRegister.isPending;

  const onSubmit = (d) => {
    if (tab === 'provider') providerRegister.mutate(d);
    else userRegister.mutate(d);
  };

  return (
    <>
      <Helmet><title>Sign Up — LocalFind</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

          <div className="text-center mb-6">
            <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-h1">Create Account</h1>
            <p className="text-text-muted text-sm mt-1">Join LocalFind today</p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-surface-gray rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchTab('user')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'user'
                  ? 'bg-white shadow text-primary'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <User className="w-4 h-4" />
              User
            </button>
            <button
              type="button"
              onClick={() => switchTab('provider')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === 'provider'
                  ? 'bg-white shadow text-accent'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Service Provider
            </button>
          </div>

          {/* User form */}
          {tab === 'user' && (
            <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
                <input {...userForm.register('name')} type="text" className="input-field" placeholder="Your name" />
                {userForm.formState.errors.name && (
                  <p className="text-error text-xs mt-1">{userForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                <input {...userForm.register('email')} type="email" className="input-field" placeholder="you@example.com" />
                {userForm.formState.errors.email && (
                  <p className="text-error text-xs mt-1">{userForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                <div className="relative">
                  <input {...userForm.register('password')} type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {userForm.formState.errors.password && (
                  <p className="text-error text-xs mt-1">{userForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Confirm Password</label>
                <input {...userForm.register('confirm')} type="password" className="input-field" placeholder="••••••••" />
                {userForm.formState.errors.confirm && (
                  <p className="text-error text-xs mt-1">{userForm.formState.errors.confirm.message}</p>
                )}
              </div>
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3">
                {isPending ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Provider form */}
          {tab === 'provider' && (
            <form onSubmit={providerForm.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Business Name</label>
                  <input {...providerForm.register('businessName')} type="text" className="input-field" placeholder="City Coaching" />
                  {providerForm.formState.errors.businessName && (
                    <p className="text-error text-xs mt-1">{providerForm.formState.errors.businessName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Owner Name</label>
                  <input {...providerForm.register('ownerName')} type="text" className="input-field" placeholder="Your name" />
                  {providerForm.formState.errors.ownerName && (
                    <p className="text-error text-xs mt-1">{providerForm.formState.errors.ownerName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Business Email</label>
                <input {...providerForm.register('email')} type="email" className="input-field" placeholder="business@example.com" />
                {providerForm.formState.errors.email && (
                  <p className="text-error text-xs mt-1">{providerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Phone</label>
                  <input {...providerForm.register('phone')} type="tel" className="input-field" placeholder="9876543210" />
                  {providerForm.formState.errors.phone && (
                    <p className="text-error text-xs mt-1">{providerForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Category</label>
                  <select {...providerForm.register('category')} className="input-field">
                    <option value="">Select</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {providerForm.formState.errors.category && (
                    <p className="text-error text-xs mt-1">{providerForm.formState.errors.category.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
                <div className="relative">
                  <input {...providerForm.register('password')} type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {providerForm.formState.errors.password && (
                  <p className="text-error text-xs mt-1">{providerForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Confirm Password</label>
                <input {...providerForm.register('confirm')} type="password" className="input-field" placeholder="••••••••" />
                {providerForm.formState.errors.confirm && (
                  <p className="text-error text-xs mt-1">{providerForm.formState.errors.confirm.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                {isPending ? 'Registering...' : 'Register Business'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link
              to={`/login${tab === 'provider' ? '?t=provider' : ''}`}
              className={`font-medium hover:underline ${tab === 'provider' ? 'text-accent' : 'text-primary'}`}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
