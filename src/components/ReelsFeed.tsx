import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Sparkles,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { Reel, UserProfile, ReelAuthor } from '../types';
import { ReelPlayer } from './ReelPlayer';

interface ReelsFeedProps {
  reels: Reel[];
  currentReelIndex: number;
  setCurrentReelIndex: (index: number) => void;
  onLikeToggle: (id: string) => void;
  onOpenComments: (reel: Reel) => void;
  onOpenShare: (reel: Reel) => void;
  onOpenDirectMessage: (creatorId: string, reel?: Reel) => void;
  onOpenProfile: (creatorId: string) => void;
  onOpenPlayStore: () => void;
  onRequestLogin: () => void;
  currentUser: UserProfile;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  reels,
  currentReelIndex,
  setCurrentReelIndex,
  onLikeToggle,
  onOpenComments,
  onOpenShare,
  onOpenDirectMessage,
  onOpenProfile,
  onOpenPlayStore,
  onRequestLogin,
  currentUser,
}) => {
  const [feedMode, setFeedMode] = useState<'forYou' | 'following'>('forYou');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const touchStartY = useRef<number>(0);
  const isSwitchingRef = useRef<boolean>(false);

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, reels.length]);

  const handleNextReel = () => {
    if (isSwitchingRef.current) return;
    if (currentReelIndex < reels.length - 1) {
      isSwitchingRef.current = true;
      setCurrentReelIndex(currentReelIndex + 1);
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 350);
    }
  };

  const handlePrevReel = () => {
    if (isSwitchingRef.current) return;
    if (currentReelIndex > 0) {
      isSwitchingRef.current = true;
      setCurrentReelIndex(currentReelIndex - 1);
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 350);
    }
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      // Swiped UP -> Next reel
      handleNextReel();
    } else if (diff < -SWIPE_THRESHOLD) {
      // Swiped DOWN -> Previous reel
      handlePrevReel();
    }
  };

  // Wheel handling with debounce
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 40) {
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  const currentReel = reels[currentReelIndex] || reels[0];

  return (
    <div 
      className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Top Floating App Bar (Per Top Bar Contract & Mobile Ergonomics) */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
        {/* Brand Zone */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            Aziz Reels
          </span>
        </div>

        {/* Center Sub-Tabs (For You | Following) */}
        <div className="flex items-center gap-4 text-xs font-bold text-white">
          <button
            onClick={() => setFeedMode('forYou')}
            className={`pb-1 transition-all cursor-pointer ${
              feedMode === 'forYou'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            For You
          </button>
          <span className="text-white/30 text-xs">·</span>
          <button
            onClick={() => setFeedMode('following')}
            className={`pb-1 transition-all cursor-pointer ${
              feedMode === 'following'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Following
          </button>
        </div>

        {/* Right Play Store Install Trigger CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPlayStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
            title="Install Play Store App (Free)"
          >
            <Download className="w-3.5 h-3.5 stroke-3" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative w-full h-full max-w-lg aspect-[9/16] mx-auto bg-zinc-950 overflow-hidden sm:rounded-2xl shadow-2xl flex items-center justify-center">
        {currentReel && (
          <ReelPlayer
            reel={currentReel}
            isActive={true}
            onLikeToggle={onLikeToggle}
            onOpenComments={onOpenComments}
            onOpenShare={onOpenShare}
            onOpenDirectMessage={onOpenDirectMessage}
            onOpenProfile={onOpenProfile}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )}
      </div>

      {/* Desktop Quick Next / Prev Float Buttons */}
      <div className="hidden lg:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrevReel}
          disabled={currentReelIndex === 0}
          className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-30 text-white flex items-center justify-center border border-zinc-700 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Previous Reel (Up Arrow)"
          aria-label="Previous reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-bold text-center text-zinc-400">
          {currentReelIndex + 1} / {reels.length}
        </span>
        <button
          onClick={handleNextReel}
          disabled={currentReelIndex === reels.length - 1}
          className="w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-30 text-white flex items-center justify-center border border-zinc-700 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title="Next Reel (Down Arrow)"
          aria-label="Next reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
