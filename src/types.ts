export interface ReelAuthor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  followerCount: string;
  phone?: string;
  bio?: string;
}

export interface ReelComment {
  id: string;
  reelId: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked: boolean;
  timestamp: string;
}

export interface Reel {
  id: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  hashtags: string[];
  musicTitle: string;
  author: ReelAuthor;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  isUserUpload?: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isLoggedIn: boolean;
  followers: number;
  following: number;
  likedReelIds: string[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  reelAttachment?: {
    id: string;
    caption: string;
    posterUrl: string;
  };
  isMe: boolean;
}

export interface Conversation {
  id: string;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: DirectMessage[];
}
