import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Typography, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { chatsAtom, profilesAtom, currentUserIdAtom } from '../store/atoms';
import { Chat } from '../types';

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
  const chats = useAtomValue(chatsAtom);
  const profiles = useAtomValue(profilesAtom);
  const currentUserId = useAtomValue(currentUserIdAtom);

  const formatTime = (timestamp: string) => {
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

  const getChatPartner = (chat: Chat) => {
    const partnerId = chat.participants.find(
      (id: number) => id !== currentUserId
    );
    return profiles.find((profile) => profile.id === partnerId);
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return '대화를 시작해보세요';
    return chat.messages[chat.messages.length - 1].message;
  };

  const getUnreadCount = (chat: Chat) => {
    return chat.messages.filter(
      (msg) => msg.receiverId === currentUserId && !msg.isRead
    ).length;
  };

  if (chats.length === 0) {
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

      {chats.map((chat) => {
        const partner = getChatPartner(chat);
        const lastMessage = getLastMessage(chat);
        const unreadCount = getUnreadCount(chat);

        if (!partner) return null;

        return (
          <ChatCard key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
            <ChatContent>
              <Badge dot={partner.isOnline}>
                <Avatar src={partner.photo} size={50} />
              </Badge>

              <ChatInfo>
                <ChatName>{partner.name}</ChatName>
                <LastMessage>{lastMessage}</LastMessage>
              </ChatInfo>

              <ChatMeta>
                <ChatTime>{formatTime(chat.updatedAt)}</ChatTime>
                {unreadCount > 0 && (
                  <Badge
                    count={unreadCount}
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
