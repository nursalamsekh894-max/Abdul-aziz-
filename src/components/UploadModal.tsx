import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Music, 
  Sparkles, 
  Check, 
  Film, 
  Play, 
  Pause 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, UserProfile } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPublishReel: (newReel: Reel) => void;
  onRequestLogin: () => void;
}

const PRESET_VIDEOS = [
  {
    name: 'Tokyo Neon City',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-urban-traffic-at-night-in-the-city-41480-large.mp4',
    poster: '/src/assets/images/reels_cover_urban_1794503885370.jpg',
    sound: 'Tokyo Cyberdrift (Original Audio)',
  },
  {
    name: 'Skate Stunt Trick',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-skater-doing-tricks-on-a-sunny-day-41470-large.mp4',
    poster: '/src/assets/images/reels_cover_adventure_1794503885066.jpg',
    sound: 'Skater Beat - Summer Groove',
  },
  {
    name: 'Sunset Beach Walk',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-happy-woman-at-the-beach-41484-large.mp4',
    poster: '/src/assets/images/reels_cover_lifestyle_1794503886448.jpg',
    sound: 'Golden Sunset Vibes',
  },
  {
    name: 'DJ Bass Drop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-dj-mixing-music-in-a-party-41467-large.mp4',
    poster: '/src/assets/images/reels_cover_urban_1794503885370.jpg',
    sound: 'Live Electronic Bass (Master)',
  },
];

const SUGGESTED_TAGS = ['#azizreels', '#viral', '#foryou', '#explore', '#trending', '#comedy'];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishReel,
  onRequestLogin,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>(PRESET_VIDEOS[0].url);
  const [posterUrl, setPosterUrl] = useState<string>(PRESET_VIDEOS[0].poster);
  const [musicTitle, setMusicTitle] = useState<string>(PRESET_VIDEOS[0].sound);
  const [caption, setCaption] = useState<string>('Check out my new video on Aziz Reels! 🚀 Let me know what you think!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#azizreels', '#viral']);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setPosterUrl(PRESET_VIDEOS[0].poster);
    setMusicTitle('Original Audio - ' + (currentUser.name || 'User'));
  };

  const handleSelectPreset = (preset: typeof PRESET_VIDEOS[0]) => {
    setVideoUrl(preset.url);
    setPosterUrl(preset.poster);
    setMusicTitle(preset.sound);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const togglePreviewPlay = () => {
    if (previewVideoRef.current) {
      if (previewVideoRef.current.paused) {
        previewVideoRef.current.play();
        setIsPreviewPlaying(true);
      } else {
        previewVideoRef.current.pause();
        setIsPreviewPlaying(false);
      }
    }
  };

  const handlePublish = () => {
    if (!currentUser.isLoggedIn) {
      onRequestLogin();
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      const newReel: Reel = {
        id: `reel_user_${Date.now()}`,
        videoUrl,
        posterUrl,
        caption: caption.trim(),
        hashtags: selectedTags,
        musicTitle,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          handle: currentUser.handle,
          avatar: currentUser.avatar,
          verified: false,
          followerCount: `${currentUser.followers}`,
          phone: currentUser.phone,
          bio: currentUser.bio,
        },
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: true,
        isSaved: false,
        createdAt: 'Just now',
        isUserUpload: true,
      };

      onPublishReel(newReel);
      setIsPublishing(false);
      onClose();
    }, 900);
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 z-10 shadow-2xl text-white max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold">Upload Reel</h2>
                <p className="text-[11px] text-zinc-400">
                  Public Free Video Upload · Share with millions on Aziz Reels
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
            {/* Split Screen on Desktop, Stack on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Video Preview & File Input */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-full max-w-[220px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-xl cursor-pointer group"
                  onClick={togglePreviewPlay}
                >
                  <video
                    ref={previewVideoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    className="w-full h-full object-cover"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity">
                      {isPreviewPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white">
                    Preview 9:16
                  </div>
                </div>

                {/* Upload File Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full max-w-[220px] py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-rose-400" />
                  Choose File from Phone/PC
                </button>
              </div>

              {/* Right Column: Metadata & Presets */}
              <div className="space-y-3.5">
                {/* Instant Preset Clips */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Quick Video Clips (1-Click Test)</span>
                    <span className="text-[10px] text-zinc-500">Pick any clip</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_VIDEOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          videoUrl === preset.url
                            ? 'bg-rose-500/10 border-rose-500 text-white'
                            : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <Video className={`w-3.5 h-3.5 shrink-0 ${videoUrl === preset.url ? 'text-rose-400' : 'text-zinc-400'}`} />
                        <span className="text-[11px] font-medium truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Caption
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a catchy caption for your public reel..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-rose-500 transition-colors resize-none"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Add Trending Hashtags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sound Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Audio Sound
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-300">
                    <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <input
                      type="text"
                      value={musicTitle}
                      onChange={(e) => setMusicTitle(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Free & Public Tag */}
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Public & Free: Immediately visible to all viewers worldwide.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-3 border-t border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all active:scale-[0.99]"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing Public Reel...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-3" />
                  Publish Reel to Feed (Public & Free)
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
