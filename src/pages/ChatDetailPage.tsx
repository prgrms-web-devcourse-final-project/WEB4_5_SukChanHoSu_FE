import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Avatar, Typography, Badge } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import {
  getChatAtom,
  getChatPartnerAtom,
  sendMessageAtom,
  currentUserIdAtom,
} from '../store/atoms';

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

// const HeaderActions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const ActionButton = styled(Button)`
//   &.ant-btn {
//     background: transparent;
//     border: none;
//     color: #1890ff;
//     box-shadow: none;
//     padding: 8px;
//     height: auto;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     &:hover,
//     &:focus {
//       background: #f0f8ff;
//       color: #1890ff;
//     }

//     .anticon {
//       font-size: 16px;
//     }
//   }
// `;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px 16px 80px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
  bottom: 67px;
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

const ChatDetailPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = useAtomValue(currentUserIdAtom);
  const getChat = useAtomValue(getChatAtom);
  const getChatPartner = useAtomValue(getChatPartnerAtom);
  const [, sendMessage] = useAtom(sendMessageAtom);

  const chat = chatId ? getChat(Number(chatId)) : null;
  const partner = chatId ? getChatPartner(Number(chatId)) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !chatId) return;

    sendMessage({ chatId: Number(chatId), message: message.trim() });
    setMessage('');

    // 메시지 전송 후 입력창에 포커스
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (!chat || !partner) {
    return (
      <ChatContainer>
        <EmptyState>
          <Text>채팅을 찾을 수 없습니다</Text>
          <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
            돌아가기
          </Button>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderLeft>
          <BackButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <Avatar src={partner.photo} size={40} />
          <UserInfo>
            <UserName>{partner.name}</UserName>
            <UserStatus>
              {partner.isOnline ? (
                <Badge status="success" text="온라인" />
              ) : (
                partner.lastSeen
              )}
            </UserStatus>
          </UserInfo>
        </HeaderLeft>
      </ChatHeader>

      <MessagesContainer>
        {chat.messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <MessageGroup key={msg.id}>
              <MessageBubble isOwn={isOwn}>
                <MessageContent isOwn={isOwn}>{msg.message}</MessageContent>
                <MessageTime isOwn={isOwn}>
                  {formatTime(msg.timestamp)}
                </MessageTime>
              </MessageBubble>
            </MessageGroup>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <MessageInputWrapper>
          <MessageInput
            ref={inputRef}
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 4 }}
            showCount={false}
          />
        </MessageInputWrapper>
        <SendButton
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        />
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatDetailPage;
