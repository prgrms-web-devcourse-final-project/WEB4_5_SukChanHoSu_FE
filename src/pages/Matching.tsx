import styled from '@emotion/styled';
import { Card, Button } from 'antd';
import {
  VideoCameraOutlined,
  HeartOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import Title from '../components/common/Title';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
`;

const StyledCard = styled(Card)`
  border-radius: 16px !important;
  width: 100%;
  margin-bottom: 16px;
  cursor: pointer;
  &:hover {
    border-color: #ff7f00;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: #ff7f00;
  margin-bottom: 16px;
`;

const cardData = [
  {
    key: 'today',
    title: '오늘 보고 싶은 영화 매칭',
    description:
      '오늘 당장 함께 볼 사람을 찾아보세요! 실시간 매칭으로 빠르게 만나요.',
    icon: <VideoCameraOutlined />,
    button: '오늘 영화 매칭',
  },
  {
    key: 'taste',
    title: '취향 기반 매칭',
    description:
      '내 영화 취향과 비슷한 상대를 추천해드려요. 대화가 잘 통하는 친구를 만나보세요.',
    icon: <HeartOutlined />,
    button: '취향 매칭',
  },
  {
    key: 'nearby',
    title: '가까운순 매칭',
    description:
      '내 주변에서 영화 볼 사람을 찾아보세요. 위치 기반으로 빠르게 연결!',
    icon: <EnvironmentOutlined />,
    button: '가까운 사람 찾기',
  },
];

function Matching() {
  return (
    <PageContainer>
      <Title>영화 취향 매칭</Title>
      <div style={{ width: '100%', maxWidth: 600 }}>
        {cardData.map((card) => (
          <StyledCard key={card.key}>
            <CardIcon>{card.icon}</CardIcon>
            <Card.Meta
              title={
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                  {card.title}
                </span>
              }
              description={
                <span style={{ color: '#888', fontSize: '1rem' }}>
                  {card.description}
                </span>
              }
            />
            <Button
              type="primary"
              size="large"
              style={{
                marginTop: 24,
                background: '#ff7f00',
                borderColor: '#ff7f00',
                width: '100%',
              }}
              block
            >
              {card.button}
            </Button>
          </StyledCard>
        ))}
      </div>
    </PageContainer>
  );
}

export default Matching;
