import React, { useState } from 'react';
import { Search, Flame, Sparkles, TrendingUp, Heart, Play } from 'lucide-react';
import { Reel } from '../types';

interface ExploreViewProps {
  reels: Reel[];
  onSelectReel: (reelId: string) => void;
  onOpenUpload: () => void;
}

const TRENDING_TOPICS = [
  'All',
  '#azizreels',
  '#tokyo',
  '#viral',
  '#mountains',
  '#coffee',
  '#music',
  '#adventure',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  reels,
  onSelectReel,
  onOpenUpload,
}) => {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');

  const filteredReels = reels.filter((r) => {
    const matchesSearch =
      r.caption.toLowerCase().includes(search.toLowerCase()) ||
      r.author.name.toLowerCase().includes(search.toLowerCase()) ||
      r.author.handle.toLowerCase().includes(search.toLowerCase()) ||
      r.hashtags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTopic =
      activeTopic === 'All' ||
      r.hashtags.some((t) => t.toLowerCase() === activeTopic.toLowerCase());

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col overflow-y-auto no-scrollbar text-white pb-20">
      {/* Search Header */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Aziz Reels, tags, or creators..."
            className="w-full bg-zinc-800/90 text-xs text-white placeholder-zinc-500 pl-9 pr-3 py-2.5 rounded-xl border border-zinc-700/60 focus:outline-hidden focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Trending Tags Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeTopic === topic
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/40 to-zinc-900 border border-rose-500/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
              Aziz Creator Spotlight
            </div>
            <h3 className="text-sm font-extrabold text-white">
              Public Free Video Community
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Watch endless viral reels and upload your creativity without fees.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shrink-0 transition-transform active:scale-95 shadow-md shadow-rose-500/25"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Grid of Reels */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            Trending Public Reels
          </h3>
          <span className="text-[11px] text-zinc-500">
            {filteredReels.length} reels found
          </span>
        </div>

        {filteredReels.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-sm font-semibold">No reels match your search</p>
            <p className="text-xs text-zinc-400 mt-1">Try another search term or hashtag</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel.id)}
                className="relative aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:scale-[1.02] transition-transform border border-zinc-800/80"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Public
                    </span>
                    <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{reel.likesCount.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-zinc-200 line-clamp-1 font-medium">
                      {reel.caption}
                    </p>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      {reel.author.name}
                    </span>
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
