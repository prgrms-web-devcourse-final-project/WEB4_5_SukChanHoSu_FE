import { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Input, Form, Select, DatePicker } from 'antd';

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  gender: string;
  birthdate: Date; // DatePicker 값에 따라 Date, string, dayjs.Dayjs 등으로 조정
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

const { Option } = Select;

function Signup() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: SignupFormValues) => {
    setLoading(true);
    console.log('회원가입 시도:', values);
    // 여기에 회원가입 로직 추가
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

        <Form.Item
          name="nickname"
          label="닉네임"
          rules={[{ required: true, message: '닉네임을 입력해주세요' }]}
        >
          <Input placeholder="닉네임을 입력하세요" size="large" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="성별"
          rules={[{ required: true, message: '성별을 선택해주세요' }]}
        >
          <Select placeholder="성별을 선택하세요" size="large">
            <Option value="male">남성</Option>
            <Option value="female">여성</Option>
            <Option value="other">기타</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birthdate"
          label="생년월일"
          rules={[{ required: true, message: '생년월일을 선택해주세요' }]}
        >
          <DatePicker
            placeholder="생년월일을 선택하세요"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <SubmitButton type="primary" htmlType="submit" loading={loading}>
            회원가입
          </SubmitButton>
        </Form.Item>
      </SignupForm>
    </SignupContainer>
  );
}

export default Signup;
