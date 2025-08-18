"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Square, 
  Users, 
  Eye, 
  Clock, 
  Signal, 
  Settings, 
  Edit3, 
  Save,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  Monitor,
  Wifi,
  WifiOff,
  Heart,
  MessageCircle,
  Share2,
  Download,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface StreamStats {
  viewers: number;
  duration: string;
  quality: string;
  bitrate: string;
  fps: number;
  likes: number;
  messages: number;
  shares: number;
}

interface StreamSettings {
  title: string;
  description: string;
  isPrivate: boolean;
  allowChat: boolean;
  recordStream: boolean;
  quality: string;
  enableCamera: boolean;
  enableMicrophone: boolean;
}

export default function StreamDashboard() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState(85);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: 0,
    duration: '00:00:00',
    quality: '1080p',
    bitrate: '0 kbps',
    fps: 0,
    likes: 0,
    messages: 0,
    shares: 0
  });

  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: 'My Live Stream',
    description: 'Welcome to my stream! Thanks for watching.',
    isPrivate: false,
    allowChat: true,
    recordStream: false,
    quality: '1080p',
    enableCamera: true,
    enableMicrophone: true
  });

  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStreaming && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setStreamStats(prev => ({
          ...prev,
          duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
          viewers: Math.floor(Math.random() * 50) + prev.viewers * 0.95,
          bitrate: `${Math.floor(Math.random() * 1000) + 2000} kbps`,
          fps: Math.floor(Math.random() * 5) + 58,
          likes: prev.likes + Math.floor(Math.random() * 3),
          messages: prev.messages + Math.floor(Math.random() * 5),
          shares: prev.shares + Math.floor(Math.random() * 2)
        }));
        
        setConnectionQuality(Math.floor(Math.random() * 20) + 75);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, startTime]);

  const handleStartStream = () => {
    setIsStreaming(true);
    setStartTime(new Date());
    setStreamStats(prev => ({ ...prev, viewers: 1, fps: 60 }));
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setStartTime(null);
    setStreamStats(prev => ({ 
      ...prev, 
      viewers: 0, 
      bitrate: '0 kbps', 
      fps: 0 
    }));
  };

  const handleSaveSettings = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Settings saved:', streamSettings);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '1080p': return 'bg-green-500';
      case '720p': return 'bg-yellow-500';
      case '480p': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getConnectionColor = (quality: number) => {
    if (quality >= 80) return 'text-green-500';
    if (quality >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Stream Dashboard</h1>
            <p className="text-gray-400">Manage your live stream and monitor performance</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isStreaming ? "default" : "secondary"}
              className={`px-3 py-1 ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600'}`}
            >
              {isStreaming ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  LIVE
                </>
              ) : (
                'OFFLINE'
              )}
            </Badge>
            
            {isStreaming ? (
              <Button 
                onClick={handleStopStream}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Stream
              </Button>
            ) : (
              <Button 
                onClick={handleStartStream}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Stream
              </Button>
            )}
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Live Viewers</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.floor(streamStats.viewers)}</div>
              <p className="text-xs text-gray-400">
                {isStreaming ? '+12% from last stream' : 'Stream offline'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Stream Duration</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{streamStats.duration}</div>
              <p className="text-xs text-gray-400">
                {isStreaming ? 'Currently streaming' : 'Last stream: 2h 34m'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Stream Quality</CardTitle>
              <Monitor className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{streamStats.quality}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getQualityColor(streamStats.quality)}`} />
                <p className="text-xs text-gray-400">{streamStats.fps} FPS</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Connection</CardTitle>
              {connectionQuality >= 70 ? (
                <Wifi className={`h-4 w-4 ${getConnectionColor(connectionQuality)}`} />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{connectionQuality}%</div>
              <p className="text-xs text-gray-400">{streamStats.bitrate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">Settings</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">Analytics</TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-gray-700">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stream Preview */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Stream Preview</CardTitle>
                  <CardDescription>Live preview of your stream</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {isStreaming ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-white mx-auto mb-2" />
                          <p className="text-white">Live Stream Active</p>
                          <p className="text-gray-300 text-sm">Broadcasting in {streamStats.quality}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CameraOff className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Stream Offline</p>
                        <p className="text-gray-500 text-sm">Click "Start Stream" to begin</p>
                      </div>
                    )}
                    
                    {isStreaming && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 hover:bg-red-600">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          LIVE
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Engagement</CardTitle>
                  <CardDescription>Real-time viewer interaction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-gray-300">Likes</span>
                    </div>
                    <span className="text-white font-semibold">{streamStats.likes}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Messages</span>
                    </div>
                    <span className="text-white font-semibold">{streamStats.messages}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Shares</span>
                    </div>
                    <span className="text-white font-semibold">{streamStats.shares}</span>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">Connection Quality</span>
                      <span className={`text-sm font-semibold ${getConnectionColor(connectionQuality)}`}>
                        {connectionQuality}%
                      </span>
                    </div>
                    <Progress value={connectionQuality} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Stream Settings</CardTitle>
                  <CardDescription>Configure your stream preferences</CardDescription>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Stream Title</Label>
                      <Input
                        id="title"
                        value={streamSettings.title}
                        onChange={(e) => setStreamSettings(prev => ({ ...prev, title: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        value={streamSettings.description}
                        onChange={(e) => setStreamSettings(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="private" className="text-gray-300">Private Stream</Label>
                      <Switch
                        id="private"
                        checked={streamSettings.isPrivate}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, isPrivate: checked }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="chat" className="text-gray-300">Allow Chat</Label>
                      <Switch
                        id="chat"
                        checked={streamSettings.allowChat}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, allowChat: checked }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="record" className="text-gray-300">Record Stream</Label>
                      <Switch
                        id="record"
                        checked={streamSettings.recordStream}
                        onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, recordStream: checked }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1,234</div>
                  <p className="text-green-400 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15% this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Average Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">2h 15m</div>
                  <p className="text-blue-400 text-sm">Per stream session</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Peak Viewers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">89</div>
                  <p className="text-purple-400 text-sm">Highest concurrent</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Audio/Video Controls</CardTitle>
                  <CardDescription>Manage your camera and microphone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {streamSettings.enableCamera ? (
                        <Camera className="w-5 h-5 text-green-400" />
                      ) : (
                        <CameraOff className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-gray-300">Camera</span>
                    </div>
                    <Switch
                      checked={streamSettings.enableCamera}
                      onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableCamera: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {streamSettings.enableMicrophone ? (
                        <Mic className="w-5 h-5 text-green-400" />
                      ) : (
                        <MicOff className="w-5 h-5 text-red-400" />
                      )}
                      <span className="text-gray-300">Microphone</span>
                    </div>
                    <Switch
                      checked={streamSettings.enableMicrophone}
                      onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableMicrophone: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription>Stream management shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Stream Recording
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Stream Link
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}