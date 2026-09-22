import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
import { Shield, User, Lock, Mail, Phone, CheckCircle2, ArrowRight, AlertCircle, Key } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
  onNavigate: (path: string) => void;
}

export function AuthPages({ initialMode = 'login', onNavigate }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { login, register, isAdmin, isManager } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // Wait for user state to populate then route
      setTimeout(() => {
        onNavigate('/account');
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name,
        email,
        phone,
        password,
        address,
      });
      onNavigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'manager' | 'guest') => {
    setError(null);
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@kanharesidency.com', 'Admin@Kanha2026');
        onNavigate('/admin');
      } else if (role === 'manager') {
        await login('manager@kanharesidency.com', 'Manager@Kanha2026');
        onNavigate('/admin');
      } else {
        await login('guest@kanharesidency.com', 'Guest@Kanha2026');
        onNavigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#FAF7F2] pt-32 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#141518] border border-[#332E27] p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <BrandLogo size="md" showTagline />
          <h2 className="font-serif text-2xl font-normal text-[#FAF7F2] mt-4">
            {mode === 'login' && 'Guest & Staff Portal'}
            {mode === 'register' && 'Create Your Guest Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-[#A3998C] mt-1">
            Access your reservations, invoices, and personalized stay privileges.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-[#1B1D24] border border-[#2D2822] space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880] text-center">
            Instant Demo Sign-In
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 rounded-lg bg-[#25221B] hover:bg-[#342E25] border border-[#C5A880]/40 text-[#E5C79E] text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('manager')}
              className="py-1.5 px-2 rounded-lg bg-[#1E2028] hover:bg-[#252834] border border-[#3A352F] text-[#FAF7F2] text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('guest')}
              className="py-1.5 px-2 rounded-lg bg-[#1E2028] hover:bg-[#252834] border border-[#3A352F] text-[#FAF7F2] text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Guest Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-900 text-xs text-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C5A880] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kanharesidency.com"
                  className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs uppercase tracking-wider text-[#A3998C]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#C5A880] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C5A880] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center text-xs text-[#A3998C] pt-2">
              New to Kanha Residency?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#C5A880] font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                City / Origin
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#B89758] text-[#121316] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>

            <div className="text-center text-xs text-[#A3998C] pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#C5A880] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C5A880] mx-auto" />
                <h3 className="font-serif text-xl text-[#FAF7F2]">Reset Link Sent</h3>
                <p className="text-xs text-[#A3998C]">
                  If an account exists for {email}, instructions to reset your access have been logged.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSubmitted(false);
                    setMode('login');
                  }}
                  className="text-xs text-[#C5A880] underline font-medium"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3998C] mb-1">
                    Enter Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. guest@kanharesidency.com"
                    className="w-full bg-[#1B1D23] border border-[#2D2822] rounded-xl px-3 py-2 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#C5A880] text-[#121316] font-bold text-xs uppercase tracking-wider hover:bg-[#E5C79E]"
                >
                  Send Recovery Link
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-[#A3998C] hover:text-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
