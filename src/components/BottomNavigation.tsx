import React from 'react';
import { Flame, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { UserProfile } from '../types';

interface BottomNavigationProps {
  activeTab: 'feed' | 'explore' | 'messages' | 'profile';
  onChangeTab: (tab: 'feed' | 'explore' | 'messages' | 'profile') => void;
  onOpenUpload: () => void;
  currentUser: UserProfile;
  unreadCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenUpload,
  currentUser,
  unreadCount,
}) => {
  return (
    <nav 
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around max-w-lg mx-auto sm:rounded-t-2xl shadow-2xl"
    >
      {/* Home / Feed */}
      <button
        onClick={() => onChangeTab('feed')}
        className={`min-h-[44px] min-w-[50px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeTab === 'feed' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Reels Feed"
      >
        <Flame className={`w-5 h-5 ${activeTab === 'feed' ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Reels</span>
      </button>

      {/* Explore / Search */}
      <button
        onClick={() => onChangeTab('explore')}
        className={`min-h-[44px] min-w-[50px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeTab === 'explore' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Explore and Search"
      >
        <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'text-rose-400 stroke-[2.5]' : ''}`} />
        <span className="text-[10px] font-semibold mt-1">Explore</span>
      </button>

      {/* Upload Button (+) */}
      <div className="flex items-center justify-center px-1">
        <button
          onClick={onOpenUpload}
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20 active:scale-90 transition-transform cursor-pointer"
          aria-label="Upload new reel"
        >
          <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
            <Plus className="w-6 h-6 stroke-3 text-rose-400" />
          </div>
        </button>
      </div>

      {/* Direct Messages (Massage) */}
      <button
        onClick={() => onChangeTab('messages')}
        className={`min-h-[44px] min-w-[50px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
          activeTab === 'messages' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Direct Messages"
      >
        <div className="relative">
          <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-rose-400 fill-rose-500/20' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-zinc-950">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-1">Inbox</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onChangeTab('profile')}
        className={`min-h-[44px] min-w-[50px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
          activeTab === 'profile' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Profile"
      >
        {currentUser.isLoggedIn ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`w-5 h-5 rounded-full object-cover border ${
              activeTab === 'profile' ? 'border-rose-500' : 'border-zinc-700'
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-rose-400' : ''}`} />
        )}
        <span className="text-[10px] font-semibold mt-1">Profile</span>
      </button>
    </nav>
  );
};
