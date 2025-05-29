import React from 'react';
import { Typography, Button, Empty, Spin, Row } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchingAPI } from '../api/client';
import ProfileCard from '../components/ProfileCard';

const { Title } = Typography;

// 응답 타입 정의
interface MovieWishMatchResponse {
  code: string;
  message: string;
  data: {
    userId: number;
    nickName: string;
    profileImages: string[];
    favoriteGenres: string[];
    introduce: string;
    distance: string;
    createdAt: string;
  };
}

const PageContainer = styled.div`
  background: #fff;
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
const BackButton = styled(Button)`
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
const ContentContainer = styled.div`
  padding: 16px;
`;

const MovieWishMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery<MovieWishMatchResponse>({
    queryKey: ['movie-wish-match'],
    queryFn: matchingAPI.getMovieWishMatch,
  });
  const user = data?.data;
  console.log(user);

  // 장르를 한국어로 변환하는 함수
  const translateGenre = (genre: string): string => {
    const genreMap: { [key: string]: string } = {
      ACTION: '액션',
      COMEDY: '코미디',
      DRAMA: '드라마',
      HORROR: '호러',
      ROMANCE: '로맨스',
      THRILLER: '스릴러',
      FANTASY: '판타지',
      ANIMATION: '애니메이션',
      DOCUMENTARY: '다큐멘터리',
      CRIME: '범죄',
    };
    return genreMap[genre] || genre;
  };

  return (
    <PageContainer>
      <CustomHeader>
        <BackButton icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        <HeaderTitle level={4}>보고 싶은 영화로 매칭</HeaderTitle>
      </CustomHeader>
      <ContentContainer>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              매칭 정보를 불러오고 있습니다...
            </div>
          </div>
        ) : isError || !user ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Empty description="추천할 사용자가 없습니다." />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <ProfileCard
              profile={{
                id: user.userId,
                name: user.nickName,
                age: 0, // 나이 정보가 없으므로 0으로 설정
                location: user.distance || '알 수 없음',
                job: '', // 직업 정보가 없으므로 빈 문자열
                favoriteMovies: user.favoriteGenres?.map(translateGenre) || [],
                photo: user.profileImages?.[0] || '',
                isOnline: false,
                lastSeen: '',
                bio: user.introduce || '',
                distance: user.distance || '',
                introduction:
                  user.introduce || '안녕하세요! 함께 영화를 보고 싶어요 🎬',
              }}
              showMatchBadge={true}
              onCardClick={(profileId) => navigate(`/profile/${profileId}`)}
            />
          </Row>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MovieWishMatchPage;
