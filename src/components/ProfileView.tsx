import React, { useState } from 'react';
import { 
  Heart, 
  Film, 
  Bookmark, 
  Settings, 
  LogOut, 
  Phone, 
  CheckCircle2, 
  Share2, 
  Send,
  Upload
} from 'lucide-react';
import { Reel, ReelAuthor, UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  selectedCreator: ReelAuthor | null;
  reels: Reel[];
  onSelectReel: (reelId: string) => void;
  onRequestLogin: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenDirectMessage: (creatorId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  selectedCreator,
  reels,
  onSelectReel,
  onRequestLogin,
  onLogout,
  onOpenUpload,
  onOpenDirectMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'uploads' | 'liked' | 'saved'>('uploads');

  // If viewing a specific creator or viewing self
  const isViewingOther = Boolean(selectedCreator && selectedCreator.id !== currentUser.id);

  const profileData = isViewingOther && selectedCreator
    ? {
        name: selectedCreator.name,
        handle: selectedCreator.handle,
        avatar: selectedCreator.avatar,
        verified: selectedCreator.verified,
        followers: selectedCreator.followerCount,
        following: '184',
        bio: selectedCreator.bio || 'Public reel creator on Aziz Reels 🎬',
        phone: selectedCreator.phone,
        id: selectedCreator.id,
      }
    : {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        verified: false,
        followers: `${currentUser.followers}`,
        following: `${currentUser.following}`,
        bio: currentUser.bio,
        phone: currentUser.phone,
        id: currentUser.id,
      };

  // Filter reels for tabs
  const creatorReels = reels.filter(
    (r) => r.author.id === profileData.id || (profileData.id === currentUser.id && r.isUserUpload)
  );
  const likedReels = reels.filter((r) => r.isLiked);

  const displayedReels = activeTab === 'uploads' ? creatorReels : activeTab === 'liked' ? likedReels : [];

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col overflow-y-auto no-scrollbar text-white pb-20">
      {/* Top Header */}
      <div className="px-5 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <h2 className="text-base font-bold truncate max-w-[200px]">
          {profileData.handle}
        </h2>

        <div className="flex items-center gap-2">
          {!isViewingOther && currentUser.isLoggedIn ? (
            <button
              onClick={onLogout}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          ) : !isViewingOther && !currentUser.isLoggedIn ? (
            <button
              onClick={onRequestLogin}
              className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition-colors"
            >
              Login
            </button>
          ) : null}
        </div>
      </div>

      {/* Profile Bio Card */}
      <div className="p-5 flex flex-col items-center text-center border-b border-zinc-800/80">
        <div className="relative mb-3">
          <img
            src={profileData.avatar}
            alt={profileData.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-rose-500 shadow-xl"
            referrerPolicy="no-referrer"
          />
          {profileData.verified && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400 stroke-black stroke-2" />
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold flex items-center gap-1.5">
          {profileData.name}
        </h3>
        <p className="text-xs text-zinc-400 font-medium">{profileData.handle}</p>

        {profileData.phone && (
          <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3 text-emerald-400" />
            {profileData.phone}
          </p>
        )}

        <p className="text-xs text-zinc-300 max-w-sm mt-2 leading-relaxed">
          {profileData.bio}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 my-4 text-center">
          <div>
            <span className="text-base font-bold block text-white">
              {profileData.followers}
            </span>
            <span className="text-[11px] text-zinc-400">Followers</span>
          </div>
          <div>
            <span className="text-base font-bold block text-white">
              {profileData.following}
            </span>
            <span className="text-[11px] text-zinc-400">Following</span>
          </div>
          <div>
            <span className="text-base font-bold block text-white">
              {creatorReels.reduce((acc, curr) => acc + curr.likesCount, 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-400">Likes</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5 w-full max-w-xs mt-1">
          {isViewingOther ? (
            <>
              <button
                onClick={() => onOpenDirectMessage(profileData.id)}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 -rotate-12" />
                Message
              </button>
              <button
                onClick={() => alert(`Subscribed to ${profileData.name}'s public reels notifications!`)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
              >
                Follow
              </button>
            </>
          ) : !currentUser.isLoggedIn ? (
            <button
              onClick={onRequestLogin}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              Login with Mobile Number
            </button>
          ) : (
            <>
              <button
                onClick={onOpenUpload}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Reel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="grid grid-cols-2 border-b border-zinc-800 text-center sticky top-[60px] bg-zinc-950 z-10">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'uploads'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Film className="w-4 h-4" />
          Reels ({creatorReels.length})
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'liked'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Heart className="w-4 h-4" />
          Liked ({likedReels.length})
        </button>
      </div>

      {/* Reels Grid */}
      <div className="p-3">
        {displayedReels.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <Film className="w-10 h-10 mx-auto mb-2 opacity-40 text-zinc-400" />
            <p className="text-sm font-semibold">No reels to display</p>
            <p className="text-xs text-zinc-400 mt-1">
              {activeTab === 'uploads' ? 'Upload your first public reel!' : 'Liked reels will appear here'}
            </p>
            {!isViewingOther && activeTab === 'uploads' && (
              <button
                onClick={onOpenUpload}
                className="mt-3 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold"
              >
                Upload Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {displayedReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel.id)}
                className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:scale-[1.02] transition-transform"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{reel.likesCount >= 1000 ? `${(reel.likesCount / 1000).toFixed(0)}k` : reel.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
