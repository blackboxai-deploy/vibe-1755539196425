import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'emoji';
  avatar?: string;
}

export interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  isModerator?: boolean;
}

interface UseChatOptions {
  streamId?: string;
  username?: string;
  maxMessages?: number;
  enableEmojis?: boolean;
  enableModeration?: boolean;
}

export const useChat = (options: UseChatOptions = {}) => {
  const {
    streamId = 'default',
    username = 'Anonymous',
    maxMessages = 100,
    enableEmojis = true,
    enableModeration = true
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated bot messages for demo
  const botMessages = [
    "Welcome to the stream! 🎉",
    "Don't forget to follow for more content!",
    "Great stream quality today! 📺",
    "Thanks for watching everyone! ❤️",
    "New viewer joined! Say hello! 👋",
    "Stream has been running for 30 minutes! ⏰"
  ];

  // Initialize chat connection
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simulate WebSocket connection
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
        
        // Add initial system message
        const welcomeMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          username: 'System',
          message: `${username} joined the chat`,
          timestamp: new Date(),
          type: 'system'
        };
        
        setMessages(prev => [...prev, welcomeMessage]);

        // Add current user to users list
        const currentUser: ChatUser = {
          id: `user-${Date.now()}`,
          username,
          isOnline: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        };
        
        setUsers(prev => [...prev, currentUser]);

        // Simulate other users
        const simulatedUsers: ChatUser[] = [
          {
            id: 'user-1',
            username: 'StreamFan123',
            isOnline: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StreamFan123'
          },
          {
            id: 'user-2',
            username: 'VideoLover',
            isOnline: true,
            isModerator: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VideoLover'
          },
          {
            id: 'user-3',
            username: 'ChatMaster',
            isOnline: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChatMaster'
          }
        ];

        setUsers(prev => [...prev, ...simulatedUsers]);
      }, 1000);
    } catch (err) {
      setError('Failed to connect to chat');
      setIsLoading(false);
    }
  }, [username]);

  // Disconnect from chat
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback((message: string) => {
    if (!isConnected || !message.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      username,
      message: message.trim(),
      timestamp: new Date(),
      type: enableEmojis && /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]$/u.test(message.trim()) ? 'emoji' : 'message',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      return updated.slice(-maxMessages);
    });

    // Simulate responses from other users
    setTimeout(() => {
      const responses = [
        "Nice! 👍",
        "Totally agree!",
        "LOL 😂",
        "Great point!",
        "Thanks for sharing!",
        "🔥🔥🔥",
        "Awesome stream!",
        "Keep it up!"
      ];

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      if (randomUser && randomUser.username !== username) {
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          username: randomUser.username,
          message: randomResponse,
          timestamp: new Date(),
          type: 'message',
          avatar: randomUser.avatar
        };

        setMessages(prev => {
          const updated = [...prev, responseMessage];
          return updated.slice(-maxMessages);
        });
      }
    }, Math.random() * 3000 + 1000);
  }, [isConnected, username, enableEmojis, maxMessages, users]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isConnected) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Simulate other users typing
    const otherUsers = users.filter(user => user.username !== username);
    if (otherUsers.length > 0 && Math.random() > 0.7) {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      setTypingUsers(prev => [...prev.filter(u => u !== randomUser.username), randomUser.username]);

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== randomUser.username));
      }, 2000);
    }
  }, [isConnected, users, username]);

  // Clear chat messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Ban user (moderation)
  const banUser = useCallback((userId: string) => {
    if (!enableModeration) return;

    setUsers(prev => prev.filter(user => user.id !== userId));
    setMessages(prev => prev.filter(msg => msg.username !== users.find(u => u.id === userId)?.username));
  }, [enableModeration, users]);

  // Delete message (moderation)
  const deleteMessage = useCallback((messageId: string) => {
    if (!enableModeration) return;

    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, [enableModeration]);

  // Simulate periodic bot messages
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomBotMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          username: 'StreamBot',
          message: randomBotMessage,
          timestamp: new Date(),
          type: 'system'
        };

        setMessages(prev => {
          const updated = [...prev, botMessage];
          return updated.slice(-maxMessages);
        });
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, maxMessages]);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [connect, disconnect]);

  return {
    // State
    messages,
    users,
    isConnected,
    isLoading,
    error,
    typingUsers,

    // Actions
    connect,
    disconnect,
    sendMessage,
    handleTyping,
    clearMessages,
    banUser,
    deleteMessage,

    // Computed
    onlineUserCount: users.filter(user => user.isOnline).length,
    messageCount: messages.length
  };
};

export default useChat;