import styled from '@emotion/styled';
import { Button, Input, Form } from 'antd';
import { Link } from 'react-router-dom';
import { useSignup } from '../../hooks/api/auth/useSignup';
import { SignupRequest } from '../../types/auth';
import { message } from 'antd';

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const SignupForm = styled(Form)`
  width: 100%;
`;

const SignupTitle = styled.h1`
  color: #ff7f00;
  margin-bottom: 24px;
  text-align: center;
`;

const SignupSubTitle = styled.h2`
  color: #b5b5b5;
  margin-bottom: 24px;
  text-align: center;
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

const LoginLink = styled.div`
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

function Signup() {
  const [form] = Form.useForm();
  const { mutate, isPending } = useSignup();

  const handleSubmit = (values: SignupFormValues) => {
    const payload: SignupRequest = {
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };
    mutate(payload, {
      onSuccess: () => {
        message.success('회원가입이 완료되었습니다!');
        // 예: navigate('/login');
      },
      onError: (error) => {
        message.error(error.message || '회원가입에 실패했습니다.');
      },
    });
  };

  return (
    <SignupContainer>
      <SignupTitle>회원가입</SignupTitle>
      <SignupSubTitle>
        영화 취향 매칭 서비스에 오신 것을 환영합니다
      </SignupSubTitle>
      <SignupForm
        form={form}
        onFinish={(values) => handleSubmit(values as SignupFormValues)}
        layout="vertical"
      >
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
          rules={[
            { required: true, message: '비밀번호를 입력해주세요' },
            { min: 8, message: '비밀번호는 8자 이상이어야 합니다' },
          ]}
        >
          <Input.Password placeholder="비밀번호를 입력하세요" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="비밀번호 확인"
          dependencies={['password']}
          rules={[
            { required: true, message: '비밀번호를 다시 입력해주세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다')
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="비밀번호를 다시 입력하세요"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <SubmitButton type="primary" htmlType="submit" loading={isPending}>
            회원가입
          </SubmitButton>
        </Form.Item>
      </SignupForm>
      <LoginLink>
        이미 계정이 있으신가요?<Link to="/login">로그인</Link>
      </LoginLink>
    </SignupContainer>
  );
}

export default Signup;
