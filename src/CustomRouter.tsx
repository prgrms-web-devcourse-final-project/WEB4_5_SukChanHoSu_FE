import DefaultLayout from './layouts/DefaultLayout';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Matching from './pages/Matching';
import Chat from './pages/Chat';
import Signup from './pages/auth/Signup';
import ChatDetail from './pages/ChatDetail';
import Profile from './pages/Profile';
import RequireAuth from './components/auth/RequireAuth';
import ProfileEdit from './pages/profile/ProfileEdit';
import TodayMatching from './pages/matching/TodayMatching';

function CustomRouter() {
  return (
    <DefaultLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/matching/today"
          element={
            <RequireAuth>
              <TodayMatching />
            </RequireAuth>
          }
        />
        <Route
          path="/matching"
          element={
            <RequireAuth>
              {/* <RequireProfile> */}
              <Matching />
              {/* </RequireProfile> */}
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              {/* <RequireProfile> */}
              <Chat />
              {/* </RequireProfile> */}
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <RequireAuth>
              {/* <RequireProfile> */}
              <ChatDetail />
              {/* </RequireProfile> */}
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              {/* <RequireProfile> */}
              <Profile />
              {/* </RequireProfile> */}
            </RequireAuth>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <ProfileEdit />
            </RequireAuth>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default CustomRouter;
