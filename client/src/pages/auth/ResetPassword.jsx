import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get('token');
  const email = sp.get('email');
  const isProvider = sp.get('t') === 'provider';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const reset = useMutation({
    mutationFn: () =>
      isProvider
        ? api.post('/providers/reset-password', { email, token, password })
        : api.post('/auth/reset-password', { email, token, password }),
    onSuccess: () => setDone(true),
    onError: (e) => toast.error(e.response?.data?.message || 'Reset failed. Link may have expired.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    reset.mutate();
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-error mb-4">Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="btn-primary">Request a new link</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Reset Password — Digital Patna</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-xl font-bold text-text-dark mb-2">Password reset!</h1>
              <p className="text-text-muted text-sm mb-6">
                Your password has been updated. You can now log in with your new password.
              </p>
              <button
                onClick={() => navigate(isProvider ? '/login?t=provider' : '/login', { replace: true })}
                className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                  isProvider ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-text-dark">Set new password</h1>
                <p className="text-text-muted text-sm mt-1">
                  {isProvider ? 'Reset your business account password' : 'Choose a strong password'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={reset.isPending}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-60 ${
                    isProvider ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {reset.isPending ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
