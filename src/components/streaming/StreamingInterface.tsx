"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Monitor,
  Smartphone,
  Maximize,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Wifi,
  WifiOff,
  Clock,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StreamSettings {
  resolution: '720p' | '1080p' | '480p';
  frameRate: number;
  bitrate: number;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface StreamStats {
  viewers: number;
  duration: string;
  quality: 'excellent' | 'good' | 'poor';
  bitrate: number;
}

export default function StreamingInterface() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [streamTitle, setStreamTitle] = useState('My Live Stream');
  const [streamDescription, setStreamDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  
  const { toast } = useToast();

  const [settings, setSettings] = useState<StreamSettings>({
    resolution: '1080p',
    frameRate: 30,
    bitrate: 2500,
    audioEnabled: true,
    videoEnabled: true
  });

  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    duration: '00:00:00',
    quality: 'excellent',
    bitrate: 0
  });

  // Initialize camera and microphone
  const initializeMedia = async () => {
    try {
      const constraints = {
        video: {
          width: settings.resolution === '1080p' ? 1920 : settings.resolution === '720p' ? 1280 : 854,
          height: settings.resolution === '1080p' ? 1080 : settings.resolution === '720p' ? 720 : 480,
          frameRate: settings.frameRate
        },
        audio: settings.audioEnabled
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
      toast({
        title: "Camera Connected",
        description: "Successfully connected to camera and microphone",
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Connection Failed",
        description: "Could not access camera or microphone",
        variant: "destructive",
      });
    }
  };

  // Start streaming
  const startStream = async () => {
    if (!streamRef.current) {
      await initializeMedia();
    }
    
    if (streamRef.current) {
      setIsStreaming(true);
      startTimeRef.current = new Date();
      
      // Simulate viewer count increase
      const viewerInterval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          viewers: prev.viewers + Math.floor(Math.random() * 3)
        }));
      }, 5000);

      toast({
        title: "Stream Started",
        description: "You are now live!",
      });
    }
  };

  // Stop streaming
  const stopStream = () => {
    setIsStreaming(false);
    startTimeRef.current = null;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsConnected(false);
    setStats(prev => ({ ...prev, viewers: 0, duration: '00:00:00' }));
    
    toast({
      title: "Stream Ended",
      description: "Your stream has been stopped",
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Update stream duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStreaming && startTimeRef.current) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - startTimeRef.current!.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setStats(prev => ({
          ...prev,
          duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming]);

  // Initialize on component mount
  useEffect(() => {
    initializeMedia();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Live Streaming Studio</h1>
            <p className="text-gray-400">Broadcast yourself to the world</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant={isStreaming ? "default" : "secondary"} className="px-3 py-1">
              {isStreaming ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                  LIVE
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
                  OFFLINE
                </>
              )}
            </Badge>
            
            <Badge variant="outline" className="text-white border-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {stats.viewers} viewers
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20">
                    {/* Connection Status */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      {isConnected ? (
                        <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded text-white text-sm">
                          <Wifi className="w-4 h-4" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-white text-sm">
                          <WifiOff className="w-4 h-4" />
                          <span>Disconnected</span>
                        </div>
                      )}
                    </div>

                    {/* Stream Info */}
                    {isStreaming && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-2 rounded text-white">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{stats.duration}</span>
                        </div>
                      </div>
                    )}

                    {/* Center Controls */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!isStreaming && (
                        <Button
                          onClick={startStream}
                          size="lg"
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
                        >
                          <Play className="w-6 h-6 mr-2" />
                          Start Streaming
                        </Button>
                      )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={toggleAudio}
                          className={isMuted ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={toggleVideo}
                          className={isVideoOff ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isStreaming && (
                          <Button
                            onClick={stopStream}
                            variant="destructive"
                            size="sm"
                          >
                            <Square className="w-4 h-4 mr-1" />
                            Stop
                          </Button>
                        )}
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowSettings(!showSettings)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Stream Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Stream Title</Label>
                  <Input
                    id="title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter stream title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Describe your stream..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stream Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Stream Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Viewers</span>
                  <Badge variant="secondary">{stats.viewers}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white font-mono">{stats.duration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getQualityColor(stats.quality)}`} />
                    <span className="text-white capitalize">{stats.quality}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Bitrate</span>
                  <span className="text-white">{settings.bitrate} kbps</span>
                </div>
              </CardContent>
            </Card>

            {/* Settings Panel */}
            {showSettings && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Stream Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Resolution</Label>
                    <select
                      value={settings.resolution}
                      onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value as any }))}
                      className="w-full mt-1 bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Frame Rate: {settings.frameRate} fps</Label>
                    <Slider
                      value={[settings.frameRate]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, frameRate: value[0] }))}
                      max={60}
                      min={15}
                      step={15}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Bitrate: {settings.bitrate} kbps</Label>
                    <Slider
                      value={[settings.bitrate]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, bitrate: value[0] }))}
                      max={5000}
                      min={500}
                      step={250}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Audio Enabled</Label>
                    <Switch
                      checked={settings.audioEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, audioEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Video Enabled</Label>
                    <Switch
                      checked={settings.videoEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, videoEnabled: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                  <Monitor className="w-4 h-4 mr-2" />
                  Share Screen
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Switch Camera
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-white border-gray-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}