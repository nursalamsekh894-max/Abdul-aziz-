import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Volume2, 
  VolumeX, 
  Play, 
  Music2, 
  CheckCircle2, 
  Plus, 
  Check, 
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel } from '../types';

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  onLikeToggle: (id: string) => void;
  onOpenComments: (reel: Reel) => void;
  onOpenShare: (reel: Reel) => void;
  onOpenDirectMessage: (creatorId: string, reel?: Reel) => void;
  onOpenProfile: (creatorId: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reel,
  isActive,
  onLikeToggle,
  onOpenComments,
  onOpenShare,
  onOpenDirectMessage,
  onOpenProfile,
  isMuted,
  onToggleMute,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean>(false);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [captionExpanded, setCaptionExpanded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);

  // Play / Pause video based on active status
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setVideoError(false);
          })
          .catch((err) => {
            console.log('Video autoplay prevented or source error:', err);
            // Autoplay with audio might fail in browsers, fallback to muted play
            if (!video.muted) {
              video.muted = true;
              video.play().catch(() => setVideoError(true));
            }
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Time update for progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  // Toggle Play / Pause on single tap
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    // Check for double tap
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger Double Tap Heart Animation
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newHeart: HeartParticle = {
        id: Date.now() + Math.random(),
        x,
        y,
        rotate: (Math.random() - 0.5) * 40,
        scale: 0.9 + Math.random() * 0.4,
      };

      setHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 900);

      if (!reel.isLiked) {
        onLikeToggle(reel.id);
      }
      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;

    // Wait slightly to differentiate single tap from double tap
    setTimeout(() => {
      if (Date.now() - lastTapRef.current >= DOUBLE_TAP_DELAY && lastTapRef.current !== 0) {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
          setShowPlayIcon(true);
          setTimeout(() => setShowPlayIcon(false), 500);
        }
      }
    }, DOUBLE_TAP_DELAY);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = newProgress * videoRef.current.duration;
      setProgress(newProgress * 100);
    }
  };

  const formatCount = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div 
      className="relative w-full h-full bg-black select-none overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={handleTap}
    >
      {/* Background / Video Layer */}
      {videoError ? (
        // High fidelity fallback poster presentation if network/CDN fails
        <div className="relative w-full h-full">
          <img 
            src={reel.posterUrl} 
            alt={reel.caption}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-xs text-white/80 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
              Tap to replay preview
            </span>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.posterUrl}
          className="w-full h-full object-cover"
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Top & Bottom Gradient Shadows for Legibility */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Center Animated Play/Pause Indicator */}
      <AnimatePresence>
        {showPlayIcon && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-none z-30 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white"
          >
            {isPlaying ? (
              <Play className="w-8 h-8 fill-white ml-1" />
            ) : (
              <div className="flex gap-1.5 items-center justify-center">
                <div className="w-2 h-7 bg-white rounded-full" />
                <div className="w-2 h-7 bg-white rounded-full" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double Tap Floating Heart Particles */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ scale: 0, opacity: 0, x: heart.x - 40, y: heart.y - 40, rotate: heart.rotate }}
            animate={{ 
              scale: [0, 1.4, 1.1], 
              opacity: [0, 1, 0], 
              y: heart.y - 120,
              rotate: heart.rotate 
            }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute pointer-events-none z-40 text-rose-500 drop-shadow-[0_4px_16px_rgba(244,63,94,0.6)]"
          >
            <Heart className="w-20 h-20 fill-rose-500 stroke-white stroke-2" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Top Floating Badges (Public Free & Audio Toggle) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Public Free
          </span>
          {reel.isUserUpload && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              My Upload
            </span>
          )}
        </div>

        {/* Sound Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white/90" />
          ) : (
            <Volume2 className="w-5 h-5 text-rose-400" />
          )}
        </button>
      </div>

      {/* Right Vertical Action Rail */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5 pointer-events-auto">
        {/* Creator Avatar & Follow Button */}
        <div className="relative mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile(reel.author.id);
            }}
            className="w-12 h-12 rounded-full p-0.5 border-2 border-white overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-transform"
            aria-label={`View ${reel.author.name}'s profile`}
          >
            <img
              src={reel.author.avatar}
              alt={reel.author.name}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(!isFollowing);
            }}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isFollowing ? 'bg-zinc-800 text-white' : 'bg-rose-500 text-white'
            }`}
            aria-label={isFollowing ? "Unfollow" : "Follow"}
          >
            {isFollowing ? <Check className="w-3 h-3 stroke-3" /> : <Plus className="w-3 h-3 stroke-3" />}
          </button>
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(reel.id);
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              reel.isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            aria-label={reel.isLiked ? "Unlike reel" : "Like reel"}
          >
            <Heart 
              className={`w-7 h-7 transition-all ${
                reel.isLiked ? 'fill-rose-500 stroke-rose-500 scale-110 drop-shadow-[0_2px_8px_rgba(244,63,94,0.6)]' : 'stroke-white'
              }`} 
            />
          </motion.button>
          <span className="text-[12px] font-bold text-white mt-1 drop-shadow-md">
            {formatCount(reel.likesCount)}
          </span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(reel);
            }}
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 flex items-center justify-center text-white backdrop-blur-md transition-all"
            aria-label="Open comments sheet"
          >
            <MessageCircle className="w-7 h-7 stroke-white" />
          </button>
          <span className="text-[12px] font-bold text-white mt-1 drop-shadow-md">
            {formatCount(reel.commentsCount)}
          </span>
        </div>

        {/* Direct Message (Massage) Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDirectMessage(reel.author.id, reel);
            }}
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 flex items-center justify-center text-white backdrop-blur-md transition-all"
            aria-label={`Message ${reel.author.name}`}
            title="Send Message"
          >
            <Send className="w-6 h-6 stroke-white -rotate-12 translate-x-0.5" />
          </button>
          <span className="text-[11px] font-semibold text-white/90 mt-1 drop-shadow-md">
            Message
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare(reel);
            }}
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 flex items-center justify-center text-white backdrop-blur-md transition-all"
            aria-label="Share reel"
          >
            <Share2 className="w-6 h-6 stroke-white" />
          </button>
          <span className="text-[12px] font-bold text-white mt-1 drop-shadow-md">
            {formatCount(reel.sharesCount)}
          </span>
        </div>

        {/* Spinning Vinyl Music Disc */}
        <div className="mt-1">
          <div 
            className={`w-10 h-10 rounded-full border-2 border-zinc-700 bg-gradient-to-tr from-zinc-900 to-zinc-700 p-1 flex items-center justify-center shadow-lg ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <div className="w-4 h-4 rounded-full bg-rose-500 border border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Info Overlay */}
      <div className="absolute left-4 right-16 bottom-6 z-20 pointer-events-auto text-left">
        {/* Creator Name & Handle */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile(reel.author.id);
          }}
          className="inline-flex items-center gap-2 mb-2 group cursor-pointer"
        >
          <span className="text-base font-bold text-white hover:underline drop-shadow-md flex items-center gap-1.5">
            {reel.author.name}
            {reel.author.verified && (
              <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400 stroke-black stroke-2 inline" />
            )}
          </span>
          <span className="text-xs text-white/70 font-medium">
            {reel.author.handle}
          </span>
        </div>

        {/* Caption */}
        <p className="text-sm text-white/95 line-clamp-2 leading-relaxed drop-shadow-md mb-2">
          {captionExpanded ? reel.caption : (
            <>
              {reel.caption.length > 85 ? `${reel.caption.slice(0, 85)}...` : reel.caption}
              {reel.caption.length > 85 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCaptionExpanded(true);
                  }}
                  className="ml-1 text-white font-semibold text-xs opacity-80 hover:opacity-100"
                >
                  more
                </button>
              )}
            </>
          )}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 text-xs text-rose-300 font-semibold mb-3 drop-shadow-md">
          {reel.hashtags.map((tag, i) => (
            <span key={i} className="hover:underline cursor-pointer">
              {tag}
            </span>
          ))}
        </div>

        {/* Audio Track Ticker */}
        <div className="flex items-center gap-2 text-xs text-white/80 max-w-[240px] overflow-hidden whitespace-nowrap">
          <Music2 className="w-3.5 h-3.5 shrink-0 text-rose-400 animate-pulse" />
          <div className="truncate font-medium">
            {reel.musicTitle}
          </div>
        </div>
      </div>

      {/* Interactive Bottom Progress Scrubber */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 hover:h-2.5 transition-all z-30 cursor-pointer"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-rose-500 rounded-r-full transition-all duration-75 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow" />
        </div>
      </div>
    </div>
  );
};
