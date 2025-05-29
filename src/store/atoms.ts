import { atom } from 'jotai';
import { Profile, LikeData, Match, ChatMessage, Chat } from '../types';
import { AuthState, User } from '../types';

// 현재 사용자 ID
export const currentUserIdAtom = atom<number>(1);

// 프로필 목록
export const profilesAtom = atom<Profile[]>([
  {
    id: 2,
    name: '지수',
    age: 26,
    location: '강남구',
    job: '영화 감독',
    favoriteMovies: ['라라랜드', '인터스텔라', '어바웃 타임'],
    bestMovie: {
      title: '라라랜드',
      year: 2016,
      genre: '뮤지컬/로맨스',
      reason:
        '꿈과 사랑 사이에서 고민하는 모습이 너무 아름다워요. 음악과 영상미가 완벽한 조화를 이루는 작품이에요.',
      posterUrl:
        'https://images.unsplash.com/photo-1489599735734-79b4f9ab7c34?w=300&h=450&fit=crop',
    },
    photo:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop',
    isOnline: true,
    lastSeen: '방금 전',
    bio: '영화를 통해 사람들과 소통하는 것을 좋아해요 🎬',
    interests: ['영화감상', '카페투어', '독서'],
  },
  {
    id: 3,
    name: '민준',
    age: 29,
    location: '홍대',
    job: '영화 평론가',
    favoriteMovies: ['기생충', '올드보이', '버닝'],
    bestMovie: {
      title: '기생충',
      year: 2019,
      genre: '스릴러/드라마',
      reason:
        '사회적 메시지와 완벽한 연출이 조화를 이룬 봉준호 감독의 걸작. 한국 영화의 위상을 세계에 알린 작품입니다.',
      posterUrl:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    },
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    isOnline: false,
    lastSeen: '1시간 전',
    bio: '깊이 있는 영화 이야기를 나누고 싶어요 📽️',
    interests: ['영화분석', '글쓰기', '전시관람'],
  },
  {
    id: 4,
    name: '서연',
    age: 24,
    location: '이태원',
    job: '배우',
    favoriteMovies: ['위대한 개츠비', '미드나잇 인 파리', '비포 선라이즈'],
    bestMovie: {
      title: '비포 선라이즈',
      year: 1995,
      genre: '로맨스/드라마',
      reason:
        '진정한 대화의 아름다움을 보여주는 작품. 두 사람의 만남이 이렇게 로맨틱할 수 있다는 걸 알려준 영화예요.',
      posterUrl:
        'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
    },
    photo:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    isOnline: true,
    lastSeen: '방금 전',
    bio: '연기와 영화를 사랑하는 사람이에요 ✨',
    interests: ['연기', '요가', '여행'],
  },
  {
    id: 5,
    name: '현우',
    age: 27,
    location: '성수동',
    job: '영화 제작자',
    favoriteMovies: ['덩케르크', '매드맥스', '블레이드 러너'],
    bestMovie: {
      title: '블레이드 러너 2049',
      year: 2017,
      genre: 'SF/스릴러',
      reason:
        '시각적 완성도와 철학적 깊이를 모두 갖춘 SF 영화의 정점. 미래에 대한 상상력이 현실이 된 작품입니다.',
      posterUrl:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
    },
    photo:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    isOnline: true,
    lastSeen: '방금 전',
    bio: '함께 영화를 만들어갈 사람을 찾고 있어요 🎥',
    interests: ['영화제작', '사진', '음악'],
  },
  {
    id: 6,
    name: '유진',
    age: 25,
    location: '신촌',
    job: '시나리오 작가',
    favoriteMovies: ['500일의 썸머', '이터널 선샤인', '허'],
    bestMovie: {
      title: '이터널 선샤인',
      year: 2004,
      genre: 'SF/로맨스',
      reason:
        '기억과 사랑에 대한 깊은 성찰을 담은 작품. 아픈 기억도 소중하다는 메시지가 마음에 깊이 남아요.',
      posterUrl:
        'https://images.unsplash.com/photo-1489599735734-79b4f9ab7c34?w=300&h=450&fit=crop&sat=-100',
    },
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
    isOnline: false,
    lastSeen: '30분 전',
    bio: '이야기를 통해 마음을 전하고 싶어요 💝',
    interests: ['글쓰기', '독서', '산책'],
  },
]);

// 좋아요한 프로필 ID 목록
export const likedProfilesAtom = atom<number[]>([3, 5]);

// 나를 좋아요한 사람들
export const likesReceivedAtom = atom<LikeData[]>([
  {
    id: 1,
    fromUserId: 2,
    toUserId: 1,
    createdAt: '2024-01-15T10:30:00Z',
    isMatched: false,
  },
  {
    id: 2,
    fromUserId: 4,
    toUserId: 1,
    createdAt: '2024-01-15T14:20:00Z',
    isMatched: false,
  },
  {
    id: 3,
    fromUserId: 6,
    toUserId: 1,
    createdAt: '2024-01-15T16:45:00Z',
    isMatched: false,
  },
  {
    id: 4,
    fromUserId: 3,
    toUserId: 1,
    createdAt: '2024-01-15T18:10:00Z',
    isMatched: true,
  },
  {
    id: 5,
    fromUserId: 5,
    toUserId: 1,
    createdAt: '2024-01-15T19:30:00Z',
    isMatched: true,
  },
]);

// 내가 좋아요한 사람들
export const likesSentAtom = atom<LikeData[]>([
  {
    id: 6,
    fromUserId: 1,
    toUserId: 3,
    createdAt: '2024-01-15T17:00:00Z',
    isMatched: true,
  },
  {
    id: 7,
    fromUserId: 1,
    toUserId: 5,
    createdAt: '2024-01-15T19:00:00Z',
    isMatched: true,
  },
]);

// 매치 목록
export const matchesAtom = atom<Match[]>([
  {
    id: 1,
    user1Id: 1,
    user2Id: 3,
    createdAt: '2024-01-15T18:10:00Z',
    lastMessage: '안녕하세요! 영화 이야기 나눠요 😊',
    lastMessageTime: '2024-01-15T20:30:00Z',
  },
  {
    id: 2,
    user1Id: 1,
    user2Id: 5,
    createdAt: '2024-01-15T19:30:00Z',
    lastMessage: '같이 영화 보러 가요!',
    lastMessageTime: '2024-01-15T21:15:00Z',
  },
]);

// 파생된 상태들 (computed atoms)
export const matchedProfilesAtom = atom((get) => {
  const profiles = get(profilesAtom);
  const matches = get(matchesAtom);
  const currentUserId = get(currentUserIdAtom);

  return matches
    .map((match) => {
      const otherUserId =
        match.user1Id === currentUserId ? match.user2Id : match.user1Id;
      return profiles.find((profile) => profile.id === otherUserId);
    })
    .filter((profile): profile is Profile => profile !== undefined);
});

// 좋아요 받은 프로필들
export const likedByProfilesAtom = atom((get) => {
  const profiles = get(profilesAtom);
  const likesReceived = get(likesReceivedAtom);

  return likesReceived
    .map((like) => {
      const profile = profiles.find((p) => p.id === like.fromUserId);
      return profile ? { ...profile, likeData: like } : null;
    })
    .filter(
      (profile): profile is Profile & { likeData: LikeData } => profile !== null
    );
});

// 내가 좋아요한 프로필들
export const likedProfilesDataAtom = atom((get) => {
  const profiles = get(profilesAtom);
  const likesSent = get(likesSentAtom);

  return likesSent
    .map((like) => {
      const profile = profiles.find((p) => p.id === like.toUserId);
      return profile ? { ...profile, likeData: like } : null;
    })
    .filter(
      (profile): profile is Profile & { likeData: LikeData } => profile !== null
    );
});

// 액션 atoms
export const handleLikeAtom = atom(null, (get, set, profileId: number) => {
  const likedProfiles = get(likedProfilesAtom);
  if (!likedProfiles.includes(profileId)) {
    set(likedProfilesAtom, [...likedProfiles, profileId]);
  }
});

export const handleUnlikeAtom = atom(null, (get, set, profileId: number) => {
  const likedProfiles = get(likedProfilesAtom);
  set(
    likedProfilesAtom,
    likedProfiles.filter((id) => id !== profileId)
  );
});

export const isLikedAtom = atom((get) => (profileId: number) => {
  const likedProfiles = get(likedProfilesAtom);
  return likedProfiles.includes(profileId);
});

export const isLikedByAtom = atom((get) => (profileId: number) => {
  const likesReceived = get(likesReceivedAtom);
  return likesReceived.some((like) => like.fromUserId === profileId);
});

// 채팅 목록
export const chatsAtom = atom<Chat[]>([
  {
    id: 1,
    participants: [1, 3],
    messages: [
      {
        id: 1,
        chatId: 1,
        senderId: 3,
        receiverId: 1,
        message: '안녕하세요! 영화 이야기 나눠요 😊',
        timestamp: '2024-01-15T20:30:00Z',
        isRead: true,
      },
      {
        id: 2,
        chatId: 1,
        senderId: 1,
        receiverId: 3,
        message: '안녕하세요! 기생충 정말 좋아하시는군요 👍',
        timestamp: '2024-01-15T20:35:00Z',
        isRead: true,
      },
      {
        id: 3,
        chatId: 1,
        senderId: 3,
        receiverId: 1,
        message:
          '네! 봉준호 감독 작품을 정말 좋아해요. 혹시 다른 추천 영화 있으신가요?',
        timestamp: '2024-01-15T20:40:00Z',
        isRead: true,
      },
      {
        id: 4,
        chatId: 1,
        senderId: 1,
        receiverId: 3,
        message: '옥자나 설국열차도 정말 좋아요! 같이 영화 보러 가실래요?',
        timestamp: '2024-01-15T20:45:00Z',
        isRead: false,
      },
    ],
    createdAt: '2024-01-15T18:10:00Z',
    updatedAt: '2024-01-15T20:45:00Z',
  },
  {
    id: 2,
    participants: [1, 5],
    messages: [
      {
        id: 5,
        chatId: 2,
        senderId: 5,
        receiverId: 1,
        message: '같이 영화 보러 가요!',
        timestamp: '2024-01-15T21:15:00Z',
        isRead: true,
      },
      {
        id: 6,
        chatId: 2,
        senderId: 1,
        receiverId: 5,
        message: '좋아요! 어떤 영화 보고 싶으세요?',
        timestamp: '2024-01-15T21:20:00Z',
        isRead: true,
      },
      {
        id: 7,
        chatId: 2,
        senderId: 5,
        receiverId: 1,
        message:
          '블레이드 러너 2049 다시 보고 싶어요. 아이맥스로 보면 정말 좋을 것 같아요!',
        timestamp: '2024-01-15T21:25:00Z',
        isRead: false,
      },
    ],
    createdAt: '2024-01-15T19:30:00Z',
    updatedAt: '2024-01-15T21:25:00Z',
  },
]);

// 채팅 메시지 전송 액션
export const sendMessageAtom = atom(
  null,
  (get, set, { chatId, message }: { chatId: number; message: string }) => {
    const chats = get(chatsAtom);
    const currentUserId = get(currentUserIdAtom);

    const chatIndex = chats.findIndex((chat) => chat.id === chatId);
    if (chatIndex === -1) return;

    const chat = chats[chatIndex];
    const receiverId = chat.participants.find((id) => id !== currentUserId);
    if (!receiverId) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      chatId,
      senderId: currentUserId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const updatedChats = [...chats];
    updatedChats[chatIndex] = {
      ...chat,
      messages: [...chat.messages, newMessage],
      updatedAt: new Date().toISOString(),
    };

    set(chatsAtom, updatedChats);
  }
);

// 특정 채팅 가져오기
export const getChatAtom = atom((get) => (chatId: number) => {
  const chats = get(chatsAtom);
  return chats.find((chat) => chat.id === chatId);
});

// 채팅 상대방 정보 가져오기
export const getChatPartnerAtom = atom((get) => (chatId: number) => {
  const chats = get(chatsAtom);
  const profiles = get(profilesAtom);
  const currentUserId = get(currentUserIdAtom);

  const chat = chats.find((chat) => chat.id === chatId);
  if (!chat) return null;

  const partnerId = chat.participants.find((id) => id !== currentUserId);
  if (!partnerId) return null;

  return profiles.find((profile) => profile.id === partnerId) || null;
});

// 인증 관련 atoms
export const authAtom = atom<AuthState>({
  isAuthenticated: false,
  user: null,
  loading: false,
});

export const loginAtom = atom(
  null,
  async (get, set, { email }: { email: string; password: string }) => {
    set(authAtom, { ...get(authAtom), loading: true });

    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 임시 사용자 데이터
      const user: User = {
        id: '1',
        email,
        name: '김영화',
        nickname: '영화매니아',
        age: 28,
        gender: 'female',
        profileImage:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        favoriteGenres: ['로맨스', '드라마'],
        bestMovie: {
          title: '라라랜드',
          year: 2016,
          genre: '뮤지컬/로맨스',
          reason: '꿈과 사랑 사이에서 고민하는 모습이 너무 아름다워요.',
        },
        bio: '영화를 사랑하는 사람입니다.',
      };

      set(authAtom, {
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      set(authAtom, { ...get(authAtom), loading: false });
      throw error;
    }
  }
);

export const signupAtom = atom(
  (get) => get(authAtom),
  async (
    get,
    set,
    userData: {
      email: string;
      password: string;
      nickname: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      favoriteGenres: string[];
      bestMovie?: {
        title: string;
        year: number;
        genre: string;
        reason: string;
        posterImage?: string;
      };
      bio: string;
    }
  ) => {
    set(authAtom, { ...get(authAtom), loading: true });

    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.nickname,
        nickname: userData.nickname,
        age: userData.age,
        gender: userData.gender,
        profileImage:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        favoriteGenres: userData.favoriteGenres,
        bestMovie: userData.bestMovie,
        bio: userData.bio,
      };

      set(authAtom, {
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      set(authAtom, { ...get(authAtom), loading: false });
      throw error;
    }
  }
);

export const logoutAtom = atom(null, (get, set) => {
  set(authAtom, {
    isAuthenticated: false,
    user: null,
    loading: false,
  });
});
