import styled from '@emotion/styled';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const NavbarWrap = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #ff7f00;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

const LoginButton = styled(Button)`
  background-color: #ff7f00;
  border-color: #ff7f00;
  color: white;
  border-radius: 20px;
  padding: 0 16px;

  &:hover {
    background-color: #e67300;
    border-color: #e67300;
    color: white;
  }
`;

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <NavbarWrap>
      <Logo onClick={handleHomeClick}>MovieMatch</Logo>
      <div>
        <LoginButton
          type="primary"
          icon={<UserOutlined />}
          onClick={handleLoginClick}
        >
          로그인
        </LoginButton>
      </div>
    </NavbarWrap>
  );
}

export default Navbar;
