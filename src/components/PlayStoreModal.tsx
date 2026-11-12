import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Star, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Smartphone, 
  Share, 
  PlusSquare,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [installState, setInstallState] = useState<'idle' | 'downloading' | 'installed'>('idle');
  const [installProgress, setInstallProgress] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallState('installed');
        setDeferredPrompt(null);
        return;
      }
    }

    // Interactive realistic Play Store download & install simulation
    setInstallState('downloading');
    setInstallProgress(10);

    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallState('installed');
          return 100;
        }
        return prev + 18;
      });
    }, 280);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 z-10 shadow-2xl text-white max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Play Store Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 via-emerald-400 to-amber-400 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-900 rounded-sm flex items-center justify-center text-[10px] font-black text-white">
                  ▶
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-300 tracking-wide">
                Google Play Store Listing
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* App Header Lockup */}
          <div className="flex items-start gap-4 pt-4 pb-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-1 shadow-xl shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-xl flex flex-col items-center justify-center text-white">
                <Flame className="w-9 h-9 text-rose-500 fill-rose-500" />
                <span className="text-[9px] font-black tracking-tight text-white/90">AZIZ</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                Aziz Reels: Short Videos
              </h2>
              <p className="text-xs font-medium text-emerald-400 mt-0.5">
                Aziz Creator Community · Public Free
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Contains ads: No · In-app purchases: None
              </p>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-3 divide-x divide-zinc-800 py-3 my-2 border-y border-zinc-800 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-white">
                <span>4.8</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-zinc-400">320K reviews</span>
            </div>

            <div>
              <div className="text-xs font-bold text-white">10M+</div>
              <span className="text-[10px] text-zinc-400">Downloads</span>
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </div>
              <span className="text-[10px] text-zinc-400">Play Protect</span>
            </div>
          </div>

          {/* Install CTA Button & Progress */}
          <div className="my-4">
            {installState === 'idle' && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all"
              >
                <Download className="w-4 h-4 stroke-3" />
                Install Free App (24.8 MB)
              </button>
            )}

            {installState === 'downloading' && (
              <div className="p-3 bg-zinc-800/80 rounded-2xl border border-zinc-700">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    Downloading from Play Store...
                  </span>
                  <span className="font-bold">{installProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${installProgress}%` }}
                  />
                </div>
              </div>
            )}

            {installState === 'installed' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  App Installed & Ready on Home Screen!
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold"
                >
                  Open App
                </button>
              </div>
            )}
          </div>

          {/* Features Highlight */}
          <div className="space-y-2.5 my-4">
            <h4 className="text-xs font-bold text-zinc-300 tracking-wide uppercase">
              About this app
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Aziz Reels is the fastest growing free public video platform. Watch millions of trending reels, upload your own videos in HD, like with animated hearts, comment with emojis, share to WhatsApp, and message creators directly with no fees!
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[11px] font-medium text-zinc-200">100% Free Public</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-[11px] font-medium text-zinc-200">Mobile Number Login</span>
              </div>
            </div>
          </div>

          {/* Mobile Home Screen Instructions */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
            <span className="font-semibold text-white block">
              💡 Fast Install on any device:
            </span>
            <p className="text-[11px]">
              • <strong>Android / Chrome:</strong> Tap the 3 dots menu and select <em>"Install App"</em> or <em>"Add to Home Screen"</em>.
            </p>
            <p className="text-[11px]">
              • <strong>iPhone / Safari:</strong> Tap the Share icon <Share className="w-3 h-3 inline text-sky-400" /> then choose <PlusSquare className="w-3 h-3 inline text-emerald-400" /> <em>"Add to Home Screen"</em>.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
