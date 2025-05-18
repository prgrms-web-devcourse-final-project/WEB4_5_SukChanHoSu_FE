import styled from '@emotion/styled';
import { Card, Avatar, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
import Navbar from '../../components/common/Navbar';

// type MatchedUser = {
//   userId: number;
//   nickName: string;
//   profileImage: string;
//   favoriteGenres: string[];
//   introduce: string;
//   distance: string;
//   createdAt: string;
// };

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
`;

const Title = styled.h2`
  flex: 1;
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const UserCard = styled(Card)`
  width: 100%;
  border-radius: 16px !important;
  margin-bottom: 16px;
`;

const GenreTag = styled.span`
  background-color: #ff7f00;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  margin: 4px;
  font-size: 0.8rem;
`;

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

function TodayMatching() {
  // const [, setIsMatching] = useState(false);
  // const [, setMatchedUser] = useState<MatchedUser | null>(null);
  // const [, setLoading] = useState(false);

  // 매칭 시작 함수
  // const startMatching = () => {
  //   setLoading(true);
  //   setIsMatching(true);

  //   // 실제로는 API 호출이 필요하지만, 여기서는 예시 데이터를 사용
  //   setTimeout(() => {
  //     const matchData = {
  //       userId: 9007199254740991,
  //       nickName: '영화광123',
  //       profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  //       favoriteGenres: ['ACTION', 'THRILLER', 'COMEDY'],
  //       introduce:
  //         '영화 보는 것을 좋아하는 직장인입니다. 주말에 같이 영화 볼 친구를 찾고 있어요!',
  //       distance: '3km',
  //       createdAt: '2025-05-18T05:07:19.249Z',
  //     };

  //     setMatchedUser(matchData);
  //     setLoading(false);
  //   }, 2000);
  // };

  return (
    <>
      <Navbar />
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
                    <UserCard key={user.userId}>
                      <Card.Meta
                        avatar={
                          <Avatar
                            src={user.profileImage}
                            size={64}
                            icon={<UserOutlined />}
                          />
                        }
                        title={user.nickName}
                        description={
                          <>
                            <div style={{ margin: '8px 0' }}>
                              {user.favoriteGenres.map((genre, idx) => (
                                <GenreTag key={idx}>{genre}</GenreTag>
                              ))}
                            </div>
                            <div style={{ color: '#888', marginBottom: 4 }}>
                              {user.introduce}
                            </div>
                            <div style={{ color: '#aaa', fontSize: 12 }}>
                              거리: {user.distance}
                            </div>
                          </>
                        }
                      />
                    </UserCard>
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
                    <UserCard key={user.userId}>
                      <Card.Meta
                        avatar={
                          <Avatar
                            src={user.profileImage}
                            size={64}
                            icon={<UserOutlined />}
                          />
                        }
                        title={user.nickName}
                        description={
                          <>
                            <div style={{ margin: '8px 0' }}>
                              {user.favoriteGenres.map((genre, idx) => (
                                <GenreTag key={idx}>{genre}</GenreTag>
                              ))}
                            </div>
                            <div style={{ color: '#888', marginBottom: 4 }}>
                              {user.introduce}
                            </div>
                            <div style={{ color: '#aaa', fontSize: 12 }}>
                              거리: {user.distance}
                            </div>
                          </>
                        }
                      />
                    </UserCard>
                  ))}
                </>
              ),
            },
          ]}
        />
      </PageContainer>
    </>
  );
}

export default TodayMatching;
