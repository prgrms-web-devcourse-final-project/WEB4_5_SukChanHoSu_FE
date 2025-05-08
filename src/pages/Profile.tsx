import { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Avatar, Input, Form, Upload, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

const ProfileTitle = styled.h1`
  color: #ff7f00;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ff7f00;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
`;

const ProfileForm = styled(Form)`
  width: 100%;
  max-width: 400px;
`;

const ProfileSection = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const ActionButton = styled(Button)`
  background-color: #ff7f00;
  border-color: #ff7f00;
  width: 100%;
  margin-top: 10px;

  &:hover,
  &:focus {
    background-color: #e67300;
    border-color: #e67300;
  }
`;

const LogoutButton = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

type UploadResponse = { url: string };

type User = {
  name: string;
  email: string;
  bio: string;
  favoriteGenres: string;
  profileImage: string | null;
};

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // 임시 사용자 데이터
  const [userData, setUserData] = useState<User>({
    name: '홍길동',
    email: 'user@example.com',
    bio: '영화를 좋아하는 사람입니다.',
    favoriteGenres: '액션, 코미디, SF',
    profileImage: null,
  });

  const handleEditToggle = () => {
    if (isEditing) {
      form
        .validateFields()
        .then((values) => {
          setUserData({
            ...userData,
            ...values,
          });
          setIsEditing(false);
          message.success('프로필이 업데이트되었습니다.');
        })
        .catch((error) => {
          console.error('Validation failed:', error);
        });
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    message.info('로그아웃되었습니다.');
  };

  const handleImageUpload = (
    info: UploadChangeParam<UploadFile<UploadResponse>>
  ) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 업로드 성공`);
      setUserData({
        ...userData,
        profileImage: info.file.response?.url ?? null,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 업로드 실패`);
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>내 프로필</ProfileTitle>
        <AvatarContainer>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={userData.profileImage}
          />
          {isEditing && (
            <Upload
              name="avatar"
              showUploadList={false}
              action="/api/upload" // 실제 업로드 API 경로로 변경 필요
              onChange={handleImageUpload}
            >
              <EditIconWrapper>
                <UploadOutlined style={{ color: 'white' }} />
              </EditIconWrapper>
            </Upload>
          )}
        </AvatarContainer>
        <h2>{userData.name}</h2>
      </ProfileHeader>

      <ProfileForm form={form} initialValues={userData}>
        <ProfileSection>
          <SectionTitle>기본 정보</SectionTitle>
          {isEditing ? (
            <>
              <Form.Item
                name="name"
                rules={[{ required: true, message: '이름을 입력해주세요' }]}
              >
                <Input placeholder="이름" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: '유효한 이메일을 입력해주세요',
                  },
                ]}
              >
                <Input placeholder="이메일" disabled />
              </Form.Item>
            </>
          ) : (
            <>
              <p>
                <strong>이름:</strong> {userData.name}
              </p>
              <p>
                <strong>이메일:</strong> {userData.email}
              </p>
            </>
          )}
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>자기소개</SectionTitle>
          {isEditing ? (
            <Form.Item name="bio">
              <Input.TextArea rows={4} placeholder="자기소개를 입력해주세요" />
            </Form.Item>
          ) : (
            <p>{userData.bio}</p>
          )}
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>선호하는 영화 장르</SectionTitle>
          {isEditing ? (
            <Form.Item name="favoriteGenres">
              <Input placeholder="좋아하는 영화 장르를 입력해주세요" />
            </Form.Item>
          ) : (
            <p>{userData.favoriteGenres}</p>
          )}
        </ProfileSection>

        <ActionButton
          type="primary"
          icon={isEditing ? null : <EditOutlined />}
          onClick={handleEditToggle}
        >
          {isEditing ? '저장하기' : '프로필 수정'}
        </ActionButton>

        <LogoutButton icon={<LogoutOutlined />} onClick={handleLogout} danger>
          로그아웃
        </LogoutButton>
      </ProfileForm>
    </ProfileContainer>
  );
}

export default Profile;
