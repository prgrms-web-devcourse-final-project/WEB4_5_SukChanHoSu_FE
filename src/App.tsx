import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styled from '@emotion/styled';

import { useAtomValue, useAtom } from 'jotai';
import { authAtom, validateTokenAtom } from './store/atoms';

// 페이지 컴포넌트들
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import TasteBasedMatchPage from './pages/TasteBasedMatchPage';
import LocationBasedMatchPage from './pages/LocationBasedMatchPage';
import LikesPage from './pages/LikesPage';
import MatchPage from './pages/MatchPage';
import ChatListPage from './pages/ChatListPage';
import ChatDetailPage from './pages/ChatDetailPage';
import DefaultLayout from './layouts/DefaultLayout';
import TodayMovieMatchPage from './pages/TodayMovieMatchPage';
import MovieWishMatchPage from './pages/MovieWishMatchPage';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 인증된 사용자용 앱
const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MatchPage />} />
        <Route path="my-profile" element={<UserProfilePage />} />
        <Route path="profile/:id" element={<ProfileDetailPage />} />
        <Route path="match" element={<MatchPage />} />
        <Route path="match/today-movie" element={<TodayMovieMatchPage />} />
        <Route path="match/taste-based" element={<TasteBasedMatchPage />} />
        <Route
          path="match/location-based"
          element={<LocationBasedMatchPage />}
        />
        <Route path="match/movie-wish" element={<MovieWishMatchPage />} />
        <Route path="likes" element={<LikesPage />} />
        <Route path="chats" element={<ChatListPage />} />
        <Route path="chat/:roomId" element={<ChatDetailPage />} />
      </Route>
    </Routes>
  );
};

// 비인증 사용자용 앱
const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

// 로딩 화면 스타일
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
`;

// 메인 앱 라우터 컴포넌트
const AppRouter: React.FC = () => {
  const auth = useAtomValue(authAtom);
  const [, validateToken] = useAtom(validateTokenAtom);
  const [loading, setLoading] = useState(true);

  // 자동 로그인 처리
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('토큰 발견, 자동 로그인 시도중...');
          await validateToken();
          console.log('자동 로그인 성공');
        } else {
          console.log('저장된 토큰이 없음');
        }
      } catch (error) {
        console.error('자동 로그인 실패:', error);
        // 토큰이 유효하지 않으면 제거
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateToken]);

  return loading ? (
    <LoadingContainer>
      <LoadingContent>
        <Spin size="large" />
      </LoadingContent>
    </LoadingContainer>
  ) : auth.isAuthenticated ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
};

const App: React.FC = () => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={koKR}>
          <Router>
            <AppRouter />
          </Router>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
