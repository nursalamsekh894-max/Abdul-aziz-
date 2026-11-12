import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  MessageCircle, 
  Send,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  onShareComplete: (reelId: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  reel,
  onShareComplete,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !reel) return null;

  const reelUrl = `${window.location.origin}/#reel-${reel.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reelUrl).then(() => {
      setCopied(true);
      onShareComplete(reel.id);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Watch this viral reel by ${reel.author.name} on Aziz Reels! 🎥🔥\n${reelUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onShareComplete(reel.id);
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`Watch this reel by ${reel.author.name} on Aziz Reels! 🎥`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(reelUrl)}&text=${text}`, '_blank');
    onShareComplete(reel.id);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Trending reel on Aziz Reels by ${reel.author.handle}: ${reel.caption.slice(0, 80)}... #azizreels #viral`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(reelUrl)}&text=${text}`, '_blank');
    onShareComplete(reel.id);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aziz Reels - ${reel.author.name}`,
          text: reel.caption,
          url: reelUrl,
        });
        onShareComplete(reel.id);
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    // Simulate instant safe download trigger
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = reel.videoUrl;
      a.download = `aziz_reel_${reel.id}.mp4`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
      onShareComplete(reel.id);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 z-10 shadow-2xl text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                Share Reel
                <span className="text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Free & Public
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[260px]">
                {reel.caption}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              aria-label="Close share sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share Grid Targets */}
          <div className="grid grid-cols-4 gap-4 py-5 border-b border-zinc-800">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <MessageCircle className="w-6 h-6 fill-white stroke-emerald-600" />
              </div>
              <span className="text-[11px] font-medium text-zinc-300">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-sky-500 group-hover:bg-sky-400 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
              </div>
              <span className="text-[11px] font-medium text-zinc-300">Telegram</span>
            </button>

            {/* X / Twitter */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 border border-zinc-700">
                <span className="font-bold text-base">𝕏</span>
              </div>
              <span className="text-[11px] font-medium text-zinc-300">X (Twitter)</span>
            </button>

            {/* Native Share */}
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-zinc-300">More</span>
            </button>
          </div>

          {/* Copy Link & Download Strip */}
          <div className="pt-4 space-y-3">
            {/* Copy Link Bar */}
            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
              <input
                type="text"
                readOnly
                value={reelUrl}
                className="flex-1 bg-transparent text-xs text-zinc-400 px-2 focus:outline-hidden truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Download className="w-4 h-4 text-rose-400" />
              {downloading ? 'Preparing Download...' : 'Download Video for Free'}
            </button>
          </div>

          {/* Footnote */}
          <div className="mt-4 pt-3 text-center border-t border-zinc-800/40">
            <span className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Aziz Reels is 100% Free Public Video Community
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
