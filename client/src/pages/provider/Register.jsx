import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Education', 'Healthcare', 'Legal', 'Finance', 'Real Estate', 'Restaurants', 'Retail', 'Services', 'Government', 'Religious'];

export default function ProviderRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const reg = useMutation({
    mutationFn: (d) => api.post('/providers/register', d),
    onSuccess: (_, vars) => {
      toast.success('Registered! Verify your phone to continue.');
      navigate(`/provider/verify-phone?phone=${encodeURIComponent(vars.phone)}`);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Registration failed'),
  });

  return (
    <>
      <Helmet><title>Provider Registration — LocalFind</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <MapPin className="w-10 h-10 text-accent mx-auto mb-3" />
            <h1 className="text-h1">List Your Business</h1>
            <p className="text-text-muted text-sm">Join thousands of businesses on LocalFind</p>
          </div>
          <form onSubmit={handleSubmit((d) => reg.mutate(d))} className="space-y-4">
            {[
              { name: 'businessName', label: 'Business Name', placeholder: 'City Coaching Center' },
              { name: 'ownerName', label: 'Owner Name', placeholder: 'Aman Singh' },
              { name: 'email', label: 'Business Email', placeholder: 'business@example.com', type: 'email' },
              { name: 'phone', label: 'Phone (for OTP)', placeholder: '98765 43210', type: 'tel' },
              { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
            ].map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-text-dark mb-1">{label}</label>
                <input {...register(name, { required: true })} type={type} className="input-field" placeholder={placeholder} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Category</label>
              <select {...register('category', { required: true })} className="input-field">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={reg.isPending} className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors">
              {reg.isPending ? 'Registering...' : 'Register Business'}
            </button>
          </form>
          <p className="text-center text-sm text-text-muted mt-4">
            Already registered?{' '}
            <Link to="/provider/login" className="text-accent font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
