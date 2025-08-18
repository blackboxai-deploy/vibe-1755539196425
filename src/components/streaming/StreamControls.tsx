"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Square, 
  Pause, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Monitor,
  Users,
  Clock,
  Signal,
  Camera,
  Volume2,
  VolumeX
} from 'lucide-react';

interface StreamControlsProps {
  isStreaming: boolean;
  isPaused: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  viewerCount: number;
  streamDuration: string;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  onStartStream: () => void;
  onStopStream: () => void;
  onPauseStream: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onQualityChange: (quality: string) => void;
  onVolumeChange: (volume: number) => void;
}

export default function StreamControls({
  isStreaming,
  isPaused,
  isVideoEnabled,
  isAudioEnabled,
  viewerCount,
  streamDuration,
  connectionQuality,
  onStartStream,
  onStopStream,
  onPauseStream,
  onToggleVideo,
  onToggleAudio,
  onQualityChange,
  onVolumeChange
}: StreamControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [autoAdjustQuality, setAutoAdjustQuality] = useState(true);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    setVolume(newVolume);
    onVolumeChange(newVolume[0]);
  }, [onVolumeChange]);

  const handleQualityChange = useCallback((quality: string) => {
    setSelectedQuality(quality);
    onQualityChange(quality);
  }, [onQualityChange]);

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionBars = (quality: string) => {
    switch (quality) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-6">
        {/* Stream Status Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge 
              variant={isStreaming ? "default" : "secondary"}
              className={`${isStreaming ? 'bg-red-500 hover:bg-red-600' : ''} flex items-center space-x-1`}
            >
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
              <span>{isStreaming ? (isPaused ? 'PAUSED' : 'LIVE') : 'OFFLINE'}</span>
            </Badge>
            
            {isStreaming && (
              <>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{viewerCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{streamDuration}</span>
                </div>
                
                <div className={`flex items-center space-x-1 text-sm ${getConnectionColor(connectionQuality)}`}>
                  <Signal className="w-4 h-4" />
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`w-1 h-3 ${
                          bar <= getConnectionBars(connectionQuality) 
                            ? 'bg-current' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="capitalize">{connectionQuality}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isStreaming ? (
            <Button 
              onClick={onStartStream}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Stream
            </Button>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                onClick={onPauseStream}
                variant="outline"
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button 
                onClick={onStopStream}
                variant="destructive"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Stream
              </Button>
            </div>
          )}
        </div>

        {/* Media Controls */}
        <div className="flex items-center justify-center space-x-6">
          <Button
            onClick={onToggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            className="flex items-center space-x-2"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            <span>{isVideoEnabled ? 'Video On' : 'Video Off'}</span>
          </Button>

          <Button
            onClick={onToggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            className="flex items-center space-x-2"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span>{isAudioEnabled ? 'Audio On' : 'Audio Off'}</span>
          </Button>

          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Quality */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Video Quality</span>
                </Label>
                <Select value={selectedQuality} onValueChange={handleQualityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (Standard)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="1440p">1440p (2K)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={autoAdjustQuality}
                    onCheckedChange={setAutoAdjustQuality}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Auto-adjust quality based on connection
                  </Label>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Audio Level</span>
                </Label>
                <div className="flex items-center space-x-3">
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                </div>
              </div>

              {/* Camera Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Camera Source</span>
                </Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Camera</SelectItem>
                    <SelectItem value="external">External Camera</SelectItem>
                    <SelectItem value="webcam">Built-in Webcam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stream Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Stream Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm text-muted-foreground">
                      Enable chat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm text-muted-foreground">
                      Record stream
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label className="text-sm text-muted-foreground">
                      Subscriber-only mode
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Stats */}
        {isStreaming && (
          <>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{viewerCount}</div>
                <div className="text-xs text-muted-foreground">Current Viewers</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{streamDuration}</div>
                <div className="text-xs text-muted-foreground">Stream Duration</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{selectedQuality}</div>
                <div className="text-xs text-muted-foreground">Video Quality</div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-bold capitalize ${getConnectionColor(connectionQuality)}`}>
                  {connectionQuality}
                </div>
                <div className="text-xs text-muted-foreground">Connection</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}