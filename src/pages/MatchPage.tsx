import React from 'react';
import { Card, Row, Col, Typography, Skeleton } from 'antd';
import {
  PlayCircleOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  RightOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../api/client';
import type { DailyMatchesResponse } from '../types';

const { Title, Text } = Typography;

const MatchContainer = styled.div`
  padding: 0;
  background: #ffffff;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const PageTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 8px 0 !important;
    font-size: 24px !important;
    font-weight: 700 !important;
    color: #262626;

    @media (max-width: 480px) {
      font-size: 20px !important;
    }
  }
`;

const PageSubtitle = styled(Text)`
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.5;
`;

const StatsSection = styled.div`
  margin: 24px 0;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hearts" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" text-anchor="middle" fill="rgba(255,255,255,0.1)" font-size="12">💕</text></pattern></defs><rect width="100" height="100" fill="url(%23hearts)"/></svg>');
    opacity: 0.2;
  }
`;

const StatsContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: white;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const StatIcon = styled.div`
  font-size: 18px;

  .anticon {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const MatchCard = styled(Card)`
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    border-color: #1890ff;
  }

  .ant-card-body {
    padding: 24px;

    @media (max-width: 480px) {
      padding: 20px;
    }
  }
`;

const CardIcon = styled.div<{ bgColor: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${(props) => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  .anticon {
    font-size: 24px;
    color: white;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 8px 0 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #262626;

    @media (max-width: 480px) {
      font-size: 16px !important;
    }
  }
`;

const CardDescription = styled(Text)`
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  display: block;
  margin-bottom: 16px;
`;

const ArrowIcon = styled(RightOutlined)`
  font-size: 16px;
  color: #bfbfbf;
  transition: all 0.3s ease;

  ${MatchCard}:hover & {
    color: #1890ff;
    transform: translateX(4px);
  }
`;

const MatchPage: React.FC = () => {
  const navigate = useNavigate();

  // 오늘 매칭 수 불러오기
  const { data, isLoading, isError } = useQuery<DailyMatchesResponse>({
    queryKey: ['daily-matches'],
    queryFn: adminAPI.getDailyMatches,
  });
  const todayMatches = !isError ? data?.data : undefined;

  const matchCategories = [
    {
      id: 'today-movie',
      title: '오늘 보고 싶은 영화 매칭',
      description:
        '같은 영화를 보고 싶어하는 사람들과 매칭되어 함께 영화를 즐겨보세요',
      icon: <PlayCircleOutlined />,
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/match/today-movie',
    },
    {
      id: 'taste-based',
      title: '취향 기반 매칭',
      description:
        '비슷한 영화 취향을 가진 사람들과 연결되어 새로운 인연을 만나보세요',
      icon: <HeartOutlined />,
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/match/taste-based',
    },
    {
      id: 'location-based',
      title: '가까운 순 매칭',
      description:
        '내 주변에 있는 사람들과 매칭되어 실제로 만날 수 있는 기회를 만들어보세요',
      icon: <EnvironmentOutlined />,
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/match/location-based',
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <MatchContainer>
      <PageHeader>
        <PageTitle level={2}>매칭 찾기</PageTitle>
        <PageSubtitle>다양한 방식으로 나와 맞는 사람을 찾아보세요</PageSubtitle>
      </PageHeader>

      <StatsSection>
        <StatsContent>
          <StatCard>
            <StatIcon>
              <HeartOutlined />
            </StatIcon>
            {isLoading ? (
              <Skeleton.Input active size="small" style={{ width: 40 }} />
            ) : (
              <StatNumber>{todayMatches ?? '-'}</StatNumber>
            )}
            <StatLabel>오늘 매칭된 커플</StatLabel>
          </StatCard>
        </StatsContent>
      </StatsSection>

      <Row gutter={[16, 16]}>
        {matchCategories.map((category) => (
          <Col xs={24} key={category.id}>
            <MatchCard onClick={() => handleCardClick(category.path)}>
              <CardHeader>
                <CardContent>
                  <CardIcon bgColor={category.bgColor}>
                    {category.icon}
                  </CardIcon>
                  <CardTitle level={4}>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <ArrowIcon />
              </CardHeader>
            </MatchCard>
          </Col>
        ))}
      </Row>
    </MatchContainer>
  );
};

export default MatchPage;
