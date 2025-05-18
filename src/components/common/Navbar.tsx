import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

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

const BackButton = styled.div`
  font-size: 18px;
  color: #333;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    color: #ff7f00;
  }
`;

interface NavbarProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

function Navbar({ showBackButton = false, onBackClick }: NavbarProps) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <NavbarWrap>
      {showBackButton ? (
        <BackButton onClick={handleBackClick}>
          <ArrowLeftOutlined />
        </BackButton>
      ) : (
        <Logo onClick={handleHomeClick}>MovieMatch</Logo>
      )}
    </NavbarWrap>
  );
}

export default Navbar;
