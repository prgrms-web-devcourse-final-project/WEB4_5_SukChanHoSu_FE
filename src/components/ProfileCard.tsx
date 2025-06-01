import React from 'react';
import { Card, Col, Typography, Tag, Badge, Button, message } from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import styled from '@emotion/styled';
import { Profile } from '../types';
import { chatAPI } from '../api/client';
import { authAtom } from '../store/atoms';

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

// const ProfileAge = styled(Text)`
//   font-size: 16px;
//   color: #8c8c8c;
//   font-weight: 500;
// `;

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

const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const MessageButton = styled(Button)`
  &.ant-btn {
    background: #1890ff;
    border-color: #1890ff;
    border-radius: 20px;
    height: 36px;
    padding: 0 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover,
    &:focus {
      background: #40a9ff;
      border-color: #40a9ff;
      transform: translateY(-1px);
    }

    .anticon {
      font-size: 14px;
    }
  }
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
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const currentUserId = auth.user?.id || '';

  // 채팅방 생성 mutation
  const createChatRoomMutation = useMutation({
    mutationFn: ({ sender, receiver }: { sender: string; receiver: string }) =>
      chatAPI.createChatRoom(sender, receiver),
    onSuccess: (chatRoom) => {
      console.log('채팅방 생성 성공:', chatRoom);
      message.success('채팅방이 생성되었습니다!');
      // 채팅 상세 페이지로 이동
      navigate(`/chat/${chatRoom.roomId}`);
    },
    onError: (error) => {
      console.error('채팅방 생성 실패:', error);
      message.error('채팅방 생성에 실패했습니다.');
    },
  });

  const handleCardClickInternal = () => {
    if (onCardClick) {
      onCardClick(profile.id);
    }
  };

  const handleSendMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!currentUserId) {
      message.error('로그인이 필요합니다.');
      return;
    }

    createChatRoomMutation.mutate({
      sender: currentUserId,
      receiver: profile.id.toString(),
    });
  };

  const renderProfileImage = () => {
    if (profile.photo && profile.photo.trim() !== '') {
      return <img alt={profile.name} src={'https://placehold.co/600x400'} />;
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
          {/* <ProfileAge>{profile.age}세</ProfileAge> */}
        </ProfileHeader>

        <ProfileDetails>
          <DetailItem>
            <EnvironmentOutlined />
            <Text>{profile.distance}</Text>
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

        <CardFooter>
          <MessageButton
            type="primary"
            icon={<MessageOutlined />}
            onClick={handleSendMessage}
            loading={createChatRoomMutation.isPending}
          >
            메시지 보내기
          </MessageButton>
        </CardFooter>
      </StyledCard>
    </Col>
  );
};

export default ProfileCard;
