import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  avatar?: string;
  isStreamer?: boolean;
}

interface StreamChat {
  streamId: string;
  messages: ChatMessage[];
  viewerCount: number;
}

// In-memory storage for demo purposes
const streamChats = new Map<string, StreamChat>();

// Simulated active users for realistic chat
const simulatedUsers = [
  { username: 'StreamFan123', avatar: '🎮' },
  { username: 'LiveViewer', avatar: '👀' },
  { username: 'ChatMaster', avatar: '💬' },
  { username: 'VideoLover', avatar: '📺' },
  { username: 'TechGuru', avatar: '🔧' },
  { username: 'StreamWatcher', avatar: '⭐' },
];

const simulatedMessages = [
  'Great stream!',
  'Love the content!',
  'Keep it up!',
  'Amazing quality!',
  'First time here, loving it!',
  'How long have you been streaming?',
  'The audio is perfect',
  'Can you show that again?',
  'This is so cool!',
  'Thanks for streaming!',
];

function generateSimulatedMessage(streamId: string): ChatMessage {
  const user = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
  const message = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
  
  return {
    id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: user.username,
    message: message,
    timestamp: Date.now(),
    avatar: user.avatar,
    isStreamer: false,
  };
}

function initializeStreamChat(streamId: string) {
  if (!streamChats.has(streamId)) {
    streamChats.set(streamId, {
      streamId,
      messages: [],
      viewerCount: Math.floor(Math.random() * 50) + 10,
    });
    
    // Add some initial messages
    const chat = streamChats.get(streamId)!;
    for (let i = 0; i < 3; i++) {
      chat.messages.push(generateSimulatedMessage(streamId));
    }
  }
}

// GET /api/chat?streamId=xxx - Get chat messages for a stream
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get('streamId');
    const since = searchParams.get('since');
    
    if (!streamId) {
      return NextResponse.json(
        { error: 'Stream ID is required' },
        { status: 400 }
      );
    }

    initializeStreamChat(streamId);
    const chat = streamChats.get(streamId)!;
    
    let messages = chat.messages;
    
    // Filter messages since timestamp if provided
    if (since) {
      const sinceTimestamp = parseInt(since);
      messages = messages.filter(msg => msg.timestamp > sinceTimestamp);
    }
    
    // Randomly add simulated messages (10% chance)
    if (Math.random() < 0.1) {
      const newMessage = generateSimulatedMessage(streamId);
      chat.messages.push(newMessage);
      messages.push(newMessage);
      
      // Keep only last 100 messages
      if (chat.messages.length > 100) {
        chat.messages = chat.messages.slice(-100);
      }
    }
    
    // Simulate viewer count changes
    if (Math.random() < 0.3) {
      const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
      chat.viewerCount = Math.max(1, chat.viewerCount + change);
    }

    return NextResponse.json({
      messages: messages.slice(-50), // Return last 50 messages
      viewerCount: chat.viewerCount,
      streamId,
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Send a chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { streamId, message, username, isStreamer = false } = body;
    
    if (!streamId || !message || !username) {
      return NextResponse.json(
        { error: 'Stream ID, message, and username are required' },
        { status: 400 }
      );
    }

    // Basic message validation
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message too long (max 500 characters)' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    initializeStreamChat(streamId);
    const chat = streamChats.get(streamId)!;
    
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: username.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      avatar: isStreamer ? '🎥' : '👤',
      isStreamer,
    };
    
    chat.messages.push(chatMessage);
    
    // Keep only last 100 messages
    if (chat.messages.length > 100) {
      chat.messages = chat.messages.slice(-100);
    }

    return NextResponse.json({
      success: true,
      message: chatMessage,
      viewerCount: chat.viewerCount,
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat - Clear chat for a stream (streamer only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get('streamId');
    
    if (!streamId) {
      return NextResponse.json(
        { error: 'Stream ID is required' },
        { status: 400 }
      );
    }

    if (streamChats.has(streamId)) {
      const chat = streamChats.get(streamId)!;
      chat.messages = [];
    }

    return NextResponse.json({
      success: true,
      message: 'Chat cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing chat:', error);
    return NextResponse.json(
      { error: 'Failed to clear chat' },
      { status: 500 }
    );
  }
}