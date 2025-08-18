"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Heart, Smile, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'follow' | 'donation' | 'system';
  avatar?: string;
  badges?: string[];
  amount?: number;
}

interface ChatPanelProps {
  streamId?: string;
  isStreamer?: boolean;
  className?: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    username: 'StreamFan123',
    message: 'Great stream! Love the content 🔥',
    timestamp: new Date(Date.now() - 300000),
    type: 'message',
    badges: ['subscriber']
  },
  {
    id: '2',
    username: 'TechGuru',
    message: 'Just followed! Keep up the amazing work',
    timestamp: new Date(Date.now() - 240000),
    type: 'follow',
    badges: ['follower']
  },
  {
    id: '3',
    username: 'GamerPro',
    message: 'What camera are you using? Quality looks amazing',
    timestamp: new Date(Date.now() - 180000),
    type: 'message'
  },
  {
    id: '4',
    username: 'SupporterX',
    message: 'Thanks for the great content!',
    timestamp: new Date(Date.now() - 120000),
    type: 'donation',
    amount: 5,
    badges: ['donor']
  }
];

const EMOJIS = ['😀', '😂', '❤️', '🔥', '👍', '🎉', '😍', '🤔', '👏', '💯'];

export function ChatPanel({ streamId, isStreamer = false, className }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [viewerCount, setViewerCount] = useState(127);
  const [isConnected, setIsConnected] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate real-time messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomMessages = [
          'This is awesome!',
          'Great quality stream',
          'Hello from the chat!',
          'Keep it up! 👍',
          'Amazing content as always',
          'First time watching, love it!',
          'Can you show that again?',
          'Thanks for streaming!'
        ];
        
        const randomUsernames = [
          'Viewer' + Math.floor(Math.random() * 1000),
          'StreamLover',
          'TechEnthusiast',
          'ContentFan',
          'RandomUser' + Math.floor(Math.random() * 100)
        ];

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          type: 'message'
        };

        setMessages(prev => [...prev, newMsg]);
        
        // Update viewer count randomly
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: isStreamer ? 'Streamer' : 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'message',
      badges: isStreamer ? ['streamer'] : []
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojis(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'streamer': return 'bg-red-500';
      case 'subscriber': return 'bg-purple-500';
      case 'donor': return 'bg-yellow-500';
      case 'follower': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'follow': return '👤';
      case 'donation': return '💝';
      case 'system': return '⚙️';
      default: return null;
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background border rounded-lg", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Live Chat</h3>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{viewerCount}</span>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2 group">
              <Avatar className="w-6 h-6 mt-1">
                <AvatarImage src={message.avatar} />
                <AvatarFallback className="text-xs">
                  {message.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {message.username}
                  </span>
                  
                  {message.badges?.map((badge) => (
                    <Badge 
                      key={badge} 
                      variant="secondary" 
                      className={cn("text-xs px-1 py-0", getBadgeColor(badge))}
                    >
                      {badge}
                    </Badge>
                  ))}
                  
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  {getMessageTypeIcon(message.type) && (
                    <span className="text-sm">{getMessageTypeIcon(message.type)}</span>
                  )}
                  
                  <div className="flex-1">
                    {message.type === 'donation' && message.amount && (
                      <div className="text-sm font-medium text-yellow-500 mb-1">
                        Donated ${message.amount}!
                      </div>
                    )}
                    
                    {message.type === 'follow' && (
                      <div className="text-sm font-medium text-blue-500 mb-1">
                        Started following!
                      </div>
                    )}
                    
                    <p className="text-sm break-words">{message.message}</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Emoji Picker */}
      {showEmojis && (
        <div className="p-2 border-t bg-muted/50">
          <div className="grid grid-cols-5 gap-1">
            {EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            maxLength={500}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          {newMessage.length}/500
        </div>
      </div>
    </div>
  );
}