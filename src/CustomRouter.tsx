import DefaultLayout from './layouts/DefaultLayout';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Matching from './pages/Matching';
import Chat from './pages/Chat';
import Signup from './pages/auth/Signup';
import ChatDetail from './pages/ChatDetail';
function CustomRouter() {
  return (
    <DefaultLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
      </Routes>
    </DefaultLayout>
  );
}

export default CustomRouter;
