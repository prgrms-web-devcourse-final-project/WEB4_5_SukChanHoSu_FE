import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Avatar, Button, Input } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafbfc;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled(Button)`
  margin-right: 16px;
  border: none;
  background: none;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-left: 12px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px 16px 16px;
  background: #fafbfc;
`;

const MessageRow = styled.div<{ isMe: boolean }>`
  display: flex;
  flex-direction: ${({ isMe }) => (isMe ? 'row-reverse' : 'row')};
  align-items: flex-end;
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ isMe: boolean }>`
  background: ${({ isMe }) => (isMe ? '#ff7f00' : '#f1f1f1')};
  color: ${({ isMe }) => (isMe ? '#fff' : '#222')};
  padding: 10px 16px;
  border-radius: 18px;
  max-width: 70%;
  font-size: 1rem;
  margin: 0 8px;
  word-break: break-all;
`;

const Time = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin: 0 8px;
  min-width: 48px;
  text-align: ${({ align }: { align: string }) => align};
`;

const ChatInputArea = styled.div`
  display: flex;
  padding: 12px 0;
  background: #fff;
  border-top: 1px solid #eee;
`;

const messagesMock = [
  {
    id: 1,
    userId: 1,
    name: '영화 매니아 김철수',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: '안녕하세요! 영화 좋아하세요?',
    time: '오후 2:00',
  },
  {
    id: 2,
    userId: 0,
    name: '나',
    avatar: '',
    message: '네! 오늘 뭐 볼지 고민 중이에요.',
    time: '오후 2:01',
  },
  {
    id: 3,
    userId: 1,
    name: '영화 매니아 김철수',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    message: '저는 액션 영화 좋아해요. 추천해드릴까요?',
    time: '오후 2:02',
  },
];

function ChatDetail() {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(messagesMock);
  const [input, setInput] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // 예시: userId 0이 나, 1이 상대방
  const myId = 0;
  const user = {
    name: '영화 매니아 김철수',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        userId: myId,
        name: '나',
        avatar: '',
        message: input,
        time: '오후 2:30',
      },
    ]);
    setInput('');
    setTimeout(() => {
      chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
    }, 100);
  };

  return (
    <Container>
      <Header>
        <BackButton icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        <UserInfo>
          <Avatar src={user.avatar} size={40} />
          <UserName>{user.name}</UserName>
        </UserInfo>
      </Header>
      <ChatBody ref={chatBodyRef}>
        {messages.map((msg) => (
          <MessageRow key={msg.id} isMe={msg.userId === myId}>
            {msg.userId !== myId && <Avatar src={user.avatar} size={32} />}
            <MessageBubble isMe={msg.userId === myId}>
              {msg.message}
            </MessageBubble>
            <Time align={msg.userId === myId ? 'right' : 'left'}>
              {msg.time}
            </Time>
          </MessageRow>
        ))}
      </ChatBody>
      <ChatInputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="메시지를 입력하세요"
          style={{ marginRight: 8 }}
        />
        <Button
          type="primary"
          onClick={handleSend}
          icon={<SendOutlined />}
          style={{ background: '#ff7f00', borderColor: '#ff7f00' }}
        />
      </ChatInputArea>
    </Container>
  );
}

export default ChatDetail;
