'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Settings, 
  Users, 
  Eye,
  MessageCircle,
  Share2,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface StreamStats {
  viewers: number;
  duration: string;
  quality: string;
  bitrate: string;
  fps: number;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
}

export default function StreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [streamTitle, setStreamTitle] = useState('My Live Stream');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamQuality, setStreamQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'StreamFan123',
      message: 'Great stream! 🔥',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      username: 'TechLover',
      message: 'What camera are you using?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '3',
      username: 'ViewerX',
      message: 'Amazing quality!',
      timestamp: new Date(Date.now() - 30000),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: 0,
    duration: '00:00:00',
    quality: '720p',
    bitrate: '0 kbps',
    fps: 0
  });

  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setStreamStats(prev => ({
          ...prev,
          duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
          viewers: Math.floor(Math.random() * 50) + 10,
          bitrate: `${Math.floor(Math.random() * 1000) + 2000} kbps`,
          fps: Math.floor(Math.random() * 5) + 28
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, startTime]);

  const initializeCamera = async () => {
    try {
      setConnectionStatus('connecting');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: streamQuality === '1080p' ? 1920 : 1280 },
          height: { ideal: streamQuality === '1080p' ? 1080 : 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setConnectionStatus('connected');
      toast.success('Camera and microphone connected successfully!');
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('disconnected');
      toast.error('Failed to access camera or microphone. Please check permissions.');
    }
  };

  const startStream = async () => {
    if (!stream) {
      await initializeCamera();
    }
    
    if (stream) {
      setIsStreaming(true);
      setStartTime(new Date());
      toast.success('Stream started successfully!');
      
      // Simulate viewer joining
      setTimeout(() => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          username: 'NewViewer',
          message: 'Just joined the stream! 👋',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, newMessage]);
      }, 2000);
    }
  };

  const stopStream = () => {
    setIsStreaming(false);
    setStartTime(null);
    setStreamStats(prev => ({
      ...prev,
      viewers: 0,
      duration: '00:00:00',
      bitrate: '0 kbps',
      fps: 0
    }));
    toast.info('Stream ended');
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: 'You',
        message: newMessage,
        timestamp: new Date(),
        isStreamer: true
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Live Streaming Studio</h1>
          <p className="text-slate-300">Broadcast yourself to the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Streaming Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            <Card className="bg-black/50 border-slate-700">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  
                  {/* Status Indicators */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge variant={isStreaming ? "default" : "secondary"} className="bg-red-600 text-white">
                      {isStreaming ? (
                        <>
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          LIVE
                        </>
                      ) : (
                        'OFFLINE'
                      )}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 text-white border-slate-600">
                      {connectionStatus === 'connected' ? (
                        <><Wifi className="w-3 h-3 mr-1" /> Connected</>
                      ) : connectionStatus === 'connecting' ? (
                        <><RotateCcw className="w-3 h-3 mr-1 animate-spin" /> Connecting</>
                      ) : (
                        <><WifiOff className="w-3 h-3 mr-1" /> Disconnected</>
                      )}
                    </Badge>
                  </div>

                  {/* Stream Stats */}
                  {isStreaming && (
                    <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 text-white text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {streamStats.viewers}
                        </div>
                        <div>{streamStats.duration}</div>
                        <div>{streamStats.quality}</div>
                      </div>
                    </div>
                  )}

                  {/* Control Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isVideoEnabled ? "default" : "destructive"}
                        onClick={toggleVideo}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isAudioEnabled ? "default" : "destructive"}
                        onClick={toggleAudio}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleFullscreen}
                      className="bg-black/50 hover:bg-black/70 border-slate-600"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Stream Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  {!isStreaming ? (
                    <Button onClick={startStream} className="bg-red-600 hover:bg-red-700 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Start Stream
                    </Button>
                  ) : (
                    <Button onClick={stopStream} variant="destructive">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Stream
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={initializeCamera} disabled={connectionStatus === 'connecting'}>
                    <Camera className="w-4 h-4 mr-2" />
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Test Camera'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Stream Title</Label>
                    <Input
                      id="title"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter stream title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quality" className="text-white">Quality</Label>
                    <Select value={streamQuality} onValueChange={setStreamQuality}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Describe your stream..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stream Stats */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Stream Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{streamStats.viewers}</div>
                    <div className="text-sm text-slate-400">Viewers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{streamStats.duration}</div>
                    <div className="text-sm text-slate-400">Duration</div>
                  </div>
                </div>
                
                <Separator className="bg-slate-600" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Bitrate</span>
                    <span className="text-white">{streamStats.bitrate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">FPS</span>
                    <span className="text-white">{streamStats.fps}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Quality</span>
                    <span className="text-white">{streamStats.quality}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-2 bg-slate-900/50 rounded-lg p-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <span className={`font-semibold ${msg.isStreamer ? 'text-purple-400' : 'text-blue-400'}`}>
                        {msg.username}:
                      </span>
                      <span className="text-white ml-2">{msg.message}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button onClick={sendChatMessage} size="sm">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Share link copied!')}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Stream
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Monitor className="w-4 h-4 mr-2" />
                  Screen Share
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}