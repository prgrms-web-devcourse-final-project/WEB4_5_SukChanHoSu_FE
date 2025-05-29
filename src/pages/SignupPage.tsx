import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Tag,
  InputNumber,
  Steps,
  Radio,
  Modal,
  Select,
  Space,
  List,
  Spin,
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  HeartOutlined,
  EditOutlined,
  StarOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { signupAtom, authAtom } from '../store/atoms';
import type { SignupForm, MovieSearchResult } from '../types';
import { profileAPI, movieAPI } from '../api/client';

const { Title, Text, Link } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: none;

  .ant-card-body {
    padding: 40px 32px;

    @media (max-width: 480px) {
      padding: 32px 24px;
    }
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const AppLogo = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const AppTitle = styled(Title)`
  &.ant-typography {
    margin: 0 0 8px 0 !important;
    font-size: 28px !important;
    font-weight: 700 !important;
    color: #262626;
    text-align: center;
  }
`;

const AppSubtitle = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
  display: block;
  text-align: center;
`;

const StepsContainer = styled.div`
  margin-bottom: 32px;

  .ant-steps-item-process .ant-steps-item-icon {
    background: #667eea;
    border-color: #667eea;
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    background: #52c41a;
    border-color: #52c41a;
  }
`;

const SignupForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper,
  .ant-input,
  .ant-select-selector,
  .ant-input-number {
    border-radius: 8px;
    border: 1px solid #f0f0f0;

    &:hover {
      border-color: #1890ff;
    }

    &:focus-within {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .ant-input-affix-wrapper {
  }

  .ant-input {
    padding: 12px 16px;
    font-size: 14px;

    &:focus {
      box-shadow: none;
    }
  }
`;

const GenreSection = styled.div`
  margin-bottom: 16px;
`;

const GenreLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 12px;
`;

const GenreTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreTag = styled(Tag)<{ selected?: boolean }>`
  &.ant-tag {
    cursor: pointer;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid ${(props) => (props.selected ? '#667eea' : '#d9d9d9')};
    background: ${(props) => (props.selected ? '#667eea' : 'white')};
    color: ${(props) => (props.selected ? 'white' : '#595959')};
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
      color: ${(props) => (props.selected ? 'white' : '#667eea')};
    }
  }
`;

const SignupButton = styled(Button)`
  &.ant-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const LoginSection = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const LoginText = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
`;

const LoginLink = styled(Link)`
  &.ant-typography {
    color: #1890ff;
    font-weight: 600;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const BestMovieCard = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;

  &:hover {
    border-color: #1890ff;
    background: #f6ffed;
  }

  &.selected {
    border-color: #52c41a;
    background: #f6ffed;
    border-style: solid;
  }
`;

const BestMovieInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;

  .movie-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
  }

  .movie-details {
    font-size: 14px;
    color: #8c8c8c;
    margin-bottom: 8px;
  }

  .movie-reason {
    font-size: 14px;
    color: #595959;
    line-height: 1.5;
  }
`;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [, signup] = useAtom(signupAtom);
  const auth = useAtomValue(authAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [bestMovie, setBestMovie] = useState<{
    title: string;
    year: number;
    genre: string;
    reason: string;
    posterImage?: string;
  } | null>(null);
  const [isMovieModalVisible, setIsMovieModalVisible] = useState(false);
  const [movieForm] = Form.useForm();

  // 닉네임 중복 검사 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState('');

  // 영화 검색 관련 상태
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchMovie, setSelectedSearchMovie] =
    useState<MovieSearchResult | null>(null);

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

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // 닉네임 중복 검사 함수
  const handleNicknameCheck = async () => {
    try {
      const nickname = form.getFieldValue('nickname');
      if (!nickname) {
        message.error('닉네임을 먼저 입력해주세요!');
        return;
      }

      if (nickname.length < 2 || nickname.length > 10) {
        message.error('닉네임은 2-10자여야 합니다!');
        return;
      }

      setIsCheckingNickname(true);
      const response = await profileAPI.checkNickname(nickname);

      setCheckedNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(!response.data.duplicated);

      if (response.data.duplicated) {
        message.error('이미 사용 중인 닉네임입니다!');
      } else {
        message.success('사용 가능한 닉네임입니다!');
      }
    } catch {
      message.error('닉네임 중복 검사에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 닉네임 입력 변경 시 중복 검사 상태 초기화
  const handleNicknameChange = () => {
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);
    setCheckedNickname('');
  };

  // 영화 검색 함수
  const handleMovieSearch = async () => {
    if (!searchQuery.trim()) {
      message.error('영화 제목을 입력해주세요!');
      return;
    }

    setIsSearching(true);
    try {
      const response = await movieAPI.searchByTitle(searchQuery);
      setSearchResults(response.data || []);

      if (response.data && response.data.length === 0) {
        message.info('검색 결과가 없습니다.');
      }
    } catch {
      message.error('영화 검색에 실패했습니다. 다시 시도해주세요.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색된 영화 선택 함수
  const handleSelectSearchMovie = (movie: MovieSearchResult) => {
    setSelectedSearchMovie(movie);

    // 폼에 영화 정보 자동 입력
    movieForm.setFieldsValue({
      title: movie.title,
      year: parseInt(movie.releaseDate.substring(0, 4)),
      genre: movie.genres[0] || '기타',
    });

    // 검색 결과 초기화
    setSearchResults([]);
    setSearchQuery('');

    message.success('영화가 선택되었습니다!');
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['email', 'password', 'confirmPassword']);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        await form.validateFields(['nickname', 'age', 'gender']);

        // 닉네임 중복 검사 확인
        const currentNickname = form.getFieldValue('nickname');
        if (!isNicknameChecked || checkedNickname !== currentNickname) {
          message.error('닉네임 중복 검사를 완료해주세요!');
          return;
        }

        if (!isNicknameAvailable) {
          message.error('사용 가능한 닉네임으로 변경해주세요!');
          return;
        }

        setCurrentStep(2);
      }
    } catch {
      // 유효성 검사 실패
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleMovieModalOk = async () => {
    try {
      const values = await movieForm.validateFields();
      setBestMovie({
        title: values.title,
        year: values.year,
        genre: values.genre,
        reason: values.reason,
        posterImage: selectedSearchMovie?.posterImage || undefined,
      });
      setIsMovieModalVisible(false);
      movieForm.resetFields();

      // 검색 관련 상태 초기화
      setSearchResults([]);
      setSearchQuery('');
      setSelectedSearchMovie(null);

      message.success('최고의 영화가 설정되었습니다!');
    } catch {
      // 유효성 검사 실패
    }
  };

  const handleMovieModalCancel = () => {
    setIsMovieModalVisible(false);
    movieForm.resetFields();

    // 검색 관련 상태 초기화
    setSearchResults([]);
    setSearchQuery('');
    setSelectedSearchMovie(null);
  };

  const handleSignup = async (values: SignupForm) => {
    if (selectedGenres.length === 0) {
      message.error('최소 1개 이상의 선호 장르를 선택해주세요!');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
        age: values.age,
        gender: values.gender,
        favoriteGenres: selectedGenres,
        bestMovie: bestMovie || undefined,
        bio: values.bio || '',
      });
      message.success('회원가입이 완료되었습니다!');
      navigate('/');
    } catch {
      message.error('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '이메일을 입력해주세요!' },
                { type: 'email', message: '올바른 이메일 형식이 아닙니다!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="이메일"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '비밀번호를 입력해주세요!' },
                { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호 (최소 6자)"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '비밀번호를 다시 입력해주세요!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('비밀번호가 일치하지 않습니다!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호 확인"
                size="large"
              />
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="nickname"
              rules={[
                { required: true, message: '닉네임을 입력해주세요!' },
                { min: 2, message: '닉네임은 최소 2자 이상이어야 합니다!' },
                { max: 10, message: '닉네임은 최대 10자까지 가능합니다!' },
              ]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  prefix={<EditOutlined />}
                  placeholder="닉네임 (2-10자)"
                  size="large"
                  style={{ flex: 1 }}
                  onChange={handleNicknameChange}
                />
                <Button
                  size="large"
                  onClick={handleNicknameCheck}
                  loading={isCheckingNickname}
                  style={{ height: 'auto' }}
                >
                  중복 검사
                </Button>
              </Space.Compact>
            </Form.Item>

            {isNicknameChecked && (
              <div
                style={{
                  color: isNicknameAvailable ? '#52c41a' : '#ff4d4f',
                  fontSize: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {isNicknameAvailable ? (
                  <>
                    <CheckCircleOutlined />
                    사용 가능한 닉네임입니다.
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined />
                    이미 사용 중인 닉네임입니다.
                  </>
                )}
              </div>
            )}

            <Form.Item
              name="age"
              rules={[
                { required: true, message: '나이를 입력해주세요!' },
                {
                  type: 'number',
                  min: 18,
                  max: 100,
                  message: '18세 이상 100세 이하만 가입 가능합니다!',
                },
              ]}
            >
              <InputNumber
                placeholder="나이"
                size="large"
                style={{ width: '100%' }}
                min={18}
                max={100}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: '성별을 선택해주세요!' }]}
            >
              <Radio.Group size="large" style={{ width: '100%' }}>
                <Radio.Button
                  value="male"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  남성
                </Radio.Button>
                <Radio.Button
                  value="female"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  여성
                </Radio.Button>
                <Radio.Button
                  value="other"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  기타
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </>
        );

      case 2:
        return (
          <>
            <GenreSection>
              <GenreLabel>
                <HeartOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                선호하는 영화 장르를 선택해주세요 (복수 선택 가능)
              </GenreLabel>
              <GenreTagsContainer>
                {genres.map((genre) => (
                  <GenreTag
                    key={genre}
                    selected={selectedGenres.includes(genre)}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                  </GenreTag>
                ))}
              </GenreTagsContainer>
            </GenreSection>

            <GenreSection>
              <GenreLabel>
                <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                나의 최고의 영화 (선택사항)
              </GenreLabel>
              {bestMovie ? (
                <BestMovieInfo>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* 포스터 이미지 */}
                    {bestMovie.posterImage ? (
                      <img
                        src={bestMovie.posterImage}
                        alt={bestMovie.title}
                        style={{
                          width: 60,
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 90,
                          backgroundColor: '#f0f0f0',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          color: '#8c8c8c',
                          flexShrink: 0,
                        }}
                      >
                        포스터
                      </div>
                    )}

                    {/* 영화 정보 */}
                    <div style={{ flex: 1 }}>
                      <div className="movie-title">{bestMovie.title}</div>
                      <div className="movie-details">
                        {bestMovie.year} • {bestMovie.genre}
                      </div>
                      <div className="movie-reason">{bestMovie.reason}</div>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setIsMovieModalVisible(true)}
                        style={{ padding: 0, marginTop: 8 }}
                      >
                        수정하기
                      </Button>
                    </div>
                  </div>
                </BestMovieInfo>
              ) : (
                <BestMovieCard onClick={() => setIsMovieModalVisible(true)}>
                  <PlusOutlined
                    style={{ fontSize: 24, color: '#8c8c8c', marginBottom: 8 }}
                  />
                  <div style={{ color: '#8c8c8c', fontSize: 14 }}>
                    나의 최고의 영화를 설정해보세요
                  </div>
                </BestMovieCard>
              )}
            </GenreSection>

            <Form.Item
              name="bio"
              rules={[
                { max: 200, message: '자기소개는 200자 이내로 작성해주세요!' },
              ]}
            >
              <TextArea
                placeholder="간단한 자기소개를 작성해주세요 (선택사항)"
                rows={4}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <LogoSection>
          <AppLogo>🎬</AppLogo>
          <AppTitle level={2}>MovieMatch</AppTitle>
          <AppSubtitle>영화로 만나는 새로운 인연</AppSubtitle>
        </LogoSection>

        <StepsContainer>
          <Steps current={currentStep} size="small">
            <Step title="계정 정보" />
            <Step title="개인 정보" />
            <Step title="취향 설정" />
          </Steps>
        </StepsContainer>

        <SignupForm
          form={form}
          name="signup"
          onFinish={(values) => handleSignup(values as SignupForm)}
          autoComplete="off"
        >
          {renderStepContent()}

          <Form.Item style={{ marginBottom: 0 }}>
            {currentStep === 0 && (
              <SignupButton type="primary" onClick={handleNext}>
                다음
              </SignupButton>
            )}

            {currentStep === 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button style={{ flex: 1 }} onClick={handlePrev}>
                  이전
                </Button>
                <SignupButton
                  type="primary"
                  style={{ flex: 2 }}
                  onClick={handleNext}
                >
                  다음
                </SignupButton>
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button style={{ flex: 1 }} onClick={handlePrev}>
                  이전
                </Button>
                <SignupButton
                  type="primary"
                  htmlType="submit"
                  style={{ flex: 2 }}
                  loading={isLoading || auth.loading}
                >
                  회원가입 완료
                </SignupButton>
              </div>
            )}
          </Form.Item>
        </SignupForm>

        <LoginSection>
          <LoginText>
            이미 계정이 있으신가요?{' '}
            <LoginLink onClick={() => navigate('/login')}>로그인</LoginLink>
          </LoginText>
        </LoginSection>
      </SignupCard>

      {/* 최고의 영화 설정 모달 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
            나의 최고의 영화 설정
          </div>
        }
        open={isMovieModalVisible}
        onOk={handleMovieModalOk}
        onCancel={handleMovieModalCancel}
        okText="설정 완료"
        cancelText="취소"
        width={600}
      >
        <div style={{ marginTop: 20 }}>
          {/* 영화 검색 섹션 */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{ marginBottom: 12, fontWeight: 500, color: '#262626' }}
            >
              <SearchOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              영화 검색하여 추가
            </div>
            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input
                placeholder="영화 제목을 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleMovieSearch}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                onClick={handleMovieSearch}
                loading={isSearching}
                icon={<SearchOutlined />}
              >
                검색
              </Button>
            </Space.Compact>

            {/* 검색 결과 */}
            {isSearching && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                  영화를 검색하는 중...
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{ marginBottom: 8, fontSize: 14, color: '#595959' }}
                >
                  검색 결과 ({searchResults.length}개)
                </div>
                <List
                  size="small"
                  bordered
                  dataSource={searchResults}
                  style={{ maxHeight: 200, overflowY: 'auto' }}
                  renderItem={(movie) => (
                    <List.Item
                      style={{ cursor: 'pointer', padding: '8px 12px' }}
                      onClick={() => handleSelectSearchMovie(movie)}
                      actions={[
                        <Button type="link" size="small" key="select">
                          선택
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          movie.posterImage ? (
                            <img
                              src={movie.posterImage}
                              alt={movie.title}
                              style={{
                                width: 40,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 4,
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 40,
                                height: 60,
                                backgroundColor: '#f0f0f0',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                color: '#8c8c8c',
                              }}
                            >
                              포스터
                            </div>
                          )
                        }
                        title={
                          <div style={{ fontSize: 14, fontWeight: 500 }}>
                            {movie.title}
                          </div>
                        }
                        description={
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {movie.releaseDate.substring(0, 4)} •{' '}
                            {movie.director} • {movie.genres.join(', ')}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}

            {/* 선택된 영화 미리보기 */}
            {selectedSearchMovie && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: 6,
                  marginBottom: 16,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* 포스터 이미지 */}
                {selectedSearchMovie.posterImage ? (
                  <img
                    src={selectedSearchMovie.posterImage}
                    alt={selectedSearchMovie.title}
                    style={{
                      width: 60,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 90,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: '#8c8c8c',
                      flexShrink: 0,
                    }}
                  >
                    포스터
                  </div>
                )}

                {/* 영화 정보 */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#52c41a',
                      marginBottom: 4,
                    }}
                  >
                    ✓ 선택된 영화
                  </div>
                  <div
                    style={{ fontSize: 14, color: '#262626', marginBottom: 4 }}
                  >
                    {selectedSearchMovie.title} (
                    {selectedSearchMovie.releaseDate.substring(0, 4)})
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {selectedSearchMovie.director} •{' '}
                    {selectedSearchMovie.genres.join(', ')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Form form={movieForm} layout="vertical">
            <Form.Item
              name="title"
              label="영화 제목"
              rules={[
                { required: true, message: '영화 제목을 입력해주세요!' },
                { max: 50, message: '영화 제목은 50자 이내로 입력해주세요!' },
              ]}
            >
              <Input placeholder="예: 라라랜드" />
            </Form.Item>

            <Form.Item
              name="year"
              label="개봉년도"
              rules={[
                { required: true, message: '개봉년도를 입력해주세요!' },
                {
                  type: 'number',
                  min: 1900,
                  max: new Date().getFullYear(),
                  message: `1900년부터 ${new Date().getFullYear()}년까지 입력 가능합니다!`,
                },
              ]}
            >
              <InputNumber
                placeholder="예: 2016"
                style={{ width: '100%' }}
                min={1900}
                max={new Date().getFullYear()}
              />
            </Form.Item>

            <Form.Item
              name="genre"
              label="장르"
              rules={[{ required: true, message: '장르를 선택해주세요!' }]}
            >
              <Select placeholder="장르를 선택해주세요">
                {movieGenres.map((genre) => (
                  <Option key={genre} value={genre}>
                    {genre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="reason"
              label="이 영화를 최고로 생각하는 이유"
              rules={[
                { required: true, message: '이유를 입력해주세요!' },
                { min: 10, message: '최소 10자 이상 입력해주세요!' },
                { max: 200, message: '200자 이내로 입력해주세요!' },
              ]}
            >
              <TextArea
                placeholder="이 영화가 왜 당신에게 특별한지 알려주세요..."
                rows={4}
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </SignupContainer>
  );
};

export default SignupPage;
