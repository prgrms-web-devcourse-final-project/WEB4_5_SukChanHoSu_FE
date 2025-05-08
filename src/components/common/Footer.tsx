import styled from '@emotion/styled';
import {
  HomeOutlined,
  MessageOutlined,
  HeartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const FooterWrap = styled.div`
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  color: #8c8c8c;

  &.active {
    color: #ff7f00;
  }
`;

const IconText = styled.span`
  font-size: 12px;
  margin-top: 4px;
`;

function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <FooterWrap>
      <NavItem onClick={() => handleNavigation('/')}>
        <HomeOutlined style={{ fontSize: '20px' }} />
        <IconText>홈</IconText>
      </NavItem>
      <NavItem onClick={() => handleNavigation('/chat')}>
        <MessageOutlined style={{ fontSize: '20px' }} />
        <IconText>메시지</IconText>
      </NavItem>
      <NavItem onClick={() => handleNavigation('/matching')}>
        <HeartOutlined style={{ fontSize: '20px' }} />
        <IconText>매칭</IconText>
      </NavItem>
      <NavItem onClick={() => handleNavigation('/profile')}>
        <UserOutlined style={{ fontSize: '20px' }} />
        <IconText>프로필</IconText>
      </NavItem>
    </FooterWrap>
  );
}

export default Footer;
