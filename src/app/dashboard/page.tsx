"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Play, 
  Square, 
  Users, 
  Eye, 
  Clock, 
  Settings, 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff,
  Share2,
  Download,
  BarChart3,
  Calendar,
  Globe,
  Lock
} from "lucide-react";

interface StreamStats {
  isLive: boolean;
  viewers: number;
  duration: string;
  quality: string;
  bitrate: string;
  totalViews: number;
  peakViewers: number;
  streamHealth: number;
}

interface StreamSettings {
  title: string;
  description: string;
  isPublic: boolean;
  allowChat: boolean;
  recordStream: boolean;
  quality: string;
}

export default function DashboardPage() {
  const [streamStats, setStreamStats] = useState<StreamStats>({
    isLive: false,
    viewers: 0,
    duration: "00:00:00",
    quality: "1080p",
    bitrate: "0 kbps",
    totalViews: 1247,
    peakViewers: 89,
    streamHealth: 95
  });

  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    title: "My Live Stream",
    description: "Welcome to my stream! Let's have some fun together.",
    isPublic: true,
    allowChat: true,
    recordStream: false,
    quality: "1080p"
  });

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
        setStreamStats(prev => ({
          ...prev,
          isLive: true,
          viewers: Math.floor(Math.random() * 20) + 15,
          duration: formatDuration(streamDuration),
          bitrate: `${Math.floor(Math.random() * 1000) + 2000} kbps`
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamDuration]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    setStreamDuration(0);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setStreamStats(prev => ({
      ...prev,
      isLive: false,
      viewers: 0,
      duration: "00:00:00",
      bitrate: "0 kbps"
    }));
  };

  const handleSettingsChange = (key: keyof StreamSettings, value: any) => {
    setStreamSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const recentStreams = [
    { id: 1, title: "Gaming Session #42", date: "2024-01-15", duration: "2h 34m", views: 156 },
    { id: 2, title: "Q&A with Viewers", date: "2024-01-12", duration: "1h 45m", views: 89 },
    { id: 3, title: "Tutorial: Web Development", date: "2024-01-10", duration: "3h 12m", views: 234 },
    { id: 4, title: "Music Production Live", date: "2024-01-08", duration: "2h 01m", views: 67 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Stream Dashboard</h1>
            <p className="text-slate-300">Manage your live streams and analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share Stream
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stream Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Live Viewers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{streamStats.viewers}</div>
              <p className="text-xs text-slate-400">Peak: {streamStats.peakViewers}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Stream Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{streamStats.duration}</div>
              <p className="text-xs text-slate-400">Current session</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{streamStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-slate-400">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Stream Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{streamStats.streamHealth}%</div>
              <Progress value={streamStats.streamHealth} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stream Controls */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Stream Controls
                  {streamStats.isLive && (
                    <Badge variant="destructive" className="ml-3 bg-red-500">
                      LIVE
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your live stream broadcast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stream Actions */}
                <div className="flex flex-wrap gap-3">
                  {!isStreaming ? (
                    <Button 
                      onClick={handleStartStream}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Stream
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStopStream}
                      variant="destructive"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Stream
                    </Button>
                  )}
                  
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Mic className="w-4 h-4 mr-2" />
                    Mute Audio
                  </Button>
                  
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <VideoOff className="w-4 h-4 mr-2" />
                    Disable Video
                  </Button>
                </div>

                {/* Stream Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-400">Quality</p>
                    <p className="text-sm font-medium text-white">{streamStats.quality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Bitrate</p>
                    <p className="text-sm font-medium text-white">{streamStats.bitrate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="text-sm font-medium text-white">
                      {streamStats.isLive ? "Broadcasting" : "Offline"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Connection</p>
                    <p className="text-sm font-medium text-green-400">Stable</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Settings */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Stream Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure your stream preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-900/50">
                    <TabsTrigger value="general" className="text-slate-300">General</TabsTrigger>
                    <TabsTrigger value="quality" className="text-slate-300">Quality</TabsTrigger>
                    <TabsTrigger value="privacy" className="text-slate-300">Privacy</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">Stream Title</Label>
                      <Input
                        id="title"
                        value={streamSettings.title}
                        onChange={(e) => handleSettingsChange('title', e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-slate-300">Description</Label>
                      <Textarea
                        id="description"
                        value={streamSettings.description}
                        onChange={(e) => handleSettingsChange('description', e.target.value)}
                        className="bg-slate-900/50 border-slate-600 text-white mt-1"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quality" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="quality" className="text-slate-300">Video Quality</Label>
                      <select
                        id="quality"
                        value={streamSettings.quality}
                        onChange={(e) => handleSettingsChange('quality', e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-900/50 border border-slate-600 rounded-md text-white"
                      >
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p Full HD</option>
                        <option value="1440p">1440p 2K</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="record" className="text-slate-300">Record Stream</Label>
                      <Switch
                        id="record"
                        checked={streamSettings.recordStream}
                        onCheckedChange={(checked) => handleSettingsChange('recordStream', checked)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="privacy" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Public Stream</Label>
                        <p className="text-xs text-slate-400">Allow anyone to discover your stream</p>
                      </div>
                      <Switch
                        checked={streamSettings.isPublic}
                        onCheckedChange={(checked) => handleSettingsChange('isPublic', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Enable Chat</Label>
                        <p className="text-xs text-slate-400">Allow viewers to chat during stream</p>
                      </div>
                      <Switch
                        checked={streamSettings.allowChat}
                        onCheckedChange={(checked) => handleSettingsChange('allowChat', checked)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Streams */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Streams
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your streaming history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStreams.map((stream) => (
                    <div key={stream.id} className="p-3 bg-slate-900/50 rounded-lg">
                      <h4 className="font-medium text-white text-sm">{stream.title}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-slate-400">{stream.date}</span>
                        <span className="text-xs text-slate-400">{stream.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-purple-400">{stream.views} views</span>
                        <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}