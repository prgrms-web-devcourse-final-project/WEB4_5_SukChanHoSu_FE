import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider, useAtomValue } from 'jotai';
import { authAtom } from './store/atoms';
import LikesPage from './pages/LikesPage';
import MatchPage from './pages/MatchPage';
import TodayMovieMatchPage from './pages/TodayMovieMatchPage';
import TasteBasedMatchPage from './pages/TasteBasedMatchPage';
import LocationBasedMatchPage from './pages/LocationBasedMatchPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import ChatDetailPage from './pages/ChatDetailPage';
import ChatListPage from './pages/ChatListPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DefaultLayout from './layouts/DefaultLayout';
import MovieWishMatchPage from './pages/MovieWishMatchPage';

// 깔끔한 화이트 톤 테마 설정
const cleanWhiteTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#f0f0f0',
    colorBorderSecondary: '#f5f5f5',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 1px 4px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      headerBg: '#ffffff',
      bodyPadding: 20,
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
    },
    Tabs: {
      inkBarColor: '#1890ff',
      itemActiveColor: '#1890ff',
      itemHoverColor: '#40a9ff',
      itemSelectedColor: '#1890ff',
    },
    Tag: {
      borderRadius: 6,
      fontWeight: 400,
    },
  },
};

// 인증된 사용자를 위한 메인 앱 컴포넌트
const AuthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MatchPage />} />
        <Route path="likes" element={<LikesPage />} />
        <Route path="match" element={<MatchPage />} />
        <Route path="match/today-movie" element={<TodayMovieMatchPage />} />
        <Route path="match/taste-based" element={<TasteBasedMatchPage />} />
        <Route
          path="match/location-based"
          element={<LocationBasedMatchPage />}
        />
        <Route path="match/movie-wish" element={<MovieWishMatchPage />} />
        <Route path="chats" element={<ChatListPage />} />
        <Route path="profile/:id" element={<ProfileDetailPage />} />
        <Route path="my-profile" element={<UserProfilePage />} />
        <Route path="chat/:chatId" element={<ChatDetailPage />} />
      </Route>
    </Routes>
  );
};

// 인증되지 않은 사용자를 위한 인증 앱 컴포넌트
const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

// 메인 앱 라우터 컴포넌트
const AppRouter: React.FC = () => {
  const auth = useAtomValue(authAtom);
  console.log(auth);
  return auth.isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

function App() {
  return (
    <ConfigProvider theme={cleanWhiteTheme}>
      <Provider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
