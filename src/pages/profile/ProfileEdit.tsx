import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  InputNumber,
  Row,
  Col,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateProfile } from '../../hooks/api/profile/useCreateProfile';
import { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const ProfileEditContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  background: #fff;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  padding: 24px 0;
`;

const genreOptions = [
  'ACTION',
  'COMEDY',
  'ROMANCE',
  'SF',
  'THRILLER',
  'DRAMA',
  'FANTASY',
  'ANIMATION',
  'DOCUMENTARY',
];
const genderOptions = ['Male', 'Female', 'Other'];

function ProfileEdit() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const createProfile = useCreateProfile();

  const handleFinish = (values: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)));
      } else if (key === 'birthdate' && value) {
        formData.append(key, (value as dayjs.Dayjs).format('YYYY-MM-DD'));
      } else if (typeof value !== 'undefined' && value !== null) {
        formData.append(key, String(value));
      }
    });
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('profileImage', fileList[0].originFileObj);
    }
    createProfile.mutate(formData);
  };

  return (
    <ProfileEditContainer>
      <FormContainer>
        <h2>프로필 등록</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="nickname"
            label="닉네임"
            rules={[{ required: true, message: '닉네임을 입력해주세요' }]}
          >
            <Input placeholder="닉네임" />
          </Form.Item>
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '유효한 이메일을 입력해주세요' },
            ]}
          >
            <Input placeholder="이메일" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="성별"
            rules={[{ required: true, message: '성별을 선택해주세요' }]}
          >
            <Select placeholder="성별 선택">
              {genderOptions.map((g) => (
                <Option key={g} value={g}>
                  {g === 'Male' ? '남성' : g === 'Female' ? '여성' : '기타'}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="생년월일"
            rules={[{ required: true, message: '생년월일을 선택해주세요' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="favoriteGenres"
            label="선호 장르"
            rules={[{ required: true, message: '최소 1개 이상 선택해주세요' }]}
          >
            <Select mode="multiple" placeholder="선호 장르 선택">
              {genreOptions.map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="preferredTheaters"
            label="선호 극장"
            rules={[{ required: true, message: '최소 1개 이상 입력해주세요' }]}
          >
            <Select mode="tags" placeholder="선호 극장 입력" />
          </Form.Item>
          <Form.Item
            name="watchedMovies"
            label="최근 본 영화"
            rules={[{ required: true, message: '최소 1개 이상 입력해주세요' }]}
          >
            <Select mode="tags" placeholder="최근 본 영화 입력" />
          </Form.Item>
          <Form.Item
            name="lifeMovie"
            label="인생 영화"
            rules={[{ required: true, message: '인생 영화를 입력해주세요' }]}
          >
            <Input placeholder="인생 영화" />
          </Form.Item>
          <Form.Item
            name="introduce"
            label="자기소개"
            rules={[{ required: true, message: '자기소개를 입력해주세요' }]}
          >
            <TextArea rows={4} placeholder="자기소개를 입력해주세요" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="위도"
                rules={[{ required: true, message: '위도를 입력해주세요' }]}
              >
                <InputNumber
                  min={-90}
                  max={90}
                  step={0.0001}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="경도"
                rules={[{ required: true, message: '경도를 입력해주세요' }]}
              >
                <InputNumber
                  min={-180}
                  max={180}
                  step={0.0001}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="searchRadius"
            label="검색 반경 (m)"
            rules={[{ required: true, message: '검색 반경을 입력해주세요' }]}
          >
            <InputNumber
              min={1000}
              max={10000000}
              step={1000}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="profileImage"
            label="프로필 이미지"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            extra="이미지 1장만 업로드 가능합니다."
          >
            <Upload
              name="profileImage"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList as UploadFile[])}
            >
              <Button icon={<UploadOutlined />}>이미지 업로드</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createProfile.isPending}
              block
              size="large"
            >
              프로필 등록
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </ProfileEditContainer>
  );
}

export default ProfileEdit;
