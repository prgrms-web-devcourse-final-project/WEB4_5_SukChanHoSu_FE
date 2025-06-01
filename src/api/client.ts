import axios, { AxiosInstance } from 'axios';
import {
  ChatRoom,
  ChatMessagesResponse,
  ProfileData,
  ProfileResponse,
} from '../types';

// ProfileInfoPayload 타입을 인라인으로 정의하거나 types/index.ts에 추가합니다.
// 여기서는 간단히 인라인으로 처리합니다.
export interface ProfileInfoPayload {
  nickname: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other'; // API 스펙에 맞게 조정
  latitude?: number;
  longitude?: number;
  birthdate?: string; // API 스펙에 따라 Date 형식 또는 string
  searchRadius?: number;
  lifeMovie?: string;
  favoriteGenres?: string[]; // API 스펙에 따라 장르 Enum 또는 string 배열
  watchedMovies?: string[];
  preferredTheaters?: string[];
  introduce?: string;
}

// API 기본 URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; // 빈 문자열로 설정
console.log(API_BASE_URL);
// API 클라이언트 기본 설정
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // 개발 환경에서는 상대 경로를 사용
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    // localStorage.setItem(
    //   'token',
    //   'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJvYXV0aC1nb29nbGUtaWQtMTIzNDUiLCJpZCI6NywiZW1haWwiOiJ0ZXN0LWdvb2dsZUBleGFtcGxlLmNvbSIsIm5hbWUiOiLqtazquIDthYzsiqTtirjsgqzsmqnsnpAiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NDQ2Mjc5NywiZXhwIjoxNzQ1NjcyMzk3fQ.jgKHXPG7KKko2E1xemWg_7Vx2YtmvFmoXoLOPQGn9yFpEcB8vvib0EYIVtNjIalzHUOqB8rDIjBXoZULIVNG4A'
    // );
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 실패)
    if (error.response && error.response.status === 401) {
      // 토큰 만료 등의 이유로 로그아웃 처리
      console.log(error);
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// 이메일 인증 관련 API 함수들
export const emailAPI = {
  // 이메일 인증 코드 발송
  sendVerificationCode: async (email: string) => {
    const response = await apiClient.post(
      `/api/email/send`,
      {},
      {
        params: {
          email,
        },
      }
    );
    return response.data;
  },

  // 이메일 인증 코드 검증
  verifyCode: async (mail: string, verifyCode: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/email/verify`, {
      mail,
      verifyCode,
    });
    return response.data;
  },
};

// 인증 관련 API 함수들
export const authAPI = {
  // 로그인
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    // 응답 형식에 맞게 data.data.accessToken을 반환하도록 수정할 수 있습니다.
    // return response.data; // 기존 코드
    return response.data; // 예시: { code, message, data: { grantType, accessToken, refreshToken } }
  },

  // 회원가입 (POST /api/auth/join)
  join: async (joinData: {
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    console.log(joinData);
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/join`,
      joinData
    );
    return response.data; // API 응답 구조에 따라 반환값 조정
  },

  // 현재 사용자 정보 조회 (토큰 검증용)
  getCurrentUser: async () => {
    const response = await apiClient.get(`/api/profile/profile/me`);
    console.log('response', response);
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await apiClient.post(`/api/auth/logout`);
    return response.data;
  },
};

// 영화 관련 API 함수들
export const movieAPI = {
  // 영화 제목으로 검색
  searchByTitle: async (title: string) => {
    const response = await apiClient.get(`/api/movie/search/title`, {
      params: { title },
    });
    return response.data;
  },

  // 주간 박스오피스
  getWeeklyBoxOffice: async (
    targetDt: string,
    weekGb: number = 0,
    itemPerPage: number = 10
  ) => {
    const response = await apiClient.get(`/api/movie/weekly`, {
      params: { weekGb, itemPerPage },
    });
    return response.data;
  },

  // 영화 상세 정보 조회
  getMovieDetail: async (movieCd: string) => {
    const response = await apiClient.get(`/api/movie/detail`, {
      params: { movieCd },
    });
    return response.data;
  },

  // 영화 북마크(보고 싶은 영화 등록)
  bookmarkMovie: async (movieCd: string) => {
    const response = await apiClient.post(
      `/api/movie/bookmark`,
      {},
      {
        params: { movieCd },
      }
    );
    return response.data;
  },
};

// 프로필 관련 API 함수들
export const profileAPI = {
  // 닉네임 중복 검사
  checkNickname: async (nickname: string) => {
    const response = await apiClient.get(`/api/profile/check-nickname`, {
      params: { nickname },
    });
    return response.data;
  },

  // 프로필 정보 등록 (POST /api/profile/info)
  createInfo: async (profileData: ProfileData) => {
    const response = await apiClient.post(`/api/profile/info`, profileData);
    return response.data; // API 응답 구조에 따라 반환값 조정
  },

  // 프로필 정보 수정 (PUT /api/profile/info)
  updateProfileInfo: async (profileData: ProfileData) => {
    const response = await apiClient.put(`/api/profile/info`, profileData);
    return response.data;
  },

  // 내 프로필 조회
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get(`/api/profile/me`);
    return response.data;
  },

  // 프로필 상세 조회
  getProfileDetail: async (id: string) => {
    const response = await apiClient.get(`/api/profile/detail`, {
      params: { id },
    });
    return response.data;
  },

  // 프로필 이미지 업데이트 (PUT /api/profile/images)
  // 참고: UserProfilePage.tsx에서는 현재 이 함수 대신 직접 RcFile을 사용하는
  // updateProfileImageMutation을 정의하여 사용 중입니다.
  // 만약 이 함수를 사용하려면 UserProfilePage.tsx의 로직 수정이 필요합니다.
  updateProfileImage: async (profileImages: string[]) => {
    const response = await apiClient.put(`/api/profile/images`, {
      profileImages,
    });
    return response.data;
  },
};

// 관리자 관련 API 함수들
export const adminAPI = {
  // 오늘 매칭 수 조회
  getDailyMatches: async () => {
    const response = await apiClient.get(`/api/admin/daily-matches`);
    return response.data;
  },
};

// 사용자 관련 API 함수들
export const userAPI = {
  // 내가 좋아한 사용자 목록
  getLikedUsers: async (page: number, pageSize: number) => {
    const response = await apiClient.get(`/api/users/like`, {
      params: { page, pageSize },
    });
    return response.data;
  },
  // 나를 좋아한 사용자 목록
  getLikedMeUsers: async (page: number, pageSize: number) => {
    const response = await apiClient.get(`/api/users/liked`, {
      params: { page, pageSize },
    });
    return response.data;
  },
  // 사용자 좋아요
  likeUser: async (toUserId: number) => {
    const response = await apiClient.post(
      `/api/users/like`,
      {},
      {
        params: { toUserId },
      }
    );
    return response.data;
  },
  // 사용자 좋아요 취소
  unlikeUser: async (toUserId: number) => {
    const response = await apiClient.delete(`/api/users/like`, {
      params: { toUserId },
    });
    return response.data;
  },
};

// 매칭 관련 API 함수들
export const matchingAPI = {
  // 취향 기반 매칭
  getTasteBasedMatches: async () => {
    const response = await apiClient.get(`/api/matching/tags`);
    return response.data;
  },
  // 거리 기반 매칭
  getLocationBasedMatches: async () => {
    const response = await apiClient.get(`/api/matching/withinRadius`);
    return response.data;
  },
  // 보고 싶은 영화로 매칭
  getMovieWishMatch: async () => {
    const response = await apiClient.get(`/api/matching/movie`);
    return response.data;
  },
};

// 채팅 관련 API 함수들
export const chatAPI = {
  // 채팅룸 목록 조회
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await apiClient.get('/chat/rooms');
    return response.data;
  },

  // 채팅룸 생성
  createChatRoom: async (
    sender: string,
    receiver: string
  ): Promise<ChatRoom> => {
    const response = await apiClient.post(
      '/chat/rooms',
      {},
      {
        params: {
          sender,
          receiver,
        },
      }
    );
    return response.data;
  },

  // 특정 채팅룸의 메시지 조회
  getChatMessages: async (
    chatRoomId: string
  ): Promise<ChatMessagesResponse> => {
    const response = await apiClient.get(`/chat/rooms/${chatRoomId}/messages`);
    return response.data;
  },

  // 메시지 전송
  sendMessage: async (chatRoomId: string, message: string) => {
    const response = await apiClient.post(`/chat/rooms/${chatRoomId}/message`, {
      content: message,
    });
    return response.data;
  },
};
