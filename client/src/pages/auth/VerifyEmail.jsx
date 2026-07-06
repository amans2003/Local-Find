import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck, RefreshCw, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const email = searchParams.get('email') || '';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const otp = digits.join('');

  const verify = useMutation({
    mutationFn: () => api.post('/auth/verify-otp', { email, otp }),
    onSuccess: ({ data }) => {
      setUser(data.data.user, data.data.accessToken);
      toast.success('Email verified! Welcome to Digital Patna 🎉');
      navigate('/dashboard', { replace: true });
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || 'Invalid or expired OTP');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    },
  });

  const resend = useMutation({
    mutationFn: () => api.post('/auth/send-otp', { email }),
    onSuccess: () => {
      toast.success('New OTP sent to your email');
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to resend OTP'),
  });

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && otp.length === OTP_LENGTH) {
      verify.mutate();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return toast.error('Enter all 6 digits');
    verify.mutate();
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-text-muted mb-4">No email provided.</p>
          <Link to="/register" className="btn-primary">Go to Register</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Verify Email — Digital Patna</title></Helmet>

      <div className="min-h-screen bg-surface-gray flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-dark">Verify your email</h1>
            <p className="text-sm text-text-muted mt-2">We sent a 6-digit code to</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 6-box OTP input */}
            <div className="flex gap-2 sm:gap-3 justify-center mb-6" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  autoFocus={i === 0}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={[
                    'w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all',
                    d ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-dark',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.length !== OTP_LENGTH || verify.isPending}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
            >
              {verify.isPending ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center mt-5">
            {countdown > 0 ? (
              <p className="text-sm text-text-muted">
                Resend code in{' '}
                <span className="font-semibold text-text-dark tabular-nums">
                  0:{String(countdown).padStart(2, '0')}
                </span>
              </p>
            ) : (
              <button
                onClick={() => resend.mutate()}
                disabled={resend.isPending}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mx-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${resend.isPending ? 'animate-spin' : ''}`} />
                {resend.isPending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>

          <div className="text-center mt-6 pt-5 border-t border-border">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
