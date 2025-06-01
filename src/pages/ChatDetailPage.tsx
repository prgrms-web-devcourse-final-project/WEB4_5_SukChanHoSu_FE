import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Avatar,
  Typography,
  Badge,
  Spin,
  Alert,
  message as antdMessage,
} from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { authAtom } from '../store/atoms';
import { useQuery } from '@tanstack/react-query';
import { chatAPI } from '../api/client';
import { webSocketManager } from '../utils/websocket';
import type {
  ChatMessagesResponse,
  ChatMessageItem,
  WebSocketChatMessage,
  ChatParticipant,
} from '../types';

const { Text } = Typography;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const BackButton = styled(Button)`
  &.ant-btn {
    background: transparent;
    border: none;
    color: #595959;
    box-shadow: none;
    padding: 8px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &:focus {
      background: #f5f5f5;
      color: #262626;
    }

    .anticon {
      font-size: 18px;
    }
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  display: block;
`;

const UserStatus = styled(Text)`
  font-size: 12px;
  color: #8c8c8c;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px 16px 80px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 64px;
`;

const MessageGroup = styled.div`
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ isOwn?: boolean }>`
  max-width: 70%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOwn ? 'flex-end' : 'flex-start')};
  margin-left: ${(props) => (props.isOwn ? 'auto' : '0')};
  margin-right: ${(props) => (props.isOwn ? '0' : 'auto')};
`;

const MessageContent = styled.div<{ isOwn?: boolean }>`
  background: ${(props) => (props.isOwn ? '#1890ff' : 'white')};
  color: ${(props) => (props.isOwn ? 'white' : '#262626')};
  padding: 12px 16px;
  border-radius: 18px;
  border-top-left-radius: ${(props) => (props.isOwn ? '18px' : '4px')};
  border-top-right-radius: ${(props) => (props.isOwn ? '4px' : '18px')};
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: ${(props) => (props.isOwn ? 'none' : '1px solid #f0f0f0')};
`;

const MessageTime = styled(Text)`
  font-size: 11px;
  color: #bdbdbd;
  margin-top: 4px;
  margin-left: ${(props: { isOwn?: boolean }) => (props.isOwn ? '0' : '8px')};
  margin-right: ${(props: { isOwn?: boolean }) => (props.isOwn ? '8px' : '0')};
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: 65px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: flex-end;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
`;

const MessageInputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const MessageInput = styled(Input.TextArea)`
  &.ant-input {
    border-radius: 20px;
    padding: 12px 16px;
    border: 1px solid #f0f0f0;
    background: #f8f9fa;
    font-size: 14px;
    resize: none;
    min-height: 44px;
    max-height: 120px;
    line-height: 1.4;

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      background: white;
    }

    &::placeholder {
      color: #bdbdbd;
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
  }
`;

const SendButton = styled(Button)`
  &.ant-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #1890ff;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
    flex-shrink: 0;

    &:hover,
    &:focus {
      background: #40a9ff;
      transform: scale(1.05);
    }

    &:disabled {
      background: #f5f5f5;
      color: #bdbdbd;
      transform: none;
      box-shadow: none;
    }

    .anticon {
      font-size: 16px;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #8c8c8c;
  text-align: center;
`;

const ConnectionStatus = styled.div<{ connected: boolean; visible: boolean }>`
  position: fixed;
  top: 64px;
  left: 16px;
  right: 16px;
  z-index: 999;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  background: ${(props) => (props.connected ? '#52c41a' : '#ff4d4f')};
  color: white;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? '0' : '-20px')});
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
`;

const ChatDetailPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [isSending, setIsSending] = useState(false);

  const auth = useAtomValue(authAtom);
  const currentUserIdNum = auth.user ? parseInt(auth.user.id, 10) : null;
  const currentUserNickname = auth.user?.nickname || '';

  const chatRoomId = roomId || '';

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery<ChatMessagesResponse>({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => chatAPI.getChatMessages(chatRoomId),
    enabled: !!chatRoomId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let mounted = true;
    let statusTimeout: NodeJS.Timeout;

    const connectWebSocket = async () => {
      try {
        await webSocketManager.connect();
        if (mounted) {
          setIsWebSocketConnected(true);
          setShowConnectionStatus(true);
          console.log('WebSocket 연결 성공');
          statusTimeout = setTimeout(
            () => setShowConnectionStatus(false),
            3000
          );
        }
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
        if (mounted) {
          setIsWebSocketConnected(false);
          setShowConnectionStatus(true);
          statusTimeout = setTimeout(
            () => setShowConnectionStatus(false),
            3000
          );
        }
      }
    };

    connectWebSocket();

    return () => {
      mounted = false;
      clearTimeout(statusTimeout);
    };
  }, []);

  useEffect(() => {
    if (
      !chatRoomId ||
      !isWebSocketConnected ||
      currentUserIdNum === null ||
      !currentUserNickname
    )
      return;

    try {
      webSocketManager.joinChatRoom(
        chatRoomId,
        currentUserIdNum,
        currentUserNickname
      );

      const unsubscribe = webSocketManager.subscribeToChatRoom(
        chatRoomId,
        (newMessage: WebSocketChatMessage) => {
          console.log('새 메시지 수신:', newMessage);
          const serverMessage: ChatMessageItem = {
            messageId: newMessage.messageId,
            chatRoomId: newMessage.chatRoomId,
            senderId: newMessage.senderId,
            senderNickname: newMessage.senderNickname,
            content: newMessage.content,
            messageType: newMessage.messageType || 'TEXT',
            createdAt: newMessage.createdAt,
            isRead: newMessage.isRead,
          };

          setMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter(
              (msg) =>
                !(
                  msg.senderId === serverMessage.senderId &&
                  msg.content === serverMessage.content &&
                  msg.messageId !== serverMessage.messageId &&
                  new Date(serverMessage.createdAt).getTime() -
                    new Date(msg.createdAt).getTime() <
                    2000
                )
            );

            const exists = filteredMessages.some(
              (msg) => msg.messageId === serverMessage.messageId
            );
            if (exists) {
              return filteredMessages.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
            }
            return [...filteredMessages, serverMessage].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          });
        }
      );
      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        if (currentUserIdNum !== null) {
          webSocketManager.leaveChatRoom(
            chatRoomId,
            currentUserIdNum,
            currentUserNickname
          );
        }
      };
    } catch (error) {
      console.error('채팅방 구독 또는 참여/퇴장 실패:', error);
      antdMessage.error('채팅방 기능에 오류가 발생했습니다.');
    }
  }, [chatRoomId, isWebSocketConnected, currentUserIdNum, currentUserNickname]);

  useEffect(() => {
    if (messagesData?.data) {
      setMessages(
        messagesData.data.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    }
  }, [messagesData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (
      !messageText.trim() ||
      !chatRoomId ||
      !isWebSocketConnected ||
      isSending ||
      currentUserIdNum === null
    )
      return;

    const messageToSend = messageText.trim();
    const tempMessageId = Date.now();

    setIsSending(true);
    setMessageText('');

    const optimisticMessage: ChatMessageItem = {
      messageId: tempMessageId,
      chatRoomId: chatRoomId,
      senderId: currentUserIdNum,
      senderNickname: currentUserNickname,
      content: messageToSend,
      messageType: 'TEXT',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prevMessages) =>
      [...prevMessages, optimisticMessage].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    );

    scrollToBottom();

    try {
      webSocketManager.sendMessage(
        chatRoomId,
        messageToSend,
        currentUserIdNum,
        currentUserNickname
      );
    } catch (error) {
      console.error('WebSocket 메시지 전송 실패:', error);
      antdMessage.error('메시지 전송에 실패했습니다. 연결을 확인해주세요.');
      setMessageText(messageToSend);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.messageId !== tempMessageId)
      );
    } finally {
      setIsSending(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getPartnerInfo = (): ChatParticipant => {
    const partnerInParticipants =
      messagesData?.data?.[0]?.senderId.toString() !==
      currentUserIdNum?.toString()
        ? messagesData?.data?.[0]?.senderNickname
        : '상대방';

    return {
      userId: 999,
      nickname: partnerInParticipants || '채팅 상대방',
      profileImage: 'https://placehold.co/40x40',
      isOnline: true,
    };
  };
  const partner = getPartnerInfo();

  if (isLoadingMessages) {
    return (
      <ChatContainer>
        <ChatHeader>
          <HeaderLeft>
            <BackButton
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            />
          </HeaderLeft>
        </ChatHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 65px)',
            paddingTop: '65px',
          }}
        >
          <Spin size="large" />
        </div>
      </ChatContainer>
    );
  }

  if (messagesError) {
    return (
      <ChatContainer>
        <ChatHeader>
          <HeaderLeft>
            <BackButton
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            />
            <Text>오류</Text>
          </HeaderLeft>
        </ChatHeader>
        <EmptyState
          style={{ height: 'calc(100vh - 65px)', paddingTop: '65px' }}
        >
          <Alert
            message="채팅을 불러올 수 없습니다"
            description={
              messagesError.message || '네트워크를 확인하고 다시 시도해주세요.'
            }
            type="error"
            showIcon
          />
          <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
            돌아가기
          </Button>
        </EmptyState>
      </ChatContainer>
    );
  }

  if (!chatRoomId) {
    return (
      <ChatContainer>
        <EmptyState>
          <Text>올바른 채팅방 ID가 아닙니다</Text>
          <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
            돌아가기
          </Button>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ConnectionStatus
        connected={isWebSocketConnected}
        visible={showConnectionStatus}
      >
        {isWebSocketConnected ? '실시간 연결됨' : '연결 중...'}
      </ConnectionStatus>

      <ChatHeader>
        <HeaderLeft>
          <BackButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <Avatar src={partner.profileImage} size={40} />
          <UserInfo>
            <UserName>{partner.nickname}</UserName>
            <UserStatus>
              {partner.isOnline ? (
                <Badge status="success" text="온라인" />
              ) : (
                '오프라인'
              )}
            </UserStatus>
          </UserInfo>
        </HeaderLeft>
      </ChatHeader>

      <MessagesContainer>
        {messages.length === 0 && !isLoadingMessages ? (
          <EmptyState>
            <Text>아직 메시지가 없습니다.</Text>
            <Text type="secondary">첫 메시지를 보내보세요!</Text>
          </EmptyState>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserIdNum;
            return (
              <MessageGroup key={msg.messageId}>
                <MessageBubble isOwn={isOwn}>
                  <MessageContent isOwn={isOwn}>{msg.content}</MessageContent>
                  <MessageTime isOwn={isOwn}>
                    {formatTime(msg.createdAt)}
                  </MessageTime>
                </MessageBubble>
              </MessageGroup>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInputWrapper>
          <MessageInput
            ref={inputRef}
            placeholder="메시지를 입력하세요..."
            value={messageText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
            showCount={false}
            disabled={!isWebSocketConnected || isSending}
          />
        </MessageInputWrapper>
        <SendButton
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={
            !messageText.trim() ||
            !isWebSocketConnected ||
            isSending ||
            currentUserIdNum === null
          }
          loading={isSending}
        />
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatDetailPage;
