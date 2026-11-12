import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7849');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    // Generate 4-digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() !== generatedOtp && otp.trim() !== '7849' && otp.trim().length !== 4) {
      setError(`Incorrect OTP code. Enter ${generatedOtp}`);
      return;
    }
    setError('');
    const defaultHandle = `@user_${phoneNumber.slice(-4) || 'aziz'}`;
    const defaultName = `User ${phoneNumber.slice(-4) || ''}`;
    setName(defaultName);
    setHandle(defaultHandle);
    setStep('profile');
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      phone: `${countryCode} ${phoneNumber}`,
      name: name.trim() || 'Aziz Creator',
      handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      avatar: selectedAvatar,
      bio: 'Public reel creator on Aziz Reels 🚀 Free video community.',
      isLoggedIn: true,
      followers: 120,
      following: 34,
      likedReelIds: [],
    };

    localStorage.setItem('aziz_reels_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-10 shadow-2xl text-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step 1: Mobile Phone Input */}
          {step === 'phone' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Phone className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Login with Mobile</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  100% Free Public Access · Zero Payment Required
                </p>
              </div>

              {/* Free Guarantee Banner */}
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-300">
                  <span className="font-semibold">Public Community: </span>
                  No credit card, no subscription fees. Enjoy unlimited reels and upload freely!
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Select */}
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-500 shrink-0 cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter mobile number"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!phoneNumber.trim()}
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.99]"
                >
                  Send OTP Code
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-[11px] text-zinc-500 text-center mt-4">
                By signing in, you agree to public video community guidelines on Aziz Reels.
              </p>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <div>
              {/* Simulated SMS Alert Header */}
              <div className="mb-5 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-left relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="font-semibold text-rose-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SMS Messenger
                  </span>
                  <span>Just now</span>
                </div>
                <p className="text-xs text-white font-medium">
                  Your Aziz Reels OTP is <span className="font-bold text-rose-400 tracking-wider text-sm">{generatedOtp}</span>. Do not share this code.
                </p>
                <button
                  type="button"
                  onClick={() => setOtp(generatedOtp)}
                  className="mt-2 text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  👉 Tap here to auto-fill ({generatedOtp})
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold tracking-tight">Verify Mobile Code</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Sent to {countryCode} {phoneNumber}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError('');
                    }}
                    placeholder="4-digit OTP"
                    className="w-full text-center tracking-[1em] text-2xl font-bold py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-hidden focus:border-rose-500"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-medium text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.99]"
                >
                  Verify & Continue
                </button>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="hover:text-white"
                  >
                    Change Phone Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newCode);
                    }}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
                  >
                    <RefreshCw className="w-3 h-3" /> Resend Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Complete Profile */}
          {step === 'profile' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold tracking-tight">Set Up Your Profile</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Ready to post public reels and interact with Aziz
                </p>
              </div>

              {/* Avatar Chooser */}
              <div className="flex flex-col items-center mb-5">
                <img
                  src={selectedAvatar}
                  alt="Selected avatar"
                  className="w-20 h-20 rounded-full object-cover border-3 border-rose-500 shadow-xl mb-3"
                  referrerPolicy="no-referrer"
                />
                <div className="flex items-center gap-2">
                  {AVATAR_OPTIONS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform ${
                        selectedAvatar === avatar ? 'border-rose-500 scale-110' : 'border-zinc-700 opacity-60'
                      }`}
                    >
                      <img src={avatar} alt="Option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCompleteProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Public Handle (@username)
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-rose-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.99] mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Enter Aziz Reels
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
