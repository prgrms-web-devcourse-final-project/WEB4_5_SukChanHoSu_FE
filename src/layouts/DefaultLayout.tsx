import styled from '@emotion/styled';
import { Layout, Typography, Badge } from 'antd';
import {
  SearchOutlined,
  HeartOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

// Emotion Styled Components
const MobileLayout = styled(Layout)`
  min-height: 100vh;
  background: #ffffff;

  .ant-layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 0;
    height: auto;
    line-height: normal;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-layout-content {
    margin-top: 64px;
    margin-bottom: 70px;
    padding: 16px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #ffffff;
  }

  @media (max-width: 480px) {
    .ant-layout-content {
      margin-top: 56px;
      margin-bottom: 65px;
      padding: 12px;
    }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  max-width: 100%;

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const AppTitle = styled(Title)`
  &.ant-typography {
    color: #262626 !important;
    margin: 0 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;

    @media (max-width: 480px) {
      font-size: 18px !important;

      &::before {
        font-size: 16px;
      }
    }
  }
`;

// const HeaderActions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const MenuButton = styled(Button)`
//   &.ant-btn {
//     background: transparent;
//     border: none;
//     color: #595959;
//     box-shadow: none;
//     padding: 8px;
//     height: auto;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     &:hover,
//     &:focus {
//       background: #f5f5f5;
//       color: #262626;
//       transform: scale(1.05);
//     }

//     .anticon {
//       font-size: 18px;
//     }
//   }
// `;

// const NotificationButton = styled(Button)`
//   &.ant-btn {
//     background: transparent;
//     border: none;
//     color: #595959;
//     box-shadow: none;
//     padding: 8px;
//     height: auto;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     &:hover,
//     &:focus {
//       background: #f5f5f5;
//       color: #262626;
//       transform: scale(1.05);
//     }

//     .anticon {
//       font-size: 16px;
//     }
//   }
// `;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 480px) {
    padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 60px;
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  .anticon {
    font-size: 20px;
    margin-bottom: 4px;
    color: ${(props) => (props.active ? '#1890ff' : '#bdbdbd')};
    transition: all 0.3s ease;

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  &:hover .anticon {
    color: #1890ff;
    transform: scale(1.1);
  }

  .nav-label {
    font-size: 11px;
    font-weight: 500;
    color: ${(props) => (props.active ? '#1890ff' : '#8c8c8c')};
    transition: color 0.3s ease;

    @media (max-width: 480px) {
      font-size: 10px;
    }
  }

  &:hover .nav-label {
    color: ${(props) => (props.active ? '#1890ff' : '#595959')};
  }

  ${(props) =>
    props.active &&
    `
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: #1890ff;
      border-radius: 0 0 3px 3px;
    }
  `}
`;

function DefaultLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/match')) return 'search';
    if (path === '/likes') return 'likes';
    if (path === '/chats') return 'chat';
    if (path === '/my-profile') return 'profile';
    return 'home';
  };

  const handleNavClick = (key: string) => {
    switch (key) {
      case 'home':
        navigate('/');
        break;
      case 'search':
        navigate('/match');
        break;
      case 'likes':
        navigate('/likes');
        break;
      case 'chat':
        navigate('/chats');
        break;
      case 'profile':
        navigate('/my-profile');
        break;
    }
  };

  return (
    <MobileLayout>
      <Header>
        <HeaderContent>
          <AppTitle level={3}>MovieMatch</AppTitle>
        </HeaderContent>
      </Header>

      <Content>
        <Outlet />
      </Content>

      <BottomNavigation>
        {/* <NavItem
          active={getActiveTab() === 'home'}
          onClick={() => handleNavClick('home')}
        >
          <HomeOutlined />
          <span className="nav-label">홈</span>
        </NavItem> */}

        <NavItem
          active={getActiveTab() === 'search'}
          onClick={() => handleNavClick('search')}
        >
          <SearchOutlined />
          <span className="nav-label">탐색</span>
        </NavItem>

        <NavItem
          active={getActiveTab() === 'likes'}
          onClick={() => handleNavClick('likes')}
        >
          <HeartOutlined />
          <span className="nav-label">좋아요</span>
        </NavItem>

        <NavItem
          active={getActiveTab() === 'chat'}
          onClick={() => handleNavClick('chat')}
        >
          <Badge count={2} size="small">
            <MessageOutlined />
          </Badge>
          <span className="nav-label">채팅</span>
        </NavItem>

        <NavItem
          active={getActiveTab() === 'profile'}
          onClick={() => handleNavClick('profile')}
        >
          <UserOutlined />
          <span className="nav-label">프로필</span>
        </NavItem>
      </BottomNavigation>
    </MobileLayout>
  );
}

export default DefaultLayout;
