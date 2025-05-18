import styled from '@emotion/styled';
import { Button, Input, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/api/auth/useLogin';

const LoginContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const LoginForm = styled(Form)`
  width: 100%;
`;

const LoginTitle = styled.h1`
  color: #ff7f00;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const LoginSubTitle = styled.p`
  color: #888;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 32px;
  text-align: center;
  max-width: 400px;
  font-weight: 300;
`;

const TitleContainer = styled.div`
  margin-bottom: 24px;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #ff7f00;
    margin: 16px auto 0;
    border-radius: 2px;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #ff7f00;
  border-color: #ff7f00;
  width: 100%;
  height: 40px;
  margin-top: 16px;

  &:hover,
  &:focus {
    background-color: #e67300;
    border-color: #e67300;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;

  a {
    color: #ff7f00;
    font-weight: bold;
    margin-left: 8px;

    &:hover {
      color: #e67300;
    }
  }
`;

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (values: unknown) => {
    loginMutation.mutate(values as { email: string; password: string }, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <LoginContainer>
      <TitleContainer>
        <LoginTitle>로그인</LoginTitle>
        <LoginSubTitle>당신의 영화 취향에 맞는 상대를 찾아보세요</LoginSubTitle>
      </TitleContainer>
      <LoginForm form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            { required: true, message: '이메일을 입력해주세요' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
          ]}
        >
          <Input placeholder="이메일을 입력하세요" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
        >
          <Input.Password placeholder="비밀번호를 입력하세요" size="large" />
        </Form.Item>

        <Form.Item>
          <SubmitButton
            type="primary"
            htmlType="submit"
            loading={loginMutation.isPending}
          >
            로그인
          </SubmitButton>
        </Form.Item>
      </LoginForm>
      <SignupLink>
        계정이 없으신가요?<Link to="/signup">회원가입</Link>
      </SignupLink>
    </LoginContainer>
  );
}

export default Login;
