import axios, { AxiosInstance } from 'axios';

// API 기본 URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; // 빈 문자열로 설정

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
