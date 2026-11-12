import React, { useState } from 'react';
import { 
  Send, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  CheckCheck, 
  PhoneCall, 
  Video, 
  Info,
  Smile,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Conversation, DirectMessage, UserProfile } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onRequestLogin: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onRequestLogin,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentConv = conversations.find((c) => c.id === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    if (!currentUser.isLoggedIn) {
      onRequestLogin();
      return;
    }

    onSendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleQuickReaction = (emoji: string) => {
    if (!activeConversationId) return;
    if (!currentUser.isLoggedIn) {
      onRequestLogin();
      return;
    }
    onSendMessage(activeConversationId, emoji);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creator.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col overflow-hidden text-white">
      {/* If a conversation is active: Show Chat Thread View */}
      {currentConv ? (
        <div className="flex-1 flex flex-col h-full bg-zinc-950">
          {/* Chat Top Header */}
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectConversation(null)}
                className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Back to conversations list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={currentConv.creator.avatar}
                  alt={currentConv.creator.name}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                  referrerPolicy="no-referrer"
                />
                {currentConv.creator.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  {currentConv.creator.name}
                </h3>
                <p className="text-[10px] text-zinc-400">
                  {currentConv.creator.online ? 'Active now on Aziz Reels' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => alert(`Calling ${currentConv.creator.name} via Aziz Reels Direct... (Public Free Demo)`)}
                className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                title="Audio Call"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => alert(`Starting video call with ${currentConv.creator.name}... (Public Free Demo)`)}
                className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar flex flex-col">
            {/* Conversation Starter Card */}
            <div className="text-center py-4 my-2">
              <img
                src={currentConv.creator.avatar}
                alt={currentConv.creator.name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-rose-500"
                referrerPolicy="no-referrer"
              />
              <h4 className="text-sm font-bold">{currentConv.creator.name}</h4>
              <p className="text-xs text-zinc-400">{currentConv.creator.handle}</p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                Direct messages on Aziz Reels are 100% free and private.
              </p>
            </div>

            {/* Messages */}
            {currentConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm break-words ${
                    msg.isMe
                      ? 'bg-rose-500 text-white rounded-br-xs'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-xs border border-zinc-700/60'
                  }`}
                >
                  {/* Reel Attachment if any */}
                  {msg.reelAttachment && (
                    <div className="mb-2 p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                      <img
                        src={msg.reelAttachment.posterUrl}
                        alt="Reel"
                        className="w-10 h-14 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-[11px] truncate">
                        <span className="font-semibold text-rose-300 block">Shared Reel</span>
                        <span className="text-white/80">{msg.reelAttachment.caption}</span>
                      </div>
                    </div>
                  )}

                  <p>{msg.text}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck className="w-3 h-3 text-rose-400" />}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reaction Bar */}
          <div className="px-4 py-1.5 bg-zinc-900 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['❤️', '🔥', '😂', '👏', 'Awesome reel!', 'Can we collab?'].map((quick, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickReaction(quick)}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0 transition-colors"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${currentConv.creator.name}...`}
              className="flex-1 bg-zinc-800 text-xs text-white placeholder-zinc-500 px-4 py-2.5 rounded-full border border-zinc-700 focus:outline-hidden focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 -rotate-12 translate-x-0.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversation Inbox List View */
        <div className="flex-1 flex flex-col h-full">
          {/* Top Bar */}
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold tracking-tight">Direct Messages</h2>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Free Chat
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators or messages..."
                className="w-full bg-zinc-800/80 text-xs text-white placeholder-zinc-500 pl-9 pr-3 py-2 rounded-xl border border-zinc-700/60 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 no-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-10 text-center text-zinc-500">
                <p className="text-sm font-semibold">No messages found</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Start a conversation from any reel by tapping the message icon!
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full p-4 hover:bg-zinc-900/80 flex items-center gap-3 transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.creator.avatar}
                      alt={conv.creator.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    {conv.creator.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">
                        {conv.creator.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
