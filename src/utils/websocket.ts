import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WebSocketMessage, WebSocketChatMessage } from '../types';

class WebSocketManager {
  private client: Client | null = null;
  private isConnected = false;
  private subscribers: Map<string, () => void> = new Map();

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    // SockJS를 통한 WebSocket 연결 설정
    this.client = new Client({
      webSocketFactory: () =>
        new SockJS('https://api.app.mm.ts0608.life/ws-stomp'),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 연결 성공 시
    this.client.onConnect = (frame) => {
      console.log('WebSocket 연결됨:', frame);
      this.isConnected = true;
    };

    // 연결 실패 시
    this.client.onStompError = (frame) => {
      console.error('STOMP 에러:', frame.headers['message']);
      console.error('세부사항:', frame.body);
      this.isConnected = false;
    };

    // 연결 끊김 시
    this.client.onDisconnect = () => {
      console.log('WebSocket 연결 끊김');
      this.isConnected = false;
    };

    // 웹소켓 에러 시
    this.client.onWebSocketError = (event) => {
      console.error('WebSocket 에러:', event);
      this.isConnected = false;
    };
  }

  // WebSocket 연결
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.initializeClient();
      }

      if (this.isConnected) {
        resolve();
        return;
      }

      const originalOnConnect = this.client!.onConnect;
      const originalOnStompError = this.client!.onStompError;

      this.client!.onConnect = (frame) => {
        originalOnConnect(frame);
        resolve();
      };

      this.client!.onStompError = (frame) => {
        originalOnStompError(frame);
        reject(new Error(`STOMP 연결 실패: ${frame.headers['message']}`));
      };

      this.client!.activate();
    });
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
    this.subscribers.clear();
  }

  // 채팅방 구독
  subscribeToChatRoom(
    chatRoomId: string,
    onMessage: (message: WebSocketChatMessage) => void
  ): () => void {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const destination = `/sub/chat/room/${chatRoomId}`;
    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const parsedMessage: WebSocketChatMessage = JSON.parse(message.body);
        onMessage(parsedMessage);
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    });

    const unsubscribe = () => {
      subscription.unsubscribe();
      this.subscribers.delete(`chat-${chatRoomId}`);
    };

    this.subscribers.set(`chat-${chatRoomId}`, unsubscribe);
    return unsubscribe;
  }

  // 메시지 전송
  sendMessage(
    chatRoomId: string,
    content: string,
    senderId: number,
    senderNickname: string
  ) {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const message: WebSocketMessage = {
      type: 'CHAT',
      chatRoomId,
      senderId,
      senderNickname,
      content,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: `/pub/chat/message`,
      body: JSON.stringify(message),
    });
  }

  // 채팅방 입장 알림
  joinChatRoom(chatRoomId: string, userId: number, nickname: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const message: WebSocketMessage = {
      type: 'JOIN',
      chatRoomId,
      senderId: userId,
      senderNickname: nickname,
      content: `${nickname}님이 채팅방에 입장했습니다.`,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: `/pub/chat/message`,
      body: JSON.stringify(message),
    });
  }

  // 채팅방 퇴장 알림
  leaveChatRoom(chatRoomId: string, userId: number, nickname: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    const message: WebSocketMessage = {
      type: 'LEAVE',
      chatRoomId,
      senderId: userId,
      senderNickname: nickname,
      content: `${nickname}님이 채팅방을 나갔습니다.`,
      timestamp: new Date().toISOString(),
    };

    this.client.publish({
      destination: `/pub/chat/message`,
      body: JSON.stringify(message),
    });
  }

  // 연결 상태 확인
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

// 싱글톤 인스턴스
export const webSocketManager = new WebSocketManager();
