import React, { useState } from 'react';
import {
  Card,
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
  Upload,
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
  LoadingOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { logoutAtom } from '../store/atoms';
import { useNavigate } from 'react-router-dom';
import { movieAPI, profileAPI, authAPI } from '../api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MovieSearchResult, ProfileResponse, ProfileData } from '../types';
import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';

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

const StyledUpload = styled(Upload)`
  .ant-upload-select-picture-card,
  .ant-upload-select-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: auto;
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-upload.ant-upload-select {
    display: inline-block;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border: 1px solid #eee;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  .anticon-camera {
    font-size: 16px;
    color: #333;
  }
`;

const ProfileAvatarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px auto;
  display: inline-block;
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
  const [, logout] = useAtom(logoutAtom);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data, isLoading: isLoadingProfile } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: profileAPI.getProfile,
  });
  const profileData = data?.data;

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.clear();
      logout();
      navigate('/login');
      message.success('로그아웃되었습니다.');
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      localStorage.removeItem('token');
      queryClient.clear();
      logout();
      navigate('/login');
      message.warning('로그아웃 처리되었습니다.');
    },
  });

  const updateProfileInfoMutation = useMutation({
    mutationFn: (profileData: ProfileData) =>
      profileAPI.updateProfileInfo(profileData),
    onSuccess: () => {
      message.success('프로필이 업데이트되었습니다!');
      setIsEditModalVisible(false);
      setSelectedMovie(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      console.error('프로필 업데이트 실패:', error);
      message.error('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateProfileImageMutation = useMutation({
    mutationFn: async (file: RcFile) => {
      const base64 = await getBase64(file);
      return profileAPI.updateProfileImage([base64]);
    },
    onSuccess: (response) => {
      console.log(response);
      message.success('프로필 이미지가 업데이트되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      console.error('프로필 이미지 업데이트 실패:', error);
      message.error('프로필 이미지 업데이트에 실패했습니다.');
    },
    onSettled: () => {
      setUploadingImage(false);
    },
  });

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
    { value: 'ACTION', label: '액션' },
    { value: 'ADVENTURE', label: '모험' },
    { value: 'ANIMATION', label: '애니메이션' },
    { value: 'COMEDY', label: '코미디' },
    { value: 'CRIME', label: '범죄' },
    { value: 'DOCUMENTARY', label: '다큐멘터리' },
    { value: 'DRAMA', label: '드라마' },
    { value: 'FAMILY', label: '가족' },
    { value: 'FANTASY', label: '판타지' },
    { value: 'HISTORY', label: '역사' },
    { value: 'HORROR', label: '공포' },
    { value: 'MUSIC', label: '뮤지컬' },
    { value: 'MYSTERY', label: '미스터리' },
    { value: 'ROMANCE', label: '로맨스' },
    { value: 'SCIENCE_FICTION', label: 'SF' },
    { value: 'TV_MOVIE', label: 'TV 영화' },
    { value: 'THRILLER', label: '스릴러' },
    { value: 'WAR', label: '전쟁' },
    { value: 'WESTERN', label: '서부' },
    { value: 'UNKNOWN', label: '기타' },
  ];
  const movieGenres = [...genres];
  const getGenreLabel = (genreValue: string) =>
    genres.find((g) => g.value === genreValue)?.label || genreValue;
  const ageToDate = (age: number): string => {
    if (!age || age < 18 || age > 100) {
      return '1990-01-01'; // 기본값
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-based이므로 +1
    const currentDay = currentDate.getDate();

    const birthYear = currentYear - age;

    // 생년월일을 현재 날짜보다 이전으로 설정하여 정확한 나이가 되도록 함
    return `${birthYear}-${String(currentMonth).padStart(2, '0')}-${String(
      currentDay
    ).padStart(2, '0')}`;
  };
  const calculateAge = (birthdate: string) => {
    if (!birthdate) return '';
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()))
      age--;
    return age;
  };
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
        lifeMovie: profileData.lifeMovie
          ? { title: profileData.lifeMovie }
          : undefined,
      });
      if (profileData.lifeMovie) {
        setSelectedMovie({ title: profileData.lifeMovie } as MovieSearchResult);
      }
      setIsEditModalVisible(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 폼 데이터를 API 요청 형식에 맞게 변환
      const updateData: ProfileData = {
        nickname: values.nickname || profileData?.nickname || '사용자',
        email: profileData?.email || 'user@example.com',
        gender: values.gender || profileData?.gender || 'Male',
        latitude: profileData?.latitude || 37.5665, // 서울 시청 위도
        longitude: profileData?.longitude || 126.978, // 서울 시청 경도
        birthdate: values.age
          ? ageToDate(values.age)
          : profileData?.birthdate || '1990-01-01',
        searchRadius: profileData?.searchRadius || 10000, // 10km
        lifeMovie:
          selectedMovie?.title ||
          values.lifeMovie?.title ||
          profileData?.lifeMovie ||
          '타이타닉',
        favoriteGenres:
          values.favoriteGenres && values.favoriteGenres.length > 0
            ? values.favoriteGenres
            : profileData?.favoriteGenres || ['ACTION'],
        watchedMovies:
          profileData?.watchedMovies && profileData.watchedMovies.length > 0
            ? profileData.watchedMovies
            : ['타이타닉', '어벤져스', '라라랜드'],
        preferredTheaters:
          profileData?.preferredTheaters &&
          profileData.preferredTheaters.length > 0
            ? profileData.preferredTheaters
            : ['CGV 강남', '롯데시네마 월드타워', '메가박스 코엑스'],
        introduce:
          values.bio ||
          profileData?.introduce ||
          '안녕하세요! 영화를 좋아하는 사용자입니다.',
        profileImages: profileData?.profileImages || [],
      };

      console.log('전송할 프로필 데이터:', updateData);
      await updateProfileInfoMutation.mutateAsync(updateData);
    } catch (errorInfo) {
      console.log('유효성 검사 실패:', errorInfo);
    }
  };

  const handleLogout = () => setIsLogoutModalVisible(true);
  const handleLogoutConfirm = () => {
    logoutMutation.mutate();
    setIsLogoutModalVisible(false);
  };
  const handleLogoutCancel = () => setIsLogoutModalVisible(false);

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

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('JPG/PNG 파일만 업로드할 수 있습니다!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('이미지 크기는 2MB보다 작아야 합니다!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setUploadingImage(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploadingImage(false);
    }
    if (info.file.status === 'error') {
      setUploadingImage(false);
      message.error(`${info.file.name} 파일 업로드 실패.`);
    }
  };

  const customUploadRequest: UploadProps['customRequest'] = async (options) => {
    const { onSuccess, onError, file } = options;
    try {
      await updateProfileImageMutation.mutateAsync(file as RcFile);
      if (onSuccess) onSuccess(null);
    } catch (err: unknown) {
      if (onError) onError(err as Error);
    }
  };

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

  if (!profileData) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>프로필 정보를 불러올 수 없습니다.</Text>
          <br />
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['profile'] })
            }
            style={{ marginTop: 16 }}
          >
            다시 시도
          </Button>
        </div>
      </ProfileContainer>
    );
  }

  const displayAge = profileData.birthdate
    ? calculateAge(profileData.birthdate)
    : '미설정';

  const uploadButton = (
    <ProfileAvatarWrapper>
      {!uploadingImage && (
        <AvatarOverlay>
          <CameraOutlined />
        </AvatarOverlay>
      )}
      {uploadingImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '50%',
          }}
        >
          <LoadingOutlined />
        </div>
      )}
    </ProfileAvatarWrapper>
  );

  return (
    <ProfileContainer>
      <ProfileHeader>
        <StyledUpload
          name="profileImage"
          listType="picture-circle"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          customRequest={customUploadRequest}
        >
          {uploadButton}
        </StyledUpload>
        <UserName level={3}>{profileData.nickname}</UserName>
        <UserInfo>
          @{profileData.nickname} • {displayAge}
          {displayAge !== '미설정' ? '세' : ''}
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
          {profileData.favoriteGenres.map((genre: string) => (
            <GenreTag key={genre}>{getGenreLabel(genre)}</GenreTag>
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
          loading={logoutMutation.isPending}
          disabled={logoutMutation.isPending}
        >
          로그아웃
        </LogoutButton>
      </ActionButtons>

      <Modal
        title="프로필 편집"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={handleModalCancel}
        okText="저장"
        cancelText="취소"
        width={600}
        confirmLoading={updateProfileInfoMutation.isPending}
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
                <Option key={genre.value} value={genre.value}>
                  {genre.label}
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
                      {getGenreLabel(genre)}
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
            <Input placeholder="예: 라라랜드" disabled={!!selectedMovie} />
          </Form.Item>
          <Form.Item name={['lifeMovie', 'year']} label="개봉년도">
            <InputNumber
              placeholder="예: 2016"
              style={{ width: '100%' }}
              min={1900}
              max={new Date().getFullYear()}
              disabled={!!selectedMovie}
            />
          </Form.Item>
          <Form.Item name={['lifeMovie', 'genre']} label="장르">
            <Select
              placeholder="장르를 선택해주세요"
              disabled={!!selectedMovie}
            >
              {movieGenres.map((genre) => (
                <Option key={genre.value} value={genre.value}>
                  {genre.label}
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
                                {getGenreLabel(genre)}
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
      <Modal
        title="로그아웃"
        open={isLogoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        okText="로그아웃"
        cancelText="취소"
        centered
        confirmLoading={logoutMutation.isPending}
      >
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <LogoutOutlined
            style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }}
          />
          <div style={{ fontSize: 16, marginBottom: 8 }}>
            정말 로그아웃하시겠습니까?
          </div>
          <div style={{ fontSize: 14, color: '#8c8c8c' }}>
            로그아웃하면 다시 로그인해야 합니다.
          </div>
        </div>
      </Modal>
    </ProfileContainer>
  );
};

export default UserProfilePage;
