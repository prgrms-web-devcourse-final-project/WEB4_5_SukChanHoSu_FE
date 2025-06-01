import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Typography, Badge, Spin, Alert } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { authAtom } from '../store/atoms';
import { chatAPI } from '../api/client';
import { ChatRoom } from '../types';

const { Title, Text } = Typography;

const ChatListContainer = styled.div`
  padding: 16px;
`;

const ChatCard = styled(Card)`
  margin-bottom: 12px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const ChatContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  display: block;
  margin-bottom: 4px;
`;

const LastMessage = styled(Text)`
  font-size: 14px;
  color: #8c8c8c;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ChatTime = styled(Text)`
  font-size: 12px;
  color: #bdbdbd;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #8c8c8c;
  text-align: center;

  .anticon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
`;

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const currentUserId = auth.user?.id || '0';

  // React Query로 채팅룸 데이터 가져오기
  const {
    data: chatRooms,
    isLoading,
    error,
    refetch,
  } = useQuery<ChatRoom[]>({
    queryKey: ['chatRooms'],
    queryFn: chatAPI.getChatRooms,
    enabled: !!auth.isAuthenticated, // 로그인된 경우에만 실행
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  console.log('채팅룸 응답:', chatRooms);

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getChatPartnerName = (chatRoom: ChatRoom): string => {
    // 현재 사용자가 sender인지 receiver인지 확인하여 상대방 이름 반환
    if (chatRoom.sender === currentUserId) {
      return `사용자 ${chatRoom.receiver}`;
    } else {
      return `사용자 ${chatRoom.sender}`;
    }
  };

  const getLastMessage = (chatRoom: ChatRoom) => {
    if (!chatRoom.lastMessage) return '대화를 시작해보세요';
    return chatRoom.lastMessage;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <ChatListContainer>
        <Title level={3} style={{ marginBottom: 24, color: '#262626' }}>
          채팅
        </Title>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#8c8c8c' }}>
            채팅 목록을 불러오는 중...
          </div>
        </div>
      </ChatListContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <ChatListContainer>
        <Title level={3} style={{ marginBottom: 24, color: '#262626' }}>
          채팅
        </Title>
        <Alert
          message="채팅 목록을 불러올 수 없습니다"
          description="네트워크 연결을 확인하고 다시 시도해주세요."
          type="error"
          action={<button onClick={() => refetch()}>다시 시도</button>}
          style={{ marginBottom: 16 }}
        />
      </ChatListContainer>
    );
  }

  // 빈 상태
  if (!chatRooms || chatRooms.length === 0) {
    return (
      <ChatListContainer>
        <Title level={3} style={{ marginBottom: 24, color: '#262626' }}>
          채팅
        </Title>
        <EmptyState>
          <MessageOutlined />
          <Title level={4} style={{ color: '#8c8c8c', margin: 0 }}>
            아직 채팅이 없어요
          </Title>
          <Text style={{ marginTop: 8 }}>
            좋아요를 누르고 매치된 사람과 대화를 시작해보세요!
          </Text>
        </EmptyState>
      </ChatListContainer>
    );
  }

  return (
    <ChatListContainer>
      <Title level={3} style={{ marginBottom: 24, color: '#262626' }}>
        채팅
      </Title>

      {chatRooms.map((chatRoom) => {
        const partnerName = getChatPartnerName(chatRoom);
        const lastMessage = getLastMessage(chatRoom);
        const isUnread = chatRoom.unread;

        return (
          <ChatCard
            key={chatRoom.roomId}
            onClick={() => navigate(`/chat/${chatRoom.roomId}`)}
          >
            <ChatContent>
              <Badge dot={false}>
                <Avatar size={50} style={{ backgroundColor: '#1890ff' }}>
                  {partnerName.charAt(partnerName.length - 1)}
                </Avatar>
              </Badge>

              <ChatInfo>
                <ChatName>{partnerName}</ChatName>
                <LastMessage>{lastMessage}</LastMessage>
              </ChatInfo>

              <ChatMeta>
                <ChatTime>
                  {chatRoom.lastMessageTime
                    ? formatTime(chatRoom.lastMessageTime)
                    : ''}
                </ChatTime>
                {isUnread && (
                  <Badge
                    count={1}
                    style={{
                      backgroundColor: '#1890ff',
                      fontSize: '12px',
                      minWidth: '20px',
                      height: '20px',
                      lineHeight: '20px',
                    }}
                  />
                )}
              </ChatMeta>
            </ChatContent>
          </ChatCard>
        );
      })}
    </ChatListContainer>
  );
};

export default ChatListPage;
