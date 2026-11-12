import React, { useState, useEffect } from 'react';
import { 
  INITIAL_REELS, 
  INITIAL_COMMENTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_USER 
} from './data/initialData';
import { Reel, ReelComment, Conversation, UserProfile, ReelAuthor } from './types';
import { ReelsFeed } from './components/ReelsFeed';
import { CommentDrawer } from './components/CommentDrawer';
import { ShareModal } from './components/ShareModal';
import { LoginModal } from './components/LoginModal';
import { UploadModal } from './components/UploadModal';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { ExploreView } from './components/ExploreView';
import { PlayStoreModal } from './components/PlayStoreModal';
import { BottomNavigation } from './components/BottomNavigation';

export default function App() {
  // App state
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('aziz_reels_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reels', e);
      }
    }
    return INITIAL_REELS;
  });

  const [currentReelIndex, setCurrentReelIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'messages' | 'profile'>('feed');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('aziz_reels_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return INITIAL_USER;
  });

  // Comments
  const [commentsMap, setCommentsMap] = useState<Record<string, ReelComment[]>>(() => {
    const saved = localStorage.getItem('aziz_reels_comments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved comments', e);
      }
    }
    return INITIAL_COMMENTS;
  });

  // Direct Message Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('aziz_reels_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved conversations', e);
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  // Active Modals & Views
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
  
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [activeCommentReel, setActiveCommentReel] = useState<Reel | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareReel, setActiveShareReel] = useState<Reel | null>(null);

  const [selectedCreator, setSelectedCreator] = useState<ReelAuthor | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('aziz_reels_data', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('aziz_reels_comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  useEffect(() => {
    localStorage.setItem('aziz_reels_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Handle Like / Unlike
  const handleLikeToggle = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextIsLiked = !r.isLiked;
          const delta = nextIsLiked ? 1 : -1;
          return {
            ...r,
            isLiked: nextIsLiked,
            likesCount: Math.max(0, r.likesCount + delta),
          };
        }
        return r;
      })
    );
  };

  // Open Comments
  const handleOpenComments = (reel: Reel) => {
    setActiveCommentReel(reel);
    setIsCommentDrawerOpen(true);
  };

  // Add Comment
  const handleAddComment = (reelId: string, text: string) => {
    const newComment: ReelComment = {
      id: `c_${Date.now()}`,
      reelId,
      author: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
      },
      text,
      likes: 0,
      isLiked: false,
      timestamp: 'Just now',
    };

    setCommentsMap((prev) => ({
      ...prev,
      [reelId]: [newComment, ...(prev[reelId] || [])],
    }));

    // Update comment counter on reel
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId ? { ...r, commentsCount: r.commentsCount + 1 } : r
      )
    );
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (!activeCommentReel) return;
    const reelId = activeCommentReel.id;

    setCommentsMap((prev) => {
      const currentComments = prev[reelId] || [];
      const updated = currentComments.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likes: c.likes + (nextLiked ? 1 : -1),
          };
        }
        return c;
      });
      return { ...prev, [reelId]: updated };
    });
  };

  // Open Share Modal
  const handleOpenShare = (reel: Reel) => {
    setActiveShareReel(reel);
    setIsShareModalOpen(true);
  };

  // Share Complete Counter
  const handleShareComplete = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId ? { ...r, sharesCount: r.sharesCount + 1 } : r
      )
    );
  };

  // Open Direct Message with Creator
  const handleOpenDirectMessage = (creatorId: string, reel?: Reel) => {
    // Find or create conversation
    let conv = conversations.find((c) => c.creator.id === creatorId);
    if (!conv) {
      const author = reels.find((r) => r.author.id === creatorId)?.author;
      if (author) {
        conv = {
          id: `conv_${creatorId}_${Date.now()}`,
          creator: {
            id: author.id,
            name: author.name,
            handle: author.handle,
            avatar: author.avatar,
            online: true,
          },
          lastMessage: reel ? `Shared reel: ${reel.caption.slice(0, 30)}...` : 'Started conversation',
          lastMessageTime: 'Just now',
          unreadCount: 0,
          messages: [],
        };
        setConversations((prev) => [conv!, ...prev]);
      }
    }

    if (conv) {
      if (reel) {
        // Automatically send the reel preview into the thread
        const reelMsg = {
          id: `msg_reel_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `Check out this reel! 🔥`,
          timestamp: 'Just now',
          reelAttachment: {
            id: reel.id,
            caption: reel.caption,
            posterUrl: reel.posterUrl,
          },
          isMe: true,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conv!.id
              ? {
                  ...c,
                  lastMessage: 'Shared a reel',
                  lastMessageTime: 'Just now',
                  messages: [...c.messages, reelMsg],
                }
              : c
          )
        );
      }

      setActiveConversationId(conv.id);
      setActiveTab('messages');
    }
  };

  // Send Message in Thread
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now',
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Simulated warm auto-reply from creator after 1.5 seconds
    setTimeout(() => {
      const conv = conversations.find((c) => c.id === conversationId);
      const creatorName = conv?.creator.name || 'Aziz';
      
      const replies = [
        `Thanks for messaging on Aziz Reels! Love having you in the public video community! 🔥`,
        `Appreciate the support! Make sure to check out the new video upload feature and drop your clips! 🚀`,
        `Glad you enjoyed the reel! Let’s keep creating and inspiring together! 🎬🙌`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg = {
        id: `m_reply_${Date.now()}`,
        senderId: conv?.creator.id || 'creator_aziz',
        senderName: creatorName,
        senderAvatar: conv?.creator.avatar || '/src/assets/images/aziz_creator_avatar_1794503883784.jpg',
        text: randomReply,
        timestamp: 'Just now',
        isMe: false,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: randomReply,
                lastMessageTime: 'Just now',
                messages: [...c.messages, replyMsg],
              }
            : c
        )
      );
    }, 1500);
  };

  // Open Profile View
  const handleOpenProfile = (creatorId: string) => {
    const author = reels.find((r) => r.author.id === creatorId)?.author || null;
    setSelectedCreator(author);
    setActiveTab('profile');
  };

  // Publish New Reel from Creator Studio
  const handlePublishReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setCurrentReelIndex(0);
    setActiveTab('feed');
  };

  // Login Success
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('aziz_reels_user');
    setCurrentUser(INITIAL_USER);
  };

  const totalUnreadMessages = conversations.reduce(
    (acc, curr) => acc + curr.unreadCount,
    0
  );

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none flex flex-col items-center justify-center font-sans">
      {/* Central Viewport Router */}
      <main className="relative w-full h-full max-w-lg mx-auto bg-black flex flex-col overflow-hidden">
        {activeTab === 'feed' && (
          <ReelsFeed
            reels={reels}
            currentReelIndex={currentReelIndex}
            setCurrentReelIndex={setCurrentReelIndex}
            onLikeToggle={handleLikeToggle}
            onOpenComments={handleOpenComments}
            onOpenShare={handleOpenShare}
            onOpenDirectMessage={handleOpenDirectMessage}
            onOpenProfile={handleOpenProfile}
            onOpenPlayStore={() => setIsPlayStoreModalOpen(true)}
            onRequestLogin={() => setIsLoginModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            reels={reels}
            onSelectReel={(id) => {
              const idx = reels.findIndex((r) => r.id === id);
              if (idx !== -1) {
                setCurrentReelIndex(idx);
                setActiveTab('feed');
              }
            }}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesView
            conversations={conversations}
            currentUser={currentUser}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onSendMessage={handleSendMessage}
            onRequestLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            selectedCreator={selectedCreator}
            reels={reels}
            onSelectReel={(id) => {
              const idx = reels.findIndex((r) => r.id === id);
              if (idx !== -1) {
                setCurrentReelIndex(idx);
                setActiveTab('feed');
              }
            }}
            onRequestLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenDirectMessage={(creatorId) => handleOpenDirectMessage(creatorId)}
          />
        )}

        {/* Global Bottom Navigation (Tabs) */}
        <BottomNavigation
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'profile') {
              setSelectedCreator(null);
            }
          }}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          currentUser={currentUser}
          unreadCount={totalUnreadMessages}
        />
      </main>

      {/* Global Modals */}

      {/* Comments Drawer */}
      <CommentDrawer
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        reel={activeCommentReel}
        comments={activeCommentReel ? commentsMap[activeCommentReel.id] || [] : []}
        currentUser={currentUser}
        onAddComment={handleAddComment}
        onToggleCommentLike={handleToggleCommentLike}
        onRequestLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reel={activeShareReel}
        onShareComplete={handleShareComplete}
      />

      {/* Login with Mobile Number Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Upload Reel Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onPublishReel={handlePublishReel}
        onRequestLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Google Play Store / Install Modal */}
      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />
    </div>
  );
}
