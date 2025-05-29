import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Button } from 'antd';
import {
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import {
  profilesAtom,
  handleLikeAtom,
  handleUnlikeAtom,
  isLikedAtom,
  chatsAtom,
} from '../store/atoms';

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

const ProfileAge = styled(Text)`
  font-size: 18px;
  color: #8c8c8c;
  font-weight: 400;
  display: block;
  text-align: center;
  margin-bottom: 16px;
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

const BestMoviePoster = styled.img`
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  border: 2px solid #ffd666;

  @media (max-width: 480px) {
    width: 100px;
    height: 150px;
    align-self: center;
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

const BestMovieInfo = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const BestMovieDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8c6e00;
  font-size: 14px;
  font-weight: 500;

  &:not(:last-child)::after {
    content: '•';
    margin-left: 10px;
    color: #d48806;
  }
`;

const BestMovieReason = styled(Paragraph)`
  &.ant-typography {
    margin: 12px 0 0 0 !important;
    font-size: 15px !important;
    line-height: 1.6 !important;
    color: #595959;
    font-style: italic;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
    border-left: 3px solid #fa8c16;
  }
`;

const ProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profiles = useAtomValue(profilesAtom);
  const chats = useAtomValue(chatsAtom);
  const [, handleLike] = useAtom(handleLikeAtom);
  const [, handleUnlike] = useAtom(handleUnlikeAtom);
  const isLiked = useAtomValue(isLikedAtom);

  const profile = profiles.find((p) => p.id === Number(id));

  if (!profile) {
    return (
      <DetailContainer>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Title level={3}>프로필을 찾을 수 없습니다</Title>
          <Button onClick={() => navigate(-1)}>돌아가기</Button>
        </div>
      </DetailContainer>
    );
  }

  // 해당 사용자와의 채팅 찾기
  const findChatWithUser = (userId: number) => {
    return chats.find(
      (chat) =>
        chat.participants.includes(1) && chat.participants.includes(userId)
    );
  };

  const handleChatClick = () => {
    if (!profile) return;

    const existingChat = findChatWithUser(profile.id);
    if (existingChat) {
      navigate(`/chat/${existingChat.id}`);
    } else {
      // 새 채팅 생성 로직 (여기서는 기존 채팅으로만 이동)
      console.log('새 채팅 생성 필요');
    }
  };

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
        <ProfileImage src={profile.photo} alt={profile.name} />
      </HeaderSection>

      <ContentSection>
        <ProfileCard>
          <ProfileName level={2}>{profile.name}</ProfileName>
          <ProfileAge>{profile.age}세</ProfileAge>

          <ActionButtons>
            <LikeButton
              liked={isLiked(profile.id)}
              icon={isLiked(profile.id) ? <HeartFilled /> : <HeartOutlined />}
              onClick={() =>
                isLiked(profile.id)
                  ? handleUnlike(profile.id)
                  : handleLike(profile.id)
              }
            >
              {isLiked(profile.id) ? '좋아요 취소' : '좋아요'}
            </LikeButton>
            <ChatButton icon={<MessageOutlined />} onClick={handleChatClick}>
              메시지 보내기
            </ChatButton>
          </ActionButtons>

          <InfoSection>
            <InfoItem>
              <EnvironmentOutlined />
              <Text strong>위치:</Text>
              <Text>{profile.location}</Text>
            </InfoItem>
            <InfoItem>
              <UserOutlined />
              <Text strong>직업:</Text>
              <Text>{profile.job}</Text>
            </InfoItem>
            <InfoItem>
              <CalendarOutlined />
              <Text strong>상태:</Text>
              <Text style={{ color: profile.isOnline ? '#52c41a' : '#8c8c8c' }}>
                {profile.isOnline ? '온라인' : profile.lastSeen}
              </Text>
            </InfoItem>
          </InfoSection>

          {profile.bio && (
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                자기소개
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {profile.bio}
              </Paragraph>
            </div>
          )}

          <MovieSection>
            <Title level={4} style={{ marginBottom: '12px' }}>
              좋아하는 영화
            </Title>
            <MovieTags>
              {profile.favoriteMovies.map((movie) => (
                <MovieTag key={movie}>{movie}</MovieTag>
              ))}
            </MovieTags>
          </MovieSection>

          {profile.bestMovie && (
            <div style={{ marginTop: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                최고의 영화
              </Title>
              <BestMovieCard>
                <BestMovieContent>
                  <BestMoviePoster
                    src={profile.bestMovie.posterUrl}
                    alt={`${profile.bestMovie.title} 포스터`}
                  />

                  <BestMovieDetails>
                    <BestMovieHeader>
                      <TrophyOutlined />
                      <BestMovieTitle level={5}>
                        {profile.bestMovie.title}
                      </BestMovieTitle>
                    </BestMovieHeader>

                    <BestMovieInfo>
                      <BestMovieDetail>
                        {profile.bestMovie.year}년
                      </BestMovieDetail>
                      <BestMovieDetail>
                        {profile.bestMovie.genre}
                      </BestMovieDetail>
                    </BestMovieInfo>

                    <BestMovieReason>
                      "{profile.bestMovie.reason}"
                    </BestMovieReason>
                  </BestMovieDetails>
                </BestMovieContent>
              </BestMovieCard>
            </div>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                관심사
              </Title>
              <InterestTags>
                {profile.interests.map((interest) => (
                  <InterestTag key={interest}>{interest}</InterestTag>
                ))}
              </InterestTags>
            </div>
          )}
        </ProfileCard>
      </ContentSection>
    </DetailContainer>
  );
};

export default ProfileDetailPage;
