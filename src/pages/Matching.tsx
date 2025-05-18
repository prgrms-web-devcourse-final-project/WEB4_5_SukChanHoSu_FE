import styled from '@emotion/styled';
import { Card, Tabs, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Title from '../components/common/Title';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
`;

const StyledCard = styled(Card)`
  border-radius: 16px !important;
  width: 100%;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  border: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    border-color: #ff7f00;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const UserName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 8px 0;
`;

const GenreTag = styled.span`
  background-color: #ff7f00;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  margin: 0 4px 4px 0;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(255, 127, 0, 0.2);
`;

const UserIntroduce = styled.div`
  color: #666;
  margin-bottom: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const UserDistance = styled.div`
  color: #999;
  font-size: 0.8rem;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff7f00;
    margin-right: 6px;
  }
`;

const UserAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// 더미 데이터
const dummyUserLikes = [
  {
    userId: 1,
    nickName: '영화광123',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    favoriteGenres: ['ACTION', 'THRILLER'],
    introduce: '영화 보는 것을 좋아하는 직장인입니다.',
    distance: '3km',
    createdAt: '2025-05-18T06:13:07.113Z',
  },
  {
    userId: 2,
    nickName: '시네마러버',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    favoriteGenres: ['COMEDY', 'ROMANCE'],
    introduce: '코미디 영화 덕후!',
    distance: '1km',
    createdAt: '2025-05-18T06:13:07.113Z',
  },
];

const dummyLikedMe = [
  {
    userId: 3,
    nickName: '무비마니아',
    profileImage: 'https://randomuser.me/api/portraits/men/55.jpg',
    favoriteGenres: ['DRAMA', 'ACTION'],
    introduce: '드라마와 액션을 좋아해요.',
    distance: '2km',
    createdAt: '2025-05-18T06:13:07.113Z',
  },
];

function Matching() {
  return (
    <PageContainer>
      <Title>좋아요 관리</Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '내가 좋아요한 사람',
            children: (
              <>
                {dummyUserLikes.map((user) => (
                  <StyledCard key={user.userId}>
                    <CardContent>
                      <UserAvatar
                        src={user.profileImage}
                        size={64}
                        icon={<UserOutlined />}
                      />
                      <UserInfo>
                        <UserName>{user.nickName}</UserName>
                        <GenreContainer>
                          {user.favoriteGenres.map((genre, idx) => (
                            <GenreTag key={idx}>{genre}</GenreTag>
                          ))}
                        </GenreContainer>
                        <UserIntroduce>{user.introduce}</UserIntroduce>
                        <UserDistance>거리: {user.distance}</UserDistance>
                      </UserInfo>
                    </CardContent>
                  </StyledCard>
                ))}
              </>
            ),
          },
          {
            key: '2',
            label: '나를 좋아요한 사람',
            children: (
              <>
                {dummyLikedMe.map((user) => (
                  <StyledCard key={user.userId}>
                    <CardContent>
                      <UserAvatar
                        src={user.profileImage}
                        size={64}
                        icon={<UserOutlined />}
                      />
                      <UserInfo>
                        <UserName>{user.nickName}</UserName>
                        <GenreContainer>
                          {user.favoriteGenres.map((genre, idx) => (
                            <GenreTag key={idx}>{genre}</GenreTag>
                          ))}
                        </GenreContainer>
                        <UserIntroduce>{user.introduce}</UserIntroduce>
                        <UserDistance>거리: {user.distance}</UserDistance>
                      </UserInfo>
                    </CardContent>
                  </StyledCard>
                ))}
              </>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}

export default Matching;
