import React from 'react';
import { Row, Typography, Button, Empty, Spin } from 'antd';
import { ArrowLeftOutlined, RadarChartOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { matchingAPI } from '../api/client';
import type {
  LocationBasedMatchResponse,
  LocationBasedMatchUser,
} from '../types';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  background: #ffffff;
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
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

const ResultsSection = styled.div`
  margin-bottom: 24px;
`;

const ResultsTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 16px 0 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #262626;
  }
`;

const LocationBasedMatchPage: React.FC = () => {
  const navigate = useNavigate();

  // 거리 기반 매칭 데이터 불러오기
  const { data, isLoading, isError } = useQuery<LocationBasedMatchResponse>({
    queryKey: ['location-based-matches'],
    queryFn: matchingAPI.getLocationBasedMatches,
  });
  const matches: LocationBasedMatchUser | null = data?.data || null;

  return (
    <PageContainer>
      <CustomHeader>
        <BackButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/match')}
        />
        <HeaderTitle level={4}>가까운 순 매칭</HeaderTitle>
      </CustomHeader>

      <ContentContainer>
        <HeroSection>
          <HeroTitle level={3}>내 주변 사람들을 만나보세요</HeroTitle>
          <HeroDescription>
            가까운 거리에 있는 사람들과 매칭되어
            <br />
            실제로 만날 수 있는 기회를 만들어보세요
          </HeroDescription>
        </HeroSection>

        <ResultsSection>
          <ResultsTitle level={4}>
            <RadarChartOutlined style={{ marginRight: 8 }} />
            거리 기반 사용자 ({matches === null ? 0 : 1}명)
          </ResultsTitle>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Spin size="large" />
            </div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Empty description="매칭 정보를 불러오지 못했습니다." />
            </div>
          ) : matches != null ? (
            <Row gutter={[16, 16]}>
              <ProfileCard
                key={matches.userId}
                profile={{
                  id: matches.userId,
                  name: matches.nickName,
                  age: 0,
                  location: '',
                  job: '',
                  favoriteMovies: [],
                  photo: matches.profileImages?.[0] || '',
                  isOnline: false,
                  lastSeen: '',
                  bio: matches.introduce,
                  distance: matches.distance,
                  introduction: matches.introduce,
                }}
                onCardClick={() => navigate(`/profile/${matches.userId}`)}
              />
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="조건에 맞는 사용자가 없습니다."
              />
            </div>
          )}
        </ResultsSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default LocationBasedMatchPage;
