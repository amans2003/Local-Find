import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../App';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { token, login } = useAdminAuth();

  if (token) return <Navigate to="/" replace />;

  const loginMutation = useMutation({
    mutationFn: () => api.post('/auth/login', { email, password }),
    onSuccess: ({ data }) => {
      if (data.data.user?.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }
      login(data.data.accessToken);
      navigate('/');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Enter email and password');
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">Admin Login</h1>
          <p className="text-sm text-text-muted mt-1">LocalFind CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
            <input
              type="email"
              className="input"
              placeholder="admin@localfind.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="input pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full py-2.5"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-text-muted text-center">
          <p className="font-medium">Default credentials</p>
          <p>admin@localfind.in / Admin@1234!</p>
        </div>
      </div>
    </div>
  );
}
