"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  Eye, 
  TrendingUp, 
  Signal, 
  Heart,
  MessageCircle,
  Share2,
  Download,
  Calendar
} from 'lucide-react';

interface AnalyticsProps {
  streamId?: string;
  isLive?: boolean;
}

interface StreamMetrics {
  currentViewers: number;
  totalViews: number;
  streamDuration: string;
  peakViewers: number;
  chatMessages: number;
  likes: number;
  shares: number;
  connectionQuality: number;
  bitrate: string;
  resolution: string;
  fps: number;
}

interface ViewerData {
  timestamp: string;
  viewers: number;
}

export default function Analytics({ streamId, isLive = false }: AnalyticsProps) {
  // Mock data - in real app, this would come from API
  const metrics: StreamMetrics = {
    currentViewers: isLive ? 1247 : 0,
    totalViews: 15420,
    streamDuration: isLive ? "2h 34m" : "3h 12m",
    peakViewers: 2156,
    chatMessages: 8934,
    likes: 892,
    shares: 156,
    connectionQuality: 95,
    bitrate: "3.5 Mbps",
    resolution: "1080p",
    fps: 60
  };

  const viewerHistory: ViewerData[] = [
    { timestamp: "00:00", viewers: 45 },
    { timestamp: "00:30", viewers: 123 },
    { timestamp: "01:00", viewers: 456 },
    { timestamp: "01:30", viewers: 789 },
    { timestamp: "02:00", viewers: 1247 },
    { timestamp: "02:30", viewers: 1156 }
  ];

  const recentStreams = [
    { date: "2024-01-15", title: "Gaming Session #42", viewers: 1834, duration: "4h 23m" },
    { date: "2024-01-14", title: "Q&A with Viewers", viewers: 967, duration: "1h 45m" },
    { date: "2024-01-13", title: "Tutorial: Web Development", viewers: 2341, duration: "3h 12m" },
    { date: "2024-01-12", title: "Music Production Live", viewers: 1456, duration: "2h 56m" }
  ];

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return "text-green-500";
    if (quality >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 90) return "Excellent";
    if (quality >= 70) return "Good";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      {/* Live Status Banner */}
      {isLive && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
              <span className="font-semibold text-red-700 dark:text-red-300">LIVE NOW</span>
              <Badge variant="secondary" className="ml-auto">
                {metrics.streamDuration}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isLive ? "Current Viewers" : "Total Views"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLive ? metrics.currentViewers.toLocaleString() : metrics.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLive ? `Peak: ${metrics.peakViewers.toLocaleString()}` : "All time views"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.streamDuration}</div>
            <p className="text-xs text-muted-foreground">
              {isLive ? "Current session" : "Last stream"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.likes}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.chatMessages} chat messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Quality</CardTitle>
            <Signal className={`h-4 w-4 ${getQualityColor(metrics.connectionQuality)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.connectionQuality}%</div>
            <p className={`text-xs ${getQualityColor(metrics.connectionQuality)}`}>
              {getQualityLabel(metrics.connectionQuality)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Viewer Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Viewer Activity</CardTitle>
              <CardDescription>
                {isLive ? "Real-time viewer count" : "Viewer count over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viewerHistory.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-muted-foreground">
                      {data.timestamp}
                    </div>
                    <div className="flex-1">
                      <Progress 
                        value={(data.viewers / Math.max(...viewerHistory.map(d => d.viewers))) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="w-16 text-sm font-medium text-right">
                      {data.viewers}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat Activity</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.chatMessages}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(metrics.chatMessages / (parseInt(metrics.streamDuration) || 1))} per minute
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.likes}</div>
                <p className="text-xs text-muted-foreground">
                  {((metrics.likes / metrics.totalViews) * 100).toFixed(1)}% like rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shares</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.shares}</div>
                <p className="text-xs text-muted-foreground">
                  {((metrics.shares / metrics.totalViews) * 100).toFixed(1)}% share rate
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Stream Quality</CardTitle>
                <CardDescription>Current technical specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Resolution</span>
                  <Badge variant="outline">{metrics.resolution}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Frame Rate</span>
                  <Badge variant="outline">{metrics.fps} FPS</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bitrate</span>
                  <Badge variant="outline">{metrics.bitrate}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Connection Quality</span>
                    <span className={`text-sm font-medium ${getQualityColor(metrics.connectionQuality)}`}>
                      {metrics.connectionQuality}%
                    </span>
                  </div>
                  <Progress value={metrics.connectionQuality} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Stream health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Network Upload</span>
                    <span className="text-sm font-medium">3.2 MB/s</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dropped Frames</span>
                  <Badge variant="outline" className="text-green-600">0.1%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Streams</CardTitle>
              <CardDescription>Your streaming history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{stream.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {stream.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stream.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {stream.viewers.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {stream.viewers > 2000 ? "High" : stream.viewers > 1000 ? "Medium" : "Low"} Performance
                      </Badge>
                      <button className="p-2 hover:bg-muted rounded-md">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}