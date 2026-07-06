import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail, User, Briefcase, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('t') === 'provider' ? 'provider' : 'user');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const isProvider = tab === 'provider';

  const forgot = useMutation({
    mutationFn: () =>
      isProvider
        ? api.post('/providers/forgot-password', { email })
        : api.post('/auth/forgot-password', { email }),
    onSuccess: () => setSent(true),
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to send reset link'),
  });

  const switchTab = (t) => {
    setTab(t);
    setEmail('');
    setSent(false);
  };

  return (
    <>
      <Helmet><title>Forgot Password — Digital Patna</title></Helmet>
      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-xl font-bold text-text-dark mb-2">Check your email</h1>
              <p className="text-text-muted text-sm mb-1">We sent a password reset link to</p>
              <p className="text-sm font-semibold text-primary mb-6">{email}</p>
              <p className="text-xs text-text-muted mb-6">
                Click the link in the email to reset your password. The link expires in 1 hour.
              </p>
              <Link
                to={`/login${isProvider ? '?t=provider' : ''}`}
                className={`btn-primary w-full inline-block text-center py-3 ${isProvider ? 'bg-accent hover:bg-accent/90' : ''}`}
              >
                Back to Login
              </Link>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="block text-sm text-text-muted hover:text-text-dark mt-4 mx-auto"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-text-dark">Forgot password?</h1>
                <p className="text-text-muted text-sm mt-1">
                  Enter your email and we'll send a reset link.
                </p>
              </div>

              {/* Tab toggle */}
              <div className="flex bg-surface-gray rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => switchTab('user')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === 'user' ? 'bg-white shadow text-primary' : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  <User className="w-4 h-4" />
                  User
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('provider')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === 'provider' ? 'bg-white shadow text-accent' : 'text-text-muted hover:text-text-dark'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Provider
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    {isProvider ? 'Business Email' : 'Email address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      className="input-field pl-10"
                      placeholder={isProvider ? 'business@example.com' : 'you@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && email && forgot.mutate()}
                    />
                  </div>
                </div>

                <button
                  onClick={() => forgot.mutate()}
                  disabled={!email || forgot.isPending}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-60 ${
                    isProvider ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {forgot.isPending ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <p className="text-center mt-5 text-sm text-text-muted">
                Remember it?{' '}
                <Link
                  to={`/login${isProvider ? '?t=provider' : ''}`}
                  className={`font-medium hover:underline ${isProvider ? 'text-accent' : 'text-primary'}`}
                >
                  Back to Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
