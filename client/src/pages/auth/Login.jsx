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

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
});

export default function Login() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('t') === 'provider' ? 'provider' : 'user');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { user, provider, setUser, setProvider } = useAuthStore();

  if (user) return <Navigate to="/dashboard" replace />;
  if (provider) return <Navigate to="/provider/dashboard" replace />;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const switchTab = (t) => { setTab(t); reset(); };

  const userLogin = useMutation({
    mutationFn: (d) => api.post('/auth/login', d),
    onSuccess: ({ data }) => {
      setUser(data.data.user, data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed'),
  });

  const providerLogin = useMutation({
    mutationFn: (d) => api.post('/providers/login', d),
    onSuccess: ({ data }) => {
      setProvider(data.data.provider, data.data.accessToken);
      toast.success(`Welcome back, ${data.data.provider.businessName}!`);
      navigate('/provider/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed'),
  });

  const isPending = userLogin.isPending || providerLogin.isPending;

  const onSubmit = (d) => {
    if (tab === 'provider') providerLogin.mutate(d);
    else userLogin.mutate(d);
  };

  return (
    <>
      <Helmet><title>Login — LocalFind</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

          <div className="text-center mb-6">
            <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-h1">Welcome back</h1>
            <p className="text-text-muted text-sm mt-1">Login to your LocalFind account</p>
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

          {tab === 'provider' && (
            <div className="mb-4 px-3 py-2 bg-accent/10 rounded-lg text-xs text-accent font-medium">
              Login to manage your business listings on LocalFind
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                {tab === 'provider' ? 'Business Email' : 'Email'}
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder={tab === 'provider' ? 'business@example.com' : 'you@example.com'}
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link
                to={tab === 'provider' ? '/forgot-password?t=provider' : '/forgot-password'}
                className={`text-sm hover:underline ${tab === 'provider' ? 'text-accent' : 'text-primary'}`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                tab === 'provider'
                  ? 'bg-accent hover:bg-accent/90'
                  : 'bg-primary hover:bg-primary/90'
              } disabled:opacity-60`}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to={`/register${tab === 'provider' ? '?t=provider' : ''}`}
              className={`font-medium hover:underline ${tab === 'provider' ? 'text-accent' : 'text-primary'}`}
            >
              {tab === 'provider' ? 'Register your business' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
