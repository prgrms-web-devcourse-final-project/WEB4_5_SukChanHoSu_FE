import styled from '@emotion/styled';
import { List, Avatar, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import Title from '../components/common/Title';

const ChatContainer = styled.div`
  width: 100%;
  padding: 40px 0;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const ChatInfo = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const ChatName = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  color: #888;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const TimeStamp = styled.div`
  color: #aaa;
  font-size: 12px;
  min-width: 60px;
  text-align: right;
`;

function Chat() {
  const navigate = useNavigate();

  const chatRooms = [
    {
      id: 1,
      name: '영화 매니아 김철수',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: '오늘 저녁에 영화 보러 갈래요?',
      time: '오후 2:30',
      unread: 2,
    },
    {
      id: 2,
      name: '영화친구 이영희',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: '액션 영화 좋아하세요? 추천해드릴게요!',
      time: '오전 11:20',
      unread: 0,
    },
    {
      id: 3,
      name: '박지성',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      lastMessage: '내일 개봉하는 영화 같이 볼까요?',
      time: '어제',
      unread: 3,
    },
    {
      id: 4,
      name: '최다영',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      lastMessage: '영화 재미있게 보셨나요?',
      time: '어제',
      unread: 0,
    },
    {
      id: 5,
      name: '정민수',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      lastMessage: '다음에 또 봐요!',
      time: '월요일',
      unread: 0,
    },
  ];

  const handleChatClick = (id: number) => {
    navigate(`/chat/${id}`);
  };

  return (
    <ChatContainer>
      <Title>채팅</Title>
      <List
        dataSource={chatRooms}
        renderItem={(item) => (
          <ChatItem onClick={() => handleChatClick(item.id)}>
            <div style={{ position: 'relative' }}>
              <Avatar src={item.avatar} size={50} />
              {item.unread > 0 && (
                <Badge
                  count={item.unread}
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: '#ff7f00',
                  }}
                />
              )}
            </div>
            <ChatInfo>
              <ChatName>{item.name}</ChatName>
              <LastMessage>{item.lastMessage}</LastMessage>
            </ChatInfo>
            <TimeStamp>{item.time}</TimeStamp>
          </ChatItem>
        )}
      />
    </ChatContainer>
  );
}

export default Chat;
