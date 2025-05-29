import React from 'react';
import { Row, Empty } from 'antd';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { profilesAtom } from '../store/atoms';
import ProfileCard from '../components/ProfileCard';

const HomeContainer = styled.div`
  padding: 0;
  background: #ffffff;
  min-height: 100vh;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .ant-empty-description {
    color: #8c8c8c;
    font-size: 16px;
    margin-top: 16px;
  }
`;

const HomePage: React.FC = () => {
  const profiles = useAtomValue(profilesAtom);
  const navigate = useNavigate();

  const handleCardClick = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <HomeContainer>
      {profiles.length > 0 ? (
        <Row gutter={[16, 16]}>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onCardClick={handleCardClick}
            />
          ))}
        </Row>
      ) : (
        <EmptyContainer>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div>추천할 프로필이 없습니다</div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#bbb',
                    marginTop: '8px',
                  }}
                >
                  잠시 후 다시 확인해보세요! 🎬
                </div>
              </div>
            }
          />
        </EmptyContainer>
      )}
    </HomeContainer>
  );
};

export default HomePage;
