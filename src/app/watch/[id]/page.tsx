'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Share2, 
  Users, 
  Eye,
  Send,
  Settings,
  MoreVertical
} from 'lucide-react';

interface StreamData {
  id: string;
  title: string;
  description: string;
  streamerName: string;
  streamerAvatar: string;
  isLive: boolean;
  viewerCount: number;
  duration: string;
  category: string;
  thumbnailUrl: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isStreamer: boolean;
}

export default function WatchStreamPage() {
  const params = useParams();
  const streamId = params.id as string;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showChat, setShowChat] = useState(true);

  // Mock stream data
  const [streamData, setStreamData] = useState<StreamData>({
    id: streamId,
    title: 'Live Gaming Session - Building Epic Worlds',
    description: 'Join me as we explore new territories and build amazing structures in this epic gaming session!',
    streamerName: 'StreamerPro',
    streamerAvatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/333b0187-1c91-40a6-98c0-2f2df40598e4.png',
    isLive: true,
    viewerCount: 1247,
    duration: '2:34:15',
    category: 'Gaming',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a001d0cc-b44a-4c06-8977-39f38aed17c3.png'
  });

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'Viewer123',
      message: 'Great stream! Love the content 🔥',
      timestamp: '2:34:10',
      isStreamer: false
    },
    {
      id: '2',
      username: 'StreamerPro',
      message: 'Thanks everyone for watching! More epic content coming up',
      timestamp: '2:34:12',
      isStreamer: true
    },
    {
      id: '3',
      username: 'GameFan99',
      message: 'How did you build that structure so fast?',
      timestamp: '2:34:14',
      isStreamer: false
    }
  ]);

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamData(prev => ({
        ...prev,
        viewerCount: prev.viewerCount + Math.floor(Math.random() * 10) - 5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Amazing gameplay!',
        'How do you do that?',
        'This is so cool!',
        'Keep it up!',
        'Love this stream',
        'First time watching, great content!'
      ];
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: `Viewer${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date().toLocaleTimeString(),
        isStreamer: false
      };

      setChatMessages(prev => [...prev.slice(-50), newMessage]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'You',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString(),
        isStreamer: false
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video group">
              <img 
                src={streamData.thumbnailUrl}
                alt="Stream"
                className="w-full h-full object-cover"
              />
              
              {/* Live Badge */}
              {streamData.isLive && (
                <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  LIVE
                </Badge>
              )}

              {/* Viewer Count */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {streamData.viewerCount.toLocaleString()}
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="text-sm">{streamData.duration}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold mb-2">{streamData.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={streamData.streamerAvatar} />
                    <AvatarFallback>{streamData.streamerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{streamData.streamerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {streamData.viewerCount.toLocaleString()} viewers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isFollowing ? "default" : "outline"}
                    onClick={() => setIsFollowing(!isFollowing)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{streamData.description}</p>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{streamData.category}</Badge>
                <Badge variant="outline">HD Quality</Badge>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Live Chat
                  <Badge variant="outline" className="text-xs">
                    {chatMessages.length} messages
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            message.isStreamer ? 'text-primary' : 'text-foreground'
                          }`}>
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground break-words">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Chat Input */}
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}