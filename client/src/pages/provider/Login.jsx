import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProviderLogin() {
  const { setProvider } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const login = useMutation({
    mutationFn: (d) => api.post('/providers/login', d),
    onSuccess: ({ data }) => {
      setProvider(data.data.provider, data.data.accessToken);
      navigate('/provider/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed'),
  });

  return (
    <>
      <Helmet><title>Provider Login — LocalFind</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
            <h1 className="text-h1">Provider Login</h1>
            <p className="text-text-muted text-sm">Manage your business listings</p>
          </div>
          <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
            <input {...register('email')} type="email" className="input-field" placeholder="Business email" />
            <input {...register('password')} type="password" className="input-field" placeholder="Password" />
            <button type="submit" disabled={login.isPending} className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-text-muted mt-4">
            New provider?{' '}
            <Link to="/provider/register" className="text-accent font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </>
  );
}
