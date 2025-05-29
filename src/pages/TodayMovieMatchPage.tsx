import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Tag, Empty, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../api/client';
import type { BoxOfficeMovie } from '../types';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  background: #ffffff;
  min-height: 100vh;
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

const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  text-align: center;
`;

const HeroTitle = styled(Title)`
  &.ant-typography {
    color: white !important;
    margin: 0 0 8px 0 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
  }
`;

const HeroDescription = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 12px 0 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #262626;
  }
`;

const MovieCard = styled(Card)`
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MovieHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MoviePoster = styled.div`
  width: 60px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon {
    font-size: 24px;
    color: white;
  }
`;

const MovieDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 8px 0 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #262626;
  }
`;

const MovieMetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;

  .anticon {
    font-size: 12px;
  }
`;

const WantToWatchCount = styled.div`
  background: #f0f2f5;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #595959;
  font-weight: 500;
  text-align: center;
  align-self: flex-start;
`;

const TodayMovieMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [boxOfficeMovies, setBoxOfficeMovies] = useState<BoxOfficeMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 현재 날짜를 YYYYMMDD 형식으로 변환
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // 박스오피스 데이터 가져오기
  const fetchBoxOfficeData = async () => {
    setIsLoading(true);
    try {
      const targetDt = getCurrentDate();
      const response = await movieAPI.getWeeklyBoxOffice(targetDt, 0, 10);
      setBoxOfficeMovies(response.data || []);
    } catch (error) {
      console.error('박스오피스 데이터 가져오기 실패:', error);
      setBoxOfficeMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxOfficeData();
  }, []);

  // 영화 카드 클릭 시 바로 등록
  const handleMovieClick = async (movie: BoxOfficeMovie) => {
    try {
      await movieAPI.bookmarkMovie(movie.movieCd);
      navigate('/match/movie-wish');
    } catch {
      alert('등록에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <PageContainer>
      <CustomHeader>
        <BackButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/match')}
        />
        <HeaderTitle level={4}>오늘 보고 싶은 영화 매칭</HeaderTitle>
      </CustomHeader>

      <ContentContainer>
        <HeroSection>
          <HeroTitle level={3}>오늘 함께 영화 보실래요?</HeroTitle>
          <HeroDescription>
            같은 영화를 보고 싶어하는 사람들과 매칭되어
            <br />
            함께 영화관에서 즐거운 시간을 보내보세요
          </HeroDescription>
        </HeroSection>

        <FilterSection>
          <FilterTitle level={4}>오늘 상영 중인 인기 영화</FilterTitle>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                영화 정보를 불러오고 있습니다...
              </div>
            </div>
          ) : boxOfficeMovies.length > 0 ? (
            boxOfficeMovies.map((movie) => (
              <MovieCard
                key={movie.movieCd}
                onClick={() => handleMovieClick(movie)}
              >
                <MovieInfo>
                  <MovieHeader>
                    <MoviePoster>
                      {movie.posterUrl &&
                      movie.posterUrl !== '포스터 정보 없음' ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.movieNm}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.setAttribute(
                              'style',
                              'display: flex'
                            );
                          }}
                        />
                      ) : null}
                      <PlayCircleOutlined
                        style={{
                          display:
                            movie.posterUrl &&
                            movie.posterUrl !== '포스터 정보 없음'
                              ? 'none'
                              : 'flex',
                        }}
                      />
                    </MoviePoster>
                    <MovieDetails>
                      <MovieTitle level={5}>{movie.movieNm}</MovieTitle>
                      <Tag color="blue">박스오피스 {movie.rank}위</Tag>
                    </MovieDetails>
                  </MovieHeader>

                  <MovieMetaContainer>
                    <MovieMeta>
                      <MetaItem>
                        <ClockCircleOutlined />
                        누적 관객수: {movie.audiAcc}명
                      </MetaItem>
                    </MovieMeta>
                    <MovieMeta>
                      <MetaItem>
                        <EnvironmentOutlined />
                        전국 영화관에서 상영 중
                      </MetaItem>
                    </MovieMeta>
                  </MovieMetaContainer>

                  <WantToWatchCount>
                    {Math.floor(Math.random() * 20) + 5}명이 보고싶어해요
                  </WantToWatchCount>
                </MovieInfo>
              </MovieCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="오늘 상영 중인 영화가 없습니다"
              />
            </div>
          )}
        </FilterSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default TodayMovieMatchPage;
