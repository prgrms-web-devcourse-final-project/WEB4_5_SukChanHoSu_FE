import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Button, Spin, Alert, message } from 'antd';
import {
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAtom } from '../store/atoms';
import { profileAPI, userAPI, chatAPI } from '../api/client';

const { Title, Text, Paragraph } = Typography;

const DetailContainer = styled.div`
  padding: 0;
  min-height: 100vh;
  background: #fafafa;
`;

const CustomHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const HeaderBackButton = styled(Button)`
  &.ant-btn {
    background: transparent;
    border: 1px solid #f0f0f0;
    color: #595959;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #f5f5f5;
      border-color: #d9d9d9;
      color: #262626;
    }
  }
`;

const HeaderTitle = styled(Title)`
  &.ant-typography {
    margin: 0 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #262626;
    flex: 1;
  }
`;

const HeaderSection = styled.div`
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ContentSection = styled.div`
  padding: 24px 16px;
  margin-top: -50px;
  position: relative;
  z-index: 5;
`;

const ProfileCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;

  .ant-card-body {
    padding: 24px;
  }
`;

const ProfileName = styled(Title)`
  &.ant-typography {
    margin: 0 0 8px 0 !important;
    font-size: 28px !important;
    font-weight: 600 !important;
    color: #262626;
    text-align: center;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
`;

const LikeButton = styled(Button)<{ liked?: boolean }>`
  &.ant-btn {
    height: 48px;
    padding: 0 24px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px solid ${(props) => (props.liked ? '#ff4d4f' : '#ffebee')};
    background: ${(props) => (props.liked ? '#ff4d4f' : 'white')};
    color: ${(props) => (props.liked ? 'white' : '#ff4d4f')};
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 77, 79, 0.15);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 77, 79, 0.2);
      background: #ff4d4f !important;
      color: white !important;
      border: 2px solid #ff4d4f !important;
    }
  }
`;

const ChatButton = styled(Button)`
  &.ant-btn {
    height: 48px;
    padding: 0 24px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px solid #e6f7ff;
    background: white;
    color: #1890ff;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.2);
      color: white;
    }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;

  .anticon {
    color: #1890ff;
    font-size: 18px;
  }
`;

const MovieSection = styled.div`
  margin-top: 24px;
`;

const MovieTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const MovieTag = styled(Tag)`
  &.ant-tag {
    background: #f0f2f5;
    border: 1px solid #d9d9d9;
    color: #595959;
    border-radius: 12px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    margin: 2px;
  }
`;

const InterestTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const InterestTag = styled(Tag)`
  &.ant-tag {
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    color: #1890ff;
    border-radius: 12px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    margin: 2px;
  }
`;

const BestMovieCard = styled(Card)`
  background: linear-gradient(135deg, #fff9e6 0%, #fff2cc 100%);
  border: 1px solid #ffd666;
  border-radius: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(255, 214, 102, 0.15);

  .ant-card-body {
    padding: 20px;
  }
`;

const BestMovieContent = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const BestMovieDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const BestMovieHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .anticon {
    color: #fa8c16;
    font-size: 20px;
  }
`;

const BestMovieTitle = styled(Title)`
  &.ant-typography {
    margin: 0 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
    color: #d46b08;
  }
`;

const ProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useAtomValue(authAtom);
  const currentUserId = auth.user?.id || '';

  const [isLiked, setIsLiked] = useState(false);

  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile-detail', id],
    queryFn: () => profileAPI.getProfileDetail(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const likeMutation = useMutation({
    mutationFn: (toUserId: number) => userAPI.likeUser(toUserId),
    onSuccess: () => {
      setIsLiked(true);
      message.success('좋아요를 보냈습니다! 💕');
      queryClient.invalidateQueries({ queryKey: ['liked-users'] });
      queryClient.invalidateQueries({ queryKey: ['liked-me-users'] });
    },
    onError: (error) => {
      console.error('좋아요 실패:', error);
      message.error('좋아요에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (toUserId: number) => userAPI.unlikeUser(toUserId),
    onSuccess: () => {
      setIsLiked(false);
      message.success('좋아요를 취소했습니다.');
      queryClient.invalidateQueries({ queryKey: ['liked-users'] });
      queryClient.invalidateQueries({ queryKey: ['liked-me-users'] });
    },
    onError: (error) => {
      console.error('좋아요 취소 실패:', error);
      message.error('좋아요 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const createChatRoomMutation = useMutation({
    mutationFn: ({ sender, receiver }: { sender: string; receiver: string }) =>
      chatAPI.createChatRoom(sender, receiver),
    onSuccess: (chatRoom) => {
      console.log('채팅방 생성 성공:', chatRoom);
      message.success('채팅방이 생성되었습니다!');
      navigate(`/chat/${chatRoom.roomId}`);
    },
    onError: (error) => {
      console.error('채팅방 생성 실패:', error);
      message.error('채팅방 생성에 실패했습니다.');
    },
  });

  const profileData = profileResponse?.data;

  const getGenderText = (gender: string): string => {
    switch (gender.toLowerCase()) {
      case 'male':
        return '남성';
      case 'female':
        return '여성';
      default:
        return '기타';
    }
  };

  const handleChatClick = () => {
    if (!id || !currentUserId) {
      console.log('id', id);
      console.log('currentUserId', currentUserId);
      console.log('사용자 정보를 불러올 수 없습니다.');
      message.error('사용자 정보를 불러올 수 없습니다.');
      return;
    }
    createChatRoomMutation.mutate({
      sender: currentUserId,
      receiver: id,
    });
  };

  const handleLikeClick = () => {
    if (!id) return;
    const toUserId = Number(id);
    if (isLiked) {
      unlikeMutation.mutate(toUserId);
    } else {
      likeMutation.mutate(toUserId);
    }
  };

  if (isLoading) {
    return (
      <DetailContainer>
        <CustomHeader>
          <HeaderBackButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <HeaderTitle>프로필</HeaderTitle>
        </CustomHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            marginTop: '80px',
          }}
        >
          <Spin size="large" />
        </div>
      </DetailContainer>
    );
  }

  if (error || !profileData) {
    return (
      <DetailContainer>
        <CustomHeader>
          <HeaderBackButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <HeaderTitle>프로필</HeaderTitle>
        </CustomHeader>
        <div style={{ padding: '40px 16px', marginTop: '80px' }}>
          <Alert
            message="프로필을 불러올 수 없습니다"
            description={error?.message || '프로필 정보를 찾을 수 없습니다.'}
            type="error"
            showIcon
            action={<Button onClick={() => navigate(-1)}>돌아가기</Button>}
          />
        </div>
      </DetailContainer>
    );
  }

  const profileImage = 'https://placehold.co/200x200';

  return (
    <DetailContainer>
      <CustomHeader>
        <HeaderBackButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        />
        <HeaderTitle>프로필</HeaderTitle>
      </CustomHeader>

      <HeaderSection>
        <ProfileImage src={profileImage} alt={profileData.nickname} />
      </HeaderSection>

      <ContentSection>
        <ProfileCard>
          <ProfileName level={2}>{profileData.nickname}</ProfileName>

          <ActionButtons>
            <LikeButton
              liked={isLiked}
              icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLikeClick}
              loading={likeMutation.isPending || unlikeMutation.isPending}
              disabled={likeMutation.isPending || unlikeMutation.isPending}
            >
              {isLiked ? '좋아요 취소' : '좋아요'}
            </LikeButton>
            <ChatButton
              icon={<MessageOutlined />}
              onClick={handleChatClick}
              loading={createChatRoomMutation.isPending}
              disabled={createChatRoomMutation.isPending}
            >
              메시지 보내기
            </ChatButton>
          </ActionButtons>

          <InfoSection>
            <InfoItem>
              <UserOutlined />
              <Text strong>성별:</Text>
              <Text>{getGenderText(profileData.gender)}</Text>
            </InfoItem>
            <InfoItem>
              <CalendarOutlined />
              <Text strong>거리:</Text>
              <Text>{profileData.searchRadius}km</Text>
            </InfoItem>
          </InfoSection>

          {profileData.introduce && (
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                자기소개
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {profileData.introduce}
              </Paragraph>
            </div>
          )}

          {profileData.favoriteGenres &&
            profileData.favoriteGenres.length > 0 && (
              <MovieSection>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  선호하는 장르
                </Title>
                <MovieTags>
                  {profileData.favoriteGenres.map(
                    (genre: string, index: number) => (
                      <MovieTag key={index}>{genre}</MovieTag>
                    )
                  )}
                </MovieTags>
              </MovieSection>
            )}

          {profileData.lifeMovie && (
            <div style={{ marginTop: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                인생 영화
              </Title>
              <BestMovieCard>
                <BestMovieContent>
                  <BestMovieDetails>
                    <BestMovieHeader>
                      <TrophyOutlined />
                      <BestMovieTitle level={5}>
                        {profileData.lifeMovie}
                      </BestMovieTitle>
                    </BestMovieHeader>
                  </BestMovieDetails>
                </BestMovieContent>
              </BestMovieCard>
            </div>
          )}

          {profileData.watchedMovies &&
            profileData.watchedMovies.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  본 영화들
                </Title>
                <InterestTags>
                  {profileData.watchedMovies.map(
                    (movie: string, index: number) => (
                      <InterestTag key={index}>{movie}</InterestTag>
                    )
                  )}
                </InterestTags>
              </div>
            )}

          {profileData.preferredTheaters &&
            profileData.preferredTheaters.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={4} style={{ marginBottom: '12px' }}>
                  선호하는 극장
                </Title>
                <InterestTags>
                  {profileData.preferredTheaters.map(
                    (theater: string, index: number) => (
                      <InterestTag key={index}>{theater}</InterestTag>
                    )
                  )}
                </InterestTags>
              </div>
            )}
        </ProfileCard>
      </ContentSection>
    </DetailContainer>
  );
};

export default ProfileDetailPage;
