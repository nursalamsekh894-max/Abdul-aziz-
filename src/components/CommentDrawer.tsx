import React, { useState } from 'react';
import { X, Send, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reel, ReelComment, UserProfile } from '../types';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  comments: ReelComment[];
  currentUser: UserProfile;
  onAddComment: (reelId: string, text: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  onRequestLogin: () => void;
}

const QUICK_EMOJIS = ['🔥', '❤️', '👏', '😂', '😍', '🙌', '💯', '✨'];

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  reel,
  comments,
  currentUser,
  onAddComment,
  onToggleCommentLike,
  onRequestLogin,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen || !reel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddComment(reel.id, inputText.trim());
    setInputText('');
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-zinc-900 border-t border-zinc-800 rounded-t-3xl h-[65vh] flex flex-col z-10 shadow-2xl overflow-hidden"
        >
          {/* Grab Handle */}
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mt-3 mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Comments
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {comments.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label="Close comments"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Public Free Notice */}
          <div className="px-5 py-2 bg-zinc-950/60 border-b border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3 h-3" />
              Public Free Platform · Be respectful
            </span>
            {!currentUser.isLoggedIn && (
              <button
                onClick={onRequestLogin}
                className="text-rose-400 hover:text-rose-300 font-semibold underline"
              >
                Login with Mobile
              </button>
            )}
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 no-scrollbar">
            {comments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                <span className="text-3xl mb-2">💬</span>
                <p className="text-sm font-medium">No comments yet</p>
                <p className="text-xs text-zinc-400">Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 group">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-zinc-200">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed break-words">
                      {comment.text}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleCommentLike(comment.id)}
                    className="flex flex-col items-center gap-0.5 pt-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        comment.isLiked
                          ? 'fill-rose-500 stroke-rose-500 text-rose-500'
                          : 'stroke-zinc-500'
                      }`}
                    />
                    {comment.likes > 0 && (
                      <span className="text-[10px] font-medium text-zinc-400">
                        {comment.likes}
                      </span>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Emoji Bar */}
          <div className="flex items-center gap-2 px-5 py-2 border-t border-zinc-800/80 bg-zinc-950/40 overflow-x-auto no-scrollbar">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 shrink-0"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-t border-zinc-800"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentUser.isLoggedIn
                  ? `Comment as ${currentUser.name}...`
                  : 'Add a public comment...'
              }
              className="flex-1 bg-zinc-800/90 text-sm text-white placeholder-zinc-500 px-3.5 py-2 rounded-full border border-zinc-700/60 focus:outline-hidden focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rose-500 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-rose-500/20"
              aria-label="Post comment"
            >
              <Send className="w-4 h-4 -rotate-12 translate-x-0.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
