import React, { useState } from 'react';
import { Row, Tabs, Empty, Space, Pagination, Spin } from 'antd';
import { HeartFilled, FireOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../api/client';
import type { LikedUsersResponse, LikedUser } from '../types';

const { TabPane } = Tabs;

const LikesContainer = styled.div`
  padding: 0;
  min-height: 60vh;
  background: #ffffff;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 24px;
    background: white;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  }

  .ant-tabs-tab {
    padding: 8px 16px;
    font-weight: 500;
    font-size: 14px;
    margin: 0 2px;
    transition: all 0.2s ease;

    .ant-tabs-tab-btn {
      color: #8c8c8c;
    }

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #1890ff;
      }
    }

    &:hover:not(.ant-tabs-tab-active) {
      .ant-tabs-tab-btn {
        color: #595959;
      }
    }
  }

  .ant-tabs-ink-bar {
    background: #1890ff;
    height: 3px;
    border-radius: 2px;
  }

  .ant-tabs-content-holder {
    padding: 0;
  }

  .ant-tabs-content {
    height: auto;
  }

  .ant-tabs-tabpane {
    outline: none;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .ant-empty-description {
    color: #8c8c8c;
    font-size: 16px;
    margin-top: 16px;
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const LikesPage: React.FC = () => {
  const navigate = useNavigate();

  // 탭별 페이지 상태
  const [activeTab, setActiveTab] = useState('received');
  const [receivedPage, setReceivedPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);
  const pageSize = 10;

  // 나를 좋아한 사용자 목록
  const { data: receivedData, isLoading: isLoadingReceived } =
    useQuery<LikedUsersResponse>({
      queryKey: ['liked-me-users', receivedPage, pageSize],
      queryFn: () => userAPI.getLikedMeUsers(receivedPage, pageSize),
      // @ts-expect-error: keepPreviousData는 v4 react-query에서 지원됨
      keepPreviousData: true,
    });
  const receivedProfiles: LikedUser[] =
    (receivedData as LikedUsersResponse)?.data?.userLikes || [];
  const receivedTotal = (receivedData as LikedUsersResponse)?.data?.size || 0;

  // 내가 좋아한 사용자 목록
  const { data: sentData, isLoading: isLoadingSent } =
    useQuery<LikedUsersResponse>({
      queryKey: ['liked-users', sentPage, pageSize],
      queryFn: () => userAPI.getLikedUsers(sentPage, pageSize),
      // @ts-expect-error: keepPreviousData는 v4 react-query에서 지원됨
      keepPreviousData: true,
    });
  const likedProfiles: LikedUser[] =
    (sentData as LikedUsersResponse)?.data?.userLikes || [];
  const sentTotal = (sentData as LikedUsersResponse)?.data?.size || 0;

  return (
    <LikesContainer>
      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        destroyInactiveTabPane={false}
      >
        <TabPane
          tab={
            <Space>
              <HeartFilled style={{ color: '#1890ff' }} />
              나를 좋아해요
            </Space>
          }
          key="received"
        >
          <TabContent>
            {isLoadingReceived ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : receivedProfiles.length > 0 ? (
              <>
                <Row gutter={[16, 16]}>
                  {receivedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.userId}
                      profile={{
                        id: profile.userId,
                        name: profile.nickName,
                        age: 0,
                        location: '',
                        job: '',
                        favoriteMovies: [],
                        photo: profile.profileImages?.[0] || '',
                        isOnline: false,
                        lastSeen: '',
                        bio: profile.introduce,
                        distance: profile.distance,
                        introduction: profile.introduce,
                      }}
                      onCardClick={() => navigate(`/profile/${profile.userId}`)}
                    />
                  ))}
                </Row>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Pagination
                    current={receivedPage}
                    pageSize={pageSize}
                    total={receivedTotal}
                    onChange={setReceivedPage}
                  />
                </div>
              </>
            ) : (
              <EmptyContainer>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <div>아직 좋아요를 받지 못했어요</div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#bbb',
                          marginTop: '8px',
                        }}
                      >
                        매력적인 프로필을 만들어보세요! ✨
                      </div>
                    </div>
                  }
                />
              </EmptyContainer>
            )}
          </TabContent>
        </TabPane>

        <TabPane
          tab={
            <Space>
              <FireOutlined style={{ color: '#1890ff' }} />
              내가 좋아해요
            </Space>
          }
          key="sent"
        >
          <TabContent>
            {isLoadingSent ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : likedProfiles.length > 0 ? (
              <>
                <Row gutter={[16, 16]}>
                  {likedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.userId}
                      profile={{
                        id: profile.userId,
                        name: profile.nickName,
                        age: 0,
                        location: '',
                        job: '',
                        favoriteMovies: [],
                        photo: profile.profileImages?.[0] || '',
                        isOnline: false,
                        lastSeen: '',
                        bio: profile.introduce,
                        distance: profile.distance,
                        introduction: profile.introduce,
                      }}
                      onCardClick={() => navigate(`/profile/${profile.userId}`)}
                    />
                  ))}
                </Row>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Pagination
                    current={sentPage}
                    pageSize={pageSize}
                    total={sentTotal}
                    onChange={setSentPage}
                  />
                </div>
              </>
            ) : (
              <EmptyContainer>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <div>아직 좋아요를 보내지 않았어요</div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#bbb',
                          marginTop: '8px',
                        }}
                      >
                        마음에 드는 사람에게 좋아요를 보내보세요! 💕
                      </div>
                    </div>
                  }
                />
              </EmptyContainer>
            )}
          </TabContent>
        </TabPane>
      </StyledTabs>
    </LikesContainer>
  );
};

export default LikesPage;
