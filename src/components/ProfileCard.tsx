import React from 'react';
import { Card, Col, Typography, Tag, Badge } from 'antd';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Profile } from '../types';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    border-color: #1890ff;
  }

  .ant-card-body {
    padding: 20px;
  }

  .ant-card-cover {
    position: relative;

    img {
      height: 280px;
      object-fit: cover;
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .ant-card-cover img {
      height: 240px;
    }

    .ant-card-body {
      padding: 16px;
    }
  }
`;

const DefaultImageContainer = styled.div`
  height: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 64px;

  @media (max-width: 480px) {
    height: 240px;
    font-size: 56px;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const ProfileName = styled(Title)`
  &.ant-typography {
    margin: 0 0 4px 0 !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #262626;

    @media (max-width: 480px) {
      font-size: 18px !important;
    }
  }
`;

const ProfileAge = styled(Text)`
  font-size: 16px;
  color: #8c8c8c;
  font-weight: 500;
`;

const ProfileDetails = styled.div`
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #595959;
  font-size: 14px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 8px;

  .anticon {
    color: #1890ff;
    font-size: 16px;
  }
`;

const IntroSection = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const IntroText = styled(Text)`
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  font-style: italic;
`;

const MovieTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const MovieTag = styled(Tag)`
  &.ant-tag {
    background: #667eea;
    border: none;
    color: white;
    border-radius: 12px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    margin: 2px;
  }
`;

const MatchBadge = styled(Badge)`
  position: absolute;
  top: 12px;
  left: 12px;

  .ant-badge-status-text {
    background: #52c41a;
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  }
`;

const NewBadge = styled(Badge)`
  position: absolute;
  top: 12px;
  right: 12px;

  .ant-badge-status-text {
    background: #1890ff;
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
`;

const DistanceTag = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`;

interface ProfileCardProps {
  profile: Profile;
  showMatchBadge?: boolean;
  showNewBadge?: boolean;
  onCardClick?: (profileId: number) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  showMatchBadge = false,
  showNewBadge = false,
  onCardClick,
}) => {
  const handleCardClickInternal = () => {
    if (onCardClick) {
      onCardClick(profile.id);
    }
  };

  const renderProfileImage = () => {
    if (profile.photo && profile.photo.trim() !== '') {
      return <img alt={profile.name} src={profile.photo} />;
    }
    return (
      <DefaultImageContainer>
        <UserOutlined />
      </DefaultImageContainer>
    );
  };

  return (
    <Col xs={24} sm={12} lg={8}>
      <StyledCard
        cover={
          <div style={{ position: 'relative' }}>
            {renderProfileImage()}
            {showMatchBadge && <MatchBadge status="success" text="매치!" />}
            {showNewBadge && <NewBadge status="processing" text="NEW" />}
            <DistanceTag>{profile.distance || '1.2km'}</DistanceTag>
          </div>
        }
        onClick={handleCardClickInternal}
      >
        <ProfileHeader>
          <ProfileName level={4}>{profile.name}</ProfileName>
          <ProfileAge>{profile.age}세</ProfileAge>
        </ProfileHeader>

        <ProfileDetails>
          <DetailItem>
            <EnvironmentOutlined />
            <Text>{profile.location}</Text>
          </DetailItem>
        </ProfileDetails>

        <IntroSection>
          <IntroText>
            {profile.introduction ||
              '안녕하세요! 영화를 좋아하는 사람입니다. 함께 영화 이야기를 나누고 싶어요 😊'}
          </IntroText>
        </IntroSection>

        <MovieTags>
          {profile.favoriteMovies.slice(0, 3).map((movie: string) => (
            <MovieTag key={movie}>{movie}</MovieTag>
          ))}
          {profile.favoriteMovies.length > 3 && (
            <MovieTag>+{profile.favoriteMovies.length - 3}</MovieTag>
          )}
        </MovieTags>
      </StyledCard>
    </Col>
  );
};

export default ProfileCard;
