import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Divider,
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  message,
  Space,
  List,
  Image,
  Spin,
} from 'antd';
import {
  EditOutlined,
  UserOutlined,
  HeartOutlined,
  StarOutlined,
  LogoutOutlined,
  CameraOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import { authAtom, logoutAtom } from '../store/atoms';
import { useNavigate } from 'react-router-dom';
import { movieAPI, profileAPI } from '../api/client';
import { useQuery } from '@tanstack/react-query';
import type { MovieSearchResult, ProfileResponse } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ProfileContainer = styled.div`
  background: #ffffff;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 24px;
  color: white;
  position: relative;
`;

const ProfileAvatar = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
`;

const AvatarUploadButton = styled(Button)`
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #f5f5f5;
    border-color: #f5f5f5;
  }
`;

const UserName = styled(Title)`
  &.ant-typography {
    color: white !important;
    margin: 0 0 8px 0 !important;
    font-size: 24px !important;
    font-weight: 600 !important;
  }
`;

const UserInfo = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
`;

const InfoCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  .ant-card-body {
    padding: 20px 24px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
  font-weight: 500;
`;

const InfoValue = styled(Text)`
  color: #262626;
  font-size: 14px;
  font-weight: 400;
`;

const GenreTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const GenreTag = styled(Tag)`
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid #1890ff;
  background: #f0f8ff;
  color: #1890ff;
`;

const BestMovieCard = styled.div`
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  color: #262626;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const BestMoviePoster = styled.div`
  flex-shrink: 0;
`;

const BestMovieContent = styled.div`
  flex: 1;
`;

const MovieTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MovieDetails = styled.div`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const EditButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
`;

const LogoutButton = styled(Button)`
  flex: 1;
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
  background: #ff4d4f;
  border-color: #ff4d4f;

  &:hover {
    background: #ff7875 !important;
    border-color: #ff7875 !important;
  }
`;

const MobileMovieItem = styled.div`
  @media (max-width: 768px) {
    .ant-list-item {
      flex-direction: column !important;
      align-items: flex-start !important;

      .ant-list-item-meta {
        width: 100% !important;
        margin-bottom: 12px !important;

        .ant-list-item-meta-content {
          margin-left: 0 !important;
          margin-top: 8px !important;
        }
      }

      .ant-list-item-action {
        margin-left: 0 !important;
        width: 100% !important;

        li {
          width: 100% !important;

          button {
            width: 100% !important;
          }
        }
      }
    }
  }
`;

const SelectedMoviePreview = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const [, logout] = useAtom(logoutAtom);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // react-query로 프로필 데이터 로드
  const { data, isLoading: isLoadingProfile } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });
  const profileData = data?.data;

  // 영화 검색 관련 상태
  const [isMovieSearchVisible, setIsMovieSearchVisible] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');
  const [movieSearchResults, setMovieSearchResults] = useState<
    MovieSearchResult[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(
    null
  );

  const genres = [
    '로맨스',
    '액션',
    '코미디',
    '드라마',
    '스릴러',
    'SF',
    '판타지',
    '애니메이션',
    '공포',
    '다큐멘터리',
    '뮤지컬',
    '범죄',
  ];

  const movieGenres = [
    '로맨스',
    '액션',
    '코미디',
    '드라마',
    '스릴러',
    'SF',
    '판타지',
    '애니메이션',
    '공포',
    '다큐멘터리',
    '뮤지컬',
    '범죄',
    '가족',
    '모험',
    '전쟁',
    '서부',
    '느와르',
  ];

  // 생년월일로부터 나이 계산
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // 성별 변환 함수
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'Male':
        return '남성';
      case 'Female':
        return '여성';
      case 'Other':
        return '기타';
      default:
        return '미설정';
    }
  };

  // 영화 검색 함수
  const handleMovieSearch = async (query: string) => {
    if (!query.trim()) {
      setMovieSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await movieAPI.searchByTitle(query);
      setMovieSearchResults(response.data || []);
    } catch (error) {
      console.error('영화 검색 오류:', error);
      message.error('영화 검색에 실패했습니다.');
      setMovieSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEdit = () => {
    if (profileData) {
      form.setFieldsValue({
        nickname: profileData.nickname,
        age: calculateAge(profileData.birthdate),
        gender: profileData.gender,
        favoriteGenres: profileData.favoriteGenres,
        bio: profileData.introduce,
        lifeMovie: profileData.lifeMovie,
      });

      // 기존 인생 영화가 있다면 selectedMovie로 설정
      if (profileData.lifeMovie) {
        setSelectedMovie({
          movieId: 0, // 임시 ID
          title: profileData.lifeMovie,
          description: '',
          releaseDate: new Date().getFullYear() + '-01-01',
          director: '',
          genres: [],
          genresRaw: '',
          posterImage: '',
          rating: '0',
        });
      }

      setIsEditModalVisible(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await form.validateFields();
      // 실제로는 API 호출하여 사용자 정보 업데이트
      message.success('프로필이 업데이트되었습니다!');
      setIsEditModalVisible(false);
      setSelectedMovie(null);
    } catch {
      // 유효성 검사 실패
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: '로그아웃',
      content: '정말 로그아웃하시겠습니까?',
      okText: '로그아웃',
      cancelText: '취소',
      onOk: () => {
        logout();
        navigate('/login');
        message.success('로그아웃되었습니다.');
      },
    });
  };

  const handleMovieSelect = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    form.setFieldsValue({
      lifeMovie: {
        title: movie.title,
        year: new Date(movie.releaseDate).getFullYear(),
        genre: movie.genres[0] || '',
        reason: form.getFieldValue(['lifeMovie', 'reason']) || '',
        posterImage: movie.posterImage,
      },
    });
    setIsMovieSearchVisible(false);
    setMovieSearchQuery('');
    setMovieSearchResults([]);
    message.success(`"${movie.title}"이(가) 선택되었습니다.`);
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedMovie(null);
  };

  if (!auth.user) {
    return null;
  }

  // 로딩 중일 때
  if (isLoadingProfile) {
    return (
      <ProfileContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Spin size="large" />
        </div>
      </ProfileContainer>
    );
  }

  // 프로필 데이터가 없을 때
  if (!profileData) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>프로필 정보를 불러올 수 없습니다.</Text>
          <br />
          <Button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16 }}
          >
            다시 시도
          </Button>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>
          <Avatar
            size={80}
            src={profileData.profileImages?.[0]}
            icon={<UserOutlined />}
          />
          <AvatarUploadButton icon={<CameraOutlined />} size="small" />
        </ProfileAvatar>
        <UserName level={3}>{profileData.nickname}</UserName>
        <UserInfo>
          @{profileData.nickname} • {calculateAge(profileData.birthdate)}세
        </UserInfo>
      </ProfileHeader>

      <InfoCard
        title={
          <Space>
            <UserOutlined />
            기본 정보
          </Space>
        }
      >
        <InfoRow>
          <InfoLabel>이메일</InfoLabel>
          <InfoValue>{profileData.email}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>성별</InfoLabel>
          <InfoValue>{getGenderText(profileData.gender)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>자기소개</InfoLabel>
          <InfoValue>
            {profileData.introduce || '자기소개가 없습니다.'}
          </InfoValue>
        </InfoRow>
      </InfoCard>

      <InfoCard
        title={
          <Space>
            <HeartOutlined />
            영화 취향
          </Space>
        }
      >
        <InfoLabel>선호 장르</InfoLabel>
        <GenreTagsContainer>
          {profileData.favoriteGenres.map((genre) => (
            <GenreTag key={genre}>{genre}</GenreTag>
          ))}
        </GenreTagsContainer>

        {profileData.lifeMovie && (
          <BestMovieCard>
            <BestMoviePoster>
              <div
                style={{
                  width: 80,
                  height: 120,
                  background: 'rgba(139, 69, 19, 0.2)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
              >
                🎬
              </div>
            </BestMoviePoster>
            <BestMovieContent>
              <MovieTitle>
                <StarOutlined />
                {profileData.lifeMovie}
              </MovieTitle>
              <MovieDetails>인생 영화</MovieDetails>
            </BestMovieContent>
          </BestMovieCard>
        )}
      </InfoCard>

      <ActionButtons>
        <EditButton type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          프로필 편집
        </EditButton>
        <LogoutButton
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          로그아웃
        </LogoutButton>
      </ActionButtons>

      {/* 프로필 편집 모달 */}
      <Modal
        title="프로필 편집"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={handleModalCancel}
        okText="저장"
        cancelText="취소"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="nickname"
            label="닉네임"
            rules={[
              { required: true, message: '닉네임을 입력해주세요!' },
              { min: 2, max: 10, message: '닉네임은 2-10자여야 합니다!' },
            ]}
          >
            <Input placeholder="닉네임" />
          </Form.Item>

          <Form.Item
            name="age"
            label="나이"
            rules={[
              { required: true, message: '나이를 입력해주세요!' },
              {
                type: 'number',
                min: 18,
                max: 100,
                message: '18-100세만 가능합니다!',
              },
            ]}
          >
            <InputNumber
              placeholder="나이"
              style={{ width: '100%' }}
              min={18}
              max={100}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="성별"
            rules={[{ required: true, message: '성별을 선택해주세요!' }]}
          >
            <Radio.Group>
              <Radio.Button value="Male">남성</Radio.Button>
              <Radio.Button value="Female">여성</Radio.Button>
              <Radio.Button value="Other">기타</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="favoriteGenres"
            label="선호 장르"
            rules={[
              { required: true, message: '최소 1개 장르를 선택해주세요!' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="선호하는 장르를 선택해주세요"
              style={{ width: '100%' }}
            >
              {genres.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="bio" label="자기소개">
            <TextArea
              placeholder="간단한 자기소개를 작성해주세요"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Divider>최고의 영화 (선택사항)</Divider>

          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              icon={<SearchOutlined />}
              onClick={() => setIsMovieSearchVisible(true)}
              style={{ width: '100%', height: 40 }}
            >
              영화 검색하여 추가
            </Button>
          </div>

          {/* 선택된 영화 미리보기 */}
          {selectedMovie && (
            <SelectedMoviePreview>
              <div style={{ flexShrink: 0 }}>
                {selectedMovie.posterImage ? (
                  <Image
                    width={60}
                    height={90}
                    src={selectedMovie.posterImage}
                    alt={selectedMovie.title}
                    style={{ borderRadius: 4 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 90,
                      background: '#f0f0f0',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🎬
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                  {selectedMovie.title}
                </div>
                <div
                  style={{ color: '#8c8c8c', fontSize: 14, marginBottom: 4 }}
                >
                  {new Date(selectedMovie.releaseDate).getFullYear()}
                </div>
                <div>
                  {selectedMovie.genres.map((genre) => (
                    <Tag key={genre} style={{ marginRight: 4 }}>
                      {genre}
                    </Tag>
                  ))}
                </div>
              </div>
              <Button
                type="text"
                size="small"
                onClick={() => {
                  setSelectedMovie(null);
                  form.setFieldsValue({
                    lifeMovie: {
                      title: '',
                      year: undefined,
                      genre: '',
                      reason: form.getFieldValue(['lifeMovie', 'reason']) || '',
                      posterImage: '',
                    },
                  });
                }}
              >
                제거
              </Button>
            </SelectedMoviePreview>
          )}

          <Form.Item name={['lifeMovie', 'title']} label="영화 제목">
            <Input placeholder="예: 라라랜드" />
          </Form.Item>

          <Form.Item name={['lifeMovie', 'year']} label="개봉년도">
            <InputNumber
              placeholder="예: 2016"
              style={{ width: '100%' }}
              min={1900}
              max={new Date().getFullYear()}
            />
          </Form.Item>

          <Form.Item name={['lifeMovie', 'genre']} label="장르">
            <Select placeholder="장르를 선택해주세요">
              {movieGenres.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name={['lifeMovie', 'reason']} label="선택 이유">
            <TextArea
              placeholder="이 영화가 왜 당신에게 특별한지 알려주세요..."
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 영화 검색 모달 */}
      <Modal
        title={
          <Space>
            <SearchOutlined />
            영화 검색
          </Space>
        }
        open={isMovieSearchVisible}
        onCancel={() => {
          setIsMovieSearchVisible(false);
          setMovieSearchQuery('');
          setMovieSearchResults([]);
        }}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="영화 제목을 입력하세요"
            value={movieSearchQuery}
            onChange={(e) => setMovieSearchQuery(e.target.value)}
            onSearch={handleMovieSearch}
            loading={isSearching}
            size="large"
          />
        </div>

        <MobileMovieItem>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {isSearching ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>영화를 검색하고 있습니다...</div>
              </div>
            ) : movieSearchResults.length > 0 ? (
              <List
                dataSource={movieSearchResults}
                renderItem={(movie) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: 16 }}
                    onClick={() => handleMovieSelect(movie)}
                    actions={[
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovieSelect(movie);
                        }}
                      >
                        선택
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        movie.posterImage ? (
                          <Image
                            width={60}
                            height={90}
                            src={movie.posterImage}
                            alt={movie.title}
                            style={{ borderRadius: 4 }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                          />
                        ) : (
                          <div
                            style={{
                              width: 60,
                              height: 90,
                              background: '#f0f0f0',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            🎬
                          </div>
                        )
                      }
                      title={
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>
                            {movie.title}
                          </div>
                          <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                            {new Date(movie.releaseDate).getFullYear()} •{' '}
                            {movie.director}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            {movie.genres.map((genre) => (
                              <Tag key={genre} style={{ marginRight: 4 }}>
                                {genre}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      }
                      description={
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: '#595959',
                          }}
                        >
                          {movie.description.length > 100
                            ? `${movie.description.substring(0, 100)}...`
                            : movie.description}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : movieSearchQuery && !isSearching ? (
              <div
                style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}
              >
                검색 결과가 없습니다.
              </div>
            ) : (
              <div
                style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}
              >
                영화 제목을 입력하고 검색해보세요.
              </div>
            )}
          </div>
        </MobileMovieItem>
      </Modal>
    </ProfileContainer>
  );
};

export default UserProfilePage;
