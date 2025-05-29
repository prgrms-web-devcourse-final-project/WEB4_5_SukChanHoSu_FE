export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  job: string;
  favoriteMovies: string[];
  bestMovie?: {
    title: string;
    year: number;
    genre: string;
    reason: string;
    posterUrl: string;
  };
  photo: string;
  isOnline: boolean;
  lastSeen: string;
  bio?: string;
  interests?: string[];
  distance?: string;
  introduction?: string;
}

export interface LikeData {
  id: number;
  fromUserId: number;
  toUserId: number;
  createdAt: string;
  isMatched?: boolean;
}

export interface Match {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  senderId: number;
  receiverId: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: number;
  participants: number[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  nickname: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  profileImage: string;
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

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
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

// 영화 검색 관련 타입
export interface MovieSearchResult {
  movieId: number;
  genresRaw: string;
  genres: string[];
  title: string;
  releaseDate: string;
  posterImage: string;
  description: string;
  rating: string;
  director: string;
}

export interface MovieSearchResponse {
  code: string;
  message: string;
  data: MovieSearchResult[];
}

// 박스오피스 관련 타입
export interface BoxOfficeMovie {
  rank: number;
  movieNm: string;
  posterUrl: string;
  movieCd: string;
  audiAcc: string;
}

export interface BoxOfficeResponse {
  code: string;
  message: string;
  data: BoxOfficeMovie[];
}

// 영화 상세 정보 관련 타입
export interface MovieGenre {
  genreNm: string;
}

export interface MovieDetail {
  movieNm: string;
  openDt: string;
  showTm: string;
  director: string;
  actors: string;
  genres: MovieGenre[];
  watchGradeNm: string;
  posterUrl: string;
  overview: string;
}

export interface MovieDetailResponse {
  code: string;
  message: string;
  data: MovieDetail;
}

// 닉네임 중복 검사 관련 타입
export interface NicknameCheckData {
  nickname: string;
  duplicated: boolean;
}

export interface NicknameCheckResponse {
  code: string;
  message: string;
  data: NicknameCheckData;
}

// 프로필 조회 관련 타입
export interface ProfileData {
  nickname: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  profileImages: string[];
  latitude: number;
  longitude: number;
  birthdate: string;
  searchRadius: number;
  lifeMovie: string;
  favoriteGenres: string[];
  watchedMovies: string[];
  preferredTheaters: string[];
  introduce: string;
}

export interface ProfileResponse {
  code: string;
  message: string;
  data: ProfileData;
}

// 오늘 매칭 수 조회 타입
export interface DailyMatchesResponse {
  code: string;
  message: string;
  data: number;
}

// 내가 좋아한 사용자 목록 타입
export interface LikedUser {
  userId: number;
  nickName: string;
  profileImages: string[];
  favoriteGenres: string[];
  introduce: string;
  distance: string;
  createdAt: string;
}

export interface LikedUsersResponse {
  code: string;
  message: string;
  data: {
    size: number;
    totalPages: number;
    userLikes: LikedUser[];
  };
}

// 취향 기반 매칭 타입
export interface TasteBasedMatchUser {
  userId: number;
  nickName: string;
  profileImages: string[];
  favoriteGenres: string[];
  introduce: string;
  distance: string;
  createdAt: string;
}

export interface TasteBasedMatchResponse {
  code: string;
  message: string;
  data: TasteBasedMatchUser[];
}

// 거리 기반 매칭 타입
export interface LocationBasedMatchUser {
  userId: number;
  nickName: string;
  profileImages: string[];
  favoriteGenres: string[];
  introduce: string;
  distance: string;
  createdAt: string;
}

export interface LocationBasedMatchResponse {
  code: string;
  message: string;
  data: LocationBasedMatchUser[];
}
