import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

export interface SocketEventHandlers {
  onConnected?: (data: any) => void;
  onDisconnected?: (data: any) => void;
  onConnectionError?: (error: any) => void;
  onJoinedConversation?: (data: any) => void;
  onMessageSent?: (data: any) => void;
  onAITypingStart?: (data: any) => void;
  onAIStreamChunk?: (data: any) => void;
  onAIStreamComplete?: (data: any) => void;
  onAITypingStop?: (data: any) => void;
  onAIStreamError?: (data: any) => void;
  onTypingStart?: (data: any) => void;
  onTypingStopped?: (data: any) => void;
  onNotification?: (data: any) => void;
  onBroadcast?: (data: any) => void;
  onError?: (error: any) => void;
}

class SocketClient {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private eventHandlers: SocketEventHandlers = {};
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.serverUrl = 'https://tungpt-back.onrender.com';
    console.log('🔌 Socket Client connecting to:', this.serverUrl);
  }

  connect(handlers: SocketEventHandlers = {}) {
    this.eventHandlers = handlers;
    
    // Add a small delay to ensure cookies are set after login
    setTimeout(() => {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No authentication token found');
        this.eventHandlers.onConnectionError?.({ error: 'No authentication token found' });
        return;
      }

      try {
        this.socket = io(this.serverUrl, {
          auth: {
            token: token
          },
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          timeout: 20000
        });

        this.setupEventListeners();
      } catch (error) {
        console.error('Socket initialization error:', error);
        this.eventHandlers.onError?.(error);
      }
    }, 100); // 100ms delay to ensure cookies are set
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Connected to chat server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.eventHandlers.onConnected?.({ socketId: this.socket?.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from chat server:', reason);
      this.isConnected = false;
      this.eventHandlers.onDisconnected?.({ reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.reconnectAttempts++;
      this.eventHandlers.onConnectionError?.({ error, attempts: this.reconnectAttempts });
    });

    // Chat events
    this.socket.on('joined-conversation', (data) => {
      console.log('👥 Joined conversation:', data.conversationId);
      this.eventHandlers.onJoinedConversation?.(data);
    });

    this.socket.on('message-sent', (data) => {
      console.log('💬 Message sent:', data);
      this.eventHandlers.onMessageSent?.(data);
    });

    this.socket.on('ai-typing-start', (data) => {
      console.log('🤖 AI is typing...');
      this.eventHandlers.onAITypingStart?.(data);
    });

    this.socket.on('ai-stream-chunk', (data) => {
      this.eventHandlers.onAIStreamChunk?.(data);
    });

    this.socket.on('ai-stream-complete', (data) => {
      console.log('✅ AI response complete');
      this.eventHandlers.onAIStreamComplete?.(data);
    });

    this.socket.on('ai-typing-stop', (data) => {
      console.log('🤖 AI stopped typing');
      this.eventHandlers.onAITypingStop?.(data);
    });

    this.socket.on('ai-stream-error', (data) => {
      console.error('❌ AI streaming error:', data);
      this.eventHandlers.onAIStreamError?.(data);
    });

    // Typing indicators
    this.socket.on('typing-start', (data) => {
      console.log('⌨️ User typing:', data.username);
      this.eventHandlers.onTypingStart?.(data);
    });

    this.socket.on('typing-stopped', (data) => {
      console.log('⌨️ User stopped typing:', data.username);
      this.eventHandlers.onTypingStopped?.(data);
    });

    // Notifications
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification received:', data);
      this.eventHandlers.onNotification?.(data);
    });

    this.socket.on('broadcast', (data) => {
      console.log('📢 Broadcast received:', data);
      this.eventHandlers.onBroadcast?.(data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      this.eventHandlers.onError?.(error);
    });
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Conversation management
  joinConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-conversation', { conversationId });
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-conversation', { conversationId });
    }
  }

  // Message streaming
  streamMessage(conversationId: string, message: string, model: string = 'gpt-4o-mini') {
    if (this.socket && this.isConnected) {
      this.socket.emit('stream-message', {
        conversationId,
        message,
        model
      });
    }
  }

  // Typing indicators
  startTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', { conversationId });
    }
  }

  stopTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', { conversationId });
    }
  }

  // Debounced typing indicator
  debouncedTyping(conversationId: string, delay: number = 1000) {
    // Clear existing timeout
    if (this.typingTimeouts.has(conversationId)) {
      clearTimeout(this.typingTimeouts.get(conversationId)!);
    }

    // Start typing indicator
    this.startTyping(conversationId);

    // Set timeout to stop typing
    const timeout = setTimeout(() => {
      this.stopTyping(conversationId);
      this.typingTimeouts.delete(conversationId);
    }, delay);

    this.typingTimeouts.set(conversationId, timeout);
  }

  // Utility methods
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  // Cleanup
  destroy() {
    // Clear all typing timeouts
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();

    // Disconnect socket
    this.disconnect();
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient;
