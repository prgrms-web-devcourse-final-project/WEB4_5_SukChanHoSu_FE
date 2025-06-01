import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '../store/atoms';
import { authAPI } from '../api/client';
import type { User } from '../types';

const { Title, Text, Link: AntLink } = Typography;

type LoginForm = {
  email: string;
  password: string;
};

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
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

const LoginForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid #f0f0f0;

    &:hover {
      border-color: #1890ff;
    }

    &:focus-within {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  .ant-input {
    border: none;
    padding: 0;
    font-size: 14px;

    &:focus {
      box-shadow: none;
    }
  }
`;

const LoginButton = styled(Button)`
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

const SignupSection = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const SignupText = styled(Text)`
  color: #8c8c8c;
  font-size: 14px;
`;

const SignupLink = styled(AntLink)`
  &.ant-typography {
    color: #1890ff;
    font-weight: 600;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const DemoSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const DemoTitle = styled(Text)`
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
`;

const DemoCredentials = styled.div`
  font-size: 12px;
  color: #595959;
  line-height: 1.5;
`;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [, setAuthState] = useAtom(authAtom);

  const handleLogin = async (values: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(values.email, values.password);
      console.log(response);
      // 토큰이 응답에 포함되어 있다면 localStorage에 저장
      if (response.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        console.log('로그인 성공, 토큰 저장됨');

        message.success('로그인 성공!');

        // 사용자 정보를 User 타입에 맞게 변환
        let userData: User | null = null;
        if (response.data.user) {
          const user = response.data.user;
          userData = {
            id: user.id?.toString() || '',
            email: user.email || values.email,
            name: user.nickname || user.name || '사용자',
            nickname: user.nickname || user.name || '',
            profileImage: user.profileImage || undefined,
            bio: user.bio || '',
            age: user.age || 0,
            gender: user.gender || 'other',
            favoriteGenres: user.favoriteGenres || [],
            bestMovie: user.bestMovie || undefined,
          };
        }

        // 인증 상태 업데이트
        setAuthState({
          isAuthenticated: true,
          user: userData,
          loading: false,
          error: null,
        });

        navigate('/');
      } else {
        throw new Error('토큰을 받지 못했습니다.');
      }
    } catch (error: unknown) {
      console.error('로그인 에러:', error);

      // API 에러 메시지가 있다면 표시, 없다면 기본 메시지
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    form.setFieldsValue({
      email: 'initUser10@example.com',
      password: 'testPassword123!',
    });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <AppTitle level={2}>MovieMatch</AppTitle>
          <AppSubtitle>영화로 만나는 새로운 인연</AppSubtitle>
        </LogoSection>

        <DemoSection>
          <DemoTitle>체험용 계정</DemoTitle>
          <DemoCredentials>
            이메일: initUser10@example.com
            <br />
            비밀번호: testPassword123!
            <Button
              type="link"
              size="small"
              onClick={handleDemoLogin}
              style={{ padding: '0 4px', height: 'auto', fontSize: '12px' }}
            >
              자동 입력
            </Button>
          </DemoCredentials>
        </DemoSection>

        <LoginForm
          form={form}
          name="login"
          onFinish={(values) => handleLogin(values as LoginForm)}
          autoComplete="off"
        >
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
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <LoginButton type="primary" htmlType="submit" loading={isLoading}>
              로그인
            </LoginButton>
          </Form.Item>
        </LoginForm>

        <Divider>또는</Divider>

        <SignupSection>
          <SignupText>
            아직 계정이 없으신가요?{' '}
            <SignupLink onClick={() => navigate('/signup')}>
              회원가입
            </SignupLink>
          </SignupText>
        </SignupSection>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
