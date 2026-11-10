import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AqarFlowLogo } from './AqarFlowLogo';
import { 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import villaPhoto from '../assets/images/property_islamabad_villa_1794204424374.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('admin@aqarflow.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'forgot' | 'invite'>('login');
  const [forgotSent, setForgotSent] = useState(false);

  const [selectedSSOProvider, setSelectedSSOProvider] = useState<'google' | 'microsoft' | null>(null);
  const [showSSOAccountPicker, setShowSSOAccountPicker] = useState(false);

  // Google Accounts matching user's requested layout & identities
  const googleAccounts = [
    {
      name: 'Sai Vardhan Malla',
      email: 'mallasaiwardhan@gmail.com',
      avatarBg: 'bg-slate-700',
      initial: 'S',
      role: 'agency_admin' as const,
    },
    {
      name: 'Malla Sai Vardan',
      email: '24hu1a05d2@gmail.com',
      avatarBg: 'bg-sky-500',
      initial: 'M',
      role: 'agency_admin' as const,
    },
    {
      name: 'Sai Vardan Malla',
      email: 'saivardanmalla@gmail.com',
      avatarBg: 'bg-teal-700',
      initial: 'S',
      role: 'agent' as const,
    },
    {
      name: 'sai',
      email: 'saivardhanmalla8@gmail.com',
      avatarBg: 'bg-green-700',
      initial: 's',
      role: 'agent' as const,
    },
    {
      name: 'Malla Sai Vardhan',
      email: 'saivardhanmalla@gmail.com',
      avatarBg: 'bg-sky-500',
      initial: 'M',
      role: 'agency_admin' as const,
    },
    {
      name: 'Malla Sai Vardhan',
      email: 'saivardhanmalla5@gmail.com',
      avatarBg: 'bg-emerald-800',
      initial: 'M',
      role: 'agent' as const,
    },
  ];

  const microsoftAccounts = [
    {
      name: 'Sarah Ahmed',
      email: 'admin@aqarflow.com',
      org: 'AqarFlow VIRELEO Enterprise',
      role: 'agency_admin' as const,
    },
    {
      name: 'Bilal Khan',
      email: 'bilal@aqarflow.com',
      org: 'AqarFlow Agent Network',
      role: 'agent' as const,
    },
  ];

  if (!isOpen) return null;

  const handleSSOClick = (provider: 'google' | 'microsoft') => {
    setSelectedSSOProvider(provider);
    setShowSSOAccountPicker(true);
  };

  const handleSelectAccount = async (accountEmail: string, role: 'agency_admin' | 'agent') => {
    setSsoLoading(selectedSSOProvider);
    setError(null);
    try {
      await switchDemoRole(role);
      setShowSSOAccountPicker(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSsoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setForgotSent(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'agency_admin' | 'agent') => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT PANEL: Architectural Villa Banner & Brand Promise matching Panel 4 */}
        <div className="hidden md:flex md:w-5/12 relative flex-col justify-between p-8 bg-slate-950 text-white overflow-hidden">
          <img
            src={villaPhoto}
            alt="AqarFlow Architecture"
            className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <AqarFlowLogo size="sm" variant="dark" />
          </div>

          {/* Bottom Headline & Bullet Points matching screenshot Panel 4 */}
          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sign in to your account to continue managing your real estate enterprise.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Manage your properties with ease</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Track your leads in CRM pipeline</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Grow your real estate business</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Professional Sign In Form matching Panel 4 */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Form Title & Subtitle */}
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === 'forgot' ? 'Reset Password' : 'Sign In'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'forgot'
                  ? 'Enter your registered email address to receive reset instructions.'
                  : 'Enter your credentials to access your account'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-2">
                <div className="font-bold">Password Reset Dispatched</div>
                <p>We have sent a secure password reset link to <strong>{email}</strong>.</p>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setForgotSent(false); }}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Email Address */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password field with show/hide toggle */}
                {mode === 'login' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember me & Forgot Password */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-slate-600 font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                >
                  <span>{loading ? 'Authenticating...' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
                  >
                    Cancel and back to login
                  </button>
                )}
              </form>
            )}

            {/* SSO divider matching Panel 4 */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google and Microsoft SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={ssoLoading !== null}
                onClick={() => handleSSOClick('google')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-60 active:scale-98"
                title="Choose a Google Account to sign in"
              >
                {ssoLoading === 'google' ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{ssoLoading === 'google' ? 'Connecting...' : 'Google'}</span>
              </button>

              <button
                type="button"
                disabled={ssoLoading !== null}
                onClick={() => handleSSOClick('microsoft')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-60 active:scale-98"
                title="Choose a Microsoft Account to sign in"
              >
                {ssoLoading === 'microsoft' ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                )}
                <span>{ssoLoading === 'microsoft' ? 'Connecting...' : 'Microsoft'}</span>
              </button>
            </div>

            {/* Quick Demo Evaluation Roles */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  1-Click Role Access (Day 2 RBAC)
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">Ready to test</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('agency_admin')}
                  className="py-1.5 px-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('agent')}
                  className="py-1.5 px-2 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Agent Portal</span>
                </button>
              </div>
            </div>

            {/* Bottom Register notice */}
            <div className="text-center text-xs text-slate-500 pt-1">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleQuickDemo('agency_admin')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>

          </div>
        </div>

        {/* Authentic Google & Microsoft Account Selection Dialog (matching screenshot) */}
        {showSSOAccountPicker && (
          <div className="absolute inset-0 z-40 bg-white sm:rounded-3xl flex flex-col justify-between overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            
            {/* Top Google Header Bar */}
            <div className="w-full max-w-md mx-auto px-6 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowSSOAccountPicker(false)}
                  className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-xs font-semibold text-slate-800">
                    {selectedSSOProvider === 'google' ? 'Sign in - Google Accounts' : 'Sign in - Microsoft Accounts'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {selectedSSOProvider === 'google' ? 'accounts.google.com' : 'login.microsoftonline.com'}
                  </div>
                </div>
                <div className="w-5" />
              </div>

              {/* Google Brand Logo & Header */}
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-700">
                {selectedSSOProvider === 'google' ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                    <span>Sign in with Microsoft</span>
                  </>
                )}
              </div>

              {/* App Icon badge */}
              <div className="mt-4 flex items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
                      <path d="M8 5v14l11-7z" fill="url(#grad)" />
                      <defs>
                        <linearGradient id="grad" x1="8" y1="5" x2="19" y2="19">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="50%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#FBBF24" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title: Choose an account */}
              <div className="mt-5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Choose an account
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  to continue to <strong className="text-blue-600">AqarFlow VIRELEO</strong>
                </p>
              </div>

              {/* Accounts List matching screenshot exactly */}
              <div className="mt-6 divide-y divide-slate-100">
                {selectedSSOProvider === 'google' &&
                  googleAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAccount(acc.email, acc.role)}
                      className="w-full py-3.5 flex items-center gap-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Circle Initial Avatar with color */}
                      <div className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white font-semibold text-sm flex items-center justify-center shrink-0`}>
                        {acc.initial}
                      </div>

                      {/* Name and Email */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal truncate">
                          {acc.email}
                        </div>
                      </div>
                    </button>
                  ))}

                {selectedSSOProvider === 'microsoft' &&
                  microsoftAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAccount(acc.email, acc.role)}
                      className="w-full py-3.5 flex items-center gap-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center shrink-0">
                        {acc.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal truncate">
                          {acc.email}
                        </div>
                      </div>
                    </button>
                  ))}

                {/* "Use another account" row matching screenshot */}
                <button
                  type="button"
                  onClick={() => setShowSSOAccountPicker(false)}
                  className="w-full py-3.5 flex items-center gap-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-300 text-slate-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    Use another account
                  </div>
                </button>
              </div>

              {/* Terms & Privacy footer matching screenshot */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Before using this app, you can review AqarFlow's{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 font-medium hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 font-medium hover:underline">
                  Terms of Service
                </a>.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
