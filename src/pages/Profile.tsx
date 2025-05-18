import styled from '@emotion/styled';
import { Avatar, Tag, Spin, Typography, Row, Col, Divider, Button } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { useMyProfile } from '../hooks/api/profile/useMyProfile';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background: #fff;
  padding: 40px 0;
`;

const ProfileContent = styled.div`
  max-width: 420px;
  width: 100%;
  border-radius: 18px;
  background: #fff;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
  width: 100%;
`;

const GenreTag = styled(Tag)`
  margin-bottom: 8px;
  font-size: 14px;
  border-radius: 16px;
  background: #fff7e6;
  color: #ff7f00;
  border: 1px solid #ff7f00;
`;

const MovieTag = styled(Tag)`
  margin-bottom: 8px;
  font-size: 14px;
  border-radius: 16px;
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #1890ff;
`;

const TheaterTag = styled(Tag)`
  margin-bottom: 8px;
  font-size: 14px;
  border-radius: 16px;
`;

function Profile() {
  const { isLoading } = useMyProfile();
  const navigate = useNavigate();

  // 더미 데이터 적용
  const data = {
    nickName: '영화광123',
    gender: 'Male',
    birthdate: '1990-01-01',
    introduce:
      '영화 보는 것을 좋아하는 직장인입니다. 주말에 같이 영화 볼 친구를 찾고 있어요!',
    lifeMovie: '인셉션',
    favoriteGenres: ['액션', '스릴러', '코미디'],
    watchedMovies: ['어벤져스', '인터스텔라', '기생충', '라라랜드'],
    preferredTheaters: ['CGV 용산', '메가박스 코엑스', '롯데시네마 월드타워'],
    searchRadius: 5,
    createdAt: '2023-05-18T05:07:19.249Z',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <Spin size="large" />
      </ProfileContainer>
    );
  }

  // if (isError) {
  //   return (
  //     <ProfileContainer>
  //       <Text type="danger">프로필 정보를 불러오지 못했습니다.</Text>
  //     </ProfileContainer>
  //   );
  // }

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <Avatar
            size={120}
            src={data.profileImage}
            icon={<UserOutlined />}
            style={{ border: '3px solid #ff7f00', background: '#fff7e6' }}
          />
          <Title
            level={3}
            style={{ textAlign: 'center', marginTop: 16, marginBottom: 0 }}
          >
            {data.nickName}
          </Title>
          <Text
            type="secondary"
            style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}
          >
            {data.gender === 'Male'
              ? '남성'
              : data.gender === 'Female'
              ? '여성'
              : data.gender}
            {' · '}
            {data.birthdate}
          </Text>
        </ProfileHeader>

        <Divider />

        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Text strong>자기소개</Text>
            <Paragraph style={{ marginBottom: 8 }}>
              {data.introduce || '소개글이 없습니다.'}
            </Paragraph>
          </Col>
          <Col span={24}>
            <Text strong>인생 영화</Text>
            <Paragraph style={{ marginBottom: 8 }}>
              {data.lifeMovie || '-'}
            </Paragraph>
          </Col>
          <Col span={24}>
            <Text strong>선호 장르</Text>
            <div>
              {data.favoriteGenres && data.favoriteGenres.length > 0 ? (
                data.favoriteGenres.map((genre) => (
                  <GenreTag key={genre}>{genre}</GenreTag>
                ))
              ) : (
                <Text type="secondary">선호 장르 없음</Text>
              )}
            </div>
          </Col>
          <Col span={24}>
            <Text strong>본 영화</Text>
            <div>
              {data.watchedMovies && data.watchedMovies.length > 0 ? (
                data.watchedMovies.map((movie, index) => (
                  <MovieTag key={index}>{movie}</MovieTag>
                ))
              ) : (
                <Text type="secondary">시청한 영화 없음</Text>
              )}
            </div>
          </Col>
          <Col span={24}>
            <Text strong>선호 극장</Text>
            <div>
              {data.preferredTheaters && data.preferredTheaters.length > 0 ? (
                data.preferredTheaters.map((theater, index) => (
                  <TheaterTag key={index} color="blue">
                    {theater}
                  </TheaterTag>
                ))
              ) : (
                <Text type="secondary">선호 극장 없음</Text>
              )}
            </div>
          </Col>
          <Col span={24}>
            <Text strong>위치 정보</Text>
            <Paragraph>검색 반경: {data.searchRadius}km</Paragraph>
          </Col>
          <Col span={24}>
            <Text strong>계정 정보</Text>
            <Paragraph>
              가입일: {new Date(data.createdAt).toLocaleDateString('ko-KR')}
            </Paragraph>
          </Col>
        </Row>

        <ButtonContainer>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
          >
            프로필 수정
          </Button>
          <Button
            type="default"
            icon={<LogoutOutlined />}
            danger
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </ButtonContainer>
      </ProfileContent>
    </ProfileContainer>
  );
}

export default Profile;
