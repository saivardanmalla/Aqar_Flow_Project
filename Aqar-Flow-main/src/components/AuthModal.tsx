import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AqarFlowLogo } from './AqarFlowLogo';
import { api } from '../lib/api';
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
  UserCheck,
  Building,
  Phone,
  User
} from 'lucide-react';
import villaPhoto from '../assets/images/property_islamabad_villa_1794204424374.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, loginWithGoogle, switchDemoRole } = useAuth();
  
  // Tab Mode: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login states
  const [email, setEmail] = useState('admin@aqarflow.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration states
  const [regFullName, setRegFullName] = useState('');
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<'google' | 'microsoft' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSSOProvider, setSelectedSSOProvider] = useState<'google' | 'microsoft' | null>(null);
  const [showSSOAccountPicker, setShowSSOAccountPicker] = useState(false);

  // Google Accounts matching prompt
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

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength(regPassword);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  if (!isOpen) return null;

  // Handle standard login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        full_name: regFullName,
        agency_name: regAgencyName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch password reset request.');
    } finally {
      setLoading(false);
    }
  };

  // Google SSO trigger
  const handleGoogleClick = () => {
    setSelectedSSOProvider('google');
    setShowSSOAccountPicker(true);
  };

  // Account selected from Google Account Picker
  const handleSelectAccount = async (accountEmail: string, role: 'agency_admin' | 'agent') => {
    setSsoLoading('google');
    setError(null);
    try {
      await loginWithGoogle(accountEmail);
      setShowSSOAccountPicker(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an issue.');
    } finally {
      setSsoLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT SECTION: Brand Hero & Building Photograph */}
        <div 
          style={{ backgroundColor: '#142B4A' }}
          className="hidden md:flex md:w-5/12 relative flex-col justify-between p-8 text-white overflow-hidden"
        >
          <img
            src={villaPhoto}
            alt="AQARFLOW VIRELEO Real Estate Architecture"
            className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B4A] via-[#142B4A]/70 to-transparent" />

          {/* Branding */}
          <div className="relative z-10 space-y-1">
            <AqarFlowLogo size="sm" variant="dark" />
            <div className="text-[10px] tracking-widest uppercase font-bold text-slate-400 pl-10">
              A VIRELEO PROJECT
            </div>
          </div>

          {/* Left Heading & Supporting Copy */}
          <div className="relative z-10 space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Manage Your Properties. <br />
                Simplify Your Business.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                A connected real estate ERP, CRM, and property operations platform engineered for modern agencies.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-slate-200 font-medium">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Property Management</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Customer & Lead Management</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Deal Tracking & Closings</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Business Analytics & Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Forms Container */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto">
          <div className="space-y-6">

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MODE 1: LOGIN PAGE */}
            {mode === 'login' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Welcome Back
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Sign in to your AQARFLOW workspace.
                  </p>
                </div>

                {/* Google Sign In Button with Official Branding */}
                <button
                  type="button"
                  disabled={ssoLoading !== null}
                  onClick={handleGoogleClick}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{ssoLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>

                {/* Divider: OR CONTINUE WITH EMAIL */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-3 text-[#718096] font-bold tracking-wider">
                      OR CONTINUE WITH EMAIL
                    </span>
                  </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@aqarflow.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>

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
                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
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

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-slate-600 font-medium">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); }}
                      className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                {/* 1-Click Role Access */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Demo Role Access
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Ready</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => switchDemoRole('agency_admin').then(() => { if (onSuccess) onSuccess(); onClose(); })}
                      className="py-1.5 px-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Admin Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoRole('agent').then(() => { if (onSuccess) onSuccess(); onClose(); })}
                      className="py-1.5 px-2 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agent Portal</span>
                    </button>
                  </div>
                </div>

                {/* Bottom link to Register */}
                <div className="text-center text-xs text-slate-500 pt-1">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Create Your Account
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: REGISTRATION PAGE */}
            {mode === 'register' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Create Your AQARFLOW Account
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Start managing your real estate business smarter.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Business / Agency Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Premier Properties"
                        value={regAgencyName}
                        onChange={(e) => setRegAgencyName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@agency.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {regPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 rounded-full ${
                                passwordScore >= step ? strengthColors[passwordScore] : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          Strength: <span className="text-slate-800">{strengthLabels[passwordScore]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      I agree to the{' '}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 font-bold hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 font-bold hover:underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Back to Login link */}
                <div className="text-center text-xs text-slate-500 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(null); }}
                    className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* MODE 3: FORGOT PASSWORD PAGE */}
            {mode === 'forgot' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#172033] tracking-tight">
                    Reset Password
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Enter your registered email address to receive password recovery instructions.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-3">
                    <div className="font-bold text-sm">Reset Link Dispatched</div>
                    <p className="leading-relaxed">
                      We have sent instructions and a secure recovery link to <strong>{forgotEmail}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setForgotSent(false); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2563EB]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(null); }}
                      className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Terms and Privacy Footer */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              By proceeding, you agree to AQARFLOW's{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-slate-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-slate-600 hover:underline">Privacy Policy</a>.
            </div>

          </div>
        </div>

        {/* Authentic Google Account Selection Dialog */}
        {showSSOAccountPicker && (
          <div className="absolute inset-0 z-40 bg-white sm:rounded-3xl flex flex-col justify-between overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
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
                    Sign in - Google Accounts
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    accounts.google.com
                  </div>
                </div>
                <div className="w-5" />
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </div>

              <div className="mt-5">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Choose an account
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  to continue to <strong className="text-blue-600">AQARFLOW VIRELEO</strong>
                </p>
              </div>

              <div className="mt-6 divide-y divide-slate-100">
                {googleAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAccount(acc.email, acc.role)}
                    className="w-full py-3.5 flex items-center gap-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-full ${acc.avatarBg} text-white font-semibold text-sm flex items-center justify-center shrink-0`}>
                      {acc.initial}
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

                <button
                  type="button"
                  onClick={() => setShowSSOAccountPicker(false)}
                  className="w-full py-3.5 flex items-center gap-3.5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-slate-300 text-slate-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    Use another account
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Before using this app, you can review AQARFLOW's{' '}
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
